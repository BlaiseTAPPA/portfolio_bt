import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { Lang } from "./content";

const STORAGE_KEY = "bt-lang";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: keyof typeof dict) => string };

const LangContext = createContext<Ctx>({ lang: "en", setLang: () => {}, t: (k) => dict[k].en });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "de" || stored === "en" || stored === "fr") setLangState(stored);
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
  navHome: { en: "Home", de: "Start", fr: "Accueil" },
  navProjects: { en: "Projects", de: "Projekte", fr: "Projets" },
  navAbout: { en: "About", de: "Über mich", fr: "À propos" },
  navBlog: { en: "Blog", de: "Blog", fr: "Blog" },
  navHiring: { en: "Hiring", de: "Recruiting", fr: "Recrutement" },
  navContact: { en: "Contact", de: "Kontakt", fr: "Contact" },
  menu: { en: "Menu", de: "Menü", fr: "Menu" },
  close: { en: "Close", de: "Schließen", fr: "Fermer" },

  heroPitch: {
    en: "I build fast, accessible web products with React, TypeScript and Next.js — from real-time data dashboards to AI-assisted tools.",
    de: "Ich baue schnelle, barrierefreie Webprodukte mit React, TypeScript und Next.js — von Echtzeit-Dashboards bis zu KI-gestützten Tools.",
    fr: "Je conçois des produits web véloces et accessibles avec React, TypeScript et Next.js — des tableaux de bord temps réel aux outils propulsés par l'IA.",
  },
  viewProjects: { en: "View projects", de: "Projekte ansehen", fr: "Voir les projets" },
  getInTouch: { en: "Get in touch", de: "Kontakt aufnehmen", fr: "Prendre contact" },
  availableTitle: {
    en: "Available for Werkstudent positions",
    de: "Verfügbar für Werkstudentenstellen",
    fr: "Disponible pour contrat étudiant / Werkstudent",
  },
  availableBody: {
    en: "20 h / week during semester, full-time during semester breaks. Remote or hybrid from Germersheim, available immediately.",
    de: "20 Std./Woche im Semester, Vollzeit in den Semesterferien. Remote oder hybrid ab Germersheim, ab sofort verfügbar.",
    fr: "20 h / semaine pendant le semestre, temps plein pendant les vacances universitaires. À distance ou hybride depuis Germersheim, disponible immédiatement.",
  },
  keyFactsTitle: { en: "Key facts", de: "Eckdaten", fr: "En bref" },
  emailMe: { en: "Email me", de: "E-Mail schreiben", fr: "M'écrire" },
  linkedinProfile: { en: "LinkedIn profile", de: "LinkedIn-Profil", fr: "Profil LinkedIn" },
  ndaLabel: {
    en: "Client project (NDA)",
    de: "Kundenprojekt (NDA)",
    fr: "Projet client (confidentiel)",
  },
  exploreWork: {
    en: "Explore my work →",
    de: "Meine Arbeit ansehen →",
    fr: "Découvrir mes réalisations →",
  },

  featuredProjects: { en: "Featured projects", de: "Ausgewählte Projekte", fr: "Projets phares" },
  allProjects: { en: "All projects", de: "Alle Projekte", fr: "Tous les projets" },
  viewCaseStudy: {
    en: "View case study →",
    de: "Case Study ansehen →",
    fr: "Lire l'étude de cas →",
  },
  ctaHeadline: {
    en: "Let's build something",
    de: "Lassen Sie uns etwas bauen",
    fr: "Bâtissons un projet ensemble",
  },
  ctaBody: {
    en: "Open to Werkstudent roles in frontend development, based in Germersheim (Rheinland-Pfalz).",
    de: "Offen für Werkstudentenstellen im Frontend – mit Sitz in Germersheim (Rheinland-Pfalz).",
    fr: "Disponible pour des postes étudiants (Werkstudent) en développement frontend, depuis Germersheim (Rhénanie-Palatinat).",
  },
  contactMe: { en: "Contact me", de: "Kontaktieren", fr: "Me contacter" },

  projectsIntro: {
    en: "Case studies from production work and self-directed builds — architecture decisions, stack, and what each one had to solve.",
    de: "Case Studies aus Produktivarbeit und eigenen Projekten — Architekturentscheidungen, Stack und das jeweils zu lösende Problem.",
    fr: "Études de cas issues de projets réels et personnels — choix d'architecture, stack technique et problématiques concrètes résolues.",
  },
  problem: { en: "The problem", de: "Das Problem", fr: "Le défi" },
  approach: { en: "Approach", de: "Vorgehen", fr: "La démarche" },
  technicalHighlights: {
    en: "Technical highlights",
    de: "Technische Highlights",
    fr: "Points clés techniques",
  },
  liveDemo: { en: "Live app", de: "Live-App", fr: "Application en ligne" },
  githubRepo: { en: "GitHub repo", de: "GitHub-Repo", fr: "Dépôt GitHub" },
  nextProject: { en: "Next project", de: "Nächstes Projekt", fr: "Projet suivant" },
  backToProjects: { en: "← All projects", de: "← Alle Projekte", fr: "← Tous les projets" },
  stack: { en: "Stack", de: "Stack", fr: "Technologies" },

  aboutIntro: {
    en: "B.Sc. Computer Science student at SRH University, based in Germersheim. I work across the frontend and the delivery layer: interface engineering, performance, and keeping technical decisions legible to the people who fund them.",
    de: "B.Sc.-Informatikstudent an der SRH University, wohnhaft in Germersheim. Ich arbeite im Frontend und in der Auslieferung: Interface-Engineering, Performance und technische Entscheidungen so erklären, dass Entscheider sie nachvollziehen.",
    fr: "Étudiant en B.Sc. Informatique à la SRH University, basé à Germersheim. J'interviens sur le frontend et l'ingénierie applicative : architecture d'interfaces, haute performance et clarté des choix techniques auprès des décideurs.",
  },
  experience: { en: "Experience", de: "Berufserfahrung", fr: "Expérience professionnelle" },
  education: { en: "Education", de: "Studium", fr: "Formation & Diplômes" },
  languagesTitle: { en: "Languages", de: "Sprachen", fr: "Langues" },

  blogIntro: {
    en: "Notes on architecture, AI integration and working as a developer in Germany.",
    de: "Notizen zu Architektur, KI-Integration und der Arbeit als Entwickler in Deutschland.",
    fr: "Articles sur l'architecture logicielle, l'intégration de l'IA et le quotidien de développeur en Allemagne.",
  },
  readArticle: { en: "Read article →", de: "Artikel lesen →", fr: "Lire l'article →" },
  backToBlog: { en: "← All articles", de: "← Alle Artikel", fr: "← Tous les articles" },

  contactTitle: { en: "Get in touch", de: "Kontakt aufnehmen", fr: "Prendre contact" },
  contactIntro: {
    en: "Looking for a Werkstudent position (20 h / week, remote or hybrid) and available immediately. Email or LinkedIn is the fastest way to reach me.",
    de: "Auf der Suche nach einer Werkstudentenstelle (20 Std./Woche, remote oder hybrid), ab sofort verfügbar. Am schnellsten erreichen Sie mich per E-Mail oder LinkedIn.",
    fr: "À la recherche d'un poste en contrat étudiant / Werkstudent (20 h / semaine, remote ou hybride) et disponible immédiatement. Le plus rapide : e-mail ou LinkedIn.",
  },
  fieldName: { en: "Name", de: "Name", fr: "Nom" },
  fieldEmail: { en: "Email", de: "E-Mail", fr: "E-mail" },
  fieldMessage: { en: "Message", de: "Nachricht", fr: "Message" },
  send: { en: "Send", de: "Senden", fr: "Envoyer" },
  sent: {
    en: "Thank you — your message is ready to send. Mail client opening.",
    de: "Danke — Ihre Nachricht ist bereit. Das E-Mail-Programm öffnet sich.",
    fr: "Merci — votre message est prêt. Ouverture de votre client e-mail.",
  },
  direct: { en: "Direct", de: "Direkt", fr: "Coordonnées directes" },
  validationName: {
    en: "Please enter your name.",
    de: "Bitte geben Sie Ihren Namen ein.",
    fr: "Veuillez renseigner votre nom.",
  },
  validationEmail: {
    en: "Please enter a valid email address.",
    de: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
    fr: "Veuillez saisir une adresse e-mail valide.",
  },
  validationMessage: {
    en: "Please write a short message.",
    de: "Bitte schreiben Sie eine kurze Nachricht.",
    fr: "Veuillez saisir un court message.",
  },

  footerWork: { en: "Work", de: "Arbeit", fr: "Projets" },
  footerAbout: { en: "About", de: "Über", fr: "À propos" },
  footerConnect: { en: "Connect", de: "Kontakt", fr: "Réseaux" },
  footerStatus: {
    en: "Open to Werkstudent roles",
    de: "Offen für Werkstudentenstellen",
    fr: "Disponible en Werkstudent",
  },
  footerLocation: {
    en: "Germersheim, DE — {time}",
    de: "Germersheim, DE — {time}",
    fr: "Germersheim, DE — {time}",
  },
  backToTop: { en: "Back to top ↑", de: "Nach oben ↑", fr: "Haut de page ↑" },
  rights: {
    en: "All rights reserved.",
    de: "Alle Rechte vorbehalten.",
    fr: "Tous droits réservés.",
  },
} satisfies Record<string, Record<Lang, string>>;
