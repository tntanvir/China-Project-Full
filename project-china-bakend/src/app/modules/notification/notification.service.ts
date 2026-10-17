import { prisma } from "../../shared/prisma";
import { socketManager } from "../../shared/socket";

const createNotification = async (payload: {
    userId: string;
    title: string;
    message: string;
    type?: string;
    link?: string;
}) => {
    const notification = await prisma.notification.create({
        data: {
            userId: payload.userId,
            title: payload.title,
            message: payload.message,
            type: payload.type || "INFO",
            link: payload.link,
        },
    });

    socketManager.emitToUser(payload.userId, "notification:new", notification);

    return notification;
};

const getMyNotifications = async (userId: string) => {
    return prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
};

const markAsRead = async (userId: string, notificationId: string) => {
    const result = await prisma.notification.updateMany({
        where: { id: notificationId, userId },
        data: { isRead: true },
    });

    socketManager.emitToUser(userId, "notification:read", { notificationId });

    return result;
};

const markAllAsRead = async (userId: string) => {
    const result = await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
    });

    socketManager.emitToUser(userId, "notification:read-all", { userId });

    return result;
};

const broadcast = async (payload: { userIds: string[]; title: string; message: string; type?: string; link?: string }) => {
    const notifications = await prisma.$transaction(
        payload.userIds.map((userId) =>
            prisma.notification.create({
                data: {
                    userId,
                    title: payload.title,
                    message: payload.message,
                    type: payload.type || "INFO",
                    link: payload.link,
                },
            }),
        ),
    );

    for (const notification of notifications) {
        socketManager.emitToUser(notification.userId, "notification:new", notification);
    }

    return {
        count: notifications.length,
    };
};

const notifyAdminsAndSuperAdmins = async (payload: {
    title: string;
    message: string;
    type?: string;
    link?: string;
    excludeUserId?: string;
}) => {
    try {
        const admins = await prisma.user.findMany({
            where: {
                role: { in: ["ADMIN", "SUPER_ADMIN"] as any },
                status: "ACTIVE" as any,
                ...(payload.excludeUserId ? { id: { not: payload.excludeUserId } } : {}),
            },
            select: { id: true },
        });

        if (!admins.length) return [];

        const createdNotifications = await prisma.$transaction(
            admins.map((admin) =>
                prisma.notification.create({
                    data: {
                        userId: admin.id,
                        title: payload.title,
                        message: payload.message,
                        type: payload.type || "INFO",
                        link: payload.link,
                    },
                })
            )
        );

        for (const notif of createdNotifications) {
            socketManager.emitToUser(notif.userId, "notification:new", notif);
        }

        return createdNotifications;
    } catch (err) {
        console.error("Failed to notify admins and super admins:", err);
        return [];
    }
};

export const NotificationService = {
    createNotification,
    notifyAdminsAndSuperAdmins,
    getMyNotifications,
    markAsRead,
    markAllAsRead,
    broadcast,
};
