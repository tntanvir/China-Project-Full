"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Clock3,
  ImagePlus,
  Layers3,
  Loader2,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  CATALOG_CATEGORIES,
  CATALOG_PRESET_IMAGES,
  DEFAULT_CATALOG_FAMILIES,
  resolveCatalogImageUrl,
  type CatalogSpecItem,
  type ProductFamilyItem,
} from "@/lib/catalog-families";
import { CatalogService } from "@/services/catalog.service";

type FormState = Omit<ProductFamilyItem, "id">;

const emptyForm: FormState = {
  title: "",
  subtitle: "",
  category: CATALOG_CATEGORIES[0],
  badge: "1-32 Layers",
  imageUrl: CATALOG_PRESET_IMAGES[0].url,
  description: "",
  specs: [
    { label: "Layer Count", value: "1-32 Layers" },
    { label: "Min Trace/Space", value: "3/3 mil (0.075mm)" },
    { label: "Min Hole Size", value: "0.15mm" },
    { label: "Surface Finish", value: "ENIG, HASL, OSP" },
  ],
  turnaround: "⚡ 24h Quick Turn",
  bestFor: "Industrial & IoT electronics",
  quoteUrl: "/pcb-quote",
};

export default function AdminCatalogPage() {
  const [items, setItems] = useState<ProductFamilyItem[]>(DEFAULT_CATALOG_FAMILIES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(CATALOG_PRESET_IMAGES[0].url);
  const [filterCategory, setFilterCategory] = useState("ALL");

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await CatalogService.getAdminCatalogFamilies();
      setItems(data);
    } catch {
      toast.error("Could not load catalog items from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    if (!selectedFile) return;
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const openCreateForm = () => {
    setEditingId(null);
    setSelectedFile(null);
    setForm(emptyForm);
    setPreviewUrl(emptyForm.imageUrl);
    setShowForm(true);
  };

  const openEditForm = (item: ProductFamilyItem) => {
    setEditingId(item.id);
    setSelectedFile(null);
    setForm({
      title: item.title,
      subtitle: item.subtitle,
      category: item.category,
      badge: item.badge,
      imageUrl: item.imageUrl,
      description: item.description,
      specs:
        item.specs.length >= 4
          ? item.specs.slice(0, 4)
          : [...item.specs, ...emptyForm.specs].slice(0, 4),
      turnaround: item.turnaround,
      bestFor: item.bestFor,
      quoteUrl: item.quoteUrl || "/pcb-quote",
    });
    setPreviewUrl(resolveCatalogImageUrl(item.imageUrl));
    setShowForm(true);
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WebP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10MB.");
      return;
    }
    setSelectedFile(file);
  };

  const updateSpec = (index: number, field: keyof CatalogSpecItem, value: string) => {
    setForm((prev) => {
      const nextSpecs = [...prev.specs];
      nextSpecs[index] = { ...nextSpecs[index], [field]: value };
      return { ...prev, specs: nextSpecs };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and description are required.");
      return;
    }

    try {
      setSaving(true);
      if (editingId) {
        const updated = await CatalogService.updateCatalogFamily(editingId, form, selectedFile);
        setItems((prev) => prev.map((it) => (it.id === editingId ? updated : it)));
        toast.success("Catalog product updated and live on homepage!");
      } else {
        const created = await CatalogService.createCatalogFamily(form, selectedFile);
        setItems((prev) => [created, ...prev]);
        toast.success("New product added to Manufacturing Catalog!");
      }
      setShowForm(false);
      setEditingId(null);
      setSelectedFile(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save catalog item.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: ProductFamilyItem) => {
    try {
      await CatalogService.deleteCatalogFamily(item.id);
      setItems((prev) => prev.filter((it) => it.id !== item.id));
      toast.success(`Removed "${item.title}" from catalog.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete catalog item.");
    }
  };

  const handleReset = async () => {
    try {
      setSaving(true);
      const restored = await CatalogService.resetCatalogFamilies();
      setItems(restored);
      toast.success("Restored default 10 Manufacturing Catalog items.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to reset catalog.");
    } finally {
      setSaving(false);
    }
  };

  const visibleItems =
    filterCategory === "ALL" ? items : items.filter((item) => item.category === filterCategory);

  const uniqueCategories = Array.from(new Set([...CATALOG_CATEGORIES, ...items.map((i) => i.category)]));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1220] p-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
            <Layers3 className="size-3.5" />
            <span>Homepage Catalog CMS</span>
          </div>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Core Electronics Manufacturing Catalog
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Post, edit, or remove PCB product family cards displayed in the homepage Manufacturing Catalog.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button type="button" variant="outline" onClick={handleReset} disabled={saving} className="gap-1.5 text-xs font-bold">
            <RotateCcw className="size-3.5" />
            Reset Defaults
          </Button>
          <Button
            type="button"
            onClick={openCreateForm}
            className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold"
          >
            <Plus className="size-4" />
            Post New Product
          </Button>
        </div>
      </div>

      {/* Create / Edit Modal Dialog */}
      <Dialog
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) {
            setEditingId(null);
            setSelectedFile(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1220] p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900 dark:text-white">
              {editingId ? "Edit Catalog Product" : "Post New Catalog Product"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Upload a product image, fill in technical specifications, and publish directly to the homepage catalog.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            {/* Image Upload & Live Preview */}
            <div className="grid gap-4 sm:grid-cols-[200px_1fr] items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-4">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <Image
                  src={previewUrl}
                  alt={form.title || "Product preview"}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>

              <div className="space-y-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-4 py-2 text-xs font-extrabold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition">
                  <ImagePlus className="size-4" />
                  <span>{selectedFile ? `Selected: ${selectedFile.name}` : "Upload Product Image"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleImageFileChange}
                  />
                </label>

                <div className="flex flex-wrap gap-1.5">
                  {CATALOG_PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.url}
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setForm({ ...form, imageUrl: preset.url });
                        setPreviewUrl(preset.url);
                      }}
                      className={`flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[11px] font-semibold transition ${
                        !selectedFile && form.imageUrl === preset.url
                          ? "border-emerald-600 bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-400"
                      }`}
                    >
                      <Image src={preset.url} alt={preset.label} width={18} height={18} className="rounded object-cover" />
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 block">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Product Title *
                </span>
                <Input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., Standard & High-TG Rigid PCB"
                  className="h-10 text-xs font-semibold"
                />
              </label>

              <label className="space-y-1.5 block">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Category *
                </span>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-xs font-semibold"
                >
                  {uniqueCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-1.5 block">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Top Badge *
                </span>
                <Input
                  required
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  placeholder="e.g., 1-32 Layers"
                  className="h-10 text-xs font-semibold"
                />
              </label>

              <label className="space-y-1.5 block">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Turnaround Badge *
                </span>
                <Input
                  required
                  value={form.turnaround}
                  onChange={(e) => setForm({ ...form, turnaround: e.target.value })}
                  placeholder="e.g., ⚡ 24h Quick Turn"
                  className="h-10 text-xs font-semibold"
                />
              </label>
            </div>

            <label className="space-y-1.5 block">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Description *
              </span>
              <textarea
                required
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short technical overview of laminates, capabilities, and tolerances..."
                className="w-full rounded-lg border border-input bg-background p-3 text-xs font-medium outline-none focus:border-emerald-600"
              />
            </label>

            {/* 4 Specification Pairs */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                4 Technical Specification Cells
              </span>
              <div className="grid gap-3 sm:grid-cols-2">
                {form.specs.map((spec, idx) => (
                  <div key={idx} className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 dark:border-slate-800 p-2.5">
                    <Input
                      value={spec.label}
                      onChange={(e) => updateSpec(idx, "label", e.target.value)}
                      placeholder={`Spec ${idx + 1} Label`}
                      className="h-8 text-xs font-bold"
                    />
                    <Input
                      value={spec.value}
                      onChange={(e) => updateSpec(idx, "value", e.target.value)}
                      placeholder={`Spec ${idx + 1} Value`}
                      className="h-8 text-xs font-semibold"
                    />
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className="bg-transparent border-t border-slate-100 dark:border-slate-800 pt-4 mt-2 mx-0 mb-0 px-0 pb-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="text-xs font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold"
              >
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                {editingId ? "Update Product" : "Publish Product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilterCategory("ALL")}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
            filterCategory === "ALL"
              ? "bg-emerald-600 text-white"
              : "bg-white dark:bg-[#0b1220] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
          }`}
        >
          All ({items.length})
        </button>
        {uniqueCategories.map((cat) => {
          const count = items.filter((it) => it.category === cat).length;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
                filterCategory === cat
                  ? "bg-emerald-600 text-white"
                  : "bg-white dark:bg-[#0b1220] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1220] p-12 text-center text-xs text-slate-500">
          Loading catalog items...
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visibleItems.map((item) => {
            const imgSrc = resolveCatalogImageUrl(item.imageUrl);
            const isDynamicUpload = imgSrc.includes("/uploads/") || imgSrc.startsWith("http://");
            return (
              <article
                key={item.id}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1220] shadow-xs"
              >
                <div>
                  <div className="relative aspect-[16/9] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <Image
                      src={imgSrc}
                      alt={item.title}
                      fill
                      unoptimized={isDynamicUpload}
                      sizes="400px"
                      className="object-cover"
                    />
                    <span className="absolute left-3 top-3 rounded-md bg-slate-900/90 px-2.5 py-1 text-[10px] font-black text-white">
                      {item.badge}
                    </span>
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white">
                      <Clock3 className="size-2.5" />
                      {item.turnaround}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      {item.category}
                    </div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{item.description}</p>

                    <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 p-2.5 text-[11px]">
                      {item.specs.slice(0, 4).map((s, idx) => (
                        <div key={idx} className="truncate">
                          <span className="text-[10px] text-slate-400 block">{s.label}</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 p-3 flex items-center justify-end gap-2 bg-slate-50/50 dark:bg-slate-900/40">
                  <Button type="button" size="sm" variant="outline" onClick={() => openEditForm(item)} className="h-8 text-xs font-bold gap-1">
                    <Pencil className="size-3.5" />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(item)}
                    className="h-8 text-xs font-bold text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900/50 dark:hover:bg-rose-950/40 gap-1"
                  >
                    <Trash2 className="size-3.5" />
                    Delete
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
