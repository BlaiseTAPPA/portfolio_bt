import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, Tags } from "@/components/site-chrome";
import { identity, projects, skills } from "@/lib/content";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Blaise Tappa — Full-Stack / Frontend Developer" },
      {
        name: "description",
        content:
          "Portfolio of Blaise Tappa, Full-Stack / Frontend Developer in Germersheim, Germany. React, TypeScript, Next.js. Available for Werkstudent positions.",
      },
      { property: "og:title", content: "Blaise Tappa — Full-Stack / Frontend Developer" },
      {
        property: "og:description",
        content:
          "React, TypeScript and Next.js work from Germersheim, Rheinland-Pfalz. Available for Werkstudent positions and freelance projects.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { t, lang } = useLang();
  const featured = projects.slice(0, 3);

  return (
    <Page>
      <section className="relative flex min-h-[92vh] items-end overflow-hidden border-b border-hairline">
        <img
          src="/images/hero-workspace.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-canvas/55" aria-hidden="true" />

        <div className="shell relative z-10 w-full pt-40 pb-20 md:pb-28">
          <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:items-end">
            <div className="rise">
              <p className="caption-mono">{identity.location}</p>
              <h1 className="display-xl mt-6">{identity.name}</h1>
              <p className="display-sm mt-4 text-body-strong">{identity.role[lang]}</p>
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

            <aside className="hidden w-80 bg-surface-card p-4 lg:block">
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
                <Link to="/projects/$slug" params={{ slug: project.slug }} className="group block">
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
          <Link to="/contact" className="btn-outline mt-10">
            {t("contactMe")}
          </Link>
        </div>
      </section>
    </Page>
  );
}
