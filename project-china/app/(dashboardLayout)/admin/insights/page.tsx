"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  BookOpen,
  Clock3,
  ImagePlus,
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
  DEFAULT_ENGINEERING_GUIDES,
  GUIDE_PRESET_IMAGES,
  GUIDE_TAGS,
  resolveGuideImageUrl,
  type EngineeringGuideItem,
} from "@/lib/engineering-guides";
import { GuidesService } from "@/services/guides.service";

type FormState = Omit<EngineeringGuideItem, "id">;

const emptyForm: FormState = {
  title: "",
  description: "",
  content: "",
  tag: GUIDE_TAGS[0],
  readTime: "4 min read",
  imageUrl: GUIDE_PRESET_IMAGES[0].url,
  author: "Feitian CAM Engineering Desk",
};

export default function AdminEngineeringInsightsPage() {
  const [items, setItems] = useState<EngineeringGuideItem[]>(DEFAULT_ENGINEERING_GUIDES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(GUIDE_PRESET_IMAGES[0].url);

  useEffect(() => {
    let active = true;
    GuidesService.getAdminGuides()
      .then((data) => {
        if (active) setItems(data);
      })
      .catch(() => {
        toast.error("Could not load engineering guides.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedFile) return;
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const openCreateModal = () => {
    setEditingId(null);
    setSelectedFile(null);
    setForm(emptyForm);
    setPreviewUrl(emptyForm.imageUrl);
    setShowModal(true);
  };

  const openEditModal = (item: EngineeringGuideItem) => {
    setEditingId(item.id);
    setSelectedFile(null);
    setForm({
      title: item.title,
      description: item.description,
      content: item.content,
      tag: item.tag,
      readTime: item.readTime,
      imageUrl: item.imageUrl,
      author: item.author,
    });
    setPreviewUrl(resolveGuideImageUrl(item.imageUrl));
    setShowModal(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (PNG, JPG, WebP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10MB.");
      return;
    }
    setSelectedFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and short summary are required.");
      return;
    }

    try {
      setSaving(true);
      if (editingId) {
        const updated = await GuidesService.updateGuide(editingId, form, selectedFile);
        setItems((prev) => prev.map((it) => (it.id === editingId ? updated : it)));
        toast.success("Engineering guide updated and live on homepage!");
      } else {
        const created = await GuidesService.createGuide(form, selectedFile);
        setItems((prev) => [created, ...prev]);
        toast.success("New engineering guide published!");
      }
      setShowModal(false);
      setEditingId(null);
      setSelectedFile(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save guide.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: EngineeringGuideItem) => {
    try {
      await GuidesService.deleteGuide(item.id);
      setItems((prev) => prev.filter((it) => it.id !== item.id));
      toast.success(`Deleted "${item.title}".`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete guide.");
    }
  };

  const handleReset = async () => {
    try {
      setSaving(true);
      const restored = await GuidesService.resetGuides();
      setItems(restored);
      toast.success("Restored default Engineering Insights & Design Guides.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to reset guides.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1220] p-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
            <BookOpen className="size-3.5" />
            <span>Homepage Knowledge Base CMS</span>
          </div>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            PCB Engineering Insights & Design Guides
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Publish and manage technical CAM guides and PCB design tips displayed on the homepage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button type="button" variant="outline" onClick={handleReset} disabled={saving} className="gap-1.5 text-xs font-bold">
            <RotateCcw className="size-3.5" />
            Reset Defaults
          </Button>
          <Button
            type="button"
            onClick={openCreateModal}
            className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold"
          >
            <Plus className="size-4" />
            New Guide
          </Button>
        </div>
      </div>

      {/* Create / Edit Modal */}
      <Dialog
        open={showModal}
        onOpenChange={(open) => {
          setShowModal(open);
          if (!open) {
            setEditingId(null);
            setSelectedFile(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1220] p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900 dark:text-white">
              {editingId ? "Edit Engineering Guide" : "Publish New Engineering Guide"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Upload a cover image and write technical guidance for PCB design & manufacturability.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {/* Image Upload */}
            <div className="grid gap-4 sm:grid-cols-[180px_1fr] items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-3.5">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <Image
                  src={previewUrl}
                  alt={form.title || "Guide preview"}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>

              <div className="space-y-2.5">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3.5 py-2 text-xs font-extrabold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition">
                  <ImagePlus className="size-4" />
                  <span>{selectedFile ? `Selected: ${selectedFile.name}` : "Upload Cover Image"}</span>
                  <input type="file" accept="image/*" className="sr-only" onChange={handleImageChange} />
                </label>

                <div className="flex flex-wrap gap-1.5">
                  {GUIDE_PRESET_IMAGES.map((preset) => (
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
                      <Image src={preset.url} alt={preset.label} width={16} height={16} className="rounded object-cover" />
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 block sm:col-span-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Guide Title *
                </span>
                <Input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., How DFM Analysis Improves Yield"
                  className="h-10 text-xs font-semibold"
                />
              </label>

              <label className="space-y-1.5 block">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Category Tag *
                </span>
                <select
                  value={form.tag}
                  onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-xs font-semibold"
                >
                  {GUIDE_TAGS.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-1.5 block">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  Read Time
                </span>
                <Input
                  value={form.readTime}
                  onChange={(e) => setForm({ ...form, readTime: e.target.value })}
                  placeholder="4 min read"
                  className="h-10 text-xs font-semibold"
                />
              </label>
            </div>

            <label className="space-y-1.5 block">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Card Summary *
              </span>
              <textarea
                required
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="One-sentence summary shown on the homepage card..."
                className="w-full rounded-lg border border-input bg-background p-3 text-xs font-medium outline-none focus:border-emerald-600"
              />
            </label>

            <label className="space-y-1.5 block">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Full Engineering Guide Content
              </span>
              <textarea
                rows={6}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Detailed CAM engineering tips, tolerances, and DFM recommendations shown when users click 'Read Engineering Guide'..."
                className="w-full rounded-lg border border-input bg-background p-3 text-xs font-medium leading-relaxed outline-none focus:border-emerald-600"
              />
            </label>

            <DialogFooter className="bg-transparent border-t border-slate-100 dark:border-slate-800 pt-4 mt-2 mx-0 mb-0 px-0 pb-0">
              <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="text-xs font-bold">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold"
              >
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                {editingId ? "Update Guide" : "Publish Guide"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Guides Grid */}
      {loading ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1220] p-12 text-center text-xs text-slate-500">
          Loading engineering guides...
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const imgSrc = resolveGuideImageUrl(item.imageUrl);
            const isDynamic = imgSrc.includes("/uploads/") || imgSrc.startsWith("http://");
            return (
              <article
                key={item.id}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1220] shadow-xs"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <Image
                      src={imgSrc}
                      alt={item.title}
                      fill
                      unoptimized={isDynamic}
                      sizes="400px"
                      className="object-cover"
                    />
                    <span className="absolute left-3 top-3 rounded-md bg-emerald-600 px-2.5 py-1 text-[10px] font-bold text-white">
                      {item.tag}
                    </span>
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-slate-900/80 px-2 py-0.5 text-[10px] font-bold text-white">
                      <Clock3 className="size-2.5" />
                      {item.readTime}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{item.description}</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 p-3 flex items-center justify-end gap-2 bg-slate-50/50 dark:bg-slate-900/40">
                  <Button type="button" size="sm" variant="outline" onClick={() => openEditModal(item)} className="h-8 text-xs font-bold gap-1">
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
