import Image from "next/image";
import { Linkedin, Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/json-ld";
import { Tags } from "@/components/site-chrome";
import { resolveLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { identity, projects, skills } from "@/lib/content";
import { pageMetadata, personJsonLd } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]">) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.home" });
  return pageMetadata({ locale, path: "", title: t("title"), description: t("description") });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const lang = await resolveLocale(params);
  const t = await getTranslations("common");
  const featured = projects.slice(0, 3);

  return (
    <>
      <JsonLd data={personJsonLd(lang)} />
      <section className="relative flex min-h-[92vh] items-end overflow-hidden border-b border-hairline">
        {/* LCP element: preloaded, served as AVIF/WebP at the viewport's width. */}
        <Image
          src="/images/hero-workspace-1920.webp"
          alt=""
          aria-hidden="true"
          fill
          preload
          sizes="100vw"
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-canvas/55" aria-hidden="true" />

        <div className="shell relative z-10 w-full pt-40 pb-20 md:pb-28">
          <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:items-end">
            <div className="rise">
              <p className="caption-mono">{identity.location[lang]}</p>
              <h1 className="display-xl mt-6">{identity.name}</h1>
              <p className="display-sm mt-4 text-body-strong">{identity.headline[lang]}</p>
              <p className="body-md mt-8 max-w-xl">{t("heroPitch")}</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/projects" className="btn-outline">
                  {t("viewProjects")}
                </Link>
                <Link href="/contact" className="btn-ghost">
                  {t("getInTouch")}
                </Link>
              </div>
            </div>

            <aside className="w-full bg-surface-card p-4 lg:w-80">
              <p className="caption-mono text-body-strong">{t("availableTitle")}</p>
              <p className="body-sm mt-3">{t("availableBody")}</p>
              <Link href="/projects" className="link-mono mt-4 inline-block">
                {t("exploreWork")}
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <section className="border-b border-hairline py-8">
        <div className="shell flex flex-wrap items-center gap-x-6 gap-y-3">
          {skills[lang].map((skill, i) => (
            <span key={skill} className="caption-mono flex items-center gap-6">
              {i > 0 ? (
                <span aria-hidden="true" className="text-muted-soft">
                  ·
                </span>
              ) : null}
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section className="section-y">
        <div className="shell">
          <h2 className="display-md">{t("featuredProjects")}</h2>
          <div className="mt-14 grid gap-12 md:grid-cols-3">
            {featured.map((project) => (
              <article key={project.slug}>
                <Link href={`/projects/${project.slug}`} className="group block">
                  <div className="aspect-video overflow-hidden bg-surface-soft">
                    <Image
                      src={project.image}
                      alt={t("projectImageAlt", { name: project.name })}
                      width={1600}
                      height={912}
                      sizes="(min-width: 1280px) 384px, (min-width: 768px) 30vw, 100vw"
                      className="size-full object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-100"
                    />
                  </div>
                  <h3 className="title-md mt-6">{project.name}</h3>
                  <p className="body-sm mt-3">{project.excerpt[lang]}</p>
                  <div className="mt-5">
                    <Tags items={project.stack.slice(0, 4)} />
                  </div>
                </Link>
              </article>
            ))}
          </div>
          <Link href="/projects" className="link-mono mt-14 inline-block">
            {t("allProjects")} →
          </Link>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-hairline">
        <Image
          src="/images/cta-band.jpg"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-canvas/60" aria-hidden="true" />
        <div className="shell relative z-10 flex flex-col items-center py-24 text-center md:py-32">
          <h2 className="display-md">{t("ctaHeadline")}</h2>
          <p className="body-md mt-5 max-w-lg">{t("ctaBody")}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/contact" className="btn-outline bg-ink text-canvas">
              {t("contactMe")}
            </Link>
            <a
              href={`mailto:${identity.email}`}
              className="btn-outline inline-flex items-center gap-2 bg-canvas/80 backdrop-blur-sm"
            >
              <Mail className="size-4" />
              <span>{t("emailMe")}</span>
            </a>
            <a
              href={identity.linkedin}
              target="_blank"
              rel="noreferrer"
              className="btn-outline inline-flex items-center gap-2 bg-canvas/80 backdrop-blur-sm"
            >
              <Linkedin className="size-4" />
              <span>{t("linkedinProfile")}</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
