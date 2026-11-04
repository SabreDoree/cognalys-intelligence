import test from "node:test";
import assert from "node:assert/strict";
import { contactSchema } from "../src/lib/contact-schema";
import { createContactHandler, contactMode } from "../src/lib/contact-handler";
import { allowedOrigin, createToken, trustedClientId, verifyToken, readLimitedJson, BodyTooLargeError } from "../src/lib/contact-security";
import { createMemoryLimiter, createRateLimiter } from "../src/lib/rate-limit";

const now = 2_000_000_000_000;
// Identifiants factices, exclusivement consommés par un fetch injecté en test.
const secret = "test-only-not-a-real-secret-000000000000000";
const env = { NODE_ENV: "production", CONTACT_MODE: "resend", NEXT_PUBLIC_SITE_URL: "https://example.test", CONTACT_TOKEN_SECRET: secret, RESEND_API_KEY: "test-only-placeholder", CONTACT_FROM_EMAIL: "Site <site@example.test>", CONTACT_TO_EMAIL: "team@example.test", UPSTASH_REDIS_REST_URL: "https://redis.example.test", UPSTASH_REDIS_REST_TOKEN: "test-only-placeholder" };
const values = { name: "Camille Exemple", company: "Société fictive", email: "camille@example.test", phone: "", message: "Nous souhaitons automatiser le classement de nos demandes clients.", privacy: true, website: "" };
const payload = () => ({ ...values, token: createToken(secret, now - 10_000) });
const unlimited = async () => ({ allowed: true, retryAfter: 3600 });
const request = (data: unknown, headers: Record<string, string> = {}) => new Request("https://example.test/api/contact", { method: "POST", headers: { origin: "https://example.test", "content-type": "application/json", ...headers }, body: JSON.stringify(data) });
const fetchForbidden: typeof fetch = async () => { throw new Error("Unexpected external call"); };
const handler = (fetcher: typeof fetch = fetchForbidden, options: Partial<Parameters<typeof createContactHandler>[0]> = {}) => createContactHandler({ env, legalIsReady: true, fetcher, limiter: unlimited, now: () => now, ...options });

test("validation : demande valide et téléphone facultatif", () => { assert.equal(contactSchema.safeParse(values).success, true); });
test("validation : tous les champs requis sont contrôlés", () => {
  for (const change of [{ name: "" }, { company: "" }, { email: "x" }, { message: "court" }, { privacy: false }, { phone: "abc" }, { name: "Test\r\nBcc: x@y.fr" }, { website: "spam" }]) assert.equal(contactSchema.safeParse({ ...values, ...change }).success, false, JSON.stringify(change));
});
test("validation : limites de longueur, dont le message", () => {
  assert.equal(contactSchema.safeParse({ ...values, message: "a".repeat(4001) }).success, false);
  assert.equal(contactSchema.safeParse({ ...values, name: "a".repeat(101) }).success, false);
});
test("jeton : signé, horodaté et non modifiable", () => {
  const token = createToken(secret, now - 3000);
  assert.equal(verifyToken(token, secret, now).valid, true);
  assert.deepEqual(verifyToken(`${token}x`, secret, now), { valid: false, code: "invalid" });
  assert.deepEqual(verifyToken(token, "wrong-secret", now), { valid: false, code: "invalid" });
});
test("jeton : délai minimal, expiration et dates futures", () => {
  assert.deepEqual(verifyToken(createToken(secret, now - 100), secret, now), { valid: false, code: "too_fast" });
  assert.deepEqual(verifyToken(createToken(secret, now - 1_800_001), secret, now), { valid: false, code: "expired" });
  assert.deepEqual(verifyToken(createToken(secret, now + 3000), secret, now), { valid: false, code: "invalid" });
});
test("origine : refuse les origines absentes, externes et suffixes trompeurs", () => {
  assert.equal(allowedOrigin(request(payload()), env), true);
  assert.equal(allowedOrigin(request(payload(), { origin: "https://example.test.attacker.test" }), env), false);
  assert.equal(allowedOrigin(request(payload(), { origin: "null" }), env), false);
  assert.equal(allowedOrigin(request(payload(), { "sec-fetch-site": "cross-site" }), env), false);
  assert.equal(allowedOrigin(new Request("https://example.test/api/contact"), env), false);
});
test("IP : n'accepte pas un en-tête client sans proxy explicitement approuvé", () => {
  const req = request(payload(), { "x-forwarded-for": "203.0.113.2" });
  assert.equal(trustedClientId(req, env), "shared-unknown-client");
  assert.equal(trustedClientId(req, { ...env, CONTACT_IP_SOURCE: "x-forwarded-for" }), "203.0.113.2");
  assert.equal(trustedClientId(request(payload(), { "x-vercel-forwarded-for": "203.0.113.4" }), { ...env, VERCEL: "1" }), "203.0.113.4");
});
test("corps : limite de taille même sans Content-Length et en UTF-8", async () => {
  const req = request({ message: "é".repeat(9000) });
  await assert.rejects(() => readLimitedJson(req), BodyTooLargeError);
});
test("limiteur mémoire : plafond, isolation, expiration", async () => {
  let time = now;
  const limit = createMemoryLimiter(() => time);
  assert.equal((await limit("a", 2)).allowed, true);
  assert.equal((await limit("a", 2)).allowed, true);
  assert.equal((await limit("a", 2)).allowed, false);
  assert.equal((await limit("b", 2)).allowed, true);
  time += 3_600_001;
  assert.equal((await limit("a", 2)).allowed, true);
});
test("limiteur Redis : commande atomique, durée et refus du dépassement", async () => {
  let command: unknown;
  const limiter = createRateLimiter(env, async (_url, init) => { command = JSON.parse(String(init?.body)); return Response.json({ result: [6, 3450] }); });
  assert.deepEqual(await limiter("opaque-key", 5), { allowed: false, retryAfter: 3450 });
  assert.equal((command as string[])[0], "EVAL");
  assert.equal((command as string[])[3], "opaque-key");
});
test("limiteur Redis : panne ou réponse invalide ne permet pas l'envoi", async () => {
  const limiter = createRateLimiter(env, async () => Response.json({ error: "offline" }, { status: 503 }));
  await assert.rejects(() => limiter("key", 5));
  await assert.rejects(() => createRateLimiter({ ...env, UPSTASH_REDIS_REST_TOKEN: "" })("key", 5));
});
test("mode : aucun envoi réel sans secrets et mentions validées", () => {
  assert.equal(contactMode({}, false), "development");
  assert.equal(contactMode({ ...env, RESEND_API_KEY: "" }, true), "unavailable");
  assert.equal(contactMode(env, false), "unavailable");
  assert.equal(contactMode(env, true), "live");
});
test("API : refuse une origine externe avant tout traitement", async () => { assert.equal((await handler()(request(payload(), { origin: "https://external.test" }))).status, 403); });
test("API : refuse le type de contenu non JSON", async () => { assert.equal((await handler()(request(payload(), { "content-type": "text/plain" }))).status, 415); });
test("API : signale les erreurs par champ", async () => {
  const response = await handler()(request({ ...payload(), email: "invalid" }));
  assert.equal(response.status, 400);
  assert.equal((await response.json()).ok, false);
});
test("API : honeypot, jeton absent et envoi trop rapide sont rejetés", async () => {
  assert.equal((await handler()(request({ ...payload(), website: "https://spam.test" }))).status, 400);
  assert.equal((await handler()(request(values))).status, 400);
  const response = await handler()(request({ ...payload(), token: createToken(secret, now) }));
  assert.equal((await response.json()).code, "token_too_fast");
});
test("API : JSON malformé et requête trop volumineuse", async () => {
  assert.equal((await handler()(new Request("https://example.test/api/contact", { method: "POST", headers: { origin: "https://example.test", "content-type": "application/json" }, body: "{" }))).status, 400);
  assert.equal((await handler()(request({ ...payload(), message: "x".repeat(17000) }))).status, 413);
});
test("API : limite avec Retry-After et absence d'appel email", async () => {
  const response = await handler(fetchForbidden, { limiter: async () => ({ allowed: false, retryAfter: 123 }) })(request(payload()));
  assert.equal(response.status, 429); assert.equal(response.headers.get("Retry-After"), "123");
});
test("API : panne de protection -> 503, sans transmission", async () => {
  assert.equal((await handler(fetchForbidden, { limiter: async () => { throw new Error("offline"); } })(request(payload()))).status, 503);
});
test("API : mode développement retourne explicitement ok:false, sans email", async () => {
  let called = false;
  const response = await handler(async () => { called = true; return Response.json({ id: "should-not-happen" }); }, { env: { ...env, CONTACT_MODE: "development" } })(request(payload()));
  assert.equal(response.status, 503);
  const result = await response.json();
  assert.equal(result.ok, false); assert.equal(result.code, "development"); assert.equal(called, false);
});
test("API : fournisseur mocké, destinataire serveur et identifiant d'idempotence", async () => {
  const data = payload();
  let email: Record<string, unknown> = {};
  let key = "";
  const fetchMock: typeof fetch = async (url, init) => {
    assert.equal(url, "https://api.resend.com/emails");
    email = JSON.parse(String(init?.body));
    key = new Headers(init?.headers).get("Idempotency-Key") || "";
    return Response.json({ id: "mock-provider-receipt" });
  };
  const response = await handler(fetchMock)(request({ ...data, to: "attacker@example.test" }));
  assert.equal(response.status, 200); assert.equal((await response.json()).ok, true);
  assert.deepEqual(email.to, [env.CONTACT_TO_EMAIL]); assert.equal(email.reply_to, values.email);
  assert.ok(key.startsWith("contact/")); assert.ok(String(email.text).includes(values.message));
  let retriedKey = "";
  await handler(async (_url, init) => { retriedKey = new Headers(init?.headers).get("Idempotency-Key") || ""; return Response.json({ id: "same-receipt" }); })(request(data));
  assert.equal(retriedKey, key);
});
test("API : erreur fournisseur, absence d'accusé et timeout ne donnent jamais un faux succès", async () => {
  for (const mock of [async () => Response.json({ error: "failure" }, { status: 500 }), async () => Response.json({}), async () => { throw new Error("timeout"); }]) {
    const response = await handler(mock)(request(payload()));
    assert.equal(response.status, 502); assert.equal((await response.json()).ok, false);
  }
});
test("API : configuration incomplète et aucun secret dans la réponse", async () => {
  const response = await handler(fetchForbidden, { env: { ...env, RESEND_API_KEY: "" } })(request(payload()));
  assert.equal(response.status, 503); const body = await response.text();
  assert.ok(!body.includes(secret)); assert.ok(!body.includes(env.CONTACT_TO_EMAIL));
});
