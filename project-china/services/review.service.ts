import { apiRequest } from "./api-client";

export type ReviewRecord = {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name?: string;
    email: string;
    profilePhoto?: string;
  };
  product?: {
    id: string;
    name: string;
    slug: string;
  };
};

export const ReviewService = {
  getAllReviews: () => apiRequest<ReviewRecord[]>("/reviews"),

  getProductReviews: (productId: string) =>
    apiRequest<{ summary: { averageRating: number; totalReviews: number }; reviews: ReviewRecord[] }>(`/reviews/products/${productId}`),

  canReviewProduct: (productId: string) =>
    apiRequest<{ canReview: boolean; hasPurchased: boolean; hasReviewed: boolean }>(`/reviews/products/${productId}/can-review`),

  createReview: (productId: string, payload: { rating: number; comment?: string }) =>
    apiRequest<ReviewRecord>(`/reviews/products/${productId}`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateReview: (id: string, payload: { rating?: number; comment?: string }) =>
    apiRequest<ReviewRecord>(`/reviews/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),

  deleteReview: (id: string) =>
    apiRequest<ReviewRecord>(`/reviews/${id}`, {
      method: "DELETE",
    }),
};
