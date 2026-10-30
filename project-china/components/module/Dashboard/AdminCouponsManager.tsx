"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Edit3,
  ExternalLink,
  Filter,
  Loader2,
  Percent,
  Plus,
  RefreshCcw,
  Search,
  Sparkles,
  Tag,
  TicketPercent,
  Trash2,
  TrendingUp,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  AdminService,
  type AdminCoupon,
  type AdminCouponsResponse,
} from "@/services/admin.service";

const PRESET_COUPONS = [
  { label: "15% Prototype", code: "FT-PROTOTYPE15", pct: 15, max: 50 },
  { label: "20% PCBA Assembly", code: "BSY-TECH20", pct: 20, max: 200 },
  { label: "100% Free CAM DFM", code: "CAM-REVIEW-FREE", pct: 100, max: 40 },
  { label: "12% High-Freq Rogers", code: "ROGERS-HIGHFREQ", pct: 12, max: 300 },
  { label: "10% Shengyi Bulk", code: "SHENGYI-BULK10", pct: 10, max: 500 },
  { label: "25% VIP Corporate", code: "VIP-ENTERPRISE25", pct: 25, max: 1000 },
];

export default function AdminCouponsManager() {
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [summary, setSummary] = useState({ total: 0, active: 0, expired: 0, inactive: 0 });
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Create & Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<AdminCoupon | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formCode, setFormCode] = useState("");
  const [formDiscount, setFormDiscount] = useState<number>(15);
  const [formMaxDiscount, setFormMaxDiscount] = useState<string>("");
  const [formValidUntil, setFormValidUntil] = useState<string>("");
  const [formIsActive, setFormIsActive] = useState<boolean>(true);

  // Delete Confirmation Modal
  const [deleteTarget, setDeleteTarget] = useState<AdminCoupon | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const res = await AdminService.getCoupons({
        status: statusFilter,
        search: searchQuery,
      });
      if (res && res.coupons) {
        setCoupons(res.coupons);
        if (res.summary) setSummary(res.summary);
      }
    } catch (error) {
      console.error("Failed to load coupons:", error);
      toast.error("Failed to fetch coupons list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadCoupons();
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success(`Copied "${code}" to clipboard!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSeedCoupons = async () => {
    setSeeding(true);
    try {
      await AdminService.seedCoupons();
      toast.success("Standard industrial PCB coupons seeded successfully!");
      loadCoupons();
    } catch (error) {
      console.error("Failed to seed coupons:", error);
      toast.error("Failed to seed coupons.");
    } finally {
      setSeeding(false);
    }
  };

  // Open Create Modal
  const openCreateModal = () => {
    setEditingCoupon(null);
    setFormCode("");
    setFormDiscount(15);
    setFormMaxDiscount("");
    // Default valid until 1 year from now
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    setFormValidUntil(nextYear.toISOString().split("T")[0]);
    setFormIsActive(true);
    setModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (coupon: AdminCoupon) => {
    setEditingCoupon(coupon);
    setFormCode(coupon.code);
    setFormDiscount(coupon.discountPercentage);
    setFormMaxDiscount(coupon.maxDiscount ? String(coupon.maxDiscount) : "");
    const dateStr = new Date(coupon.validUntil).toISOString().split("T")[0];
    setFormValidUntil(dateStr);
    setFormIsActive(coupon.isActive);
    setModalOpen(true);
  };

  // Generate random promo code
  const generateRandomCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "FT-";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormCode(code);
  };

  // Quick Preset Selection
  const applyPreset = (preset: (typeof PRESET_COUPONS)[0]) => {
    setFormCode(preset.code);
    setFormDiscount(preset.pct);
    setFormMaxDiscount(String(preset.max));
  };

  // Toggle active status directly
  const handleToggleActive = async (coupon: AdminCoupon) => {
    try {
      const updated = await AdminService.updateCoupon(coupon.id, {
        isActive: !coupon.isActive,
      });
      setCoupons((prev) =>
        prev.map((c) => (c.id === coupon.id ? { ...c, isActive: updated.isActive } : c))
      );
      toast.success(`Coupon "${coupon.code}" ${updated.isActive ? "activated" : "deactivated"}.`);
      loadCoupons();
    } catch (error: any) {
      toast.error(error.message || "Failed to update coupon status.");
    }
  };

  // Save Coupon (Create or Update)
  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode.trim()) {
      toast.error("Please enter a valid coupon code.");
      return;
    }
    if (!formValidUntil) {
      toast.error("Please specify expiration date.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        code: formCode.trim().toUpperCase(),
        discountPercentage: Number(formDiscount),
        maxDiscount: formMaxDiscount ? Number(formMaxDiscount) : null,
        validUntil: new Date(`${formValidUntil}T23:59:59.000Z`).toISOString(),
        isActive: formIsActive,
      };

      if (editingCoupon) {
        await AdminService.updateCoupon(editingCoupon.id, payload);
        toast.success(`Coupon "${payload.code}" updated successfully.`);
      } else {
        await AdminService.createCoupon(payload);
        toast.success(`Coupon "${payload.code}" created successfully.`);
      }

      setModalOpen(false);
      loadCoupons();
    } catch (error: any) {
      console.error("Save error:", error);
      toast.error(error.message || "Failed to save coupon.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Coupon
  const handleDeleteCoupon = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await AdminService.deleteCoupon(deleteTarget.id);
      toast.success(`Coupon "${deleteTarget.code}" deleted permanently.`);
      setDeleteTarget(null);
      loadCoupons();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete coupon.");
    } finally {
      setDeleting(false);
    }
  };

  // Average discount rate
  const avgDiscount = useMemo(() => {
    if (!coupons.length) return 0;
    const sum = coupons.reduce((s, c) => s + c.discountPercentage, 0);
    return Math.round(sum / coupons.length);
  }, [coupons]);

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. Header Banner & Actions                                                */}
      {/* ========================================================================= */}
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <TicketPercent className="size-6" />
            </span>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200 mb-1.5 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Factory Pricing & Commercial Incentives
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Discounts & Promotional Coupons
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-slate-400">
                Manage high-volume PCB order vouchers, CAM review fee waivers, BSY Tech turnkey PCBA promos, and corporate enterprise discounts.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSeedCoupons}
              disabled={seeding}
              className="gap-1.5 rounded-xl border-gray-200 dark:border-slate-800 text-xs font-bold hover:border-emerald-500 cursor-pointer"
            >
              <Sparkles className={cn("size-3.5 text-emerald-600", seeding && "animate-spin")} />
              <span>{seeding ? "Seeding..." : "Seed PCB Promos"}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={loadCoupons}
              disabled={loading}
              className="gap-1.5 rounded-xl border-gray-200 dark:border-slate-800 text-xs font-bold hover:border-emerald-500 cursor-pointer"
            >
              <RefreshCcw className={cn("size-3.5", loading && "animate-spin text-emerald-600")} />
              <span>Refresh</span>
            </Button>

            <Button
              size="sm"
              onClick={openCreateModal}
              className="gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-black text-white shadow-xs hover:bg-emerald-700 transition cursor-pointer"
            >
              <Plus className="size-4" />
              <span>Create Coupon</span>
            </Button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. Executive KPI Cards                                                    */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {/* Total Coupons */}
        <Card className="rounded-2xl border-gray-200/80 dark:border-slate-800 shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
                Total Codes
              </span>
              <Tag className="size-4 text-gray-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-gray-900 dark:text-white font-mono">
              {summary.total}
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">Configured promo vouchers</p>
          </CardContent>
        </Card>

        {/* Active Campaigns */}
        <Card className="rounded-2xl border-emerald-300/80 bg-emerald-50/30 dark:bg-emerald-950/20 dark:border-emerald-800/60 shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Active Campaigns
              </span>
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="mt-2 text-2xl font-black text-emerald-700 dark:text-emerald-300 font-mono">
              {summary.active}
            </div>
            <p className="text-[11px] text-emerald-600/80 font-medium mt-0.5">Live at checkout</p>
          </CardContent>
        </Card>

        {/* Expired Coupons */}
        <Card className="rounded-2xl border-gray-200/80 dark:border-slate-800 shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                Expired
              </span>
              <Clock className="size-4 text-rose-500" />
            </div>
            <div className="mt-2 text-2xl font-black text-rose-600 dark:text-rose-400 font-mono">
              {summary.expired}
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">Past expiration date</p>
          </CardContent>
        </Card>

        {/* Inactive / Paused */}
        <Card className="rounded-2xl border-gray-200/80 dark:border-slate-800 shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Disabled / Paused
              </span>
              <AlertCircle className="size-4 text-amber-500" />
            </div>
            <div className="mt-2 text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
              {summary.inactive}
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">Toggled off by admin</p>
          </CardContent>
        </Card>

        {/* Average Discount */}
        <Card className="rounded-2xl border-gray-200/80 dark:border-slate-800 shadow-xs col-span-2 sm:col-span-1">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                Avg Discount
              </span>
              <Percent className="size-4 text-blue-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
              {avgDiscount}%
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">Across all coupon tiers</p>
          </CardContent>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* 3. Filter & Search Controls                                               */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Status Switcher Tabs */}
        <div className="inline-flex rounded-xl bg-gray-100 p-1 dark:bg-slate-800 self-start sm:self-auto">
          {[
            { id: "ALL", label: `All (${summary.total})` },
            { id: "ACTIVE", label: `Active (${summary.active})` },
            { id: "EXPIRED", label: `Expired (${summary.expired})` },
            { id: "INACTIVE", label: `Disabled (${summary.inactive})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-bold transition cursor-pointer",
                statusFilter === tab.id
                  ? "bg-white text-emerald-700 shadow-xs dark:bg-slate-900 dark:text-emerald-400"
                  : "text-gray-500 hover:text-gray-900 dark:text-slate-400"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search code (e.g. FT-PROMO)..."
            className="pl-9 pr-8 text-xs font-medium rounded-xl border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                loadCoupons();
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="size-3" />
            </button>
          )}
        </form>
      </div>

      {/* ========================================================================= */}
      {/* 4. Coupons Master Table (Drawer-Collapse Proof)                          */}
      {/* ========================================================================= */}
      <Card className="rounded-2xl border-gray-200 shadow-xs dark:border-slate-800 overflow-hidden">
        <CardHeader className="pb-3 border-b border-gray-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TicketPercent className="size-4 text-emerald-600" />
              <CardTitle className="text-sm font-black text-gray-900 dark:text-white">
                Configured Coupon Vouchers & Campaigns
              </CardTitle>
            </div>
            <span className="text-xs font-bold text-gray-400">
              Showing {coupons.length} vouchers
            </span>
          </div>
          <CardDescription className="text-xs">
            Review promotion parameters, expiration timelines, discount caps, and manage active status.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[950px] w-full border-collapse">
              <TableHeader>
                <TableRow className="bg-gray-50/80 hover:bg-gray-50/80 dark:bg-slate-900/50">
                  <TableHead className="w-[200px] text-xs font-bold">Voucher Code</TableHead>
                  <TableHead className="w-[170px] text-xs font-bold">Discount Rate</TableHead>
                  <TableHead className="w-[140px] text-xs font-bold">Max Discount Cap</TableHead>
                  <TableHead className="w-[180px] text-xs font-bold">Expiration & Timeline</TableHead>
                  <TableHead className="w-[120px] text-xs font-bold">Status</TableHead>
                  <TableHead className="w-[140px] text-xs font-bold text-right sticky right-0 bg-gray-50 dark:bg-slate-900 shadow-l">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <TableRow key={idx}>
                      <TableCell colSpan={6} className="h-16 text-center">
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                          <Loader2 className="size-4 animate-spin text-emerald-600" />
                          <span>Loading coupon database...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : coupons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-44 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <Tag className="size-8 text-gray-300 dark:text-slate-700" />
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          No coupons found
                        </span>
                        <p className="text-xs text-gray-400 max-w-sm">
                          {searchQuery || statusFilter !== "ALL"
                            ? "No coupons matched your filter criteria. Try resetting your search."
                            : "No promotional campaigns exist in the database yet. Click below to generate standard industrial vouchers."}
                        </p>
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            onClick={handleSeedCoupons}
                            className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
                          >
                            <Sparkles className="size-3.5 mr-1.5" />
                            Seed Standard Promos
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={openCreateModal}
                            className="text-xs font-bold rounded-xl"
                          >
                            <Plus className="size-3.5 mr-1.5" />
                            Create Custom Code
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  coupons.map((coupon) => {
                    const validDate = new Date(coupon.validUntil);
                    const now = new Date();
                    const isExpired = validDate <= now;
                    const daysRemaining = Math.ceil(
                      (validDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                    );

                    return (
                      <TableRow
                        key={coupon.id}
                        className="hover:bg-gray-50/50 dark:hover:bg-slate-900/30 transition"
                      >
                        {/* Code + Copy */}
                        <TableCell className="font-mono">
                          <div className="flex items-center gap-2">
                            <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                              {coupon.code}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(coupon.code, coupon.id)}
                              title="Copy code to clipboard"
                              className="p-1 rounded-md text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition cursor-pointer"
                            >
                              {copiedId === coupon.id ? (
                                <Check className="size-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="size-3.5" />
                              )}
                            </button>
                          </div>
                        </TableCell>

                        {/* Discount */}
                        <TableCell>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-black text-gray-900 dark:text-white font-mono">
                              {coupon.discountPercentage}%
                            </span>
                            <span className="text-xs font-bold uppercase text-emerald-600">OFF</span>
                          </div>
                        </TableCell>

                        {/* Max Discount Cap */}
                        <TableCell>
                          {coupon.maxDiscount ? (
                            <span className="font-mono font-bold text-xs text-gray-700 dark:text-slate-300">
                              ${coupon.maxDiscount.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400 font-medium">Uncapped</span>
                          )}
                        </TableCell>

                        {/* Validity & Countdown */}
                        <TableCell>
                          <div>
                            <span className="text-xs font-semibold text-gray-700 dark:text-slate-300 block">
                              {validDate.toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                            <span
                              className={cn(
                                "text-[11px] font-bold block",
                                isExpired
                                  ? "text-rose-600 dark:text-rose-400"
                                  : daysRemaining <= 30
                                  ? "text-amber-600 dark:text-amber-400"
                                  : "text-emerald-600 dark:text-emerald-400"
                              )}
                            >
                              {isExpired
                                ? `Expired ${Math.abs(daysRemaining)} days ago`
                                : `${daysRemaining} days remaining`}
                            </span>
                          </div>
                        </TableCell>

                        {/* Status Badge */}
                        <TableCell>
                          {!coupon.isActive ? (
                            <Badge
                              variant="outline"
                              className="text-[11px] font-bold border-gray-300 text-gray-500 bg-gray-50 dark:bg-slate-900"
                            >
                              <span className="size-1.5 rounded-full bg-gray-400 mr-1.5" />
                              Disabled
                            </Badge>
                          ) : isExpired ? (
                            <Badge
                              variant="outline"
                              className="text-[11px] font-bold border-rose-300 text-rose-700 bg-rose-50 dark:bg-rose-950/40 dark:border-rose-800"
                            >
                              <span className="size-1.5 rounded-full bg-rose-500 mr-1.5" />
                              Expired
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="text-[11px] font-bold border-emerald-300 text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-800"
                            >
                              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
                              Active
                            </Badge>
                          )}
                        </TableCell>

                        {/* Actions (Sticky Right) */}
                        <TableCell className="text-right sticky right-0 bg-white dark:bg-slate-900 shadow-l">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Toggle active button */}
                            <button
                              type="button"
                              onClick={() => handleToggleActive(coupon)}
                              title={coupon.isActive ? "Deactivate coupon" : "Activate coupon"}
                              className={cn(
                                "p-1.5 rounded-lg border text-xs font-bold transition cursor-pointer",
                                coupon.isActive
                                  ? "border-gray-200 text-gray-600 hover:bg-gray-100 dark:border-slate-800 dark:text-slate-300"
                                  : "border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40"
                              )}
                            >
                              {coupon.isActive ? "Disable" : "Enable"}
                            </button>

                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => openEditModal(coupon)}
                              title="Edit coupon parameters"
                              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-slate-800 dark:hover:text-white transition cursor-pointer"
                            >
                              <Edit3 className="size-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(coupon)}
                              title="Delete coupon"
                              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
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
      {/* 5. Create & Edit Coupon Modal                                             */}
      {/* ========================================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <TicketPercent className="size-5 text-emerald-600" />
                <h3 className="text-base font-black text-gray-900 dark:text-white">
                  {editingCoupon ? "Edit Coupon Voucher" : "Create New Promotional Voucher"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-slate-800"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-4 mt-4">
              {/* Preset buttons (only when creating) */}
              {!editingCoupon && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700 dark:text-slate-300">
                    Quick Preset Campaign Templates
                  </Label>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_COUPONS.map((preset) => (
                      <button
                        key={preset.code}
                        type="button"
                        onClick={() => applyPreset(preset)}
                        className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-[11px] font-bold text-gray-700 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-800 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-emerald-950/40 transition cursor-pointer"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Code */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-gray-700 dark:text-slate-300">
                    Coupon Code *
                  </Label>
                  <button
                    type="button"
                    onClick={generateRandomCode}
                    className="text-[11px] font-bold text-emerald-600 hover:underline cursor-pointer"
                  >
                    Generate Random Code
                  </button>
                </div>
                <Input
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FT-SPRING20"
                  required
                  className="font-mono text-sm uppercase font-black rounded-xl border-gray-200 dark:border-slate-800"
                />
              </div>

              {/* Discount Percentage and Max Discount */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700 dark:text-slate-300">
                    Discount Percentage (%) *
                  </Label>
                  <div className="relative">
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      step={1}
                      value={formDiscount}
                      onChange={(e) => setFormDiscount(Number(e.target.value))}
                      required
                      className="rounded-xl border-gray-200 dark:border-slate-800 font-mono pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                      %
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-gray-700 dark:text-slate-300">
                    Max Discount Cap ($)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                      $
                    </span>
                    <Input
                      type="number"
                      min={1}
                      step={1}
                      value={formMaxDiscount}
                      onChange={(e) => setFormMaxDiscount(e.target.value)}
                      placeholder="e.g. 100"
                      className="rounded-xl border-gray-200 dark:border-slate-800 font-mono pl-7"
                    />
                  </div>
                </div>
              </div>

              {/* Expiration Date */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-gray-700 dark:text-slate-300">
                    Valid Until (Expiration Date) *
                  </Label>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date();
                        d.setDate(d.getDate() + 30);
                        setFormValidUntil(d.toISOString().split("T")[0]);
                      }}
                      className="text-[10px] font-bold text-gray-500 hover:text-emerald-600"
                    >
                      +30D
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date();
                        d.setDate(d.getDate() + 90);
                        setFormValidUntil(d.toISOString().split("T")[0]);
                      }}
                      className="text-[10px] font-bold text-gray-500 hover:text-emerald-600"
                    >
                      +90D
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const d = new Date();
                        d.setFullYear(d.getFullYear() + 1);
                        setFormValidUntil(d.toISOString().split("T")[0]);
                      }}
                      className="text-[10px] font-bold text-gray-500 hover:text-emerald-600"
                    >
                      +1 Year
                    </button>
                  </div>
                </div>
                <Input
                  type="date"
                  value={formValidUntil}
                  onChange={(e) => setFormValidUntil(e.target.value)}
                  required
                  className="rounded-xl border-gray-200 dark:border-slate-800"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold text-gray-800 dark:text-slate-200 block">
                    Campaign Live Status
                  </span>
                  <span className="text-[11px] text-gray-400">
                    If active, customers can immediately redeem this code during checkout.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="size-4 rounded accent-emerald-600 cursor-pointer"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                  disabled={submitting}
                  className="rounded-xl text-xs font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {submitting && <Loader2 className="size-3.5 animate-spin mr-1.5" />}
                  <span>{editingCoupon ? "Save Changes" : "Create Coupon"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. Delete Confirmation Modal                                              */}
      {/* ========================================================================= */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                <Trash2 className="size-5" />
              </span>
              <div>
                <h3 className="text-sm font-black text-gray-900 dark:text-white">
                  Delete Promotional Code
                </h3>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                  Are you sure you want to delete <span className="font-mono font-bold text-rose-600">{deleteTarget.code}</span>? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="rounded-xl text-xs font-bold"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleDeleteCoupon}
                disabled={deleting}
                className="rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
              >
                {deleting && <Loader2 className="size-3.5 animate-spin mr-1.5" />}
                <span>Delete Voucher</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
