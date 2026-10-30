"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import * as THREE from "three";
import {
  RotateCw,
  ZoomIn,
  ZoomOut,
  Layers,
  Sparkles,
  Cpu,
  ShieldCheck,
  Check,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

export interface SolderColor {
  id: string;
  name: string;
  hex: string;
  threeColor: number;
}

const COLOR_PRESETS: SolderColor[] = [
  { id: "green", name: "Emerald", hex: "#0a5c36", threeColor: 0x0a5c36 },
  { id: "black", name: "Obsidian", hex: "#16181d", threeColor: 0x16181d },
  { id: "blue", name: "Cobalt", hex: "#0e4b82", threeColor: 0x0e4b82 },
  { id: "purple", name: "Purple", hex: "#4a1c6d", threeColor: 0x4a1c6d },
  { id: "white", name: "White", hex: "#e5e7eb", threeColor: 0xe5e7eb },
];

function generateTexture(colorHex: string, mode: "assembled" | "bare" | "xray"): THREE.CanvasTexture {
  if (typeof document === "undefined") {
    return new THREE.CanvasTexture({} as HTMLCanvasElement);
  }
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 680;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const w = canvas.width;
  const h = canvas.height;

  // Background
  if (mode === "xray") {
    ctx.fillStyle = "#020f17";
    ctx.fillRect(0, 0, w, h);
  } else if (mode === "bare") {
    ctx.fillStyle = "#a87138"; // FR4 Fiberglass
    ctx.fillRect(0, 0, w, h);
  } else {
    ctx.fillStyle = colorHex;
    ctx.fillRect(0, 0, w, h);
  }

  // Fiberglass weave
  ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
  for (let x = 0; x < w; x += 10) ctx.fillRect(x, 0, 5, h);
  for (let y = 0; y < h; y += 10) ctx.fillRect(0, y, w, 5);

  // Copper / Gold Traces
  ctx.strokeStyle = mode === "xray" ? "rgba(34, 211, 238, 0.85)" : "#e6b450";
  ctx.lineWidth = mode === "xray" ? 3 : 2;
  ctx.shadowColor = mode === "xray" ? "#06b6d4" : "rgba(0,0,0,0.4)";
  ctx.shadowBlur = mode === "xray" ? 6 : 2;

  // Circuit Bus Lines
  for (let i = 0; i < 9; i++) {
    ctx.beginPath();
    const y = 80 + i * 55;
    ctx.moveTo(60, y);
    ctx.lineTo(340, y);
    ctx.lineTo(440, y + (i % 2 === 0 ? 30 : -30));
    ctx.lineTo(680, y + (i % 2 === 0 ? 30 : -30));
    ctx.lineTo(760, y);
    ctx.lineTo(960, y);
    ctx.stroke();
  }

  // Silkscreen Text & Markings
  ctx.shadowBlur = 0;
  ctx.fillStyle = mode === "xray" ? "#22d3ee" : "#ffffff";
  ctx.font = "bold 22px monospace";
  ctx.fillText("FT PCB • PRECISION MANUFACTURING", 70, 50);

  ctx.font = "14px monospace";
  ctx.fillText("IATF 16949 / ISO 9001 / IPC-A-600 CLASS 3", 70, 72);
  ctx.fillText("2L-30L MULTI-LAYER PRECISION CORE • 100K M²/MO", 70, 92);

  // Gold Edge Pads
  ctx.fillStyle = mode === "xray" ? "#38bdf8" : "#f59e0b";
  for (let x = 70; x < 950; x += 28) {
    ctx.fillRect(x, h - 38, 16, 26);
    ctx.fillRect(x, 12, 16, 24);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  return texture;
}

export default function AboutPcb3DViewer({
  className = "",
  initialColor = "green",
}: {
  className?: string;
  initialColor?: string;
}) {
  const { locale } = useLanguage();
  const isZh = locale === "zh";

  const mountRef = useRef<HTMLDivElement>(null);
  const [currentColor, setCurrentColor] = useState(initialColor);
  const [mode, setMode] = useState<"assembled" | "bare" | "xray">("assembled");
  const [isRotating, setIsRotating] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // References for Three.js objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const pcbGroupRef = useRef<THREE.Group | null>(null);
  const boardMeshRef = useRef<THREE.Mesh | null>(null);
  const componentsGroupRef = useRef<THREE.Group | null>(null);

  // Drag interaction state
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });

  const activeColor =
    COLOR_PRESETS.find((c) => c.id === currentColor) || COLOR_PRESETS[0];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 7, 12);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight1.position.set(8, 12, 10);
    dirLight1.castShadow = true;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.0);
    dirLight2.position.set(-8, -4, -6);
    scene.add(dirLight2);

    // 5. Main PCB Group
    const pcbGroup = new THREE.Group();
    pcbGroupRef.current = pcbGroup;
    scene.add(pcbGroup);

    // 6. Board Substrate Mesh
    const boardGeo = new THREE.BoxGeometry(8, 0.22, 5.2);
    const canvasTex = generateTexture(activeColor.hex, mode);

    const boardMat = new THREE.MeshStandardMaterial({
      map: canvasTex,
      roughness: mode === "xray" ? 0.1 : 0.45,
      metalness: mode === "xray" ? 0.8 : 0.25,
      transparent: mode === "xray",
      opacity: mode === "xray" ? 0.45 : 1.0,
    });

    const boardMesh = new THREE.Mesh(boardGeo, boardMat);
    boardMesh.castShadow = true;
    boardMesh.receiveShadow = true;
    boardMeshRef.current = boardMesh;
    pcbGroup.add(boardMesh);

    // 7. SMT Electronic Components Group
    const compGroup = new THREE.Group();
    componentsGroupRef.current = compGroup;
    pcbGroup.add(compGroup);

    // Main Processor (SoC / BGA)
    const socGeo = new THREE.BoxGeometry(2.0, 0.25, 2.0);
    const socMat = new THREE.MeshStandardMaterial({
      color: 0x181a1f,
      roughness: 0.2,
      metalness: 0.8,
    });
    const socMesh = new THREE.Mesh(socGeo, socMat);
    socMesh.position.set(0, 0.22, 0);
    socMesh.castShadow = true;
    compGroup.add(socMesh);

    // SoC Die Heatspreader (Mirror Silver/Gold)
    const dieGeo = new THREE.BoxGeometry(1.2, 0.05, 1.2);
    const dieMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.1,
      metalness: 0.95,
    });
    const dieMesh = new THREE.Mesh(dieGeo, dieMat);
    dieMesh.position.set(0, 0.36, 0);
    compGroup.add(dieMesh);

    // Flash Memory Chip (QFP)
    const flashGeo = new THREE.BoxGeometry(1.4, 0.18, 0.9);
    const flashMat = new THREE.MeshStandardMaterial({
      color: 0x1f242d,
      roughness: 0.35,
      metalness: 0.6,
    });
    const flashMesh = new THREE.Mesh(flashGeo, flashMat);
    flashMesh.position.set(-2.4, 0.18, 1.2);
    compGroup.add(flashMesh);

    // Crystal Oscillator
    const oscGeo = new THREE.BoxGeometry(0.7, 0.15, 0.5);
    const oscMat = new THREE.MeshStandardMaterial({
      color: 0xc0c5ce,
      roughness: 0.1,
      metalness: 0.9,
    });
    const oscMesh = new THREE.Mesh(oscGeo, oscMat);
    oscMesh.position.set(2.4, 0.16, -1.2);
    compGroup.add(oscMesh);

    // USB-C Connector Receptacle
    const usbGeo = new THREE.BoxGeometry(1.3, 0.45, 1.1);
    const usbMat = new THREE.MeshStandardMaterial({
      color: 0xd1d5db,
      roughness: 0.15,
      metalness: 0.85,
    });
    const usbMesh = new THREE.Mesh(usbGeo, usbMat);
    usbMesh.position.set(3.8, 0.28, 0);
    compGroup.add(usbMesh);

    // Discrete Resistors & Capacitors (SMD 0603/0805)
    const smdMat = new THREE.MeshStandardMaterial({
      color: 0x3b4252,
      roughness: 0.3,
      metalness: 0.4,
    });
    const smdGeo = new THREE.BoxGeometry(0.2, 0.1, 0.12);

    for (let i = 0; i < 28; i++) {
      const smd = new THREE.Mesh(smdGeo, smdMat);
      const angle = (i / 28) * Math.PI * 2;
      const radius = 1.6 + (i % 3) * 0.4;
      smd.position.set(
        Math.cos(angle) * radius,
        0.14,
        Math.sin(angle) * radius
      );
      smd.rotation.y = angle;
      compGroup.add(smd);
    }

    // Through-Hole Electrolytic Capacitors (Cylinders)
    const capGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.8, 24);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a,
      roughness: 0.25,
      metalness: 0.7,
    });

    const cap1 = new THREE.Mesh(capGeo, capMat);
    cap1.position.set(-2.6, 0.48, -1.4);
    compGroup.add(cap1);

    const cap2 = new THREE.Mesh(capGeo, capMat);
    cap2.position.set(-1.7, 0.48, -1.4);
    compGroup.add(cap2);

    // 8. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (isRotating && pcbGroupRef.current && !isDraggingRef.current) {
        pcbGroupRef.current.rotation.y += delta * 0.45;
      }

      renderer.render(scene, camera);
    };
    animate();

    // 9. Resize Observer
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      boardGeo.dispose();
      boardMat.dispose();
    };
  }, []);

  // Update texture when color or mode changes
  useEffect(() => {
    if (!boardMeshRef.current) return;
    const canvasTex = generateTexture(activeColor.hex, mode);

    const mat = boardMeshRef.current.material as THREE.MeshStandardMaterial;
    mat.map = canvasTex;
    mat.needsUpdate = true;

    if (mode === "xray") {
      mat.transparent = true;
      mat.opacity = 0.45;
      mat.roughness = 0.1;
      mat.metalness = 0.8;
      if (componentsGroupRef.current) componentsGroupRef.current.visible = true;
    } else if (mode === "bare") {
      mat.transparent = false;
      mat.opacity = 1.0;
      mat.roughness = 0.6;
      mat.metalness = 0.2;
      if (componentsGroupRef.current) componentsGroupRef.current.visible = false;
    } else {
      mat.transparent = false;
      mat.opacity = 1.0;
      mat.roughness = 0.45;
      mat.metalness = 0.25;
      if (componentsGroupRef.current) componentsGroupRef.current.visible = true;
    }
  }, [currentColor, mode]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    prevMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !pcbGroupRef.current) return;
    const deltaX = e.clientX - prevMouseRef.current.x;
    const deltaY = e.clientY - prevMouseRef.current.y;
    pcbGroupRef.current.rotation.y += deltaX * 0.008;
    pcbGroupRef.current.rotation.x += deltaY * 0.008;
    prevMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleZoom = (direction: "in" | "out") => {
    if (!cameraRef.current) return;
    const delta = direction === "in" ? -1.5 : 1.5;
    cameraRef.current.position.z = Math.max(
      6,
      Math.min(20, cameraRef.current.position.z + delta)
    );
  };

  return (
    <div
      className={`relative rounded-3xl border border-gray-200 dark:border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-2xl overflow-hidden select-none ${
        isFullscreen
          ? "fixed inset-0 z-50 rounded-none border-none"
          : "min-h-[460px] sm:min-h-[520px]"
      } ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Top HUD Header */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="rounded-2xl bg-black/60 backdrop-blur-md px-3.5 py-1.5 border border-white/10 text-white flex items-center gap-2 shadow-lg">
            <Cpu className="size-4 text-emerald-400" />
            <span className="text-xs font-black tracking-wide">
              {isZh ? "FT PCB 3D 交互式检测系统" : "FT PCB 3D Interactive Core"}
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.2 rounded border border-emerald-800">
              WebGL PBR
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Rotation Toggle */}
          <button
            type="button"
            onClick={() => setIsRotating((prev) => !prev)}
            title={
              isZh
                ? isRotating
                  ? "暂停自动旋转"
                  : "开启自动旋转"
                : isRotating
                ? "Pause Auto-Rotate"
                : "Start Auto-Rotate"
            }
            className={`size-8 rounded-xl flex items-center justify-center border text-xs transition cursor-pointer backdrop-blur-md ${
              isRotating
                ? "bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30"
                : "bg-black/60 text-slate-300 border-white/10 hover:text-white"
            }`}
          >
            <RotateCw className="size-3.5" />
          </button>

          {/* Zoom Buttons */}
          <button
            type="button"
            onClick={() => handleZoom("in")}
            title={isZh ? "放大视图" : "Zoom In"}
            className="size-8 rounded-xl bg-black/60 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 flex items-center justify-center backdrop-blur-md transition cursor-pointer"
          >
            <ZoomIn className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleZoom("out")}
            title={isZh ? "缩小视图" : "Zoom Out"}
            className="size-8 rounded-xl bg-black/60 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 flex items-center justify-center backdrop-blur-md transition cursor-pointer"
          >
            <ZoomOut className="size-3.5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen((prev) => !prev)}
            title={
              isZh
                ? isFullscreen
                  ? "退出全屏"
                  : "全屏沉浸浏览"
                : isFullscreen
                ? "Exit Fullscreen"
                : "Fullscreen 3D Viewer"
            }
            className="size-8 rounded-xl bg-black/60 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 flex items-center justify-center backdrop-blur-md transition cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
          </button>
        </div>
      </div>

      {/* Bottom Controls Bar: Inspection Mode & Solder Mask Color */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Inspection Mode Switcher */}
        <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md p-1 rounded-2xl border border-white/10 shadow-lg pointer-events-auto">
          <button
            type="button"
            onClick={() => setMode("assembled")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              mode === "assembled"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-300 hover:text-white"
            }`}
          >
            {isZh ? "PCBA 成品贴片" : "PCBA Assembled"}
          </button>
          <button
            type="button"
            onClick={() => setMode("bare")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              mode === "bare"
                ? "bg-amber-600 text-white shadow-xs"
                : "text-slate-300 hover:text-white"
            }`}
          >
            {isZh ? "FR4 裸板走线" : "Bare FR4 PCB"}
          </button>
          <button
            type="button"
            onClick={() => setMode("xray")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              mode === "xray"
                ? "bg-cyan-600 text-white shadow-xs"
                : "text-slate-300 hover:text-white"
            }`}
          >
            {isZh ? "X射线内层透视" : "X-Ray Layers"}
          </button>
        </div>

        {/* Color Palette Switcher */}
        <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-lg pointer-events-auto">
          {COLOR_PRESETS.map((color) => {
            const isSelected = color.id === currentColor;
            return (
              <button
                key={color.id}
                type="button"
                onClick={() => setCurrentColor(color.id)}
                title={`${color.name} Finish`}
                className={`size-6 rounded-full border-2 transition-all cursor-pointer relative ${
                  isSelected
                    ? "border-white scale-110 shadow-md ring-2 ring-emerald-500/50"
                    : "border-transparent opacity-70 hover:opacity-100 hover:scale-105"
                }`}
                style={{ backgroundColor: color.hex }}
              />
            );
          })}
        </div>
      </div>

      {/* Drag & Rotate Prompt Hint */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <span className="text-[10px] font-mono text-slate-400 bg-black/60 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-xs">
          {isZh
            ? "按住鼠标左键拖拽旋转 3D 板 • 滚轮缩放"
            : "Click & Drag to rotate 3D board • Scroll to zoom"}
        </span>
      </div>
    </div>
  );
}
