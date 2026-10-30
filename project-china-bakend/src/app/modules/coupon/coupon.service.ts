import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { prisma } from "../../shared/prisma";

const validateCoupon = async (code: string, subtotal: number = 0) => {
    if (!code || !code.trim()) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Please provide a coupon code.");
    }

    const cleanCode = code.trim().toUpperCase();
    const coupon = await prisma.coupon.findUnique({
        where: { code: cleanCode },
    });

    if (!coupon) {
        throw new ApiError(httpStatus.NOT_FOUND, `Coupon code "${cleanCode}" is invalid.`);
    }

    if (!coupon.isActive) {
        throw new ApiError(httpStatus.BAD_REQUEST, `Coupon "${cleanCode}" is currently inactive or paused.`);
    }

    const now = new Date();
    if (new Date(coupon.validUntil) <= now) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            `Coupon "${cleanCode}" expired on ${new Date(coupon.validUntil).toLocaleDateString()}.`
        );
    }

    // Calculate discount amount
    const rawDiscount = (subtotal * coupon.discountPercentage) / 100;
    const discountAmount = coupon.maxDiscount
        ? Math.min(rawDiscount, coupon.maxDiscount)
        : rawDiscount;

    const finalTotal = Math.max(0, subtotal - discountAmount);

    return {
        valid: true,
        code: coupon.code,
        discountPercentage: coupon.discountPercentage,
        maxDiscount: coupon.maxDiscount,
        discountAmount: Math.round(discountAmount * 100) / 100,
        finalTotal: Math.round(finalTotal * 100) / 100,
    };
};

export const CouponService = {
    validateCoupon,
};
