import { prisma } from "./src/app/shared/prisma";

async function updateImages() {
  console.log("Connecting to database...");
  await prisma.$connect();

  const products = await prisma.product.findMany();
  console.log(`Found ${products.length} products to check.`);

  const imageMap: Record<string, string[]> = {
    "rigid-fr4-standard-pcb-prototype": ["/images/generated/rigid_pcb.png", "/images/generated/pcb1.png"],
    "turnkey-smt-pcba-production-assembly": ["/images/generated/pcb1.png", "/images/generated/rigid_pcb.png"],
    "high-density-interconnect-hdi-microvia-board": ["/images/generated/hdi_pcb.png", "/images/generated/pcb3.png"],
    "flexible-printed-circuit-fpc-polyimide-boards": ["/images/generated/flexible_pcb.png"],
    "rigid-flex-hybrid-aerospace-medical-circuit": ["/images/generated/rigid_flex_pcb.png"],
    "metal-core-aluminum-substrate-high-power-led-pcb": ["/images/generated/aluminum_pcb.png"],
    "rogers-ro4350b-high-frequency-rf-microwave-board": ["/images/generated/high_freq_pcb.png"],
    "stainless-steel-laser-cut-smt-stencil": ["/images/generated/pcb2.png"],
    "sac305-lead-free-solder-paste-cartridges": ["/images/generated/pcb4.png"],
    "shengyi-s1000-2-high-tg-fr4-laminate-master-sheets": ["/images/generated/pcb1.png", "/images/generated/pcb2.png"],
  };

  for (const p of products) {
    const newImages = imageMap[p.slug] || ["/images/generated/rigid_pcb.png"];
    let newName = p.name;
    let newCategory = p.category;
    let newDescription = p.description;

    // Remove PCBA branding if present
    if (p.slug === "turnkey-smt-pcba-production-assembly") {
      newName = "High-Precision Multilayer Rigid PCB Prototyping";
      newCategory = "PCB Fabrication";
      newDescription = "Precision multi-layer bare PCB prototyping with 100% netlist flying-probe verification and impedance control.";
    }

    await prisma.product.update({
      where: { id: p.id },
      data: {
        name: newName,
        category: newCategory,
        description: newDescription,
        images: newImages,
      },
    });
    console.log(`Updated product: ${newName} -> images: ${JSON.stringify(newImages)}`);
  }

  console.log("All product images updated successfully!");
  process.exit(0);
}

updateImages().catch((err) => {
  console.error("Error updating images:", err);
  process.exit(1);
});

