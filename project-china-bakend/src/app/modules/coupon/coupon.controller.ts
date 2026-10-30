import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { CouponService } from "./coupon.service";

const validateCoupon = catchAsync(async (req: Request, res: Response) => {
    const { code, subtotal } = req.body;
    const result = await CouponService.validateCoupon(code, Number(subtotal || 0));

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `Coupon "${result.code}" applied successfully!`,
        data: result,
    });
});

export const CouponController = {
    validateCoupon,
};
