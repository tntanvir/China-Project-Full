"use client";

import Image from "next/image";
import { ShieldCheck } from "lucide-react";

import SectionHeader from "@/components/module/Home/sections/SectionHeader";
import VideoPanel from "@/components/module/Home/sections/VideoPanel";
import { IPage } from "@/services/page.service";

export default function QualitySection({ data }: { data?: IPage }) {
  if (!data) return null;

  return (
    <section className="bg-[#0A0A10] py-24 relative overflow-hidden border-t border-border/10">
      <div className="mx-auto max-w-7xl px-4 relative z-10">
        <SectionHeader
          eyebrow="Zero Defect Policy"
          title={data.title}
          description={data.content || ""}
        />
        
        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_1fr] items-center">
          <div className="grid gap-4 sm:grid-cols-2">
            {data.specifications?.certifications?.map((cert: string, index: number) => (
              <div key={index} className="group rounded-2xl border border-gray-800 bg-[#12121A]/50 backdrop-blur-md p-6 hover:border-fuchsia-500/30 transition-all duration-300">
                <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-fuchsia-500/10 p-3">
                  <ShieldCheck className="size-6 text-fuchsia-400 group-hover:scale-110 transition-transform" />
                </div>
                <h4 className="text-lg font-bold text-white">{cert}</h4>
              </div>
            ))}
          </div>
          
          <div className="grid gap-4">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-gray-800 shadow-2xl">
              <Image src={data.images?.[0] || "/image/chinaproject.png"} alt="Quality Inspection" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <VideoPanel title="QA Testing Procedures" poster={data.images?.[1] || "/image/chinaproject.png"} />
          </div>
        </div>
      </div>
    </section>
  );
}
