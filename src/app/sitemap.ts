import type { MetadataRoute } from "next";
import { isIndexable, siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexable()) return [];
  return [
    { url: siteConfig.url, changeFrequency: "monthly", priority: 1 },
    { url: `${siteConfig.url}/mentions-legales`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteConfig.url}/confidentialite`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
