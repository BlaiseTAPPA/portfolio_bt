import { education, experience, identity, languages, projects, skills, type Lang } from "./content";

export type ShortlistKind = "experience" | "project" | "skill" | "education" | "language";
export type ShortlistItem = { kind: ShortlistKind; ref: string; label: string; why: string };
export type ShortlistResult = { summary: string; items: ShortlistItem[] };

export class ShortlistError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export type ShortlistInput = {
  data: {
    role: string;
    lang: Lang;
  };
};

export async function shortlistRole(input: ShortlistInput | { role: string; lang: Lang }) {
  const data = "data" in input ? input.data : input;
  const role = data.role.trim();
  const lang = data.lang;

  if (role.length < 15) {
    return {
      ok: false as const,
      error:
        lang === "de"
          ? "Bitte mindestens 15 Zeichen eingeben."
          : lang === "fr"
            ? "Veuillez saisir au moins 15 caractères."
            : "Please write at least 15 characters.",
    };
  }

  try {
    const res = await fetch("/api/ai/shortlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, lang }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.ok && Array.isArray(json.items)) {
        return {
          ok: true as const,
          summary: json.summary as string,
          items: json.items as ShortlistItem[],
        };
      }
      if (json.error) {
        return { ok: false as const, error: json.error as string };
      }
    }
  } catch (err) {
    console.warn("Client fallback for shortlist due to network error:", err);
  }

  // Fallback
  const roleLower = role.toLowerCase();
  const items: ShortlistItem[] = [];

  for (const s of skills) {
    const sLower = s.toLowerCase();
    if (
      roleLower.includes(sLower) ||
      (sLower.includes("react") && roleLower.includes("frontend"))
    ) {
      items.push({
        kind: "skill",
        ref: s,
        label: s,
        why:
          lang === "de"
            ? `Kernkompetenz, die direkt den Anforderungen an moderne ${s}-Entwicklung entspricht.`
            : lang === "fr"
              ? `Compétence clé directement alignée sur les exigences de développement moderne sous ${s}.`
              : `Core competency directly aligned with high-standard ${s} requirements.`,
      });
    }
  }

  if (items.length === 0) {
    items.push({
      kind: "skill",
      ref: "TypeScript",
      label: "TypeScript",
      why:
        lang === "de"
          ? "Typensichere Entwicklung für wartbaren und fehlerfreien Code."
          : lang === "fr"
            ? "Développement typé garantissant un code robuste, maintenable et exempt de régressions."
            : "Type-safe development ensuring robust and maintainable codebases.",
    });
    items.push({
      kind: "skill",
      ref: "React",
      label: "React",
      why:
        lang === "de"
          ? "Umfassende Erfahrung im Bau performanter Benutzeroberflächen."
          : lang === "fr"
            ? "Solide maîtrise de la conception d'interfaces utilisateur modernes et réactives."
            : "Extensive experience crafting responsive, accessible user interfaces.",
    });
  }

  for (const exp of experience) {
    const isRelevant =
      roleLower.includes("frontend") ||
      roleLower.includes("dashboard") ||
      roleLower.includes("developer") ||
      roleLower.includes("développeur") ||
      roleLower.includes("engineer");

    if (isRelevant && items.length < 5) {
      items.push({
        kind: "experience",
        ref: exp.company,
        label: `${exp.company} — ${exp.title[lang]}`,
        why:
          lang === "de"
            ? `Praxiserfahrung im industriellen Umfeld (${exp.period}), Fokus auf Dashboards und Schnittstellen.`
            : lang === "fr"
              ? `Expérience probante en environnement professionnel (${exp.period}), axée sur les tableaux de bord et la coordination technique.`
              : `Proven field track record (${exp.period}) building operational dashboards and API integrations.`,
      });
      break;
    }
  }

  for (const proj of projects) {
    const hasStack = proj.stack.some((st) => roleLower.includes(st.toLowerCase()));
    if (
      (hasStack ||
        roleLower.includes("project") ||
        roleLower.includes("projet") ||
        roleLower.includes("full-stack")) &&
      items.length < 5
    ) {
      items.push({
        kind: "project",
        ref: proj.slug,
        label: proj.name,
        why:
          lang === "de"
            ? `Referenzprojekt mit ${proj.stack.slice(0, 3).join(", ")}, das saubere Architektur demonstriert.`
            : lang === "fr"
              ? `Projet de référence illustrant la maîtrise du cycle complet avec ${proj.stack.slice(0, 3).join(", ")}.`
              : `Case study demonstrating full-lifecycle development with ${proj.stack.slice(0, 3).join(", ")}.`,
      });
      if (items.length >= 4) break;
    }
  }

  const summary =
    lang === "de"
      ? `Starkes Profil für diese Rolle: Blaise bringt fundierte Kenntnisse in modernem Web-Development, Praxiserfahrung mit datenintensiven Dashboards und hohe Eigenverantwortung mit. Als Werkstudent mit bis zu 20 Std./Woche sofort einsatzbereit.`
      : lang === "fr"
        ? `Excellente adéquation pour cette opportunité : Blaise allie une solide expertise en ingénierie web moderne, une expérience concrète sur des projets de production et une grande autonomie. Immédiatement disponible en contrat étudiant (Werkstudent, 20h/semaine) ou freelance.`
        : `High match for this position: Blaise brings hands-on experience in modern full-stack web engineering, production dashboard delivery, and strong problem-solving skills. Available immediately for up to 20h/week.`;

  return {
    ok: true as const,
    summary,
    items: items.slice(0, 6),
  };
}
