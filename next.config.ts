import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Visitors are mostly first-time (recruiters): inline the small Tailwind sheet instead of a
    // render-blocking request, so the first paint doesn't wait for a CSS round trip.
    inlineCss: true,
  },
};

export default withNextIntl(nextConfig);
