"use client";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ArrowRight, Info, Layers, Cpu, Settings, Wrench, Shield, PhoneCall } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const sectionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  home: Info,
  "about-ft-pcb": Info,
  products: Cpu,
  "pcb-manufacture": Settings,
  "pcb-assembly": Layers,
  capability: Wrench,
  "value-add-service": Shield,
  contact: PhoneCall,
};

export default function NavSectionPage() {
  const IconComponent = sectionIcons["value-add-service"] || Info;
  const items = [
  {
    "title": "Component Sourcing",
    "href": "/value-add-service/component-sourcing",
    "imagePath": "/images/categories/default.jpg",
    "pageSlug": "component-sourcing"
  },
  {
    "title": "Cable Harness",
    "href": "/value-add-service/cable-harness",
    "imagePath": "/images/categories/default.jpg",
    "pageSlug": "cable-harness"
  },
  {
    "title": "Coating",
    "href": "/value-add-service/coating",
    "imagePath": "/images/categories/default.jpg",
    "pageSlug": "coating"
  },
  {
    "title": "Programming",
    "href": "/value-add-service/programming",
    "imagePath": "/images/categories/default.jpg",
    "pageSlug": "programming"
  },
  {
    "title": "Stencil",
    "href": "/value-add-service/stencil",
    "imagePath": "/images/categories/default.jpg",
    "pageSlug": "stencil"
  }
];

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 sm:py-16">
      <nav className="flex items-center gap-2 text-xs font-medium text-muted-foreground sm:text-sm">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 shrink-0" />
        <span className="text-foreground truncate">Value Add Service</span>
      </nav>

      <div className="mt-8 rounded-2xl border border-border/70 bg-muted/20 p-8 sm:p-12 md:flex md:items-center md:justify-between md:gap-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background px-3 py-1 text-xs font-medium text-primary">
            <IconComponent className="h-4 w-4" />
            Category Explorer
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
            Value Add Service
          </h1>
          <p className="mt-4 text-base text-muted-foreground sm:text-lg">
            Select one of the topics below to learn more about our services, standards, and capabilities.
          </p>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Subtopics under Value Add Service
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link key={item.title} href={item.href} className="group">
              <Card className="flex h-full flex-col overflow-hidden border-border/70 transition duration-300 group-hover:border-primary group-hover:shadow-md">
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                  <Image 
                    src={item.imagePath} 
                    alt={item.title} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-70" />
                  <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-xl bg-background/20 text-white backdrop-blur-md border border-white/20 shadow-lg transition-transform duration-300 group-hover:-translate-y-1">
                    <IconComponent className="h-6 w-6" />
                  </div>
                </div>
                
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      Explore detailed metrics, equipment, and capabilities for {item.title.toLowerCase()}.
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-sm font-bold text-primary">
                    Learn more <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-16 rounded-2xl bg-foreground p-8 text-background sm:p-12 md:flex md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Need custom parameters or a quick quote?
          </h2>
          <p className="mt-2 max-w-xl text-sm text-background/70">
            Our engineering team is ready to analyze your PCB design files and provide a technical review with cost evaluation.
          </p>
        </div>
        <div className="mt-6 shrink-0 md:mt-0">
          <Button asChild variant="secondary" size="lg">
            <Link href="/contact/sales-inquiry">Contact Engineering</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}