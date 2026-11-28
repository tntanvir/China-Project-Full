import { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { AdminService } from "./admin.service";

const getOverview = catchAsync(async (_req: Request, res: Response) => {
    const result = await AdminService.getOverview();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin overview fetched successfully.",
        data: result,
    });
});

const getCustomers = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getCustomers(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Customers fetched successfully.",
        meta: result.meta,
        data: result.data,
    });
});

const getCustomerById = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getCustomerById(String(req.params.userId));

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Customer details fetched successfully.",
        data: result,
    });
});

const updateCustomerStatus = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.updateCustomerStatus(String(req.params.userId), req.body.status);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Customer status updated successfully.",
        data: result,
    });
});

const getInventory = catchAsync(async (_req: Request, res: Response) => {
    const result = await AdminService.getInventory();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Inventory fetched successfully.",
        data: result,
    });
});

const updateInventoryStock = catchAsync(async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const { stock, status } = req.body;
    const result = await AdminService.updateInventoryStock(id, Number(stock), status);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Inventory stock updated successfully.",
        data: result,
    });
});

const seedInventory = catchAsync(async (_req: Request, res: Response) => {
    const result = await AdminService.seedInventory();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Default inventory seeded successfully.",
        data: result,
    });
});

const getCategories = catchAsync(async (_req: Request, res: Response) => {
    const result = await AdminService.getCategories();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Categories fetched successfully.",
        data: result,
    });
});

const createCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.createCategory(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Category created successfully.",
        data: result,
    });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.updateCategory(String(req.params.id), req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Category updated successfully.",
        data: result,
    });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.deleteCategory(String(req.params.id));

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Category deleted successfully.",
        data: result,
    });
});

const getBrands = catchAsync(async (_req: Request, res: Response) => {
    const result = await AdminService.getBrands();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Brands fetched successfully.",
        data: result,
    });
});

const createBrand = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.createBrand(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Brand created successfully.",
        data: result,
    });
});

const updateBrand = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.updateBrand(String(req.params.id), req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Brand updated successfully.",
        data: result,
    });
});

const deleteBrand = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.deleteBrand(String(req.params.id));

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Brand deleted successfully.",
        data: result,
    });
});

const seedBrands = catchAsync(async (_req: Request, res: Response) => {
    const result = await AdminService.seedBrands();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Default brands seeded successfully.",
        data: result,
    });
});

const getReportStats = catchAsync(async (_req: Request, res: Response) => {
    const result = await AdminService.getReportStats();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Report statistics fetched successfully.",
        data: result,
    });
});

const getReportHistory = catchAsync(async (_req: Request, res: Response) => {
    const result = await AdminService.getReportHistory();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Report history fetched successfully.",
        data: result,
    });
});

const generateReport = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.generateReport(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Report generated successfully.",
        data: result,
    });
});

const getCoupons = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getCoupons(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Coupons fetched successfully.",
        data: result,
    });
});

const createCoupon = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.createCoupon(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Coupon created successfully.",
        data: result,
    });
});

const updateCoupon = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.updateCoupon(String(req.params.id), req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Coupon updated successfully.",
        data: result,
    });
});

const deleteCoupon = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.deleteCoupon(String(req.params.id));

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Coupon deleted successfully.",
        data: result,
    });
});

const seedCoupons = catchAsync(async (_req: Request, res: Response) => {
    const result = await AdminService.seedCoupons();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Coupons seeded successfully.",
        data: result,
    });
});

const getPricingConfig = catchAsync(async (_req: Request, res: Response) => {
    const result = await AdminService.getPricingConfig();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Quote pricing configuration fetched successfully.",
        data: result,
    });
});

const updatePricingConfig = catchAsync(async (req: Request, res: Response) => {
    const actor = (req as Request & { user?: { email?: string; id?: string } }).user;
    const result = await AdminService.updatePricingConfig(req.body, actor?.email || actor?.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Quote pricing configuration saved successfully.",
        data: result,
    });
});

const getCatalogFamilies = catchAsync(async (_req: Request, res: Response) => {
    const result = await AdminService.getCatalogFamilies();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Manufacturing catalog fetched successfully.",
        data: result,
    });
});

const createCatalogFamily = catchAsync(async (req: Request, res: Response) => {
    const actor = (req as Request & { user?: { email?: string; id?: string } }).user;
    const result = await AdminService.createCatalogFamily(req.body, actor?.email || actor?.id, req.file);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Catalog product added successfully.",
        data: result,
    });
});

const updateCatalogFamily = catchAsync(async (req: Request, res: Response) => {
    const actor = (req as Request & { user?: { email?: string; id?: string } }).user;
    const result = await AdminService.updateCatalogFamily(
        String(req.params.id),
        req.body,
        actor?.email || actor?.id,
        req.file,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Catalog product updated successfully.",
        data: result,
    });
});

const deleteCatalogFamily = catchAsync(async (req: Request, res: Response) => {
    const actor = (req as Request & { user?: { email?: string; id?: string } }).user;
    const result = await AdminService.deleteCatalogFamily(String(req.params.id), actor?.email || actor?.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Catalog product deleted successfully.",
        data: result,
    });
});

const resetCatalogFamilies = catchAsync(async (req: Request, res: Response) => {
    const actor = (req as Request & { user?: { email?: string; id?: string } }).user;
    const result = await AdminService.resetCatalogFamilies(actor?.email || actor?.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Catalog restored to default items.",
        data: result,
    });
});

const getEngineeringGuides = catchAsync(async (_req: Request, res: Response) => {
    const result = await AdminService.getEngineeringGuides();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Engineering guides fetched successfully.",
        data: result,
    });
});

const createEngineeringGuide = catchAsync(async (req: Request, res: Response) => {
    const actor = (req as Request & { user?: { email?: string; id?: string } }).user;
    const result = await AdminService.createEngineeringGuide(req.body, actor?.email || actor?.id, req.file);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Engineering guide published successfully.",
        data: result,
    });
});

const updateEngineeringGuide = catchAsync(async (req: Request, res: Response) => {
    const actor = (req as Request & { user?: { email?: string; id?: string } }).user;
    const result = await AdminService.updateEngineeringGuide(
        String(req.params.id),
        req.body,
        actor?.email || actor?.id,
        req.file,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Engineering guide updated successfully.",
        data: result,
    });
});

const deleteEngineeringGuide = catchAsync(async (req: Request, res: Response) => {
    const actor = (req as Request & { user?: { email?: string; id?: string } }).user;
    const result = await AdminService.deleteEngineeringGuide(String(req.params.id), actor?.email || actor?.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Engineering guide deleted successfully.",
        data: result,
    });
});

const resetEngineeringGuides = catchAsync(async (req: Request, res: Response) => {
    const actor = (req as Request & { user?: { email?: string; id?: string } }).user;
    const result = await AdminService.resetEngineeringGuides(actor?.email || actor?.id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Engineering guides restored to defaults.",
        data: result,
    });
});

export const AdminController = {
    getOverview,
    getCustomers,
    getCustomerById,
    updateCustomerStatus,
    getInventory,
    updateInventoryStock,
    seedInventory,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getBrands,
    createBrand,
    updateBrand,
    deleteBrand,
    seedBrands,
    getReportStats,
    getReportHistory,
    generateReport,
    getCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    seedCoupons,
    getPricingConfig,
    updatePricingConfig,
    getCatalogFamilies,
    createCatalogFamily,
    updateCatalogFamily,
    deleteCatalogFamily,
    resetCatalogFamilies,
    getEngineeringGuides,
    createEngineeringGuide,
    updateEngineeringGuide,
    deleteEngineeringGuide,
    resetEngineeringGuides,
};
