# Blaise Tappa — Portfolio

[![CI](https://github.com/BlaiseTAPPA/portfolio_bt/actions/workflows/ci.yml/badge.svg)](https://github.com/BlaiseTAPPA/portfolio_bt/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

My portfolio as a frontend developer and computer science student: case studies, CV and blog in German, English and French, built on one typed content model.

**Live:** [portfolio-bt-iota.vercel.app](https://portfolio-bt-iota.vercel.app)

![Homepage of the portfolio, German version](docs/screenshot.webp)

## Stack

| Area     | Tools                                                             |
| -------- | ----------------------------------------------------------------- |
| UI       | React 19.3, React Router 7.18, Tailwind CSS 4.3, Framer Motion 13 |
| Language | TypeScript 5.9 (strict, see below)                                |
| Build    | Vite 8.3 (Rolldown)                                               |
| PDF CV   | jsPDF 4, generated in the browser from the content model          |
| Quality  | ESLint 9 + typescript-eslint, Prettier 3, GitHub Actions          |
| Hosting  | Vercel (static build, SPA rewrite in `vercel.json`)               |

## Architecture decisions

**One typed, localized content model.** Every fact on the site (profile, projects, experience, education, blog posts) lives in [`src/lib/content.ts`](src/lib/content.ts). Translatable fields are typed as `Record<Lang, string>`, and objects are checked with `satisfies`. Adding a locale to `locales` makes the compiler point at every missing translation. Pages render this data and hold no facts of their own, and the PDF CV is built from the same source, so site and CV can't drift apart.

**UI strings are split from content.** Shared labels are in [`src/lib/i18n.ts`](src/lib/i18n.ts), page-specific copy in [`src/lib/page-copy.ts`](src/lib/page-copy.ts). `npm run check:i18n` fails on empty strings, missing locales or informal "du" forms in the German copy.

**Strict TypeScript.** Beyond `strict`, the project enables `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `noUnusedLocals` and `noUnusedParameters`. The browser code (`tsconfig.json`) and the Node code (`tsconfig.node.json`: dev server, scripts, Vite config) are checked separately, each with the right globals.

**Small initial bundle.** The jsPDF engine (~400 kB) is loaded only when someone clicks "download CV" ([`src/lib/cv-download.ts`](src/lib/cv-download.ts)). The dependency list holds only what the app imports.

**Dev server.** `npm run dev` starts [`server.ts`](server.ts), an Express server that wraps Vite. It also serves a PDF endpoint and injects per-route meta tags for crawlers, so link previews can be tested locally. Production on Vercel is the static build.

## Scripts

| Command                | What it does                                  |
| ---------------------- | --------------------------------------------- |
| `npm run dev`          | Dev server on http://localhost:3000           |
| `npm run build`        | Typecheck, then production build into `dist/` |
| `npm run preview`      | Serve the production build                    |
| `npm run typecheck`    | `tsc` for browser and Node code               |
| `npm run lint`         | ESLint (incl. Prettier rules)                 |
| `npm run format`       | Format everything with Prettier               |
| `npm run format:check` | Check formatting without writing              |
| `npm run check:i18n`   | Check translations for gaps and "du" forms    |

CI runs `typecheck`, `lint`, `format:check`, `check:i18n` and the build on every push and pull request.

Requirements: Node.js 22 or newer, npm.

```bash
npm ci
npm run dev
```

## Project structure

```text
├── .github/workflows/ci.yml   CI: typecheck, lint, format, i18n, build
├── public/                    Images (AVIF/WebP), OG image, robots.txt
├── scripts/check-i18n.ts      Translation check
├── server.ts                  Express dev server (Vite middleware, PDF, crawler meta)
├── src/
│   ├── main.tsx               Entry point
│   ├── App.tsx                Routes
│   ├── components/            Site header/footer, <head> management
│   ├── lib/
│   │   ├── content.ts         Typed, localized content model (single source of truth)
│   │   ├── i18n.ts            Language context and shared UI strings
│   │   ├── page-copy.ts       Page-specific UI strings
│   │   ├── seo.ts             Per-route titles, descriptions, JSON-LD
│   │   └── cv-pdf.ts          PDF CV built from content.ts
│   ├── pages/                 One component per route
│   └── styles.css             Tailwind 4 theme and base styles
└── vercel.json                SPA rewrite
```

## About me

Built by **Blaise Tappa**, B.Sc. Computer Science student at SRH University (Campus Heidelberg), based in Germersheim. **Open to Werkstudent roles in frontend development.**

- Email: [melvynngaba@gmail.com](mailto:melvynngaba@gmail.com)
- LinkedIn: [linkedin.com/in/blaise-tappa](https://linkedin.com/in/blaise-tappa)
- GitHub: [@BlaiseTAPPA](https://github.com/BlaiseTAPPA)

## License

[MIT](LICENSE)
