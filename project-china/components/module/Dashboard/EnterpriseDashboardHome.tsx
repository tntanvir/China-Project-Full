"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  CheckCircle2,
  CreditCard,
  Database,
  LineChart,
  PackageCheck,
  ShieldCheck,
  ShoppingBag,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderService } from "@/services/order.service";
import { PaymentService, type PaymentRecord } from "@/services/payment.service";
import { ProductService, type IProduct } from "@/services/product.service";

type DashboardMode = "admin" | "super-admin";

type OrderLike = {
  id?: string;
  status?: string;
  totalAmount?: number;
  createdAt?: string;
};

const chartColors = ["#10b981", "#0d9488", "#06b6d4", "#6366f1", "#f59e0b"];

function money(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function shortId(value?: string) {
  return value ? value.slice(0, 8).toUpperCase() : "N/A";
}

function StatCard({
  title,
  value,
  caption,
  icon: Icon,
  tone = "primary",
}: {
  title: string;
  value: string;
  caption: string;
  icon: typeof Boxes;
  tone?: "primary" | "success" | "warning" | "danger";
}) {
  const toneClass = {
    primary: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
    success: "bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-400",
    warning: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
    danger: "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400",
  }[tone];

  return (
    <Card className="group overflow-hidden border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1220] shadow-2xs transition hover:-translate-y-0.5">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
            <p className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">{value}</p>
            <p className="mt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">{caption}</p>
          </div>
          <div className={`flex size-11 items-center justify-center rounded-xl ${toneClass}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyPanel({ title }: { title: string }) {
  return (
    <div className="flex min-h-56 items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#070b14]/50 text-center">
      <div>
        <p className="text-xs font-bold text-slate-900 dark:text-white">{title}</p>
        <p className="mt-1 text-[11px] text-slate-500">Live operational data will synchronize as orders are placed.</p>
      </div>
    </div>
  );
}

export default function EnterpriseDashboardHome({ mode }: { mode: DashboardMode }) {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [orders, setOrders] = useState<OrderLike[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const isSuperAdmin = mode === "super-admin";

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      try {
        const [productResponse, orderResponse, paymentResponse] = await Promise.all([
          ProductService.getProducts(),
          OrderService.getMyOrders().catch(() => []),
          (isSuperAdmin ? PaymentService.getTransactions() : PaymentService.getPaymentHistory()).catch(() => []),
        ]);

        if (!active) return;
        setProducts(productResponse.data || []);
        setOrders(Array.isArray(orderResponse) ? (orderResponse as OrderLike[]) : []);
        setPayments(Array.isArray(paymentResponse) ? (paymentResponse as PaymentRecord[]) : []);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      active = false;
    };
  }, [isSuperAdmin]);

  const analytics = useMemo(() => {
    const totalRevenue = payments.reduce((sum, item) => sum + (item.status === "PAID" ? item.amount || 0 : 0), 0);
    const monthlyRevenue = payments
      .filter((item) => item.status === "PAID")
      .reduce((sum, item) => sum + (item.amount || 0), 0);
    const pendingOrders = orders.filter((item) => item.status === "PENDING").length;
    const processingOrders = orders.filter((item) => ["PAID", "PRODUCTION", "PROCESSING", "QUALITY_CONTROL"].includes(item.status || "")).length;
    const deliveredOrders = orders.filter((item) => item.status === "DELIVERED").length;
    const cancelledOrders = orders.filter((item) => item.status === "CANCELLED").length;
    const lowStock = products.filter((item) => (item.stock || 0) > 0 && (item.stock || 0) <= 10).length;
    const outOfStock = products.filter((item) => (item.stock || 0) <= 0).length;

    return { totalRevenue, monthlyRevenue, pendingOrders, processingOrders, deliveredOrders, cancelledOrders, lowStock, outOfStock };
  }, [orders, payments, products]);

  const revenueData = useMemo(() => {
    const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const paidPayments = payments.filter((item) => item.status === "PAID");

    return labels.map((month, index) => {
      const value = paidPayments
        .filter((payment) => (payment.createdAt ? new Date(payment.createdAt).getMonth() : index) === index)
        .reduce((sum, payment) => sum + (payment.amount || 0), 0);

      return {
        month,
        revenue: value,
        orders: orders.filter((order) => order.createdAt && new Date(order.createdAt).getMonth() === index).length,
      };
    });
  }, [orders, payments]);

  const hasRevenueData = revenueData.some((item) => item.revenue > 0 || item.orders > 0);

  const paymentMethodData = useMemo(() => {
    const methods = ["STRIPE", "PAYPAL", "BANK", "MANUAL"];
    return methods
      .map((method) => ({
        name: method,
        value: payments.filter((payment) => payment.method === method).length,
      }))
      .filter((item) => item.value > 0);
  }, [payments]);

  const productPerformance = useMemo(
    () =>
      products.slice(0, 6).map((product) => ({
        name: product.name.length > 18 ? `${product.name.slice(0, 18)}...` : product.name,
        stock: product.stock || 0,
        price: product.price || 0,
      })),
    [products],
  );

  const statCards = [
    { title: "Total Orders", value: String(orders.length), caption: "All visible orders", icon: PackageCheck, tone: "primary" as const },
    { title: "Pending Orders", value: String(analytics.pendingOrders), caption: "Awaiting CAM review", icon: Activity, tone: "warning" as const },
    { title: "Active Processing", value: String(analytics.processingOrders), caption: "In fabrication line", icon: Zap, tone: "primary" as const },
    { title: "Delivered", value: String(analytics.deliveredOrders), caption: "Shipped & confirmed", icon: ShoppingBag, tone: "success" as const },
    { title: "Cancelled", value: String(analytics.cancelledOrders), caption: "Terminated requests", icon: AlertTriangle, tone: "danger" as const },
    { title: "Catalog Items", value: String(products.length), caption: "Materials & components", icon: Boxes, tone: "primary" as const },
    { title: "Total Revenue", value: money(analytics.totalRevenue), caption: "Paid volume confirmed", icon: CreditCard, tone: "success" as const },
    { title: isSuperAdmin ? "Transactions" : "Low Stock Items", value: isSuperAdmin ? String(payments.length) : String(analytics.lowStock), caption: isSuperAdmin ? "Backend transactions" : "Requires replenishment", icon: isSuperAdmin ? Database : TrendingUp, tone: "warning" as const },
  ];

  return (
    <div className="space-y-6">
      {/* Admin Executive Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br from-white via-slate-50 to-emerald-50/50 p-6 sm:p-8 text-slate-900 shadow-sm dark:border-slate-800 dark:bg-gradient-to-br dark:from-[#0b1220] dark:via-[#070b14] dark:to-emerald-950/20 dark:text-white">
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-emerald-500/15 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-teal-500/10 blur-[100px]" />
        
        <div className="relative grid gap-6 lg:grid-cols-[1fr_380px] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{isSuperAdmin ? "Super Admin Command Cockpit" : "Operations Admin Command"}</span>
            </div>

            <h1 className="mt-4 text-2xl sm:text-4xl font-black tracking-tight">
              {isSuperAdmin ? "Platform Operations & Executive Telemetry" : "Run Daily PCB Operations with Precision"}
            </h1>
            <p className="mt-2.5 max-w-2xl text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Real-time analytics, rapid order dispatch, payment verification, catalog controls, and factory queue monitoring in one unified portal.
            </p>

            <div className="mt-5 flex flex-wrap gap-2.5">
              <Button asChild size="sm" className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5 shadow-md shadow-emerald-500/20">
                <Link href="/admin/orders">
                  <PackageCheck className="size-3.5" />
                  <span>Orders Manager</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="rounded-xl border-slate-300 bg-white dark:border-slate-800 dark:bg-[#070b14] font-bold text-xs gap-1.5 shadow-2xs">
                <Link href="/admin/customers">
                  <span>Customer Accounts</span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="rounded-xl border-slate-300 bg-white dark:border-slate-800 dark:bg-[#070b14] font-bold text-xs gap-1.5 shadow-2xs">
                <Link href="/admin/payments">
                  <span>Payment Records</span>
                </Link>
              </Button>
            </div>
          </div>

          <Card className="rounded-2xl border-slate-200/90 bg-white/90 shadow-xl dark:border-slate-800 dark:bg-[#0b1220]/90 backdrop-blur-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <LineChart className="size-4 text-emerald-600 dark:text-emerald-400" />
                Monthly Revenue Velocity
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">Paid transaction volume</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{money(analytics.monthlyRevenue)}</p>
              {loading ? <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 animate-pulse">Synchronizing live records...</p> : null}
              <Progress value={Math.min(100, (analytics.monthlyRevenue / 5000) * 100)} className="mt-4 h-2 bg-slate-100 dark:bg-slate-800" />
              <div className="mt-4 grid grid-cols-3 gap-2.5 text-center text-xs">
                <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 p-2.5 border border-slate-100 dark:border-slate-800">
                  <p className="font-black text-slate-900 dark:text-white">{orders.length}</p>
                  <p className="text-[10px] text-slate-500">Orders</p>
                </div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 p-2.5 border border-slate-100 dark:border-slate-800">
                  <p className="font-black text-slate-900 dark:text-white">{payments.length}</p>
                  <p className="text-[10px] text-slate-500">Transactions</p>
                </div>
                <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 p-2.5 border border-slate-100 dark:border-slate-800">
                  <p className="font-black text-slate-900 dark:text-white">{analytics.outOfStock}</p>
                  <p className="text-[10px] text-slate-500">Stock Alert</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* KPI Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </section>

      {/* Charts Grid */}
      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <Card className="rounded-2xl border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-[#0b1220]">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">Revenue Analytics</CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">Monthly confirmed revenue and order movements.</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm" className="rounded-xl text-xs font-bold">
              <Link href="/admin/reports" className="flex items-center gap-1.5">
                <span>Detailed Reports</span>
                <ArrowUpRight className="size-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {hasRevenueData ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                    <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(value) => money(Number(value))} />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fill="url(#revenueGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <EmptyPanel title="No backend revenue data" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Stripe, PayPal and other provider distribution.</CardDescription>
          </CardHeader>
          <CardContent>
            {paymentMethodData.length ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                  <PieChart>
                    <Pie data={paymentMethodData} innerRadius={62} outerRadius={96} paddingAngle={4} dataKey="value">
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyPanel title="No payment method data" />
            )}
            <div className="mt-4 grid gap-2">
              {paymentMethodData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2 text-sm">
                  <span className="flex items-center gap-2 font-bold">
                    <span className="size-2 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }} />
                    {item.name}
                  </span>
                  <span className="text-muted-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Trends</CardTitle>
            <CardDescription>Monthly order movement and demand curve.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              {hasRevenueData ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                  <RechartsLineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="orders" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              ) : (
                <EmptyPanel title="No backend order trend data" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Performance</CardTitle>
            <CardDescription>Top product stock and catalog value signal.</CardDescription>
          </CardHeader>
          <CardContent>
            {productPerformance.length ? (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                  <BarChart data={productPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Bar dataKey="stock" fill="#2563eb" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyPanel title="No products found" />
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Newest visible orders from backend.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.slice(0, 6).length ? (
                    orders.slice(0, 6).map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-xs">{shortId(order.id)}</TableCell>
                        <TableCell><Badge variant="secondary">{order.status || "PENDING"}</Badge></TableCell>
                        <TableCell>{money(order.totalAmount || 0)}</TableCell>
                        <TableCell className="text-muted-foreground">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground">No orders available.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{isSuperAdmin ? "Platform Data Signals" : "Operational Alerts"}</CardTitle>
            <CardDescription>Only backend-backed counts are shown here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Low Stock Products", value: `${analytics.lowStock}`, icon: AlertTriangle, tone: analytics.lowStock ? "text-amber-500" : "text-emerald-500", progress: Math.max(0, Math.min(100, analytics.lowStock * 10)) },
              { label: "Out Of Stock Products", value: `${analytics.outOfStock}`, icon: Boxes, tone: analytics.outOfStock ? "text-destructive" : "text-emerald-500", progress: Math.max(0, Math.min(100, analytics.outOfStock * 10)) },
              { label: "Pending Orders", value: `${analytics.pendingOrders}`, icon: PackageCheck, tone: analytics.pendingOrders ? "text-amber-500" : "text-emerald-500", progress: Math.max(0, Math.min(100, analytics.pendingOrders * 10)) },
              { label: "Failed Payments", value: `${payments.filter((payment) => payment.status === "FAILED").length}`, icon: CreditCard, tone: payments.some((payment) => payment.status === "FAILED") ? "text-destructive" : "text-emerald-500", progress: Math.max(0, Math.min(100, payments.filter((payment) => payment.status === "FAILED").length * 10)) },
              { label: "Paid Payments", value: `${payments.filter((payment) => payment.status === "PAID").length}`, icon: CheckCircle2, tone: "text-emerald-500", progress: Math.max(0, Math.min(100, payments.filter((payment) => payment.status === "PAID").length * 10)) },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-lg border border-border bg-background p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="flex items-center gap-2 text-sm font-black text-foreground">
                      <Icon className={`h-4 w-4 ${item.tone}`} />
                      {item.label}
                    </p>
                    <span className="text-xs font-bold text-muted-foreground">{item.value}</span>
                  </div>
                  <Progress value={item.progress} />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

