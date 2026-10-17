"use client";

import Image from "next/image";

import SectionHeader from "@/components/module/Home/sections/SectionHeader";
import VideoPanel from "@/components/module/Home/sections/VideoPanel";
import { IPage } from "@/services/page.service";

export default function AssemblySection({ data }: { data?: IPage }) {
  if (!data) return null;

  return (
    <section className="bg-[#05050A] py-24 relative overflow-hidden">
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[800px] h-[800px] opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-l from-violet-600 to-transparent blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-16 px-4 lg:grid-cols-2 items-center relative z-10">
        
        <div className="grid grid-cols-2 gap-4">
          {data.images?.slice(0, 4).map((src, index) => (
            <div key={`${src}-${index}`} className={`relative aspect-square overflow-hidden rounded-2xl border border-gray-800 shadow-xl ${index % 2 === 1 ? 'mt-8' : ''}`}>
              <Image src={src} alt={`Assembly example ${index + 1}`} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover hover:scale-110 transition-transform duration-700" />
            </div>
          ))}
        </div>

        <div>
          <SectionHeader
            eyebrow="PCB Assembly"
            title={data.title}
            description={data.content || ""}
          />
          
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {data.specifications?.features?.map((feature: any, index: number) => (
              <div key={index} className="rounded-xl border border-gray-800/50 bg-[#12121A]/80 backdrop-blur-md p-6 hover:bg-gray-800/50 transition-colors duration-300">
                <h4 className="text-white font-bold mb-2">{feature.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <VideoPanel title="Automated SMT Line" poster={data.images?.[0] || "/image/chinaproject.png"} />
          </div>
        </div>
      </div>
    </section>
  );
}
