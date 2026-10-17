import express from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import requirePermission, { requireAnyPermission } from "../../middlewares/requirePermission";
import validateRequest from "../../middlewares/validateRequest";
import { permissions } from "../../shared/permissions";
import { QuoteController } from "./quote.controller";
import { QuoteValidation } from "./quote.validation";

const router = express.Router();

router.post(
    "/",
    auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
    requirePermission(permissions.quote.create),
    validateRequest(QuoteValidation.createQuote),
    QuoteController.createQuote,
);

router.get(
    "/my",
    auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
    requirePermission(permissions.quote.readOwn),
    QuoteController.getMyQuotes,
);

router.get(
    "/",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    requirePermission(permissions.quote.review),
    QuoteController.getAllQuotes,
);

router.get(
    "/:quoteId",
    auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
    requireAnyPermission(permissions.quote.readOwn, permissions.quote.review),
    validateRequest(QuoteValidation.quoteIdParam),
    QuoteController.getQuoteById,
);

router.post(
    "/:quoteId/convert-to-order",
    auth(UserRole.CUSTOMER, UserRole.ADMIN, UserRole.SUPER_ADMIN),
    requirePermission(permissions.quote.convertToOrder),
    validateRequest(QuoteValidation.convertToOrder),
    QuoteController.convertQuoteToOrder,
);

router.post(
    "/:quoteId/approve",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    requirePermission(permissions.quote.approve),
    validateRequest(QuoteValidation.quoteIdParam),
    QuoteController.approveQuote,
);

router.post(
    "/:quoteId/reject",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    requirePermission(permissions.quote.reject),
    validateRequest(QuoteValidation.quoteIdParam),
    QuoteController.rejectQuote,
);

export const quoteRoutes = router;
