"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  Calculator,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Cpu,
  FileText,
  Gauge,
  ImagePlus,
  Layers3,
  MessageCircle,
  PackageCheck,
  PlayCircle,
  RotateCw,
  SearchCheck,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Truck,
  UploadCloud,
  Video,
  Wand2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const layerPrices: Record<string, number> = {
  "2": 1,
  "4": 1.55,
  "6": 2.15,
  "8": 2.85,
};

const materialPrices: Record<string, number> = {
  fr4: 1,
  aluminum: 1.35,
  rogers: 2.25,
};

const finishPrices: Record<string, number> = {
  hasl: 1,
  enig: 1.28,
  osp: 0.92,
};

const quickActions = [
  { icon: Calculator, title: "Instant quote calculator", text: "Live PCB price estimate from specs." },
  { icon: UploadCloud, title: "Gerber upload CTA", text: "Customer files can move straight to quote." },
  { icon: Layers3, title: "Layer selector", text: "2, 4, 6 and 8 layer quick presets." },
  { icon: Cpu, title: "Material selector", text: "FR-4, aluminum and Rogers options." },
  { icon: ShieldCheck, title: "Surface finish selector", text: "HASL, ENIG and OSP pricing modes." },
  { icon: Gauge, title: "Urgency control", text: "Standard, fast and express delivery." },
  { icon: ClipboardCheck, title: "DFM checklist", text: "Design rules before production starts." },
  { icon: SearchCheck, title: "Quality progress", text: "AOI, flying probe, X-ray and final QC." },
  { icon: Boxes, title: "Assembly options", text: "SMT, DIP, conformal coating and box build." },
  { icon: PackageCheck, title: "Packaging planner", text: "ESD, reel, vacuum and export cartons." },
  { icon: Truck, title: "Shipping estimate", text: "DHL, FedEx and air cargo ready." },
  { icon: MessageCircle, title: "Engineer support CTA", text: "Fast technical conversation path." },
  { icon: FileText, title: "Content blocks", text: "Space for service copy and case stories." },
  { icon: ImagePlus, title: "Image gallery", text: "Factory, PCB and product media slots." },
  { icon: Video, title: "Video showcase", text: "Factory tour and process explainer area." },
];

const dfmChecks = [
  "Minimum trace and spacing checked",
  "Drill size and annular ring verified",
  "Solder mask bridge reviewed",
  "Panelization and fiducials ready",
];

const mediaItems = [
  {
    title: "Factory Line",
    type: "Image section",
    src: "/image/chinaproject.png",
  },
  {
    title: "PCB Manufacturing",
    type: "Gallery slot",
    src: "/pcbimage/pcbs1.jpg",
  },
  {
    title: "Assembly Showcase",
    type: "Product media",
    src: "/image/pcb5.png",
  },
];

export default function SmartManufacturingHub() {
  const [length, setLength] = useState(100);
  const [width, setWidth] = useState(80);
  const [quantity, setQuantity] = useState(20);
  const [layers, setLayers] = useState("4");
  const [material, setMaterial] = useState("fr4");
  const [finish, setFinish] = useState("enig");
  const [turnaround, setTurnaround] = useState("fast");

  const estimate = useMemo(() => {
    const area = Math.max(length * width, 1000) / 10000;
    const urgency = turnaround === "express" ? 1.45 : turnaround === "fast" ? 1.18 : 1;
    const price = area * quantity * layerPrices[layers] * materialPrices[material] * finishPrices[finish] * urgency;

    return Math.max(price, 12).toFixed(2);
  }, [finish, layers, length, material, quantity, turnaround, width]);

  const readiness = useMemo(() => {
    const score = Number(layers) * 8 + quantity / 2 + (finish === "enig" ? 18 : 12) + (turnaround === "standard" ? 16 : 10);
    return Math.min(Math.round(score), 96);
  }, [finish, layers, quantity, turnaround]);

  return (
    <section className="premium-section border-y border-border/70 bg-background">
      <div className="premium-grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <div className="premium-container relative z-10">
        <div className="mb-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <div className="premium-eyebrow">
              <Wand2 className="h-4 w-4" />
              15 smart homepage functions
            </div>
            <h2 className="mt-4 max-w-3xl text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              A complete PCB buying experience on the home page.
            </h2>
          </div>
          <p className="text-base leading-7 text-muted-foreground lg:text-lg">
            Visitors can estimate price, choose specs, review quality steps, see media, read service content, and jump into quote or engineer support without hunting through the site.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="premium-card overflow-hidden rounded-lg p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-primary">
                  <Calculator className="h-4 w-4" />
                  Smart quote
                </p>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-foreground">PCB Cost Builder</h3>
              </div>
              <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-success">
                Live
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">Length mm</span>
                <Input type="number" value={length} min={10} onChange={(event) => setLength(Number(event.target.value) || 10)} />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">Width mm</span>
                <Input type="number" value={width} min={10} onChange={(event) => setWidth(Number(event.target.value) || 10)} />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">Quantity</span>
                <Input type="number" value={quantity} min={5} onChange={(event) => setQuantity(Number(event.target.value) || 5)} />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">Layers</span>
                <Select value={layers} onValueChange={setLayers}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 Layers</SelectItem>
                    <SelectItem value="4">4 Layers</SelectItem>
                    <SelectItem value="6">6 Layers</SelectItem>
                    <SelectItem value="8">8 Layers</SelectItem>
                  </SelectContent>
                </Select>
              </label>
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">Material</span>
                <Select value={material} onValueChange={setMaterial}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr4">FR-4</SelectItem>
                    <SelectItem value="aluminum">Aluminum</SelectItem>
                    <SelectItem value="rogers">Rogers</SelectItem>
                  </SelectContent>
                </Select>
              </label>
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">Finish</span>
                <Select value={finish} onValueChange={setFinish}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hasl">HASL</SelectItem>
                    <SelectItem value="enig">ENIG</SelectItem>
                    <SelectItem value="osp">OSP</SelectItem>
                  </SelectContent>
                </Select>
              </label>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {["standard", "fast", "express"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTurnaround(item)}
                  className={`rounded-lg border px-4 py-3 text-left text-sm font-bold capitalize transition ${
                    turnaround === item ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted/30 text-foreground hover:border-primary/50"
                  }`}
                >
                  <Clock3 className="mb-2 h-4 w-4" />
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-lg border border-border bg-muted/40 p-5">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-muted-foreground">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Estimated project price
                  </p>
                  <p className="mt-1 text-4xl font-black tracking-tight text-foreground">${estimate}</p>
                </div>
                <Button asChild>
                  <Link href="/pcb-quote">
                    Start full quote
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  <span>Production readiness</span>
                  <span>{readiness}%</span>
                </div>
                <Progress value={readiness} className="h-2" />
              </div>
            </div>
          </div>

          <Tabs defaultValue="functions" className="premium-card rounded-lg p-4 sm:p-5">
            <TabsList className="grid h-auto w-full grid-cols-3 rounded-lg">
              <TabsTrigger value="functions" className="py-2">
                Functions
              </TabsTrigger>
              <TabsTrigger value="content" className="py-2">
                Content
              </TabsTrigger>
              <TabsTrigger value="media" className="py-2">
                Media
              </TabsTrigger>
            </TabsList>

            <TabsContent value="functions" className="mt-5">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {quickActions.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.title} className="rounded-lg border border-border bg-muted/35 p-4">
                      <Icon className="h-5 w-5 text-primary" />
                      <h4 className="mt-3 text-sm font-black text-foreground">{item.title}</h4>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.text}</p>
                    </div>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="content" className="mt-5">
              <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-lg border border-border bg-muted/35 p-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Best content section</p>
                  <h3 className="mt-3 text-2xl font-black tracking-tight text-foreground">From prototype to production, one partner handles the full electronics build.</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Add service copy, case studies, certifications, production capacity, engineer notes, FAQs, and conversion-focused CTA content here.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {["Prototype PCB", "Mass Production", "SMT Assembly", "Export Support"].map((tag) => (
                      <span key={tag} className="rounded-full border border-border bg-background px-3 py-1 text-xs font-bold text-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-background p-5">
                  <p className="flex items-center gap-2 text-sm font-black text-foreground">
                    <ClipboardCheck className="h-4 w-4 text-primary" />
                    DFM and quality checklist
                  </p>
                  <div className="mt-4 grid gap-3">
                    {dfmChecks.map((check) => (
                      <div key={check} className="flex items-center gap-3 rounded-lg bg-muted/45 p-3 text-sm font-semibold text-foreground">
                        <CheckCircle2 className="h-5 w-5 text-success" />
                        {check}
                      </div>
                    ))}
                  </div>
                  <Button asChild variant="outline" className="mt-5 w-full">
                    <Link href="/contact">Talk with an engineer</Link>
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="media" className="mt-5">
              <div className="grid gap-4 lg:grid-cols-3">
                {mediaItems.map((item) => (
                  <div key={item.title} className="overflow-hidden rounded-lg border border-border bg-card">
                    <div className="relative aspect-[4/3]">
                      <Image src={item.src} alt={item.title} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover" />
                    </div>
                    <div className="p-4">
                      <p className="text-xs font-black uppercase tracking-wider text-primary">{item.type}</p>
                      <h4 className="mt-1 font-black text-foreground">{item.title}</h4>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-card">
                  <Image src="/pcbimage/pcbs3.jpg" alt="Factory video poster" fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" />
                  <div className="absolute inset-0 bg-black/35" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-background/95 text-foreground shadow-lg">
                      <PlayCircle className="h-8 w-8 text-primary" />
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 to-transparent p-5">
                    <p className="text-sm font-bold text-white">Factory tour video section</p>
                  </div>
                </div>
                <div className="rounded-lg border border-border bg-muted/35 p-5">
                  <p className="flex items-center gap-2 text-sm font-black text-foreground">
                    <SlidersHorizontal className="h-4 w-4 text-primary" />
                    Media management slots
                  </p>
                  <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                    <p>Use these blocks for homepage banners, factory photos, product images, YouTube embeds, process videos, testimonial clips and campaign content.</p>
                    <p className="flex items-center gap-2 font-bold text-foreground">
                      <RotateCw className="h-4 w-4 text-primary" />
                      Replace assets anytime from CMS or local media.
                    </p>
                  </div>
                  <Button asChild className="mt-5 w-full">
                    <Link href="/products">Explore product media</Link>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            ["24h", "Prototype response"],
            ["100%", "AOI quality gate"],
            ["15+", "Homepage actions"],
            ["1 stop", "PCB + PCBA service"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-lg border border-border bg-card/75 p-5 text-center shadow-sm">
              <p className="text-3xl font-black tracking-tight text-foreground">{value}</p>
              <p className="mt-1 text-sm font-semibold text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-lg border border-primary/20 bg-primary/10 p-5 sm:flex-row sm:items-center">
          <div>
            <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-primary">
              <BadgeCheck className="h-4 w-4" />
              Conversion ready
            </p>
            <h3 className="mt-2 text-xl font-black text-foreground">Content, image, video and quote actions are now grouped for faster customer decisions.</h3>
          </div>
          <Button asChild variant="outline">
            <Link href="/contact">Request custom content</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

