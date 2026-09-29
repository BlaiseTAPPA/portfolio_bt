import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Lang } from "./content";

const STORAGE_KEY = "bt-lang";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: keyof typeof dict) => string };

const LangContext = createContext<Ctx>({ lang: "en", setLang: () => {}, t: (k) => dict[k].en });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "de" || stored === "en") setLangState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const t = useCallback((key: keyof typeof dict) => dict[key][lang], [lang]);

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}

export const dict = {
  navHome: { en: "Home", de: "Start" },
  navProjects: { en: "Projects", de: "Projekte" },
  navAbout: { en: "About", de: "Über mich" },
  navBlog: { en: "Blog", de: "Blog" },
  navHiring: { en: "Hiring", de: "Recruiting" },
  navContact: { en: "Contact", de: "Kontakt" },
  menu: { en: "Menu", de: "Menü" },
  close: { en: "Close", de: "Schließen" },

  heroPitch: {
    en: "I build fast, accessible web products with React, TypeScript and Next.js — from real-time data dashboards to AI-assisted tools.",
    de: "Ich baue schnelle, barrierefreie Webprodukte mit React, TypeScript und Next.js — von Echtzeit-Dashboards bis zu KI-gestützten Tools.",
  },
  viewProjects: { en: "View projects", de: "Projekte ansehen" },
  getInTouch: { en: "Get in touch", de: "Kontakt aufnehmen" },
  availableTitle: {
    en: "Available for Werkstudent positions",
    de: "Verfügbar für Werkstudentenstellen",
  },
  availableBody: {
    en: "20 h / week, remote or hybrid in Rheinland-Pfalz, available immediately. Also open to freelance work.",
    de: "20 Std./Woche, remote oder hybrid in Rheinland-Pfalz, ab sofort verfügbar. Auch offen für Freelance-Arbeit.",
  },
  exploreWork: { en: "Explore my work →", de: "Meine Arbeit ansehen →" },

  featuredProjects: { en: "Featured projects", de: "Ausgewählte Projekte" },
  allProjects: { en: "All projects", de: "Alle Projekte" },
  viewCaseStudy: { en: "View case study →", de: "Case Study ansehen →" },
  ctaHeadline: { en: "Let's build something", de: "Lassen Sie uns etwas bauen" },
  ctaBody: {
    en: "Open to Werkstudent roles and freelance engagements from Germersheim, Rheinland-Pfalz.",
    de: "Offen für Werkstudentenstellen und Freelance-Projekte, von Germersheim aus, Rheinland-Pfalz.",
  },
  contactMe: { en: "Contact me", de: "Kontaktieren" },

  projectsIntro: {
    en: "Case studies from production work and self-directed builds — architecture decisions, stack, and what each one had to solve.",
    de: "Case Studies aus Produktivarbeit und eigenen Projekten — Architekturentscheidungen, Stack und das jeweils zu lösende Problem.",
  },
  problem: { en: "The problem", de: "Das Problem" },
  approach: { en: "Approach", de: "Vorgehen" },
  technicalHighlights: { en: "Technical highlights", de: "Technische Highlights" },
  liveDemo: { en: "Live demo", de: "Live-Demo" },
  githubRepo: { en: "GitHub repo", de: "GitHub-Repo" },
  nextProject: { en: "Next project", de: "Nächstes Projekt" },
  backToProjects: { en: "← All projects", de: "← Alle Projekte" },
  stack: { en: "Stack", de: "Stack" },

  aboutIntro: {
    en: "B.Sc. Computer Science student at SRH University, based in Germersheim. I work across the frontend and the delivery layer: interface engineering, performance, and keeping technical decisions legible to the people who fund them.",
    de: "B.Sc.-Informatikstudent an der SRH University, wohnhaft in Germersheim. Ich arbeite im Frontend und in der Auslieferung: Interface-Engineering, Performance und technische Entscheidungen so erklären, dass Entscheider sie nachvollziehen.",
  },
  experience: { en: "Experience", de: "Berufserfahrung" },
  education: { en: "Education", de: "Ausbildung" },
  languagesTitle: { en: "Languages", de: "Sprachen" },

  blogIntro: {
    en: "Notes on architecture, AI integration and working as a developer in Germany.",
    de: "Notizen zu Architektur, KI-Integration und der Arbeit als Entwickler in Deutschland.",
  },
  readArticle: { en: "Read article →", de: "Artikel lesen →" },
  backToBlog: { en: "← All articles", de: "← Alle Artikel" },

  contactTitle: { en: "Get in touch", de: "Kontakt aufnehmen" },
  contactIntro: {
    en: "Looking for a Werkstudent position (20 h / week, remote or hybrid) and available immediately. Freelance and consulting enquiries welcome.",
    de: "Auf der Suche nach einer Werkstudentenstelle (20 Std./Woche, remote oder hybrid), ab sofort verfügbar. Freelance- und Beratungsanfragen willkommen.",
  },
  fieldName: { en: "Name", de: "Name" },
  fieldEmail: { en: "Email", de: "E-Mail" },
  fieldMessage: { en: "Message", de: "Nachricht" },
  send: { en: "Send", de: "Senden" },
  sent: {
    en: "Thank you — your message is ready to send. Mail client opening.",
    de: "Danke — Ihre Nachricht ist bereit. Das E-Mail-Programm öffnet sich.",
  },
  direct: { en: "Direct", de: "Direkt" },
  validationName: { en: "Please enter your name.", de: "Bitte geben Sie Ihren Namen ein." },
  validationEmail: { en: "Please enter a valid email address.", de: "Bitte geben Sie eine gültige E-Mail-Adresse ein." },
  validationMessage: { en: "Please write a short message.", de: "Bitte schreiben Sie eine kurze Nachricht." },

  footerWork: { en: "Work", de: "Arbeit" },
  footerAbout: { en: "About", de: "Über" },
  footerConnect: { en: "Connect", de: "Kontakt" },
  footerStatus: { en: "Available for projects", de: "Verfügbar für Projekte" },
  footerLocation: { en: "Germersheim, DE — {time}", de: "Germersheim, DE — {time}" },
  backToTop: { en: "Back to top ↑", de: "Nach oben ↑" },
  rights: { en: "All rights reserved.", de: "Alle Rechte vorbehalten." },
} satisfies Record<string, Record<Lang, string>>;
