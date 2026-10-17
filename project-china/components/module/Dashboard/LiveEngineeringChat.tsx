"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import {
  MessageCircle,
  Plus,
  RefreshCcw,
  Search,
  Check,
  CheckCheck,
  Copy,
  Loader2,
  X,
  Sparkles,
  Lock,
  Radio,
  FileCode,
  Zap,
  Volume2,
  VolumeX,
  Paperclip,
  Smile,
  ShieldCheck,
  Cpu,
  Layers,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Clock,
  SendHorizontal,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { ChatService } from "@/services/chat.service";
import { RealtimeService } from "@/services/realtime.service";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

export type ChatMessageItem = {
  id: string;
  roomId: string;
  senderId: string;
  message?: string;
  files?: string[];
  isSeen?: boolean;
  createdAt: string;
  status?: "sending" | "sent" | "failed";
  sender?: {
    id: string;
    name?: string;
    role?: string;
  };
};

export type ChatRoom = {
  id: string;
  customerId: string;
  adminId?: string;
  subject?: string;
  status: "OPEN" | "CLOSED";
  createdAt: string;
  updatedAt: string;
  unreadCount?: number;
  customer?: {
    id: string;
    name?: string;
    email?: string;
    role?: string;
  };
  admin?: {
    id: string;
    name?: string;
    email?: string;
    role?: string;
  };
  messages?: ChatMessageItem[];
};

// Web Audio API pure synthesizer for smooth live chat sound effects (no external asset downloads)
const playChime = (type: "sent" | "received") => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "sent") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08); // A5
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.12); // D6
      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
      osc.start();
      osc.stop(ctx.currentTime + 0.14);
    }
  } catch {
    // Ignore audio autoplay restrictions
  }
};

const CAM_QUICK_ACTIONS = [
  {
    icon: CheckCircle2,
    label: "Gerber DFM Approved",
    text: "✓ Gerber 274X layers inspected. All track widths, annular rings, and clearances conform to standard manufacturing tolerances.",
  },
  {
    icon: AlertTriangle,
    label: "Tolerance Exception",
    text: "⚠️ CAM Notice: Drill-to-copper clearance is 3.8mil on inner layers (standard recommended: 4.0mil+). Confirm if approved to proceed.",
  },
  {
    icon: Layers,
    label: "Stackup Verified",
    text: "📐 Impedance stackup calculated: 50Ω single-ended microstrip verified with FR-4 core thickness 0.2mm and 1oz Cu.",
  },
  {
    icon: Cpu,
    label: "NC Drill Check",
    text: "⏳ NC Excellon drill coordinate mapping verified with plated through-holes (PTH) and non-plated tooling holes.",
  },
  {
    icon: Wrench,
    label: "Tooling Greenlight",
    text: "🏭 CAM engineering verification completed. Working film photoplotting and panelization released to production floor.",
  },
];

export default function LiveEngineeringChat() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  // WebSocket Live Connection State
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [isOtherUserOnline, setIsOtherUserOnline] = useState(false);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Create room modal state
  const [isNewRoomOpen, setIsNewRoomOpen] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [firstMessage, setFirstMessage] = useState("");
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  // Message input state
  const [inputMessage, setInputMessage] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // File link attachment modal state
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [fileUrlInput, setFileUrlInput] = useState("");
  const [fileComment, setFileComment] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeRoomIdRef = useRef<string | null>(null);

  // Keep ref synced with selectedRoom.id for realtime event callbacks
  useEffect(() => {
    activeRoomIdRef.current = selectedRoom?.id || null;
  }, [selectedRoom?.id]);

  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
      });
    }
  }, []);

  // Load rooms
  const loadRooms = useCallback(
    async (quiet = false) => {
      if (!quiet) setLoading(true);
      else setRefreshing(true);

      try {
        const res = await ChatService.getMyRooms();
        const data: ChatRoom[] = Array.isArray(res)
          ? res
          : Array.isArray((res as { data?: ChatRoom[] })?.data)
          ? (res as { data: ChatRoom[] }).data
          : [];

        setRooms(data);

        // Keep current room updated
        if (activeRoomIdRef.current) {
          const current = data.find((r) => r.id === activeRoomIdRef.current);
          if (current) {
            setSelectedRoom((prev) => (prev ? { ...prev, ...current, messages: prev.messages } : current));
          }
        } else if (data.length > 0 && !selectedRoom) {
          handleSelectRoom(data[0]);
        }
      } catch (err) {
        console.error("Failed to load chat channels:", err);
        if (!quiet) toast.error("Could not load chat channels.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    loadRooms();
  }, [loadRooms]);

  // Connect socket and register real-time listeners
  useEffect(() => {
    if (!user?.id) return;

    const socket = RealtimeService.connect();
    setIsSocketConnected(Boolean(socket?.connected));

    const onConnect = () => setIsSocketConnected(true);
    const onDisconnect = () => {
      setIsSocketConnected(false);
      setIsOtherUserOnline(false);
      setIsOtherTyping(false);
    };

    RealtimeService.onConnect(onConnect);
    RealtimeService.onDisconnect(onDisconnect);

    // Incoming real-time chat message via WebSocket
    const handleNewMessage = (msg: unknown) => {
      if (!msg || typeof msg !== "object") return;
      const m = msg as ChatMessageItem;
      const currentActiveId = activeRoomIdRef.current;

      // Update room in channels list preview instantly
      setRooms((prevRooms) => {
        const found = prevRooms.some((r) => r.id === m.roomId);
        if (!found) {
          loadRooms(true);
          return prevRooms;
        }
        return prevRooms.map((room) => {
          if (room.id === m.roomId) {
            return {
              ...room,
              updatedAt: m.createdAt || new Date().toISOString(),
              messages: [m],
              unreadCount: room.id !== currentActiveId ? (room.unreadCount || 0) + 1 : 0,
            };
          }
          return room;
        });
      });

      // If this message belongs to currently open active room:
      if (currentActiveId && m.roomId === currentActiveId) {
        // Prevent duplicate if already optimistically added
        setSelectedRoom((prev) => {
          if (!prev || prev.id !== currentActiveId) return prev;
          const exists = prev.messages?.some((existing) => existing.id === m.id || (existing.status === "sending" && existing.message === m.message));

          if (exists) {
            // Replace temporary sending message with confirmed server message
            return {
              ...prev,
              messages: prev.messages?.map((existing) =>
                existing.id === m.id || (existing.status === "sending" && existing.message === m.message)
                  ? { ...m, status: "sent" }
                  : existing
              ),
            };
          }

          // New incoming message from the other party
          if (soundEnabled && m.senderId !== user.id) {
            playChime("received");
          }

          return {
            ...prev,
            messages: [...(prev.messages || []), { ...m, status: "sent" }],
          };
        });

        // Mark as seen
        if (m.senderId !== user.id) {
          ChatService.markSeen(currentActiveId).catch(() => null);
        }

        setTimeout(() => scrollToBottom(true), 50);
      }
    };

    // Typing indicator
    const handleTyping = (payload: { roomId: string; userId: string; isTyping: boolean }) => {
      if (payload.roomId === activeRoomIdRef.current && payload.userId !== user.id) {
        setIsOtherTyping(payload.isTyping);
      }
    };

    // Presence update
    const handlePresence = (payload: { userId: string; isOnline: boolean }) => {
      setSelectedRoom((prev) => {
        if (!prev) return null;
        const otherPartyId = isAdmin ? prev.customerId : prev.adminId;
        if (otherPartyId === payload.userId) {
          setIsOtherUserOnline(payload.isOnline);
        }
        return prev;
      });
    };

    // Room created
    const handleRoomCreated = (room: unknown) => {
      if (room && typeof room === "object" && "id" in room) {
        const r = room as ChatRoom;
        setRooms((prev) => [r, ...prev.filter((item) => item.id !== r.id)]);
      }
    };

    RealtimeService.on("chat:message", handleNewMessage);
    RealtimeService.on("chat:typing", handleTyping);
    RealtimeService.on("presence:update", handlePresence);
    RealtimeService.on("chat:room-created", handleRoomCreated);

    return () => {
      RealtimeService.off("chat:message", handleNewMessage);
      RealtimeService.off("chat:typing", handleTyping);
      RealtimeService.off("presence:update", handlePresence);
      RealtimeService.off("chat:room-created", handleRoomCreated);
    };
  }, [user?.id, isAdmin, soundEnabled, scrollToBottom]);

  // Select room & join WebSocket channel room
  const handleSelectRoom = async (room: ChatRoom) => {
    if (activeRoomIdRef.current) {
      RealtimeService.leaveChat(activeRoomIdRef.current);
    }

    setSelectedRoom(room);
    setIsOtherTyping(false);
    RealtimeService.joinChat(room.id);

    // Clear unread count in local list
    setRooms((prev) =>
      prev.map((r) => (r.id === room.id ? { ...r, unreadCount: 0 } : r))
    );

    try {
      const fullRoom = (await ChatService.getRoomById(room.id)) as ChatRoom;
      if (fullRoom && fullRoom.id) {
        setSelectedRoom(fullRoom);

        // Check if other party is online
        const otherPartyId = isAdmin ? fullRoom.customerId : fullRoom.adminId;
        if (otherPartyId) {
          RealtimeService.checkPresence([otherPartyId], (res) => {
            setIsOtherUserOnline(Boolean(res[otherPartyId]));
          });
        } else if (!isAdmin) {
          // If customer and engineer not yet assigned, CAM engineering desk is live on duty
          setIsOtherUserOnline(true);
        }
      }
      await ChatService.markSeen(room.id);
      setTimeout(() => scrollToBottom(false), 80);
    } catch {
      // Keep loaded
    }
  };

  useEffect(() => {
    scrollToBottom(true);
  }, [selectedRoom?.messages?.length, isOtherTyping, scrollToBottom]);

  // Handle Input Typing with instant socket dispatch
  const handleInputChange = (text: string) => {
    setInputMessage(text);
    if (!selectedRoom?.id) return;

    RealtimeService.sendTyping(selectedRoom.id, true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (selectedRoom?.id) {
        RealtimeService.sendTyping(selectedRoom.id, false);
      }
    }, 1500);
  };

  // Instant Optimistic Message Dispatching
  const handleSendMessage = async (textOverride?: string, files?: string[]) => {
    const rawMessage = (textOverride || inputMessage).trim();
    if (!selectedRoom || (!rawMessage && (!files || files.length === 0))) return;

    const roomId = selectedRoom.id;
    const tempId = `temp-${Date.now()}`;
    const timestamp = new Date().toISOString();

    // Optimistic UI message
    const optimisticMessage: ChatMessageItem = {
      id: tempId,
      roomId,
      senderId: user?.id || "",
      message: rawMessage,
      files: files || [],
      createdAt: timestamp,
      status: "sending",
      sender: {
        id: user?.id || "",
        name: user?.name || "You",
        role: user?.role || "CUSTOMER",
      },
    };

    // Immediately update messages in active room
    setSelectedRoom((prev) => {
      if (!prev || prev.id !== roomId) return prev;
      return {
        ...prev,
        messages: [...(prev.messages || []), optimisticMessage],
      };
    });

    // Immediately update sidebar room preview
    setRooms((prev) =>
      prev.map((r) =>
        r.id === roomId
          ? {
              ...r,
              updatedAt: timestamp,
              messages: [optimisticMessage],
            }
          : r
      )
    );

    // Reset inputs immediately so user can keep typing with 0 lag
    if (!textOverride) {
      setInputMessage("");
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    RealtimeService.sendTyping(roomId, false);

    if (soundEnabled) {
      playChime("sent");
    }
    setTimeout(() => scrollToBottom(true), 30);

    // Send HTTP POST (which triggers Prisma insert + server WebSocket broadcast)
    try {
      const serverMsg = (await ChatService.sendMessage(roomId, {
        message: rawMessage,
        files: files || [],
      })) as ChatMessageItem;

      // Mark message confirmed
      setSelectedRoom((prev) => {
        if (!prev || prev.id !== roomId) return prev;
        return {
          ...prev,
          messages: prev.messages?.map((m) =>
            m.id === tempId ? { ...serverMsg, status: "sent" } : m
          ),
        };
      });
    } catch (err) {
      // Mark as failed
      setSelectedRoom((prev) => {
        if (!prev || prev.id !== roomId) return prev;
        return {
          ...prev,
          messages: prev.messages?.map((m) =>
            m.id === tempId ? { ...m, status: "failed" } : m
          ),
        };
      });
      toast.error(err instanceof Error ? err.message : "Failed to deliver message.");
    }
  };

  // Create room
  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) {
      toast.error("Please enter a chat topic/subject.");
      return;
    }

    try {
      setIsCreatingRoom(true);
      const room = (await ChatService.createRoom({
        subject: newSubject.trim(),
      })) as ChatRoom;

      if (firstMessage.trim() && room && room.id) {
        await ChatService.sendMessage(room.id, { message: firstMessage.trim() });
      }

      toast.success("Live engineering channel connected!");
      setNewSubject("");
      setFirstMessage("");
      setIsNewRoomOpen(false);
      await loadRooms(true);
      if (room && room.id) {
        handleSelectRoom(room);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to open live chat room.");
    } finally {
      setIsCreatingRoom(false);
    }
  };

  // Close room
  const handleCloseRoom = async (roomId: string) => {
    if (!confirm("Are you sure you want to end this live engineering session?")) return;

    try {
      await ChatService.closeRoom(roomId);
      toast.success("Live engineering session concluded.");
      await loadRooms(true);
      if (selectedRoom?.id === roomId) {
        setSelectedRoom((prev) => (prev ? { ...prev, status: "CLOSED" } : null));
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to close room.");
    }
  };

  // Copy Room ID
  const copyRoomId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Copied Room ID to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Send attached file
  const handleSendFileAttachment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileUrlInput.trim()) {
      toast.error("Please provide a valid file URL or Gerber link.");
      return;
    }
    const cleanUrl = fileUrlInput.trim();
    const comment = fileComment.trim() || `Attached CAD/Gerber file: ${cleanUrl.split("/").pop()}`;
    handleSendMessage(comment, [cleanUrl]);
    setFileUrlInput("");
    setFileComment("");
    setIsFileModalOpen(false);
    toast.success("File attached to live channel.");
  };

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;

      const subject = (room.subject || "").toLowerCase();
      const id = (room.id || "").toLowerCase();
      const customer = (room.customer?.name || room.customer?.email || "").toLowerCase();
      const admin = (room.admin?.name || room.admin?.email || "").toLowerCase();

      return subject.includes(q) || id.includes(q) || customer.includes(q) || admin.includes(q);
    });
  }, [rooms, search]);

  const otherParty = useMemo(() => {
    if (!selectedRoom) return null;
    return isAdmin ? selectedRoom.customer : selectedRoom.admin || { name: "Senior CAM Engineer", role: "ADMIN" };
  }, [selectedRoom, isAdmin]);

  return (
    <div className="space-y-6">
      {/* Top Banner with Realtime Status Beacon */}
      <section className="relative overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0b1220] p-6 sm:p-8 shadow-sm dark:shadow-2xl">
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-[100px]" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
                <span className="size-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                CAM Real-Time Console
              </span>

              <span className="text-xs text-slate-300 dark:text-slate-700">•</span>

              {/* WebSocket Indicator Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-medium bg-slate-50 dark:bg-[#070b14] border-slate-200 dark:border-slate-800">
                {isSocketConnected ? (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-mono font-semibold text-[10px]">
                      WebSocket Live Active
                    </span>
                  </>
                ) : (
                  <>
                    <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-amber-600 dark:text-amber-400 font-mono font-semibold text-[10px]">
                      Connecting Socket...
                    </span>
                  </>
                )}
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <MessageCircle className="size-8 text-emerald-600 dark:text-emerald-400" />
              <span>CAM Live Engineering Chat</span>
            </h1>

            <p className="mt-1.5 max-w-2xl text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {isAdmin
                ? "Direct interactive WebSocket channel with customers. Review Gerber files, confirm impedance stackups, and issue real-time CAM engineering approvals."
                : "Instant peer-to-peer live chat with Senior Feitian CAM Engineers. Instant response for PCB design rule clearance, drill files, and production scheduling."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Audio Toggle */}
            <Button
              onClick={() => setSoundEnabled((prev) => !prev)}
              variant="outline"
              size="sm"
              title={soundEnabled ? "Mute notification chimes" : "Enable notification chimes"}
              className="h-11 px-3.5 rounded-xl border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
            >
              {soundEnabled ? (
                <Volume2 className="size-4 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <VolumeX className="size-4 text-slate-400" />
              )}
            </Button>

            <Button
              onClick={() => loadRooms(true)}
              disabled={refreshing}
              variant="outline"
              className="h-11 px-4 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-[#070b14] dark:hover:bg-slate-800 dark:text-slate-200 text-xs font-bold gap-2 cursor-pointer"
            >
              <RefreshCcw className={cn("size-3.5", refreshing && "animate-spin")} />
              <span>Refresh</span>
            </Button>

            <Button
              onClick={() => setIsNewRoomOpen(true)}
              className="h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-2 shadow-xs cursor-pointer"
            >
              <Plus className="size-4" />
              <span>New Engineering Channel</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Main Chat Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[660px]">
        {/* Left Column: Channels List (5 cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0b1220] p-4 shadow-sm space-y-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search channels by topic, customer, or ID..."
                className="h-10 pl-10 pr-4 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070b14] text-xs font-medium"
              />
            </div>
          </div>

          {/* Channels Scroll Area */}
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0b1220] p-3 shadow-sm flex-1 overflow-y-auto max-h-[600px] space-y-2">
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-400 flex flex-col items-center justify-center">
                <Loader2 className="size-6 animate-spin text-emerald-600 mb-2" />
                Connecting live channels...
              </div>
            ) : filteredRooms.length > 0 ? (
              filteredRooms.map((room) => {
                const isSelected = selectedRoom?.id === room.id;
                const party = isAdmin ? room.customer : room.admin || { name: "Senior CAM Engineer" };
                const lastMsg = room.messages?.[0]?.message || (room.messages?.[0]?.files?.length ? "📎 File attachment" : "New channel ready");

                return (
                  <div
                    key={room.id}
                    onClick={() => handleSelectRoom(room)}
                    className={cn(
                      "p-3.5 rounded-xl border transition-all cursor-pointer text-xs relative overflow-hidden",
                      isSelected
                        ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/25 shadow-xs"
                        : "border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/60"
                    )}
                  >
                    {/* Unread indicator badge */}
                    {Boolean(room.unreadCount && room.unreadCount > 0) && (
                      <span className="absolute top-2.5 right-2.5 size-4 rounded-full bg-emerald-600 text-white font-mono text-[9px] font-bold flex items-center justify-center shadow-xs">
                        {room.unreadCount}
                      </span>
                    )}

                    <div className="flex items-center justify-between gap-2 mb-1.5 pr-5">
                      <div className="flex items-center gap-1.5 truncate">
                        <span
                          className={cn(
                            "size-2 rounded-full shrink-0",
                            room.status === "OPEN" ? "bg-emerald-500" : "bg-slate-400"
                          )}
                        />
                        <span className="font-bold text-slate-900 dark:text-white truncate">
                          {party?.name || "Customer Client"}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] font-black uppercase rounded-full px-2 py-0.2",
                          room.status === "OPEN"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                            : "bg-slate-100 text-slate-600 border-slate-300 dark:bg-slate-800 dark:text-slate-400"
                        )}
                      >
                        {room.status}
                      </Badge>
                    </div>

                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 text-xs">
                      {room.subject || "General Engineering Review"}
                    </h4>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                      {lastMsg}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                      <span className="font-mono">#{room.id.slice(0, 8).toUpperCase()}</span>
                      <span>
                        {new Date(room.updatedAt || room.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">
                <MessageCircle className="size-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                <p className="font-bold text-slate-600 dark:text-slate-400">No active chat channels</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Click "New Engineering Channel" above to start a live CAM chat.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Active Live Chat Window (7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          {selectedRoom ? (
            <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0b1220] shadow-sm flex flex-col h-full overflow-hidden">
              {/* Active Room Top Header */}
              <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="relative size-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
                    <ShieldCheck className="size-5" />
                    <span
                      className={cn(
                        "absolute -bottom-0.5 -right-0.5 size-3 rounded-full ring-2 ring-white dark:ring-[#0b1220]",
                        isOtherUserOnline ? "bg-emerald-400" : "bg-slate-400"
                      )}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">
                        {selectedRoom.subject || "Live CAM Engineering Consultation"}
                      </h3>
                      <button
                        type="button"
                        onClick={() => copyRoomId(selectedRoom.id)}
                        className="font-mono text-[10px] text-slate-400 hover:text-emerald-600 flex items-center gap-1 cursor-pointer"
                        title="Copy Room ID"
                      >
                        <span>#{selectedRoom.id.slice(0, 8)}</span>
                        {copiedId === selectedRoom.id ? <Check className="size-2.5 text-emerald-600" /> : <Copy className="size-2.5" />}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-semibold mt-0.5">
                      <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                        {otherParty?.name || (isAdmin ? "Customer" : "Feitian Senior CAM Specialist")}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span
                        className={cn(
                          "flex items-center gap-1 font-mono text-[10px]",
                          isOtherUserOnline
                            ? "text-emerald-600 dark:text-emerald-400 font-bold"
                            : "text-slate-400"
                        )}
                      >
                        <span
                          className={cn(
                            "size-1.5 rounded-full",
                            isOtherUserOnline ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                          )}
                        />
                        {isOtherUserOnline ? "Online Now" : "Away"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsFileModalOpen(true)}
                    className="rounded-xl border-slate-300 dark:border-slate-700 text-xs font-bold gap-1 text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    <Paperclip className="size-3.5" />
                    <span>Attach CAD / File</span>
                  </Button>

                  {selectedRoom.status === "OPEN" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCloseRoom(selectedRoom.id)}
                      className="rounded-xl border-slate-300 dark:border-slate-700 hover:bg-rose-50 hover:text-rose-600 text-xs font-bold gap-1 shrink-0 cursor-pointer"
                    >
                      <Lock className="size-3.5" />
                      <span>Conclude</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Message History Viewport */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[440px] min-h-[360px] bg-slate-50/30 dark:bg-[#070b14]/50">
                {selectedRoom.messages && selectedRoom.messages.length > 0 ? (
                  selectedRoom.messages.map((msg, index) => {
                    const isStaff = msg.sender?.role === "ADMIN" || msg.sender?.role === "SUPER_ADMIN";
                    const isMe = msg.senderId === user?.id;

                    return (
                      <div
                        key={msg.id || index}
                        className={cn(
                          "flex flex-col max-w-[82%] transition-opacity",
                          isMe ? "ml-auto items-end" : "mr-auto items-start",
                          msg.status === "sending" && "opacity-75"
                        )}
                      >
                        <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400">
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            {msg.sender?.name || (isMe ? "You" : isStaff ? "Feitian CAM Engineer" : "Customer Client")}
                          </span>
                          {isStaff && (
                            <span className="inline-flex items-center gap-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-1 py-0.2 text-[9px] font-black uppercase">
                              <ShieldCheck className="size-2.5" /> CAM Specialist
                            </span>
                          )}
                          <span>•</span>
                          <span>
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        <div
                          className={cn(
                            "p-3 rounded-2xl text-xs leading-relaxed shadow-xs whitespace-pre-wrap break-words",
                            isMe
                              ? "bg-emerald-600 text-white rounded-tr-xs"
                              : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700 rounded-tl-xs"
                          )}
                        >
                          {msg.message}

                          {msg.files && msg.files.length > 0 && (
                            <div className="mt-2.5 pt-2 border-t border-white/20 dark:border-slate-700/60 space-y-1.5">
                              {msg.files.map((file, fi) => (
                                <a
                                  key={fi}
                                  href={file}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={cn(
                                    "flex items-center gap-2 p-2 rounded-xl text-[11px] font-mono font-medium transition",
                                    isMe
                                      ? "bg-emerald-700/60 hover:bg-emerald-700 text-white"
                                      : "bg-slate-100 dark:bg-slate-900/60 hover:bg-slate-200 dark:hover:bg-slate-900 text-emerald-600 dark:text-emerald-400"
                                  )}
                                >
                                  <FileCode className="size-3.5 shrink-0" />
                                  <span className="truncate flex-1">{file.split("/").pop() || "CAD_File_Attachment"}</span>
                                  <span className="text-[10px] opacity-75 uppercase">Open ↗</span>
                                </a>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Message status ticks */}
                        {isMe && (
                          <div className="mt-0.5 px-1 flex items-center gap-1 text-[10px] text-slate-400">
                            {msg.status === "sending" ? (
                              <>
                                <Clock className="size-2.5 animate-spin text-slate-400" />
                                <span>Sending...</span>
                              </>
                            ) : msg.status === "failed" ? (
                              <span className="text-rose-500 font-bold">Failed to send</span>
                            ) : (
                              <>
                                <CheckCheck className="size-3 text-emerald-500" />
                                <span>Delivered</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-xs text-slate-400">
                    <Sparkles className="size-6 text-emerald-500 mx-auto mb-2" />
                    Channel open! Send a message or select a rapid CAM diagnostic action below.
                  </div>
                )}

                {/* Live Real-time Typing Bubble Indicator */}
                {isOtherTyping && (
                  <div className="flex items-center gap-2 mr-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 rounded-2xl rounded-tl-xs shadow-xs text-xs text-slate-600 dark:text-slate-300 animate-in fade-in duration-200">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {otherParty?.name || "CAM Engineer"}
                    </span>
                    <span>is typing</span>
                    <span className="flex items-center gap-1 pl-1">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick CAM Engineering Action Pills */}
              {selectedRoom.status === "OPEN" && (
                <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 overflow-x-auto flex items-center gap-1.5 scrollbar-none shrink-0">
                  <span className="text-[10px] font-bold uppercase text-slate-400 pl-2 shrink-0">CAM Actions:</span>
                  {CAM_QUICK_ACTIONS.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSendMessage(item.text)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 transition whitespace-nowrap cursor-pointer shadow-2xs"
                      >
                        <Icon className="size-3 text-emerald-600 dark:text-emerald-400" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Chat Input Bar with Smooth Dispatch */}
              {selectedRoom.status === "OPEN" ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="p-3.5 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0b1220] flex items-center gap-2 shrink-0"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsFileModalOpen(true)}
                    className="size-11 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0 cursor-pointer"
                    title="Attach file or Gerber URL"
                  >
                    <Paperclip className="size-4" />
                  </Button>

                  <Input
                    value={inputMessage}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type engineering message... (Press Enter to send)"
                    className="h-11 rounded-xl text-xs border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070b14] focus-visible:ring-emerald-500"
                  />

                  <Button
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className="h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 shrink-0 shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    <SendHorizontal className="size-4" />
                    <span className="hidden sm:inline">Send</span>
                  </Button>
                </form>
              ) : (
                <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
                  <Lock className="size-3.5" />
                  <span>This live session has been closed. Open a new engineering channel if needed.</span>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1220] h-full flex flex-col items-center justify-center p-12 text-center text-xs">
              <div className="size-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 shadow-sm">
                <MessageCircle className="size-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Live CAM Consultation</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-4">
                Select a channel from the list on the left to chat in real-time, or open a new channel to discuss PCB engineering requirements.
              </p>
              <Button
                onClick={() => setIsNewRoomOpen(true)}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 cursor-pointer"
              >
                <Plus className="size-4" />
                <span>Open New Channel</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* "New Engineering Channel" Modal */}
      <Dialog open={isNewRoomOpen} onOpenChange={setIsNewRoomOpen}>
        <DialogContent className="sm:max-w-lg w-[95vw] p-0 overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0b1220] shadow-2xl">
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 shrink-0" />

          <DialogHeader className="px-6 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <DialogTitle className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <MessageCircle className="size-5 text-emerald-600 dark:text-emerald-400" />
              <span>Connect with CAM Engineering Specialist</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Establish a dedicated live WebSocket channel with senior production engineers.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateRoom} className="p-6 space-y-4 text-xs">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Channel Topic / Scope *
              </Label>
              <Input
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="e.g. Order #CC656600 Impedance Stackup & DFM Review"
                className="h-10 text-xs rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070b14]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Initial Message (Optional)
              </Label>
              <Textarea
                value={firstMessage}
                onChange={(e) => setFirstMessage(e.target.value)}
                placeholder="Provide initial details or questions for the CAM engineer..."
                rows={4}
                className="text-xs rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070b14]"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsNewRoomOpen(false)}
                className="rounded-xl text-xs font-bold px-4 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreatingRoom || !newSubject.trim()}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 gap-1.5 cursor-pointer"
              >
                {isCreatingRoom ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin mr-1" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Zap className="size-3.5" />
                    Launch Channel
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Attach CAD/Gerber Modal */}
      <Dialog open={isFileModalOpen} onOpenChange={setIsFileModalOpen}>
        <DialogContent className="sm:max-w-md w-[95vw] p-0 overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0b1220] shadow-2xl">
          <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 to-teal-500 shrink-0" />

          <DialogHeader className="px-6 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <DialogTitle className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Paperclip className="size-4 text-emerald-600 dark:text-emerald-400" />
              <span>Attach CAD / Gerber Reference</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Share Gerber zip files, Excellon drill files, or technical PDF schematics with the CAM engineer.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSendFileAttachment} className="p-6 space-y-4 text-xs">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                File / Gerber URL *
              </Label>
              <Input
                value={fileUrlInput}
                onChange={(e) => setFileUrlInput(e.target.value)}
                placeholder="https://storage.../gerber-revision-v2.zip"
                className="h-10 text-xs rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070b14]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Engineering Note (Optional)
              </Label>
              <Input
                value={fileComment}
                onChange={(e) => setFileComment(e.target.value)}
                placeholder="e.g. Updated layer 2 GND plane with expanded thermal relief."
                className="h-10 text-xs rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#070b14]"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFileModalOpen(false)}
                className="rounded-xl text-xs font-bold px-4 cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!fileUrlInput.trim()}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 gap-1.5 cursor-pointer"
              >
                <Paperclip className="size-3.5" />
                Attach to Chat
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
