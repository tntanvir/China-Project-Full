"use client";

import Image from "next/image";

import SectionHeader from "@/components/module/Home/sections/SectionHeader";
import VideoPanel from "@/components/module/Home/sections/VideoPanel";
import { IPage } from "@/services/page.service";

export default function FactorySection({ data }: { data?: IPage }) {
  if (!data) return null;

  return (
    <section className="bg-[#05050A] py-24 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 relative z-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            eyebrow="Our Facilities"
            title={data.title}
            description={data.content || ""}
          />
        </div>
        
        <div className="mt-16 grid gap-4 md:grid-cols-4">
          <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-gray-800 md:col-span-2 md:row-span-2 shadow-2xl">
            <Image src={data.images?.[0] || "/images/generated/fallback_hero.png"} alt="Factory showcase" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          
          {data.images?.slice(1, 5).map((src, index) => (
            <div key={`${src}-${index}`} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-gray-800">
              <Image src={src} alt={`Factory detail ${index + 1}`} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500" />
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
          <VideoPanel title="Virtual Factory Tour" poster={data.images?.[5] || "/images/generated/fallback_hero.png"} />
        </div>
      </div>
    </section>
  );
}
