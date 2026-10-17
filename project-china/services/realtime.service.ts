"use client";

import { io, type Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_ORIGIN || "http://localhost:5000";

let socket: Socket | null = null;

export type RealtimeEvents = {
  "notification:new": unknown;
  "notification:read": { notificationId: string };
  "notification:read-all": { userId: string };
  "order:status-updated": unknown;
  "order:cancelled": unknown;
  "ticket:created": unknown;
  "ticket:reply": { ticketId: string; message: unknown; ticketStatus?: string };
  "ticket:closed": { ticketId: string; status?: string };
  "ticket:typing": { ticketId: string; userId: string; isTyping: boolean };
  "chat:room-created": unknown;
  "chat:message": unknown;
  "chat:typing": { roomId: string; userId: string; isTyping: boolean };
  "chat:seen": { roomId: string; seenById: string };
  "chat:closed": unknown;
  "presence:update": { userId: string; isOnline: boolean };
};

export const RealtimeService = {
  connect: (accessToken?: string) => {
    if (socket?.connected) {
      return socket;
    }

    socket = io(SOCKET_URL, {
      withCredentials: true,
      auth: {
        token: accessToken || "",
      },
      transports: ["websocket", "polling"],
    });

    return socket;
  },

  disconnect: () => {
    socket?.disconnect();
    socket = null;
  },

  getSocket: () => socket,

  on: <K extends keyof RealtimeEvents>(eventName: K, handler: (payload: RealtimeEvents[K]) => void) => {
    socket?.on(eventName as string, handler as (...args: unknown[]) => void);
  },

  off: <K extends keyof RealtimeEvents>(eventName: K, handler?: (payload: RealtimeEvents[K]) => void) => {
    socket?.off(eventName as string, handler as (...args: unknown[]) => void);
  },

  joinChat: (roomId: string) => {
    socket?.emit("chat:join", roomId);
  },

  leaveChat: (roomId: string) => {
    socket?.emit("chat:leave", roomId);
  },

  sendTyping: (roomId: string, isTyping: boolean) => {
    socket?.emit("chat:typing", { roomId, isTyping });
  },

  checkPresence: (userIds: string[], callback: (res: Record<string, boolean>) => void) => {
    socket?.emit("presence:check", userIds, callback);
  },

  isConnected: () => Boolean(socket?.connected),

  onConnect: (cb: () => void) => {
    socket?.on("connect", cb);
    if (socket?.connected) cb();
  },

  onDisconnect: (cb: () => void) => {
    socket?.on("disconnect", cb);
  },

  joinOrder: (orderId: string) => {
    socket?.emit("order:join", orderId);
  },

  leaveOrder: (orderId: string) => {
    socket?.emit("order:leave", orderId);
  },

  joinTicket: (ticketId: string) => {
    socket?.emit("ticket:join", ticketId);
  },

  leaveTicket: (ticketId: string) => {
    socket?.emit("ticket:leave", ticketId);
  },

  sendTicketTyping: (ticketId: string, isTyping: boolean) => {
    socket?.emit("ticket:typing", { ticketId, isTyping });
  },
};
