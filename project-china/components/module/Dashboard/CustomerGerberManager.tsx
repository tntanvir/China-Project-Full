"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Cpu,
  Download,
  ExternalLink,
  Eye,
  FileArchive,
  FileCode,
  FileText,
  HelpCircle,
  Layers,
  Loader2,
  MessageCircle,
  PackageCheck,
  Plus,
  RefreshCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  UploadCloud,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { GerberService } from "@/services/gerber.service";
import { QuoteService } from "@/services/quote.service";
import { useAuthStore } from "@/store/authStore";

export type GerberRecord = {
  id: string;
  userId: string;
  quoteId?: string;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  status: "REVIEWING" | "APPROVED" | "REJECTED" | string;
  message?: string;
  createdAt: string;
  updatedAt: string;
  quote?: {
    id: string;
    name: string;
    layerCount: number;
  };
};

const statusStyles: Record<string, { label: string; badgeClass: string; icon: typeof CheckCircle2 }> = {
  REVIEWING: {
    label: "Under DFM Review",
    badgeClass: "bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
    icon: Clock,
  },
  APPROVED: {
    label: "DFM Approved",
    badgeClass: "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Revision Required",
    badgeClass: "bg-red-100 text-red-900 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800",
    icon: AlertCircle,
  },
};

const formatBytes = (bytes?: number) => {
  if (!bytes || bytes === 0) return "ZIP Archive";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const getDownloadUrl = (url: string, filename?: string) => {
  if (!url) return "#";
  const nameParam = filename ? `&name=${encodeURIComponent(filename)}` : "";
  return `/api/download?url=${encodeURIComponent(url)}${nameParam}`;
};

export default function CustomerGerberManager() {
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isLoading);
  const [files, setFiles] = useState<GerberRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Upload Modal State
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string>("NONE");
  const [availableQuotes, setAvailableQuotes] = useState<Array<{ id: string; name: string }>>([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await GerberService.getMyFiles();
      const list = Array.isArray(response) ? response : (response as { data?: GerberRecord[] })?.data || [];
      setFiles(list as GerberRecord[]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load Gerber files");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthLoading || !user) return;
    fetchFiles();
  }, [fetchFiles, isAuthLoading, user]);

  // Load quotes for attachment selector
  useEffect(() => {
    if (isAuthLoading || !user) return;
    async function loadQuotes() {
      try {
        const res = await QuoteService.getMyQuotes();
        const list = Array.isArray(res) ? res : (res as { data?: Array<{ id: string; name: string }> })?.data || [];
        setAvailableQuotes(list.map((q: any) => ({ id: q.id, name: q.name || "Custom PCB" })));
      } catch {
        // quotes optional
      }
    }
    loadQuotes();
  }, [isAuthLoading, user]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFiles.length) {
      toast.error("Please select at least one Gerber/CAD archive file");
      return;
    }

    setUploading(true);
    try {
      const quoteId = selectedQuoteId !== "NONE" ? selectedQuoteId : undefined;
      await GerberService.uploadFiles(selectedFiles, quoteId);
      toast.success(`${selectedFiles.length} Gerber file(s) uploaded successfully! DFM analysis initiated.`);
      setSelectedFiles([]);
      setUploadDialogOpen(false);
      await fetchFiles();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload Gerber files");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (gerberId: string, fileName: string) => {
    if (!confirm(`Are you sure you want to delete ${fileName}?`)) return;
    try {
      await GerberService.deleteFile(gerberId);
      toast.success(`Deleted ${fileName}`);
      await fetchFiles();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete file");
    }
  };

  // Filtered files
  const filteredFiles = useMemo(() => {
    return files.filter((f) => {
      const matchesSearch =
        !search ||
        f.fileName.toLowerCase().includes(search.toLowerCase()) ||
        (f.quote?.name || "").toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "ALL" || f.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [files, search, statusFilter]);

  // Derived stats
  const stats = useMemo(() => {
    const total = files.length;
    const reviewing = files.filter((f) => f.status === "REVIEWING").length;
    const approved = files.filter((f) => f.status === "APPROVED").length;
    const rejected = files.filter((f) => f.status === "REJECTED").length;

    return { total, reviewing, approved, rejected };
  }, [files]);

  return (
    <div className="space-y-6">
      {/* Personalized Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br from-white via-slate-50 to-emerald-50/40 p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-gradient-to-br dark:from-[#0b1220] dark:via-[#070b14] dark:to-emerald-950/20">
        <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-mono font-bold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
              <UploadCloud className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>CAM & DFM Review Center</span>
            </div>

            <h1 className="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Gerber Files & DFM Analysis
            </h1>
            <p className="mt-1.5 max-w-2xl text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Upload Gerber RS-274X, ODB++, Excellon drill files, and Pick-and-Place archives. Our automated and engineering CAM team verifies design rules before manufacturing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchFiles}
              disabled={loading}
              className="h-10 rounded-xl border-slate-300 bg-white hover:bg-slate-100 text-slate-700 dark:border-slate-800 dark:bg-[#070b14] dark:hover:bg-slate-800 dark:text-slate-200 font-bold text-xs gap-2"
            >
              <RefreshCcw className={`size-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </Button>

            <Button
              onClick={() => setUploadDialogOpen(true)}
              className="h-10 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs gap-2 shadow-lg shadow-emerald-500/20"
            >
              <UploadCloud className="size-4" />
              <span>Upload Gerber Package</span>
            </Button>
          </div>
        </div>
      </section>

      {/* KPI Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-[#0b1220]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Total Packages</p>
                {loading ? (
                  <Skeleton className="h-8 w-20 mt-2 rounded-lg" />
                ) : (
                  <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{stats.total}</p>
                )}
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">CAD files archived</p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <FileArchive className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-[#0b1220]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">DFM Approved</p>
                {loading ? (
                  <Skeleton className="h-8 w-20 mt-2 rounded-lg" />
                ) : (
                  <p className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.approved}</p>
                )}
                <p className="mt-0.5 text-[11px] text-emerald-600/80 dark:text-emerald-400/80 font-medium">Ready for cleanroom</p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400">
                <CheckCircle2 className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-[#0b1220]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Under Review</p>
                {loading ? (
                  <Skeleton className="h-8 w-20 mt-2 rounded-lg" />
                ) : (
                  <p className="mt-2 text-2xl font-black text-purple-600 dark:text-purple-400">{stats.reviewing}</p>
                )}
                <p className="mt-0.5 text-[11px] text-purple-600/80 dark:text-purple-400/80 font-medium">Active DFM audit</p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                <Clock className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-[#0b1220]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Revision Needed</p>
                {loading ? (
                  <Skeleton className="h-8 w-20 mt-2 rounded-lg" />
                ) : (
                  <p className="mt-2 text-2xl font-black text-red-600 dark:text-red-400">{stats.rejected}</p>
                )}
                <p className="mt-0.5 text-[11px] text-red-600/80 dark:text-red-400/80 font-medium">Design rule flags</p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400">
                <AlertCircle className="size-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Files Table & Upload Guidance */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Left: Files Table */}
        <div className="space-y-4">
          <Card className="rounded-2xl border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-[#0b1220]">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search file name, associated quote..."
                  className="pl-10 h-10 rounded-xl bg-slate-50 border-slate-200 dark:bg-[#070b14] dark:border-slate-800 text-xs sm:text-sm font-medium"
                />
              </div>

              <div className="w-full sm:w-auto flex items-center gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px] h-10 rounded-xl bg-slate-50 border-slate-200 dark:bg-[#070b14] dark:border-slate-800 text-xs font-semibold">
                    <SelectValue placeholder="Status: All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Statuses</SelectItem>
                    <SelectItem value="REVIEWING">Under Review</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Needs Revision</SelectItem>
                  </SelectContent>
                </Select>

                {(search || statusFilter !== "ALL") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearch("");
                      setStatusFilter("ALL");
                    }}
                    className="text-xs text-slate-500"
                  >
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </Card>

          <Card className="rounded-2xl border-slate-200 bg-white shadow-2xs overflow-hidden dark:border-slate-800 dark:bg-[#0b1220]">
            <CardHeader className="border-b border-slate-100 p-5 dark:border-slate-800/80">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Archived Gerber Packages
                  </CardTitle>
                  {loading ? (
                    <Skeleton className="h-3.5 w-32 mt-1.5" />
                  ) : (
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                      Showing {filteredFiles.length} of {files.length} packages
                    </CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {loading ? (
                <div className="overflow-x-auto">
                  <Table className="min-w-[680px]">
                    <TableHeader className="bg-slate-50/80 dark:bg-slate-900/40">
                      <TableRow>
                        <TableHead className="font-bold text-xs">File Package</TableHead>
                        <TableHead className="font-bold text-xs">Associated Quote</TableHead>
                        <TableHead className="font-bold text-xs">Uploaded</TableHead>
                        <TableHead className="font-bold text-xs">DFM Status</TableHead>
                        <TableHead className="font-bold text-xs text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[1, 2, 3, 4].map((i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Skeleton className="size-9 rounded-lg shrink-0" />
                              <div className="space-y-1.5">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-3 w-20" />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-4 w-28" />
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Skeleton className="h-3.5 w-24" />
                              <Skeleton className="h-3 w-16" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Skeleton className="h-5 w-24 rounded-full" />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Skeleton className="h-8 w-20 rounded-lg" />
                              <Skeleton className="h-8 w-8 rounded-lg" />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : filteredFiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800/60 dark:text-slate-500 mb-4">
                    <UploadCloud className="size-7" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                    {search || statusFilter !== "ALL" ? "No matching Gerber files found" : "No Gerber files uploaded yet"}
                  </h3>
                  <p className="mt-1.5 max-w-md text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Upload your Gerber RS-274X zip archive to trigger our automated DFM check and CAM verification.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                    <Button
                      onClick={() => setUploadDialogOpen(true)}
                      className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-2"
                    >
                      <UploadCloud className="size-3.5" />
                      <span>Upload Gerber Zip</span>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-xl border-slate-300 dark:border-slate-800 text-xs font-bold"
                    >
                      <Link href="/pcb-quote">
                        <span>Instant PCB Calculator</span>
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table className="min-w-[680px]">
                    <TableHeader className="bg-slate-50/80 dark:bg-slate-900/40">
                      <TableRow>
                        <TableHead className="font-bold text-xs">File Package</TableHead>
                        <TableHead className="font-bold text-xs">Associated Quote</TableHead>
                        <TableHead className="font-bold text-xs">Uploaded</TableHead>
                        <TableHead className="font-bold text-xs">DFM Status</TableHead>
                        <TableHead className="font-bold text-xs text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFiles.map((file) => {
                        const statusInfo = statusStyles[file.status] || {
                          label: file.status,
                          badgeClass: "bg-slate-100 text-slate-800",
                          icon: Clock,
                        };
                        const StatusIcon = statusInfo.icon;

                        return (
                          <TableRow key={file.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                                  <FileArchive className="size-4" />
                                </div>
                                <div>
                                  <p className="font-bold text-xs text-slate-900 dark:text-slate-100">
                                    {file.fileName}
                                  </p>
                                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                    {formatBytes(file.fileSize)}
                                  </p>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell>
                              {file.quote ? (
                                <div>
                                  <p className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                                    {file.quote.name}
                                  </p>
                                  <p className="text-[11px] text-slate-500">
                                    {file.quote.layerCount} Layers PCB
                                  </p>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-400">Standalone Archive</span>
                              )}
                            </TableCell>

                            <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                              {new Date(file.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </TableCell>

                            <TableCell>
                              <Badge
                                variant="outline"
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border gap-1 inline-flex items-center ${statusInfo.badgeClass}`}
                              >
                                <StatusIcon className="size-3" />
                                <span>{statusInfo.label}</span>
                              </Badge>
                              {file.message && (
                                <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                                  {file.message}
                                </p>
                              )}
                            </TableCell>

                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  asChild
                                  variant="outline"
                                  size="sm"
                                  className="h-7 px-2.5 rounded-lg border-slate-200 dark:border-slate-800 text-xs font-semibold gap-1"
                                >
                                  <a
                                    href={getDownloadUrl(file.fileUrl, file.fileName)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Download className="size-3" />
                                    <span>Download</span>
                                  </a>
                                </Button>

                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(file.id, file.fileName)}
                                  className="h-7 px-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs"
                                  title="Delete Gerber file"
                                >
                                  <Trash2 className="size-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: DFM Checklist & Factory Standards */}
        <aside className="space-y-4">
          <Card className="rounded-2xl border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-[#0b1220] space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
              <ShieldCheck className="size-4 text-emerald-600" />
              <span>Design for Manufacturing (DFM)</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              WuPing FeiTian cleanroom automated CAM engine evaluates all submissions against high-yield fab constraints.
            </p>

            <div className="space-y-2.5 text-xs border-t border-slate-100 dark:border-slate-800/80 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Min Trace / Spacing:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">3 / 3 mil (0.075mm)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Min Mechanical Drill:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">0.15 mm</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Min Laser Microvia:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">0.075 mm</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Solder Mask Bridge:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">≥ 3 mil</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Supported Formats:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">RS-274X, ODB++, Excellon</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <Button
                asChild
                variant="outline"
                className="w-full h-9 rounded-xl border-slate-200 dark:border-slate-800 text-xs font-bold gap-2"
              >
                <Link href="/dashboard/chat">
                  <MessageCircle className="size-3.5 text-emerald-600" />
                  <span>Inquire with CAM Engineer</span>
                </Link>
              </Button>
            </div>
          </Card>

          <Card className="rounded-2xl border-slate-200 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent p-5 shadow-2xs dark:border-slate-800 dark:bg-[#0b1220]">
            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="size-4 text-emerald-600 dark:text-emerald-400" />
              <span>Free Engineering DFM</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every package is cross-checked by certified IPC CID+ engineers to catch acid traps, unrouted nets, and spacing violations before copper etch.
            </p>
          </Card>
        </aside>
      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <UploadCloud className="size-5 text-emerald-600" />
              <span>Upload Gerber / CAD Package</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Upload your zipped Gerber archive (.zip, .rar, .tar.gz) for automated DFM and cleanroom verification.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Drag and Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl transition cursor-pointer ${
                dragActive
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-slate-300 hover:border-emerald-500 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50"
              }`}
            >
              <input
                type="file"
                multiple
                accept=".zip,.rar,.tar,.gz,.7z,.gbr,.gerber"
                onChange={(e) => setSelectedFiles(Array.from(e.target.files || []))}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <UploadCloud className="size-10 text-emerald-600 mb-2" />
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Click to browse or drag & drop Gerber archive
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Accepted: .zip, .rar, .7z, .tar.gz (Max 100MB)
              </p>
            </div>

            {/* Selected files preview */}
            {selectedFiles.length > 0 && (
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                <p className="text-[11px] font-bold uppercase text-slate-500">Selected Files:</p>
                {selectedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileArchive className="size-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate font-medium">{file.name}</span>
                      <span className="text-[10px] text-slate-400">({formatBytes(file.size)})</span>
                    </div>
                    <button
                      onClick={() => setSelectedFiles((prev) => prev.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-red-500 transition ml-2"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Link to Quote */}
            {availableQuotes.length > 0 && (
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Attach to Saved Quote (Optional)</Label>
                <Select value={selectedQuoteId} onValueChange={setSelectedQuoteId}>
                  <SelectTrigger className="h-9 rounded-xl text-xs">
                    <SelectValue placeholder="Select a quote or standalone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NONE">Standalone Package (No quote attached)</SelectItem>
                    {availableQuotes.map((q) => (
                      <SelectItem key={q.id} value={q.id}>
                        {q.name} (#{q.id.slice(0, 8)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedFiles([]);
                setUploadDialogOpen(false);
              }}
              disabled={uploading}
              className="text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleUploadSubmit}
              disabled={uploading || selectedFiles.length === 0}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5"
            >
              {uploading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Uploading Archive...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="size-3.5" />
                  <span>Submit for DFM Review</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

