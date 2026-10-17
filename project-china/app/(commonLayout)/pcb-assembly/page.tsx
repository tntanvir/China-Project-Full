import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "PCB Assembly | FT PCB",
  description: "Explore pcb assembly and related information from FT PCB.",
};

export default function Page() {
  const items = [
  {
    "title": "Overview",
    "pageSlug": "overview"
  },
  {
    "title": "Equipments",
    "pageSlug": "equipments"
  },
  {
    "title": "Prototype Assembly",
    "pageSlug": "prototype-assembly"
  },
  {
    "title": "Low Volume",
    "pageSlug": "low-volume"
  },
  {
    "title": "High Volume",
    "pageSlug": "high-volume"
  },
  {
    "title": "Fast Turn",
    "pageSlug": "fast-turn"
  },
  {
    "title": "Turnkey",
    "pageSlug": "turnkey"
  },
  {
    "title": "Partial Turnkey",
    "pageSlug": "partial-turnkey"
  },
  {
    "title": "FAQ",
    "pageSlug": "faq"
  }
];

  return (
    <main className="premium-shell min-h-screen pb-24">
      <div className="border-b border-border/70 bg-background/70 backdrop-blur-xl">
        <nav className="premium-container flex items-center gap-2 py-4 text-xs font-semibold text-muted-foreground sm:text-sm">
          <Link href="/" className="transition hover:text-primary">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">PCB Assembly</span>
        </nav>
      </div>
      <div className="premium-container mt-12">
        <h1 className="text-4xl font-black text-foreground">PCB Assembly</h1>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {items.map((item) => (
            <Link 
              key={item.pageSlug}
              href={`/${"pcb-assembly"}/${item.pageSlug}`}
              className="group block rounded-2xl border border-border bg-background p-6 transition hover:border-primary/50 hover:bg-primary/5"
            >
              <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition">{item.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">Explore information about {item.title.toLowerCase()}.</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
