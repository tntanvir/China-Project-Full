"use client";

import { motion } from "motion/react";
import { CheckCircle2, FileArchive, UploadCloud } from "lucide-react";

export default function GerberUploadScannerAnimation() {
  return (
    <div className="relative overflow-hidden rounded-lg border border-dashed border-primary/35 bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-full bg-primary/10 text-primary"><UploadCloud className="h-5 w-5" /></div>
          <div>
            <p className="text-sm font-black text-foreground">Gerber upload</p>
            <p className="text-xs text-muted-foreground">Layer scan and DFM preview</p>
          </div>
        </div>
        <CheckCircle2 className="h-5 w-5 text-success" />
      </div>
      <div className="relative mt-5 h-32 overflow-hidden rounded-lg border border-border bg-[#07111f]">
        <div className="absolute inset-4 rounded-md border border-cyan-300/20 bg-cyan-300/5" />
        <FileArchive className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-cyan-200" />
        <motion.div className="absolute inset-x-0 h-8 bg-linear-to-b from-transparent via-cyan-300/55 to-transparent" animate={{ y: [-32, 145] }} transition={{ duration: 1.25, repeat: Infinity, ease: "linear" }} />
      </div>
    </div>
  );
}
