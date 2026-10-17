import { Cpu, ShieldCheck, Zap, Factory, BrainCircuit, Activity } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "AI-Powered PCB Manufacturing | Smart Factory",
  description: "Experience the future of PCB manufacturing with our AI-driven Smart Factory. Machine learning AOI, AI DFM checks, and automated SMT assembly.",
};

export default function AILandingPage() {
  return (
    <div className="bg-[#0A0A10] text-white min-h-screen selection:bg-fuchsia-500/30">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2532&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0A0A10]"></div>
        
        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 px-4 py-1.5 text-sm font-medium text-fuchsia-300 mb-6">
            <BrainCircuit className="size-4" />
            Industry 4.0 Standard
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            The World's Most <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Intelligent</span><br /> PCB Factory
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            By integrating Artificial Intelligence into every step of the PCB manufacturing process—from instant quoting and DFM checks to optical inspection—we guarantee unparalleled precision, lower costs, and zero-defect production.
          </p>
          <Button asChild size="lg" className="bg-white text-black hover:bg-gray-200 rounded-full font-bold px-10 h-14 text-lg">
            <Link href="/pcb-quote">Experience AI Quoting</Link>
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">AI Driven Excellence</h2>
            <p className="text-gray-400">How machine learning transforms your electronics production.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#12121A] border border-gray-800 p-8 rounded-3xl hover:border-fuchsia-500/50 transition-colors duration-500 group">
              <div className="bg-fuchsia-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-fuchsia-400 group-hover:scale-110 transition-transform">
                <Cpu className="size-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">AI DFM Analysis</h3>
              <p className="text-gray-400 leading-relaxed">
                Before a single board is cut, our AI algorithms scan your Gerber files for over 200 potential manufacturability issues, instantly fixing clearance errors and predicting thermal failure points.
              </p>
            </div>

            <div className="bg-[#12121A] border border-gray-800 p-8 rounded-3xl hover:border-violet-500/50 transition-colors duration-500 group">
              <div className="bg-violet-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-violet-400 group-hover:scale-110 transition-transform">
                <ShieldCheck className="size-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Machine Learning AOI</h3>
              <p className="text-gray-400 leading-relaxed">
                Our Automated Optical Inspection (AOI) cameras use computer vision trained on millions of PCBs to detect microscopic soldering defects, bridging shorts, and misplaced components with 99.99% accuracy.
              </p>
            </div>

            <div className="bg-[#12121A] border border-gray-800 p-8 rounded-3xl hover:border-blue-500/50 transition-colors duration-500 group">
              <div className="bg-blue-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                <Activity className="size-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Predictive Maintenance</h3>
              <p className="text-gray-400 leading-relaxed">
                IoT sensors on our CNC routers, plating baths, and SMT machines stream real-time data to our AI core, predicting mechanical failures before they happen to ensure your order is never delayed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Factory Visual */}
      <section className="py-24 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Fully Automated SMT Lines</h2>
            <p className="text-lg text-gray-400 mb-6 leading-relaxed">
              Our AI doesn't just inspect—it builds. The Pick & Place machines are dynamically optimized by AI to reduce travel time between components, increasing assembly speed by 35% compared to traditional manufacturers.
            </p>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-center gap-3">
                <Zap className="text-fuchsia-400" /> Auto-tuning solder paste dispensers
              </li>
              <li className="flex items-center gap-3">
                <Zap className="text-fuchsia-400" /> Smart reflow oven temperature profiling
              </li>
              <li className="flex items-center gap-3">
                <Zap className="text-fuchsia-400" /> Robotic sorting and packaging
              </li>
            </ul>
          </div>
          <div className="relative aspect-square rounded-full bg-gradient-to-tr from-violet-600/20 to-fuchsia-600/20 flex items-center justify-center">
            <div className="absolute inset-8 rounded-full border border-fuchsia-500/30 animate-[spin_20s_linear_infinite]"></div>
            <div className="absolute inset-16 rounded-full border border-violet-500/30 animate-[spin_15s_linear_infinite_reverse]"></div>
            <Factory className="size-32 text-fuchsia-400 drop-shadow-[0_0_30px_rgba(217,70,239,0.8)]" />
          </div>
        </div>
      </section>

    </div>
  );
}
