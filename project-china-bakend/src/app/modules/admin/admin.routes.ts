import express from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { AdminController } from "./admin.controller";
import { AdminValidation } from "./admin.validation";

const router = express.Router();

router.use(auth(UserRole.ADMIN, UserRole.SUPER_ADMIN));

router.get("/overview", AdminController.getOverview);
router.get("/customers", AdminController.getCustomers);
router.get("/customers/:userId", AdminController.getCustomerById);
router.patch("/customers/:userId/status", validateRequest(AdminValidation.updateCustomerStatus), AdminController.updateCustomerStatus);
router.get("/inventory", AdminController.getInventory);
router.patch("/inventory/:id/stock", AdminController.updateInventoryStock);
router.post("/inventory/seed", AdminController.seedInventory);
router.get("/categories", AdminController.getCategories);
router.post("/categories", validateRequest(AdminValidation.createCategory), AdminController.createCategory);
router.patch("/categories/:id", validateRequest(AdminValidation.updateCategory), AdminController.updateCategory);
router.delete("/categories/:id", AdminController.deleteCategory);
router.get("/brands", AdminController.getBrands);
router.post("/brands", AdminController.createBrand);
router.patch("/brands/:id", AdminController.updateBrand);
router.delete("/brands/:id", AdminController.deleteBrand);
router.post("/brands/seed", AdminController.seedBrands);
router.get("/reports/stats", AdminController.getReportStats);
router.get("/reports/history", AdminController.getReportHistory);
router.post("/reports/generate", AdminController.generateReport);
router.get("/coupons", AdminController.getCoupons);
router.post("/coupons", AdminController.createCoupon);
router.patch("/coupons/:id", AdminController.updateCoupon);
router.delete("/coupons/:id", AdminController.deleteCoupon);
router.post("/coupons/seed", AdminController.seedCoupons);

export const adminRoutes = router;
