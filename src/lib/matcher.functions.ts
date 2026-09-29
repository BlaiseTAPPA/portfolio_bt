import { projects, type Lang } from "./content";

export type Match = { slug: string; reason: string };

export class MatcherError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export type MatcherInput = {
  data: {
    brief: string;
    lang: Lang;
  };
};

export async function matchProjects(input: MatcherInput | { brief: string; lang: Lang }) {
  const data = "data" in input ? input.data : input;
  const brief = data.brief.trim();
  const lang = data.lang;

  if (brief.length < 10) {
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

  try {
    const res = await fetch("/api/ai/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brief, lang }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.ok && Array.isArray(json.matches)) {
        return { ok: true as const, matches: json.matches as Match[] };
      }
      if (json.error) {
        return { ok: false as const, error: json.error as string };
      }
    }
  } catch (err) {
    console.warn("Client fallback for matcher due to network error:", err);
  }

  // Fallback
  const briefLower = brief.toLowerCase();
  const isFinance =
    briefLower.includes("financ") ||
    briefLower.includes("trade") ||
    briefLower.includes("market") ||
    briefLower.includes("bourse") ||
    briefLower.includes("chart") ||
    briefLower.includes("alert");
  const isAi =
    briefLower.includes("ai") ||
    briefLower.includes("ki") ||
    briefLower.includes("ia") ||
    briefLower.includes("image") ||
    briefLower.includes("spatial") ||
    briefLower.includes("vision");
  const isGeo =
    briefLower.includes("map") ||
    briefLower.includes("carte") ||
    briefLower.includes("station") ||
    briefLower.includes("fuel") ||
    briefLower.includes("essence") ||
    briefLower.includes("route") ||
    briefLower.includes("geo");

  const matches: Match[] = [];

  if (isFinance) {
    matches.push({
      slug: "signalist",
      reason:
        lang === "de"
          ? "Echtzeit-Finanzdashboard mit Live-Alerts, asynchronen Hintergrundjobs und Finnhub-API."
          : lang === "fr"
            ? "Tableau de bord financier temps réel avec alertes en direct, tâches de fond Inngest et intégration Finnhub."
            : "Real-time finance dashboard with live alerts, Inngest background jobs, and Finnhub integration.",
    });
  }

  if (isAi || matches.length === 0) {
    matches.push({
      slug: "roomify",
      reason:
        lang === "de"
          ? "KI-gestützte räumliche Grundriss-Analyse mit strukturierter Datenextraktion und modernem UI."
          : lang === "fr"
            ? "Analyseur de plans spatiaux par IA combinant modèles de vision, extraction structurée et interface soignée."
            : "AI spatial floor-plan analyzer combining computer vision models with clean structured output.",
    });
  }

  if (isGeo || matches.length < 2) {
    matches.push({
      slug: "tankstellen-finder",
      reason:
        lang === "de"
          ? "Interaktive Geo-Anwendung für Routenkorridore, Preisvergleiche und Leaflet-Karten."
          : lang === "fr"
            ? "Application géospatiale interactive avec recherche par corridor de route, suivi tarifaire et cartes Leaflet."
            : "Interactive geolocation app with route-corridor searching, live fuel price tracking, and Leaflet.",
    });
  }

  return {
    ok: true as const,
    matches: matches.slice(0, 3),
  };
}
