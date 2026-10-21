import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { EducationList, PageHeader } from "@/components/site-chrome";
import { resolveLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { aboutFacts, experience, identity, languages, skills } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.about" });
  return pageMetadata({
    locale,
    path: "/about",
    title: t("title"),
    description: t("description"),
    type: "profile",
  });
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const lang = await resolveLocale(params);
  const t = await getTranslations("common");
  const l = await getTranslations("about");

  return (
    <>
      <PageHeader title={t("navAbout")} intro={t("aboutIntro")} eyebrow={identity.location[lang]} />

      <section className="section-y">
        <div className="shell grid gap-16 lg:grid-cols-[360px_1fr] lg:items-start">
          <div className="lg:sticky lg:top-24">
            <Image
              src="/images/portrait-896.webp"
              width={896}
              height={1200}
              sizes="(min-width: 1024px) 360px, calc(100vw - 32px)"
              alt={t("portraitAlt", { name: identity.name })}
              className="h-auto w-full object-cover"
            />
            <div className="mt-8 border border-hairline p-6">
              <p className="caption-mono">{l("facts")}</p>
              <dl className="mt-5 space-y-4">
                {aboutFacts.map((f) => (
                  <div key={f.label.en} className="flex items-baseline justify-between gap-4">
                    <dt className="caption-mono">{f.label[lang]}</dt>
                    <dd className="body-sm text-right text-body-strong">{f.value[lang]}</dd>
                  </div>
                ))}
              </dl>
              <Link href="/projects" className="link-mono mt-6 inline-block">
                {l("viewProjects")}
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
              {languages.map((language) => (
                <li
                  key={language.name.en}
                  className="flex items-baseline justify-between gap-6 py-6"
                >
                  <span className="title-md">{language.name[lang]}</span>
                  <span className="caption-mono text-right">{language.level[lang]}</span>
                </li>
              ))}
            </ul>

            <h2 className="display-sm mt-20">{l("skillsTitle")}</h2>
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
    </>
  );
}
