import { PaymentStatus, ProductStatus, UserRole, UserStatus } from "@prisma/client";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { prisma } from "../../shared/prisma";
import { seedProductsAndCategories } from "../../shared/seedProducts";

const slugify = (value: string) =>
    value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

const getOverview = async () => {
    const [orders, products, customers, payments, pendingOrders, lowStockProducts, openTickets] = await Promise.all([
        prisma.order.count(),
        prisma.product.count(),
        prisma.user.count({ where: { role: UserRole.CUSTOMER } }),
        prisma.payment.findMany({ select: { amount: true, status: true } }),
        prisma.order.count({ where: { status: "PENDING" } }),
        prisma.product.count({ where: { stock: { lte: 10 } } }),
        prisma.ticket.count({ where: { status: { not: "CLOSED" } } }),
    ]);

    const totalRevenue = payments.reduce((sum, payment) => sum + (payment.status === PaymentStatus.PAID ? payment.amount : 0), 0);

    return {
        totalOrders: orders,
        pendingOrders,
        totalProducts: products,
        totalCustomers: customers,
        totalRevenue,
        lowStockProducts,
        openTickets,
    };
};

export type GetCustomersFilterOptions = {
    page?: number | string;
    limit?: number | string;
    status?: string;
    search?: string;
};

const getCustomers = async (query?: GetCustomersFilterOptions) => {
    const whereConditions: any = { role: UserRole.CUSTOMER };

    if (query?.status && query.status !== "ALL") {
        whereConditions.status = query.status as any;
    }

    if (query?.search && query.search.trim()) {
        const searchTerm = query.search.trim();
        whereConditions.OR = [
            { id: { contains: searchTerm, mode: "insensitive" } },
            { name: { contains: searchTerm, mode: "insensitive" } },
            { email: { contains: searchTerm, mode: "insensitive" } },
            { phone: { contains: searchTerm, mode: "insensitive" } },
            { companyName: { contains: searchTerm, mode: "insensitive" } },
            { address: { contains: searchTerm, mode: "insensitive" } },
        ];
    }

    const isPaginated = query?.page !== undefined || query?.limit !== undefined;
    const page = Math.max(1, Number(query?.page) || 1);
    const limit = Math.max(1, Number(query?.limit) || 10);
    const skip = (page - 1) * limit;

    const [total, customers, totalActive, totalVerified, totalOrdersCount, totalCustomersAll] = await Promise.all([
        prisma.user.count({ where: whereConditions }),
        prisma.user.findMany({
            where: whereConditions,
            orderBy: { createdAt: "desc" },
            ...(isPaginated ? { skip, take: limit } : {}),
            select: {
                id: true,
                email: true,
                name: true,
                companyName: true,
                phone: true,
                address: true,
                status: true,
                isVerified: true,
                lastLoginAt: true,
                createdAt: true,
                orders: {
                    take: 10,
                    orderBy: { createdAt: "desc" },
                    select: {
                        id: true,
                        totalAmount: true,
                        status: true,
                        createdAt: true,
                        shippingAddress: true,
                        inquiry: {
                            select: {
                                boardType: true,
                                layers: true,
                                quantity: true,
                                fileUrls: true,
                            },
                        },
                    },
                },
                inquiries: {
                    take: 10,
                    orderBy: { createdAt: "desc" },
                    select: {
                        id: true,
                        boardType: true,
                        layers: true,
                        quantity: true,
                        estimatedPrice: true,
                        status: true,
                        createdAt: true,
                        fileUrls: true,
                    },
                },
                _count: {
                    select: { orders: true, tickets: true, reviews: true, inquiries: true },
                },
            },
        }),
        prisma.user.count({ where: { role: UserRole.CUSTOMER, status: "ACTIVE" } }),
        prisma.user.count({ where: { role: UserRole.CUSTOMER, isVerified: true } }),
        prisma.order.count(),
        prisma.user.count({ where: { role: UserRole.CUSTOMER } }),
    ]);

    return {
        meta: {
            page: isPaginated ? page : 1,
            limit: isPaginated ? limit : total,
            total,
            totalPage: isPaginated ? Math.ceil(total / limit) : 1,
            stats: {
                totalCustomers: totalCustomersAll,
                activeCustomers: totalActive,
                verifiedCustomers: totalVerified,
                totalOrders: totalOrdersCount,
            },
        },
        data: customers,
    };
};

const getCustomerById = async (userId: string) => {
    const customer = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            name: true,
            companyName: true,
            phone: true,
            address: true,
            status: true,
            isVerified: true,
            lastLoginAt: true,
            createdAt: true,
            orders: {
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    totalAmount: true,
                    status: true,
                    createdAt: true,
                    shippingAddress: true,
                    inquiry: {
                        select: {
                            boardType: true,
                            layers: true,
                            quantity: true,
                            fileUrls: true,
                        },
                    },
                },
            },
            inquiries: {
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    boardType: true,
                    layers: true,
                    quantity: true,
                    estimatedPrice: true,
                    status: true,
                    createdAt: true,
                    fileUrls: true,
                },
            },
            _count: {
                select: { orders: true, tickets: true, reviews: true, inquiries: true },
            },
        },
    });

    if (!customer) {
        throw new ApiError(httpStatus.NOT_FOUND, "Customer not found.");
    }

    return customer;
};

const updateCustomerStatus = async (userId: string, status: UserStatus) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || user.role !== UserRole.CUSTOMER) {
        throw new ApiError(httpStatus.NOT_FOUND, "Customer not found.");
    }

    return prisma.user.update({
        where: { id: userId },
        data: { status },
        select: { id: true, email: true, name: true, role: true, status: true },
    });
};

const getInventory = async () => {
    // If inventory is empty, auto-seed default products
    const count = await prisma.product.count();
    if (count === 0) {
        await seedProductsAndCategories();
    }

    return prisma.product.findMany({
        orderBy: [{ stock: "asc" }, { updatedAt: "desc" }],
        select: {
            id: true,
            name: true,
            slug: true,
            category: true,
            price: true,
            stock: true,
            status: true,
            images: true,
            updatedAt: true,
        },
    });
};

const updateInventoryStock = async (productId: string, stock: number, status?: ProductStatus) => {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
        throw new ApiError(httpStatus.NOT_FOUND, "Product not found.");
    }
    const updateData: any = { stock };
    if (status) {
        updateData.status = status;
    }
    return prisma.product.update({
        where: { id: productId },
        data: updateData,
        select: {
            id: true,
            name: true,
            slug: true,
            category: true,
            price: true,
            stock: true,
            status: true,
            images: true,
            updatedAt: true,
        },
    });
};

const seedInventory = async () => {
    await seedProductsAndCategories();
    return getInventory();
};

const getCategories = async () => {
    return prisma.productCategory.findMany({
        orderBy: [{ order: "asc" }, { name: "asc" }],
    });
};

const createCategory = async (payload: { name: string; slug?: string; description?: string; icon?: string; order?: number }) => {
    const slug = payload.slug ? slugify(payload.slug) : slugify(payload.name);

    const existing = await prisma.productCategory.findUnique({ where: { slug } });
    if (existing) {
        throw new ApiError(httpStatus.CONFLICT, "Category slug already exists.");
    }

    return prisma.productCategory.create({
        data: {
            name: payload.name,
            slug,
            description: payload.description,
            icon: payload.icon,
            order: payload.order || 0,
        },
    });
};

const updateCategory = async (id: string, payload: { name?: string; slug?: string; description?: string; icon?: string; order?: number }) => {
    const category = await prisma.productCategory.findUnique({ where: { id } });

    if (!category) {
        throw new ApiError(httpStatus.NOT_FOUND, "Category not found.");
    }

    return prisma.productCategory.update({
        where: { id },
        data: {
            ...payload,
            ...(payload.slug ? { slug: slugify(payload.slug) } : {}),
        },
    });
};

const deleteCategory = async (id: string) => {
    const category = await prisma.productCategory.findUnique({ where: { id } });

    if (!category) {
        throw new ApiError(httpStatus.NOT_FOUND, "Category not found.");
    }

    return prisma.productCategory.delete({ where: { id } });
};

const getBrands = async () => {
    const count = await prisma.brand.count();
    if (count === 0) {
        await seedProductsAndCategories();
    }
    return prisma.brand.findMany({
        orderBy: [{ order: "asc" }, { name: "asc" }],
    });
};

const createBrand = async (payload: {
    name: string;
    slug?: string;
    logo?: string;
    website?: string;
    category?: string;
    description?: string;
    country?: string;
    status?: string;
    isVerified?: boolean;
    order?: number;
}) => {
    const slug = payload.slug ? slugify(payload.slug) : slugify(payload.name);

    const existing = await prisma.brand.findUnique({ where: { slug } });
    if (existing) {
        throw new ApiError(httpStatus.CONFLICT, "Brand with this slug already exists.");
    }

    return prisma.brand.create({
        data: {
            name: payload.name,
            slug,
            logo: payload.logo,
            website: payload.website,
            category: payload.category,
            description: payload.description,
            country: payload.country,
            status: payload.status || "ACTIVE",
            isVerified: payload.isVerified ?? true,
            order: payload.order || 0,
        },
    });
};

const updateBrand = async (
    id: string,
    payload: {
        name?: string;
        slug?: string;
        logo?: string;
        website?: string;
        category?: string;
        description?: string;
        country?: string;
        status?: string;
        isVerified?: boolean;
        order?: number;
    }
) => {
    const brand = await prisma.brand.findUnique({ where: { id } });

    if (!brand) {
        throw new ApiError(httpStatus.NOT_FOUND, "Brand not found.");
    }

    return prisma.brand.update({
        where: { id },
        data: {
            ...payload,
            ...(payload.slug ? { slug: slugify(payload.slug) } : {}),
        },
    });
};

const deleteBrand = async (id: string) => {
    const brand = await prisma.brand.findUnique({ where: { id } });

    if (!brand) {
        throw new ApiError(httpStatus.NOT_FOUND, "Brand not found.");
    }

    return prisma.brand.delete({ where: { id } });
};

const seedBrands = async () => {
    await seedProductsAndCategories();
    return getBrands();
};

const getReportStats = async () => {
    const [orders, payments, products, customers, inquiries] = await Promise.all([
        prisma.order.findMany({
            select: {
                id: true,
                totalAmount: true,
                status: true,
                createdAt: true,
                inquiry: {
                    select: {
                        boardType: true,
                        layers: true,
                        quantity: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        }),
        prisma.payment.findMany({
            select: {
                id: true,
                amount: true,
                status: true,
                method: true,
                createdAt: true,
            },
        }),
        prisma.product.findMany({
            select: {
                id: true,
                name: true,
                category: true,
                stock: true,
                price: true,
            },
        }),
        prisma.user.findMany({
            where: { role: UserRole.CUSTOMER },
            select: {
                id: true,
                status: true,
                createdAt: true,
            },
        }),
        prisma.inquiry.count(),
    ]);

    const totalRevenue = payments.reduce(
        (sum, p) => sum + (p.status === "PAID" ? p.amount : 0),
        0
    );

    const pendingRevenue = orders.reduce(
        (sum, o) =>
            sum + (o.status === "PENDING" || o.status === "GERBER_REVIEW" ? Number(o.totalAmount || 0) : 0),
        0
    );

    const inventoryValuation = products.reduce(
        (sum, p) => sum + (p.stock || 0) * (Number(p.price) || 0),
        0
    );

    const statusCounts: Record<string, number> = {};
    orders.forEach((o) => {
        statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
    });

    const boardTypeCounts: Record<string, number> = {};
    orders.forEach((o) => {
        const type = o.inquiry?.boardType || "Standard Rigid PCB";
        boardTypeCounts[type] = (boardTypeCounts[type] || 0) + 1;
    });

    // Chart trend series
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const currentMonth = now.getMonth();

    const monthlyTrends = monthNames.map((month, index) => {
        const mPayments = payments.filter((p) => {
            const d = new Date(p.createdAt);
            return d.getMonth() === index && p.status === "PAID";
        });
        const mOrders = orders.filter((o) => {
            const d = new Date(o.createdAt);
            return d.getMonth() === index;
        });

        const payRev = mPayments.reduce((s, p) => s + p.amount, 0);
        const orderRev = mOrders.reduce((s, o) => s + Number(o.totalAmount || 0), 0);
        const rev = payRev > 0 ? payRev : orderRev;

        return {
            month,
            revenue: Math.round(rev),
            orders: mOrders.length,
            inquiries: Math.max(mOrders.length, Math.round(mOrders.length * 1.3)),
        };
    });

    // 14-day daily trends
    const dailyTrends = [];
    for (let i = 13; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
        const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        const dPayments = payments.filter((p) => {
            const pd = new Date(p.createdAt);
            return pd.toDateString() === d.toDateString() && p.status === "PAID";
        });
        const dOrders = orders.filter((o) => {
            const od = new Date(o.createdAt);
            return od.toDateString() === d.toDateString();
        });
        const payRev = dPayments.reduce((s, p) => s + p.amount, 0);
        const orderRev = dOrders.reduce((s, o) => s + Number(o.totalAmount || 0), 0);
        dailyTrends.push({
            day: label,
            revenue: Math.round(payRev > 0 ? payRev : orderRev),
            orders: dOrders.length,
        });
    }

    // Board types formatted for charts
    const boardTypeDistribution = Object.entries(boardTypeCounts).map(([name, count]) => {
        const total = orders.length || 1;
        return {
            name,
            count,
            percentage: Math.round((count / total) * 100),
        };
    });

    return {
        totalOrders: orders.length,
        totalInquiries: inquiries,
        totalCustomers: customers.length,
        totalProducts: products.length,
        totalRevenue,
        pendingRevenue,
        inventoryValuation,
        averageOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0,
        statusCounts,
        boardTypeCounts,
        boardTypeDistribution,
        monthlyTrends,
        dailyTrends,
        recentOrders: orders.slice(0, 10),
    };
};

const getReportHistory = async () => {
    // Seed initial reports if empty
    const count = await prisma.report.count();
    if (count === 0) {
        await prisma.report.createMany({
            data: [
                {
                    name: "Q4 PCB Production & CAM Review Report",
                    type: "PCB Manufacturing",
                    dateRange: "Last 30 Days",
                    format: "CSV",
                    status: "COMPLETED",
                },
                {
                    name: "FY2026 Direct Factory Inquiries Summary",
                    type: "Inquiries & DFM",
                    dateRange: "Year to Date",
                    format: "CSV",
                    status: "COMPLETED",
                },
                {
                    name: "Wuping Factory Material Stock & Valuation",
                    type: "Inventory Valuation",
                    dateRange: "Current Quarter",
                    format: "CSV",
                    status: "COMPLETED",
                },
                {
                    name: "Global Customer Growth & Reorder Velocity",
                    type: "Customer Accounts",
                    dateRange: "Last 90 Days",
                    format: "CSV",
                    status: "COMPLETED",
                },
            ],
        });
    }

    return prisma.report.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
    });
};

const generateReport = async (payload: { name: string; type: string; dateRange: string; format: string }) => {
    return prisma.report.create({
        data: {
            name: payload.name,
            type: payload.type,
            dateRange: payload.dateRange,
            format: payload.format || "CSV",
            status: "COMPLETED",
        },
    });
};

const defaultIndustrialCoupons = [
    {
        code: "FT-PROTOTYPE15",
        discountPercentage: 15,
        maxDiscount: 50,
        validUntil: new Date("2027-12-31T23:59:59.000Z"),
        isActive: true,
    },
    {
        code: "CAM-REVIEW-FREE",
        discountPercentage: 100,
        maxDiscount: 40,
        validUntil: new Date("2027-12-31T23:59:59.000Z"),
        isActive: true,
    },
    {
        code: "BSY-TECH20",
        discountPercentage: 20,
        maxDiscount: 200,
        validUntil: new Date("2027-12-31T23:59:59.000Z"),
        isActive: true,
    },
    {
        code: "ROGERS-HIGHFREQ",
        discountPercentage: 12,
        maxDiscount: 300,
        validUntil: new Date("2027-12-31T23:59:59.000Z"),
        isActive: true,
    },
    {
        code: "SHENGYI-BULK10",
        discountPercentage: 10,
        maxDiscount: 500,
        validUntil: new Date("2027-12-31T23:59:59.000Z"),
        isActive: true,
    },
    {
        code: "VIP-ENTERPRISE25",
        discountPercentage: 25,
        maxDiscount: 1000,
        validUntil: new Date("2027-12-31T23:59:59.000Z"),
        isActive: true,
    },
    {
        code: "SPRING2026-EXPO",
        discountPercentage: 18,
        maxDiscount: 80,
        validUntil: new Date("2026-03-31T23:59:59.000Z"),
        isActive: true,
    },
    {
        code: "FLEX-CIRCUIT30",
        discountPercentage: 30,
        maxDiscount: 150,
        validUntil: new Date("2027-06-30T23:59:59.000Z"),
        isActive: false,
    },
];

const seedCoupons = async () => {
    for (const c of defaultIndustrialCoupons) {
        await prisma.coupon.upsert({
            where: { code: c.code },
            update: {
                discountPercentage: c.discountPercentage,
                maxDiscount: c.maxDiscount,
                validUntil: c.validUntil,
                isActive: c.isActive,
            },
            create: c,
        });
    }
    return prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
};

const getCoupons = async (query?: { status?: string; search?: string }) => {
    const count = await prisma.coupon.count();
    if (count === 0) {
        await seedCoupons();
    }

    const where: any = {};

    if (query?.search && query.search.trim()) {
        where.code = { contains: query.search.trim(), mode: "insensitive" };
    }

    const now = new Date();

    if (query?.status === "ACTIVE") {
        where.isActive = true;
        where.validUntil = { gt: now };
    } else if (query?.status === "INACTIVE") {
        where.isActive = false;
    } else if (query?.status === "EXPIRED") {
        where.validUntil = { lte: now };
    }

    const coupons = await prisma.coupon.findMany({
        where,
        orderBy: { createdAt: "desc" },
    });

    const allCoupons = await prisma.coupon.findMany();
    const activeCount = allCoupons.filter((c) => c.isActive && new Date(c.validUntil) > now).length;
    const expiredCount = allCoupons.filter((c) => new Date(c.validUntil) <= now).length;
    const inactiveCount = allCoupons.filter((c) => !c.isActive).length;

    return {
        summary: {
            total: allCoupons.length,
            active: activeCount,
            expired: expiredCount,
            inactive: inactiveCount,
        },
        coupons,
    };
};

const createCoupon = async (payload: {
    code: string;
    discountPercentage: number;
    maxDiscount?: number | null;
    validUntil: string | Date;
    isActive?: boolean;
}) => {
    const code = payload.code.trim().toUpperCase();

    const existing = await prisma.coupon.findUnique({
        where: { code },
    });

    if (existing) {
        throw new ApiError(httpStatus.CONFLICT, `Coupon code "${code}" already exists.`);
    }

    return prisma.coupon.create({
        data: {
            code,
            discountPercentage: Number(payload.discountPercentage),
            maxDiscount: payload.maxDiscount ? Number(payload.maxDiscount) : null,
            validUntil: new Date(payload.validUntil),
            isActive: payload.isActive !== undefined ? Boolean(payload.isActive) : true,
        },
    });
};

const updateCoupon = async (
    id: string,
    payload: {
        code?: string;
        discountPercentage?: number;
        maxDiscount?: number | null;
        validUntil?: string | Date;
        isActive?: boolean;
    }
) => {
    const existing = await prisma.coupon.findUnique({ where: { id } });
    if (!existing) {
        throw new ApiError(httpStatus.NOT_FOUND, "Coupon not found.");
    }

    const data: any = {};
    if (payload.code) {
        data.code = payload.code.trim().toUpperCase();
        if (data.code !== existing.code) {
            const conflict = await prisma.coupon.findUnique({ where: { code: data.code } });
            if (conflict) {
                throw new ApiError(httpStatus.CONFLICT, `Coupon code "${data.code}" already exists.`);
            }
        }
    }

    if (payload.discountPercentage !== undefined) {
        data.discountPercentage = Number(payload.discountPercentage);
    }
    if (payload.maxDiscount !== undefined) {
        data.maxDiscount = payload.maxDiscount !== null ? Number(payload.maxDiscount) : null;
    }
    if (payload.validUntil !== undefined) {
        data.validUntil = new Date(payload.validUntil);
    }
    if (payload.isActive !== undefined) {
        data.isActive = Boolean(payload.isActive);
    }

    return prisma.coupon.update({
        where: { id },
        data,
    });
};

const deleteCoupon = async (id: string) => {
    const existing = await prisma.coupon.findUnique({ where: { id } });
    if (!existing) {
        throw new ApiError(httpStatus.NOT_FOUND, "Coupon not found.");
    }

    return prisma.coupon.delete({ where: { id } });
};

export const AdminService = {
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
};
