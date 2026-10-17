import { apiRequest } from "./api-client";

export const SupportService = {
  createTicket: (payload: { subject: string; message: string }) =>
    apiRequest("/support/tickets", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getMyTickets: () => apiRequest("/support/tickets/my"),

  getAllTickets: () => apiRequest("/support/tickets"),

  getTicketById: (ticketId: string) => apiRequest(`/support/tickets/${ticketId}`),

  replyTicket: (ticketId: string, message: string) =>
    apiRequest(`/support/tickets/${ticketId}/replies`, {
      method: "POST",
      body: JSON.stringify({ message }),
    }),

  closeTicket: (ticketId: string) =>
    apiRequest(`/support/tickets/${ticketId}/close`, {
      method: "PATCH",
    }),
};
