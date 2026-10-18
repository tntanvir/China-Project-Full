"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import * as THREE from "three";
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Eye,
  Layers,
  Maximize2,
  Palette,
  RotateCcw,
  RotateCw,
  Sparkles,
  Zap,
  ZoomIn,
  ZoomOut,
  Info,
  Check,
  ShieldCheck,
  Microscope,
} from "lucide-react";

// Solder mask color presets with realistic PBR parameters
export interface SolderMaskColor {
  id: string;
  name: string;
  bgHex: string;
  threeColor: number;
  textColor: string;
  desc: string;
}

export const SOLDER_MASK_COLORS: SolderMaskColor[] = [
  {
    id: "green",
    name: "Classic Emerald",
    bgHex: "#0a5c36",
    threeColor: 0x0a5c36,
    textColor: "text-emerald-500",
    desc: "Standard IPC Class 2/3 industry finish, optimal contrast for automated optical inspection (AOI).",
  },
  {
    id: "black",
    name: "Matte Obsidian",
    bgHex: "#14161a",
    threeColor: 0x14161a,
    textColor: "text-slate-400",
    desc: "Premium consumer tech finish with non-reflective matte finish, ideal for light-sensitive sensors.",
  },
  {
    id: "blue",
    name: "Cobalt Royal",
    bgHex: "#0f4c81",
    threeColor: 0x0f4c81,
    textColor: "text-sky-500",
    desc: "High-contrast developer & Arduino-standard blue, excellent for prototyping and test points.",
  },
  {
    id: "red",
    name: "Crimson Signal",
    bgHex: "#8c1818",
    threeColor: 0x8c1818,
    textColor: "text-rose-500",
    desc: "Distinctive prototype and audio engineering finish for immediate field revision identification.",
  },
  {
    id: "white",
    name: "Silk White",
    bgHex: "#e2e5ea",
    threeColor: 0xe2e5ea,
    textColor: "text-gray-600",
    desc: "High-reflectivity substrate designed for high-lumen LED arrays and automotive lighting PCBs.",
  },
  {
    id: "purple",
    name: "Velvet Purple",
    bgHex: "#451a66",
    threeColor: 0x451a66,
    textColor: "text-purple-400",
    desc: "Specialty designer grade with ENIG gold highlights, favored by open-hardware labs.",
  },
];

// Interactive Inspection Hotspots
interface HotspotInfo {
  id: string;
  title: string;
  tag: string;
  position3D: [number, number, number];
  spec: string;
  details: string;
  tolerance: string;
}

const HOTSPOTS: HotspotInfo[] = [
  {
    id: "soc",
    title: "BGA 256-Ball SoC Package",
    tag: "High-Density SMT",
    position3D: [0, 0.45, 0],
    spec: "Pitch: 0.4mm • Ball Dia: 0.25mm",
    details: "Precision surface mount placement inspected via automated 3D X-Ray laminography to verify zero solder bridge defects.",
    tolerance: "Placement Accuracy ±15μm (Yamaha YRM20)",
  },
  {
    id: "enig",
    title: "ENIG Immersion Gold Edge Pads",
    tag: "Surface Finish",
    position3D: [-3.8, 0.25, 2.2],
    spec: "Gold (Au): 2-3 μin • Nickel (Ni): 120-200 μin",
    details: "Electroless Nickel Immersion Gold provides planar surface finish for fine-pitch QFNs, switches, and high-frequency contacts.",
    tolerance: "IPC-4552A Compliant • RoHS 3 Certified",
  },
  {
    id: "usbc",
    title: "High-Speed USB Type-C Receptacle",
    tag: "Through-Hole & SMT Hybrid",
    position3D: [4.4, 0.5, 0],
    spec: "24-Pin Differential Pair • 20Gbps Signal Integrity",
    details: "Mid-mount reinforced stainless steel housing with through-hole anchor legs withstands 10,000+ insertion cycles.",
    tolerance: "90Ω ± 10% Controlled Differential Impedance",
  },
  {
    id: "vias",
    title: "Microvia Array & Thermal Matrix",
    tag: "Drilling & Plating",
    position3D: [2.2, 0.22, 1.8],
    spec: "Hole Size: 0.15mm • Pad Dia: 0.35mm",
    details: "Laser microvias filled with conductive copper paste and capped with planar copper (VIPPO) for high-density BGA breakout.",
    tolerance: "Aspect Ratio up to 1:12 • IPC Class 3",
  },
  {
    id: "osc",
    title: "Ultra-Low Phase Noise TCXO Crystal",
    tag: "Timing Reference",
    position3D: [-2.1, 0.38, -1.6],
    spec: "24.000 MHz • Frequency Tol: ±10 ppm",
    details: "Hermetically sealed seam-weld ceramic package with shielded ground ring to eliminate clock jitter in high-speed digital buses.",
    tolerance: "Operating Temp: -40°C to +85°C Industrial",
  },
];

// Helper: Generates high-resolution procedural PCB textures (Copper, Silkscreen, Solder Mask)
function generatePcbCanvasTexture(
  colorHex: string,
  mode: "normal" | "bare" | "xray",
  surfaceFinish: "enig" | "hasl"
): THREE.CanvasTexture {
  if (typeof document === "undefined") {
    return new THREE.CanvasTexture({} as HTMLCanvasElement);
  }

  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1365;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const w = canvas.width;
  const h = canvas.height;

  // 1. Base Substrate / Solder Mask
  if (mode === "xray") {
    ctx.fillStyle = "#04141c";
    ctx.fillRect(0, 0, w, h);
  } else if (mode === "bare") {
    ctx.fillStyle = "#9c6832"; // Raw FR4 fiberglass laminate
    ctx.fillRect(0, 0, w, h);
  } else {
    ctx.fillStyle = colorHex;
    ctx.fillRect(0, 0, w, h);

    // Subtle fiberglass weave texture
    ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
    for (let x = 0; x < w; x += 8) {
      ctx.fillRect(x, 0, 4, h);
    }
    for (let y = 0; y < h; y += 8) {
      ctx.fillRect(0, y, w, 4);
    }
  }

  // Copper colors
  const copperColor =
    mode === "xray"
      ? "rgba(0, 240, 255, 0.85)"
      : surfaceFinish === "enig"
      ? "#e3b844"
      : "#cbd5e1";

  const traceColor =
    mode === "xray"
      ? "rgba(16, 185, 129, 0.75)"
      : mode === "bare"
      ? "#b45309"
      : "rgba(255, 255, 255, 0.08)";

  // 2. High-Tech Ground Planes & Copper Traces
  ctx.strokeStyle = traceColor;
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Bus Lines & 45-degree routing channels
  const drawBus = (startX: number, startY: number, endX: number, endY: number, count: number, spacing: number) => {
    for (let i = 0; i < count; i++) {
      const offset = (i - count / 2) * spacing;
      ctx.beginPath();
      ctx.moveTo(startX + offset, startY);
      const midY = startY + (endY - startY) * 0.45;
      const midX = startX + offset + (endX - startX) * 0.5;
      ctx.lineTo(midX, midY);
      ctx.lineTo(endX + offset, endY);
      ctx.stroke();
    }
  };

  ctx.lineWidth = 5;
  drawBus(w * 0.45, h * 0.5, w * 0.22, h * 0.25, 8, 14);
  drawBus(w * 0.55, h * 0.5, w * 0.8, h * 0.3, 10, 14);
  drawBus(w * 0.5, h * 0.55, w * 0.35, h * 0.8, 8, 14);
  drawBus(w * 0.55, h * 0.55, w * 0.82, h * 0.75, 12, 14);

  // Serpentine delay-tuning high-speed traces
  ctx.beginPath();
  let sx = w * 0.5;
  let sy = h * 0.38;
  ctx.moveTo(sx, sy);
  for (let j = 0; j < 6; j++) {
    sx += 30;
    sy += j % 2 === 0 ? -40 : 40;
    ctx.lineTo(sx, sy);
  }
  ctx.stroke();

  // 3. ENIG Gold / HASL Solder Pads & Test Points
  ctx.fillStyle = copperColor;
  ctx.strokeStyle = copperColor;

  // Peripheral Edge Connector Fingers (Left side)
  const fingerW = 28;
  const fingerH = 65;
  const fingerStartX = 60;
  for (let y = 140; y < h - 140; y += 45) {
    ctx.fillRect(fingerStartX, y, fingerW, fingerH);
    ctx.beginPath();
    ctx.arc(fingerStartX + fingerW + 20, y + fingerH / 2, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  // Microcontroller QFP/BGA pad array in center
  const bgaX = w * 0.5;
  const bgaY = h * 0.5;
  const bgaSize = 160;
  for (let bx = -bgaSize; bx <= bgaSize; bx += 20) {
    for (let by = -bgaSize; by <= bgaSize; by += 20) {
      if (Math.abs(bx) > bgaSize * 0.75 || Math.abs(by) > bgaSize * 0.75) {
        ctx.beginPath();
        ctx.arc(bgaX + bx, bgaY + by, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // SMT Component Footprints (Resistors, Capacitors, SOICs)
  const drawSmtPads = (x: number, y: number, padW: number, padH: number, gap: number) => {
    ctx.fillRect(x - gap / 2 - padW, y - padH / 2, padW, padH);
    ctx.fillRect(x + gap / 2, y - padH / 2, padW, padH);
  };

  const drawIcPadArray = (cx: number, cy: number, pins: number, pitch: number, padW: number, padH: number, span: number) => {
    const halfPins = pins / 2;
    for (let p = 0; p < halfPins; p++) {
      const py = cy - ((halfPins - 1) * pitch) / 2 + p * pitch;
      ctx.fillRect(cx - span / 2 - padW, py - padH / 2, padW, padH);
      ctx.fillRect(cx + span / 2, py - padH / 2, padW, padH);
    }
  };

  // Populate multiple SMT footprints
  drawIcPadArray(w * 0.28, h * 0.35, 16, 26, 30, 14, 110);
  drawIcPadArray(w * 0.72, h * 0.35, 8, 30, 32, 16, 90);
  drawIcPadArray(w * 0.3, h * 0.75, 8, 30, 32, 16, 90);

  // Scattered 0603/0805 passives
  for (let k = 0; k < 30; k++) {
    const px = w * 0.2 + ((k * 137) % (w * 0.6));
    const py = h * 0.15 + ((k * 243) % (h * 0.7));
    if (Math.hypot(px - bgaX, py - bgaY) > 220) {
      drawSmtPads(px, py, 18, 14, 16);
    }
  }

  // Via Arrays with golden annular rings and drilled center
  for (let v = 0; v < 90; v++) {
    const vx = 80 + ((v * 83) % (w - 160));
    const vy = 80 + ((v * 127) % (h - 160));
    ctx.beginPath();
    ctx.arc(vx, vy, 7, 0, Math.PI * 2);
    ctx.fillStyle = copperColor;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(vx, vy, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = "#111827"; // Drilled hole
    ctx.fill();
  }

  // 4. White Silkscreen Layer (Labels, Polarity, Logo, Reference Designators)
  if (mode !== "bare") {
    ctx.fillStyle = mode === "xray" ? "rgba(0, 240, 255, 0.7)" : "#ffffff";
    ctx.font = "bold 24px monospace";
    ctx.fillText("FEITIAN PCB", w * 0.5 - 90, h * 0.22);
    ctx.font = "bold 15px monospace";
    ctx.fillText("SMART FACTORY 2026 • REV 4.2", w * 0.5 - 130, h * 0.245);
    ctx.fillText("IPC-A-600 CLASS 3 • UL 94V-0", w * 0.5 - 120, h * 0.78);

    // Pin 1 indicators & component markings
    ctx.font = "bold 14px monospace";
    ctx.fillText("U1 (MCU)", bgaX - 40, bgaY + bgaSize + 30);
    ctx.fillText("U2", w * 0.28 - 12, h * 0.35 + 110);
    ctx.fillText("U3", w * 0.72 - 12, h * 0.35 + 90);
    ctx.fillText("J1 USB-C", w * 0.88, h * 0.5 + 8);
    ctx.fillText("VCC", 110, 110);
    ctx.fillText("GND", 110, h - 90);
    ctx.fillText("3.3V", w - 160, 110);
    ctx.fillText("TX/RX", w - 160, h - 90);

    // Corner alignment targets & fiducial crosshairs
    const drawFiducial = (fx: number, fy: number) => {
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(fx, fy, 16, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(fx - 24, fy);
      ctx.lineTo(fx + 24, fy);
      ctx.moveTo(fx, fy - 24);
      ctx.lineTo(fx, fy + 24);
      ctx.stroke();
    };

    drawFiducial(80, 80);
    drawFiducial(w - 80, 80);
    drawFiducial(80, h - 80);
    drawFiducial(w - 80, h - 80);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

export default function PcbModel3DViewer() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const boardGroupRef = useRef<THREE.Group | null>(null);
  const boardMeshRef = useRef<THREE.Mesh | null>(null);
  const pcbMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const ledMeshRef = useRef<THREE.Mesh | null>(null);
  const animFrameId = useRef<number | null>(null);

  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const fillLightRef = useRef<THREE.DirectionalLight | null>(null);
  const rimLightRef = useRef<THREE.DirectionalLight | null>(null);

  // Interactive UI states
  const [selectedColor, setSelectedColor] = useState<SolderMaskColor>(SOLDER_MASK_COLORS[0]);
  const [surfaceFinish, setSurfaceFinish] = useState<"enig" | "hasl">("enig");
  const [viewMode, setViewMode] = useState<"normal" | "bare" | "xray">("normal");
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [activeHotspot, setActiveHotspot] = useState<HotspotInfo | null>(HOTSPOTS[0]);
  const [canvasDimensions, setCanvasDimensions] = useState<{ width: number; height: number }>({
    width: 800,
    height: 520,
  });

  // Track dragging / orbit state with damping
  const isDragging = useRef(false);
  const prevPointer = useRef({ x: 0, y: 0 });
  const rotTarget = useRef({ x: 0.55, y: -0.45 });
  const currentRot = useRef({ x: 0.55, y: -0.45 });
  const zoomTarget = useRef(14.5);
  const currentZoom = useRef(14.5);

  // Dynamic Theme Light Adjuster
  useEffect(() => {
    if (!ambientLightRef.current || !keyLightRef.current || !rimLightRef.current || !fillLightRef.current) return;
    if (isDark) {
      ambientLightRef.current.intensity = 0.95;
      ambientLightRef.current.color.setHex(0xffffff);
      keyLightRef.current.intensity = 1.8;
      keyLightRef.current.color.setHex(0xfff7ed);
      fillLightRef.current.intensity = 1.2;
      rimLightRef.current.intensity = 1.4;
      rimLightRef.current.color.setHex(0x10b981);
    } else {
      ambientLightRef.current.intensity = 1.4;
      ambientLightRef.current.color.setHex(0xfffefb);
      keyLightRef.current.intensity = 2.0;
      keyLightRef.current.color.setHex(0xfff5ea);
      fillLightRef.current.intensity = 1.1;
      rimLightRef.current.intensity = 1.1;
      rimLightRef.current.color.setHex(0x059669);
    }
  }, [isDark]);

  // Initialize Three.js Scene, Lighting, and Procedural 3D Model
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;
    setCanvasDimensions({ width, height });

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, currentZoom.current);
    cameraRef.current = camera;

    // 3. WebGL Renderer with Anti-Aliasing
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // 4. Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.95 : 1.4);
    ambientLightRef.current = ambientLight;
    scene.add(ambientLight);

    // Key directional light with warm studio feel
    const keyLight = new THREE.DirectionalLight(0xfff7ed, isDark ? 1.8 : 2.0);
    keyLight.position.set(8, 12, 10);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLightRef.current = keyLight;
    scene.add(keyLight);

    // Fill light with cool high-tech contrast
    const fillLight = new THREE.DirectionalLight(0xe0f2fe, isDark ? 1.2 : 1.1);
    fillLight.position.set(-10, -5, 8);
    fillLightRef.current = fillLight;
    scene.add(fillLight);

    // Rim / Back light for crisp specular edges
    const rimLight = new THREE.DirectionalLight(isDark ? 0x10b981 : 0x059669, isDark ? 1.4 : 1.1);
    rimLight.position.set(0, 10, -12);
    rimLightRef.current = rimLight;
    scene.add(rimLight);

    // 5. Build 3D PCB Assembly
    const boardGroup = new THREE.Group();
    boardGroupRef.current = boardGroup;
    scene.add(boardGroup);

    // PCB Dimensions (Proportional 11 x 7.5 aspect)
    const pcbW = 10.5;
    const pcbH = 0.22;
    const pcbD = 7.0;

    // Base Board Substrate Geometry
    const boardGeo = new THREE.BoxGeometry(pcbW, pcbH, pcbD);
    const pcbTexture = generatePcbCanvasTexture(selectedColor.bgHex, viewMode, surfaceFinish);

    const pcbMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      map: pcbTexture,
      roughness: 0.28,
      metalness: 0.12,
      clearcoat: 0.45,
      clearcoatRoughness: 0.18,
      reflectivity: 0.6,
    });
    pcbMaterialRef.current = pcbMat;

    const boardMesh = new THREE.Mesh(boardGeo, pcbMat);
    boardMesh.castShadow = true;
    boardMesh.receiveShadow = true;
    boardMeshRef.current = boardMesh;
    boardGroup.add(boardMesh);

    // Components Container (Can be toggled in Bare board mode)
    const componentsGroup = new THREE.Group();
    componentsGroup.name = "componentsGroup";
    boardGroup.add(componentsGroup);

    // Helper: Component Materials
    const icBodyMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.35,
      metalness: 0.15,
    });

    const silverLeadMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.2,
      metalness: 0.95,
    });

    const goldPinMat = new THREE.MeshStandardMaterial({
      color: 0xeab308,
      roughness: 0.25,
      metalness: 0.9,
    });

    const ceramicCapMat = new THREE.MeshStandardMaterial({
      color: 0xb48b61,
      roughness: 0.4,
      metalness: 0.05,
    });

    const resistorMat = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      roughness: 0.3,
      metalness: 0.2,
    });

    // --- Component A: Main Central SoC (BGA Package) ---
    const bgaBaseGeo = new THREE.BoxGeometry(2.4, 0.22, 2.4);
    const bgaMesh = new THREE.Mesh(bgaBaseGeo, icBodyMat);
    bgaMesh.position.set(0, pcbH / 2 + 0.11, 0);

    // Metallic Heat Spreader Top Plate
    const heatSpreaderGeo = new THREE.BoxGeometry(1.9, 0.04, 1.9);
    const heatSpreaderMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.2,
      metalness: 0.85,
    });
    const heatSpreader = new THREE.Mesh(heatSpreaderGeo, heatSpreaderMat);
    heatSpreader.position.set(0, 0.12, 0);
    bgaMesh.add(heatSpreader);

    // Gold Pin 1 Dot
    const pin1Geo = new THREE.CylinderGeometry(0.06, 0.06, 0.02, 16);
    const pin1Mesh = new THREE.Mesh(pin1Geo, goldPinMat);
    pin1Mesh.position.set(-0.75, 0.15, -0.75);
    bgaMesh.add(pin1Mesh);

    componentsGroup.add(bgaMesh);

    // --- Component B: Flash Memory IC (SOP-16) ---
    const sopGeo = new THREE.BoxGeometry(1.6, 0.16, 0.9);
    const sopMesh = new THREE.Mesh(sopGeo, icBodyMat);
    sopMesh.position.set(-2.5, pcbH / 2 + 0.08, -1.8);

    // SOP Leads (8 on each side)
    for (let p = 0; p < 8; p++) {
      const zOffset = -0.35 + p * 0.1;
      const leadGeo = new THREE.BoxGeometry(0.18, 0.04, 0.05);
      const lead1 = new THREE.Mesh(leadGeo, silverLeadMat);
      lead1.position.set(-0.85, -0.04, zOffset);
      const lead2 = new THREE.Mesh(leadGeo, silverLeadMat);
      lead2.position.set(0.85, -0.04, zOffset);
      sopMesh.add(lead1, lead2);
    }
    componentsGroup.add(sopMesh);

    // --- Component C: Quartz Crystal Oscillator (Metallic Can) ---
    const oscGeo = new THREE.BoxGeometry(0.9, 0.25, 0.55);
    const oscMat = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      roughness: 0.1,
      metalness: 0.98,
    });
    const oscMesh = new THREE.Mesh(oscGeo, oscMat);
    oscMesh.position.set(-2.1, pcbH / 2 + 0.12, 1.4);
    componentsGroup.add(oscMesh);

    // --- Component D: USB Type-C Receptacle (Stainless Steel Shell) ---
    const usbShieldGeo = new THREE.BoxGeometry(1.4, 0.55, 1.1);
    const usbMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.25,
      metalness: 0.92,
    });
    const usbMesh = new THREE.Mesh(usbShieldGeo, usbMat);
    usbMesh.position.set(pcbW / 2 - 0.5, pcbH / 2 + 0.26, 0);

    // Internal tongue slot
    const tongueGeo = new THREE.BoxGeometry(0.8, 0.08, 0.5);
    const tongueMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });
    const tongue = new THREE.Mesh(tongueGeo, tongueMat);
    tongue.position.set(0.2, 0, 0);
    usbMesh.add(tongue);
    componentsGroup.add(usbMesh);

    // --- Component E: Gold Pin Headers (Dual Row 2x5) ---
    const headerBaseGeo = new THREE.BoxGeometry(0.5, 0.35, 1.8);
    const headerBase = new THREE.Mesh(headerBaseGeo, icBodyMat);
    headerBase.position.set(2.8, pcbH / 2 + 0.17, -1.8);

    const pinGeo = new THREE.BoxGeometry(0.06, 0.7, 0.06);
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 5; c++) {
        const pin = new THREE.Mesh(pinGeo, goldPinMat);
        pin.position.set(-0.12 + r * 0.24, 0.3, -0.6 + c * 0.3);
        headerBase.add(pin);
      }
    }
    componentsGroup.add(headerBase);

    // --- Component F: SMT Ceramic Capacitors & Resistors (Scattered arrays) ---
    const createCapacitor = (x: number, z: number, rotY = 0) => {
      const capGroup = new THREE.Group();
      capGroup.position.set(x, pcbH / 2 + 0.05, z);
      capGroup.rotation.y = rotY;

      const body = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 0.2), ceramicCapMat);
      const cap1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.13, 0.21), silverLeadMat);
      cap1.position.x = -0.15;
      const cap2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.13, 0.21), silverLeadMat);
      cap2.position.x = 0.15;

      capGroup.add(body, cap1, cap2);
      return capGroup;
    };

    const createResistor = (x: number, z: number, rotY = 0) => {
      const resGroup = new THREE.Group();
      resGroup.position.set(x, pcbH / 2 + 0.04, z);
      resGroup.rotation.y = rotY;

      const body = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.09, 0.16), resistorMat);
      const cap1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.17), silverLeadMat);
      cap1.position.x = -0.13;
      const cap2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.17), silverLeadMat);
      cap2.position.x = 0.13;

      resGroup.add(body, cap1, cap2);
      return resGroup;
    };

    // Place bypass capacitors around MCU
    componentsGroup.add(createCapacitor(1.4, 0.6, Math.PI / 2));
    componentsGroup.add(createCapacitor(1.4, -0.6, Math.PI / 2));
    componentsGroup.add(createCapacitor(-1.4, 0.6, Math.PI / 2));
    componentsGroup.add(createCapacitor(-1.4, -0.6, Math.PI / 2));
    componentsGroup.add(createCapacitor(0.6, 1.4));
    componentsGroup.add(createCapacitor(-0.6, 1.4));
    componentsGroup.add(createCapacitor(0.6, -1.4));
    componentsGroup.add(createCapacitor(-0.6, -1.4));

    // Place decoupling capacitors & pull-up resistors
    componentsGroup.add(createResistor(1.8, 1.8));
    componentsGroup.add(createResistor(2.2, 1.8));
    componentsGroup.add(createResistor(2.6, 1.8));
    componentsGroup.add(createCapacitor(1.8, 2.2));
    componentsGroup.add(createCapacitor(2.2, 2.2));

    // --- Component G: Pulsing Activity LED ---
    const ledGeo = new THREE.BoxGeometry(0.2, 0.12, 0.14);
    const ledMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 1.2,
      roughness: 0.2,
    });
    const ledMesh = new THREE.Mesh(ledGeo, ledMat);
    ledMesh.position.set(3.2, pcbH / 2 + 0.06, 2.2);
    ledMeshRef.current = ledMesh;
    componentsGroup.add(ledMesh);

    // 6. Animation Render Loop with Lerped Damping
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameId.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Pulsing LED brightness
      if (ledMeshRef.current) {
        const pulse = 0.8 + Math.sin(elapsed * 6) * 0.7;
        (ledMeshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = Math.max(0.2, pulse);
      }

      // Turntable Auto-rotation when not interacting
      if (autoRotate && !isDragging.current) {
        rotTarget.current.y += delta * 0.45;
      }

      // Smooth Lerping of Rotation and Zoom
      currentRot.current.x += (rotTarget.current.x - currentRot.current.x) * 0.08;
      currentRot.current.y += (rotTarget.current.y - currentRot.current.y) * 0.08;
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

    // 7. Window Resize Listener
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      setCanvasDimensions({ width: newW, height: newH });
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    // 8. Cleanup on Unmount
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      boardGeo.dispose();
      pcbMat.dispose();
      pcbTexture.dispose();
    };
  }, []);

  // Update PCB Materials & Shaders when Color, Mode, or Finish changes
  useEffect(() => {
    if (!pcbMaterialRef.current || !boardGroupRef.current) return;

    // Toggle Components visibility for Bare Board / X-Ray mode
    const compGroup = boardGroupRef.current.getObjectByName("componentsGroup");
    if (compGroup) {
      compGroup.visible = viewMode !== "bare";
    }

    const newTexture = generatePcbCanvasTexture(selectedColor.bgHex, viewMode, surfaceFinish);

    if (viewMode === "xray") {
      pcbMaterialRef.current.color.setHex(0x061e29);
      pcbMaterialRef.current.map = newTexture;
      pcbMaterialRef.current.transparent = true;
      pcbMaterialRef.current.opacity = 0.88;
      pcbMaterialRef.current.roughness = 0.15;
      pcbMaterialRef.current.metalness = 0.2;
    } else if (viewMode === "bare") {
      pcbMaterialRef.current.color.setHex(0xb4783a);
      pcbMaterialRef.current.map = newTexture;
      pcbMaterialRef.current.transparent = false;
      pcbMaterialRef.current.opacity = 1.0;
      pcbMaterialRef.current.roughness = 0.45;
      pcbMaterialRef.current.metalness = 0.05;
    } else {
      pcbMaterialRef.current.color.setHex(0xffffff);
      pcbMaterialRef.current.map = newTexture;
      pcbMaterialRef.current.transparent = false;
      pcbMaterialRef.current.opacity = 1.0;
      pcbMaterialRef.current.roughness = selectedColor.id === "black" ? 0.48 : 0.28;
      pcbMaterialRef.current.metalness = 0.12;
      pcbMaterialRef.current.clearcoat = selectedColor.id === "black" ? 0.1 : 0.45;
    }

    pcbMaterialRef.current.needsUpdate = true;
  }, [selectedColor, viewMode, surfaceFinish]);

  // Orbit / Touch Interaction Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    prevPointer.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - prevPointer.current.x;
    const deltaY = e.clientY - prevPointer.current.y;

    rotTarget.current.y += deltaX * 0.007;
    rotTarget.current.x = Math.max(-1.1, Math.min(1.1, rotTarget.current.x + deltaY * 0.007));

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
    zoomTarget.current = Math.max(9, Math.min(22, zoomTarget.current + e.deltaY * 0.008));
  };

  const resetView = () => {
    rotTarget.current = { x: 0.55, y: -0.45 };
    zoomTarget.current = 14.5;
  };

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-white dark:bg-slate-950 text-gray-900 dark:text-white border-y border-gray-200 dark:border-slate-800 transition-colors duration-300">
      
      {/* Background Tech Grid & Glow Accents */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(16,185,129,0.06),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_25%,rgba(16,185,129,0.12),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:3rem_3rem]" />

      <div className="relative mx-auto max-w-[1360px] px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-gray-200 dark:border-slate-800/80 pb-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-50 dark:bg-emerald-950/60 px-3.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 backdrop-blur-md shadow-2xs">
              <Sparkles className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Real-Time WebGL 3D Inspector</span>
            </div>
            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
              Interactive 3D PCB & Multi-Layer Explorer
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-gray-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Rotate, inspect, and customize high-speed PCB fabrication layers in real-time. Switch solder mask colors, examine BGA pitch tolerances, and test surface finish specs.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/pcb-quote"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-emerald-600/25 hover:from-emerald-500 hover:to-teal-500 transition active:scale-95"
            >
              <Zap className="size-3.5 fill-current" />
              <span>Quote This Spec ($5 Start)</span>
            </Link>
          </div>
        </div>

        {/* 3D Visualizer Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Main 3D Canvas Viewport (8 Columns) */}
          <div className="lg:col-span-8 flex flex-col justify-between rounded-3xl border border-gray-200/90 dark:border-slate-800 bg-gradient-to-b from-gray-50/90 via-slate-50/70 to-gray-100/90 dark:from-slate-900/80 dark:via-slate-900/70 dark:to-slate-950/80 backdrop-blur-xl shadow-lg dark:shadow-2xl relative overflow-hidden group">
            
            {/* Top Toolbar Overlay */}
            <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-center justify-between gap-2 pointer-events-auto">
              
              {/* Active Color Badge */}
              <div className="flex items-center gap-2 rounded-xl bg-white/95 dark:bg-slate-950/80 backdrop-blur-md border border-gray-200/90 dark:border-slate-800/90 px-3 py-1.5 text-xs shadow-xs">
                <span
                  className="size-3 rounded-full ring-2 ring-black/10 dark:ring-white/20"
                  style={{ backgroundColor: selectedColor.bgHex }}
                />
                <span className="font-bold text-gray-800 dark:text-slate-200">{selectedColor.name}</span>
                <span className="text-[10px] text-gray-400 dark:text-slate-500 font-mono hidden sm:inline">
                  {surfaceFinish.toUpperCase()}
                </span>
              </div>

              {/* View Control Buttons */}
              <div className="flex items-center gap-1.5 rounded-xl bg-white/95 dark:bg-slate-950/80 backdrop-blur-md border border-gray-200/90 dark:border-slate-800/90 p-1 text-gray-700 dark:text-slate-300 shadow-xs">
                <button
                  type="button"
                  onClick={() => setAutoRotate((prev) => !prev)}
                  className={`flex size-7.5 items-center justify-center rounded-lg text-xs font-bold transition cursor-pointer ${
                    autoRotate
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-400"
                  }`}
                  title={autoRotate ? "Pause Turntable" : "Play Turntable"}
                >
                  <RotateCw className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={resetView}
                  className="flex size-7.5 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition cursor-pointer"
                  title="Reset 3D Angle"
                >
                  <RotateCcw className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    zoomTarget.current = Math.max(9, zoomTarget.current - 2);
                  }}
                  className="flex size-7.5 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    zoomTarget.current = Math.min(22, zoomTarget.current + 2);
                  }}
                  className="flex size-7.5 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Three.js Interactive Canvas Container */}
            <div
              ref={mountRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onWheel={handleWheel}
              className="relative h-[420px] sm:h-[480px] w-full cursor-grab active:cursor-grabbing touch-none select-none"
            />

            {/* Bottom Interaction Guide */}
            <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              <span className="flex items-center gap-1.5 rounded-lg bg-white/80 dark:bg-slate-950/70 backdrop-blur-sm px-2.5 py-1 text-[11px] font-medium text-gray-600 dark:text-slate-400 border border-gray-200/80 dark:border-slate-800/60 shadow-2xs">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Drag to rotate 360° • Scroll to zoom
              </span>
              <span className="text-[10px] font-mono text-gray-500 dark:text-slate-500 bg-white/80 dark:bg-slate-950/70 backdrop-blur-sm px-2 py-0.5 rounded border border-gray-200/80 dark:border-slate-800/60 shadow-2xs">
                Direct Wuping CAD/CAM Kernel
              </span>
            </div>

          </div>

          {/* Configuration & Engineering Spec Sidebar (4 Columns) */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-4">
            
            {/* 1. Solder Mask Color Switcher */}
            <div className="rounded-2xl border border-gray-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/80 p-4.5 backdrop-blur-xl shadow-xs dark:shadow-none">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider text-gray-800 dark:text-slate-300 flex items-center gap-1.5">
                  <Palette className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  Solder Mask Finish
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                  {selectedColor.name}
                </span>
              </div>

              <div className="grid grid-cols-6 gap-2">
                {SOLDER_MASK_COLORS.map((color) => {
                  const isSelected = selectedColor.id === color.id;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      title={`${color.name} - ${color.desc}`}
                      className={`relative flex h-10 w-full items-center justify-center rounded-xl transition-all cursor-pointer shadow-2xs ${
                        isSelected
                          ? "ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900 scale-105 shadow-md"
                          : "opacity-80 hover:opacity-100 hover:scale-102 border border-black/10 dark:border-white/10"
                      }`}
                      style={{ backgroundColor: color.bgHex }}
                    >
                      {isSelected && (
                        <Check className="size-4 text-white drop-shadow-md stroke-[3]" />
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2.5 text-[11px] text-gray-500 dark:text-slate-400 leading-tight">
                {selectedColor.desc}
              </p>
            </div>

            {/* 2. Layer & Finish Modes */}
            <div className="rounded-2xl border border-gray-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/80 p-4.5 backdrop-blur-xl shadow-xs dark:shadow-none">
              <span className="text-xs font-black uppercase tracking-wider text-gray-800 dark:text-slate-300 flex items-center gap-1.5 mb-2.5">
                <Layers className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                Inspection Layer Mode
              </span>

              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: "normal", label: "Full PCBA", desc: "Board + SMT parts" },
                  { id: "bare", label: "Bare PCB", desc: "FR4 + Copper" },
                  { id: "xray", label: "X-Ray Layer", desc: "Inner Signal Bus" },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setViewMode(mode.id as "normal" | "bare" | "xray")}
                    className={`rounded-xl py-2 px-1 text-center transition cursor-pointer ${
                      viewMode === mode.id
                        ? "bg-emerald-600 text-white font-black shadow-xs"
                        : "bg-gray-100 hover:bg-gray-200/70 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-300 text-xs font-bold"
                    }`}
                  >
                    <div className="text-xs">{mode.label}</div>
                  </button>
                ))}
              </div>

              {/* Surface Finish Option */}
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-500 dark:text-slate-400">Surface Finish:</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setSurfaceFinish("enig")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                      surfaceFinish === "enig"
                        ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                        : "text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    ENIG Gold
                  </button>
                  <button
                    type="button"
                    onClick={() => setSurfaceFinish("hasl")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                      surfaceFinish === "hasl"
                        ? "bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white border border-gray-300 dark:border-slate-600"
                        : "text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    HASL Lead-Free
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Interactive Hotspot Spec Card */}
            <div className="rounded-2xl border border-gray-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/80 p-4.5 backdrop-blur-xl shadow-xs dark:shadow-none flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase tracking-wider text-gray-800 dark:text-slate-300 flex items-center gap-1.5">
                    <Microscope className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    Feature Highlight
                  </span>
                  <span className="rounded bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 text-[9px] font-bold text-emerald-700 dark:text-emerald-400">
                    {activeHotspot?.tag}
                  </span>
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-1 mb-2 scrollbar-none">
                  {HOTSPOTS.map((h, i) => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => setActiveHotspot(h)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold shrink-0 transition cursor-pointer ${
                        activeHotspot?.id === h.id
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-gray-200 dark:hover:text-slate-200"
                      }`}
                    >
                      P0{i + 1}
                    </button>
                  ))}
                </div>

                {activeHotspot && (
                  <div className="mt-2 space-y-1.5">
                    <h4 className="text-sm font-black text-gray-900 dark:text-white leading-tight">
                      {activeHotspot.title}
                    </h4>
                    <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {activeHotspot.spec}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
                      {activeHotspot.details}
                    </p>
                    <div className="pt-2 mt-2 border-t border-gray-100 dark:border-slate-800 text-[10px] text-gray-500 dark:text-slate-400 font-mono flex items-center gap-1">
                      <ShieldCheck className="size-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{activeHotspot.tolerance}</span>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/pcb-quote"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 text-xs font-black text-white shadow-md shadow-emerald-600/20 transition active:scale-95"
              >
                <span>Calculate PCB Price for this Spec</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

          </div>

        </div>

        {/* 4 Bottom Micro-Metrics Strip */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-2xl border border-gray-200/90 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 p-3.5 flex items-center gap-3 shadow-xs dark:shadow-none">
            <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Cpu className="size-4" />
            </span>
            <div>
              <div className="text-sm font-black text-gray-900 dark:text-white">1 - 32 Layers</div>
              <div className="text-[10px] text-gray-500 dark:text-slate-400">Rigid, Flex & Metal Core</div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200/90 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 p-3.5 flex items-center gap-3 shadow-xs dark:shadow-none">
            <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Microscope className="size-4" />
            </span>
            <div>
              <div className="text-sm font-black text-gray-900 dark:text-white">3/3 mil Trace</div>
              <div className="text-[10px] text-gray-500 dark:text-slate-400">Laser Direct Imaging (LDI)</div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200/90 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 p-3.5 flex items-center gap-3 shadow-xs dark:shadow-none">
            <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="size-4" />
            </span>
            <div>
              <div className="text-sm font-black text-white">±5% Impedance</div>
              <div className="text-[10px] text-gray-500 dark:text-slate-400">Polar Si9000 Verified</div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200/90 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 p-3.5 flex items-center gap-3 shadow-xs dark:shadow-none">
            <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <Zap className="size-4" />
            </span>
            <div>
              <div className="text-sm font-black text-white">24H Quick Turn</div>
              <div className="text-[10px] text-gray-500 dark:text-slate-400">Rapid Prototype Dispatch</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
