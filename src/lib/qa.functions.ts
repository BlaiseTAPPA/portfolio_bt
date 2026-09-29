import { education, experience, identity, languages, projects, skills, type Lang } from "./content";

export class QaError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export type QaInput = {
  data: {
    question: string;
    lang: Lang;
  };
};

export async function askAbout(input: QaInput | { question: string; lang: Lang }) {
  const data = "data" in input ? input.data : input;
  const q = data.question.trim();
  const lang = data.lang;

  if (q.length < 3) {
    return {
      ok: false as const,
      error:
        lang === "de"
          ? "Bitte mindestens 3 Zeichen eingeben."
          : lang === "fr"
            ? "Veuillez saisir au moins 3 caractères."
            : "Please write at least 3 characters.",
    };
  }

  try {
    const res = await fetch("/api/ai/qa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q, lang }),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.ok && json.answer) {
        return { ok: true as const, answer: json.answer as string };
      }
      if (json.error) {
        return { ok: false as const, error: json.error as string };
      }
    }
  } catch (err) {
    console.warn("Client fallback for QA due to network error:", err);
  }

  // Client-side fallback if server cannot be reached
  const qLower = q.toLowerCase();
  if (
    qLower.includes("language") ||
    qLower.includes("sprache") ||
    qLower.includes("langue") ||
    qLower.includes("speak") ||
    qLower.includes("parle")
  ) {
    const langList = languages.map((l) => `${l.name[lang]} (${l.level[lang]})`).join(", ");
    return {
      ok: true as const,
      answer:
        lang === "de"
          ? `Blaise spricht ${langList}. Er arbeitet fließend auf Deutsch, Englisch und Französisch.`
          : lang === "fr"
            ? `Blaise parle ${langList}. Le français est sa langue maternelle, il est bilingue en anglais (TOEFL) et de niveau B1 en allemand.`
            : `Blaise speaks ${langList}. He works comfortably across German, English, and French.`,
    };
  }

  if (qLower.includes("omoa")) {
    const omoa = experience.find((e) => e.company.toLowerCase().includes("omoa"));
    return {
      ok: true as const,
      answer:
        lang === "de"
          ? `Bei der OMOA Group (${omoa?.period ?? "2024–2025"}) koordinierte Blaise über 20 Enterprise-Webprodukte und agierte als Frontend-Schnittstelle.`
          : lang === "fr"
            ? `Chez OMOA Group (${omoa?.period ?? "2024–2025"}), Blaise a coordonné la livraison de plus de 20 produits web d'entreprise en tant que référent technique frontend.`
            : `At OMOA Group (${omoa?.period ?? "2024–2025"}), Blaise coordinated the delivery of 20+ enterprise web products as frontend liaison.`,
    };
  }

  if (
    qLower.includes("stud") ||
    qLower.includes("educat") ||
    qLower.includes("ausbildung") ||
    qLower.includes("diplom") ||
    qLower.includes("formation")
  ) {
    const srh = education[0];
    return {
      ok: true as const,
      answer:
        lang === "de"
          ? `Blaise studiert derzeit B.Sc. Informatik an der SRH University (${srh?.period ?? "Aktuell"}).`
          : lang === "fr"
            ? `Blaise étudie actuellement en B.Sc. Informatique (Computer Science) à la SRH University (${srh?.period ?? "En cours"}).`
            : `Blaise is currently studying B.Sc. Computer Science at SRH University (${srh?.period ?? "Present"}).`,
    };
  }

  return {
    ok: true as const,
    answer:
      lang === "de"
        ? `Blaise Tappa ist Full-Stack- / Frontend-Entwickler mit Fokus auf React, TypeScript und Next.js, wohnhaft in Germersheim. Gerne können Sie ihn über das Kontaktformular anfragen!`
        : lang === "fr"
          ? `Blaise Tappa est développeur Full-Stack / Frontend spécialisé en React, TypeScript et Next.js, basé à Germersheim, Allemagne. N'hésitez pas à le contacter via le formulaire !`
          : `Blaise Tappa is a Full-Stack / Frontend Developer focusing on React, TypeScript, and Next.js, based in Germersheim, Germany. Feel free to contact him for any details!`,
  };
}

export async function askAboutStream(
  input: QaInput | { question: string; lang: Lang },
  onChunk: (accumulated: string) => void,
) {
  const data = "data" in input ? input.data : input;
  const q = data.question.trim();
  const lang = data.lang;

  if (q.length < 3) {
    return {
      ok: false as const,
      error:
        lang === "de"
          ? "Bitte mindestens 3 Zeichen eingeben."
          : lang === "fr"
            ? "Veuillez saisir au moins 3 caractères."
            : "Please write at least 3 characters.",
    };
  }

  let fullText = "";

  try {
    const res = await fetch("/api/ai/qa/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q, lang }),
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
              return { ok: true as const, answer: fullText };
            }
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                fullText += parsed.text;
                onChunk(fullText);
              }
            } catch {
              // Ignore partial chunk
            }
          }
        }
      }
      if (fullText) {
        return { ok: true as const, answer: fullText };
      }
    }
  } catch (err) {
    console.warn("Stream error, falling back to askAbout:", err);
  }

  const fallbackRes = await askAbout({ question: q, lang });
  if (fallbackRes.ok) {
    onChunk(fallbackRes.answer);
  }
  return fallbackRes;
}
