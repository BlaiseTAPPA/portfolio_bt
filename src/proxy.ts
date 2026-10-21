import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

const intl = createMiddleware(routing);

/**
 * Locale negotiation (cookie, then Accept-Language, then `de`) for every page URL.
 *
 * next-intl redirects unprefixed URLs with a 307. The old site served `/cv`, `/projects/x`, … without a
 * prefix, and those links live on in CVs, LinkedIn and search indexes, so they move for good (308).
 * `/` stays temporary: it is the language entry point and its target depends on the visitor.
 */
export default function proxy(request: NextRequest) {
  const response = intl(request);
  if (response.status === 307 && request.nextUrl.pathname !== "/") {
    return new NextResponse(null, { status: 308, headers: response.headers });
  }
  return response;
}

export const config = {
  // Pages only: skip Next internals, Vercel internals and files (`/og.png`, `/sitemap.xml`, …).
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
