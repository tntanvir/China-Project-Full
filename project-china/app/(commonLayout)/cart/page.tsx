"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCartStore, getCartSummary } from "@/store/cartStore";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const summary = getCartSummary(items);

  if (!items.length) {
    return (
      <main className="premium-section min-h-screen">
        <div className="premium-container">
          <div className="mx-auto max-w-2xl rounded-lg border border-border bg-card p-10 text-center shadow-sm">
            <ShoppingBag className="mx-auto mb-5 h-16 w-16 text-muted-foreground" />
            <h1 className="text-3xl font-black text-foreground">Your cart is empty</h1>
            <p className="mt-3 text-muted-foreground">Browse PCB products and add items to start your order.</p>
            <Button asChild className="mt-6 rounded-full">
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="premium-section min-h-screen">
      <div className="premium-container">
        <div className="mb-8">
          <p className="premium-eyebrow">Shopping Cart</p>
          <h1 className="mt-4 text-4xl font-black text-foreground">Review your PCB order</h1>
          <p className="mt-2 text-muted-foreground">Unique products: {summary.uniqueCount}. Quantity can change without changing navbar badge count.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {items.map((item) => (
              <article key={item.product.id} className="rounded-lg border border-border bg-card p-4 shadow-sm">
                <div className="grid gap-4 sm:grid-cols-[120px_1fr_auto] sm:items-center">
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={item.product.images?.[0] || "/image/chinaproject.png"}
                      alt={item.product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 120px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wider text-primary">{item.product.category}</p>
                    <h2 className="mt-1 text-xl font-black text-foreground">{item.product.name}</h2>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.product.description}</p>
                    <p className="mt-3 text-lg font-black text-foreground">${(item.product.price || 0).toFixed(2)}</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center rounded-full border border-border bg-background">
                      <button className="p-2" onClick={() => updateQuantity(item.product.id, item.quantity - 1)} aria-label="Decrease quantity">
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-10 text-center text-sm font-black">{item.quantity}</span>
                      <button className="p-2" onClick={() => updateQuantity(item.product.id, item.quantity + 1)} aria-label="Increase quantity">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-right text-sm font-bold text-muted-foreground">Subtotal ${(item.quantity * (item.product.price || 0)).toFixed(2)}</p>
                    <Button variant="outline" className="rounded-full text-destructive hover:text-destructive" onClick={() => removeItem(item.product.id)}>
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="h-fit rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-black text-foreground">Cart Summary</h2>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between"><span>Total Products</span><strong>{summary.uniqueCount}</strong></div>
              <div className="flex justify-between"><span>Total Quantity</span><strong>{summary.totalQuantity}</strong></div>
              <div className="flex justify-between"><span>Subtotal</span><strong>${summary.subtotal.toFixed(2)}</strong></div>
              <div className="flex justify-between text-success"><span>Discount</span><strong>-${summary.discount.toFixed(2)}</strong></div>
              <div className="flex justify-between"><span>Shipping</span><strong>${summary.shipping.toFixed(2)}</strong></div>
              <div className="border-t border-border pt-3 text-lg">
                <div className="flex justify-between"><span>Grand Total</span><strong>${summary.grandTotal.toFixed(2)}</strong></div>
              </div>
            </div>
            <Button asChild className="mt-6 w-full rounded-full">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          </aside>
        </div>
      </div>
    </main>
  );
}
