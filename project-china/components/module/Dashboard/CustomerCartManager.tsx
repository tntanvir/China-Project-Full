"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Minus,
  PackageCheck,
  Plus,
  RefreshCcw,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Trash2,
  Truck,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore, getCartSummary } from "@/store/cartStore";

export default function CustomerCartManager() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    setMounted(true);
  }, []);

  const summary = useMemo(() => getCartSummary(items), [items]);

  const handleUpdateQty = (productId: string, newQty: number) => {
    if (newQty < 1) {
      removeItem(productId);
      toast.info("Item removed from cart");
    } else {
      updateQuantity(productId, newQty);
    }
  };

  const handleRemove = (productId: string, name: string) => {
    removeItem(productId);
    toast.success(`Removed ${name} from cart`);
  };

  const handleClear = () => {
    if (confirm("Are you sure you want to empty your shopping cart?")) {
      clearCart();
      toast.info("Cart has been cleared");
    }
  };

  return (
    <div className="space-y-6">
      {/* Personalized Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br from-white via-slate-50 to-emerald-50/40 p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-gradient-to-br dark:from-[#0b1220] dark:via-[#070b14] dark:to-emerald-950/20">
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-mono font-bold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
              <ShoppingCart className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Order Preparation</span>
            </div>

            <h1 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              My Shopping Cart
            </h1>
            <p className="mt-1.5 max-w-2xl text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Review your selected PCB hardware items, adjust volume quantities, and proceed to factory fulfillment.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {items.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                className="h-10 rounded-xl border-slate-300 bg-white hover:bg-red-50 hover:text-red-600 text-slate-700 dark:border-slate-800 dark:bg-[#070b14] dark:hover:bg-red-950/40 dark:text-slate-200 font-bold text-xs gap-1.5"
              >
                <Trash2 className="size-3.5" />
                <span>Empty Cart</span>
              </Button>
            )}

            <Button
              asChild
              className="h-10 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs gap-2 shadow-lg shadow-emerald-500/20"
            >
              <Link href="/products">
                <Sparkles className="size-3.5" />
                <span>Browse Catalog</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* KPI Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-[#0b1220]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Unique Products</p>
                {!mounted ? (
                  <Skeleton className="h-8 w-16 mt-2 rounded-lg" />
                ) : (
                  <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{summary.uniqueCount}</p>
                )}
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">Board categories</p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <PackageCheck className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-[#0b1220]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Units</p>
                {!mounted ? (
                  <Skeleton className="h-8 w-16 mt-2 rounded-lg" />
                ) : (
                  <p className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">{summary.totalQuantity}</p>
                )}
                <p className="mt-0.5 text-[11px] text-emerald-600/80 dark:text-emerald-400/80 font-medium">Pieces queued</p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400">
                <Cpu className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-[#0b1220]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Shipping</p>
                {!mounted ? (
                  <Skeleton className="h-8 w-16 mt-2 rounded-lg" />
                ) : (
                  <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                    {summary.shipping === 0 ? "FREE" : `$${summary.shipping.toFixed(2)}`}
                  </p>
                )}
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">Standard express</p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <Truck className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-[#0b1220]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Estimated Total</p>
                {!mounted ? (
                  <Skeleton className="h-8 w-24 mt-2 rounded-lg" />
                ) : (
                  <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                    ${summary.grandTotal.toFixed(2)}
                  </p>
                )}
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">Incl. taxes & discounts</p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                <ShieldCheck className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Cart Content */}
      {!mounted ? (
        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
          <Card className="rounded-2xl border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-[#0b1220] space-y-4">
            <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-3.5 w-32 mt-2" />
            </div>
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-4 p-4 border border-slate-100 rounded-xl dark:border-slate-800">
                <Skeleton className="size-20 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-24 rounded-lg" />
                </div>
              </div>
            ))}
          </Card>
          <Card className="rounded-2xl border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-[#0b1220] space-y-4 h-fit">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-3 pt-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="border-t border-slate-100 pt-3 dark:border-slate-800 flex justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
            <Skeleton className="h-11 w-full rounded-xl mt-4" />
          </Card>
        </div>
      ) : items.length === 0 ? (
        <Card className="rounded-2xl border-slate-200 bg-white p-12 text-center shadow-2xs dark:border-slate-800 dark:bg-[#0b1220]">
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800/60 dark:text-slate-500 mb-4">
            <ShoppingBag className="size-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Your cart is currently empty</h3>
          <p className="mt-2 max-w-md mx-auto text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            You don&apos;t have any bare PCB products queued for purchase. Add items from our catalog or generate an instant custom fabrication quote.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-2"
            >
              <Link href="/products">
                <Sparkles className="size-3.5" />
                <span>Explore Bare PCB Catalog</span>
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-xl border-slate-300 dark:border-slate-800 text-xs font-bold"
            >
              <Link href="/pcb-quote">
                <span>Instant PCB Quote</span>
              </Link>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Cart Items List */}
          <div className="space-y-4">
            {items.map((item) => (
              <Card
                key={item.product.id}
                className="rounded-2xl border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-[#0b1220] transition hover:border-slate-300 dark:hover:border-slate-700"
              >
                <div className="grid gap-4 sm:grid-cols-[110px_1fr_auto] sm:items-center">
                  {/* Thumbnail */}
                  <div className="relative aspect-square w-full sm:w-[110px] overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <Image
                      src={item.product.images?.[0] || "/images/generated/multilayer_rigid_pcb.png"}
                      alt={item.product.name}
                      fill
                      sizes="110px"
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    <span className="inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">
                      {item.product.category || "PCB Product"}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                      {item.product.name}
                    </h3>
                    <p className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                      {item.product.description}
                    </p>
                    <div className="pt-2 flex items-center gap-2">
                      <span className="text-sm font-black text-slate-900 dark:text-white font-mono">
                        ${(item.product.price || 0).toFixed(2)}
                      </span>
                      <span className="text-[11px] text-slate-400">/ unit</span>
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 p-0.5">
                      <button
                        onClick={() => handleUpdateQty(item.product.id, item.quantity - 1)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
                        title="Decrease quantity"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-9 text-center text-xs font-bold font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQty(item.product.id, item.quantity + 1)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
                        title="Increase quantity"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="block font-mono text-xs font-black text-slate-900 dark:text-white">
                        ${(item.quantity * (item.product.price || 0)).toFixed(2)}
                      </span>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(item.product.id, item.product.name)}
                      className="h-7 px-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs gap-1"
                    >
                      <Trash2 className="size-3" />
                      <span className="hidden sm:inline">Remove</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Cart Summary Card */}
          <aside>
            <Card className="rounded-2xl border-slate-200 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-[#0b1220] space-y-5 sticky top-24">
              <CardTitle className="text-lg font-black text-slate-900 dark:text-white">
                Procurement Summary
              </CardTitle>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Product Lines</span>
                  <span className="font-bold text-slate-900 dark:text-white">{summary.uniqueCount}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Total Board Units</span>
                  <span className="font-bold text-slate-900 dark:text-white">{summary.totalQuantity} pcs</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    ${summary.subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Estimated Shipping</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {summary.shipping === 0 ? "FREE ($0.00)" : `$${summary.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Automated DFM Check</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Included</span>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
                  <div className="flex justify-between text-base font-black text-slate-900 dark:text-white">
                    <span>Grand Total</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">
                      ${summary.grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                asChild
                className="w-full h-11 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Link href="/checkout">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="size-4" />
                </Link>
              </Button>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-emerald-600" />
                  <span>IPC Class 2 & 3 Quality Assurance</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  <span>Secure 256-bit encrypted checkout</span>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      )}
    </div>
  );
}

