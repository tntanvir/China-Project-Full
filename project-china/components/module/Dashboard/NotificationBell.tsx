"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

// Subtle Web Audio API chime on new notification
const playNotifChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sine";
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.1); // G5
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  } catch {
    // Autoplay restrictions, safely ignore
  }
};

const getNotificationIcon = (type?: string, title?: string) => {
  const t = (type || "").toUpperCase();
  const lowerTitle = (title || "").toLowerCase();

  if (lowerTitle.includes("order") || lowerTitle.includes("shipping")) {
    return <PackageCheck className="size-4 text-emerald-500" />;
  }
  if (lowerTitle.includes("payment") || lowerTitle.includes("paid")) {
    return <CreditCard className="size-4 text-emerald-500" />;
  }
  if (lowerTitle.includes("ticket") || lowerTitle.includes("support")) {
    return <Headphones className="size-4 text-sky-500" />;
  }
  if (lowerTitle.includes("quote")) {
    return <FileArchive className="size-4 text-indigo-500" />;
  }

  switch (t) {
    case "SUCCESS":
      return <CheckCircle2 className="size-4 text-emerald-500" />;
    case "WARNING":
      return <AlertTriangle className="size-4 text-amber-500" />;
    case "ERROR":
      return <XCircle className="size-4 text-rose-500" />;
    case "MESSAGE":
      return <MessageSquare className="size-4 text-sky-500" />;
    default:
      return <Info className="size-4 text-indigo-500" />;
  }
};

const formatTimeAgo = (dateStr: string) => {
  try {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return "Recently";
  }
};

export default function NotificationBell() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");

  const loadNotifications = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await NotificationService.getMyNotifications();
      const list: NotificationItem[] = Array.isArray(res)
        ? res
        : Array.isArray((res as { data?: NotificationItem[] })?.data)
        ? (res as { data: NotificationItem[] }).data
        : [];

      setNotifications(list);
      setUnreadCount(list.filter((n) => !n.isRead).length);
    } catch (err) {
      console.warn("Could not load notifications:", err);
    }
  }, [user?.id]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Connect WebSocket listener for live notification events
  useEffect(() => {
    if (!user?.id) return;

    RealtimeService.connect();

    const handleNewNotification = (data: unknown) => {
      if (!data || typeof data !== "object") return;
      const notif = data as NotificationItem;

      // Play chime
      playNotifChime();

      // Toast alert
      toast(notif.title, {
        description: notif.message,
        action: notif.link
          ? {
              label: "View",
              onClick: () => router.push(notif.link!),
            }
          : undefined,
      });

      // Add to list and increment unread
      setNotifications((prev) => [notif, ...prev.filter((item) => item.id !== notif.id)]);
      setUnreadCount((prev) => prev + 1);
    };

    const handleNotificationRead = (payload: { notificationId: string }) => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === payload.notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    const handleNotificationReadAll = () => {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    };

    RealtimeService.on("notification:new", handleNewNotification);
    RealtimeService.on("notification:read", handleNotificationRead);
    RealtimeService.on("notification:read-all", handleNotificationReadAll);

    return () => {
      RealtimeService.off("notification:new", handleNewNotification);
      RealtimeService.off("notification:read", handleNotificationRead);
      RealtimeService.off("notification:read-all", handleNotificationReadAll);
    };
  }, [user?.id, router]);

  const handleMarkAsRead = async (notif: NotificationItem) => {
    if (!notif.isRead) {
      try {
        await NotificationService.markAsRead(notif.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch {
        // Continue
      }
    }

    if (notif.link) {
      setIsOpen(false);
      router.push(notif.link);
    }
  };

  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await NotificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read.");
    } catch {
      toast.error("Failed to mark notifications as read.");
    }
  };

  const filteredNotifications = notifications.filter((n) =>
    filter === "UNREAD" ? !n.isRead : true
  );

  const notificationsCenterHref = isAdmin
    ? "/admin/notifications"
    : "/dashboard/notifications";

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label="Notifications"
          className="relative size-9 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 shadow-2xs hover:border-emerald-500 transition cursor-pointer"
        >
          <Bell className="size-4" />

          {unreadCount > 0 ? (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-600 px-1 text-[9px] font-mono font-bold text-white ring-2 ring-white dark:ring-[#070b14] shadow-xs animate-in zoom-in-50 duration-200">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : (
            <span className="absolute 1.5 top-1.5 size-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[370px] max-w-[95vw] p-0 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0b1220] shadow-2xl overflow-hidden z-50 text-slate-900 dark:text-slate-100"
      >
        {/* Dropdown Header */}
        <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Notifications
            </h4>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                title="Mark all as read"
              >
                <CheckCheck className="size-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-1 bg-white dark:bg-[#0b1220]">
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={cn(
              "px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer",
              filter === "ALL"
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            All ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("UNREAD")}
            className={cn(
              "px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer",
              filter === "UNREAD"
                ? "bg-emerald-600 text-white"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notification Items List */}
        <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.slice(0, 15).map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleMarkAsRead(notif)}
                className={cn(
                  "p-3.5 transition flex items-start gap-3 cursor-pointer text-xs relative",
                  !notif.isRead
                    ? "bg-emerald-50/40 dark:bg-emerald-950/20 hover:bg-emerald-50/70 dark:hover:bg-emerald-950/30"
                    : "hover:bg-slate-50 dark:hover:bg-slate-900/60"
                )}
              >
                <div className="mt-0.5 size-7 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  {getNotificationIcon(notif.type, notif.title)}
                </div>

                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <h5
                      className={cn(
                        "text-xs line-clamp-1",
                        !notif.isRead
                          ? "font-black text-slate-900 dark:text-white"
                          : "font-semibold text-slate-700 dark:text-slate-300"
                      )}
                    >
                      {notif.title}
                    </h5>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {formatTimeAgo(notif.createdAt)}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {notif.message}
                  </p>

                  {notif.link && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                      <span>View details</span>
                      <ChevronRight className="size-2.5" />
                    </span>
                  )}
                </div>

                {!notif.isRead && (
                  <span className="size-2 rounded-full bg-emerald-500 shrink-0 mt-2" />
                )}
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              <CheckCheck className="size-8 mx-auto text-emerald-500 mb-2 opacity-80" />
              <p className="font-bold text-slate-700 dark:text-slate-300">
                {filter === "UNREAD" ? "No unread notifications" : "No notifications yet"}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                All activities, quote reviews, and orders will be alerted here.
              </p>
            </div>
          )}
        </div>

        {/* Dropdown Footer */}
        <div className="p-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 text-center">
          <Link
            href={notificationsCenterHref}
            onClick={() => setIsOpen(false)}
            className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center justify-center gap-1 py-1"
          >
            <span>Open Full Notification Center</span>
            <ExternalLink className="size-3" />
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
