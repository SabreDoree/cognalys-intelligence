import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { isIP } from "node:net";
import { siteConfig } from "../config/site";

export type Env = Record<string, string | undefined>;
export type TokenCheck = { valid: true; nonce: string } | { valid: false; code: "invalid" | "expired" | "too_fast" };

export function tokenSecret(env: Env): string {
  if (env.CONTACT_TOKEN_SECRET && env.CONTACT_TOKEN_SECRET.length >= 32) return env.CONTACT_TOKEN_SECRET;
  // Ce secret public n'est utilisable qu'en mode sans transmission.
  if (!env.CONTACT_MODE || env.CONTACT_MODE === "development") return "public-development-key-no-email-transmission";
  throw new Error("CONTACT_TOKEN_SECRET missing");
}

function mac(payload: string, secret: string): string { return createHmac("sha256", secret).update(payload).digest("base64url"); }

export function createToken(secret: string, now = Date.now()): string {
  const payload = Buffer.from(JSON.stringify({ at: now, nonce: randomUUID() })).toString("base64url");
  return `${payload}.${mac(payload, secret)}`;
}

export function verifyToken(token: unknown, secret: string, now = Date.now()): TokenCheck {
  if (typeof token !== "string" || token.length > 500) return { valid: false, code: "invalid" };
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return { valid: false, code: "invalid" };
  const expected = Buffer.from(mac(payload, secret));
  const supplied = Buffer.from(signature);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return { valid: false, code: "invalid" };
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof data.at !== "number" || !Number.isFinite(data.at) || typeof data.nonce !== "string" || !/^[\da-f-]{36}$/.test(data.nonce)) return { valid: false, code: "invalid" };
    const age = now - data.at;
    if (age < 0) return { valid: false, code: "invalid" };
    if (age < siteConfig.form.minFillMs) return { valid: false, code: "too_fast" };
    if (age > siteConfig.form.tokenMaxAgeMs) return { valid: false, code: "expired" };
    return { valid: true, nonce: data.nonce };
  } catch { return { valid: false, code: "invalid" }; }
}

export function trustedClientId(request: Request, env: Env): string {
  let ip = "";
  if (env.VERCEL === "1") ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "";
  else if (env.CONTACT_IP_SOURCE === "x-forwarded-for") ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
  // Sans proxy de confiance, une limite globale vaut mieux qu'un en-tête falsifiable.
  return isIP(ip) ? ip : "shared-unknown-client";
}

export function rateKey(request: Request, env: Env, bucket: string): string {
  return `cognalys:${bucket}:${mac(trustedClientId(request, env), tokenSecret(env))}`;
}

export function allowedOrigin(request: Request, env: Env): boolean {
  const origin = request.headers.get("origin");
  if (!origin || request.headers.get("sec-fetch-site") === "cross-site") return false;
  const allowed = new Set<string>();
  for (const value of [env.NEXT_PUBLIC_SITE_URL, ...(env.CONTACT_ALLOWED_ORIGINS || "").split(",")]) {
    if (!value) continue;
    try { allowed.add(new URL(value.trim()).origin); } catch { /* Invalid config is not an allowed origin. */ }
  }
  if (env.NODE_ENV !== "production" || !env.CONTACT_MODE || env.CONTACT_MODE === "development") allowed.add(new URL(request.url).origin);
  return allowed.has(origin);
}

export class BodyTooLargeError extends Error {}
export async function readLimitedJson(request: Request, maxBytes = siteConfig.form.maxBodyBytes): Promise<unknown> {
  const length = request.headers.get("content-length");
  if (length && Number(length) > maxBytes) throw new BodyTooLargeError();
  if (!request.body) throw new SyntaxError("Empty body");
  const reader = request.body.getReader();
  const parts: Uint8Array[] = [];
  let lengthRead = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      lengthRead += value.byteLength;
      if (lengthRead > maxBytes) { await reader.cancel(); throw new BodyTooLargeError(); }
      parts.push(value);
    }
    return JSON.parse(Buffer.concat(parts).toString("utf8"));
  } finally { reader.releaseLock(); }
}
