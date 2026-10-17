import HomePage from "@/components/module/Home/HomePage";
import { ProductService } from "@/services/product.service";
import { PageService } from "@/services/page.service";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

const Home = async () => {
  const [productsResponse, pagesResponse] = await Promise.all([
    ProductService.getProducts(),
    PageService.getPagesBySection("homepage")
  ]);
  
  const products = productsResponse.data || [];
  const homepageSections = pagesResponse?.data || [];

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.legalName,
    url: siteConfig.url,
    email: siteConfig.contactEmail,
    address: siteConfig.address,
    description: siteConfig.description,
  };

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <HomePage products={products} sections={homepageSections} />
    </>
  );
};

export default Home;
