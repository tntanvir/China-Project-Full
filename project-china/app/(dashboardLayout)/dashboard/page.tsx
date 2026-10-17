"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  FileArchive,
  PackageCheck,
  Settings,
  ShoppingCart,
  UserRound,
  ArrowRight,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  Clock,
  Layers,
  Cpu,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Headphones,
  Building2,
  MessageCircle,
  Truck,
  ExternalLink,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderService } from "@/services/order.service";
import { QuoteService } from "@/services/quote.service";
import { useAuthStore } from "@/store/authStore";

type OrderItem = {
  id?: string;
  orderNumber?: string;
  status?: string;
  totalAmount?: number;
  createdAt?: string;
  items?: Array<{ name?: string; quantity?: number }>;
};

type QuoteItem = {
  id?: string;
  name?: string;
  width?: number;
  height?: number;
  layerCount?: number;
  quantity?: number;
  totalPrice?: number;
  createdAt?: string;
};

function money(amount?: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount || 0);
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "Recent";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Recent";
  }
}

export default function CustomerDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [quotes, setQuotes] = useState<QuoteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadCustomerData() {
      setLoading(true);
      try {
        const [ordersRes, quotesRes] = await Promise.all([
          OrderService.getMyOrders().catch(() => []),
          QuoteService.getMyQuotes().catch(() => []),
        ]);

        if (!active) return;
        const safeOrders = Array.isArray(ordersRes) ? ordersRes : ((ordersRes as { data?: OrderItem[] })?.data || []);
        const safeQuotes = Array.isArray(quotesRes) ? quotesRes : ((quotesRes as { data?: QuoteItem[] })?.data || []);
        setOrders(safeOrders);
        setQuotes(safeQuotes);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCustomerData();
    return () => {
      active = false;
    };
  }, []);

  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const activeProduction = orders.filter((o) =>
      ["PAID", "GERBER_REVIEW", "ENGINEERING_REVIEW", "PRODUCTION", "QUALITY_CONTROL"].includes(o.status || "")
    ).length;
    const totalSpent = orders
      .filter((o) => o.status !== "CANCELLED")
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const savedQuotesCount = quotes.length;

    return { totalOrders, activeProduction, totalSpent, savedQuotesCount };
  }, [orders, quotes]);

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);
  const recentQuotes = useMemo(() => quotes.slice(0, 4), [quotes]);

  return (
    <div className="space-y-6">
      {/* Personalized Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br from-white via-slate-50 to-emerald-50/40 p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-gradient-to-br dark:from-[#0b1220] dark:via-[#070b14] dark:to-emerald-950/20">
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 h-60 w-60 rounded-full bg-cyan-500/10 blur-[90px]" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-mono font-bold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
              <Sparkles className="size-3 text-emerald-600 dark:text-emerald-400" />
              <span>Customer Workspace</span>
            </div>

            <h1 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Welcome back, {user?.name || "Hardware Engineer"}!
            </h1>
            <p className="mt-1.5 max-w-2xl text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Manage your rapid prototype PCB fabrications, submit Gerber DFM reviews, track factory production status, and manage invoices.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 font-medium">
                <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                Verified Account
              </span>
              <span>•</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">{user?.email}</span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Standard Tier • 24h Turnaround</span>
            </div>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              asChild
              className="h-11 px-5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Link href="/pcb-quote">
                <Plus className="size-4" />
                <span>Instant PCB Quote</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-11 px-4 rounded-xl border-slate-300 bg-white hover:bg-slate-100 text-slate-800 dark:border-slate-800 dark:bg-[#070b14] dark:hover:bg-slate-800 dark:text-slate-200 font-bold text-xs gap-2 shadow-2xs cursor-pointer"
            >
              <Link href="/dashboard/gerber">
                <UploadCloud className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span>Upload Gerber</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* KPI Stat Cards Grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Orders */}
        <Card className="rounded-2xl border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-[#0b1220] transition hover:-translate-y-0.5">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total PCB Orders</p>
                <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{metrics.totalOrders}</p>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">Lifetime manufactured</p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <PackageCheck className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: In Production */}
        <Card className="rounded-2xl border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-[#0b1220] transition hover:-translate-y-0.5">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">In Production</p>
                <p className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">{metrics.activeProduction}</p>
                <p className="mt-0.5 text-[11px] text-emerald-600/80 dark:text-emerald-400/80 font-medium">CAM & fab active</p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400">
                <Cpu className="size-5 animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Saved Quotes */}
        <Card className="rounded-2xl border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-[#0b1220] transition hover:-translate-y-0.5">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Saved Quotes</p>
                <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{metrics.savedQuotesCount}</p>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">Ready to manufacture</p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                <FileArchive className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Total Spent */}
        <Card className="rounded-2xl border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-[#0b1220] transition hover:-translate-y-0.5">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Investment</p>
                <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{money(metrics.totalSpent)}</p>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">Paid invoices</p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                <CreditCard className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* PCB Production Pipeline Visualizer */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs dark:border-slate-800 dark:bg-[#0b1220]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Truck className="size-4 text-emerald-600 dark:text-emerald-400" />
              Live Manufacturing & Delivery Lifecycle
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Every circuit board follows strict IPC Class 2/3 quality inspection.
            </p>
          </div>
          <Link
            href="/dashboard/orders"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center gap-1"
          >
            <span>Track All Orders</span>
            <ChevronRight className="size-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-500/30 dark:text-emerald-300">
            <span className="text-[10px] font-bold uppercase tracking-wider block text-emerald-700 dark:text-emerald-400">Step 1</span>
            <strong className="block font-bold mt-0.5">Gerber & DFM</strong>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400">AI & CAM verified</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">Step 2</span>
            <strong className="block font-bold mt-0.5">Laser Drilling</strong>
            <span className="text-[10px] text-slate-500">Micro-via precision</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">Step 3</span>
            <strong className="block font-bold mt-0.5">Copper Plating</strong>
            <span className="text-[10px] text-slate-500">1oz/2oz lamination</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">Step 4</span>
            <strong className="block font-bold mt-0.5">AOI Inspection</strong>
            <span className="text-[10px] text-slate-500">Automated optical</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 dark:bg-slate-900/60 dark:border-slate-800 dark:text-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">Step 5</span>
            <strong className="block font-bold mt-0.5">Air Dispatch</strong>
            <span className="text-[10px] text-slate-500">DHL/FedEx express</span>
          </div>
        </div>
      </section>

      {/* Main Grid: Recent Orders + Quick Quotes */}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Left Column: Recent Orders */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PackageCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                Recent Orders & Manufacturing Status
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Live order status from our fabrication line.</p>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700">
              <Link href="/dashboard/orders" className="flex items-center gap-1">
                <span>View All ({orders.length})</span>
                <ChevronRight className="size-3.5" />
              </Link>
            </Button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xs dark:border-slate-800 dark:bg-[#0b1220]">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500">
                <div className="size-5 mx-auto mb-2 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                Loading your orders...
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="p-8 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-900">
                  <PackageCheck className="size-6" />
                </div>
                <h4 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">No Orders Placed Yet</h4>
                <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                  Get your custom PCB prototype manufactured with direct factory pricing and 24-hour turnaround.
                </p>
                <Button asChild size="sm" className="mt-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs">
                  <Link href="/pcb-quote">Create First PCB Quote</Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentOrders.map((order) => {
                  const status = (order.status || "PENDING").toUpperCase();
                  const isPaid = status === "PAID" || status === "DELIVERED" || status === "PRODUCTION";

                  return (
                    <div key={order.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-900/50 transition">
                      <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 font-mono text-xs font-black">
                          PCB
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                              {order.orderNumber || `ORD-${order.id?.slice(0, 8).toUpperCase()}`}
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isPaid
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500/30"
                                  : "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-500/30"
                              }`}
                            >
                              {status}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            Placed on {formatDate(order.createdAt)} • {order.items?.length || 1} specification(s)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 pl-13 sm:pl-0">
                        <span className="text-sm font-black text-slate-900 dark:text-white">
                          {money(order.totalAmount)}
                        </span>
                        <Button asChild variant="outline" size="sm" className="h-8 rounded-lg text-xs font-bold">
                          <Link href={`/dashboard/orders`}>
                            Track
                          </Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Quotes & Support */}
        <div className="space-y-6">
          {/* Active Quotes Card */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <FileArchive className="size-4 text-emerald-600 dark:text-emerald-400" />
                  Saved PCB Quotes
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Quotes ready to convert into orders.</p>
              </div>
              <Link href="/dashboard/quotes" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                View all
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-[#0b1220] space-y-3">
              {recentQuotes.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-xs text-slate-500">No saved quotes right now.</p>
                  <Button asChild size="sm" variant="outline" className="mt-2.5 h-8 text-xs font-bold">
                    <Link href="/pcb-quote">Configure New Quote</Link>
                  </Button>
                </div>
              ) : (
                recentQuotes.map((q) => (
                  <div key={q.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/50 flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[140px]">
                        {q.name || "Custom FR4 Prototype"}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {q.width || 100}×{q.height || 100}mm • {q.layerCount || 2}L • {q.quantity || 5}pcs
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block">
                        {money(q.totalPrice || 17.0)}
                      </span>
                      <Button asChild size="sm" className="h-7 px-2.5 text-[10px] font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white mt-1">
                        <Link href="/pcb-quote">Order</Link>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Dedicated CAM Support & Assistance Card */}
          <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/80 to-teal-50/40 p-4 text-emerald-950 shadow-2xs dark:border-emerald-500/20 dark:bg-gradient-to-br dark:from-[#0b1220] dark:to-emerald-950/30 dark:text-slate-100">
            <div className="flex items-center gap-2">
              <Headphones className="size-4 text-emerald-600 dark:text-emerald-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Direct Engineering Support
              </h4>
            </div>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Need CAM file revisions, impedance control calculation, or special substrate stackup? Our engineers respond within 15 minutes.
            </p>

            <div className="mt-3 flex items-center gap-2">
              <Button asChild size="sm" className="h-8 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold gap-1.5 cursor-pointer">
                <a href="https://wa.me/8618928420600" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="size-3.5" />
                  <span>WhatsApp CAM</span>
                </a>
              </Button>
              <Button asChild variant="outline" size="sm" className="h-8 rounded-lg border-slate-300 bg-white text-xs font-bold dark:border-slate-800 dark:bg-slate-900">
                <Link href="/dashboard/support">Support Ticket</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <section className="pt-2">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
          Workspace Quick Navigation
        </h3>
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/payments" className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 dark:border-slate-800 dark:bg-[#0b1220] dark:hover:border-emerald-500/40 transition shadow-2xs group">
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 group-hover:scale-105 transition-transform mb-2.5">
              <CreditCard className="size-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Payments & Invoices</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Download receipts & tax statements.</p>
          </Link>

          <Link href="/dashboard/gerber" className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 dark:border-slate-800 dark:bg-[#0b1220] dark:hover:border-emerald-500/40 transition shadow-2xs group">
            <div className="flex size-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400 group-hover:scale-105 transition-transform mb-2.5">
              <UploadCloud className="size-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Gerber & CAD Files</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Review DFM design rule checks.</p>
          </Link>

          <Link href="/dashboard/address-book" className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 dark:border-slate-800 dark:bg-[#0b1220] dark:hover:border-emerald-500/40 transition shadow-2xs group">
            <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 group-hover:scale-105 transition-transform mb-2.5">
              <Building2 className="size-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Address Book</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Manage international delivery addresses.</p>
          </Link>

          <Link href="/dashboard/settings" className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 dark:border-slate-800 dark:bg-[#0b1220] dark:hover:border-emerald-500/40 transition shadow-2xs group">
            <div className="flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300 group-hover:scale-105 transition-transform mb-2.5">
              <Settings className="size-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Account Preferences</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Update security & notifications.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}

