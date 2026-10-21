import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { StaggerGrid, StaggerItem } from "@/components/client-islands";
import { PageHeader, Tags } from "@/components/site-chrome";
import { resolveLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { projects } from "@/lib/content";
import { contentImage, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/projects">) {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "meta.projects" });
  return pageMetadata({
    locale,
    path: "/projects",
    title: t("title"),
    description: t("description"),
    image: contentImage("/images/project-signalist.jpg"),
  });
}

export default async function ProjectsPage({ params }: PageProps<"/[locale]/projects">) {
  const lang = await resolveLocale(params);
  const t = await getTranslations("common");

  return (
    <>
      <PageHeader title={t("navProjects")} intro={t("projectsIntro")} eyebrow="01 — 05" />

      <section className="section-y">
        <StaggerGrid className="shell grid gap-16 md:grid-cols-2">
          {projects.map((project) => (
            <StaggerItem key={project.slug} className="rise [animation:none]">
              <Link href={`/projects/${project.slug}`} className="group block">
                <div className="aspect-video overflow-hidden bg-surface-soft">
                  <Image
                    src={project.image}
                    alt={t("projectImageAlt", { name: project.name })}
                    width={1600}
                    height={912}
                    sizes="(min-width: 1280px) 580px, (min-width: 768px) 45vw, 100vw"
                    className="size-full object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-100"
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
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>
    </>
  );
}
