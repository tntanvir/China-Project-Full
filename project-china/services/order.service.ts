import { apiRequest } from "./api-client";

export const OrderService = {
  createOrderFromCart: (payload: { shippingAddress: string; billingAddress?: string }) =>
    apiRequest("/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getMyOrders: () => apiRequest("/orders"),

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
