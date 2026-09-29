import { createFileRoute, Link } from "@tanstack/react-router";
import { Page, PageHeader, Tags } from "@/components/site-chrome";
import { projects } from "@/lib/content";
import { useLang } from "@/lib/i18n";
import { ProjectMatcher } from "@/components/project-matcher";
import { ProjectBuilder } from "@/components/project-builder";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — Blaise Tappa" },
      {
        name: "description",
        content:
          "Case studies: Signalist, Roomify, Tankstellen-Finder, Femmes d'Audace and Grand-Bassam Tourisme — architecture, stack and decisions.",
      },
      { property: "og:title", content: "Projects — Blaise Tappa" },
      {
        property: "og:description",
        content: "Five case studies in React, TypeScript, Next.js and AI integration.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProjectsIndex,
});

function ProjectsIndex() {
  const { t, lang } = useLang();

  return (
    <Page>
      <PageHeader title={t("navProjects")} intro={t("projectsIntro")} eyebrow="01 — 05" />

      <section className="section-y">
        <div className="shell grid gap-16 md:grid-cols-2">
          {projects.map((project) => (
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
                <div className="mt-6 flex items-baseline justify-between gap-4">
                  <h2 className="title-md">{project.name}</h2>
                  <span className="caption-mono">{project.year}</span>
                </div>
                <div className="mt-4">
                  <Tags items={project.stack} />
                </div>
                <p className="body-sm mt-5">{project.excerpt[lang]}</p>
                <span className="link-mono mt-5 inline-block">{t("viewCaseStudy")}</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <ProjectMatcher />

      <ProjectBuilder />
    </Page>
  );
}
