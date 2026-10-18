"use client";

import React from "react";
import { CreditCard, Truck, ShieldCheck, Share2 } from "lucide-react";
import { FT_SOCIAL_LINKS } from "@/lib/social";
import {
  FacebookIcon,
  TwitterBirdIcon,
  YouTubeIcon,
  LinkedInIcon,
  InstagramIcon,
  TikTokIcon,
} from "@/components/ui/SocialLinksBar";

export default function FooterTrustBadges() {
  const facebook = FT_SOCIAL_LINKS.find((s) => s.id === "facebook");
  const twitter = FT_SOCIAL_LINKS.find((s) => s.id === "twitter");
  const youtube = FT_SOCIAL_LINKS.find((s) => s.id === "youtube");
  const linkedin = FT_SOCIAL_LINKS.find((s) => s.id === "linkedin");
  const instagram = FT_SOCIAL_LINKS.find((s) => s.id === "instagram");
  const tiktok = FT_SOCIAL_LINKS.find((s) => s.id === "tiktok");

  return (
    <div className="w-full mt-6 mb-2">
      {/* ================= ROW 1: 3 COLUMNS (PAYMENT, DELIVERY, VERIFIED) ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 items-stretch">
        
        {/* ----- 1. PAYMENT METHODS ----- */}
        <div className="flex flex-col rounded-2xl border border-border/80 bg-card/60 p-4 sm:p-5 shadow-xs backdrop-blur-sm transition-all hover:border-border">
          <div className="flex items-center gap-2 mb-3.5">
            <CreditCard className="size-4 text-primary shrink-0" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Payment Methods
            </h4>
          </div>

          <div className="flex flex-col gap-1.5 flex-1 justify-center">
            {/* Row 1: 6 items */}
            <div className="grid grid-cols-6 gap-1.5">
              <span
                title="Payoneer"
                className="h-8 sm:h-9 flex items-center justify-center rounded-md border border-slate-200/90 bg-white p-1 shadow-2xs hover:border-primary/60 hover:shadow-xs hover:scale-105 transition-all"
              >
                <img
                  src="/images/footer/payment/payoneer.svg"
                  alt="Payoneer"
                  className="max-h-4 sm:max-h-5 w-auto object-contain"
                  loading="lazy"
                />
              </span>

              <span
                title="SEPA - Single Euro Payments Area"
                className="h-8 sm:h-9 flex items-center justify-center rounded-md border border-slate-200/90 bg-white p-1 shadow-2xs hover:border-primary/60 hover:shadow-xs hover:scale-105 transition-all"
              >
                <img
                  src="/images/footer/payment/sepa.svg"
                  alt="SEPA"
                  className="max-h-4 sm:max-h-5 w-auto object-contain"
                  loading="lazy"
                />
              </span>

              <span
                title="Direct Bank Transfer / Wire"
                className="h-8 sm:h-9 flex items-center justify-center rounded-md border border-slate-200/90 bg-white p-1 shadow-2xs hover:border-primary/60 hover:shadow-xs hover:scale-105 transition-all"
              >
                <img
                  src="/images/footer/payment/banktransfer_card.svg"
                  alt="Bank Transfer"
                  className="max-h-5 sm:max-h-5.5 w-auto object-contain"
                  loading="lazy"
                />
              </span>

              <span
                title="Wise Transfer"
                className="h-8 sm:h-9 flex items-center justify-center rounded-md border border-slate-200/90 bg-white p-1 shadow-2xs hover:border-primary/60 hover:shadow-xs hover:scale-105 transition-all"
              >
                <img
                  src="/images/footer/payment/wise.svg"
                  alt="Wise"
                  className="max-h-4 sm:max-h-5 w-auto object-contain"
                  loading="lazy"
                />
              </span>

              <span
                title="Google Pay"
                className="h-8 sm:h-9 flex items-center justify-center rounded-md border border-slate-200/90 bg-white p-1 shadow-2xs hover:border-primary/60 hover:shadow-xs hover:scale-105 transition-all"
              >
                <img
                  src="/images/footer/payment/googlepay.png"
                  alt="Google Pay"
                  className="max-h-4 sm:max-h-5 w-auto object-contain"
                  loading="lazy"
                />
              </span>

              <span
                title="Apple Pay"
                className="h-8 sm:h-9 flex items-center justify-center rounded-md border border-slate-200/90 bg-white p-1 shadow-2xs hover:border-primary/60 hover:shadow-xs hover:scale-105 transition-all"
              >
                <img
                  src="/images/footer/payment/applepay.png"
                  alt="Apple Pay"
                  className="max-h-4 sm:max-h-5 w-auto object-contain"
                  loading="lazy"
                />
              </span>
            </div>

            {/* Row 2: 8 items */}
            <div className="grid grid-cols-8 gap-1">
              <span
                title="VISA"
                className="h-8 sm:h-9 flex items-center justify-center rounded-md border border-slate-200/90 bg-white px-0.5 py-1 shadow-2xs hover:border-primary/60 hover:shadow-xs hover:scale-105 transition-all"
              >
                <img
                  src="/images/footer/payment/visa.png"
                  alt="VISA"
                  className="max-h-3 sm:max-h-3.5 w-auto object-contain"
                  loading="lazy"
                />
              </span>

              <span
                title="Mastercard"
                className="h-8 sm:h-9 flex items-center justify-center rounded-md border border-slate-200/90 bg-white px-0.5 py-1 shadow-2xs hover:border-primary/60 hover:shadow-xs hover:scale-105 transition-all"
              >
                <img
                  src="/images/footer/payment/mastercard.png"
                  alt="Mastercard"
                  className="max-h-4.5 sm:max-h-5 w-auto object-contain"
                  loading="lazy"
                />
              </span>

              <span
                title="Maestro"
                className="h-8 sm:h-9 flex items-center justify-center rounded-md border border-slate-200/90 bg-white px-0.5 py-1 shadow-2xs hover:border-primary/60 hover:shadow-xs hover:scale-105 transition-all"
              >
                <img
                  src="/images/footer/payment/maestro.svg"
                  alt="Maestro"
                  className="max-h-4 sm:max-h-4.5 w-auto object-contain"
                  loading="lazy"
                />
              </span>

              <span
                title="VISA Gold"
                className="h-8 sm:h-9 flex items-center justify-center rounded-md border border-slate-200/90 bg-white px-0.5 py-1 shadow-2xs hover:border-primary/60 hover:shadow-xs hover:scale-105 transition-all"
              >
                <img
                  src="/images/footer/payment/visagold_card.svg"
                  alt="VISA Gold"
                  className="max-h-4 sm:max-h-4.5 w-auto object-contain"
                  loading="lazy"
                />
              </span>

              <span
                title="JCB"
                className="h-8 sm:h-9 flex items-center justify-center rounded-md border border-slate-200/90 bg-white px-0.5 py-1 shadow-2xs hover:border-primary/60 hover:shadow-xs hover:scale-105 transition-all"
              >
                <img
                  src="/images/footer/payment/jcb.svg"
                  alt="JCB"
                  className="max-h-4 sm:max-h-4.5 w-auto object-contain"
                  loading="lazy"
                />
              </span>

              <span
                title="American Express"
                className="h-8 sm:h-9 flex items-center justify-center rounded-md border border-slate-200/90 bg-white px-0.5 py-1 shadow-2xs hover:border-primary/60 hover:shadow-xs hover:scale-105 transition-all"
              >
                <img
                  src="/images/footer/payment/amex.svg"
                  alt="American Express"
                  className="max-h-4 sm:max-h-4.5 w-auto object-contain"
                  loading="lazy"
                />
              </span>

              <span
                title="PayPal"
                className="h-8 sm:h-9 flex items-center justify-center rounded-md border border-slate-200/90 bg-white px-0.5 py-1 shadow-2xs hover:border-primary/60 hover:shadow-xs hover:scale-105 transition-all"
              >
                <img
                  src="/images/footer/payment/paypal.png"
                  alt="PayPal"
                  className="max-h-3 sm:max-h-3.5 w-auto object-contain"
                  loading="lazy"
                />
              </span>

              <span
                title="Discover"
                className="h-8 sm:h-9 flex items-center justify-center rounded-md border border-slate-200/90 bg-white px-0.5 py-1 shadow-2xs hover:border-primary/60 hover:shadow-xs hover:scale-105 transition-all"
              >
                <img
                  src="/images/footer/payment/discover.svg"
                  alt="Discover"
                  className="max-h-3 sm:max-h-3.5 w-auto object-contain"
                  loading="lazy"
                />
              </span>
            </div>
          </div>
        </div>

        {/* ----- 2. DELIVERY SERVICES ----- */}
        <div className="flex flex-col rounded-2xl border border-border/80 bg-card/60 p-4 sm:p-5 shadow-xs backdrop-blur-sm transition-all hover:border-border">
          <div className="flex items-center gap-2 mb-3.5">
            <Truck className="size-4 text-primary shrink-0" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Delivery Services
            </h4>
          </div>

          <div className="grid grid-cols-4 gap-1.5 flex-1 content-center">
            {/* Row 1 */}
            <span
              title="FedEx Express"
              className="h-8 sm:h-9 flex items-center justify-center rounded-md border border-slate-200/90 bg-white p-1 shadow-2xs hover:border-primary/60 hover:shadow-xs hover:scale-105 transition-all"
            >
              <img
                src="/images/footer/delivery/fedex.png"
                alt="FedEx Express"
                className="max-h-4.5 sm:max-h-5 w-auto object-contain"
                loading="lazy"
              />
            </span>

            <span
              title="UPS Preferred Carrier"
              className="h-8 sm:h-9 flex items-center justify-center rounded-md border border-slate-200/90 bg-white p-1 shadow-2xs hover:border-primary/60 hover:shadow-xs hover:scale-105 transition-all"
            >
              <img
                src="/images/footer/delivery/ups_card.svg"
                alt="UPS Preferred Carrier"
                className="max-h-5.5 sm:max-h-6 w-auto object-contain"
                loading="lazy"
              />
            </span>

            <span
              title="DHL Express"
              className="h-8 sm:h-9 flex items-center justify-center rounded-md border border-amber-300 bg-[#FFCC00] p-1 shadow-2xs hover:brightness-105 hover:shadow-xs hover:scale-105 transition-all"
            >
              <img
                src="/images/footer/delivery/dhl.png"
                alt="DHL Express"
                className="max-h-4 sm:max-h-4.5 w-auto object-contain"
                loading="lazy"
              />
            </span>

            <span
              title="China Post Air Mail"
              className="h-8 sm:h-9 flex items-center justify-center rounded-md border border-slate-200/90 bg-white p-1 shadow-2xs hover:border-primary/60 hover:shadow-xs hover:scale-105 transition-all"
            >
              <img
                src="/images/footer/delivery/chinapost_card.svg"
                alt="China Post Air Mail"
                className="max-h-5 sm:max-h-5.5 w-auto object-contain"
                loading="lazy"
              />
            </span>

            {/* Row 2 */}
            <span
              title="TNT Express"
              className="h-8 sm:h-9 flex items-center justify-center rounded-md border border-slate-200/90 bg-white p-1 shadow-2xs hover:border-primary/60 hover:shadow-xs hover:scale-105 transition-all"
            >
              <img
                src="/images/footer/delivery/tnt.png"
                alt="TNT"
                className="max-h-4.5 sm:max-h-5 w-auto object-contain"
                loading="lazy"
              />
            </span>

            <span
              title="EMS ePacket Express"
              className="h-8 sm:h-9 flex items-center justify-center rounded-md border border-slate-200/90 bg-white p-1 shadow-2xs hover:border-primary/60 hover:shadow-xs hover:scale-105 transition-all"
            >
              <img
                src="/images/footer/delivery/ems_epacket.svg"
                alt="EMS ePacket"
                className="max-h-4.5 sm:max-h-5 w-auto object-contain"
                loading="lazy"
              />
            </span>

            <span
              title="Hongkong Post Air Mail"
              className="h-8 sm:h-9 flex items-center justify-center rounded-md border border-slate-200/90 bg-white p-1 shadow-2xs hover:border-primary/60 hover:shadow-xs hover:scale-105 transition-all"
            >
              <img
                src="/images/footer/delivery/hkpost_card.svg"
                alt="Hongkong Post"
                className="max-h-5 sm:max-h-5.5 w-auto object-contain"
                loading="lazy"
              />
            </span>

            <span
              title="EMS Speedpost"
              className="h-8 sm:h-9 flex items-center justify-center rounded-md border border-slate-200/90 bg-white p-1 shadow-2xs hover:border-primary/60 hover:shadow-xs hover:scale-105 transition-all"
            >
              <img
                src="/images/footer/delivery/ems.png"
                alt="EMS Speedpost"
                className="max-h-4.5 sm:max-h-5 w-auto object-contain"
                loading="lazy"
              />
            </span>
          </div>
        </div>

        {/* ----- 3. VERIFIED BY ----- */}
        <div className="flex flex-col rounded-2xl border border-border/80 bg-card/60 p-4 sm:p-5 shadow-xs backdrop-blur-sm transition-all hover:border-border">
          <div className="flex items-center gap-2 mb-3.5">
            <ShieldCheck className="size-4 text-primary shrink-0" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              Verified by
            </h4>
          </div>

          <div className="grid grid-cols-3 gap-1.5 flex-1 content-center">
            {/* 1. ISO */}
            <span
              title="ISO 9001:2015 Quality Management Certified"
              className="h-8 sm:h-9 flex items-center justify-center rounded-md border border-slate-200/90 bg-[#004b97] p-1 shadow-2xs hover:brightness-110 hover:shadow-xs hover:scale-105 transition-all"
            >
              <img
                src="/images/footer/verified/iso.png"
                alt="ISO 9001"
                className="max-h-6 sm:max-h-7 w-auto object-contain brightness-110"
                loading="lazy"
              />
            </span>

            {/* 2. IATF 16949 */}
            <span
              title="IATF 16949:2016 Automotive Quality Certified"
              className="h-8 sm:h-9 flex items-center justify-center rounded-md border border-slate-200/90 bg-white p-1 shadow-2xs hover:border-primary/60 hover:shadow-xs hover:scale-105 transition-all"
            >
              <img
                src="/images/footer/verified/iatf.png"
                alt="IATF 16949"
                className="max-h-6.5 sm:max-h-7.5 w-auto object-contain"
                loading="lazy"
              />
            </span>

            {/* 3. UL Listed */}
            <span
              title="Underwriters Laboratories (UL Listed)"
              className="h-8 sm:h-9 flex items-center justify-center rounded-md border border-slate-200/90 bg-white p-1 shadow-2xs hover:border-primary/60 hover:shadow-xs hover:scale-105 transition-all"
            >
              <img
                src="/images/footer/verified/ul.png"
                alt="UL Listed"
                className="max-h-6.5 sm:max-h-7.5 w-auto object-contain"
                loading="lazy"
              />
            </span>

            {/* 4. CE RoHS Compliant */}
            <span
              title="CE & RoHS Compliant"
              className="h-8 sm:h-9 flex items-center justify-center rounded-md border border-slate-200/90 bg-white px-1.5 py-1 shadow-2xs hover:border-primary/60 hover:shadow-xs hover:scale-105 transition-all"
            >
              <img
                src="/images/footer/verified/ce-rohs.svg"
                alt="CE RoHS Compliant"
                className="max-h-5 sm:max-h-6 w-auto object-contain"
                loading="lazy"
              />
            </span>

            {/* 5. IAF */}
            <span
              title="IAF Multilateral Recognition Arrangement"
              className="h-8 sm:h-9 flex items-center justify-center rounded-md border border-slate-200/90 bg-white p-1 shadow-2xs hover:border-primary/60 hover:shadow-xs hover:scale-105 transition-all"
            >
              <img
                src="/images/footer/verified/iaf.png"
                alt="IAF Recognition"
                className="max-h-6 sm:max-h-7 w-auto object-contain"
                loading="lazy"
              />
            </span>

            {/* 6. CQC */}
            <span
              title="CQC China Quality Certification"
              className="h-8 sm:h-9 flex items-center justify-center rounded-md border border-slate-200/90 bg-white p-1 shadow-2xs hover:border-primary/60 hover:shadow-xs hover:scale-105 transition-all"
            >
              <img
                src="/images/footer/verified/cqc.svg"
                alt="CQC Certified"
                className="max-h-6 sm:max-h-7 w-auto object-contain"
                loading="lazy"
              />
            </span>
          </div>
        </div>

      </div>

      {/* ================= ROW 2: LINK US ON (UNDERNEATH) ================= */}
      <div className="mt-5 rounded-2xl border border-border/80 bg-card/60 p-3.5 sm:p-4.5 shadow-xs backdrop-blur-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-2xs">
            <Share2 className="size-4.5 sm:size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Link Us on
              </h4>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Official Channels
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
              Follow FT PCB for live fabrication video tours, CAM engineering tips & hardware updates
            </p>
          </div>
        </div>

        {/* Branded Interactive Social Pills */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Facebook */}
          <a
            href={facebook?.url || "https://www.facebook.com"}
            target="_blank"
            rel="noopener noreferrer"
            title="Follow FT PCB on Facebook"
            aria-label="Facebook"
            className="group inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/90 px-3 py-1.5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-xs hover:bg-card"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-2xs transition-transform duration-200 group-hover:scale-110">
              <FacebookIcon className="size-3.5" />
            </span>
            <span className="text-xs font-semibold text-foreground/90 transition-colors group-hover:text-primary">
              Facebook
            </span>
          </a>

          {/* Twitter / X */}
          <a
            href={twitter?.url || "https://x.com"}
            target="_blank"
            rel="noopener noreferrer"
            title="Follow FT PCB on Twitter / X"
            aria-label="Twitter / X"
            className="group inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/90 px-3 py-1.5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-xs hover:bg-card"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#55acee] text-white shadow-2xs transition-transform duration-200 group-hover:scale-110">
              <TwitterBirdIcon className="size-3.5" />
            </span>
            <span className="text-xs font-semibold text-foreground/90 transition-colors group-hover:text-primary">
              Twitter / X
            </span>
          </a>

          {/* YouTube */}
          <a
            href={youtube?.url || "https://www.youtube.com"}
            target="_blank"
            rel="noopener noreferrer"
            title="Subscribe to FT PCB on YouTube"
            aria-label="YouTube"
            className="group inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/90 px-3 py-1.5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-xs hover:bg-card"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#FF0000] text-white shadow-2xs transition-transform duration-200 group-hover:scale-110">
              <YouTubeIcon className="size-3.5" />
            </span>
            <span className="text-xs font-semibold text-foreground/90 transition-colors group-hover:text-primary">
              YouTube
            </span>
          </a>

          {/* LinkedIn */}
          <a
            href={linkedin?.url || "https://www.linkedin.com"}
            target="_blank"
            rel="noopener noreferrer"
            title="Connect with FT PCB on LinkedIn"
            aria-label="LinkedIn"
            className="group inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/90 px-3 py-1.5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-xs hover:bg-card"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#0A66C2] text-white shadow-2xs transition-transform duration-200 group-hover:scale-110">
              <LinkedInIcon className="size-3.5" />
            </span>
            <span className="text-xs font-semibold text-foreground/90 transition-colors group-hover:text-primary">
              LinkedIn
            </span>
          </a>

          {/* Instagram */}
          <a
            href={instagram?.url || "https://www.instagram.com"}
            target="_blank"
            rel="noopener noreferrer"
            title="Follow FT PCB on Instagram"
            aria-label="Instagram"
            className="group inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/90 px-3 py-1.5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-xs hover:bg-card"
          >
            <span
              className="flex size-6 shrink-0 items-center justify-center rounded-full text-white shadow-2xs transition-transform duration-200 group-hover:scale-110"
              style={{
                background:
                  "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
              }}
            >
              <InstagramIcon className="size-3.5" />
            </span>
            <span className="text-xs font-semibold text-foreground/90 transition-colors group-hover:text-primary">
              Instagram
            </span>
          </a>

          {/* TikTok */}
          <a
            href={tiktok?.url || "https://www.tiktok.com"}
            target="_blank"
            rel="noopener noreferrer"
            title="Watch FT PCB on TikTok"
            aria-label="TikTok"
            className="group inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/90 px-3 py-1.5 shadow-2xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-xs hover:bg-card"
          >
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#000000] text-white shadow-2xs transition-transform duration-200 group-hover:scale-110 border border-neutral-700/60">
              <TikTokIcon className="size-3.5" />
            </span>
            <span className="text-xs font-semibold text-foreground/90 transition-colors group-hover:text-primary">
              TikTok
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
