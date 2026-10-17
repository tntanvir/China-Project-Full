"use client";

import { useMemo, useState } from "react";
import { Filter, Package, Search, SlidersHorizontal } from "lucide-react";

import { Input } from "@/components/ui/input";
import type { IProduct } from "@/services/product.service";
import { ProductCard } from "./ProductCard";

type SortOption = "newest" | "popular" | "price-low" | "price-high";

export function ProductCatalogClient({
  products,
  initialCategory = "all",
}: {
  products: IProduct[];
  initialCategory?: string;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [maxPrice, setMaxPrice] = useState("all");
  const [minRating, setMinRating] = useState("all");
  const [sort, setSort] = useState<SortOption>("newest");

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(products.map((product) => product.category).filter(Boolean)))],
    [products],
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products
      .filter((product) => {
        const price = product.price || 0;
        const rating = product.rating || 0;
        const matchesSearch =
          !query ||
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          (product.description || "").toLowerCase().includes(query);
        const matchesCategory = category === "all" || product.category === category;
        const matchesPrice = maxPrice === "all" || price <= Number(maxPrice);
        const matchesRating = minRating === "all" || rating >= Number(minRating);

        return matchesSearch && matchesCategory && matchesPrice && matchesRating;
      })
      .sort((a, b) => {
        if (sort === "popular") return (b.reviewCount || 0) - (a.reviewCount || 0);
        if (sort === "price-low") return (a.price || 0) - (b.price || 0);
        if (sort === "price-high") return (b.price || 0) - (a.price || 0);
        return Number(b.isFeatured) - Number(a.isFeatured);
      });
  }, [category, maxPrice, minRating, products, search, sort]);

  return (
    <section>
      <div className="mb-8 rounded-lg border border-border bg-card/90 p-4 shadow-sm backdrop-blur-xl">
        <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search PCB products..."
              className="h-11 rounded-full pl-10"
              aria-label="Search products"
            />
          </label>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="h-11 rounded-full border border-input bg-background px-4 text-sm font-semibold text-foreground"
            aria-label="Filter by category"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "All Categories" : item}
              </option>
            ))}
          </select>

          <select
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
            className="h-11 rounded-full border border-input bg-background px-4 text-sm font-semibold text-foreground"
            aria-label="Filter by price"
          >
            <option value="all">Any Price</option>
            <option value="15">Under $15</option>
            <option value="30">Under $30</option>
            <option value="50">Under $50</option>
          </select>

          <select
            value={minRating}
            onChange={(event) => setMinRating(event.target.value)}
            className="h-11 rounded-full border border-input bg-background px-4 text-sm font-semibold text-foreground"
            aria-label="Filter by rating"
          >
            <option value="all">Any Rating</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
            <option value="4.8">4.8+ Stars</option>
          </select>

          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortOption)}
            className="h-11 rounded-full border border-input bg-background px-4 text-sm font-semibold text-foreground"
            aria-label="Sort products"
          >
            <option value="newest">Newest</option>
            <option value="popular">Popularity</option>
            <option value="price-low">Price Low-High</option>
            <option value="price-high">Price High-Low</option>
          </select>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
          <p className="inline-flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Showing <strong className="text-foreground">{filteredProducts.length}</strong> of {products.length} products
          </p>
          <p className="inline-flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Search, category, price, rating and sorting are live.
          </p>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="premium-card py-24 text-center text-muted-foreground">
          <Package className="mx-auto mb-4 h-16 w-16 opacity-50" />
          <p className="mb-2 text-xl font-bold text-foreground">No matching products</p>
          <p className="text-sm">Try changing the search keyword or filters.</p>
        </div>
      )}
    </section>
  );
}

