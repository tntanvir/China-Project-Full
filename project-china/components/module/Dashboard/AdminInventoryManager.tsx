"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpDown,
  Boxes,
  CheckCircle2,
  Download,
  Edit,
  ExternalLink,
  Layers,
  Loader2,
  Minus,
  Package,
  Plus,
  RefreshCcw,
  Search,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
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
import { AdminService, type AdminInventoryProduct } from "@/services/admin.service";

type StockFilter = "ALL" | "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

export default function AdminInventoryManager() {
  const [products, setProducts] = useState<AdminInventoryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState<StockFilter>("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [isSeeding, setIsSeeding] = useState(false);

  // Edit stock dialog
  const [editingProduct, setEditingProduct] = useState<AdminInventoryProduct | null>(null);
  const [newStock, setNewStock] = useState<number>(0);
  const [newStatus, setNewStatus] = useState<string>("ACTIVE");
  const [isUpdatingStock, setIsUpdatingStock] = useState(false);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const data = await AdminService.getInventory();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load inventory:", error);
      toast.error("Failed to load inventory from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleSeedInventory = async () => {
    setIsSeeding(true);
    try {
      const result = await AdminService.seedInventory();
      setProducts(Array.isArray(result) ? result : []);
      toast.success("Default manufacturing inventory seeded successfully!");
    } catch (error) {
      console.error("Seed failed:", error);
      toast.error("Failed to seed default inventory.");
    } finally {
      setIsSeeding(false);
    }
  };

  const handleOpenEdit = (product: AdminInventoryProduct) => {
    setEditingProduct(product);
    setNewStock(product.stock || 0);
    setNewStatus(product.status || "ACTIVE");
  };

  const handleSaveStock = async () => {
    if (!editingProduct) return;
    setIsUpdatingStock(true);
    try {
      const updated = await AdminService.updateInventoryStock(editingProduct.id, {
        stock: newStock,
        status: newStatus,
      });

      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? { ...p, stock: newStock, status: newStatus } : p))
      );
      toast.success(`Updated "${editingProduct.name}" stock to ${newStock} units`);
      setEditingProduct(null);
    } catch (error) {
      console.error("Update stock failed:", error);
      toast.error("Failed to update stock quantity.");
    } finally {
      setIsUpdatingStock(false);
    }
  };

  const handleQuickAdjust = async (product: AdminInventoryProduct, delta: number) => {
    const updatedStock = Math.max(0, (product.stock || 0) + delta);
    try {
      await AdminService.updateInventoryStock(product.id, {
        stock: updatedStock,
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, stock: updatedStock } : p))
      );
      toast.success(`Stock adjusted: ${product.name} (${updatedStock} units)`);
    } catch (error) {
      console.error("Quick adjust failed:", error);
      toast.error("Failed to adjust stock.");
    }
  };

  // Categories list
  const uniqueCategories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  // Aggregate metrics
  const metrics = useMemo(() => {
    const totalItems = products.length;
    const totalUnits = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const inStock = products.filter((p) => (p.stock || 0) > 50).length;
    const lowStock = products.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) <= 50).length;
    const outOfStock = products.filter((p) => (p.stock || 0) === 0).length;
    const totalValuation = products.reduce(
      (sum, p) => sum + (p.stock || 0) * (Number(p.price) || 0),
      0
    );

    return { totalItems, totalUnits, inStock, lowStock, outOfStock, totalValuation };
  }, [products]);

  // Filtered rows
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Stock filter
      if (stockFilter === "IN_STOCK" && (product.stock || 0) <= 50) return false;
      if (stockFilter === "LOW_STOCK" && ((product.stock || 0) === 0 || (product.stock || 0) > 50))
        return false;
      if (stockFilter === "OUT_OF_STOCK" && (product.stock || 0) > 0) return false;

      // Category filter
      if (categoryFilter !== "ALL" && product.category !== categoryFilter) return false;

      // Search filter
      const q = search.trim().toLowerCase();
      if (!q) return true;

      const nameMatch = (product.name || "").toLowerCase().includes(q);
      const slugMatch = (product.slug || "").toLowerCase().includes(q);
      const catMatch = (product.category || "").toLowerCase().includes(q);
      return nameMatch || slugMatch || catMatch;
    });
  }, [products, stockFilter, categoryFilter, search]);

  const exportToCsv = () => {
    if (products.length === 0) {
      toast.error("No inventory data to export.");
      return;
    }

    const headers = [
      "Product ID",
      "Product Name",
      "SKU / Slug",
      "Category",
      "Stock Units",
      "Unit Price (USD)",
      "Total Valuation (USD)",
      "Status",
      "Last Updated",
    ];

    const rows = filteredProducts.map((p) => [
      `"${p.id}"`,
      `"${(p.name || "").replace(/"/g, '""')}"`,
      `"${p.slug || ""}"`,
      `"${p.category || "Uncategorized"}"`,
      p.stock || 0,
      Number(p.price || 0).toFixed(2),
      ((p.stock || 0) * Number(p.price || 0)).toFixed(2),
      `"${p.status}"`,
      `"${new Date(p.updatedAt).toISOString()}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `warehouse_inventory_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Exported ${filteredProducts.length} inventory records to CSV`);
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
              <Boxes className="size-6" />
            </span>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200 mb-1.5 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Factory Warehouse Reserves
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                Warehouse Inventory & Material Stock
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-slate-400">
                Track factory warehouse reserves, FR-4 copper laminates, Rogers high-frequency substrates, SMT solder paste, and finished PCB stock.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            {products.length === 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSeedInventory}
                disabled={isSeeding}
                className="gap-1.5 rounded-xl border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-xs cursor-pointer"
              >
                {isSeeding ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5 text-emerald-600" />}
                <span>Seed Initial Inventory</span>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={exportToCsv}
              disabled={products.length === 0}
              className="gap-1.5 rounded-xl border-gray-200 dark:border-slate-800 text-xs font-bold hover:border-emerald-500 cursor-pointer"
            >
              <Download className="size-3.5 text-gray-500" />
              <span>Export CSV</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={loadInventory}
              disabled={loading}
              className="gap-1.5 rounded-xl border-gray-200 dark:border-slate-800 text-xs font-bold hover:border-emerald-500 cursor-pointer"
            >
              <RefreshCcw className={`size-3.5 ${loading ? "animate-spin text-emerald-600" : ""}`} />
              <span>Refresh</span>
            </Button>

            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-black text-white shadow-xs hover:bg-emerald-700 transition"
            >
              <Plus className="size-3.5" />
              <span>New Product</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. Key Metrics Grid                                                       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {/* Total Items */}
        <Card className="rounded-2xl border-gray-200/80 dark:border-slate-800 shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Catalog Items
              </span>
              <Package className="size-4 text-gray-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-gray-900 dark:text-white">
              {metrics.totalItems}
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">Unique inventory SKUs</p>
          </CardContent>
        </Card>

        {/* Total Units */}
        <Card className="rounded-2xl border-emerald-300/80 bg-emerald-50/30 dark:bg-emerald-950/20 dark:border-emerald-800/60 shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Total Units
              </span>
              <Boxes className="size-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-emerald-700 dark:text-emerald-300 font-mono">
              {metrics.totalUnits.toLocaleString()}
            </div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400/80 font-medium mt-0.5">
              Available warehouse units
            </p>
          </CardContent>
        </Card>

        {/* In Stock */}
        <Card className="rounded-2xl border-gray-200/80 dark:border-slate-800 shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Healthy Stock
              </span>
              <CheckCircle2 className="size-4 text-emerald-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {metrics.inStock}
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">&gt; 50 units reserved</p>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card className="rounded-2xl border-amber-300/80 bg-amber-50/30 dark:bg-amber-950/20 dark:border-amber-800/60 shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Low Stock Alert
              </span>
              <AlertTriangle className="size-4 text-amber-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-amber-600 dark:text-amber-400">
              {metrics.lowStock}
            </div>
            <p className="text-[11px] text-amber-600/80 font-medium mt-0.5">&le; 50 units remaining</p>
          </CardContent>
        </Card>

        {/* Out of Stock */}
        <Card className="rounded-2xl border-rose-300/80 bg-rose-50/30 dark:bg-rose-950/20 dark:border-rose-800/60 shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                Out of Stock
              </span>
              <XCircle className="size-4 text-rose-600" />
            </div>
            <div className="mt-2 text-2xl font-black text-rose-600 dark:text-rose-400">
              {metrics.outOfStock}
            </div>
            <p className="text-[11px] text-rose-600/80 font-medium mt-0.5">Replenishment required</p>
          </CardContent>
        </Card>

        {/* Valuation */}
        <Card className="rounded-2xl border-gray-200/80 dark:border-slate-800 shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                Total Valuation
              </span>
              <span className="text-xs font-black text-blue-600">$ USD</span>
            </div>
            <div className="mt-2 text-xl font-black text-blue-600 dark:text-blue-400 font-mono">
              ${metrics.totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">Asset inventory value</p>
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
            { label: "All Items", value: "ALL", count: metrics.totalItems },
            { label: "Healthy Stock", value: "IN_STOCK", count: metrics.inStock },
            { label: "Low Stock Alert", value: "LOW_STOCK", count: metrics.lowStock },
            { label: "Out of Stock", value: "OUT_OF_STOCK", count: metrics.outOfStock },
          ].map((item) => {
            const isActive = stockFilter === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setStockFilter(item.value as StockFilter)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                <span>{item.label}</span>
                <span className="rounded-full bg-black/15 px-1.5 py-0.2 text-[10px]">
                  {item.count}
                </span>
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
                  placeholder="Search by product name, category, or SKU..."
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

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 dark:text-slate-400 whitespace-nowrap">
                  Category:
                </span>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-52 text-xs font-bold rounded-xl border-gray-200 dark:border-slate-800">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Categories ({products.length})</SelectItem>
                    {uniqueCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {(search || stockFilter !== "ALL" || categoryFilter !== "ALL") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearch("");
                      setStockFilter("ALL");
                      setCategoryFilter("ALL");
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
      </div>

      {/* ========================================================================= */}
      {/* 4. Inventory Table Container (Drawer-Proof Widths & Sticky Actions)       */}
      {/* ========================================================================= */}
      <Card className="rounded-2xl border-gray-200 shadow-xs dark:border-slate-800 overflow-hidden">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50/80 via-white to-gray-50/80 p-4 sm:p-5 dark:border-slate-800/80 dark:from-slate-900/90 dark:via-slate-900 dark:to-slate-900/90">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <CardTitle className="text-lg font-black text-gray-900 dark:text-white">
                  Warehouse Stock Records
                </CardTitle>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-black text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {filteredProducts.length} items
                </span>
              </div>
              <CardDescription className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                Physical factory stock counts, reorder thresholds, unit valuations, and instant stock level adjustments.
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
            <div className="flex flex-col items-center justify-center p-14 text-center">
              <Loader2 className="size-8 animate-spin text-emerald-600 mb-3" />
              <p className="text-sm font-bold text-gray-700 dark:text-slate-300">
                Loading warehouse inventory from database...
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-14 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-slate-800 text-gray-400 mb-3">
                <Boxes className="size-7" />
              </div>
              <h3 className="text-base font-extrabold text-gray-900 dark:text-white">
                No Inventory Records Found
              </h3>
              <p className="mt-1 text-xs text-gray-500 max-w-md">
                {products.length === 0
                  ? "Your inventory database currently has no records. Click the button below to seed default manufacturing materials and PCB products."
                  : "No inventory items match your current search and filter settings. Try clearing your filters."}
              </p>
              <div className="mt-4 flex gap-2">
                {products.length === 0 ? (
                  <Button
                    size="sm"
                    onClick={handleSeedInventory}
                    disabled={isSeeding}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs gap-1.5 cursor-pointer"
                  >
                    {isSeeding ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
                    <span>Seed Default Inventory Now</span>
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearch("");
                        setStockFilter("ALL");
                        setCategoryFilter("ALL");
                      }}
                      className="cursor-pointer"
                    >
                      Reset Filters
                    </Button>
                    <Button size="sm" onClick={loadInventory} className="bg-emerald-600 text-white cursor-pointer">
                      Refresh
                    </Button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
              <Table className="min-w-[1260px] w-full border-collapse">
                <TableHeader>
                  <TableRow className="border-b border-gray-200 bg-gray-50/80 dark:border-slate-800 dark:bg-slate-900/80 text-xs">
                    {/* Product & SKU */}
                    <TableHead className="w-[320px] min-w-[320px] font-extrabold text-slate-700 dark:text-slate-300 pl-4">
                      <div className="flex items-center gap-1.5">
                        <Package className="size-3 text-emerald-600" />
                        <span>Product & Material SKU</span>
                      </div>
                    </TableHead>

                    {/* Category */}
                    <TableHead className="w-[180px] min-w-[180px] font-extrabold text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Layers className="size-3 text-emerald-600" />
                        <span>Category</span>
                      </div>
                    </TableHead>

                    {/* Unit Price */}
                    <TableHead className="w-[120px] min-w-[120px] font-extrabold text-slate-700 dark:text-slate-300">
                      <span>Unit Price</span>
                    </TableHead>

                    {/* Stock Level & Quick Adjust */}
                    <TableHead className="w-[230px] min-w-[230px] font-extrabold text-slate-700 dark:text-slate-300">
                      <span>Available Stock</span>
                    </TableHead>

                    {/* Health Status */}
                    <TableHead className="w-[150px] min-w-[150px] font-extrabold text-slate-700 dark:text-slate-300">
                      <span>Stock Status</span>
                    </TableHead>

                    {/* Total Valuation */}
                    <TableHead className="w-[130px] min-w-[130px] font-extrabold text-slate-700 dark:text-slate-300">
                      <span>Valuation</span>
                    </TableHead>

                    {/* Last Updated */}
                    <TableHead className="w-[130px] min-w-[130px] font-extrabold text-slate-700 dark:text-slate-300">
                      <span>Last Updated</span>
                    </TableHead>

                    {/* Sticky Actions */}
                    <TableHead className="w-[140px] min-w-[140px] sticky right-0 bg-gray-50/95 dark:bg-slate-900/95 backdrop-blur-xs z-10 text-right pr-4 font-extrabold text-slate-700 dark:text-slate-300 shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.06)] dark:shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.4)]">
                      <span>Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredProducts.map((product) => {
                    const stock = product.stock || 0;
                    const price = Number(product.price) || 0;
                    const valuation = stock * price;
                    const imageSrc =
                      product.images && product.images.length > 0
                        ? product.images[0]
                        : "/pcbimage/10005.jpg";

                    const isOutOfStock = stock === 0;
                    const isLowStock = stock > 0 && stock <= 50;
                    const isHealthy = stock > 50;

                    return (
                      <TableRow
                        key={product.id}
                        className="group border-b border-gray-100 hover:bg-slate-50/60 dark:border-slate-800/60 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        {/* 1. Product Thumbnail & Name */}
                        <TableCell className="w-[320px] min-w-[320px] align-middle py-3.5 pl-4">
                          <div className="flex items-center gap-3">
                            <div className="relative size-12 shrink-0 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
                              <Image
                                src={imageSrc}
                                alt={product.name}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  // Fallback to placeholder if image fails
                                  (e.target as HTMLElement).style.display = "none";
                                }}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-gray-900 dark:text-white text-xs truncate" title={product.name}>
                                {product.name}
                              </div>
                              <div className="text-[10px] text-gray-400 font-mono truncate mt-0.5" title={product.slug}>
                                SKU: {product.slug}
                              </div>
                              <div className="text-[10px] text-gray-400 font-mono truncate">
                                ID: {product.id.slice(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* 2. Category */}
                        <TableCell className="w-[180px] min-w-[180px] align-middle py-3.5">
                          <Badge
                            variant="outline"
                            className="text-[11px] font-bold rounded-lg bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5"
                          >
                            {product.category || "Uncategorized"}
                          </Badge>
                        </TableCell>

                        {/* 3. Unit Price */}
                        <TableCell className="w-[120px] min-w-[120px] align-middle py-3.5 whitespace-nowrap">
                          <div className="font-mono text-xs font-black text-slate-900 dark:text-white">
                            ${price.toFixed(2)}
                          </div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase">USD / unit</div>
                        </TableCell>

                        {/* 4. Available Stock & Quick Buttons */}
                        <TableCell className="w-[230px] min-w-[230px] align-middle py-3.5">
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-mono font-black text-gray-900 dark:text-white text-sm">
                                {stock.toLocaleString()}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleQuickAdjust(product, -10)}
                                  disabled={stock <= 0}
                                  title="Reduce stock by 10"
                                  className="size-5 rounded-md border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                                >
                                  <Minus className="size-2.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleQuickAdjust(product, 10)}
                                  title="Increase stock by 10"
                                  className="size-5 rounded-md border border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
                                >
                                  <Plus className="size-2.5" />
                                </button>
                              </div>
                            </div>

                            {/* Progress bar */}
                            <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full transition-all duration-300",
                                  isHealthy ? "bg-emerald-500" : isLowStock ? "bg-amber-500" : "bg-rose-500"
                                )}
                                style={{ width: `${Math.min(100, Math.max(5, (stock / 200) * 100))}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>

                        {/* 5. Stock Status Badge */}
                        <TableCell className="w-[150px] min-w-[150px] align-middle py-3.5">
                          {isHealthy ? (
                            <Badge className="bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 text-[11px] font-bold gap-1 rounded-full px-2.5 py-0.5">
                              <span className="size-1.5 rounded-full bg-emerald-500" />
                              <span>In Stock</span>
                            </Badge>
                          ) : isLowStock ? (
                            <Badge className="bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 text-[11px] font-bold gap-1 rounded-full px-2.5 py-0.5">
                              <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
                              <span>Low Stock</span>
                            </Badge>
                          ) : (
                            <Badge className="bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800 text-[11px] font-bold gap-1 rounded-full px-2.5 py-0.5">
                              <span className="size-1.5 rounded-full bg-rose-500" />
                              <span>Out of Stock</span>
                            </Badge>
                          )}
                        </TableCell>

                        {/* 6. Valuation */}
                        <TableCell className="w-[130px] min-w-[130px] align-middle py-3.5 whitespace-nowrap">
                          <div className="font-mono text-xs font-bold text-gray-800 dark:text-slate-200">
                            ${valuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase">Reserve Value</div>
                        </TableCell>

                        {/* 7. Last Updated */}
                        <TableCell className="w-[130px] min-w-[130px] align-middle py-3.5 whitespace-nowrap">
                          <div className="text-xs font-bold text-gray-800 dark:text-slate-200">
                            {new Date(product.updatedAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                          <div className="text-[10px] text-gray-400">
                            {new Date(product.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </TableCell>

                        {/* 8. Sticky Action */}
                        <TableCell className="w-[140px] min-w-[140px] sticky right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs z-10 text-right pr-4 align-middle py-3.5 whitespace-nowrap shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.06)] dark:shadow-[-8px_0_12px_-4px_rgba(0,0,0,0.4)] group-hover:bg-slate-50/95 dark:group-hover:bg-slate-800/95 transition-colors">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEdit(product)}
                            className="h-8 text-xs font-bold text-emerald-700 bg-emerald-50/60 hover:bg-emerald-600 hover:text-white dark:text-emerald-400 dark:bg-emerald-950/40 dark:hover:bg-emerald-600 dark:hover:text-white gap-1.5 rounded-xl border-emerald-300 dark:border-emerald-800 shadow-2xs transition-all cursor-pointer"
                          >
                            <Edit className="size-3.5" />
                            <span>Adjust Stock</span>
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
      </Card>

      {/* ========================================================================= */}
      {/* 5. Stock Level Adjustment Dialog                                          */}
      {/* ========================================================================= */}
      <Dialog open={Boolean(editingProduct)} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl border-gray-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Boxes className="size-5 text-emerald-600" />
              <span>Adjust Inventory Stock</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500 dark:text-slate-400">
              Update physical warehouse quantity and sales status for this item.
            </DialogDescription>
          </DialogHeader>

          {editingProduct && (
            <div className="space-y-4 py-2">
              <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="text-xs font-black text-gray-900 dark:text-white">
                  {editingProduct.name}
                </div>
                <div className="text-[11px] text-gray-500 font-mono">
                  SKU: {editingProduct.slug} • Category: {editingProduct.category}
                </div>
                <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  Unit Price: ${Number(editingProduct.price || 0).toFixed(2)} USD
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stockInput" className="text-xs font-bold text-gray-700 dark:text-slate-300">
                  Physical Stock Quantity (Units)
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setNewStock((prev) => Math.max(0, prev - 10))}
                    className="size-9 rounded-xl border-gray-200 dark:border-slate-800 cursor-pointer"
                  >
                    <Minus className="size-4" />
                  </Button>
                  <Input
                    id="stockInput"
                    type="number"
                    min="0"
                    value={newStock}
                    onChange={(e) => setNewStock(Math.max(0, Number(e.target.value) || 0))}
                    className="text-center font-mono font-black text-base rounded-xl"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setNewStock((prev) => prev + 10)}
                    className="size-9 rounded-xl border-gray-200 dark:border-slate-800 cursor-pointer"
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {[0, 25, 50, 100, 250, 500, 1000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setNewStock(preset)}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold border border-gray-200 dark:border-slate-700 hover:border-emerald-500 hover:text-emerald-600 transition cursor-pointer"
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <div className="space-y-2 pt-2">
                <Label htmlFor="statusSelect" className="text-xs font-bold text-gray-700 dark:text-slate-300">
                  Product Availability Status
                </Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger id="statusSelect" className="w-full text-xs font-bold rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">ACTIVE (Available for Quotes & Catalog)</SelectItem>
                    <SelectItem value="INACTIVE">INACTIVE (Hidden / Deprecated)</SelectItem>
                    <SelectItem value="DRAFT">DRAFT (Internal Review)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setEditingProduct(null)}
              className="rounded-xl text-xs font-bold cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveStock}
              disabled={isUpdatingStock}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 cursor-pointer shadow-xs"
            >
              {isUpdatingStock && <Loader2 className="size-3.5 animate-spin" />}
              <span>Save Changes</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
