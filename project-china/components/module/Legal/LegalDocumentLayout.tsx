import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Calendar,
  ChevronRight,
  FileText,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { COMPANY_LEGAL_INFO, type LegalDocumentData } from "@/lib/legal-documents";

export default function LegalDocumentLayout({ document }: { document: LegalDocumentData }) {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 pb-20">
      {/* Breadcrumb Bar */}
      <div className="border-b border-gray-200/80 dark:border-slate-800 bg-gray-50/70 dark:bg-slate-900/60">
        <nav className="mx-auto max-w-[1200px] px-4 sm:px-6 flex items-center gap-2 py-3.5 text-xs font-semibold text-gray-500 dark:text-slate-400">
          <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition">
            Home
          </Link>
          {document.breadcrumbParent && (
            <>
              <ChevronRight className="size-3.5 shrink-0" />
              <Link
                href={document.breadcrumbParent.href}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition"
              >
                {document.breadcrumbParent.label}
              </Link>
            </>
          )}
          <ChevronRight className="size-3.5 shrink-0" />
          <span className="text-gray-900 dark:text-white">{document.title}</span>
        </nav>
      </div>

      {/* Document Header */}
      <header className="border-b border-gray-200 dark:border-slate-800 bg-gradient-to-b from-emerald-50/50 via-white to-white dark:from-emerald-950/20 dark:via-slate-950 dark:to-slate-950 py-12 sm:py-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="size-3.5" />
            {document.badge}
          </span>

          <h1 className="mt-4 text-3xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
            {document.title}
          </h1>

          <p className="mt-3 max-w-3xl text-sm sm:text-base leading-relaxed text-gray-600 dark:text-slate-300">
            {document.subtitle}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-gray-500 dark:text-slate-400 font-medium">
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              <strong className="text-gray-800 dark:text-slate-200">{COMPANY_LEGAL_INFO.legalName}</strong>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              Effective: {document.effectiveDate}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FileText className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              {COMPANY_LEGAL_INFO.icpRecord}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content + Sidebar Navigation */}
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 pt-10 sm:pt-14">
        <div className="grid gap-10 lg:grid-cols-12 items-start">
          {/* Sticky Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
            {/* Table of Contents */}
            <div className="rounded-2xl border border-gray-200/90 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/50 p-5">
              <h2 className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-3">
                Sections
              </h2>
              <nav className="space-y-1">
                {document.sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400 transition"
                  >
                    <span className="font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      {section.number}
                    </span>
                    <span className="truncate">{section.title}</span>
                  </a>
                ))}
              </nav>
            </div>

            {/* Companion Legal Document Card */}
            <div className="rounded-2xl border border-emerald-200/80 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-slate-900 p-5">
              <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                Related Legal Document
              </div>
              <p className="mt-1 text-xs text-gray-600 dark:text-slate-400 leading-relaxed">
                {document.companionLink.description}
              </p>
              <Link
                href={document.companionLink.href}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                {document.companionLink.label}
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            {/* Direct Contact Box */}
            <div className="rounded-2xl border border-gray-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-2.5 text-xs">
              <div className="font-extrabold text-gray-900 dark:text-white">
                {COMPANY_LEGAL_INFO.brandName} Compliance Desk
              </div>
              <a
                href={`mailto:${COMPANY_LEGAL_INFO.emails[0]}`}
                className="flex items-center gap-2 text-gray-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
              >
                <Mail className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{COMPANY_LEGAL_INFO.emails[0]}</span>
              </a>
              <a
                href={`mailto:${COMPANY_LEGAL_INFO.emails[1]}`}
                className="flex items-center gap-2 text-gray-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
              >
                <Mail className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{COMPANY_LEGAL_INFO.emails[1]}</span>
              </a>
              <div className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
                <Phone className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>{COMPANY_LEGAL_INFO.phones[0]}</span>
              </div>
            </div>
          </aside>

          {/* Document Clauses (8 cols) */}
          <article className="lg:col-span-8 space-y-10">
            {document.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24 border-b border-gray-100 dark:border-slate-800/80 pb-8 last:border-b-0"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-sm font-black text-emerald-600 dark:text-emerald-400">
                    {section.number}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    {section.title}
                  </h2>
                </div>

                <div className="mt-3 space-y-3 text-sm sm:text-[15px] leading-relaxed text-gray-600 dark:text-slate-300">
                  {section.paragraphs.map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                {section.bullets && section.bullets.length > 0 && (
                  <ul className="mt-4 space-y-2.5">
                    {section.bullets.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-700 dark:text-slate-300"
                      >
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-emerald-600 dark:bg-emerald-400" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.highlight && (
                  <div className="mt-5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-emerald-950/30 p-4">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                      {section.highlight.title}
                    </div>
                    <p className="mt-1 text-xs sm:text-sm leading-relaxed text-emerald-950/80 dark:text-emerald-100/90">
                      {section.highlight.body}
                    </p>
                  </div>
                )}
              </section>
            ))}
          </article>
        </div>
      </div>
    </main>
  );
}
