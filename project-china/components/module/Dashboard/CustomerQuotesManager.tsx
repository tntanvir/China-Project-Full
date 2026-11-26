"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  Clock,
  Copy,
  Cpu,
  Download,
  ExternalLink,
  Eye,
  FileArchive,
  Layers,
  Loader2,
  MessageCircle,
  PackageCheck,
  Plus,
  RefreshCcw,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { QuoteService } from "@/services/quote.service";
import { useAuthStore } from "@/store/authStore";

export type QuoteRecord = {
  id: string;
  userId: string;
  name: string;
  width: number;
  height: number;
  quantity: number;
  layerCount: number;
  materialType: string;
  boardThickness: number;
  copperWeight: number;
  surfaceFinish: string;
  solderMaskColor: string;
  silkscreenColor: string;
  calculatedPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  gerberFiles?: Array<{ id: string; fileName: string; fileUrl: string }>;
  orders?: Array<{ id: string; status: string; totalAmount: number }>;
};

const statusStyles: Record<string, { label: string; badgeClass: string }> = {
  SAVED: {
    label: "Ready to Order",
    badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
  },
  ORDERED: {
    label: "Converted to Order",
    badgeClass: "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
  },
  EXPIRED: {
    label: "Expired",
    badgeClass: "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800",
  },
};

export default function CustomerQuotesManager() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isLoading);
  const [quotes, setQuotes] = useState<QuoteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedQuote, setSelectedQuote] = useState<QuoteRecord | null>(null);

  // Conversion Dialog State
  const [convertQuoteTarget, setConvertQuoteTarget] = useState<QuoteRecord | null>(null);
  const [shippingAddress, setShippingAddress] = useState(
    user ? `${user.name || "Customer"}, ${user.email} - Factory Delivery` : "Standard Express Delivery"
  );
  const [converting, setConverting] = useState(false);

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await QuoteService.getMyQuotes();
      const list = Array.isArray(response) ? response : (response as { data?: QuoteRecord[] })?.data || [];
      setQuotes(list as QuoteRecord[]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load quotes from server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthLoading || !user) return;
    fetchQuotes();
  }, [fetchQuotes, isAuthLoading, user]);

  const copyToClipboard = (text: string, label = "Quote ID") => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const handleConvertQuote = async () => {
    if (!convertQuoteTarget) return;
    if (!shippingAddress.trim()) {
      toast.error("Please provide a delivery address");
      return;
    }

    setConverting(true);
    try {
      const newOrder = await QuoteService.convertToOrder(convertQuoteTarget.id, {
        shippingAddress: shippingAddress.trim(),
      });
      toast.success("Quote converted to order successfully!");
      setConvertQuoteTarget(null);
      await fetchQuotes();

      const orderId = (newOrder as { id?: string })?.id;
      if (orderId) {
        router.push(`/dashboard/orders`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to convert quote to order");
    } finally {
      setConverting(false);
    }
  };

  // Filtered quotes list
  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      const matchesSearch =
        !search ||
        q.name.toLowerCase().includes(search.toLowerCase()) ||
        q.materialType.toLowerCase().includes(search.toLowerCase()) ||
        q.surfaceFinish.toLowerCase().includes(search.toLowerCase()) ||
        q.id.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "ALL" || q.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [quotes, search, statusFilter]);

  // Derived KPI Stats
  const stats = useMemo(() => {
    const totalQuotes = quotes.length;
    const readyToOrder = quotes.filter((q) => q.status === "SAVED").length;
    const convertedOrders = quotes.filter((q) => q.status === "ORDERED").length;
    const totalEstimatedValue = quotes.reduce((sum, q) => sum + (Number(q.calculatedPrice) || 0), 0);

    return { totalQuotes, readyToOrder, convertedOrders, totalEstimatedValue };
  }, [quotes]);

  return (
    <div className="space-y-6">
      {/* Personalized Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br from-white via-slate-50 to-emerald-50/40 p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-gradient-to-br dark:from-[#0b1220] dark:via-[#070b14] dark:to-emerald-950/20">
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-mono font-bold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
              <FileArchive className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>CAM Quote Center</span>
            </div>

            <h1 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              My Saved PCB Quotes
            </h1>
            <p className="mt-1.5 max-w-2xl text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Review custom PCB quotes, inspect board dimensions and layer stackups, and convert saved configurations into active cleanroom fabrication orders.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchQuotes}
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
                <Plus className="size-4" />
                <span>Instant PCB Calculator</span>
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
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Quotes</p>
                {loading ? (
                  <Skeleton className="h-8 w-20 mt-2 rounded-lg" />
                ) : (
                  <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{stats.totalQuotes}</p>
                )}
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">Custom configurations</p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <FileArchive className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-[#0b1220]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Ready to Order</p>
                {loading ? (
                  <Skeleton className="h-8 w-20 mt-2 rounded-lg" />
                ) : (
                  <p className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.readyToOrder}</p>
                )}
                <p className="mt-0.5 text-[11px] text-emerald-600/80 dark:text-emerald-400/80 font-medium">Valid price lock</p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400">
                <Zap className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-[#0b1220]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Ordered</p>
                {loading ? (
                  <Skeleton className="h-8 w-20 mt-2 rounded-lg" />
                ) : (
                  <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{stats.convertedOrders}</p>
                )}
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">In manufacturing pipeline</p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <PackageCheck className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-[#0b1220]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Estimated Value</p>
                {loading ? (
                  <Skeleton className="h-8 w-24 mt-2 rounded-lg" />
                ) : (
                  <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                    ${stats.totalEstimatedValue.toFixed(2)}
                  </p>
                )}
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">Calculated prototype total</p>
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
              placeholder="Search by quote name, material (FR-4, Aluminum), finish..."
              className="pl-10 h-10 rounded-xl bg-slate-50 border-slate-200 dark:bg-[#070b14] dark:border-slate-800 text-xs sm:text-sm font-medium"
            />
          </div>

          <div className="w-full sm:w-auto flex items-center gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] h-10 rounded-xl bg-slate-50 border-slate-200 dark:bg-[#070b14] dark:border-slate-800 text-xs font-semibold">
                <SelectValue placeholder="Status: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="SAVED">Ready to Order</SelectItem>
                <SelectItem value="ORDERED">Converted to Order</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
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

      {/* Quotes Table */}
      <Card className="rounded-2xl border-slate-200 bg-white shadow-2xs overflow-hidden dark:border-slate-800 dark:bg-[#0b1220]">
        <CardHeader className="border-b border-slate-100 p-5 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Saved Configurations
              </CardTitle>
              {loading ? (
                <Skeleton className="h-3.5 w-32 mt-1.5" />
              ) : (
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                  Showing {filteredQuotes.length} of {quotes.length} quotes
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
                    <TableHead className="font-bold text-xs">Quote ID</TableHead>
                    <TableHead className="font-bold text-xs">Board Name</TableHead>
                    <TableHead className="font-bold text-xs">Dimensions & Layers</TableHead>
                    <TableHead className="font-bold text-xs">Material & Finish</TableHead>
                    <TableHead className="font-bold text-xs">Status</TableHead>
                    <TableHead className="font-bold text-xs text-right">Calculated Price</TableHead>
                    <TableHead className="font-bold text-xs text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <TableRow key={idx} className="hover:bg-transparent">
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell>
                        <div className="space-y-1.5">
                          <Skeleton className="h-4 w-36" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1.5">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1.5">
                          <Skeleton className="h-4 w-28" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </TableCell>
                      <TableCell><Skeleton className="h-5 w-24 rounded-full" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Skeleton className="h-7 w-20 rounded-lg" />
                          <Skeleton className="h-7 w-16 rounded-lg" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : filteredQuotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800/60 dark:text-slate-500 mb-4">
                <FileArchive className="size-7" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                {search || statusFilter !== "ALL" ? "No matching quotes found" : "No saved quotes yet"}
              </h3>
              <p className="mt-1.5 max-w-md text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {search || statusFilter !== "ALL"
                  ? "Try adjusting your search criteria or resetting filters to view all quotes."
                  : "Calculate instant factory prices, specify board parameters, and save configurations for rapid ordering."}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Button
                  asChild
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-2"
                >
                  <Link href="/pcb-quote">
                    <Sparkles className="size-3.5" />
                    <span>Calculate Instant PCB Quote</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-xl border-slate-300 dark:border-slate-800 text-xs font-bold"
                >
                  <Link href="/products">
                    <span>Explore Products</span>
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-[720px]">
                <TableHeader className="bg-slate-50/80 dark:bg-slate-900/40">
                  <TableRow>
                    <TableHead className="font-bold text-xs">Quote ID</TableHead>
                    <TableHead className="font-bold text-xs">Board Name</TableHead>
                    <TableHead className="font-bold text-xs">Dimensions & Layers</TableHead>
                    <TableHead className="font-bold text-xs">Material & Finish</TableHead>
                    <TableHead className="font-bold text-xs">Status</TableHead>
                    <TableHead className="font-bold text-xs text-right">Calculated Price</TableHead>
                    <TableHead className="font-bold text-xs text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuotes.map((quote) => {
                    const statusInfo = statusStyles[quote.status] || {
                      label: quote.status,
                      badgeClass: "bg-slate-100 text-slate-800",
                    };
                    const isConvertible = quote.status === "SAVED";

                    return (
                      <TableRow key={quote.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                        <TableCell className="font-mono text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                              #{quote.id.slice(0, 8)}...
                            </span>
                            <button
                              onClick={() => copyToClipboard(quote.id, "Quote ID")}
                              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                              title="Copy full Quote UUID"
                            >
                              <Copy className="size-3" />
                            </button>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div>
                            <p className="font-bold text-xs text-slate-900 dark:text-slate-100">{quote.name}</p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              {new Date(quote.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="text-xs">
                            <p className="font-medium text-slate-900 dark:text-slate-100">
                              {quote.width} × {quote.height} mm
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              {quote.layerCount} Layers • {quote.quantity} pcs
                            </p>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="text-xs">
                            <p className="font-medium text-slate-900 dark:text-slate-100">
                              {quote.materialType} • {quote.boardThickness}mm
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              {quote.surfaceFinish} • {quote.solderMaskColor} Mask
                            </p>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusInfo.badgeClass}`}
                          >
                            {statusInfo.label}
                          </Badge>
                        </TableCell>

                        <TableCell className="text-right font-mono font-bold text-xs text-slate-900 dark:text-slate-100">
                          ${Number(quote.calculatedPrice || 0).toFixed(2)}
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Convert to Order Button */}
                            {isConvertible && (
                              <Button
                                size="sm"
                                onClick={() => setConvertQuoteTarget(quote)}
                                className="h-7 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] gap-1 shadow-xs"
                              >
                                <ShoppingCart className="size-3" />
                                <span>Order Now</span>
                              </Button>
                            )}

                            {/* View Details Button */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedQuote(quote)}
                              className="h-7 px-2.5 rounded-lg border-slate-200 dark:border-slate-800 text-xs font-semibold gap-1"
                            >
                              <Eye className="size-3" />
                              <span>Specs</span>
                            </Button>

                            {/* Order link if already ordered */}
                            {quote.orders && quote.orders.length > 0 && (
                              <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 rounded-lg text-blue-600 hover:text-blue-700 text-[11px] font-semibold"
                              >
                                <Link href="/dashboard/orders">
                                  <span>View Order</span>
                                </Link>
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

      {/* Convert to Order Confirmation Dialog */}
      <Dialog open={!!convertQuoteTarget} onOpenChange={(open) => !open && setConvertQuoteTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <PackageCheck className="size-5 text-emerald-600" />
              <span>Convert Quote to Order</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Transform your quote configuration into an active manufacturing order.
            </DialogDescription>
          </DialogHeader>

          {convertQuoteTarget && (
            <div className="space-y-4 py-2">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900/40 text-xs space-y-1.5">
                <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                  <span>{convertQuoteTarget.name}</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">
                    ${Number(convertQuoteTarget.calculatedPrice || 0).toFixed(2)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {convertQuoteTarget.width}×{convertQuoteTarget.height}mm • {convertQuoteTarget.layerCount} Layers •{" "}
                  {convertQuoteTarget.quantity} pieces • {convertQuoteTarget.materialType} • {convertQuoteTarget.surfaceFinish}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold">Delivery / Shipping Address</Label>
                <Textarea
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Enter recipient full name, complete address, and phone number..."
                  className="text-xs min-h-[80px]"
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConvertQuoteTarget(null)}
              disabled={converting}
              className="text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConvertQuote}
              disabled={converting}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5"
            >
              {converting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Converting...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-3.5" />
                  <span>Confirm & Place Order</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detailed Slide-over Drawer for Quote Specs */}
      <Sheet open={!!selectedQuote} onOpenChange={(open) => !open && setSelectedQuote(null)}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-6">
          {selectedQuote && (
            <div className="space-y-6">
              <SheetHeader>
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      (statusStyles[selectedQuote.status] || {}).badgeClass || "bg-slate-100"
                    }`}
                  >
                    {(statusStyles[selectedQuote.status] || {}).label || selectedQuote.status}
                  </Badge>
                  <span className="font-mono text-xs text-slate-400">
                    {new Date(selectedQuote.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <SheetTitle className="text-xl font-black text-slate-900 dark:text-white mt-2">
                  {selectedQuote.name}
                </SheetTitle>
                <SheetDescription className="font-mono text-xs text-slate-500">
                  Quote ID: {selectedQuote.id}
                </SheetDescription>
              </SheetHeader>

              {/* Technical Specifications Grid */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#070b14]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5">
                  <Layers className="size-3.5 text-emerald-600" />
                  <span>Board Configuration Parameters</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Dimensions</span>
                    <span className="font-semibold">{selectedQuote.width} × {selectedQuote.height} mm</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Layer Count</span>
                    <span className="font-semibold">{selectedQuote.layerCount} Layers</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Quantity</span>
                    <span className="font-semibold">{selectedQuote.quantity} pieces</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Base Material</span>
                    <span className="font-semibold">{selectedQuote.materialType}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Board Thickness</span>
                    <span className="font-semibold">{selectedQuote.boardThickness} mm</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Copper Weight</span>
                    <span className="font-semibold">{selectedQuote.copperWeight} oz</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Surface Finish</span>
                    <span className="font-semibold">{selectedQuote.surfaceFinish}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Solder Mask</span>
                    <span className="font-semibold">{selectedQuote.solderMaskColor}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Silkscreen</span>
                    <span className="font-semibold">{selectedQuote.silkscreenColor}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Pricing Model</span>
                    <span className="font-semibold text-emerald-600">Factory Direct</span>
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown Card */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#070b14]">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
                  Pricing Breakdown
                </h4>
                <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-500">Total PCB Fabrication ({selectedQuote.quantity} pcs)</span>
                  <span className="font-mono font-semibold">${Number(selectedQuote.calculatedPrice || 0).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-500">Unit Cost Per Board</span>
                  <span className="font-mono font-semibold">
                    ${(Number(selectedQuote.calculatedPrice || 0) / (selectedQuote.quantity || 1)).toFixed(2)} / pc
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="text-slate-500">Automated DFM Check</span>
                  <span className="font-mono font-semibold text-emerald-600">Included (Free)</span>
                </div>
                <div className="flex items-center justify-between text-sm py-2 font-bold text-slate-900 dark:text-white">
                  <span>Locked Total</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">
                    ${Number(selectedQuote.calculatedPrice || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Drawer Actions */}
              <div className="flex flex-col gap-2 pt-2">
                {selectedQuote.status === "SAVED" ? (
                  <Button
                    onClick={() => {
                      setConvertQuoteTarget(selectedQuote);
                      setSelectedQuote(null);
                    }}
                    className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-2"
                  >
                    <ShoppingCart className="size-4" />
                    <span>Convert This Quote to Order</span>
                  </Button>
                ) : (
                  <Button
                    asChild
                    className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs gap-2"
                  >
                    <Link href="/dashboard/orders">
                      <PackageCheck className="size-4" />
                      <span>View in Orders Dashboard</span>
                    </Link>
                  </Button>
                )}

                <Button
                  asChild
                  variant="outline"
                  className="w-full rounded-xl border-slate-300 dark:border-slate-800 text-xs font-bold gap-2"
                >
                  <Link href="/dashboard/chat">
                    <MessageCircle className="size-4 text-emerald-600" />
                    <span>Inquire with CAM Engineer about this Quote</span>
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

