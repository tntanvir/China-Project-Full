"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDictionary } from "@/components/providers/language-provider";
import {
  DEFAULT_CATALOG_FAMILIES,
  resolveCatalogImageUrl,
  type ProductFamilyItem,
} from "@/lib/catalog-families";
import { CatalogService } from "@/services/catalog.service";
import {
  ArrowRight,
  Clock3,
  Grid,
  Microscope,
  Table,
  UploadCloud,
} from "lucide-react";

export type { ProductFamilyItem };
export const productFamiliesData = DEFAULT_CATALOG_FAMILIES;

export default function ProductCategoriesHub() {
  const dictionary = useDictionary();
  const prodCopy = dictionary.sections.products;
  const catCopy = dictionary.productCategories;

  const [catalogItems, setCatalogItems] = useState<ProductFamilyItem[]>(DEFAULT_CATALOG_FAMILIES);
  const [activeTab, setActiveTab] = useState<string>("All Families");
  const [viewMode, setViewMode] = useState<"grid" | "matrix">("grid");

  useEffect(() => {
    let active = true;
    CatalogService.getPublicCatalogFamilies().then((items) => {
      if (active && items.length > 0) {
        setCatalogItems(items);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const categoryTabs = useMemo(() => {
    const dynamicCategories = Array.from(new Set(catalogItems.map((item) => item.category)));
    return ["All Families", ...dynamicCategories];
  }, [catalogItems]);

  const categoryTabLabels: Record<string, string> = {
    "All Families": catCopy?.categories?.all || "All Families",
    "Rigid & Multilayer PCB": catCopy?.categories?.rigid || "Rigid & Multilayer PCB",
    "Flex & Rigid-Flex PCB": catCopy?.categories?.flex || "Flex & Rigid-Flex PCB",
    "Advanced & RF Substrates": catCopy?.categories?.advanced || "Advanced & RF Substrates",
    "Specialty & Metal Core PCB": "Specialty & Metal Core PCB",
  };

  const localizedFamilies = useMemo(() => {
    return catalogItems.map((item) => {
      const trans = catCopy?.items?.[item.id];
      if (!trans) return item;
      return {
        ...item,
        title: trans.title || item.title,
        subtitle: trans.subtitle || item.subtitle,
        description: trans.description || item.description,
        turnaround: trans.turnaround || item.turnaround,
        bestFor: trans.bestFor || item.bestFor,
      };
    });
  }, [catalogItems, catCopy]);

  const filteredFamilies = useMemo(() => {
    if (activeTab === "All Families") return localizedFamilies;
    return localizedFamilies.filter((item) => item.category === activeTab);
  }, [activeTab, localizedFamilies]);

  return (
    <section className="py-16 sm:py-24 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-3.5 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
            <span className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
            {catCopy?.eyebrow || prodCopy.eyebrow || "Comprehensive Manufacturing Spectrum"}
          </span>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {catCopy?.title || prodCopy.title || "PCB & PCBA Product Categories"}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-slate-300 sm:text-base">
            {catCopy?.description || prodCopy.description || "Explore our bare PCB and turnkey PCBA capabilities."}
          </p>
        </div>

        {/* Interactive Controls & Category Switcher Bar */}
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-200 dark:border-slate-800 pb-5">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2">
            {categoryTabs.map((tab) => {
              const count = tab === "All Families"
                ? catalogItems.length
                : catalogItems.filter((item) => item.category === tab).length;
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/20"
                      : "bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400"
                  }`}
                >
                  <span>{categoryTabLabels[tab] || tab}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                      isActive ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View Mode Switcher Toggle */}
          <div className="flex items-center gap-1 rounded-xl border border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80 p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                viewMode === "grid"
                  ? "bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-400 shadow-2xs"
                  : "text-gray-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-white/50 dark:hover:bg-slate-800/50"
              }`}
            >
              <Grid className="size-3.5" />
              <span>{catCopy?.viewGrid || "Card Grid"}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("matrix")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                viewMode === "matrix"
                  ? "bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-400 shadow-2xs"
                  : "text-gray-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-white/50 dark:hover:bg-slate-800/50"
              }`}
            >
              <Table className="size-3.5" />
              <span>{catCopy?.viewMatrix || "Comparison Matrix"}</span>
            </button>
          </div>
        </div>

        {/* View 1: Rich Visual Card Grid */}
        {viewMode === "grid" && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredFamilies.map((item) => (
              <article
                key={item.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-emerald-500/70 dark:hover:border-emerald-500 hover:shadow-xl dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300"
              >
                <div>
                  {/* Visual Example Image Banner with Badges */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100 dark:bg-slate-800">
                    <Image
                      src={resolveCatalogImageUrl(item.imageUrl)}
                      alt={item.title}
                      fill
                      unoptimized={item.imageUrl.includes("/uploads/") || item.imageUrl.startsWith("http://")}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    {/* Top Badges */}
                    <div className="absolute left-3 top-3 flex items-center gap-2">
                      <span className="rounded-md bg-gray-900/90 dark:bg-slate-900/90 backdrop-blur-xs px-2.5 py-1 text-[11px] font-black text-white shadow-xs">
                        {item.badge}
                      </span>
                    </div>

                    <div className="absolute right-3 top-3">
                      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600/95 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                        <Clock3 className="size-2.5" /> {item.turnaround}
                      </span>
                    </div>

                    {/* Gradient Overlay for subtle polish */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Body Information */}
                  <div className="p-5 sm:p-6">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      {item.category}
                    </div>

                    <h3 className="mt-1 text-lg font-black text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-slate-300 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Technical Specifications Grid */}
                    <div className="mt-4 rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-800/60 p-3.5">
                      <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                        {item.specs.map((spec, i) => (
                          <div key={i} className="flex flex-col">
                            <span className="text-[10px] text-gray-400 dark:text-slate-400 font-medium">{spec.label}</span>
                            <span className="font-bold text-gray-900 dark:text-slate-100 truncate" title={spec.value}>{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="border-t border-gray-100 dark:border-slate-800 p-5 pt-4 bg-gray-50/30 dark:bg-slate-900/60 flex items-center justify-between gap-3">
                  <Link
                    href={item.quoteUrl}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition"
                  >
                    <span>{catCopy?.labels?.instantQuote || "Instant Custom Quote"}</span>
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/gerber-view"
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-gray-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 shadow-2xs transition"
                  >
                    <UploadCloud className="size-3 text-emerald-600 dark:text-emerald-400" /> {catCopy?.labels?.viewSpecs || "Free DFM"}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* View 2: Technical Comparison Matrix */}
        {viewMode === "matrix" && (
          <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-800 bg-gray-50/90 dark:bg-slate-800/90 text-gray-700 dark:text-slate-300">
                    <th className="px-5 py-4 font-black text-gray-900 dark:text-white">{catCopy?.labels?.matrixHeaderProduct || "Product Family"}</th>
                    <th className="px-4 py-4 font-extrabold">{catCopy?.labels?.matrixHeaderArch || "Classification"}</th>
                    <th className="px-4 py-4 font-extrabold">Layer Capacity</th>
                    <th className="px-4 py-4 font-extrabold">Min Trace / Space</th>
                    <th className="px-4 py-4 font-extrabold">Core Materials</th>
                    <th className="px-4 py-4 font-extrabold">{catCopy?.labels?.matrixHeaderTurn || "Turnaround Speed"}</th>
                    <th className="px-5 py-4 font-extrabold text-right">{catCopy?.labels?.matrixHeaderAction || "Instant Action"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                  {filteredFamilies.map((item) => (
                    <tr key={item.id} className="hover:bg-emerald-50/40 dark:hover:bg-slate-800/60 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                            <Image
                              src={resolveCatalogImageUrl(item.imageUrl)}
                              alt={item.title}
                              fill
                              unoptimized={item.imageUrl.includes("/uploads/") || item.imageUrl.startsWith("http://")}
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-extrabold text-gray-900 dark:text-slate-100">{item.title}</div>
                            <div className="text-[11px] text-gray-500 dark:text-slate-400">{item.subtitle}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded-md bg-gray-100 dark:bg-slate-800 px-2.5 py-1 text-[11px] font-bold text-gray-700 dark:text-slate-300">
                          {item.category.split(" ")[0]}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-bold text-gray-900 dark:text-slate-100">
                        {item.badge}
                      </td>
                      <td className="px-4 py-4 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        {item.specs.find(s => s.label.includes("Trace"))?.value || item.specs[1]?.value || "Standard"}
                      </td>
                      <td className="px-4 py-4 text-gray-600 dark:text-slate-300 max-w-xs truncate" title={item.specs.find(s => s.label.includes("Surface") || s.label.includes("Substrate") || s.label.includes("Base"))?.value}>
                        {item.specs.find(s => s.label.includes("Surface") || s.label.includes("Substrate") || s.label.includes("Base"))?.value || "Standard IPC"}
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded text-[11px]">
                          {item.turnaround}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={item.quoteUrl}
                          className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-emerald-700 transition"
                        >
                          {catCopy?.labels?.instantQuote || "Quote"} <ArrowRight className="size-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bottom Fast Track: Drag-and-Drop Gerber & BOM Sourcing Shortcut */}
        <div className="mt-10 rounded-2xl border border-gray-200 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-900/60 p-6 sm:p-7">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="size-12 shrink-0 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <UploadCloud className="size-6" />
              </div>
              <div>
                <h4 className="text-base sm:text-lg font-black text-gray-900 dark:text-white">
                  {catCopy?.customTrack?.title || "Ready to start your PCB or PCBA build?"}
                </h4>
                <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-slate-300 max-w-xl">
                  {catCopy?.customTrack?.description || "Upload Gerber, ODB++, or BOM files for instant pricing and free DFM analysis."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0 w-full sm:w-auto">
              <Link
                href="/pcb-quote"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs sm:text-sm font-extrabold text-white shadow-md hover:bg-emerald-700 transition-all"
              >
                {catCopy?.customTrack?.uploadBtn || "Instant Quote"} <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/gerber-view"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-3 text-xs sm:text-sm font-extrabold text-gray-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 shadow-2xs transition-all"
              >
                <Microscope className="size-4 text-emerald-600 dark:text-emerald-400" /> {catCopy?.customTrack?.supportPill || "Gerber Viewer"}
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
