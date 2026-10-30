"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowUpRight,
  Building2,
  Calculator,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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
  Mail,
  MessageCircle,
  PackageCheck,
  Phone,
  RefreshCcw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Tag,
  Truck,
  UserRound,
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
  estimatedPrice?: number;
  description?: string;
  fileUrls?: string[];
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
};

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
  PAID: "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
  GERBER_REVIEW: "bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
  ENGINEERING_REVIEW: "bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800",
  PRODUCTION: "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
  QUALITY_CONTROL: "bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800",
  PACKAGING: "bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800",
  SHIPPED: "bg-green-100 text-green-900 border-green-300 dark:bg-green-950/60 dark:text-green-300 dark:border-green-800",
  DELIVERED: "bg-emerald-200 text-emerald-950 border-emerald-400 dark:bg-emerald-900/80 dark:text-emerald-200",
  CANCELLED: "bg-red-100 text-red-900 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800",
};

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

export default function AdminOrdersManager() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sourceFilter, setSourceFilter] = useState<"ALL" | "INQUIRIES" | "STANDARD">("ALL");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 1,
  });
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);

  // Debounce search input by 350ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 350);
    return () => clearTimeout(handler);
  }, [search]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter, sourceFilter, limit]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const response = await OrderService.getOrdersWithPagination({
        page,
        limit,
        status: statusFilter,
        source: sourceFilter,
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
  }, [page, limit, statusFilter, sourceFilter, debouncedSearch]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await OrderService.updateStatus(orderId, {
        status: newStatus as any,
        note: `Status updated to ${newStatus} by Engineering Manager`,
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
      toast.success(`Order #${orderId.slice(0, 8).toUpperCase()} updated to ${newStatus}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const stats = useMemo(() => {
    if (meta?.stats) {
      return {
        totalCount: meta.stats.totalCount || 0,
        inquiriesCount: meta.stats.inquiriesCount || 0,
        totalVolume: meta.stats.totalVolume || 0,
        pending: meta.stats.pending || 0,
        production: meta.stats.production || 0,
        completed: meta.stats.completed || 0,
      };
    }
    const totalCount = meta.total || orders.length;
    const inquiriesCount = orders.filter((o) => !!o.inquiry || !!o.inquiryId).length;
    const totalVolume = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
    const pending = orders.filter((o) => o.status === "PENDING" || o.status === "GERBER_REVIEW").length;
    const production = orders.filter((o) => o.status === "PRODUCTION" || o.status === "QUALITY_CONTROL").length;
    const completed = orders.filter((o) => o.status === "SHIPPED" || o.status === "DELIVERED").length;

    return { totalCount, inquiriesCount, totalVolume, pending, production, completed };
  }, [meta, orders]);

  const exportToCsv = async () => {
    try {
      toast.info("Fetching complete dataset for export...");
      const allOrders = await OrderService.getMyOrders({
        status: statusFilter,
        source: sourceFilter,
        search: debouncedSearch,
      });
      const list = Array.isArray(allOrders) ? (allOrders as OrderRecord[]) : orders;
      if (list.length === 0) {
        toast.error("No orders to export");
        return;
      }
      const headers = [
        "Order ID",
        "Source",
        "Customer Name",
        "Email",
        "Phone",
        "PCB Type",
        "Layers",
        "Quantity",
        "Amount (USD)",
        "Status",
        "Date",
        "Project Requirement",
      ];
      const rows = list.map((o) => {
        const isInquiry = !!o.inquiry || !!o.inquiryId;
        const name = o.inquiry?.fullName || o.user?.name || "Customer";
        const email = o.inquiry?.email || o.user?.email || "";
        const phone = o.inquiry?.phone || o.user?.phone || "";
        const pcbType = o.inquiry?.boardType || "Standard Rigid PCB";
        const layers = o.inquiry?.layers || 2;
        const qty = o.inquiry?.quantity || 1;
        const amount = Number(o.totalAmount || 0).toFixed(2);
        const status = o.status;
        const date = new Date(o.createdAt).toISOString();
        const desc = (o.inquiry?.description || "").replace(/"/g, '""');
        return [
          `"${o.id}"`,
          `"${isInquiry ? "Direct Inquiry" : "Catalog Order"}"`,
          `"${name.replace(/"/g, '""')}"`,
          `"${email.replace(/"/g, '""')}"`,
          `"${phone.replace(/"/g, '""')}"`,
          `"${pcbType.replace(/"/g, '""')}"`,
          layers,
          qty,
          amount,
          `"${status}"`,
          `"${date}"`,
          `"${desc}"`,
        ].join(",");
      });
      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `FT_PCB_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Exported ${list.length} orders successfully as CSV`);
    } catch {
      toast.error("Failed to export orders");
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "CU";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getPcbTypeBadgeStyle = (boardType: string) => {
    const type = boardType.toLowerCase();
    if (type.includes("assembly") || type.includes("pcba")) {
      return "bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800";
    }
    if (type.includes("flex") || type.includes("fpc") || type.includes("rigid-flex")) {
      return "bg-purple-50 text-purple-900 border-purple-200 dark:bg-purple-950/70 dark:text-purple-300 dark:border-purple-800";
    }
    if (type.includes("aluminum") || type.includes("metal core") || type.includes("copper base")) {
      return "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800";
    }
    if (type.includes("hdi") || type.includes("microvia")) {
      return "bg-cyan-50 text-cyan-900 border-cyan-200 dark:bg-cyan-950/70 dark:text-cyan-300 dark:border-cyan-800";
    }
    return "bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800";
  };

  const getPageNumbers = (current: number, total: number) => {
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const pages: (number | string)[] = [];
    if (current <= 3) {
      pages.push(1, 2, 3, 4, "...", total);
    } else if (current >= total - 2) {
      pages.push(1, "...", total - 3, total - 2, total - 1, total);
    } else {
      pages.push(1, "...", current - 1, current, current + 1, "...", total);
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                <PackageCheck className="size-6" />
              </span>
              <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">
                  Orders & Direct Inquiries Manager
                </h1>
                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium mt-0.5">
                  Review incoming factory website inquiries, customer requirements, Gerber files, and manage PCB production in real time.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCsv}
              className="gap-1.5 rounded-xl border-gray-200 dark:border-slate-800 text-xs font-bold"
            >
              <Download className="size-3.5 text-gray-500" />
              <span>Export CSV</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchOrders}
              disabled={loading}
              className="gap-1.5 rounded-xl border-gray-200 dark:border-slate-800 text-xs font-bold"
            >
              <RefreshCcw className={`size-3.5 ${loading ? "animate-spin text-emerald-600" : ""}`} />
              <span>Refresh</span>
            </Button>
            <Link
              href="/pcb-quote"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-black text-white shadow-xs hover:bg-emerald-700 transition"
            >
              <Calculator className="size-3.5" />
              New Quote Calculator
            </Link>
          </div>
        </div>
      </section>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="rounded-2xl border-gray-200 shadow-xs dark:border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Total Records</span>
              <PackageCheck className="size-4 text-gray-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-gray-900 dark:text-white">{stats.totalCount}</div>
            <div className="text-[11px] text-gray-400">Orders & Inquiries</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-emerald-300/80 bg-emerald-50/30 dark:bg-emerald-950/20 dark:border-emerald-800/60 shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Direct Inquiries</span>
              <Sparkles className="size-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-emerald-700 dark:text-emerald-300">
              {stats.inquiriesCount}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400/80 font-medium">Website Contact & DFM leads</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-xs dark:border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">CAM / DFM Review</span>
              <Clock className="size-4 text-amber-500" />
            </div>
            <div className="mt-2 text-2xl font-black text-amber-600 dark:text-amber-400">{stats.pending}</div>
            <div className="text-[11px] text-gray-400">Pending quote / review</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-xs dark:border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">In Production</span>
              <Layers className="size-4 text-blue-500" />
            </div>
            <div className="mt-2 text-2xl font-black text-blue-600 dark:text-blue-400">{stats.production}</div>
            <div className="text-[11px] text-gray-400">Active fabrication</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-xs dark:border-slate-800 col-span-2 sm:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Total Pipeline</span>
              <span className="text-xs font-extrabold text-emerald-600">$ USD</span>
            </div>
            <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
              ${stats.totalVolume.toFixed(2)}
            </div>
            <div className="text-[11px] text-gray-400">Total pipeline value</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and Filters Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        
        {/* Source Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-3 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setSourceFilter("ALL")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              sourceFilter === "ALL"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            <span>All Records</span>
            <span className="rounded-full bg-black/15 px-1.5 py-0.2 text-[10px]">{stats.totalCount}</span>
          </button>

          <button
            type="button"
            onClick={() => setSourceFilter("INQUIRIES")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              sourceFilter === "INQUIRIES"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/50"
            }`}
          >
            <Sparkles className="size-3" />
            <span>Direct Inquiries & DFM Reviews</span>
            <span className="rounded-full bg-emerald-600/20 px-1.5 py-0.2 text-[10px] font-black text-emerald-900 dark:text-emerald-200">
              {stats.inquiriesCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSourceFilter("STANDARD")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              sourceFilter === "STANDARD"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            <span>Standard Catalog Orders</span>
            <span className="rounded-full bg-black/15 px-1.5 py-0.2 text-[10px]">
              {Math.max(0, stats.totalCount - stats.inquiriesCount)}
            </span>
          </button>
        </div>

        {/* Search & Status dropdown */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-1">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-2.5 size-4 text-gray-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone, PCB type, requirement text, order ID..."
              className="pl-9 text-xs rounded-xl border-gray-200 dark:border-slate-800"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 dark:text-slate-400 whitespace-nowrap">Status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 text-xs font-bold rounded-xl border-gray-200 dark:border-slate-800">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses ({stats.totalCount})</SelectItem>
                <SelectItem value="PENDING">Pending ({stats.pending})</SelectItem>
                <SelectItem value="GERBER_REVIEW">Gerber Review</SelectItem>
                <SelectItem value="PRODUCTION">In Production ({stats.production})</SelectItem>
                <SelectItem value="QUALITY_CONTROL">Quality Control</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Orders Table Container */}
      <Card className="rounded-2xl border-gray-200 shadow-xs dark:border-slate-800 overflow-hidden">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-white to-gray-50/80 p-4 sm:p-5 dark:border-slate-800/80 dark:from-slate-900/90 dark:via-slate-900 dark:to-slate-900/90">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <CardTitle className="text-lg font-black text-gray-900 dark:text-white">
                  Orders & Inquiry Records
                </CardTitle>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {meta.total}
                </span>
              </div>
              <CardDescription className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                Direct factory manufacturing orders, CAM review files, and customer specifications.
              </CardDescription>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-xs font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                <span>Live Factory Sync</span>
              </div>

              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 hidden md:inline-flex items-center gap-1">
                ↔ Scroll horizontally for full data
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Loader2 className="size-8 animate-spin text-emerald-600 mb-3" />
              <p className="text-sm font-bold text-gray-700 dark:text-slate-300">Loading factory orders from server...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-slate-800 text-gray-400 mb-3">
                <FileArchive className="size-7" />
              </div>
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white">No Inquiries or Orders Found</h3>
              <p className="mt-1 text-xs text-gray-500 max-w-sm">
                {search || statusFilter !== "ALL" || sourceFilter !== "ALL"
                  ? "No records match your current filter settings. Try resetting the search or category filter."
                  : "No inquiries or orders have been placed yet. Submit a test inquiry from the homepage to see it appear here immediately."}
              </p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setSearch(""); setStatusFilter("ALL"); setSourceFilter("ALL"); setPage(1); }}>
                  Reset Filters
                </Button>
                <Button size="sm" onClick={fetchOrders} className="bg-emerald-600 text-white">
                  Refresh
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
              <Table className="min-w-[1460px] w-full border-collapse">
                <TableHeader>
                  <TableRow className="border-b border-gray-200 bg-gray-50/80 dark:border-slate-800 dark:bg-slate-900/80 text-xs">
                    <TableHead className="w-[140px] min-w-[140px] font-extrabold text-slate-700 dark:text-slate-300 pl-4">
                      <div className="flex items-center gap-1.5">
                        <Tag className="size-3 text-emerald-600" />
                        <span>Inquiry / Order ID</span>
                      </div>
                    </TableHead>
                    <TableHead className="w-[230px] min-w-[230px] font-extrabold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <UserRound className="size-3 text-emerald-600" />
                        <span>Customer Contact</span>
                      </div>
                    </TableHead>
                    <TableHead className="w-[190px] min-w-[190px] font-extrabold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Cpu className="size-3 text-emerald-600" />
                        <span>PCB Type</span>
                      </div>
                    </TableHead>
                    <TableHead className="w-[300px] min-w-[300px] font-extrabold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <FileText className="size-3 text-emerald-600" />
                        <span>Project Requirement</span>
                      </div>
                    </TableHead>
                    <TableHead className="w-[170px] min-w-[170px] font-extrabold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <FileArchive className="size-3 text-emerald-600" />
                        <span>CAD / Gerber</span>
                      </div>
                    </TableHead>
                    <TableHead className="w-[110px] min-w-[110px] font-extrabold text-slate-700 dark:text-slate-300">
                      <span>Amount</span>
                    </TableHead>
                    <TableHead className="w-[170px] min-w-[170px] font-extrabold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Clock className="size-3 text-emerald-600" />
                        <span>Status</span>
                      </div>
                    </TableHead>
                    <TableHead className="w-[130px] min-w-[130px] font-extrabold text-slate-700 dark:text-slate-300">
                      <span>Submitted</span>
                    </TableHead>
                    <TableHead className="w-[130px] min-w-[130px] sticky right-0 bg-gray-50/95 dark:bg-slate-900/95 backdrop-blur-xs z-10 text-right pr-4 font-extrabold text-slate-700 dark:text-slate-300 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.06)] dark:shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.4)]">
                      <span>Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => {
                    const isInquiry = !!order.inquiry || !!order.inquiryId;
                    const customerEmail = order.inquiry?.email || order.user?.email || "N/A";
                    const customerName = order.inquiry?.fullName || order.user?.name || customerEmail.split("@")[0];
                    const customerPhone = order.inquiry?.phone || order.user?.phone;
                    const pcbType = order.inquiry?.boardType || "Standard Rigid PCB";
                    const description = order.inquiry?.description || "";
                    const fileUrls = order.inquiry?.fileUrls || [];
                    const statusClass = statusColors[order.status] || "bg-gray-100 text-gray-800 border-gray-300";

                    return (
                      <TableRow
                        key={order.id}
                        className="group border-b border-gray-100 hover:bg-slate-50/80 dark:border-slate-800/60 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        {/* Order ID & Source Badge */}
                        <TableCell className="w-[140px] min-w-[140px] align-top py-3.5 pl-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-xs font-black text-emerald-700 dark:text-emerald-400">
                                #{order.id.slice(0, 8).toUpperCase()}
                              </span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(order.id, "Order ID")}
                                title="Copy UUID"
                                className="text-gray-400 hover:text-emerald-600 transition cursor-pointer"
                              >
                                <Copy className="size-3" />
                              </button>
                            </div>

                            {isInquiry ? (
                              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                <Sparkles className="size-2.5 text-emerald-600 dark:text-emerald-400" />
                                Direct Inquiry
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                <PackageCheck className="size-2.5 text-slate-500" />
                                Catalog Order
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* Customer Contact */}
                        <TableCell className="w-[230px] min-w-[230px] align-top py-3.5 whitespace-normal">
                          <div className="flex items-start gap-2.5">
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-mono text-[10px] font-black mt-0.5">
                              {getInitials(customerName)}
                            </div>
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className="text-xs font-black text-gray-900 dark:text-white truncate" title={customerName}>
                                {customerName}
                              </div>

                              <div className="text-[11px] text-gray-600 dark:text-slate-400 flex items-center gap-1.5">
                                <Mail className="size-2.5 text-gray-400 shrink-0" />
                                <a
                                  href={`mailto:${customerEmail}?subject=Re: FT PCB Quotation & DFM Review - ${pcbType}`}
                                  className="hover:text-emerald-600 hover:underline truncate max-w-[140px]"
                                  title={`Email ${customerEmail}`}
                                >
                                  {customerEmail}
                                </a>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(customerEmail, "Email")}
                                  className="text-gray-400 hover:text-gray-600 shrink-0 cursor-pointer"
                                  title="Copy Email"
                                >
                                  <Copy className="size-2.5" />
                                </button>
                              </div>

                              {customerPhone ? (
                                <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                                  <Phone className="size-2.5 text-emerald-600 shrink-0" />
                                  <a
                                    href={`https://wa.me/${customerPhone.replace(/[^0-9]/g, "")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline truncate max-w-[140px]"
                                    title="Chat on WhatsApp"
                                  >
                                    {customerPhone}
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => copyToClipboard(customerPhone, "Phone")}
                                    className="text-gray-400 hover:text-gray-600 shrink-0 cursor-pointer"
                                    title="Copy Phone"
                                  >
                                    <Copy className="size-2.5" />
                                  </button>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </TableCell>

                        {/* PCB Type */}
                        <TableCell className="w-[190px] min-w-[190px] align-top py-3.5 whitespace-normal">
                          <div className="space-y-1.5">
                            <span className={`inline-block rounded-lg px-2.5 py-1 text-xs font-black border leading-snug break-words max-w-full ${getPcbTypeBadgeStyle(pcbType)}`}>
                              {pcbType}
                            </span>
                            {order.inquiry?.layers ? (
                              <div className="text-[11px] text-gray-500 dark:text-slate-400 flex items-center gap-1.5">
                                <span className="font-bold">{order.inquiry.layers} Layers</span>
                                {order.inquiry.quantity ? <span>• {order.inquiry.quantity} pcs</span> : null}
                              </div>
                            ) : null}
                          </div>
                        </TableCell>

                        {/* Project Requirement */}
                        <TableCell className="w-[300px] min-w-[300px] align-top py-3.5 whitespace-normal">
                          {description ? (
                            <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-2.5 dark:border-slate-800 dark:bg-slate-800/50 space-y-1.5">
                              <p className="text-xs text-gray-700 dark:text-slate-300 font-medium line-clamp-2 leading-relaxed break-words">
                                &ldquo;{description}&rdquo;
                              </p>
                              <button
                                type="button"
                                onClick={() => setSelectedOrder(order)}
                                className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline flex items-center gap-1 group cursor-pointer"
                              >
                                <span>View Full Requirement</span>
                                <ChevronRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400 italic">No requirement notes provided</span>
                          )}
                        </TableCell>

                        {/* Gerber / Design */}
                        <TableCell className="w-[170px] min-w-[170px] align-top py-3.5">
                          {fileUrls.length > 0 ? (
                            <div className="flex flex-col gap-1.5">
                              {fileUrls.map((url, i) => {
                                const filename = url.split("/").pop() || `gerber-${order.id.slice(0, 8)}-${i + 1}.zip`;
                                const downloadUrl = getDownloadProxyUrl(url, filename);
                                return (
                                  <a
                                    key={url + i}
                                    href={downloadUrl}
                                    download={filename}
                                    onClick={() => toast.success(`Downloading: ${filename}`)}
                                    title={`Download ${filename}`}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 transition"
                                  >
                                    <Download className="size-3 text-emerald-600 dark:text-emerald-400" />
                                    <span className="truncate max-w-[110px]">Gerber #{i + 1}</span>
                                  </a>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1">
                              <a
                                href={getSpecsDownloadUrl(order)}
                                download={`CAM_Specs_${order.id.slice(0, 8).toUpperCase()}.txt`}
                                onClick={() => toast.success("Downloading CAM Specification Sheet (.txt)")}
                                title="Download CAM Spec Sheet"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-800 hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300 transition"
                              >
                                <Download className="size-3 text-blue-600 dark:text-blue-400" />
                                <span>CAM Sheet (.txt)</span>
                              </a>
                              <span className="text-[10px] text-gray-400 pl-0.5">Direct Form Submission</span>
                            </div>
                          )}
                        </TableCell>

                        {/* Total Amount */}
                        <TableCell className="w-[110px] min-w-[110px] align-top py-3.5 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
                              ${Number(order.totalAmount || 0).toFixed(2)}
                            </div>
                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">USD</div>
                          </div>
                        </TableCell>

                        {/* Status Dropdown */}
                        <TableCell className="w-[170px] min-w-[170px] align-top py-3.5">
                          <div className="flex items-center gap-1.5">
                            <Select
                              defaultValue={order.status}
                              disabled={updatingId === order.id}
                              onValueChange={(val) => handleUpdateStatus(order.id, val)}
                            >
                              <SelectTrigger className={`h-8 w-40 text-xs font-black border rounded-xl shadow-2xs ${statusClass}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PENDING">PENDING</SelectItem>
                                <SelectItem value="PAID">PAID</SelectItem>
                                <SelectItem value="GERBER_REVIEW">GERBER_REVIEW</SelectItem>
                                <SelectItem value="PRODUCTION">PRODUCTION</SelectItem>
                                <SelectItem value="QUALITY_CONTROL">QUALITY_CONTROL</SelectItem>
                                <SelectItem value="PACKAGING">PACKAGING</SelectItem>
                                <SelectItem value="SHIPPED">SHIPPED</SelectItem>
                                <SelectItem value="DELIVERED">DELIVERED</SelectItem>
                                <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                              </SelectContent>
                            </Select>
                            {updatingId === order.id ? (
                              <Loader2 className="size-3.5 animate-spin text-emerald-600" />
                            ) : null}
                          </div>
                        </TableCell>

                        {/* Date */}
                        <TableCell className="w-[130px] min-w-[130px] align-top py-3.5 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <div className="text-xs font-bold text-gray-800 dark:text-slate-200">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                            <div className="text-[11px] text-gray-400">
                              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="w-[130px] min-w-[130px] sticky right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs z-10 text-right pr-4 align-top py-3.5 whitespace-nowrap shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.06)] dark:shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.4)] group-hover:bg-slate-50/95 dark:group-hover:bg-slate-800/95 transition-colors">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                            className="h-8 text-xs font-bold text-emerald-700 bg-emerald-50/60 hover:bg-emerald-600 hover:text-white dark:text-emerald-400 dark:bg-emerald-950/40 dark:hover:bg-emerald-600 dark:hover:text-white gap-1.5 rounded-xl border-emerald-300 dark:border-emerald-800 shadow-2xs transition-all cursor-pointer"
                          >
                            <Eye className="size-3.5" />
                            <span>Review DFM</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>

        {/* Server-Side Pagination Toolbar */}
        {!loading && meta.total > 0 && (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-gray-100 bg-gray-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            {/* Left: Record summary & Page size selector */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-gray-600 dark:text-slate-400">
                Showing{" "}
                <span className="font-extrabold text-gray-900 dark:text-white">
                  {(page - 1) * limit + 1}
                </span>
                {" - "}
                <span className="font-extrabold text-gray-900 dark:text-white">
                  {Math.min(page * limit, meta.total)}
                </span>
                {" of "}
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  {meta.total}
                </span>{" "}
                records
              </span>

              <div className="flex items-center gap-1.5 pl-3 border-l border-gray-200 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-gray-500">Per page:</span>
                <Select
                  value={String(limit)}
                  onValueChange={(val) => {
                    setLimit(Number(val));
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="h-7 w-20 text-xs font-bold rounded-lg border-gray-200 dark:border-slate-800">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right: Page Navigation Controls */}
            <div className="flex items-center gap-1.5">
              {/* First Page */}
              <Button
                variant="outline"
                size="icon"
                className="size-8 rounded-xl border-gray-200 dark:border-slate-800 cursor-pointer"
                disabled={page <= 1 || loading}
                onClick={() => setPage(1)}
                title="First Page"
              >
                <ChevronsLeft className="size-4" />
              </Button>

              {/* Previous Page */}
              <Button
                variant="outline"
                size="icon"
                className="size-8 rounded-xl border-gray-200 dark:border-slate-800 cursor-pointer"
                disabled={page <= 1 || loading}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                title="Previous Page"
              >
                <ChevronLeft className="size-4" />
              </Button>

              {/* Dynamic Page Number Buttons */}
              <div className="flex items-center gap-1">
                {getPageNumbers(page, meta.totalPage || 1).map((p, idx) => {
                  if (p === "...") {
                    return (
                      <span key={`dots-${idx}`} className="px-1 text-xs font-bold text-gray-400">
                        ...
                      </span>
                    );
                  }
                  const pageNum = Number(p);
                  const isActive = pageNum === page;
                  return (
                    <Button
                      key={`page-${pageNum}`}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                      disabled={loading}
                      className={`size-8 rounded-xl text-xs font-black cursor-pointer ${
                        isActive
                          ? "bg-emerald-600 text-white shadow-xs hover:bg-emerald-700"
                          : "border-gray-200 text-gray-700 hover:bg-gray-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              {/* Next Page */}
              <Button
                variant="outline"
                size="icon"
                className="size-8 rounded-xl border-gray-200 dark:border-slate-800 cursor-pointer"
                disabled={page >= (meta.totalPage || 1) || loading}
                onClick={() => setPage((prev) => Math.min(meta.totalPage || 1, prev + 1))}
                title="Next Page"
              >
                <ChevronRight className="size-4" />
              </Button>

              {/* Last Page */}
              <Button
                variant="outline"
                size="icon"
                className="size-8 rounded-xl border-gray-200 dark:border-slate-800 cursor-pointer"
                disabled={page >= (meta.totalPage || 1) || loading}
                onClick={() => setPage(meta.totalPage || 1)}
                title="Last Page"
              >
                <ChevronsRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Slide-over Sheet / Drawer for Full Customer Inquiry & Requirements */}
      <Sheet open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto p-6 bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-slate-800">
          {selectedOrder ? (
            <div className="space-y-6">
              
              {/* Drawer Header */}
              <SheetHeader className="border-b border-gray-100 pb-4 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    <Sparkles className="size-3" /> Direct Factory Inquiry & DFM Review
                  </span>
                  <Badge variant="outline" className={`text-xs font-bold ${statusColors[selectedOrder.status]}`}>
                    {selectedOrder.status}
                  </Badge>
                </div>
                <SheetTitle className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center justify-between">
                  <span>Inquiry #{selectedOrder.id.slice(0, 8).toUpperCase()}</span>
                  <span className="text-base text-emerald-600 font-mono">
                    ${Number(selectedOrder.totalAmount || 0).toFixed(2)}
                  </span>
                </SheetTitle>
                <SheetDescription className="text-xs text-gray-500 dark:text-slate-400">
                  Submitted on {new Date(selectedOrder.createdAt).toLocaleString()}
                </SheetDescription>
              </SheetHeader>

              {/* Customer Contact Card */}
              <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-800/40 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-slate-400 flex items-center gap-1.5">
                    <UserRound className="size-3.5 text-emerald-600" />
                    Customer Contact Details
                  </h4>
                  <span className="text-[10px] text-gray-400 font-mono">
                    UUID: {selectedOrder.id}
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 text-xs">
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-gray-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">Full Name</span>
                    <span className="font-extrabold text-sm text-gray-900 dark:text-white mt-0.5 block">
                      {selectedOrder.inquiry?.fullName || selectedOrder.user?.name || "Customer"}
                    </span>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-gray-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">Corporate Email</span>
                    <div className="flex items-center justify-between mt-0.5">
                      <a
                        href={`mailto:${selectedOrder.inquiry?.email || selectedOrder.user?.email}`}
                        className="font-bold text-xs text-emerald-600 dark:text-emerald-400 hover:underline truncate"
                      >
                        {selectedOrder.inquiry?.email || selectedOrder.user?.email || "N/A"}
                      </a>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(selectedOrder.inquiry?.email || selectedOrder.user?.email || "", "Email")}
                        className="text-gray-400 hover:text-gray-600"
                        title="Copy Email"
                      >
                        <Copy className="size-3" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-gray-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">Phone / WhatsApp</span>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="font-bold text-xs text-gray-900 dark:text-white">
                        {selectedOrder.inquiry?.phone || selectedOrder.user?.phone || "Not Provided"}
                      </span>
                      {(selectedOrder.inquiry?.phone || selectedOrder.user?.phone) ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => copyToClipboard(selectedOrder.inquiry?.phone || selectedOrder.user?.phone || "", "Phone")}
                            className="text-gray-400 hover:text-gray-600"
                            title="Copy Phone"
                          >
                            <Copy className="size-3" />
                          </button>
                          <a
                            href={`https://wa.me/${(selectedOrder.inquiry?.phone || selectedOrder.user?.phone || "").replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:text-emerald-700"
                            title="Open WhatsApp"
                          >
                            <MessageCircle className="size-3.5" />
                          </a>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-gray-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">Requested PCB Type</span>
                    <span className="font-extrabold text-xs text-emerald-700 dark:text-emerald-300 mt-0.5 block">
                      {selectedOrder.inquiry?.boardType || "Standard Rigid PCB"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Project Requirement & Engineering Notes (THE CORE USER SUBMITTED DATA) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-slate-300 flex items-center gap-1.5">
                    <FileText className="size-3.5 text-emerald-600" />
                    Customer Project Requirement & DFM Notes
                  </h4>
                  {selectedOrder.inquiry?.description ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(selectedOrder.inquiry?.description || "", "Project Requirement")}
                      className="h-6 text-[10px] font-bold text-gray-500 hover:text-gray-900 gap-1"
                    >
                      <Copy className="size-3" /> Copy Text
                    </Button>
                  ) : null}
                </div>

                <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20 p-4">
                  {selectedOrder.inquiry?.description ? (
                    <p className="text-xs leading-relaxed text-gray-800 dark:text-slate-200 whitespace-pre-line font-mono font-medium">
                      {selectedOrder.inquiry.description}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400 italic">
                      No explicit project requirement text was entered for this record.
                    </p>
                  )}
                </div>
              </div>

              {/* Technical Specifications Matrix (if present) */}
              {selectedOrder.inquiry ? (
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Layers className="size-3.5 text-emerald-600" />
                    Engineering Specifications
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div className="rounded-xl border border-gray-200 dark:border-slate-800 p-2.5 bg-white dark:bg-slate-900">
                      <span className="text-[10px] text-gray-400 block font-bold uppercase">Layer Count</span>
                      <span className="font-extrabold">{selectedOrder.inquiry.layers || 2} Layers</span>
                    </div>
                    <div className="rounded-xl border border-gray-200 dark:border-slate-800 p-2.5 bg-white dark:bg-slate-900">
                      <span className="text-[10px] text-gray-400 block font-bold uppercase">Quantity</span>
                      <span className="font-extrabold">{selectedOrder.inquiry.quantity || 5} pcs</span>
                    </div>
                    <div className="rounded-xl border border-gray-200 dark:border-slate-800 p-2.5 bg-white dark:bg-slate-900">
                      <span className="text-[10px] text-gray-400 block font-bold uppercase">Dimensions</span>
                      <span className="font-extrabold">
                        {selectedOrder.inquiry.length && selectedOrder.inquiry.width
                          ? `${selectedOrder.inquiry.length} × ${selectedOrder.inquiry.width} mm`
                          : "Standard (100x100mm)"}
                      </span>
                    </div>
                    <div className="rounded-xl border border-gray-200 dark:border-slate-800 p-2.5 bg-white dark:bg-slate-900">
                      <span className="text-[10px] text-gray-400 block font-bold uppercase">Surface Finish</span>
                      <span className="font-extrabold">{selectedOrder.inquiry.surfaceFinish || "HASL with lead"}</span>
                    </div>
                    <div className="rounded-xl border border-gray-200 dark:border-slate-800 p-2.5 bg-white dark:bg-slate-900">
                      <span className="text-[10px] text-gray-400 block font-bold uppercase">Solder Mask</span>
                      <span className="font-extrabold">{selectedOrder.inquiry.solderMaskColor || "Green"}</span>
                    </div>
                    <div className="rounded-xl border border-gray-200 dark:border-slate-800 p-2.5 bg-white dark:bg-slate-900">
                      <span className="text-[10px] text-gray-400 block font-bold uppercase">Base Material</span>
                      <span className="font-extrabold">{selectedOrder.inquiry.material || "FR-4 Standard TG130"}</span>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Design / Gerber Files */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Download className="size-3.5 text-emerald-600" />
                  CAD / Gerber Design Package
                </h4>
                {selectedOrder.inquiry?.fileUrls && selectedOrder.inquiry.fileUrls.length > 0 ? (
                  <div className="space-y-2">
                    {selectedOrder.inquiry.fileUrls.map((url, idx) => {
                      const filename = url.split("/").pop() || `gerber-${selectedOrder.id.slice(0, 8)}-${idx + 1}.zip`;
                      const downloadUrl = getDownloadProxyUrl(url, filename);
                      return (
                        <div
                          key={url + idx}
                          className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3"
                        >
                          <div className="flex items-center gap-2">
                            <FileArchive className="size-4 text-emerald-600" />
                            <span className="text-xs font-bold text-gray-800 dark:text-slate-200">{filename}</span>
                          </div>
                          <a
                            href={downloadUrl}
                            download={filename}
                            onClick={() => toast.success(`Downloading ${filename}`)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
                          >
                            <Download className="size-3" />
                            <span>Download File</span>
                          </a>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-gray-200 dark:border-slate-800 p-4 text-center">
                    <p className="text-xs text-gray-500">
                      No Gerber files uploaded with this inquiry. CAM quote requested from project requirements.
                    </p>
                    <a
                      href={getSpecsDownloadUrl(selectedOrder)}
                      download={`CAM_Specs_${selectedOrder.id.slice(0, 8).toUpperCase()}.txt`}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:underline"
                    >
                      <Download className="size-3" />
                      Download CAM Engineering Specification Sheet (.txt)
                    </a>
                  </div>
                )}
              </div>

              {/* Status Update & Actions */}
              <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-800/40 p-4 space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-slate-300">
                  Engineering Workflow & Status Transition
                </h4>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <Select
                    defaultValue={selectedOrder.status}
                    disabled={updatingId === selectedOrder.id}
                    onValueChange={(val) => handleUpdateStatus(selectedOrder.id, val)}
                  >
                    <SelectTrigger className="flex-1 text-xs font-extrabold h-9 rounded-xl bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">PENDING (Inquiry Received)</SelectItem>
                      <SelectItem value="GERBER_REVIEW">GERBER_REVIEW (CAM Engineering)</SelectItem>
                      <SelectItem value="PRODUCTION">PRODUCTION (Fabricating)</SelectItem>
                      <SelectItem value="QUALITY_CONTROL">QUALITY_CONTROL (AOI / Testing)</SelectItem>
                      <SelectItem value="PACKAGING">PACKAGING (Vacuum Seal)</SelectItem>
                      <SelectItem value="SHIPPED">SHIPPED (DHL / FedEx Tracked)</SelectItem>
                      <SelectItem value="DELIVERED">DELIVERED</SelectItem>
                      <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                    </SelectContent>
                  </Select>

                  <a
                    href={`mailto:${selectedOrder.inquiry?.email || selectedOrder.user?.email}?subject=FT PCB Quotation & DFM Review - Order %23${selectedOrder.id.slice(0, 8).toUpperCase()}&body=Dear ${selectedOrder.inquiry?.fullName || "Customer"},%0D%0A%0D%0AThank you for contacting FT PCB factory engineering team regarding your ${selectedOrder.inquiry?.boardType || "PCB"} project.%0D%0A%0D%0AOur CAM team has completed the DFM review for your requirements:%0D%0A"${encodeURIComponent(selectedOrder.inquiry?.description || "")}"%0D%0A%0D%0APlease find our quotation attached.%0D%0A%0D%0ABest regards,%0D%0AFT PCB CAM Engineering Team%0D%0Aft-osr@feitianpcb.com`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition"
                  >
                    <Send className="size-3.5" />
                    <span>Send Engineering Reply</span>
                  </a>
                </div>
              </div>

            </div>
          ) : null}
        </SheetContent>
      </Sheet>

    </div>
  );
}
