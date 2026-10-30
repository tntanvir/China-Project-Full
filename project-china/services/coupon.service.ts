import { apiRequest } from "./api-client";

export type ValidatedCoupon = {
  valid: boolean;
  code: string;
  discountPercentage: number;
  maxDiscount?: number | null;
  discountAmount: number;
  finalTotal: number;
};

export const CouponService = {
  validateCoupon: (code: string, subtotal: number) =>
    apiRequest<ValidatedCoupon>("/coupons/validate", {
      method: "POST",
      body: JSON.stringify({ code, subtotal }),
    }),
};
