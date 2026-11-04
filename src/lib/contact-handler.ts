import { siteConfig } from "../config/site";
import { contactSchema, contactErrors } from "./contact-schema";
import { allowedOrigin, BodyTooLargeError, rateKey, readLimitedJson, tokenSecret, verifyToken, type Env } from "./contact-security";
import { createRateLimiter, type RateLimiter } from "./rate-limit";

export type ContactMode = "development" | "live" | "unavailable";
const EMAIL = /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/;

export function contactConfigIssues(env: Env, legalIsReady: boolean): string[] {
  const issues: string[] = [];
  if (env.CONTACT_MODE !== "resend") issues.push("CONTACT_MODE=resend");
  if (!env.RESEND_API_KEY?.trim()) issues.push("RESEND_API_KEY");
  const from = env.CONTACT_FROM_EMAIL?.match(/<([^<>]+)>$/)?.[1] || env.CONTACT_FROM_EMAIL || "";
  if (!EMAIL.test(from) || /[\r\n]/.test(env.CONTACT_FROM_EMAIL || "")) issues.push("CONTACT_FROM_EMAIL");
  if (!EMAIL.test(env.CONTACT_TO_EMAIL || "")) issues.push("CONTACT_TO_EMAIL");
  if ((env.CONTACT_TOKEN_SECRET?.length || 0) < 32) issues.push("CONTACT_TOKEN_SECRET (32 caractères minimum)");
  try { if (new URL(env.NEXT_PUBLIC_SITE_URL || "").protocol !== "https:") issues.push("NEXT_PUBLIC_SITE_URL (HTTPS)"); } catch { issues.push("NEXT_PUBLIC_SITE_URL"); }
  if (env.NODE_ENV === "production") {
    try { if (new URL(env.UPSTASH_REDIS_REST_URL || "").protocol !== "https:") issues.push("UPSTASH_REDIS_REST_URL (HTTPS)"); } catch { issues.push("UPSTASH_REDIS_REST_URL"); }
    if (!env.UPSTASH_REDIS_REST_TOKEN) issues.push("UPSTASH_REDIS_REST_TOKEN");
  }
  if (!legalIsReady) issues.push("Informations légales et coordonnées validées dans src/config/site.ts");
  return issues;
}

export function contactMode(env: Env, legalIsReady: boolean): ContactMode {
  if (!env.CONTACT_MODE || env.CONTACT_MODE === "development") return "development";
  return contactConfigIssues(env, legalIsReady).length ? "unavailable" : "live";
}

export function apiJson(data: object, status = 200, headers: Record<string, string> = {}) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...headers } });
}

type Dependencies = { env: Env; legalIsReady: boolean; fetcher?: typeof fetch; limiter?: RateLimiter; now?: () => number };

/** Fonction testable sans envoi réel. Les dépendances de tests sont explicitement injectées. */
export function createContactHandler({ env, legalIsReady, fetcher = fetch, limiter = createRateLimiter(env), now = Date.now }: Dependencies) {
  return async (request: Request): Promise<Response> => {
    if (!allowedOrigin(request, env)) return apiJson({ ok: false, message: "Origine de la demande non autorisée." }, 403);
    if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return apiJson({ ok: false, message: "Format de demande non pris en charge." }, 415);
    const mode = contactMode(env, legalIsReady);
    if (mode === "unavailable") return apiJson({ ok: false, code: "unavailable", message: "Le formulaire est temporairement indisponible. Aucun message n’a été envoyé." }, 503);
    try {
      const rate = await limiter(rateKey(request, env, "submission"), siteConfig.form.submissionsPerHour);
      if (!rate.allowed) return apiJson({ ok: false, code: "rate_limit", message: "Trop de tentatives. Réessayez plus tard ou utilisez les coordonnées affichées." }, 429, { "Retry-After": String(rate.retryAfter) });
    } catch { return apiJson({ ok: false, message: "La protection du formulaire est indisponible. Aucun message n’a été envoyé. Réessayez plus tard." }, 503); }

    let body: unknown;
    try { body = await readLimitedJson(request); }
    catch (error) { return apiJson({ ok: false, message: error instanceof BodyTooLargeError ? "Votre demande est trop volumineuse." : "La demande n’a pas pu être lue." }, error instanceof BodyTooLargeError ? 413 : 400); }
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) return apiJson({ ok: false, message: "Vérifiez les champs du formulaire.", errors: contactErrors(parsed.error) }, 400);
    const token = body && typeof body === "object" && "token" in body ? body.token : undefined;
    const verified = verifyToken(token, tokenSecret(env), now());
    if (!verified.valid) return apiJson({ ok: false, code: `token_${verified.code}`, message: verified.code === "too_fast" ? "Patientez quelques secondes avant d’envoyer le formulaire." : "La session du formulaire a expiré. Réessayez après son actualisation ; votre texte est conservé." }, 400);
    if (mode === "development") return apiJson({ ok: false, code: "development", message: "Test terminé : les champs sont valides. Mode développement — aucun message n’a été envoyé ni enregistré." }, 503);

    const data = parsed.data;
    const text = [
      `Nouvelle demande depuis ${siteConfig.name}`,
      "", `Nom : ${data.name}`, `Entreprise : ${data.company}`,
      `Email : ${data.email}`, `Téléphone : ${data.phone || "Non renseigné"}`,
      "", "Besoin :", data.message, "",
      "Information sur le traitement des données : prise de connaissance confirmée.",
      `Référence : ${verified.nonce}`,
    ].join("\n");

    try {
      const response = await fetcher("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json", "Idempotency-Key": `contact/${verified.nonce}` },
        body: JSON.stringify({ from: env.CONTACT_FROM_EMAIL, to: [env.CONTACT_TO_EMAIL], reply_to: data.email, subject: `Demande de diagnostic — ${siteConfig.name}`, text }),
        signal: AbortSignal.timeout(8_000),
        cache: "no-store",
      });
      if (!response.ok) return apiJson({ ok: false, code: "provider_error", message: "La transmission n’a pas pu être confirmée. Réessayez dans un instant. Votre texte est conservé." }, 502);
      const result = await response.json() as { id?: unknown };
      if (typeof result.id !== "string" || !result.id) throw new Error("No provider receipt");
      // Une acceptation API confirme la prise en charge, pas la livraison en boîte de réception.
      return apiJson({ ok: true, message: "Votre demande a été prise en charge par notre service d’envoi. Nous vous répondrons à l’adresse indiquée." });
    } catch {
      // Ne pas journaliser le contenu, les coordonnées ou le détail des erreurs du prestataire.
      return apiJson({ ok: false, code: "provider_error", message: "La transmission n’a pas pu être confirmée. Réessayez dans un instant. Votre texte est conservé." }, 502);
    }
  };
}
