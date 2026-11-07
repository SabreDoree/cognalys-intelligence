export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { caseStudies } from "@/config/case-studies";
import { isIndexable, siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexable()) return [];
  return [
    { url: siteConfig.url, changeFrequency: "monthly", priority: 1 },
    { url: `${siteConfig.url}/realisations`, changeFrequency: "monthly", priority: 0.8 },
    ...caseStudies.map(project => ({ url: `${siteConfig.url}/realisations/${project.slug}`, priority: 0.7 })),
    { url: `${siteConfig.url}/mentions-legales`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteConfig.url}/confidentialite`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
