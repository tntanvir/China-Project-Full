"use client";

import Link from "next/link";
import { ArrowRight, Cpu } from "lucide-react";

import VideoPanel from "@/components/module/Home/sections/VideoPanel";
import { ProductCard } from "@/app/(commonLayout)/products/ProductCard";
import { useDictionary } from "@/components/providers/language-provider";

import { IProduct } from "@/services/product.service";

export default function ProductsSection({ products = [] }: { products?: IProduct[] }) {
  const dictionary = useDictionary();
  const productsSec = dictionary.sections.products;

  return (
    <section className="border-y border-gray-800 bg-[#0A0A10] text-white">
      <div className="mx-auto max-w-7xl px-4 py-24">
        
        {/* Premium Header */}
        <div className="mb-16 text-center relative z-10">
          <div className="absolute inset-x-0 top-0 -z-10 h-[200px] bg-fuchsia-500/10 blur-[100px] rounded-full max-w-2xl mx-auto" />
          
          <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-4 py-1.5 text-sm font-medium text-fuchsia-300 mb-6 backdrop-blur-md">
            <Cpu className="size-4" />
            {productsSec.eyebrow}
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6">
            {productsSec.title}
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {productsSec.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products && products.length > 0 ? (
            products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              Loading premium products...
            </div>
          )}
        </div>
        
        <div className="mt-16 text-center">
          <Link href="/products" className="inline-flex items-center gap-2 text-sm font-bold text-black bg-white hover:bg-fuchsia-400 hover:text-white px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(217,70,239,0.4)] transition-all">
            {productsSec.allLink} <ArrowRight className="size-5" />
          </Link>
        </div>

        <div className="mt-24">
          <VideoPanel title={productsSec.videoTitle} poster={"/image/chinaproject.png"} />
        </div>
      </div>
    </section>
  );
}
