import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronRight, Cpu, Layers, ShieldCheck, Zap } from "lucide-react";

const servicesData: Record<string, any> = {
  "rigid-pcb": {
    title: "Rigid PCB",
    tagline: "High precision single, double, and multilayer rigid PCB fabrication.",
    description: "Our rigid printed circuit boards are the backbone of modern electronics, offering unmatched reliability and precision for industrial, consumer, and high-performance applications.",
    image: "https://i.ibb.co.com/s94Q7S0q/rigidpcb.jpg",
    features: [
      { title: "High Layer Count", description: "Up to 40+ layers for complex routing and high-density designs." },
      { title: "Advanced Materials", description: "FR4, High TG, Halogen-Free, and specialized substrates." },
      { title: "Precision Drilling", description: "Microvias and laser drilling for HDI applications." },
      { title: "Surface Finishes", description: "ENIG, HASL, Immersion Silver, and hard gold plating." }
    ],
    applications: ["Industrial Automation", "Consumer Electronics", "Automotive Systems", "Medical Devices"]
  },
  "flexible-pcb": {
    title: "Flexible PCB",
    tagline: "Lightweight flex circuits for compact electronics and wearable devices.",
    description: "Flexible PCBs provide dynamic routing solutions for applications where space, weight, and movement are critical factors.",
    image: "https://i.ibb.co.com/gM8S803b/Flexible-PCB.jpg",
    features: [
      { title: "Dynamic Flexing", description: "Designed to withstand millions of bending cycles." },
      { title: "Space Saving", description: "Ultra-thin profiles for compact product designs." },
      { title: "Polyimide Base", description: "High-temperature resistance and excellent dielectric properties." },
      { title: "Custom Stiffeners", description: "FR4, Polyimide, or Stainless Steel stiffeners where needed." }
    ],
    applications: ["Wearable Tech", "Medical Implants", "Aerospace", "Smartphones"]
  },
  "rigid-flex-pcb": {
    title: "Rigid-Flex PCB",
    tagline: "Integrated rigid-flex boards for high reliability electronic systems.",
    description: "Combining the best of both worlds, Rigid-Flex PCBs offer the stability of rigid boards with the versatility of flexible circuits, eliminating the need for connectors.",
    image: "https://i.ibb.co.com/QvkgKZWp/Rigid-Flex-PCB.jpg",
    features: [
      { title: "Hybrid Construction", description: "Seamless integration of rigid and flex materials." },
      { title: "High Reliability", description: "Eliminates points of failure from traditional connectors." },
      { title: "3D Packaging", description: "Enables complex folded designs for tight enclosures." },
      { title: "Optimized Signal Integrity", description: "Continuous trace routing across rigid and flex areas." }
    ],
    applications: ["Military & Defense", "Aerospace Sensors", "Advanced Medical Devices", "High-End Consumer Tech"]
  },
  "aluminum-pcb": {
    title: "Aluminum PCB",
    tagline: "Thermal management PCB solutions for LED and power electronics.",
    description: "Metal-core PCBs, specifically Aluminum PCBs, are engineered to dissipate heat effectively, ensuring the longevity and performance of high-power components.",
    image: "https://i.ibb.co.com/93ftQrT5/Aluminum-PCB-for-electronics-202608022346.jpg",
    features: [
      { title: "Excellent Thermal Conductivity", description: "Rapidly dissipates heat away from critical components." },
      { title: "Durability", description: "High physical strength compared to standard FR4." },
      { title: "Dimensional Stability", description: "Maintains size and shape under high thermal loads." },
      { title: "Dielectric Layer", description: "Specialized thermal dielectrics for optimal heat transfer." }
    ],
    applications: ["High-Power LED Lighting", "Power Supplies", "Motor Controllers", "Automotive Lighting"]
  },
  "high-frequency-pcb": {
    title: "High Frequency PCB",
    tagline: "RF, microwave, and communication PCB with advanced materials.",
    description: "Designed for minimal signal loss, our High Frequency PCBs use specialized materials like Rogers and Teflon to support multi-gigahertz operations.",
    image: "https://i.ibb.co.com/zWKyR4CD/RF-printed-circuit-board-electro-202608022348.jpg",
    features: [
      { title: "Low Dielectric Loss", description: "Minimizes signal attenuation at high frequencies." },
      { title: "Controlled Impedance", description: "Strict tolerances for reliable signal integrity." },
      { title: "Advanced Materials", description: "Rogers, Taconic, PTFE, and specialized laminates." },
      { title: "Precision Etching", description: "Tight control of trace widths for RF performance." }
    ],
    applications: ["5G Telecom", "Radar Systems", "Satellite Communications", "RF Amplifiers"]
  },
  "hdi-pcb": {
    title: "HDI PCB",
    tagline: "Fine line, microvia, and high-density interconnect PCB production.",
    description: "High-Density Interconnect (HDI) PCBs pack more functionality into smaller spaces, utilizing microvias, blind/buried vias, and fine lines.",
    image: "https://i.ibb.co.com/xq3mnzFG/PCB-with-microvias-and-chips-202608022350.jpg",
    features: [
      { title: "Microvia Technology", description: "Laser-drilled vias for extreme density." },
      { title: "Any-Layer HDI", description: "Complete routing freedom across all layers." },
      { title: "Fine Pitch Components", description: "Supports advanced BGA and CSP packages." },
      { title: "Signal Integrity", description: "Shorter electrical paths for improved performance." }
    ],
    applications: ["Smartphones & Tablets", "High-Performance Computing", "Advanced Medical Imaging", "Automotive Infotainment"]
  },
  "smt-assembly": {
    title: "SMT Assembly",
    tagline: "Automated placement, reflow, AOI, and full process traceability.",
    description: "Our Surface Mount Technology (SMT) lines are equipped with state-of-the-art automated placement machines, delivering high-speed and ultra-precise component mounting for complex PCB assemblies.",
    image: "https://i.ibb.co.com/8nvszwhc/Automated-SMT-assembly-productio-202608030052.jpg",
    features: [
      { title: "High-Speed Placement", description: "Capable of placing thousands of components per hour with extreme precision." },
      { title: "Advanced AOI", description: "Automated Optical Inspection ensures every solder joint meets IPC standards." },
      { title: "Micro-Component Handling", description: "Reliable placement of 01005, 0201 chips, and ultra-fine pitch BGAs." },
      { title: "X-Ray Inspection", description: "3D X-Ray verification for hidden solder joints under BGAs and QFNs." }
    ],
    applications: ["Consumer Electronics", "Telecommunications", "Automotive ECUs", "Medical Monitors"]
  },
  "tht-assembly": {
    title: "THT Assembly",
    tagline: "Through-hole soldering for connectors, power modules, and mixed boards.",
    description: "Our Through-Hole Technology (THT) assembly combines automated wave soldering with skilled manual insertion, ensuring robust mechanical bonds for heavy components and connectors.",
    image: "https://i.ibb.co.com/zprqSBH/Technicians-assembling-PCB-compo-202608030053.jpg",
    features: [
      { title: "Wave Soldering", description: "Automated wave soldering lines for efficient and consistent solder joints." },
      { title: "Selective Soldering", description: "Precision soldering for mixed-technology boards without damaging SMT parts." },
      { title: "Manual Insertion", description: "Expert technicians for complex or custom components." },
      { title: "Rigorous Inspection", description: "Visual and mechanical testing of all through-hole connections." }
    ],
    applications: ["Industrial Power Supplies", "High-Voltage Controls", "Legacy Systems", "Heavy Duty Connectors"]
  },
  "box-build-assembly": {
    title: "Box Build Assembly",
    tagline: "Complete electromechanical integration, testing, and packing.",
    description: "Beyond just the PCB, our Box Build assembly provides full system integration. We assemble your boards into enclosures, handle the wiring, and perform final functional testing.",
    image: "https://i.ibb.co.com/7NgF4JtZ/Box-build-assembly-process-elect-202608030053.jpg",
    features: [
      { title: "Electromechanical Integration", description: "Combining PCBs with custom enclosures, displays, and wiring harnesses." },
      { title: "Custom Testing", description: "Functional testing tailored to your product's specific requirements." },
      { title: "Software Flashing", description: "Programming microcontrollers and memory devices prior to shipping." },
      { title: "Retail Packaging", description: "Final product packaging, labeling, and direct-to-customer logistics." }
    ],
    applications: ["Medical Devices", "IoT Gateways", "Industrial Controllers", "Consumer Gadgets"]
  },
  "turnkey-assembly": {
    title: "Turnkey Assembly",
    tagline: "PCB fabrication, components sourcing, assembly, inspection, and delivery.",
    description: "Our full turnkey service handles everything from bare board manufacturing and component procurement to final assembly and testing, simplifying your supply chain.",
    image: "https://i.ibb.co.com/ZzFyzbkg/PCB-manufacturing-automated-prod-202608030054.jpg",
    features: [
      { title: "Global Component Sourcing", description: "Direct relationships with major distributors and manufacturers." },
      { title: "BOM Optimization", description: "Engineering support to find alternate parts and reduce costs." },
      { title: "End-to-End Management", description: "A single point of contact from design file to finished product." },
      { title: "Lifecycle Support", description: "Obsolescence management and long-term production planning." }
    ],
    applications: ["Startup Hardware", "Enterprise Hardware Deployments", "Rapid Prototyping", "Mass Production Scaling"]
  }
};

// Required for Next.js when generating static params or handling async params
export default async function ServiceCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = servicesData[slug];

  if (!service) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-black text-foreground">Service Not Found</h1>
        <Link href="/" className="mt-4 text-primary hover:underline">Return Home</Link>
      </div>
    );
  }

  return (
    <main className="bg-[#030914] min-h-screen text-slate-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-24">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-cyan-500/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-300 mb-6">
                <Layers className="h-4 w-4" /> Premium Manufacturing
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tight leading-tight mb-6">
                {service.title}
              </h1>
              <p className="text-xl lg:text-2xl font-bold text-cyan-100 mb-6">
                {service.tagline}
              </p>
              <p className="text-lg text-slate-300 leading-relaxed max-w-xl">
                {service.description}
              </p>
              
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/pcb-quote" className="rounded-full bg-cyan-500 hover:bg-cyan-400 text-[#030914] px-8 py-4 font-black transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]">
                  Get Instant Quote
                </Link>
                <Link href="#contact" className="rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white px-8 py-4 font-black transition-all backdrop-blur-sm">
                  Talk to Engineering
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 blur-2xl rounded-3xl" />
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl aspect-[4/3] group">
                <Image 
                  src={service.image} 
                  alt={service.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030914] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="text-cyan-400 w-6 h-6" />
                      <span className="text-white font-bold tracking-wide uppercase text-sm">Certified Quality</span>
                    </div>
                    <div className="h-1 w-1/3 bg-gradient-to-r from-cyan-500 to-transparent rounded-full opacity-50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-20 bg-black/40 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-white sm:text-4xl mb-4">Core Capabilities</h2>
            <p className="text-slate-400 text-lg">Advanced engineering processes ensuring the highest reliability for your {service.title} projects.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {service.features.map((feature: any, idx: number) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm group hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(6,182,212,0.2)]">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-black transition-all shadow-inner">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="py-24 relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div className="order-2 lg:order-1 grid sm:grid-cols-2 gap-4">
              {service.applications.map((app: string, idx: number) => (
                <div key={idx} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-5 hover:border-cyan-500/30 transition-colors group">
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-bold text-slate-200">{app}</span>
                </div>
              ))}
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/25 bg-purple-400/10 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-purple-300 mb-6">
                <Zap className="h-4 w-4" /> Applications
              </div>
              <h2 className="text-3xl font-black text-white sm:text-5xl mb-6 leading-tight">
                Empowering Next-Gen Industries
              </h2>
              <p className="text-lg text-slate-300 leading-relaxed mb-8">
                Our {service.title} solutions are trusted by leading companies across highly demanding sectors. We provide the foundation for innovation, ensuring your products perform flawlessly in their intended environments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative border-t border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cyan-950/30" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Ready to start production?</h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">Upload your Gerber files now and get a comprehensive engineering review and instant quotation.</p>
          <Link href="/pcb-quote" className="rounded-full bg-white text-black px-10 py-5 font-black text-lg hover:scale-105 transition-transform inline-flex items-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
            Upload Gerber Files <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
