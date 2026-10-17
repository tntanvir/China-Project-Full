"use client";

import { useState, type ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AU,
  BD,
  BR,
  CA,
  CN,
  DE,
  ES,
  FR,
  GB,
  IN,
  IT,
  JP,
  KR,
  PK,
  RU,
  SA,
  TR,
  US,
  AE,
  ZA,
} from "country-flag-icons/react/3x2";
import {
  ArrowRight,
  Calculator,
  Check,
  ChevronDown,
  Clock,
  Cpu,
  Layers3,
  Menu,
  ShoppingCart,
  Sparkles,
  UserRound,
  X,
  Zap,
} from "lucide-react";

import { ModeToggle } from "@/components/themes/darkandlight";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDictionary, useLanguage } from "@/components/providers/language-provider";
import {
  type CountryCode,
  type CountryOption,
  type NavItem,
  sourceDictionary,
} from "@/lib/i18n";
import { getNavPageHref, getNavSectionHref } from "@/lib/navigation";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import UserAccountMenu from "./UserAccountMenu";

function navLinkClass(isActive: boolean) {
  return [
    "inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-extrabold uppercase tracking-wide transition-all duration-150 whitespace-nowrap",
    isActive
      ? "bg-emerald-50 text-emerald-700 font-black shadow-xs ring-1 ring-emerald-500/20 dark:bg-emerald-950/60 dark:text-emerald-400"
      : "text-gray-700 dark:text-slate-300 hover:bg-emerald-50/70 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400",
  ].join(" ");
}

const flagComponents: Partial<
  Record<CountryCode, ComponentType<{ className?: string; title?: string }>>
> = {
  AU,
  BD,
  BR,
  CA,
  CN,
  DE,
  ES,
  FR,
  GB,
  IN,
  IT,
  JP,
  KR,
  PK,
  RU,
  SA,
  TR,
  US,
  AE,
  ZA,
};

function CountryFlag({ country, className }: { country: CountryOption; className?: string }) {
  const Flag = flagComponents[country.countryCode];

  if (!Flag) {
    return <span className={className ?? "h-3.5 w-5 rounded bg-muted"} suppressHydrationWarning />;
  }

  return (
    <span suppressHydrationWarning className="inline-flex shrink-0">
      <Flag title={country.label} className={className ?? "h-3.5 w-5 rounded object-cover shadow-xs"} />
    </span>
  );
}

function LanguageSelector() {
  const { countryOptions, selectedCountry, setSelectedCountry } = useLanguage();
  const dictionary = useDictionary();
  const usEnglish = countryOptions.find((c) => c.countryCode === "US") || countryOptions[1];
  const isEnglishActive = selectedCountry.locale === "en";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Select country and language"
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200/90 bg-white px-2.5 py-1.5 text-xs font-bold text-gray-700 shadow-xs hover:border-emerald-500 hover:bg-emerald-50/50 transition outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-500 dark:hover:bg-slate-800"
        >
          <CountryFlag country={selectedCountry} className="h-3.5 w-5 rounded-xs" />
          <span suppressHydrationWarning className="inline-flex items-center gap-1 text-[11px] font-black">
            {isEnglishActive ? (
              <>
                <span className="text-emerald-600 dark:text-emerald-400 font-black">EN</span>
                <span className="text-[10px] text-gray-400 font-semibold">({selectedCountry.shortLabel})</span>
              </>
            ) : (
              <span>{selectedCountry.shortLabel}</span>
            )}
          </span>
          <ChevronDown className="size-3 text-gray-400 dark:text-slate-500" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[340px] rounded-2xl border border-gray-200/90 bg-white p-2.5 text-gray-900 shadow-2xl backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-1 pb-1.5">
          <DropdownMenuLabel suppressHydrationWarning className="p-0 text-xs font-black uppercase tracking-wider text-gray-500 dark:text-slate-400">
            {dictionary.navbar.selectCountry}
          </DropdownMenuLabel>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60">
            {isEnglishActive ? "English Active" : `${selectedCountry.label} (${selectedCountry.shortLabel})`}
          </span>
        </div>

        {/* Primary English Quick Switcher */}
        {usEnglish ? (
          <button
            type="button"
            onClick={() => setSelectedCountry(usEnglish)}
            className={`w-full flex items-center justify-between rounded-xl border p-2.5 mb-2 transition-all text-left ${
              isEnglishActive
                ? "border-emerald-600 bg-emerald-50/90 text-emerald-950 font-bold dark:bg-emerald-950/70 dark:text-emerald-200 dark:border-emerald-500 shadow-xs"
                : "border-gray-200 bg-gray-50/80 hover:border-emerald-400 hover:bg-emerald-50/40 text-gray-800 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CountryFlag country={usEnglish} className="h-4.5 w-6.5 rounded-xs shrink-0 shadow-xs" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black leading-tight text-gray-900 dark:text-white">English (US / Global)</span>
                  <span className="rounded bg-emerald-100 px-1 py-0.2 text-[9px] font-black text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                    EN
                  </span>
                </div>
                <span className="block text-[10px] text-gray-500 dark:text-slate-400">Default global website language</span>
              </div>
            </div>
            {isEnglishActive ? (
              <span className="flex size-5 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xs">
                <Check className="size-3 stroke-[3]" />
              </span>
            ) : null}
          </button>
        ) : null}

        <div className="px-1 py-1 text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-slate-500 border-t border-gray-100 dark:border-slate-800">
          All Regions & Languages (20 Countries)
        </div>

        {/* 20 Countries Grid */}
        <div className="grid max-h-[290px] gap-1 overflow-y-auto sm:grid-cols-2 p-0.5">
          {countryOptions.map((country) => {
            const active = country.countryCode === selectedCountry.countryCode;
            const isEnglishCountry = country.locale === "en";

            return (
              <button
                key={country.countryCode}
                type="button"
                onClick={() => setSelectedCountry(country)}
                className={`flex items-center gap-2 rounded-xl border p-2 text-left transition-all ${
                  active
                    ? "border-emerald-600 bg-emerald-50 text-emerald-900 font-bold dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-600 shadow-xs"
                    : "border-gray-100 bg-gray-50/50 hover:border-emerald-400 hover:bg-emerald-50/40 text-gray-800 dark:border-slate-800/80 dark:bg-slate-800/50 dark:hover:bg-slate-800 dark:text-slate-200"
                }`}
              >
                <CountryFlag country={country} className="h-4 w-6 rounded-xs shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-1">
                    <span className="block truncate text-xs font-bold leading-tight">{country.label}</span>
                    <span className="text-[9px] font-extrabold text-gray-400 dark:text-slate-500 uppercase">
                      {isEnglishCountry ? "EN" : country.shortLabel}
                    </span>
                  </span>
                  <span className="block truncate text-[10px] text-gray-500 dark:text-slate-400">{country.nativeLabel}</span>
                </span>
              </button>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DesktopNavItem({ item, sourceItem }: { item: NavItem; sourceItem: NavItem }) {
  const pathname = usePathname();
  const sectionHref = getNavSectionHref(sourceItem.title);
  const isActive = pathname === sectionHref || pathname.startsWith(`${sectionHref}/`);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={`${navLinkClass(isActive)} outline-none`}
        >
          <span>{item.title}</span>
          <ChevronDown className="size-3 opacity-60 transition-transform group-hover:rotate-180" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={6}
        className="w-64 rounded-2xl border border-gray-200/90 bg-white/98 p-1.5 shadow-xl backdrop-blur-2xl text-gray-900 dark:border-slate-800 dark:bg-slate-900/98 dark:text-slate-100"
      >
        <DropdownMenuGroup>
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-500 dark:text-slate-400">{item.title}</span>
            <Link
              href={sectionHref}
              className="text-[10px] font-black text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              Overview →
            </Link>
          </div>
          <DropdownMenuSeparator className="my-1 dark:bg-slate-800" />
          <div className="grid gap-0.5">
            {item.items.map((sub, index) => (
              <DropdownMenuItem
                key={sub}
                asChild
              >
                <Link
                  href={getNavPageHref(sourceItem.title, sourceItem.items[index] ?? sub)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-emerald-50 hover:text-emerald-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
                >
                  <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="truncate">{sub}</span>
                </Link>
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const pcbCategories = [
  { name: "Rigid Multi-Layer PCB", badge: "1-32 Layers", tag: "Standard FR4", href: "/products?category=Rigid%20PCB" },
  { name: "Flexible Circuits (FPC)", badge: "Polyimide", tag: "Ultra-Thin", href: "/products?category=Flexible%20PCB" },
  { name: "Rigid-Flex Solutions", badge: "Dynamic Bend", tag: "High Density", href: "/products?category=Rigid-Flex%20PCB" },
  { name: "Aluminum Metal Core", badge: "1-3 W/mK", tag: "Thermal LED", href: "/products?category=Aluminum%20PCB" },
  { name: "High-Freq Rogers Board", badge: "Low Dk/Df", tag: "RF Microwave", href: "/products?category=High%20Frequency%20PCB" },
  { name: "HDI Microvia Boards", badge: "Laser Via", tag: "Any-Layer", href: "/products?category=HDI%20PCB" },
];

const pcbaCategories = [
  { name: "SMT Surface Mount Lines", badge: "0201 & BGA", tag: "High Speed", href: "/products?category=PCBA" },
  { name: "Through-Hole (THT)", badge: "Wave Solder", tag: "High Power", href: "/products?category=PCBA" },
  { name: "Box Build & Enclosures", badge: "Final Assembly", tag: "Full System", href: "/products?category=PCBA" },
  { name: "Turnkey Parts Sourcing", badge: "DigiKey/Mouser", tag: "100% Genuine", href: "/products?category=PCBA" },
  { name: "3D AOI & X-Ray Testing", badge: "100% Tested", tag: "Zero Defect", href: "/products?category=PCBA" },
];

function ProductsMegaMenu({ label }: { label?: string }) {
  const pathname = usePathname();
  const isActive = pathname === "/products" || pathname.startsWith("/products/");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={`${navLinkClass(isActive)} outline-none`}
        >
          <span>{label || "Products"}</span>
          <ChevronDown className="size-3 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        sideOffset={6}
        className="w-[min(840px,calc(100vw-2rem))] rounded-3xl border border-gray-200/90 bg-white/98 p-4 text-gray-900 shadow-2xl backdrop-blur-2xl dark:border-slate-800 dark:bg-slate-900/98 dark:text-slate-100"
      >
        <div className="grid gap-6 md:grid-cols-12">
          
          {/* Column 1: PCB Fabrication (5 Cols) */}
          <div className="md:col-span-5 space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <Cpu className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">PCB Fabrication</span>
              </div>
              <Link href="/products?category=PCB%20Fabrication" className="text-[11px] font-black text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300">
                All PCBs →
              </Link>
            </div>
            <div className="grid gap-1">
              {pcbCategories.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center justify-between rounded-xl p-2 text-xs transition hover:bg-emerald-50 hover:text-emerald-800 dark:hover:bg-slate-800/80 dark:hover:text-emerald-400"
                >
                  <div>
                    <div className="font-extrabold text-gray-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">{item.name}</div>
                    <div className="text-[10px] text-gray-400 dark:text-slate-500 font-medium">{item.tag}</div>
                  </div>
                  <span className="rounded bg-emerald-100/70 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                    {item.badge}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Column 2: Turnkey PCBA (4 Cols) */}
          <div className="md:col-span-4 space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <Layers3 className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white">PCBA Assembly</span>
              </div>
              <Link href="/products?category=PCBA" className="text-[11px] font-black text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300">
                All PCBA →
              </Link>
            </div>
            <div className="grid gap-1">
              {pcbaCategories.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center justify-between rounded-xl p-2 text-xs transition hover:bg-emerald-50 hover:text-emerald-800 dark:hover:bg-slate-800/80 dark:hover:text-emerald-400"
                >
                  <div>
                    <div className="font-extrabold text-gray-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">{item.name}</div>
                    <div className="text-[10px] text-gray-400 dark:text-slate-500 font-medium">{item.tag}</div>
                  </div>
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[9px] font-bold text-gray-600 group-hover:bg-emerald-100 group-hover:text-emerald-800 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-emerald-950 dark:group-hover:text-emerald-300">
                    {item.badge}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: Quick Quote CTA Card (3 Cols) */}
          <div className="md:col-span-3 flex flex-col justify-between rounded-2xl bg-gradient-to-br from-emerald-50 via-emerald-100/40 to-emerald-50 border border-emerald-200/80 p-4 dark:from-emerald-950/40 dark:via-slate-900/60 dark:to-emerald-950/30 dark:border-emerald-800/60">
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white shadow-xs">
                <Sparkles className="size-3" /> Special
              </span>
              <h4 className="mt-2 text-sm font-black text-gray-900 dark:text-white leading-tight">
                24H Prototype from $5.00
              </h4>
              <p className="mt-1 text-[11px] text-gray-600 dark:text-slate-400 leading-relaxed">
                Free automated DFM check. Instant quote in under 30 seconds.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60">
              <Link
                href="/pcb-quote"
                className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2 text-xs font-black text-white shadow-sm hover:bg-emerald-700 transition"
              >
                <Calculator className="size-3.5" />
                Instant Quote
                <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>

        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ProductsMobileGroup({ onNavigate, label }: { onNavigate: () => void; label?: string }) {
  return (
    <details className="rounded-xl border border-emerald-200 bg-emerald-50/50">
      <summary className="flex cursor-pointer list-none items-center justify-between px-3.5 py-2.5 text-xs font-black text-emerald-900 uppercase">
        {label || "Products Catalog"}
        <ChevronDown className="size-4 text-emerald-600" />
      </summary>
      <div className="grid gap-1 border-t border-emerald-200/70 p-2 text-xs">
        <Link
          href="/products"
          onClick={onNavigate}
          className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-black text-white text-center"
        >
          View All Products
        </Link>
        <div className="pt-2 text-[10px] font-black uppercase text-gray-400 px-1">PCB Fabrication</div>
        {pcbCategories.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={onNavigate}
            className="flex items-center justify-between rounded-lg px-2 py-1.5 font-bold text-gray-700 hover:bg-emerald-100/60"
          >
            <span>{item.name}</span>
            <span className="text-[10px] text-emerald-700 font-semibold">{item.badge}</span>
          </Link>
        ))}
        <div className="pt-2 text-[10px] font-black uppercase text-gray-400 px-1">PCBA Assembly</div>
        {pcbaCategories.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            onClick={onNavigate}
            className="flex items-center justify-between rounded-lg px-2 py-1.5 font-bold text-gray-700 hover:bg-emerald-100/60"
          >
            <span>{item.name}</span>
            <span className="text-[10px] text-gray-500 font-semibold">{item.badge}</span>
          </Link>
        ))}
      </div>
    </details>
  );
}

function MobileNavItem({
  item,
  sourceItem,
  onNavigate,
}: {
  item: NavItem;
  sourceItem: NavItem;
  onNavigate: () => void;
}) {
  return (
    <details className="rounded-xl border border-gray-200 bg-white">
      <summary className="flex cursor-pointer list-none items-center justify-between px-3.5 py-2.5 text-xs font-extrabold text-gray-800">
        <Link
          href={getNavSectionHref(sourceItem.title)}
          onClick={(event) => {
            event.stopPropagation();
            onNavigate();
          }}
        >
          {item.title}
        </Link>
        <ChevronDown className="size-4 text-gray-400" />
      </summary>
      <div className="grid gap-1 border-t border-gray-100 p-2 text-xs">
        {item.items.map((sub, index) => (
          <Link
            key={sub}
            href={getNavPageHref(sourceItem.title, sourceItem.items[index] ?? sub)}
            onClick={onNavigate}
            className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
          >
            {sub}
          </Link>
        ))}
      </div>
    </details>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const dictionary = useDictionary();
  const navItems = dictionary.navbar.navItems;
  const sourceNavItems = sourceDictionary.navbar.navItems;
  const homeItem = navItems[0];
  const navPairs = navItems.slice(1).map((item, index) => ({
    item,
    sourceItem: sourceNavItems[index + 1] ?? item,
  }));
  const productGroupTitles = new Set(["Products"]);
  const dropdownNavItems = navPairs.filter(({ sourceItem }) => !productGroupTitles.has(sourceItem.title));
  const productsNavLabel = navPairs.find(({ sourceItem }) => productGroupTitles.has(sourceItem.title))?.item.title || dictionary.navbar.explore || "Products";
  const { user } = useAuthStore();
  const cartCount = useCartStore((state) => state.items.length);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-xs dark:bg-slate-950 dark:border-b dark:border-slate-800">
      
      {/* ===================================================================== */}
      {/* 1. UPPER BRAND & ACTIONS BAR (Tier 1)                                  */}
      {/* ===================================================================== */}
      <div className="border-b border-gray-100 bg-white dark:border-slate-800/80 dark:bg-slate-950">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between gap-4 px-4 sm:px-6 py-2.5">
          
          {/* Brand Logo & Compact Name */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-3 group"
            title={dictionary.navbar.companyName}
          >
            <div className="relative flex items-center justify-center">
              <Image
                src="/images/chinaproject.png"
                alt={dictionary.navbar.logoAlt}
                width={375}
                height={210}
                priority
                className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col">
              <span suppressHydrationWarning className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 leading-none">
                {dictionary.navbar.badge || "DIRECT FACTORY"}
              </span>
              <span className="text-sm sm:text-base font-black tracking-tight text-gray-900 dark:text-white leading-tight group-hover:text-emerald-600 transition">
                Feitian <span className="text-emerald-600 dark:text-emerald-400">PCB</span>
              </span>
            </div>
          </Link>


          {/* Right Action Icons & Primary CTA */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Primary Emerald Quote Button */}
            <Link
              href="/pcb-quote"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 sm:px-4 py-2 text-xs font-black text-white shadow-sm shadow-emerald-600/30 hover:bg-emerald-700 transition active:scale-95"
            >
              <Zap className="size-3.5 fill-current" />
              <span>{dictionary.sections?.hero?.quoteBtn || "Instant Quote"}</span>
            </Link>

            {/* Shopping Cart Button */}
            <Link
              href="/cart"
              aria-label="Shopping cart"
              className="relative flex size-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-xs hover:border-emerald-500 hover:text-emerald-700 transition dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
            >
              <ShoppingCart className="size-4" />
              {cartCount > 0 ? (
                <span className="absolute -right-1.5 -top-1.5 flex size-4.5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-black text-white ring-2 ring-white dark:ring-slate-900">
                  {cartCount}
                </span>
              ) : null}
            </Link>

            {/* User Account / Sign In */}
            {user?.email ? (
              <UserAccountMenu user={user} />
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-bold text-gray-700 shadow-xs hover:border-emerald-500 hover:text-emerald-700 transition dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
              >
                <UserRound className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">{dictionary.navbar?.login || "Sign In"}</span>
              </Link>
            )}

            {/* Language Selector */}
            <LanguageSelector />

            {/* Theme Toggle */}
            <ModeToggle />

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              className="flex size-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-xs hover:border-emerald-500 lg:hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-emerald-500"
              onClick={() => setMobileOpen((value) => !value)}
              aria-expanded={mobileOpen}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. DEDICATED DESKTOP NAVIGATION BAR (Tier 2 - Zero Overflow!)          */}
      {/* ===================================================================== */}
      <div className="hidden border-b border-gray-200/80 bg-white/95 backdrop-blur-md lg:block dark:border-slate-800/80 dark:bg-slate-900/95">
        <div className="mx-auto flex max-w-[1380px] items-center justify-between px-4 sm:px-6">
          
          <nav className="flex items-center gap-1 py-1.5">
            {homeItem ? (
              <Link
                href="/"
                className={navLinkClass(pathname === "/")}
              >
                {homeItem.title}
              </Link>
            ) : null}

            <ProductsMegaMenu label={productsNavLabel} />

            {dropdownNavItems.map(({ item, sourceItem }) => (
              <DesktopNavItem
                key={item.title}
                item={item}
                sourceItem={sourceItem}
              />
            ))}
          </nav>

          {/* Right Secondary Trust Badge */}
          <div className="flex items-center gap-3 text-xs font-semibold text-gray-500 dark:text-slate-400">
            <Link
              href="/pcb-quote"
              className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 transition dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              <Sparkles className="size-3 text-emerald-600 dark:text-emerald-400" />
              <span>{dictionary.heroSlider?.badges?.[2] || "Free Automated DFM Check"}</span>
            </Link>
          </div>

        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. MOBILE SLIDE-DOWN DRAWER                                            */}
      {/* ===================================================================== */}
      {mobileOpen ? (
        <div className="border-b border-gray-200 bg-white p-4 lg:hidden shadow-lg animate-in slide-in-from-top-2 duration-150 dark:border-slate-800 dark:bg-slate-950">
          <div className="grid gap-2">
            
            {/* Quick Action Top in Mobile */}
            <Link
              href="/pcb-quote"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 p-2.5 text-xs font-black text-white shadow-sm"
            >
              <Calculator className="size-4" />
              Start Instant PCB Quote
            </Link>

            {homeItem ? (
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className={`rounded-xl px-3.5 py-2.5 text-xs font-black uppercase tracking-wider ${
                  pathname === "/" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400" : "text-gray-800 hover:bg-gray-50 dark:text-slate-200 dark:hover:bg-slate-900"
                }`}
              >
                {homeItem.title}
              </Link>
            ) : null}

            <ProductsMobileGroup onNavigate={() => setMobileOpen(false)} label={productsNavLabel} />

            {dropdownNavItems.map(({ item, sourceItem }) => (
              <MobileNavItem
                key={item.title}
                item={item}
                sourceItem={sourceItem}
                onNavigate={() => setMobileOpen(false)}
              />
            ))}

            <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-1 dark:border-slate-800">
              <LanguageSelector />
              <ModeToggle />
            </div>

          </div>
        </div>
      ) : null}

    </header>
  );
}
