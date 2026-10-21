import { Link } from "react-router-dom";
import { Linkedin, Mail } from "lucide-react";
import { Page, Tags } from "@/components/site-chrome";
import { identity, projects, skills } from "@/lib/content";
import { useLang } from "@/lib/i18n";

export function HomePage() {
  const { t, lang } = useLang();
  const featured = projects.slice(0, 3);

  return (
    <Page>
      <section className="relative flex min-h-[92vh] items-end overflow-hidden border-b border-hairline">
        <picture>
          <source
            type="image/avif"
            srcSet="/images/hero-workspace-768.avif 768w, /images/hero-workspace-1280.avif 1280w, /images/hero-workspace-1920.avif 1920w"
            sizes="100vw"
          />
          <img
            src="/images/hero-workspace-1280.webp"
            srcSet="/images/hero-workspace-768.webp 768w, /images/hero-workspace-1280.webp 1280w, /images/hero-workspace-1920.webp 1920w"
            sizes="100vw"
            width={1920}
            height={1088}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 size-full object-cover opacity-45"
          />
        </picture>
        <div className="absolute inset-0 bg-canvas/55" aria-hidden="true" />

        <div className="shell relative z-10 w-full pt-40 pb-20 md:pb-28">
          <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:items-end">
            <div className="rise">
              <p className="caption-mono">{identity.location}</p>
              <h1 className="display-xl mt-6">{identity.name}</h1>
              <p className="display-sm mt-4 text-body-strong">{identity.headline[lang]}</p>
              <p className="body-md mt-8 max-w-xl">{t("heroPitch")}</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/projects" className="btn-outline">
                  {t("viewProjects")}
                </Link>
                <Link to="/contact" className="btn-ghost">
                  {t("getInTouch")}
                </Link>
              </div>
            </div>

            <aside className="w-full bg-surface-card p-4 lg:w-80">
              <p className="caption-mono text-body-strong">{t("availableTitle")}</p>
              <p className="body-sm mt-3">{t("availableBody")}</p>
              <Link to="/projects" className="link-mono mt-4 inline-block">
                {t("exploreWork")}
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <section className="border-b border-hairline py-8">
        <div className="shell flex flex-wrap items-center gap-x-6 gap-y-3">
          {skills.map((skill, i) => (
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
                <Link to={`/projects/${project.slug}`} className="group block">
                  <div className="aspect-video overflow-hidden bg-surface-soft">
                    <img
                      src={project.image}
                      alt={`${project.name} interface`}
                      className="size-full object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-100"
                      loading="lazy"
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
          <Link to="/projects" className="link-mono mt-14 inline-block">
            {t("allProjects")} →
          </Link>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-hairline">
        <img
          src="/images/cta-band.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover opacity-35"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-canvas/60" aria-hidden="true" />
        <div className="shell relative z-10 flex flex-col items-center py-24 text-center md:py-32">
          <h2 className="display-md">{t("ctaHeadline")}</h2>
          <p className="body-md mt-5 max-w-lg">{t("ctaBody")}</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/contact" className="btn-outline bg-ink text-canvas">
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
    </Page>
  );
}
