"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Headphones,
  Plus,
  RefreshCcw,
  Search,
  CheckCircle2,
  Clock,
  Send,
  User,
  ShieldCheck,
  AlertCircle,
  MessageSquare,
  Lock,
  Unlock,
  Check,
  Copy,
  ExternalLink,
  Loader2,
  X,
  Sparkles,
  HelpCircle,
  Building2,
  Calendar,
  Volume2,
  VolumeX,
  Radio,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SupportService } from "@/services/support.service";
import { RealtimeService } from "@/services/realtime.service";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

export type TicketMessageItem = {
  id: string;
  ticketId: string;
  senderId: string;
  message: string;
  isRead?: boolean;
  createdAt: string;
  status?: "sending" | "sent" | "failed";
  sender?: {
    id: string;
    name?: string;
    role?: string;
  };
};

// Pure Web Audio API chime for live tickets (no external file dependencies)
const playSupportChime = (type: "sent" | "received") => {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "sent") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08); // A5
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(783.99, ctx.currentTime); // G5
      osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.12); // C6
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
      osc.start();
      osc.stop(ctx.currentTime + 0.14);
    }
  } catch {
    // Autoplay policy fallback
  }
};

export type SupportTicket = {
  id: string;
  userId: string;
  subject: string;
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name?: string;
    email?: string;
    companyName?: string;
  };
  messages?: TicketMessageItem[];
};

const statusStyles: Record<string, { badge: string; dot: string; label: string }> = {
  OPEN: {
    badge: "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
    dot: "bg-emerald-500",
    label: "Open",
  },
  IN_PROGRESS: {
    badge: "bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800",
    dot: "bg-sky-500",
    label: "In Progress",
  },
  RESOLVED: {
    badge: "bg-purple-50 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
    dot: "bg-purple-500",
    label: "Resolved",
  },
  CLOSED: {
    badge: "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
    dot: "bg-slate-400",
    label: "Closed",
  },
};

const CATEGORIES = [
  "CAM & Gerber Review",
  "Order & Production Status",
  "Billing, Tax & Payments",
  "Component Sourcing & BOM",
  "Technical PCB Tolerance",
  "General Inquiry",
];

export default function SupportTicketsManager() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Create ticket dialog state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newCategory, setNewCategory] = useState(CATEGORIES[0]);
  const [newMessage, setNewMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reply state
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Realtime Live Desk States
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const activeTicketIdRef = useRef<string | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    activeTicketIdRef.current = selectedTicket?.id || null;
  }, [selectedTicket?.id]);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
  };

  const loadTickets = useCallback(
    async (quiet = false) => {
      if (!quiet) setLoading(true);
      else setRefreshing(true);

      try {
        const res = isAdmin
          ? await SupportService.getAllTickets()
          : await SupportService.getMyTickets();

        const data: SupportTicket[] = Array.isArray(res)
          ? res
          : Array.isArray((res as { data?: SupportTicket[] })?.data)
          ? (res as { data: SupportTicket[] }).data
          : [];

        setTickets(data);

        // Keep selected ticket refreshed
        if (activeTicketIdRef.current) {
          const updated = data.find((t) => t.id === activeTicketIdRef.current);
          if (updated) {
            setSelectedTicket((prev) =>
              prev ? { ...prev, ...updated, messages: prev.messages } : updated
            );
          }
        }
      } catch (err) {
        console.error("Failed to load tickets:", err);
        if (!quiet) toast.error("Could not load support tickets.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [isAdmin]
  );

  useEffect(() => {
    loadTickets();
  }, [isAdmin, loadTickets]);

  // Connect socket for real-time ticket replies, live typing and status changes
  useEffect(() => {
    if (!user?.id) return;

    const socket = RealtimeService.connect();
    setIsSocketConnected(Boolean(socket?.connected));

    const onConnect = () => setIsSocketConnected(true);
    const onDisconnect = () => {
      setIsSocketConnected(false);
      setIsOtherTyping(false);
    };

    RealtimeService.onConnect(onConnect);
    RealtimeService.onDisconnect(onDisconnect);

    const handleTicketReply = (data: unknown) => {
      if (!data || typeof data !== "object") return;
      const payload = data as {
        ticketId: string;
        message: TicketMessageItem;
        ticketStatus?: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
      };
      const currentActiveId = activeTicketIdRef.current;

      // Update tickets list preview
      setTickets((prev) =>
        prev.map((t) => {
          if (t.id === payload.ticketId) {
            return {
              ...t,
              status: payload.ticketStatus || "IN_PROGRESS",
              updatedAt: new Date().toISOString(),
              messages: t.messages ? [...t.messages, payload.message] : [payload.message],
            };
          }
          return t;
        })
      );

      // If this reply belongs to active conversation thread
      if (currentActiveId && payload.ticketId === currentActiveId) {
        setIsOtherTyping(false);

        setSelectedTicket((prev) => {
          if (!prev || prev.id !== currentActiveId) return prev;
          const exists = prev.messages?.some(
            (m) =>
              m.id === payload.message?.id ||
              (m.status === "sending" && m.message === payload.message?.message)
          );

          if (exists) {
            return {
              ...prev,
              status: payload.ticketStatus || prev.status,
              messages: prev.messages?.map((m) =>
                m.id === payload.message?.id ||
                (m.status === "sending" && m.message === payload.message?.message)
                  ? { ...payload.message, status: "sent" }
                  : m
              ),
            };
          }

          if (soundEnabled && payload.message?.senderId !== user.id) {
            playSupportChime("received");
          }

          return {
            ...prev,
            status: payload.ticketStatus || prev.status,
            messages: [...(prev.messages || []), { ...payload.message, status: "sent" }],
          };
        });

        setTimeout(() => scrollToBottom(true), 60);
      }
    };

    const handleTicketTyping = (payload: { ticketId: string; userId: string; isTyping: boolean }) => {
      if (payload.ticketId === activeTicketIdRef.current && payload.userId !== user.id) {
        setIsOtherTyping(payload.isTyping);
      }
    };

    const handleTicketClosed = (data: unknown) => {
      const payload = data as { ticketId: string; status?: "CLOSED" };
      if (!payload?.ticketId) return;

      setTickets((prev) =>
        prev.map((t) => (t.id === payload.ticketId ? { ...t, status: "CLOSED" } : t))
      );

      if (activeTicketIdRef.current === payload.ticketId) {
        setSelectedTicket((prev) => (prev ? { ...prev, status: "CLOSED" } : null));
        toast.info("Support ticket marked as Closed.");
      }
    };

    const handleTicketCreated = (ticket: unknown) => {
      if (ticket && typeof ticket === "object" && "id" in ticket) {
        const t = ticket as SupportTicket;
        setTickets((prev) => [t, ...prev.filter((item) => item.id !== t.id)]);
      }
    };

    RealtimeService.on("ticket:reply", handleTicketReply);
    RealtimeService.on("ticket:typing", handleTicketTyping);
    RealtimeService.on("ticket:closed", handleTicketClosed);
    RealtimeService.on("ticket:created", handleTicketCreated);

    return () => {
      RealtimeService.off("ticket:reply", handleTicketReply);
      RealtimeService.off("ticket:typing", handleTicketTyping);
      RealtimeService.off("ticket:closed", handleTicketClosed);
      RealtimeService.off("ticket:created", handleTicketCreated);
    };
  }, [user?.id, soundEnabled]);

  useEffect(() => {
    scrollToBottom(true);
  }, [selectedTicket?.messages?.length, isOtherTyping]);

  const handleSelectTicket = async (ticket: SupportTicket) => {
    if (activeTicketIdRef.current) {
      RealtimeService.leaveTicket(activeTicketIdRef.current);
    }

    setSelectedTicket(ticket);
    setIsOtherTyping(false);
    RealtimeService.joinTicket(ticket.id);

    try {
      const fullTicket = (await SupportService.getTicketById(ticket.id)) as SupportTicket;
      if (fullTicket && fullTicket.id) {
        setSelectedTicket(fullTicket);
      }
      setTimeout(() => scrollToBottom(false), 80);
    } catch {
      // Fallback to already loaded ticket
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) {
      toast.error("Please provide a ticket subject.");
      return;
    }
    if (!newMessage.trim()) {
      toast.error("Please describe your question or issue.");
      return;
    }

    try {
      setIsSubmitting(true);
      const subjectFormatted = `[${newCategory}] ${newSubject.trim()}`;
      const ticket = (await SupportService.createTicket({
        subject: subjectFormatted,
        message: newMessage.trim(),
      })) as SupportTicket;

      toast.success("Support ticket submitted! Engineering team notified.");
      setNewSubject("");
      setNewMessage("");
      setIsCreateOpen(false);
      await loadTickets(true);
      if (ticket && ticket.id) {
        handleSelectTicket(ticket);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create support ticket.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplyChange = (text: string) => {
    setReplyText(text);
    if (!selectedTicket?.id) return;

    RealtimeService.sendTicketTyping(selectedTicket.id, true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (selectedTicket?.id) {
        RealtimeService.sendTicketTyping(selectedTicket.id, false);
      }
    }, 1500);
  };

  const handleReplyTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    const textToSend = replyText.trim();
    if (!selectedTicket || !textToSend || isReplying) return;

    const tempId = `temp-${Date.now()}`;
    const timestamp = new Date().toISOString();

    const optimisticMessage: TicketMessageItem = {
      id: tempId,
      ticketId: selectedTicket.id,
      senderId: user?.id || "",
      message: textToSend,
      createdAt: timestamp,
      status: "sending",
      sender: {
        id: user?.id || "",
        name: user?.name || "You",
        role: user?.role || "CUSTOMER",
      },
    };

    // Optimistically update conversation
    setSelectedTicket((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        status: "IN_PROGRESS",
        messages: [...(prev.messages || []), optimisticMessage],
      };
    });

    setReplyText("");
    if (soundEnabled) playSupportChime("sent");
    setTimeout(() => scrollToBottom(true), 50);

    try {
      setIsReplying(true);
      if (selectedTicket?.id) {
        RealtimeService.sendTicketTyping(selectedTicket.id, false);
      }

      const serverMsg = (await SupportService.replyTicket(
        selectedTicket.id,
        textToSend
      )) as TicketMessageItem;

      setSelectedTicket((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          messages: prev.messages?.map((m) =>
            m.id === tempId ? { ...serverMsg, status: "sent" } : m
          ),
        };
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to post reply.");
      setSelectedTicket((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          messages: prev.messages?.map((m) =>
            m.id === tempId ? { ...m, status: "failed" } : m
          ),
        };
      });
    } finally {
      setIsReplying(false);
    }
  };

  const handleCloseTicket = async (ticketId: string) => {
    if (!confirm("Are you sure you want to resolve and close this ticket?")) return;

    try {
      await SupportService.closeTicket(ticketId);
      toast.success("Support ticket marked as Closed.");
      await loadTickets(true);
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket((prev) => (prev ? { ...prev, status: "CLOSED" } : null));
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to close ticket.");
    }
  };

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Copied Ticket ID to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Metrics
  const metrics = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter((t) => t.status === "OPEN" || t.status === "IN_PROGRESS").length;
    const closed = tickets.filter((t) => t.status === "RESOLVED" || t.status === "CLOSED").length;
    return { total, open, closed };
  }, [tickets]);

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesStatus = statusFilter === "ALL" || ticket.status === statusFilter;
      const q = search.trim().toLowerCase();
      if (!q) return matchesStatus;

      const subject = (ticket.subject || "").toLowerCase();
      const id = (ticket.id || "").toLowerCase();
      const userName = (ticket.user?.name || "").toLowerCase();
      const userEmail = (ticket.user?.email || "").toLowerCase();

      return (
        matchesStatus &&
        (subject.includes(q) || id.includes(q) || userName.includes(q) || userEmail.includes(q))
      );
    });
  }, [tickets, search, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0b1220] p-6 sm:p-8 shadow-sm dark:shadow-2xl">
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-[100px]" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                <span className="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                Live Engineering Support Desk
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                <ShieldCheck className="size-3 text-emerald-600 dark:text-emerald-400" />
                CAM Engineering SLA: &lt; 2h
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <Headphones className="size-8 text-emerald-600 dark:text-emerald-400" />
              <span>Support & Engineering Tickets</span>
            </h1>

            <p className="mt-1.5 max-w-2xl text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {isAdmin
                ? "Review technical CAM engineering inquiries, resolve PCB fabrication questions, monitor response SLAs, and reply to customers."
                : "Submit technical queries regarding Gerber files, impedance control, solder mask colors, production scheduling, or billing."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Live Socket Status Pill */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 text-xs font-bold text-slate-700 dark:text-slate-300">
              <span
                className={cn(
                  "size-2 rounded-full",
                  isSocketConnected ? "bg-emerald-500 animate-pulse ring-2 ring-emerald-500/20" : "bg-amber-500"
                )}
              />
              <span className="font-mono text-[11px]">
                {isSocketConnected ? "Live Connected" : "Connecting..."}
              </span>
            </div>

            {/* Audio Feedback Toggle */}
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={() => setSoundEnabled((v) => !v)}
              title={soundEnabled ? "Mute audio chimes" : "Enable audio chimes"}
              className="size-11 rounded-xl border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-[#070b14] dark:hover:bg-slate-800 cursor-pointer"
            >
              {soundEnabled ? (
                <Volume2 className="size-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <VolumeX className="size-4 text-slate-400" />
              )}
            </Button>

            <Button
              onClick={() => loadTickets(true)}
              disabled={refreshing}
              variant="outline"
              className="h-11 px-4 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-[#070b14] dark:hover:bg-slate-800 dark:text-slate-200 text-xs font-bold gap-2 cursor-pointer"
            >
              <RefreshCcw className={cn("size-3.5", refreshing && "animate-spin")} />
              <span>Refresh</span>
            </Button>

            <Button
              onClick={() => setIsCreateOpen(true)}
              className="h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-2 shadow-xs cursor-pointer"
            >
              <Plus className="size-4" />
              <span>Open Support Ticket</span>
            </Button>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="relative z-10 mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-100 dark:border-slate-800/80">
          <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-[#070b14] border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Tickets
            </span>
            <p className="text-xl font-black text-slate-900 dark:text-white mt-1">
              {metrics.total}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-[#070b14] border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Active / Open Inquiries
            </span>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {metrics.open}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-[#070b14] border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Resolved & Closed
            </span>
            <p className="text-xl font-black text-slate-700 dark:text-slate-300 mt-1">
              {metrics.closed}
            </p>
          </div>
        </div>
      </section>

      {/* Main Workspace (Split View: Tickets List on Left, Active Conversation on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[640px]">
        {/* Left Column: Tickets List (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0b1220] p-4 shadow-sm space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tickets by subject, ID, or user..."
                className="h-10 pl-10 pr-4 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070b14] text-xs font-medium"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#070b14] rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-x-auto">
              {["ALL", "OPEN", "IN_PROGRESS", "CLOSED"].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer",
                    statusFilter === st
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {st === "IN_PROGRESS" ? "In Progress" : st}
                </button>
              ))}
            </div>
          </div>

          {/* Tickets Scroll List */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0b1220] p-3 shadow-sm flex-1 overflow-y-auto max-h-[620px] space-y-2">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400 flex flex-col items-center justify-center">
                <Loader2 className="size-6 animate-spin text-emerald-600 mb-2" />
                Loading support tickets...
              </div>
            ) : filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => {
                const isSelected = selectedTicket?.id === ticket.id;
                const statusMeta = statusStyles[ticket.status] || statusStyles.OPEN;

                return (
                  <div
                    key={ticket.id}
                    onClick={() => handleSelectTicket(ticket)}
                    className={cn(
                      "p-3.5 rounded-xl border transition cursor-pointer text-xs",
                      isSelected
                        ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 shadow-xs"
                        : "border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/60"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-mono text-[11px] font-black text-emerald-700 dark:text-emerald-400">
                        #{ticket.id.slice(0, 8).toUpperCase()}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn("text-[10px] font-bold rounded-full gap-1 px-2 py-0.5", statusMeta.badge)}
                      >
                        <span className={cn("size-1.5 rounded-full", statusMeta.dot)} />
                        {statusMeta.label || ticket.status}
                      </Badge>
                    </div>

                    <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1 text-xs">
                      {ticket.subject}
                    </h4>

                    {isAdmin && ticket.user && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1 truncate">
                        <User className="size-3 text-slate-400 shrink-0" />
                        <span className="truncate">{ticket.user.name || ticket.user.email}</span>
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                      <span>{new Date(ticket.updatedAt || ticket.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1 font-semibold">
                        <MessageSquare className="size-3" />
                        {ticket.messages?.length || 1} msg
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">
                <HelpCircle className="size-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                <p className="font-bold text-slate-600 dark:text-slate-400">No support tickets found</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Click "Open Support Ticket" above to get engineering assistance.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Ticket Conversation Thread (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          {selectedTicket ? (
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0b1220] shadow-sm flex flex-col h-full overflow-hidden">
              {/* Ticket Top Action Bar */}
              <div className="p-5 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <button
                      type="button"
                      onClick={() => copyId(selectedTicket.id)}
                      className="inline-flex items-center gap-1 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 transition"
                      title="Copy Ticket ID"
                    >
                      <span>#{selectedTicket.id.slice(0, 8).toUpperCase()}</span>
                      {copiedId === selectedTicket.id ? (
                        <Check className="size-3 text-emerald-600" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                    </button>

                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] font-bold rounded-full gap-1 px-2.5 py-0.5",
                        (statusStyles[selectedTicket.status] || statusStyles.OPEN).badge
                      )}
                    >
                      <span className={cn("size-1.5 rounded-full", (statusStyles[selectedTicket.status] || statusStyles.OPEN).dot)} />
                      {(statusStyles[selectedTicket.status] || statusStyles.OPEN).label}
                    </Badge>

                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="size-3" />
                      Created {new Date(selectedTicket.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    {selectedTicket.subject}
                  </h3>
                </div>

                {/* Close ticket button for admin or ticket owner */}
                {selectedTicket.status !== "CLOSED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCloseTicket(selectedTicket.id)}
                    className="rounded-xl border-slate-300 dark:border-slate-700 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 dark:hover:bg-rose-950/40 text-xs font-bold gap-1.5 shrink-0"
                  >
                    <Lock className="size-3.5" />
                    <span>Close Ticket</span>
                  </Button>
                )}
              </div>

              {/* Messages Viewport */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[460px] min-h-[340px] bg-slate-50/30 dark:bg-[#070b14]/50">
                {selectedTicket.messages && selectedTicket.messages.length > 0 ? (
                  selectedTicket.messages.map((msg, index) => {
                    const isStaff = msg.sender?.role === "ADMIN" || msg.sender?.role === "SUPER_ADMIN";
                    const isMe = msg.senderId === user?.id;

                    return (
                      <div
                        key={msg.id || index}
                        className={cn(
                          "flex flex-col max-w-[85%]",
                          isMe ? "ml-auto items-end" : "mr-auto items-start"
                        )}
                      >
                        <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-slate-400">
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            {msg.sender?.name || (isMe ? "You" : isStaff ? "Feitian CAM Engineer" : "Customer")}
                          </span>
                          {isStaff && (
                            <span className="inline-flex items-center gap-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-1 py-0.2 text-[9px] font-black uppercase">
                              <ShieldCheck className="size-2.5" /> Support Engineer
                            </span>
                          )}
                          <span>•</span>
                          <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        </div>

                        <div
                          className={cn(
                            "p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs whitespace-pre-wrap flex items-end justify-between gap-3",
                            isMe
                              ? "bg-emerald-600 text-white rounded-tr-xs"
                              : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 rounded-tl-xs"
                          )}
                        >
                          <span>{msg.message}</span>
                          {msg.status === "sending" && (
                            <span className="inline-flex items-center text-[10px] opacity-75 shrink-0 ml-1">
                              <Loader2 className="size-3 animate-spin mr-1" />
                              sending...
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-10 text-xs text-slate-400">
                    No replies yet. Type a response below to communicate with the engineering team.
                  </div>
                )}

                {/* Real-time Typing Indicator */}
                {isOtherTyping && (
                  <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 animate-pulse w-fit">
                    <span className="flex gap-1">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-bounce" />
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                    </span>
                    <span className="font-semibold text-[11px]">
                      {isAdmin ? "Customer is typing..." : "CAM Support Engineer is typing..."}
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Reply Input Bar */}
              {selectedTicket.status !== "CLOSED" ? (
                <form
                  onSubmit={handleReplyTicket}
                  className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0b1220] flex items-end gap-3 shrink-0"
                >
                  <Textarea
                    value={replyText}
                    onChange={(e) => handleReplyChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleReplyTicket(e);
                      }
                    }}
                    placeholder={
                      isAdmin
                        ? "Reply to customer as Support Engineer... (Press Enter to send)"
                        : "Type your response to this ticket... (Press Enter to send)"
                    }
                    rows={2}
                    className="resize-none text-xs rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070b14] min-h-[44px]"
                  />

                  <Button
                    type="submit"
                    disabled={isReplying || !replyText.trim()}
                    className="h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 shrink-0"
                  >
                    {isReplying ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                    <span>Reply</span>
                  </Button>
                </form>
              ) : (
                <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
                  <Lock className="size-3.5" />
                  <span>This ticket is closed. Open a new ticket if you need additional assistance.</span>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1220] h-full flex flex-col items-center justify-center p-12 text-center text-xs">
              <div className="size-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 shadow-sm">
                <MessageSquare className="size-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Select a Ticket</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-4">
                Choose a support ticket from the list on the left to inspect conversation history or send a direct engineering reply.
              </p>
              <Button
                onClick={() => setIsCreateOpen(true)}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5"
              >
                <Plus className="size-4" />
                <span>Create New Ticket</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* "Create Support Ticket" Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-xl w-[95vw] p-0 overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0b1220] shadow-2xl">
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 shrink-0" />

          <DialogHeader className="px-6 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <DialogTitle className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Headphones className="size-5 text-emerald-600 dark:text-emerald-400" />
              <span>Submit a New Support Ticket</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Our engineering & CAM technical specialists will review your inquiry with prioritized turnaround.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateTicket} className="p-6 space-y-4 text-xs">
            {/* Category / Department */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Department / Inquiry Topic
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setNewCategory(cat)}
                    className={cn(
                      "p-2.5 rounded-xl border text-left text-xs font-semibold transition cursor-pointer",
                      newCategory === cat
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300"
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Subject Title *
              </Label>
              <Input
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="e.g. Order #CC656600 drill file resolution question"
                className="h-10 text-xs rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070b14]"
              />
            </div>

            {/* Message Description */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Detailed Message *
              </Label>
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Provide detailed specifications, order number, layer stackup, or questions..."
                rows={5}
                className="text-xs rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070b14]"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-xl text-xs font-bold px-4"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !newSubject.trim() || !newMessage.trim()}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin mr-1" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="size-3.5" />
                    Submit Ticket
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
