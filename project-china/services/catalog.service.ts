import { apiRequest } from "./api-client";
import {
  DEFAULT_CATALOG_FAMILIES,
  type ProductFamilyItem,
} from "@/lib/catalog-families";

function buildCatalogFormData(payload: Partial<ProductFamilyItem>, imageFile?: File | null): FormData {
  const formData = new FormData();
  if (payload.title !== undefined) formData.append("title", payload.title);
  if (payload.subtitle !== undefined) formData.append("subtitle", payload.subtitle);
  if (payload.category !== undefined) formData.append("category", payload.category);
  if (payload.badge !== undefined) formData.append("badge", payload.badge);
  if (payload.turnaround !== undefined) formData.append("turnaround", payload.turnaround);
  if (payload.description !== undefined) formData.append("description", payload.description);
  if (payload.bestFor !== undefined) formData.append("bestFor", payload.bestFor);
  if (payload.quoteUrl !== undefined) formData.append("quoteUrl", payload.quoteUrl);
  if (payload.imageUrl !== undefined) formData.append("imageUrl", payload.imageUrl);
  if (payload.specs !== undefined) formData.append("specs", JSON.stringify(payload.specs));
  if (imageFile) formData.append("image", imageFile);
  return formData;
}

export const CatalogService = {
  getPublicCatalogFamilies: async (): Promise<ProductFamilyItem[]> => {
    try {
      const data = await apiRequest<ProductFamilyItem[]>("/products/catalog-families", {
        cache: "no-store",
      });
      return Array.isArray(data) && data.length > 0 ? data : DEFAULT_CATALOG_FAMILIES;
    } catch {
      return DEFAULT_CATALOG_FAMILIES;
    }
  },

  getAdminCatalogFamilies: async (): Promise<ProductFamilyItem[]> => {
    const data = await apiRequest<ProductFamilyItem[]>("/admin/catalog-families", {
      cache: "no-store",
    });
    return Array.isArray(data) ? data : DEFAULT_CATALOG_FAMILIES;
  },

  createCatalogFamily: async (
    payload: Partial<ProductFamilyItem>,
    imageFile?: File | null
  ): Promise<ProductFamilyItem> => {
    return apiRequest<ProductFamilyItem>("/admin/catalog-families", {
      method: "POST",
      body: buildCatalogFormData(payload, imageFile),
    });
  },

  updateCatalogFamily: async (
    id: string,
    payload: Partial<ProductFamilyItem>,
    imageFile?: File | null
  ): Promise<ProductFamilyItem> => {
    return apiRequest<ProductFamilyItem>(`/admin/catalog-families/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: buildCatalogFormData(payload, imageFile),
    });
  },

  deleteCatalogFamily: async (id: string): Promise<{ deletedId: string }> => {
    return apiRequest<{ deletedId: string }>(`/admin/catalog-families/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },

  resetCatalogFamilies: async (): Promise<ProductFamilyItem[]> => {
    return apiRequest<ProductFamilyItem[]>("/admin/catalog-families/reset", {
      method: "POST",
    });
  },
};
