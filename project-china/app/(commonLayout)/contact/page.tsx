import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import ContactForm from "@/components/module/Contact/ContactForm";
import { SocialLinksCardGrid, WhatsAppIcon } from "@/components/ui/SocialLinksBar";

const factoryAddress = "Yanqian Industrial Cluster, Wuping County, Longyan City, Fujian Province";
const shenzhenAddress = "Fenghuang Zhi Gu, Country Garden, Tie Zai Road, Xixiang Street, Baoan District, Shenzhen";
const phoneNumber = "+86 189 2742 6587";

export const metadata = {
  title: "Contact Us - FT PCB",
  description: "Get in touch with our team for inquiries, support, and PCB manufacturing quotes.",
};

export default function ContactPage() {
  return (
    <div className="bg-background pb-20 pt-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Contact Us</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Have a question about our PCB manufacturing services? Need a custom quote? We&apos;re here to help.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div className="flex flex-col gap-8 rounded-2xl bg-muted p-8">
            <div>
              <h3 className="mb-6 text-xl font-bold text-foreground">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Factory Address</h4>
                    <p className="mt-1 text-muted-foreground">{factoryAddress}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Shenzhen Address</h4>
                    <p className="mt-1 text-muted-foreground">{shenzhenAddress}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Email Us</h4>
                    <p className="mt-1 text-muted-foreground">ft-osr@feitianpcb.com<br />support@ftpcb.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Call Us</h4>
                    <p className="mt-1 text-muted-foreground">{phoneNumber}<br />Mon-Fri, 9am - 6pm (CST)</p>
                  </div>
                </div>

                {/* Direct WhatsApp Channel */}
                <a
                  href="https://wa.me/message/KOW2GMXJ7DKHG1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-50/80 dark:bg-emerald-950/50 p-4 transition hover:border-emerald-500 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/60 group"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-sm transition-transform group-hover:scale-105">
                    <WhatsAppIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-foreground">WhatsApp Direct Chat</h4>
                      <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">Click for instant CAM engineer support 24/7</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="mt-auto">
              <h3 className="mb-4 text-lg font-bold text-foreground">Looking for a Quote?</h3>
              <p className="mb-4 text-sm text-muted-foreground">Get an instant estimate for your custom PCB manufacturing needs.</p>
              <Link href="/pcb-quote" className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
                Get Instant Quote
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <h3 className="mb-6 text-xl font-bold text-foreground">Send us a Message</h3>
            <ContactForm />
          </div>
        </div>

        {/* FT Company All Social Media Section */}
        <div className="mt-16 rounded-3xl border border-border/80 bg-card/60 p-6 sm:p-10 shadow-sm backdrop-blur-sm">
          <div className="mb-8 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 text-xs font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 mb-2">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              Direct Communication & Community
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              FT Company Official Social Media
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Connect with our international engineering team, watch automated cleanroom video tours, and receive instant project updates across all official platforms.
            </p>
          </div>

          <SocialLinksCardGrid />
        </div>
      </div>
    </div>
  );
}
