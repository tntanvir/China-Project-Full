import Navbar from "@/components/module/Home/Navbar";
import Footer from "@/components/module/Footer/Footer";
import { FloatingWhatsAppWidget } from "@/components/ui/SocialLinksBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="grow">
        {children}
      </main>
      <Footer />
      <FloatingWhatsAppWidget />
    </div>
  );
}
