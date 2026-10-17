"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowUpRight,
  Calculator,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  ExternalLink,
  FileArchive,
  Layers,
  Loader2,
  PackageCheck,
  RefreshCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Truck,
  UserRound,
  XCircle,
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
import { OrderService } from "@/services/order.service";

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
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleDownloadGerber = (rawUrl: string, filename: string) => {
    if (!rawUrl) return;
    const downloadUrl = getDownloadProxyUrl(rawUrl, filename);
    toast.success(`Starting download: ${filename}`);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await OrderService.getMyOrders();
      const list = Array.isArray(response) ? (response as OrderRecord[]) : [];
      setOrders(list);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load orders from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await OrderService.updateStatus(orderId, {
        status: newStatus as any,
        note: `Status updated to ${newStatus} by Admin`,
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
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
    const totalCount = orders.length;
    const totalVolume = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
    const pending = orders.filter((o) => o.status === "PENDING" || o.status === "GERBER_REVIEW").length;
    const production = orders.filter((o) => o.status === "PRODUCTION" || o.status === "QUALITY_CONTROL").length;
    const completed = orders.filter((o) => o.status === "SHIPPED" || o.status === "DELIVERED").length;

    return { totalCount, totalVolume, pending, production, completed };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      if (statusFilter !== "ALL" && order.status !== statusFilter) {
        return false;
      }

      // Text search
      if (!search.trim()) return true;
      const q = search.trim().toLowerCase();
      const orderId = order.id.toLowerCase();
      const email = (order.user?.email || order.inquiry?.email || "").toLowerCase();
      const name = (order.user?.name || order.inquiry?.fullName || "").toLowerCase();
      const board = (order.inquiry?.boardType || "").toLowerCase();
      const desc = (order.inquiry?.description || "").toLowerCase();

      return (
        orderId.includes(q) ||
        email.includes(q) ||
        name.includes(q) ||
        board.includes(q) ||
        desc.includes(q)
      );
    });
  }, [orders, search, statusFilter]);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                <PackageCheck className="size-5" />
              </span>
              <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">Live Orders & Quotes Center</h1>
                <p className="text-xs text-gray-500 dark:text-slate-400 font-medium">
                  Track, review Gerber files, and manage PCB prototype and PCBA turnkey production orders in real time.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchOrders}
              disabled={loading}
              className="gap-1.5 rounded-xl border-gray-200 dark:border-slate-800"
            >
              <RefreshCcw className={`size-3.5 ${loading ? "animate-spin text-emerald-600" : ""}`} />
              <span>Refresh Orders</span>
            </Button>
            <Link
              href="/pcb-quote"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-black text-white shadow-xs hover:bg-emerald-700 transition"
            >
              <Calculator className="size-3.5" />
              New Factory Quote
            </Link>
          </div>
        </div>
      </section>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Card className="rounded-2xl border-gray-200 shadow-xs dark:border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Total Orders</span>
              <PackageCheck className="size-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-gray-900 dark:text-white">{stats.totalCount}</div>
            <div className="text-[11px] text-gray-400">Factory orders placed</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-xs dark:border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Total Volume</span>
              <span className="text-xs font-extrabold text-emerald-600">$ USD</span>
            </div>
            <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
              ${stats.totalVolume.toFixed(2)}
            </div>
            <div className="text-[11px] text-gray-400">Total pipeline value</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-xs dark:border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">CAM Review</span>
              <Clock className="size-4 text-amber-500" />
            </div>
            <div className="mt-2 text-2xl font-black text-amber-600 dark:text-amber-400">{stats.pending}</div>
            <div className="text-[11px] text-gray-400">Pending DFM approval</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-xs dark:border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">In Production</span>
              <Layers className="size-4 text-blue-500" />
            </div>
            <div className="mt-2 text-2xl font-black text-blue-600 dark:text-blue-400">{stats.production}</div>
            <div className="text-[11px] text-gray-400">Manufacturing active</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-xs dark:border-slate-800 col-span-2 sm:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Dispatched</span>
              <Truck className="size-4 text-emerald-500" />
            </div>
            <div className="mt-2 text-2xl font-black text-emerald-700 dark:text-emerald-400">{stats.completed}</div>
            <div className="text-[11px] text-gray-400">Shipped or delivered</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 size-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID, customer email, name, board type..."
            className="pl-9 text-xs rounded-xl border-gray-200 dark:border-slate-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 dark:text-slate-400 whitespace-nowrap">Status:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44 text-xs font-bold rounded-xl border-gray-200 dark:border-slate-800">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses ({orders.length})</SelectItem>
              <SelectItem value="PENDING">Pending ({orders.filter((o) => o.status === "PENDING").length})</SelectItem>
              <SelectItem value="GERBER_REVIEW">Gerber Review</SelectItem>
              <SelectItem value="PRODUCTION">In Production</SelectItem>
              <SelectItem value="QUALITY_CONTROL">Quality Control</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders Table */}
      <Card className="rounded-2xl border-gray-200 shadow-xs dark:border-slate-800 overflow-hidden">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50 p-4 dark:border-slate-800/80 dark:bg-slate-900/60">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-extrabold text-gray-900 dark:text-white">
                Orders List ({filteredOrders.length})
              </CardTitle>
              <CardDescription className="text-xs">
                Direct factory manufacturing orders, CAM review files, and customer specifications.
              </CardDescription>
            </div>
            {filteredOrders.length > 0 ? (
              <Badge variant="outline" className="text-xs font-bold bg-white dark:bg-slate-800">
                Live Data
              </Badge>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <Loader2 className="size-8 animate-spin text-emerald-600 mb-3" />
              <p className="text-sm font-bold text-gray-700 dark:text-slate-300">Loading factory orders from server...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-slate-800 text-gray-400 mb-3">
                <FileArchive className="size-7" />
              </div>
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white">No Orders Found</h3>
              <p className="mt-1 text-xs text-gray-500 max-w-sm">
                {search || statusFilter !== "ALL"
                  ? "No orders match your current filters. Try resetting the search or status filter."
                  : "No orders have been placed yet. Submit an instant PCB quote from the homepage to see it appear here immediately."}
              </p>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setSearch(""); setStatusFilter("ALL"); }}>
                  Reset Filters
                </Button>
                <Button size="sm" onClick={fetchOrders} className="bg-emerald-600 text-white">
                  Refresh
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200 dark:border-slate-800 text-xs">
                    <TableHead className="font-extrabold">Order ID</TableHead>
                    <TableHead className="font-extrabold">Customer</TableHead>
                    <TableHead className="font-extrabold">Specifications & Product</TableHead>
                    <TableHead className="font-extrabold">Gerber / Design</TableHead>
                    <TableHead className="font-extrabold">Total Amount</TableHead>
                    <TableHead className="font-extrabold">Status</TableHead>
                    <TableHead className="font-extrabold">Date</TableHead>
                    <TableHead className="font-extrabold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const customerEmail = order.user?.email || order.inquiry?.email || "N/A";
                    const customerName = order.user?.name || order.inquiry?.fullName || customerEmail.split("@")[0];
                    const customerPhone = order.user?.phone || order.inquiry?.phone;
                    const fileUrls = order.inquiry?.fileUrls || [];
                    const statusClass = statusColors[order.status] || "bg-gray-100 text-gray-800 border-gray-300";

                    return (
                      <TableRow key={order.id} className="border-b border-gray-100 hover:bg-gray-50/60 dark:border-slate-800/60 dark:hover:bg-slate-800/40">
                        {/* Order ID */}
                        <TableCell className="align-top py-3.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-black text-emerald-700 dark:text-emerald-400">
                              #{order.id.slice(0, 8).toUpperCase()}
                            </span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(order.id, "Full Order ID")}
                              title="Copy full UUID"
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
                            >
                              <Copy className="size-3" />
                            </button>
                          </div>
                          <span className="text-[10px] text-gray-400 block mt-0.5">
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </TableCell>

                        {/* Customer */}
                        <TableCell className="align-top py-3.5">
                          <div className="space-y-0.5">
                            <div className="text-xs font-extrabold text-gray-900 dark:text-white">
                              {customerName}
                            </div>
                            <div className="text-[11px] text-gray-500 dark:text-slate-400 flex items-center gap-1">
                              <a href={`mailto:${customerEmail}`} className="hover:text-emerald-600 underline">
                                {customerEmail}
                              </a>
                            </div>
                            {customerPhone ? (
                              <div className="text-[10px] text-gray-400">
                                📞 {customerPhone}
                              </div>
                            ) : null}
                          </div>
                        </TableCell>

                        {/* Specifications & Product */}
                        <TableCell className="align-top py-3.5 max-w-[280px]">
                          {order.inquiry ? (
                            <div className="space-y-1">
                              <div className="text-xs font-black text-gray-800 dark:text-slate-200">
                                {order.inquiry.boardType || "Custom PCB Prototype"}
                              </div>
                              <div className="flex flex-wrap gap-1 text-[10px]">
                                {order.inquiry.layers ? (
                                  <span className="rounded bg-gray-100 px-1.5 py-0.5 font-bold text-gray-700 dark:bg-slate-800 dark:text-slate-300">
                                    {order.inquiry.layers} Layers
                                  </span>
                                ) : null}
                                {order.inquiry.quantity ? (
                                  <span className="rounded bg-gray-100 px-1.5 py-0.5 font-bold text-gray-700 dark:bg-slate-800 dark:text-slate-300">
                                    {order.inquiry.quantity} pcs
                                  </span>
                                ) : null}
                                {order.inquiry.length && order.inquiry.width ? (
                                  <span className="rounded bg-gray-100 px-1.5 py-0.5 font-bold text-gray-700 dark:bg-slate-800 dark:text-slate-300">
                                    {order.inquiry.length}x{order.inquiry.width}mm
                                  </span>
                                ) : null}
                                {order.inquiry.surfaceFinish ? (
                                  <span className="rounded bg-emerald-50 px-1.5 py-0.5 font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                    {order.inquiry.surfaceFinish}
                                  </span>
                                ) : null}
                                {order.inquiry.solderMaskColor ? (
                                  <span className="rounded bg-emerald-50 px-1.5 py-0.5 font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                                    {order.inquiry.solderMaskColor}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          ) : order.orderItems?.length ? (
                            <div className="text-xs font-semibold text-gray-700 dark:text-slate-300 space-y-0.5">
                              {order.orderItems.map((item, idx) => (
                                <div key={item.id || idx}>
                                  {item.product?.name || "Product"} × {item.quantity} (${item.price?.toFixed(2)})
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">Direct Quote Order</span>
                          )}
                        </TableCell>

                        {/* Gerber / Design Files */}
                        <TableCell className="align-top py-3.5">
                          {fileUrls.length > 0 ? (
                            <div className="flex flex-col gap-1.5">
                              {fileUrls.map((url, i) => {
                                const filename = url.split("/").pop() || `gerber-order-${order.id.slice(0, 8)}-${i + 1}.zip`;
                                const downloadUrl = getDownloadProxyUrl(url, filename);
                                return (
                                  <a
                                    key={url + i}
                                    href={downloadUrl}
                                    download={filename}
                                    onClick={() => {
                                      toast.success(`✓ Download started: Gerber #${i + 1}`);
                                    }}
                                    title={`Download Gerber file #${i + 1} (${filename})`}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800 hover:bg-emerald-100 hover:border-emerald-400 transition active:scale-95 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 cursor-pointer shadow-2xs w-fit"
                                  >
                                    <Download className="size-3 text-emerald-600 dark:text-emerald-400" />
                                    <span>Gerber #{i + 1}</span>
                                  </a>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1">
                              <a
                                href={getSpecsDownloadUrl(order)}
                                download={`CAM_Specs_Order_${order.id.slice(0, 8).toUpperCase()}.txt`}
                                onClick={() => {
                                  toast.success(`✓ Downloading CAM Spec Sheet for #${order.id.slice(0, 8).toUpperCase()}`);
                                }}
                                title="Download official CAM Engineering Spec Sheet (.txt)"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-blue-300 bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-800 hover:bg-blue-100 hover:border-blue-400 transition active:scale-95 dark:border-blue-700 dark:bg-blue-950/60 dark:text-blue-300 cursor-pointer shadow-2xs w-fit"
                              >
                                <Download className="size-3 text-blue-600 dark:text-blue-400" />
                                <span>Specs (.txt)</span>
                              </a>
                              <span className="text-[10px] text-gray-400 font-medium">CAM Staged</span>
                            </div>
                          )}
                        </TableCell>

                        {/* Total Amount */}
                        <TableCell className="align-top py-3.5 whitespace-nowrap">
                          <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                            ${Number(order.totalAmount).toFixed(2)}
                          </span>
                        </TableCell>

                        {/* Status Selector */}
                        <TableCell className="align-top py-3.5">
                          <div className="flex items-center gap-1.5">
                            <Select
                              defaultValue={order.status}
                              disabled={updatingId === order.id}
                              onValueChange={(val) => handleUpdateStatus(order.id, val)}
                            >
                              <SelectTrigger className={`h-7 w-36 text-[11px] font-black border rounded-lg ${statusClass}`}>
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

                        {/* Created Date */}
                        <TableCell className="align-top py-3.5 text-xs text-gray-500 whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>

                        {/* Quick Actions */}
                        <TableCell className="align-top py-3.5 text-right whitespace-nowrap">
                          {order.status !== "PRODUCTION" && order.status !== "DELIVERED" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-[11px] font-bold text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400"
                              disabled={updatingId === order.id}
                              onClick={() => handleUpdateStatus(order.id, "PRODUCTION")}
                            >
                              Start Production
                            </Button>
                          ) : order.status === "PRODUCTION" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-[11px] font-bold text-blue-700 hover:bg-blue-50 dark:text-blue-400"
                              disabled={updatingId === order.id}
                              onClick={() => handleUpdateStatus(order.id, "SHIPPED")}
                            >
                              Mark Shipped
                            </Button>
                          ) : (
                            <span className="text-[11px] text-gray-400 font-bold">Completed</span>
                          )}
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
    </div>
  );
}
