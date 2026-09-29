import { identity, projects, posts, type Lang } from "./content.ts";

export type SeoData = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  type: "website" | "article" | "profile";
  url?: string;
  author?: string;
  publishedTime?: string;
  jsonLd?: Record<string, unknown>;
};

export function getSeoMetadata(pathname: string, lang: Lang, origin = ""): SeoData {
  const cleanPath = pathname.replace(/\/$/, "") || "/";
  const baseUrl = origin.replace(/\/$/, "");

  // 1. Project Detail (/projects/:slug)
  if (cleanPath.startsWith("/projects/")) {
    const slug = cleanPath.replace("/projects/", "");
    const proj = projects.find((p) => p.slug === slug);
    if (proj) {
      const title =
        lang === "fr"
          ? `${proj.name} — Étude de cas | Blaise Tappa`
          : lang === "de"
            ? `${proj.name} — Fallstudie | Blaise Tappa`
            : `${proj.name} — Case Study | Blaise Tappa`;

      const description =
        proj.excerpt[lang] ||
        `Technical case study of ${proj.name}, built with ${proj.stack.slice(0, 3).join(", ")}.`;

      const imageUrl = proj.image?.startsWith("http")
        ? proj.image
        : `${baseUrl}${proj.image || "/images/hero-workspace.jpg"}`;

      return {
        title,
        description,
        image: imageUrl,
        imageAlt: `${proj.name} — Technical Architecture & Interface`,
        type: "article",
        url: `${baseUrl}${cleanPath}`,
        author: identity.name,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: proj.name,
          applicationCategory: "WebApplication",
          operatingSystem: "All",
          description: proj.excerpt[lang],
          author: {
            "@type": "Person",
            name: identity.name,
            url: baseUrl || "https://blaisetappa.dev",
          },
        },
      };
    }
  }

  // 2. Blog Post Detail (/blog/:slug)
  if (cleanPath.startsWith("/blog/")) {
    const slug = cleanPath.replace("/blog/", "");
    const post = posts.find((p) => p.slug === slug);
    if (post) {
      const title = `${post.title[lang]} | Blaise Tappa`;
      const description = post.excerpt[lang];
      const imageUrl = post.image.startsWith("http") ? post.image : `${baseUrl}${post.image}`;

      return {
        title,
        description,
        image: imageUrl,
        imageAlt: post.title[lang],
        type: "article",
        url: `${baseUrl}${cleanPath}`,
        author: identity.name,
        publishedTime: post.date,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title[lang],
          description: post.excerpt[lang],
          datePublished: post.date,
          author: {
            "@type": "Person",
            name: identity.name,
            url: baseUrl || "https://blaisetappa.dev",
          },
          image: imageUrl,
        },
      };
    }
  }

  // 3. Static Pages
  switch (cleanPath) {
    case "/projects":
      return {
        title:
          lang === "fr"
            ? "Projets & Études de cas — Blaise Tappa"
            : lang === "de"
              ? "Projekte & Fallstudien — Blaise Tappa"
              : "Projects & Engineering Case Studies — Blaise Tappa",
        description:
          lang === "fr"
            ? "Explorez les réalisations techniques et architectures de Blaise Tappa : React, TypeScript, Next.js, WebSockets et intégrations IA."
            : lang === "de"
              ? "Erkunden Sie die technischen Fallstudien von Blaise Tappa: React, TypeScript, Next.js, WebSockets und KI-Integrationen."
              : "Explore production engineering case studies by Blaise Tappa: React, TypeScript, Next.js, real-time WebSockets, and AI integrations.",
        image: `${baseUrl}/images/project-signalist.jpg`,
        imageAlt: "Blaise Tappa — Engineering Portfolio Projects",
        type: "website",
        url: `${baseUrl}/projects`,
      };

    case "/about":
      return {
        title:
          lang === "fr"
            ? "À propos de Blaise Tappa — Ingénieur & Développeur"
            : lang === "de"
              ? "Über Blaise Tappa — Full-Stack-Entwickler"
              : "About Blaise Tappa — Full-Stack / Frontend Developer",
        description:
          lang === "fr"
            ? "Parcours, philosophie de développement et formation de Blaise Tappa. Spécialisé en React, TypeScript et intégration d'IA."
            : lang === "de"
              ? "Werdegang, Philosophie und Ausbildung von Blaise Tappa. Spezialisiert auf React, TypeScript und KI-Systeme."
              : "Background, software craftsmanship philosophy, and education of Blaise Tappa. Specialized in React, TypeScript, and AI systems.",
        image: `${baseUrl}/images/portrait.jpg`,
        imageAlt: "Blaise Tappa portrait",
        type: "profile",
        url: `${baseUrl}/about`,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "Person",
          name: identity.name,
          jobTitle: identity.role[lang],
          email: identity.email,
          nationality: "German / French",
          sameAs: [identity.github, identity.linkedin],
        },
      };

    case "/blog":
      return {
        title:
          lang === "fr"
            ? "Articles & Réflexions techniques — Blaise Tappa"
            : lang === "de"
              ? "Blog & Technische Notizen — Blaise Tappa"
              : "Technical Writing & Architecture Notes — Blaise Tappa",
        description:
          lang === "fr"
            ? "Retours d'expérience sur React 19, les LLMs en production, TypeScript et les workflows d'ingénierie modernes."
            : lang === "de"
              ? "Erfahrungsberichte zu React 19, LLM-APIs in der Produktion, TypeScript und modernen Frontend-Architekturen."
              : "Deep-dives into React 19, Gemini LLM integrations in production, TypeScript design patterns, and engineering workflows.",
        image: `${baseUrl}/images/post-gemini.jpg`,
        imageAlt: "Blaise Tappa Technical Blog",
        type: "website",
        url: `${baseUrl}/blog`,
      };

    case "/hiring":
      return {
        title:
          lang === "fr"
            ? "Espace Recrutement & Profil — Blaise Tappa"
            : lang === "de"
              ? "Recruiting & Profil-Shortlist — Blaise Tappa"
              : "Hiring & Recruiter Fit Evaluation — Blaise Tappa",
        description:
          lang === "fr"
            ? "Évaluez l'adéquation de Blaise Tappa pour vos postes étudiants (Werkstudent 20h/semaine), missions freelance ou rôles Frontend."
            : lang === "de"
              ? "Prüfen Sie das Profil von Blaise Tappa für Werkstudentenstellen (20 Std./Woche), Freelance-Projekte oder Frontend-Teams."
              : "Evaluate Blaise Tappa for Werkstudent roles (20h/week), freelance contracts, or frontend positions. Direct 15-min booking and CV PDF available.",
        image: `${baseUrl}/images/hero-workspace.jpg`,
        imageAlt: "Blaise Tappa — Hiring & Profile Evaluation",
        type: "website",
        url: `${baseUrl}/hiring`,
      };

    case "/cv":
      return {
        title:
          lang === "fr"
            ? "Curriculum Vitæ — Blaise Tappa"
            : lang === "de"
              ? "Lebenslauf — Blaise Tappa"
              : "Curriculum Vitae — Blaise Tappa",
        description:
          lang === "fr"
            ? "Consultez et téléchargez le CV complet de Blaise Tappa : expériences chez OMOA Group, Société Logex, compétences React/TypeScript et diplômes."
            : lang === "de"
              ? "Vollständiger Lebenslauf von Blaise Tappa: Stationen bei OMOA Group, Logex, React/TypeScript-Expertise und SRH-Studium."
              : "Complete CV of Blaise Tappa: professional experience at OMOA Group, Logex, technical skills, and computer science degree. Instant PDF download.",
        image: `${baseUrl}/images/hero-workspace.jpg`,
        imageAlt: "Blaise Tappa — Curriculum Vitae",
        type: "website",
        url: `${baseUrl}/cv`,
      };

    case "/contact":
      return {
        title:
          lang === "fr"
            ? "Contact & Rendez-vous — Blaise Tappa"
            : lang === "de"
              ? "Kontakt & Terminbuchung — Blaise Tappa"
              : "Contact & Book a Meeting — Blaise Tappa",
        description:
          lang === "fr"
            ? "Prenez contact avec Blaise Tappa ou réservez un créneau de 15 minutes en visioconférence pour échanger sur vos opportunités."
            : lang === "de"
              ? "Kontaktieren Sie Blaise Tappa oder buchen Sie direkt einen 15-Minuten-Videocall für ein erstes Kennenlernen."
              : "Get in touch with Blaise Tappa or book an informal 15-minute video call to discuss engineering roles and projects.",
        image: `${baseUrl}/images/hero-workspace.jpg`,
        imageAlt: "Blaise Tappa — Contact",
        type: "website",
        url: `${baseUrl}/contact`,
      };

    case "/":
    default:
      return {
        title:
          lang === "fr"
            ? "Blaise Tappa — Développeur Full-Stack / Frontend"
            : lang === "de"
              ? "Blaise Tappa — Full-Stack- / Frontend-Entwickler"
              : "Blaise Tappa — Full-Stack / Frontend Developer",
        description:
          lang === "fr"
            ? "Portfolio de Blaise Tappa, développeur Full-Stack / Frontend spécialisé en React, TypeScript, Next.js et intégration d'IA. Disponible pour contrat étudiant et missions."
            : lang === "de"
              ? "Portfolio von Blaise Tappa, Full-Stack- / Frontend-Entwickler mit Fokus auf React, TypeScript, Next.js und KI-Systeme. Verfügbar als Werkstudent und Freelancer."
              : "Portfolio of Blaise Tappa, Full-Stack / Frontend Developer focused on React, TypeScript, Next.js, and AI integrations. Available for Werkstudent roles & freelance.",
        image: `${baseUrl}/images/hero-workspace.jpg`,
        imageAlt: "Blaise Tappa — Full-Stack / Frontend Developer",
        type: "website",
        url: `${baseUrl}/`,
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Blaise Tappa Portfolio",
          url: baseUrl || "https://blaisetappa.dev",
          author: {
            "@type": "Person",
            name: identity.name,
            jobTitle: identity.role[lang],
          },
        },
      };
  }
}
