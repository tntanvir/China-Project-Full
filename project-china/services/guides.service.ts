import { apiRequest } from "./api-client";
import {
  DEFAULT_ENGINEERING_GUIDES,
  type EngineeringGuideItem,
} from "@/lib/engineering-guides";

function buildGuideFormData(payload: Partial<EngineeringGuideItem>, imageFile?: File | null): FormData {
  const formData = new FormData();
  if (payload.title !== undefined) formData.append("title", payload.title);
  if (payload.description !== undefined) formData.append("description", payload.description);
  if (payload.content !== undefined) formData.append("content", payload.content);
  if (payload.tag !== undefined) formData.append("tag", payload.tag);
  if (payload.readTime !== undefined) formData.append("readTime", payload.readTime);
  if (payload.author !== undefined) formData.append("author", payload.author);
  if (payload.imageUrl !== undefined) formData.append("imageUrl", payload.imageUrl);
  if (imageFile) formData.append("image", imageFile);
  return formData;
}

export const GuidesService = {
  getPublicGuides: async (): Promise<EngineeringGuideItem[]> => {
    try {
      const data = await apiRequest<EngineeringGuideItem[]>("/products/engineering-guides", {
        cache: "no-store",
      });
      return Array.isArray(data) && data.length > 0 ? data : DEFAULT_ENGINEERING_GUIDES;
    } catch {
      return DEFAULT_ENGINEERING_GUIDES;
    }
  },

  getAdminGuides: async (): Promise<EngineeringGuideItem[]> => {
    const data = await apiRequest<EngineeringGuideItem[]>("/admin/engineering-guides", {
      cache: "no-store",
    });
    return Array.isArray(data) ? data : DEFAULT_ENGINEERING_GUIDES;
  },

  createGuide: async (
    payload: Partial<EngineeringGuideItem>,
    imageFile?: File | null
  ): Promise<EngineeringGuideItem> => {
    return apiRequest<EngineeringGuideItem>("/admin/engineering-guides", {
      method: "POST",
      body: buildGuideFormData(payload, imageFile),
    });
  },

  updateGuide: async (
    id: string,
    payload: Partial<EngineeringGuideItem>,
    imageFile?: File | null
  ): Promise<EngineeringGuideItem> => {
    return apiRequest<EngineeringGuideItem>(`/admin/engineering-guides/${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: buildGuideFormData(payload, imageFile),
    });
  },

  deleteGuide: async (id: string): Promise<{ deletedId: string }> => {
    return apiRequest<{ deletedId: string }>(`/admin/engineering-guides/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },

  resetGuides: async (): Promise<EngineeringGuideItem[]> => {
    return apiRequest<EngineeringGuideItem[]>("/admin/engineering-guides/reset", {
      method: "POST",
    });
  },
};
