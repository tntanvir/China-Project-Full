import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight, FileText, CheckCircle2, LayoutGrid, Lightbulb, MessageCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCmsPageContent } from "@/lib/cms-content";

export async function generateMetadata(): Promise<Metadata> {
  const content = getCmsPageContent("capability", "quality-control");
  if (!content) return { title: "Page Not Found" };
  return {
    title: content.seoTitle,
    description: content.metaDescription,
    keywords: content.keywords,
    openGraph: {
      title: content.seoTitle,
      description: content.metaDescription,
      images: [{ url: content.featuredImage.src, alt: content.featuredImage.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: content.seoTitle,
      description: content.metaDescription,
      images: [content.featuredImage.src],
    },
  };
}

export default async function Page() {
  const content = getCmsPageContent("capability", "quality-control");
  if (!content) notFound();
  
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <main className="premium-shell min-h-screen pb-24">
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      
      {/* Breadcrumbs */}
      <div className="border-b border-border/70 bg-background/70 backdrop-blur-xl sticky top-0 z-40">
        <nav className="premium-container flex items-center gap-2 py-4 text-xs font-semibold text-muted-foreground sm:text-sm">
          <Link href="/" className="transition hover:text-primary">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={`/${content.sectionSlug}`} className="transition hover:text-primary">{content.sectionTitle}</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{content.pageTitle}</span>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="absolute inset-0 bg-primary/5 [mask-image:radial-gradient(ellipse_at_center,white,transparent_80%)] pointer-events-none" />
        <div className="premium-container relative text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary mb-6">
            <Info className="h-4 w-4" />
            {content.heroEyebrow}
          </div>
          <h1 className="mx-auto max-w-4xl text-5xl font-black tracking-[-0.04em] text-foreground md:text-7xl">
            {content.heroTitle}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
            {content.heroDescription}
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="rounded-full px-8">
              <Link href={content.ctaHref}>
                {content.ctaLabel}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8">
              <Link href="/pcb-quote">Request Quote</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="premium-container mb-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {content.stats.map((stat, i) => (
            <Card key={i} className="relative overflow-hidden p-6 text-center rounded-[2rem] border-primary/10 bg-primary/5 transition-all hover:bg-primary/10 hover:shadow-soft">
              <div className="text-4xl font-black text-primary">{stat.value}</div>
              <div className="mt-2 text-sm font-bold text-foreground uppercase tracking-wide">{stat.label}</div>
              <div className="mt-1 text-xs text-muted-foreground">{stat.description}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Image & Intro */}
      <section className="premium-container mb-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl font-black text-foreground lg:text-4xl">{content.articleTitle}</h2>
            <div className="mt-6 space-y-6 text-lg leading-8 text-muted-foreground">
              {content.article.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            <Button asChild variant="secondary" className="mt-8 rounded-full">
              <Link href="#features">Explore Features <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="order-1 lg:order-2">
            <Card className="overflow-hidden rounded-[2rem] p-2 bg-background/50 border-border/50 shadow-soft">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] bg-muted">
                <Image
                  src={content.featuredImage.src}
                  alt={content.featuredImage.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  priority
                />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Split Features Section */}
      <section id="features" className="premium-container mb-24 space-y-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-foreground lg:text-5xl">Why Choose Our {content.pageTitle}</h2>
          <p className="mt-4 text-lg text-muted-foreground">Discover the unique advantages and capabilities we offer.</p>
        </div>
        
        {content.splitFeatures.map((feature, idx) => (
          <div key={idx} className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className={`${feature.imagePosition === 'right' ? 'lg:order-1' : 'lg:order-2'} space-y-6`}>
              <div className="inline-flex items-center justify-center rounded-2xl bg-primary/10 p-3 text-primary">
                <LayoutGrid className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-black text-foreground">{feature.title}</h3>
              <p className="text-lg leading-8 text-muted-foreground">{feature.description}</p>
              <ul className="space-y-4 pt-4">
                {feature.list.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-base text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={`${feature.imagePosition === 'right' ? 'lg:order-2' : 'lg:order-1'}`}>
              <Card className="overflow-hidden rounded-[2rem] p-2 bg-background/50 border-border/50 shadow-soft group">
                <div className="relative aspect-square sm:aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] bg-muted">
                  <Image
                    src={feature.imageSrc}
                    alt={feature.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </Card>
            </div>
          </div>
        ))}
      </section>

      {/* Featured Blocks Grid */}
      <section className="bg-muted/30 py-24 border-y border-border/50">
        <div className="premium-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-foreground">Capabilities & Highlights</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {content.featuredBlocks.map((block) => (
              <Card key={block.title} className="group rounded-[1.5rem] p-8 transition-all hover:border-primary/40 hover:bg-primary/5 hover:shadow-soft">
                <div className="mb-6 inline-flex rounded-full bg-primary/10 p-4 text-primary transition-transform group-hover:scale-110">
                  <Lightbulb className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-black text-foreground">{block.title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{block.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery & FAQ Section */}
      <section className="premium-container my-24">
        <div className="grid gap-16 lg:grid-cols-12">
          
          <div className="lg:col-span-8 space-y-12">
            <div>
              <div className="inline-flex items-center gap-2 text-primary font-bold mb-4">
                <MessageCircle className="h-5 w-5" />
                Frequently Asked Questions
              </div>
              <h2 className="text-3xl font-black text-foreground mb-8">Got questions about {content.pageTitle}?</h2>
              <div className="space-y-4">
                {content.faq.map((faq, i) => (
                  <details key={i} className="group rounded-[1.5rem] border border-border bg-background/50 p-6 transition-colors hover:border-primary/40 open:bg-primary/5">
                    <summary className="flex cursor-pointer items-center justify-between font-bold text-foreground outline-none marker:content-none">
                      {faq.question}
                      <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="mt-4 leading-7 text-muted-foreground">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-8">
            <Card className="rounded-[2rem] p-6 border-primary/20 bg-primary/5">
              <h3 className="text-xl font-black text-foreground mb-2">Need a custom solution?</h3>
              <p className="text-sm leading-6 text-muted-foreground mb-6">
                {content.ctaDescription}
              </p>
              <Button asChild size="lg" className="w-full rounded-full shadow-soft hover:shadow-soft-lg transition-all">
                <Link href={content.ctaHref}>{content.ctaTitle}</Link>
              </Button>
            </Card>

            <Card className="rounded-[2rem] p-6">
              <h3 className="font-black text-foreground text-xl mb-4">Related Topics</h3>
              <div className="grid gap-3">
                {content.internalLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 rounded-xl border border-border bg-background/50 p-4 transition hover:border-primary/40 hover:bg-primary/5"
                  >
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <FileText className="h-4 w-4" />
                    </div>
                    <span className="font-semibold text-foreground">{link.title}</span>
                  </Link>
                ))}
              </div>
            </Card>
          </aside>

        </div>
      </section>
    </main>
  );
}
