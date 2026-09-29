import { projects, type Lang } from "./content";

export type SpecInput = {
  data: {
    slug: string;
    idea: string;
    lang: Lang;
  };
};

export async function buildSpec(input: SpecInput | { slug: string; idea: string; lang: Lang }) {
  const data = "data" in input ? input.data : input;
  const { slug, idea, lang } = data;

  if (idea.trim().length < 10) {
    return {
      ok: false as const,
      error:
        lang === "de"
          ? "Bitte mindestens 10 Zeichen eingeben."
          : lang === "fr"
            ? "Veuillez saisir au moins 10 caractères."
            : "Please write at least 10 characters.",
    };
  }

  const p = projects.find((x) => x.slug === slug) ?? projects[0];

  try {
    const res = await fetch("/api/ai/spec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, idea, lang }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.ok && json.spec) {
        return { ok: true as const, spec: json.spec as string };
      }
      if (json.error) {
        return { ok: false as const, error: json.error as string };
      }
    }
  } catch (err) {
    console.warn("Client fallback for spec builder due to network error:", err);
  }

  // Fallback
  if (lang === "fr") {
    const spec = `APERÇU DU PROJET
Un projet structuré s'appuyant sur l'architecture de ${p.name}, conçu pour répondre au besoin : "${idea.trim()}". L'objectif est un MVP robuste alliant clarté d'interface et fiabilité technique.

PUBLIC CIBLE
- Utilisateurs finaux recherchant une expérience rapide, accessible et intuitive
- Administrateurs ou opérateurs en charge de la gestion des données et du suivi

FONCTIONNALITÉS CLÉS
- Interface responsive avec tableau de bord ergonomique et statut en temps réel
- Formulaires typés avec validation de données stricte (Zod) et persistance
- Traitements d'arrière-plan automatisés et alertes contextuelles
- Optimisation fine des performances et respect des normes d'accessibilité

STACK TECHNIQUE
- Frontend : React, TypeScript, Tailwind CSS
- Gestion d'état & Données : React Query, validation de schémas Zod
- Backend & Services : Node.js / API Routes Next.js
- Base de données : PostgreSQL ou MongoDB

ARCHITECTURE LOGICIELLE
- Séparation stricte entre présentation UI, couche de données et logique métier
- Composants modulaires réutilisables selon les principes de l'Atomic Design
- Routes d'API sécurisées côté serveur avec typage de bout en bout

JALONS DE LIVRAISON (MILESTONES)
- Phase 1 : Cadrage architectural, prototypage UI et schémas de données
- Phase 2 : Développement des fonctionnalités clés et intégration des flux API
- Phase 3 : Recettage, audit d'accessibilité et mise en production

QUESTIONS OUVERTES
- Quels services d'authentification ou API tierces doivent être branchés pour la v1 ?
- Quels sont les volumes attendus et exigences d'hébergement (RGPD, cloud) ?`;

    return {
      ok: true as const,
      spec,
    };
  }

  if (lang === "de") {
    const spec = `ÜBERBLICK
Ein schlankes Projekt basierend auf der Architektur von ${p.name}, maßgeschneidert für die Anforderung: "${idea.trim()}". Ziel ist ein robuster MVP mit klarem Fokus auf Benutzerfreundlichkeit und Wartbarkeit.

ZIELGRUPPE
- Endbenutzer mit Bedarf an schneller, verlässlicher Interaktion und sauberem Interface
- Administratoren oder Redakteure, die Daten verwalten und Kennzahlen einsehen

KERNFUNKTIONEN
- Responsive Benutzeroberfläche mit intuitivem Dashboard und Echtzeit-Status
- Strukturierte Datenerfassung, Filterung und Validierung
- Automatisierte Workflows und Benachrichtigungen
- Barrierefreie Navigation und optimierte Ladezeiten

TECH-STACK
- Frontend: React, TypeScript, Tailwind CSS
- State & Data: React Query, Zod-Validierung
- Backend & Services: Node.js / Next.js API Routes
- Infrastruktur: Vercel / Cloud Run, PostgreSQL oder MongoDB

ARCHITEKTUR
- Klare Trennung zwischen Präsentationsschicht, Datenabruf und Geschäftslogik
- Modulare Komponenten nach atomaren Design-Prinzipien
- Server-seitig abgesicherte API-Aufrufe mit strukturierter Fehlerbehandlung

MEILENSTEINE
- Phase 1: Architektur-Setup, UI-Prototyping und grundlegende Datenmodelle
- Phase 2: Implementierung der Kernfunktionen und API-Anbindungen
- Phase 3: Testing, Barrierefreiheitsprüfung und Produktivstart

OFFENE FRAGEN
- Welche externen Schnittstellen oder Authentifizierungsanbieter sollen angebunden werden?
- Gibt es spezifische Richtlinien bezüglich DSGVO oder Hosting-Präferenzen?`;

    return {
      ok: true as const,
      spec,
    };
  }

  const spec = `OVERVIEW
A focused project leveraging the architectural blueprint of ${p.name}, tailored for: "${idea.trim()}". The goal is a production-ready MVP balancing clean UX with reliable architecture.

AUDIENCE
- Primary users seeking efficient task completion and clear visual feedback
- Administrators or operators managing datasets and tracking activity

CORE FEATURES
- Responsive interface with concise dashboard views and real-time state
- Structured input validation, search filtering, and state persistence
- Automated event pipelines and asynchronous status updates
- High-performance asset loading and accessible typography

TECH STACK
- Frontend: React, TypeScript, Tailwind CSS
- State & Data: React Query, Zod schema validation
- Backend & Services: Node.js / Next.js API Routes
- Infrastructure: Modern cloud hosting, PostgreSQL or MongoDB

ARCHITECTURE
- Decoupled client presentation from API services and data transformers
- Component library built on accessible primitives
- Server-guarded environment secrets and type-safe payloads

MILESTONES
- Phase 1: Core setup, design scaffolding, and baseline data schemas
- Phase 2: Feature development, service integrations, and workflows
- Phase 3: End-to-end verification, accessibility audit, and deployment

OPEN QUESTIONS
- Are there specific third-party APIs or OAuth providers required for v1?
- What are the target compliance and data residency requirements?`;

  return {
    ok: true as const,
    spec,
  };
}

export async function buildSpecStream(
  input: SpecInput | { slug: string; idea: string; lang: Lang },
  onChunk: (accumulated: string) => void,
) {
  const data = "data" in input ? input.data : input;
  const { slug, idea, lang } = data;

  if (idea.trim().length < 10) {
    return {
      ok: false as const,
      error:
        lang === "de"
          ? "Bitte mindestens 10 Zeichen eingeben."
          : lang === "fr"
            ? "Veuillez saisir au moins 10 caractères."
            : "Please write at least 10 characters.",
    };
  }

  let fullText = "";

  try {
    const res = await fetch("/api/ai/spec/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, idea, lang }),
    });

    if (res.ok && res.body) {
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith("data: ")) {
            const dataStr = trimmed.slice(6);
            if (dataStr === "[DONE]") {
              return { ok: true as const, spec: fullText };
            }
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                fullText += parsed.text;
                onChunk(fullText);
              }
            } catch {
              // Ignore partial JSON
            }
          }
        }
      }
      if (fullText) {
        return { ok: true as const, spec: fullText };
      }
    }
  } catch (err) {
    console.warn("Stream error in spec, falling back:", err);
  }

  const fallback = await buildSpec({ slug, idea, lang });
  if (fallback.ok) {
    onChunk(fallback.spec);
  }
  return fallback;
}
