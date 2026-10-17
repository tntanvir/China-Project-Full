import { sourceDictionary } from "@/lib/i18n";
import { getNavPageHref, getNavSectionHref } from "@/lib/navigation";
import { siteConfig } from "@/lib/site";
import fs from "fs";
import path from "path";

export type CmsFaq = {
  question: string;
  answer: string;
};

export type CmsContentBlock = {
  title: string;
  description: string;
};

export type CmsSplitFeature = {
  title: string;
  description: string;
  list: string[];
  imageSrc: string;
  imageAlt: string;
  imagePosition: "left" | "right";
};

export type CmsStat = {
  label: string;
  value: string;
  description: string;
};

export type CmsMedia = {
  src: string;
  title: string;
  caption: string;
  alt: string;
  description: string;
};

export type CmsVideo = {
  title: string;
  description: string;
  youtubeSearchUrl: string;
  embedSuggestion: string;
  placement: string;
};

export type CmsPageContent = {
  sectionSlug: string;
  pageSlug: string;
  sectionTitle: string;
  pageTitle: string;
  seoTitle: string;
  metaDescription: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  intro: string;
  articleTitle: string;
  article: string[];
  featuredBlocks: CmsContentBlock[];
  splitFeatures: CmsSplitFeature[];
  stats: CmsStat[];
  faq: CmsFaq[];
  intent: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaHref: string;
  ctaLabel: string;
  internalLinks: { title: string; href: string }[];
  relatedContent: { title: string; description: string; href: string }[];
  categories: string[];
  keywords: string[];
  schemaTypes: string[];
  featuredImage: CmsMedia;
  gallery: CmsMedia[];
  infographicIdeas: string[];
  bannerDesign: string;
  videos: CmsVideo[];
};

const imagePool = [
  "/image/pcb1.jpg",
  "/image/pcb2.jpg",
  "/image/pcb3.jpg",
  "/image/pcb4.jpg",
  "/image/pcb5.jpg",
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleCaseFromSlug(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function pickImages(seed: string) {
  const index = seed.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return [0, 1, 2, 3].map((offset) => imagePool[(index + offset) % imagePool.length]);
}

function getIntent(sectionTitle: string, pageTitle: string) {
  const lower = `${sectionTitle} ${pageTitle}`.toLowerCase();

  if (lower.includes("contact") || lower.includes("inquiry") || lower.includes("support")) {
    return "conversion";
  }

  if (lower.includes("faq") || lower.includes("blog") || lower.includes("privacy")) {
    return "knowledge";
  }

  if (lower.includes("product") || lower.includes("pcb") || lower.includes("assembly") || lower.includes("smt")) {
    return "technical";
  }

  if (lower.includes("team") || lower.includes("profile") || lower.includes("advantage")) {
    return "trust";
  }

  return "overview";
}

function buildArticle(sectionTitle: string, pageTitle: string, intent: string) {
  const lead =
    intent === "technical"
      ? `${pageTitle} is designed for buyers and engineering teams that need repeatable PCB production, predictable quality, and clear technical communication before manufacturing begins.`
      : intent === "knowledge"
        ? `${pageTitle} gives customers a practical understanding of how ${siteConfig.name} works, what to prepare, and how to make confident decisions before starting a PCB or PCBA project.`
        : intent === "conversion"
          ? `${pageTitle} helps visitors move from research to action with a clear path for sharing requirements, files, timelines, and commercial expectations.`
          : `${pageTitle} explains how ${siteConfig.legalName} supports customers with a disciplined process, experienced teams, and transparent production guidance.`;

  return [
    lead,
    `Within the ${sectionTitle} category, this page should help users quickly understand scope, process, expected outputs, and the business value behind the service. The content is structured for scanning first, then deeper reading for buyers who need more technical confidence.`,
    `${siteConfig.name} should present this topic with a premium enterprise tone: concise headlines, clear capability statements, practical examples, and strong calls to action. Visitors should always know what the page is about, why it matters, and what step to take next.`,
    `For SEO, the page targets specific long-tail searches around ${pageTitle.toLowerCase()}, PCB manufacturing, PCBA assembly, electronics production, quality control, and China-based manufacturing support. Internal links should connect users to quote, product, capability, and contact pages.`,
  ];
}

function buildFaq(pageTitle: string): CmsFaq[] {
  return [
    {
      question: `What is included in ${pageTitle}?`,
      answer: `${pageTitle} includes practical guidance, production considerations, quality expectations, and the recommended next step for customers preparing a PCB or PCBA project.`,
    },
    {
      question: `Who should read the ${pageTitle} page?`,
      answer: `This page is useful for engineers, sourcing managers, founders, hardware teams, and procurement teams comparing manufacturing partners.`,
    },
    {
      question: `Can ${siteConfig.name} support custom requirements?`,
      answer: `Yes. Customers can share Gerber files, BOM files, drawings, quantities, materials, and timelines so the engineering team can review the project requirements.`,
    },
    {
      question: "What is the best next step?",
      answer: "The best next step is to request a quote or contact the engineering team with your production files and expected delivery schedule.",
    },
  ];
}

function buildFeaturedBlocks(pageTitle: string, intent: string): CmsContentBlock[] {
  if (intent === "technical") {
    return [
      {
        title: "Engineering Review",
        description: `DFM-focused review for ${pageTitle.toLowerCase()} before production begins.`,
      },
      {
        title: "Production Readiness",
        description: "Clear material, tolerance, lead time, and quality checkpoints for repeatable manufacturing.",
      },
      {
        title: "Quality Assurance",
        description: "Inspection-first workflow with testing, process control, and final verification.",
      },
    ];
  }

  return [
    {
      title: "Clear Customer Journey",
      description: "Structured content helps users understand the topic and take action quickly.",
    },
    {
      title: "Premium Brand Trust",
      description: "Professional page content builds confidence for global electronics buyers.",
    },
    {
      title: "Conversion Focus",
      description: "Every page connects users to quote, contact, products, and related services.",
    },
  ];
}

function getRelated(sectionTitle: string, pageTitle: string) {
  const section = sourceDictionary.navbar.navItems.find((item) => item.title === sectionTitle);
  const siblingLinks =
    section?.items
      .filter((item) => item !== pageTitle)
      .slice(0, 3)
      .map((item) => ({
        title: item,
        description: `Explore how ${item.toLowerCase()} connects with ${pageTitle.toLowerCase()}.`,
        href: getNavPageHref(sectionTitle, item),
      })) ?? [];

  return siblingLinks.length
    ? siblingLinks
    : [
        {
          title: "PCB Quote",
          description: "Calculate or request pricing for your next production requirement.",
          href: "/pcb-quote",
        },
      ];
}

export function getCmsPageContent(sectionSlug: string, pageSlug: string): CmsPageContent | null {
  const section = sourceDictionary.navbar.navItems.find((item) => slugify(item.title) === sectionSlug);

  if (!section) {
    return null;
  }

  const pageTitle = section.items.find((item) => slugify(item) === pageSlug) ?? titleCaseFromSlug(pageSlug);
  const sectionTitle = section.title;
  const intent = getIntent(sectionTitle, pageTitle);
  const gallerySrcs = pickImages(`${sectionSlug}-${pageSlug}`);
  
  // Dynamic Image Logic
  const custom1 = `/images/categories/${sectionSlug}/${pageSlug}-1.jpg`;
  const custom2 = `/images/categories/${sectionSlug}/${pageSlug}-2.jpg`;
  const custom3 = `/images/categories/${sectionSlug}/${pageSlug}-3.jpg`;
  const customOld = `/images/categories/${sectionSlug}/${pageSlug}.jpg`;
  
  const basePath = path.join(process.cwd(), "public");
  const hasCustom1 = fs.existsSync(path.join(basePath, custom1));
  const hasCustom2 = fs.existsSync(path.join(basePath, custom2));
  const hasCustom3 = fs.existsSync(path.join(basePath, custom3));
  const hasCustomOld = fs.existsSync(path.join(basePath, customOld));

  const featuredSrc = hasCustom1 ? custom1 : (hasCustomOld ? customOld : gallerySrcs[0]);
  const split1Src = hasCustom1 ? custom1 : (hasCustomOld ? customOld : gallerySrcs[0]);
  const split2Src = hasCustom2 ? custom2 : gallerySrcs[1];

  const customGallery = [
    hasCustom1 ? custom1 : null,
    hasCustom2 ? custom2 : null,
    hasCustom3 ? custom3 : null,
    hasCustomOld ? customOld : null,
  ].filter(Boolean) as string[];

  const finalGallerySrcs = customGallery.length > 0 
    ? Array.from(new Set([...customGallery, ...gallerySrcs])).slice(0, 4)
    : gallerySrcs;

  const baseKeywords = [
    pageTitle,
    `${pageTitle} PCB`,
    `${sectionTitle} services`,
    "PCB manufacturing China",
    "PCBA assembly supplier",
    `${siteConfig.name} ${pageTitle}`,
  ];

  return {
    sectionSlug,
    pageSlug,
    sectionTitle,
    pageTitle,
    intent,
    seoTitle: `${pageTitle} | ${sectionTitle} | ${siteConfig.name}`,
    metaDescription: `${pageTitle} guidance from ${siteConfig.name}. Learn process, capabilities, media, FAQs, and next steps for PCB and PCBA manufacturing.`,
    heroEyebrow: sectionTitle,
    heroTitle: `${pageTitle} by ${siteConfig.name}`,
    heroDescription: `A complete premium resource for ${pageTitle.toLowerCase()}, built for engineers, sourcing teams, and electronics companies that need clarity before production.`,
    intro: `This page is dynamically generated from the ${sectionTitle} navigation structure and explains the purpose, value, media, and next step for ${pageTitle}.`,
    articleTitle: `Understanding ${pageTitle}`,
    article: [
      `The production of ${pageTitle.toLowerCase()} requires precise engineering and strict quality control. ${siteConfig.name} ensures that every step from raw material selection to final inspection meets international standards.`,
      `For engineers and sourcing teams, having a reliable partner for ${pageTitle.toLowerCase()} means fewer delays, reduced costs, and a more predictable supply chain. We focus on design for manufacturability (DFM) to catch potential issues early.`,
    ],
    featuredBlocks: buildFeaturedBlocks(pageTitle, intent),
    splitFeatures: [
      {
        title: `Advanced Technology for ${pageTitle}`,
        description: `We utilize industry-leading machinery and processes to ensure the highest quality for your ${pageTitle.toLowerCase()} requirements.`,
        list: [
          "State-of-the-art automated equipment",
          "Stringent quality control protocols",
          "Experienced engineering support",
        ],
        imageSrc: split1Src,
        imageAlt: `${pageTitle} technology in action`,
        imagePosition: "left",
      },
      {
        title: `Reliable Supply Chain`,
        description: `Our streamlined operations and strategic sourcing guarantee that your ${pageTitle.toLowerCase()} orders are fulfilled on time, every time.`,
        list: [
          "Global sourcing network",
          "Predictable lead times",
          "Scalable production capacity",
        ],
        imageSrc: split2Src,
        imageAlt: `${pageTitle} supply chain overview`,
        imagePosition: "right",
      }
    ],
    stats: [
      { label: "On-Time Delivery", value: "99.8%", description: "Consistent and reliable shipping" },
      { label: "Quality Yield", value: "99.5%", description: "First-pass yield rate" },
      { label: "Customer Satisfaction", value: "100%", description: "Dedicated support team" },
      { label: "Years Experience", value: "15+", description: "Industry expertise" },
    ],
    faq: buildFaq(pageTitle),
    ctaTitle: `Ready to discuss ${pageTitle}?`,
    ctaDescription: `Send your files, questions, or production requirements and the ${siteConfig.name} team can guide the next step.`,
    ctaHref: "/contact/sales-inquiry",
    ctaLabel: "Contact Engineering",
    internalLinks: [
      { title: "Products", href: "/products" },
      { title: "PCB Quote", href: "/pcb-quote" },
      { title: sectionTitle, href: getNavSectionHref(sectionTitle) },
    ],
    relatedContent: getRelated(sectionTitle, pageTitle),
    categories: [sectionTitle, pageTitle, intent, "PCB Manufacturing", "PCBA"],
    keywords: baseKeywords,
    schemaTypes: ["WebPage", "Article", "FAQPage", intent === "technical" ? "Service" : "Organization"],
    featuredImage: {
      src: featuredSrc,
      title: `${pageTitle} featured image`,
      caption: `${pageTitle} overview for ${siteConfig.name} customers.`,
      alt: `${pageTitle} PCB manufacturing and electronics production`,
      description: `Use this image as the main banner for ${pageTitle}, showing premium electronics manufacturing context.`,
    },
    gallery: finalGallerySrcs.map((src, index) => ({
      src,
      title: `${pageTitle} gallery ${index + 1}`,
      caption: `${pageTitle} visual reference ${index + 1}`,
      alt: `${pageTitle} production visual ${index + 1}`,
      description: `Supporting visual for the ${pageTitle} page gallery.`,
    })),
    infographicIdeas: [
      `${pageTitle} process flow from inquiry to delivery`,
      `${pageTitle} quality control checklist`,
      `${pageTitle} buyer decision matrix`,
    ],
    bannerDesign: `Premium ${sectionTitle} banner with PCB texture, soft blue/cyan gradient, crisp headline, and CTA button.`,
    videos: [
      {
        title: `${pageTitle} explained for PCB buyers`,
        description: `A short educational video introducing ${pageTitle}, common requirements, and how to prepare production files.`,
        youtubeSearchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${pageTitle} PCB manufacturing ${siteConfig.name}`)}`,
        embedSuggestion: `Search YouTube for "${pageTitle} PCB manufacturing" and embed the most relevant official or educational production video.`,
        placement: "Place below the introduction or beside the featured content blocks.",
      },
      {
        title: `${pageTitle} production workflow`,
        description: `A process-focused video showing manufacturing, assembly, inspection, or customer preparation steps related to ${pageTitle}.`,
        youtubeSearchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${pageTitle} PCBA assembly process`)}`,
        embedSuggestion: `Use a factory-process video that clearly shows ${pageTitle.toLowerCase()} or adjacent PCB/PCBA workflow.`,
        placement: "Place near the long-form article section as supporting educational media.",
      },
    ],
  };
}
