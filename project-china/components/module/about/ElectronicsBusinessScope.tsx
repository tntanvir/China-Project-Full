"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Cpu,
  Layers,
  Wrench,
  Boxes,
  Microchip,
  Sparkles,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Table as TableIcon,
  LayoutGrid,
  Maximize2,
  X,
  FileSpreadsheet,
  Download,
  ShieldCheck,
  Search,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface BusinessScopeItem {
  id: string;
  titleEn: string;
  titleZh: string;
  descEn: string;
  descZh: string;
  fullDescEn: string;
  fullDescZh: string;
  capabilitiesEn: string[];
  capabilitiesZh: string[];
  placeholderText: string;
  placeholderUrl: string;
  imageUrl: string;
  icon: any;
  tagEn: string;
  tagZh: string;
}

export const BUSINESS_SCOPE_ITEMS: BusinessScopeItem[] = [
  {
    id: "pcb-design",
    titleEn: "PCB Design & Prototyping",
    titleZh: "PCB 设计与快速打样",
    descEn: "custom circuit boards, schematics, and layout prototypes",
    descZh: "定制电路板设计、电路原理图绘制与高精多层布线打样",
    fullDescEn:
      "End-to-end electronic hardware development from initial schematic capture and PCB layout (Altium, Cadence Allegro, KiCad) to rapid 24-48 hour physical prototyping. Specializing in high-speed differential pairs, controlled impedance, and HDI microvia stackups.",
    fullDescZh:
      "从电路原理图绘制、高速多层板布线（支持 Altium、Allegro、KiCad）到 24-48 小时极速工程打样。精研差分阻抗控制、高频射频微波板与 HDI 盲埋孔叠层设计。",
    capabilitiesEn: [
      "Schematic Capture & BOM Generation",
      "High-Speed Differential Impedance Routing (±5%)",
      "2 to 32 Layer Stackup Modeling",
      "24H - 48H Quick-Turn Prototype Turnaround",
    ],
    capabilitiesZh: [
      "原理图绘制与智能 BOM 表生成",
      "高速差分阻抗精确布线与仿真 (±5%)",
      "2 至 32 层高密度多层板叠层建模",
      "24-48 小时加急工程原型极速交付",
    ],
    placeholderText: "PCB+Design+Photo",
    placeholderUrl: "https://placehold.co/320x220?text=PCB+Design+Photo",
    imageUrl: "/images/categories/capability/rigid-pcb-1.jpg",
    icon: Layers,
    tagEn: "CAD / EDA & Rapid Prototyping",
    tagZh: "EDA设计与原型制作",
  },
  {
    id: "device-repair",
    titleEn: "Device Repair & Diagnostics",
    titleZh: "电子设备检修与板级诊断",
    descEn: "board-level repair, soldering, and testing",
    descZh: "高精板级电路维修、专业显微焊接与信号故障诊断测试",
    fullDescEn:
      "Comprehensive diagnostic and repair bench capabilities covering complex multi-layer PCB faults, BGA reballing and precision rework, thermal dissipation inspection, and 4-wire Kelvin continuity isolation verification compliant with IPC-7711/7721.",
    fullDescZh:
      "配备专业级维修测试工作台，覆盖复杂多层板短路定位、BGA 返修植球、显微精密补线焊接、红外热成像故障排查及符合 IPC-7711/7721 标准的电气性能验证。",
    capabilitiesEn: [
      "High-Precision BGA Reballing & Rework",
      "FLIR Infrared Thermal Fault Detection",
      "Microscopic Precision Soldering & Trace Repair",
      "Netlist Oscilloscope Signal & Power Analysis",
    ],
    capabilitiesZh: [
      "高精度 BGA 芯片返修、除胶与激光植球",
      "FLIR 红外热成像快速短路与过热诊断",
      "高倍显微镜下精密焊点与断线飞线修复",
      "网表高频示波器信号完整性与电源纹波测试",
    ],
    placeholderText: "Repair+Bench+Photo",
    placeholderUrl: "https://placehold.co/320x220?text=Repair+Bench+Photo",
    imageUrl: "/images/categories/capability/testing-1.jpg",
    icon: Wrench,
    tagEn: "Board-Level Diagnostics & Rework",
    tagZh: "板级检修与返修测试",
  },
  {
    id: "component-sourcing",
    titleEn: "Component Sourcing & Supply",
    titleZh: "电子元器件采购与供应链配套",
    descEn: "electronic parts, connectors, and small-batch supply",
    descZh: "正品原厂电子元器件、精密连接器与小批量研发备料配套",
    fullDescEn:
      "Direct global semiconductor supply chain network with Tier-1 franchised distributors (DigiKey, Mouser, LCSC, Arrow). 100% genuine guaranteed parts with full traceability, anti-counterfeiting verification, and complete BOM kitting for pilot and batch production.",
    fullDescZh:
      "直联全球原厂与一级授权代理网络（DigiKey、Mouser、立创电子、Arrow）。100% 原厂正品保证，具备完善防伪溯源检测、全 BOM 齐套配单及小批量研发试产快速现货供应。",
    capabilitiesEn: [
      "100% Genuine Traceable Sourcing (COC Verified)",
      "Automated BOM Pricing & Lead-Time Matching",
      "Hard-to-Find & End-of-Life (EOL) Sourcing",
      "Anti-Static Sealed Smart Warehousing",
    ],
    capabilitiesZh: [
      "100% 原厂正品出厂资质追溯 (附材质证明 COC)",
      "智能 BOM 自动化精准比价与交期匹配",
      "紧缺料、停产料 (EOL) 全球合规渠道调配",
      "恒温恒湿防静电智能元器件高架立库",
    ],
    placeholderText: "Components+Photo",
    placeholderUrl: "https://placehold.co/320x220?text=Components+Photo",
    imageUrl: "/images/categories/capability/smt-1.jpg",
    icon: Boxes,
    tagEn: "Full BOM Sourcing & Supply Chain",
    tagZh: "全BOM采购与元器件配套",
  },
  {
    id: "embedded-systems",
    titleEn: "Embedded Systems & Sensors",
    titleZh: "嵌入式系统与智能传感器开发",
    descEn: "microcontrollers, sensors, and firmware prototypes",
    descZh: "微控制器MCU开发、工业环境传感器与物联网固件原型",
    fullDescEn:
      "Custom embedded hardware and firmware engineering for IoT, automotive telemetry, and industrial edge computing. Supporting ARM Cortex-M (STM32, NXP), ESP32 wireless SoC, environmental/MEMS sensors, and industrial CAN/RS485 communication protocols.",
    fullDescZh:
      "面向物联网、车载远程监控及工业边缘计算的软硬件定制开发。精研 ARM Cortex-M（STM32、NXP）、ESP32 无线芯片、MEMS 传感器模组及工业级 CAN/RS485 总线通讯固件原型研发。",
    capabilitiesEn: [
      "ARM Cortex-M & ESP32 Wireless Architecture",
      "MEMS & Environmental Sensor Integration (I2C/SPI)",
      "Real-Time OS (FreeRTOS) & Bare-Metal Firmware",
      "Industrial CAN, RS-485 & Modbus Protocol Bring-Up",
    ],
    capabilitiesZh: [
      "ARM Cortex-M 与 ESP32 无线架构软硬件设计",
      "MEMS 与工业环境传感器模组集成 (I2C/SPI/ADC)",
      "FreeRTOS 实时多任务系统与嵌入式固件开发",
      "车载 CAN 总线、RS-485 及 Modbus 工业通讯适配",
    ],
    placeholderText: "Embedded+Board+Photo",
    placeholderUrl: "https://placehold.co/320x220?text=Embedded+Board+Photo",
    imageUrl: "/images/categories/capability/flex-pcb-1.jpg",
    icon: Microchip,
    tagEn: "Firmware & IoT Hardware Engineering",
    tagZh: "固件开发与传感器集成",
  },
];

export default function ElectronicsBusinessScope() {
  const { locale } = useLanguage();
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [activeImage, setActiveImage] = useState<BusinessScopeItem | null>(null);

  const isZh = locale === "zh";

  return (
    <section id="business-scope" className="scroll-mt-28 py-16">
      {/* ---------------- Section Header ---------------- */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/30 px-3.5 py-1 text-xs font-black text-amber-700 dark:text-amber-400">
            <Boxes className="size-3.5 text-amber-500" />
            <span>
              {isZh ? "飞天电子 • 官方业务经营范围" : "FT Company • Official Business Scope"}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            {isZh ? "电子业务经营范围" : "Electronics Business Scope"}
          </h2>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            {isZh
              ? "武平飞天电子科技依托28年实体制造与研发积累，为全球客户提供覆盖电路设计打样、板级检修诊断、元器件正品代采及嵌入式智能传感器的全生命周期硬件服务。"
              : "Leveraging 28 years of precision manufacturing and R&D engineering, FT Company provides comprehensive electronics solutions from initial PCB design and diagnostics to genuine component supply and embedded systems."}
          </p>
        </div>

        {/* View Switcher: Table View (Exact Image format) vs Interactive Split Cards */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start md:self-auto shrink-0 shadow-xs">
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
              viewMode === "table"
                ? "bg-amber-400 text-slate-950 font-black shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <TableIcon className="size-3.5" />
            <span>{isZh ? "原版对照表格" : "Official Table View"}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("cards")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
              viewMode === "cards"
                ? "bg-amber-400 text-slate-950 font-black shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <LayoutGrid className="size-3.5" />
            <span>{isZh ? "对侧交互卡片" : "Opposite Split View"}</span>
          </button>
        </div>
      </div>

      {/* ---------------- 1. TABLE VIEW (Exact reproduction of uploaded image) ---------------- */}
      {viewMode === "table" && (
        <Card className="rounded-3xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[680px]">
              {/* Header Row */}
              <thead>
                <tr className="border-b-2 border-slate-300 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-950/80">
                  <th className="py-5 px-6 sm:px-8 text-base sm:text-lg font-black text-slate-900 dark:text-white w-7/12 border-r border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-4 text-amber-500" />
                      <span>{isZh ? "电子业务经营范围 (Electronics Business Scope)" : "Electronics Business Scope"}</span>
                    </div>
                  </th>
                  <th className="py-5 px-6 sm:px-8 text-base sm:text-lg font-black text-slate-900 dark:text-white w-5/12">
                    <div className="flex items-center gap-2">
                      <ExternalLink className="size-4 text-amber-500" />
                      <span>{isZh ? "对侧对应实景配图 (Picture on the Opposite Side)" : "Picture on the Opposite Side"}</span>
                    </div>
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {BUSINESS_SCOPE_ITEMS.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-amber-50/40 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Left Column: Scope Name & Description */}
                      <td className="py-6 px-6 sm:px-8 align-top border-r border-slate-200 dark:border-slate-800">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2.5">
                            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                              <Icon className="size-5" />
                            </span>
                            <div>
                              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                                {isZh ? `${item.titleEn} (${item.titleZh})` : item.titleEn}
                              </h3>
                              <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">
                                {isZh ? item.tagZh : item.tagEn}
                              </span>
                            </div>
                          </div>

                          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed pl-1">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {item.titleEn} –{" "}
                            </span>
                            {item.descEn}
                          </p>

                          {isZh && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 pl-1">
                              {item.descZh}
                            </p>
                          )}

                          {/* Quick capability tags */}
                          <div className="pt-2 flex flex-wrap gap-1.5 pl-1">
                            {(isZh ? item.capabilitiesZh : item.capabilitiesEn).map((cap, ci) => (
                              <span
                                key={ci}
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                              >
                                <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                <span>{cap}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>

                      {/* Right Column: Picture on the Opposite Side */}
                      <td className="py-6 px-6 sm:px-8 align-middle">
                        <div className="space-y-2 max-w-sm">
                          {/* Interactive Image Container */}
                          <div
                            onClick={() => setActiveImage(item)}
                            className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-md group/img cursor-pointer aspect-[16/11]"
                          >
                            {/* Realistic Image */}
                            <img
                              src={item.imageUrl}
                              alt={item.titleEn}
                              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300"
                              loading="lazy"
                              onError={(e) => {
                                // Fallback to placeholder if local image fails
                                (e.target as HTMLImageElement).src = item.placeholderUrl;
                              }}
                            />

                            {/* Badge with exact placeholder URL text from screenshot */}
                            <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-mono text-cyan-300 font-bold border border-cyan-500/30">
                              320 × 220
                            </div>

                            {/* Hover overlay hint */}
                            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                              <Maximize2 className="size-4 text-amber-400" />
                              <span>{isZh ? "点击全屏查看" : "Click to Enlarge"}</span>
                            </div>
                          </div>

                          {/* Matching exact placeholder link text as shown in screenshot */}
                          <div className="flex items-center justify-between gap-2 px-1">
                            <a
                              href={item.placeholderUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-mono text-blue-600 dark:text-cyan-400 hover:underline truncate"
                              title={item.placeholderUrl}
                            >
                              {item.placeholderUrl}
                            </a>

                            <Button
                              asChild
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs text-amber-600 dark:text-amber-400 font-bold hover:bg-amber-50 dark:hover:bg-slate-800"
                            >
                              <Link href="/pcb-quote">
                                <span>{isZh ? "立即咨询" : "Inquire"}</span>
                                <ArrowRight className="size-3 ml-1" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ---------------- 2. SPLIT OPPOSITE CARDS VIEW ---------------- */}
      {viewMode === "cards" && (
        <div className="space-y-8">
          {BUSINESS_SCOPE_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            const isEven = idx % 2 === 0;

            return (
              <Card
                key={item.id}
                className="p-6 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden transition-all hover:shadow-2xl"
              >
                <div
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                    isEven ? "" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Text Column (Takes 7 Cols) */}
                  <div className={`space-y-4 ${isEven ? "lg:col-span-7" : "lg:col-span-7 lg:order-2"}`}>
                    <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">
                      <Icon className="size-3.5" />
                      <span>{isZh ? item.tagZh : item.tagEn}</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                      {isZh ? `${item.titleEn} (${item.titleZh})` : item.titleEn}
                    </h3>

                    <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
                      <span className="text-amber-600 dark:text-amber-400 font-bold">
                        {item.titleEn} –{" "}
                      </span>
                      {item.descEn}
                    </p>

                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {isZh ? item.fullDescZh : item.fullDescEn}
                    </p>

                    {/* Feature bullets */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                      {(isZh ? item.capabilitiesZh : item.capabilitiesEn).map((cap, ci) => (
                        <div
                          key={ci}
                          className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300"
                        >
                          <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 flex flex-wrap items-center gap-3">
                      <Button asChild className="rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-md">
                        <Link href="/pcb-quote">
                          <span>{isZh ? "获取工程报价" : "Request Engineering Quote"}</span>
                          <ArrowRight className="size-4 ml-1.5" />
                        </Link>
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => setActiveImage(item)}
                        className="rounded-full text-xs font-bold"
                      >
                        <Maximize2 className="size-3.5 mr-1.5" />
                        <span>{isZh ? "查看实景高清图" : "View Photo (Opposite Side)"}</span>
                      </Button>
                    </div>
                  </div>

                  {/* Picture on the Opposite Side (Takes 5 Cols) */}
                  <div className={`space-y-2 ${isEven ? "lg:col-span-5" : "lg:col-span-5 lg:order-1"}`}>
                    <div className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                      <Sparkles className="size-3 text-amber-500" />
                      <span>{isZh ? "对侧对应实景配图" : "Picture on the Opposite Side"}</span>
                    </div>

                    <div
                      onClick={() => setActiveImage(item)}
                      className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-xl group cursor-pointer aspect-[16/11]"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.titleEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = item.placeholderUrl;
                        }}
                      />

                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md text-[11px] font-mono text-cyan-300 font-bold border border-cyan-500/40">
                        {item.placeholderText}
                      </div>

                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                        <Maximize2 className="size-4 text-amber-400" />
                        <span>{isZh ? "点击放大查看" : "Click to Expand"}</span>
                      </div>
                    </div>

                    <div className="px-1 text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate">
                      {item.placeholderUrl}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ---------------- 3. High-Resolution Image Lightbox Modal ---------------- */}
      {activeImage && (
        <div
          onClick={() => setActiveImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white">
                  {isZh ? `${activeImage.titleEn} (${activeImage.titleZh})` : activeImage.titleEn}
                </h4>
                <p className="text-xs font-mono text-amber-600 dark:text-amber-400 mt-0.5">
                  {activeImage.placeholderUrl}
                </p>
              </div>

              <button
                onClick={() => setActiveImage(null)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 aspect-[16/10] max-h-[60vh] flex items-center justify-center">
              <img
                src={activeImage.imageUrl}
                alt={activeImage.titleEn}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = activeImage.placeholderUrl;
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {isZh ? activeImage.fullDescZh : activeImage.fullDescEn}
              </p>

              <Button asChild className="rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shrink-0">
                <Link href="/pcb-quote">
                  <span>{isZh ? "询价此项业务" : "Inquire This Service"}</span>
                  <ArrowRight className="size-3.5 ml-1.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

