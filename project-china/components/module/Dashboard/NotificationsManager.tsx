"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MessageSquare,
  Info,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  PackageCheck,
  Headphones,
  CreditCard,
  FileArchive,
  RefreshCcw,
  Search,
  Filter,
  Check,
  Sparkles,
  Zap,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NotificationService } from "@/services/notification.service";
import { RealtimeService } from "@/services/realtime.service";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

export type NotificationItem = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type?: "INFO" | "SUCCESS" | "WARNING" | "ERROR" | "MESSAGE" | string;
  isRead: boolean;
  link?: string | null;
  createdAt: string;
  updatedAt?: string;
};

export default function NotificationsManager() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  const loadNotifications = useCallback(
    async (quiet = false) => {
      if (!quiet) setLoading(true);
      else setRefreshing(true);

      try {
        const res = await NotificationService.getMyNotifications();
        const list: NotificationItem[] = Array.isArray(res)
          ? res
          : Array.isArray((res as { data?: NotificationItem[] })?.data)
          ? (res as { data: NotificationItem[] }).data
          : [];

        setNotifications(list);
      } catch (err) {
        console.error("Failed to load notifications:", err);
        if (!quiet) toast.error("Could not load notifications.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Connect WebSocket listener for live notifications
  useEffect(() => {
    if (!user?.id) return;

    RealtimeService.connect();

    const handleNew = (data: unknown) => {
      if (!data || typeof data !== "object") return;
      const notif = data as NotificationItem;

      setNotifications((prev) => [notif, ...prev.filter((n) => n.id !== notif.id)]);
      toast.info(notif.title, {
        description: notif.message,
        action: notif.link
          ? {
              label: "View",
              onClick: () => router.push(notif.link!),
            }
          : undefined,
      });
    };

    const handleRead = (payload: { notificationId: string }) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === payload.notificationId ? { ...n, isRead: true } : n))
      );
    };

    const handleReadAll = () => {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    };

    RealtimeService.on("notification:new", handleNew);
    RealtimeService.on("notification:read", handleRead);
    RealtimeService.on("notification:read-all", handleReadAll);

    return () => {
      RealtimeService.off("notification:new", handleNew);
      RealtimeService.off("notification:read", handleRead);
      RealtimeService.off("notification:read-all", handleReadAll);
    };
  }, [user?.id, router]);

  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await NotificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      toast.success("Notification marked as read.");
    } catch {
      toast.error("Failed to mark as read.");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read.");
    } catch {
      toast.error("Failed to mark all as read.");
    }
  };

  // Metrics
  const metrics = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter((n) => !n.isRead).length;
    const orders = notifications.filter((n) =>
      (n.title + n.message).toLowerCase().includes("order")
    ).length;
    const support = notifications.filter((n) =>
      (n.title + n.message).toLowerCase().includes("ticket") ||
      (n.title + n.message).toLowerCase().includes("support")
    ).length;

    return { total, unread, orders, support };
  }, [notifications]);

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      // Type/Category Filter
      let matchesCategory = true;
      const combined = (n.title + " " + n.message).toLowerCase();

      if (typeFilter === "UNREAD") {
        matchesCategory = !n.isRead;
      } else if (typeFilter === "ORDERS") {
        matchesCategory = combined.includes("order") || combined.includes("shipping");
      } else if (typeFilter === "SUPPORT") {
        matchesCategory = combined.includes("ticket") || combined.includes("support") || combined.includes("chat");
      } else if (typeFilter === "QUOTES") {
        matchesCategory = combined.includes("quote");
      } else if (typeFilter === "CAM") {
        matchesCategory = combined.includes("gerber") || combined.includes("cam") || combined.includes("dfm");
      } else if (typeFilter === "PAYMENTS") {
        matchesCategory = combined.includes("payment") || combined.includes("paid") || combined.includes("stripe") || combined.includes("paypal");
      }

      // Search Filter
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        n.title.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [notifications, typeFilter, search]);

  const getActionLabel = (notif: NotificationItem) => {
    const text = (notif.title + " " + notif.message).toLowerCase();
    if (text.includes("order")) return "View Order";
    if (text.includes("ticket") || text.includes("support")) return "Open Support";
    if (text.includes("quote")) return "Inspect Quote";
    if (text.includes("gerber") || text.includes("cam")) return "CAM Files";
    if (text.includes("chat")) return "Open Live Chat";
    return "Open Link";
  };

  const getNotificationIcon = (type?: string, title?: string) => {
    const t = (type || "").toUpperCase();
    const lowerTitle = (title || "").toLowerCase();

    if (lowerTitle.includes("order")) {
      return <PackageCheck className="size-5 text-emerald-600 dark:text-emerald-400" />;
    }
    if (lowerTitle.includes("payment") || lowerTitle.includes("paid")) {
      return <CreditCard className="size-5 text-emerald-600 dark:text-emerald-400" />;
    }
    if (lowerTitle.includes("ticket") || lowerTitle.includes("support")) {
      return <Headphones className="size-5 text-sky-600 dark:text-sky-400" />;
    }
    if (lowerTitle.includes("quote")) {
      return <FileArchive className="size-5 text-indigo-600 dark:text-indigo-400" />;
    }

    switch (t) {
      case "SUCCESS":
        return <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />;
      case "WARNING":
        return <AlertTriangle className="size-5 text-amber-500" />;
      case "ERROR":
        return <XCircle className="size-5 text-rose-500" />;
      case "MESSAGE":
        return <MessageSquare className="size-5 text-sky-500" />;
      default:
        return <Info className="size-5 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0b1220] p-6 sm:p-8 shadow-sm dark:shadow-2xl">
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-[100px]" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                <span className="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                Live Notification Center
              </span>

              <span className="text-xs text-slate-300 dark:text-slate-700">•</span>

              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-semibold">
                WebSocket Real-Time Dispatch
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <Bell className="size-8 text-emerald-600 dark:text-emerald-400" />
              <span>Activity & Notification Alerts</span>
            </h1>

            <p className="mt-1.5 max-w-2xl text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {isAdmin
                ? "Unified administrative event stream. Real-time alerts for customer quote requests, quote approvals, payment receipts, order progress, and new support tickets."
                : "Real-time updates regarding your PCB quotes, CAM DFM reviews, order production milestones, payments, and engineering support messages."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {metrics.unread > 0 && (
              <Button
                onClick={handleMarkAllAsRead}
                variant="outline"
                className="h-11 px-4 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-[#070b14] dark:hover:bg-slate-800 dark:text-slate-200 text-xs font-bold gap-2 cursor-pointer"
              >
                <CheckCheck className="size-4 text-emerald-600" />
                <span>Mark All Read</span>
              </Button>
            )}

            <Button
              onClick={() => loadNotifications(true)}
              disabled={refreshing}
              variant="outline"
              className="h-11 px-4 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-[#070b14] dark:hover:bg-slate-800 dark:text-slate-200 text-xs font-bold gap-2 cursor-pointer"
            >
              <RefreshCcw className={cn("size-3.5", refreshing && "animate-spin")} />
              <span>Refresh</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0b1220] shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Total Activity</span>
              <Bell className="size-4 text-slate-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {metrics.total}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Recorded platform events
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0b1220] shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center justify-between">
              <span>Unread Alerts</span>
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {metrics.unread}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Requires your attention
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0b1220] shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Orders & Payments</span>
              <PackageCheck className="size-4 text-slate-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {metrics.orders}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Manufacturing & billing
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0b1220] shadow-sm">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Support & CAM</span>
              <Headphones className="size-4 text-slate-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {metrics.support}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Engineering tickets & chat
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Container */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0b1220] shadow-sm overflow-hidden">
        {/* Controls Bar: Search & Category Tabs */}
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto scrollbar-none">
            {[
              { id: "ALL", label: "All Alerts" },
              { id: "UNREAD", label: `Unread (${metrics.unread})` },
              { id: "ORDERS", label: "Orders" },
              { id: "QUOTES", label: "Quotes" },
              { id: "CAM", label: "CAM / Gerber" },
              { id: "SUPPORT", label: "Support Tickets" },
              { id: "PAYMENTS", label: "Payments" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTypeFilter(tab.id)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap",
                  typeFilter === tab.id
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-white dark:bg-[#070b14] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notifications..."
              className="h-9 pl-9 pr-4 text-xs rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14]"
            />
          </div>
        </div>

        {/* Notifications List View */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {loading ? (
            <div className="p-16 text-center text-xs text-slate-400 flex flex-col items-center justify-center">
              <Loader2 className="size-6 animate-spin text-emerald-600 mb-2" />
              Loading notifications...
            </div>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => {
              const actionLabel = getActionLabel(notif);

              return (
                <div
                  key={notif.id}
                  className={cn(
                    "p-4 sm:p-5 transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
                    !notif.isRead
                      ? "bg-emerald-50/40 dark:bg-emerald-950/20 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30"
                      : "hover:bg-slate-50 dark:hover:bg-slate-900/50"
                  )}
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="size-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                      {getNotificationIcon(notif.type, notif.title)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4
                          className={cn(
                            "text-sm font-bold text-slate-900 dark:text-white truncate",
                            !notif.isRead && "font-black"
                          )}
                        >
                          {notif.title}
                        </h4>

                        {!notif.isRead ? (
                          <Badge className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0">
                            NEW
                          </Badge>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-400">READ</span>
                        )}

                        <span className="text-slate-300 dark:text-slate-700">•</span>

                        <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                          <Clock className="size-3" />
                          {new Date(notif.createdAt).toLocaleString([], {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                        {notif.message}
                      </p>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="flex items-center gap-2.5 sm:shrink-0 self-end sm:self-center">
                    {!notif.isRead && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => handleMarkAsRead(notif.id, e)}
                        className="h-9 px-3 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        title="Mark as read"
                      >
                        <Check className="size-3.5 mr-1 text-emerald-600" />
                        <span>Mark read</span>
                      </Button>
                    )}

                    {notif.link && (
                      <Button
                        asChild
                        size="sm"
                        className="h-9 px-4 rounded-xl bg-slate-900 hover:bg-emerald-600 dark:bg-slate-800 dark:hover:bg-emerald-600 text-white text-xs font-bold gap-1.5 shadow-2xs transition-colors cursor-pointer"
                      >
                        <Link href={notif.link} onClick={() => handleMarkAsRead(notif.id)}>
                          <span>{actionLabel}</span>
                          <ArrowRight className="size-3.5" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-16 text-center text-xs text-slate-400">
              <CheckCircle2 className="size-10 mx-auto text-emerald-500 mb-3 opacity-80" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {typeFilter === "UNREAD" ? "Zero Unread Notifications" : "No Notifications Found"}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                {typeFilter === "UNREAD"
                  ? "You have reviewed all recent updates and manufacturing alerts."
                  : "Platform alerts for PCB orders, engineering reviews, and quote status will appear here."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
