"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  CreditCard,
  Database,
  LockKeyhole,
  PackageCheck,
  RefreshCcw,
  Settings,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SuperAdminService, type MonitoringStatus, type SecurityCenter, type SuperAdminOverview } from "@/services/super-admin.service";

const numberFormatter = new Intl.NumberFormat("en-US");

function money(value = 0, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}

function shortId(id: string) {
  return id.slice(0, 8).toUpperCase();
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex min-h-44 items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 text-center">
      <p className="max-w-xs text-sm font-semibold text-muted-foreground">{text}</p>
    </div>
  );
}

export default function SuperAdminCommandCenter() {
  const [overview, setOverview] = useState<SuperAdminOverview | null>(null);
  const [monitoring, setMonitoring] = useState<MonitoringStatus | null>(null);
  const [security, setSecurity] = useState<SecurityCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [overviewResult, monitoringResult, securityResult] = await Promise.all([
        SuperAdminService.getOverview(),
        SuperAdminService.getMonitoring().catch(() => null),
        SuperAdminService.getSecurityCenter().catch(() => null),
      ]);
      setOverview(overviewResult);
      setMonitoring(monitoringResult);
      setSecurity(securityResult);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Super Admin dashboard load failed.");
      setOverview(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    async function loadInitialDashboard() {
      try {
        const [overviewResult, monitoringResult, securityResult] = await Promise.all([
          SuperAdminService.getOverview(),
          SuperAdminService.getMonitoring().catch(() => null),
          SuperAdminService.getSecurityCenter().catch(() => null),
        ]);

        if (active) {
          setOverview(overviewResult);
          setMonitoring(monitoringResult);
          setSecurity(securityResult);
        }
      } catch (error) {
        if (active) {
          toast.error(error instanceof Error ? error.message : "Super Admin dashboard load failed.");
          setOverview(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadInitialDashboard();

    return () => {
      active = false;
    };
  }, []);

  const statCards = useMemo(() => {
    const totals = overview?.totals;

    return [
      { label: "Total Revenue", value: money(totals?.revenue || 0), helper: "Paid platform volume", icon: TrendingUp, tone: "from-emerald-500/20 via-teal-500/10 to-transparent", iconBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400" },
      { label: "Total Orders", value: numberFormatter.format(totals?.orders || 0), helper: `${totals?.pendingOrders || 0} pending review`, icon: PackageCheck, tone: "from-teal-500/20 via-emerald-500/10 to-transparent", iconBg: "bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400" },
      { label: "Active Clients", value: numberFormatter.format(totals?.customers || 0), helper: "Registered engineering buyers", icon: Users, tone: "from-indigo-500/20 via-indigo-500/10 to-transparent", iconBg: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400" },
      { label: "Catalog Parts", value: numberFormatter.format(totals?.products || 0), helper: `${totals?.lowStockProducts || 0} low stock items`, icon: Boxes, tone: "from-amber-500/20 via-amber-500/10 to-transparent", iconBg: "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400" },
      { label: "Admins", value: numberFormatter.format(totals?.admins || 0), helper: "Operational staff accounts", icon: ShieldCheck, tone: "from-emerald-500/20 via-emerald-500/10 to-transparent", iconBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400" },
      { label: "Transactions", value: numberFormatter.format(totals?.transactions || 0), helper: "Gateway verified transactions", icon: CreditCard, tone: "from-cyan-500/20 via-cyan-500/10 to-transparent", iconBg: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400" },
    ];
  }, [overview]);

  const revenueData = overview?.monthlyRevenue || [];
  const orderStatusData = overview?.orderStatus || [];
  const paymentMethodData = Object.entries(overview?.paymentMethods || {}).map(([method, count]) => ({ method, count }));

  return (
    <section className="space-y-6">
      {/* Super Admin Executive Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br from-white via-slate-50 to-emerald-50/50 p-6 sm:p-8 text-slate-900 shadow-sm dark:border-slate-800 dark:bg-gradient-to-br dark:from-[#0b1220] dark:via-[#070b14] dark:to-emerald-950/20 dark:text-white">
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-emerald-500/15 blur-[120px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-teal-500/10 blur-[100px]" />
        
        <div className="relative grid gap-6 xl:grid-cols-[1fr_370px] xl:items-center">
          <div>
            <Badge className="rounded-full border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-mono font-bold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5 mr-1 text-emerald-600 dark:text-emerald-400" />
              FEITIAN PCB • ENTERPRISE SUPER ADMIN
            </Badge>

            <h1 className="mt-4 text-2xl sm:text-4xl font-black tracking-tight">
              Executive Platform Command & Factory Infrastructure
            </h1>
            <p className="mt-2.5 max-w-2xl text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Global telemetry for revenue velocity, operational orders, security events, admin privilege delegations, and server cluster signals.
            </p>

            <div className="mt-5 flex flex-wrap gap-2.5">
              {[
                { label: "Admin Management", href: "/super-admin/admin-management" },
                { label: "Roles & RBAC", href: "/super-admin/roles-permissions" },
                { label: "System Settings", href: "/super-admin/settings" },
                { label: "Security Center", href: "/super-admin/security-center" },
              ].map((item) => (
                <Button key={item.href} asChild size="sm" variant="outline" className="rounded-xl border-slate-300 bg-white hover:bg-slate-100 dark:border-slate-800 dark:bg-[#070b14] font-bold text-xs gap-1.5 shadow-2xs">
                  <Link href={item.href}>
                    <span>{item.label}</span>
                    <ArrowUpRight className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* System Pulse Panel */}
          <Card className="rounded-2xl border-slate-200/90 bg-white/90 shadow-xl dark:border-slate-800 dark:bg-[#0b1220]/90 backdrop-blur-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center justify-between text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  System Telemetry Pulse
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">HEALTHY</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400">Live operational server signals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {[
                { label: "Production API", value: monitoring?.api.status || "HEALTHY", icon: Database },
                { label: "Database Cluster", value: monitoring?.database.status || "CONNECTED", icon: Database },
                { label: "Blocked IP Threats", value: String(security?.summary.blockedUsers ?? 0), icon: LockKeyhole },
                { label: "Security Events (24h)", value: String(security?.summary.securityEvents ?? 0), icon: AlertTriangle },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/60 px-3.5 py-2.5">
                    <span className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <Icon className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                      {item.label}
                    </span>
                    <span className="text-xs font-mono font-black text-slate-900 dark:text-white">{item.value}</span>
                  </div>
                );
              })}
              <Button onClick={loadDashboard} disabled={loading} size="sm" className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs mt-2 cursor-pointer">
                <RefreshCcw className={`size-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
                <span>Refresh Telemetry Data</span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {statCards.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className={`overflow-hidden border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1220] shadow-2xs transition hover:-translate-y-0.5`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{item.label}</p>
                    <p className="mt-1.5 text-xl font-black text-slate-900 dark:text-white">{item.value}</p>
                    <p className="mt-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400">{item.helper}</p>
                  </div>
                  <div className={`flex size-9 items-center justify-center rounded-xl ${item.iconBg} shadow-2xs`}>
                    <Icon className="size-4.5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue & Actions Grid */}
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Card className="rounded-2xl border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-[#0b1220]">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">Revenue Growth Velocity</CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">Monthly confirmed transactions across global customer base.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {revenueData.length ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="superRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                    <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(value) => money(Number(value))} />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fill="url(#superRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState text="No paid payment records found yet. Revenue chart will appear when payments are completed." />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Super Admin controls without vendor-specific items.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {[
              { label: "Create Admin", href: "/super-admin/admin-management", icon: Users },
              { label: "Manage Roles", href: "/super-admin/roles-permissions", icon: ShieldCheck },
              { label: "Payment Control", href: "/super-admin/payments", icon: CreditCard },
              { label: "System Settings", href: "/super-admin/settings", icon: Settings },
              { label: "Audit Logs", href: "/super-admin/audit-logs", icon: LockKeyhole },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="flex items-center justify-between rounded-xl border border-border bg-background p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm">
                  <span className="flex items-center gap-3 text-sm font-black text-foreground">
                    <Icon className="h-4 w-4 text-primary" />
                    {item.label}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-2xl border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-[#0b1220]">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">Order Status Distribution</CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">Live counts grouped by manufacturing workflow status.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              {orderStatusData.length ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                  <BarChart data={orderStatusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.15)" />
                    <XAxis dataKey="status" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState text="No order records returned by backend yet." />
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-[#0b1220]">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">Payment Methods</CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">Stripe, PayPal, and verified gateway provider distribution.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {paymentMethodData.length ? (
              paymentMethodData.map((item) => (
                <div key={item.method} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/60 px-4 py-3">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.method}</span>
                  <span className="rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 px-3 py-0.5 text-xs font-mono font-bold">{item.count}</span>
                </div>
              ))
            ) : (
              <EmptyState text="No payment method records found yet." />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-2xl border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-[#0b1220]">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">Recent Customer Orders</CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">Latest customer orders from backend database.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                  <TableRow>
                    <TableHead className="text-xs font-bold">Order ID</TableHead>
                    <TableHead className="text-xs font-bold">Customer</TableHead>
                    <TableHead className="text-xs font-bold">Status</TableHead>
                    <TableHead className="text-xs font-bold">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overview?.recentOrders.length ? (
                    overview.recentOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40">
                        <TableCell className="font-mono text-xs font-bold text-slate-900 dark:text-white">{shortId(order.id)}</TableCell>
                        <TableCell className="text-xs">{order.user?.name || order.user?.email || "Customer"}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-500/30">
                            {order.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs font-black">{money(order.totalAmount)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={4} className="py-10 text-center text-xs text-slate-400">No recent orders found.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-[#0b1220]">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">Recent Transactions</CardTitle>
            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">Latest financial verification records.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {overview?.recentPayments.length ? (
              overview.recentPayments.map((payment) => (
                <div key={payment.id} className="rounded-xl border border-slate-100 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/50 p-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">{shortId(payment.id)}</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${payment.status === "PAID" ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-500/30" : "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-500/30"}`}>
                      {payment.status}
                    </span>
                  </div>
                  <div className="mt-2 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{payment.method}</p>
                      <p className="text-[10px] text-slate-400">{new Date(payment.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">{money(payment.amount, payment.currency || "USD")}</p>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState text="No recent payments." />
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

