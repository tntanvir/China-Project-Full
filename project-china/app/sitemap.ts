import type { MetadataRoute } from "next";

import { getNavPageParams, getNavSectionParams } from "@/lib/navigation";
import { ProductService } from "@/services/product.service";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productsResponse = await ProductService.getProducts();
  const now = new Date();

  const staticRoutes = [
    "",
    "/products",
    "/contact",
    "/pcb-quote",
    "/pcb-assembly",
    "/ai-manufacturing",
  ];

  const navSectionRoutes = getNavSectionParams().map(({ section }) => `/${section}`);
  const navPageRoutes = getNavPageParams().map(({ section, page }) => `/${section}/${page}`);
  const productRoutes = productsResponse.data.map((product) => `/products/${product.slug}`);

  return [...staticRoutes, ...navSectionRoutes, ...navPageRoutes, ...productRoutes].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
