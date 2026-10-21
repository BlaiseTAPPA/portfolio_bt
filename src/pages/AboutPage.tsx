import { Link } from "react-router-dom";
import { EducationList, Page, PageHeader } from "@/components/site-chrome";
import { experience, identity, languages, skills } from "@/lib/content";
import { useLang } from "@/lib/i18n";

const facts = {
  en: [
    { label: "Based in", value: "Germersheim, DE" },
    { label: "Studying", value: "B.Sc. Computer Science" },
    { label: "Availability", value: "20 h / week, remote or hybrid" },
    { label: "Open to", value: "Werkstudent roles" },
  ],
  de: [
    { label: "Wohnort", value: "Germersheim, DE" },
    { label: "Studium", value: "B.Sc. Informatik" },
    { label: "Verfügbarkeit", value: "20 Std./Woche, remote oder hybrid" },
    { label: "Offen für", value: "Werkstudentenstellen" },
  ],
  fr: [
    { label: "Localisation", value: "Germersheim, Allemagne" },
    { label: "Études", value: "B.Sc. Informatique" },
    { label: "Disponibilité", value: "20 h / semaine, remote ou hybride" },
    { label: "Statut recherché", value: "Werkstudent" },
  ],
};

const labels = {
  en: { facts: "At a glance", skillsTitle: "Toolkit", viewProjects: "See the work →" },
  de: { facts: "Auf einen Blick", skillsTitle: "Werkzeuge", viewProjects: "Zur Arbeit →" },
  fr: {
    facts: "En un coup d'œil",
    skillsTitle: "Boîte à outils",
    viewProjects: "Voir les projets →",
  },
};

const languageScore: Record<string, number> = { English: 90, French: 100, German: 45 };

export function AboutPage() {
  const { t, lang } = useLang();
  const l = labels[lang];

  return (
    <Page>
      <PageHeader title={t("navAbout")} intro={t("aboutIntro")} eyebrow={identity.location} />

      <section className="section-y">
        <div className="shell grid gap-16 lg:grid-cols-[360px_1fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <picture>
              <source
                type="image/avif"
                srcSet="/images/portrait-448.avif 448w, /images/portrait-720.avif 720w, /images/portrait-896.avif 896w"
                sizes="(min-width: 1024px) 360px, calc(100vw - 32px)"
              />
              <img
                src="/images/portrait-720.webp"
                srcSet="/images/portrait-448.webp 448w, /images/portrait-720.webp 720w, /images/portrait-896.webp 896w"
                sizes="(min-width: 1024px) 360px, calc(100vw - 32px)"
                width={896}
                height={1200}
                alt={`Portrait of ${identity.name}`}
                className="h-auto w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </picture>
            <div className="mt-8 border border-hairline p-6">
              <p className="caption-mono">{l.facts}</p>
              <dl className="mt-5 space-y-4">
                {facts[lang].map((f) => (
                  <div key={f.label} className="flex items-baseline justify-between gap-4">
                    <dt className="caption-mono">{f.label}</dt>
                    <dd className="body-sm text-right text-body-strong">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <Link to="/projects" className="link-mono mt-6 inline-block">
                {l.viewProjects}
              </Link>
            </div>
          </div>

          <div>
            <h2 className="display-sm">{t("experience")}</h2>
            <ol className="mt-10 border-y border-hairline">
              {experience.map((role, i) => (
                <li
                  key={role.company}
                  className="rise grid gap-6 border-b border-hairline py-8 last:border-b-0 md:grid-cols-[64px_1fr]"
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  <span className="caption-mono text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
                      <div>
                        <p className="title-md">{role.company}</p>
                        <p className="caption-mono mt-2">{role.title[lang]}</p>
                      </div>
                      <span className="caption-mono md:text-right">{role.period}</span>
                    </div>
                    <ul className="mt-5 space-y-2">
                      {role.points[lang].map((point) => (
                        <li key={point} className="body-sm">
                          — {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>

            <h2 className="display-sm mt-20">{t("education")}</h2>
            <div className="mt-10">
              <EducationList />
            </div>

            <h2 className="display-sm mt-20">{t("languagesTitle")}</h2>
            <ul className="mt-10 space-y-8 border-y border-hairline py-8">
              {languages.map((lang_) => (
                <li key={lang_.name.en}>
                  <div className="flex items-baseline justify-between gap-6">
                    <span className="title-md">{lang_.name[lang]}</span>
                    <span className="caption-mono">{lang_.level[lang]}</span>
                  </div>
                  <div className="mt-3 h-px bg-hairline" role="presentation">
                    <div
                      className="h-px bg-ink transition-[width] duration-700"
                      style={{ width: `${languageScore[lang_.name.en] ?? 50}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>

            <h2 className="display-sm mt-20">{l.skillsTitle}</h2>
            <ul className="mt-10 flex flex-wrap gap-3 border-y border-hairline py-8">
              {skills.map((s) => (
                <li key={s} className="caption-mono border border-hairline px-4 py-2">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </Page>
  );
}
