import { createContext, useContext } from "react";
import type { Lang } from "./content";

export const STORAGE_KEY = "bt-lang";

export type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: keyof typeof dict) => string };

export const LangContext = createContext<Ctx>({
  lang: "en",
  setLang: () => {},
  t: (k) => dict[k].en,
});

export function useLang() {
  return useContext(LangContext);
}

export const dict = {
  navHome: { en: "Home", de: "Start", fr: "Accueil" },
  navProjects: { en: "Projects", de: "Projekte", fr: "Projets" },
  navAbout: { en: "About", de: "Über mich", fr: "À propos" },
  navBlog: { en: "Blog", de: "Blog", fr: "Blog" },
  navHiring: { en: "Hiring", de: "Für Recruiter", fr: "Recrutement" },
  navContact: { en: "Contact", de: "Kontakt", fr: "Contact" },
  navPrimary: { en: "Primary", de: "Hauptnavigation", fr: "Navigation principale" },
  navMobile: { en: "Mobile", de: "Mobile Navigation", fr: "Navigation mobile" },
  menu: { en: "Menu", de: "Menü", fr: "Menu" },
  close: { en: "Close", de: "Schließen", fr: "Fermer" },

  heroPitch: {
    en: "I build fast, accessible web products with React, TypeScript and Next.js — from real-time data dashboards to AI-assisted tools.",
    de: "Ich entwickle schnelle, barrierefreie Webanwendungen mit React, TypeScript und Next.js – von Echtzeit-Dashboards bis zu KI-gestützten Tools.",
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
    de: "20 Std./Woche im Semester, Vollzeit in den Semesterferien. Remote oder hybrid im Raum Germersheim, ab sofort verfügbar.",
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
    de: "Zu den Projekten →",
    fr: "Découvrir mes réalisations →",
  },

  featuredProjects: { en: "Featured projects", de: "Ausgewählte Projekte", fr: "Projets phares" },
  allProjects: { en: "All projects", de: "Alle Projekte", fr: "Tous les projets" },
  viewCaseStudy: {
    en: "View case study →",
    de: "Fallstudie ansehen →",
    fr: "Lire l'étude de cas →",
  },
  ctaHeadline: {
    en: "Let's build something",
    de: "Lassen Sie uns zusammenarbeiten",
    fr: "Bâtissons un projet ensemble",
  },
  ctaBody: {
    en: "Open to Werkstudent roles in frontend development, based in Germersheim (Rheinland-Pfalz).",
    de: "Offen für Werkstudentenstellen im Frontend – mit Sitz in Germersheim (Rheinland-Pfalz).",
    fr: "Disponible pour des postes étudiants (Werkstudent) en développement frontend, depuis Germersheim (Rhénanie-Palatinat).",
  },
  contactMe: { en: "Contact me", de: "Kontakt aufnehmen", fr: "Me contacter" },

  projectsIntro: {
    en: "Case studies from production work and self-directed builds — architecture decisions, stack, and what each one had to solve.",
    de: "Fallstudien aus Kundenprojekten und eigenen Projekten – Architekturentscheidungen, Tech-Stack und die jeweilige Aufgabenstellung.",
    fr: "Études de cas issues de projets réels et personnels — choix d'architecture, stack technique et problématiques concrètes résolues.",
  },
  problem: { en: "The problem", de: "Ausgangslage", fr: "Le défi" },
  approach: { en: "Approach", de: "Vorgehen", fr: "La démarche" },
  technicalHighlights: {
    en: "Technical highlights",
    de: "Technische Schwerpunkte",
    fr: "Points clés techniques",
  },
  liveDemo: { en: "Live app", de: "Live-App", fr: "Application en ligne" },
  githubRepo: { en: "GitHub repo", de: "GitHub-Repository", fr: "Dépôt GitHub" },
  nextProject: { en: "Next project", de: "Nächstes Projekt", fr: "Projet suivant" },
  backToProjects: { en: "← All projects", de: "← Alle Projekte", fr: "← Tous les projets" },
  stack: { en: "Stack", de: "Tech-Stack", fr: "Technologies" },
  projectImageAlt: {
    en: "{name} interface",
    de: "Benutzeroberfläche von {name}",
    fr: "Interface de {name}",
  },
  projectNotFoundTitle: {
    en: "Project not found",
    de: "Projekt nicht gefunden",
    fr: "Projet introuvable",
  },
  projectNotFoundBody: {
    en: "The requested case study could not be found.",
    de: "Die gesuchte Fallstudie wurde nicht gefunden.",
    fr: "L'étude de cas demandée est introuvable.",
  },

  aboutIntro: {
    en: "B.Sc. Computer Science student at SRH University, based in Germersheim. I work across the frontend and the delivery layer: interface engineering, performance, and keeping technical decisions legible to the people who fund them.",
    de: "B.Sc.-Informatikstudent an der SRH University, wohnhaft in Germersheim. Ich arbeite an der Schnittstelle von Frontend und Delivery: Interface-Entwicklung, Performance und technische Entscheidungen, die auch Nicht-Techniker nachvollziehen können.",
    fr: "Étudiant en B.Sc. Informatique à la SRH University, basé à Germersheim. J'interviens sur le frontend et l'ingénierie applicative : architecture d'interfaces, haute performance et clarté des choix techniques auprès des décideurs.",
  },
  portraitAlt: { en: "Portrait of {name}", de: "Porträt von {name}", fr: "Portrait de {name}" },
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
  articleNotFoundTitle: {
    en: "Article not found",
    de: "Artikel nicht gefunden",
    fr: "Article introuvable",
  },
  articleNotFoundBody: {
    en: "The requested blog post could not be found.",
    de: "Der gesuchte Artikel wurde nicht gefunden.",
    fr: "L'article demandé est introuvable.",
  },

  contactTitle: { en: "Get in touch", de: "Kontakt aufnehmen", fr: "Prendre contact" },
  contactIntro: {
    en: "Looking for a Werkstudent position (20 h / week, remote or hybrid) and available immediately. Email or LinkedIn is the fastest way to reach me.",
    de: "Ich suche eine Werkstudentenstelle (20 Std./Woche, remote oder hybrid) und bin ab sofort verfügbar. Am schnellsten erreichen Sie mich per E-Mail oder über LinkedIn.",
    fr: "À la recherche d'un poste en contrat étudiant / Werkstudent (20 h / semaine, remote ou hybride) et disponible immédiatement. Le plus rapide : e-mail ou LinkedIn.",
  },
  fieldName: { en: "Name", de: "Name", fr: "Nom" },
  fieldEmail: { en: "Email", de: "E-Mail", fr: "E-mail" },
  fieldMessage: { en: "Message", de: "Nachricht", fr: "Message" },
  send: { en: "Send", de: "Senden", fr: "Envoyer" },
  sent: {
    en: "Thank you — your message is ready to send. Mail client opening.",
    de: "Vielen Dank – Ihre Nachricht ist vorbereitet. Ihr E-Mail-Programm wird geöffnet.",
    fr: "Merci — votre message est prêt. Ouverture de votre client e-mail.",
  },
  mailSubject: {
    en: "Portfolio enquiry — {name}",
    de: "Anfrage über das Portfolio – {name}",
    fr: "Demande via le portfolio — {name}",
  },
  direct: { en: "Direct", de: "Direktkontakt", fr: "Coordonnées directes" },
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

  notFoundTitle: { en: "Page not found", de: "Seite nicht gefunden", fr: "Page introuvable" },
  notFoundBody: {
    en: "The page you're looking for doesn't exist or has been moved.",
    de: "Die gesuchte Seite existiert nicht oder wurde verschoben.",
    fr: "La page demandée n'existe pas ou a été déplacée.",
  },
  goHome: { en: "Go home", de: "Zur Startseite", fr: "Retour à l'accueil" },

  footerWork: { en: "Work", de: "Portfolio", fr: "Projets" },
  footerAbout: { en: "About", de: "Profil", fr: "À propos" },
  footerConnect: { en: "Connect", de: "Direktkontakt", fr: "Réseaux" },
  footerStatus: {
    en: "Open to Werkstudent roles",
    de: "Offen für Werkstudentenstellen",
    fr: "Disponible en Werkstudent",
  },
  footerLocation: {
    en: "Germersheim, DE — {time}",
    de: "Germersheim, DE – {time}",
    fr: "Germersheim, DE — {time}",
  },
  backToTop: { en: "Back to top ↑", de: "Nach oben ↑", fr: "Haut de page ↑" },
  rights: {
    en: "All rights reserved.",
    de: "Alle Rechte vorbehalten.",
    fr: "Tous droits réservés.",
  },
} satisfies Record<string, Record<Lang, string>>;
