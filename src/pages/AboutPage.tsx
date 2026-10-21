import { Link } from "react-router-dom";
import { EducationList, Page, PageHeader } from "@/components/site-chrome";
import { experience, identity, languages, skills } from "@/lib/content";
import { useLang } from "@/lib/i18n";
import { aboutFacts, aboutLabels } from "@/lib/page-copy";

export function AboutPage() {
  const { t, lang } = useLang();
  const l = aboutLabels[lang];

  return (
    <Page>
      <PageHeader title={t("navAbout")} intro={t("aboutIntro")} eyebrow={identity.location[lang]} />

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
                alt={t("portraitAlt").replace("{name}", identity.name)}
                className="h-auto w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </picture>
            <div className="mt-8 border border-hairline p-6">
              <p className="caption-mono">{l.facts}</p>
              <dl className="mt-5 space-y-4">
                {aboutFacts[lang].map((f) => (
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
            <ul className="mt-10 divide-y divide-hairline border-y border-hairline">
              {languages.map((lang_) => (
                <li key={lang_.name.en} className="flex items-baseline justify-between gap-6 py-6">
                  <span className="title-md">{lang_.name[lang]}</span>
                  <span className="caption-mono text-right">{lang_.level[lang]}</span>
                </li>
              ))}
            </ul>

            <h2 className="display-sm mt-20">{l.skillsTitle}</h2>
            <ul className="mt-10 flex flex-wrap gap-3 border-y border-hairline py-8">
              {skills[lang].map((s) => (
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
