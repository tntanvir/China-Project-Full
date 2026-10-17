import { cache } from "react";

export interface IPage {
  id: string;
  sectionSlug: string;
  pageSlug: string;
  title: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  specifications?: PageSpecifications;
  faqs?: unknown;
  images: string[];
  videos: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export type PageSpecifications = {
  ctaPrimary?: string;
  ctaSecondary?: string;
  email?: string;
  factoryAddress?: string;
  shenzhenAddress?: string;
  phone?: string;
  stats?: { label: string; value: string }[];
  features?: { title: string; description: string }[];
  certifications?: string[];
  industries?: string[];
};

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

const now = "2026-06-15T00:00:00.000Z";

const homepagePages: IPage[] = [
  {
    id: "homepage-hero",
    sectionSlug: "homepage",
    pageSlug: "hero",
    title: "AI-Powered PCB Manufacturing",
    content:
      "Build reliable circuit boards with precision fabrication, assembly support, and engineering guidance.",
    specifications: {
      ctaPrimary: "Smart Quote",
      ctaSecondary: "PCBA Services",
    },
    images: ["/image/pcb1.png"],
    videos: [],
    status: "PUBLISHED",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "homepage-about",
    sectionSlug: "homepage",
    pageSlug: "about",
    title: "About FT PCB",
    content:
      "FT PCB provides PCB fabrication and assembly services for prototypes, startups, and production teams.",
    images: ["/image/pcb2.png"],
    specifications: {
      stats: [
        { label: "Years", value: "15+" },
        { label: "Clients", value: "10k+" },
        { label: "Yield", value: "99.9%" },
      ],
    },
    videos: [],
    status: "PUBLISHED",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "homepage-capability",
    sectionSlug: "homepage",
    pageSlug: "capability",
    title: "Manufacturing Capability",
    content:
      "From rigid PCB to SMT assembly, our static showcase highlights the main capabilities without backend APIs.",
    images: ["/image/pcb3.png"],
    specifications: {
      features: [
        {
          title: "Multilayer PCB",
          description: "Rigid, HDI, metal core, and advanced fabrication options.",
        },
        {
          title: "Assembly Support",
          description: "SMT, THT, mixed assembly, sourcing, and inspection support.",
        },
        {
          title: "Quality Control",
          description: "AOI, electrical testing, and process inspection checkpoints.",
        },
      ],
    },
    videos: [],
    status: "PUBLISHED",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "homepage-contact",
    sectionSlug: "homepage",
    pageSlug: "contact",
    title: "Contact Engineering",
    content:
      "Reach the team through the contact page. Backend submission APIs have been removed from this build.",
    images: ["/image/pcb4.png"],
    specifications: {
      email: "ft-osr@feitianpcb.com",
      factoryAddress: "Yanqian Industrial Cluster, Wuping County, Longyan City, Fujian Province, China",
      shenzhenAddress: "Fenghuang Zhi Gu, Country Garden, Tie Zai Road, Xixiang Street, Baoan District, Shenzhen, China",
      phone: "+86 189 2742 6587",
    },
    videos: [],
    status: "PUBLISHED",
    createdAt: now,
    updatedAt: now,
  },
];

export const PageService = {
  getPageBySlug: cache(async (sectionSlug: string, pageSlug: string): Promise<IApiResponse<IPage> | null> => {
    const page = homepagePages.find(
      (item) => item.sectionSlug === sectionSlug && item.pageSlug === pageSlug,
    );

    if (!page) {
      return null;
    }

    return {
      success: true,
      message: "Loaded static page",
      data: page,
    };
  }),

  getPagesBySection: cache(async (sectionSlug: string): Promise<IApiResponse<IPage[]>> => {
    return {
      success: true,
      message: "Loaded static pages",
      data: homepagePages.filter((item) => item.sectionSlug === sectionSlug),
    };
  }),
};
