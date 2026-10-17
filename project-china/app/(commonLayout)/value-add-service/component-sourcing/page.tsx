import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight, FileText, ImageIcon, Lightbulb, PlayCircle, Search, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCmsPageContent } from "@/lib/cms-content";

export async function generateMetadata(): Promise<Metadata> {
  const content = getCmsPageContent("value-add-service", "component-sourcing");
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
  const content = getCmsPageContent("value-add-service", "component-sourcing");
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
      <div className="border-b border-border/70 bg-background/70 backdrop-blur-xl">
        <nav className="premium-container flex items-center gap-2 py-4 text-xs font-semibold text-muted-foreground sm:text-sm">
          <Link href="/" className="transition hover:text-primary">Home</Link>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <Link href={`/${content.sectionSlug}`} className="transition hover:text-primary">{content.sectionTitle}</Link>
          <ChevronRight className="h-4 w-4 shrink-0" />
          <span className="truncate text-foreground">{content.pageTitle}</span>
        </nav>
      </div>

      <section className="premium-section">
        <div className="premium-grid-bg pointer-events-none absolute inset-0 opacity-60" />
        <div className="premium-container relative z-10 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-7">
            <div className="premium-eyebrow">{content.heroEyebrow}</div>
            <div className="space-y-5">
              <h1 className="text-5xl font-black tracking-[-0.04em] text-foreground md:text-7xl">
                {content.heroTitle}
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">
                {content.heroDescription}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full">
                <Link href={content.ctaHref}>
                  {content.ctaLabel}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link href="/pcb-quote">Request Quote</Link>
              </Button>
            </div>
          </div>

          <Card className="relative overflow-hidden rounded-[2rem] p-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-muted">
              <Image
                src={content.featuredImage.src}
                alt={content.featuredImage.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="p-4">
              <h2 className="font-black text-foreground">{content.featuredImage.title}</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {content.featuredImage.caption}
              </p>
            </div>
          </Card>
        </div>
      </section>

      <section className="premium-container grid gap-8 lg:grid-cols-[0.78fr_0.22fr]">
        <article className="space-y-8">
          <Card className="p-8">
            <p className="text-lg leading-8 text-muted-foreground">{content.intro}</p>
          </Card>
          <Card className="p-8">
            <div className="mb-6 flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-3xl font-black tracking-tight text-foreground">{content.articleTitle}</h2>
            </div>
            <div className="space-y-5 text-base leading-8 text-muted-foreground">
              {content.article.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </Card>
          <div className="grid gap-5 md:grid-cols-3">
            {content.featuredBlocks.map((block) => (
              <Card key={block.title} className="p-6">
                <Lightbulb className="mb-4 h-6 w-6 text-primary" />
                <h3 className="text-lg font-black text-foreground">{block.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{block.description}</p>
              </Card>
            ))}
          </div>
          <Card className="p-8">
            <div className="mb-6 flex items-center gap-3">
              <ImageIcon className="h-5 w-5 text-primary" />
              <h2 className="text-3xl font-black tracking-tight text-foreground">Gallery and Media</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {content.gallery.map((image) => (
                <figure key={image.src} className="overflow-hidden rounded-2xl border border-border bg-background/70">
                  <div className="relative aspect-[4/3]">
                    <Image src={image.src} alt={image.alt} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                  </div>
                  <figcaption className="p-4">
                    <p className="font-bold text-foreground">{image.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{image.caption}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </Card>
          <Card className="p-8">
            <div className="mb-6 flex items-center gap-3">
              <PlayCircle className="h-5 w-5 text-primary" />
              <h2 className="text-3xl font-black tracking-tight text-foreground">Recommended Videos</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {content.videos.map((video) => (
                <div key={video.title} className="rounded-2xl border border-border bg-background/70 p-5">
                  <h3 className="font-black text-foreground">{video.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{video.description}</p>
                  <p className="mt-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Placement: {video.placement}</p>
                  <Button asChild variant="outline" className="mt-4 rounded-full">
                    <a href={video.youtubeSearchUrl} target="_blank" rel="noreferrer">Search YouTube</a>
                  </Button>
                </div>
              ))}
            </div>
          </Card>
          <Card className="p-8">
            <h2 className="mb-6 text-3xl font-black tracking-tight text-foreground">FAQ</h2>
            <div className="space-y-3">
              {content.faq.map((faq) => (
                <details key={faq.question} className="rounded-2xl border border-border bg-background/70 p-5">
                  <summary className="cursor-pointer text-base font-black text-foreground">{faq.question}</summary>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
          </Card>
        </article>
        <aside className="space-y-5">
          <Card className="sticky top-28 p-6">
            <h2 className="text-xl font-black text-foreground">{content.ctaTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{content.ctaDescription}</p>
            <Button asChild className="mt-5 w-full rounded-full">
              <Link href={content.ctaHref}>{content.ctaLabel}</Link>
            </Button>
            <div className="mt-7 border-t border-border pt-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-black text-foreground">
                <Search className="h-4 w-4 text-primary" />
                Internal Links
              </div>
              <div className="grid gap-2">
                {content.internalLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="text-sm font-semibold text-muted-foreground hover:text-primary">
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>
            <div className="mt-7 border-t border-border pt-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-black text-foreground">
                <Tags className="h-4 w-4 text-primary" />
                Categories
              </div>
              <div className="flex flex-wrap gap-2">
                {content.categories.map((category) => (
                  <span key={category} className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </aside>
      </section>
      <section className="premium-container mt-12">
        <Card className="p-8">
          <h2 className="text-3xl font-black tracking-tight text-foreground">Related Content</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {content.relatedContent.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-2xl border border-border bg-background/70 p-5 transition hover:border-primary/40 hover:bg-primary/10">
                <h3 className="font-black text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </Link>
            ))}
          </div>
        </Card>
      </section>
    </main>
  );
}
