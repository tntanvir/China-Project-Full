"use client";

import type { SVGProps } from "react";
import { FT_SOCIAL_LINKS, type SocialLink } from "@/lib/social";
import { ArrowUpRight, MessageCircle } from "lucide-react";

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function YouTubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function XTwitterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function TwitterBirdIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

export function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

export function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.901 2.884 2.896 2.896 0 0 1-2.896-2.884 2.896 2.896 0 0 1 2.896-2.884c.489 0 .947.126 1.35.347V9.654a6.34 6.34 0 0 0-1.35-.145A6.343 6.343 0 0 0 3.13 15.856a6.343 6.343 0 0 0 6.343 6.343 6.343 6.343 0 0 0 6.343-6.343V8.818a8.214 8.214 0 0 0 4.773 1.516v-3.44a4.834 4.834 0 0 1-1-.208z" />
    </svg>
  );
}

export function SocialIcon({
  id,
  className = "size-4",
  twitterVariant = "bird",
}: {
  id: SocialLink["id"];
  className?: string;
  twitterVariant?: "x" | "bird";
}) {
  switch (id) {
    case "facebook":
      return <FacebookIcon className={className} />;
    case "whatsapp":
      return <WhatsAppIcon className={className} />;
    case "youtube":
      return <YouTubeIcon className={className} />;
    case "twitter":
      return twitterVariant === "x" ? (
        <XTwitterIcon className={className} />
      ) : (
        <TwitterBirdIcon className={className} />
      );
    case "instagram":
      return <InstagramIcon className={className} />;
    case "linkedin":
      return <LinkedInIcon className={className} />;
    case "tiktok":
      return <TikTokIcon className={className} />;
    default:
      return null;
  }
}

/**
 * Clean, compact social media icon row for footers, headers, and sidebars.
 */
export function SocialLinksRow({
  className = "",
  exclude = [],
}: {
  className?: string;
  exclude?: string[];
}) {
  const filteredLinks = FT_SOCIAL_LINKS.filter((l) => !exclude.includes(l.id));

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {filteredLinks.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          title={`Follow FT PCB on ${link.name}`}
          aria-label={`FT PCB on ${link.name}`}
          className="group relative flex size-9 items-center justify-center rounded-xl border border-gray-200/90 bg-white text-gray-600 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-emerald-500 dark:hover:text-emerald-400"
        >
          <SocialIcon id={link.id} className="size-4 transition-transform group-hover:scale-110" />
        </a>
      ))}
    </div>
  );
}

/**
 * Rich interactive cards grid for the Contact page and Homepage inquiry section.
 */
export function SocialLinksCardGrid({ className = "" }: { className?: string }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 ${className}`}>
      {FT_SOCIAL_LINKS.map((link) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center justify-between rounded-2xl border border-gray-200/90 bg-white p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-emerald-500"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-xl text-white shadow-xs transition-transform group-hover:scale-105"
              style={{ backgroundColor: link.color }}
            >
              <SocialIcon id={link.id} className="size-5" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-xs font-black text-gray-900 dark:text-white leading-tight">
                  {link.name}
                </span>
                <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.2 text-[9px] font-bold text-gray-600 dark:bg-slate-800 dark:text-slate-300">
                  {link.badge}
                </span>
              </div>
              <p className="truncate text-[11px] text-gray-500 dark:text-slate-400 mt-0.5 font-medium">
                {link.handle}
              </p>
            </div>
          </div>
          <ArrowUpRight className="size-4 shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-emerald-600 dark:text-slate-500 dark:group-hover:text-emerald-400 ml-2" />
        </a>
      ))}
    </div>
  );
}

/**
 * Global Floating WhatsApp Button positioned in the bottom-right for instant 24/7 engineering chat.
 */
export function FloatingWhatsAppWidget() {
  const whatsapp = FT_SOCIAL_LINKS.find((l) => l.id === "whatsapp")!;

  return (
    <aside aria-label="Instant WhatsApp support" className="fixed bottom-6 right-6 z-40 flex items-center gap-2 group pointer-events-none">
      <div className="hidden sm:block opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-200">
        <div className="rounded-xl border border-gray-200/90 bg-white/95 px-3 py-1.5 text-xs font-bold text-gray-800 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 dark:text-slate-100 flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Chat on WhatsApp</span>
        </div>
      </div>

      <a
        href={whatsapp.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with FT PCB Engineering on WhatsApp"
        className="pointer-events-auto relative flex size-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/35 transition-all duration-200 hover:scale-110 active:scale-95 hover:shadow-xl hover:shadow-[#25D366]/50 focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
      >
        <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-emerald-700 text-[9px] font-black text-white ring-2 ring-white dark:ring-slate-950">
          ●
        </span>
        <WhatsAppIcon className="size-7" />
      </a>
    </aside>
  );
}
