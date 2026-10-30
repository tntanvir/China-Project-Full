import { apiRequest, apiRequestWithMeta, PaginationMeta } from "./api-client";

export type AdminOverview = {
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  totalCustomers: number;
  totalRevenue: number;
  lowStockProducts: number;
  openTickets: number;
};

export type CustomerQueryOptions = {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
};

export type AdminCustomer = {
  id: string;
  email: string;
  name?: string;
  companyName?: string;
  phone?: string;
  address?: string;
  status: string;
  isVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  orders?: {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    shippingAddress?: string;
    inquiry?: {
      boardType?: string;
      layers?: number;
      quantity?: number;
      fileUrls?: string[];
    };
  }[];
  inquiries?: {
    id: string;
    boardType?: string;
    layers?: number;
    quantity?: number;
    estimatedPrice?: number;
    status: string;
    createdAt: string;
    fileUrls?: string[];
  }[];
  _count?: {
    orders: number;
    tickets: number;
    reviews: number;
    inquiries?: number;
  };
};

export type AdminInventoryProduct = {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  images: string[];
  updatedAt: string;
};

export type ProductCategoryRecord = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type BrandRecord = {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  website?: string;
  category?: string;
  description?: string;
  country?: string;
  status: string;
  isVerified: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type ReportStats = {
  totalOrders: number;
  totalInquiries: number;
  totalCustomers: number;
  totalProducts: number;
  totalRevenue: number;
  pendingRevenue: number;
  inventoryValuation: number;
  averageOrderValue: number;
  statusCounts: Record<string, number>;
  boardTypeCounts: Record<string, number>;
  boardTypeDistribution?: {
    name: string;
    count: number;
    percentage: number;
  }[];
  monthlyTrends?: {
    month: string;
    revenue: number;
    orders: number;
    inquiries: number;
  }[];
  dailyTrends?: {
    day: string;
    revenue: number;
    orders: number;
  }[];
  recentOrders: {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    inquiry?: {
      boardType?: string;
      layers?: number;
      quantity?: number;
    };
  }[];
};

export type ReportHistoryRecord = {
  id: string;
  name: string;
  type: string;
  dateRange: string;
  format: string;
  status: string;
  fileUrl?: string;
  createdAt: string;
};

export type AdminCoupon = {
  id: string;
  code: string;
  discountPercentage: number;
  maxDiscount?: number | null;
  validUntil: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AdminCouponsResponse = {
  summary: {
    total: number;
    active: number;
    expired: number;
    inactive: number;
  };
  coupons: AdminCoupon[];
};

export const AdminService = {
  getOverview: () => apiRequest<AdminOverview>("/admin/overview"),

  getCustomers: (query?: CustomerQueryOptions) => {
    if (!query) return apiRequest<AdminCustomer[]>("/admin/customers");
    const params = new URLSearchParams();
    if (query.page) params.set("page", String(query.page));
    if (query.limit) params.set("limit", String(query.limit));
    if (query.status && query.status !== "ALL") params.set("status", query.status);
    if (query.search) params.set("search", query.search);
    const qs = params.toString();
    return apiRequest<AdminCustomer[]>(`/admin/customers${qs ? `?${qs}` : ""}`);
  },

  getCustomersWithPagination: (query?: CustomerQueryOptions) => {
    const params = new URLSearchParams();
    if (query?.page) params.set("page", String(query.page));
    if (query?.limit) params.set("limit", String(query.limit));
    if (query?.status && query.status !== "ALL") params.set("status", query.status);
    if (query?.search) params.set("search", query.search);
    const qs = params.toString();
    return apiRequestWithMeta<AdminCustomer[]>(`/admin/customers${qs ? `?${qs}` : ""}`);
  },

  getCustomerById: (userId: string) => apiRequest<AdminCustomer>(`/admin/customers/${userId}`),

  updateCustomerStatus: (userId: string, status: "ACTIVE" | "INACTIVE" | "BLOCKED" | "DELETED") =>
    apiRequest<AdminCustomer>(`/admin/customers/${userId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  getInventory: () => apiRequest<AdminInventoryProduct[]>("/admin/inventory"),

  updateInventoryStock: (productId: string, payload: { stock: number; status?: string }) =>
    apiRequest<AdminInventoryProduct>(`/admin/inventory/${productId}/stock`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  seedInventory: () =>
    apiRequest<AdminInventoryProduct[]>("/admin/inventory/seed", {
      method: "POST",
    }),

  getCategories: () => apiRequest<ProductCategoryRecord[]>("/admin/categories"),

  createCategory: (payload: { name: string; slug?: string; description?: string; icon?: string; order?: number }) =>
    apiRequest<ProductCategoryRecord>("/admin/categories", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateCategory: (id: string, payload: { name?: string; slug?: string; description?: string; icon?: string; order?: number }) =>
    apiRequest<ProductCategoryRecord>(`/admin/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  deleteCategory: (id: string) =>
    apiRequest<ProductCategoryRecord>(`/admin/categories/${id}`, {
      method: "DELETE",
    }),

  getBrands: () => apiRequest<BrandRecord[]>("/admin/brands"),

  createBrand: (payload: {
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
  }) =>
    apiRequest<BrandRecord>("/admin/brands", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateBrand: (
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
  ) =>
    apiRequest<BrandRecord>(`/admin/brands/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  deleteBrand: (id: string) =>
    apiRequest<BrandRecord>(`/admin/brands/${id}`, {
      method: "DELETE",
    }),

  seedBrands: () =>
    apiRequest<BrandRecord[]>("/admin/brands/seed", {
      method: "POST",
    }),

  getReportStats: () => apiRequest<ReportStats>("/admin/reports/stats"),

  getReportHistory: () => apiRequest<ReportHistoryRecord[]>("/admin/reports/history"),

  generateReport: (payload: { name: string; type: string; dateRange: string; format: string }) =>
    apiRequest<ReportHistoryRecord>("/admin/reports/generate", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getCoupons: (query?: { status?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (query?.status && query.status !== "ALL") params.set("status", query.status);
    if (query?.search) params.set("search", query.search);
    const qs = params.toString();
    return apiRequest<AdminCouponsResponse>(`/admin/coupons${qs ? `?${qs}` : ""}`);
  },

  createCoupon: (payload: {
    code: string;
    discountPercentage: number;
    maxDiscount?: number | null;
    validUntil: string;
    isActive?: boolean;
  }) =>
    apiRequest<AdminCoupon>("/admin/coupons", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateCoupon: (
    id: string,
    payload: {
      code?: string;
      discountPercentage?: number;
      maxDiscount?: number | null;
      validUntil?: string;
      isActive?: boolean;
    }
  ) =>
    apiRequest<AdminCoupon>(`/admin/coupons/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  deleteCoupon: (id: string) =>
    apiRequest<AdminCoupon>(`/admin/coupons/${id}`, {
      method: "DELETE",
    }),

  seedCoupons: () =>
    apiRequest<AdminCoupon[]>("/admin/coupons/seed", {
      method: "POST",
    }),
};
