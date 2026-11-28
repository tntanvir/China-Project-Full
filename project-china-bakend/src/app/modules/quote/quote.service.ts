import { QuoteStatus, UserRole } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { prisma } from "../../shared/prisma";
import { mergePricingConfig, QUOTE_PRICING_SETTING_KEY, type QuotePricingConfig } from "../../shared/pricingConfig";
import { NotificationService } from "../notification/notification.service";

type QuotePayload = {
    name: string;
    width: number;
    height: number;
    quantity: number;
    layerCount: number;
    materialType: string;
    boardThickness: number;
    copperWeight: number;
    surfaceFinish: string;
    solderMaskColor: string;
    silkscreenColor: string;
};

type Actor = {
    id: string;
    role: UserRole;
};

const getPricingConfig = async (): Promise<QuotePricingConfig> => {
    const row = await prisma.systemSetting.findUnique({
        where: { key: QUOTE_PRICING_SETTING_KEY },
    });
    return mergePricingConfig(row?.value);
};

const calculateQuotePrice = (payload: QuotePayload, config: QuotePricingConfig) => {
    const areaDm2 = (payload.width * payload.height) / 10000;
    const layers = Math.max(payload.layerCount || 2, 1);
    const qty = Math.max(payload.quantity || 5, 1);
    const matLower = payload.materialType.toLowerCase();
    const finishLower = payload.surfaceFinish.toLowerCase();

    if (
        config.promoEnabled &&
        layers <= 2 &&
        areaDm2 <= config.promoMaxAreaDm2 &&
        qty <= config.promoMaxQty &&
        !finishLower.includes("enig") &&
        !finishLower.includes("gold") &&
        !finishLower.includes("silver") &&
        !matLower.includes("rogers") &&
        !matLower.includes("aluminum") &&
        !matLower.includes("hdi")
    ) {
        return Number((config.promoPrice + config.scaling.engineeringFee + config.scaling.eTestFee).toFixed(2));
    }

    let base =
        layers === 1
            ? config.layerPrices.layer1
            : layers === 2
              ? config.layerPrices.layer2
              : layers <= 4
                ? config.layerPrices.layer4
                : layers <= 6
                  ? config.layerPrices.layer6
                  : layers <= 8
                    ? config.layerPrices.layer8Plus
                    : config.layerPrices.layer10Plus;

    if (finishLower.includes("enig")) base += config.finishFees.ENIG;
    else if (finishLower.includes("gold")) base += config.finishFees["Hard Gold"];
    else if (finishLower.includes("silver")) base += config.finishFees["Immersion Silver"];
    else if (finishLower.includes("lead") && !finishLower.includes("free")) base += config.finishFees["HASL-LEAD"];
    else base += config.finishFees.HASL;

    if (matLower.includes("rogers")) base += config.materialFees.Rogers;
    else if (matLower.includes("aluminum")) base += config.materialFees.Aluminum;
    else if (matLower.includes("hdi")) base += config.materialFees.HDI;
    else base += config.materialFees.FR4;

    const areaFactor = Math.max(0, areaDm2 - 1.0) * (layers * config.scaling.areaRatePerDm2PerLayer);
    const qtyFactor = Math.max(0, qty - 5) * (config.scaling.qtyBaseUnitFee + layers * config.scaling.qtyPerLayerFee);
    const thicknessFee = payload.boardThickness > 1.6 ? config.scaling.thicknessOver16Fee : 0;
    const copperMultiplier = Math.max(payload.copperWeight || 1, 1);

    const total = Math.max(
        config.minOrderPrice,
        (base + areaFactor + qtyFactor) * (copperMultiplier > 1 ? 1 + (copperMultiplier - 1) * 0.25 : 1) +
            thicknessFee +
            config.scaling.engineeringFee +
            config.scaling.eTestFee,
    );

    return Number(total.toFixed(2));
};

const createQuote = async (userId: string, payload: QuotePayload) => {
    const pricingConfig = await getPricingConfig();
    const calculatedPrice = calculateQuotePrice(payload, pricingConfig);

    const quote = await prisma.quote.create({
        data: {
            userId,
            ...payload,
            calculatedPrice,
            status: QuoteStatus.SAVED,
        },
        include: { gerberFiles: true },
    });

    // 1. Notify Customer
    await NotificationService.createNotification({
        userId,
        title: "PCB Quote Generated",
        message: `Your quote "${quote.name}" has been generated ($${quote.calculatedPrice.toFixed(2)}). Our CAM team is reviewing specs.`,
        type: "SUCCESS",
        link: `/quotes/${quote.id}`,
    });

    // 2. Notify Admins & Super Admins
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true },
    });
    const customerName = user?.name || user?.email || "Customer";

    await NotificationService.notifyAdminsAndSuperAdmins({
        title: "New PCB Quote Request",
        message: `${customerName} generated quote "${quote.name}" for $${quote.calculatedPrice.toFixed(2)}.`,
        type: "INFO",
        link: `/admin/quotes`,
        excludeUserId: userId,
    });

    return quote;
};

const getMyQuotes = async (userId: string) => {
    return prisma.quote.findMany({
        where: { userId },
        include: { gerberFiles: true, orders: true },
        orderBy: { createdAt: "desc" },
    });
};

const getAllQuotes = async () => {
    return prisma.quote.findMany({
        include: {
            user: { select: { id: true, name: true, email: true, companyName: true } },
            gerberFiles: true,
            orders: true,
        },
        orderBy: { createdAt: "desc" },
    });
};

const getQuoteById = async (quoteId: string, actor: Actor) => {
    const quote = await prisma.quote.findUnique({
        where: { id: quoteId },
        include: {
            user: { select: { id: true, name: true, email: true, companyName: true } },
            gerberFiles: true,
            orders: true,
        },
    });

    if (!quote) {
        throw new ApiError(httpStatus.NOT_FOUND, "Quote not found.");
    }

    const isPrivileged = actor.role === UserRole.ADMIN || actor.role === UserRole.SUPER_ADMIN;
    if (!isPrivileged && quote.userId !== actor.id) {
        throw new ApiError(httpStatus.FORBIDDEN, "You cannot access another customer's quote.");
    }

    return quote;
};

const approveQuote = async (quoteId: string, actor: Actor, payload?: { note?: string; customPrice?: number }) => {
    const quote = await prisma.quote.findUnique({
        where: { id: quoteId },
        include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (!quote) {
        throw new ApiError(httpStatus.NOT_FOUND, "Quote not found.");
    }

    const updated = await prisma.quote.update({
        where: { id: quoteId },
        data: {
            status: QuoteStatus.SAVED,
            calculatedPrice: payload?.customPrice ?? quote.calculatedPrice,
        },
    });

    // Notify Customer!
    await NotificationService.createNotification({
        userId: quote.userId,
        title: "PCB Quote Approved",
        message: payload?.note || `Your quote "${quote.name}" has been approved by CAM Engineering ($${updated.calculatedPrice.toFixed(2)}). You can convert it to an order now.`,
        type: "SUCCESS",
        link: `/quotes/${quote.id}`,
    });

    // Notify other Admins
    await NotificationService.notifyAdminsAndSuperAdmins({
        title: "Quote Approved",
        message: `Quote "${quote.name}" was approved for customer ${quote.user?.name || quote.user?.email} ($${updated.calculatedPrice.toFixed(2)}).`,
        type: "INFO",
        link: `/admin/quotes`,
        excludeUserId: actor.id,
    });

    return updated;
};

const rejectQuote = async (quoteId: string, actor: Actor, payload?: { reason?: string }) => {
    const quote = await prisma.quote.findUnique({
        where: { id: quoteId },
        include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (!quote) {
        throw new ApiError(httpStatus.NOT_FOUND, "Quote not found.");
    }

    // Notify Customer with reason
    await NotificationService.createNotification({
        userId: quote.userId,
        title: "PCB Quote Revision Required",
        message: payload?.reason || `Engineering review requires adjustments for quote "${quote.name}". Please check layer tolerances or contact CAM chat.`,
        type: "WARNING",
        link: `/quotes/${quote.id}`,
    });

    return quote;
};

const convertQuoteToOrder = async (
    quoteId: string,
    userId: string,
    payload: { shippingAddress: string; billingAddress?: string },
) => {
    const quote = await prisma.quote.findUnique({ where: { id: quoteId } });

    if (!quote) {
        throw new ApiError(httpStatus.NOT_FOUND, "Quote not found.");
    }

    if (quote.userId !== userId) {
        throw new ApiError(httpStatus.FORBIDDEN, "You cannot convert another customer's quote.");
    }

    const order = await prisma.$transaction(async (tx) => {
        const newOrder = await tx.order.create({
            data: {
                userId,
                quoteId: quote.id,
                totalAmount: quote.calculatedPrice,
                shippingAddress: payload.shippingAddress,
                billingAddress: payload.billingAddress || payload.shippingAddress,
            },
        });

        await tx.quote.update({
            where: { id: quote.id },
            data: { status: QuoteStatus.ORDERED },
        });

        return newOrder;
    });

    await NotificationService.createNotification({
        userId,
        title: "Quote Converted to Order",
        message: `Quote "${quote.name}" has been converted to order #${order.id.slice(0, 8).toUpperCase()}.`,
        type: "SUCCESS",
        link: `/orders/${order.id}`,
    });

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true },
    });

    await NotificationService.notifyAdminsAndSuperAdmins({
        title: "New Order From Quote",
        message: `${user?.name || "Customer"} converted quote "${quote.name}" to order #${order.id.slice(0, 8).toUpperCase()} ($${quote.calculatedPrice.toFixed(2)}).`,
        type: "SUCCESS",
        link: `/admin/orders`,
        excludeUserId: userId,
    });

    return order;
};

export const QuoteService = {
    getPricingConfig,
    calculateQuotePrice,
    createQuote,
    getMyQuotes,
    getAllQuotes,
    getQuoteById,
    approveQuote,
    rejectQuote,
    convertQuoteToOrder,
};
