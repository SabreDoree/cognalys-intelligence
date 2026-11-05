import test from "node:test";
import assert from "node:assert/strict";
import { sendToFormspree } from "../src/lib/formspree";
import type { ContactInput } from "../src/lib/contact-schema";
const data: ContactInput = { name: "Test technique", company: "Cognalys Test", email: "contact-test@example.com", phone: "", message: "Test technique avec des informations fictives.", privacy: true, website: "" };
const endpoint = "https://formspree.io/f/mqppjnzg";
const reply = (status: number, body: unknown) => (async () => Response.json(body, { status })) as typeof fetch;

test("Formspree : transmission des coordonnées et du message, sans jeton serveur", async () => {
  const result = await sendToFormspree(endpoint, data, (async (url, init) => {
    assert.equal(url, endpoint); assert.equal(init?.method, "POST"); assert.equal(init?.credentials, "omit");
    assert.ok(init?.body instanceof FormData);
    assert.equal(new Headers(init?.headers).has("Content-Type"), false);
    const payload = Object.fromEntries((init.body as FormData).entries());
    assert.equal(payload.email, data.email); assert.equal(payload.message, data.message); assert.equal(payload.company, data.company);
    assert.equal(payload._gotcha, ""); assert.equal(payload.token, undefined);
    return Response.json({ ok: true });
  }) as typeof fetch);
  assert.deepEqual(result, { ok: true });
});
test("Formspree : aucune transmission vers une adresse non autorisée", async () => {
  for (const url of ["https://formspree.io.evil.test/f/id", "http://formspree.io/f/id", "https://formspree.io/f/id?to=other", "https://user:pass@formspree.io/f/id"]) {
    await assert.rejects(sendToFormspree(url, data, (async () => { assert.fail("No transmission expected"); }) as typeof fetch));
  }
});
test("Formspree : refus du honeypot ou de l’absence de prise de connaissance", async () => {
  const fetcher = (async () => { assert.fail("No transmission expected"); }) as typeof fetch;
  await assert.rejects(sendToFormspree(endpoint, { ...data, website: "spam" }, fetcher));
  await assert.rejects(sendToFormspree(endpoint, { ...data, privacy: false }, fetcher));
});
test("Formspree : aucun faux succès sur erreur HTTP ou accusé manquant", async () => {
  for (const [status, body] of [[500, { ok: true }], [200, {}], [200, { ok: false }], [200, { ok: true, errors: [{ field: "email" }] }]] as const) {
    assert.equal((await sendToFormspree(endpoint, data, reply(status, body))).ok, false);
  }
});
test("Formspree : erreurs de champ et limite d’envoi", async () => {
  const invalid = await sendToFormspree(endpoint, data, reply(422, { errors: [{ field: "email", message: "Invalid" }] }));
  assert.equal(invalid.ok, false); if (!invalid.ok) assert.ok(invalid.errors?.email);
  const limited = await sendToFormspree(endpoint, data, reply(429, { errors: [] }));
  assert.equal(limited.ok, false); if (!limited.ok) assert.match(limited.message, /limite/);
});
test("Formspree : vérification anti-spam dirigée vers le parcours sécurisé", async () => {
  const result = await sendToFormspree(endpoint, data, reply(400, { errors: [{ code: "RECAPTCHA_FAILED", message: "captcha required" }] }));
  assert.equal(result.ok, false); if (!result.ok) assert.equal(result.captcha, true);
});
test("Formspree : panne réseau ou réponse HTML ne confirme pas d’envoi", async () => {
  await assert.rejects(sendToFormspree(endpoint, data, (async () => { throw new TypeError("Offline"); }) as typeof fetch));
  await assert.rejects(sendToFormspree(endpoint, data, (async () => new Response("<html>Unavailable</html>")) as typeof fetch));
});
