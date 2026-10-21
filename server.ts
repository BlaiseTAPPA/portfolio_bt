import express, { type Request, type Response, type NextFunction } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createCvPdf } from "./src/lib/cv-pdf.ts";
import { getSeoMetadata } from "./src/lib/seo.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// 5. Direct CV PDF download endpoint
app.get("/api/cv/download", (req: Request, res: Response) => {
  const lang = (req.query["lang"] as "en" | "de" | "fr") || "en";
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
const isProduction = process.env["NODE_ENV"] === "production";

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
      const isExplicitSeo = req.query["__seo"] === "1";
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
      return next();
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
      } catch {
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
