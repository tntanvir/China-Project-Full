"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import createGlobe, { type COBEOptions } from "cobe"
import { AE, AU, BD, CN, DE, GB, JP, US } from "country-flag-icons/react/3x2"
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react"

import { cn } from "@/lib/utils"

const MOVEMENT_DAMPING = 1250
const GLOBE_THETA = 0.34

type NetworkCountry = {
  code: string
  name: string
  flag: typeof CN
  location: [number, number]
  metric: string
}

type ProjectedCountry = NetworkCountry & {
  x: number
  y: number
  z: number
  visible: boolean
}

const NETWORK_COUNTRIES: NetworkCountry[] = [
  {
    code: "CN",
    name: "China",
    flag: CN,
    location: [39.9042, 116.4074],
    metric: "Factory command hub",
  },
  {
    code: "BD",
    name: "Bangladesh",
    flag: BD,
    location: [23.8103, 90.4125],
    metric: "Growth market",
  },
  {
    code: "US",
    name: "United States",
    flag: US,
    location: [40.7128, -74.006],
    metric: "Express route",
  },
  {
    code: "DE",
    name: "Germany",
    flag: DE,
    location: [52.52, 13.405],
    metric: "Industrial buyers",
  },
  {
    code: "GB",
    name: "United Kingdom",
    flag: GB,
    location: [51.5072, -0.1276],
    metric: "Prototype teams",
  },
  {
    code: "JP",
    name: "Japan",
    flag: JP,
    location: [35.6762, 139.6503],
    metric: "Precision supply",
  },
  {
    code: "AE",
    name: "UAE",
    flag: AE,
    location: [25.2048, 55.2708],
    metric: "Transit lane",
  },
  {
    code: "AU",
    name: "Australia",
    flag: AU,
    location: [-33.8688, 151.2093],
    metric: "Stable export",
  },
]

const NETWORK_ROUTES = [
  ["CN", "BD"],
  ["CN", "JP"],
  ["CN", "AE"],
  ["CN", "DE"],
  ["DE", "GB"],
  ["CN", "US"],
  ["CN", "AU"],
] as const

const GLOBE_CONFIG: COBEOptions = {
  width: 900,
  height: 900,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: GLOBE_THETA,
  dark: 1,
  diffuse: 0.85,
  mapSamples: 22000,
  mapBrightness: 5.8,
  baseColor: [0.08, 0.16, 0.24],
  markerColor: [34 / 255, 211 / 255, 238 / 255],
  glowColor: [34 / 255, 211 / 255, 238 / 255],
  markers: NETWORK_COUNTRIES.map((country) => ({
    location: country.location,
    size: country.code === "CN" ? 0.115 : 0.055,
  })),
}

function projectCountry(country: NetworkCountry, phi: number): ProjectedCountry {
  const [lat, lng] = country.location
  const latRad = (lat * Math.PI) / 180
  const lngRad = (lng * Math.PI) / 180 + phi
  const theta = GLOBE_THETA
  const cosLat = Math.cos(latRad)
  const sinLat = Math.sin(latRad)
  const cosLng = Math.cos(lngRad)
  const sinLng = Math.sin(lngRad)
  const x = cosLat * sinLng
  const y = sinLat * Math.cos(theta) - cosLat * cosLng * Math.sin(theta)
  const z = sinLat * Math.sin(theta) + cosLat * cosLng * Math.cos(theta)

  return {
    ...country,
    x: 50 + x * 35.5,
    y: 50 - y * 35.5,
    z,
    visible: z > -0.12,
  }
}

function routePath(from: ProjectedCountry, to: ProjectedCountry) {
  const midX = (from.x + to.x) / 2
  const midY = (from.y + to.y) / 2
  const distance = Math.hypot(from.x - to.x, from.y - to.y)
  const lift = Math.min(20, Math.max(7, distance * 0.2))

  return `M ${from.x} ${from.y} Q ${midX} ${midY - lift} ${to.x} ${to.y}`
}

export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string
  config?: COBEOptions
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phiRef = useRef(0)
  const widthRef = useRef(0)
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef(0)
  const [overlayPhi, setOverlayPhi] = useState(0)
  const [activeRouteIndex, setActiveRouteIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  const r = useMotionValue(0)
  const rs = useSpring(r, {
    mass: 1,
    damping: 28,
    stiffness: 120,
  })

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab"
    }
  }

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current
      pointerInteractionMovement.current = delta
      r.set(r.get() + delta / MOVEMENT_DAMPING)
    }
  }

  useEffect(() => {
    setMounted(true)
    let animationFrame = 0
    let lastOverlayPaint = 0

    const onResize = () => {
      if (canvasRef.current) {
        widthRef.current = canvasRef.current.offsetWidth
      }
    }

    window.addEventListener("resize", onResize)
    onResize()

    const globe = createGlobe(canvasRef.current!, {
      ...config,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      onRender: (state) => {
        if (pointerInteracting.current === null) phiRef.current += 0.0075
        state.phi = phiRef.current + rs.get()
        state.width = widthRef.current * 2
        state.height = widthRef.current * 2
      },
    })

    const paintOverlay = (time: number) => {
      if (time - lastOverlayPaint > 46) {
        setOverlayPhi(phiRef.current + rs.get())
        lastOverlayPaint = time
      }
      animationFrame = requestAnimationFrame(paintOverlay)
    }

    animationFrame = requestAnimationFrame(paintOverlay)
    setTimeout(() => {
      if (canvasRef.current) canvasRef.current.style.opacity = "1"
    }, 0)

    return () => {
      cancelAnimationFrame(animationFrame)
      globe.destroy()
      window.removeEventListener("resize", onResize)
    }
  }, [rs, config])

  useEffect(() => {
    const routeTimer = window.setInterval(() => {
      setActiveRouteIndex((index) => (index + 1) % NETWORK_ROUTES.length)
    }, 1700)

    return () => window.clearInterval(routeTimer)
  }, [])

  const projectedCountries = useMemo(
    () =>
      NETWORK_COUNTRIES.map((country) =>
        projectCountry(country, overlayPhi)
      ),
    [overlayPhi]
  )

  const countriesByCode = useMemo(
    () => new Map(projectedCountries.map((country) => [country.code, country])),
    [projectedCountries]
  )

  const activeRoute = NETWORK_ROUTES[activeRouteIndex]
  const activeFrom = countriesByCode.get(activeRoute[0])
  const activeTo = countriesByCode.get(activeRoute[1])
  const activeRouteVisible = activeFrom?.visible && activeTo?.visible
  const ActiveFromFlag = activeFrom?.flag
  const ActiveToFlag = activeTo?.flag

  return (
    <div
      className={cn(
        "absolute inset-0 mx-auto aspect-square w-full max-w-150 overflow-visible",
        className
      )}
    >
      <div className="absolute inset-[1%] rounded-full bg-[radial-gradient(circle_at_50%_45%,rgba(34,211,238,0.28),rgba(37,99,235,0.12)_36%,transparent_68%)] blur-2xl" />
      <div className="absolute inset-[7%] rounded-full border border-cyan-300/20 bg-[radial-gradient(circle_at_35%_24%,rgba(255,255,255,0.14),transparent_28%),radial-gradient(circle_at_70%_72%,rgba(16,185,129,0.12),transparent_34%)] shadow-[0_0_70px_rgba(34,211,238,0.34)] dark:border-cyan-200/20" />
      <canvas
        className={cn(
          "relative z-10 size-full opacity-0 transition-opacity duration-500 contain-[layout_paint_size] drop-shadow-[0_24px_90px_rgba(34,211,238,0.32)] saturate-[1.18]"
        )}
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX
          updatePointerInteraction(e.clientX)
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
      <div className="pointer-events-none absolute inset-[5%] z-15 rounded-full bg-[radial-gradient(circle_at_34%_26%,rgba(255,255,255,0.18),transparent_24%),linear-gradient(135deg,transparent_48%,rgba(2,6,23,0.28)_82%)] mix-blend-screen" />
      {mounted && (
        <>
          <svg
            className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="globeNetworkRoute" x1="0" x2="1" y1="0" y2="1">
                <stop stopColor="#67e8f9" stopOpacity="0.18" />
                <stop offset="0.42" stopColor="#22d3ee" stopOpacity="1" />
                <stop offset="1" stopColor="#34d399" stopOpacity="0.24" />
              </linearGradient>
              <filter id="globeRouteGlow" x="-35%" y="-35%" width="170%" height="170%">
                <feGaussianBlur stdDeviation="0.85" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {NETWORK_ROUTES.map(([fromCode, toCode], index) => {
              const from = countriesByCode.get(fromCode)
              const to = countriesByCode.get(toCode)
              if (!from || !to || !from.visible || !to.visible) return null
    
              const isActive = index === activeRouteIndex
              const path = routePath(from, to)
    
              return (
                <g key={`${fromCode}-${toCode}`} opacity={isActive ? 1 : 0.34}>
                  <motion.path
                    d={path}
                    fill="none"
                    stroke="url(#globeNetworkRoute)"
                    strokeDasharray={isActive ? "1.8 2.4" : "1.2 3"}
                    strokeLinecap="round"
                    strokeWidth={isActive ? 0.72 : 0.3}
                    filter={isActive ? "url(#globeRouteGlow)" : undefined}
                    initial={false}
                    animate={{ strokeDashoffset: [0, -24] }}
                    transition={{
                      duration: isActive ? 0.85 : 1.7,
                      ease: "linear",
                      repeat: Infinity,
                    }}
                  />
                  {isActive
                    ? [0, 0.34, 0.68].map((delay) => (
                        <circle
                          key={delay}
                          r="0.82"
                          fill="#ecfeff"
                          stroke="#22d3ee"
                          strokeWidth="0.32"
                          filter="url(#globeRouteGlow)"
                        >
                          <animateMotion
                            begin={`${delay}s`}
                            dur="1.15s"
                            repeatCount="indefinite"
                            path={path}
                          />
                        </circle>
                      ))
                    : null}
                </g>
              )
            })}
          </svg>
    
          <div className="pointer-events-none absolute inset-0 z-30">
            {projectedCountries.map((country, index) => {
              const isActiveCountry =
                country.code === activeFrom?.code || country.code === activeTo?.code
              const isHub = country.code === "CN"
    
              const Flag = country.flag
    
              return (
                <motion.div
                  key={country.code}
                  className={cn(
                    "absolute flex min-w-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-black text-white shadow-[0_12px_34px_rgba(2,6,23,0.38)] backdrop-blur-xl",
                    "border-white/20 bg-slate-950/72 ring-1 ring-cyan-100/10",
                    isActiveCountry && "border-cyan-200/70 bg-cyan-950/82 ring-cyan-200/35",
                    isHub && "border-emerald-200/80 bg-emerald-500 text-slate-950 ring-emerald-100/40"
                  )}
                  initial={{ opacity: 0, scale: 0.78 }}
                  animate={{
                    opacity: country.visible ? (isActiveCountry || isHub ? 1 : 0.72) : 0,
                    scale: country.visible ? (isActiveCountry || isHub ? 1.08 : 0.9) : 0.7,
                    x: "-50%",
                    y: "-50%",
                  }}
                  transition={{ delay: index * 0.035, duration: 0.26 }}
                  style={{
                    left: `${country.x}%`,
                    top: `${country.y}%`,
                    zIndex: Math.round(country.z * 100),
                  }}
                >
                  <span className="grid h-5 w-5 overflow-hidden rounded-full bg-white p-0.5 shadow-inner">
                    <Flag className="h-full w-full rounded-full object-cover" />
                  </span>
                  <span
                    className={cn(
                      "max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-300 sm:max-w-0",
                      (isActiveCountry || isHub) && "max-w-24 opacity-100 sm:max-w-28"
                    )}
                  >
                    {country.name}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </>
      )}

      <AnimatePresence mode="wait">
        {activeFrom && activeTo ? (
          <motion.div
            key={`${activeFrom.code}-${activeTo.code}`}
            className="pointer-events-none absolute -bottom-2 left-1/2 z-40 flex w-[min(88%,390px)] -translate-x-1/2 items-center justify-between gap-3 rounded-full border border-cyan-100/20 bg-slate-950/70 px-3 py-2 text-white shadow-[0_18px_60px_rgba(2,6,23,0.36)] backdrop-blur-2xl ring-1 ring-white/10"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.28 }}
          >
            <div className="flex min-w-0 items-center gap-2">
              <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-300 text-[10px] font-black text-slate-950 shadow-[0_0_28px_rgba(34,211,238,0.5)]">
                <span className="absolute inset-0 animate-ping rounded-full bg-cyan-300/45" />
                <span className="relative">ON</span>
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-black">
                  {ActiveFromFlag ? <ActiveFromFlag className="inline h-3.5 w-5 rounded-sm align-[-2px]" /> : null} {activeFrom.name} to {ActiveToFlag ? <ActiveToFlag className="inline h-3.5 w-5 rounded-sm align-[-2px]" /> : null} {activeTo.name}
                </p>
                <p className="truncate text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-200/90">
                  {activeTo.metric}
                </p>
              </div>
            </div>
            <div className="shrink-0 rounded-full border border-cyan-200/30 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-cyan-100">
              {activeRouteVisible ? "Fast" : "Sync"}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}





