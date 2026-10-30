"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Clock,
  Copy,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Layers,
  LifeBuoy,
  Loader2,
  Mail,
  MapPin,
  Phone,
  RefreshCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  User,
  UserCheck,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminService, type AdminCustomer } from "@/services/admin.service";
import { PaginationMeta } from "@/services/api-client";

const statusStyles: Record<string, { badge: string; dot: string; label: string }> = {
  ACTIVE: {
    badge: "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
    dot: "bg-emerald-500",
    label: "Active",
  },
  INACTIVE: {
    badge: "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
    dot: "bg-amber-500",
    label: "Inactive",
  },
  BLOCKED: {
    badge: "bg-red-50 text-red-800 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800",
    dot: "bg-red-500",
    label: "Blocked",
  },
  DELETED: {
    badge: "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
    dot: "bg-gray-400",
    label: "Deleted",
  },
};

const orderStatusStyles: Record<string, { badge: string; dot: string }> = {
  PENDING: {
    badge: "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
    dot: "bg-amber-500",
  },
  CONFIRMED: {
    badge: "bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800",
    dot: "bg-sky-500",
  },
  PROCESSING: {
    badge: "bg-indigo-50 text-indigo-800 border-indigo-300 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800",
    dot: "bg-indigo-500",
  },
  SHIPPED: {
    badge: "bg-purple-50 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
    dot: "bg-purple-500",
  },
  DELIVERED: {
    badge: "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
    dot: "bg-emerald-500",
  },
  COMPLETED: {
    badge: "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
    dot: "bg-emerald-500",
  },
  CANCELLED: {
    badge: "bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800",
    dot: "bg-rose-500",
  },
};

const getDownloadProxyUrl = (rawUrl: string, filename?: string) => {
  if (!rawUrl) return "#";
  const nameParam = filename ? `&name=${encodeURIComponent(filename)}` : "";
  return `/api/download?url=${encodeURIComponent(rawUrl)}${nameParam}`;
};

const getCustomerOrderSpecsDownloadUrl = (
  order: NonNullable<AdminCustomer["orders"]>[number],
  customer: AdminCustomer
) => {
  const params = new URLSearchParams({
    type: "specs",
    orderId: order.id,
    customer: customer.name || customer.email.split("@")[0] || "Customer",
    boardType: order.inquiry?.boardType || "Custom PCB",
    layers: String(order.inquiry?.layers || 2),
    qty: String(order.inquiry?.quantity || 5),
    dims: "Standard",
    finish: "HASL",
    mask: "Green",
    total: String(Number(order.totalAmount || 0).toFixed(2)),
  });
  return `/api/download?${params.toString()}`;
};

const getInquirySpecsDownloadUrl = (
  inquiry: NonNullable<AdminCustomer["inquiries"]>[number],
  customer: AdminCustomer
) => {
  const params = new URLSearchParams({
    type: "specs",
    orderId: inquiry.id,
    customer: customer.name || customer.email.split("@")[0] || "Customer",
    boardType: inquiry.boardType || "Custom PCB",
    layers: String(inquiry.layers || 2),
    qty: String(inquiry.quantity || 5),
    dims: "Standard",
    finish: "HASL",
    mask: "Green",
    total: String(Number(inquiry.estimatedPrice || 0).toFixed(2)),
  });
  return `/api/download?${params.toString()}`;
};

export default function AdminCustomersManager() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
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
    stats: {
      totalCustomers: 0,
      activeCustomers: 0,
      verifiedCustomers: 0,
      totalOrders: 0,
    },
  });

  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [updatingRowId, setUpdatingRowId] = useState<string | null>(null);
  const [modalStatus, setModalStatus] = useState<string>("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await AdminService.getCustomersWithPagination({
        page,
        limit,
        status: statusFilter,
        search: debouncedSearch,
      });

      const list = Array.isArray(response.data) ? response.data : [];
      setCustomers(list);

      if (response.meta) {
        setMeta(response.meta);
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      toast.error("Failed to load customers from server.");
    } finally {
      setLoading(false);
    }
  }, [page, limit, statusFilter, debouncedSearch]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const handleOpenCustomer = (customer: AdminCustomer) => {
    setSelectedCustomer(customer);
    setModalStatus(customer.status);
  };

  const handleUpdateStatus = async (
    targetUserId: string,
    newStatus: "ACTIVE" | "INACTIVE" | "BLOCKED" | "DELETED"
  ) => {
    try {
      setIsUpdatingStatus(true);
      setUpdatingRowId(targetUserId);
      await AdminService.updateCustomerStatus(targetUserId, newStatus);

      // Update local states
      setCustomers((prev) =>
        prev.map((c) => (c.id === targetUserId ? { ...c, status: newStatus } : c))
      );

      if (selectedCustomer && selectedCustomer.id === targetUserId) {
        setSelectedCustomer((prev) => (prev ? { ...prev, status: newStatus } : null));
        setModalStatus(newStatus);
      }

      toast.success(`Customer account status updated to ${newStatus}`);
    } catch (error) {
      console.error("Status update failed:", error);
      toast.error("Failed to update customer status.");
    } finally {
      setIsUpdatingStatus(false);
      setUpdatingRowId(null);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label} to clipboard`);
  };

  const handleCopy = (text: string, label: string, fieldId?: string) => {
    copyToClipboard(text, label);
    if (fieldId) {
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  // Aggregate Metrics from backend meta.stats
  const stats = useMemo(() => {
    if (meta?.stats) {
      return {
        total: meta.stats.totalCustomers || meta.total || 0,
        active: meta.stats.activeCustomers || 0,
        verified: meta.stats.verifiedCustomers || 0,
        totalOrders: meta.stats.totalOrders || 0,
      };
    }
    const total = meta.total || customers.length;
    const active = customers.filter((c) => c.status === "ACTIVE").length;
    const verified = customers.filter((c) => c.isVerified).length;
    const totalOrders = customers.reduce((sum, c) => sum + (c._count?.orders || 0), 0);
    return { total, active, verified, totalOrders };
  }, [meta, customers]);

  const exportToCsv = async () => {
    try {
      toast.info("Fetching customer records for export...");
      const allCustomers = await AdminService.getCustomers({
        status: statusFilter,
        search: debouncedSearch,
      });

      const list = Array.isArray(allCustomers) ? allCustomers : customers;
      if (list.length === 0) {
        toast.error("No customer records to export");
        return;
      }

      const headers = [
        "Customer ID",
        "Name",
        "Email",
        "Company",
        "Phone",
        "Address",
        "Status",
        "Verified",
        "Total Orders",
        "CAM Inquiries",
        "Joined Date",
      ];

      const rows = list.map((c) => [
        `"${c.id}"`,
        `"${(c.name || "").replace(/"/g, '""')}"`,
        `"${(c.email || "").replace(/"/g, '""')}"`,
        `"${(c.companyName || "").replace(/"/g, '""')}"`,
        `"${(c.phone || "").replace(/"/g, '""')}"`,
        `"${(c.address || "").replace(/"/g, '""')}"`,
        `"${c.status}"`,
        `"${c.isVerified ? "Yes" : "No"}"`,
        c._count?.orders || c.orders?.length || 0,
        c._count?.inquiries || c.inquiries?.length || 0,
        `"${new Date(c.createdAt).toISOString()}"`,
      ]);

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `customers_export_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Exported ${list.length} customer records to CSV`);
    } catch (error) {
      console.error("Export CSV failed:", error);
      toast.error("Failed to export customer data.");
    }
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return name.slice(0, 2).toUpperCase();
    }
    if (email) return email.slice(0, 2).toUpperCase();
    return "CU";
  };

  // Generate pagination page list with ellipsis
  const getPageNumbers = (current: number, total: number) => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const pages: (number | string)[] = [];
    if (current <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", total);
    } else if (current >= total - 3) {
      pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
    } else {
      pages.push(1, "...", current - 1, current, current + 1, "...", total);
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. Header Section                                                         */}
      {/* ========================================================================= */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <Users className="size-6" />
            </span>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200 mb-1.5 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Customer CRM & Directory
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Customer Accounts & Engineering Profiles
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-slate-400">
                Inspect customer profiles, track live orders, inspect CAM quotes, and manage account statuses.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={exportToCsv}
              className="gap-1.5 rounded-xl border-gray-200 dark:border-slate-800 text-xs font-bold hover:border-emerald-500"
            >
              <Download className="size-3.5 text-gray-500" />
              <span>Export CSV</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={loadCustomers}
              disabled={loading}
              className="gap-1.5 rounded-xl border-gray-200 dark:border-slate-800 text-xs font-bold hover:border-emerald-500"
            >
              <RefreshCcw className={`size-3.5 ${loading ? "animate-spin text-emerald-600" : ""}`} />
              <span>Refresh</span>
            </Button>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-black text-white shadow-xs hover:bg-emerald-700 transition"
            >
              <ShoppingBag className="size-3.5" />
              <span>Orders Manager</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. Key Metrics Grid                                                       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-gray-200/80 dark:border-slate-800 shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Total Customers
              </span>
              <Users className="size-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-gray-900 dark:text-white">
              {stats.total}
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">Registered platform accounts</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-emerald-300/80 bg-emerald-50/30 dark:bg-emerald-950/20 dark:border-emerald-800/60 shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Active Accounts
              </span>
              <UserCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-emerald-700 dark:text-emerald-300">
              {stats.active}
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400/80 font-medium mt-0.5">
              Good standing & ready to order
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200/80 dark:border-slate-800 shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
                Verified Customers
              </span>
              <ShieldCheck className="size-4 text-sky-600 dark:text-sky-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-sky-600 dark:text-sky-400">
              {stats.verified}
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">Email / enterprise verified</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200/80 dark:border-slate-800 shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                Customer Orders
              </span>
              <ShoppingBag className="size-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-blue-600 dark:text-blue-400">
              {stats.totalOrders}
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">Across all client accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* 3. Filter Navigation & Search Bar                                         */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        {/* Quick status tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: "All Customers", value: "ALL" },
            { label: "Active", value: "ACTIVE" },
            { label: "Inactive", value: "INACTIVE" },
            { label: "Blocked", value: "BLOCKED" },
            { label: "Deleted", value: "DELETED" },
          ].map((item) => {
            const isActive = statusFilter === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setStatusFilter(item.value)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                <span>{item.label}</span>
                {item.value === "ALL" && (
                  <span className="rounded-full bg-black/15 px-1.5 py-0.2 text-[10px]">
                    {stats.total}
                  </span>
                )}
                {item.value === "ACTIVE" && (
                  <span className="rounded-full bg-black/15 px-1.5 py-0.2 text-[10px]">
                    {stats.active}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search and Secondary Filter */}
        <Card className="rounded-2xl border-gray-200 dark:border-slate-800 shadow-xs">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-2.5 size-4 text-gray-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by customer name, email, company, phone, address..."
                  className="pl-9 text-xs rounded-xl border-gray-200 dark:border-slate-800"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    title="Clear search"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 dark:text-slate-400 whitespace-nowrap">
                  Account Status:
                </span>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-44 text-xs font-bold rounded-xl border-gray-200 dark:border-slate-800">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses ({stats.total})</SelectItem>
                    <SelectItem value="ACTIVE">Active ({stats.active})</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                    <SelectItem value="BLOCKED">Blocked</SelectItem>
                    <SelectItem value="DELETED">Deleted</SelectItem>
                  </SelectContent>
                </Select>

                {(search || statusFilter !== "ALL") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearch("");
                      setStatusFilter("ALL");
                      setPage(1);
                    }}
                    className="text-xs text-slate-500 hover:text-emerald-600"
                  >
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* 4. Customers Table Container (Drawer-Proof Widths & Sticky Actions)      */}
      {/* ========================================================================= */}
      <Card className="rounded-2xl border-gray-200 shadow-xs dark:border-slate-800 overflow-hidden">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-white to-gray-50/80 p-4 sm:p-5 dark:border-slate-800/80 dark:from-slate-900/90 dark:via-slate-900 dark:to-slate-900/90">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <CardTitle className="text-lg font-black text-gray-900 dark:text-white">
                  Customer Accounts Directory
                </CardTitle>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {meta.total}
                </span>
              </div>
              <CardDescription className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                Client credentials, registered contact channels, order activity, and CAM fabrication requests.
              </CardDescription>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-xs font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                <span>Live CRM Sync</span>
              </div>

              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 hidden md:inline-flex items-center gap-1">
                ↔ Scroll horizontally for full data
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-14 text-center">
              <Loader2 className="size-8 animate-spin text-emerald-600 mb-3" />
              <p className="text-sm font-bold text-gray-700 dark:text-slate-300">
                Loading customer profiles from database...
              </p>
            </div>
          ) : customers.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-14 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-slate-800 text-gray-400 mb-3">
                <Users className="size-7" />
              </div>
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
                No Customer Accounts Found
              </h3>
              <p className="mt-1 text-xs text-gray-500 max-w-sm">
                {search || statusFilter !== "ALL"
                  ? `No customer matches your search or filter settings. Try clearing the search query or status filter.`
                  : "No customer accounts have registered yet."}
              </p>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("ALL");
                    setPage(1);
                  }}
                >
                  Reset Filters
                </Button>
                <Button size="sm" onClick={loadCustomers} className="bg-emerald-600 text-white">
                  Refresh
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
              <Table className="min-w-[1360px] w-full border-collapse">
                <TableHeader>
                  <TableRow className="border-b border-gray-200 bg-gray-50/80 dark:border-slate-800 dark:bg-slate-900/80 text-xs">
                    {/* Customer Info */}
                    <TableHead className="w-[280px] min-w-[280px] font-extrabold text-slate-700 dark:text-slate-300 pl-4">
                      <div className="flex items-center gap-1.5">
                        <User className="size-3 text-emerald-600" />
                        <span>Customer Profile</span>
                      </div>
                    </TableHead>

                    {/* Company & Phone */}
                    <TableHead className="w-[240px] min-w-[240px] font-extrabold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="size-3 text-emerald-600" />
                        <span>Company & Phone</span>
                      </div>
                    </TableHead>

                    {/* Location / Address */}
                    <TableHead className="w-[220px] min-w-[220px] font-extrabold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="size-3 text-emerald-600" />
                        <span>Location / Address</span>
                      </div>
                    </TableHead>

                    {/* Activity */}
                    <TableHead className="w-[180px] min-w-[180px] font-extrabold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <ShoppingBag className="size-3 text-emerald-600" />
                        <span>Activity & Orders</span>
                      </div>
                    </TableHead>

                    {/* Status */}
                    <TableHead className="w-[170px] min-w-[170px] font-extrabold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="size-3 text-emerald-600" />
                        <span>Account Status</span>
                      </div>
                    </TableHead>

                    {/* Joined Date */}
                    <TableHead className="w-[130px] min-w-[130px] font-extrabold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="size-3 text-emerald-600" />
                        <span>Joined Date</span>
                      </div>
                    </TableHead>

                    {/* Sticky Actions */}
                    <TableHead className="w-[140px] min-w-[140px] sticky right-0 bg-gray-50/95 dark:bg-slate-900/95 backdrop-blur-xs z-10 text-right pr-4 font-extrabold text-slate-700 dark:text-slate-300 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.06)] dark:shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.4)]">
                      <span>Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {customers.map((customer) => {
                    const statusConfig = statusStyles[customer.status] || statusStyles.ACTIVE;
                    const ordersCount = customer._count?.orders ?? customer.orders?.length ?? 0;
                    const inquiriesCount = customer._count?.inquiries ?? customer.inquiries?.length ?? 0;
                    const isUpdatingThisRow = updatingRowId === customer.id;

                    return (
                      <TableRow
                        key={customer.id}
                        className="group border-b border-gray-100 hover:bg-slate-50/60 dark:border-slate-800/60 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        {/* 1. Customer Avatar, Name, Email */}
                        <TableCell className="w-[280px] min-w-[280px] align-top py-3.5 pl-4">
                          <div className="flex items-start gap-3">
                            <div className="relative flex size-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-xs font-black text-white shadow-xs">
                              {getInitials(customer.name, customer.email)}
                              <span
                                className={cn(
                                  "absolute -bottom-0.5 -right-0.5 size-3 rounded-full ring-2 ring-white dark:ring-slate-900",
                                  statusConfig.dot
                                )}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 font-bold text-gray-900 dark:text-white text-xs">
                                <span className="truncate">
                                  {customer.name || customer.email.split("@")[0]}
                                </span>
                                {customer.isVerified && (
                                  <span title="Verified Customer">
                                    <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-gray-500 dark:text-slate-400 font-medium truncate flex items-center gap-1 mt-0.5">
                                <Mail className="size-3 shrink-0 text-gray-400" />
                                <span className="truncate">{customer.email}</span>
                              </div>
                              <div className="text-[10px] text-gray-400 font-mono mt-0.5">
                                ID: {customer.id.slice(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* 2. Company & Phone */}
                        <TableCell className="w-[240px] min-w-[240px] align-top py-3.5 whitespace-normal">
                          <div className="space-y-1 text-xs">
                            <div className="font-semibold text-gray-800 dark:text-slate-200 flex items-center gap-1.5">
                              <Building2 className="size-3.5 text-gray-400 shrink-0" />
                              <span className="truncate">
                                {customer.companyName || "Independent Engineer"}
                              </span>
                            </div>
                            <div className="text-[11px] text-gray-500 dark:text-slate-400 flex items-center gap-1.5">
                              <Phone className="size-3 text-gray-400 shrink-0" />
                              <span>{customer.phone || "No phone listed"}</span>
                            </div>
                          </div>
                        </TableCell>

                        {/* 3. Location / Address */}
                        <TableCell className="w-[220px] min-w-[220px] align-top py-3.5 whitespace-normal">
                          <div className="flex items-start gap-1.5 text-xs text-gray-600 dark:text-slate-300">
                            <MapPin className="size-3.5 text-gray-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-2 text-[11px] leading-relaxed">
                              {customer.address || "No shipping address on file"}
                            </span>
                          </div>
                        </TableCell>

                        {/* 4. Activity Counts */}
                        <TableCell className="w-[180px] min-w-[180px] align-top py-3.5">
                          <div className="flex flex-col gap-1">
                            <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 w-fit">
                              <ShoppingBag className="size-3" />
                              {ordersCount} {ordersCount === 1 ? "Order" : "Orders"}
                            </span>
                            {inquiriesCount > 0 && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 text-[11px] font-bold text-purple-700 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800 w-fit">
                                <Layers className="size-3" />
                                {inquiriesCount} CAM Quotes
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* 5. Status Selector / Badge */}
                        <TableCell className="w-[170px] min-w-[170px] align-top py-3.5">
                          <div className="flex items-center gap-1.5">
                            <Select
                              defaultValue={customer.status}
                              disabled={isUpdatingThisRow}
                              onValueChange={(val) =>
                                handleUpdateStatus(
                                  customer.id,
                                  val as "ACTIVE" | "INACTIVE" | "BLOCKED" | "DELETED"
                                )
                              }
                            >
                              <SelectTrigger
                                className={`h-8 w-36 text-xs font-black border rounded-xl shadow-2xs ${statusConfig.badge}`}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                                <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                                <SelectItem value="BLOCKED">BLOCKED</SelectItem>
                                <SelectItem value="DELETED">DELETED</SelectItem>
                              </SelectContent>
                            </Select>
                            {isUpdatingThisRow && (
                              <Loader2 className="size-3.5 animate-spin text-emerald-600" />
                            )}
                          </div>
                        </TableCell>

                        {/* 6. Joined Date */}
                        <TableCell className="w-[130px] min-w-[130px] align-top py-3.5 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <div className="text-xs font-bold text-gray-800 dark:text-slate-200">
                              {new Date(customer.createdAt).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                            <div className="text-[11px] text-gray-400">
                              {customer.lastLoginAt
                                ? `Active ${new Date(customer.lastLoginAt).toLocaleDateString()}`
                                : "Registered"}
                            </div>
                          </div>
                        </TableCell>

                        {/* 7. Sticky Actions Column */}
                        <TableCell className="w-[140px] min-w-[140px] sticky right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs z-10 text-right pr-4 align-top py-3.5 whitespace-nowrap shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.06)] dark:shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.4)] group-hover:bg-slate-50/95 dark:group-hover:bg-slate-800/95 transition-colors">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenCustomer(customer)}
                            className="h-8 text-xs font-bold text-emerald-700 bg-emerald-50/60 hover:bg-emerald-600 hover:text-white dark:text-emerald-400 dark:bg-emerald-950/40 dark:hover:bg-emerald-600 dark:hover:text-white gap-1.5 rounded-xl border-emerald-300 dark:border-emerald-800 shadow-2xs transition-all cursor-pointer"
                          >
                            <Eye className="size-3.5" />
                            <span>Open Profile</span>
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
            {/* Record summary & Per-page dropdown */}
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
                customers
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

            {/* Page Navigation Controls */}
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
                  const isCurrent = p === page;
                  return (
                    <Button
                      key={`page-${p}`}
                      variant={isCurrent ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(p as number)}
                      disabled={loading}
                      className={`size-8 p-0 text-xs font-bold rounded-xl cursor-pointer ${
                        isCurrent
                          ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                          : "border-gray-200 dark:border-slate-800 hover:bg-gray-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {p}
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

      {/* ========================================================================= */}
      {/* 5. Rich Customer Details Dialog (Opened when clicking "Open Profile")     */}
      {/* ========================================================================= */}
      <Dialog open={Boolean(selectedCustomer)} onOpenChange={(open) => !open && setSelectedCustomer(null)}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-4xl lg:max-w-5xl w-[95vw] max-h-[92vh] p-0 overflow-hidden rounded-2xl md:rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0b1329] shadow-2xl flex flex-col gap-0 outline-none"
        >
          {selectedCustomer && (
            <>
              {/* Screen reader title */}
              <div className="sr-only">
                <DialogTitle>{selectedCustomer.name || selectedCustomer.email} Profile</DialogTitle>
                <DialogDescription>
                  Customer profile details, orders, CAM quotes, and account permissions
                </DialogDescription>
              </div>

              {/* Top Gradient Ribbon Accent */}
              <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 shrink-0" />

              {/* Top Profile Header */}
              <div className="relative px-6 py-5 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/90 dark:to-[#0b1329] border-b border-slate-200/80 dark:border-slate-800 shrink-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Left: Avatar & Info */}
                  <div className="flex items-center gap-4">
                    <div className="relative size-16 shrink-0 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-800 text-white font-black text-2xl shadow-lg shadow-emerald-600/20 flex items-center justify-center ring-2 ring-emerald-500/20">
                      {getInitials(selectedCustomer.name, selectedCustomer.email)}
                      <span
                        className={cn(
                          "absolute -bottom-1 -right-1 size-4 rounded-full ring-2 ring-white dark:ring-[#0b1329]",
                          selectedCustomer.status === "ACTIVE"
                            ? "bg-emerald-500"
                            : selectedCustomer.status === "INACTIVE"
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        )}
                        title={`Account status: ${selectedCustomer.status}`}
                      />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                          {selectedCustomer.name || selectedCustomer.email.split("@")[0]}
                        </h2>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs font-bold rounded-full gap-1.5 px-2.5 py-0.5",
                            (statusStyles[selectedCustomer.status] || statusStyles.ACTIVE).badge
                          )}
                        >
                          <span
                            className={cn(
                              "size-1.5 rounded-full",
                              (statusStyles[selectedCustomer.status] || statusStyles.ACTIVE).dot
                            )}
                          />
                          {(statusStyles[selectedCustomer.status] || statusStyles.ACTIVE).label}
                        </Badge>

                        {selectedCustomer.isVerified && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300/80 dark:border-emerald-800 px-2.5 py-0.5 rounded-full shadow-2xs">
                            <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                            Verified Customer
                          </span>
                        )}
                      </div>

                      {/* Subtitle / User ID pill with 1-click copy */}
                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <button
                          type="button"
                          onClick={() => handleCopy(selectedCustomer.id, "User ID", "id")}
                          title="Click to copy full User ID"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-800/60 px-2.5 py-1 font-mono text-[11px] text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition cursor-pointer"
                        >
                          <span>ID: {selectedCustomer.id}</span>
                          {copiedField === "id" ? (
                            <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                          ) : (
                            <Copy className="size-3 text-slate-400" />
                          )}
                        </button>

                        <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>

                        <span className="inline-flex items-center gap-1">
                          <Calendar className="size-3 text-slate-400" />
                          Member since {new Date(selectedCustomer.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Quick Contact & Close */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <a
                      href={`mailto:${selectedCustomer.email}`}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:shadow-xs transition active:scale-95"
                    >
                      <Mail className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Email</span>
                    </a>

                    {selectedCustomer.phone && (
                      <a
                        href={`tel:${selectedCustomer.phone}`}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:shadow-xs transition active:scale-95"
                      >
                        <Phone className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Call</span>
                      </a>
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedCustomer(null)}
                      className="rounded-xl size-9 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      title="Close modal"
                    >
                      <X className="size-4" />
                      <span className="sr-only">Close</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Status Control Bar */}
              <div className="px-6 py-3 bg-emerald-50/60 dark:bg-emerald-950/20 border-b border-emerald-100 dark:border-emerald-900/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2 text-xs">
                  <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Account Operational Status: </span>
                    <span className="text-slate-500 dark:text-slate-400 hidden md:inline">
                      Control customer access across PCB quoting, order checkout, and account login.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Select
                    value={modalStatus}
                    onValueChange={(val) => setModalStatus(val)}
                  >
                    <SelectTrigger className="h-8.5 w-38 text-xs font-bold rounded-lg border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">
                        <div className="flex items-center gap-2">
                          <span className="size-2 rounded-full bg-emerald-500" />
                          <span>ACTIVE</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="INACTIVE">
                        <div className="flex items-center gap-2">
                          <span className="size-2 rounded-full bg-amber-500" />
                          <span>INACTIVE</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="BLOCKED">
                        <div className="flex items-center gap-2">
                          <span className="size-2 rounded-full bg-rose-500" />
                          <span>BLOCKED</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="DELETED">
                        <div className="flex items-center gap-2">
                          <span className="size-2 rounded-full bg-slate-400" />
                          <span>DELETED</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    size="sm"
                    disabled={modalStatus === selectedCustomer.status || isUpdatingStatus}
                    onClick={() =>
                      handleUpdateStatus(
                        selectedCustomer.id,
                        modalStatus as "ACTIVE" | "INACTIVE" | "BLOCKED" | "DELETED"
                      )
                    }
                    className="h-8.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs px-3.5"
                  >
                    {isUpdatingStatus ? (
                      <>
                        <Loader2 className="size-3 animate-spin mr-1" />
                        Saving...
                      </>
                    ) : (
                      "Save Status"
                    )}
                  </Button>
                </div>
              </div>

              {/* 4 Stat Metric Cards */}
              {(() => {
                const totalSpend = (selectedCustomer.orders || []).reduce(
                  (sum, order) => sum + Number(order.totalAmount || 0),
                  0
                );
                const ordersCount = selectedCustomer.orders?.length ?? selectedCustomer._count?.orders ?? 0;
                const inquiriesCount = selectedCustomer.inquiries?.length ?? selectedCustomer._count?.inquiries ?? 0;
                const ticketsCount = selectedCustomer._count?.tickets ?? 0;

                return (
                  <div className="px-6 py-4 grid grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50/40 dark:bg-slate-900/30 border-b border-slate-200/80 dark:border-slate-800 shrink-0">
                    <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-2xs">
                      <div className="flex items-center justify-between text-slate-400 mb-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider">Total Orders</span>
                        <ShoppingBag className="size-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="text-xl font-black text-slate-900 dark:text-white">
                        {ordersCount}
                      </div>
                      <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                        ${totalSpend.toFixed(2)} lifetime spend
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-2xs">
                      <div className="flex items-center justify-between text-slate-400 mb-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider">CAM Quotes</span>
                        <Layers className="size-4 text-cyan-600 dark:text-cyan-400" />
                      </div>
                      <div className="text-xl font-black text-slate-900 dark:text-white">
                        {inquiriesCount}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                        Gerbers submitted
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-2xs">
                      <div className="flex items-center justify-between text-slate-400 mb-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider">Support Tickets</span>
                        <LifeBuoy className="size-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="text-xl font-black text-slate-900 dark:text-white">
                        {ticketsCount}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                        Helpdesk inquiries
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-2xs">
                      <div className="flex items-center justify-between text-slate-400 mb-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider">Customer Tier</span>
                        <Sparkles className="size-4 text-emerald-500" />
                      </div>
                      <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-1">
                        {totalSpend > 500 ? "VIP Enterprise" : totalSpend > 0 ? "Active Client" : "Registered User"}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        {selectedCustomer.companyName || "Standard Account"}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Scrollable Tabs Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 min-h-[280px]">
                <Tabs defaultValue="orders" className="w-full space-y-4">
                  <TabsList className="grid w-full grid-cols-3 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 h-auto">
                    <TabsTrigger
                      value="orders"
                      className="text-xs font-bold gap-2 py-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:shadow-2xs"
                    >
                      <ShoppingBag className="size-3.5" />
                      <span>Orders ({selectedCustomer.orders?.length || selectedCustomer._count?.orders || 0})</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="inquiries"
                      className="text-xs font-bold gap-2 py-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:shadow-2xs"
                    >
                      <Layers className="size-3.5" />
                      <span>CAM Quotes ({selectedCustomer.inquiries?.length || selectedCustomer._count?.inquiries || 0})</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="contact"
                      className="text-xs font-bold gap-2 py-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:shadow-2xs"
                    >
                      <UserCheck className="size-3.5" />
                      <span>Account Profile</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* TAB 1: Orders */}
                  <TabsContent value="orders" className="mt-0 space-y-3 focus-visible:outline-none">
                    {selectedCustomer.orders && selectedCustomer.orders.length > 0 ? (
                      <div className="space-y-3">
                        {selectedCustomer.orders.map((order) => {
                          const statusInfo = orderStatusStyles[order.status] || orderStatusStyles.PENDING;
                          return (
                            <div
                              key={order.id}
                              className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-mono text-xs font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                                    #{order.id.slice(0, 8).toUpperCase()}
                                  </span>
                                  <Badge variant="outline" className={cn("text-[10px] font-black uppercase px-2 py-0.5", statusInfo.badge)}>
                                    <span className={cn("size-1.5 rounded-full mr-1", statusInfo.dot)} />
                                    {order.status}
                                  </Badge>
                                  <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                    <Clock className="size-3 text-slate-400" />
                                    {new Date(order.createdAt).toLocaleString(undefined, {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                      hour: "numeric",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                                    ${Number(order.totalAmount).toFixed(2)}
                                  </span>
                                  <Link
                                    href="/admin/orders"
                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                                  >
                                    <span>View Order</span>
                                    <ExternalLink className="size-3 text-slate-400" />
                                  </Link>
                                </div>
                              </div>

                              <div className="pt-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs">
                                <div>
                                  <div className="font-bold text-slate-800 dark:text-slate-200">
                                    {order.inquiry?.boardType || "Custom PCB"}
                                    <span className="font-normal text-slate-500 dark:text-slate-400 ml-1.5">
                                      ({order.inquiry?.layers || 2} Layers • {order.inquiry?.quantity || 5} pcs)
                                    </span>
                                  </div>
                                  {order.shippingAddress && (
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                                      <MapPin className="size-3 text-slate-400 shrink-0" />
                                      <span className="truncate max-w-md">{order.shippingAddress}</span>
                                    </p>
                                  )}
                                </div>

                                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                                  {order.inquiry?.fileUrls && order.inquiry.fileUrls.length > 0 ? (
                                    order.inquiry.fileUrls.map((fileUrl, fi) => {
                                      const filename = fileUrl.split("/").pop() || `Gerber_${order.id.slice(0, 8)}_${fi + 1}.zip`;
                                      const downloadUrl = getDownloadProxyUrl(fileUrl, filename);
                                      return (
                                        <a
                                          key={fileUrl + fi}
                                          href={downloadUrl}
                                          download={filename}
                                          onClick={() => toast.success(`✓ Starting download: Gerber #${fi + 1}`)}
                                          title={`Download Gerber file #${fi + 1} (${filename})`}
                                          className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-800 hover:bg-emerald-100 hover:border-emerald-400 transition active:scale-95 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 cursor-pointer shadow-2xs"
                                        >
                                          <Download className="size-3 text-emerald-600 dark:text-emerald-400" />
                                          <span>Gerber #{fi + 1} (.zip)</span>
                                        </a>
                                      );
                                    })
                                  ) : null}

                                  <a
                                    href={getCustomerOrderSpecsDownloadUrl(order, selectedCustomer)}
                                    download={`CAM_Specs_Order_${order.id.slice(0, 8).toUpperCase()}.txt`}
                                    onClick={() => toast.success(`✓ Downloading CAM Engineering Specs`)}
                                    title="Download CAM Specification Sheet (.txt)"
                                    className="inline-flex items-center gap-1 rounded-lg border border-sky-300 bg-sky-50 px-2 py-1 text-xs font-bold text-sky-800 hover:bg-sky-100 hover:border-sky-400 transition active:scale-95 dark:border-sky-800 dark:bg-sky-950/60 dark:text-sky-300 cursor-pointer shadow-2xs"
                                  >
                                    <Download className="size-3 text-sky-600 dark:text-sky-400" />
                                    <span>Specs Sheet (.txt)</span>
                                  </a>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                        <ShoppingBag className="size-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-400">No order history found</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">This customer has not placed any PCB orders yet.</p>
                      </div>
                    )}
                  </TabsContent>

                  {/* TAB 2: CAM Inquiries */}
                  <TabsContent value="inquiries" className="mt-0 space-y-3 focus-visible:outline-none">
                    {selectedCustomer.inquiries && selectedCustomer.inquiries.length > 0 ? (
                      <div className="space-y-3">
                        {selectedCustomer.inquiries.map((inquiry) => (
                          <div
                            key={inquiry.id}
                            className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono text-xs font-black text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-2.5 py-1 rounded-md border border-cyan-200 dark:border-cyan-800">
                                  #{inquiry.id.slice(0, 8).toUpperCase()}
                                </span>
                                <span className="font-bold text-slate-900 dark:text-white text-xs">
                                  {inquiry.boardType || "Custom PCB Prototype"}
                                </span>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                  <Clock className="size-3 text-slate-400" />
                                  {new Date(inquiry.createdAt).toLocaleDateString(undefined, {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>

                              <div>
                                {inquiry.estimatedPrice ? (
                                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                                    Quote: ${Number(inquiry.estimatedPrice).toFixed(2)}
                                  </span>
                                ) : (
                                  <Badge variant="outline" className="text-[10px] font-black uppercase text-amber-700 border-amber-300 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300">
                                    Review Pending
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="pt-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs">
                              <div className="flex flex-wrap items-center gap-2 text-slate-600 dark:text-slate-300">
                                <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 font-bold text-[11px]">
                                  {inquiry.layers || 2} Layers
                                </span>
                                <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 font-bold text-[11px]">
                                  {inquiry.quantity || 5} Pcs
                                </span>
                                <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 font-bold text-[11px]">
                                  FR-4 High-TG
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                                {inquiry.fileUrls && inquiry.fileUrls.length > 0 ? (
                                  inquiry.fileUrls.map((fileUrl, fi) => {
                                    const filename = fileUrl.split("/").pop() || `CAM_Inquiry_${inquiry.id.slice(0, 8)}_${fi + 1}.zip`;
                                    const downloadUrl = getDownloadProxyUrl(fileUrl, filename);
                                    return (
                                      <a
                                        key={fileUrl + fi}
                                        href={downloadUrl}
                                        download={filename}
                                        onClick={() => toast.success(`✓ Starting download: Gerber #${fi + 1}`)}
                                        title={`Download Gerber file #${fi + 1} (${filename})`}
                                        className="inline-flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-800 hover:bg-emerald-100 hover:border-emerald-400 transition active:scale-95 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 cursor-pointer shadow-2xs"
                                      >
                                        <Download className="size-3 text-emerald-600 dark:text-emerald-400" />
                                        <span>Gerber #{fi + 1} (.zip)</span>
                                      </a>
                                    );
                                  })
                                ) : null}

                                <a
                                  href={getInquirySpecsDownloadUrl(inquiry, selectedCustomer)}
                                  download={`CAM_Inquiry_${inquiry.id.slice(0, 8).toUpperCase()}_Specs.txt`}
                                  onClick={() => toast.success(`✓ Downloading CAM Inquiry Specification Sheet`)}
                                  title="Download CAM Inquiry Specification Sheet (.txt)"
                                  className="inline-flex items-center gap-1 rounded-lg border border-sky-300 bg-sky-50 px-2 py-1 text-xs font-bold text-sky-800 hover:bg-sky-100 hover:border-sky-400 transition active:scale-95 dark:border-sky-800 dark:bg-sky-950/60 dark:text-sky-300 cursor-pointer shadow-2xs"
                                >
                                  <Download className="size-3 text-sky-600 dark:text-sky-400" />
                                  <span>Specs Sheet (.txt)</span>
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                        <Layers className="size-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-400">No CAM quotes submitted</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Customer has not requested custom PCB quotes yet.</p>
                      </div>
                    )}
                  </TabsContent>

                  {/* TAB 3: Account & Shipping Profile */}
                  <TabsContent value="contact" className="mt-0 focus-visible:outline-none">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Contact Card */}
                      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 space-y-3.5 shadow-2xs">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                          <User className="size-4 text-emerald-600 dark:text-emerald-400" />
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                            Contact Information
                          </h4>
                        </div>

                        <div className="space-y-3 text-xs">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Primary Email</span>
                            <div className="flex items-center justify-between mt-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800">
                              <span className="font-bold text-slate-900 dark:text-white">{selectedCustomer.email}</span>
                              <button
                                type="button"
                                onClick={() => handleCopy(selectedCustomer.email, "Email", "email")}
                                className="text-slate-400 hover:text-emerald-600 transition cursor-pointer"
                                title="Copy Email"
                              >
                                {copiedField === "email" ? (
                                  <Check className="size-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="size-3.5" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone Number</span>
                            <div className="flex items-center justify-between mt-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800">
                              <span className="font-bold text-slate-900 dark:text-white">
                                {selectedCustomer.phone || "Not provided"}
                              </span>
                              {selectedCustomer.phone && (
                                <a
                                  href={`tel:${selectedCustomer.phone}`}
                                  className="text-emerald-600 hover:text-emerald-700 text-[11px] font-bold flex items-center gap-1"
                                >
                                  <Phone className="size-3" />
                                  Call
                                </a>
                              )}
                            </div>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Company / Organization</span>
                            <div className="flex items-center gap-2 mt-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800">
                              <Building2 className="size-3.5 text-slate-400" />
                              <span className="font-bold text-slate-900 dark:text-white">
                                {selectedCustomer.companyName || "Independent Individual"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Shipping & Security Card */}
                      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-4 space-y-3.5 shadow-2xs">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                          <MapPin className="size-4 text-emerald-600 dark:text-emerald-400" />
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                            Shipping & Account Security
                          </h4>
                        </div>

                        <div className="space-y-3 text-xs">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Default Shipping Address</span>
                            <div className="mt-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800">
                              <p className="font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                                {customerShippingAddress(selectedCustomer)}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800">
                              <span className="text-[10px] font-bold uppercase text-slate-400 block">Registration</span>
                              <span className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 block">
                                {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                              </span>
                            </div>

                            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800">
                              <span className="text-[10px] font-bold uppercase text-slate-400 block">Last Active</span>
                              <span className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 block">
                                {selectedCustomer.lastLoginAt
                                  ? new Date(selectedCustomer.lastLoginAt).toLocaleDateString()
                                  : "Recent"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3.5 bg-slate-50/80 dark:bg-slate-900/60 border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-mono text-[11px] truncate max-w-sm">ID: {selectedCustomer.id}</span>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setSelectedCustomer(null)}
                  className="rounded-xl font-bold text-xs px-5 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Close Profile
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function customerShippingAddress(customer: AdminCustomer) {
  if (customer.address) return customer.address;
  if (customer.orders && customer.orders.length > 0) {
    const orderWithAddress = customer.orders.find((o) => o.shippingAddress);
    if (orderWithAddress?.shippingAddress) return orderWithAddress.shippingAddress;
  }
  return "No shipping address on file yet.";
}
