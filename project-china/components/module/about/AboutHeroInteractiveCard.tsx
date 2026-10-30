"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2,
  Cpu,
  Download,
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe2,
  FileText,
  Activity,
  Layers,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import AboutHeroAnimation from "./AboutHeroAnimation";

export default function AboutHeroInteractiveCard({
  pdfDownloadUrl = "/docs/FTpcb-Company-Profile.pdf",
}: {
  pdfDownloadUrl?: string;
}) {
  const { locale } = useLanguage();
  const [activeTab, setActiveTab] = useState<"dossier" | "network">("dossier");

  return (
    <div className="rounded-3xl border border-gray-200 dark:border-slate-800 bg-gradient-to-br from-white via-slate-50 to-emerald-50/40 dark:from-slate-900 dark:via-slate-900/90 dark:to-emerald-950/30 p-6 shadow-xl space-y-4">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between border-b border-gray-200/80 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-slate-800/80 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab("dossier")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "dossier"
                ? "bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-xs"
                : "text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Building2 className="size-3.5 text-emerald-600" />
              <span>{locale === "zh" ? "企业核心档案" : "Executive Dossier"}</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("network")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "network"
                ? "bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-xs"
                : "text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Activity className="size-3.5 text-blue-500" />
              <span>{locale === "zh" ? "动态电路网络" : "Live Circuit Map"}</span>
            </span>
          </button>
        </div>

        <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/70 px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
          {locale === "zh" ? "始创于1997年 • 28+年" : "Est. 1997 • 28+ Yrs"}
        </span>
      </div>

      {/* Tab Content with Smooth Animation */}
      <AnimatePresence mode="wait">
        {activeTab === "dossier" ? (
          <motion.div
            key="dossier"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-slate-800/80">
                <span className="text-gray-500 dark:text-slate-400 font-medium">
                  {locale === "zh" ? "企业工商法定全称:" : "Official Legal Entity:"}
                </span>
                <span className="font-bold text-gray-900 dark:text-white text-right">
                  {locale === "zh" ? "FT PCB (武平县飞天电子科技)" : "FT PCB (Wuping Feitian Tech)"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-slate-800/80">
                <span className="text-gray-500 dark:text-slate-400 font-medium">
                  {locale === "zh" ? "实收注册资本:" : "Registered Capital:"}
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {locale === "zh" ? "30,000,000 元人民币" : "30,000,000 RMB"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-slate-800/80">
                <span className="text-gray-500 dark:text-slate-400 font-medium">
                  {locale === "zh" ? "生产制造基地:" : "Production Facility:"}
                </span>
                <span className="font-bold text-gray-900 dark:text-white text-right">
                  {locale === "zh" ? "3栋标准厂房 • 15,000 m² 占地" : "3 Buildings • 15,000 m² Area"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-slate-800/80">
                <span className="text-gray-500 dark:text-slate-400 font-medium">
                  {locale === "zh" ? "单月综合产能:" : "Monthly Output:"}
                </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {locale === "zh" ? "100,000 m² / 月" : "100,000 m² / Month"}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 dark:border-slate-800/80">
                <span className="text-gray-500 dark:text-slate-400 font-medium">
                  {locale === "zh" ? "学院派技术奠基人:" : "Academic Founder:"}
                </span>
                <span className="font-bold text-gray-900 dark:text-white text-right">
                  {locale === "zh" ? "陈景秋教授（深大工学博士、博导）" : "Prof. Chen Jingqiu (PhD, Shenzhen Univ.)"}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500 dark:text-slate-400 font-medium">
                  {locale === "zh" ? "汽车质量管理体系:" : "Automotive Standard:"}
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {locale === "zh" ? "IATF 16949:2016 体系认证" : "IATF 16949:2016 Certified"}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={pdfDownloadUrl}
                download="FT-PCB-Company-Profile.pdf"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gray-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 py-2.5 text-xs font-bold text-white transition shadow-sm cursor-pointer"
              >
                <Download className="size-3.5 text-emerald-400" />
                <span>{locale === "zh" ? "下载42页官方企业画册完整版 (PDF)" : "Download Full 42-Page Brochure (PDF)"}</span>
              </a>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="network"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <AboutHeroAnimation />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
