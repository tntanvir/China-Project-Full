"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import createGlobe from "cobe";
import { useTheme } from "next-themes";
import { useDictionary } from "@/components/providers/language-provider";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  Globe2,
  MapPin,
  Plane,
  Radio,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Truck,
  Zap,
} from "lucide-react";

// Key Global Export Hubs with real geographic coordinates
const destinationRoutes = [
  {
    id: "usa-west",
    regionId: "usa",
    name: "USA (Silicon Valley / SF)",
    flag: "🇺🇸",
    lat: 37.7749,
    lon: -122.4194,
    carrier: "DHL Express / FedEx Priority",
    transit: "2-3 Days Flight",
    duty: "Automated DDP (Pre-Cleared, 0 Hassle)",
    clients: "Silicon Valley IoT, Medical Device Labs, EV Robotics",
    desc: "Direct daily air cargo out of Shenzhen & HK to San Francisco & Memphis express hubs with real-time GPS telemetry.",
  },
  {
    id: "usa-east",
    regionId: "usa",
    name: "USA (New York / Memphis)",
    flag: "🇺🇸",
    lat: 40.7128,
    lon: -74.006,
    carrier: "FedEx Priority Air Hub",
    transit: "2-3 Days Flight",
    duty: "Automated DDP (Pre-Cleared, 0 Hassle)",
    clients: "Hardware Startups, Telecom Infrastructure, Aerospace",
    desc: "Overnight air cargo connecting to Memphis International super-hub with guaranteed fast-track clearance.",
  },
  {
    id: "germany",
    regionId: "europe",
    name: "Germany (Frankfurt / Leipzig)",
    flag: "🇩🇪",
    lat: 50.1109,
    lon: 8.6821,
    carrier: "DHL Express Air Cargo",
    transit: "2-4 Days Express",
    duty: "Full RoHS, REACH & CE Declaration",
    clients: "Industrial Automation, Automotive Tier-2, Embedded IoT",
    desc: "Overnight air links connecting direct to Frankfurt & Leipzig DHL European Hubs with expedited customs dispatch.",
  },
  {
    id: "uk",
    regionId: "europe",
    name: "United Kingdom (London)",
    flag: "🇬🇧",
    lat: 51.5074,
    lon: -0.1278,
    carrier: "DHL / UPS Worldwide",
    transit: "2-4 Days Express",
    duty: "UKCA & RoHS Compliant Invoicing",
    clients: "Cambridge AI Labs, IoT Hardware, Green Tech",
    desc: "Express flight departures directly to London Heathrow with priority air express courier dispatch.",
  },
  {
    id: "japan",
    regionId: "apac",
    name: "Japan (Tokyo Narita)",
    flag: "🇯🇵",
    lat: 35.6762,
    lon: 139.6503,
    carrier: "SF International / Air Express",
    transit: "24-48 Hours Route",
    duty: "APAC Free Trade Fast Clearance",
    clients: "Precision Optical Sensors, High-Speed Computing, Drones",
    desc: "Same-day flight departure to Tokyo Narita for emergency engineering prototype delivery.",
  },
  {
    id: "australia",
    regionId: "apac",
    name: "Australia (Sydney)",
    flag: "🇦🇺",
    lat: -33.8688,
    lon: 151.2093,
    carrier: "DHL Express Air Australia",
    transit: "3-4 Days Express",
    duty: "ChAFTA Fast Customs Clearance",
    clients: "Mining Electronics, Smart Agriculture, Clean Tech",
    desc: "Direct daily air cargo out of Guangzhou to Sydney Kingsford Smith with complete door-to-door tracking.",
  },
  {
    id: "uae",
    regionId: "middle-east",
    name: "Middle East (Dubai)",
    flag: "🇦🇪",
    lat: 25.2048,
    lon: 55.2708,
    carrier: "Emirates SkyCargo / DHL Air",
    transit: "3-4 Days Express",
    duty: "GCC Verified Commercial Invoicing",
    clients: "Smart Energy, Telecom Infrastructure, Defense Systems",
    desc: "Direct air freight connections linking Dubai World Central and Abu Dhabi technology hubs.",
  },
  {
    id: "singapore",
    regionId: "apac",
    name: "Singapore (Changi Hub)",
    flag: "🇸🇬",
    lat: 1.3521,
    lon: 103.8198,
    carrier: "Singapore Airlines Cargo / DHL",
    transit: "24-48 Hours Route",
    duty: "ASEAN Regional Free Trade",
    clients: "Semiconductor Testing, Biomedical Systems, Robotics",
    desc: "Rapid turnaround logistics connecting our manufacturing campus directly into Southeast Asia's tech capital.",
  },
];

// China Factory HQ (The Source of All Connecting Link Arcs)
const CHINA_HQ = {
  name: "Factory HQ (Wuping, China)",
  flag: "🇨🇳",
  lat: 25.033,
  lon: 116.802,
};

// 3D Globe Markers
const globeMarkers = [
  // China Factory Hub (Large Emerald Pulsing Beacon)
  { location: [CHINA_HQ.lat, CHINA_HQ.lon] as [number, number], size: 0.14, color: [0.05, 0.72, 0.45] as [number, number, number] },
  // All Global Destination Hubs
  ...destinationRoutes.map((route) => ({
    location: [route.lat, route.lon] as [number, number],
    size: 0.08,
    color: [0.05, 0.72, 0.45] as [number, number, number],
  })),
];

// Spherical Math Helpers for 3D Curves
const M = Math.PI;

function getUnit3D(lat: number, lon: number): [number, number, number] {
  const c = (lat * M) / 180;
  const a = (lon * M) / 180 - M;
  const t = Math.cos(c);
  return [-t * Math.cos(a), Math.sin(c), t * Math.sin(a)];
}

function slerp3D(
  p1: [number, number, number],
  p2: [number, number, number],
  t: number
): [number, number, number] {
  const dot = p1[0] * p2[0] + p1[1] * p2[1] + p1[2] * p2[2];
  const omega = Math.acos(Math.max(-1, Math.min(1, dot)));
  if (Math.abs(omega) < 0.0001) return p1;
  const sinOmega = Math.sin(omega);
  const s1 = Math.sin((1 - t) * omega) / sinOmega;
  const s2 = Math.sin(t * omega) / sinOmega;
  return [
    s1 * p1[0] + s2 * p2[0],
    s1 * p1[1] + s2 * p2[1],
    s1 * p1[2] + s2 * p2[2],
  ];
}

function rotateY(p: [number, number, number], phi: number): [number, number, number] {
  const cos = Math.cos(phi);
  const sin = Math.sin(phi);
  return [p[0] * cos + p[2] * sin, p[1], -p[0] * sin + p[2] * cos];
}

function rotateX(p: [number, number, number], theta: number): [number, number, number] {
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);
  return [p[0], p[1] * cos - p[2] * sin, p[1] * sin + p[2] * cos];
}

export default function GlobalNetworkGlobe() {
  const dictionary = useDictionary();
  const netCopy = dictionary.sections.network;
  const netGlobe = dictionary.networkGlobe;
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const arcCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Rotation angles state
  const phiRef = useRef(153 * (M / 180));
  const thetaRef = useRef(0.2);
  const targetPhiRef = useRef(153 * (M / 180));
  const targetThetaRef = useRef(0.2);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [currentCoords, setCurrentCoords] = useState("25.03° N, 116.80° E");

  const activeRoute = destinationRoutes[selectedRouteIndex];

  // Helper to convert lat/lon to cobe phi/theta
  const focusOnCoordinates = (lat: number, lon: number) => {
    const radLon = (lon * M) / 180;
    const radLat = (lat * M) / 180;
    targetPhiRef.current = M - (radLon - M / 2);
    targetThetaRef.current = radLat;
    setCurrentCoords(`${lat.toFixed(2)}° N, ${lon.toFixed(2)}° E`);
  };

  const handleSelectRoute = (index: number) => {
    setSelectedRouteIndex(index);
    const reg = destinationRoutes[index];
    focusOnCoordinates(reg.lat, reg.lon);
  };

  useEffect(() => {
    let width = 0;
    const canvas = canvasRef.current;
    const arcCanvas = arcCanvasRef.current;
    if (!canvas || !arcCanvas) return;

    const onResize = () => {
      if (containerRef.current) {
        width = containerRef.current.offsetWidth;
        arcCanvas.width = width * 2;
        arcCanvas.height = width * 2;
      }
    };
    window.addEventListener("resize", onResize);
    onResize();

    // Initialize initial focus on default route
    const initialRoute = destinationRoutes[selectedRouteIndex];
    focusOnCoordinates(initialRoute.lat, initialRoute.lon);

    // Precalculate 3D unit vectors for China HQ and all destination routes
    const chinaUnit = getUnit3D(CHINA_HQ.lat, CHINA_HQ.lon);
    const destinationUnits = destinationRoutes.map((r) => getUnit3D(r.lat, r.lon));

    // 1. Initialize 3D COBE WebGL Globe
    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: (width || 560) * 2,
      height: (width || 560) * 2,
      phi: phiRef.current,
      theta: thetaRef.current,
      dark: isDark ? 1 : 0,
      diffuse: isDark ? 1.2 : 1.4,
      mapSamples: 16000,
      mapBrightness: isDark ? 2.8 : 3.8,
      baseColor: isDark ? [0.12, 0.18, 0.26] : [0.94, 0.96, 0.98], // Dynamic dots
      markerColor: [0.05, 0.72, 0.45], // Rich emerald green #059669
      glowColor: isDark ? [0.06, 0.45, 0.35] : [0.88, 0.97, 0.93], // Soft emerald ambient radiance
      markers: globeMarkers,
      onRender: (state) => {
        // Slow ambient spin when not interacting
        if (pointerInteracting.current === null) {
          targetPhiRef.current += 0.0018;
        }

        // Smooth physics interpolation
        phiRef.current += (targetPhiRef.current - phiRef.current) * 0.06;
        thetaRef.current += (targetThetaRef.current - thetaRef.current) * 0.06;

        state.phi = phiRef.current;
        state.theta = thetaRef.current;
      },
    });

    // 2. Real-time 60fps 3D Connecting Link Arcs & Traveling Pulse Renderer
    let animId: number;
    const ctx = arcCanvas.getContext("2d");

    const renderConnectingArcs = () => {
      if (!ctx || !arcCanvas) return;
      const w = arcCanvas.width;
      const h = arcCanvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const R = (w / 2) * 0.76; // Match 3D globe radius
      const phi = phiRef.current;
      const theta = thetaRef.current;
      const now = performance.now();

      ctx.clearRect(0, 0, w, h);

      // Render 3D Connecting Link Arcs from China HQ to Each Marked Country
      destinationRoutes.forEach((route, idx) => {
        const destUnit = destinationUnits[idx];
        const isSelected = selectedRouteIndex === idx;
        const arcStepCount = 30;
        const screenPoints: { x: number; y: number; z: number }[] = [];

        for (let i = 0; i <= arcStepCount; i++) {
          const t = i / arcStepCount;
          const unit = slerp3D(chinaUnit, destUnit, t);
          // Elevation altitude curve (soars high above the Earth in 3D)
          const altitude = 1 + 0.24 * Math.sin(M * t);
          const p3d: [number, number, number] = [
            unit[0] * R * altitude,
            unit[1] * R * altitude,
            unit[2] * R * altitude,
          ];

          const pRotY = rotateY(p3d, phi);
          const pRotX = rotateX(pRotY, theta);

          screenPoints.push({
            x: cx + pRotX[0],
            y: cy - pRotX[1],
            z: pRotX[2],
          });
        }

        // Check if any part of the arc is visible on the front hemisphere (z > -40)
        const hasVisiblePoints = screenPoints.some((p) => p.z > -30);
        if (!hasVisiblePoints) return;

        // Draw 3D Curved Arc Line
        ctx.beginPath();
        for (let i = 0; i < screenPoints.length; i++) {
          const pt = screenPoints[i];
          if (i === 0) {
            ctx.moveTo(pt.x, pt.y);
          } else {
            ctx.lineTo(pt.x, pt.y);
          }
        }

        // Depth cueing: front arcs are bright emerald, back arcs fade out
        const avgZ = screenPoints.reduce((acc, p) => acc + p.z, 0) / screenPoints.length;
        const depthOpacity = Math.max(0.12, Math.min(1.0, (avgZ + 80) / 180));

        if (isSelected) {
          ctx.strokeStyle = isDark ? `rgba(16, 185, 129, ${depthOpacity * 0.95})` : `rgba(5, 150, 105, ${depthOpacity * 0.95})`;
          ctx.lineWidth = 3.5;
          ctx.setLineDash([]);
          ctx.stroke();

          // Outer luminous glow line for active selected route
          ctx.strokeStyle = `rgba(52, 211, 153, ${depthOpacity * 0.45})`;
          ctx.lineWidth = 7;
          ctx.stroke();
        } else {
          ctx.strokeStyle = isDark ? `rgba(16, 185, 129, ${depthOpacity * 0.6})` : `rgba(16, 185, 129, ${depthOpacity * 0.5})`;
          ctx.lineWidth = 1.8;
          ctx.setLineDash([6, 8]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Render Animated Traveling Light Pulse (Simulating Air Cargo Flight)
        const pulseCycle = (now / (isSelected ? 2200 : 3400) + idx * 0.28) % 1.0;
        const pulseIdx = Math.floor(pulseCycle * (screenPoints.length - 1));
        const pulsePt = screenPoints[pulseIdx];

        if (pulsePt && pulsePt.z > -20) {
          const pulseZOpacity = Math.max(0.2, Math.min(1.0, (pulsePt.z + 50) / 120));

          // Draw Glowing Air Cargo Pulse
          ctx.beginPath();
          ctx.arc(pulsePt.x, pulsePt.y, isSelected ? 4.5 : 3.5, 0, Math.PI * 2);
          ctx.fillStyle = isSelected
            ? `rgba(255, 255, 255, ${pulseZOpacity})`
            : `rgba(16, 185, 129, ${pulseZOpacity})`;
          ctx.shadowColor = "#10b981";
          ctx.shadowBlur = isSelected ? 12 : 8;
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      });

      // Render Pulsing Beacon at China Factory Origin
      const origin3d: [number, number, number] = [chinaUnit[0] * R, chinaUnit[1] * R, chinaUnit[2] * R];
      const originRotY = rotateY(origin3d, phi);
      const originRotX = rotateX(originRotY, theta);
      if (originRotX[2] > 0) {
        const originX = cx + originRotX[0];
        const originY = cy - originRotX[1];

        // Animated Expanding Ripple Ring
        const ringTime = (now / 1500) % 1.0;
        ctx.beginPath();
        ctx.arc(originX, originY, 6 + ringTime * 14, 0, Math.PI * 2);
        ctx.strokeStyle = isDark ? `rgba(16, 185, 129, ${1.0 - ringTime})` : `rgba(5, 150, 105, ${1.0 - ringTime})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Core Origin Beacon
        ctx.beginPath();
        ctx.arc(originX, originY, 5, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? "#10b981" : "#059669";
        ctx.fill();
      }

      animId = requestAnimationFrame(renderConnectingArcs);
    };

    animId = requestAnimationFrame(renderConnectingArcs);

    return () => {
      globe.destroy();
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, [selectedRouteIndex, isDark]);

  return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-950 py-14 sm:py-20 border-t border-gray-200 dark:border-slate-800 transition-colors duration-300">
      
      {/* Precision Background Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-60 dark:opacity-30" />
      
      {/* Soft Ambient Radiance */}
      <div className="pointer-events-none absolute top-1/2 right-1/4 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-emerald-500/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-10 h-72 w-72 rounded-full bg-emerald-400/5 blur-3xl" />

      <div className="relative mx-auto max-w-[1360px] px-4 sm:px-6">
        
        {/* ===================================================================== */}
        {/* TOP SECTION HEADER                                                    */}
        {/* ===================================================================== */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-3.5 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600 dark:bg-emerald-400" />
            </span>
            <span>{netCopy?.badge || "Worldwide Air Express • Direct Connecting Flight Links"}</span>
          </div>

          <h2 className="mt-3 text-2xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {netCopy?.title || "Global Precision PCB & PCBA Supply Chain"}
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-slate-300 sm:text-base max-w-2xl mx-auto">
            {netCopy?.description || "Direct 3D flight routes connecting our Wuping manufacturing campus to over 60 countries. Seamless DHL, FedEx, and UPS air express networks with real-time tracking."}
          </p>
        </div>

        {/* ===================================================================== */}
        {/* MASTER DUAL-COLUMN LAYOUT: LOGISTICS DETAILS (LEFT) + 3D GLOBE (RIGHT) */}
        {/* ===================================================================== */}
        <div className="mt-12 grid gap-8 lg:grid-cols-12 items-center">
          
          {/* ------------------------------------------------------------------- */}
          {/* LEFT: Regional Logistics Telemetry & Interactive Selector (5 Cols)   */}
          {/* ------------------------------------------------------------------- */}
          <div className="flex flex-col justify-between space-y-5 lg:col-span-5">
            
            {/* 3 Quick Capacity Badges */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="rounded-2xl border border-gray-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-sm">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <Globe2 className="size-4" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-slate-400">
                    {netGlobe?.telemetry?.coverageLabel || "Coverage"}
                  </span>
                </div>
                <div className="mt-1 text-xl font-black text-gray-900 dark:text-white">
                  {netGlobe?.telemetry?.coverageValue || "60+"}
                </div>
                <div className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">
                  {netGlobe?.telemetry?.coverageSub || "Countries"}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-sm">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <Plane className="size-4" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-slate-400">
                    {netGlobe?.telemetry?.airTransitLabel || "Air Transit"}
                  </span>
                </div>
                <div className="mt-1 text-xl font-black text-gray-900 dark:text-white">
                  {netGlobe?.telemetry?.airTransitValue || "2-3 D"}
                </div>
                <div className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">
                  {netGlobe?.telemetry?.airTransitSub || "DHL/FedEx Air"}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-sm">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="size-4" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-slate-400">
                    {netGlobe?.telemetry?.customsLabel || "Customs"}
                  </span>
                </div>
                <div className="mt-1 text-xl font-black text-gray-900 dark:text-white">
                  {netGlobe?.telemetry?.customsValue || "99.8%"}
                </div>
                <div className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">
                  {netGlobe?.telemetry?.customsSub || "Direct Clearance"}
                </div>
              </div>
            </div>

            {/* Destination Interactive Switcher Chips */}
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider text-gray-400 dark:text-slate-400 mb-2 flex items-center justify-between">
                <span>{netGlobe?.corridorTitle || "Select Connecting Flight Route:"}</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-extrabold text-[10px]">
                  {destinationRoutes.length} {netGlobe?.corridorSubtitle || "Active Express Links"}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {destinationRoutes.map((route, idx) => {
                  const isSelected = selectedRouteIndex === idx;
                  return (
                    <button
                      key={route.id}
                      type="button"
                      onClick={() => handleSelectRoute(idx)}
                      className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-bold transition-all ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/25 ring-2 ring-emerald-500/20"
                          : "border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-slate-800"
                      }`}
                    >
                      <span>{route.flag}</span>
                      <span>{route.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Connecting Flight Route Telemetry Card */}
            <div className="rounded-3xl border border-gray-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xl shadow-gray-200/40 dark:shadow-none space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{activeRoute.flag}</span>
                  <div>
                    <h3 className="text-base font-black text-gray-900 dark:text-white leading-tight">
                      {activeRoute.name}
                    </h3>
                    <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">{activeRoute.carrier}</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 text-[10px] font-black text-emerald-800 dark:text-emerald-300">
                  {activeRoute.transit}
                </span>
              </div>

              {/* Specs Rows */}
              <div className="grid gap-2 text-xs">
                <div className="flex items-start gap-2 text-gray-700 dark:text-slate-300">
                  <Plane className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-900 dark:text-slate-100">{netGlobe?.panel?.originLabel || "Direct Route"}: </span>
                    <span className="text-gray-600 dark:text-slate-400 font-semibold">
                      Wuping / Shenzhen (SZX) ➔ {activeRoute.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-gray-700 dark:text-slate-300">
                  <Clock className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-900 dark:text-slate-100">{netGlobe?.panel?.leadTimeLabel || "Transit Duration"}: </span>
                    <span className="text-gray-600 dark:text-slate-400">{activeRoute.transit}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-gray-700 dark:text-slate-300">
                  <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-900 dark:text-slate-100">{netGlobe?.panel?.customsLabel || "Duty & Tax"}: </span>
                    <span className="text-gray-600 dark:text-slate-400">{activeRoute.duty}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 text-gray-700 dark:text-slate-300">
                  <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-gray-900 dark:text-slate-100">Target Sectors: </span>
                    <span className="text-gray-600 dark:text-slate-400">{activeRoute.clients}</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-relaxed pt-2 border-t border-gray-100 dark:border-slate-800">
                {activeRoute.desc}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <Link
                  href="/pcb-quote"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-black text-white shadow-sm hover:bg-emerald-700 transition active:scale-95"
                >
                  <Zap className="size-3.5 fill-current" />
                  {netGlobe?.panel?.calculateBtn || `Instant Quote to ${activeRoute.name.split(" ")[0]}`}
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-1 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2.5 text-xs font-bold text-gray-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition"
                >
                  Contact Logistics
                </Link>
              </div>
            </div>

          </div>

          {/* ------------------------------------------------------------------- */}
          {/* RIGHT: 3D Globe with Real 3D Curved Connecting Link Arcs (7 Cols)   */}
          {/* ------------------------------------------------------------------- */}
          <div className="lg:col-span-7 flex flex-col items-center">
            
            <div
              ref={containerRef}
              className="relative aspect-square w-full max-w-[560px] flex items-center justify-center select-none bg-transparent border-none shadow-none"
            >

              {/* Top Bar on Globe: Live Telemetry */}
              <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between text-xs pointer-events-none">
                <div className="flex items-center gap-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1 border border-gray-200/80 dark:border-slate-700 shadow-xs font-bold text-gray-700 dark:text-slate-200">
                  <Compass className="size-3.5 text-emerald-600 dark:text-emerald-400 animate-spin" style={{ animationDuration: "12s" }} />
                  <span className="text-[11px] font-extrabold text-gray-800 dark:text-slate-100">{currentCoords}</span>
                </div>

                <div className="flex items-center gap-1.5 rounded-full bg-emerald-50/95 dark:bg-emerald-950/95 backdrop-blur-md px-3 py-1 border border-emerald-200/80 dark:border-emerald-800 shadow-xs text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-300">
                  <span className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-ping" />
                  <span>3D Flight Links Active</span>
                </div>
              </div>

              {/* 3D WebGL COBE Globe Canvas */}
              <canvas
                ref={canvasRef}
                style={{
                  width: "100%",
                  height: "100%",
                  maxWidth: "520px",
                  maxHeight: "520px",
                  cursor: "grab",
                  aspectRatio: "1",
                }}
                onPointerDown={(e) => {
                  pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
                  if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
                }}
                onPointerUp={() => {
                  pointerInteracting.current = null;
                  if (canvasRef.current) canvasRef.current.style.cursor = "grab";
                }}
                onPointerOut={() => {
                  pointerInteracting.current = null;
                  if (canvasRef.current) canvasRef.current.style.cursor = "grab";
                }}
                onMouseMove={(e) => {
                  if (pointerInteracting.current !== null) {
                    const delta = e.clientX - pointerInteracting.current;
                    pointerInteractionMovement.current = delta;
                    targetPhiRef.current = delta * 0.005;
                  }
                }}
                onTouchMove={(e) => {
                  if (pointerInteracting.current !== null && e.touches[0]) {
                    const delta = e.touches[0].clientX - pointerInteracting.current;
                    pointerInteractionMovement.current = delta;
                    targetPhiRef.current = delta * 0.005;
                  }
                }}
              />

              {/* Overlay Canvas for Real-Time 3D Curved Connecting Link Arcs & Traveling Flight Pulses */}
              <canvas
                ref={arcCanvasRef}
                className="pointer-events-none absolute inset-0 z-10 h-full w-full"
                style={{
                  maxWidth: "560px",
                  maxHeight: "560px",
                  margin: "auto",
                }}
              />

              {/* Bottom Drag & Controls Hint */}
              <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between text-xs pointer-events-none">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1 border border-gray-200/80 dark:border-slate-700 shadow-xs text-[10px] font-bold text-gray-600 dark:text-slate-300">
                  <Radio className="size-3 text-emerald-600 dark:text-emerald-400" />
                  Drag 3D Earth • Curved Air Links Synced
                </span>

                <button
                  type="button"
                  onClick={() => focusOnCoordinates(CHINA_HQ.lat, CHINA_HQ.lon)}
                  className="pointer-events-auto inline-flex items-center gap-1 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2.5 py-1 border border-gray-200/80 dark:border-slate-700 shadow-xs text-[10px] font-bold text-gray-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 hover:border-emerald-500 transition"
                >
                  <RotateCcw className="size-3" />
                  <span>Center China HQ</span>
                </button>
              </div>
            </div>

            {/* Live Flight Dispatch Ticker */}
            <div className="mt-4 w-full max-w-[560px] rounded-2xl border border-gray-200/80 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-900/60 p-3 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-gray-700 dark:text-slate-300 truncate">
                <span className="size-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse shrink-0" />
                <span className="truncate">
                  Active Link: Wuping HQ ➔ {activeRoute.name} ({activeRoute.carrier})
                </span>
              </div>
              <span className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 rounded px-2 py-0.5 shrink-0">
                Live Flight
              </span>
            </div>

          </div>

        </div>

        {/* ===================================================================== */}
        {/* BOTTOM GLOBAL CARRIER TRUST TICKER                                    */}
        {/* ===================================================================== */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200/80 dark:border-slate-800 bg-gray-50/60 dark:bg-slate-900/40 p-4 text-xs text-gray-600 dark:text-slate-400">
          <div className="flex items-center gap-2 font-black text-gray-900 dark:text-white">
            <Truck className="size-4 text-emerald-600 dark:text-emerald-400" />
            <span>Authorized Global Logistics Partners:</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-extrabold text-gray-700 dark:text-slate-300 text-xs">
            <span className="hover:text-emerald-700 dark:hover:text-emerald-400 transition">DHL Express Worldwide</span>
            <span className="text-gray-300 dark:text-slate-600">•</span>
            <span className="hover:text-emerald-700 dark:hover:text-emerald-400 transition">FedEx International Priority</span>
            <span className="text-gray-300 dark:text-slate-600">•</span>
            <span className="hover:text-emerald-700 dark:hover:text-emerald-400 transition">UPS Worldwide Saver</span>
            <span className="text-gray-300 dark:text-slate-600">•</span>
            <span className="hover:text-emerald-700 dark:hover:text-emerald-400 transition">SF Express International</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="size-3.5" />
            <span>{netGlobe?.carrierTicker?.insured || "100% Insured Air Transit"}</span>
          </div>
        </div>

      </div>
    </section>
  );
}
