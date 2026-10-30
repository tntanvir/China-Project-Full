"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  DollarSign,
  TrendingDown,
  Clock,
  Cpu,
  FileCheck2,
  Zap,
  Building2,
  RefreshCw,
  Award,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/components/providers/language-provider";

interface ComparisonItem {
  feature: string;
  broker: string;
  brokerGood: boolean;
  feitian: string;
  feitianGood: boolean;
  detail: string;
}

const COMPARISON_DATA_EN: ComparisonItem[] = [
  {
    feature: "Pricing & Margins",
    broker: "15% - 35% markups added by trading brokers",
    brokerGood: false,
    feitian: "Direct Factory wholesale rate (Zero broker fee)",
    feitianGood: true,
    detail: "You deal directly with our 15,000m² manufacturing base in Wuping High-Tech Zone.",
  },
  {
    feature: "CAM Engineering Review",
    broker: "Relayed via sales reps (12-24h delay, lost in translation)",
    brokerGood: false,
    feitian: "Direct CAM review in < 2 hours by 45+ in-house engineers",
    feitianGood: true,
    detail: "Our CAM engineers verify your Gerbers directly and provide optimization proposals instantly.",
  },
  {
    feature: "Traceability & MES Tracking",
    broker: "Unknown third-party factory; zero live status",
    brokerGood: false,
    feitian: "100% 2D Laser Barcode via 'Yunshang Feitian' Cloud MES",
    feitianGood: true,
    detail: "Scan or check machine-by-machine status, chemical bath logs, and AVI inspection photos.",
  },
  {
    feature: "Raw Material Authenticity",
    broker: "Frequently downgraded to generic unbranded laminates",
    brokerGood: false,
    feitian: "100% Shengyi (SY), Kingboard (KB), Rogers with Mill Test Reports",
    feitianGood: true,
    detail: "Every batch comes with genuine material certificates and UL 94V-0 flammability compliance.",
  },
  {
    feature: "Electrical Testing (E-Test)",
    broker: "Spot check or extra surcharge for flying probe",
    brokerGood: false,
    feitian: "100% 4-Wire Kelvin Netlist Electrical E-Test (Always Free)",
    feitianGood: true,
    detail: "Every single trace and via is 100% continuity and micro-ohm tested before packaging.",
  },
  {
    feature: "Quality Compensation Guarantee",
    broker: "Finger-pointing between broker and subcontracted plant",
    brokerGood: false,
    feitian: "Ironclad Quality Warranty: 100% Free Remake or Instant Refund",
    feitianGood: true,
    detail: "Direct accountability backed by our IATF 16949 automotive quality management system.",
  },
];

const COMPARISON_DATA_ZH: ComparisonItem[] = [
  {
    feature: "采购单价与中间溢价",
    broker: "外贸中间商多层加价 15% - 35%",
    brokerGood: false,
    feitian: "源头实体大厂出厂批发底价（零中间中介费）",
    feitianGood: true,
    detail: "您直接对接武平高新技术产业园区15,000m²现代化实体制造基地。",
  },
  {
    feature: "CAM可制造性审核时效",
    broker: "销售业务多层转达（耗时12-24小时，易理解偏差）",
    brokerGood: false,
    feitian: "45+自营工程团队，2小时内极速出具CAM审核",
    feitianGood: true,
    detail: "资深CAM工程师直接审核您的Gerber工程文件，即时出具DFM优化与拼板建议。",
  },
  {
    feature: "生产透明度与MES系统追溯",
    broker: "外协代工厂生产，零机台实时状态监控",
    brokerGood: false,
    feitian: "“云上飞天”工业MES系统，100% 激光二维码全流程追溯",
    feitianGood: true,
    detail: "微信端随时查看机台流转、药水浓度分析日志及AVI高清光学扫描留底照片。",
  },
  {
    feature: "基材真伪与品质合规",
    broker: "常被降级为无品牌杂牌低等级覆铜板",
    brokerGood: false,
    feitian: "100% 采购生益（SY）、建滔（KB）、罗杰斯正品板材",
    feitianGood: true,
    detail: "随货附带正规材质出厂合格证明及UL 94V-0（E360609）阻燃认证。",
  },
  {
    feature: "电气性能测试 (E-Test)",
    broker: "仅抽检或需额外加收昂贵的飞针测试费",
    brokerGood: false,
    feitian: "100% 四线开尔文低阻电气测试（全部免费提供）",
    feitianGood: true,
    detail: "出厂前逐片进行开尔文微欧姆级导通测试，彻底杜绝孔壁微裂隐患。",
  },
  {
    feature: "品质理赔与售后保障",
    broker: "贸易商与代工厂互相推诿扯皮，处理极其缓慢",
    brokerGood: false,
    feitian: "三大品质铁律：因厂方问题 100% 免费重做或极速退款",
    feitianGood: true,
    detail: "源头实体大厂直担责任，IATF 16949汽车级质量管理体系全程背书。",
  },
];

export default function CostComparisonVisualizer() {
  const { locale } = useLanguage();
  const comparisonData = locale === "zh" ? COMPARISON_DATA_ZH : COMPARISON_DATA_EN;
  const [orderArea, setOrderArea] = useState<number>(50); // m²
  const [activeTab, setActiveTab] = useState<"table" | "calculator" | "guarantees">("calculator");

  // Approximate calculation: Average multi-layer PCB cost benchmark
  const directFactoryPricePerSqm = 68; // USD/m² baseline
  const brokerPricePerSqm = 92; // USD/m² with 35% broker markup
  
  const directTotal = Math.round(orderArea * directFactoryPricePerSqm);
  const brokerTotal = Math.round(orderArea * brokerPricePerSqm);
  const totalSavings = brokerTotal - directTotal;
  const savingsPercent = Math.round((totalSavings / brokerTotal) * 100);

  return (
    <div className="w-full space-y-12">
      {/* Navigation Pills */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-2xl bg-slate-100 dark:bg-slate-900/90 p-1.5 border border-slate-200 dark:border-slate-800 shadow-inner">
          <button
            onClick={() => setActiveTab("calculator")}
            className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "calculator"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <DollarSign className="size-4" />
            <span>{locale === "zh" ? "源头直采成本模拟器" : "Interactive Savings Calculator"}</span>
          </button>
          <button
            onClick={() => setActiveTab("table")}
            className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "table"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <TrendingDown className="size-4" />
            <span>{locale === "zh" ? "源头实体 vs 中介对标" : "Direct vs. Broker Breakdown"}</span>
          </button>
          <button
            onClick={() => setActiveTab("guarantees")}
            className={`px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "guarantees"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <ShieldCheck className="size-4" />
            <span>{locale === "zh" ? "三大无忧品质契约" : "3 Ironclad Guarantees"}</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Interactive Savings Calculator */}
      {activeTab === "calculator" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid gap-8 lg:grid-cols-12 items-center"
        >
          {/* Controls Card */}
          <Card className="lg:col-span-6 p-8 rounded-3xl border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 shadow-xl backdrop-blur-sm space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {locale === "zh" ? "源头实体大厂采购成本测算" : "Direct Source Factory Simulation"}
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {locale === "zh" ? "测算直连源头工厂为您节省的预算" : "Estimate Your Direct Factory Savings"}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {locale === "zh"
                  ? "拖动滑块选择预估投产面积，直观查看剔除贸易商中介加价后为项目节省的资金。"
                  : "Move the slider to estimate your production volume and see how eliminating intermediary trading margins preserves your project budget."}
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-700 dark:text-slate-300">
                  {locale === "zh" ? "订单投产面积:" : "Order Volume:"}
                </span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  {orderArea} m²{" "}
                  {locale === "zh"
                    ? orderArea <= 5
                      ? "(工程打样)"
                      : orderArea <= 50
                      ? "(小批量试产)"
                      : "(规模量产)"
                    : orderArea <= 5
                    ? "(Prototype)"
                    : orderArea <= 50
                    ? "(Batch Run)"
                    : "(Mass Production)"}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="300"
                step="1"
                value={orderArea}
                onChange={(e) => setOrderArea(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>{locale === "zh" ? "1 m² (极速打样)" : "1 m² (Quick Prototype)"}</span>
                <span>{locale === "zh" ? "50 m² (中小批量)" : "50 m² (Mid-Batch)"}</span>
                <span>{locale === "zh" ? "300 m² (规模大货)" : "300 m² (High Volume)"}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              {[5, 50, 150].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setOrderArea(preset)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    orderArea === preset
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                      : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400"
                  }`}
                >
                  {locale === "zh" ? `${preset} m² 快捷选择` : `${preset} m² Quick Select`}
                </button>
              ))}
            </div>

            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <Building2 className="size-5 text-emerald-600 shrink-0" />
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {locale === "zh"
                  ? "福建武平15,000m²实体厂房直产直销，无外发转包，无贸易商中间抽成。"
                  : "Manufactured at our 15,000m² facility in Wuping High-Tech Zone. No subcontracting, no secret brokers."}
              </p>
            </div>
          </Card>

          {/* Results Comparison Display */}
          <div className="lg:col-span-6 space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Broker Column */}
              <Card className="p-6 rounded-3xl border-rose-200 dark:border-rose-950/60 bg-rose-50/50 dark:bg-rose-950/20 space-y-3">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
                  <XCircle className="size-4" />
                  <span>{locale === "zh" ? "普通贸易商 / 中介转包公司" : "Trading Company Broker"}</span>
                </div>
                <div className="text-3xl font-black font-mono text-slate-900 dark:text-white">
                  ${brokerTotal.toLocaleString()}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {locale === "zh"
                    ? "包含25%-35%中间商加价利润、层层转达沟通成本与额外杂费。"
                    : "Includes 25%-35% broker commission, relayed communication markups, and handling fees."}
                </p>
              </Card>

              {/* Direct Factory Column */}
              <Card className="p-6 rounded-3xl border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 space-y-3 shadow-lg shadow-emerald-600/10 relative overflow-hidden">
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase">
                  {locale === "zh" ? "源头实体大厂" : "Direct Factory"}
                </div>
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="size-4" />
                  <span>{locale === "zh" ? "FT PCB 源头直营实体" : "FT PCB Direct Factory"}</span>
                </div>
                <div className="text-3xl font-black font-mono text-emerald-700 dark:text-emerald-300">
                  ${directTotal.toLocaleString()}
                </div>
                <p className="text-xs text-emerald-800/80 dark:text-emerald-200/80">
                  {locale === "zh"
                    ? "纯正出厂底价 + 免费2小时CAM工程审核 + 100%全网表四线开尔文低阻电测。"
                    : "Direct wholesale factory rate + free CAM DFM review + 100% free Kelvin e-testing included."}
                </p>
              </Card>
            </div>

            {/* Savings Banner */}
            <Card className="p-6 rounded-3xl border-emerald-500/30 bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                    {locale === "zh" ? "项目净节省采购预算" : "Net Project Savings"}
                  </div>
                  <div className="text-4xl font-black font-mono">
                    {locale === "zh"
                      ? `立省 $${totalSavings.toLocaleString()} 美元`
                      : `Save $${totalSavings.toLocaleString()} USD`}
                  </div>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-center">
                  <div className="text-2xl font-black font-mono">{savingsPercent}%</div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-100">
                    {locale === "zh" ? "综合降本幅度" : "Cost Reduction"}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs text-emerald-100">
                <span className="flex items-center gap-1.5">
                  <Zap className="size-3.5" />
                  <span>{locale === "zh" ? "2小时资深CAM直审" : "2-Hour Direct CAM Review"}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  <span>{locale === "zh" ? "24H - 48H 极速出厂" : "24H - 48H Rapid Build"}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5" />
                  <span>{locale === "zh" ? "IATF 16949 车规认证" : "IATF 16949 Standard"}</span>
                </span>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button asChild size="lg" className="rounded-full px-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/30 cursor-pointer">
                <Link href="/pcb-quote">
                  {locale === "zh" ? "立即锁定源头出厂批发底价" : "Lock In Direct Factory Rates Now"}
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab 2: Direct vs Broker Table */}
      {activeTab === "table" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80">
                  <th className="py-4 px-6 font-bold text-slate-700 dark:text-slate-300 w-1/4">
                    {locale === "zh" ? "核心工艺对比项" : "Evaluation Factor"}
                  </th>
                  <th className="py-4 px-6 font-bold text-rose-600 dark:text-rose-400 w-1/3">
                    <div className="flex items-center gap-2">
                      <XCircle className="size-4" />
                      <span>{locale === "zh" ? "传统外贸中介 / 样板小厂" : "Traditional PCB Broker"}</span>
                    </div>
                  </th>
                  <th className="py-4 px-6 font-bold text-emerald-600 dark:text-emerald-400 w-5/12 bg-emerald-50/50 dark:bg-emerald-950/20">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4" />
                      <span>{locale === "zh" ? "FT PCB 源头直营实体厂" : "FT PCB Direct Factory"}</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {comparisonData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-slate-100">
                      {item.feature}
                    </td>
                    <td className="py-4 px-6 text-slate-600 dark:text-slate-400">
                      <div className="flex items-start gap-2">
                        <XCircle className="size-4 text-rose-500 shrink-0 mt-0.5" />
                        <span>{item.broker}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 bg-emerald-50/30 dark:bg-emerald-950/10">
                      <div className="space-y-1">
                        <div className="flex items-start gap-2 font-semibold text-emerald-800 dark:text-emerald-200">
                          <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item.feitian}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 pl-6">
                          {item.detail}
                        </p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Tab 3: 3 Ironclad Guarantees */}
      {activeTab === "guarantees" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid gap-6 md:grid-cols-3"
        >
          {/* Guarantee 1 */}
          <Card className="p-8 rounded-3xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg space-y-4 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
            <div className="size-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="size-6" />
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                Zero-Defect Quality Guarantee
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                If any fabricated board fails to comply with your approved Gerber files or IPC Class 2/3 specifications, we provide <strong>100% free expedited remakes</strong> or an immediate refund.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5" /> IATF 16949 Certified Audit Protocol
            </div>
          </Card>

          {/* Guarantee 2 */}
          <Card className="p-8 rounded-3xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg space-y-4 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
            <div className="size-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Clock className="size-6" />
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                Guaranteed On-Time Dispatch
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                We strictly adhere to our 24H - 48H expedite timeline. If an order ships late due to our manufacturing delay, we compensate <strong>5% per day</strong> directly toward your account.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5" /> Real-time Cloud MES Barcode Tracking
            </div>
          </Card>

          {/* Guarantee 3 */}
          <Card className="p-8 rounded-3xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg space-y-4 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
            <div className="size-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Award className="size-6" />
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                100% Genuine Raw Materials
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                We never compromise on copper or resin quality. We exclusively stock Shengyi, Kingboard, Rogers, and ITEQ with verifiable mill test certs and UL 94V-0 (E360609) tracking.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5" /> Full Batch COC & RoHS Compliant
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
