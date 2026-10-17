import { GerberStatus, InquiryPriority, InquiryType, OrderPriority, OrderStatus, UserRole } from "@prisma/client";
import httpStatus from "http-status";
import path from "path";
import bcrypt from "bcryptjs";
import ApiError from "../../errors/ApiError";
import { fileUploader } from "../../helper/fileUploader";
import { prisma } from "../../shared/prisma";
import { NotificationService } from "../notification/notification.service";
import { sendInquiryNotification } from "../../helper/emailSender";

type Actor = {
    id: string;
    role: UserRole;
};

type PublicUploadPayload = {
    fullName?: string;
    email?: string;
    companyName?: string;
    phone?: string;
    boardType?: string;
    description?: string;
    length?: number | string;
    width?: number | string;
    quantity?: number | string;
    layers?: number | string;
    thickness?: number | string;
    material?: string;
    surfaceFinish?: string;
    solderMaskColor?: string;
    totalAmount?: number | string;
};

const allowedExtensions = [".zip", ".rar", ".7z", ".csv", ".xlsx", ".xls", ".txt", ".pdf"];

const parseSafeInt = (value?: number | string) => {
    if (value === undefined || value === null || value === "") return undefined;
    const parsed = parseInt(String(value).replace(/[^0-9.-]/g, ""), 10);
    return isNaN(parsed) ? undefined : parsed;
};

const parseSafeFloat = (value?: number | string) => {
    if (value === undefined || value === null || value === "") return undefined;
    const parsed = parseFloat(String(value).replace(/[^0-9.-]/g, ""));
    return isNaN(parsed) ? undefined : parsed;
};

const assertAllowedFile = (file: Express.Multer.File) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(extension)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Only Gerber ZIP/RAR/7Z, BOM CSV/XLSX/XLS/TXT/PDF files are allowed.");
    }
};

const uploadGerberAssets = async (files: Express.Multer.File[]) => {
    if (!files?.length) {
        return [];
    }

    const uploadedFiles = [];

    for (const file of files) {
        assertAllowedFile(file);
        const uploaded = await fileUploader.uploadToCloudinary(file.path, "gerber-files");
        uploadedFiles.push({
            fileName: file.originalname,
            fileUrl: uploaded.url,
            fileSize: file.size,
        });
    }

    return uploadedFiles;
};

const uploadFiles = async (actor: Actor, files: Express.Multer.File[], quoteId?: string) => {
    if (quoteId) {
        const quote = await prisma.quote.findUnique({ where: { id: quoteId } });
        if (!quote) {
            throw new ApiError(httpStatus.NOT_FOUND, "Quote not found.");
        }
        if (quote.userId !== actor.id && actor.role === UserRole.CUSTOMER) {
            throw new ApiError(httpStatus.FORBIDDEN, "You cannot attach files to another customer's quote.");
        }
    }

    const uploadedFiles = await uploadGerberAssets(files);
    const records = [];

    for (const file of uploadedFiles) {
        records.push(
            await prisma.gerberFile.create({
                data: {
                    userId: actor.id,
                    quoteId,
                    fileName: file.fileName,
                    fileUrl: file.fileUrl,
                    fileSize: file.fileSize,
                    status: GerberStatus.UPLOADED,
                },
            }),
        );
    }

    await NotificationService.createNotification({
        userId: actor.id,
        title: "Gerber Files Uploaded",
        message: `${records.length} CAD/Gerber file(s) uploaded successfully for engineering review.`,
        type: "SUCCESS",
        link: "/gerber-files",
    });

    const uploader = await prisma.user.findUnique({
        where: { id: actor.id },
        select: { name: true, email: true },
    });

    await NotificationService.notifyAdminsAndSuperAdmins({
        title: "New Gerber Files Uploaded",
        message: `${uploader?.name || "Customer"} uploaded ${records.length} Gerber file(s) for CAM verification.`,
        type: "INFO",
        link: "/admin/gerber",
        excludeUserId: actor.id,
    });

    return records;
};

const uploadPublicInquiry = async (files: Express.Multer.File[], payload: PublicUploadPayload) => {
    const uploadedFiles = await uploadGerberAssets(files);
    const fileNames = uploadedFiles.map((file) => `${file.fileName} (${Math.round(file.fileSize / 1024)} KB)`).join(", ");
    const description = [
        payload.description?.trim(),
        fileNames ? `Uploaded files: ${fileNames}` : undefined,
        "Source: Website instant quote & CAM order",
    ]
        .filter(Boolean)
        .join("\n");

    const customerEmail = payload.email?.trim() || "customer@feitianpcb.com";
    const customerName = payload.fullName?.trim() || customerEmail.split("@")[0];

    // 1. Find or create the customer user account
    let user = await prisma.user.findUnique({ where: { email: customerEmail } });
    if (!user) {
        const defaultPassword = await bcrypt.hash("Customer@123456", 10);
        user = await prisma.user.create({
            data: {
                email: customerEmail,
                name: customerName,
                phone: payload.phone?.trim() || undefined,
                companyName: payload.companyName?.trim() || undefined,
                password: defaultPassword,
                role: UserRole.CUSTOMER,
            },
        });
    }

    // 2. Create the Inquiry with all PCB engineering parameters
    const inquiry = await prisma.inquiry.create({
        data: {
            inquiryType: InquiryType.PCB_QUOTE,
            priority: InquiryPriority.HIGH,
            fullName: customerName,
            email: customerEmail,
            companyName: payload.companyName?.trim() || undefined,
            phone: payload.phone?.trim() || undefined,
            boardType: payload.boardType?.trim() || "Custom PCB",
            length: parseSafeFloat(payload.length),
            width: parseSafeFloat(payload.width),
            quantity: parseSafeInt(payload.quantity),
            layers: parseSafeInt(payload.layers),
            thickness: parseSafeFloat(payload.thickness),
            material: payload.material?.trim() || undefined,
            surfaceFinish: payload.surfaceFinish?.trim() || undefined,
            solderMaskColor: payload.solderMaskColor?.trim() || undefined,
            estimatedPrice: parseSafeFloat(payload.totalAmount),
            description,
            fileUrls: uploadedFiles.map((file) => file.fileUrl),
            userId: user.id,
        },
    });

    // 3. Create a real live Order record linked to the Inquiry
    const totalAmount = parseSafeFloat(payload.totalAmount) ?? 17.0;
    const order = await prisma.order.create({
        data: {
            userId: user.id,
            inquiryId: inquiry.id,
            totalAmount,
            status: OrderStatus.PENDING,
            priority: OrderPriority.HIGH,
            shippingAddress: `Factory Direct CAM: ${customerName} (${customerEmail}) - Phone: ${payload.phone?.trim() || "N/A"}`,
            billingAddress: `Factory Direct CAM: ${customerName} (${customerEmail})`,
        },
        include: {
            inquiry: true,
            user: { select: { id: true, name: true, email: true, phone: true } },
        },
    });

    // Link uploaded files as GerberFile records for customer & admin engineering review
    for (const file of uploadedFiles) {
        try {
            await prisma.gerberFile.create({
                data: {
                    userId: user.id,
                    fileName: file.fileName,
                    fileUrl: file.fileUrl,
                    fileSize: file.fileSize,
                    status: GerberStatus.UPLOADED,
                },
            });
        } catch (fileErr) {
            console.warn("Could not create GerberFile record:", fileErr);
        }
    }

    // 4. Create customer notification
    try {
        await NotificationService.createNotification({
            userId: user.id,
            title: "PCB Quote Order Placed",
            message: `Order #${order.id.slice(0, 8).toUpperCase()} received ($${totalAmount.toFixed(2)}). Our CAM team has begun DFM review.`,
            type: "SUCCESS",
            link: `/orders/${order.id}`,
        });

        await NotificationService.notifyAdminsAndSuperAdmins({
            title: "New Public CAM Inquiry & Order",
            message: `New order #${order.id.slice(0, 8).toUpperCase()} ($${totalAmount.toFixed(2)}) from ${customerName} (${customerEmail}).`,
            type: "WARNING",
            link: `/admin/orders`,
        });
    } catch (notifErr) {
        console.error("Failed to create notification:", notifErr);
    }

    // 5. Send email notification
    try {
        await sendInquiryNotification({
            fullName: inquiry.fullName,
            email: inquiry.email,
            companyName: inquiry.companyName || undefined,
            description: inquiry.description || "",
        });
    } catch (error) {
        console.error("Failed to send inquiry email notification:", error);
    }

    return {
        inquiry,
        order,
        files: uploadedFiles,
    };
};

const getMyFiles = async (userId: string) => {
    return prisma.gerberFile.findMany({
        where: { userId },
        include: { quote: true },
        orderBy: { createdAt: "desc" },
    });
};

const getAllFiles = async () => {
    return prisma.gerberFile.findMany({
        include: {
            user: { select: { id: true, name: true, email: true, companyName: true } },
            quote: true,
        },
        orderBy: { createdAt: "desc" },
    });
};

const getFileById = async (gerberId: string, actor: Actor) => {
    const file = await prisma.gerberFile.findUnique({
        where: { id: gerberId },
        include: {
            user: { select: { id: true, name: true, email: true, companyName: true } },
            quote: true,
        },
    });

    if (!file) {
        throw new ApiError(httpStatus.NOT_FOUND, "Gerber file not found.");
    }

    const isPrivileged = actor.role === UserRole.ADMIN || actor.role === UserRole.SUPER_ADMIN;
    if (!isPrivileged && file.userId !== actor.id) {
        throw new ApiError(httpStatus.FORBIDDEN, "You cannot access another customer's Gerber file.");
    }

    return file;
};

const reviewFile = async (gerberId: string, payload: { status: GerberStatus; message?: string }) => {
    const file = await prisma.gerberFile.findUnique({ where: { id: gerberId } });

    if (!file) {
        throw new ApiError(httpStatus.NOT_FOUND, "Gerber file not found.");
    }

    const updatedFile = await prisma.gerberFile.update({
        where: { id: gerberId },
        data: { status: payload.status },
    });

    await NotificationService.createNotification({
        userId: file.userId,
        title: "Gerber review updated",
        message: payload.message || `Your Gerber file ${file.fileName} is now ${payload.status}.`,
        type: payload.status === GerberStatus.APPROVED ? "SUCCESS" : payload.status === GerberStatus.REJECTED ? "ERROR" : "INFO",
        link: `/gerber-files/${file.id}`,
    });

    return updatedFile;
};

const deleteOwnFile = async (gerberId: string, userId: string) => {
    const file = await prisma.gerberFile.findUnique({ where: { id: gerberId } });

    if (!file) {
        throw new ApiError(httpStatus.NOT_FOUND, "Gerber file not found.");
    }

    if (file.userId !== userId) {
        throw new ApiError(httpStatus.FORBIDDEN, "You cannot delete another customer's Gerber file.");
    }

    return prisma.gerberFile.delete({ where: { id: gerberId } });
};

export const GerberService = {
    uploadFiles,
    uploadPublicInquiry,
    getMyFiles,
    getAllFiles,
    getFileById,
    reviewFile,
    deleteOwnFile,
};