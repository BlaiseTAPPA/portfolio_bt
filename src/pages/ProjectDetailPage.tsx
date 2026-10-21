import { useParams, Link } from "react-router-dom";
import { Page, Tags } from "@/components/site-chrome";
import { projects, type ProjectLinkType } from "@/lib/content";
import { useLang } from "@/lib/i18n";

const linkLabelKey = { live: "liveDemo", repo: "githubRepo" } as const satisfies Record<
  ProjectLinkType,
  string
>;

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang } = useLang();

  const index = projects.findIndex((p) => p.slug === slug);
  const project = index !== -1 ? projects[index] : undefined;

  if (!project) {
    return (
      <Page>
        <section className="section-y">
          <div className="shell text-center py-20">
            <h1 className="display-lg">{t("projectNotFoundTitle")}</h1>
            <p className="body-md mt-4 text-muted">{t("projectNotFoundBody")}</p>
            <Link to="/projects" className="btn-outline mt-8 inline-block">
              {t("backToProjects")}
            </Link>
          </div>
        </section>
      </Page>
    );
  }

  const next = projects[(index + 1) % projects.length]!;

  return (
    <Page>
      <section className="relative flex min-h-[70vh] items-end overflow-hidden border-b border-hairline">
        <img
          src={project.image}
          alt={t("projectImageAlt").replace("{name}", project.name)}
          className="absolute inset-0 size-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-canvas/55" aria-hidden="true" />
        <div className="shell relative z-10 pt-40 pb-16">
          <Link to="/projects" className="link-mono">
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
        <Link to={`/projects/${next.slug}`} className="group block">
          <div className="relative flex min-h-[45vh] items-center overflow-hidden">
            <img
              src={next.image}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 size-full object-cover opacity-30 transition-opacity duration-500 group-hover:opacity-45"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-canvas/60" aria-hidden="true" />
            <div className="shell relative z-10 py-20">
              <p className="caption-mono">{t("nextProject")}</p>
              <p className="display-md mt-4">{next.name}</p>
            </div>
          </div>
        </Link>
      </section>
    </Page>
  );
}
