"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IProduct } from "@/services/product.service";

export type CartItem = {
  product: IProduct;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (product: IProduct, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((item) => item.product.id === product.id);

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + Math.max(1, quantity) }
                  : item,
              ),
            };
          }

          return {
            items: [...state.items, { product, quantity: Math.max(1, quantity) }],
          };
        }),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item,
          ),
        })),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "pcb-ecommerce-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export function getCartSummary(items: CartItem[]) {
  const subtotal = items.reduce((total, item) => total + (item.product.price || 0) * item.quantity, 0);
  const discount = subtotal > 500 ? subtotal * 0.05 : 0;
  const shipping = subtotal > 0 && subtotal < 300 ? 25 : 0;

  return {
    uniqueCount: items.length,
    totalQuantity: items.reduce((total, item) => total + item.quantity, 0),
    subtotal,
    discount,
    shipping,
    grandTotal: subtotal - discount + shipping,
  };
}
