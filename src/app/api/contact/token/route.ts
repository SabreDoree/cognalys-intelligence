import { legalReady, siteConfig } from "@/config/site";
import { apiJson, contactMode } from "@/lib/contact-handler";
import { createToken, rateKey, tokenSecret } from "@/lib/contact-security";
import { createRateLimiter } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (request.headers.get("sec-fetch-site") === "cross-site") return apiJson({ ok: false }, 403);
  const mode = contactMode(process.env, legalReady());
  if (mode === "unavailable") return apiJson({ mode, message: "Le formulaire est temporairement indisponible." }, 503);
  try {
    const rate = await createRateLimiter(process.env)(rateKey(request, process.env, "token"), siteConfig.form.tokensPerHour);
    if (!rate.allowed) return apiJson({ mode: "unavailable", message: "Trop de tentatives. Réessayez plus tard." }, 429, { "Retry-After": String(rate.retryAfter) });
    return apiJson({ mode, token: createToken(tokenSecret(process.env)) });
  } catch { return apiJson({ mode: "unavailable", message: "Le formulaire est temporairement indisponible." }, 503); }
}
