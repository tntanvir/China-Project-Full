"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import {
  Download,
  FileText,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  ExternalLink,
  BookOpen,
  Layers,
  Sparkles,
  ShieldCheck,
  Building2,
  Cpu,
  Award,
  Share2,
  Check,
  LayoutGrid,
  SlidersHorizontal,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

interface ChapterBookmark {
  page: number;
  title: string;
  category: string;
}

const CHAPTERS_EN: ChapterBookmark[] = [
  { page: 1, title: "Cover & Profile", category: "Overview" },
  { page: 2, title: "Table of Contents", category: "Index" },
  { page: 3, title: "About Wuping Feitian", category: "Company" },
  { page: 4, title: "Company Structure & ERP", category: "Company" },
  { page: 7, title: "Strategic Location Hub", category: "Facilities" },
  { page: 9, title: "Product Market Distribution", category: "Market" },
  { page: 14, title: "Proprietary Smart Factory", category: "Technology" },
  { page: 15, title: "28-Year Performance & Growth", category: "History" },
  { page: 17, title: "Executive & Technical Team", category: "Team" },
  { page: 19, title: "Chairman Prof. Chen Jingqiu", category: "Leadership" },
  { page: 20, title: "Shenzhen Univ. R&D & 5G Patents", category: "R&D" },
  { page: 22, title: "IATF16949 & ISO Certifications", category: "Quality" },
  { page: 23, title: "National High-Tech Honors", category: "Honors" },
  { page: 25, title: "Automated Cutting & Warehousing", category: "Equipment" },
  { page: 26, title: "High-Precision CNC Drilling", category: "Equipment" },
  { page: 27, title: "VCP Continuous Plating Line", category: "Equipment" },
  { page: 28, title: "LDI Laser Direct Imaging", category: "Equipment" },
  { page: 29, title: "Solder Resist Screen Lines", category: "Equipment" },
  { page: 31, title: "Four-Wire Kelvin E-Testing", category: "Testing" },
  { page: 32, title: "AVI Automated Visual Inspection", category: "Testing" },
  { page: 33, title: "Physics & Chemistry Labs", category: "Testing" },
  { page: 34, title: "Process Capabilities (2L-30L)", category: "Capabilities" },
  { page: 35, title: "Automotive Circuit Boards", category: "Products" },
  { page: 37, title: "Industrial & Solar Inverters", category: "Products" },
  { page: 39, title: "5G High-Frequency & PTFE", category: "Specialty" },
  { page: 41, title: "Global Clients & Network", category: "Clients" },
  { page: 42, title: "Headquarters & Contact", category: "Contact" },
];

const CHAPTERS_ZH: ChapterBookmark[] = [
  { page: 1, title: "封面与画册总览", category: "总览" },
  { page: 2, title: "画册目录索引", category: "索引" },
  { page: 3, title: "走进武平飞天电子", category: "企业" },
  { page: 4, title: "企业组织架构与工业ERP", category: "企业" },
  { page: 7, title: "闽西高新区战略交通枢纽", category: "基地" },
  { page: 9, title: "多元化全球行业市场分布", category: "市场" },
  { page: 14, title: "自主研发“云上飞天”智能工厂", category: "技术" },
  { page: 15, title: "28年跨越发展历程与里程碑", category: "历程" },
  { page: 17, title: "核心管理与高素质技术团队", category: "团队" },
  { page: 19, title: "董事长陈景秋教授领军风采", category: "领袖" },
  { page: 20, title: "深大产学研联合实验室与5G专利", category: "研发" },
  { page: 22, title: "IATF 16949 与国际质量体系认证", category: "品质" },
  { page: 23, title: "国家级专精特新与小巨人荣誉", category: "荣誉" },
  { page: 25, title: "全自动开料与高密度智能恒温仓储", category: "设备" },
  { page: 26, title: "高精度空气轴承数控钻孔机组", category: "设备" },
  { page: 27, title: "不溶性阳极 VCP 垂直连续电镀线", category: "设备" },
  { page: 28, title: "万级洁净室 LDI 激光直接成像机", category: "设备" },
  { page: 29, title: "全自动双面阻焊网印与隧道烘干", category: "设备" },
  { page: 31, title: "四线开尔文低阻电气测试专线", category: "测试" },
  { page: 32, title: "AVI 全自动高精光学外观检验机", category: "测试" },
  { page: 33, title: "金相显微切片与理化分析实验室", category: "测试" },
  { page: 34, title: "高精密2-30层高多层制造能力表", category: "制程" },
  { page: 35, title: "汽车电子车载智能高可靠电路板", category: "产品" },
  { page: 37, title: "光伏储能与工控大功率逆变器板", category: "产品" },
  { page: 39, title: "5G微波雷达与PTFE高频特种基板", category: "特种" },
  { page: 41, title: "全球战略合作伙伴与客户口碑", category: "客户" },
  { page: 42, title: "实体制造总部与全球联络方式", category: "联系" },
];

export default function CompanyProfilePdfViewer({
  className = "",
  initialPage = 1,
}: {
  className?: string;
  initialPage?: number;
}) {
  const { locale } = useLanguage();
  const chapters = locale === "zh" ? CHAPTERS_ZH : CHAPTERS_EN;
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isGridView, setIsGridView] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const totalPages = 42;
  const containerRef = useRef<HTMLDivElement>(null);

  const pdfUrl = "/docs/FTpcb-Company-Profile.pdf";

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(180, prev + 20));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(70, prev - 20));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  const handleShare = async () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "SELECT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key === "ArrowLeft") handlePrevPage();
      if (e.key === "ArrowRight") handleNextPage();
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
      if (e.key.toLowerCase() === "g") setIsGridView((prev) => !prev);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  const activeChapter =
    chapters.slice()
      .reverse()
      .find((c) => currentPage >= c.page) || chapters[0];

  return (
    <div
      ref={containerRef}
      className={`rounded-3xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden transition-all duration-300 ${
        isFullscreen
          ? "fixed inset-0 z-50 rounded-none border-none flex flex-col"
          : "relative"
      } ${className}`}
    >
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 border-b border-gray-200 dark:border-slate-800 bg-gray-50/90 dark:bg-slate-900/95 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
            <FileText className="size-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-gray-900 dark:text-white">
                {locale === "zh" ? "FT PCB 官方企业画册与技术白皮书" : "FT PCB Official Company Profile"}
              </h3>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                <Sparkles className="size-2.5" /> {locale === "zh" ? "全套42页" : "42 Slides"}
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">
              {locale === "zh" ? "武平县飞天电子科技有限公司（福建实体制造基地）" : "Wuping Feitian Electronic Technology Co., Ltd. (Fujian Base)"}
            </p>
          </div>
        </div>

        {/* Action Controls & Download CTA */}
        <div className="flex items-center gap-2">
          {/* Quick Chapter Selector */}
          <div className="relative hidden md:block">
            <select
              value={activeChapter.page}
              onChange={(e) => {
                setCurrentPage(Number(e.target.value));
                setIsGridView(false);
              }}
              aria-label="Jump to Chapter"
              className="appearance-none rounded-xl bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 px-3 py-1.5 pr-8 text-xs font-bold text-gray-700 dark:text-slate-200 cursor-pointer shadow-xs focus:ring-2 focus:ring-emerald-500"
            >
              {chapters.map((ch) => (
                <option key={ch.page} value={ch.page}>
                  p.{ch.page} - {ch.title}
                </option>
              ))}
            </select>
          </div>

          {/* Toggle Grid Overview vs Slide Mode */}
          <button
            type="button"
            onClick={() => setIsGridView((prev) => !prev)}
            title={isGridView ? "Switch to Single Slide View" : "View All 42 Slides Grid"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              isGridView
                ? "bg-slate-900 text-white dark:bg-emerald-600"
                : "bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200"
            }`}
          >
            <LayoutGrid className="size-3.5" />
            <span className="hidden sm:inline">{isGridView ? "Slide View" : "All 42 Slides"}</span>
          </button>

          {/* Download Original PDF Button */}
          <a
            href={pdfUrl}
            download="Wuping-Feitian-PCB-Company-Profile.pdf"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3.5 py-1.5 text-xs font-black text-white shadow-md shadow-emerald-600/25 transition active:scale-95 cursor-pointer"
          >
            <Download className="size-3.5 stroke-[2.5]" />
            <span>Download PDF (6.9 MB)</span>
          </a>

          {/* Open Native PDF in New Tab */}
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open original PDF file in browser tab"
            className="hidden sm:flex size-8 items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 transition"
          >
            <ExternalLink className="size-3.5" />
          </a>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen((prev) => !prev)}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Viewer"}
            className="flex size-8 items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 transition cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Viewport: Either Grid View or Single Slide Reader */}
      {isGridView ? (
        /* 42-Slide Grid Overview */
        <div
          className={`flex-1 bg-slate-900/95 dark:bg-slate-950 p-6 overflow-y-auto ${
            isFullscreen ? "min-h-0" : "max-h-[700px]"
          }`}
        >
          <div className="max-w-6xl mx-auto space-y-4">
            <div className="flex items-center justify-between text-white">
              <div>
                <h4 className="text-sm font-black">All 42 Brochure Slides</h4>
                <p className="text-xs text-slate-400">
                  Click on any slide to inspect it in full magnification.
                </p>
              </div>
              <button
                onClick={() => setIsGridView(false)}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 text-xs font-black"
              >
                Back to Slide View
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
                const isSelected = pg === currentPage;
                const chapterMatch = chapters.find((ch) => ch.page === pg);
                return (
                  <button
                    key={pg}
                    onClick={() => {
                      setCurrentPage(pg);
                      setIsGridView(false);
                    }}
                    className={`relative rounded-xl overflow-hidden border-2 transition group text-left ${
                      isSelected
                        ? "border-emerald-500 ring-2 ring-emerald-500/50 shadow-lg scale-102"
                        : "border-slate-800 hover:border-emerald-400 opacity-80 hover:opacity-100"
                    }`}
                  >
                    <div className="relative aspect-[16/10] w-full bg-slate-800">
                      <Image
                        src={`/images/company-profile/page_${pg}.jpg`}
                        alt={`Slide ${pg}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 20vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-1.5 bg-slate-950 flex items-center justify-between text-[10px] text-slate-300">
                      <span className="font-mono font-bold">p.{pg}</span>
                      {chapterMatch && (
                        <span className="text-[9px] text-emerald-400 font-bold truncate max-w-[85px]">
                          {chapterMatch.title}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Single Slide Reader Viewport */
        <div
          className={`relative flex-1 bg-slate-900/95 dark:bg-slate-950 flex flex-col items-center justify-center overflow-auto p-4 sm:p-6 select-none ${
            isFullscreen ? "min-h-0" : "min-h-[520px] sm:min-h-[640px]"
          }`}
        >
          {/* Floating Quick Navigation Pills */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
            <span className="rounded-xl bg-black/60 backdrop-blur-md px-3 py-1.5 text-xs font-mono font-bold text-white border border-white/10 shadow-lg">
              Slide {currentPage} of {totalPages}
            </span>
            <span className="hidden sm:inline-flex rounded-xl bg-emerald-950/80 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-emerald-400 border border-emerald-800/60 shadow-lg">
              {activeChapter.title}
            </span>
          </div>

          {/* Floating Zoom & Tool Bar */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1 rounded-xl bg-black/60 backdrop-blur-md p-1 border border-white/10 shadow-lg">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoomLevel <= 70}
              title="Zoom Out"
              className="size-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-40 transition cursor-pointer"
            >
              <ZoomOut className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              title="Reset Zoom"
              className="px-2 text-[11px] font-mono font-bold text-slate-300 hover:text-white cursor-pointer"
            >
              {zoomLevel}%
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoomLevel >= 180}
              title="Zoom In"
              className="size-7 flex items-center justify-center rounded-lg text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-40 transition cursor-pointer"
            >
              <ZoomIn className="size-3.5" />
            </button>
          </div>

          {/* Page Render Container */}
          <div
            className="relative max-w-full rounded-2xl overflow-hidden shadow-2xl transition-all duration-200 border border-white/10"
            style={{ width: `${zoomLevel * 8.8}px` }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.01 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="relative aspect-[16/10] w-full bg-slate-800"
              >
                <Image
                  src={`/images/company-profile/page_${currentPage}.jpg`}
                  alt={`Wuping Feitian Electronic Technology Co., Ltd. Company Profile - Slide ${currentPage}`}
                  fill
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority={currentPage <= 3}
                  className="object-contain"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Previous / Next Side Floating Arrows */}
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            aria-label="Previous Slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 size-11 rounded-full bg-black/70 hover:bg-emerald-600 text-white disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center backdrop-blur-md border border-white/10 shadow-xl transition active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="size-6" />
          </button>

          <button
            type="button"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            aria-label="Next Slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 size-11 rounded-full bg-black/70 hover:bg-emerald-600 text-white disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center backdrop-blur-md border border-white/10 shadow-xl transition active:scale-95 cursor-pointer"
          >
            <ChevronRight className="size-6" />
          </button>
        </div>
      )}

      {/* Bottom Thumbnail Strip Drawer & Slider */}
      <div className="border-t border-gray-200 dark:border-slate-800 bg-gray-50/95 dark:bg-slate-900/95 px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-700 dark:text-slate-300">
              Slide Strip ({currentPage}/{totalPages})
            </span>
            <span className="text-[10px] font-mono text-gray-400">
              (Use arrow keys ← → or click thumbnails)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Slider */}
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[10px] text-gray-400 font-mono">1</span>
              <input
                type="range"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="w-24 sm:w-36 accent-emerald-600 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-gray-400 font-mono">{totalPages}</span>
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition cursor-pointer"
            >
              {copiedLink ? <Check className="size-3 text-emerald-500" /> : <Share2 className="size-3" />}
              <span>{copiedLink ? "Link Copied" : "Share"}</span>
            </button>
          </div>
        </div>

        {/* Thumbnail Carousel */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-slate-700">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => {
            const isCurrent = pg === currentPage;
            return (
              <button
                key={pg}
                type="button"
                onClick={() => {
                  setCurrentPage(pg);
                  setIsGridView(false);
                }}
                className={`relative shrink-0 w-16 sm:w-20 aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  isCurrent
                    ? "border-emerald-500 ring-2 ring-emerald-500/30 scale-105 shadow-md"
                    : "border-gray-300 dark:border-slate-700 hover:border-emerald-400 opacity-75 hover:opacity-100"
                }`}
              >
                <Image
                  src={`/images/company-profile/page_${pg}.jpg`}
                  alt={`Thumbnail page ${pg}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
                <span className="absolute bottom-0.5 right-0.5 rounded bg-black/75 px-1 py-0.2 text-[8px] font-mono font-bold text-white">
                  {pg}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
