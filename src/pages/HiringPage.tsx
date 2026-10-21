import { Link } from "react-router-dom";
import { Download, Linkedin, Mail } from "lucide-react";
import { KeyFacts, Page, PageHeader } from "@/components/site-chrome";
import { useLang } from "@/lib/i18n";
import { experience, skills, languages, projects, identity } from "@/lib/content";
import { downloadCvPdf } from "@/lib/cv-download";
import { hiringCopy } from "@/lib/page-copy";

export function HiringPage() {
  const { t, lang } = useLang();
  const c = hiringCopy[lang];

  return (
    <Page>
      <PageHeader title={c.title} intro={c.intro} eyebrow={c.eyebrow} />

      {/* Recruiter Quick Actions Bar */}
      <section className="border-b border-hairline py-6 bg-surface-soft/40">
        <div className="shell flex flex-wrap items-center justify-between gap-4">
          <p className="caption-mono text-muted flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400 inline-block" />
            <span>{c.status}</span>
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${identity.email}`}
              className="btn-outline bg-ink text-canvas text-xs inline-flex items-center gap-2 py-2 px-4"
            >
              <Mail className="size-3.5" />
              <span>{t("emailMe")}</span>
            </a>
            <a
              href={identity.linkedin}
              target="_blank"
              rel="noreferrer"
              className="btn-outline text-xs inline-flex items-center gap-2 py-2 px-4"
            >
              <Linkedin className="size-3.5" />
              <span>{t("linkedinProfile")}</span>
            </a>
            <button
              type="button"
              onClick={() => void downloadCvPdf(lang)}
              className="btn-outline text-xs inline-flex items-center gap-2 py-2 px-4"
            >
              <Download className="size-3.5" />
              <span>{c.downloadPdf}</span>
            </button>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="caption-mono">00</p>
            <h2 className="display-sm mt-4">{t("keyFactsTitle")}</h2>
          </div>
          <div>
            <KeyFacts hideTitle />
            <Link to="/cv" className="link-mono mt-6 inline-block">
              {c.cv} →
            </Link>
          </div>
        </div>
      </section>

      {/* Static quick view sections for reference */}
      <section className="section-y border-t border-hairline">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="caption-mono">01</p>
            <h2 className="display-sm mt-4">{c.background}</h2>
          </div>
          <div>
            <ol className="border-t border-hairline">
              {experience.map((role_) => (
                <li
                  key={role_.company}
                  className="grid gap-4 border-b border-hairline py-6 md:grid-cols-[200px_1fr]"
                >
                  <div>
                    <p className="title-md">{role_.company}</p>
                    <p className="caption-mono mt-1">{role_.period}</p>
                  </div>
                  <div>
                    <p className="body-md text-ink">{role_.title[lang]}</p>
                    <ul className="mt-4 space-y-2">
                      {role_.points[lang].map((pt) => (
                        <li key={pt} className="body-sm text-body">
                          • {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
            <Link to="/cv#experience" className="link-mono mt-6 inline-block">
              {c.fullCv} →
            </Link>
          </div>
        </div>
      </section>

      <section className="section-y border-t border-hairline">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="caption-mono">02</p>
            <h2 className="display-sm mt-4">{c.skills}</h2>
          </div>
          <div>
            <div className="flex flex-wrap gap-2">
              {skills[lang].map((s) => (
                <span key={s} className="border border-hairline px-3 py-1 font-mono text-xs">
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-8 border-t border-hairline pt-6">
              <p className="caption-mono text-muted mb-4">{t("languagesTitle")}</p>
              <div className="flex flex-wrap gap-4">
                {languages.map((l) => (
                  <span key={l.name.en} className="body-sm">
                    <strong>{l.name[lang]}:</strong> {l.level[lang]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y border-t border-hairline">
        <div className="shell grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="caption-mono">03</p>
            <h2 className="display-sm mt-4">{c.projects}</h2>
          </div>
          <div>
            <div className="grid gap-6 sm:grid-cols-2">
              {projects.slice(0, 4).map((p) => (
                <Link
                  key={p.slug}
                  to={`/projects/${p.slug}`}
                  className="group block border border-hairline p-5 transition-colors hover:border-ink"
                >
                  <p className="title-md">{p.name}</p>
                  <p className="caption-mono mt-1">{p.year}</p>
                  <p className="body-sm mt-3 text-muted">{p.excerpt[lang]}</p>
                  <span className="link-mono mt-4 inline-block group-hover:text-ink">
                    {c.viewCase} →
                  </span>
                </Link>
              ))}
            </div>
            <Link to="/projects" className="link-mono mt-6 inline-block">
              {c.allProjects} →
            </Link>
          </div>
        </div>
      </section>
    </Page>
  );
}
