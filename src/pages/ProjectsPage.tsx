import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { Page, PageHeader, Tags } from "@/components/site-chrome";
import { projects } from "@/lib/content";
import { useLang } from "@/lib/i18n";

// Staggered entrance animation orchestrator matching the design system's 'rise' utility
// (0.8s, cubic-bezier(0.22, 1, 0.36, 1), 16px vertical translation)
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function ProjectsPage() {
  const { t, lang } = useLang();

  return (
    <Page>
      <PageHeader title={t("navProjects")} intro={t("projectsIntro")} eyebrow="01 — 05" />

      <section className="section-y">
        <motion.div
          className="shell grid gap-16 md:grid-cols-2"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {projects.map((project) => (
            <motion.article
              key={project.slug}
              variants={cardVariants}
              className="rise [animation:none]"
            >
              <Link to={`/projects/${project.slug}`} className="group block">
                <div className="aspect-video overflow-hidden bg-surface-soft">
                  <img
                    src={project.image}
                    alt={t("projectImageAlt").replace("{name}", project.name)}
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
            </motion.article>
          ))}
        </motion.div>
      </section>
    </Page>
  );
}
