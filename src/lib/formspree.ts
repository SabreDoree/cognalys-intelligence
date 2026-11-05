import type { ContactErrors, ContactInput } from "./contact-schema";

type FormspreeResult = { ok: true } | { ok: false; message: string; errors?: ContactErrors; captcha?: boolean };
const fields = new Set(["name", "company", "email", "phone", "message", "privacy"]);

/** No credential is required: this is the public submission address supplied by the owner. */
export async function sendToFormspree(endpoint: string, values: ContactInput, fetcher: typeof fetch = fetch): Promise<FormspreeResult> {
  const url = new URL(endpoint);
  if (url.origin !== "https://formspree.io" || !/^\/f\/[a-zA-Z0-9]+$/.test(url.pathname) || url.search || url.hash || url.username || url.password) throw new Error("Invalid Formspree endpoint");
  if (values.website || !values.privacy) throw new Error("Invalid submission");
  const payload = new FormData();
  for (const [field, value] of Object.entries({ name: values.name, company: values.company, email: values.email, phone: values.phone, message: values.message, privacy: "Prise de connaissance de la politique de confidentialité confirmée", subject: "Nouvelle demande — Cognalys Intelligence", _gotcha: "" })) payload.set(field, value);
  const response = await fetcher(url.href, {
    method: "POST", headers: { Accept: "application/json" }, body: payload,
    signal: AbortSignal.timeout(20_000), credentials: "omit",
  });
  const body: unknown = await response.json();
  const data = body && typeof body === "object" ? body as { ok?: unknown; errors?: Array<{ field?: string; message?: string; code?: string }>; error?: string } : null;
  if (response.ok && data?.ok === true && !data.errors?.length) return { ok: true };
  const errors: ContactErrors = {};
  for (const error of Array.isArray(data?.errors) ? data.errors : []) {
    if (error.field && fields.has(error.field)) errors[error.field as keyof ContactErrors] = "Vérifiez ce champ avant de réessayer.";
  }
  const captcha = /captcha|challenge/i.test(JSON.stringify(data));
  return { ok: false, errors, captcha, message: captcha ? "Une vérification anti-spam est nécessaire. Terminez l’envoi sur la page sécurisée de Formspree." : response.status === 429 ? "Trop de tentatives ou limite d’envoi atteinte. Réessayez plus tard. Votre texte est conservé." : "L’envoi n’a pas pu être confirmé. Réessayez dans un instant. Votre texte est conservé." };
}
