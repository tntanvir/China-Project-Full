"use client";

import Link from "next/link";
import { ArrowRight, Mail, MapPin, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import VideoPanel from "@/components/module/Home/sections/VideoPanel";
import { IPage } from "@/services/page.service";

export default function ContactSection({ data }: { data?: IPage }) {
  if (!data) return null;

  return (
    <section className="bg-gradient-to-b from-[#0A0A10] to-[#05050A] border-t border-gray-800/50 py-24 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-600 to-transparent blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-16 px-4 md:grid-cols-[1fr_0.9fr] items-center relative z-10">
        <div className="space-y-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-fuchsia-500 mb-3">
              Get In Touch
            </p>
            <h2 className="text-4xl font-black tracking-tight text-white md:text-5xl">
              {data.title}
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
              {data.content}
            </p>
          </div>
          
          <div className="grid gap-6 border-t border-gray-800 pt-6 sm:grid-cols-2">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-violet-500/20 bg-violet-500/10">
                <MapPin className="size-5 text-violet-400" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500">Factory Address</p>
                <p className="font-medium leading-6 text-white">{data.specifications?.factoryAddress}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/10">
                <MapPin className="size-5 text-cyan-300" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500">Shenzhen Address</p>
                <p className="font-medium leading-6 text-white">{data.specifications?.shenzhenAddress}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-violet-500/20 bg-violet-500/10">
                <Mail className="size-5 text-violet-400" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500">Email Us</p>
                <p className="font-medium text-white">{data.specifications?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10">
                <MessageSquare className="size-5 text-fuchsia-400" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500">Call Us</p>
                <p className="font-medium text-white">{data.specifications?.phone}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <Button asChild size="lg" className="bg-white text-black hover:bg-gray-200 h-14 px-8 text-base font-bold rounded-full">
              <Link href="/contact">
                <Mail className="size-5 mr-2" /> Contact Sales
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 h-14 px-8 text-base font-bold rounded-full bg-black/20 backdrop-blur-md">
              <Link href="/contact">
                Technical Support <ArrowRight className="size-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="relative rounded-2xl overflow-hidden border border-gray-800 shadow-[0_0_50px_-12px_rgba(217,70,239,0.15)]">
          <VideoPanel title="Our Support Center" poster={data.images?.[0] || "/image/chinaproject.png"} />
        </div>
      </div>
    </section>
  );
}
