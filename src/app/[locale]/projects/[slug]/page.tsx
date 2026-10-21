import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { JsonLd } from "@/components/json-ld";
import { Tags } from "@/components/site-chrome";
import { resolveLocale } from "@/i18n/locale";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { projects, type ProjectLinkType } from "@/lib/content";
import { contentImage, pageMetadata, projectJsonLd } from "@/lib/seo";

const linkLabelKey = { live: "liveDemo", repo: "githubRepo" } as const satisfies Record<
  ProjectLinkType,
  string
>;

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => projects.map(({ slug }) => ({ locale, slug })));
}

type Props = PageProps<"/[locale]/projects/[slug]">;

async function resolveProject(params: Props["params"]) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  const project = projects[index];
  if (!project) notFound();
  return { locale, project, next: projects[(index + 1) % projects.length]! };
}

export async function generateMetadata({ params }: Props) {
  const { locale, project } = await resolveProject(params);
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({
    locale,
    path: `/projects/${project.slug}`,
    title: `${t("caseStudyTitle", { name: project.name })} | Blaise Tappa`,
    description: project.excerpt[locale],
    image: contentImage(project.image),
    type: "article",
  });
}

export default async function ProjectDetailPage({ params }: Props) {
  const { locale: lang, project, next } = await resolveProject(params);
  const t = await getTranslations("common");

  return (
    <>
      <JsonLd data={projectJsonLd(project, lang)} />
      <section className="relative flex min-h-[70vh] items-end overflow-hidden border-b border-hairline">
        <Image
          src={project.image}
          alt={t("projectImageAlt", { name: project.name })}
          fill
          preload
          sizes="100vw"
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-canvas/55" aria-hidden="true" />
        <div className="shell relative z-10 pt-40 pb-16">
          <Link href="/projects" className="link-mono">
            {t("backToProjects")}
          </Link>
          <h1 className="display-xl mt-6">{project.name}</h1>
          <p className="body-md mt-5 max-w-xl">{project.excerpt[lang]}</p>
        </div>
      </section>

      <section className="border-b border-hairline py-10">
        <div className="shell flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <Tags items={project.stack} />
          <div className="flex flex-wrap items-center gap-4">
            {project.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className={link.type === "live" ? "btn-outline" : "btn-ghost"}
              >
                {t(linkLabelKey[link.type])}
              </a>
            ))}
            {project.nda ? <span className="caption-mono">{t("ndaLabel")}</span> : null}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="shell grid gap-16 lg:grid-cols-[220px_1fr]">
          <h2 className="display-sm">{t("problem")}</h2>
          <p className="body-md max-w-2xl">{project.problem[lang]}</p>
        </div>
        <div className="shell mt-16 grid gap-16 lg:grid-cols-[220px_1fr]">
          <h2 className="display-sm">{t("approach")}</h2>
          <p className="body-md max-w-2xl">{project.approach[lang]}</p>
        </div>
        <div className="shell mt-16 grid gap-16 lg:grid-cols-[220px_1fr]">
          <h2 className="display-sm">{t("technicalHighlights")}</h2>
          <ul className="max-w-2xl divide-y divide-hairline border-y border-hairline">
            {project.highlights[lang].map((point) => (
              <li key={point} className="body-md py-5">
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-hairline">
        <Link href={`/projects/${next.slug}`} className="group block">
          <div className="relative flex min-h-[45vh] items-center overflow-hidden">
            <Image
              src={next.image}
              alt=""
              aria-hidden="true"
              fill
              sizes="100vw"
              className="object-cover opacity-30 transition-opacity duration-500 group-hover:opacity-45"
            />
            <div className="absolute inset-0 bg-canvas/60" aria-hidden="true" />
            <div className="shell relative z-10 py-20">
              <p className="caption-mono">{t("nextProject")}</p>
              <p className="display-md mt-4">{next.name}</p>
            </div>
          </div>
        </Link>
      </section>
    </>
  );
}
