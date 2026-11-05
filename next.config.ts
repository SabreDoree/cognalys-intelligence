import type { NextConfig } from "next";

const isStatic = process.env.STATIC_EXPORT === "true";
const nextConfig: NextConfig = {
  ...(isStatic ? { basePath: process.env.NEXT_PUBLIC_BASE_PATH || "", trailingSlash: true, images: { unoptimized: true } } : {}),
  poweredByHeader: false,
  output: isStatic ? "export" : "standalone",
  devIndicators: false,
  async headers() {
    if (isStatic) return [];
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "Content-Security-Policy", value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'; form-action 'self' https://formspree.io" },
      ],
    }];
  },
};

export default nextConfig;
