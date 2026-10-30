import { apiRequest, apiRequestWithMeta, PaginationMeta } from "./api-client";

export type OrderQueryOptions = {
  page?: number;
  limit?: number;
  status?: string;
  source?: string;
  search?: string;
};

export const OrderService = {
  createOrderFromCart: (payload: { shippingAddress: string; billingAddress?: string }) =>
    apiRequest("/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getMyOrders: (query?: OrderQueryOptions) => {
    if (!query) return apiRequest<any[]>("/orders");
    const params = new URLSearchParams();
    if (query.page) params.set("page", String(query.page));
    if (query.limit) params.set("limit", String(query.limit));
    if (query.status && query.status !== "ALL") params.set("status", query.status);
    if (query.source && query.source !== "ALL") params.set("source", query.source);
    if (query.search) params.set("search", query.search);
    const qs = params.toString();
    return apiRequest<any[]>(`/orders${qs ? `?${qs}` : ""}`);
  },

  getOrdersWithPagination: (query?: OrderQueryOptions) => {
    const params = new URLSearchParams();
    if (query?.page) params.set("page", String(query.page));
    if (query?.limit) params.set("limit", String(query.limit));
    if (query?.status && query.status !== "ALL") params.set("status", query.status);
    if (query?.source && query.source !== "ALL") params.set("source", query.source);
    if (query?.search) params.set("search", query.search);
    const qs = params.toString();
    return apiRequestWithMeta<any[]>(`/orders${qs ? `?${qs}` : ""}`);
  },

  getOrderById: (orderId: string) => apiRequest(`/orders/${orderId}`),

  updateStatus: (
    orderId: string,
    payload: {
      status:
        | "PENDING"
        | "PAID"
        | "GERBER_REVIEW"
        | "ENGINEERING_REVIEW"
        | "PRODUCTION"
        | "QUALITY_CONTROL"
        | "PACKAGING"
        | "SHIPPED"
        | "DELIVERED"
        | "CANCELLED";
      note?: string;
    },
  ) =>
    apiRequest(`/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  cancelOrder: (orderId: string) =>
    apiRequest(`/orders/${orderId}/cancel`, {
      method: "PATCH",
    }),

  confirmPayment: (
    orderId: string,
    payload?: {
      paymentMethod?: string;
      transactionRef?: string;
      note?: string;
    },
  ) =>
    apiRequest<{ success: boolean; message: string; data: any }>(`/orders/${orderId}/confirm-payment`, {
      method: "POST",
      body: JSON.stringify(payload || {}),
    }),
};
