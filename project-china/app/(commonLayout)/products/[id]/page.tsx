import { notFound } from "next/navigation";
import { ProductService } from "@/services/product.service";
import { ProductDetailsClient } from "./ProductDetailsClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const res = await ProductService.getProductBySlug(resolvedParams.id);
  const product = res?.data;

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.name} | FT PCB`,
    description: product.description || `View details for ${product.name}`,
  };
}

export default async function SingleProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const res = await ProductService.getProductBySlug(resolvedParams.id);
  const product = res?.data;

  if (!product) {
    notFound();
  }

  const productsResponse = await ProductService.getProducts();
  const allProducts = productsResponse?.data || [];
  const relatedByCategory = allProducts
    .filter((item) => item.slug !== product.slug && item.category === product.category)
    .slice(0, 4);
  const relatedProducts =
    relatedByCategory.length > 0
      ? relatedByCategory
      : allProducts.filter((item) => item.slug !== product.slug).slice(0, 4);

  let specs = {};
  try {
    const parsed = typeof product.specifications === 'string' 
      ? JSON.parse(product.specifications) 
      : product.specifications;
    specs = parsed || {};
  } catch (e) {
    console.error("Failed to parse specifications", e);
  }

  return <ProductDetailsClient product={product} specs={specs} relatedProducts={relatedProducts} />;
}
