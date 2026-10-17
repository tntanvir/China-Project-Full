"use client";

import { Sparkles } from "lucide-react";
import ManufacturingTimelineAnimation from "./ManufacturingTimelineAnimation";
import QuoteCalculatorPulseAnimation from "./QuoteCalculatorPulseAnimation";
import GerberUploadScannerAnimation from "./GerberUploadScannerAnimation";
import QualityScannerAnimation from "./QualityScannerAnimation";
import PickAndPlaceAnimation from "./PickAndPlaceAnimation";
import OrderTrackingRouteAnimation from "./OrderTrackingRouteAnimation";
import StatsPulseAnimation from "./StatsPulseAnimation";
import ProductCardHoverAnimation from "./ProductCardHoverAnimation";
import NetworkMeshAnimation from "./NetworkMeshAnimation";

const animationCards = [

  { title: "Global network mesh", component: <NetworkMeshAnimation /> },
  { title: "Manufacturing timeline", component: <ManufacturingTimelineAnimation />, wide: true },
  { title: "Quote calculator pulse", component: <QuoteCalculatorPulseAnimation /> },
  { title: "Gerber upload scanner", component: <GerberUploadScannerAnimation /> },
  { title: "Quality scanner", component: <QualityScannerAnimation /> },
  { title: "SMT pick and place", component: <PickAndPlaceAnimation /> },
  { title: "Order tracking route", component: <OrderTrackingRouteAnimation />, wide: true },
  { title: "Stats pulse", component: <StatsPulseAnimation /> },
  { title: "Product hover card", component: <ProductCardHoverAnimation /> },
];

export default function PremiumAnimationShowcase() {
  return (
    <section className="premium-section bg-background/70">
      <div className="premium-container">
        <div className="mx-auto max-w-3xl text-center">
          <div className="premium-eyebrow mx-auto">
            <Sparkles className="h-4 w-4" />
            Premium animations
          </div>
          <h2 className="mt-5 text-3xl font-black tracking-tight text-foreground sm:text-5xl">
            Interactive manufacturing motion for a premium PCB brand
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
            PCB trace flow, DFM scan, SMT placement, QC inspection, quote pulse, shipping and product interaction animations built as separate reusable components.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {animationCards.map((card) => (
            <article key={card.title} className={card.wide ? "lg:col-span-2" : undefined}>
              <div className="mb-3 flex items-center justify-between px-1">
                <h3 className="text-sm font-black uppercase tracking-[0.14em] text-foreground">{card.title}</h3>
                <span className="h-2 w-2 rounded-full bg-primary shadow-glow" />
              </div>
              {card.component}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

