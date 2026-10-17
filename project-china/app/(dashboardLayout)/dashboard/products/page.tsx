"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  Boxes,
  CheckCircle2,
  ImagePlus,
  Loader2,
  Plus,
  ShieldAlert,
  Sparkles,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ProductService, type IProduct } from "@/services/product.service";
import { useAuthStore } from "@/store/authStore";

type ProductStatus = "DRAFT" | "ACTIVE" | "INACTIVE";

type ProductForm = {
  name: string;
  category: string;
  description: string;
  price: string;
  stock: string;
  minOrderQty: string;
  leadTimeDays: string;
  rating: string;
  status: ProductStatus;
  isFeatured: boolean;
  tags: string;
};

type SpecRow = {
  key: string;
  value: string;
};

const initialForm: ProductForm = {
  name: "",
  category: "PCB Fabrication",
  description: "",
  price: "",
  stock: "",
  minOrderQty: "1",
  leadTimeDays: "5",
  rating: "5",
  status: "ACTIVE",
  isFeatured: false,
  tags: "",
};

const categories = [
  "PCB Fabrication",
  "PCBA",
  "Advanced PCB",
  "Rigid PCB",
  "Flexible PCB",
  "Rigid-Flex PCB",
  "Aluminum PCB",
  "High Frequency PCB",
  "HDI PCB",
  "Engineering Service",
];

function toNumber(value: string, fallback = 0) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function buildSpecifications(rows: SpecRow[]) {
  return rows.reduce<Record<string, string>>((acc, row) => {
    const key = row.key.trim();
    const value = row.value.trim();

    if (key && value) {
      acc[key] = value;
    }

    return acc;
  }, {});
}

function validateProduct(form: ProductForm, images: File[], specs: SpecRow[]) {
  const errors: string[] = [];
  const price = toNumber(form.price);
  const stock = toNumber(form.stock);
  const minOrderQty = toNumber(form.minOrderQty, 1);
  const leadTimeDays = toNumber(form.leadTimeDays, 1);
  const rating = toNumber(form.rating);
  const validSpecs = buildSpecifications(specs);

  if (form.name.trim().length < 3) errors.push("Product name must be at least 3 characters.");
  if (!form.category.trim()) errors.push("Please select a product category.");
  if (form.description.trim().length < 20) errors.push("Description must be at least 20 characters.");
  if (price <= 0) errors.push("Price must be greater than $0.00.");
  if (stock < 0) errors.push("Stock quantity cannot be negative.");
  if (minOrderQty < 1) errors.push("Minimum order quantity must be at least 1.");
  if (leadTimeDays < 0) errors.push("Lead time cannot be negative.");
  if (rating < 0 || rating > 5) errors.push("Rating must be between 0 and 5.");
  if (images.length > 5) errors.push("Maximum 5 product images allowed.");
  if (images.some((file) => file.size > 5 * 1024 * 1024)) errors.push("Each image must be under 5MB.");
  if (Object.keys(validSpecs).length < 2) errors.push("Please provide at least 2 technical specifications.");

  return errors;
}

export default function ProductsDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [form, setForm] = useState<ProductForm>(initialForm);
  const [specs, setSpecs] = useState<SpecRow[]>([
    { key: "layers", value: "1-8" },
    { key: "material", value: "FR-4" },
    { key: "surfaceFinish", value: "ENIG" },
  ]);
  const [images, setImages] = useState<File[]>([]);
  const [createdProducts, setCreatedProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const previews = useMemo(
    () => images.map((file) => ({ name: file.name, url: URL.createObjectURL(file) })),
    [images],
  );

  const updateForm = (key: keyof ProductForm, value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const addSpecRow = () => {
    setSpecs((current) => [...current, { key: "", value: "" }]);
  };

  const updateSpecRow = (index: number, key: keyof SpecRow, value: string) => {
    setSpecs((current) =>
      current.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: value } : row)),
    );
  };

  const removeSpecRow = (index: number) => {
    setSpecs((current) => current.filter((_, rowIndex) => rowIndex !== index));
  };

  const handleCreateProduct = async () => {
    const errors = validateProduct(form, images, specs);

    if (!isAdmin) {
      toast.error("Only Admin and Super Admin can create products.");
      return;
    }

    if (errors.length) {
      toast.error(errors[0]);
      return;
    }

    setLoading(true);
    try {
      const product = await ProductService.createProduct({
        name: form.name.trim(),
        category: form.category,
        description: form.description.trim(),
        price: toNumber(form.price),
        stock: toNumber(form.stock),
        minOrderQty: toNumber(form.minOrderQty, 1),
        leadTimeDays: toNumber(form.leadTimeDays, 1),
        rating: toNumber(form.rating, 5),
        status: form.status,
        isFeatured: form.isFeatured,
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        specifications: buildSpecifications(specs),
        images,
      });

      setCreatedProducts((current) => [product, ...current]);
      setForm(initialForm);
      setImages([]);
      setSpecs([
        { key: "layers", value: "1-8" },
        { key: "material", value: "FR-4" },
        { key: "surfaceFinish", value: "ENIG" },
      ]);
      toast.success("Product created successfully.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Product create failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Boxes className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-black text-foreground">Admin Product Creation</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Admin and Super Admin portal for publishing professional PCB products. Backend routes are role- and permission-protected, with comprehensive client-side validation before submission.
            </p>
          </div>
          <div className="rounded-full border border-border bg-muted px-4 py-2 text-sm font-bold text-muted-foreground">
            Current role: <span className="text-foreground">{user?.role || "Guest"}</span>
          </div>
        </div>
      </section>

      {!isAdmin ? (
        <Card className="border-destructive/30">
          <CardContent className="flex items-start gap-4 p-6">
            <ShieldAlert className="mt-1 h-6 w-6 text-destructive" />
            <div>
              <h2 className="text-xl font-black text-foreground">Access restricted</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Product creation is restricted to Admin and Super Admin accounts. Please log in with an authorized account.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Product Information
            </CardTitle>
            <CardDescription>Enter verified product details for the customer catalog, checkout, and inventory management.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 md:col-span-2">
                <Label>Product Name *</Label>
                <Input
                  value={form.name}
                  onChange={(event) => updateForm("name", event.target.value)}
                  placeholder="Example: 4 Layer HDI PCB Prototype"
                />
              </label>

              <label className="space-y-2">
                <Label>Category *</Label>
                <Select value={form.category} onValueChange={(value) => updateForm("category", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>

              <label className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(value) => updateForm("status", value as ProductStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </label>

              <label className="space-y-2">
                <Label>Price *</Label>
                <Input type="number" min="0" step="0.01" value={form.price} onChange={(event) => updateForm("price", event.target.value)} placeholder="25.00" />
              </label>

              <label className="space-y-2">
                <Label>Stock *</Label>
                <Input type="number" min="0" value={form.stock} onChange={(event) => updateForm("stock", event.target.value)} placeholder="100" />
              </label>

              <label className="space-y-2">
                <Label>Minimum Order Quantity</Label>
                <Input type="number" min="1" value={form.minOrderQty} onChange={(event) => updateForm("minOrderQty", event.target.value)} />
              </label>

              <label className="space-y-2">
                <Label>Lead Time Days</Label>
                <Input type="number" min="0" value={form.leadTimeDays} onChange={(event) => updateForm("leadTimeDays", event.target.value)} />
              </label>

              <label className="space-y-2">
                <Label>Rating</Label>
                <Input type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(event) => updateForm("rating", event.target.value)} />
              </label>

              <label className="space-y-2">
                <Label>Tags</Label>
                <Input value={form.tags} onChange={(event) => updateForm("tags", event.target.value)} placeholder="prototype, hdi, fast-turn" />
              </label>

              <label className="space-y-2 md:col-span-2">
                <Label>Description *</Label>
                <Textarea
                  value={form.description}
                  onChange={(event) => updateForm("description", event.target.value)}
                  placeholder="Write a professional customer-facing product description..."
                  rows={5}
                />
              </label>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4">
              <div>
                <Label>Featured Product</Label>
                <p className="mt-1 text-xs text-muted-foreground">Enable to feature this product on homepage showcases and recommended sections.</p>
              </div>
              <Switch checked={form.isFeatured} onCheckedChange={(checked) => updateForm("isFeatured", checked)} />
            </div>

            <div className="space-y-3 rounded-lg border border-border p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Label>Technical Specifications *</Label>
                  <p className="mt-1 text-xs text-muted-foreground">Specify layer count, base material, thickness, copper weight, surface finish, etc.</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addSpecRow}>
                  <Plus className="h-4 w-4" />
                  Add Spec
                </Button>
              </div>

              <div className="space-y-3">
                {specs.map((row, index) => (
                  <div key={`${row.key}-${index}`} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                    <Input value={row.key} onChange={(event) => updateSpecRow(index, "key", event.target.value)} placeholder="layers" />
                    <Input value={row.value} onChange={(event) => updateSpecRow(index, "value", event.target.value)} placeholder="4-16" />
                    <Button type="button" variant="outline" size="icon" onClick={() => removeSpecRow(index)} disabled={specs.length <= 2}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-dashed border-border p-4">
              <Label className="flex items-center gap-2">
                <ImagePlus className="h-4 w-4" />
                Product Images
              </Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(event) => setImages(Array.from(event.target.files || []).slice(0, 5))}
              />
              <p className="text-xs text-muted-foreground">Maximum 5 images, each under 5MB. Cloudinary cloud storage supported.</p>
            </div>

            <Button onClick={handleCreateProduct} disabled={loading || !isAdmin} className="h-12 w-full rounded-full text-base font-black">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
              Create Professional Product
            </Button>
          </CardContent>
        </Card>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Preview</CardTitle>
              <CardDescription>Live preview of how this product will appear in the customer catalog.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border border-border bg-background">
                <div className="relative aspect-[4/3] bg-muted">
                  {previews[0] ? (
                    <Image src={previews[0].url} alt={previews[0].name} fill sizes="(max-width: 1280px) 100vw, 380px" className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <ImagePlus className="h-12 w-12" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">{form.category}</p>
                  <h3 className="mt-2 line-clamp-2 text-lg font-black text-foreground">{form.name || "Product name preview"}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                    {form.description || "Professional product description preview will appear here."}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <strong className="text-2xl text-foreground">${toNumber(form.price).toFixed(2)}</strong>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{form.status}</span>
                  </div>
                </div>
              </div>

              {previews.length > 1 ? (
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {previews.slice(0, 4).map((preview) => (
                    <div key={preview.url} className="relative aspect-square overflow-hidden rounded-md bg-muted">
                      <Image src={preview.url} alt={preview.name} fill sizes="95px" className="object-cover" />
                    </div>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                Recently Created
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {createdProducts.length ? (
                createdProducts.map((product) => (
                  <div key={product.id} className="rounded-lg border border-border p-3">
                    <p className="font-bold text-foreground">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.category} • ${Number(product.price || 0).toFixed(2)}</p>
                  </div>
                ))
              ) : (
                <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                  Newly created products and server responses will appear here.
                </p>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
