import { apiRequest } from "./api-client";

export const ChatService = {
  createRoom: (payload: { subject?: string; adminId?: string }) =>
    apiRequest("/chat/rooms", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getMyRooms: () => apiRequest("/chat/rooms"),

  getRoomById: (roomId: string) => apiRequest(`/chat/rooms/${roomId}`),

  sendMessage: (roomId: string, payload: { message?: string; files?: string[] }) =>
    apiRequest(`/chat/rooms/${roomId}/messages`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  markSeen: (roomId: string) =>
    apiRequest(`/chat/rooms/${roomId}/seen`, {
      method: "PATCH",
    }),

  closeRoom: (roomId: string) =>
    apiRequest(`/chat/rooms/${roomId}/close`, {
      method: "PATCH",
    }),
};
