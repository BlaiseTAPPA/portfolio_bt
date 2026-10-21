import type { Metadata } from "next";
import { Antonio, JetBrains_Mono, PT_Serif } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { SiteFooter } from "@/components/site-chrome";
import { SiteHeader } from "@/components/site-header";
import { resolveLocale } from "@/i18n/locale";
import { routing } from "@/i18n/routing";
import { identity } from "@/lib/content";
import "../../styles.css";

// Self-hosted at build time (no request to Google), swapped in without blocking text.
const antonio = Antonio({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-antonio",
});
const ptSerif = PT_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-pt-serif",
});
const jetbrainsMono = JetBrains_Mono({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(identity.siteUrl),
  authors: [{ name: identity.name, url: identity.siteUrl }],
  icons: { icon: "/favicon.ico" },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const locale = await resolveLocale(params);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${antonio.variable} ${ptSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        {/* Client components only need the shared UI strings. */}
        <NextIntlClientProvider messages={{ common: messages.common }}>
          <div className="flex min-h-screen flex-col bg-canvas">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
