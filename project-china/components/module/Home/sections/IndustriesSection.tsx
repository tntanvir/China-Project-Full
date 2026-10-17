"use client";

import Image from "next/image";

import SectionHeader from "@/components/module/Home/sections/SectionHeader";
import VideoPanel from "@/components/module/Home/sections/VideoPanel";
import { IPage } from "@/services/page.service";

export default function IndustriesSection({ data }: { data?: IPage }) {
  if (!data) return null;

  return (
    <section className="bg-[#0A0A10] py-24 border-y border-gray-800/50">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          eyebrow="Industries Served"
          title={data.title}
          description={data.content || ""}
        />
        
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.specifications?.industries?.map((industry: string, index: number) => (
            <div key={industry} className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-[#12121A] shadow-xl hover:-translate-y-2 transition-all duration-500">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image src={data.images?.[index % (data.images?.length || 1)] || "/images/generated/fallback_hero.png"} alt={industry} fill sizes="(max-width: 1024px) 50vw, 33vw" className="object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 w-full p-6">
                <h3 className="text-xl font-bold text-white group-hover:text-fuchsia-400 transition-colors">{industry}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

