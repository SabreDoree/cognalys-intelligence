export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { isIndexable, siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: isIndexable() ? { userAgent: "*", allow: "/", disallow: "/api/" } : { userAgent: "*", disallow: "/" },
    ...(siteConfig.url ? { sitemap: `${siteConfig.url}/sitemap.xml` } : {}),
  };
}
