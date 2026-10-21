import type { ReactNode } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { CvDownloadButton, PrintButton } from "@/components/client-islands";
import { EducationList, KeyFacts } from "@/components/site-chrome";
import { resolveLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { experience, identity, languages, projects, skills } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/cv">) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.cv" });
  return pageMetadata({ locale, path: "/cv", title: t("title"), description: t("description") });
}

function Row({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section
      id={id}
      className="scroll-mt-24 grid gap-6 border-t border-hairline py-12 md:grid-cols-[220px_1fr]"
    >
      <h2 className="caption-mono">{title}</h2>
      <div>{children}</div>
    </section>
  );
}

export default async function CvPage({ params }: PageProps<"/[locale]/cv">) {
  const lang = await resolveLocale(params);
  const c = await getTranslations("cv");

  return (
    <div className="shell pt-40 pb-24">
      <p className="caption-mono">{c("eyebrow")}</p>
      <h1 className="display-lg mt-4">{identity.name}</h1>
      <p className="title-md mt-4">{identity.headline[lang]}</p>
      <p className="body-sm mt-2 text-muted">{identity.location[lang]}</p>

      {/* Action bar for recruiters & visitors */}
      <div className="mt-8 flex flex-wrap items-center gap-3 print:hidden">
        <CvDownloadButton
          label={c("downloadPdf")}
          className="btn-outline bg-ink text-canvas inline-flex items-center gap-2"
        />
        <a href={`mailto:${identity.email}`} className="btn-outline inline-flex items-center gap-2">
          <Mail className="size-4" />
          <span>{c("email")}</span>
        </a>
        <PrintButton label={c("print")} className="btn-outline inline-flex items-center gap-2" />
        <Link href="/hiring" className="btn-ghost inline-flex items-center gap-1.5 ml-auto">
          <ArrowLeft className="size-3.5" />
          <span>{c("back")}</span>
        </Link>
      </div>

      <KeyFacts className="mt-12 max-w-2xl" />

      <div className="mt-16">
        <Row id="education" title={c("education")}>
          <EducationList />
        </Row>
        <Row id="experience" title={c("experience")}>
          <ul className="space-y-10">
            {experience.map((r) => (
              <li key={r.company}>
                <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                  <p className="title-md">{r.company}</p>
                  <span className="caption-mono">{r.period}</span>
                </div>
                <p className="caption-mono mt-2 text-muted">{r.title[lang]}</p>
                <ul className="mt-4 space-y-2">
                  {r.points[lang].map((p) => (
                    <li key={p} className="body-sm">
                      — {p}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Row>
        <Row id="skills" title={c("skills")}>
          <ul className="flex flex-wrap gap-3">
            {skills[lang].map((s) => (
              <li key={s} className="caption-mono border border-hairline-strong px-4 py-2">
                {s}
              </li>
            ))}
          </ul>
        </Row>
        <Row id="projects" title={c("projects")}>
          <ul className="space-y-6">
            {projects.map((p) => (
              <li key={p.slug}>
                <div className="flex items-baseline justify-between gap-4">
                  <Link href={`/projects/${p.slug}`} className="title-md hover:underline">
                    {p.name}
                  </Link>
                  <span className="caption-mono">{p.year}</span>
                </div>
                <p className="body-sm mt-2">{p.excerpt[lang]}</p>
                <p className="caption-mono mt-2 text-muted">{p.stack.slice(0, 5).join(" · ")}</p>
              </li>
            ))}
          </ul>
        </Row>
        <Row id="languages" title={c("languages")}>
          <ul className="space-y-3">
            {languages.map((l) => (
              <li key={l.name.en} className="flex items-baseline justify-between gap-4">
                <span className="title-md">{l.name[lang]}</span>
                <span className="caption-mono">{l.level[lang]}</span>
              </li>
            ))}
          </ul>
        </Row>
        <Row id="contact" title={c("contact")}>
          <ul className="space-y-2">
            <li>
              <a className="link-mono" href={`mailto:${identity.email}`}>
                {identity.email}
              </a>
            </li>
            <li>
              <a className="link-mono" href={identity.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a className="link-mono" href={identity.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </li>
          </ul>
        </Row>
      </div>
    </div>
  );
}
