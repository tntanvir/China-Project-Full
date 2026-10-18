"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUp, Mail, MapPin, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useDictionary } from "@/components/providers/language-provider";
import { sourceDictionary } from "@/lib/i18n";
import { getNavPageHref } from "@/lib/navigation";
import { SocialLinksRow } from "@/components/ui/SocialLinksBar";
import FooterTrustBadges from "./FooterTrustBadges";

export default function Footer() {
  const dictionary = useDictionary();
  const footer = dictionary.footer;
  const columns = dictionary.navbar.navItems.slice(1, 5);
  const sourceColumns = sourceDictionary.navbar.navItems.slice(1, 5);

  return (
    <footer className="relative overflow-hidden border-t border-border/70 bg-card/80 text-card-foreground backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[image:var(--gradient-primary)] opacity-70" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

      <div className="premium-container pt-12 lg:pt-16 pb-4">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_2fr]">
          <div className="max-w-md">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-background shadow-soft">
                <Image
                  src="/image/chinaproject.png"
                  alt={dictionary.navbar.logoAlt}
                  width={44}
                  height={44}
                  className="object-contain"
                  style={{ width: "44px", height: "44px" }}
                />
              </span>
              <span>
                <span className="block text-xs font-black uppercase tracking-[0.24em] text-primary">
                  {dictionary.navbar.badge}
                </span>
                <span className="block text-xl font-black tracking-tight">FT PCB</span>
              </span>
            </Link>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              {footer.description}
            </p>

            <div className="mt-7 grid gap-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-primary" />
                <span className="grid gap-1 text-muted-foreground">
                  {footer.addressVal.split(" | ").map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </span>
              </div>
              <a href={`mailto:${footer.emailVal}`} className="flex items-center gap-3 text-muted-foreground transition hover:text-primary">
                <Mail className="h-4 w-4 text-primary" />
                {footer.emailVal}
              </a>
              <a href={`tel:${footer.phoneVal}`} className="flex items-center gap-3 text-muted-foreground transition hover:text-primary">
                <Phone className="h-4 w-4 text-primary" />
                {footer.phoneVal}
              </a>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {columns.map((column, columnIndex) => {
              const sourceColumn = sourceColumns[columnIndex];
              if (!sourceColumn) return null;

              return (
                <div key={column.title}>
                  <h3 className="text-sm font-black uppercase tracking-[0.18em] text-foreground">
                    {column.title}
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {column.items.slice(0, 6).map((item, itemIndex) => (
                      <li key={item}>
                        <Link
                          href={getNavPageHref(sourceColumn.title, sourceColumn.items[itemIndex] ?? item)}
                          className="text-sm font-medium text-muted-foreground transition hover:text-primary"
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Global Footer Trust & Methods: Payment, Delivery, Verified By, Social Links */}
        <FooterTrustBadges />

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-border/70 pt-3 pb-0 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-3">
            <p>{footer.copyright}</p>
            <span className="hidden sm:inline text-border">•</span>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group inline-flex items-center gap-1.5 font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              aria-label="Back to top"
            >
              <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:-translate-y-0.5">
                <ArrowUp className="size-3" />
              </span>
              <span>Back to top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
