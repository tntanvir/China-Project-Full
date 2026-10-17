"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  Boxes,
  CreditCard,
  FileArchive,
  Headphones,
  Loader2,
  MessageCircle,
  PackageCheck,
  Plus,
  RefreshCcw,
  ShieldCheck,
  ShoppingCart,
  Trash2,
  UploadCloud,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { AuthService } from "@/services/auth.service";
import { CartService } from "@/services/cart.service";
import { ChatService } from "@/services/chat.service";
import { GerberService } from "@/services/gerber.service";
import { NotificationService } from "@/services/notification.service";
import { OrderService } from "@/services/order.service";
import { PaymentService } from "@/services/payment.service";
import { ProductService } from "@/services/product.service";
import { QuoteService } from "@/services/quote.service";
import { RbacService } from "@/services/rbac.service";
import { SupportService } from "@/services/support.service";

type FeatureKey =
  | "products"
  | "cart"
  | "quotes"
  | "gerber"
  | "orders"
  | "payments"
  | "support"
  | "chat"
  | "notifications"
  | "rbac"
  | "profile"
  | "security"
  | "settings"
  | "realtime";

const featureMeta: Record<FeatureKey, { title: string; description: string; icon: typeof Boxes }> = {
  products: { title: "Product Management", description: "Create, update, delete, and manage PCB products.", icon: Boxes },
  cart: { title: "Cart Workflow", description: "Customer add-to-cart, cart update, and checkout preparation.", icon: ShoppingCart },
  quotes: { title: "PCB Quote Center", description: "Instant quotes, quote list, quote details, and convert-to-order.", icon: FileArchive },
  gerber: { title: "Gerber Review Center", description: "Upload Gerber/BOM/Pick & Place and approve/reject files.", icon: UploadCloud },
  orders: { title: "Order Tracking", description: "Order list, detail, cancel, and production status updates.", icon: PackageCheck },
  payments: { title: "Payments", description: "Stripe, PayPal, receipts, transactions, and payment history.", icon: CreditCard },
  support: { title: "Support Tickets", description: "Create, reply, close, and manage support tickets.", icon: Headphones },
  chat: { title: "Live Chat", description: "Rooms, messages, seen status, and realtime support chat.", icon: MessageCircle },
  notifications: { title: "Notifications", description: "User notifications, read states, and admin broadcast.", icon: Bell },
  rbac: { title: "RBAC & Admins", description: "Roles, permissions, admins, suspend/activate, and role assignment.", icon: ShieldCheck },
  profile: { title: "My Profile", description: "Profile view and account information update.", icon: UserRound },
  security: { title: "Password & Security", description: "Change password and account security actions.", icon: ShieldCheck },
  settings: { title: "Account Settings", description: "Operational settings placeholder for system configuration.", icon: ShieldCheck },
  realtime: { title: "Realtime Console", description: "Live socket events for notifications, orders, tickets, and chat.", icon: Bell },
};

const sampleQuote = {
  name: "4 Layer PCB",
  width: 100,
  height: 80,
  quantity: 20,
  layerCount: 4,
  materialType: "FR-4",
  boardThickness: 1.6,
  copperWeight: 1,
  surfaceFinish: "ENIG",
  solderMaskColor: "Green",
  silkscreenColor: "White",
};

function compact(value: unknown) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "object" && "data" in value) return compact((value as { data: unknown }).data);
  return [value];
}

function PreviewTable({ rows }: { rows: unknown[] }) {
  const visibleRows = rows.slice(0, 8);

  if (!rows.length) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        No data loaded yet. Run an API action to preview live backend response.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name / Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visibleRows.map((row, index) => {
            const item = row as Record<string, unknown>;
            return (
              <TableRow key={String(item.id || index)}>
                <TableCell className="max-w-[180px] truncate font-mono text-xs">{String(item.id || item.slug || "N/A")}</TableCell>
                <TableCell className="font-semibold">{String(item.name || item.title || item.subject || item.email || item.fileName || "Record")}</TableCell>
                <TableCell>{String(item.status || item.role || item.paymentStatus || "READY")}</TableCell>
                <TableCell>{item.createdAt ? new Date(String(item.createdAt)).toLocaleDateString() : "N/A"}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default function ApiFeaturePage({ feature }: { feature: FeatureKey }) {
  const meta = featureMeta[feature];
  const Icon = meta.icon;
  const [result, setResult] = useState<unknown[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [primaryId, setPrimaryId] = useState("");
  const [secondaryId, setSecondaryId] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const filteredRows = useMemo(() => {
    if (!search) return result;
    return result.filter((row) => JSON.stringify(row).toLowerCase().includes(search.toLowerCase()));
  }, [result, search]);

  const run = async (label: string, action: () => Promise<unknown>) => {
    setLoading(label);
    try {
      const response = await action();
      setResult(compact(response));
      toast.success(`${label} successful`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `${label} failed`);
    } finally {
      setLoading(null);
    }
  };

  const commonIdControls = (
    <div className="grid gap-4 md:grid-cols-3">
      <label className="space-y-2">
        <Label>Primary ID</Label>
        <Input value={primaryId} onChange={(event) => setPrimaryId(event.target.value)} placeholder="Order, quote, product, room, role ID" />
      </label>
      <label className="space-y-2">
        <Label>Secondary ID</Label>
        <Input value={secondaryId} onChange={(event) => setSecondaryId(event.target.value)} placeholder="User, payment, cart item, admin ID" />
      </label>
      <label className="space-y-2">
        <Label>Search loaded data</Label>
        <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search table results" />
      </label>
    </div>
  );

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
          <Button variant="outline" onClick={() => setResult([])}>
            <RefreshCcw className="h-4 w-4" />
            Clear Results
          </Button>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>API Controls</CardTitle>
          <CardDescription>All actions handle loading, success toast, error toast, and live response preview.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {commonIdControls}

          {feature === "products" ? (
            <div className="grid gap-3 md:grid-cols-4">
              <Button onClick={() => run("Create product", () => ProductService.createProduct({ name: "Premium HDI PCB", category: "hdi", description: "High density PCB", price: 25, stock: 100, status: "ACTIVE", images: files }))}>
                <Plus className="h-4 w-4" /> Create
              </Button>
              <Button variant="outline" onClick={() => run("Update product", () => ProductService.updateProduct(primaryId, { name: "Updated PCB", price: 32 }))} disabled={!primaryId}>Update</Button>
              <Button variant="destructive" onClick={() => run("Delete product", () => ProductService.deleteProduct(primaryId))} disabled={!primaryId}><Trash2 className="h-4 w-4" /> Delete</Button>
              <Input type="file" multiple onChange={(event) => setFiles(Array.from(event.target.files || []))} />
            </div>
          ) : null}

          {feature === "cart" ? (
            <div className="grid gap-3 md:grid-cols-4">
              <Button onClick={() => run("Load cart", () => CartService.getMyCart())}>Load Cart</Button>
              <Button onClick={() => run("Add to cart", () => CartService.addToCart({ productId: primaryId, quantity: 1 }))} disabled={!primaryId}>Add Product</Button>
              <Button onClick={() => run("Update cart", () => CartService.updateCartItem(primaryId, 2))} disabled={!primaryId}>Update Qty</Button>
              <Button variant="destructive" onClick={() => run("Remove cart item", () => CartService.removeCartItem(primaryId))} disabled={!primaryId}>Remove</Button>
            </div>
          ) : null}

          {feature === "quotes" ? (
            <div className="grid gap-3 md:grid-cols-5">
              <Button onClick={() => run("Create quote", () => QuoteService.createQuote(sampleQuote))}>Create Quote</Button>
              <Button variant="outline" onClick={() => run("My quotes", () => QuoteService.getMyQuotes())}>My Quotes</Button>
              <Button variant="outline" onClick={() => run("All quotes", () => QuoteService.getAllQuotes())}>All Quotes</Button>
              <Button variant="outline" onClick={() => run("Quote detail", () => QuoteService.getQuoteById(primaryId))} disabled={!primaryId}>Detail</Button>
              <Button onClick={() => run("Convert quote", () => QuoteService.convertToOrder(primaryId, { shippingAddress: "Default delivery address" }))} disabled={!primaryId}>Convert</Button>
            </div>
          ) : null}

          {feature === "gerber" ? (
            <div className="grid gap-3 md:grid-cols-6">
              <Input type="file" multiple onChange={(event) => setFiles(Array.from(event.target.files || []))} />
              <Button onClick={() => run("Upload files", () => GerberService.uploadFiles(files, primaryId || undefined))} disabled={!files.length}>Upload</Button>
              <Button variant="outline" onClick={() => run("My files", () => GerberService.getMyFiles())}>My Files</Button>
              <Button variant="outline" onClick={() => run("All files", () => GerberService.getAllFiles())}>All Files</Button>
              <Button variant="outline" onClick={() => run("Approve file", () => GerberService.reviewFile(primaryId, { status: "APPROVED", message: "Approved for production" }))} disabled={!primaryId}>Approve</Button>
              <Button variant="destructive" onClick={() => run("Delete file", () => GerberService.deleteFile(primaryId))} disabled={!primaryId}>Delete</Button>
            </div>
          ) : null}

          {feature === "orders" ? (
            <div className="grid gap-3 md:grid-cols-5">
              <Button onClick={() => run("Create order", () => OrderService.createOrderFromCart({ shippingAddress: "Default shipping address" }))}>Create From Cart</Button>
              <Button variant="outline" onClick={() => run("Load orders", () => OrderService.getMyOrders())}>My Orders</Button>
              <Button variant="outline" onClick={() => run("Order detail", () => OrderService.getOrderById(primaryId))} disabled={!primaryId}>Detail</Button>
              <Button onClick={() => run("Update status", () => OrderService.updateStatus(primaryId, { status: "PRODUCTION", note: "Moved to production" }))} disabled={!primaryId}>Move Production</Button>
              <Button variant="destructive" onClick={() => run("Cancel order", () => OrderService.cancelOrder(primaryId))} disabled={!primaryId}>Cancel</Button>
            </div>
          ) : null}

          {feature === "payments" ? (
            <div className="grid gap-3 md:grid-cols-5">
              <Button onClick={() => run("Stripe checkout", () => PaymentService.createStripeCheckout(primaryId))} disabled={!primaryId}>Stripe</Button>
              <Button onClick={() => run("PayPal checkout", () => PaymentService.createPayPalOrder(primaryId))} disabled={!primaryId}>PayPal</Button>
              <Button variant="outline" onClick={() => run("Capture PayPal", () => PaymentService.capturePayPalOrder(primaryId))} disabled={!primaryId}>Capture</Button>
              <Button variant="outline" onClick={() => run("Payment history", () => PaymentService.getPaymentHistory())}>History</Button>
              <Button variant="outline" onClick={() => run("Receipt", () => PaymentService.getReceipt(primaryId))} disabled={!primaryId}>Receipt</Button>
            </div>
          ) : null}

          {feature === "support" ? (
            <div className="grid gap-3 md:grid-cols-6">
              <Button onClick={() => run("Create ticket", () => SupportService.createTicket({ subject: "PCB support request", message: "Need support for PCB order." }))}>Create</Button>
              <Button variant="outline" onClick={() => run("My tickets", () => SupportService.getMyTickets())}>My Tickets</Button>
              <Button variant="outline" onClick={() => run("All tickets", () => SupportService.getAllTickets())}>All Tickets</Button>
              <Button variant="outline" onClick={() => run("Ticket detail", () => SupportService.getTicketById(primaryId))} disabled={!primaryId}>Detail</Button>
              <Button onClick={() => run("Reply ticket", () => SupportService.replyTicket(primaryId, "Professional support reply."))} disabled={!primaryId}>Reply</Button>
              <Button variant="destructive" onClick={() => run("Close ticket", () => SupportService.closeTicket(primaryId))} disabled={!primaryId}>Close</Button>
            </div>
          ) : null}

          {feature === "chat" || feature === "realtime" ? (
            <div className="grid gap-3 md:grid-cols-5">
              <Button onClick={() => run("Create chat room", () => ChatService.createRoom({ subject: "Live support" }))}>Create Room</Button>
              <Button variant="outline" onClick={() => run("My rooms", () => ChatService.getMyRooms())}>Rooms</Button>
              <Button variant="outline" onClick={() => run("Room detail", () => ChatService.getRoomById(primaryId))} disabled={!primaryId}>Detail</Button>
              <Button onClick={() => run("Send message", () => ChatService.sendMessage(primaryId, { message: "Hello from dashboard" }))} disabled={!primaryId}>Send</Button>
              <Button variant="outline" onClick={() => run("Seen", () => ChatService.markSeen(primaryId))} disabled={!primaryId}>Seen</Button>
            </div>
          ) : null}

          {feature === "notifications" ? (
            <div className="grid gap-3 md:grid-cols-4">
              <Button onClick={() => run("Load notifications", () => NotificationService.getMyNotifications())}>Load</Button>
              <Button variant="outline" onClick={() => run("Mark read", () => NotificationService.markAsRead(primaryId))} disabled={!primaryId}>Mark Read</Button>
              <Button variant="outline" onClick={() => run("Mark all read", () => NotificationService.markAllAsRead())}>Read All</Button>
              <Button onClick={() => run("Broadcast", () => NotificationService.broadcast({ userIds: secondaryId.split(",").map((id) => id.trim()).filter(Boolean), title: "Platform update", message: "New notification from dashboard" }))} disabled={!secondaryId}>Broadcast</Button>
            </div>
          ) : null}

          {feature === "rbac" ? (
            <div className="grid gap-3 md:grid-cols-5">
              <Button onClick={() => run("Permissions", () => RbacService.getPermissions())}>Permissions</Button>
              <Button variant="outline" onClick={() => run("Roles", () => RbacService.getRoles())}>Roles</Button>
              <Button onClick={() => run("Create role", () => RbacService.createRole({ name: "Production Manager", slug: `production-manager-${Date.now()}`, description: "Production role", permissions: ["order:update_status"] }))}>Create Role</Button>
              <Button onClick={() => run("Admins", () => RbacService.getAdmins())}>Admins</Button>
              <Button onClick={() => run("Suspend admin", () => RbacService.suspendAdmin(primaryId))} disabled={!primaryId}>Suspend</Button>
            </div>
          ) : null}

          {feature === "profile" ? (
            <div className="grid gap-3 md:grid-cols-3">
              <Input id="profile-name" placeholder="Full name" />
              <Input id="profile-company" placeholder="Company name" />
              <Button onClick={() => run("Update profile", () => AuthService.updateProfile({ name: (document.getElementById("profile-name") as HTMLInputElement)?.value, companyName: (document.getElementById("profile-company") as HTMLInputElement)?.value }))}>Update Profile</Button>
            </div>
          ) : null}

          {feature === "security" ? (
            <div className="grid gap-3 md:grid-cols-3">
              <Input id="old-password" type="password" placeholder="Old password" />
              <Input id="new-password" type="password" placeholder="New password" />
              <Button onClick={() => run("Change password", () => AuthService.changePassword({ oldPassword: (document.getElementById("old-password") as HTMLInputElement)?.value, newPassword: (document.getElementById("new-password") as HTMLInputElement)?.value }))}>Change Password</Button>
            </div>
          ) : null}

          {feature === "settings" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Textarea placeholder="System settings APIs are planned for the backend. This page is ready for branding, SMTP, security, and payment gateway controls." />
              <Select defaultValue="production">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">Production Ready</SelectItem>
                  <SelectItem value="maintenance">Maintenance Mode</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : null}

          {loading ? (
            <div className="flex items-center gap-2 rounded-lg border border-border bg-muted p-3 text-sm font-semibold text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              {loading} running...
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Live Data Table</CardTitle>
          <CardDescription>Search, preview, empty state, and backend response data.</CardDescription>
        </CardHeader>
        <CardContent>
          <PreviewTable rows={filteredRows} />
        </CardContent>
      </Card>
    </div>
  );
}
