import { apiRequest } from "./api-client";

export const CartService = {
  addToCart: (payload: { productId: string; quantity: number }) =>
    apiRequest("/cart", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getMyCart: () => apiRequest("/cart"),

  updateCartItem: (cartItemId: string, quantity: number) =>
    apiRequest(`/cart/${cartItemId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    }),

  removeCartItem: (cartItemId: string) =>
    apiRequest(`/cart/${cartItemId}`, {
      method: "DELETE",
    }),
};
