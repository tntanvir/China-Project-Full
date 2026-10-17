import { cache } from "react";
import { apiRequest } from "./api-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export interface IProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  description?: string;
  specifications?: Record<string, unknown> | string;
  images: string[];
  minOrderQty?: number;
  leadTimeDays?: number;
  isFeatured: boolean;
  status: string;
  price?: number;
  stock?: number;
  rating?: number;
  reviewCount?: number;
}

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
}

export const ProductService = {
  getProducts: cache(async (): Promise<IApiResponse<IProduct[]>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        cache: "no-store",
        credentials: "include",
      });
      const payload = (await response.json()) as { success: boolean; message: string; data: IProduct[] };

      if (response.ok && payload.success && Array.isArray(payload.data)) {
        return {
          success: true,
          message: payload.message || "Products fetched successfully",
          meta: { page: 1, limit: payload.data.length, total: payload.data.length },
          data: payload.data,
        };
      }
    } catch {
      // Static products keep the site buildable when the backend is offline.
    }

    const { staticProducts } = await import("@/lib/static-products");

    return {
      success: true,
      message: "Loaded static products",
      meta: { page: 1, limit: staticProducts.length, total: staticProducts.length },
      data: staticProducts,
    };
  }),

  getProductBySlug: cache(async (slug: string): Promise<IApiResponse<IProduct> | null> => {
    const productsResponse = await ProductService.getProducts();
    const product = productsResponse.data.find((item) => item.slug === slug || item.id === slug);

    if (!product) {
      return null;
    }

    return {
      success: true,
      message: "Loaded static product",
      meta: { page: 1, limit: 1, total: 1 },
      data: product,
    };
  }),

  getProductById: cache(async (id: string) => {
    return apiRequest<IProduct>(`/products/${id}`);
  }),

  createProduct: async (payload: {
    name: string;
    category?: string;
    description?: string;
    price?: number;
    stock?: number;
    minOrderQty?: number;
    leadTimeDays?: number;
    status?: "DRAFT" | "ACTIVE" | "INACTIVE";
    isFeatured?: boolean;
    rating?: number;
    tags?: string[];
    specifications?: Record<string, unknown>;
    images?: File[];
  }) => {
    const formData = new FormData();
    formData.append("name", payload.name);
    if (payload.category) formData.append("category", payload.category);
    if (payload.description) formData.append("description", payload.description);
    if (payload.price !== undefined) formData.append("price", String(payload.price));
    if (payload.stock !== undefined) formData.append("stock", String(payload.stock));
    if (payload.minOrderQty !== undefined) formData.append("minOrderQty", String(payload.minOrderQty));
    if (payload.leadTimeDays !== undefined) formData.append("leadTimeDays", String(payload.leadTimeDays));
    if (payload.status) formData.append("status", payload.status);
    if (payload.isFeatured !== undefined) formData.append("isFeatured", String(payload.isFeatured));
    if (payload.rating !== undefined) formData.append("rating", String(payload.rating));
    if (payload.tags) formData.append("tags", JSON.stringify(payload.tags));
    if (payload.specifications) formData.append("specifications", JSON.stringify(payload.specifications));
    payload.images?.forEach((file) => formData.append("images", file));

    return apiRequest<IProduct>("/products", {
      method: "POST",
      body: formData,
    });
  },

  updateProduct: async (id: string, payload: Partial<IProduct> & { images?: File[] }) => {
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (key === "images" || value === undefined) return;
      formData.append(key, typeof value === "object" ? JSON.stringify(value) : String(value));
    });
    payload.images?.forEach((file) => formData.append("images", file));

    return apiRequest<IProduct>(`/products/${id}`, {
      method: "PATCH",
      body: formData,
    });
  },

  deleteProduct: async (id: string) =>
    apiRequest<IProduct>(`/products/${id}`, {
      method: "DELETE",
    }),
};
