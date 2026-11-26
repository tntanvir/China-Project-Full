"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Cpu,
  Download,
  ExternalLink,
  Eye,
  FileArchive,
  FileText,
  Layers,
  Loader2,
  MessageCircle,
  PackageCheck,
  Phone,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
  XCircle,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { OrderService } from "@/services/order.service";
import { PaginationMeta } from "@/services/api-client";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/authStore";

type OrderItemRecord = {
  id: string;
  quantity: number;
  price: number;
  product?: {
    id: string;
    name: string;
    price: number;
  };
};

type InquiryRecord = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  companyName?: string;
  boardType?: string;
  length?: number;
  width?: number;
  quantity?: number;
  layers?: number;
  thickness?: number;
  material?: string;
  surfaceFinish?: string;
  solderMaskColor?: string;
  silkscreenColor?: string;
  copperWeight?: string;
  estimatedPrice?: number;
  description?: string;
  fileUrls?: string[];
  createdAt: string;
};

type PaymentRecord = {
  id: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  receiptUrl?: string;
  rawResponse?: {
    url?: string;
    [key: string]: any;
  };
  createdAt: string;
};

type OrderRecord = {
  id: string;
  userId: string;
  inquiryId?: string;
  quoteId?: string;
  totalAmount: number;
  status: string;
  priority?: string;
  shippingAddress?: string;
  billingAddress?: string;
  paymentStatus?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name?: string;
    email: string;
    phone?: string;
    companyName?: string;
  };
  inquiry?: InquiryRecord;
  orderItems?: OrderItemRecord[];
  payments?: PaymentRecord[];
};

const statusConfig: Record<string, { label: string; badgeClass: string; step: number }> = {
  PENDING: {
    label: "Pending Review",
    badgeClass: "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
    step: 1,
  },
  PAID: {
    label: "Payment Confirmed",
    badgeClass: "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
    step: 1,
  },
  GERBER_REVIEW: {
    label: "Gerber DFM Review",
    badgeClass: "bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
    step: 2,
  },
  ENGINEERING_REVIEW: {
    label: "CAM Engineering",
    badgeClass: "bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800",
    step: 2,
  },
  PRODUCTION: {
    label: "In Cleanroom Fab",
    badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
    step: 3,
  },
  QUALITY_CONTROL: {
    label: "AOI & E-Testing",
    badgeClass: "bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800",
    step: 4,
  },
  PACKAGING: {
    label: "Vacuum Packaging",
    badgeClass: "bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800",
    step: 4,
  },
  SHIPPED: {
    label: "Shipped & In Transit",
    badgeClass: "bg-green-100 text-green-900 border-green-300 dark:bg-green-950/60 dark:text-green-300 dark:border-green-800",
    step: 5,
  },
  DELIVERED: {
    label: "Delivered",
    badgeClass: "bg-emerald-200 text-emerald-950 border-emerald-400 dark:bg-emerald-900/80 dark:text-emerald-200",
    step: 5,
  },
  CANCELLED: {
    label: "Cancelled",
    badgeClass: "bg-red-100 text-red-900 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800",
    step: 0,
  },
};

const pipelineSteps = [
  { id: 1, label: "Order & Payment", desc: "Order queued and verified" },
  { id: 2, label: "CAM & DFM Review", desc: "Factory engineering check" },
  { id: 3, label: "Cleanroom Fab", desc: "Etch, drilling, plating, solder mask" },
  { id: 4, label: "AOI & QC Test", desc: "Automated optical & probe testing" },
  { id: 5, label: "Shipped", desc: "Express courier transit to doorstep" },
];

const getDownloadProxyUrl = (rawUrl: string, filename?: string) => {
  if (!rawUrl) return "#";
  const nameParam = filename ? `&name=${encodeURIComponent(filename)}` : "";
  return `/api/download?url=${encodeURIComponent(rawUrl)}${nameParam}`;
};

const getSpecsDownloadUrl = (order: OrderRecord) => {
  const customerName = order.user?.name || order.inquiry?.fullName || order.user?.email || "Customer";
  const params = new URLSearchParams({
    type: "specs",
    orderId: order.id,
    customer: customerName,
    boardType: order.inquiry?.boardType || "Custom PCB Prototype",
    layers: String(order.inquiry?.layers || 2),
    qty: String(order.inquiry?.quantity || 5),
    dims:
      order.inquiry?.length && order.inquiry?.width
        ? `${order.inquiry.length}x${order.inquiry.width}mm`
        : "Standard",
    finish: order.inquiry?.surfaceFinish || "HASL",
    mask: order.inquiry?.solderMaskColor || "Green",
    total: String(Number(order.totalAmount || 0).toFixed(2)),
  });
  return `/api/download?${params.toString()}`;
};

export default function CustomerOrdersManager() {
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isLoading);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  });
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 350);
    return () => clearTimeout(handler);
  }, [search]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, limit]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await OrderService.getOrdersWithPagination({
        page,
        limit,
        status: statusFilter,
        search: debouncedSearch,
      });
      const list = Array.isArray(response.data) ? (response.data as OrderRecord[]) : [];
      setOrders(list);
      if (response.meta) {
        setMeta(response.meta);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load orders from server");
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusFilter, debouncedSearch]);

  useEffect(() => {
    if (isAuthLoading || !user) return;
    fetchOrders();
  }, [fetchOrders, isAuthLoading, user]);

  const copyToClipboard = (text: string, label = "Order ID") => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order? This action cannot be undone.")) {
      return;
    }
    setCancellingId(orderId);
    try {
      await OrderService.cancelOrder(orderId);
      toast.success("Order cancelled successfully");
      await fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: "CANCELLED" } : null));
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  // Derive top-level summary metrics
  const stats = useMemo(() => {
    const totalOrders = meta.total || orders.length;
    const inProduction = orders.filter((o) =>
      ["PAID", "GERBER_REVIEW", "ENGINEERING_REVIEW", "PRODUCTION", "QUALITY_CONTROL"].includes(o.status)
    ).length;
    const completed = orders.filter((o) => ["SHIPPED", "DELIVERED"].includes(o.status)).length;
    const totalSpent = orders
      .filter((o) => o.status !== "CANCELLED")
      .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

    return { totalOrders, inProduction, completed, totalSpent };
  }, [orders, meta]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br from-white via-slate-50 to-emerald-50/40 p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-gradient-to-br dark:from-[#0b1220] dark:via-[#070b14] dark:to-emerald-950/20">
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-mono font-bold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
              <PackageCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Fabrication Tracker</span>
            </div>

            <h1 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              My PCB Orders & Fab Inquiries
            </h1>
            <p className="mt-1.5 max-w-2xl text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Track real-time PCB cleanroom fabrication progress, download engineering CAM specs, review Gerber DFM status, and manage payments.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchOrders}
              disabled={loading}
              className="h-10 rounded-xl border-slate-300 bg-white hover:bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-[#070b14] dark:hover:bg-slate-800 dark:text-slate-200 font-bold text-xs gap-2"
            >
              <RefreshCcw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </Button>

            <Button
              asChild
              className="h-10 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs gap-2 shadow-lg shadow-emerald-500/20"
            >
              <Link href="/pcb-quote">
                <Sparkles className="size-3.5" />
                <span>New PCB Quote</span>
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
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Orders</p>
                {loading ? (
                  <Skeleton className="h-8 w-20 mt-2 rounded-lg" />
                ) : (
                  <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{stats.totalOrders}</p>
                )}
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">Fabrication records</p>
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
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">In Production</p>
                {loading ? (
                  <Skeleton className="h-8 w-20 mt-2 rounded-lg" />
                ) : (
                  <p className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.inProduction}</p>
                )}
                <p className="mt-0.5 text-[11px] text-emerald-600/80 dark:text-emerald-400/80 font-medium">Active cleanroom runs</p>
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
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Shipped / Completed</p>
                {loading ? (
                  <Skeleton className="h-8 w-20 mt-2 rounded-lg" />
                ) : (
                  <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{stats.completed}</p>
                )}
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">Dispatched orders</p>
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
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Investment</p>
                {loading ? (
                  <Skeleton className="h-8 w-24 mt-2 rounded-lg" />
                ) : (
                  <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                    ${stats.totalSpent.toFixed(2)}
                  </p>
                )}
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">Direct factory value</p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                <ShieldCheck className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card className="rounded-2xl border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-[#0b1220]">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order ID, board material, layers, finish..."
              className="pl-10 h-10 rounded-xl bg-slate-50 border-slate-200 dark:bg-[#070b14] dark:border-slate-800 text-xs sm:text-sm font-medium"
            />
          </div>

          <div className="w-full sm:w-auto flex items-center gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px] h-10 rounded-xl bg-slate-50 border-slate-200 dark:bg-[#070b14] dark:border-slate-800 text-xs font-semibold">
                <SelectValue placeholder="Status: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending Review</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="GERBER_REVIEW">Gerber Review</SelectItem>
                <SelectItem value="ENGINEERING_REVIEW">Engineering Review</SelectItem>
                <SelectItem value="PRODUCTION">In Production</SelectItem>
                <SelectItem value="QUALITY_CONTROL">Quality Control</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {(search || statusFilter !== "ALL") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                }}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Orders Table & List */}
      <Card className="rounded-2xl border-slate-200 bg-white shadow-2xs overflow-hidden dark:border-slate-800 dark:bg-[#0b1220]">
        <CardHeader className="border-b border-slate-100 p-5 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Orders List
              </CardTitle>
              {loading ? (
                <Skeleton className="h-3.5 w-32 mt-1.5" />
              ) : (
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                  Showing {orders.length} of {meta.total} orders
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="overflow-x-auto">
              <Table className="min-w-[720px]">
                <TableHeader className="bg-slate-50/80 dark:bg-slate-900/40">
                  <TableRow>
                    <TableHead className="font-bold text-xs">Order ID</TableHead>
                    <TableHead className="font-bold text-xs">Board / Product</TableHead>
                    <TableHead className="font-bold text-xs">Placed On</TableHead>
                    <TableHead className="font-bold text-xs">Status</TableHead>
                    <TableHead className="font-bold text-xs">Payment</TableHead>
                    <TableHead className="font-bold text-xs text-right">Total</TableHead>
                    <TableHead className="font-bold text-xs text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <TableRow key={idx} className="hover:bg-transparent">
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell>
                        <div className="space-y-1.5">
                          <Skeleton className="h-4 w-44" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24 rounded-full" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-14" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Skeleton className="h-7 w-16 rounded-lg" />
                          <Skeleton className="h-7 w-7 rounded-lg" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800/60 dark:text-slate-500 mb-4">
                <PackageCheck className="size-7" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                {search || statusFilter !== "ALL" ? "No matching orders found" : "No fabrication orders yet"}
              </h3>
              <p className="mt-1.5 max-w-md text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {search || statusFilter !== "ALL"
                  ? "Try adjusting your search criteria or resetting filters to view all orders."
                  : "Submit a CAM quote or upload Gerber files to start rapid PCB manufacturing with WuPing FeiTian."}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button
                  asChild
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-2"
                >
                  <Link href="/pcb-quote">
                    <Sparkles className="size-3.5" />
                    <span>Calculate PCB Quote</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-xl border-slate-300 dark:border-slate-800 text-xs font-bold"
                >
                  <Link href="/products">
                    <span>Browse Products</span>
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-[720px]">
                <TableHeader className="bg-slate-50/80 dark:bg-slate-900/40">
                  <TableRow>
                    <TableHead className="font-bold text-xs">Order ID</TableHead>
                    <TableHead className="font-bold text-xs">Board / Product</TableHead>
                    <TableHead className="font-bold text-xs">Placed On</TableHead>
                    <TableHead className="font-bold text-xs">Status</TableHead>
                    <TableHead className="font-bold text-xs">Payment</TableHead>
                    <TableHead className="font-bold text-xs text-right">Total</TableHead>
                    <TableHead className="font-bold text-xs text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => {
                    const statusInfo = statusConfig[order.status] || {
                      label: order.status,
                      badgeClass: "bg-slate-100 text-slate-800",
                      step: 1,
                    };
                    const isPendingPayment =
                      order.status === "PENDING" || order.paymentStatus === "PENDING";
                    const isCancellable = order.status === "PENDING";

                    // Check for active stripe link in payments
                    const stripeLink =
                      order.payments && order.payments.length > 0
                        ? order.payments[0].rawResponse?.url
                        : null;

                    return (
                      <TableRow key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                        <TableCell className="font-mono text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                              #{order.id.slice(0, 8)}...
                            </span>
                            <button
                              onClick={() => copyToClipboard(order.id, "Full Order ID")}
                              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                              title="Copy full Order UUID"
                            >
                              <Copy className="size-3" />
                            </button>
                          </div>
                        </TableCell>

                        <TableCell>
                          {order.inquiry ? (
                            <div>
                              <p className="font-bold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">
                                {order.inquiry.boardType || "Custom PCB Prototype"}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                {order.inquiry.length && order.inquiry.width
                                  ? `${order.inquiry.length}x${order.inquiry.width}mm • `
                                  : ""}
                                {order.inquiry.layers ? `${order.inquiry.layers}L • ` : ""}
                                {order.inquiry.quantity ? `${order.inquiry.quantity} pcs • ` : ""}
                                {order.inquiry.surfaceFinish || "HASL"}
                              </p>
                            </div>
                          ) : order.orderItems && order.orderItems.length > 0 ? (
                            <div>
                              <p className="font-bold text-xs text-slate-900 dark:text-slate-100 line-clamp-1">
                                {order.orderItems[0].product?.name || "PCB Product"}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                {order.orderItems.length} item{order.orderItems.length > 1 ? "s" : ""}
                              </p>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-500">PCB Fabrication</span>
                          )}
                        </TableCell>

                        <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusInfo.badgeClass}`}
                          >
                            {statusInfo.label}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                              order.paymentStatus === "PAID"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-amber-600 dark:text-amber-400"
                            }`}
                          >
                            {order.paymentStatus === "PAID" ? (
                              <CheckCircle2 className="size-3" />
                            ) : (
                              <Clock className="size-3" />
                            )}
                            {order.paymentStatus === "PAID" ? "Paid" : "Unpaid"}
                          </span>
                        </TableCell>

                        <TableCell className="text-right font-mono font-bold text-xs text-slate-900 dark:text-slate-100">
                          ${Number(order.totalAmount || 0).toFixed(2)}
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Pay Now Button if Unpaid */}
                            {isPendingPayment && (
                              <Button
                                asChild
                                size="sm"
                                className="h-7 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                              >
                                <a
                                  href={stripeLink || `/checkout?orderId=${order.id}`}
                                  target={stripeLink ? "_blank" : "_self"}
                                  rel="noopener noreferrer"
                                >
                                  <span>Pay Now</span>
                                </a>
                              </Button>
                            )}

                            {/* View Detail Button */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedOrder(order)}
                              className="h-7 px-2.5 rounded-lg border-slate-200 dark:border-slate-800 text-xs font-semibold gap-1"
                            >
                              <Eye className="size-3" />
                              <span>Details</span>
                            </Button>

                            {/* Download Specs Button */}
                            <Button
                              asChild
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                              title="Download CAM Spec Sheet"
                            >
                              <a href={getSpecsDownloadUrl(order)} target="_blank" rel="noopener noreferrer">
                                <Download className="size-3.5" />
                              </a>
                            </Button>

                            {/* Cancel Order Button */}
                            {isCancellable && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCancelOrder(order.id)}
                                disabled={cancellingId === order.id}
                                className="h-7 px-2 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 text-[11px] font-semibold"
                                title="Cancel order"
                              >
                                {cancellingId === order.id ? (
                                  <Loader2 className="size-3 animate-spin" />
                                ) : (
                                  <span>Cancel</span>
                                )}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      {meta.totalPage && meta.totalPage > 1 ? (
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            Page {page} of {meta.totalPage} ({meta.total} orders)
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="h-8 rounded-lg text-xs"
            >
              <ChevronLeft className="size-3.5 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(meta.totalPage || 1, p + 1))}
              disabled={page >= (meta.totalPage || 1) || loading}
              className="h-8 rounded-lg text-xs"
            >
              Next
              <ChevronRight className="size-3.5 ml-1" />
            </Button>
          </div>
        </div>
      ) : null}

      {/* Detailed Slide-over Drawer */}
      <Sheet open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-6">
          {selectedOrder && (
            <div className="space-y-6">
              <SheetHeader>
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      (statusConfig[selectedOrder.status] || {}).badgeClass || "bg-slate-100"
                    }`}
                  >
                    {(statusConfig[selectedOrder.status] || {}).label || selectedOrder.status}
                  </Badge>
                  <span className="font-mono text-xs text-slate-400">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <SheetTitle className="text-xl font-black text-slate-900 dark:text-white mt-2">
                  Order Details
                </SheetTitle>
                <SheetDescription className="font-mono text-xs text-slate-500">
                  ID: {selectedOrder.id}
                </SheetDescription>
              </SheetHeader>

              {/* Manufacturing Pipeline Stage Visualizer */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5">
                  <Cpu className="size-3.5 text-emerald-600" />
                  <span>Production Pipeline Status</span>
                </h4>
                <div className="space-y-2">
                  {pipelineSteps.map((s) => {
                    const currentStep =
                      (statusConfig[selectedOrder.status] || {}).step || 1;
                    const isDone = s.id < currentStep;
                    const isCurrent = s.id === currentStep;

                    return (
                      <div
                        key={s.id}
                        className={`flex items-start gap-3 p-2.5 rounded-xl text-xs transition ${
                          isCurrent
                            ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-900 dark:text-emerald-300 font-bold"
                            : isDone
                              ? "text-slate-600 dark:text-slate-400 font-medium opacity-80"
                              : "text-slate-400 dark:text-slate-600 opacity-50"
                        }`}
                      >
                        <div className="mt-0.5">
                          {isDone ? (
                            <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                          ) : isCurrent ? (
                            <Clock className="size-4 text-emerald-600 animate-spin" />
                          ) : (
                            <div className="size-4 rounded-full border border-slate-300 dark:border-slate-700" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold">{s.label}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                            {s.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* PCB Engineering & Technical Parameters */}
              {selectedOrder.inquiry && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#070b14]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5">
                    <Layers className="size-3.5 text-emerald-600" />
                    <span>PCB Fabrication Specifications</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Board Type</span>
                      <span className="font-semibold">{selectedOrder.inquiry.boardType || "Rigid FR-4"}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Dimensions</span>
                      <span className="font-semibold">
                        {selectedOrder.inquiry.length && selectedOrder.inquiry.width
                          ? `${selectedOrder.inquiry.length} × ${selectedOrder.inquiry.width} mm`
                          : "Custom Standard"}
                      </span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Layer Count</span>
                      <span className="font-semibold">{selectedOrder.inquiry.layers || 2} Layers</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Quantity</span>
                      <span className="font-semibold">{selectedOrder.inquiry.quantity || 5} pieces</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Thickness</span>
                      <span className="font-semibold">{selectedOrder.inquiry.thickness || 1.6} mm</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Surface Finish</span>
                      <span className="font-semibold">{selectedOrder.inquiry.surfaceFinish || "HASL-RoHS"}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Solder Mask</span>
                      <span className="font-semibold">{selectedOrder.inquiry.solderMaskColor || "Green"}</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold">Material</span>
                      <span className="font-semibold">{selectedOrder.inquiry.material || "FR-4 Standard"}</span>
                    </div>
                  </div>

                  {selectedOrder.inquiry.description && (
                    <div className="mt-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 text-xs">
                      <span className="text-[10px] text-slate-500 block uppercase font-bold mb-1">
                        CAM Build Details
                      </span>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-mono text-[11px]">
                        {selectedOrder.inquiry.description}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Gerber Files Downloads if Available */}
              {selectedOrder.inquiry?.fileUrls && selectedOrder.inquiry.fileUrls.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#070b14]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                    <FileArchive className="size-3.5 text-emerald-600" />
                    <span>Gerber & CAM Files</span>
                  </h4>
                  <div className="space-y-1.5">
                    {selectedOrder.inquiry.fileUrls.map((url, idx) => (
                      <a
                        key={idx}
                        href={getDownloadProxyUrl(url, `gerber-order-${selectedOrder.id.slice(0, 8)}.zip`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/50 text-xs text-slate-700 dark:text-slate-300 transition"
                      >
                        <span className="truncate max-w-[320px] font-mono text-[11px]">{url}</span>
                        <Download className="size-3.5 text-emerald-600 shrink-0 ml-2" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Shipping & Delivery Address */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#070b14]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <Building2 className="size-3.5 text-emerald-600" />
                  <span>Delivery Address</span>
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  {selectedOrder.shippingAddress || "Factory direct fulfillment dispatch"}
                </p>
              </div>

              {/* Pricing & Invoice Breakdown */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#070b14]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
                  Payment Summary
                </h4>
                <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-500">Fabrication Cost</span>
                  <span className="font-mono font-semibold">${Number(selectedOrder.totalAmount || 0).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-500">DFM Engineering Check</span>
                  <span className="font-mono font-semibold text-emerald-600">Free ($0.00)</span>
                </div>
                <div className="flex items-center justify-between text-sm py-2 font-bold text-slate-900 dark:text-white">
                  <span>Total Amount</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">
                    ${Number(selectedOrder.totalAmount || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons in Drawer */}
              <div className="flex flex-col gap-2 pt-2">
                <Button
                  asChild
                  className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-2"
                >
                  <a href={getSpecsDownloadUrl(selectedOrder)} target="_blank" rel="noopener noreferrer">
                    <Download className="size-4" />
                    <span>Download Engineering CAM Spec Sheet</span>
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-xl border-slate-300 dark:border-slate-800 text-xs font-bold gap-2"
                >
                  <Link href="/dashboard/chat">
                    <MessageCircle className="size-4 text-emerald-600" />
                    <span>Chat with CAM Engineer regarding this order</span>
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

