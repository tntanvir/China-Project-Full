"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShoppingCart, Heart, Star, Shield, Truck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import type { IProduct } from "@/services/product.service";
import { useCartStore } from "@/store/cartStore";
import { ProductCard } from "../ProductCard";

export function ProductDetailsClient({
  product,
  specs,
  relatedProducts = [],
}: {
  product: IProduct;
  specs: Record<string, unknown>;
  relatedProducts?: IProduct[];
}) {
  const [activeTab, setActiveTab] = useState("description");
  const [mainImage, setMainImage] = useState(product.images?.[0] || "/image/chinaproject.png");
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="bg-[#0A0A10] min-h-screen pb-24 pt-32 text-white">
      <div className="mx-auto max-w-7xl px-4">
        
        {/* Back Link */}
        <Link href="/products" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-fuchsia-400 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Inventory
        </Link>

        <div className="grid gap-12 lg:grid-cols-2">
          
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-800 bg-[#12121A]">
              <Image 
                src={mainImage} 
                alt={product.name} 
                fill 
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              <button 
                onClick={() => toast.success(`${product.name} added to wishlist`)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-fuchsia-500/20 backdrop-blur-md p-3 rounded-full text-gray-300 hover:text-fuchsia-400 transition-colors border border-gray-700"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>
            
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img: string, i: number) => (
                  <button 
                    key={i} 
                    onClick={() => setMainImage(img)}
                    className={`relative aspect-square overflow-hidden rounded-xl border-2 transition-all ${mainImage === img ? 'border-fuchsia-500 opacity-100' : 'border-gray-800 opacity-60 hover:opacity-100'}`}
                  >
                    <Image src={img} alt={`${product.name} thumbnail`} fill sizes="(max-width: 1024px) 25vw, 120px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-block rounded-md bg-fuchsia-500/10 px-3 py-1 text-xs font-bold text-fuchsia-400 uppercase tracking-wider border border-fuchsia-500/20">
                {product.category}
              </span>
              {product.isFeatured && (
                <span className="inline-block rounded-md bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 uppercase tracking-wider border border-amber-500/20">
                  Featured
                </span>
              )}
              <div className="flex items-center text-amber-400 text-sm font-bold ml-auto bg-black/40 px-3 py-1 rounded-full border border-gray-800">
                <Star className="w-4 h-4 fill-amber-400 mr-1.5" />
                {product.rating || "5.0"} <span className="text-gray-500 ml-1.5 font-normal underline cursor-pointer">({product.reviewCount || 0} reviews)</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6 leading-tight">
              {product.name}
            </h1>
            
            <div className="mb-8">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                  ${(product.price || 0).toFixed(2)}
                </span>
                <span className="text-gray-500 text-lg">/ piece</span>
              </div>
              <p className={`text-sm font-bold flex items-center gap-2 ${(product.stock || 0) > 0 ? "text-emerald-400" : "text-red-400"}`}>
                <CheckCircle2 className="w-4 h-4" />
                {(product.stock || 0) > 0 ? `${product.stock} in stock` : "Currently out of stock"}
              </p>
            </div>

            <p className="text-gray-300 leading-relaxed text-lg mb-8">
              {product.description || "No detailed description available for this product."}
            </p>

            {/* Quantity & Actions */}
            <div className="bg-[#12121A] border border-gray-800 rounded-2xl p-6 mb-8">
              <div className="flex items-center gap-6 mb-6">
                <span className="text-sm font-bold text-gray-400">QUANTITY</span>
                <div className="flex items-center border border-gray-700 rounded-lg bg-black">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 hover:bg-gray-800 text-gray-300 transition-colors">-</button>
                  <span className="px-4 py-2 font-bold w-12 text-center text-white">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 hover:bg-gray-800 text-gray-300 transition-colors">+</button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={handleAddToCart}
                  disabled={(product.stock || 0) < 1}
                  size="lg" 
                  variant="outline" 
                  className="w-full h-14 border-fuchsia-500/50 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-300 rounded-xl font-bold text-lg"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
                </Button>
                <Button 
                  onClick={() => {
                    handleAddToCart();
                    window.location.href = "/checkout";
                  }}
                  disabled={(product.stock || 0) < 1}
                  size="lg" 
                  className="w-full h-14 bg-white text-black hover:bg-gray-200 rounded-xl font-black text-lg shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(217,70,239,0.4)] transition-all"
                >
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 border-y border-gray-800 py-6 mb-8">
              <div className="flex flex-col items-center text-center gap-2">
                <Shield className="w-6 h-6 text-fuchsia-400" />
                <span className="text-xs text-gray-400 font-medium">1 Year Warranty</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 border-x border-gray-800">
                <Truck className="w-6 h-6 text-fuchsia-400" />
                <span className="text-xs text-gray-400 font-medium">Global Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RotateCcw className="w-6 h-6 text-fuchsia-400" />
                <span className="text-xs text-gray-400 font-medium">30-Day Return</span>
              </div>
            </div>

          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-24">
          <div className="flex border-b border-gray-800 mb-8 overflow-x-auto no-scrollbar">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 text-sm font-bold uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab 
                    ? 'border-fuchsia-500 text-fuchsia-400' 
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="bg-[#12121A] border border-gray-800 rounded-3xl p-8 md:p-12">
            {activeTab === 'description' && (
              <div className="prose prose-invert max-w-none text-gray-300 leading-loose">
                <h3 className="text-2xl font-bold text-white mb-6">Product Overview</h3>
                <p>{product.description || "Detailed product information will be updated soon."}</p>
                <div className="grid sm:grid-cols-2 gap-8 mt-12">
                  <div className="bg-black/50 p-6 rounded-2xl border border-gray-800">
                    <p className="text-sm text-gray-500 mb-2">Minimum Order Quantity</p>
                    <p className="text-xl font-bold text-white">{product.minOrderQty ? `${product.minOrderQty} Pieces` : "1 Piece"}</p>
                  </div>
                  <div className="bg-black/50 p-6 rounded-2xl border border-gray-800">
                    <p className="text-sm text-gray-500 mb-2">Estimated Lead Time</p>
                    <p className="text-xl font-bold text-white">{product.leadTimeDays ? `${product.leadTimeDays} Business Days` : "Contact Support"}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div>
                <h3 className="text-2xl font-bold text-white mb-8">Technical Specifications</h3>
                {Object.keys(specs || {}).length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                    {Object.entries(specs || {}).map(([key, value]) => (
                      <div key={key} className="flex flex-col border-b border-gray-800 pb-4">
                        <span className="text-sm text-gray-500 capitalize mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="font-semibold text-white">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No technical specifications provided for this product.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="text-center py-16">
                <Star className="w-16 h-16 mx-auto text-gray-800 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Customer Reviews</h3>
                <p className="text-gray-500">Reviews for this product will appear here.</p>
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.2em] text-fuchsia-400">Related Products</p>
                <h2 className="mt-2 text-3xl font-black text-white">Customers also viewed</h2>
              </div>
              <Link href="/products" className="text-sm font-bold text-gray-400 transition-colors hover:text-fuchsia-400">
                View all products
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
