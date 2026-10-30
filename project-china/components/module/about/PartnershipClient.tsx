"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2,
  Users,
  GraduationCap,
  ShieldCheck,
  Award,
  Zap,
  Globe2,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Sparkles,
  Cpu,
  HelpCircle,
  FileText,
  Mail,
  Send,
  Loader2,
  Check,
  ExternalLink,
  Layers,
  Activity,
  ArrowUpRight,
  Clock,
  Flame,
  Search,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  SlidersHorizontal,
  Handshake,
  Network,
  Radio,
  Boxes,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/components/providers/language-provider";
import { getPartnershipTranslation } from "@/lib/partnership-translations";

export default function PartnershipClient() {
  const { locale } = useLanguage();
  const t = getPartnershipTranslation(locale);

  // Active track selection state
  const [selectedTrack, setSelectedTrack] = useState<string>("bsy-alliance");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [faqSearchQuery, setFaqSearchQuery] = useState<string>("");

  // Interactive BSY Tech phase comparison tab
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);

  // Form states
  const [formData, setFormData] = useState({
    company: "",
    name: "",
    email: "",
    phone: "",
    track: "bsy-alliance",
    volume: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelectTrackAndScroll = (trackId: string) => {
    setSelectedTrack(trackId);
    setFormData((prev) => ({ ...prev, track: trackId }));
    const formElement = document.getElementById("partner-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  // Filter FAQs based on search
  const filteredFaqs = t.faq.items.filter((item) => {
    return (
      faqSearchQuery === "" ||
      item.q.toLowerCase().includes(faqSearchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(faqSearchQuery.toLowerCase())
    );
  });

  return (
    <main
      key={locale}
      className="min-h-screen bg-[#f8fafc] dark:bg-[#070b14] text-slate-900 dark:text-slate-100 font-sans pb-32 relative overflow-x-hidden selection:bg-emerald-600 selection:text-white"
    >
      {/* ========================================================================= */}
      {/* AMBIENT TECH BACKGROUND LIGHTING (Futuristic glow & cyber grid)           */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top Glow Blob */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-emerald-600/15 via-teal-500/10 to-transparent rounded-full blur-3xl opacity-70 dark:opacity-40" />
        {/* Side Ambient Accents */}
        <div className="absolute top-[35%] -left-60 w-96 h-96 bg-cyan-500/10 dark:bg-cyan-600/15 rounded-full blur-3xl" />
        <div className="absolute top-[65%] -right-60 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-600/15 rounded-full blur-3xl" />
        {/* Cyber Circuit Dot Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 dark:opacity-30 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_20%,#000_60%,transparent_100%)]" />
      </div>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="relative z-10 pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md bg-white/70 dark:bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Column: Heading, Badges and Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/80 px-3.5 py-1 text-xs font-black text-emerald-700 dark:text-emerald-300 shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>{t.hero.badge}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-slate-900 dark:text-white">
                {t.hero.title}{" "}
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400">
                  {t.hero.highlight}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                {t.hero.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  asChild
                  size="lg"
                  className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black shadow-lg shadow-emerald-600/25 px-8 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <Link href="#bsy-alliance">
                    <Handshake className="mr-2 size-4" />
                    FT PCB & BSY Tech Alliance ↓
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-xl border-slate-300 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm text-slate-800 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold px-6 cursor-pointer"
                >
                  <Link href="#partner-form">
                    <Zap className="mr-2 size-4 text-emerald-500" />
                    {t.hero.applyBtn}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Column: 4 Key Factory & Network Metrics */}
            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-4">
                {t.hero.stats.map((stat, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/80 dark:bg-slate-800/70 backdrop-blur-md hover:border-emerald-500/50 transition-all shadow-sm group"
                  >
                    <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform duration-200 font-mono">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
                      {stat.label}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      {stat.sub}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. FEATURED SPOTLIGHT: STRATEGIC PARTNERSHIP: FT PCB & BSY TECH           */}
      {/* ========================================================================= */}
      <section id="bsy-alliance" className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 relative z-10 scroll-mt-20">
        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/30 dark:from-slate-900 dark:via-slate-900/95 dark:to-[#041a14] p-8 sm:p-12 lg:p-14 shadow-2xl relative overflow-hidden">
          {/* Subtle Cyber Glowing Blobs */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-500/15 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header Row */}
          <div className="relative z-10 max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-500/40 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
              <Sparkles className="size-3.5 text-emerald-500 animate-pulse" />
              <span>{t.bsyPartnership.badge}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
              {t.bsyPartnership.title}
            </h2>

            <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400 bg-clip-text text-transparent">
              {t.bsyPartnership.subtitle}
            </div>

            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 leading-relaxed pt-1">
              {t.bsyPartnership.description}
            </p>

            {/* Outbound Link CTA to BSY Tech */}
            <div className="pt-2">
              <a
                href={t.bsyPartnership.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs sm:text-sm shadow-md hover:bg-emerald-600 dark:hover:bg-emerald-400 dark:hover:text-slate-950 transition-all hover:scale-[1.02] cursor-pointer group"
              >
                <span>{t.bsyPartnership.learnMoreText}</span>
                <ArrowUpRight className="size-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Dual-Ecosystem Interactive Visual Diagram */}
          <div className="mt-12 pt-10 border-t border-slate-200/80 dark:border-slate-800/80 relative z-10">
            <div className="grid lg:grid-cols-12 gap-6 items-center">
              {/* Left Node: BSY Tech */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-white/90 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 shadow-lg space-y-4 relative group hover:border-emerald-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 text-white flex items-center justify-center font-black shadow-sm">
                      <Cpu className="size-6" />
                    </div>
                    <div>
                      <div className="font-black text-base text-slate-900 dark:text-white">
                        BSY Tech Company
                      </div>
                      <div className="text-[11px] text-cyan-600 dark:text-cyan-400 font-bold font-mono">
                        www.bsytech.com
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 text-[10px] font-bold">
                    Design Solutions
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Specialized hardware engineering design house: from conceptual electronic architecture and schematic capture to high-speed multi-layer layout, SI/PI simulation, and embedded firmware.
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono font-bold pt-2 border-t border-slate-100 dark:border-slate-700/60">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Check className="size-3 text-cyan-500" />
                    <span>Schematic Capture</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Check className="size-3 text-cyan-500" />
                    <span>High-Speed Layout</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Check className="size-3 text-cyan-500" />
                    <span>Signal & Power (SI/PI)</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Check className="size-3 text-cyan-500" />
                    <span>Embedded Firmware</span>
                  </div>
                </div>
              </div>

              {/* Center Handshake Bridge */}
              <div className="lg:col-span-2 flex flex-col items-center justify-center text-center py-4 lg:py-0">
                <div className="size-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 mb-2 relative">
                  <Handshake className="size-7" />
                  <span className="absolute -top-1 -right-1 size-3 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <div className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Zero Friction
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  Direct CAM Handshake
                </div>
              </div>

              {/* Right Node: FT PCB */}
              <div className="lg:col-span-5 p-6 rounded-2xl bg-white/90 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 shadow-lg space-y-4 relative group hover:border-emerald-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center font-black shadow-sm">
                      <Building2 className="size-6" />
                    </div>
                    <div>
                      <div className="font-black text-base text-slate-900 dark:text-white">
                        FT PCB Company
                      </div>
                      <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                        Direct Smart Factory Base
                      </div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold">
                    Precision Fab & SMT
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  National Little Giant factory: 15,000 m² physical facilities delivering high-precision multi-layer boards (up to 30L), HDI microvias, high-frequency Rogers RF, and turnkey SMT assembly.
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono font-bold pt-2 border-t border-slate-100 dark:border-slate-700/60">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Check className="size-3 text-emerald-500" />
                    <span>1 - 30 Layer Multi-Layer</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Check className="size-3 text-emerald-500" />
                    <span>Sub-3.5mil Trace/Space</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Check className="size-3 text-emerald-500" />
                    <span>Turnkey Yamaha SMT</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Check className="size-3 text-emerald-500" />
                    <span>100% 4-Wire Kelvin Test</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Alliance Highlights Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 relative z-10">
            {t.bsyPartnership.highlights.map((h, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-1.5 shadow-2xs hover:border-emerald-500/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    {h.tag}
                  </span>
                </div>
                <div className="font-extrabold text-xs text-slate-900 dark:text-white pt-1">
                  {h.title}
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {h.desc}
                </p>
              </div>
            ))}
          </div>

          {/* ===================================================================== */}
          {/* WHY THIS PARTNERSHIP BENEFITS YOUR HARDWARE PROJECTS                  */}
          {/* ===================================================================== */}
          <div className="mt-14 pt-10 border-t border-slate-200/80 dark:border-slate-800/80 relative z-10 space-y-6">
            <div className="max-w-3xl space-y-3">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {t.bsyPartnership.benefitsTitle}
              </h3>
              <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                {t.bsyPartnership.benefitsDescription}
              </p>
            </div>

            {/* Interactive Phase-by-Phase Comparison Matrix */}
            <div className="space-y-4 pt-2">
              {/* Phase Switcher Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {t.bsyPartnership.phases.map((item, idx) => {
                  const isSelected = activePhaseIndex === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActivePhaseIndex(idx)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap border shrink-0 ${
                        isSelected
                          ? "bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 border-slate-900 dark:border-emerald-400 shadow-sm"
                          : "bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <span>{item.phase.split(":")[0]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Phase Card Display */}
              <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-md space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/60">
                  <div>
                    <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {t.bsyPartnership.phases[activePhaseIndex].phase}
                    </div>
                    <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                      {t.bsyPartnership.phases[activePhaseIndex].title}
                    </div>
                  </div>
                  <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-black font-mono">
                    Impact: {t.bsyPartnership.phases[activePhaseIndex].impact}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Traditional Fragmented Approach */}
                  <div className="p-4 rounded-xl bg-red-50/60 dark:bg-red-950/20 border border-red-200/80 dark:border-red-900/50 space-y-2">
                    <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-extrabold text-xs uppercase tracking-wider">
                      <AlertTriangle className="size-4" />
                      <span>Traditional Fragmented Hand-Off:</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {t.bsyPartnership.phases[activePhaseIndex].traditional}
                    </p>
                  </div>

                  {/* FT PCB + BSY Tech Unified Approach */}
                  <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs uppercase tracking-wider">
                      <CheckCircle2 className="size-4" />
                      <span>FT PCB & BSY Tech Unified Model:</span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                      {t.bsyPartnership.phases[activePhaseIndex].unified}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. FOUR PARTNERSHIP TRACKS (id="tracks")                                  */}
      {/* ========================================================================= */}
      <section id="tracks" className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 relative z-10 scroll-mt-20">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-300 dark:border-blue-700 px-3.5 py-1 text-xs font-black text-blue-700 dark:text-blue-300">
            <Users className="size-3.5" />
            <span>TAILORED COLLABORATION PROGRAMS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {t.tracksTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {t.tracksSubtitle}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {t.tracks.map((track) => (
            <div
              key={track.id}
              className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-8 shadow-xl hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    {track.category}
                  </span>
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {track.badge}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {track.title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {track.description}
                </p>

                {/* Perks Checklist */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                    Program Benefits:
                  </div>
                  {track.perks.map((perk, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>

                {/* Ideal For Note */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Ideal For: </span>
                  <span className="text-slate-600 dark:text-slate-400">{track.idealFor}</span>
                </div>
              </div>

              <Button
                onClick={() => handleSelectTrackAndScroll(track.id)}
                className="w-full rounded-xl bg-slate-900 hover:bg-emerald-600 dark:bg-slate-800 dark:hover:bg-emerald-600 text-white font-black text-xs transition-colors py-5 cursor-pointer shadow-sm"
              >
                <span>{track.actionLabel}</span>
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. WHY PARTNER WITH FT PCB CARDS                                          */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700 px-3.5 py-1 text-xs font-black text-amber-700 dark:text-amber-300">
            <Award className="size-3.5" />
            <span>{t.whyPartner.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {t.whyPartner.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {t.whyPartner.description}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.whyPartner.cards.map((card, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-lg space-y-3 hover:border-emerald-500/50 transition-all group"
            >
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono group-hover:scale-105 transition-transform">
                {card.stat}
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-white">
                {card.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. INTERACTIVE PARTNERSHIP APPLICATION FORM (id="partner-form")           */}
      {/* ========================================================================= */}
      <section id="partner-form" className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 relative z-10 scroll-mt-20">
        <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-8 sm:p-12 shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 px-3 py-0.5 text-xs font-black">
              <Sparkles className="size-3.5 text-emerald-600" />
              <span>{t.form.badge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {t.form.title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              {t.form.description}
            </p>
          </div>

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-center space-y-3"
            >
              <div className="size-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                <Check className="size-8 stroke-[3]" />
              </div>
              <h3 className="text-2xl font-black text-emerald-900 dark:text-emerald-200">
                {t.form.successTitle}
              </h3>
              <p className="text-sm text-emerald-700 dark:text-emerald-300 max-w-md mx-auto">
                {t.form.successDesc}
              </p>
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="outline"
                className="rounded-xl border-emerald-400 text-emerald-800 dark:text-emerald-200 font-bold text-xs mt-2 cursor-pointer"
              >
                Submit Another Request
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Program Track Selector Pills */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500">
                  {t.form.labelTrack}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, track: "bsy-alliance" }))}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-left ${
                      formData.track === "bsy-alliance"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-500/30"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-400"
                    }`}
                  >
                    <div className="truncate">FT & BSY Tech</div>
                    <div className="text-[10px] opacity-80 truncate">Co-Engineering</div>
                  </button>

                  {t.tracks.map((track) => {
                    const isSelected = formData.track === track.id;
                    return (
                      <button
                        key={track.id}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, track: track.id }))}
                        className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-left ${
                          isSelected
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-400"
                        }`}
                      >
                        <div className="truncate">{track.title.split("&")[0]}</div>
                        <div className="text-[10px] opacity-80 truncate">{track.badge}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2-Column Fields */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t.form.labelCompany} *
                  </label>
                  <input
                    required
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder={t.form.placeholderCompany}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t.form.labelName} *
                  </label>
                  <input
                    required
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={t.form.placeholderName}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t.form.labelEmail} *
                  </label>
                  <input
                    required
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t.form.placeholderEmail}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {t.form.labelPhone}
                  </label>
                  <input
                    name="phone"
                    type="text"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={t.form.placeholderPhone}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Volume */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t.form.labelVolume}
                </label>
                <input
                  name="volume"
                  type="text"
                  value={formData.volume}
                  onChange={handleInputChange}
                  placeholder={t.form.placeholderVolume}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t.form.labelMessage} *
                </label>
                <textarea
                  required
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={t.form.placeholderMessage}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm py-6 shadow-xl shadow-emerald-600/25 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    <span>{t.form.submittingBtn}</span>
                  </>
                ) : (
                  <>
                    <Send className="mr-2 size-4" />
                    <span>{t.form.submitBtn}</span>
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. FAQ ACCORDION WITH LIVE SEARCH                                         */}
      {/* ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 relative z-10">
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-300 dark:border-blue-700 px-3.5 py-1 text-xs font-black text-blue-700 dark:text-blue-300">
            <HelpCircle className="size-3.5" />
            <span>{t.faq.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            {t.faq.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {t.faq.description}
          </p>
        </div>

        {/* Search input for FAQs */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          <input
            type="text"
            value={faqSearchQuery}
            onChange={(e) => setFaqSearchQuery(e.target.value)}
            placeholder="Search partnership questions (e.g. NDA, BSY Tech, distributor, drop-shipping)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
          />
          {faqSearchQuery && (
            <button
              type="button"
              onClick={() => setFaqSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((item, idx) => {
            const isOpen = openFaqIndex === idx;

            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-3">
                    <span className="size-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-mono text-xs flex items-center justify-center shrink-0">
                      Q
                    </span>
                    <span>{item.q}</span>
                  </span>
                  <ChevronDown
                    className={`size-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 text-emerald-500" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. FINAL CONVERSION CALL TO ACTION                                        */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 relative z-10">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white p-8 sm:p-14 shadow-2xl border border-emerald-900/50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.2),transparent_60%)] pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-900/80 border border-emerald-500/40 px-3.5 py-1 text-xs font-black text-emerald-300">
              <Sparkles className="size-3.5 text-emerald-400" />
              <span>{t.cta.badge}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {t.cta.title}
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {t.cta.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                asChild
                size="lg"
                className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black shadow-lg shadow-emerald-500/25 px-8 cursor-pointer"
              >
                <Link href="#partner-form">
                  <Zap className="mr-2 size-4" />
                  {t.cta.btnApply}
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-xl border-white/20 hover:bg-white/10 text-white font-black px-6 cursor-pointer"
              >
                <Link href="/contact">
                  <Mail className="mr-2 size-4" />
                  {t.cta.btnContact}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
