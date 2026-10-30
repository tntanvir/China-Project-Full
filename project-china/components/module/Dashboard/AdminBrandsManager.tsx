"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Award,
  Building2,
  Check,
  CheckCircle2,
  Cpu,
  Download,
  Edit,
  ExternalLink,
  Globe,
  Layers,
  Loader2,
  MapPin,
  Plus,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { AdminService, type BrandRecord } from "@/services/admin.service";

const brandCategories = [
  "Laminates & Prepregs",
  "High Frequency & RF",
  "Semiconductors & ICs",
  "Wireless & IoT SoCs",
  "Flexible Substrates",
  "Solder Mask & Chemistries",
  "Strategic Engineering Partner",
  "Passive Components",
];

export default function AdminBrandsManager() {
  const [brands, setBrands] = useState<BrandRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isSeeding, setIsSeeding] = useState(false);

  // Dialog State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<BrandRecord | null>(null);
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Semiconductors & ICs");
  const [formCountry, setFormCountry] = useState("United States");
  const [formWebsite, setFormWebsite] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formStatus, setFormStatus] = useState("ACTIVE");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadBrands = async () => {
    setLoading(true);
    try {
      const data = await AdminService.getBrands();
      setBrands(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load brands:", error);
      toast.error("Failed to load brand directory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const handleOpenCreate = () => {
    setEditingBrand(null);
    setFormName("");
    setFormCategory("Semiconductors & ICs");
    setFormCountry("United States");
    setFormWebsite("");
    setFormDescription("");
    setFormStatus("ACTIVE");
    setDialogOpen(true);
  };

  const handleOpenEdit = (brand: BrandRecord) => {
    setEditingBrand(brand);
    setFormName(brand.name);
    setFormCategory(brand.category || "Semiconductors & ICs");
    setFormCountry(brand.country || "United States");
    setFormWebsite(brand.website || "");
    setFormDescription(brand.description || "");
    setFormStatus(brand.status || "ACTIVE");
    setDialogOpen(true);
  };

  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("Brand name is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingBrand) {
        const updated = await AdminService.updateBrand(editingBrand.id, {
          name: formName.trim(),
          category: formCategory,
          country: formCountry,
          website: formWebsite.trim() || undefined,
          description: formDescription.trim() || undefined,
          status: formStatus,
        });
        setBrands((prev) => prev.map((b) => (b.id === editingBrand.id ? updated : b)));
        toast.success(`Updated brand "${updated.name}" successfully.`);
      } else {
        const created = await AdminService.createBrand({
          name: formName.trim(),
          category: formCategory,
          country: formCountry,
          website: formWebsite.trim() || undefined,
          description: formDescription.trim() || undefined,
          status: formStatus,
        });
        setBrands((prev) => [...prev, created]);
        toast.success(`Created brand "${created.name}" successfully.`);
      }
      setDialogOpen(false);
    } catch (error) {
      console.error("Save brand failed:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save brand.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBrand = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from the approved brands list?`)) {
      return;
    }

    try {
      await AdminService.deleteBrand(id);
      setBrands((prev) => prev.filter((b) => b.id !== id));
      toast.success(`Deleted brand "${name}".`);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete brand.");
    }
  };

  const handleToggleStatus = async (brand: BrandRecord, newStatus: string) => {
    try {
      const updated = await AdminService.updateBrand(brand.id, { status: newStatus });
      setBrands((prev) => prev.map((b) => (b.id === brand.id ? { ...b, status: newStatus } : b)));
      toast.success(`Updated "${brand.name}" status to ${newStatus}.`);
    } catch (error) {
      console.error("Status update failed:", error);
      toast.error("Failed to update status.");
    }
  };

  const handleSeedDefaultBrands = async () => {
    setIsSeeding(true);
    try {
      const result = await AdminService.seedBrands();
      setBrands(Array.isArray(result) ? result : []);
      toast.success("Standard AVL component and substrate brands seeded successfully!");
    } catch (error) {
      console.error("Seed failed:", error);
      toast.error("Failed to seed brands.");
    } finally {
      setIsSeeding(false);
    }
  };

  // Metrics
  const metrics = useMemo(() => {
    const total = brands.length;
    const verified = brands.filter((b) => b.isVerified).length;
    const semiconductors = brands.filter(
      (b) =>
        (b.category || "").includes("Semiconductor") ||
        (b.category || "").includes("Wireless") ||
        (b.category || "").includes("SoC")
    ).length;
    const laminates = brands.filter(
      (b) =>
        (b.category || "").includes("Laminate") ||
        (b.category || "").includes("RF") ||
        (b.category || "").includes("Substrate")
    ).length;

    return { total, verified, semiconductors, laminates };
  }, [brands]);

  // Unique categories in list
  const existingCategories = useMemo(() => {
    const set = new Set<string>();
    brands.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return Array.from(set);
  }, [brands]);

  // Filtered
  const filteredBrands = useMemo(() => {
    return brands.filter((brand) => {
      if (categoryFilter !== "ALL" && brand.category !== categoryFilter) return false;
      if (statusFilter !== "ALL" && brand.status !== statusFilter) return false;

      const q = search.trim().toLowerCase();
      if (!q) return true;

      const nameMatch = (brand.name || "").toLowerCase().includes(q);
      const catMatch = (brand.category || "").toLowerCase().includes(q);
      const countryMatch = (brand.country || "").toLowerCase().includes(q);
      const descMatch = (brand.description || "").toLowerCase().includes(q);
      return nameMatch || catMatch || countryMatch || descMatch;
    });
  }, [brands, categoryFilter, statusFilter, search]);

  const exportToCsv = () => {
    if (brands.length === 0) {
      toast.error("No brand data to export.");
      return;
    }

    const headers = ["Brand ID", "Brand Name", "Category", "Country", "Website", "Status", "Verified", "Description"];
    const rows = filteredBrands.map((b) => [
      `"${b.id}"`,
      `"${(b.name || "").replace(/"/g, '""')}"`,
      `"${b.category || "Uncategorized"}"`,
      `"${b.country || "Global"}"`,
      `"${b.website || ""}"`,
      `"${b.status}"`,
      `"${b.isVerified ? "Yes" : "No"}"`,
      `"${(b.description || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `approved_brands_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredBrands.length} brand records to CSV`);
  };

  const getInitials = (name: string) => {
    const words = name.trim().split(" ");
    if (words.length >= 2) return `${words[0][0]}${words[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* 1. Header Banner                                                          */}
      {/* ========================================================================= */}
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
              <Building2 className="size-6" />
            </span>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200 mb-1.5 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Approved Vendor List (AVL)
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Brand Directory & Qualified Suppliers
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-slate-400">
                Manage certified semiconductor manufacturers, laminate and high-frequency substrate brands, SMT chemistry vendors, and joint-venture design partners.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            {brands.length === 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSeedDefaultBrands}
                disabled={isSeeding}
                className="gap-1.5 rounded-xl border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-xs cursor-pointer"
              >
                {isSeeding ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5 text-emerald-600" />}
                <span>Seed Verified Brands</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={exportToCsv}
              disabled={brands.length === 0}
              className="gap-1.5 rounded-xl border-gray-200 dark:border-slate-800 text-xs font-bold hover:border-emerald-500 cursor-pointer"
            >
              <Download className="size-3.5 text-gray-500" />
              <span>Export CSV</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={loadBrands}
              disabled={loading}
              className="gap-1.5 rounded-xl border-gray-200 dark:border-slate-800 text-xs font-bold hover:border-emerald-500 cursor-pointer"
            >
              <RefreshCcw className={`size-3.5 ${loading ? "animate-spin text-emerald-600" : ""}`} />
              <span>Refresh</span>
            </Button>

            <Button
              size="sm"
              onClick={handleOpenCreate}
              className="gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs cursor-pointer"
            >
              <Plus className="size-3.5" />
              <span>Add Brand</span>
            </Button>
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
                Total Brands
              </span>
              <Building2 className="size-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-gray-900 dark:text-white">
              {metrics.total}
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">Approved vendor network</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-emerald-300/80 bg-emerald-50/30 dark:bg-emerald-950/20 dark:border-emerald-800/60 shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Verified Partners
              </span>
              <ShieldCheck className="size-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-emerald-700 dark:text-emerald-300">
              {metrics.verified}
            </div>
            <p className="text-[11px] text-emerald-600/80 font-medium mt-0.5">
              ISO / UL certified sources
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200/80 dark:border-slate-800 shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                Semiconductors & ICs
              </span>
              <Cpu className="size-4 text-blue-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-blue-600 dark:text-blue-400">
              {metrics.semiconductors}
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">Microcontrollers & SoCs</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200/80 dark:border-slate-800 shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400">
                Laminates & Substrates
              </span>
              <Layers className="size-4 text-purple-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-purple-600 dark:text-purple-400">
              {metrics.laminates}
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">FR-4, Rogers & Polyimide</p>
          </CardContent>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* 3. Filters & Search                                                       */}
      {/* ========================================================================= */}
      <Card className="rounded-2xl border-gray-200 dark:border-slate-800 shadow-xs">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-2.5 size-4 text-gray-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by brand name, category, country, or description..."
                className="pl-9 text-xs rounded-xl border-gray-200 dark:border-slate-800"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                  title="Clear search"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-gray-500 dark:text-slate-400 whitespace-nowrap">
                Category:
              </span>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-56 text-xs font-bold rounded-xl border-gray-200 dark:border-slate-800">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Categories ({brands.length})</SelectItem>
                  {existingCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 text-xs font-bold rounded-xl border-gray-200 dark:border-slate-800">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>

              {(search || categoryFilter !== "ALL" || statusFilter !== "ALL") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearch("");
                    setCategoryFilter("ALL");
                    setStatusFilter("ALL");
                  }}
                  className="text-xs text-slate-500 hover:text-emerald-600 cursor-pointer"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================================================= */}
      {/* 4. Brands Table Container (Drawer-Proof Widths & Sticky Actions)          */}
      {/* ========================================================================= */}
      <Card className="rounded-2xl border-gray-200 shadow-xs dark:border-slate-800 overflow-hidden">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-white to-gray-50/80 p-4 sm:p-5 dark:border-slate-800/80 dark:from-slate-900/90 dark:via-slate-900 dark:to-slate-900/90">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <CardTitle className="text-lg font-black text-gray-900 dark:text-white">
                  Approved Brands & Component Vendors
                </CardTitle>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {filteredBrands.length} brands
                </span>
              </div>
              <CardDescription className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                Verified suppliers eligible for factory BOM procurement, PCB turnkey assembly, and laminate selection.
              </CardDescription>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1 text-xs font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                <span>Active Vendor Directory</span>
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
                Loading brand directory from database...
              </p>
            </div>
          ) : filteredBrands.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-14 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-slate-800 text-gray-400 mb-3">
                <Building2 className="size-7" />
              </div>
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
                No Brands Found
              </h3>
              <p className="mt-1 text-xs text-gray-500 max-w-md">
                {brands.length === 0
                  ? "Your brand directory is currently empty. Click the button below to seed standard verified component and substrate suppliers."
                  : "No brands match your search or filter settings. Try resetting your search."}
              </p>
              <div className="mt-4 flex gap-2">
                {brands.length === 0 ? (
                  <Button
                    size="sm"
                    onClick={handleSeedDefaultBrands}
                    disabled={isSeeding}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs gap-1.5 cursor-pointer"
                  >
                    {isSeeding ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
                    <span>Seed Verified AVL Brands</span>
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearch("");
                        setCategoryFilter("ALL");
                        setStatusFilter("ALL");
                      }}
                      className="cursor-pointer"
                    >
                      Reset Filters
                    </Button>
                    <Button size="sm" onClick={loadBrands} className="bg-emerald-600 text-white cursor-pointer">
                      Refresh
                    </Button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
              <Table className="min-w-[1240px] w-full border-collapse">
                <TableHeader>
                  <TableRow className="border-b border-gray-200 bg-gray-50/80 dark:border-slate-800 dark:bg-slate-900/80 text-xs">
                    {/* Brand Name */}
                    <TableHead className="w-[300px] min-w-[300px] font-extrabold text-slate-700 dark:text-slate-300 pl-4">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="size-3 text-emerald-600" />
                        <span>Brand & Manufacturer</span>
                      </div>
                    </TableHead>

                    {/* Category */}
                    <TableHead className="w-[200px] min-w-[200px] font-extrabold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Layers className="size-3 text-emerald-600" />
                        <span>Domain / Category</span>
                      </div>
                    </TableHead>

                    {/* Country */}
                    <TableHead className="w-[160px] min-w-[160px] font-extrabold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="size-3 text-emerald-600" />
                        <span>Origin</span>
                      </div>
                    </TableHead>

                    {/* Website */}
                    <TableHead className="w-[180px] min-w-[180px] font-extrabold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Globe className="size-3 text-emerald-600" />
                        <span>Official Website</span>
                      </div>
                    </TableHead>

                    {/* Description */}
                    <TableHead className="w-[260px] min-w-[260px] font-extrabold text-slate-700 dark:text-slate-300">
                      <span>Capabilities & Description</span>
                    </TableHead>

                    {/* Status */}
                    <TableHead className="w-[140px] min-w-[140px] font-extrabold text-slate-700 dark:text-slate-300">
                      <span>Status</span>
                    </TableHead>

                    {/* Sticky Actions */}
                    <TableHead className="w-[140px] min-w-[140px] sticky right-0 bg-gray-50/95 dark:bg-slate-900/95 backdrop-blur-xs z-10 text-right pr-4 font-extrabold text-slate-700 dark:text-slate-300 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.06)] dark:shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.4)]">
                      <span>Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredBrands.map((brand) => {
                    const isActive = brand.status === "ACTIVE";

                    return (
                      <TableRow
                        key={brand.id}
                        className="group border-b border-gray-100 hover:bg-slate-50/60 dark:border-slate-800/60 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        {/* 1. Brand Logo Avatar & Name */}
                        <TableCell className="w-[300px] min-w-[300px] align-middle py-3.5 pl-4">
                          <div className="flex items-center gap-3">
                            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white font-black text-xs shadow-xs ring-1 ring-slate-200 dark:ring-slate-700">
                              {getInitials(brand.name)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 font-bold text-gray-900 dark:text-white text-xs">
                                <span className="truncate">{brand.name}</span>
                                {brand.isVerified && (
                                  <span title="Verified OEM / Tier-1 Manufacturer">
                                    <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-gray-400 font-mono truncate mt-0.5">
                                slug: {brand.slug}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* 2. Category */}
                        <TableCell className="w-[200px] min-w-[200px] align-middle py-3.5">
                          <Badge
                            variant="outline"
                            className="text-[11px] font-bold rounded-lg bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-2 py-0.5"
                          >
                            {brand.category || "General"}
                          </Badge>
                        </TableCell>

                        {/* 3. Origin Country */}
                        <TableCell className="w-[160px] min-w-[160px] align-middle py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-slate-300">
                            <MapPin className="size-3 text-gray-400" />
                            <span>{brand.country || "Global"}</span>
                          </div>
                        </TableCell>

                        {/* 4. Official Website */}
                        <TableCell className="w-[180px] min-w-[180px] align-middle py-3.5">
                          {brand.website ? (
                            <a
                              href={brand.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline truncate max-w-[160px]"
                            >
                              <Globe className="size-3 shrink-0" />
                              <span className="truncate">{brand.website.replace(/^https?:\/\//, "")}</span>
                              <ExternalLink className="size-2.5 shrink-0" />
                            </a>
                          ) : (
                            <span className="text-xs text-gray-400">N/A</span>
                          )}
                        </TableCell>

                        {/* 5. Description */}
                        <TableCell className="w-[260px] min-w-[260px] align-middle py-3.5 whitespace-normal">
                          <p className="line-clamp-2 text-[11px] text-gray-500 dark:text-slate-400 leading-relaxed">
                            {brand.description || "Certified component/material supplier for electronic fabrication."}
                          </p>
                        </TableCell>

                        {/* 6. Status Selector */}
                        <TableCell className="w-[140px] min-w-[140px] align-middle py-3.5">
                          <Select
                            value={brand.status}
                            onValueChange={(val) => handleToggleStatus(brand, val)}
                          >
                            <SelectTrigger
                              className={cn(
                                "h-7 w-28 text-xs font-bold rounded-lg border",
                                isActive
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                                  : "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300"
                              )}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                              <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>

                        {/* 7. Sticky Actions */}
                        <TableCell className="w-[140px] min-w-[140px] sticky right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs z-10 text-right pr-4 align-middle py-3.5 whitespace-nowrap shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.06)] dark:shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.4)] group-hover:bg-slate-50/95 dark:group-hover:bg-slate-800/95 transition-colors">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleOpenEdit(brand)}
                              className="size-8 rounded-xl border-gray-200 dark:border-slate-800 text-gray-600 hover:text-emerald-600 cursor-pointer"
                              title="Edit brand"
                            >
                              <Edit className="size-3.5" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDeleteBrand(brand.id, brand.name)}
                              className="size-8 rounded-xl border-gray-200 dark:border-slate-800 text-gray-400 hover:text-rose-600 hover:border-rose-300 cursor-pointer"
                              title="Delete brand"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
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

      {/* ========================================================================= */}
      {/* 5. Create / Edit Brand Dialog                                             */}
      {/* ========================================================================= */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl border-gray-200 dark:border-slate-800">
          <form onSubmit={handleSaveBrand}>
            <DialogHeader>
              <DialogTitle className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Building2 className="size-5 text-emerald-600" />
                <span>{editingBrand ? "Edit Brand Details" : "Register Approved Brand"}</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500 dark:text-slate-400">
                Register verified silicon, component, or laminate manufacturers for PCB procurement and quotes.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3">
              <div className="space-y-1.5">
                <Label htmlFor="brandName" className="text-xs font-bold text-gray-700 dark:text-slate-300">
                  Brand / Manufacturer Name *
                </Label>
                <Input
                  id="brandName"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Texas Instruments, Rogers Corporation"
                  className="text-xs rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="brandCategory" className="text-xs font-bold text-gray-700 dark:text-slate-300">
                    Category *
                  </Label>
                  <Select value={formCategory} onValueChange={setFormCategory}>
                    <SelectTrigger id="brandCategory" className="text-xs font-bold rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {brandCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="brandCountry" className="text-xs font-bold text-gray-700 dark:text-slate-300">
                    Country / Origin
                  </Label>
                  <Input
                    id="brandCountry"
                    value={formCountry}
                    onChange={(e) => setFormCountry(e.target.value)}
                    placeholder="e.g. United States, Japan, China"
                    className="text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="brandWebsite" className="text-xs font-bold text-gray-700 dark:text-slate-300">
                  Official Website
                </Label>
                <Input
                  id="brandWebsite"
                  type="url"
                  value={formWebsite}
                  onChange={(e) => setFormWebsite(e.target.value)}
                  placeholder="https://www.ti.com"
                  className="text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="brandDesc" className="text-xs font-bold text-gray-700 dark:text-slate-300">
                  Capabilities & Specifications Description
                </Label>
                <Textarea
                  id="brandDesc"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Summarize product line, qualification certifications, or substrate series..."
                  rows={3}
                  className="text-xs rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="formStatus" className="text-xs font-bold text-gray-700 dark:text-slate-300">
                  Verification Status
                </Label>
                <Select value={formStatus} onValueChange={setFormStatus}>
                  <SelectTrigger id="formStatus" className="text-xs font-bold rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">ACTIVE (Approved for BOM Procurement)</SelectItem>
                    <SelectItem value="INACTIVE">INACTIVE (Temporarily Suspended)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="rounded-xl text-xs font-bold cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 cursor-pointer shadow-xs"
              >
                {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
                <span>{editingBrand ? "Save Changes" : "Create Brand"}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
