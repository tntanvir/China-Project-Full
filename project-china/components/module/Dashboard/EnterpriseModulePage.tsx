"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Boxes,
  Building2,
  ClipboardList,
  Database,
  FileText,
  Layers3,
  LockKeyhole,
  Percent,
  Settings,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";

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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { OrderService } from "@/services/order.service";
import { PaymentService, type PaymentRecord } from "@/services/payment.service";
import { type IProduct } from "@/services/product.service";
import { RbacService } from "@/services/rbac.service";
import { apiRequest } from "@/services/api-client";
import { AdminService, type AdminCustomer, type AdminInventoryProduct, type ProductCategoryRecord } from "@/services/admin.service";
import { ReviewService, type ReviewRecord } from "@/services/review.service";

export type ModuleKey =
  | "categories"
  | "brands"
  | "inventory"
  | "customers"
  | "reviews"
  | "coupons"
  | "reports"
  | "settings"
  | "admin-management"
  | "roles-permissions"
  | "system-monitoring"
  | "audit-logs"
  | "security-center"
  | "business-analytics";

const moduleMeta: Record<ModuleKey, { title: string; description: string; icon: typeof Boxes; status: string }> = {
  categories: { title: "Category Management", description: "Create, edit, delete, and manage category visibility.", icon: Layers3, status: "Admin categories API" },
  brands: { title: "Brand Management", description: "Manage brand profiles, logos, and catalog grouping.", icon: Building2, status: "Backend API not available yet" },
  inventory: { title: "Inventory Management", description: "Track stock movement, low stock, and out-of-stock products.", icon: Boxes, status: "Admin inventory API" },
  customers: { title: "Customer Management", description: "View profiles, order history, activity, and customer status.", icon: Users, status: "Admin customers API" },
  reviews: { title: "Review Management", description: "Approve, reject, moderate, and delete customer reviews.", icon: Star, status: "Review API" },
  coupons: { title: "Coupon & Promotions", description: "Manage coupons, flash sales, and promotional campaigns.", icon: Percent, status: "Backend API not available yet" },
  reports: { title: "Reports & Export", description: "Sales, revenue, product, customer, inventory reports with PDF/Excel/CSV export.", icon: FileText, status: "Orders/payments API" },
  settings: { title: "System Settings", description: "Website, currency, tax, shipping, payment, email, SEO settings.", icon: Settings, status: "Super Admin settings API" },
  "admin-management": { title: "Admin Management", description: "Create, edit, suspend, activate, and audit admins.", icon: ShieldCheck, status: "RBAC admins API" },
  "roles-permissions": { title: "Roles & Permissions", description: "Manage RBAC roles and module permissions.", icon: LockKeyhole, status: "RBAC roles API" },
  "system-monitoring": { title: "System Monitoring", description: "API, database, server, queue, app health, and error logs.", icon: Database, status: "Backend API not available yet" },
  "audit-logs": { title: "Audit Logs", description: "Track product, order, admin, customer, and settings changes.", icon: ClipboardList, status: "Backend API not available yet" },
  "security-center": { title: "Security Center", description: "Failed logins, sessions, access logs, suspicious activities.", icon: AlertTriangle, status: "Backend API not available yet" },
  "business-analytics": { title: "Business Analytics", description: "Revenue growth, retention, conversion, top categories and brands.", icon: BarChart3, status: "Products/orders/payments API" },
};

type ModuleRecord = {
  id: string;
  name: string;
  status: string;
  details: string;
};

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function recordName(value: unknown, fallback: string) {
  if (value && typeof value === "object") {
    const item = value as Record<string, unknown>;
    return String(item.name || item.email || item.title || item.slug || fallback);
  }

  return fallback;
}

function recordStatus(value: unknown) {
  if (value && typeof value === "object") {
    const item = value as Record<string, unknown>;
    return String(item.status || item.role || item.isActive || "ACTIVE");
  }

  return "ACTIVE";
}

function recordDetails(value: unknown) {
  if (value && typeof value === "object") {
    const item = value as Record<string, unknown>;
    const amount = typeof item.amount === "number" ? `$${item.amount.toFixed(2)}` : "";
    return String(item.email || item.category || item.method || item.createdAt || amount || "Backend record");
  }

  return "Backend record";
}

export default function EnterpriseModulePage({ moduleKey }: { moduleKey: ModuleKey }) {
  const [search, setSearch] = useState("");
  const [records, setRecords] = useState<ModuleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const meta = moduleMeta[moduleKey];
  const Icon = meta.icon;
  const [selectedRecord, setSelectedRecord] = useState<ModuleRecord | null>(null);

  useEffect(() => {
    let active = true;

    async function loadModuleData() {
      setLoading(true);
      setError("");

      try {
        let nextRecords: ModuleRecord[] = [];

        if (moduleKey === "admin-management") {
          const admins = asArray<unknown>(await RbacService.getAdmins());
          nextRecords = admins.map((item, index) => ({
            id: String((item as Record<string, unknown>)?.id || index),
            name: recordName(item, `Admin ${index + 1}`),
            status: recordStatus(item),
            details: recordDetails(item),
          }));
        }

        if (moduleKey === "roles-permissions") {
          const roles = asArray<unknown>(await RbacService.getRoles());
          nextRecords = roles.map((item, index) => ({
            id: String((item as Record<string, unknown>)?.id || index),
            name: recordName(item, `Role ${index + 1}`),
            status: recordStatus(item),
            details: recordDetails(item),
          }));
        }

        if (moduleKey === "inventory") {
          const products = await AdminService.getInventory();
          nextRecords = asArray<AdminInventoryProduct>(products).map((product) => ({
            id: product.id,
            name: product.name,
            status: product.stock && product.stock > 0 ? "IN_STOCK" : "OUT_OF_STOCK",
            details: `${product.category || "Uncategorized"} | Stock: ${product.stock || 0}`,
          }));
        }

        if (moduleKey === "categories") {
          const categories = await AdminService.getCategories();
          nextRecords = asArray<ProductCategoryRecord>(categories).map((category) => ({
            id: category.id,
            name: category.name,
            status: category.slug,
            details: category.description || `Display order: ${category.order}`,
          }));
        }

        if (moduleKey === "customers") {
          const customers = await AdminService.getCustomers();
          nextRecords = asArray<AdminCustomer>(customers).map((customer) => ({
            id: customer.id,
            name: customer.name || customer.email,
            status: customer.status,
            details: `${customer.email} | Orders: ${customer._count?.orders || 0}`,
          }));
        }

        if (moduleKey === "reviews") {
          const reviews = await ReviewService.getAllReviews();
          nextRecords = asArray<ReviewRecord>(reviews).map((review) => ({
            id: review.id,
            name: review.product?.name || `Product ${review.productId}`,
            status: `${review.rating}/5`,
            details: review.comment || review.user?.email || "Review record",
          }));
        }

        if (moduleKey === "reports" || moduleKey === "business-analytics") {
          const [orders, payments, products] = await Promise.all([
            OrderService.getMyOrders().catch(() => []),
            PaymentService.getTransactions().catch(() => []),
            apiRequest<IProduct[]>("/products").catch(() => []),
          ]);
          const paidRevenue = asArray<PaymentRecord>(payments).reduce((sum, payment) => sum + (payment.status === "PAID" ? payment.amount || 0 : 0), 0);
          nextRecords = [
            { id: "orders", name: "Total Orders", status: String(asArray<unknown>(orders).length), details: "Backend order records" },
            { id: "products", name: "Total Products", status: String(asArray<unknown>(products).length), details: "Backend product records" },
            { id: "payments", name: "Paid Revenue", status: `$${paidRevenue.toFixed(2)}`, details: "Backend paid payment records" },
          ];
        }

        if (active) setRecords(nextRecords);
      } catch (loadError) {
        if (active) {
          setRecords([]);
          setError(loadError instanceof Error ? loadError.message : "Backend data load failed.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadModuleData();
    return () => {
      active = false;
    };
  }, [moduleKey]);

  const rows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return records;

    return records.filter((row) => JSON.stringify(row).toLowerCase().includes(query));
  }, [records, search]);

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-black text-foreground">{meta.title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{meta.description}</p>
          </div>
          <Button className="rounded-full" disabled={!records.length}>
            <Bell className="h-4 w-4" />
            Backend Actions
          </Button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: "Backend Source", value: meta.status },
          { title: "Loaded Records", value: String(records.length) },
          { title: "Module State", value: error ? "Error" : records.length ? "Live" : "Empty" },
        ].map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.value}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Live Backend Interface</CardTitle>
          <CardDescription>No hardcoded rows are rendered. This table only shows data returned by backend APIs.</CardDescription>
        </CardHeader>
        <CardContent>
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search module records..." className="mb-4 max-w-sm" />
          {error ? (
            <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm font-semibold text-destructive">
              {error}
            </div>
          ) : null}
          <div className="overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center text-sm font-bold text-muted-foreground">
                      Loading backend data...
                    </TableCell>
                  </TableRow>
                ) : rows.length ? (
                  rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-bold">{row.name}</TableCell>
                      <TableCell>{row.status}</TableCell>
                      <TableCell>{row.details}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRecord(row)}
                          className="font-bold hover:border-emerald-500 hover:text-emerald-700 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
                        >
                          Open
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="py-12 text-center">
                      <div className="mx-auto max-w-md">
                        <p className="text-sm font-black text-foreground">No backend records available</p>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          {meta.status.includes("not available")
                            ? "This module needs matching backend CRUD APIs before real records can be shown."
                            : "The backend API is connected, but it returned no records for this module."}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Record Inspector Dialog */}
      <Dialog open={Boolean(selectedRecord)} onOpenChange={(open) => !open && setSelectedRecord(null)}>
        <DialogContent className="max-w-lg rounded-2xl p-6">
          {selectedRecord && (
            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle className="text-xl font-black text-gray-900 dark:text-white">
                  {selectedRecord.name}
                </DialogTitle>
                <DialogDescription className="text-xs text-gray-500 dark:text-slate-400">
                  Record ID: <code className="font-mono">{selectedRecord.id}</code>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 rounded-xl border border-gray-100 bg-gray-50/70 p-4 text-xs dark:border-slate-800 dark:bg-slate-900/60">
                <div>
                  <span className="font-bold uppercase tracking-wider text-[10px] text-gray-400">Status</span>
                  <div className="font-black text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">
                    {selectedRecord.status}
                  </div>
                </div>

                <div>
                  <span className="font-bold uppercase tracking-wider text-[10px] text-gray-400">Details</span>
                  <div className="font-medium text-gray-700 dark:text-slate-300 mt-0.5">
                    {selectedRecord.details}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setSelectedRecord(null)}
                  className="rounded-xl font-bold text-xs"
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
