import { loadEnvFile } from "node:process";
import { existsSync } from "node:fs";

async function main() {
for (const file of [".env.local", ".env"]) if (existsSync(file)) loadEnvFile(file);
const { siteConfig, legalMissingFields } = await import("../src/config/site");
const { contactConfigIssues } = await import("../src/lib/contact-handler");
const missing = legalMissingFields();
const issues = contactConfigIssues({ ...process.env, NODE_ENV: "production" }, siteConfig.legal.validated && missing.length === 0 && !!siteConfig.contact.email);
if (missing.length) issues.push(`Champs légaux : ${missing.join(", ")}`);
if (!siteConfig.contact.email) issues.push("Coordonnée publique : contact.email");
if (!siteConfig.contact.phone) issues.push("Coordonnée publique : contact.phone et contact.phoneHref");
if (!siteConfig.legal.validated) issues.push("legal.validated doit être true après vérification");
if (process.env.SITE_INDEXABLE !== "true") issues.push("SITE_INDEXABLE=true pour le référencement public");
if (siteConfig.bookingUrl && !siteConfig.bookingUrl.startsWith("https://")) issues.push("Lien de réservation HTTPS");
if (issues.length) {
  console.error("Publication publique non prête :\n" + [...new Set(issues)].map(x => `- ${x}`).join("\n"));
  console.error("Aucune valeur de secret n'a été affichée. Consultez README.md.");
  process.exitCode = 1;
} else {
  console.log("Configuration présente. Effectuez l'envoi réel de recette et validez les mentions avant ouverture publique.");
}
}
void main();
