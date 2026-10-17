"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CreditCard, Loader2, ShieldCheck, WalletCards, CheckCircle2, ArrowRight, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CartService } from "@/services/cart.service";
import { OrderService } from "@/services/order.service";
import { PaymentService } from "@/services/payment.service";
import { useAuthStore } from "@/store/authStore";
import { getCartSummary, useCartStore } from "@/store/cartStore";

type PaymentMethod = "stripe" | "paypal" | "card_direct";
type CheckoutForm = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
};

type FormErrors = Partial<Record<keyof CheckoutForm | "paymentMethod" | "cart", string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^[+()\-\s0-9]{7,20}$/;

function validateCheckoutForm(form: CheckoutForm, paymentMethod: PaymentMethod, itemCount: number, hasOrderId: boolean) {
  const errors: FormErrors = {};

  if (!form.fullName.trim() || form.fullName.trim().length < 3) {
    errors.fullName = "Full name must be at least 3 characters.";
  }

  if (!emailPattern.test(form.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!phonePattern.test(form.phone.trim())) {
    errors.phone = "Please enter a valid phone number.";
  }

  if (!form.address.trim() || form.address.trim().length < 8) {
    errors.address = "Shipping address must be at least 8 characters.";
  }

  if (!form.city.trim() || form.city.trim().length < 2) {
    errors.city = "City name is required.";
  }

  if (form.postalCode.trim() && form.postalCode.trim().length < 3) {
    errors.postalCode = "Please enter a valid postal code.";
  }

  if (!["stripe", "paypal", "card_direct"].includes(paymentMethod)) {
    errors.paymentMethod = "Please select a valid payment method.";
  }

  if (!hasOrderId && itemCount < 1) {
    errors.cart = "Cart is empty. Please add products first.";
  }

  return errors;
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryOrderId = searchParams.get("orderId");
  const queryAmount = searchParams.get("amount");

  const user = useAuthStore((state) => state.user);
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const summary = getCartSummary(items);

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card_direct");
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});
  const [form, setForm] = useState<CheckoutForm>({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: "Dhaka",
    postalCode: "1207",
  });

  const hasOrderId = Boolean(queryOrderId);

  const handlePayNow = async () => {
    const errors = validateCheckoutForm(form, paymentMethod, items.length, hasOrderId);
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error(Object.values(errors)[0] || "Please complete checkout information.");
      return;
    }

    setLoading(true);
    try {
      const shippingAddress = `${form.fullName.trim()}, ${form.phone.trim()}, ${form.address.trim()}, ${form.city.trim()}, ${form.postalCode.trim()}`;

      // 1. Direct quote order payment
      if (queryOrderId) {
        if (paymentMethod === "stripe" || paymentMethod === "card_direct") {
          try {
            toast.info("Connecting to official Stripe Checkout page...");
            const checkout = await PaymentService.createStripeCheckout(queryOrderId);
            if (checkout.checkoutUrl) {
              toast.success("Redirecting to Stripe full page checkout...");
              window.location.href = checkout.checkoutUrl;
              return;
            }
          } catch (err) {
            console.warn("Direct Stripe session creation fallback:", err);
          }
        } else if (paymentMethod === "paypal") {
          try {
            toast.info("Connecting to PayPal Express...");
            const checkout = await PaymentService.createPayPalOrder(queryOrderId);
            if (checkout.checkoutUrl) {
              toast.success("Redirecting to PayPal...");
              window.location.href = checkout.checkoutUrl;
              return;
            }
          } catch (err) {
            console.warn("PayPal session creation fallback:", err);
          }
        }

        const params = new URLSearchParams({
          orderId: queryOrderId,
          provider: paymentMethod,
          amount: String(payableTotal),
          name: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
        });
        router.push(`/checkout/webhook?${params.toString()}`);
        return;
      }

      // 2. Standard Cart checkout
      let targetOrderId = "";
      if (user && items.length > 0) {
        for (const item of items) {
          await CartService.addToCart({ productId: item.product.id, quantity: item.quantity });
        }
        const order = (await OrderService.createOrderFromCart({
          shippingAddress,
          billingAddress: shippingAddress,
        })) as { id?: string };
        if (order?.id) {
          targetOrderId = order.id;
        }
      }

      if (targetOrderId && (paymentMethod === "stripe" || paymentMethod === "card_direct")) {
        try {
          toast.info("Connecting to official Stripe Checkout page...");
          const checkout = await PaymentService.createStripeCheckout(targetOrderId);
          if (checkout.checkoutUrl) {
            clearCart();
            toast.success("Redirecting to Stripe full page checkout...");
            window.location.href = checkout.checkoutUrl;
            return;
          }
        } catch (err) {
          console.warn("Cart Stripe session creation fallback:", err);
        }
      } else if (targetOrderId && paymentMethod === "paypal") {
        try {
          toast.info("Connecting to PayPal Express...");
          const checkout = await PaymentService.createPayPalOrder(targetOrderId);
          if (checkout.checkoutUrl) {
            clearCart();
            toast.success("Redirecting to PayPal...");
            window.location.href = checkout.checkoutUrl;
            return;
          }
        } catch (err) {
          console.warn("PayPal session creation fallback:", err);
        }
      }

      // Fallback redirect to webhook checkout gateway
      toast.info("Proceeding to Checkout Gateway...");
      const params = new URLSearchParams({
        ...(targetOrderId ? { orderId: targetOrderId } : {}),
        provider: paymentMethod,
        amount: String(payableTotal),
        name: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      });

      router.push(`/checkout/webhook?${params.toString()}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to process checkout.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (!items.length && !hasOrderId) {
    return (
      <main className="min-h-screen pt-28 pb-16 bg-[#0B0F17] text-white">
        <div className="container mx-auto max-w-xl text-center px-4">
          <div className="size-20 mx-auto rounded-3xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mb-5">
            <ShoppingBag className="size-10" />
          </div>
          <h1 className="text-3xl font-black">No items to checkout</h1>
          <p className="text-slate-400 text-sm mt-2 max-w-sm mx-auto">
            Your shopping cart is currently empty. Configure a custom PCB quote or browse factory products.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              <Link href="/pcb-quote">Quote Now</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl border-slate-700 text-slate-200">
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const payableTotal = hasOrderId
    ? Number(queryAmount) || 17.0
    : summary.grandTotal;

  return (
    <main className="min-h-screen pt-24 pb-20 bg-[#F4F6F9] dark:bg-[#0B0F17] text-slate-900 dark:text-white">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-2">
            <ShieldCheck className="size-3.5" />
            256-Bit SSL Factory Checkout
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Complete your order</h1>
          {hasOrderId && (
            <p className="text-xs text-gray-500 font-mono mt-1">
              Referencing Order: <strong>#{queryOrderId?.slice(0, 8).toUpperCase()}</strong>
            </p>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          {/* Customer Information Form */}
          <section className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-3">
              Delivery & Contact Details
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {[
                ["fullName", "Full Name", "Your full name"],
                ["email", "Email Address", "name@company.com"],
                ["phone", "Phone Number", "+1 (555) 000-0000"],
                ["city", "City / Region", "Dhaka"],
                ["postalCode", "Postal Code", "1207"],
              ].map(([key, label, placeholder]) => (
                <label key={key} className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{label}</span>
                  <Input
                    value={form[key as keyof typeof form]}
                    placeholder={placeholder}
                    aria-invalid={Boolean(fieldErrors[key as keyof CheckoutForm])}
                    className="h-9 text-xs"
                    onChange={(event) => {
                      const value = event.target.value;
                      setForm((current) => ({ ...current, [key]: value }));
                      setFieldErrors((current) => ({ ...current, [key]: undefined }));
                    }}
                  />
                  {fieldErrors[key as keyof CheckoutForm] ? (
                    <p className="text-[11px] font-semibold text-rose-500">{fieldErrors[key as keyof CheckoutForm]}</p>
                  ) : null}
                </label>
              ))}

              <label className="space-y-1.5 md:col-span-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Detailed Shipping Address</span>
                <Textarea
                  value={form.address}
                  placeholder="Street, suite, building, district, country"
                  rows={3}
                  className="text-xs"
                  onChange={(event) => {
                    setForm((current) => ({ ...current, address: event.target.value }));
                    setFieldErrors((current) => ({ ...current, address: undefined }));
                  }}
                />
                {fieldErrors.address ? <p className="text-[11px] font-semibold text-rose-500">{fieldErrors.address}</p> : null}
              </label>
            </div>
          </section>

          {/* Order Summary & Payment Method */}
          <aside className="h-fit rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-5">
            <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-3">
              Order Summary
            </h2>

            {hasOrderId ? (
              <div className="rounded-xl bg-gray-50 dark:bg-slate-800/60 p-3.5 border border-gray-200 dark:border-slate-700 space-y-1.5 text-xs">
                <div className="flex justify-between font-bold">
                  <span>Custom PCB Prototype:</span>
                  <span>${payableTotal.toFixed(2)}</span>
                </div>
                <div className="text-[11px] text-gray-500">
                  Turnaround: 24H Rapid Build • IPC Class 2/3
                </div>
              </div>
            ) : (
              <div className="space-y-3 max-h-56 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3 text-xs">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-slate-800">
                      <Image
                        src={item.product.images?.[0] || "/image/chinaproject.png"}
                        alt={item.product.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-slate-900 dark:text-white">{item.product.name}</p>
                      <p className="text-gray-500">Qty {item.quantity} × ${(item.product.price || 0).toFixed(2)}</p>
                    </div>
                    <p className="font-bold">${((item.product.price || 0) * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2 border-t border-gray-100 dark:border-slate-800 pt-3 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal:</span>
                <strong>${payableTotal.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>CAM DFM Check:</span>
                <strong className="text-emerald-600">$0.00 (FREE)</strong>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-gray-200 dark:border-slate-800 text-sm font-black">
                <span>Total Amount:</span>
                <strong className="text-2xl text-emerald-600 dark:text-emerald-400 font-black">
                  ${payableTotal.toFixed(2)}
                </strong>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2.5 pt-2 border-t border-gray-100 dark:border-slate-800">
              <p className="text-xs font-black uppercase tracking-wider text-gray-500">
                Select Payment Method
              </p>
              <div className="grid gap-2">
                {[
                  { id: "card_direct" as const, label: "Credit / Debit Card", note: "Instant 256-bit factory clearance", icon: CreditCard },
                  { id: "paypal" as const, label: "PayPal Express", note: "Pay via international PayPal account", icon: WalletCards },
                  { id: "stripe" as const, label: "Stripe Gateway", note: "Official Stripe hosted checkout", icon: ShieldCheck },
                ].map((method) => {
                  const Icon = method.icon;
                  const active = paymentMethod === method.id;

                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => {
                        setPaymentMethod(method.id);
                        setFieldErrors((current) => ({ ...current, paymentMethod: undefined }));
                      }}
                      className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition ${
                        active
                          ? "border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-500"
                          : "border-gray-200 dark:border-slate-800 hover:border-emerald-400 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300"
                      }`}
                    >
                      <Icon className="h-4 w-4 text-emerald-600" />
                      <span className="flex-1">
                        <span className="block text-xs font-extrabold">{method.label}</span>
                        <span className="block text-[10px] text-gray-400">{method.note}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs gap-2 shadow-md shadow-emerald-600/30"
              onClick={handlePayNow}
              disabled={loading}
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
              <span>Proceed to Webhook Checkout (${payableTotal.toFixed(2)})</span>
            </Button>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0B0F17] text-white">
          <Loader2 className="size-8 animate-spin text-emerald-500" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
