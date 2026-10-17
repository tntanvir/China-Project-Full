"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Boxes,
  CreditCard,
  FileArchive,
  Headphones,
  MessageCircle,
  PackageCheck,
  Radio,
  Send,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ChatService } from "@/services/chat.service";
import { GerberService } from "@/services/gerber.service";
import { NotificationService } from "@/services/notification.service";
import { OrderService } from "@/services/order.service";
import { PaymentService } from "@/services/payment.service";
import { ProductService } from "@/services/product.service";
import { QuoteService, type QuoteInput } from "@/services/quote.service";
import { RealtimeService, type RealtimeEvents } from "@/services/realtime.service";
import { SupportService } from "@/services/support.service";

const orderStatuses = [
  "PENDING",
  "PAID",
  "GERBER_REVIEW",
  "ENGINEERING_REVIEW",
  "PRODUCTION",
  "QUALITY_CONTROL",
  "PACKAGING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

type OrderStatus = (typeof orderStatuses)[number];

const defaultQuote: QuoteInput = {
  name: "4 Layer Industrial PCB",
  width: 100,
  height: 80,
  quantity: 25,
  layerCount: 4,
  materialType: "FR-4 High TG",
  boardThickness: 1.6,
  copperWeight: 1,
  surfaceFinish: "ENIG",
  solderMaskColor: "Green",
  silkscreenColor: "White",
};

function eventSummary(payload: unknown) {
  if (!payload) return "No payload";
  if (typeof payload === "string") return payload;
  try {
    return JSON.stringify(payload).slice(0, 180);
  } catch {
    return "Realtime event received";
  }
}

export default function EnterpriseApiConsole() {
  const [logs, setLogs] = useState<string[]>([]);
  const [token, setToken] = useState("");
  const [quote, setQuote] = useState<QuoteInput>(defaultQuote);
  const [quoteId, setQuoteId] = useState("");
  const [gerberFiles, setGerberFiles] = useState<File[]>([]);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [orderId, setOrderId] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [userIds, setUserIds] = useState("");
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const addLog = (message: string) => {
    setLogs((current) => [`${new Date().toLocaleTimeString()} - ${message}`, ...current].slice(0, 12));
  };

  const runAction = async (label: string, action: () => Promise<unknown>) => {
    setLoadingAction(label);
    try {
      const result = await action();
      toast.success(`${label} successful`);
      addLog(`${label}: ${eventSummary(result)}`);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : `${label} failed`;
      toast.error(message);
      addLog(`${label} failed: ${message}`);
      return null;
    } finally {
      setLoadingAction(null);
    }
  };

  const realtimeEvents = useMemo(
    () =>
      [
        "notification:new",
        "order:status-updated",
        "order:cancelled",
        "ticket:reply",
        "ticket:closed",
        "chat:message",
        "chat:typing",
        "chat:seen",
        "presence:update",
      ] as (keyof RealtimeEvents)[],
    [],
  );

  useEffect(() => {
    const handlers = realtimeEvents.map((eventName) => {
      const handler = (payload: RealtimeEvents[typeof eventName]) => addLog(`${eventName}: ${eventSummary(payload)}`);
      RealtimeService.on(eventName, handler);
      return { eventName, handler };
    });

    return () => {
      handlers.forEach(({ eventName, handler }) => RealtimeService.off(eventName, handler));
    };
  }, [realtimeEvents]);

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border bg-[#07111f] py-12 text-white">
        <div className="premium-container">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-100">
                <ShieldCheck className="h-4 w-4" />
                Live enterprise API console
              </div>
              <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-6xl">
                Backend APIs now wired into a professional frontend console.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">
                Product, quote, Gerber, order, payment, support, chat, and notification flows are ready to connect with real backend data.
              </p>
            </div>

            <Card className="border-white/15 bg-white/10 text-white shadow-premium backdrop-blur lg:w-[420px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="h-5 w-5 text-cyan-200" />
                  Realtime connection
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Paste access token from login response to test live socket events.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input value={token} onChange={(event) => setToken(event.target.value)} placeholder="JWT access token" className="bg-white text-slate-950" />
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    onClick={() => {
                      RealtimeService.connect(token);
                      addLog("Realtime socket connecting");
                    }}
                    disabled={!token}
                  >
                    Connect
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      RealtimeService.disconnect();
                      addLog("Realtime socket disconnected");
                    }}
                  >
                    Disconnect
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="premium-section">
        <div className="premium-container grid gap-6 xl:grid-cols-[1fr_360px]">
          <Tabs defaultValue="customer" className="space-y-6">
            <TabsList className="grid h-auto grid-cols-2 gap-2 rounded-lg bg-muted p-2 lg:grid-cols-4">
              <TabsTrigger value="customer">Customer Flow</TabsTrigger>
              <TabsTrigger value="admin">Admin Ops</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="realtime">Chat & Notify</TabsTrigger>
            </TabsList>

            <TabsContent value="customer" className="grid gap-5 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileArchive className="h-5 w-5 text-primary" />
                    Instant PCB quote
                  </CardTitle>
                  <CardDescription>Generate, save, and convert PCB quote to order.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  {[
                    ["name", "Quote Name"],
                    ["width", "Width mm"],
                    ["height", "Height mm"],
                    ["quantity", "Quantity"],
                    ["layerCount", "Layers"],
                    ["materialType", "Material"],
                    ["boardThickness", "Thickness"],
                    ["copperWeight", "Copper oz"],
                    ["surfaceFinish", "Surface Finish"],
                    ["solderMaskColor", "Mask Color"],
                    ["silkscreenColor", "Silkscreen"],
                  ].map(([key, label]) => (
                    <label key={key} className="space-y-2">
                      <Label>{label}</Label>
                      <Input
                        value={String(quote[key as keyof QuoteInput])}
                        onChange={(event) =>
                          setQuote((current) => ({
                            ...current,
                            [key]: ["width", "height", "quantity", "layerCount", "boardThickness", "copperWeight"].includes(key)
                              ? Number(event.target.value)
                              : event.target.value,
                          }))
                        }
                      />
                    </label>
                  ))}
                  <Button
                    className="sm:col-span-2"
                    disabled={loadingAction === "Create quote"}
                    onClick={async () => {
                      const result = (await runAction("Create quote", () => QuoteService.createQuote(quote))) as { id?: string } | null;
                      if (result?.id) setQuoteId(result.id);
                    }}
                  >
                    Generate Quote
                  </Button>
                  <label className="space-y-2 sm:col-span-2">
                    <Label>Quote ID</Label>
                    <Input value={quoteId} onChange={(event) => setQuoteId(event.target.value)} placeholder="Auto-filled after quote" />
                  </label>
                  <Button
                    variant="outline"
                    className="sm:col-span-2"
                    disabled={!quoteId}
                    onClick={() => runAction("Convert quote to order", () => QuoteService.convertToOrder(quoteId, { shippingAddress: "Default factory delivery address" }))}
                  >
                    Convert Quote To Order
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UploadCloud className="h-5 w-5 text-primary" />
                    Gerber / BOM upload
                  </CardTitle>
                  <CardDescription>Upload ZIP, BOM, Pick & Place files and attach to quote.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Label>Quote ID optional</Label>
                  <Input value={quoteId} onChange={(event) => setQuoteId(event.target.value)} placeholder="Quote ID" />
                  <Input type="file" multiple onChange={(event) => setGerberFiles(Array.from(event.target.files || []))} />
                  <Button disabled={!gerberFiles.length} onClick={() => runAction("Upload Gerber files", () => GerberService.uploadFiles(gerberFiles, quoteId || undefined))}>
                    Upload Files
                  </Button>
                  <Button variant="outline" onClick={() => runAction("Fetch my Gerber files", () => GerberService.getMyFiles())}>
                    Load My Files
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="admin" className="grid gap-5 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Boxes className="h-5 w-5 text-primary" />
                    Admin product create
                  </CardTitle>
                  <CardDescription>Create professional product with image upload.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input id="product-name" placeholder="Product name" />
                  <Input id="product-category" placeholder="Category e.g. HDI PCB" />
                  <Textarea id="product-description" placeholder="Product description" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input id="product-price" type="number" placeholder="Price" />
                    <Input id="product-stock" type="number" placeholder="Stock" />
                  </div>
                  <Input type="file" multiple onChange={(event) => setProductImages(Array.from(event.target.files || []))} />
                  <Button
                    onClick={() =>
                      runAction("Create product", () =>
                        ProductService.createProduct({
                          name: (document.getElementById("product-name") as HTMLInputElement)?.value || "Premium PCB",
                          category: (document.getElementById("product-category") as HTMLInputElement)?.value || "pcb",
                          description: (document.getElementById("product-description") as HTMLTextAreaElement)?.value,
                          price: Number((document.getElementById("product-price") as HTMLInputElement)?.value || 0),
                          stock: Number((document.getElementById("product-stock") as HTMLInputElement)?.value || 0),
                          status: "ACTIVE",
                          images: productImages,
                        }),
                      )
                    }
                  >
                    Create Product
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PackageCheck className="h-5 w-5 text-primary" />
                    Order production tracking
                  </CardTitle>
                  <CardDescription>Update manufacturing status and broadcast live event.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input value={orderId} onChange={(event) => setOrderId(event.target.value)} placeholder="Order ID" />
                  <Select defaultValue="PRODUCTION" onValueChange={(value) => (window as unknown as { selectedOrderStatus?: OrderStatus }).selectedOrderStatus = value as OrderStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {orderStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    disabled={!orderId}
                    onClick={() =>
                      runAction("Update order status", () =>
                        OrderService.updateStatus(orderId, {
                          status: (window as unknown as { selectedOrderStatus?: OrderStatus }).selectedOrderStatus || "PRODUCTION",
                          note: "Production workflow updated from frontend console.",
                        }),
                      )
                    }
                  >
                    Update Status
                  </Button>
                  <Button variant="outline" disabled={!orderId} onClick={() => runAction("Cancel order", () => OrderService.cancelOrder(orderId))}>
                    Cancel Order
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="grid gap-5 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Stripe & PayPal checkout
                  </CardTitle>
                  <CardDescription>Create checkout session/order and redirect customer.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input value={orderId} onChange={(event) => setOrderId(event.target.value)} placeholder="Order ID" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Button
                      disabled={!orderId}
                      onClick={async () => {
                        const result = (await runAction("Stripe checkout", () => PaymentService.createStripeCheckout(orderId))) as { checkoutUrl?: string } | null;
                        if (result?.checkoutUrl) window.location.href = result.checkoutUrl;
                      }}
                    >
                      Pay With Stripe
                    </Button>
                    <Button
                      variant="outline"
                      disabled={!orderId}
                      onClick={async () => {
                        const result = (await runAction("PayPal checkout", () => PaymentService.createPayPalOrder(orderId))) as { checkoutUrl?: string } | null;
                        if (result?.checkoutUrl) window.location.href = result.checkoutUrl;
                      }}
                    >
                      Pay With PayPal
                    </Button>
                  </div>
                  <Input value={paymentId} onChange={(event) => setPaymentId(event.target.value)} placeholder="Payment ID for receipt" />
                  <Button variant="secondary" disabled={!paymentId} onClick={() => runAction("Fetch receipt", () => PaymentService.getReceipt(paymentId))}>
                    Load Receipt
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment history</CardTitle>
                  <CardDescription>Customer history endpoint and Admin transaction endpoint are both ready.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3">
                  <Button onClick={() => runAction("Fetch payment history", () => PaymentService.getPaymentHistory())}>My Payment History</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="realtime" className="grid gap-5 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Headphones className="h-5 w-5 text-primary" />
                    Support ticket
                  </CardTitle>
                  <CardDescription>Create/reply/close tickets with realtime updates.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input id="ticket-subject" placeholder="Ticket subject" />
                  <Textarea id="ticket-message" placeholder="Ticket message or reply" />
                  <Button
                    onClick={async () => {
                      const result = (await runAction("Create ticket", () =>
                        SupportService.createTicket({
                          subject: (document.getElementById("ticket-subject") as HTMLInputElement)?.value || "PCB support request",
                          message: (document.getElementById("ticket-message") as HTMLTextAreaElement)?.value || "Need engineering support.",
                        }),
                      )) as { id?: string } | null;
                      if (result?.id) setTicketId(result.id);
                    }}
                  >
                    Create Ticket
                  </Button>
                  <Input value={ticketId} onChange={(event) => setTicketId(event.target.value)} placeholder="Ticket ID" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Button variant="outline" disabled={!ticketId} onClick={() => runAction("Reply ticket", () => SupportService.replyTicket(ticketId, "Reply from frontend console"))}>
                      Reply
                    </Button>
                    <Button variant="secondary" disabled={!ticketId} onClick={() => runAction("Close ticket", () => SupportService.closeTicket(ticketId))}>
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    Live chat
                  </CardTitle>
                  <CardDescription>Chat room, message, typing, seen status and socket events.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input value={roomId} onChange={(event) => setRoomId(event.target.value)} placeholder="Chat room ID" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Button
                      onClick={async () => {
                        const result = (await runAction("Create chat room", () => ChatService.createRoom({ subject: "PCB project live support" }))) as { id?: string } | null;
                        if (result?.id) {
                          setRoomId(result.id);
                          RealtimeService.joinChat(result.id);
                        }
                      }}
                    >
                      Create Room
                    </Button>
                    <Button variant="outline" disabled={!roomId} onClick={() => RealtimeService.joinChat(roomId)}>
                      Join Socket Room
                    </Button>
                  </div>
                  <Textarea id="chat-message" placeholder="Chat message" />
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Button disabled={!roomId} onClick={() => runAction("Send chat message", () => ChatService.sendMessage(roomId, { message: (document.getElementById("chat-message") as HTMLTextAreaElement)?.value || "Hello from live console" }))}>
                      <Send className="h-4 w-4" />
                      Send
                    </Button>
                    <Button variant="outline" disabled={!roomId} onClick={() => RealtimeService.sendTyping(roomId, true)}>
                      Typing
                    </Button>
                    <Button variant="secondary" disabled={!roomId} onClick={() => runAction("Mark chat seen", () => ChatService.markSeen(roomId))}>
                      Seen
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Notification broadcast
                  </CardTitle>
                  <CardDescription>Send broadcast notifications to selected users.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
                  <Input value={userIds} onChange={(event) => setUserIds(event.target.value)} placeholder="User IDs comma separated" />
                  <Input id="broadcast-message" placeholder="Broadcast message" />
                  <Button
                    onClick={() =>
                      runAction("Broadcast notification", () =>
                        NotificationService.broadcast({
                          userIds: userIds.split(",").map((id) => id.trim()).filter(Boolean),
                          title: "Platform update",
                          message: (document.getElementById("broadcast-message") as HTMLInputElement)?.value || "New manufacturing update available.",
                          type: "INFO",
                          link: "/dashboard",
                        }),
                      )
                    }
                  >
                    Broadcast
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Live activity log</CardTitle>
              <CardDescription>API responses and realtime socket events appear here.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {logs.length ? (
                  logs.map((log) => (
                    <div key={log} className="rounded-lg border border-border bg-muted/60 p-3 text-xs leading-5 text-muted-foreground">
                      {log}
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                    Run an API action or connect realtime socket.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

