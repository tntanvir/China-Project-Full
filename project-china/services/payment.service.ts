import { apiRequest } from "./api-client";


type CheckoutResponse = {
  provider: "stripe" | "paypal";
  checkoutUrl: string;
  sessionId?: string;
  paypalOrderId?: string;
  mode?: string;
};

export type PaymentRecord = {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  method: string;
  transactionId?: string;
  providerPaymentId?: string;
  status: string;
  paidAt?: string;
  refundedAt?: string;
  failureReason?: string;
  createdAt?: string;
  order?: {
    id: string;
    userId?: string;
    status?: string;
    totalAmount?: number;
    createdAt?: string;
  };
};

export const PaymentService = {
  createStripeCheckout: (orderId: string) =>
    apiRequest<CheckoutResponse>("/payments/stripe/create-checkout-session", {
      method: "POST",
      body: JSON.stringify({ orderId }),
    }),

  createPayPalOrder: (orderId: string) =>
    apiRequest<CheckoutResponse>("/payments/paypal/create-order", {
      method: "POST",
      body: JSON.stringify({ orderId }),
    }),

  capturePayPalOrder: (paypalOrderId: string) =>
    apiRequest<{ success: boolean; message: string }>("/payments/paypal/capture-order", {
      method: "POST",
      body: JSON.stringify({ paypalOrderId }),
    }),

  getPaymentHistory: () => apiRequest<PaymentRecord[]>("/payments/history"),

  getTransactions: () => apiRequest<PaymentRecord[]>("/payments/transactions"),

  getReceipt: (paymentId: string) => apiRequest<unknown>(`/payments/${paymentId}/receipt`),

  refundPayment: (paymentId: string) =>
    apiRequest<{ provider: string; refundId: string }>(`/payments/${paymentId}/refund`, {
      method: "POST",
    }),
};
