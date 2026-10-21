import { notFound } from "next/navigation";

/**
 * Unknown paths under a locale (`/de/foo`) land here, so they get the localized
 * `[locale]/not-found.tsx` with header and footer instead of the bare global 404.
 * This is the only on-demand route; every real page is prerendered.
 */
export default function CatchAll() {
  notFound();
}
