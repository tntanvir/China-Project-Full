"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
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
  RefreshCw,
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
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedCustomer, setSelectedCustomer] = useState<AdminCustomer | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [modalStatus, setModalStatus] = useState<string>("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

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

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await AdminService.getCustomers();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      toast.error("Failed to load customers from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleOpenCustomer = (customer: AdminCustomer) => {
    setSelectedCustomer(customer);
    setModalStatus(customer.status);
  };

  const handleUpdateStatus = async (newStatus: "ACTIVE" | "INACTIVE" | "BLOCKED" | "DELETED") => {
    if (!selectedCustomer) return;

    try {
      setIsUpdatingStatus(true);
      await AdminService.updateCustomerStatus(selectedCustomer.id, newStatus);
      
      // Update local states
      const updatedCustomer = { ...selectedCustomer, status: newStatus };
      setSelectedCustomer(updatedCustomer);
      setModalStatus(newStatus);
      setCustomers((prev) =>
        prev.map((c) => (c.id === selectedCustomer.id ? { ...c, status: newStatus } : c))
      );

      toast.success(`Customer account status updated to ${newStatus}`);
    } catch (error) {
      console.error("Status update failed:", error);
      toast.error("Failed to update customer status.");
    } finally {
      setIsUpdatingStatus(false);
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

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesStatus = statusFilter === "ALL" || customer.status === statusFilter;
      const q = search.trim().toLowerCase();
      if (!q) return matchesStatus;

      const name = (customer.name || "").toLowerCase();
      const email = (customer.email || "").toLowerCase();
      const company = (customer.companyName || "").toLowerCase();
      const phone = (customer.phone || "").toLowerCase();

      const matchesSearch =
        name.includes(q) || email.includes(q) || company.includes(q) || phone.includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [customers, search, statusFilter]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const total = customers.length;
    const active = customers.filter((c) => c.status === "ACTIVE").length;
    const blockedOrInactive = customers.filter(
      (c) => c.status === "BLOCKED" || c.status === "INACTIVE"
    ).length;
    const totalOrders = customers.reduce((sum, c) => sum + (c._count?.orders || 0), 0);

    return { total, active, blockedOrInactive, totalOrders };
  }, [customers]);

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return name.slice(0, 2).toUpperCase();
    }
    if (email) return email.slice(0, 2).toUpperCase();
    return "CU";
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. Header Section                                                         */}
      {/* ========================================================================= */}
      <section className="rounded-2xl border border-gray-200/90 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <Users className="size-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200 mb-1.5 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Customer CRM
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Customer Management
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-slate-400">
                Inspect customer profiles, track live orders, inspect CAM quotes, and manage account statuses.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={loadCustomers}
              disabled={loading}
              className="gap-1.5 rounded-xl border-gray-200 hover:border-emerald-500 dark:border-slate-800"
            >
              <RefreshCw className={`size-3.5 ${loading ? "animate-spin text-emerald-600" : ""}`} />
              <span>Refresh</span>
            </Button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. Key Metrics Grid                                                       */}
      {/* ========================================================================= */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="border-gray-200/80 dark:border-slate-800 shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Total Customers
            </CardDescription>
            <CardTitle className="text-2xl font-black text-gray-900 dark:text-white flex items-center justify-between">
              <span>{metrics.total}</span>
              <Users className="size-5 text-emerald-600 dark:text-emerald-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[11px] text-gray-500 dark:text-slate-400">Registered platform accounts</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200/80 dark:border-slate-800 shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Active Accounts
            </CardDescription>
            <CardTitle className="text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
              <span>{metrics.active}</span>
              <UserCheck className="size-5 text-emerald-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[11px] text-gray-500 dark:text-slate-400">Good standing & verified</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200/80 dark:border-slate-800 shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Inactive / Restricted
            </CardDescription>
            <CardTitle className="text-2xl font-black text-amber-600 dark:text-amber-400 flex items-center justify-between">
              <span>{metrics.blockedOrInactive}</span>
              <ShieldAlert className="size-5 text-amber-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[11px] text-gray-500 dark:text-slate-400">Suspended or inactive users</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200/80 dark:border-slate-800 shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
              Total Customer Orders
            </CardDescription>
            <CardTitle className="text-2xl font-black text-blue-600 dark:text-blue-400 flex items-center justify-between">
              <span>{metrics.totalOrders}</span>
              <ShoppingBag className="size-5 text-blue-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[11px] text-gray-500 dark:text-slate-400">Across all customer profiles</p>
          </CardContent>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* 3. Filters & Search Bar                                                   */}
      {/* ========================================================================= */}
      <Card className="border-gray-200/90 dark:border-slate-800">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 size-4 text-gray-400" />
              <Input
                placeholder="Search by customer name, email, company, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs rounded-xl"
              />
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-gray-500 dark:text-slate-400 whitespace-nowrap">
                Status:
              </span>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-[150px] text-xs rounded-xl">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Statuses</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="BLOCKED">Blocked</SelectItem>
                  <SelectItem value="DELETED">Deleted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================================================= */}
      {/* 4. Customers Table                                                        */}
      {/* ========================================================================= */}
      <Card className="border-gray-200/90 dark:border-slate-800 overflow-hidden shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-extrabold text-gray-900 dark:text-white">
                Customer Accounts ({filteredCustomers.length})
              </CardTitle>
              <CardDescription className="text-xs">
                Click the <strong className="text-emerald-700 dark:text-emerald-400">&ldquo;Open&rdquo;</strong> button on any row to inspect complete customer profile, contact details, order history, and CAM inquiries.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/80 dark:bg-slate-900/80">
                <TableRow>
                  <TableHead className="font-extrabold">Customer</TableHead>
                  <TableHead className="font-extrabold">Company & Contact</TableHead>
                  <TableHead className="font-extrabold">Activity</TableHead>
                  <TableHead className="font-extrabold">Status</TableHead>
                  <TableHead className="font-extrabold">Joined Date</TableHead>
                  <TableHead className="font-extrabold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="size-6 animate-spin text-emerald-600" />
                        <span className="text-xs font-bold text-gray-500">Loading customer profiles...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 max-w-sm mx-auto">
                        <Users className="size-8 text-gray-300 dark:text-slate-600" />
                        <p className="text-sm font-bold text-gray-700 dark:text-slate-300">No customers found</p>
                        <p className="text-xs text-gray-400">
                          {search ? `No customer matches "${search}". Try clearing search.` : "No customer accounts registered yet."}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => {
                    const statusConfig = statusStyles[customer.status] || statusStyles.ACTIVE;
                    const ordersCount = customer._count?.orders ?? customer.orders?.length ?? 0;
                    const inquiriesCount = customer._count?.inquiries ?? customer.inquiries?.length ?? 0;

                    return (
                      <TableRow
                        key={customer.id}
                        className="border-b border-gray-100 hover:bg-gray-50/60 dark:border-slate-800/60 dark:hover:bg-slate-800/40"
                      >
                        {/* Customer Avatar & Name */}
                        <TableCell className="align-top py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 text-xs font-black text-white shadow-xs">
                              {getInitials(customer.name, customer.email)}
                            </div>
                            <div className="truncate">
                              <div className="flex items-center gap-1.5 font-bold text-gray-900 dark:text-white text-xs">
                                <span className="truncate">{customer.name || customer.email.split("@")[0]}</span>
                                {customer.isVerified && (
                                  <span title="Verified Customer">
                                    <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-gray-500 dark:text-slate-400 font-medium truncate flex items-center gap-1">
                                <Mail className="size-3 shrink-0 text-gray-400" />
                                <span>{customer.email}</span>
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* Company & Phone */}
                        <TableCell className="align-top py-3.5">
                          <div className="space-y-0.5 text-xs">
                            <div className="font-semibold text-gray-800 dark:text-slate-200 flex items-center gap-1">
                              <Building2 className="size-3 text-gray-400 shrink-0" />
                              <span className="truncate">{customer.companyName || "Independent Engineer"}</span>
                            </div>
                            <div className="text-[11px] text-gray-500 dark:text-slate-400 flex items-center gap-1">
                              <Phone className="size-3 text-gray-400 shrink-0" />
                              <span>{customer.phone || "No phone listed"}</span>
                            </div>
                          </div>
                        </TableCell>

                        {/* Activity Counts */}
                        <TableCell className="align-top py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800">
                              <ShoppingBag className="size-3" />
                              {ordersCount} {ordersCount === 1 ? "Order" : "Orders"}
                            </span>
                            {inquiriesCount > 0 && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-0.5 text-[11px] font-bold text-purple-700 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800">
                                <Layers className="size-3" />
                                {inquiriesCount} CAM
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* Status Badge */}
                        <TableCell className="align-top py-3.5">
                          <Badge
                            variant="outline"
                            className={`inline-flex items-center gap-1 text-[11px] font-bold rounded-full ${statusConfig.badge}`}
                          >
                            <span className={`size-1.5 rounded-full ${statusConfig.dot}`} />
                            {statusConfig.label}
                          </Badge>
                        </TableCell>

                        {/* Joined Date */}
                        <TableCell className="align-top py-3.5 text-xs text-gray-500 dark:text-slate-400 whitespace-nowrap">
                          {new Date(customer.createdAt).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </TableCell>

                        {/* Open Action Button */}
                        <TableCell className="align-top py-3.5 text-right whitespace-nowrap">
                          <Button
                            size="sm"
                            onClick={() => handleOpenCustomer(customer)}
                            className="gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs"
                          >
                            <Eye className="size-3.5" />
                            Open
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ========================================================================= */}
      {/* 5. Rich Customer Details Dialog (Opened when clicking "Open")             */}
      {/* ========================================================================= */}
      <Dialog open={Boolean(selectedCustomer)} onOpenChange={(open) => !open && setSelectedCustomer(null)}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-4xl lg:max-w-5xl w-[95vw] max-h-[92vh] p-0 overflow-hidden rounded-2xl md:rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0b1329] shadow-2xl flex flex-col gap-0 outline-none"
        >
          {selectedCustomer && (
            <>
              {/* Radix Accessible Title & Description (Hidden visually, accessible for screen readers) */}
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
                      className="rounded-xl size-9 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
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
                      handleUpdateStatus(modalStatus as "ACTIVE" | "INACTIVE" | "BLOCKED" | "DELETED")
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
                                className="text-slate-400 hover:text-emerald-600 transition"
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
                                {selectedCustomer.address || "No shipping address on file yet."}
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
                  className="rounded-xl font-bold text-xs px-5 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
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
