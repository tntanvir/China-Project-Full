"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  Award,
  Wrench,
  CheckCircle2,
  MessageSquareQuote,
  FileText,
  Download,
  Sparkles,
  Layers,
  Cpu,
  Boxes,
} from "lucide-react";

interface SubNavItem {
  id: string;
  title: string;
  icon: any;
  badge?: string;
}

const NAV_ITEMS: SubNavItem[] = [
  {
    id: "overview",
    title: "About FT-PCB",
    icon: Building2,
  },
  {
    id: "company-profile",
    title: "Company Profile",
    icon: FileText,
    badge: "42 Slides",
  },
  {
    id: "executive-team",
    title: "Executive Team",
    icon: Users,
  },
  {
    id: "core-advantages",
    title: "Core Advantages",
    icon: Award,
    badge: "3D Lab",
  },
  {
    id: "turnkey-services",
    title: "Turnkey Services",
    icon: Wrench,
  },
  {
    id: "business-scope",
    title: "Business Scope",
    icon: Boxes,
    badge: "Scope",
  },
  {
    id: "why-choose-us",
    title: "Why Choose Us",
    icon: CheckCircle2,
  },
  {
    id: "client-reviews",
    title: "Client Reviews",
    icon: MessageSquareQuote,
  },
];

export default function AboutSubNav() {
  const [activeSection, setActiveSection] = useState<string>("overview");

  useEffect(() => {
    // Scroll spy: observe sections
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const offsets = NAV_ITEMS.map((item) => {
        const el = document.getElementById(item.id);
        if (!el) return { id: item.id, top: -1 };
        const rect = el.getBoundingClientRect();
        return {
          id: item.id,
          top: rect.top + scrollY - 140, // 140px header offset
        };
      }).filter((o) => o.top !== -1);

      // Find the current active section
      for (let i = offsets.length - 1; i >= 0; i--) {
        if (scrollY >= offsets[i].top) {
          setActiveSection(offsets[i].id);
          return;
        }
      }
      if (offsets.length > 0) {
        setActiveSection(offsets[0].id);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: "smooth" });
      history.replaceState(null, "", `#${id}`);
      setActiveSection(id);
    }
  };

  return (
    <div className="border-b border-gray-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 py-2.5 overflow-x-auto scrollbar-none">
          <nav className="flex items-center gap-1.5 shrink-0">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => scrollTo(item.id, e)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/30 scale-[1.02]"
                      : "text-gray-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <Icon className={`size-3.5 ${isActive ? "text-white" : "text-gray-400 dark:text-slate-500"}`} />
                  <span>{item.title}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? "bg-white/25 text-white"
                          : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="/docs/FTpcb-Company-Profile.pdf"
              download="Wuping-Feitian-PCB-Company-Profile.pdf"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 transition shadow-xs"
              title="Download Full Company Profile (PDF 6.9MB)"
            >
              <Download className="size-3.5" />
              <span className="hidden sm:inline">PDF Profile</span>
              <span className="text-[10px] opacity-75 font-mono">(6.9MB)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
