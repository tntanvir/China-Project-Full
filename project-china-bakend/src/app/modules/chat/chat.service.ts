import { ChatRoomStatus, UserRole } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { prisma } from "../../shared/prisma";
import { socketManager } from "../../shared/socket";
import { NotificationService } from "../notification/notification.service";

type Actor = {
    id: string;
    role: UserRole;
};

const canAccessRoom = (room: { customerId: string; adminId: string | null }, actor: Actor) => {
    return actor.role === UserRole.SUPER_ADMIN || room.customerId === actor.id || room.adminId === actor.id || actor.role === UserRole.ADMIN;
};

const createRoom = async (actor: Actor, payload: { subject?: string; adminId?: string }) => {
    const room = await prisma.chatRoom.create({
        data: {
            customerId: actor.role === UserRole.CUSTOMER ? actor.id : payload.adminId || actor.id,
            adminId: actor.role === UserRole.ADMIN || actor.role === UserRole.SUPER_ADMIN ? actor.id : payload.adminId,
            subject: payload.subject,
        },
        include: {
            customer: { select: { id: true, name: true, email: true, role: true } },
            admin: { select: { id: true, name: true, email: true, role: true } },
            messages: true,
        },
    });

    socketManager.emitToUser(room.customerId, "chat:room-created", room);
    socketManager.emitToAdmins("chat:room-created", room);
    if (room.adminId) {
        socketManager.emitToUser(room.adminId, "chat:room-created", room);
    }

    const creatorName = room.customer?.name || room.customer?.email || "Customer";
    await NotificationService.notifyAdminsAndSuperAdmins({
        title: "New Live Engineering Chat",
        message: `${creatorName} opened live CAM channel: "${room.subject || "CAM PCB Consultation"}".`,
        type: "MESSAGE",
        link: `/admin/chat`,
        excludeUserId: actor.id,
    });

    return room;
};

const getMyRooms = async (actor: Actor) => {
    return prisma.chatRoom.findMany({
        where:
            actor.role === UserRole.CUSTOMER
                ? { customerId: actor.id }
                : actor.role === UserRole.ADMIN
                  ? { OR: [{ adminId: actor.id }, { adminId: null }] }
                  : {},
        include: {
            customer: { select: { id: true, name: true, email: true, role: true } },
            admin: { select: { id: true, name: true, email: true, role: true } },
            messages: { orderBy: { createdAt: "desc" }, take: 1 },
        },
        orderBy: { updatedAt: "desc" },
    });
};

const getRoomById = async (roomId: string, actor: Actor) => {
    const room = await prisma.chatRoom.findUnique({
        where: { id: roomId },
        include: {
            customer: { select: { id: true, name: true, email: true, role: true } },
            admin: { select: { id: true, name: true, email: true, role: true } },
            messages: {
                include: { sender: { select: { id: true, name: true, role: true } } },
                orderBy: { createdAt: "asc" },
            },
        },
    });

    if (!room) {
        throw new ApiError(httpStatus.NOT_FOUND, "Chat room not found.");
    }

    if (!canAccessRoom(room, actor)) {
        throw new ApiError(httpStatus.FORBIDDEN, "You cannot access this chat room.");
    }

    return room;
};

const sendMessage = async (roomId: string, actor: Actor, payload: { message?: string; files?: string[] }) => {
    const room = await prisma.chatRoom.findUnique({ where: { id: roomId } });

    if (!room) {
        throw new ApiError(httpStatus.NOT_FOUND, "Chat room not found.");
    }

    if (!canAccessRoom(room, actor)) {
        throw new ApiError(httpStatus.FORBIDDEN, "You cannot send messages in this chat room.");
    }

    const message = await prisma.$transaction(async (tx) => {
        const createdMessage = await tx.chatMessage.create({
            data: {
                roomId,
                senderId: actor.id,
                message: payload.message,
                files: payload.files || [],
            },
            include: {
                sender: { select: { id: true, name: true, role: true } },
            },
        });

        const shouldAssignAdmin =
            (actor.role === UserRole.ADMIN || actor.role === UserRole.SUPER_ADMIN) && !room.adminId;

        await tx.chatRoom.update({
            where: { id: roomId },
            data: {
                status: ChatRoomStatus.OPEN,
                ...(shouldAssignAdmin ? { adminId: actor.id } : {}),
            },
        });

        return createdMessage;
    });

    socketManager.emitToChatRoom(roomId, "chat:message", message);
    socketManager.emitToUser(room.customerId, "chat:message", message);
    if (room.adminId) {
        socketManager.emitToUser(room.adminId, "chat:message", message);
    }

    if (actor.id === room.customerId) {
        // Customer sent message -> broadcast to all admins so live dashboard stays synced
        socketManager.emitToAdmins("chat:message", message);

        if (room.adminId) {
            await NotificationService.createNotification({
                userId: room.adminId,
                title: "Live CAM Chat Message",
                message: payload.message || "Customer sent a file/message in chat.",
                type: "MESSAGE",
                link: `/admin/chat`,
            });
        } else {
            await NotificationService.notifyAdminsAndSuperAdmins({
                title: "Live CAM Chat Message",
                message: payload.message || "Customer sent a message in live engineering chat.",
                type: "MESSAGE",
                link: `/admin/chat`,
                excludeUserId: actor.id,
            });
        }
    } else {
        // Engineer / Admin sent message -> notify customer
        await NotificationService.createNotification({
            userId: room.customerId,
            title: "CAM Engineer Replied",
            message: payload.message || "CAM Engineering replied to your live consultation.",
            type: "MESSAGE",
            link: `/dashboard/chat`,
        });
    }

    return message;
};

const markSeen = async (roomId: string, actor: Actor) => {
    const room = await prisma.chatRoom.findUnique({ where: { id: roomId } });

    if (!room) {
        throw new ApiError(httpStatus.NOT_FOUND, "Chat room not found.");
    }

    if (!canAccessRoom(room, actor)) {
        throw new ApiError(httpStatus.FORBIDDEN, "You cannot update seen state for this chat room.");
    }

    const result = await prisma.chatMessage.updateMany({
        where: {
            roomId,
            senderId: { not: actor.id },
            isSeen: false,
        },
        data: {
            isSeen: true,
            seenById: actor.id,
            seenAt: new Date(),
        },
    });

    socketManager.emitToChatRoom(roomId, "chat:seen", { roomId, seenById: actor.id });

    return result;
};

const closeRoom = async (roomId: string, actor: Actor) => {
    const room = await prisma.chatRoom.findUnique({ where: { id: roomId } });

    if (!room) {
        throw new ApiError(httpStatus.NOT_FOUND, "Chat room not found.");
    }

    if (!canAccessRoom(room, actor)) {
        throw new ApiError(httpStatus.FORBIDDEN, "You cannot close this chat room.");
    }

    const updatedRoom = await prisma.chatRoom.update({
        where: { id: roomId },
        data: { status: ChatRoomStatus.CLOSED },
    });

    socketManager.emitToChatRoom(roomId, "chat:closed", updatedRoom);

    return updatedRoom;
};

export const ChatService = {
    createRoom,
    getMyRooms,
    getRoomById,
    sendMessage,
    markSeen,
    closeRoom,
};
