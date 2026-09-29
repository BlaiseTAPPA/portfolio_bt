export type Lang = "en" | "de";

export type Localized = Record<Lang, string>;
export type LocalizedList = Record<Lang, string[]>;

export const identity = {
  name: "Blaise Tappa",
  alias: "Donnie",
  role: {
    en: "Full-Stack / Frontend Developer",
    de: "Full-Stack- / Frontend-Entwickler",
  } satisfies Localized,
  location: "Germersheim, Rheinland-Pfalz, Germany",
  email: "hello@blaisetappa.dev",
  github: "https://github.com/BlaiseTAPPA",
  linkedin: "https://linkedin.com/in/blaise-tappa",
};

export const skills = [
  "React",
  "TypeScript",
  "Next.js",
  "Node.js",
  "PostgreSQL / MongoDB",
  "AI Integration",
  "Docker",
];

export type Project = {
  slug: string;
  name: string;
  year: string;
  stack: string[];
  demo?: string;
  repo?: string;
  excerpt: Localized;
  problem: Localized;
  approach: Localized;
  highlights: LocalizedList;
  image: string;
};

export const projects: Project[] = [
  {
    slug: "signalist",
    name: "Signalist",
    year: "2025",
    stack: [
      "Next.js",
      "TypeScript",
      "MongoDB",
      "BetterAuth",
      "Inngest",
      "Finnhub API",
      "TradingView",
      "Vercel",
    ],
    demo: "https://github.com/BlaiseTAPPA",
    repo: "https://github.com/BlaiseTAPPA",
    image: "/images/project-signalist.jpg",
    excerpt: {
      en: "Real-time financial market intelligence and analytics platform.",
      de: "Plattform für Echtzeit-Marktanalysen und Finanzdaten-Intelligenz.",
    },
    problem: {
      en: "Retail investors track markets across a dozen disconnected tools. Signalist pulls live market data, watchlists, alerts and news into one dashboard, and keeps every view current without the user reloading anything.",
      de: "Privatanleger verfolgen Märkte über ein Dutzend getrennter Tools. Signalist bündelt Live-Marktdaten, Watchlists, Alerts und News in einem Dashboard und hält jede Ansicht aktuell, ohne dass neu geladen werden muss.",
    },
    approach: {
      en: "The application is built on Next.js with TypeScript in strict mode. Market data arrives from the Finnhub API, is normalised in a typed data layer and persisted in MongoDB. Background work — alert evaluation, digest mails, data reconciliation — runs as Inngest event-driven jobs rather than inside request handlers.",
      de: "Die Anwendung basiert auf Next.js mit TypeScript im Strict Mode. Marktdaten kommen über die Finnhub-API, werden in einer typisierten Datenschicht normalisiert und in MongoDB gespeichert. Hintergrundarbeit — Alert-Auswertung, Digest-Mails, Datenabgleich — läuft als ereignisgesteuerte Inngest-Jobs statt in Request-Handlern.",
    },
    highlights: {
      en: [
        "Event-driven background pipeline with Inngest: alerts and digests are decoupled from the request cycle and retried on failure.",
        "Typed data layer over the Finnhub API with caching, so chart views stay responsive under rate limits.",
        "TradingView charting integrated as a client-only island to keep server rendering intact.",
        "Session and account handling with BetterAuth, including protected dashboard routes.",
        "Deployed on Vercel with preview environments per branch.",
      ],
      de: [
        "Ereignisgesteuerte Hintergrund-Pipeline mit Inngest: Alerts und Digests sind vom Request-Zyklus entkoppelt und werden bei Fehlern erneut ausgeführt.",
        "Typisierte Datenschicht über der Finnhub-API mit Caching, damit Chart-Ansichten trotz Rate-Limits reaktionsschnell bleiben.",
        "TradingView-Charting als reine Client-Insel eingebunden, damit das Server-Rendering erhalten bleibt.",
        "Session- und Kontoverwaltung mit BetterAuth inklusive geschützter Dashboard-Routen.",
        "Deployment auf Vercel mit Preview-Umgebungen pro Branch.",
      ],
    },
  },
  {
    slug: "roomify",
    name: "Roomify",
    year: "2025",
    stack: [
      "React Router v7",
      "TypeScript",
      "Tailwind CSS v4",
      "Puter.js",
      "Gemini 2.5 Flash",
      "Docker",
    ],
    demo: "https://github.com/BlaiseTAPPA",
    repo: "https://github.com/BlaiseTAPPA",
    image: "/images/project-roomify.jpg",
    excerpt: {
      en: "AI floor plan visualizer that turns uploaded plans into readable room layouts.",
      de: "KI-Grundriss-Visualisierer, der hochgeladene Pläne in lesbare Raumlayouts übersetzt.",
    },
    problem: {
      en: "Floor plans are hard to read for anyone outside the construction trade. Roomify accepts a plan image and returns a plain-language description and visual breakdown of the space.",
      de: "Grundrisse sind für Laien schwer zu lesen. Roomify nimmt ein Planbild entgegen und liefert eine verständliche Beschreibung und visuelle Aufschlüsselung des Raums.",
    },
    approach: {
      en: "A React Router v7 application with a drag-and-drop upload surface, Puter.js for client-side storage and Gemini 2.5 Flash for multimodal interpretation. The whole app ships as a multi-stage Docker image so the runtime layer stays small.",
      de: "Eine React-Router-v7-Anwendung mit Drag-and-drop-Upload, Puter.js für clientseitige Speicherung und Gemini 2.5 Flash für multimodale Auswertung. Die App wird als Multi-Stage-Docker-Image ausgeliefert, damit die Runtime-Schicht klein bleibt.",
    },
    highlights: {
      en: [
        "Generative AI integration with Gemini 2.5 Flash, including prompt structuring and response validation before render.",
        "Drag-and-drop upload with client-side file validation and progress states.",
        "Multi-stage Docker build separating dependency install, build and runtime layers.",
        "Tailwind CSS v4 token layer so the interface theme lives in CSS, not in component props.",
        "Streaming result view so users see partial output instead of a spinner.",
      ],
      de: [
        "Generative-KI-Integration mit Gemini 2.5 Flash inklusive Prompt-Strukturierung und Validierung der Antwort vor dem Rendern.",
        "Drag-and-drop-Upload mit clientseitiger Dateivalidierung und Fortschrittsanzeige.",
        "Multi-Stage-Docker-Build mit getrennten Schichten für Dependencies, Build und Runtime.",
        "Tailwind-CSS-v4-Token-Ebene, damit das Theme in CSS statt in Komponenten-Props lebt.",
        "Streaming-Ergebnisansicht: Nutzer sehen Teilausgaben statt eines Spinners.",
      ],
    },
  },
  {
    slug: "tankstellen-finder",
    name: "Tankstellen-Finder",
    year: "2024",
    stack: ["React", "TypeScript", "Tankerkönig API", "Supabase / SQL", "Vercel"],
    demo: "https://github.com/BlaiseTAPPA",
    repo: "https://github.com/BlaiseTAPPA",
    image: "/images/project-tankstellen.jpg",
    excerpt: {
      en: "Real-time fuel price finder for Germany with geo-radius and route queries.",
      de: "Echtzeit-Spritpreisfinder für Deutschland mit Umkreis- und Routensuche.",
    },
    problem: {
      en: "Fuel prices in Germany change several times a day and differ street by street. The app answers one question fast: where is the cheapest station near me, or along the route I am already driving.",
      de: "Spritpreise in Deutschland ändern sich mehrmals täglich und unterscheiden sich von Straße zu Straße. Die App beantwortet eine Frage schnell: Wo ist die günstigste Tankstelle in meiner Nähe oder entlang meiner Route.",
    },
    approach: {
      en: "React and TypeScript on the front, the Tankerkönig API as price source, and Supabase/SQL for caching, station metadata and price history. Geo queries run against indexed coordinates so radius and corridor searches stay fast.",
      de: "React und TypeScript im Frontend, die Tankerkönig-API als Preisquelle und Supabase/SQL für Caching, Stationsdaten und Preishistorie. Geo-Abfragen laufen gegen indizierte Koordinaten, damit Umkreis- und Korridorsuchen schnell bleiben.",
    },
    highlights: {
      en: [
        "Geo-radius and route-corridor queries implemented in SQL against indexed station coordinates.",
        "Price caching layer that respects the upstream API rate limit without stale results.",
        "Price history stored per station so trends are visible, not just the current value.",
        "Progressive enhancement: the search works without geolocation permission.",
      ],
      de: [
        "Umkreis- und Routenkorridor-Abfragen in SQL gegen indizierte Stationskoordinaten.",
        "Preis-Caching-Schicht, die das Rate-Limit der API respektiert, ohne veraltete Ergebnisse zu liefern.",
        "Preishistorie pro Station, sodass Trends sichtbar sind und nicht nur der aktuelle Wert.",
        "Progressive Enhancement: Die Suche funktioniert auch ohne Standortfreigabe.",
      ],
    },
  },
  {
    slug: "femmes-daudace",
    name: "Femmes d'Audace",
    year: "2024",
    stack: ["React 19", "TypeScript", "MongoDB", "Prisma", "Clerk"],
    demo: "https://github.com/BlaiseTAPPA",
    repo: "https://github.com/BlaiseTAPPA",
    image: "/images/project-femmes.jpg",
    excerpt: {
      en: "E-learning platform with SSR-first architecture and a dependency-free calendar generator.",
      de: "E-Learning-Plattform mit SSR-first-Architektur und abhängigkeitsfreiem Kalendergenerator.",
    },
    problem: {
      en: "A cohort-based learning programme needed course delivery, enrolment and scheduling in one place, usable on low-bandwidth connections.",
      de: "Ein kohortenbasiertes Lernprogramm brauchte Kursauslieferung, Anmeldung und Terminplanung an einem Ort — nutzbar auch bei geringer Bandbreite.",
    },
    approach: {
      en: "React 19 with server rendering as the default path, Prisma over MongoDB for the data model and Clerk for authentication. Session scheduling exports to calendars through an ICS generator written from the RFC 5545 spec instead of pulling a library.",
      de: "React 19 mit Server-Rendering als Standardpfad, Prisma über MongoDB für das Datenmodell und Clerk für die Authentifizierung. Termine werden über einen ICS-Generator exportiert, der direkt nach RFC 5545 implementiert wurde statt über eine Bibliothek.",
    },
    highlights: {
      en: [
        "SSR-first architecture: content pages render on the server, interactivity is added only where needed.",
        "Zero-dependency ICS calendar generator written against RFC 5545, including timezone and recurrence handling.",
        "Prisma schema modelling cohorts, modules and enrolment state.",
        "Role-aware access with Clerk separating learners, facilitators and admins.",
      ],
      de: [
        "SSR-first-Architektur: Inhaltsseiten rendern serverseitig, Interaktivität nur dort, wo sie nötig ist.",
        "ICS-Kalendergenerator ohne Abhängigkeiten nach RFC 5545, inklusive Zeitzonen und Wiederholungen.",
        "Prisma-Schema für Kohorten, Module und Anmeldestatus.",
        "Rollenbasierter Zugriff mit Clerk für Lernende, Trainer und Admins.",
      ],
    },
  },
  {
    slug: "grand-bassam-tourisme",
    name: "Grand-Bassam Tourisme",
    year: "2025",
    stack: ["React", "TypeScript", "AI-assisted design", "Client project"],
    image: "/images/project-bassam.jpg",
    demo: "https://github.com/BlaiseTAPPA",
    excerpt: {
      en: "Tourism platform and directory for Grand-Bassam, Côte d'Ivoire.",
      de: "Tourismusplattform und Verzeichnis für Grand-Bassam, Côte d'Ivoire.",
    },
    problem: {
      en: "Grand-Bassam's heritage sites, hotels and operators had no single reliable digital entry point for visitors.",
      de: "Die Kulturstätten, Hotels und Anbieter von Grand-Bassam hatten keinen verlässlichen digitalen Einstiegspunkt für Besucher.",
    },
    approach: {
      en: "A client project delivered as a directory-style platform: listings, categories and editorial pages, with an AI-assisted design and development phase to compress the concept-to-prototype loop.",
      de: "Ein Kundenprojekt als verzeichnisbasierte Plattform: Einträge, Kategorien und redaktionelle Seiten, mit einer KI-gestützten Design- und Entwicklungsphase, um den Weg vom Konzept zum Prototyp zu verkürzen.",
    },
    highlights: {
      en: [
        "Directory data model covering venues, categories and editorial content.",
        "AI-assisted design and development phase for rapid prototype iteration with the client.",
        "Content structure prepared for French and English audiences.",
        "Image-led layout tuned for mobile-first, low-bandwidth visitors.",
      ],
      de: [
        "Verzeichnis-Datenmodell für Orte, Kategorien und redaktionelle Inhalte.",
        "KI-gestützte Design- und Entwicklungsphase für schnelle Prototyp-Iterationen mit dem Kunden.",
        "Inhaltsstruktur vorbereitet für französisches und englisches Publikum.",
        "Bildgeführtes Layout, optimiert für Mobile-first und geringe Bandbreite.",
      ],
    },
  },
];

export type Role = {
  company: string;
  title: Localized;
  period: string;
  points: LocalizedList;
};

export const experience: Role[] = [
  {
    company: "OMOA Group",
    title: {
      en: "IT Project Coordinator / Frontend Liaison",
      de: "IT-Projektkoordinator / Frontend-Schnittstelle",
    },
    period: "06.2024 — 09.2025",
    points: {
      en: [
        "Coordinated delivery of 20+ enterprise web products.",
        "Worked in React across product teams as the frontend liaison.",
        "Supported PCI DSS compliance requirements in delivery work.",
        "Held load times below 1.5s on 3G connections.",
      ],
      de: [
        "Koordination der Auslieferung von über 20 Enterprise-Webprodukten.",
        "Als Frontend-Schnittstelle teamübergreifend mit React gearbeitet.",
        "Unterstützung der PCI-DSS-Compliance-Anforderungen in der Umsetzung.",
        "Ladezeiten unter 1,5 s bei 3G-Verbindungen gehalten.",
      ],
    },
  },
  {
    company: "Société Logex",
    title: {
      en: "Frontend & UI/UX Evaluator",
      de: "Frontend- & UI/UX-Evaluator",
    },
    period: "09.2023 — 04.2024",
    points: {
      en: [
        "Assessed technical feasibility of proposed interface work.",
        "Redesigned the frontend around a component-based architecture.",
      ],
      de: [
        "Bewertung der technischen Machbarkeit geplanter Interface-Arbeiten.",
        "Neugestaltung des Frontends auf Basis einer komponentenbasierten Architektur.",
      ],
    },
  },
  {
    company: "SBS Network",
    title: { en: "IT Assistant / QA Support", de: "IT-Assistent / QA-Support" },
    period: "08.2020 — 08.2022",
    points: {
      en: [
        "Built test automation for recurring regression checks.",
        "Reduced manual QA time by 30%.",
      ],
      de: [
        "Testautomatisierung für wiederkehrende Regressionsprüfungen aufgebaut.",
        "Manuellen QA-Aufwand um 30 % reduziert.",
      ],
    },
  },
];

export const education = [
  {
    school: "SRH University",
    period: "Present",
    detail: {
      en: "B.Sc. Computer Science",
      de: "B.Sc. Informatik",
    } satisfies Localized,
  },
  {
    school: "Lomé Business School",
    period: "—",
    detail: {
      en: "Business and management studies",
      de: "Betriebswirtschaft und Management",
    } satisfies Localized,
  },
];

export const languages = [
  { name: { en: "English", de: "Englisch" }, level: { en: "Fluent — TOEFL iBT certified", de: "Fließend — TOEFL iBT zertifiziert" } },
  { name: { en: "French", de: "Französisch" }, level: { en: "Native", de: "Muttersprache" } },
  { name: { en: "German", de: "Deutsch" }, level: { en: "B1", de: "B1" } },
];

export type Post = {
  slug: string;
  date: string;
  tags: string[];
  image: string;
  title: Localized;
  excerpt: Localized;
  body: LocalizedList;
  quote: Localized;
};

export const posts: Post[] = [
  {
    slug: "gemini-in-react",
    date: "2025-08-14",
    tags: ["AI", "React", "Gemini"],
    image: "/images/post-gemini.jpg",
    title: {
      en: "Integrating Gemini into a React app",
      de: "Gemini in eine React-App integrieren",
    },
    excerpt: {
      en: "What changes in an interface when the response is generated rather than fetched.",
      de: "Was sich in einer Oberfläche ändert, wenn die Antwort generiert statt abgerufen wird.",
    },
    body: {
      en: [
        "A generated response is not a fetched response. It arrives slowly, it arrives partially, and it can arrive wrong. Every interface decision in Roomify followed from those three properties rather than from the model itself.",
        "The first decision was to stream. A floor plan interpretation takes several seconds end to end; a spinner for that duration reads as a broken page. Rendering partial output as it arrives turns waiting time into reading time.",
        "The second decision was to validate before render. The model returns structured output, and the application parses it against a schema before any of it reaches a component. When validation fails the user sees a specific retry state, not a half-populated layout.",
        "The third decision was to keep the prompt in version control next to the code that calls it. Prompts are behaviour. Treating them as configuration that lives elsewhere makes regressions impossible to trace.",
      ],
      de: [
        "Eine generierte Antwort ist keine abgerufene Antwort. Sie kommt langsam, sie kommt teilweise, und sie kann falsch kommen. Jede Interface-Entscheidung in Roomify folgte aus diesen drei Eigenschaften, nicht aus dem Modell selbst.",
        "Die erste Entscheidung war Streaming. Eine Grundriss-Auswertung dauert einige Sekunden; ein Spinner über diese Zeit wirkt wie eine kaputte Seite. Teilausgaben während des Eintreffens zu rendern verwandelt Wartezeit in Lesezeit.",
        "Die zweite Entscheidung war Validierung vor dem Rendern. Das Modell liefert strukturierte Ausgaben, die die Anwendung gegen ein Schema prüft, bevor irgendetwas eine Komponente erreicht. Schlägt die Prüfung fehl, sieht der Nutzer einen klaren Retry-Zustand statt eines halb gefüllten Layouts.",
        "Die dritte Entscheidung war, den Prompt neben dem aufrufenden Code zu versionieren. Prompts sind Verhalten. Sie als externe Konfiguration zu behandeln macht Regressionen unauffindbar.",
      ],
    },
    quote: {
      en: "Validate before you render. A generated answer is input, not output.",
      de: "Validieren, bevor gerendert wird. Eine generierte Antwort ist Eingabe, keine Ausgabe.",
    },
  },
  {
    slug: "event-driven-inngest",
    date: "2025-06-02",
    tags: ["Architecture", "Inngest", "Next.js"],
    image: "/images/post-inngest.jpg",
    title: {
      en: "Building an event-driven pipeline with Inngest",
      de: "Eine ereignisgesteuerte Pipeline mit Inngest bauen",
    },
    excerpt: {
      en: "Moving alert evaluation out of the request cycle in Signalist.",
      de: "Alert-Auswertung in Signalist aus dem Request-Zyklus herauslösen.",
    },
    body: {
      en: [
        "Signalist evaluates price alerts continuously. The naive version of that work lives inside request handlers, which means the slowest user action defines the slowest page.",
        "Moving evaluation to Inngest turned each alert into an event with its own retry policy. A failed third-party call no longer fails a page render; it fails a job, which runs again.",
        "The practical gain is observability. Every job has a name, a payload and a history. Debugging a missed alert means reading a run, not reconstructing a request from logs.",
        "The practical cost is that state becomes eventual. Interfaces have to show when data was last reconciled instead of implying it is live.",
      ],
      de: [
        "Signalist wertet Preis-Alerts laufend aus. Die naive Variante dieser Arbeit läuft in Request-Handlern — dann bestimmt die langsamste Nutzeraktion die langsamste Seite.",
        "Die Verlagerung nach Inngest macht aus jedem Alert ein Event mit eigener Retry-Policy. Ein fehlgeschlagener Drittanbieter-Aufruf lässt kein Seitenrendering scheitern, sondern einen Job, der erneut läuft.",
        "Der praktische Gewinn ist Beobachtbarkeit. Jeder Job hat Namen, Payload und Historie. Einen verpassten Alert zu debuggen heißt, einen Lauf zu lesen, statt einen Request aus Logs zu rekonstruieren.",
        "Der praktische Preis: Zustand wird eventual. Oberflächen müssen zeigen, wann Daten zuletzt abgeglichen wurden, statt Aktualität zu suggerieren.",
      ],
    },
    quote: {
      en: "A job that can retry is worth more than a request that cannot.",
      de: "Ein Job, der wiederholt werden kann, ist mehr wert als ein Request, der es nicht kann.",
    },
  },
  {
    slug: "german-while-shipping",
    date: "2025-03-21",
    tags: ["Career", "Germany", "Language"],
    image: "/images/post-german.jpg",
    title: {
      en: "Learning German while shipping production code",
      de: "Deutsch lernen und gleichzeitig Produktivcode ausliefern",
    },
    excerpt: {
      en: "Notes on working toward B2 in a technical environment, from B1.",
      de: "Notizen auf dem Weg von B1 zu B2 in einem technischen Umfeld.",
    },
    body: {
      en: [
        "Technical vocabulary arrives first and everyday vocabulary arrives last. I could read a Pull-Request comment in German months before I could comfortably order at a bakery in Germersheim.",
        "The useful habit was reading documentation in German and writing commits in English. One direction builds comprehension, the other keeps the repository legible for everyone.",
        "Stand-ups are the hard part. Listening comprehension under time pressure is a different skill from reading, and it only improves by staying in the room.",
        "The honest status: B1, working toward B2, and comfortable in a German-speaking engineering team as long as written English stays available for specification work.",
      ],
      de: [
        "Fachvokabular kommt zuerst, Alltagsvokabular zuletzt. Ich konnte einen Pull-Request-Kommentar auf Deutsch lesen, lange bevor ich in einer Bäckerei in Germersheim entspannt bestellen konnte.",
        "Die nützliche Gewohnheit: Dokumentation auf Deutsch lesen, Commits auf Englisch schreiben. Das eine baut Verständnis auf, das andere hält das Repository für alle lesbar.",
        "Stand-ups sind der schwierige Teil. Hörverstehen unter Zeitdruck ist eine andere Fähigkeit als Lesen und verbessert sich nur, wenn man im Raum bleibt.",
        "Der ehrliche Stand: B1 auf dem Weg zu B2 — und im deutschsprachigen Engineering-Team gut aufgehoben, solange Englisch für Spezifikationen verfügbar bleibt.",
      ],
    },
    quote: {
      en: "Comprehension grows in the room, not in the app.",
      de: "Verständnis wächst im Raum, nicht in der App.",
    },
  },
];

export function formatDate(iso: string, lang: Lang) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString(lang === "de" ? "de-DE" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
