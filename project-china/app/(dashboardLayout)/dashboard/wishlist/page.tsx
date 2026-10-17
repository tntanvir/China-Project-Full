import { Heart, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WishlistPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="premium-eyebrow">
          <Heart className="h-4 w-4" />
          Customer Wishlist
        </p>
        <h1 className="mt-3 text-3xl font-black text-foreground">Wishlist</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Saved products will appear here so customers can quickly compare PCB and PCBA services before ordering.
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-12 text-center shadow-sm">
        <Package className="mx-auto h-14 w-14 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-black text-foreground">No saved products yet</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Browse the catalog and save products you want to order later.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    </div>
  );
}
