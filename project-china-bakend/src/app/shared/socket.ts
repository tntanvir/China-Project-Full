import { Server as HttpServer } from "http";
import { Secret } from "jsonwebtoken";
import { Server as SocketIOServer, Socket } from "socket.io";
import config from "../../config";
import { jwtHelper } from "../helper/jwtHelper";

type SocketUser = {
    id: string;
    email?: string;
    role?: string;
};

type AuthenticatedSocket = Socket & {
    user?: SocketUser;
};

const userRoom = (userId: string) => `user:${userId}`;
const chatRoom = (roomId: string) => `chat:${roomId}`;
const ticketRoom = (ticketId: string) => `ticket:${ticketId}`;
const orderRoom = (orderId: string) => `order:${orderId}`;
export const ADMINS_ROOM = "role:admins";

const parseCookies = (cookieHeader?: string) => {
    if (!cookieHeader) return {};
    const list: Record<string, string> = {};
    cookieHeader.split(";").forEach((cookie) => {
        const parts = cookie.split("=");
        const key = parts[0]?.trim();
        if (key) {
            list[key] = decodeURIComponent(parts.slice(1).join("=").trim());
        }
    });
    return list;
};

class SocketManager {
    private io: SocketIOServer | null = null;
    private onlineUsers: Map<string, Set<string>> = new Map();

    public init(server: HttpServer) {
        const allowedOrigins = [
            config.frontend_url,
            "http://localhost:3000",
            "http://localhost:3001",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:3001",
            "https://wupingfeitian.vercel.app"
        ].filter(Boolean);

        this.io = new SocketIOServer(server, {
            cors: {
                origin: allowedOrigins,
                methods: ["GET", "POST", "PATCH"],
                credentials: true,
            },
        });

        this.io.use((socket: AuthenticatedSocket, next) => {
            try {
                const cookies = parseCookies(socket.handshake.headers.cookie);
                const cookieToken = cookies.accessToken || cookies["accessToken"];
                const headerToken = socket.handshake.headers.authorization?.startsWith("Bearer ")
                    ? socket.handshake.headers.authorization.slice(7)
                    : socket.handshake.headers.authorization;

                const token =
                    socket.handshake.auth?.token ||
                    headerToken ||
                    cookieToken;

                if (!token) {
                    return next(new Error("Authentication token is required."));
                }

                const verified = jwtHelper.verifyToken(token, config.jwt.jwt_secret as Secret);
                const userId = String(verified.id || verified.userId);

                if (!userId) {
                    return next(new Error("Invalid authentication token."));
                }

                socket.user = {
                    id: userId,
                    email: verified.email as string,
                    role: verified.role as string,
                };

                next();
            } catch {
                next(new Error("Invalid or expired authentication token."));
            }
        });

        this.io.on("connection", (socket: AuthenticatedSocket) => {
            if (!socket.user?.id) {
                socket.disconnect(true);
                return;
            }

            this.addOnlineSocket(socket.user.id, socket.id);
            socket.join(userRoom(socket.user.id));

            if (socket.user.role === "ADMIN" || socket.user.role === "SUPER_ADMIN") {
                socket.join(ADMINS_ROOM);
            }

            this.emitPresence(socket.user.id, true);

            socket.on("chat:join", (roomId: string) => {
                socket.join(chatRoom(roomId));
            });

            socket.on("chat:leave", (roomId: string) => {
                socket.leave(chatRoom(roomId));
            });

            socket.on("chat:typing", (payload: { roomId: string; isTyping: boolean }) => {
                socket.to(chatRoom(payload.roomId)).emit("chat:typing", {
                    roomId: payload.roomId,
                    userId: socket.user?.id,
                    isTyping: payload.isTyping,
                });
            });

            // Live Support Ticket Event Handlers
            socket.on("ticket:join", (ticketId: string) => {
                socket.join(ticketRoom(ticketId));
            });

            socket.on("ticket:leave", (ticketId: string) => {
                socket.leave(ticketRoom(ticketId));
            });

            socket.on("ticket:typing", (payload: { ticketId: string; isTyping: boolean }) => {
                socket.to(ticketRoom(payload.ticketId)).emit("ticket:typing", {
                    ticketId: payload.ticketId,
                    userId: socket.user?.id,
                    isTyping: payload.isTyping,
                });
            });

            socket.on("presence:check", (userIds: string[], callback?: (res: Record<string, boolean>) => void) => {
                if (typeof callback === "function" && Array.isArray(userIds)) {
                    const result: Record<string, boolean> = {};
                    for (const uid of userIds) {
                        result[uid] = this.isUserOnline(uid);
                    }
                    callback(result);
                }
            });

            socket.on("order:join", (orderId: string) => {
                socket.join(orderRoom(orderId));
            });

            socket.on("order:leave", (orderId: string) => {
                socket.leave(orderRoom(orderId));
            });

            socket.on("disconnect", () => {
                if (!socket.user?.id) return;
                this.removeOnlineSocket(socket.user.id, socket.id);
                this.emitPresence(socket.user.id, this.isUserOnline(socket.user.id));
            });
        });
    }

    public getIO() {
        return this.io;
    }

    public emitToUser(userId: string, eventName: string, payload: unknown) {
        this.io?.to(userRoom(userId)).emit(eventName, payload);
    }

    public emitToAdmins(eventName: string, payload: unknown) {
        this.io?.to(ADMINS_ROOM).emit(eventName, payload);
    }

    public emitToChatRoom(roomId: string, eventName: string, payload: unknown) {
        this.io?.to(chatRoom(roomId)).emit(eventName, payload);
    }

    public emitToTicket(ticketId: string, eventName: string, payload: unknown) {
        this.io?.to(ticketRoom(ticketId)).emit(eventName, payload);
    }

    public emitToOrder(orderId: string, eventName: string, payload: unknown) {
        this.io?.to(orderRoom(orderId)).emit(eventName, payload);
    }

    public emitPresence(userId: string, isOnline: boolean) {
        this.io?.emit("presence:update", { userId, isOnline });
    }

    public isUserOnline(userId: string) {
        return Boolean(this.onlineUsers.get(userId)?.size);
    }

    private addOnlineSocket(userId: string, socketId: string) {
        const socketSet = this.onlineUsers.get(userId) || new Set<string>();
        socketSet.add(socketId);
        this.onlineUsers.set(userId, socketSet);
    }

    private removeOnlineSocket(userId: string, socketId: string) {
        const socketSet = this.onlineUsers.get(userId);
        if (!socketSet) return;

        socketSet.delete(socketId);
        if (!socketSet.size) {
            this.onlineUsers.delete(userId);
        }
    }
}

export const socketManager = new SocketManager();
