"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight, ShoppingCart } from "lucide-react";

export default function ProductCardHoverAnimation() {
  return (
    <motion.div whileHover={{ y: -8, rotateX: 4, rotateY: -5 }} transition={{ type: "spring", stiffness: 260, damping: 18 }} className="group overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#07111f]">
        <Image src="/image/pcb1.png" alt="Premium PCB product hover preview" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-110" />
        <motion.div className="absolute inset-y-0 -left-24 w-20 bg-white/25 blur-xl" animate={{ x: [0, 420] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }} />
      </div>
      <div className="p-5">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Hover card</p>
        <h3 className="mt-2 text-xl font-black text-foreground">Multilayer PCB</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Tilt, shine, CTA and product-image motion for premium service cards.</p>
        <div className="mt-5 flex gap-3">
          <button className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-black text-primary-foreground"><ShoppingCart className="h-4 w-4" /> Buy</button>
          <button className="inline-flex items-center gap-2 text-xs font-black text-primary">Details <ArrowRight className="h-4 w-4" /></button>
        </div>
      </div>
    </motion.div>
  );
}
