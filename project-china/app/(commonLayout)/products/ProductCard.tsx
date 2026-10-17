"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import type { IProduct } from "@/services/product.service";
import { useCartStore } from "@/store/cartStore";

export function ProductCard({ product }: { product: IProduct }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  const discountPrice = product.price ? product.price * 0.9 : 0;


  return (
    <article className="premium-card group relative flex flex-col overflow-hidden transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-premium">
      <Link href={`/products/${product.slug}`} className="block" aria-label={`View ${product.name}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image 
          src={product.images?.[0] || "/image/chinaproject.png"}
          alt={product.name} 
          fill 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" 
          className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-80" />
        
        {product.isFeatured && (
          <div className="absolute left-3 top-3 rounded-full bg-[image:var(--gradient-primary)] px-3 py-1 text-xs font-bold text-primary-foreground shadow-lg">
            Featured
          </div>
        )}

        <button 
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            toast.success(`${product.name} added to wishlist`);
          }}
          className="absolute right-3 top-3 rounded-full border border-border/70 bg-background/70 p-2 text-muted-foreground backdrop-blur-md transition-colors hover:border-primary/50 hover:text-primary"
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>
      </Link>

      <div className="flex flex-1 flex-col p-6 relative z-10">
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            {product.category}
          </span>
          <div className="flex items-center text-warning text-xs font-bold">
            <Star className="mr-1 h-3 w-3 fill-warning" />
            {product.rating || "5.0"} <span className="ml-1 font-normal text-muted-foreground">({product.reviewCount || 0})</span>
          </div>
        </div>

        <Link href={`/products/${product.slug}`} className="mb-2 line-clamp-1 text-xl font-black tracking-tight text-foreground transition-colors hover:text-primary">
          {product.name}
        </Link>
        
        <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {product.description || "High-quality precision PCB engineered for maximum performance and durability in critical applications."}
        </p>

        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="mb-1 text-xs text-muted-foreground">Starting at</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-black text-foreground">${discountPrice.toFixed(2)}</p>
              {product.price ? <p className="text-sm text-muted-foreground line-through">${product.price.toFixed(2)}</p> : null}
            </div>
          </div>
          <div className="text-right">
            <p className="mb-1 text-xs text-muted-foreground">Status</p>
            <p className={`text-sm font-bold ${(product.stock || 0) > 0 ? "text-success" : "text-error"}`}>
              {(product.stock || 0) > 0 ? "In Stock" : "Out of Stock"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-auto">
          <Button 
            onClick={handleAddToCart}
            type="button"
            variant="outline" 
            className="w-full rounded-xl"
          >
            <ShoppingCart className="w-4 h-4 mr-2" /> Add
          </Button>
          <Button 
            type="button"
            onClick={() => {
              handleAddToCart();
              window.location.href = "/checkout";
            }}
            className="w-full rounded-xl font-bold"
          >
            Buy Now
          </Button>
        </div>
      </div>
    </article>
  );
}

