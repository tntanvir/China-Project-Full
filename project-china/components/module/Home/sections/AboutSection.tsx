"use client";

import Image from "next/image";

import SectionHeader from "@/components/module/Home/sections/SectionHeader";
import VideoPanel from "@/components/module/Home/sections/VideoPanel";
import { IPage } from "@/services/page.service";

export default function AboutSection({ data }: { data?: IPage }) {
  if (!data) return null;

  return (
    <section className="relative overflow-hidden py-24 bg-[#05050A]">
      <div className="mx-auto max-w-7xl px-4 grid gap-16 md:grid-cols-2 md:items-center relative z-10">
        <div className="space-y-8">
          <SectionHeader
            eyebrow="Company Profile"
            title={data.title}
            description={data.content || ""}
          />

          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-800">
            {data.specifications?.stats?.map((stat: any, index: number) => (
              <div key={index} className="space-y-2">
                <h4 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">{stat.value}</h4>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4">
            {data.images?.slice(0, 3).map((src, index) => (
              <div key={src} className="relative aspect-square overflow-hidden rounded-xl border border-gray-800/50 shadow-2xl group">
                <Image src={src} alt={`About Image ${index + 1}`} fill sizes="33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-tr from-violet-600/20 to-fuchsia-600/20 rounded-[2rem] blur-2xl -z-10" />
          <VideoPanel
            title="Inside Our Smart Factory"
            poster={data.images?.[0] || "/image/chinaproject.png"}
            embedUrl="https://youtu.be/NKwhK6o_jHo?si=evv0xuuhHNdnI0IX"
          />
        </div>
      </div>
    </section>
  );
}
