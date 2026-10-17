"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck, CircuitBoard, Cpu, ShieldCheck, Sparkles, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { IPage } from "@/services/page.service";

const trustItems = [
  { icon: ShieldCheck, label: "AI DFM Analysis" },
  { icon: Zap, label: "24h Fast Turnaround" },
  { icon: BadgeCheck, label: "100% AOI Tested" },
];

export default function HeroSection({ data }: { data?: IPage }) {
  if (!data) return null;

  const [firstWord, ...restTitle] = data.title.split(" ");

  return (
    <section className="premium-section min-h-[calc(100vh-5rem)] border-b border-border/70">
      <div className="premium-grid-bg pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute left-1/2 top-10 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/20 blur-[110px]" />
      <div className="premium-container relative z-10 grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div className="max-w-3xl space-y-8">
          <div className="premium-eyebrow">
            <Cpu className="h-4 w-4" />
            AI-powered smart factory
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl font-black tracking-[-0.045em] text-foreground sm:text-6xl lg:text-7xl">
              <span className="block">{firstWord}</span>
              <span className="premium-gradient-text">{restTitle.join(" ")}</span>
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
              {data.content}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/pcb-quote">
                {data.specifications?.ctaPrimary || "Smart AI Quote"}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link href="/pcb-assembly">
                {data.specifications?.ctaSecondary || "PCBA Services"}
              </Link>
            </Button>
          </div>

          <div className="grid gap-3 border-t border-border/70 pt-6 sm:grid-cols-3">
            {trustItems.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.label} className="flex items-center gap-3 rounded-2xl bg-card/60 px-4 py-3 text-sm font-bold text-foreground shadow-sm ring-1 ring-border/70">
                  <Icon className="h-5 w-5 text-primary" />
                  {item.label}
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-5 rounded-[2rem] bg-primary/20 blur-3xl" />
          <div className="premium-glass animate-premium-float relative rounded-[2rem] p-5 sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-lg font-black tracking-tight">
                  <CircuitBoard className="h-5 w-5 text-primary" />
                  Instant PCB Quote
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Configure common specs in seconds.
                </p>
              </div>
              <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-success">
                Live
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Length
                </span>
                <Input type="number" placeholder="100 mm" />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Width
                </span>
                <Input type="number" placeholder="100 mm" />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Layers
                </span>
                <Select defaultValue="2">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Layer</SelectItem>
                    <SelectItem value="2">2 Layers</SelectItem>
                    <SelectItem value="4">4 Layers</SelectItem>
                    <SelectItem value="6">6 Layers</SelectItem>
                  </SelectContent>
                </Select>
              </label>
              <label className="space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Quantity
                </span>
                <Select defaultValue="10">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 pcs</SelectItem>
                    <SelectItem value="10">10 pcs</SelectItem>
                    <SelectItem value="50">50 pcs</SelectItem>
                    <SelectItem value="100">100 pcs</SelectItem>
                  </SelectContent>
                </Select>
              </label>
            </div>

            <div className="mt-6 rounded-3xl border border-border/80 bg-background/70 p-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-muted-foreground">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Estimate from
                  </p>
                  <p className="mt-1 text-4xl font-black tracking-tight text-foreground">$2.00</p>
                </div>
                <Button asChild className="rounded-full">
                  <Link href="/pcb-quote">Full quote</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

