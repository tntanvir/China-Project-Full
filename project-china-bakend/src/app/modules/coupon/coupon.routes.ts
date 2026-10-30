import express from "express";
import { CouponController } from "./coupon.controller";

const router = express.Router();

router.post("/validate", CouponController.validateCoupon);

export const couponRoutes = router;
