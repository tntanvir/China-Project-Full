"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/components/providers/language-provider";
import { getProcessFlowchartDictionary } from "@/lib/process-flowchart-translations";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Search,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Sun,
  Moon,
  Move,
  Download,
  Printer,
  Sparkles,
  Info,
  X,
  FileSpreadsheet,
  Check,
  Layers,
} from "lucide-react";

export interface SubStation {
  zh: string;
  en: string;
  code?: string;
  dashed?: boolean;
  highlight?: boolean;
  dept?: string;
  descZh?: string;
  descEn?: string;
  controlsZh?: string;
  controlsEn?: string;
  qualityGate?: string;
}

export interface SubLane {
  titleZh?: string;
  titleEn?: string;
  steps: SubStation[]; // ordered from source to target (flowing right-to-left)
}

export interface FlowStage {
  id: string;
  mainZh: string;
  mainEn: string;
  code?: string;
  dashed?: boolean;
  noteBadge?: string; // e.g. "p21", "p22", "p23", "p24"
  gateBadge?: "IPQC" | "FQA" | null;
  deptZh?: string;
  deptEn?: string;
  controlsZh?: string;
  controlsEn?: string;
  qualityGate?: string;
  // Sub-process branches flowing into this main stage from the right
  lanes: SubLane[];
}

// -------------------------------------------------------------
// MULTILAYER PCB STAGES (Exact Sheet 2 from Factory XLS)
// -------------------------------------------------------------
export const MULTILAYER_STAGES: FlowStage[] = [
  {
    id: "wh_iqc",
    mainZh: "仓库 / 进料检验",
    mainEn: "WAREHOUSE & IQC",
    deptZh: "仓储 / 品保部",
    deptEn: "Warehouse / QA Dept",
    controlsZh: "覆铜板CCL进料板厚公差±0.05mm、铜箔厚度、Tg点与耐热性验证",
    controlsEn: "CCL incoming inspection: thickness ±0.05mm, copper weight, Tg test",
    qualityGate: "IQC Incoming Inspection Release",
    lanes: [
      {
        steps: [
          { zh: "进料检验", en: "Incoming inspection", code: "IQC-01", dept: "QA Dept" },
          { zh: "恒温原料仓", en: "Raw Material Warehouse", code: "WH-CCL", dept: "Warehouse" },
        ],
      },
    ],
  },
  {
    id: "shear",
    mainZh: "裁板 / 开料",
    mainEn: "SHEAR MATERIAL",
    gateBadge: "IPQC",
    deptZh: "开料车间",
    deptEn: "Material Prep Shop",
    controlsZh: "裁切尺寸公差±0.2mm，边缘倒角无毛刺；高温预烤释放内应力",
    controlsEn: "Dimension tolerance ±0.2mm; round corner deburr; oven stress-relief baking",
    qualityGate: "IPQC Dimension & Edge Inspection",
    lanes: [
      {
        steps: [
          { zh: "发料", en: "Material Issue", code: "P1101", dept: "Warehouse" },
          { zh: "裁板", en: "Cutting CORE", code: "P1102", dept: "Shearing Shop" },
          { zh: "烘烤", en: "Baking", code: "P1103", dept: "Shearing Shop" },
        ],
      },
    ],
  },
  {
    id: "inner_image",
    mainZh: "内层图形转移(IIT)",
    mainEn: "I/L IMAGE TRANSFER",
    gateBadge: "IPQC",
    deptZh: "内层图形车间",
    deptEn: "Inner Layer Imaging Shop",
    controlsZh: "微蚀量0.8-1.2µm；Class 10k无尘室曝光贴膜；CCD对位偏位≤0.025mm",
    controlsEn: "Micro-etch depth 0.8-1.2µm; Class 10k cleanroom; CCD alignment ≤0.025mm",
    qualityGate: "Cleanroom IPQC Film Inspection",
    lanes: [
      {
        titleZh: "湿膜滚涂线",
        titleEn: "Curtain Coating Line",
        steps: [
          { zh: "前处理", en: "Pre-Treatment", code: "P1301", dept: "Inner Imaging" },
          { zh: "涂布/印刷", en: "Curtain Coating Film", code: "P1302/03", dept: "Inner Imaging" },
          { zh: "曝光", en: "Exposure", code: "P1304", dept: "Inner Imaging" },
          { zh: "内网", en: "I/L CURTAIN COATING", code: "P130", dept: "Inner Imaging" },
        ],
      },
      {
        titleZh: "干膜压膜线",
        titleEn: "Dry Film Line",
        steps: [
          { zh: "前处理", en: "Pre-Treatment", code: "P1301", dept: "Inner Imaging" },
          { zh: "压膜", en: "F/M Cover", code: "P1351", dept: "Inner Imaging" },
          { zh: "曝光", en: "Exposure", code: "P1303", dept: "Inner Imaging" },
          { zh: "内干", en: "I/L DRY FILM", code: "P135", dept: "Inner Imaging" },
        ],
      },
    ],
  },
  {
    id: "inner_etch",
    mainZh: "内层蚀刻剥膜(IES)",
    mainEn: "I/L ETCH & STRIP (DES)",
    gateBadge: "IPQC",
    deptZh: "蚀刻车间",
    deptEn: "DES Etch Shop",
    controlsZh: "酸性蚀刻线，线宽公差±10%，侧蚀补偿因子≥3.0，NaOH退膜无残留",
    controlsEn: "Acid etch line, trace tolerance ±10%, etch factor ≥3.0, clean resist stripping",
    qualityGate: "IPQC Line Width & Clean Strip Gate",
    lanes: [
      {
        steps: [
          { zh: "显影", en: "Develop", code: "P1401", dept: "DES Shop" },
          { zh: "蚀刻", en: "Etch", code: "P1402", dept: "DES Shop" },
          { zh: "剥膜", en: "C/F Strip", code: "P1403", dept: "DES Shop" },
        ],
      },
    ],
  },
  {
    id: "inner_inspection",
    mainZh: "内层检验(Insp1)",
    mainEn: "I/L INSPECTION",
    gateBadge: "IPQC",
    deptZh: "品质保证部",
    deptEn: "QA / Optical Inspection",
    controlsZh: "AOI扫描对比CAM原始数据，检出开路、短路、缺口(≥0.025mm)并微米级修整",
    controlsEn: "100% AOI vs CAM Gerber scan; detects shorts, opens, nicks ≥0.025mm",
    qualityGate: "AOI 100% Verification Gate",
    lanes: [
      {
        steps: [
          { zh: "AOI检验", en: "AOI Inspection", code: "Q1002", dept: "QA Dept" },
          { zh: "人工目检", en: "Vision Inspection", code: "Q1001", dept: "QA Dept" },
        ],
      },
    ],
  },
  {
    id: "layup",
    mainZh: "预叠板及叠板(LU)",
    mainEn: "LAY-UP & PINNING",
    dashed: true,
    gateBadge: "IPQC",
    deptZh: "压合车间",
    deptEn: "MLB Lay-Up Shop",
    controlsZh: "微米级有机硅烷棕化氧化处理增大结合力；自动叠合铆钉固定",
    controlsEn: "Silane micro-roughening brown-oxide; auto layup rivet fixation",
    qualityGate: "Brown Oxide Peel Strength Gate",
    lanes: [
      {
        steps: [
          { zh: "棕化", en: "Brown-Oxid", code: "Q1002", dept: "Lay-Up Shop" },
          { zh: "排版叠板", en: "Lay-up", code: "P1502", dept: "Lay-Up Shop" },
        ],
      },
    ],
  },
  {
    id: "lamination",
    mainZh: "压合(ML)",
    mainEn: "MLB LAMINATION",
    dashed: true,
    gateBadge: "IPQC",
    deptZh: "压合车间",
    deptEn: "Lamination Press Shop",
    controlsZh: "高温高压真空热压机(195℃, 35kg/cm²)，真空度<5Torr；冷压消除翘曲应力",
    controlsEn: "Vacuum hot press (195℃, 35kg/cm², <5Torr); cold press stabilization",
    qualityGate: "C-SAM & Microsection TG Test",
    lanes: [
      {
        titleZh: "压合与修边",
        titleEn: "Press & Trim",
        steps: [
          { zh: "压合", en: "Pressing", code: "P1601", dept: "Press Shop" },
          { zh: "铣边裁板", en: "Shearing", code: "P1602", dept: "Press Shop" },
          { zh: "铣(钻)靶孔", en: "Target Hole Drilling", code: "P1603", dept: "Press Shop" },
        ],
      },
      {
        titleZh: "X-Ray 透视钻靶",
        titleEn: "X-Ray Alignment",
        steps: [
          { zh: "X-RAY钻靶", en: "Target Hole Drilling", code: "X-RAY", dashed: true, dept: "Press Shop" },
        ],
      },
    ],
  },
  {
    id: "drill",
    mainZh: "钻孔",
    mainEn: "DRILL HOLES",
    gateBadge: "IPQC",
    deptZh: "钻孔车间",
    deptEn: "CNC Drilling Shop",
    controlsZh: "空气主轴数控钻孔机200,000 RPM，微孔≤0.2mm，孔位公差±0.05mm",
    controlsEn: "Air-bearing CNC drill 200k RPM, micro-via ≤0.2mm, tolerance ±0.05mm",
    qualityGate: "100% First-Article X-Ray Hole Check",
    lanes: [
      {
        steps: [
          { zh: "NC数控钻孔", en: "NC DRILL HOLES", code: "P170", dept: "Drilling Shop" },
          { zh: "镭射激光钻孔", en: "LASER DRILL HOLES", code: "P175", dept: "Laser Drilling" },
        ],
      },
    ],
  },
  {
    id: "pth",
    mainZh: "水平PTH (孔金属化)",
    mainEn: "HOLE METALLIZATION",
    noteBadge: "p21",
    gateBadge: "IPQC",
    deptZh: "电镀车间",
    deptEn: "PTH & Chemical Copper Line",
    controlsZh: "KMnO4高锰酸钾除胶渣彻底清洁孔壁；钯活化胶体沉铜0.3-0.5µm，背光测试9级以上",
    controlsEn: "KMnO4 desmear clears resin; Pd colloid activation, electroless copper 0.3-0.5µm, backlight rating ≥9",
    qualityGate: "Backlight 10-Class Test & Cross-Section",
    lanes: [
      {
        steps: [
          { zh: "膨松", en: "Sweller", code: "P2101", dept: "PTH Line" },
          { zh: "除胶渣", en: "Desmear", code: "P2102", dept: "PTH Line" },
          { zh: "中和", en: "Neutralizer", code: "P2103", dept: "PTH Line" },
          { zh: "磨板", en: "Scrubbex", code: "P2104", dept: "PTH Line" },
          { zh: "整孔", en: "Conditioner", code: "P2105", dept: "PTH Line" },
          { zh: "氧化/催化", en: "Initiator/Catalyst", code: "P2106", dept: "PTH Line" },
        ],
      },
      {
        titleZh: "连续电镀选项",
        titleEn: "Continuous Plating",
        steps: [
          { zh: "垂直连续电镀", en: "Vertical Continuous Plating", code: "VCP", dept: "VCP Line" },
        ],
      },
    ],
  },
  {
    id: "pattern_plating",
    mainZh: "图形电镀(CU2)",
    mainEn: "PATTERN & TIN ELECTROPLATE",
    noteBadge: "p22",
    dashed: true,
    gateBadge: "IPQC",
    deptZh: "电镀车间",
    deptEn: "Copper Pattern Plating Line",
    controlsZh: "微蚀活化，高深镀比脉冲镀铜20-25µm，镀锡保护抗蚀阻焊层5-8µm",
    controlsEn: "Pulse copper plating 20-25µm, tin protective etch-resist plating 5-8µm",
    qualityGate: "X-Ray Copper Thickness Tester",
    lanes: [
      {
        steps: [
          { zh: "脱脂", en: "Conditioner", code: "P2401", dept: "Plating Shop" },
          { zh: "微蚀", en: "Micro Etch", code: "P2402", dept: "Plating Shop" },
          { zh: "酸浸", en: "Acid Etch", code: "P2403", dept: "Plating Shop" },
          { zh: "镀铜", en: "Cu Plating", code: "P2404", dept: "Plating Shop" },
          { zh: "镀锡", en: "Sn Plating", code: "P2405", dept: "Plating Shop" },
        ],
      },
    ],
  },
  {
    id: "outer_dry_film",
    mainZh: "外层干膜(ODF)",
    mainEn: "O/L DRY FILM",
    noteBadge: "p23",
    gateBadge: "IPQC",
    deptZh: "外层图形车间",
    deptEn: "Outer Layer Imaging Shop",
    controlsZh: "全自动滚轮贴膜机，滚轮温度105℃，曝光能量45-60mJ/cm²，AOI显影全检",
    controlsEn: "Auto dry film lamination 105℃, exposure 45-60mJ/cm², inline AOI inspection",
    qualityGate: "Outer Pattern Alignment Gate",
    lanes: [
      {
        steps: [
          { zh: "前处理", en: "Per-Treatment", code: "P2301", dept: "Outer Imaging" },
          { zh: "压膜", en: "F/M Cover", code: "P2302", dept: "Outer Imaging" },
          { zh: "曝光", en: "Exposure", code: "P2303", dept: "Outer Imaging" },
          { zh: "显影", en: "Develop", code: "P2304", dept: "Outer Imaging" },
          { zh: "AOI检测", en: "AOI Unspection", code: "Q2010", dept: "QA Dept" },
        ],
      },
    ],
  },
  {
    id: "outer_etch",
    mainZh: "外层蚀铜(OES)",
    mainEn: "O/L ETCH & STRIP",
    noteBadge: "p24",
    gateBadge: "IPQC",
    deptZh: "蚀刻车间",
    deptEn: "SES Etch Line",
    controlsZh: "碱性蚀刻系统退去非线路铜箔，专用硝酸线剥去表面防腐锡层",
    controlsEn: "Alkaline etch removes non-trace copper; nitric acid tin stripping",
    qualityGate: "Etch Factor & Line Width Release",
    lanes: [
      {
        steps: [
          { zh: "线路蚀刻", en: "Etch", code: "P2502", dept: "SES Line" },
          { zh: "剥膜/剥锡", en: "F/M Strip", code: "P2501", dept: "SES Line" },
        ],
      },
    ],
  },
  {
    id: "outer_inspection",
    mainZh: "外层检验(Insp2)",
    mainEn: "O/L INSPECTION",
    gateBadge: "IPQC",
    deptZh: "品质保证部",
    deptEn: "QA / Test Department",
    controlsZh: "外层全幅高精AOI光学扫描；半成品高压开短路导通测试；高倍显微目视复验",
    controlsEn: "High-resolution full-panel AOI; semi-finished electrical test; visual check",
    qualityGate: "100% AOI & E-Test Verification Gate",
    lanes: [
      {
        steps: [
          { zh: "外层AOI", en: "AOI Inspection", code: "Q2001", dept: "QA Dept" },
          { zh: "半成品测试", en: "E-Test", code: "Q2002", dept: "QA Dept" },
          { zh: "目视复验", en: "Visual Inspection", code: "Q2003", dept: "QA Dept" },
        ],
      },
    ],
  },
  {
    id: "soldermask",
    mainZh: "液态防焊(LSM)",
    mainEn: "LIQUID SOLDERMASK & CURE",
    gateBadge: "IPQC",
    deptZh: "阻焊车间",
    deptEn: "Soldermask Shop",
    controlsZh: "立式喷涂阻焊绿油厚度15-25µm，高精CCD对位曝光，高温150℃完全热固化",
    controlsEn: "Curtain coating solder resist 15-25µm, CCD exposure, 150℃ post curing",
    qualityGate: "Solder Dam Adhesion & Hardness (6H)",
    lanes: [
      {
        steps: [
          { zh: "前处理", en: "Per-Treatment", code: "P3101", dept: "Soldermask" },
          { zh: "印刷/喷涂", en: "Curtain Coating S/M", code: "P3102", dept: "Soldermask" },
          { zh: "前烘烤", en: "Per Baking", code: "P3103", dept: "Soldermask" },
          { zh: "曝光", en: "Exposure", code: "P3104", dept: "Soldermask" },
          { zh: "显影", en: "Develop", code: "P3105", dept: "Soldermask" },
          { zh: "后烘烤", en: "Post Cure", code: "P3106", dept: "Soldermask" },
        ],
      },
    ],
  },
  {
    id: "gold_finger",
    mainZh: "镀金手指(NGE)",
    mainEn: "NICKEL GOLD ELECTROPLATE",
    gateBadge: "IPQC",
    deptZh: "表面处理车间",
    deptEn: "Gold Finger Plating Line",
    controlsZh: "边缘插拔端子专镀：镍层厚度120-200µ-inch，硬金厚度2-3µ-inch，耐插拔1000次",
    controlsEn: "Connector tab plating: nickel 120-200µ\", hard gold 2-3µ\", >1000 insertions",
    qualityGate: "Gold Thickness & Porosity Test",
    lanes: [
      {
        steps: [
          { zh: "贴保护胶", en: "A/T Cover", code: "P3301", dept: "Plating Line" },
          { zh: "镀镍", en: "Nickel Plating", code: "P3302", dept: "Plating Line" },
          { zh: "镀金", en: "Gold Plating", code: "P3303", dept: "Plating Line" },
          { zh: "撕胶", en: "A/T Strip", code: "P3304", dept: "Plating Line" },
        ],
      },
    ],
  },
  {
    id: "legend",
    mainZh: "文字标识与固化",
    mainEn: "SILKSCREEN LEGEND & CURE",
    gateBadge: "IPQC",
    deptZh: "丝印车间",
    deptEn: "Silkscreen Shop",
    controlsZh: "高清文字喷墨/丝网印制白字、黄字或黑字；紫外线UV与烤箱彻底固化",
    controlsEn: "Legend printing (UV inkjet / silk screen); UV solidifying & thermal curing",
    qualityGate: "Tape Adhesion Test 3M 600",
    lanes: [
      {
        titleZh: "UV固化文字",
        titleEn: "UV Legend (PC-UV)",
        steps: [
          { zh: "文字印刷", en: "Legend Silk Screen", code: "P3601", dept: "Legend Shop" },
          { zh: "UV照射固化", en: "UV Solidify", code: "P3602", dept: "Legend Shop" },
          { zh: "UV固化文字", en: "Post Cure UV", code: "P360", dept: "Legend Shop" },
        ],
      },
      {
        titleZh: "热固化文字",
        titleEn: "Thermal Legend (PC-T)",
        steps: [
          { zh: "文字印刷", en: "Legend Silk Screen", code: "P3651", dept: "Legend Shop" },
          { zh: "烤箱固化", en: "Post Cure", code: "P3652", dept: "Legend Shop" },
          { zh: "热固化文字", en: "Post Cure Temp", code: "P365", dept: "Legend Shop" },
        ],
      },
      {
        titleZh: "导电碳油",
        titleEn: "Carbon Ink (CT)",
        steps: [
          { zh: "碳油印刷", en: "Carbon Silk Screen", code: "P3681", dept: "Carbon Shop" },
          { zh: "碳油固化", en: "Post Cure", code: "P3682", dept: "Carbon Shop" },
          { zh: "碳油导电印", en: "Carbon Ink", code: "P368", dept: "Carbon Shop" },
        ],
      },
    ],
  },
  {
    id: "surface_treatment",
    mainZh: "表面处理工艺",
    mainEn: "SURFACE TREATMENT",
    gateBadge: "IPQC",
    deptZh: "表面处理车间",
    deptEn: "Surface Finish Shop",
    controlsZh: "提供沉金ENIG、喷锡HASL/VHASL、抗氧化OSP、化学浸银/沉锡等多元工艺",
    controlsEn: "Multi-finish capability: ENIG, VHASL lead-free, Entek OSP, Immersion Silver/Tin",
    qualityGate: "IPC-6012 Solderability & XRF Thickness Test",
    lanes: [
      {
        titleZh: "化学沉镍金 (ENIG)",
        titleEn: "ENIG (Electroless Ni / Au)",
        steps: [
          { zh: "脱脂", en: "Degreasing", code: "P3301", dept: "ENIG Line" },
          { zh: "中和", en: "Neutralizer", code: "P3302", dept: "ENIG Line" },
          { zh: "微蚀", en: "Microetch", code: "P3303", dept: "ENIG Line" },
          { zh: "预浸", en: "Pre-dip", code: "P3304", dept: "ENIG Line" },
          { zh: "钯活化", en: "Pd Activing", code: "P3305", dept: "ENIG Line" },
          { zh: "化学镍", en: "Electroless Nickel", code: "P3306", dept: "ENIG Line" },
          { zh: "化学金", en: "Electroless Gold", code: "P3307", dept: "ENIG Line" },
        ],
      },
      {
        titleZh: "垂直热风整平 (VHASL)",
        titleEn: "Vertical HASL Line",
        steps: [
          { zh: "贴保护胶", en: "G/F Cover", code: "P3401", dept: "HASL Line" },
          { zh: "压胶", en: "Adhesive Tape Coat", code: "P3402", dept: "HASL Line" },
          { zh: "前清洁", en: "Per-Treatment", code: "P3403", dept: "HASL Line" },
          { zh: "上助焊剂", en: "Flux coating", code: "P3404", dept: "HASL Line" },
          { zh: "热风喷锡", en: "Hot Air Level", code: "P3405", dept: "HASL Line" },
          { zh: "后清洗", en: "Post Clean", code: "P3406", dept: "HASL Line" },
          { zh: "撕胶", en: "A/T Strip", code: "P3407", dept: "HASL Line" },
        ],
      },
      {
        titleZh: "有机保焊膜 (OSP)",
        titleEn: "Organic Solderability (OSP)",
        steps: [
          { zh: "脱脂", en: "Degreasing", code: "P4001", dept: "OSP Line" },
          { zh: "微蚀", en: "Microetch", code: "P4002", dept: "OSP Line" },
          { zh: "酸浸", en: "Acid dip", code: "P4003", dept: "OSP Line" },
          { zh: "抗氧化", en: "Entek Film", code: "P4005", dept: "OSP Line" },
          { zh: "烘干", en: "Baking", code: "P4006", dept: "OSP Line" },
        ],
      },
      {
        titleZh: "化学银 / 锡",
        titleEn: "Immersion Ag / Tin",
        steps: [
          { zh: "化学银", en: "IMMERSION SILVER", code: "P403", dept: "Finish Line" },
          { zh: "化学锡", en: "IMMERSION TIN", code: "P405", dept: "Finish Line" },
        ],
      },
    ],
  },
  {
    id: "forming",
    mainZh: "机械成型(FF)",
    mainEn: "FINAL FABRICATION",
    gateBadge: "IPQC",
    deptZh: "成型加工车间",
    deptEn: "Mechanical CNC Routing Shop",
    controlsZh: "数控精雕机外形铣切±0.1mm；模具精密冲压；V-Cut残厚公差±0.05mm；金手指30°/45°倒角",
    controlsEn: "CNC routing ±0.1mm, punching, V-cut web thickness ±0.05mm, G/F beveling 30°/45°",
    qualityGate: "CMM Coordinate Dimension Measuring",
    lanes: [
      {
        steps: [
          { zh: "数控锣板", en: "Routing", code: "P3801", dept: "Routing Shop" },
          { zh: "模具冲板", en: "Punching", code: "P3802", dept: "Punch Shop" },
          { zh: "V-Cut微割", en: "V-cut", code: "P3803", dept: "V-Cut Shop" },
          { zh: "金手指斜边", en: "G/F Beveling", code: "P3804", dept: "Bevel Shop" },
        ],
      },
    ],
  },
  {
    id: "testing",
    mainZh: "成品测试(ET)",
    mainEn: "ELECTRICAL TEST",
    gateBadge: "IPQC",
    deptZh: "测试部",
    deptEn: "Electrical Test Shop",
    controlsZh: "超声波环保中性清洗；高压专用机与飞针测试(250V测试电压，绝缘阻抗≥20MΩ)",
    controlsEn: "Ultrasonic cleaning; 100% netlist flying-probe & fixture test (250V, ≥20MΩ)",
    qualityGate: "100% Continuity & Isolation Release",
    lanes: [
      {
        steps: [
          { zh: "PCB清洗", en: "Clean", code: "Q3001", dept: "Test Shop" },
          { zh: "电性能测试", en: "E-Test", code: "Q3002", dept: "Test Shop" },
        ],
      },
    ],
  },
  {
    id: "fqc",
    mainZh: "成检验收(FQC)",
    mainEn: "FINAL QUALITY CONTROL",
    gateBadge: "FQA",
    deptZh: "品质保证部",
    deptEn: "Final Quality Assurance",
    controlsZh: "标准塞规通止规孔径检验；平台翘曲度量测(反压平翘≤0.75%)；100%外观高倍显微全检",
    controlsEn: "Go/No-go hole check, warpage flat repair (≤0.75%), 100% microscopic visual",
    qualityGate: "FQC Acceptance & IPC-A-600 Release",
    lanes: [
      {
        steps: [
          { zh: "孔径读孔", en: "Hole Check", code: "Q3101", dept: "FQC Dept" },
          { zh: "反压平翘", en: "Warpage Repair", code: "Q3103", dept: "FQC Dept" },
          { zh: "外观目视", en: "Vision Inspection", code: "Q3104", dept: "FQC Dept" },
        ],
      },
    ],
  },
  {
    id: "fqa",
    mainZh: "出货前抽查(FQA)",
    mainEn: "OUTGOING QUALITY AUDIT",
    deptZh: "品质保证部",
    deptEn: "Outgoing Quality Audit",
    controlsZh: "按MIL-STD-105E严苛抽检，包含热应力288℃锡炉浮焊测试、微切片金相金厚测量、可焊性检测",
    controlsEn: "AQL sampling: 288℃ solder float thermal stress, microsection Cu/Au thickness, solderability",
    qualityGate: "OQA Outgoing Certificate Release",
    lanes: [
      {
        steps: [
          { zh: "出货品质稽核", en: "Outgoing Quality Audit", code: "FQA-PASS", dept: "OQA Dept" },
        ],
      },
    ],
  },
  {
    id: "packing_shipping",
    mainZh: "成品包装与出货(PS)",
    mainEn: "PACKING & SHIPPING",
    deptZh: "物流部",
    deptEn: "Packing & Logistics",
    controlsZh: "真空防静电铝箔袋封装，内置湿度指示卡与足量干燥剂；抗震加厚纸箱配木质托盘",
    controlsEn: "Vacuum ESD moisture-barrier bag with desiccant and HIC card; shockproof crating",
    qualityGate: "Logistics Dispatch Release",
    lanes: [
      {
        steps: [
          { zh: "真空封装与出货", en: "Vacuum Packing & Shipping", code: "PS-01", dept: "Logistics" },
          { zh: "成品仓库", en: "Finished Goods Warehouse", code: "WAREHOUSE", dept: "Warehouse" },
        ],
      },
    ],
  },
];

// -------------------------------------------------------------
// DOUBLE-SIDED PCB STAGES (Sheet 1 from Factory XLS)
// -------------------------------------------------------------
export const DOUBLESIDED_STAGES: FlowStage[] = MULTILAYER_STAGES.filter((stage) => {
  // Exclude inner layer specific steps: inner_image, inner_etch, inner_inspection, layup, lamination
  return !["inner_image", "inner_etch", "inner_inspection", "layup", "lamination"].includes(stage.id);
});

interface PcbProcessExcelFlowchartProps {
  onSelectStation?: (stationName: string) => void;
}

export default function PcbProcessExcelFlowchart({ onSelectStation }: PcbProcessExcelFlowchartProps) {
  const { theme, resolvedTheme } = useTheme();
  const { locale } = useLanguage();
  const t = useMemo(() => getProcessFlowchartDictionary(locale), [locale]);

  const [chartType, setChartType] = useState<"multilayer" | "doublesided">("multilayer");
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedStation, setSelectedStation] = useState<SubStation | FlowStage | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const activeStages = chartType === "multilayer" ? MULTILAYER_STAGES : DOUBLESIDED_STAGES;

  const isDark = resolvedTheme === "dark" || theme === "dark";

  // Center chart
  const centerChart = useCallback(() => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  }, []);

  const handleZoomIn = () => setZoom((prev) => Math.min(5.0, Number((prev + 0.25).toFixed(2))));
  const handleZoomOut = () => setZoom((prev) => Math.max(0.25, Number((prev - 0.25).toFixed(2))));

  // Wheel zoom with Ctrl or trackpad pinch
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      setZoom((prev) => {
        const next = Math.max(0.25, Math.min(5.0, prev * zoomFactor));
        return Number(next.toFixed(2));
      });
    }
  };

  // Mouse pan
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag with left click and not on a button
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // D-pad pan handlers
  const panBy = (dx: number, dy: number) => {
    setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!wrapperRef.current) return;
    if (!document.fullscreenElement) {
      wrapperRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Helper to extract Chinese title from selected station
  const selectedStationZh = useMemo(() => {
    if (!selectedStation) return null;
    return "zh" in selectedStation ? selectedStation.zh : selectedStation.mainZh;
  }, [selectedStation]);

  // Check if a station matches the search query
  const isMatch = (text1: string, text2?: string, code?: string) => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase().trim();
    return (
      text1.toLowerCase().includes(q) ||
      (text2 && text2.toLowerCase().includes(q)) ||
      (code && code.toLowerCase().includes(q))
    );
  };

  // Dimensions & Grid Configuration
  // Main Yellow Spine at col 0, width 180.
  // Sub-lanes flow horizontally to the right across columns 1..N.
  const MAIN_COL_WIDTH = 200;
  const MAIN_COL_X = 50;
  const SUB_BOX_WIDTH = 150;
  const SUB_BOX_HEIGHT = 68;
  const GAP_X = 48; // space between sub boxes for arrows
  const ROW_HEIGHT_UNIT = 84;
  const HEADER_HEIGHT = 160;

  // Pre-calculate vertical layout for each stage
  const layout = useMemo(() => {
    let currentY = HEADER_HEIGHT + 30;
    const stageLayouts = activeStages.map((stage) => {
      const laneCount = Math.max(1, stage.lanes.length);
      const stageHeight = laneCount * ROW_HEIGHT_UNIT;
      const startY = currentY;
      currentY += stageHeight + 42; // gap for vertical down arrow

      // Calculate max width for this stage
      let maxCols = 0;
      stage.lanes.forEach((lane) => {
        if (lane.steps.length > maxCols) maxCols = lane.steps.length;
      });

      return {
        stage,
        y: startY,
        height: stageHeight,
        laneCount,
        maxCols,
      };
    });

    // Total canvas size
    const maxColsOverall = Math.max(...stageLayouts.map((s) => s.maxCols), 6);
    const totalWidth = MAIN_COL_X + MAIN_COL_WIDTH + GAP_X + maxColsOverall * (SUB_BOX_WIDTH + GAP_X) + 100;
    const totalHeight = currentY + 60;

    return { stageLayouts, totalWidth, totalHeight };
  }, [activeStages]);

  return (
    <div
      ref={wrapperRef}
      className={`relative rounded-2xl border transition-colors duration-200 overflow-hidden shadow-2xl ${
        isDark ? "bg-[#0b101b] border-slate-800 text-slate-100" : "bg-white border-slate-300 text-slate-900"
      }`}
    >
      {/* ---------------- Top Floating Toolbar ---------------- */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 border-b backdrop-blur-md bg-opacity-90 border-slate-200 dark:border-slate-800 z-20 relative">
        {/* Left: Sheet Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => {
              setChartType("multilayer");
              centerChart();
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              chartType === "multilayer"
                ? "bg-amber-400 text-slate-950 shadow-md font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>多层板流程图 (Multilayer PCB)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/20 text-slate-900 dark:text-slate-900">
              Sheet 2
            </span>
          </button>
          <button
            onClick={() => {
              setChartType("doublesided");
              centerChart();
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              chartType === "doublesided"
                ? "bg-amber-400 text-slate-950 shadow-md font-bold"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>双面板流程图 (Double-sided PCB)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/20 text-slate-900 dark:text-slate-900">
              Sheet 1
            </span>
          </button>
        </div>

        {/* Center: Search Filter */}
        <div className="relative min-w-[220px] max-w-xs flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={locale === "zh" ? "搜索工序 / 工序号 / AOI / P2105..." : "Search step, code, e.g. AOI, ENIG..."}
            className="w-full pl-9 pr-7 py-1.5 text-xs rounded-xl border bg-slate-50 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right: Zoom & Utility Controls */}
        <div className="flex items-center gap-1.5">
          {/* Zoom Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
              title="Zoom Out (-25%)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-mono font-bold text-amber-500 min-w-[50px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
              title="Zoom In (+25% up to 500%)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={centerChart}
              className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
              title="Center & Reset (100%)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Presets */}
          <div className="hidden lg:flex items-center gap-1">
            {[0.5, 1.0, 2.0, 5.0].map((level) => (
              <button
                key={level}
                onClick={() => setZoom(level)}
                className={`px-2 py-1 text-[11px] font-mono rounded-lg transition ${
                  zoom === level
                    ? "bg-amber-400 text-slate-950 font-bold"
                    : "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                {Math.round(level * 100)}%
              </button>
            ))}
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ---------------- Main Interactive Canvas ---------------- */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className={`relative w-full h-[760px] cursor-grab active:cursor-grabbing overflow-hidden select-none ${
          isDark ? "bg-[#0b101b]" : "bg-[#fcfdfd]"
        }`}
      >
        {/* Interactive Transform Wrapper */}
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "0 0",
            transition: isDragging ? "none" : "transform 0.08s ease-out",
            width: layout.totalWidth,
            height: layout.totalHeight,
          }}
          className="relative origin-top-left"
        >
          {/* Engineering Blueprint / Excel Grid SVG Background */}
          <svg
            width={layout.totalWidth}
            height={layout.totalHeight}
            className="absolute inset-0 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Pattern: Excel Cell Grid */}
              <pattern
                id="excel-grid"
                width="36"
                height="24"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 36 0 L 0 0 0 24"
                  fill="none"
                  stroke={isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)"}
                  strokeWidth="0.8"
                />
              </pattern>

              {/* Marker: Red Arrow Down */}
              <marker
                id="red-arrow-down"
                viewBox="0 0 10 10"
                refX="5"
                refY="8"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 0 L 5 8 Z" fill="#EF4444" />
              </marker>

              {/* Marker: Red Arrow Left */}
              <marker
                id="red-arrow-left"
                viewBox="0 0 10 10"
                refX="2"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto"
              >
                <path d="M 10 0 L 0 5 L 10 10 Z" fill="#EF4444" />
              </marker>
            </defs>

            {/* Grid Pattern Fill */}
            <rect width="100%" height="100%" fill="url(#excel-grid)" />
          </svg>

          {/* ---------------- 1. Document Title Block (Matches Excel Screenshot) ---------------- */}
          <div
            style={{ width: layout.totalWidth }}
            className="absolute top-6 left-0 flex flex-col items-center justify-center text-center pointer-events-none z-10"
          >
            <h1
              className={`text-2xl md:text-3xl font-extrabold tracking-wide ${
                isDark ? "text-slate-100" : "text-black"
              }`}
              style={{ fontFamily: "'Microsoft YaHei', 'SimHei', sans-serif" }}
            >
              武平飞天电子科技有限公司
            </h1>
            <p className="text-sm md:text-base font-bold text-red-600 tracking-wide mt-0.5">
              Wuping Feitian Electronic Technology Co.,Ltd
            </p>
            <h2
              className={`text-lg md:text-xl font-black tracking-wider mt-1.5 ${
                isDark ? "text-slate-200" : "text-black"
              }`}
              style={{ fontFamily: "'Microsoft YaHei', 'SimHei', sans-serif" }}
            >
              PCB生产工艺流程圖
            </h2>
            <p className="text-xs md:text-sm font-bold text-red-600 tracking-widest mt-0.5">
              PCB Production Process Flow Chart
            </p>
          </div>

          {/* ---------------- 2. Stages & Stations Rendering ---------------- */}
          {layout.stageLayouts.map((stageItem, stageIdx) => {
            const { stage, y, height, laneCount } = stageItem;
            const isMainMatched = isMatch(stage.mainZh, stage.mainEn, stage.code);
            const isSelected = selectedStationZh === stage.mainZh || (selectedStation as FlowStage)?.id === stage.id;

            const nextStageItem = layout.stageLayouts[stageIdx + 1];

            return (
              <div key={stage.id} className="absolute left-0" style={{ top: y }}>
                {/* ---------------- Left Main Yellow Station Box ---------------- */}
                <div
                  onClick={() => {
                    setSelectedStation(stage);
                    if (onSelectStation) onSelectStation(stage.mainZh);
                  }}
                  style={{
                    left: MAIN_COL_X,
                    top: 0,
                    width: MAIN_COL_WIDTH,
                    height: height,
                  }}
                  className={`absolute rounded-none flex flex-col items-center justify-center text-center p-2.5 cursor-pointer transition-all duration-150 z-10 shadow-sm ${
                    stage.dashed ? "border-2 border-dashed" : "border-2 border-solid"
                  } ${
                    isDark
                      ? isSelected
                        ? "bg-amber-400 border-white text-slate-950 font-black ring-4 ring-amber-500/50"
                        : isMainMatched
                        ? "bg-amber-300 border-amber-500 text-slate-950 animate-pulse ring-4 ring-amber-400"
                        : "bg-[#facc15] hover:bg-[#fbbf24] border-black text-slate-950"
                      : isSelected
                      ? "bg-yellow-300 border-black ring-4 ring-amber-400 text-black font-black"
                      : isMainMatched
                      ? "bg-yellow-200 border-amber-600 ring-4 ring-amber-400 animate-pulse text-black"
                      : "bg-[#ffff55] hover:bg-[#fff960] border-black text-black"
                  }`}
                >
                  {/* Note badge e.g. "p21" */}
                  {stage.noteBadge && (
                    <span className="absolute -top-2.5 -right-2 px-1.5 py-0.5 text-[9px] font-mono font-black bg-blue-600 text-white rounded shadow">
                      {stage.noteBadge}
                    </span>
                  )}

                  <div className="text-sm font-black leading-tight tracking-tight">
                    {stage.mainZh}
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-tighter mt-1 opacity-90 leading-tight">
                    {stage.mainEn}
                  </div>
                </div>

                {/* ---------------- Downward Red Connecting Arrow to Next Stage ---------------- */}
                {nextStageItem && (
                  <div
                    style={{
                      left: MAIN_COL_X + MAIN_COL_WIDTH / 2 - 12,
                      top: height,
                      height: 42,
                      width: 24,
                    }}
                    className="absolute flex flex-col items-center justify-center pointer-events-none z-10"
                  >
                    <svg width="24" height="42" viewBox="0 0 24 42">
                      <line
                        x1="12"
                        y1="2"
                        x2="12"
                        y2="34"
                        stroke="#EF4444"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                      <polygon points="6,30 18,30 12,40" fill="#EF4444" />
                    </svg>

                    {/* IPQC / FQA Gate Badge */}
                    {stage.gateBadge && (
                      <div
                        style={{ left: 24, top: 12 }}
                        className="absolute px-1.5 py-0.5 text-[10px] font-black rounded border bg-white dark:bg-slate-900 border-red-500 text-red-600 dark:text-red-400 shadow-sm tracking-wider uppercase whitespace-nowrap"
                      >
                        {stage.gateBadge}
                      </div>
                    )}
                  </div>
                )}

                {/* ---------------- Right Horizontal Sub-Process Lanes ---------------- */}
                {stage.lanes.map((lane, laneIdx) => {
                  const laneY = laneIdx * ROW_HEIGHT_UNIT + (ROW_HEIGHT_UNIT - SUB_BOX_HEIGHT) / 2;
                  const totalSteps = lane.steps.length;

                  return (
                    <div key={laneIdx} className="absolute" style={{ top: laneY, left: MAIN_COL_X + MAIN_COL_WIDTH }}>
                      {/* Red Leftward Arrow from first sub-box into Main Stage */}
                      {totalSteps > 0 && (
                        <div
                          style={{
                            left: 0,
                            top: SUB_BOX_HEIGHT / 2 - 10,
                            width: GAP_X,
                            height: 20,
                          }}
                          className="absolute flex items-center justify-center pointer-events-none"
                        >
                          <svg width={GAP_X} height="20" viewBox={`0 0 ${GAP_X} 20`}>
                            <line
                              x1={GAP_X - 2}
                              y1="10"
                              x2="10"
                              y2="10"
                              stroke="#EF4444"
                              strokeWidth="4"
                              strokeLinecap="round"
                            />
                            <polygon points="12,4 2,10 12,16" fill="#EF4444" />
                          </svg>
                        </div>
                      )}

                      {/* Render Sub-Stations from left to right */}
                      {lane.steps.map((sub, stepIdx) => {
                        const boxX = GAP_X + stepIdx * (SUB_BOX_WIDTH + GAP_X);
                        const isSubMatched = isMatch(sub.zh, sub.en, sub.code);
                        const isSubSelected = selectedStationZh === sub.zh;

                        return (
                          <React.Fragment key={stepIdx}>
                            {/* Sub-Station Box */}
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedStation(sub);
                                if (onSelectStation) onSelectStation(sub.zh);
                              }}
                              style={{
                                left: boxX,
                                top: 0,
                                width: SUB_BOX_WIDTH,
                                height: SUB_BOX_HEIGHT,
                              }}
                              className={`absolute rounded-none flex flex-col items-center justify-center text-center p-2 cursor-pointer transition-all duration-150 z-10 shadow-sm ${
                                sub.dashed ? "border-2 border-dashed" : "border border-solid"
                              } ${
                                isDark
                                  ? isSubSelected
                                    ? "bg-slate-700 border-amber-400 text-white ring-2 ring-amber-400"
                                    : isSubMatched
                                    ? "bg-amber-950/80 border-amber-400 text-amber-200 ring-2 ring-amber-400 animate-pulse"
                                    : "bg-slate-900/90 hover:bg-slate-800 border-slate-700 text-slate-100"
                                  : isSubSelected
                                  ? "bg-amber-50 border-amber-600 text-black ring-2 ring-amber-500 font-bold"
                                  : isSubMatched
                                  ? "bg-amber-100 border-amber-500 text-amber-950 ring-2 ring-amber-400 animate-pulse font-bold"
                                  : "bg-white hover:bg-slate-50 border-black text-black"
                              }`}
                            >
                              <div className="text-xs font-bold leading-tight truncate w-full px-1">
                                {sub.zh}
                              </div>
                              <div className="text-[10px] font-medium leading-tight opacity-80 mt-0.5 truncate w-full px-1">
                                {sub.en}
                              </div>
                              {sub.code && (
                                <div className="text-[10px] font-mono font-bold mt-1 text-blue-600 dark:text-cyan-400 leading-none">
                                  {sub.code}
                                </div>
                              )}
                            </div>

                            {/* Red Arrow pointing LEFT from stepIdx + 1 into stepIdx */}
                            {stepIdx < totalSteps - 1 && (
                              <div
                                style={{
                                  left: boxX + SUB_BOX_WIDTH,
                                  top: SUB_BOX_HEIGHT / 2 - 10,
                                  width: GAP_X,
                                  height: 20,
                                }}
                                className="absolute flex items-center justify-center pointer-events-none"
                              >
                                <svg width={GAP_X} height="20" viewBox={`0 0 ${GAP_X} 20`}>
                                  <line
                                    x1={GAP_X - 2}
                                    y1="10"
                                    x2="10"
                                    y2="10"
                                    stroke="#EF4444"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                  />
                                  <polygon points="12,4 2,10 12,16" fill="#EF4444" />
                                </svg>
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* ---------------- Bottom Left Floating D-Pad & Controls ---------------- */}
        <div className="absolute bottom-4 left-4 z-20 flex flex-col items-center gap-1.5 p-2 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-xl">
          <button
            onClick={() => panBy(0, 100)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
            title="Pan Up"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => panBy(100, 0)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
              title="Pan Left"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={centerChart}
              className="p-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold transition shadow-sm"
              title="Center Chart"
            >
              <Move className="w-4 h-4" />
            </button>
            <button
              onClick={() => panBy(-100, 0)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
              title="Pan Right"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => panBy(0, -100)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition"
            title="Pan Down"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>

        {/* ---------------- Bottom Right Quick Legend & Zoom Indicator ---------------- */}
        <div className="absolute bottom-4 right-4 z-20 hidden sm:flex items-center gap-3 px-3.5 py-2 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-xs shadow-lg">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-none bg-[#ffff55] border border-black inline-block" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">主生产工序 (Main Stage)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-none bg-white dark:bg-slate-800 border border-slate-400 inline-block" />
            <span className="text-slate-700 dark:text-slate-300 font-medium">分支工序 (Sub-Station)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-red-500 font-bold">← / ↓</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">工艺流向 (Process Flow)</span>
          </div>
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 font-mono">Zoom:</span>
            <span className="font-mono font-bold text-amber-500">{Math.round(zoom * 100)}%</span>
          </div>
        </div>
      </div>

      {/* ---------------- Selected Station Inspection Drawer ---------------- */}
      {selectedStation && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-400/20 text-amber-500 border border-amber-400/30">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {(selectedStation as any).zh || (selectedStation as any).mainZh}
                </h3>
                {((selectedStation as any).code || (selectedStation as any).id) && (
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {(selectedStation as any).code || (selectedStation as any).id}
                  </span>
                )}
                {(selectedStation as any).deptZh && (
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    • {(selectedStation as any).deptZh}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
                {(selectedStation as any).controlsZh ||
                  (selectedStation as any).descZh ||
                  "武平飞天电子科技有限公司官方SOP作业规范，严格执行IPC-A-600与IPC-6012二级/三级标准管控。"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center">
            <button
              onClick={() => setSelectedStation(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
              title="Close inspection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
