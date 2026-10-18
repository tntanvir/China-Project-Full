"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";
import {
  Box,
  Check,
  CheckCircle2,
  Cpu,
  Expand,
  Eye,
  FlipHorizontal2,
  Layers,
  Maximize2,
  Minimize2,
  RotateCcw,
  RotateCw,
  ShieldCheck,
  Sparkles,
  Zap,
  ZoomIn,
  ZoomOut,
  Sliders,
  Layers3,
  X,
  Compass,
  Activity,
  ChevronRight,
  Info,
} from "lucide-react";

export interface PcbQuote3DViewerProps {
  length: string;
  width: string;
  thickness: string;
  layers: string;
  solderMask: string;
  silkscreen: string;
  surfaceFinish: string;
  material: string;
  edgeConnector?: string;
  castellatedHoles?: string;
  finishedCopper?: string;
  viaProcess?: string;
  boardType?: string;
  className?: string;
}

// Master Color definitions matching the Quote form options exactly
export const SOLDER_MASK_PALETTE: Record<
  string,
  {
    bgHex: string;
    threeHex: number;
    traceColor: string;
    reliefColor: string;
    label: string;
    isMatte?: boolean;
    isBare?: boolean;
  }
> = {
  Green: {
    bgHex: "#137536",
    threeHex: 0x137536,
    traceColor: "rgba(34, 197, 94, 0.45)",
    reliefColor: "rgba(10, 77, 34, 0.6)",
    label: "Classic Green",
  },
  Red: {
    bgHex: "#b91c1c",
    threeHex: 0xb91c1c,
    traceColor: "rgba(252, 165, 165, 0.4)",
    reliefColor: "rgba(127, 29, 29, 0.65)",
    label: "Crimson Red",
  },
  Yellow: {
    bgHex: "#ca8a04",
    threeHex: 0xca8a04,
    traceColor: "rgba(254, 240, 138, 0.45)",
    reliefColor: "rgba(133, 77, 14, 0.6)",
    label: "Signal Yellow",
  },
  Blue: {
    bgHex: "#1d4ed8",
    threeHex: 0x1d4ed8,
    traceColor: "rgba(147, 197, 253, 0.45)",
    reliefColor: "rgba(30, 58, 138, 0.65)",
    label: "Cobalt Blue",
  },
  White: {
    bgHex: "#f8fafc",
    threeHex: 0xf8fafc,
    traceColor: "rgba(148, 163, 184, 0.4)",
    reliefColor: "rgba(203, 213, 225, 0.6)",
    label: "Silk White",
  },
  Black: {
    bgHex: "#18181b",
    threeHex: 0x18181b,
    traceColor: "rgba(82, 82, 91, 0.55)",
    reliefColor: "rgba(39, 39, 42, 0.7)",
    label: "Obsidian Black",
  },
  Purple: {
    bgHex: "#7e22ce",
    threeHex: 0x7e22ce,
    traceColor: "rgba(216, 180, 254, 0.45)",
    reliefColor: "rgba(88, 28, 135, 0.65)",
    label: "Velvet Purple",
  },
  "Matte Black": {
    bgHex: "#09090b",
    threeHex: 0x09090b,
    traceColor: "rgba(63, 63, 70, 0.55)",
    reliefColor: "rgba(24, 24, 27, 0.7)",
    isMatte: true,
    label: "Matte Black",
  },
  "Matte Green": {
    bgHex: "#14532d",
    threeHex: 0x14532d,
    traceColor: "rgba(34, 197, 94, 0.4)",
    reliefColor: "rgba(20, 83, 45, 0.7)",
    isMatte: true,
    label: "Matte Green",
  },
  None: {
    bgHex: "#9c6832",
    threeHex: 0x9c6832,
    traceColor: "rgba(217, 119, 6, 0.8)",
    reliefColor: "rgba(180, 83, 9, 0.9)",
    isBare: true,
    label: "Bare FR-4",
  },
};

// Generates procedural top PCB texture with true background color, copper traces, pads, and silkscreen
function createTopPcbTexture(
  solderMask: string,
  silkscreen: string,
  surfaceFinish: string,
  lengthMm: number,
  widthMm: number,
  layers: string,
  material: string,
  edgeConnector = "No",
  castellatedHoles = "No",
  isXRay = false
): THREE.CanvasTexture {
  if (typeof document === "undefined") {
    return new THREE.CanvasTexture({} as HTMLCanvasElement);
  }

  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1440;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const w = canvas.width;
  const h = canvas.height;

  const maskCfg = SOLDER_MASK_PALETTE[solderMask] || SOLDER_MASK_PALETTE.Green;

  // 1. Solder Mask Background Fill
  if (isXRay) {
    ctx.fillStyle = "#02121a";
    ctx.fillRect(0, 0, w, h);
  } else if (maskCfg.isBare || material === "Rogers") {
    // Bare FR-4 fiberglass laminate or Rogers ceramic hydrocarbon
    ctx.fillStyle = material === "Rogers" ? "#dfd7c8" : "#925923";
    ctx.fillRect(0, 0, w, h);
    // Fiberglass weave pattern
    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
    for (let x = 0; x < w; x += 10) ctx.fillRect(x, 0, 5, h);
    for (let y = 0; y < h; y += 10) ctx.fillRect(0, y, w, 5);
  } else {
    ctx.fillStyle = maskCfg.bgHex;
    ctx.fillRect(0, 0, w, h);

    // Subtle gloss / fiberglass weave texture
    ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
    for (let x = 0; x < w; x += 8) ctx.fillRect(x, 0, 4, h);
    for (let y = 0; y < h; y += 8) ctx.fillRect(0, y, w, 4);
  }

  // Determine Finish Color for Pads & Exposed Metal
  const isGold = surfaceFinish.includes("ENIG") || surfaceFinish.includes("Hard Gold");
  const isSilver =
    surfaceFinish.includes("Silver") ||
    surfaceFinish.includes("HASL") ||
    surfaceFinish.includes("Tin");
  const isOSP = surfaceFinish.includes("OSP");

  let padFill = "#f59e0b"; // Vibrant 24K Gold
  if (isSilver) {
    padFill = surfaceFinish.includes("Silver") ? "#f8fafc" : "#e2e8f0";
  } else if (isOSP) {
    padFill = "#ea580c"; // Warm bare copper
  }

  if (isXRay) {
    padFill = "#00f0ff";
  }

  // 2. Copper Ground Pour & Copper Routing Traces
  // Ground plane copper hatch grid
  if (!isXRay && !maskCfg.isBare) {
    ctx.fillStyle = maskCfg.reliefColor;
    for (let x = 120; x < w - 120; x += 32) {
      for (let y = 120; y < h - 120; y += 32) {
        if ((x + y) % 64 === 0) {
          ctx.fillRect(x, y, 4, 4);
        }
      }
    }
  }

  // Copper routing traces
  const traceStroke = isXRay
    ? "rgba(0, 240, 255, 0.85)"
    : maskCfg.isBare
    ? "rgba(180, 83, 9, 0.85)"
    : maskCfg.traceColor;

  ctx.strokeStyle = traceStroke;
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Draw Bus routing channels
  const drawBus = (
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    lines: number,
    gap: number
  ) => {
    for (let i = 0; i < lines; i++) {
      const off = (i - lines / 2) * gap;
      ctx.beginPath();
      ctx.moveTo(startX + off, startY);
      const midY = startY + (endY - startY) * 0.45;
      const midX = startX + off + (endX - startX) * 0.5;
      ctx.lineTo(midX, midY);
      ctx.lineTo(endX + off, endY);
      ctx.stroke();
    }
  };

  drawBus(w * 0.45, h * 0.5, w * 0.2, h * 0.25, 7, 14);
  drawBus(w * 0.55, h * 0.5, w * 0.82, h * 0.3, 9, 14);
  drawBus(w * 0.5, h * 0.55, w * 0.35, h * 0.82, 7, 14);
  drawBus(w * 0.55, h * 0.55, w * 0.8, h * 0.75, 9, 14);

  // Serpentine delay matching high-speed traces
  ctx.beginPath();
  let sx = w * 0.48;
  let sy = h * 0.34;
  ctx.moveTo(sx, sy);
  for (let j = 0; j < 6; j++) {
    sx += 32;
    sy += j % 2 === 0 ? -36 : 36;
    ctx.lineTo(sx, sy);
  }
  ctx.stroke();

  // 3. SMT Footprints & Solder Pads
  ctx.fillStyle = padFill;
  ctx.strokeStyle = padFill;

  // Center BGA SoC Matrix Footprint
  const cx = w * 0.5;
  const cy = h * 0.5;
  const bgaSpan = 150;
  for (let bx = -bgaSpan; bx <= bgaSpan; bx += 22) {
    for (let by = -bgaSpan; by <= bgaSpan; by += 22) {
      if (Math.abs(bx) > bgaSpan * 0.65 || Math.abs(by) > bgaSpan * 0.65) {
        ctx.beginPath();
        ctx.arc(cx + bx, cy + by, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // SOIC-16 Footprint
  const soicX = w * 0.24;
  const soicY = h * 0.32;
  for (let p = 0; p < 8; p++) {
    const py = soicY - 70 + p * 20;
    ctx.fillRect(soicX - 45, py, 26, 9);
    ctx.fillRect(soicX + 20, py, 26, 9);
  }

  // QFP-32 Footprint
  const qfpX = w * 0.76;
  const qfpY = h * 0.35;
  const qfpSpan = 65;
  for (let q = -qfpSpan; q <= qfpSpan; q += 18) {
    ctx.fillRect(qfpX + q, qfpY - qfpSpan - 24, 8, 22);
    ctx.fillRect(qfpX + q, qfpY + qfpSpan + 2, 8, 22);
    ctx.fillRect(qfpX - qfpSpan - 24, qfpY + q, 22, 8);
    ctx.fillRect(qfpX + qfpSpan + 2, qfpY + q, 22, 8);
  }

  // Passives 0603 / 0805 pads
  const draw0805 = (px: number, py: number, vertical = false) => {
    if (vertical) {
      ctx.fillRect(px - 9, py - 18, 18, 12);
      ctx.fillRect(px - 9, py + 6, 18, 12);
    } else {
      ctx.fillRect(px - 18, py - 9, 12, 18);
      ctx.fillRect(px + 6, py - 9, 12, 18);
    }
  };

  for (let i = 0; i < 14; i++) {
    draw0805(w * 0.32 + (i % 5) * 40, h * 0.65 + Math.floor(i / 5) * 35, i % 2 === 0);
    draw0805(w * 0.62 + (i % 4) * 45, h * 0.66 + Math.floor(i / 4) * 35, i % 3 === 0);
  }

  // Plated Through-Hole Vias (PTH microvias scattered across ground planes)
  const drawVia = (vx: number, vy: number) => {
    ctx.fillStyle = padFill;
    ctx.beginPath();
    ctx.arc(vx, vy, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#09090b"; // Hole drill
    ctx.beginPath();
    ctx.arc(vx, vy, 4, 0, Math.PI * 2);
    ctx.fill();
  };

  for (let vx = 180; vx < w - 180; vx += 120) {
    drawVia(vx, h * 0.18);
    drawVia(vx + 60, h * 0.88);
  }

  // Edge Connector Gold Fingers
  if (edgeConnector === "Yes" || surfaceFinish === "Hard Gold") {
    ctx.fillStyle = "#d97706";
    const fingerW = 24;
    const fingerH = 80;
    for (let fx = 120; fx < w - 120; fx += 38) {
      ctx.fillRect(fx, h - fingerH - 10, fingerW, fingerH);
      ctx.beginPath();
      ctx.arc(fx + fingerW / 2, h - fingerH - 10, fingerW / 2, Math.PI, 0);
      ctx.fill();
    }
    ctx.fillStyle = padFill;
  }

  // Castellated Hole Vias (Along Left & Right Borders)
  if (castellatedHoles === "Yes") {
    ctx.fillStyle = padFill;
    for (let cy = 160; cy < h - 160; cy += 60) {
      // Left edge
      ctx.beginPath();
      ctx.arc(10, cy, 18, -Math.PI / 2, Math.PI / 2);
      ctx.fill();
      ctx.fillStyle = "#18181b";
      ctx.beginPath();
      ctx.arc(10, cy, 10, -Math.PI / 2, Math.PI / 2);
      ctx.fill();
      ctx.fillStyle = padFill;

      // Right edge
      ctx.beginPath();
      ctx.arc(w - 10, cy, 18, Math.PI / 2, -Math.PI / 2);
      ctx.fill();
      ctx.fillStyle = "#18181b";
      ctx.beginPath();
      ctx.arc(w - 10, cy, 10, Math.PI / 2, -Math.PI / 2);
      ctx.fill();
      ctx.fillStyle = padFill;
    }
  }

  // Corner Mounting Holes (Plated Through-Hole M3 with Ground Pad)
  const drawCornerMount = (mx: number, my: number) => {
    ctx.fillStyle = padFill;
    ctx.beginPath();
    ctx.arc(mx, my, 46, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#111827"; // Drill hole opening
    ctx.beginPath();
    ctx.arc(mx, my, 26, 0, Math.PI * 2);
    ctx.fill();

    // 8 thermal relief spokes
    ctx.strokeStyle = padFill;
    ctx.lineWidth = 4;
    for (let a = 0; a < 8; a++) {
      const angle = (a * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(mx + Math.cos(angle) * 26, my + Math.sin(angle) * 26);
      ctx.lineTo(mx + Math.cos(angle) * 58, my + Math.sin(angle) * 58);
      ctx.stroke();
    }
  };

  drawCornerMount(85, 85);
  drawCornerMount(w - 85, 85);
  drawCornerMount(85, h - 85);
  drawCornerMount(w - 85, h - 85);

  // 4. Crisp Silkscreen Markings & Dynamic Metadata
  if (silkscreen !== "None" && !isXRay) {
    let silkColor = "#ffffff";
    if (silkscreen === "Black" || solderMask === "White") silkColor = "#09090b";
    if (silkscreen === "Yellow") silkColor = "#facc15";

    ctx.fillStyle = silkColor;
    ctx.strokeStyle = silkColor;
    ctx.lineWidth = 2.5;

    // Component Outlines
    ctx.strokeRect(cx - 105, cy - 105, 210, 210);
    ctx.strokeRect(soicX - 35, soicY - 75, 70, 150);
    ctx.strokeRect(qfpX - 55, qfpY - 55, 110, 110);

    // Component Reference Designators
    ctx.font = "bold 18px 'JetBrains Mono', monospace";
    ctx.fillText("U1 (SoC)", cx - 40, cy - 115);
    ctx.fillText("U2 (FLASH)", soicX - 35, soicY - 85);
    ctx.fillText("U3 (MCU)", qfpX - 35, qfpY - 65);
    ctx.fillText("J1 (USB-C)", 145, h * 0.5 - 45);
    ctx.fillText("Y1", w * 0.28, h * 0.72);
    ctx.fillText("D1", w * 0.82, h * 0.72);

    // Pin 1 Dots
    ctx.beginPath();
    ctx.arc(cx - 95, cy - 95, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(soicX - 25, soicY - 65, 5, 0, Math.PI * 2);
    ctx.fill();

    // Board Silkscreen Text (Reflects ACTIVE USER CONFIGURATION!)
    ctx.font = "bold 32px 'JetBrains Mono', 'Courier New', monospace";
    ctx.fillText("FEITIAN ELECTRONIC TECH", 160, 95);

    ctx.font = "bold 22px 'JetBrains Mono', 'Courier New', monospace";
    ctx.fillText(
      `JOB: FT-${lengthMm}x${widthMm} • ${layers} • ${material}`,
      160,
      130
    );

    ctx.font = "bold 18px 'JetBrains Mono', 'Courier New', monospace";
    ctx.fillText(
      `THICKNESS: ${lengthMm}x${widthMm}x${layers} | ${surfaceFinish} | MASK: ${solderMask}`,
      160,
      160
    );

    // ESD / RoHS / CE Markings
    ctx.font = "bold 20px monospace";
    ctx.fillText("RoHS COMPLIANT [Pb-Free]", w - 460, 95);
    ctx.fillText("REV 4.2 • 94V-0", w - 340, 130);

    // 2D Barcode DataMatrix Symbol impression
    const bx = w - 240;
    const by = h - 220;
    ctx.strokeRect(bx, by, 90, 90);
    for (let rx = 0; rx < 6; rx++) {
      for (let ry = 0; ry < 6; ry++) {
        if ((rx + ry) % 2 === 0 || (rx * ry) % 3 === 0) {
          ctx.fillRect(bx + 10 + rx * 12, by + 10 + ry * 12, 10, 10);
        }
      }
    }

    // Optical Alignment Fiducials
    const drawFiducial = (fx: number, fy: number) => {
      ctx.beginPath();
      ctx.arc(fx, fy, 14, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(fx, fy, 5, 0, Math.PI * 2);
      ctx.fill();
    };

    drawFiducial(w * 0.1, h * 0.5);
    drawFiducial(w * 0.9, h * 0.5);
    drawFiducial(w * 0.5, h * 0.12);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

// Generates procedural bottom PCB texture with ground plane, test pads, and compliance markings
function createBottomPcbTexture(
  solderMask: string,
  silkscreen: string,
  surfaceFinish: string,
  material: string,
  isXRay = false
): THREE.CanvasTexture {
  if (typeof document === "undefined") {
    return new THREE.CanvasTexture({} as HTMLCanvasElement);
  }

  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1440;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const w = canvas.width;
  const h = canvas.height;

  const maskCfg = SOLDER_MASK_PALETTE[solderMask] || SOLDER_MASK_PALETTE.Green;

  if (isXRay) {
    ctx.fillStyle = "#02121a";
    ctx.fillRect(0, 0, w, h);
  } else if (material === "Aluminum") {
    // Brushed Aluminum Backing Plate
    ctx.fillStyle = "#d1d5db";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    for (let x = 0; x < w; x += 4) ctx.fillRect(x, 0, 2, h);
  } else if (material === "Copper Base") {
    // Pure Brushed Heavy Copper Plate
    ctx.fillStyle = "#c2410c";
    ctx.fillRect(0, 0, w, h);
  } else {
    ctx.fillStyle = maskCfg.bgHex;
    ctx.fillRect(0, 0, w, h);
  }

  const isGold = surfaceFinish.includes("ENIG") || surfaceFinish.includes("Hard Gold");
  const padFill = isGold ? "#f59e0b" : "#e2e8f0";

  // Bottom Ground Mesh vias & test points
  ctx.fillStyle = padFill;
  for (let x = 180; x < w - 180; x += 90) {
    for (let y = 180; y < h - 180; y += 90) {
      if ((x + y) % 180 === 0) {
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Bottom Silkscreen
  if (silkscreen !== "None" && !isXRay && material !== "Aluminum" && material !== "Copper Base") {
    let silkColor = "#ffffff";
    if (silkscreen === "Black" || solderMask === "White") silkColor = "#09090b";
    ctx.fillStyle = silkColor;
    ctx.font = "bold 26px 'JetBrains Mono', monospace";
    ctx.fillText("FEITIAN CAM ENGINE • BOTTOM LAYER", 180, h - 140);
    ctx.font = "bold 18px monospace";
    ctx.fillText("MADE IN CHINA • ISO9001 / IATF16949 / UL CERTIFIED", 180, h - 100);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

// Generates multi-layer substrate edge texture showing prepreg fiberglass and copper plane stripes
function createEdgeTexture(layers: string): THREE.CanvasTexture {
  if (typeof document === "undefined") {
    return new THREE.CanvasTexture({} as HTMLCanvasElement);
  }

  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const w = canvas.width;
  const h = canvas.height;

  // Dark realistic FR4 core
  ctx.fillStyle = "#3d2a14";
  ctx.fillRect(0, 0, w, h);

  // Micro fiberglass grain
  ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
  for (let y = 0; y < h; y += 4) {
    ctx.fillRect(0, y, w, 2);
  }

  // Parse layer count
  const layerNum = parseInt(layers) || 2;
  const copperCount = Math.max(2, Math.min(14, layerNum));

  // Multi-layer copper laminates along board cross-section
  ctx.fillStyle = "#f59e0b"; // Glowing copper foil stripe
  const step = h / (copperCount + 1);
  for (let i = 1; i <= copperCount; i++) {
    const y = i * step;
    ctx.fillRect(0, y - 2, w, 4);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 1);
  texture.needsUpdate = true;
  return texture;
}

export default function PcbQuote3DViewer({
  length,
  width,
  thickness,
  layers,
  solderMask,
  silkscreen,
  surfaceFinish,
  material,
  edgeConnector = "No",
  castellatedHoles = "No",
  finishedCopper = "1oz Cu",
  viaProcess = "Tenting vias",
  boardType = "Single piece",
  className = "",
}: PcbQuote3DViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const fullscreenMountRef = useRef<HTMLDivElement>(null);

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const boardGroupRef = useRef<THREE.Group | null>(null);
  const boardMeshRef = useRef<THREE.Mesh | null>(null);
  const compGroupRef = useRef<THREE.Group | null>(null);
  const edgeFingersRef = useRef<THREE.Group | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Materials References
  const topMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const bottomMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const edgeMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const padMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);

  // Lights References
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const rimLightRef = useRef<THREE.DirectionalLight | null>(null);
  const fillLightRef = useRef<THREE.DirectionalLight | null>(null);

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  // Interactive controls
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isXRay, setIsXRay] = useState(false);
  const [isExploded, setIsExploded] = useState(false);
  const [cameraPreset, setCameraPreset] = useState<"iso" | "top" | "bottom" | "side">("iso");
  const [syncedBadgeText, setSyncedBadgeText] = useState<string | null>(null);

  // Parsed Numerical Inputs
  const lengthNum = Math.max(10, Math.min(600, parseFloat(length) || 100));
  const widthNum = Math.max(10, Math.min(600, parseFloat(width) || 100));
  const thicknessNum = Math.max(0.4, Math.min(3.2, parseFloat(thickness) || 1.6));

  // Dynamic 3D Dimensions:
  const aspectRatio = lengthNum / widthNum;
  const baseScale = Math.min(1.35, Math.max(0.72, Math.sqrt((lengthNum * widthNum) / 10000)));
  const dimX = Math.min(13.0, Math.max(4.8, 8.5 * Math.sqrt(aspectRatio) * baseScale * 0.85));
  const dimZ = Math.min(10.0, Math.max(3.8, (6.0 / Math.sqrt(aspectRatio)) * baseScale * 0.85));
  const dimY = Math.max(0.08, Math.min(0.65, (thicknessNum / 1.6) * 0.28));

  const isGold = surfaceFinish.includes("ENIG") || surfaceFinish.includes("Hard Gold");

  // Inertia Drag & Camera State
  const isDragging = useRef(false);
  const prevPointer = useRef({ x: 0, y: 0 });
  const rotTarget = useRef({ x: 0.55, y: -0.45 });
  const currentRot = useRef({ x: 0.55, y: -0.45 });
  const zoomTarget = useRef(14.5);
  const currentZoom = useRef(14.5);

  // Preset Camera Angles
  const setCameraView = (view: "iso" | "top" | "bottom" | "side") => {
    setCameraPreset(view);
    if (view === "iso") {
      rotTarget.current = { x: 0.55, y: -0.45 };
      zoomTarget.current = isExpanded ? 16.0 : 14.5;
      setIsFlipped(false);
    } else if (view === "top") {
      rotTarget.current = { x: 0.0, y: 0.0 };
      zoomTarget.current = isExpanded ? 14.0 : 12.5;
      setIsFlipped(false);
    } else if (view === "bottom") {
      rotTarget.current = { x: -Math.PI, y: 0.0 };
      zoomTarget.current = isExpanded ? 14.0 : 12.5;
      setIsFlipped(true);
    } else if (view === "side") {
      rotTarget.current = { x: 0.1, y: -Math.PI / 2 };
      zoomTarget.current = isExpanded ? 13.0 : 11.5;
      setIsFlipped(false);
    }
  };

  // Flip 180° Top / Bottom Side
  const handleFlip = () => {
    setIsFlipped((prev) => {
      const next = !prev;
      rotTarget.current.x = next ? -2.6 : 0.55;
      return next;
    });
  };

  // Reset 3D Angle
  const handleResetAngle = () => {
    setCameraView("iso");
  };

  // Keyboard shortcut: Escape exits fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isExpanded) {
        setIsExpanded(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isExpanded]);

  // 1. Initialize Three.js Scene
  useEffect(() => {
    const targetMount = isExpanded ? fullscreenMountRef.current : mountRef.current;
    if (!targetMount) return;

    const w = targetMount.clientWidth || (isExpanded ? window.innerWidth : 360);
    const h = targetMount.clientHeight || (isExpanded ? window.innerHeight : 260);

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(36, w / h, 0.1, 100);
    camera.position.set(0, 0, currentZoom.current);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;

    targetMount.replaceChildren(renderer.domElement);

    // Studio Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.95 : 1.45);
    ambientLightRef.current = ambientLight;
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, isDark ? 2.0 : 2.3);
    keyLight.position.set(10, 15, 12);
    keyLightRef.current = keyLight;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 1.25);
    fillLight.position.set(-12, -7, 10);
    fillLightRef.current = fillLight;
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(isDark ? 0x10b981 : 0x059669, isDark ? 1.6 : 1.15);
    rimLight.position.set(0, 12, -13);
    rimLightRef.current = rimLight;
    scene.add(rimLight);

    // Master Board Group
    const boardGroup = new THREE.Group();
    boardGroupRef.current = boardGroup;
    scene.add(boardGroup);

    // Initial Textures
    const initialTopTexture = createTopPcbTexture(
      solderMask,
      silkscreen,
      surfaceFinish,
      lengthNum,
      widthNum,
      layers,
      material,
      edgeConnector,
      castellatedHoles,
      false
    );

    const initialBottomTexture = createBottomPcbTexture(
      solderMask,
      silkscreen,
      surfaceFinish,
      material,
      false
    );

    const initialEdgeTexture = createEdgeTexture(layers);

    // Top Face Material (color: 0xffffff so texture shines with 100% true vibrant color!)
    const topMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      map: initialTopTexture,
      roughness: solderMask.includes("Matte") ? 0.55 : 0.22,
      metalness: 0.08,
      clearcoat: solderMask.includes("Matte") ? 0.05 : 0.6,
      clearcoatRoughness: 0.12,
      reflectivity: 0.65,
    });
    topMaterialRef.current = topMat;

    // Bottom Face Material
    const bottomMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      map: initialBottomTexture,
      roughness: 0.3,
      metalness: material === "Aluminum" ? 0.8 : 0.1,
      clearcoat: 0.45,
    });
    bottomMaterialRef.current = bottomMat;

    // Edge Cut Material
    const edgeMat = new THREE.MeshStandardMaterial({
      map: initialEdgeTexture,
      roughness: 0.65,
      metalness: 0.35,
    });
    edgeMaterialRef.current = edgeMat;

    // 6-Material Box Array: [+X, -X, +Y (Top), -Y (Bottom), +Z, -Z]
    const materialsArray = [edgeMat, edgeMat, topMat, bottomMat, edgeMat, edgeMat];

    // Board Substrate Mesh
    const boardGeo = new THREE.BoxGeometry(dimX, dimY, dimZ);
    const boardMesh = new THREE.Mesh(boardGeo, materialsArray);
    boardMeshRef.current = boardMesh;
    boardGroup.add(boardMesh);

    // SMT Components Container
    const compGroup = new THREE.Group();
    compGroupRef.current = compGroup;
    compGroup.position.y = dimY / 2;
    boardGroup.add(compGroup);

    // Component Materials
    const icBodyMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.32,
      metalness: 0.25,
    });

    const leadMat = new THREE.MeshStandardMaterial({
      color: isGold ? 0xf59e0b : 0xe2e8f0,
      roughness: 0.14,
      metalness: 0.96,
    });
    padMaterialsRef.current = [leadMat];

    // 1. Central BGA SoC Chip (with Heat Spreader Plate & Corner Index)
    const bgaMesh = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.22, 2.4), icBodyMat);
    bgaMesh.position.set(0, 0.11, 0);

    const heatSpreader = new THREE.Mesh(
      new THREE.BoxGeometry(1.9, 0.04, 1.9),
      new THREE.MeshStandardMaterial({
        color: 0x27272a,
        roughness: 0.18,
        metalness: 0.88,
      })
    );
    heatSpreader.position.set(0, 0.12, 0);
    bgaMesh.add(heatSpreader);

    // Laser-etched chip text plate
    const chipTextPlate = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.01, 1.4),
      new THREE.MeshStandardMaterial({
        color: 0x3f3f46,
        roughness: 0.3,
        metalness: 0.7,
      })
    );
    chipTextPlate.position.set(0, 0.145, 0);
    bgaMesh.add(chipTextPlate);

    // Golden Pin 1 dot
    const pin1Dot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.02, 16),
      leadMat
    );
    pin1Dot.position.set(-0.75, 0.14, -0.75);
    bgaMesh.add(pin1Dot);

    compGroup.add(bgaMesh);

    // 2. SOIC-16 Flash Memory with individual silver stamped leads
    const soicMesh = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.18, 0.9), icBodyMat);
    soicMesh.position.set(-2.5, 0.09, -1.6);
    for (let p = 0; p < 8; p++) {
      const zOff = -0.35 + p * 0.1;
      const lead1 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.05), leadMat);
      lead1.position.set(-0.85, -0.05, zOff);
      const lead2 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.05), leadMat);
      lead2.position.set(0.85, -0.05, zOff);
      soicMesh.add(lead1, lead2);
    }
    compGroup.add(soicMesh);

    // 3. Quartz Crystal Can
    const oscMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.26, 0.55),
      new THREE.MeshStandardMaterial({ color: 0xd4d4d8, roughness: 0.12, metalness: 0.96 })
    );
    oscMesh.position.set(-2.2, 0.13, 1.4);
    compGroup.add(oscMesh);

    // 4. USB Type-C Receptacle (Stamped stainless steel shell)
    const usbShell = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.55, 1.1),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.15, metalness: 0.95 })
    );
    usbShell.position.set(-dimX / 2 + 0.65, 0.28, 0);

    // USB internal tongue
    const usbTongue = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.08, 0.6),
      new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4 })
    );
    usbTongue.position.set(-0.45, 0, 0);
    usbShell.add(usbTongue);
    compGroup.add(usbShell);

    // 5. Pulsing Status LED
    const ledMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.12, 0.14),
      new THREE.MeshStandardMaterial({
        color: 0x10b981,
        emissive: 0x10b981,
        emissiveIntensity: 1.4,
        roughness: 0.2,
      })
    );
    ledMesh.position.set(2.8, 0.06, 1.8);
    compGroup.add(ledMesh);

    // 6. Chip Passives (Two-tone Ceramic Capacitors & Black Resistors)
    const capBodyMat = new THREE.MeshStandardMaterial({ color: 0xb48b61, roughness: 0.35 });
    const capTermMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.15, metalness: 0.9 });
    const resBodyMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.3 });

    for (let i = 0; i < 9; i++) {
      const isCap = i % 2 === 0;
      const partGroup = new THREE.Group();
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.1, 0.18),
        isCap ? capBodyMat : resBodyMat
      );
      const t1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.102, 0.182), capTermMat);
      t1.position.x = -0.12;
      const t2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.102, 0.182), capTermMat);
      t2.position.x = 0.12;
      partGroup.add(body, t1, t2);
      partGroup.position.set(0.9 + (i % 3) * 0.5, 0.05, -1.2 + Math.floor(i / 3) * 0.45);
      compGroup.add(partGroup);
    }

    // 7. Tactile Push-Button Microswitch (SW1)
    const switchBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.22, 0.7),
      new THREE.MeshStandardMaterial({ color: 0xd4d4d8, roughness: 0.2, metalness: 0.85 })
    );
    const switchButton = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.1, 16),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3 })
    );
    switchButton.position.y = 0.14;
    switchBase.add(switchButton);
    switchBase.position.set(2.4, 0.11, -1.8);
    compGroup.add(switchBase);

    // 8. 3D Gold Fingers Along Edge if requested
    const edgeFingersGroup = new THREE.Group();
    edgeFingersRef.current = edgeFingersGroup;
    edgeFingersGroup.visible = edgeConnector === "Yes";
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.15,
      metalness: 0.98,
    });
    for (let f = 0; f < 18; f++) {
      const finger = new THREE.Mesh(new THREE.BoxGeometry(0.12, dimY + 0.02, 0.45), goldMat);
      finger.position.set(-2.5 + f * 0.3, 0, dimZ / 2 - 0.22);
      edgeFingersGroup.add(finger);
    }
    boardGroup.add(edgeFingersGroup);

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Pulsing LED glow
      ledMesh.material.emissiveIntensity = 0.8 + Math.sin(elapsed * 6) * 0.7;

      if (autoRotate && !isDragging.current) {
        rotTarget.current.y += delta * 0.42;
      }

      currentRot.current.x += (rotTarget.current.x - currentRot.current.x) * 0.09;
      currentRot.current.y += (rotTarget.current.y - currentRot.current.y) * 0.09;
      currentZoom.current += (zoomTarget.current - currentZoom.current) * 0.1;

      if (boardGroupRef.current) {
        boardGroupRef.current.rotation.x = currentRot.current.x;
        boardGroupRef.current.rotation.y = currentRot.current.y;
      }

      if (cameraRef.current) {
        cameraRef.current.position.z = currentZoom.current;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const mount = isExpanded ? fullscreenMountRef.current : mountRef.current;
      if (!mount || !rendererRef.current || !cameraRef.current) return;
      const newW = mount.clientWidth;
      const newH = mount.clientHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      boardGeo.dispose();
      topMat.dispose();
      bottomMat.dispose();
      edgeMat.dispose();
      initialTopTexture.dispose();
      initialBottomTexture.dispose();
      initialEdgeTexture.dispose();
    };
  }, [isExpanded]);

  // 2. LIVE REACTIVE CONFIGURATION UPDATER:
  useEffect(() => {
    if (
      !boardMeshRef.current ||
      !topMaterialRef.current ||
      !bottomMaterialRef.current ||
      !edgeMaterialRef.current
    )
      return;

    // Trigger synced visual badge
    setSyncedBadgeText(`${solderMask} • ${thicknessNum}mm • ${layers}`);
    const timer = setTimeout(() => setSyncedBadgeText(null), 1800);

    const maskCfg = SOLDER_MASK_PALETTE[solderMask] || SOLDER_MASK_PALETTE.Green;

    // A. Re-generate Top Texture with new Solder Mask, Silkscreen, Pads, and Dimensions
    const updatedTopTexture = createTopPcbTexture(
      solderMask,
      silkscreen,
      surfaceFinish,
      lengthNum,
      widthNum,
      layers,
      material,
      edgeConnector,
      castellatedHoles,
      isXRay
    );

    const updatedBottomTexture = createBottomPcbTexture(
      solderMask,
      silkscreen,
      surfaceFinish,
      material,
      isXRay
    );

    const updatedEdgeTexture = createEdgeTexture(layers);

    // B. Apply Shaders & Sheen
    if (isXRay) {
      topMaterialRef.current.color.setHex(0x00f0ff);
      topMaterialRef.current.transparent = true;
      topMaterialRef.current.opacity = 0.75;
      topMaterialRef.current.roughness = 0.12;
      topMaterialRef.current.metalness = 0.4;
    } else {
      topMaterialRef.current.color.setHex(0xffffff);
      topMaterialRef.current.transparent = false;
      topMaterialRef.current.opacity = 1.0;
      topMaterialRef.current.roughness = maskCfg.isMatte ? 0.55 : 0.22;
      topMaterialRef.current.clearcoat = maskCfg.isMatte ? 0.05 : 0.6;
    }

    topMaterialRef.current.map = updatedTopTexture;
    topMaterialRef.current.needsUpdate = true;

    bottomMaterialRef.current.map = updatedBottomTexture;
    bottomMaterialRef.current.needsUpdate = true;

    edgeMaterialRef.current.map = updatedEdgeTexture;
    edgeMaterialRef.current.needsUpdate = true;

    // C. Pad Lead Materials (ENIG Gold vs Silver vs OSP)
    padMaterialsRef.current.forEach((mat) => {
      mat.color.setHex(isGold ? 0xf59e0b : 0xe2e8f0);
      mat.metalness = 0.95;
      mat.roughness = isGold ? 0.15 : 0.12;
      mat.needsUpdate = true;
    });

    // D. Re-create Board Geometry with Live Scaled Dimensions
    boardMeshRef.current.geometry.dispose();
    boardMeshRef.current.geometry = new THREE.BoxGeometry(dimX, dimY, dimZ);

    // E. Dynamic SMT Components Elevation & Exploded View Offset
    if (compGroupRef.current) {
      const explodedY = isExploded ? 1.4 : 0.0;
      compGroupRef.current.position.y = dimY / 2 + explodedY;
      compGroupRef.current.visible = !isXRay;
    }

    // F. Edge Connectors Visibility & Placement
    if (edgeFingersRef.current) {
      edgeFingersRef.current.visible = edgeConnector === "Yes";
      edgeFingersRef.current.position.set(0, 0, dimZ / 2 - 0.22);
    }

    return () => clearTimeout(timer);
  }, [
    solderMask,
    silkscreen,
    surfaceFinish,
    layers,
    material,
    lengthNum,
    widthNum,
    thicknessNum,
    edgeConnector,
    castellatedHoles,
    isXRay,
    isExploded,
    dimX,
    dimY,
    dimZ,
    isGold,
    isDark,
  ]);

  // 3. Theme Light Adjustment
  useEffect(() => {
    if (
      !ambientLightRef.current ||
      !keyLightRef.current ||
      !rimLightRef.current ||
      !fillLightRef.current
    )
      return;
    if (isDark) {
      ambientLightRef.current.intensity = 0.95;
      keyLightRef.current.intensity = 2.0;
      fillLightRef.current.intensity = 1.25;
      rimLightRef.current.intensity = 1.6;
      rimLightRef.current.color.setHex(0x10b981);
    } else {
      ambientLightRef.current.intensity = 1.45;
      keyLightRef.current.intensity = 2.3;
      fillLightRef.current.intensity = 1.15;
      rimLightRef.current.intensity = 1.0;
      rimLightRef.current.color.setHex(0x059669);
    }
  }, [isDark]);

  // Touch & Mouse Drag handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    prevPointer.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - prevPointer.current.x;
    const deltaY = e.clientY - prevPointer.current.y;

    rotTarget.current.y += deltaX * 0.008;
    rotTarget.current.x = Math.max(-3.14, Math.min(3.14, rotTarget.current.x + deltaY * 0.008));
    prevPointer.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    zoomTarget.current = Math.max(8.5, Math.min(24, zoomTarget.current + e.deltaY * 0.008));
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. NORMAL SIDEBAR / EMBEDDED CARD VIEW                                    */}
      {/* ========================================================================= */}
      <div
        className={`rounded-2xl border border-gray-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md overflow-hidden relative ${className}`}
      >
        {/* Header Strip */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-slate-800 bg-gray-50/90 dark:bg-slate-900/80">
          <div className="flex items-center gap-1.5 min-w-0">
            <Box className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-black text-xs text-gray-900 dark:text-white truncate">
              Interactive 3D PCB
            </span>

            {/* Synced Badge */}
            {syncedBadgeText ? (
              <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider bg-emerald-500 text-white rounded-full px-1.5 py-0.5 animate-in zoom-in-50 duration-150 shrink-0">
                <Check className="size-2.5 stroke-[3]" />
                Synced
              </span>
            ) : (
              <span className="text-[10px] font-mono font-bold bg-emerald-100/70 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 rounded px-1.5 py-0.5 border border-emerald-200 dark:border-emerald-800 shrink-0">
                {layers}
              </span>
            )}
          </div>

          {/* Quick Action Toolbar with Prominent Fullscreen Button */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setAutoRotate((prev) => !prev)}
              title={autoRotate ? "Pause Turntable" : "Play Turntable"}
              className={`flex size-6 items-center justify-center rounded-md text-xs transition cursor-pointer ${
                autoRotate
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "hover:bg-gray-200 dark:hover:bg-slate-800 text-gray-500 dark:text-slate-400"
              }`}
            >
              <RotateCw className="size-3" />
            </button>

            <button
              type="button"
              onClick={handleFlip}
              title={isFlipped ? "Flip to Top Side" : "Flip to Bottom Side"}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 hover:text-emerald-700 transition cursor-pointer"
            >
              <FlipHorizontal2 className="size-3" />
              <span>{isFlipped ? "Bottom" : "Top"}</span>
            </button>

            {/* Prominent Fullscreen Button */}
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              title="Expand Fullscreen CAD Inspector"
              className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition active:scale-95 cursor-pointer"
            >
              <Maximize2 className="size-3 stroke-[2.5]" />
              <span>Fullscreen</span>
            </button>
          </div>
        </div>

        {/* Main 3D Canvas Viewport */}
        <div className="relative w-full h-[260px] sm:h-[280px] bg-gradient-to-b from-gray-50/80 via-slate-50/50 to-gray-100/90 dark:from-slate-950 dark:via-slate-900/90 dark:to-slate-950 overflow-hidden select-none">
          {/* Top Left Live Spec Badges */}
          <div className="absolute top-2 left-2 z-10 flex flex-wrap items-center gap-1 max-w-[70%] pointer-events-none">
            <span className="flex items-center gap-1 rounded-md bg-white/95 dark:bg-slate-900/90 backdrop-blur-md px-1.5 py-0.5 text-[10px] font-bold text-gray-800 dark:text-slate-200 border border-gray-200/90 dark:border-slate-800 shadow-2xs">
              <span
                className="size-2 rounded-full ring-1 ring-black/10 dark:ring-white/20"
                style={{ backgroundColor: SOLDER_MASK_PALETTE[solderMask]?.bgHex || "#15803d" }}
              />
              <span>{solderMask}</span>
            </span>

            <span className="rounded-md bg-white/95 dark:bg-slate-900/90 backdrop-blur-md px-1.5 py-0.5 text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 border border-gray-200/90 dark:border-slate-800 shadow-2xs">
              {lengthNum}×{widthNum}mm
            </span>

            <span className="rounded-md bg-white/95 dark:bg-slate-900/90 backdrop-blur-md px-1.5 py-0.5 text-[10px] font-bold text-gray-600 dark:text-slate-300 border border-gray-200/90 dark:border-slate-800 shadow-2xs">
              {thicknessNum}mm
            </span>
          </div>

          {/* Top Right Aspect / Area HUD */}
          <div className="absolute top-2 right-2 z-10 pointer-events-none flex flex-col items-end gap-1">
            <span className="bg-white/90 dark:bg-slate-900/90 px-1.5 py-0.5 rounded font-mono text-[9px] text-gray-600 dark:text-slate-400 border border-gray-200/60 dark:border-slate-800/60 shadow-2xs">
              Aspect: {(lengthNum / widthNum).toFixed(2)}:1
            </span>
          </div>

          {/* Three.js Canvas Container */}
          <div
            ref={mountRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onWheel={handleWheel}
            className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none"
          />

          {/* Floating Expand Button in Viewport */}
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/85 hover:bg-slate-900 text-white text-[11px] font-bold backdrop-blur-md shadow-md border border-slate-700/60 transition active:scale-95 cursor-pointer"
          >
            <Expand className="size-3 text-emerald-400" />
            <span>Expand 3D</span>
          </button>

          {/* Bottom Left Specs Summary */}
          <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1.5 text-[9px] text-gray-500 dark:text-slate-400 pointer-events-none">
            <span className="flex items-center gap-1 bg-white/85 dark:bg-slate-900/85 px-1.5 py-0.5 rounded backdrop-blur-sm border border-gray-200/60 dark:border-slate-800/60 font-mono">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{surfaceFinish}</span>
              {edgeConnector === "Yes" && <span className="text-amber-500">• Gold Fingers</span>}
              {castellatedHoles === "Yes" && <span className="text-emerald-500">• Castellated</span>}
            </span>
          </div>
        </div>

        {/* Sub-toolbar: X-Ray, Explode, Reset */}
        <div className="px-3 py-2 border-t border-gray-100 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-900/70 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsXRay((prev) => !prev)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                isXRay
                  ? "bg-cyan-600 text-white shadow-xs"
                  : "bg-gray-200/70 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-300"
              }`}
            >
              <Eye className="size-2.5" />
              <span>X-Ray</span>
            </button>

            <button
              type="button"
              onClick={() => setIsExploded((prev) => !prev)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                isExploded
                  ? "bg-amber-600 text-white shadow-xs"
                  : "bg-gray-200/70 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-300"
              }`}
            >
              <Layers3 className="size-2.5" />
              <span>Explode</span>
            </button>

            <button
              type="button"
              onClick={handleResetAngle}
              title="Reset 3D Angle"
              className="flex size-5.5 items-center justify-center rounded text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-800 cursor-pointer"
            >
              <RotateCcw className="size-2.5" />
            </button>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-gray-500 dark:text-slate-400 font-medium pr-14 sm:pr-0">
            <Sparkles className="size-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="truncate">{material} CAM</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DEDICATED FULLSCREEN CAD WORKSTATION MODAL                            */}
      {/* ========================================================================= */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white animate-in fade-in duration-200 select-none">
          {/* Workstation Top Navigation Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-md">
                  <Box className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-wide flex items-center gap-2">
                    <span>FEITIAN 3D CAM/CAD PCB INSPECTOR</span>
                    <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                      LIVE ENGINE
                    </span>
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400">
                    {lengthNum}×{widthNum}mm • {layers} • {thicknessNum}mm • {surfaceFinish} • {solderMask}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Camera Presets & Tools */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setCameraView("iso")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    cameraPreset === "iso" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Isometric
                </button>
                <button
                  type="button"
                  onClick={() => setCameraView("top")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    cameraPreset === "top" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Top (0°)
                </button>
                <button
                  type="button"
                  onClick={() => setCameraView("bottom")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    cameraPreset === "bottom" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Bottom (180°)
                </button>
                <button
                  type="button"
                  onClick={() => setCameraView("side")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    cameraPreset === "side" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Side Profile
                </button>
              </div>

              {/* Mode Toggles */}
              <button
                type="button"
                onClick={() => setIsXRay((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  isXRay
                    ? "bg-cyan-600 text-white border-cyan-500 shadow-md shadow-cyan-600/30"
                    : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <Eye className="size-3.5" />
                <span>X-Ray Traces</span>
              </button>

              <button
                type="button"
                onClick={() => setIsExploded((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  isExploded
                    ? "bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-600/30"
                    : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <Layers3 className="size-3.5" />
                <span>Explode SMT</span>
              </button>

              <button
                type="button"
                onClick={() => setAutoRotate((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  autoRotate
                    ? "bg-emerald-600 text-white border-emerald-500"
                    : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                }`}
              >
                <RotateCw className="size-3.5" />
                <span>Turntable</span>
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/40 text-xs font-black transition cursor-pointer active:scale-95 ml-2"
              >
                <X className="size-4" />
                <span>Close (Esc)</span>
              </button>
            </div>
          </div>

          {/* Fullscreen Main 3D Viewport */}
          <div className="relative flex-1 min-h-0 bg-radial from-slate-900 via-slate-950 to-black overflow-hidden">
            {/* Real-Time Floating Caliper HUD */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 backdrop-blur-xl shadow-xl space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-black text-emerald-400 uppercase tracking-wider">
                  <Compass className="size-3.5" />
                  <span>Precision CAD Dimensions</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-slate-800/80 px-2 py-1 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">LENGTH (X):</span>
                    <span className="text-white font-bold">{lengthNum.toFixed(1)} mm</span>
                  </div>
                  <div className="bg-slate-800/80 px-2 py-1 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">WIDTH (Y):</span>
                    <span className="text-white font-bold">{widthNum.toFixed(1)} mm</span>
                  </div>
                  <div className="bg-slate-800/80 px-2 py-1 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">THICKNESS (Z):</span>
                    <span className="text-white font-bold">{thicknessNum.toFixed(2)} mm</span>
                  </div>
                  <div className="bg-slate-800/80 px-2 py-1 rounded-lg">
                    <span className="text-slate-400 block text-[10px]">SURFACE AREA:</span>
                    <span className="text-emerald-400 font-bold">
                      {((lengthNum * widthNum) / 100).toFixed(1)} cm²
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Right Spec Breakdown Deck */}
            <div className="absolute top-4 right-4 z-10 hidden sm:flex flex-col gap-2 pointer-events-none">
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 backdrop-blur-xl shadow-xl space-y-1.5 w-56">
                <div className="flex items-center justify-between text-xs font-black text-emerald-400">
                  <span>FABRICATION STACK</span>
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="space-y-1 text-[11px] font-mono text-slate-300">
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">Layer Count:</span>
                    <span className="font-bold text-white">{layers}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">Solder Mask:</span>
                    <span className="font-bold text-white">{solderMask}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">Surface Finish:</span>
                    <span className="font-bold text-amber-400">{surfaceFinish}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">Substrate Base:</span>
                    <span className="font-bold text-white">{material}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-400">Finished Copper:</span>
                    <span className="font-bold text-white">{finishedCopper}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Via Process:</span>
                    <span className="font-bold text-white">{viaProcess}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Three.js Fullscreen Canvas Container */}
            <div
              ref={fullscreenMountRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onWheel={handleWheel}
              className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none"
            />

            {/* Bottom Interaction Guide */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              <div className="flex items-center gap-2 bg-slate-900/85 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 backdrop-blur-md">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>360° Drag Orbit • Wheel Zoom • Right-click Pan</span>
              </div>

              <div className="flex items-center gap-2 bg-slate-900/85 px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-mono text-slate-400 backdrop-blur-md">
                <span>Direct Wuping Feitian CAM Kernel v4.2</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
