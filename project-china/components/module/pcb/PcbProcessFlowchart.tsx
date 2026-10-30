"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useLanguage } from "@/components/providers/language-provider";
import { getProcessFlowchartDictionary } from "@/lib/process-flowchart-translations";
import PcbProcessExcelFlowchart from "./PcbProcessExcelFlowchart";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Printer,
  Download,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Search,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  Compass,
  CheckCircle2,
  Sliders,
  Sun,
  Moon,
  Move,
  FileSpreadsheet,
  Network,
  Table as TableIcon,
  Building2,
  Award,
  Layers,
  Sparkles,
  FileDown,
} from "lucide-react";

export interface FactoryXlsRow {
  seq: string;
  stationZh: string;
  stationEn: string;
  category: "prep" | "inner" | "lamination" | "drill" | "plating" | "outer" | "mask" | "finish" | "mech" | "qa";
  deptZh: string;
  deptEn: string;
  machineCode: string;
  equipmentZh: string;
  equipmentEn: string;
  controlsZh: string;
  controlsEn: string;
  qualityGate: string;
  ipcStandard: string;
}

export const FACTORY_XLS_DATA: FactoryXlsRow[] = [
  {
    seq: "01",
    stationZh: "仓库收料 / 进料检验",
    stationEn: "Raw Material Warehouse (IQC)",
    category: "prep",
    deptZh: "仓储 / 品保部",
    deptEn: "Warehouse / QA Dept",
    machineCode: "WAREHOUSE",
    equipmentZh: "恒温恒湿原材料仓、铜箔覆铜板货架",
    equipmentEn: "Climate-Controlled Storage, CCL Racks",
    controlsZh: "IQC进料检验：板厚公差±0.05mm、铜箔厚度测试、Tg点与耐热性验证、批号追溯登记",
    controlsEn: "IQC incoming inspection: Thickness tolerance ±0.05mm, copper foil weight, Tg verification, lot traceability",
    qualityGate: "IQC Release Gate",
    ipcStandard: "IPC-4101 / IPC-TM-650",
  },
  {
    seq: "02",
    stationZh: "开料磨边 / 烤板",
    stationEn: "Material Cutting & Core Baking",
    category: "prep",
    deptZh: "开料车间",
    deptEn: "Material Prep Shop",
    machineCode: "P1102 / P1103",
    equipmentZh: "全自动开料裁切机、全自动磨圆角机、高温烤箱",
    equipmentEn: "Auto Shearing Machine, Corner Rounder, Curing Oven",
    controlsZh: "裁切尺寸公差±0.2mm，边缘无毛刺圆角倒角；高温预烤150℃±5℃ 4小时充分释放板材内应力",
    controlsEn: "Dimension tolerance ±0.2mm, deburred round edges; stress-relief baking at 150℃±5℃ for 4 hours",
    qualityGate: "IPQC Dimension & Warpage",
    ipcStandard: "IPC-4101 Class B",
  },
  {
    seq: "03",
    stationZh: "内层前处理 / 贴干膜",
    stationEn: "Inner Pre-treatment & Dry Film Lamination",
    category: "inner",
    deptZh: "内层图形车间",
    deptEn: "Inner Layer Imaging",
    machineCode: "P1301 / P1302",
    equipmentZh: "化学微蚀前处理线、全自动真空压膜机",
    equipmentEn: "Chemical Micro-Etch Line, Auto Vacuum Laminator",
    controlsZh: "微蚀量0.8-1.2µm保证粗糙度；无尘室Class 10,000级别贴膜，滚轮温度105℃±5℃，压力4-6kg/cm²",
    controlsEn: "Micro-etch depth 0.8-1.2µm; Class 10k cleanroom dry film lamination, roller temp 105℃±5℃, 4-6 kg/cm²",
    qualityGate: "Cleanroom IPQC Film Inspection",
    ipcStandard: "IPC-A-600 Class 3",
  },
  {
    seq: "04",
    stationZh: "内层曝光 (LDI) / 显影",
    stationEn: "Inner LDI Direct Imaging & Develop",
    category: "inner",
    deptZh: "内层图形车间",
    deptEn: "Inner Layer Imaging",
    machineCode: "P1304 / P1401",
    equipmentZh: "全自动LDI激光直接成像机、水平显影机",
    equipmentEn: "High-Precision LDI Machine, Horizontal Developer",
    controlsZh: "激光精准对位偏位≤15µm；显影液Na2CO3浓度1.0%±0.2%，喷淋压力1.8-2.5bar，未曝光干膜彻底溶解",
    controlsEn: "Laser alignment tolerance ≤15µm; Na2CO3 developer 1.0%±0.2%, spray pressure 1.8-2.5 bar",
    qualityGate: "IPQC Exposure Breakpoint",
    ipcStandard: "IPC-A-600 Class 3",
  },
  {
    seq: "05",
    stationZh: "内层酸性蚀刻 / 退膜",
    stationEn: "Inner Layer Acid Etching & Stripping",
    category: "inner",
    deptZh: "内层蚀刻车间",
    deptEn: "Inner Etch & Strip Shop",
    machineCode: "P1402 / P1403",
    equipmentZh: "DES酸性氯化铜高速蚀刻退膜连线",
    equipmentEn: "Horizontal DES Acid CuCl2 Etch & Strip Line",
    controlsZh: "CuCl2比重1.25-1.28，盐酸浓度2.0-3.0N；蚀刻线速3.2m/min，线宽/线距公差控制在±10%，退膜彻底无残胶",
    controlsEn: "CuCl2 specific gravity 1.25-1.28, HCl 2.0-3.0N; trace width/space tolerance ±10%, 100% resist stripped",
    qualityGate: "IPQC Trace Geometry & Cleanliness",
    ipcStandard: "IPC-6012 Class 2/3",
  },
  {
    seq: "06",
    stationZh: "内层光学检查 (AOI) / 确认",
    stationEn: "Inner Layer AOI & Verification",
    category: "inner",
    deptZh: "品保部 / AOI室",
    deptEn: "QA Dept / AOI Lab",
    machineCode: "Q1002 / Q1001",
    equipmentZh: "以色列进口超高清内层AOI扫描仪、高倍VRS检视台",
    equipmentEn: "High-Definition AOI Optical Scanner, VRS Station",
    controlsZh: "100%内层全扫描比对CAD CAM原始数据；严格拦截开路、短路、残铜、针孔缺陷，不良品标识隔离",
    controlsEn: "100% full scan comparing against CAD CAM vector data; 0 defect escape for opens, shorts, mousebites",
    qualityGate: "AOI 100% Release Checkpoint",
    ipcStandard: "IPC-A-600 Class 3",
  },
  {
    seq: "07",
    stationZh: "内层黑氧化 / 棕化处理",
    stationEn: "Brown Oxide Adhesion Treatment",
    category: "lamination",
    deptZh: "压合车间",
    deptEn: "Lamination Shop",
    machineCode: "Q1003",
    equipmentZh: "水平自动棕化化学沉淀处理线",
    equipmentEn: "Horizontal Brown Oxide Chemical Line",
    controlsZh: "铜面微观粗化形成蜂窝状微粗糙层，覆铜表面粗糙度Ra 0.35-0.55µm，撕裂结合力强度≥1.2kg/cm",
    controlsEn: "Micro-roughening to form microscopic tooth structure, Ra 0.35-0.55µm, peel strength ≥1.2 kg/cm",
    qualityGate: "Oxide Coating Uniformity Check",
    ipcStandard: "IPC-TM-650 2.4.8",
  },
  {
    seq: "08",
    stationZh: "叠层铆合 / 靶孔加工",
    stationEn: "Lay-Up, Prepreg Stacking & Target Pinning",
    category: "lamination",
    deptZh: "压合车间",
    deptEn: "Lamination Shop",
    machineCode: "P1502",
    equipmentZh: "全自动热熔叠板机、高频四头铆钉机",
    equipmentEn: "Automatic Lay-Up Station, 4-Head Riveting Machine",
    controlsZh: "半固化片(PP)与内层芯板依据叠层结构对称排版；红外高温电磁点焊铆合，防止多层压合滑层偏位",
    controlsEn: "PP prepreg & core boards symmetric layup per stackup design; high-frequency spot riveting against slippage",
    qualityGate: "Layer Stack Alignment Check",
    ipcStandard: "IPC-TM-650",
  },
  {
    seq: "09",
    stationZh: "多层板真空层压 (MLB)",
    stationEn: "Multilayer Vacuum Hot & Cold Pressing",
    category: "lamination",
    deptZh: "压合车间",
    deptEn: "Lamination Shop",
    machineCode: "P1601",
    equipmentZh: "大型德国进口真空热压机组、配套循环冷压机",
    equipmentEn: "Heavy-Duty Vacuum Hot Press & Cold Press Units",
    controlsZh: "热压温度曲线最高195℃±5℃，高压350-400PSI，抽真空度≤5Torr；彻底固化PP胶质，消除层间气泡",
    controlsEn: "Temp curve peak 195℃±5℃, pressure 350-400 PSI, vacuum ≤5 Torr; 100% cure, zero void/delamination",
    qualityGate: "TG Glass Transition & Microsection",
    ipcStandard: "IPC-6012 / IPC-TM-650",
  },
  {
    seq: "10",
    stationZh: "X-Ray钻靶孔 / 铣边倒角",
    stationEn: "X-Ray Target Drilling & Edge Milling",
    category: "drill",
    deptZh: "机械加工车间",
    deptEn: "CNC Drilling Shop",
    machineCode: "P1602 / P1603",
    equipmentZh: "高精智能X-Ray透视打靶机、全自动修边铣边机",
    equipmentEn: "X-Ray Target Hole Drill, Auto Edge Profiler",
    controlsZh: "X-Ray透视自动抓取内层铜箔靶心，钻出高精度销钉定位孔，对中偏位误差≤0.025mm",
    controlsEn: "X-Ray auto optical center alignment, drills inner tooling holes with offset error ≤0.025mm",
    qualityGate: "Tooling Pin Concentricity IPQC",
    ipcStandard: "IPC-6012",
  },
  {
    seq: "11",
    stationZh: "CNC数控钻孔 / 激光盲孔",
    stationEn: "CNC Mechanical & Laser Microvia Drilling",
    category: "drill",
    deptZh: "钻孔车间",
    deptEn: "CNC Drilling Shop",
    machineCode: "DRILL-CNC / LASER",
    equipmentZh: "超高速空气主轴数控钻孔机、紫外/CO2激光打孔机",
    equipmentEn: "High-Speed Air Bearing CNC Drills, UV/CO2 Laser Drills",
    controlsZh: "主轴转速200,000 RPM，最小孔径0.2mm，孔位公差±0.05mm；严控钻针寿命与孔壁粗糙度(≤25µm)",
    controlsEn: "Spindle speed 200,000 RPM, min drill 0.2mm, hole position ±0.05mm; roughness ≤25µm, strict tool life control",
    qualityGate: "100% First Article Hole Inspection",
    ipcStandard: "IPC-TM-650 2.2.6",
  },
  {
    seq: "12",
    stationZh: "等离子除胶渣 / 化学沉铜 (PTH)",
    stationEn: "Plasma Desmear & Electroless Copper (PTH)",
    category: "plating",
    deptZh: "电镀车间",
    deptEn: "Chemical Plating Line",
    machineCode: "P2101 - P2106",
    equipmentZh: "垂直自动化高导通孔化学铜沉积线",
    equipmentEn: "Vertical Automated Electroless Copper Line",
    controlsZh: "高锰酸钾除胶渣彻底清洁孔壁环氧钻污；钯活化胶体吸附，化学沉铜层厚度0.3-0.5µm，孔壁背光测试9级以上",
    controlsEn: "KMnO4 desmear clears resin smear; Pd catalyst activation, chemical copper 0.3-0.5µm, backlight rating ≥9",
    qualityGate: "Backlight 10-Class Test & Adhesion",
    ipcStandard: "IPC-6012 Class 3",
  },
  {
    seq: "13",
    stationZh: "垂直连续电镀 (VCP 整板一铜)",
    stationEn: "VCP Vertical Continuous Plating (Panel Plating)",
    category: "plating",
    deptZh: "电镀车间",
    deptEn: "VCP Plating Line",
    machineCode: "VCP-LINE",
    equipmentZh: "进口不溶性阳极垂直连续电镀VCP生产线",
    equipmentEn: "Insoluble Anode Vertical Continuous Plating Line",
    controlsZh: "整板一次电镀铜厚5-8µm；采用不溶性阳极脉冲镀，高深镀比，孔内与面铜厚度均匀性≥95%",
    controlsEn: "Panel flash copper 5-8µm; insoluble pulse plating, high throw power, hole-to-surface uniformity ≥95%",
    qualityGate: "X-Ray Copper Thickness Tester",
    ipcStandard: "IPC-6012",
  },
  {
    seq: "14",
    stationZh: "外层干膜 (ODF) / LDI曝光",
    stationEn: "Outer Layer Dry Film (ODF) & Exposure",
    category: "outer",
    deptZh: "外层图形车间",
    deptEn: "Outer Layer Imaging",
    machineCode: "P2301 - P2304",
    equipmentZh: "水平微蚀磨板机、自动贴膜机、LDI激光成像机",
    equipmentEn: "Micro-Etch Scrub, Auto Laminator, High-Precision LDI",
    controlsZh: "负片图形对位偏差≤20µm，显影喷淋压力2.0bar，未曝光线路线槽显影干净无残膜，确保图形电镀边界垂直",
    controlsEn: "Negative pattern offset ≤20µm, 2.0 bar develop spray, zero scum residue for high-aspect pattern plating",
    qualityGate: "IPQC Pattern Exposure Inspection",
    ipcStandard: "IPC-A-600 Class 3",
  },
  {
    seq: "15",
    stationZh: "图形电镀二铜 / 电镀锡 (CU2)",
    stationEn: "Pattern Acid Copper & Anti-Etch Tin Plating",
    category: "plating",
    deptZh: "电镀车间",
    deptEn: "Pattern Plating Line",
    machineCode: "P2404 / P2405",
    equipmentZh: "全自动智能化多臂行车图形电镀线",
    equipmentEn: "Automated Hoist Pattern Cu & Sn Electroplating Line",
    controlsZh: "二次电镀面铜厚度≥25µm，孔内平均铜厚≥20µm (Class 3标准≥25µm)；电镀锡层厚度4-6µm作为后续抗蚀刻保护层",
    controlsEn: "Secondary copper surface ≥25µm, hole copper ≥20µm (Class 3 ≥25µm); pure tin 4-6µm as anti-etch barrier",
    qualityGate: "Hole Wall Microsection & Cu Thickness",
    ipcStandard: "IPC-6012 Class 2 & 3",
  },
  {
    seq: "16",
    stationZh: "外层碱性蚀刻 / 退锡 (SES)",
    stationEn: "Alkaline Etching, Resist & Tin Stripping (SES)",
    category: "outer",
    deptZh: "蚀刻车间",
    deptEn: "SES Alkaline Etch Shop",
    machineCode: "P2501 - P2503",
    equipmentZh: "高精密卧式碱性氯化铜蚀刻退锡一体机",
    equipmentEn: "High-Precision Horizontal SES Alkaline Etch Machine",
    controlsZh: "退外层干膜 -> 碱性氨水蚀刻非线路铜皮(pH 8.2-8.6) -> 氟硼酸退锡露出光亮纯铜，线路无侧蚀过度",
    controlsEn: "Strip resist -> alkaline etch non-circuit Cu (pH 8.2-8.6) -> strip tin barrier to expose copper, minimal undercut",
    qualityGate: "IPQC Etch Factor & Trace Width",
    ipcStandard: "IPC-6012",
  },
  {
    seq: "17",
    stationZh: "外层AOI检查 / 中间电测",
    stationEn: "Outer AOI Optical Inspection & Semi-E-Test",
    category: "outer",
    deptZh: "品保部 / AOI室",
    deptEn: "QA Dept / AOI Lab",
    machineCode: "Q2001 / Q2002",
    equipmentZh: "超高速外层AOI扫描仪、半成品高压电测机",
    equipmentEn: "Outer AOI Optical Scanner, High-Voltage Semi-ET",
    controlsZh: "100%全板扫描开短路、缺口、针孔、铜残缺陷；关键网络半成品快速通断测试，阻绝缺陷流入下道工序",
    controlsEn: "100% outer panel scan for opens, shorts, voids; preliminary intermediate continuity test for high reliability",
    qualityGate: "Outer AOI Zero Defect Release",
    ipcStandard: "IPC-A-600 Class 3",
  },
  {
    seq: "18",
    stationZh: "阻焊绿油印刷 / 曝光显影 / 后烤",
    stationEn: "Solder Mask Coating, Exposure, Develop & Cure",
    category: "mask",
    deptZh: "防焊车间",
    deptEn: "Solder Mask Shop",
    machineCode: "P3101 - P3106",
    equipmentZh: "全自动立式喷涂/丝印机、CCD对位曝光机、隧道固化炉",
    equipmentEn: "Auto Solder Mask Coater, CCD Auto Exposure, Cure Oven",
    controlsZh: "油墨厚度线路拐角≥10µm，铜面15-25µm；曝光对位偏位≤25µm，显影净底；高温梯级烘烤150℃ 60分钟完全交联聚合",
    controlsEn: "Mask thickness: Knee ≥10µm, trace ≥15µm; exposure offset ≤25µm; multi-stage oven cure at 150℃ for 60 min",
    qualityGate: "Pencil Hardness ≥6H & Tape Cross-Hatch",
    ipcStandard: "IPC-SM-840",
  },
  {
    seq: "19",
    stationZh: "字符丝印 / 紫外固化",
    stationEn: "Legend Silkscreen Printing & UV Curing",
    category: "mask",
    deptZh: "字符车间",
    deptEn: "Silkscreen Shop",
    machineCode: "P3801 / P3802",
    equipmentZh: "超精密全自动喷墨字符机、高功率UV固化线",
    equipmentEn: "High-Resolution Inkjet Legend Printer, UV Cure Unit",
    controlsZh: "字符对位偏位≤0.05mm，字迹清晰辨识度高，油墨绝不上焊盘，强附着力测试百格不脱落",
    controlsEn: "Legend alignment ≤0.05mm, sharp high-contrast characters, zero ink on pads, 100% adhesion cross-hatch",
    qualityGate: "Visual Font Clarity & Cure Adhesion",
    ipcStandard: "IPC-SM-840",
  },
  {
    seq: "20",
    stationZh: "表面处理 (沉金/热风整平/沉锡/OSP)",
    stationEn: "Surface Finish (ENIG / HASL / Immersion Sn / OSP)",
    category: "finish",
    deptZh: "表面处理车间",
    deptEn: "Surface Finishing Shop",
    machineCode: "P3307 / P3405",
    equipmentZh: "全自动化学镍金ENIG线、垂直热风整平无铅喷锡线",
    equipmentEn: "Automated ENIG Gold Line, Lead-Free HASL Air Knife",
    controlsZh: "ENIG：化学镍厚120-200µ\"(3-5µm)，浸金厚2-3µ\"(0.05-0.08µm)；HASL：锡面光亮平整无挂锡；OSP：有机膜厚0.2-0.5µm",
    controlsEn: "ENIG: Ni 120-200µ\", Au 2-3µ\"; HASL: smooth level solder pads; Immersion Tin: 1.0-1.2µm; OSP: 0.2-0.5µm",
    qualityGate: "X-Ray Metal Film Gauge & Solderability",
    ipcStandard: "IPC-4552 (ENIG) / IPC-4554 (Sn)",
  },
  {
    seq: "21",
    stationZh: "CNC数控锣板 / V-Cut割线 / 倒角",
    stationEn: "CNC Panel Routing & Precision V-Scoring",
    category: "mech",
    deptZh: "成型车间",
    deptEn: "Mechanical Routing Shop",
    machineCode: "P3801 - P3804",
    equipmentZh: "超高速CNC多轴成型铣板机、高精密V-CUT切槽机",
    equipmentEn: "Multi-Spindle CNC Routers, High-Precision V-Cutters",
    controlsZh: "成型外形尺寸公差±0.1mm；V-Cut残厚公差±0.05mm，对刀中心对位偏位≤0.05mm，板边光滑无毛刺崩角",
    controlsEn: "Outline routing tolerance ±0.1mm; V-Cut web thickness ±0.05mm, alignment ≤0.05mm, smooth edge without burrs",
    qualityGate: "2D Projector Dimensional Inspection",
    ipcStandard: "IPC-6012",
  },
  {
    seq: "22",
    stationZh: "电性能测试 (ET) / 四线低阻测试",
    stationEn: "Electrical Testing (ET) & 4-Wire Kelvin",
    category: "qa",
    deptZh: "电测车间",
    deptEn: "E-Testing Lab",
    machineCode: "Q3002 / Q3001",
    equipmentZh: "超高速多探头飞针测试机、精密万用专用治具电测机",
    equipmentEn: "High-Speed Flying Probe Testers, Universal Grid Testers",
    controlsZh: "100%全板网络导通与绝缘耐压测试：开路门槛阻抗10-50Ω，绝缘高阻门槛≥100MΩ，测试电压250V-300V",
    controlsEn: "100% netlist testing: Continuity threshold 10-50Ω, isolation resistance ≥100MΩ, test voltage 250V-300V",
    qualityGate: "100% Open/Short Defect-Free Stamp",
    ipcStandard: "IPC-9252 Class 3",
  },
  {
    seq: "23",
    stationZh: "最终外观检验 (FQC) / 弯曲度平整度",
    stationEn: "Final Quality Control (FQC) & Warpage Check",
    category: "qa",
    deptZh: "品质管理部",
    deptEn: "Quality Assurance Dept",
    machineCode: "Q3101 - Q3104",
    equipmentZh: "智能AVI外观检查机、高精三次元测量仪、整平机",
    equipmentEn: "Smart AVI Cosmetic Scanner, 3D CMM, De-warping Unit",
    controlsZh: "100%人工加机器外观复检，检查孔径、线宽、阻焊与字符；大理石平台弓曲扭曲率测试≤0.75% (SMT级≤0.5%)",
    controlsEn: "100% optical & visual acceptance; bow & twist warpage testing ≤0.75% (SMT tight spec ≤0.5%), zero scratch",
    qualityGate: "FQC Final Acceptance Quality Gate",
    ipcStandard: "IPC-A-600 Class 2 & 3",
  },
  {
    seq: "24",
    stationZh: "出货品质稽核 (FQA) / 包装出货",
    stationEn: "Outgoing Quality Audit (FQA) & Vacuum Packing",
    category: "qa",
    deptZh: "品质部 / 包装组",
    deptEn: "QA Audit / Shipping",
    machineCode: "FQA / PS",
    equipmentZh: "工业防静电自动真空包装机、打码称重封箱机",
    equipmentEn: "Auto ESD Vacuum Packaging Machine, Sealer & Weigher",
    controlsZh: "AQL 0.65加严出厂抽检，出具完整COC合格证书、出货切片报告、阻抗报告；防潮铝箔袋真空抽气加干燥剂与湿度卡",
    controlsEn: "AQL 0.65 outgoing audit, Certificate of Conformance (COC), microsection & impedance report, ESD vacuum seal with desiccant",
    qualityGate: "QA Plant Release Authorization",
    ipcStandard: "IPC-A-600 / ISO 9001 / IATF 16949",
  },
];

export function getMultilayerMermaidCode(isDarkMode: boolean): string {
  const mainStyle = isDarkMode
    ? "fill:#9a3412,stroke:#f59e0b,stroke-width:3px,color:#ffffff,font-weight:800,font-size:15px,rx:8,ry:8"
    : "fill:#fef3c7,stroke:#d97706,stroke-width:2.5px,color:#78350f,font-weight:800,font-size:15px,rx:8,ry:8";
  const subStyle = isDarkMode
    ? "fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#f8fafc,font-weight:700,font-size:13.5px,rx:6,ry:6"
    : "fill:#f0f9ff,stroke:#0284c7,stroke-width:2px,color:#0c4a6e,font-weight:700,font-size:13.5px,rx:6,ry:6";
  const qcStyle = isDarkMode
    ? "fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#ecfdf5,font-weight:800,font-size:14px,rx:8,ry:8"
    : "fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#064e3b,font-weight:800,font-size:14px,rx:8,ry:8";
  const branchStyle = isDarkMode
    ? "fill:#431407,stroke:#ea580c,stroke-width:3px,color:#fed7aa,font-weight:800,font-size:15px,rx:8,ry:8"
    : "fill:#fff7ed,stroke:#ea580c,stroke-width:2.5px,color:#9a3412,font-weight:800,font-size:15px,rx:8,ry:8";

  return `flowchart TD
    classDef mainNode ${mainStyle};
    classDef subNode ${subStyle};
    classDef qcNode ${qcStyle};
    classDef branchTitle ${branchStyle};

    A["1. WAREHOUSE (原材料仓)"] -->|"Incoming Material Inspection (IQC)"| B["2. SHEAR MATERIAL (开料开孔)"]
    
    subgraph S1["Material Preparation Sub-steps (开料备料工序)"]
        direction TB
        B1["Core Cutting - P1102 (基板裁切)"]
        B2["Core Baking & Stress Relief - P1103 (高温烤板消应力)"]
    end
    B -.-> S1

    B --> C["3. INNER LAYER IMAGE TRANSFER (内层图形转移 I/T)"]
    
    subgraph S2["Inner Photolithography Stages (内层微影工序)"]
        direction TB
        C1["Chemical Pre-treatment - P1301 (化学微蚀除油)"] --> C2["Dry Film Vacuum Lamination - P1302 (压贴干膜)"]
        C2 --> C3["Laser Direct Imaging LDI - P1304 (激光直接成像曝光)"]
        C3 --> C4["Resist Developing - P1401 (显影退未曝光膜)"]
    end
    C -.-> S2

    C --> D["4. INNER LAYER ETCH & STRIP (内层酸性蚀刻退膜 I/ES)"]
    
    subgraph S3["Etch & Strip Sequence (酸性蚀刻序列)"]
        direction TB
        D1["Acid Copper Etching - P1402 (酸性氯化铜蚀刻)"] --> D2["Resist Stripping - P1403 (苛性钠退膜)"]
    end
    D -.-> S3

    D -->|"IPQC Inspection"| E["5. INNER LAYER INSPECTION (内层光学检验 Inp1)"]
    
    subgraph S4["Inner Layer Defect Verification (内层缺陷拦截)"]
        direction TB
        E1["Automatic Optical Inspection AOI - Q1002 (全自动光学检测)"]
        E2["Visual Verification & Repair - Q1001 (高倍显微检视)"]
    end
    E -.-> S4

    E --> F["6. LAY-UP & DRILL TARGET (叠层排版打靶 L/U)"]
    
    subgraph S5["Stack-up Preparation (多层叠层准备)"]
        direction TB
        F1["Brown Oxide Adhesion Treatment - Q1003 (氧化棕化粗化)"]
        F2["Prepreg & Foil Lay-up Riveting - P1502 (PP半固化片叠层铆合)"]
    end
    F -.-> S5

    F --> G["7. MLB LAMINATION (真空多层压合 M.L)"]
    
    subgraph S6["Hot Pressing & Post-Lamination (热压与后处理)"]
        direction TB
        G1["Vacuum Hot & Cold Pressing - P1601 (德国真空热压机组)"]
        G2["Panel Edge Shearing - P1602 (板边剪裁齐边)"]
        G3["X-Ray Target Hole Drilling - P1603 (X-Ray透视钻靶孔)"]
    end
    G -.-> S6

    G --> H["8. DRILL HOLES (CNC数控钻孔)"]
    
    subgraph S7["Hole Drilling Execution (导通孔与激光孔)"]
        direction TB
        H1["NC High-Speed Through-Hole Drilling (200k RPM数控通孔钻)"]
        H2["Laser Microvia Blind-Hole Drilling (CO2/UV激光微盲孔打孔)"]
    end
    H -.-> S7

    H -->|"IPQC Hole Check"| I["9. CHEMICAL COPPER DEPOSITION (化学沉铜 PTH)"]
    
    subgraph S8["Hole Metallization Chemistry (孔壁金属化化铜)"]
        direction TB
        I1["Sweller & Desmear - P2101/P2102 (膨松去钻污)"]
        I2["Neutralizer & Glass Etch - P2103/P2104 (中和浸蚀玻璃布)"]
        I3["Conditioner & Catalyst Activation - P2105 (调整剂与钯活化)"]
        I4["Electroless Copper Deposition - P2106 (化学薄铜沉积 0.3-0.5µm)"]
    end
    I -.-> S8

    I --> J["10. VCP VERTICAL CONTINUOUS PLATING (全板一铜一次电镀)<br/>Insoluble Anode Panel Plating"]

    J --> K["11. OUTER LAYER DRY FILM (外层干膜 LDI 曝光 ODF)"]
    
    subgraph S9["Outer Layer Photolithography (外层微影图形)"]
        direction TB
        K1["Micro-Etch Surface Cleaning - P2301 (微蚀物理打磨清洁)"]
        K2["Outer Dry Film Lamination - P2302 (外层压贴干膜)"]
        K3["LDI / UV Exposure - P2303 (外层激光直接曝光)"]
        K4["Resist Developing - P2304 (负片显影暴露线路槽)"]
    end
    K -.-> S9

    K --> L["12. PATTERN & TIN ELECTROPLATING (图形电镀二铜及镀锡 CU2)"]
    
    subgraph S10["Pattern Electroplating Stages (二次加厚电镀)"]
        direction TB
        L1["Acid Copper Pattern Plating - P2404 (线路及孔壁铜加厚 ≥20-25µm)"]
        L2["Tin Anti-Etch Plating - P2405 (电镀纯锡保护层 4-6µm)"]
    end
    L -.-> S10

    L --> M["13. OUTER LAYER ETCH & STRIP (碱性蚀刻与退锡 SES)"]
    
    subgraph S11["SES Operations (退膜-碱蚀-退锡)"]
        direction TB
        M1["Resist Stripping - P2501 (退除外层干膜)"]
        M2["Alkaline Copper Etching - P2502 (碱性蚀刻去除底铜)"]
        M3["Tin Resist Stripping - P2503 (退除抗蚀锡层露出纯铜)"]
    end
    M -.-> S11

    M -->|"IPQC Gate"| N["14. OUTER AOI & INTERMEDIATE TEST (外层AOI光学检查与中间测试)"]
    
    subgraph S12["Outer Circuit Integrity Testing (外层电气完整性检查)"]
        direction TB
        N1["Outer Layer AOI - Q2001 (外层超高清全检)"]
        N2["Semi-Finished Electrical Test - Q2002 (半成品耐压导通测试)"]
        N3["Visual Inspection - Q2003 (外观目视复验)"]
    end
    N -.-> S12

    N --> O["15. OUTER LAYER INSPECTION (外层防焊前处理清洗 Inp2)"]

    O --> P["16. SOLDER MASK & LEGEND SILKSCREEN (防焊绿油印刷及字符丝印)"]
    
    subgraph S13["Solder Mask & Nomenclature (防焊油墨与标识)"]
        direction TB
        P1["Solder Mask Coating / CCD Exposure / Develop - P3101-P3105 (阻焊立式涂覆/曝光显影)"]
        P2["Legend Silkscreen Printing - P3801 (全自动喷墨字符印刷)"]
        P3["Final Thermal & UV Post-Curing - P3106/P3802 (高温烘烤完全固化)"]
    end
    P -.-> S13

    P -->|"IPQC Check"| Q{"17. SURFACE TREATMENT (表面处理工艺分流)<br/>Process Branching by Customer Spec"}

    BR1["Option A: Vertical Hot Air Solder Leveling<br/>(无铅热风整平 VHASL / HASL)"]
    BR2["Option B: Electroless Nickel Immersion Gold<br/>(化学镍金沉金 ENIG 2-3 µ-inch Au)"]
    BR3["Option C: Immersion Finishes / OSP<br/>(沉锡 / 沉银 / 有机保焊膜 OSP)"]

    Q -->|HASL Finish| BR1
    Q -->|ENIG Finish| BR2
    Q -->|Immersion / OSP| BR3

    subgraph S_HASL["VHASL Line Operations (喷锡生产线)"]
        direction TB
        H_sub["微蚀清洁 -> 涂助焊剂 -> 垂直无铅高温浸锡 (260℃) -> 风刀整平 (P3405) -> 清洗"]
    end
    BR1 -.-> S_HASL

    subgraph S_ENIG["ENIG Line Operations (化镍金生产线)"]
        direction TB
        E_sub["除油酸洗 -> 微蚀粗化 -> 钯催化活化 -> 化学镍层 (120-200 µ-inch) -> 置换沉金 (2-3 µ-inch) (P3307)"]
    end
    BR2 -.-> S_ENIG

    subgraph S_OSP["Immersion & OSP Operations (沉锡/沉银/OSP生产线)"]
        direction TB
        O_sub["酸性除油 -> 均匀微蚀 -> 化学反应沉锡/沉银或有机配位保焊膜喷涂 (0.2-0.5µm) -> 水洗烘干"]
    end
    BR3 -.-> S_OSP

    BR1 --> R["18. FINAL MECHANICAL FABRICATION (外形机械成型加工 FF)"]
    BR2 --> R
    BR3 --> R

    subgraph S14["Mechanical Finishing (成型加工工序)"]
        direction TB
        R1["High-Precision CNC Panel Routing - P3801 (多轴数控锣板铣外形)"]
        R2["V-Scoring / V-Cut Groove Slicing - P3803 (高精V-CUT切槽)"]
        R3["Edge Chamfering, Slotting & Punching - P3802/P3804 (金手指斜边/打端子孔)"]
    end
    R -.-> S14

    R --> S["19. ELECTRICAL TEST (100% 最终电气性能测试 ET)"]
    
    subgraph S15["Continuity & Isolation Verification (网络导通与绝缘验证)"]
        direction TB
        S1["Flying Probe & Universal Grid Fixture E-Test - Q3002 (飞针与专用测试机 250V)"]
        S2["Post-Test Ultrasonic De-dusting - Q3001 (测试后超声波除尘清洁)"]
    end
    S -.-> S15

    S --> T["20. FINAL QUALITY CONTROL (100% 最终出货前品质全检 FQC)"]
    
    subgraph S16["Comprehensive Final Acceptance (最终外观与物理合格检验)"]
        direction TB
        T1["Warpage Repair & Planarity Check - Q3103 (平整度检测与反压去翘曲 ≤0.75%)"]
        T2["Hole Gauge & 2D Optical Dimension - Q3101 (孔径通止规与二次元量测)"]
        T3["100% Visual Cosmetic & Workmanship Inspection - Q3104 (外观、阻焊、金厚、焊锡性全检)"]
    end
    T -.-> S16

    T -->|"QA Release Gate"| U["21. OUTGOING QUALITY AUDIT (出货品质保证与最终稽核 FQA)"]

    U --> V["22. PACKING & SHIPPING (防潮防静电真空包装入库 PS)"]

    class A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,R,S,T,U,V mainNode;
    class B1,B2,C1,C2,C3,C4,D1,D2,E1,E2,F1,F2,G1,G2,G3,H1,H2,I1,I2,I3,I4,K1,K2,K3,K4,L1,L2,M1,M2,M3,N1,N2,N3,P1,P2,P3,R1,R2,R3,S1,S2,T1,T2,T3,H_sub,E_sub,O_sub subNode;
    class Q branchTitle;
    class BR1,BR2,BR3 mainNode;
    class S1,S2,S3,S4,S5,S6,S7,S8,S9,S10,S11,S12,S13,S14,S15,S16,S_HASL,S_ENIG,S_OSP qcNode;
`;
}

export function getDoublesidedMermaidCode(isDarkMode: boolean): string {
  const mainStyle = isDarkMode
    ? "fill:#9a3412,stroke:#f59e0b,stroke-width:3px,color:#ffffff,font-weight:800,font-size:15px,rx:8,ry:8"
    : "fill:#fef3c7,stroke:#d97706,stroke-width:2.5px,color:#78350f,font-weight:800,font-size:15px,rx:8,ry:8";
  const subStyle = isDarkMode
    ? "fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#f8fafc,font-weight:700,font-size:13.5px,rx:6,ry:6"
    : "fill:#f0f9ff,stroke:#0284c7,stroke-width:2px,color:#0c4a6e,font-weight:700,font-size:13.5px,rx:6,ry:6";
  const qcStyle = isDarkMode
    ? "fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#ecfdf5,font-weight:800,font-size:14px,rx:8,ry:8"
    : "fill:#ecfdf5,stroke:#059669,stroke-width:2px,color:#064e3b,font-weight:800,font-size:14px,rx:8,ry:8";
  const branchStyle = isDarkMode
    ? "fill:#431407,stroke:#ea580c,stroke-width:3px,color:#fed7aa,font-weight:800,font-size:15px,rx:8,ry:8"
    : "fill:#fff7ed,stroke:#ea580c,stroke-width:2.5px,color:#9a3412,font-weight:800,font-size:15px,rx:8,ry:8";

  return `flowchart TD
    classDef mainNode ${mainStyle};
    classDef subNode ${subStyle};
    classDef qcNode ${qcStyle};
    classDef branchTitle ${branchStyle};

    DA["1. 仓库原材料 (WAREHOUSE)"] -->|"进料检验 (IQC Incoming)"| DB["2. 裁板备料 (SHEAR MATERIAL)"]
    
    subgraph DS1["开料备料工序 (Shear Operations)"]
        direction TB
        DB1["发料 - P1101 (CCL Issue)"]
        DB2["裁板 - P1102 (Core Cutting)"]
        DB3["高温烤板消应力 - P1103 (Baking 150℃)"]
    end
    DB -.-> DS1

    DB -->|"双面板无需内层直接进入钻孔"| DC["3. 数控钻孔 (DRILL HOLES)"]
    
    subgraph DS2["数控钻孔加工 (NC Drilling)"]
        direction TB
        DC1["数控通孔钻 - P170 (NC High-Speed Drill NDH)"]
        DC2["镭射微盲孔 - P175 (Laser Drill Holes)"]
    end
    DC -.-> DS2

    DC -->|"IPQC 孔壁质量与毛刺检验"| DD["4. 水平化学沉铜 (PTH HOLE METALLIZATION)"]
    
    subgraph DS3["水平沉铜孔壁金属化 (PTH Sequence)"]
        direction TB
        DD1["膨松去残胶 - P2101 (Sweller)"]
        DD2["除胶渣 - P2102 (Desmear)"]
        DD3["酸性中和 - P2103 (Neutralizer)"]
        DD4["双面磨板 - P2104 (Scrubbex)"]
        DD5["整孔调理 - P2105 (Conditioner)"]
        DD6["氧化催化钯活化 - P210 (Initiator / Catalyst)"]
        DD7["化学沉铜沉积 (0.3-0.5µm Electroless Cu)"]
    end
    DD -.-> DS3

    DD --> DE["5. 图形电镀与一次加厚镀铜 (PATTERN & TIN ELECTROPLATE / VCP)"]
    
    subgraph DS4["电镀生产线 (Plating Sequence)"]
        direction TB
        DE1["酸性脱脂清洁 - P2401 (Conditioner)"]
        DE2["过硫酸钠微蚀 - P2402 (Micro Etch)"]
        DE3["稀硫酸酸浸 - P2402 (Acid Dip)"]
        DE4["图形镀铜加厚 - P2404 (Cu Plating ≥20-25µm)"]
        DE5["抗蚀电镀纯锡 - P2405 (Sn Plating 4-6µm)"]
    end
    DE -.-> DS4

    DE -->|"IPQC 铜厚检验"| DF["6. 外层干膜图形制作 (OUTER LAYER DRY FILM ODF)"]
    
    subgraph DS5["外层微影光阻 (ODF Photolithography)"]
        direction TB
        DF1["微蚀刷磨前处理 - P2301 (Per-Treatment)"]
        DF2["真空热压干膜 - P2302 (F/M Cover Lamination)"]
        DF3["高精激光曝光 LDI - P2303 (Exposure)"]
        DF4["碳酸钠显影露线路 - P2304 (Develop)"]
        DF5["显影后光学检查 - Q2010 (AOI Inspection)"]
    end
    DF -.-> DS5

    DF --> DG["7. 外层碱性蚀铜退锡 (OUTER LAYER ETCH & STRIP OES)"]
    
    subgraph DS6["退膜蚀刻退锡 (SES Operations)"]
        direction TB
        DG1["苛性钠退干膜 - P2501 (F/M Strip)"]
        DG2["碱性氯化铜蚀刻 - P2502 (Line Etch)"]
        DG3["硝酸快速退锡 - P2503 (Tin Strip)"]
    end
    DG -.-> DS6

    DG -->|"IPQC 线路全检"| DH["8. 外层半成品光学与电性能检验 (OUTER INSPECTION Insp2)"]
    
    subgraph DS7["外层品质验证 (Defect Verification)"]
        direction TB
        DH1["全自动高倍光学AOI - Q2001 (AOI Inspection)"]
        DH2["半成品导通绝缘测试 - Q2002 (E-Test)"]
        DH3["目视高倍显微复验 - Q2003 (Visual Inspection)"]
    end
    DH -.-> DS7

    DH --> DI["9. 液态感光防焊绿油 (LIQUID SOLDERMASK & CURE LSM)"]
    
    subgraph DS8["防焊绝缘工序 (Soldermask Sequence)"]
        direction TB
        DI1["阻焊前酸洗打磨 - P3101 (Per-Treatment)"]
        DI2["立式喷涂/丝印印刷 - P3102 (Curtain Coating S/M)"]
        DI3["对流风道前烘烤 - P3103 (Pre-Baking 75℃)"]
        DI4["CCD高精对位曝光 - P3104 (Exposure)"]
        DI5["弱碱显影露焊盘 - P3105 (Develop)"]
        DI6["高温完全热固化 - P3106 (Post Cure 150℃)"]
    end
    DI -.-> DS8

    DI --> DJ["10. 字符丝印与金手指电镀 (SILKSCREEN LEGEND & GOLD FINGER)"]
    
    subgraph DS9["文字标识与插头镀金 (Legend & Bevel)"]
        direction TB
        DJ1["UV固化文字喷墨 - P360 (PC-UV Inkjet / UV Solidify P3602)"]
        DJ2["热固化文字网印 - P365 (Legend Silk Screen P3651 / Post Cure P3652)"]
        DJ3["碳油印刷与固化 - P368 (Carbon Silk Screen P3681 / Cure P3682)"]
        DJ4["金手指插头镀金 - P330 (贴胶P3301 -> 镀镍P3302 -> 镀金P3303 -> 撕胶P3304)"]
    end
    DJ -.-> DS9

    DJ -->|"IPQC Check"| DK{"11. 表面处理工艺分流 (SURFACE TREATMENT)<br/>按客户订单指定工艺分流"}

    DBR1["Option A: 垂直热风整平 (VHASL / HASL)<br/>无铅锡厚 1-35µm 良好焊接性"]
    DBR2["Option B: 化学沉镍金 (ENIG)<br/>镍厚 120-200 µ-inch, 金厚 2-3 µ-inch"]
    DBR3["Option C: 有机保焊膜 (OSP)<br/>Entek 膜厚 0.2-0.5µm 极佳共面度"]
    DBR4["Option D: 化学浸银/沉锡 (IM Ag / IM Tin)<br/>银厚 0.1-0.4µm / 锡厚 ≥1.0µm"]

    DK -->|喷锡线| DBR1
    DK -->|沉金线| DBR2
    DK -->|OSP线| DBR3
    DK -->|沉银/沉锡| DBR4

    subgraph DS_VHASL["垂直喷锡工序 (VHASL Line)"]
        direction TB
        DH_sub["贴胶P3401 -> 压胶P3402 -> 前清洁P3403 -> 上助焊剂P3404 -> 垂直无铅浸锡风刀整平P3405 (260℃) -> 后清洗P3406 -> 撕胶P3407"]
    end
    DBR1 -.-> DS_VHASL

    subgraph DS_ENIG["沉镍金工序 (ENIG Line)"]
        direction TB
        DE_sub["脱脂P3301 -> 中和P3302 -> 微蚀P3303 -> 预浸P3304 -> 钯活化P3305 -> 电镍P3306 -> 电金P3307"]
    end
    DBR2 -.-> DS_ENIG

    subgraph DS_OSP["OSP保焊膜工序 (OSP Line)"]
        direction TB
        DO_sub["脱脂P4001 -> 微蚀P4002 -> 酸浸P4003 -> 抗氧化配位膜P4005 -> 烘干P4006"]
    end
    DBR3 -.-> DS_OSP

    DBR1 --> DL["12. 机械外形成型加工 (FINAL FABRICATION FF)"]
    DBR2 --> DL
    DBR3 --> DL
    DBR4 --> DL

    subgraph DS10["机械加工成型工序 (FF Operations)"]
        direction TB
        DL1["多轴数控精密锣板 - P3801 (CNC Routing)"]
        DL2["模具精密冲压啤板 - P3802 (Punching)"]
        DL3["微切高精V槽 - P3803 (V-Cut Slicing)"]
        DL4["金手指端子斜边 - P3804 (G/F Beveling 30°/45°)"]
    end
    DL -.-> DS10

    DL --> DM["13. 100% 最终电气性能测试 (ELECTRICAL TEST ET)"]
    
    subgraph DS11["开短路电气检测 (Continuity & Isolation)"]
        direction TB
        DM1["超声波环保清洗除尘 - Q3001 (Clean)"]
        DM2["高压专用机与飞针测试 - Q3002 (E-Test 250V / 20MΩ)"]
    end
    DM -.-> DS11

    DM --> DN["14. 100% 最终品质外观全检 (FINAL QUALITY CONTROL FQC)"]
    
    subgraph DS12["最终合格检验工序 (FQC Acceptance)"]
        direction TB
        DN1["通止规孔径检验 - Q3101 (Hole Check)"]
        DN2["平整度量测与反压平翘 - Q3103 (Warpage Repair ≤0.75%)"]
        DN3["100% 显微外观及可焊性全检 - Q3104 (Vision Inspection)"]
    end
    DN -.-> DS12

    DN -->|"QA 终检验收合格放行"| DO["15. 出货品质稽核 (OUTGOING QUALITY AUDIT FQA)"]

    DO --> DP["16. 包装与入库出货 (PACKING & SHIPPING PS)"]

    class DA,DB,DC,DD,DE,DF,DG,DH,DI,DJ,DL,DM,DN,DO,DP mainNode;
    class DB1,DB2,DB3,DC1,DC2,DD1,DD2,DD3,DD4,DD5,DD6,DD7,DE1,DE2,DE3,DE4,DE5,DF1,DF2,DF3,DF4,DF5,DG1,DG2,DG3,DH1,DH2,DH3,DI1,DI2,DI3,DI4,DI5,DI6,DJ1,DJ2,DJ3,DJ4,DL1,DL2,DL3,DL4,DM1,DM2,DN1,DN2,DN3,DH_sub,DE_sub,DO_sub subNode;
    class DK branchTitle;
    class DBR1,DBR2,DBR3,DBR4 mainNode;
    class DS1,DS2,DS3,DS4,DS5,DS6,DS7,DS8,DS9,DS10,DS11,DS12,DS_VHASL,DS_ENIG,DS_OSP qcNode;
`;
}

export default function PcbProcessFlowchart() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { locale } = useLanguage();
  const t = useMemo(() => getProcessFlowchartDictionary(locale), [locale]);
  const [mounted, setMounted] = useState<boolean>(false);

  // View Mode: 'all' (Both Flowchart & XLS) | 'topology' (SVG Flowchart) | 'spreadsheet' (Official XLS Sheet)
  const [activeView, setActiveView] = useState<"all" | "topology" | "spreadsheet">("all");
  // Flowchart Type: 'multilayer' (Sheet 2) vs 'doublesided' (Sheet 1)
  const [chartType, setChartType] = useState<"multilayer" | "doublesided">("multilayer");
  // Diagram Style: 'excel' (Exact factory XLS layout) vs 'topology' (Mermaid abstract nodes)
  const [diagramStyle, setDiagramStyle] = useState<"excel" | "topology">("excel");

  // Smart Zoom range: 25% (0.25) to 500% (5.0)
  const [zoom, setZoom] = useState<number>(1.0);
  const [svgContent, setSvgContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Smooth pointer-captured drag-to-pan states
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragStartRef = useRef<{ clientX: number; clientY: number; panX: number; panY: number }>({
    clientX: 0,
    clientY: 0,
    panX: 0,
    panY: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const chartWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted ? resolvedTheme === "dark" : true;

  // Render chart whenever theme changes
  useEffect(() => {
    let isCurrent = true;

    async function loadMermaidLibrary(): Promise<any> {
      if (typeof window === "undefined") return null;
      if ((window as any).mermaid) {
        return (window as any).mermaid;
      }

      return new Promise((resolve, reject) => {
        const scriptId = "mermaid-cdn-runtime";
        let script = document.getElementById(scriptId) as HTMLScriptElement | null;

        if (script) {
          if ((window as any).mermaid) {
            return resolve((window as any).mermaid);
          }
          script.addEventListener("load", () => resolve((window as any).mermaid));
          script.addEventListener("error", (e) => reject(e));
          return;
        }

        script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js";
        script.async = true;
        script.onload = () => {
          if ((window as any).mermaid) {
            resolve((window as any).mermaid);
          } else {
            reject(new Error("Mermaid global not found after load"));
          }
        };
        script.onerror = (err) => reject(err);
        document.head.appendChild(script);
      });
    }

    async function renderChart() {
      try {
        setIsLoading(true);
        setError(null);

        const mermaidInstance = await loadMermaidLibrary();
        if (!mermaidInstance) {
          throw new Error("Mermaid could not be initialized");
        }

        mermaidInstance.initialize({
          startOnLoad: false,
          theme: isDarkMode ? "dark" : "default",
          themeVariables: isDarkMode
            ? {
                darkMode: true,
                background: "#0f172a",
                primaryColor: "#b45309",
                primaryTextColor: "#ffffff",
                lineColor: "#94a3b8",
                textColor: "#ffffff",
                mainBkg: "#1e293b",
                edgeLabelBackground: "#1e293b",
                tertiaryTextColor: "#f8fafc",
                tertiaryColor: "#0f172a",
                clusterBkg: "#0f172a",
                clusterBorder: "#38bdf8",
                titleColor: "#38bdf8",
                nodeBorder: "#f59e0b",
                fontSize: "15px",
                fontFamily:
                  "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
              }
            : {
                darkMode: false,
                background: "#ffffff",
                primaryColor: "#d97706",
                primaryTextColor: "#0f172a",
                lineColor: "#64748b",
                textColor: "#0f172a",
                mainBkg: "#ffffff",
                edgeLabelBackground: "#ffffff",
                tertiaryTextColor: "#0f172a",
                tertiaryColor: "#f8fafc",
                clusterBkg: "#f8fafc",
                clusterBorder: "#0284c7",
                titleColor: "#0369a1",
                nodeBorder: "#d97706",
                fontSize: "15px",
                fontFamily:
                  "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
              },
          flowchart: {
            useMaxWidth: false,
            htmlLabels: true,
            curve: "basis",
            nodeSpacing: 55,
            rankSpacing: 55,
            padding: 16,
          },
          securityLevel: "loose",
        });

        const code =
          chartType === "multilayer"
            ? getMultilayerMermaidCode(isDarkMode)
            : getDoublesidedMermaidCode(isDarkMode);

        const uniqueId = `pcb-flowchart-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaidInstance.render(uniqueId, code);

        if (isCurrent) {
          // Parse natural viewBox dimensions from Mermaid SVG to guarantee pixel-perfect scaling and centering
          const vbMatch = svg.match(/viewBox=["']\s*([0-9.-]+)\s+([0-9.-]+)\s+([0-9.-]+)\s+([0-9.-]+)\s*["']/i);
          let vbWidth = 0;
          let vbHeight = 0;
          if (vbMatch) {
            vbWidth = Math.round(parseFloat(vbMatch[3]));
            vbHeight = Math.round(parseFloat(vbMatch[4]));
          }

          let cleanedSvg = svg.replace(/max-width:\s*[^;"]+;?/gi, "");
          if (vbWidth > 0) {
            cleanedSvg = cleanedSvg.replace(/<svg\b([^>]*)>/i, (_match: string, attrs: string) => {
              const cleanedAttrs = attrs
                .replace(/\bwidth=["'][^"']*["']/gi, "")
                .replace(/\bheight=["'][^"']*["']/gi, "")
                .replace(/\bstyle=["'][^"']*["']/gi, "");
              return `<svg ${cleanedAttrs} width="${vbWidth}" height="${vbHeight}" style="width:${vbWidth}px;height:auto;max-width:none;display:block;margin:0 auto;">`;
            });
          }
          setSvgContent(cleanedSvg);
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error("Mermaid rendering error:", err);
        if (isCurrent) {
          setError(err?.message || "Failed to render SVG process flowchart");
          setIsLoading(false);
        }
      }
    }

    renderChart();

    return () => {
      isCurrent = false;
    };
  }, [isDarkMode, chartType]);

  // Smart Zoom Step Controls (0.25 to 5.0)
  const setClampedZoom = useCallback((newZoom: number) => {
    const clamped = Math.max(0.25, Math.min(5.0, Number(newZoom.toFixed(2))));
    setZoom(clamped);
  }, []);

  const handleZoomIn = () => {
    setClampedZoom(zoom >= 2.0 ? zoom + 0.5 : zoom + 0.25);
  };

  const handleZoomOut = () => {
    setClampedZoom(zoom > 2.0 ? zoom - 0.5 : zoom - 0.25);
  };

  // Center chart in viewport and auto-fit scale
  const centerChart = useCallback(() => {
    setPan({ x: 0, y: 0 });
    if (containerRef.current && chartWrapperRef.current) {
      const containerWidth = containerRef.current.clientWidth - 48;
      const svgEl = chartWrapperRef.current.querySelector("svg");
      if (svgEl) {
        // Use intrinsic unscaled viewBox width, NEVER getBoundingClientRect which is multiplied by current zoom!
        let naturalWidth = 0;
        const viewBox = svgEl.viewBox?.baseVal;
        if (viewBox && viewBox.width > 0) {
          naturalWidth = viewBox.width;
        } else {
          const widthAttr = svgEl.getAttribute("width");
          if (widthAttr && !widthAttr.includes("%")) {
            naturalWidth = parseFloat(widthAttr);
          }
        }

        if (naturalWidth > 0 && containerWidth > 0) {
          if (naturalWidth > containerWidth) {
            const fitZoom = Math.max(0.25, Math.min(1.0, Number(((containerWidth - 24) / naturalWidth).toFixed(2))));
            setZoom(fitZoom);
          } else {
            setZoom(1.0);
          }
          return;
        }
      }
    }
    setZoom(1.0);
  }, []);

  const handleResetZoom = useCallback(() => {
    centerChart();
  }, [centerChart]);

  // Always center chart automatically whenever a new diagram is loaded or tab changes
  useEffect(() => {
    if (svgContent) {
      const timer = setTimeout(() => {
        centerChart();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [svgContent, centerChart]);

  // Re-center when active view tab changes
  useEffect(() => {
    if (activeView === "all" || activeView === "topology") {
      const timer = setTimeout(() => {
        centerChart();
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [activeView, centerChart]);

  // Re-center on window resize
  useEffect(() => {
    const handleResize = () => {
      centerChart();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [centerChart]);

  // Smart Mouse Wheel Zoom with Exact Cursor Focal Tracking
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
      const targetZoom = Math.max(0.25, Math.min(5.0, Number((zoom * zoomFactor).toFixed(2))));

      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const cursorX = e.clientX - rect.left;
        const cursorY = e.clientY - rect.top;

        // Mathematical focal-point zoom: point under cursor remains pinned
        const ratio = targetZoom / zoom;
        const newPanX = cursorX - (cursorX - pan.x) * ratio;
        const newPanY = cursorY - (cursorY - pan.y) * ratio;

        setPan({ x: Math.round(newPanX), y: Math.round(newPanY) });
      }

      setZoom(targetZoom);
    },
    [zoom, pan]
  );

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Export to Excel / CSV with UTF-8 BOM
  const handleExportCsv = () => {
    const isZh = locale === "zh";
    const headers = [
      t.spreadsheet.colSeq,
      t.spreadsheet.colStation,
      t.spreadsheet.colDept,
      t.spreadsheet.colCode,
      t.spreadsheet.colEquipment,
      t.spreadsheet.colControls,
      t.spreadsheet.colGate,
      t.spreadsheet.colStandard,
    ];

    const rows = FACTORY_XLS_DATA.map((row) => [
      `"${row.seq}"`,
      `"${isZh ? row.stationZh : row.stationEn} / ${isZh ? row.stationEn : row.stationZh}"`,
      `"${isZh ? row.deptZh : row.deptEn}"`,
      `"${row.machineCode}"`,
      `"${isZh ? row.equipmentZh : row.equipmentEn}"`,
      `"${isZh ? row.controlsZh : row.controlsEn}"`,
      `"${row.qualityGate}"`,
      `"${row.ipcStandard}"`,
    ]);

    const headerBlock = [
      `"${t.header.companyZh} / ${t.header.companyEn}"`,
      `"${t.header.title} - ${t.spreadsheet.title}"`,
      `"${t.header.docRef} | ${t.header.sopBadge} | ${t.header.certBadge}"`,
      `""`,
    ].join("\r\n");

    const csvContent =
      "\uFEFF" +
      headerBlock +
      "\r\n" +
      headers.join(",") +
      "\r\n" +
      rows.map((e) => e.join(",")).join("\r\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Wuping_Feitian_PCB_SOP_${locale.toUpperCase()}_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Smooth pointer-captured drag-to-pan handlers (Global tracking, zero-lag, works with mouse, touch, and stylus)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only primary button or touch/pen
    if (e.button !== 0 && e.pointerType === "mouse") return;
    setIsDragging(true);
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.clientX;
    const dy = e.clientY - dragStartRef.current.clientY;
    setPan({
      x: Math.round(dragStartRef.current.panX + dx),
      y: Math.round(dragStartRef.current.panY + dy),
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {}
    }
  };

  // Backwards-compatible aliases for mouse handlers to prevent cached reference errors
  const handleMouseDown = handlePointerDown as unknown as (e: React.MouseEvent) => void;
  const handleMouseMove = handlePointerMove as unknown as (e: React.MouseEvent) => void;
  const handleMouseUp = handlePointerUp as unknown as () => void;

  const panStep = (dx: number, dy: number) => {
    setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  // Filtered Stages for Search
  const filteredRows = FACTORY_XLS_DATA.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.seq.toLowerCase().includes(q) ||
      item.stationZh.toLowerCase().includes(q) ||
      item.stationEn.toLowerCase().includes(q) ||
      item.machineCode.toLowerCase().includes(q) ||
      item.controlsZh.toLowerCase().includes(q) ||
      item.controlsEn.toLowerCase().includes(q) ||
      item.equipmentZh.toLowerCase().includes(q) ||
      item.deptZh.toLowerCase().includes(q) ||
      item.ipcStandard.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors duration-200 dark:bg-[#0b0f19] dark:text-[#e2e8f0] font-sans antialiased pb-24 selection:bg-amber-500/30 selection:text-amber-800 dark:selection:text-amber-200">
      {/* Global Embedded Styles for Ultra-Crisp Mermaid Typography & Vector Rendering */}
      <style jsx global>{`
        .mermaid-svg-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }
        .mermaid-svg-container svg {
          max-width: none !important;
          height: auto !important;
          margin: 0 auto;
          display: block;
          overflow: visible !important;
          text-rendering: geometricPrecision !important;
          shape-rendering: geometricPrecision !important;
        }

        .mermaid-svg-container text,
        .mermaid-svg-container tspan,
        .mermaid-svg-container .nodeLabel,
        .mermaid-svg-container .edgeLabel,
        .mermaid-svg-container .cluster-label,
        .mermaid-svg-container div {
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
          -webkit-font-smoothing: antialiased !important;
          -moz-osx-font-smoothing: grayscale !important;
          text-rendering: geometricPrecision !important;
        }

        .mermaid-svg-container .edgeLabel {
          font-size: 13.5px !important;
          font-weight: 700 !important;
          letter-spacing: 0.01em !important;
        }
        .mermaid-svg-container .edgeLabel rect {
          opacity: 0.96 !important;
          rx: 6px !important;
          ry: 6px !important;
          stroke-width: 1.5px !important;
        }

        .mermaid-svg-container .cluster-label text,
        .mermaid-svg-container .cluster-label span {
          font-size: 14.5px !important;
          font-weight: 800 !important;
          letter-spacing: 0.03em !important;
        }
        .mermaid-svg-container .cluster rect {
          rx: 10px !important;
          ry: 10px !important;
          stroke-width: 2px !important;
        }

        .mermaid-svg-container .node .label {
          font-size: 14.5px !important;
          font-weight: 700 !important;
          line-height: 1.4 !important;
        }
        .mermaid-svg-container .node rect,
        .mermaid-svg-container .node polygon {
          stroke-width: 2.5px !important;
        }

        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          nav, header, .no-print, button, .controls-bar {
            display: none !important;
          }
          .print-container {
            max-width: 100% !important;
            padding: 0 !important;
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      {/* Breadcrumb Navigation */}
      <div className="border-b border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-900/60 backdrop-blur-md sticky top-0 z-30 no-print transition-colors">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between text-xs sm:text-sm">
          <nav className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
            <Link href="/" className="hover:text-amber-600 dark:hover:text-amber-400 transition">
              {t.breadcrumb.home}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            <Link href="/pcb-manufacture" className="hover:text-amber-600 dark:hover:text-amber-400 transition">
              {t.breadcrumb.pcbManufacture}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 opacity-60" />
            <span className="text-amber-600 dark:text-amber-400 font-bold">{t.breadcrumb.flowchart}</span>
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Dark/Light Mood Toggle */}
            <button
              onClick={() => setTheme(isDarkMode ? "light" : "dark")}
              title={isDarkMode ? t.flowchart.whiteMood : t.flowchart.darkMood}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 transition shadow-xs"
            >
              {isDarkMode ? (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  <span className="hidden sm:inline">{t.flowchart.whiteMood}</span>
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5 text-slate-700" />
                  <span className="hidden sm:inline">{t.flowchart.darkMood}</span>
                </>
              )}
            </button>

            <Link
              href="/pcb-quote"
              className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full transition shadow-xs"
            >
              <span>{t.breadcrumb.quote}</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* OFFICIAL FACTORY DOCUMENT HEADER (武平飞天电子科技有限公司) */}
        <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 via-slate-100 to-white dark:from-amber-500/15 dark:via-slate-900/90 dark:to-slate-900 border-2 border-amber-500/30 shadow-2xl relative overflow-hidden transition-colors">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none select-none">
            <Building2 className="w-56 h-56 text-amber-500" />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-3 py-1 text-xs font-black uppercase tracking-wider bg-amber-500 text-slate-950 rounded-md shadow-xs">
                  {t.header.sopBadge}
                </span>
                <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-800/80 px-2.5 py-1 rounded border border-slate-300 dark:border-slate-700">
                  {t.header.docRef}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {t.header.certBadge}
                </span>
              </div>

              {/* Exact Company and Chart Title Provided by User */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-amber-400 tracking-tight leading-tight">
                {t.header.companyZh}
              </h2>
              <h3 className="text-lg sm:text-xl font-bold text-slate-700 dark:text-slate-300 font-mono mt-0.5">
                {t.header.companyEn}
              </h3>

              <div className="mt-3 flex items-center gap-3">
                <div className="h-6 w-1.5 bg-amber-500 rounded-full" />
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-amber-700 dark:text-amber-300 tracking-wide">
                    {t.header.title}
                  </h1>
                  <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400">
                    {t.header.subtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Document Verification Box */}
            <div className="shrink-0 p-4 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-md text-xs space-y-1.5 min-w-[240px]">
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span>{t.header.metaPeDept}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{t.header.metaPeDeptVal}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span>{t.header.metaCtoOffice}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{t.header.metaCtoOfficeVal}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span>{t.header.metaStatus}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{t.header.metaStatusVal}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span>{t.header.metaScope}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{t.header.metaScopeVal}</span>
              </div>
            </div>
          </div>

          {/* View Mode Tabs: All (Flowchart + XLS) vs Multilayer Flow vs Double-sided Flow vs XLS Table */}
          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex flex-wrap p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 shadow-inner gap-1">
              <button
                onClick={() => {
                  setActiveView("all");
                  setChartType("multilayer");
                }}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                  activeView === "all"
                    ? "bg-amber-500 text-slate-950 shadow-md"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Layers className="h-4 w-4" />
                <span>{t.tabs.all}</span>
              </button>

              <button
                onClick={() => {
                  setActiveView("topology");
                  setChartType("multilayer");
                }}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                  activeView === "topology" && chartType === "multilayer"
                    ? "bg-amber-500 text-slate-950 shadow-md"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Network className="h-4 w-4" />
                <span>{t.tabs.multilayer}</span>
              </button>

              <button
                onClick={() => {
                  setActiveView("topology");
                  setChartType("doublesided");
                }}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                  activeView === "topology" && chartType === "doublesided"
                    ? "bg-amber-500 text-slate-950 shadow-md"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Network className="h-4 w-4" />
                <span>{t.tabs.doublesided}</span>
              </button>

              <button
                onClick={() => setActiveView("spreadsheet")}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                  activeView === "spreadsheet"
                    ? "bg-amber-500 text-slate-950 shadow-md"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <FileSpreadsheet className="h-4 w-4" />
                <span>{t.tabs.spreadsheet}</span>
              </button>
            </div>

            {/* Quick Export Button */}
            <div className="flex items-center gap-2">
              <a
                href="/docs/Production_Process_Flow_Chart.xls"
                download="生产工艺流程图（Production_Process_Flow_Chart）.xls"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-md transition"
                title={t.tabs.downloadXls}
              >
                <Download className="h-4 w-4" />
                <span>{t.tabs.downloadXls}</span>
              </a>
            </div>
          </div>
        </div>

        {/* PROMINENT CALLOUT BANNER: ORIGINAL FACTORY XLS SPREADSHEET INTEGRATION */}
        <div className="mb-6 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-transparent dark:from-emerald-950/50 dark:via-slate-900 dark:to-slate-900 border-2 border-emerald-500/40 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-emerald-600 text-white shadow-md shrink-0">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider bg-emerald-600 text-white px-2.5 py-0.5 rounded-full shadow-xs">
                  {t.xlsBanner.badge}
                </span>
                <span className="text-xs sm:text-sm font-bold text-emerald-900 dark:text-emerald-300">
                  {t.xlsBanner.fileName}
                </span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  {t.xlsBanner.meta}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                {t.xlsBanner.desc}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full lg:w-auto">
            <a
              href="/docs/Production_Process_Flow_Chart.xls"
              download="生产工艺流程图（Production_Process_Flow_Chart）.xls"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-black bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl shadow-md transition"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{t.xlsBanner.downloadBtn}</span>
            </a>

            <button
              onClick={() => setActiveView("spreadsheet")}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border transition shadow-xs ${
                activeView === "spreadsheet"
                  ? "bg-emerald-700 text-white border-emerald-700"
                  : "bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700"
              }`}
            >
              <TableIcon className="h-3.5 w-3.5" />
              <span>{t.xlsBanner.tableBtn}</span>
            </button>

            <a
              href="#xls-spreadsheet-section"
              onClick={() => {
                if (activeView === "topology") setActiveView("all");
              }}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition"
            >
              <span>{t.xlsBanner.scrollBtn}</span>
            </a>
          </div>
        </div>

        {/* VIEW 1: INTERACTIVE FLOWCHART (Excel Factory Chart & Topology Graph) */}
        {(activeView === "all" || activeView === "topology") && (
          <div className="space-y-4">
            {/* Top Diagram Mode Switcher */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur">
              <div className="flex items-center gap-2.5">
                <span className="flex size-7 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-xs">
                  {diagramStyle === "excel" ? "XLS" : "SVG"}
                </span>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span>{diagramStyle === "excel" ? "Excel 官方工艺流程图 (Official XLS Flowchart)" : "Mermaid 节点拓扑图 (Topology)"}</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300">
                      {diagramStyle === "excel" ? "原厂标准图" : "自动拓扑"}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {diagramStyle === "excel"
                      ? "武平飞天电子科技 生产工艺流程图（Production_Process_Flow_Chart.xls）原版视觉重现"
                      : "基于Mermaid引擎自动排布的工序连接关系拓扑"}
                  </p>
                </div>
              </div>

              {/* Diagram Switcher Toggle */}
              <div className="flex items-center gap-1 bg-white dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 self-stretch sm:self-auto justify-end">
                <button
                  type="button"
                  onClick={() => setDiagramStyle("excel")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    diagramStyle === "excel"
                      ? "bg-amber-400 text-slate-950 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Excel 原版流程图</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDiagramStyle("topology")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    diagramStyle === "topology"
                      ? "bg-amber-400 text-slate-950 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Network className="w-3.5 h-3.5" />
                  <span>Mermaid 拓扑图</span>
                </button>
              </div>
            </div>

            {/* Primary Excel Flowchart View */}
            {diagramStyle === "excel" ? (
              <PcbProcessExcelFlowchart
                onSelectStation={(stationName) => {
                  setSearchQuery(stationName);
                }}
              />
            ) : (
              <div>
                {/* Active Diagram Indicator & Quick Switcher */}
                <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/30">
              <div className="flex items-center gap-2.5">
                <span className="flex size-7 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-xs">
                  {chartType === "multilayer" ? "ML" : "2L"}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-amber-400">
                      {chartType === "multilayer" ? t.flowchart.mlTitle : t.flowchart.dsTitle}
                    </span>
                    <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                      {chartType === "multilayer" ? t.flowchart.mlSteps : t.flowchart.dsSteps}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    {chartType === "multilayer" ? t.flowchart.mlDesc : t.flowchart.dsDesc}
                  </p>
                </div>
              </div>

              {/* Quick Toggle Chips */}
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs self-start sm:self-auto">
                <button
                  onClick={() => {
                    setPan({ x: 0, y: 0 });
                    setChartType("multilayer");
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                    chartType === "multilayer"
                      ? "bg-amber-500 text-slate-950 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {t.flowchart.chipMl}
                </button>
                <button
                  onClick={() => {
                    setPan({ x: 0, y: 0 });
                    setChartType("doublesided");
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                    chartType === "doublesided"
                      ? "bg-amber-500 text-slate-950 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {t.flowchart.chipDs}
                </button>
              </div>
            </div>
            {/* Smart Interactive Controls Bar with 500% Zoom */}
            <div className="mb-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl backdrop-blur no-print transition-colors">
              {/* Left: Smart Zoom Controls & Presets */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={handleZoomOut}
                    disabled={zoom <= 0.25}
                    title={t.flowchart.zoomOut}
                    className="px-2.5 py-1.5 text-xs font-bold hover:bg-white dark:hover:bg-slate-800 disabled:opacity-40 transition rounded-lg text-slate-700 dark:text-slate-200 flex items-center gap-1 shadow-xs"
                  >
                    <ZoomOut className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <span className="hidden sm:inline">{t.flowchart.zoomOut}</span>
                  </button>

                  <button
                    onClick={handleZoomIn}
                    disabled={zoom >= 5.0}
                    title={t.flowchart.zoomIn}
                    className="px-2.5 py-1.5 text-xs font-bold hover:bg-white dark:hover:bg-slate-800 disabled:opacity-40 transition rounded-lg text-slate-700 dark:text-slate-200 flex items-center gap-1 shadow-xs"
                  >
                    <ZoomIn className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    <span className="hidden sm:inline">{t.flowchart.zoomIn}</span>
                  </button>

                  <button
                    onClick={handleResetZoom}
                    title={t.flowchart.center}
                    className="px-2.5 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition rounded-lg flex items-center gap-1 shadow-xs font-black"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>{t.flowchart.center}</span>
                  </button>
                </div>

                {/* Smart Zoom Slider (25% to 500%) */}
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                  <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">25%</span>
                  <input
                    type="range"
                    min="0.25"
                    max="5.0"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setClampedZoom(parseFloat(e.target.value))}
                    className="w-24 sm:w-32 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    title={`Smart Zoom: ${Math.round(zoom * 100)}%`}
                  />
                  <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">500%</span>
                  <span className="px-2 py-0.5 text-xs font-mono font-black bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 rounded-md ml-1 min-w-[52px] text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                </div>

                {/* Quick Preset Buttons with Instant Center */}
                <div className="hidden xl:flex items-center gap-1">
                  {[
                    { label: t.flowchart.fit, val: 1.0 },
                    { label: "150%", val: 1.5 },
                    { label: "250%", val: 2.5 },
                    { label: "350%", val: 3.5 },
                    { label: "500% Max", val: 5.0 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        setPan({ x: 0, y: 0 });
                        setClampedZoom(preset.val);
                      }}
                      className={`px-2 py-1 text-[11px] font-bold rounded-lg transition ${
                        Math.round(zoom * 100) === Math.round(preset.val * 100)
                          ? "bg-amber-500 text-slate-950 shadow-xs"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: Actions, Fullscreen, SVG & Mood */}
              <div className="flex flex-wrap items-center gap-2 self-end lg:self-center">
                <button
                  onClick={() => setTheme(isDarkMode ? "light" : "dark")}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-200 transition flex items-center gap-1.5 shadow-xs"
                  title="Toggle White / Dark Mood"
                >
                  {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
                  <span>{isDarkMode ? t.flowchart.whiteMood : t.flowchart.darkMood}</span>
                </button>

                <a
                  href="#xls-spreadsheet-section"
                  onClick={() => {
                    if (activeView === "topology") {
                      setActiveView("all");
                    }
                  }}
                  className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white transition rounded-xl shadow-xs flex items-center gap-1.5"
                  title={t.flowchart.jumpTable}
                >
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                  <span>{t.flowchart.jumpTable}</span>
                </a>

                <button
                  onClick={toggleFullscreen}
                  title={isFullscreen ? t.flowchart.exit : t.flowchart.full}
                  className="px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl transition flex items-center gap-1.5 border border-slate-200 dark:border-slate-600 shadow-xs hidden sm:inline-flex"
                >
                  {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                  <span>{isFullscreen ? t.flowchart.exit : t.flowchart.full}</span>
                </button>

                <button
                  onClick={() => window.print()}
                  title={t.flowchart.print}
                  className="px-3.5 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 transition rounded-xl shadow-sm flex items-center gap-1.5"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>{t.flowchart.print}</span>
                </button>
              </div>
            </div>

            {/* Flowchart Diagram Interactive Canvas */}
            <main
              ref={containerRef}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") { e.preventDefault(); panStep(90, 0); }
                if (e.key === "ArrowRight") { e.preventDefault(); panStep(-90, 0); }
                if (e.key === "ArrowUp") { e.preventDefault(); panStep(0, 90); }
                if (e.key === "ArrowDown") { e.preventDefault(); panStep(0, -90); }
                if (e.key === "+" || e.key === "=") { e.preventDefault(); handleZoomIn(); }
                if (e.key === "-" || e.key === "_") { e.preventDefault(); handleZoomOut(); }
                if (e.key === "0" || e.key === "c" || e.key === "C" || e.key === " ") {
                  e.preventDefault();
                  handleResetZoom();
                }
              }}
              onWheel={handleWheel}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className={`print-container w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-8 shadow-2xl relative overflow-hidden transition-colors outline-none focus:ring-2 focus:ring-amber-500/30 flex justify-center items-start ${
                isFullscreen ? "fixed inset-0 z-50 rounded-none p-6 bg-slate-50 dark:bg-slate-950 h-screen" : "min-h-[660px]"
              }`}
              style={{
                cursor: isDragging ? "grabbing" : "grab",
                touchAction: "none",
                userSelect: "none",
              }}
            >
              {/* Subtle blueprint grid background */}
              <div
                className="absolute inset-0 opacity-[0.05] dark:opacity-[0.04] pointer-events-none"
                style={{
                  backgroundImage: isDarkMode
                    ? "linear-gradient(#f59e0b 1px, transparent 1px), linear-gradient(90deg, #f59e0b 1px, transparent 1px)"
                    : "linear-gradient(#0284c7 1px, transparent 1px), linear-gradient(90deg, #0284c7 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />

              {/* Canvas Floating Quick Hint */}
              <div className="absolute top-3 left-4 z-10 flex flex-wrap items-center gap-2 pointer-events-none text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-white/90 dark:bg-slate-900/90 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 backdrop-blur-xs no-print shadow-xs">
                <Move className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>{t.flowchart.canvasHint}</span>
              </div>

              {/* Floating Pan Navigation Compass D-Pad */}
              <div className="absolute bottom-5 right-5 z-20 flex flex-col items-center bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700/80 p-2 rounded-2xl shadow-2xl backdrop-blur-md no-print select-none">
                <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wider flex items-center gap-1">
                  <Compass className="size-3 text-amber-500" />
                  <span>{t.flowchart.dpadNav}</span>
                </div>
                <button
                  type="button"
                  onClick={() => panStep(0, 100)}
                  title={t.flowchart.dpadUp}
                  className="size-8 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-amber-500 dark:hover:text-slate-950 transition active:scale-95 shadow-xs"
                >
                  <ArrowUp className="size-4" />
                </button>
                <div className="flex items-center gap-1.5 my-1">
                  <button
                    type="button"
                    onClick={() => panStep(100, 0)}
                    title={t.flowchart.dpadLeft}
                    className="size-8 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-amber-500 dark:hover:text-slate-950 transition active:scale-95 shadow-xs"
                  >
                    <ArrowLeft className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleResetZoom}
                    title={t.flowchart.dpadReset}
                    className="size-8 flex items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-black text-[11px] shadow-sm hover:bg-amber-400 transition active:scale-95"
                  >
                    <RotateCcw className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => panStep(-100, 0)}
                    title={t.flowchart.dpadRight}
                    className="size-8 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-amber-500 dark:hover:text-slate-950 transition active:scale-95 shadow-xs"
                  >
                    <ArrowRight className="size-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => panStep(0, -100)}
                  title={t.flowchart.dpadDown}
                  className="size-8 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-amber-500 dark:hover:text-slate-950 transition active:scale-95 shadow-xs"
                >
                  <ArrowDown className="size-4" />
                </button>
                <div className="mt-1 pt-1 border-t border-slate-200 dark:border-slate-800 text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400">
                  {Math.round(zoom * 100)}%
                </div>
              </div>

              {/* Loading Indicator */}
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-20">
                  <div className="w-12 h-12 rounded-full border-4 border-amber-500/30 border-t-amber-500 animate-spin mb-4" />
                  <p className="text-amber-700 dark:text-amber-400 font-bold text-sm tracking-wide">
                    {t.flowchart.loading} ({isDarkMode ? t.flowchart.darkMood : t.flowchart.whiteMood})...
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{t.flowchart.loadingSub}</p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-8 text-center max-w-lg mx-auto bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-500/40 rounded-xl my-12">
                  <ShieldAlert className="h-10 w-10 text-red-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-red-700 dark:text-red-300">{t.flowchart.renderException}</h3>
                  <p className="text-sm text-red-600 dark:text-red-200/80 mt-2">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg transition"
                  >
                    {t.flowchart.reloadBtn}
                  </button>
                </div>
              )}

              {/* Scalable Chart Wrapper with Zero-Lag Drag and Smooth Button Zoom */}
              <div
                ref={chartWrapperRef}
                id="chart-wrapper"
                className="relative select-none flex flex-col items-center justify-start mx-auto w-full"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: "top center",
                  margin: "0 auto",
                  transition: isDragging ? "none" : "transform 0.15s cubic-bezier(0.2, 0, 0, 1)",
                  pointerEvents: isDragging ? "none" : "auto",
                }}
              >
                {svgContent ? (
                  <div
                    className="mermaid-svg-container text-center flex justify-center items-start w-full min-w-full"
                    dangerouslySetInnerHTML={{ __html: svgContent }}
                  />
                ) : (
                  !isLoading && (
                    <div className="text-center py-20 text-slate-400 text-sm">
                      {t.flowchart.noDiagram}
                    </div>
                  )
                )}
              </div>
            </main>
          </div>
        )}
          </div>
        )}

        {/* VIEW 2: OFFICIAL FACTORY XLS SPREADSHEET CHART (武平飞天电子科技官方工艺表) */}
        {(activeView === "all" || activeView === "spreadsheet") && (
          <div id="xls-spreadsheet-section" className="space-y-6 pt-4">
            {/* Spreadsheet Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl no-print transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  <FileSpreadsheet className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span>{t.spreadsheet.title}</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                      {t.spreadsheet.fileTag}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t.spreadsheet.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <a
                  href="/docs/Production_Process_Flow_Chart.xls"
                  download="生产工艺流程图（Production_Process_Flow_Chart）.xls"
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition flex items-center gap-1.5 shadow-sm"
                  title={t.spreadsheet.downloadOriginal}
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{t.spreadsheet.downloadOriginal}</span>
                </a>
                <button
                  onClick={handleExportCsv}
                  className="px-3 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl transition flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 shadow-xs"
                >
                  <FileDown className="h-3.5 w-3.5" />
                  <span>{t.spreadsheet.exportCsv}</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>{t.spreadsheet.print}</span>
                </button>
              </div>
            </div>

            {/* Excel-Style Spreadsheet Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden transition-colors">
              {/* Spreadsheet Header Strip */}
              <div className="bg-slate-100 dark:bg-slate-800/90 border-b border-slate-300 dark:border-slate-700 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3 font-mono">
                  <span className="font-bold text-amber-700 dark:text-amber-400">{t.spreadsheet.sheetName}</span>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-600 dark:text-slate-400">{t.spreadsheet.totalStations}</span>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-600 dark:text-slate-400">{t.spreadsheet.factoryBase}</span>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder={t.spreadsheet.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>

              {/* Table Data */}
              <div className="overflow-x-auto max-h-[750px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold uppercase tracking-wider z-10 shadow-xs">
                    <tr className="border-b border-slate-300 dark:border-slate-700 divide-x divide-slate-300 dark:divide-slate-700">
                      <th className="py-3 px-3 text-center w-12">{t.spreadsheet.colSeq}</th>
                      <th className="py-3 px-4 min-w-[200px]">{t.spreadsheet.colStation}</th>
                      <th className="py-3 px-3 min-w-[130px]">{t.spreadsheet.colDept}</th>
                      <th className="py-3 px-3 min-w-[110px]">{t.spreadsheet.colCode}</th>
                      <th className="py-3 px-4 min-w-[240px]">{t.spreadsheet.colEquipment}</th>
                      <th className="py-3 px-4 min-w-[340px]">{t.spreadsheet.colControls}</th>
                      <th className="py-3 px-3 min-w-[150px]">{t.spreadsheet.colGate}</th>
                      <th className="py-3 px-3 min-w-[140px] text-right">{t.spreadsheet.colStandard}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                    {filteredRows.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-500">
                          {t.spreadsheet.noResults}
                        </td>
                      </tr>
                    ) : (
                      filteredRows.map((row) => (
                        <tr
                          key={row.seq}
                          className="hover:bg-amber-50/50 dark:hover:bg-slate-800/60 divide-x divide-slate-200 dark:divide-slate-800 transition-colors"
                        >
                          {/* Seq */}
                          <td className="py-3 px-3 text-center font-mono font-bold text-amber-700 dark:text-amber-400 bg-slate-50/80 dark:bg-slate-900/40">
                            {row.seq}
                          </td>

                          {/* Station Name */}
                          <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                            <div className="flex flex-col">
                              <span className="text-[13px]">{locale === "zh" ? row.stationZh : row.stationEn}</span>
                              <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                                {locale === "zh" ? row.stationEn : row.stationZh}
                              </span>
                            </div>
                          </td>

                          {/* Dept */}
                          <td className="py-3 px-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="font-semibold">{locale === "zh" ? row.deptZh : row.deptEn}</span>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                                {locale === "zh" ? row.deptEn : row.deptZh}
                              </span>
                            </div>
                          </td>

                          {/* Machine Code */}
                          <td className="py-3 px-3 font-mono font-bold text-sky-700 dark:text-sky-400 whitespace-nowrap">
                            <span className="bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                              {row.machineCode}
                            </span>
                          </td>

                          {/* Equipment */}
                          <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                            <div className="flex flex-col">
                              <span className="font-medium text-slate-900 dark:text-slate-100">
                                {locale === "zh" ? row.equipmentZh : row.equipmentEn}
                              </span>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                                {locale === "zh" ? row.equipmentEn : row.equipmentZh}
                              </span>
                            </div>
                          </td>

                          {/* Key Controls */}
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                            <p className="font-medium text-slate-800 dark:text-slate-200">
                              {locale === "zh" ? row.controlsZh : row.controlsEn}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono leading-normal">
                              {locale === "zh" ? row.controlsEn : row.controlsZh}
                            </p>
                          </td>

                          {/* Quality Gate */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md">
                              <CheckCircle2 className="h-3 w-3 shrink-0" />
                              <span>{row.qualityGate}</span>
                            </span>
                          </td>

                          {/* Standard */}
                          <td className="py-3 px-3 text-right font-mono text-[11px] font-semibold text-amber-700 dark:text-amber-400 whitespace-nowrap">
                            <span className="bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                              {row.ipcStandard}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Quick Quote / CTA Banner */}
        <section className="mt-12 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-amber-500/10 dark:from-amber-500/15 dark:via-slate-800/80 dark:to-amber-500/10 border border-amber-500/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 no-print transition-colors shadow-lg">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-amber-400">
              {t.cta.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl">
              {t.cta.desc}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/pcb-quote"
              className="px-6 py-3 rounded-full font-bold text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 transition shadow-lg flex items-center gap-2"
            >
              <span>{t.cta.quoteBtn}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="px-5 py-3 rounded-full font-semibold text-sm bg-slate-200 hover:bg-slate-300 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 border border-slate-300 dark:border-slate-600 transition"
            >
              {t.cta.contactBtn}
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-3">
          <span>{t.footer.copyright}</span>
          <span>{t.footer.badge}</span>
        </footer>
      </div>
    </div>
  );
}
