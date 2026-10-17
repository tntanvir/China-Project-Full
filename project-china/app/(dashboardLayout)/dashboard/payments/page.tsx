"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import {
  CreditCard,
  Download,
  Loader2,
  RefreshCcw,
  RotateCcw,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  Copy,
  Check,
  ExternalLink,
  Receipt,
  X,
  Printer,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PaymentService, type PaymentRecord } from "@/services/payment.service";
import { useAuthStore } from "@/store/authStore";

function money(amount?: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount || 0);
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "N/A";
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

export default function PaymentsDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [transactions, setTransactions] = useState<PaymentRecord[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PAID" | "PENDING" | "REFUNDED">("ALL");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [receiptData, setReceiptData] = useState<{
    receiptNumber: string;
    payment: PaymentRecord;
  } | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const loadTransactions = useCallback(
    async (showToast = false) => {
      setLoading(true);
      try {
        const result = isAdmin
          ? await PaymentService.getTransactions()
          : await PaymentService.getPaymentHistory();
        const records = Array.isArray(result) ? result : [];
        setTransactions(records);
        if (showToast) {
          toast.success(`Loaded ${records.length} payment records.`);
        }
      } catch (error) {
        console.error("Load payments error:", error);
        if (showToast) {
          toast.error(error instanceof Error ? error.message : "Failed to load payments.");
        }
      } finally {
        setLoading(false);
      }
    },
    [isAdmin]
  );

  // Automatic data load on page mount or when user credentials rehydrate
  useEffect(() => {
    loadTransactions(false);
  }, [loadTransactions, user?.id, user?.role]);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.info("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Metrics summary
  const metrics = useMemo(() => {
    const totalAmount = transactions
      .filter((t) => t.status === "PAID")
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const paidCount = transactions.filter((t) => t.status === "PAID").length;
    const refundedCount = transactions.filter((t) => t.status === "REFUNDED").length;

    return {
      totalAmount,
      totalCount: transactions.length,
      paidCount,
      refundedCount,
    };
  }, [transactions]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((payment) => {
      // Status filter
      if (statusFilter !== "ALL" && payment.status !== statusFilter) {
        return false;
      }

      // Search query
      const query = search.trim().toLowerCase();
      if (!query) return true;

      const searchableText = [
        payment.id,
        payment.orderId,
        payment.method,
        payment.status,
        payment.transactionId,
        payment.providerPaymentId,
        String(payment.amount),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [search, statusFilter, transactions]);

  // Refund handler
  const handleRefund = async (payment: PaymentRecord) => {
    if (!isAdmin) {
      toast.error("Only Admin and Super Admin can refund payments.");
      return;
    }

    if (payment.status !== "PAID") {
      toast.error("Only paid payments can be refunded.");
      return;
    }

    if (!confirm(`Are you sure you want to process a full refund for Order #${payment.orderId}?`)) {
      return;
    }

    setActionId(payment.id);
    try {
      await PaymentService.refundPayment(payment.id);
      toast.success("Refund processed successfully via payment gateway.");
      await loadTransactions(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Refund failed.");
    } finally {
      setActionId(null);
    }
  };

  // Receipt modal handler
  const handleReceipt = async (payment: PaymentRecord) => {
    setActionId(payment.id);
    try {
      const res = (await PaymentService.getReceipt(payment.id)) as {
        receiptNumber: string;
        payment: PaymentRecord;
      };
      if (res && res.receiptNumber) {
        setReceiptData(res);
      } else {
        // Fallback construct if backend returns raw payment
        setReceiptData({
          receiptNumber: `RCT-${payment.id.slice(0, 8).toUpperCase()}`,
          payment,
        });
      }
      setIsReceiptModalOpen(true);
    } catch {
      // Fallback display
      setReceiptData({
        receiptNumber: `RCT-${payment.id.slice(0, 8).toUpperCase()}`,
        payment,
      });
      setIsReceiptModalOpen(true);
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0b1220] p-6 sm:p-8 shadow-sm dark:shadow-2xl">
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                <span className="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                Financial Ledger
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                <ShieldCheck className="size-3 text-emerald-600 dark:text-emerald-400" />
                PCI-DSS Compliant
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <CreditCard className="size-8 text-emerald-600 dark:text-emerald-400" />
              <span>Payment Transactions</span>
            </h1>

            <p className="mt-1.5 max-w-2xl text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {isAdmin
                ? "Manage customer payment records, monitor Stripe & PayPal transactions, inspect digital tax invoices, and process refunds."
                : "Review your completed PCB manufacturing orders, download official tax receipts, and track real-time payment confirmations."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => loadTransactions(true)}
              disabled={loading}
              className="h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-500 text-white font-bold text-xs gap-2 shadow-sm dark:shadow-lg dark:shadow-emerald-950/50 transition cursor-pointer"
            >
              <RefreshCcw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Refreshing..." : "Refresh Payments"}</span>
            </Button>
          </div>
        </div>

        {/* Metric Summary Cards */}
        <div className="relative z-10 mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 pt-6 border-t border-slate-100 dark:border-slate-800/80">
          <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-[#070b14] border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Volume
            </span>
            <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
              {money(metrics.totalAmount, "USD")}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-[#070b14] border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Records
            </span>
            <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-200 mt-1">
              {metrics.totalCount}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-[#070b14] border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Paid / Verified
            </span>
            <p className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {metrics.paidCount}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-[#070b14] border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Refunded
            </span>
            <p className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400 mt-1">
              {metrics.refundedCount}
            </p>
          </div>
        </div>
      </section>

      {/* Main Ledger Table Card */}
      <section className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0b1220] p-6 shadow-sm dark:shadow-2xl">
        {/* Search & Status Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Payment ID, Order ID, method, amount..."
              className="h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-emerald-500 text-xs font-medium"
            />
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#070b14] rounded-xl border border-slate-200/80 dark:border-slate-800">
            {(["ALL", "PAID", "PENDING", "REFUNDED"] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  statusFilter === status
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200/90 dark:border-slate-800">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-[#070b14]/90 border-b border-slate-200 dark:border-slate-800">
              <TableRow className="border-b border-slate-200 dark:border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider py-3.5">
                  Transaction & Date
                </TableHead>
                <TableHead className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider py-3.5">
                  Order ID
                </TableHead>
                <TableHead className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider py-3.5">
                  Gateway / Method
                </TableHead>
                <TableHead className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider py-3.5">
                  Amount
                </TableHead>
                <TableHead className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider py-3.5">
                  Status
                </TableHead>
                <TableHead className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider py-3.5 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                // Skeleton loading rows
                [...Array(4)].map((_, i) => (
                  <TableRow key={i} className="border-b border-slate-100 dark:border-slate-800/60">
                    <TableCell colSpan={6} className="py-4">
                      <div className="h-6 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800/40" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredTransactions.length > 0 ? (
                filteredTransactions.map((payment) => {
                  const isPaid = payment.status === "PAID";
                  const isRefunded = payment.status === "REFUNDED";
                  const isStripe = payment.method?.toUpperCase().includes("STRIPE");
                  const isPayPal = payment.method?.toUpperCase().includes("PAYPAL");

                  return (
                    <TableRow
                      key={payment.id}
                      className="border-b border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition"
                    >
                      {/* Transaction ID & Date */}
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                              {payment.transactionId
                                ? payment.transactionId.slice(0, 18)
                                : payment.id.slice(0, 16)}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopy(payment.transactionId || payment.id, payment.id)}
                              className="text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-white transition cursor-pointer p-0.5"
                              title="Copy transaction ID"
                            >
                              {copiedId === payment.id ? (
                                <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <Copy className="size-3" />
                              )}
                            </button>
                          </div>
                          <span className="text-[11px] text-slate-500 mt-0.5">
                            {formatDate(payment.paidAt || payment.createdAt)}
                          </span>
                        </div>
                      </TableCell>

                      {/* Order ID */}
                      <TableCell className="py-4">
                        <Link
                          href={`/dashboard/orders`}
                          className="font-mono text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 hover:underline flex items-center gap-1 w-fit"
                        >
                          <span>{payment.orderId ? payment.orderId.slice(0, 14) : "N/A"}</span>
                          <ExternalLink className="size-3 opacity-70" />
                        </Link>
                      </TableCell>

                      {/* Method / Gateway */}
                      <TableCell className="py-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-tight border ${
                              isStripe
                                ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-500/30"
                                : isPayPal
                                ? "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-500/30"
                                : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700"
                            }`}
                          >
                            {isStripe ? "Stripe Checkout" : isPayPal ? "PayPal Order" : payment.method}
                          </span>
                        </div>
                      </TableCell>

                      {/* Amount */}
                      <TableCell className="py-4">
                        <span className="text-sm font-black text-slate-900 dark:text-white">
                          {money(payment.amount, payment.currency || "USD")}
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            isPaid
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-500/30"
                              : isRefunded
                              ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-500/30"
                              : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700"
                          }`}
                        >
                          <span
                            className={`size-1.5 rounded-full ${
                              isPaid
                                ? "bg-emerald-500 dark:bg-emerald-400 animate-pulse"
                                : isRefunded
                                ? "bg-amber-500 dark:bg-amber-400"
                                : "bg-slate-400 dark:bg-slate-500"
                            }`}
                          />
                          {payment.status}
                        </span>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReceipt(payment)}
                            disabled={actionId === payment.id}
                            className="h-8 rounded-lg border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-[#070b14] dark:hover:bg-slate-800 dark:text-slate-200 text-xs font-semibold gap-1.5 transition cursor-pointer"
                          >
                            {actionId === payment.id ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <FileText className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                            )}
                            <span>Receipt</span>
                          </Button>

                          {isAdmin && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRefund(payment)}
                              disabled={actionId === payment.id || !isPaid}
                              className="h-8 rounded-lg text-xs font-semibold gap-1.5 transition cursor-pointer"
                            >
                              {actionId === payment.id ? (
                                <Loader2 className="size-3.5 animate-spin" />
                              ) : (
                                <RotateCcw className="size-3.5" />
                              )}
                              <span>Refund</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-14 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-center">
                      <div className="size-12 rounded-2xl bg-slate-100 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3">
                        <CreditCard className="size-6" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">No payment records found</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                        {search
                          ? `No transactions match your search filter "${search}".`
                          : "You have not completed any payments yet. Get started by configuring your PCB quote."}
                      </p>
                      <Button asChild size="sm" className="rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-500 text-white font-bold text-xs">
                        <Link href="/pcb-quote">Configure PCB Quote</Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Official Tax Invoice / Receipt Modal */}
      {isReceiptModalOpen && receiptData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0b1220] shadow-2xl p-6 sm:p-8">
            <div className="absolute right-4 top-4">
              <button
                type="button"
                onClick={() => setIsReceiptModalOpen(false)}
                className="size-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="text-center pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="size-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 dark:bg-emerald-950/60 dark:border-emerald-500/30 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-500/10">
                <Receipt className="size-6" />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Payment Receipt</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Feitian Technology (SYS-PCB) Official Turnaround Tax Receipt
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-950/60 dark:border-emerald-500/30 dark:text-emerald-400 text-xs font-mono font-bold mt-2">
                <span>{receiptData.receiptNumber}</span>
              </div>
            </div>

            <div className="py-5 space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Transaction ID:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-white">
                  {receiptData.payment.transactionId || receiptData.payment.id}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Order Reference:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {receiptData.payment.orderId}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Payment Gateway:</span>
                <span className="font-bold text-slate-800 dark:text-white">
                  {receiptData.payment.method?.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Payment Status:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/60 px-2 py-0.5 rounded border dark:border-emerald-500/30">
                  {receiptData.payment.status}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Date & Time:</span>
                <span className="text-slate-700 dark:text-slate-200">
                  {formatDate(receiptData.payment.paidAt || receiptData.payment.createdAt)}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm">
                <span className="font-bold text-slate-900 dark:text-white">Total Amount Paid:</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400 text-lg">
                  {money(receiptData.payment.amount, receiptData.payment.currency || "USD")}
                </span>
              </div>
            </div>

            <div className="pt-5 border-t border-slate-100 dark:border-slate-800 flex gap-3">
              <Button
                type="button"
                onClick={() => window.print()}
                className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-500 text-white font-bold text-xs gap-2 shadow-sm cursor-pointer"
              >
                <Printer className="size-4" />
                <span>Print / Save Receipt</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsReceiptModalOpen(false)}
                className="h-11 px-5 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-100 hover:bg-slate-200 dark:bg-[#070b14] text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
