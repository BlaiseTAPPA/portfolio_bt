# Portfolio & Engineering Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.x-61dafb.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A production-grade, full-stack personal portfolio and developer platform built with React 18, TypeScript, Tailwind CSS, shadcn/ui, and Bun/Node. The application showcases full-stack web applications, technical write-ups, interactive AI-assisted modules (Project Matcher, Q&A Assistant, and Project Scope Builder powered by Google Gemini), and multilingual support.

---

## Key Features

- **Interactive AI Tools**:
  - **Project Matcher**: Matches prospective project requirements to past case studies using Gemini.
  - **Portfolio Q&A Assistant**: An interactive conversational assistant answering queries about career experience, technical skills, and projects.
  - **Scope & Architecture Builder**: Generates high-level technical specifications and implementation estimates.
- **Multilingual Support (i18n)**: Seamless language switching (English and German) with localized content.
- **PDF Resume Generation**: Dynamically formats and exports a downloadable professional CV directly from the client.
- **Performance & SEO Optimized**: Complete meta tags, OpenGraph data, and dynamic `<head>` injection for search engine visibility.
- **Design System**: Accessible, modern UI components built on top of Radix UI and Tailwind CSS (`shadcn/ui`).
- **Full-Stack Execution**: Express/Node server layer paired with client-side routing via React Router.

---

## Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend Core** | React 18, TypeScript, Vite |
| **Styling & Components** | Tailwind CSS, Radix UI primitives, Lucide Icons, Sonner |
| **AI Integration** | Google Gemini API (`@google/genai`) |
| **Runtime & Tooling** | Bun / Node.js, Express, ESLint, Prettier |
| **Document Export** | Dynamic PDF generation utility |

---

## Project Structure

```text
portfolio/
├── public/                 # Static assets, screenshots, and robots.txt
├── src/
│   ├── components/         # Domain components & feature widgets
│   │   ├── ui/             # Radix UI + Tailwind design system components
│   │   ├── about-qa.tsx    # AI Q&A interactive panel
│   │   ├── project-builder.tsx # Interactive spec/architecture builder
│   │   └── project-matcher.tsx # Project matching assistant
│   ├── hooks/              # Custom React hooks (useMobile, etc.)
│   ├── lib/                # API helpers, Gemini callers, i18n, & utilities
│   │   ├── content.ts      # Structured portfolio data (projects, blog posts)
│   │   ├── i18n.tsx        # Localization context & translations
│   │   ├── cv-pdf.ts       # CV export and rendering logic
│   │   └── *.functions.ts  # Gemini API tool calling and completions
│   ├── pages/              # Route views (Home, Projects, Blog, About, Contact, CV)
│   ├── App.tsx             # Root layout & route configuration
│   ├── main.tsx            # Application entry point
│   └── styles.css          # Tailwind CSS layer configurations
├── server.ts               # Production and development proxy server
└── vite.config.ts          # Vite build and plugin configurations
```

---

## Getting Started

### Prerequisites

- Node.js >= 18.0.0 or Bun >= 1.0.0
- Google Gemini API Key (for interactive AI features)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/portfolio.git
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Add your Gemini API key inside `.env`:
   ```env
   GEMINI_API_KEY="your-gemini-api-key-here"
   ```

---

## Development & Build Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` / `bun run dev` | Launches the local Vite development server |
| `npm run build` / `bun run build` | Compiles TypeScript and builds production bundles into `dist/` |
| `npm run preview` / `bun run preview` | Previews the production build locally |
| `npm run lint` / `bun run lint` | Runs ESLint to check for static typing and lint issues |

---

## AI Functions & Environment

The platform uses Google Gemini to deliver real-time interactive tooling:
- **`qa.functions.ts`**: Feeds portfolio background data into context-aware system prompts to answer visitor queries accurately.
- **`matcher.functions.ts`**: Analyzes user project descriptions and extracts relevant project case studies with similarity scoring.
- **`spec.functions.ts`**: Breaks down project concepts into tech stacks, timelines, and architectural milestones.

Ensure `GEMINI_API_KEY` is present in your environment for all API functions to operate.

---

## Contributing & License

Contributions, suggestions, and pull requests are welcome. Feel free to open an issue for bug fixes or feature requests.

This project is licensed under the [MIT License](LICENSE).
