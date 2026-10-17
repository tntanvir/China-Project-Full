"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

import SectionHeader from "@/components/module/Home/sections/SectionHeader";
import VideoPanel from "@/components/module/Home/sections/VideoPanel";
import { IPage } from "@/services/page.service";


export default function CapabilitySection({ data }: { data?: IPage }) {
  if (!data) return null;

  return (
    <section className="bg-[#0A0A10] py-24 relative overflow-hidden border-t border-border/10">
      <div className="mx-auto max-w-7xl px-4 relative z-10">
        <SectionHeader
          eyebrow="Core Competencies"
          title={data.title}
          description={data.content || ""}
        />
        
        <div className="mt-16 grid lg:grid-cols-[1fr_1fr] gap-12 items-center">
          <div className="grid sm:grid-cols-2 gap-4">
            {data.specifications?.features?.map((feature: any, index: number) => (
              <div key={index} className="group relative rounded-2xl border border-gray-800 bg-[#12121A]/50 backdrop-blur-sm p-6 hover:border-fuchsia-500/30 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(217,70,239,0.15)]">
                <CheckCircle2 className="mb-4 size-8 text-fuchsia-400 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              {data.images?.slice(0, 4).map((src, index) => (
                <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-xl border border-gray-800">
                  <Image src={src} alt={`Capability ${index + 1}`} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
            <VideoPanel title="Our Capability Overview" poster={data.images?.[0] || "/image/chinaproject.png"} />
          </div>
        </div>
      </div>
    </section>
  );
}
