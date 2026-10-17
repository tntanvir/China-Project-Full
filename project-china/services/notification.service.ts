import { apiRequest } from "./api-client";

export const NotificationService = {
  getMyNotifications: () => apiRequest("/notifications"),

  markAsRead: (notificationId: string) =>
    apiRequest(`/notifications/${notificationId}/read`, {
      method: "PATCH",
    }),

  markAllAsRead: () =>
    apiRequest("/notifications/read-all", {
      method: "PATCH",
    }),

  broadcast: (payload: { userIds: string[]; title: string; message: string; type?: string; link?: string }) =>
    apiRequest("/notifications/broadcast", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
