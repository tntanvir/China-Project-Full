import { apiRequest } from "./api-client";

export const GerberService = {
  uploadFiles: (files: File[], quoteId?: string) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    if (quoteId) {
      formData.append("quoteId", quoteId);
    }

    return apiRequest("/gerber-files/upload", {
      method: "POST",
      body: formData,
    });
  },

  uploadPublicInquiry: (
    files: File[],
    payload?: {
      fullName?: string;
      email?: string;
      companyName?: string;
      phone?: string;
      boardType?: string;
      description?: string;
      length?: number | string;
      width?: number | string;
      quantity?: number | string;
      layers?: number | string;
      thickness?: number | string;
      material?: string;
      surfaceFinish?: string;
      solderMaskColor?: string;
      totalAmount?: number | string;
    },
  ) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    Object.entries(payload || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") formData.append(key, String(value));
    });

    return apiRequest<{
      inquiry: { id: string; createdAt: string };
      order?: { id: string; totalAmount: number; status: string; createdAt: string };
      files: { fileName: string; fileUrl: string; fileSize: number }[];
    }>("/gerber-files/public-upload", {
      method: "POST",
      body: formData,
    });
  },

  getMyFiles: () => apiRequest("/gerber-files/my"),

  getAllFiles: () => apiRequest("/gerber-files"),

  getFileById: (gerberId: string) => apiRequest(`/gerber-files/${gerberId}`),

  reviewFile: (gerberId: string, payload: { status: "REVIEWING" | "APPROVED" | "REJECTED"; message?: string }) =>
    apiRequest(`/gerber-files/${gerberId}/review`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  deleteFile: (gerberId: string) =>
    apiRequest(`/gerber-files/${gerberId}`, {
      method: "DELETE",
    }),
};