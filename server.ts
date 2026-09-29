import express, { type Request, type Response, type NextFunction } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import { identity, projects, skills, experience, education, languages } from "./src/lib/content.ts";
import { createCvPdf } from "./src/lib/cv-pdf.ts";
import { getSeoMetadata } from "./src/lib/seo.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

type GeminiParams = Parameters<typeof ai.models.generateContent>[0];

async function generateWithGemini(params: {
  contents: GeminiParams["contents"];
  config?: GeminiParams["config"];
}) {
  const candidateModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
  let lastError: unknown = null;
  for (const model of candidateModels) {
    try {
      const res = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      });
      return res;
    } catch (err: unknown) {
      lastError = err;
      const status =
        typeof err === "object" && err !== null && "status" in err
          ? (err as { status: number }).status
          : undefined;
      if (status === 503 || status === 429) {
        console.warn(`Model ${model} unavailable (${status}), retrying with fallback model...`);
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

async function generateStreamWithGemini(params: {
  contents: GeminiParams["contents"];
  config?: GeminiParams["config"];
}) {
  const candidateModels = ["gemini-3.8-flash", "gemini-3.1-flash-lite"];
  let lastError: unknown = null;
  for (const model of candidateModels) {
    try {
      const res = await ai.models.generateContentStream({
        model,
        contents: params.contents,
        config: params.config,
      });
      return res;
    } catch (err: unknown) {
      lastError = err;
      const status =
        typeof err === "object" && err !== null && "status" in err
          ? (err as { status: number }).status
          : undefined;
      if (status === 503 || status === 429) {
        console.warn(`Model ${model} unavailable (${status}), retrying with fallback model...`);
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

// Summary of background knowledge used for RAG / system instruction
const backgroundKnowledge = `
IDENTITY:
Name: ${identity.name} (also known as ${identity.alias})
Location: ${identity.location}
Current role: ${identity.role.en} / ${identity.role.de}
Email: ${identity.email}
GitHub: ${identity.github}
LinkedIn: ${identity.linkedin}
Availability: Available for Working Student (Werkstudent, up to 20h/week) or freelance projects, remote, hybrid, or on-site in Germany.

EDUCATION:
${education.map((e) => `- ${e.detail.en} (${e.detail.de}) at ${e.school} (${e.period})`).join("\n")}

WORK EXPERIENCE:
${experience
  .map(
    (exp) =>
      `- ${exp.company} (${exp.period}): ${exp.title.en} / ${exp.title.de}\n  Highlights:\n${exp.points.en.map((p) => `    * ${p}`).join("\n")}`,
  )
  .join("\n")}

PROJECTS:
${projects
  .map(
    (p) =>
      `- Slug: ${p.slug} | Name: ${p.name} (${p.year})\n  Stack: ${p.stack.join(", ")}\n  Excerpt: ${p.excerpt.en}\n  Problem: ${p.problem.en}\n  Approach: ${p.approach.en}\n  Highlights:\n${p.highlights.en.map((h) => `    * ${h}`).join("\n")}`,
  )
  .join("\n\n")}

SKILLS:
${skills.join(", ")}

LANGUAGES:
${languages.map((l) => `- ${l.name.en} / ${l.name.de}: ${l.level.en} (${l.level.de})`).join("\n")}
`;

// 1. Q&A Endpoint
app.post("/api/ai/qa", async (req: Request, res: Response) => {
  const { question, lang = "en" } = req.body ?? {};

  if (!question || typeof question !== "string" || question.trim().length < 3) {
    return res.status(400).json({
      ok: false,
      error:
        lang === "de"
          ? "Bitte eine gültige Frage eingeben."
          : lang === "fr"
            ? "Veuillez poser une question valide."
            : "Please provide a valid question.",
    });
  }

  const outputLang = lang === "fr" ? "French" : lang === "de" ? "German" : "English";

  try {
    const prompt = `User question: "${question.trim()}"
Language to respond in: ${outputLang}

Answer the question strictly and accurately based on the background information below. Keep the tone professional, direct, concise, and helpful. If the facts do not contain the answer, politely state that it's not documented here and suggest contacting Blaise directly. Do not invent any facts.`;

    const response = await generateWithGemini({
      contents: prompt,
      config: {
        systemInstruction: `You are an AI assistant answering questions about Blaise Tappa, a software developer. Always answer in ${outputLang}. Use ONLY the facts provided here:\n${backgroundKnowledge}`,
        temperature: 0.2,
      },
    });

    const answer = response.text?.trim();
    if (!answer) {
      throw new Error("Empty response from Gemini");
    }

    return res.json({ ok: true, answer });
  } catch (error) {
    console.error("Gemini QA Error:", error);
    // Intelligent fallback
    const fallbackAnswer =
      lang === "de"
        ? `Blaise Tappa ist Full-Stack- / Frontend-Entwickler mit Schwerpunkt auf React, TypeScript und Next.js, wohnhaft in Germersheim. Gerne können Sie ihn über das Kontaktformular für detailliertere Fragen kontaktieren.`
        : lang === "fr"
          ? `Blaise Tappa est développeur Full-Stack / Frontend spécialisé en React, TypeScript et Next.js, basé à Germersheim, Allemagne. N'hésitez pas à le contacter via le formulaire de contact pour toute question !`
          : `Blaise Tappa is a Full-Stack / Frontend Developer focused on React, TypeScript, and Next.js, based in Germersheim, Germany. Feel free to reach out via the contact form!`;
    return res.json({ ok: true, answer: fallbackAnswer });
  }
});

// 1b. Q&A Streaming Endpoint (SSE)
app.post("/api/ai/qa/stream", async (req: Request, res: Response) => {
  const { question, lang = "en" } = req.body ?? {};

  if (!question || typeof question !== "string" || question.trim().length < 3) {
    return res.status(400).json({
      ok: false,
      error:
        lang === "de"
          ? "Bitte eine gültige Frage eingeben."
          : lang === "fr"
            ? "Veuillez poser une question valide."
            : "Please provide a valid question.",
    });
  }

  const outputLang = lang === "fr" ? "French" : lang === "de" ? "German" : "English";

  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();

  try {
    const prompt = `User question: "${question.trim()}"
Language to respond in: ${outputLang}

Answer the question strictly and accurately based on the background information below. Keep the tone professional, direct, concise, and helpful. If the facts do not contain the answer, politely state that it's not documented here and suggest contacting Blaise directly. Do not invent any facts.`;

    const stream = await generateStreamWithGemini({
      contents: prompt,
      config: {
        systemInstruction: `You are an AI assistant answering questions about Blaise Tappa, a software developer. Always answer in ${outputLang}. Use ONLY the facts provided here:\n${backgroundKnowledge}`,
        temperature: 0.2,
      },
    });

    for await (const chunk of stream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("Gemini QA Stream Error:", error);
    const fallbackAnswer =
      lang === "de"
        ? `Blaise Tappa ist Full-Stack- / Frontend-Entwickler mit Schwerpunkt auf React, TypeScript und Next.js, wohnhaft in Germersheim. Gerne können Sie ihn über das Kontaktformular für detailliertere Fragen kontaktieren.`
        : lang === "fr"
          ? `Blaise Tappa est développeur Full-Stack / Frontend spécialisé en React, TypeScript et Next.js, basé à Germersheim, Allemagne. N'hésitez pas à le contacter via le formulaire de contact pour toute question !`
          : `Blaise Tappa is a Full-Stack / Frontend Developer focused on React, TypeScript, and Next.js, based in Germersheim, Germany. Feel free to reach out via the contact form!`;
    res.write(`data: ${JSON.stringify({ text: fallbackAnswer })}\n\n`);
    res.write("data: [DONE]\n\n");
    res.end();
  }
});

// 2. Project Matcher Endpoint
app.post("/api/ai/match", async (req: Request, res: Response) => {
  const { brief, lang = "en" } = req.body ?? {};

  if (!brief || typeof brief !== "string" || brief.trim().length < 10) {
    return res.status(400).json({
      ok: false,
      error:
        lang === "de"
          ? "Bitte mindestens 10 Zeichen eingeben."
          : lang === "fr"
            ? "Veuillez saisir au moins 10 caractères."
            : "Please write at least 10 characters.",
    });
  }

  const outputLang = lang === "fr" ? "French" : lang === "de" ? "German" : "English";

  try {
    const response = await generateWithGemini({
      contents: `Client problem / brief: "${brief.trim()}"\nLanguage: ${outputLang}`,
      config: {
        systemInstruction: `You are a technical project matcher for Blaise Tappa's portfolio.
Evaluate the client's brief against Blaise's 5 portfolio projects:
1. "signalist": Live finance & trading market dashboard, Finnhub API, Inngest event-driven jobs, MongoDB, Next.js, real-time alerts.
2. "roomify": AI-driven spatial floor plan analyzer, computer vision / LLM pipeline, structured output, Next.js, Tailwind.
3. "tankstellen-finder": German fuel station finder, route-corridor geo search, Supabase/SQL, Leaflet maps, real-time price monitoring.
4. "femmes-daudace": Editorial digital publication platform, headless CMS, high-performance publishing, accessible typography.
5. "grand-bassam": Cultural heritage & tourism portal, interactive map, multilingual guides, UNESCO world heritage showcase.

Select the 2 to 3 most relevant projects and explain in 1-2 sentences why their architecture, stack, or problem domain directly answers the client's brief. Output in ${outputLang}.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matches: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  slug: {
                    type: Type.STRING,
                    description:
                      "The slug of the matched project (signalist, roomify, tankstellen-finder, femmes-daudace, or grand-bassam)",
                  },
                  reason: {
                    type: Type.STRING,
                    description: `Concise explanation in ${outputLang} why this project's architecture fits`,
                  },
                },
                required: ["slug", "reason"],
              },
            },
          },
          required: ["matches"],
        },
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    const matches =
      Array.isArray(parsed.matches) && parsed.matches.length > 0 ? parsed.matches : null;

    if (!matches) {
      throw new Error("No matches parsed");
    }

    return res.json({ ok: true, matches });
  } catch (error) {
    console.error("Gemini Matcher Error:", error);
    // Fallback matches
    return res.json({
      ok: true,
      matches: [
        {
          slug: "signalist",
          reason:
            lang === "de"
              ? "Hervorragend geeignet für datenintensive Anwendungen mit Live-Schnittstellen, Hintergrundjobs und Analysedaten."
              : "Ideal for data-intensive web apps needing live market APIs, scheduled tasks, and interactive analytics.",
        },
        {
          slug: "roomify",
          reason:
            lang === "de"
              ? "Exzellente Vorlage für KI-gestützte Workflows, Bildverarbeitung und strukturierte Datenextraktion."
              : "Great foundation for generative AI workflows, automated visual transformations, and rich UX.",
        },
      ],
    });
  }
});

// 3. Project Spec Builder Endpoint
app.post("/api/ai/spec", async (req: Request, res: Response) => {
  const { slug, idea, lang = "en" } = req.body ?? {};

  if (!idea || typeof idea !== "string" || idea.trim().length < 10) {
    return res.status(400).json({
      ok: false,
      error:
        lang === "de"
          ? "Bitte mindestens 10 Zeichen eingeben."
          : lang === "fr"
            ? "Veuillez saisir au moins 10 caractères."
            : "Please write at least 10 characters.",
    });
  }

  const blueprint = projects.find((p) => p.slug === slug) ?? projects[0];
  const outputLang = lang === "fr" ? "French" : lang === "de" ? "German" : "English";

  try {
    const prompt = `Blueprint project chosen: ${blueprint.name} (${blueprint.stack.join(", ")})
Product Idea / Scope: "${idea.trim()}"
Language: ${outputLang}

Generate a lean, comprehensive engineering and delivery specification structured with the following exact uppercase section headers:
${
  lang === "de"
    ? `ÜBERBLICK
ZIELGRUPPE
KERNFUNKTIONEN
TECH-STACK
ARCHITEKTUR
MEILENSTEINE
OFFENE FRAGEN`
    : lang === "fr"
      ? `APERÇU DU PROJET
PUBLIC CIBLE
FONCTIONNALITÉS CLÉS
STACK TECHNIQUE
ARCHITECTURE LOGICIELLE
JALONS DE LIVRAISON
QUESTIONS OUVERTES`
      : `OVERVIEW
AUDIENCE
CORE FEATURES
TECH STACK
ARCHITECTURE
MILESTONES
OPEN QUESTIONS`
}

Write practical, production-ready specifications tailored to the product idea and building on the chosen blueprint's architectural patterns.`;

    const response = await generateWithGemini({
      contents: prompt,
      config: {
        systemInstruction: `You are a principal software architect generating a concise, actionable product and technical delivery spec. Write in ${outputLang}. Use clean formatting and bullet points where appropriate.`,
        temperature: 0.35,
      },
    });

    const spec = response.text?.trim();
    if (!spec) {
      throw new Error("Empty spec response");
    }

    return res.json({ ok: true, spec });
  } catch (error) {
    console.error("Gemini Spec Error:", error);
    const fallbackSpec =
      lang === "de"
        ? `ÜBERBLICK
Ein schlankes Projekt basierend auf der Architektur von ${blueprint.name}, maßgeschneidert für die Anforderung: "${idea.trim()}".

ZIELGRUPPE
- Benutzer mit Bedarf an schneller, verlässlicher Interaktion und sauberem Interface
- Administratoren zur Überwachung und Pflege von Datensätzen

KERNFUNKTIONEN
- Responsive Benutzeroberfläche mit intuitivem Dashboard
- Strukturierte Datenerfassung, Validierung und Statusübersicht
- Automatisierte Hintergrund-Workflows

TECH-STACK
- Frontend: React, TypeScript, Tailwind CSS
- State & Data: React Query, Zod-Validierung
- Backend: Node.js / Next.js API Routes
- Datenbank: PostgreSQL oder MongoDB

ARCHITEKTUR
- Klare Trennung zwischen Präsentationsschicht und API-Services
- Modulare Komponenten nach atomaren Design-Prinzipien

MEILENSTEINE
- Phase 1: Architektur-Setup und UI-Prototyp
- Phase 2: Kernfunktionen und API-Anbindung
- Phase 3: Testing, Barrierefreiheit und Produktivstart

OFFENE FRAGEN
- Welche externen Schnittstellen sollen v1-seitig angebunden werden?`
        : `OVERVIEW
A focused project leveraging the architectural blueprint of ${blueprint.name}, tailored for: "${idea.trim()}".

AUDIENCE
- Primary users seeking efficient task completion and clear feedback
- Operators managing datasets and tracking activity

CORE FEATURES
- Responsive interface with concise dashboard views
- Structured input validation and state persistence
- Automated event pipelines and asynchronous status updates

TECH STACK
- Frontend: React, TypeScript, Tailwind CSS
- State & Data: React Query, Zod schema validation
- Backend & Services: Node.js / Next.js API Routes
- Database: PostgreSQL or MongoDB

ARCHITECTURE
- Decoupled client presentation from API services
- Reusable accessible component primitives

MILESTONES
- Phase 1: Core setup, design scaffolding, and baseline schemas
- Phase 2: Feature development and service integration
- Phase 3: Verification, accessibility audit, and deployment

OPEN QUESTIONS
- Are there specific third-party APIs or OAuth providers required?`;

    return res.json({ ok: true, spec: fallbackSpec });
  }
});

// 3b. Project Spec Builder Streaming Endpoint (SSE)
app.post("/api/ai/spec/stream", async (req: Request, res: Response) => {
  const { slug, idea, lang = "en" } = req.body ?? {};

  if (!idea || typeof idea !== "string" || idea.trim().length < 10) {
    return res.status(400).json({
      ok: false,
      error:
        lang === "de"
          ? "Bitte mindestens 10 Zeichen eingeben."
          : lang === "fr"
            ? "Veuillez saisir au moins 10 caractères."
            : "Please write at least 10 characters.",
    });
  }

  const blueprint = projects.find((p) => p.slug === slug) ?? projects[0];
  const outputLang = lang === "fr" ? "French" : lang === "de" ? "German" : "English";

  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();

  try {
    const prompt = `Blueprint project chosen: ${blueprint.name} (${blueprint.stack.join(", ")})
Product Idea / Scope: "${idea.trim()}"
Language: ${outputLang}

Generate a lean, comprehensive engineering and delivery specification structured with the following exact uppercase section headers:
${
  lang === "de"
    ? `ÜBERBLICK
ZIELGRUPPE
KERNFUNKTIONEN
TECH-STACK
ARCHITEKTUR
MEILENSTEINE
OFFENE FRAGEN`
    : lang === "fr"
      ? `APERÇU DU PROJET
PUBLIC CIBLE
FONCTIONNALITÉS CLÉS
STACK TECHNIQUE
ARCHITECTURE LOGICIELLE
JALONS DE LIVRAISON
QUESTIONS OUVERTES`
      : `OVERVIEW
AUDIENCE
CORE FEATURES
TECH STACK
ARCHITECTURE
MILESTONES
OPEN QUESTIONS`
}

Write practical, production-ready specifications tailored to the product idea and building on the chosen blueprint's architectural patterns.`;

    const stream = await generateStreamWithGemini({
      contents: prompt,
      config: {
        systemInstruction: `You are a principal software architect generating a concise, actionable product and technical delivery spec. Write in ${outputLang}. Use clean formatting and bullet points where appropriate.`,
        temperature: 0.35,
      },
    });

    for await (const chunk of stream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }
    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error) {
    console.error("Gemini Spec Stream Error:", error);
    const fallbackSpec =
      lang === "de"
        ? `ÜBERBLICK\nEin schlankes Projekt basierend auf der Architektur von ${blueprint.name}, maßgeschneidert für: "${idea.trim()}".\n\nZIELGRUPPE\n- Benutzer mit Bedarf an schneller, verlässlicher Interaktion\n\nKERNFUNKTIONEN\n- Intuitives Dashboard und responsive Oberfläche\n\nTECH-STACK\n- React, TypeScript, Tailwind CSS, Next.js`
        : lang === "fr"
          ? `APERÇU DU PROJET\nProjet structuré s'inspirant de l'architecture de ${blueprint.name}, adapté pour : "${idea.trim()}".\n\nPUBLIC CIBLE\n- Utilisateurs finaux en quête d'une expérience fluide et réactive\n\nFONCTIONNALITÉS CLÉS\n- Interface responsive avec tableau de bord intuitif\n\nSTACK TECHNIQUE\n- React, TypeScript, Tailwind CSS, Next.js`
          : `OVERVIEW\nA focused project leveraging the architectural blueprint of ${blueprint.name}, tailored for: "${idea.trim()}".\n\nAUDIENCE\n- Primary users seeking efficient task completion\n\nCORE FEATURES\n- Responsive interface with concise dashboard views\n\nTECH STACK\n- React, TypeScript, Tailwind CSS, Next.js`;
    res.write(`data: ${JSON.stringify({ text: fallbackSpec })}\n\n`);
    res.write("data: [DONE]\n\n");
    res.end();
  }
});

// 4. Hiring Shortlist Endpoint
app.post("/api/ai/shortlist", async (req: Request, res: Response) => {
  const { role, lang = "en" } = req.body ?? {};

  if (!role || typeof role !== "string" || role.trim().length < 15) {
    return res.status(400).json({
      ok: false,
      error:
        lang === "de"
          ? "Bitte mindestens 15 Zeichen eingeben."
          : lang === "fr"
            ? "Veuillez saisir au moins 15 caractères."
            : "Please write at least 15 characters.",
    });
  }

  const outputLang = lang === "fr" ? "French" : lang === "de" ? "German" : "English";

  try {
    const prompt = `Recruiter's target role description:
"${role.trim()}"

Language: ${outputLang}

Match this role against candidate Blaise Tappa's background. Select up to 6 of the most convincing qualifications across:
- "experience" (OMOA Group, LOGEX Informatique, SBS)
- "project" (signalist, roomify, tankstellen-finder, femmes-daudace, grand-bassam)
- "skill" (${skills.join(", ")})
- "education" (SRH Hochschule Heidelberg B.Sc. Computer Science, BTS Software Development)
- "language" (English, French, German)

Provide:
1. "summary": A concise 2-sentence executive summary in ${outputLang} highlighting his fit, availability (20h/week Werkstudent or freelance), and key strengths.
2. "items": Up to 6 items with "kind", "ref" (slug, company name, skill name, or school), "label" (display title), and "why" (concrete reason why this specific item proves fit for this role).`;

    const response = await generateWithGemini({
      contents: prompt,
      config: {
        systemInstruction: `You are an executive technical recruiter analyzing candidate Blaise Tappa for a job opportunity.
Be honest, grounded in verified facts, and highlight real value. Respond in ${outputLang}. Use the following candidate background:\n${backgroundKnowledge}`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: `A 2-sentence executive summary in ${outputLang}`,
            },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  kind: {
                    type: Type.STRING,
                    description:
                      "One of: 'experience', 'project', 'skill', 'education', 'language'",
                  },
                  ref: {
                    type: Type.STRING,
                    description: "Identifier (slug or name)",
                  },
                  label: {
                    type: Type.STRING,
                    description: "Display title for the item",
                  },
                  why: {
                    type: Type.STRING,
                    description: `1-2 sentences in ${outputLang} explaining the alignment`,
                  },
                },
                required: ["kind", "ref", "label", "why"],
              },
            },
          },
          required: ["summary", "items"],
        },
        temperature: 0.25,
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    const summary = typeof parsed.summary === "string" ? parsed.summary : "";
    const items = Array.isArray(parsed.items) ? parsed.items : [];

    return res.json({ ok: true, summary, items });
  } catch (error) {
    console.error("Gemini Shortlist Error:", error);
    // Return structured fallback
    const summary =
      lang === "de"
        ? `Starkes Profil für diese Rolle: Blaise bringt fundierte Kenntnisse in modernem Web-Development, Praxiserfahrung mit datenintensiven Dashboards und hohe Eigenverantwortung mit. Als Werkstudent mit bis zu 20 Std./Woche sofort einsatzbereit.`
        : `High match for this position: Blaise brings hands-on experience in modern full-stack web engineering, production dashboard delivery, and strong problem-solving skills. Available immediately for up to 20h/week.`;

    const items = [
      {
        kind: "skill",
        ref: "React",
        label: "React & TypeScript",
        why:
          lang === "de"
            ? "Umfassende Praxiserfahrung im Bau performanter, modularer Web-Oberflächen."
            : "Proven experience building performant, modular web user interfaces.",
      },
      {
        kind: "experience",
        ref: "OMOA Group",
        label: "OMOA Group — Frontend Developer",
        why:
          lang === "de"
            ? "Erfolgreicher Bau eines Überwachungs-Dashboards für Zahlungsterminals (40% weniger manuelle Berichte)."
            : "Delivered multi-country monitoring dashboard for payment terminals, saving 40% manual overhead.",
      },
      {
        kind: "project",
        ref: "signalist",
        label: "Signalist",
        why:
          lang === "de"
            ? "Praxisnachweis für Full-Stack-Architektur, API-Integrationen und asynchrone Hintergrundjobs."
            : "Demonstrates full-stack event-driven architecture, external API integration, and clean UX.",
      },
    ];

    return res.json({ ok: true, summary, items });
  }
});

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", model: MODEL, aiConfigured: Boolean(apiKey) });
});

// 5. Direct CV PDF download endpoint
app.get("/api/cv/download", (req: Request, res: Response) => {
  const lang = (req.query.lang as "en" | "de" | "fr") || "en";
  const validLang = lang === "de" || lang === "fr" ? lang : "en";
  try {
    const doc = createCvPdf(validLang);
    const arrayBuffer = doc.output("arraybuffer");
    const buffer = Buffer.from(arrayBuffer);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="CV_Blaise_Tappa_${validLang.toUpperCase()}.pdf"`,
    );
    res.setHeader("Content-Length", buffer.length);
    res.send(buffer);
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function injectSeoIntoHtml(
  html: string,
  pathname: string,
  host: string,
  protocol = "https",
): string {
  const origin = `${protocol}://${host}`;
  const seo = getSeoMetadata(pathname, "fr", origin);

  let modified = html;
  modified = modified.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeHtml(seo.title)}</title>`,
  );

  modified = modified.replace(
    /<meta\s+name=["']description["'][\s\S]*?>/i,
    `<meta name="description" content="${escapeHtml(seo.description)}" />`,
  );
  modified = modified.replace(
    /<meta\s+property=["']og:title["'][\s\S]*?>/i,
    `<meta property="og:title" content="${escapeHtml(seo.title)}" />`,
  );
  modified = modified.replace(
    /<meta\s+property=["']og:description["'][\s\S]*?>/i,
    `<meta property="og:description" content="${escapeHtml(seo.description)}" />`,
  );
  modified = modified.replace(
    /<meta\s+property=["']og:image["'][\s\S]*?>/i,
    `<meta property="og:image" content="${escapeHtml(seo.image)}" />`,
  );
  modified = modified.replace(
    /<meta\s+property=["']og:type["'][\s\S]*?>/i,
    `<meta property="og:type" content="${escapeHtml(seo.type)}" />`,
  );
  modified = modified.replace(
    /<meta\s+name=["']twitter:title["'][\s\S]*?>/i,
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`,
  );
  modified = modified.replace(
    /<meta\s+name=["']twitter:description["'][\s\S]*?>/i,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`,
  );
  modified = modified.replace(
    /<meta\s+name=["']twitter:image["'][\s\S]*?>/i,
    `<meta name="twitter:image" content="${escapeHtml(seo.image)}" />`,
  );

  const canonicalUrl = `${origin}${pathname}`;
  const extraHead = `
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:url" content="${canonicalUrl}" />
    ${seo.jsonLd ? `<script type="application/ld+json">${JSON.stringify(seo.jsonLd)}</script>` : ""}
  </head>`;

  modified = modified.replace("</head>", extraHead);
  return modified;
}

const BOT_UA_REGEX =
  /bot|googlebot|crawler|spider|robot|crawling|facebookexternalhit|twitterbot|linkedinbot|slackbot|whatsapp|telegrambot|discordbot/i;

const PORT = 3000;
const isProduction = process.env.NODE_ENV === "production";

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    // Intercept crawler or test requests to deliver rich OpenGraph HTML
    app.use(async (req: Request, res: Response, next: NextFunction) => {
      const ua = req.headers["user-agent"] || "";
      const isBot = BOT_UA_REGEX.test(ua);
      const isExplicitSeo = req.query.__seo === "1";
      const isNotAsset =
        !req.path.startsWith("/api") &&
        !req.path.startsWith("/@") &&
        !req.path.startsWith("/src") &&
        !req.path.includes(".");

      if ((isBot || isExplicitSeo) && isNotAsset) {
        try {
          const templatePath = path.resolve(__dirname, "index.html");
          let rawHtml = fs.readFileSync(templatePath, "utf-8");
          rawHtml = await vite.transformIndexHtml(req.url, rawHtml);
          const host = req.get("host") || "localhost:3000";
          const protocol = req.protocol || "https";
          const transformed = injectSeoIntoHtml(rawHtml, req.path, host, protocol);
          return res.status(200).set({ "Content-Type": "text/html" }).send(transformed);
        } catch (e) {
          console.warn("Crawler HTML transform error:", e);
        }
      }
      next();
    });

    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (req: Request, res: Response) => {
      try {
        const templatePath = path.resolve(__dirname, "dist", "index.html");
        const rawHtml = fs.readFileSync(templatePath, "utf-8");
        const host = req.get("host") || "localhost:3000";
        const protocol = req.protocol || "https";
        const transformed = injectSeoIntoHtml(rawHtml, req.path, host, protocol);
        res.status(200).set({ "Content-Type": "text/html" }).send(transformed);
      } catch (err) {
        res.sendFile(path.resolve(__dirname, "dist", "index.html"));
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(
      `Server listening on http://0.0.0.0:${PORT} [${isProduction ? "production" : "development"}]`,
    );
  });
}

startServer();
