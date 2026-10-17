import { IPage } from "@/services/page.service";
import { IProduct } from "@/services/product.service";
import NavbarSlider from "./NavbarSlider";

import dynamic from "next/dynamic";

const PremiumWupingHomepage = dynamic(() => import("@/components/module/Home/sections/PremiumWupingHomepage"));

export default function HomePage({
  products = [],
  sections = [],
}: {
  products?: IProduct[];
  sections?: IPage[];
}) {
  return (
    <main>
      <NavbarSlider />
      <PremiumWupingHomepage products={products} sections={sections} />
    </main>
  );
}
