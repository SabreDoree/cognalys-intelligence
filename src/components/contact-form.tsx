"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { contactSchema, contactErrors, type ContactErrors, type ContactInput } from "@/lib/contact-schema";
import type { ContactMode } from "@/lib/contact-handler";
import { Icon } from "./icon";

type Notice = { type: "error" | "info" | "success"; message: string } | null;
type TokenResult = { token?: string; mode?: ContactMode; message?: string };

export function ContactForm({ initialMode }: { initialMode: ContactMode }) {
  const formRef = useRef<HTMLFormElement>(null);
  const token = useRef("");
  const tokenRequest = useRef<Promise<string> | null>(null);
  const [mode, setMode] = useState(initialMode);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [notice, setNotice] = useState<Notice>(null);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);

  async function getToken(): Promise<string> {
    if (token.current) return token.current;
    if (tokenRequest.current) return tokenRequest.current;
    tokenRequest.current = (async () => {
      try {
        const response = await fetch("/api/contact/token", { cache: "no-store", signal: AbortSignal.timeout(10_000) });
        const data = await response.json() as TokenResult;
        if (data.mode) setMode(data.mode);
        if (!response.ok || !data.token) throw new Error(data.message || "Le formulaire ne peut pas être initialisé. Réessayez dans un instant.");
        token.current = data.token;
        return data.token;
      } finally { tokenRequest.current = null; }
    })();
    return tokenRequest.current;
  }

  function primeToken() {
    if (!token.current && mode !== "unavailable") void getToken().catch(() => { /* L'erreur est affichée si l'utilisateur essaie d'envoyer. */ });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setNotice(null);
    const raw = new FormData(event.currentTarget);
    const values: ContactInput = {
      name: String(raw.get("name") || ""), company: String(raw.get("company") || ""),
      email: String(raw.get("email") || ""), phone: String(raw.get("phone") || ""),
      message: String(raw.get("message") || ""), privacy: raw.get("privacy") === "on", website: String(raw.get("website") || ""),
    };
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const fields = contactErrors(parsed.error);
      setErrors(fields);
      setNotice({ type: "error", message: "Vérifiez les champs indiqués avant de continuer." });
      const first = Object.keys(fields)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setErrors({}); setPending(true);
    try {
      const currentToken = await getToken();
      const response = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, token: currentToken }), signal: AbortSignal.timeout(20_000),
      });
      const data = await response.json() as { ok?: boolean; code?: string; message?: string; errors?: ContactErrors };
      if (response.ok && data.ok === true) {
        setSent(true); token.current = "";
        setNotice({ type: "success", message: data.message || "Votre demande a été prise en charge par le service d’envoi." });
      } else {
        setErrors(data.errors || {});
        setNotice({ type: data.code === "development" ? "info" : "error", message: data.message || "La transmission n’a pas pu être confirmée. Votre texte est conservé." });
        if (data.code === "token_expired" || data.code === "token_invalid") {
          token.current = "";
          await getToken();
        }
      }
    } catch {
      setNotice({ type: "error", message: "La transmission n’a pas pu être confirmée. Vérifiez votre connexion puis réessayez. Votre texte est conservé." });
    } finally { setPending(false); }
  }

  if (sent) return <div className="contact-form form-success" role="status"><span className="success-icon"><Icon name="check" /></span><h3>Demande prise en charge.</h3><p>{notice?.message}</p><p className="form-help">La confirmation porte sur la prise en charge par le service d’envoi. La réception finale dépend du traitement de l’email.</p><button className="button button-dark" onClick={() => { setSent(false); setNotice(null); }}>Préparer une autre demande<Icon name="arrow" /></button></div>;

  function fieldError(name: keyof ContactInput) { return errors[name] ? <span className="field-error" id={`error-${name}`}>{errors[name]}</span> : null; }
  function attributes(name: keyof ContactInput) { return { "aria-invalid": !!errors[name], "aria-describedby": errors[name] ? `error-${name}` : undefined }; }

  return <form ref={formRef} className="contact-form" onSubmit={submit} onFocus={primeToken} noValidate aria-label="Présenter votre projet" aria-busy={pending}>
    <div className="form-heading"><h3>Votre idée nous intéresse.</h3><p>Les champs marqués d’un * sont obligatoires.</p></div>
    {mode === "development" && <p className="form-mode"><Icon name="circle" /><span>Mode développement : vous pouvez tester le formulaire. <strong>Aucun message ne sera envoyé.</strong></span></p>}
    {mode === "unavailable" && <p className="form-mode" role="status"><Icon name="circle" />Le formulaire est temporairement indisponible. Aucun message ne sera envoyé.</p>}
    <div className="form-row"><div className="field"><label htmlFor="contact-name">Nom et prénom *</label><input id="contact-name" name="name" type="text" autoComplete="name" placeholder="Votre nom et prénom" required maxLength={100} {...attributes("name")} />{fieldError("name")}</div><div className="field"><label htmlFor="contact-company">Entreprise *</label><input id="contact-company" name="company" type="text" autoComplete="organization" placeholder="Le nom de votre entreprise" required maxLength={150} {...attributes("company")} />{fieldError("company")}</div></div>
    <div className="form-row"><div className="field"><label htmlFor="contact-email">Email professionnel *</label><input id="contact-email" name="email" type="email" autoComplete="email" placeholder="vous@entreprise.fr" required maxLength={254} {...attributes("email")} />{fieldError("email")}</div><div className="field"><label htmlFor="contact-phone">Téléphone <span>(facultatif)</span></label><input id="contact-phone" name="phone" type="tel" autoComplete="tel" placeholder="Votre numéro" maxLength={32} {...attributes("phone")} />{fieldError("phone")}</div></div>
    <div className="field"><label htmlFor="contact-message">Votre projet ou votre besoin *</label><textarea id="contact-message" name="message" rows={4} placeholder="Décrivez votre idée, le problème à résoudre ou ce que vous aimeriez améliorer. Vous pouvez aussi nous demander d’explorer les possibilités…" required minLength={20} maxLength={4000} {...attributes("message")} />{fieldError("message")}<span className="field-hint">20 à 4 000 caractères. N’incluez pas de données sensibles.</span></div>
    <div className="honeypot" aria-hidden="true"><label htmlFor="contact-website">Laisser ce champ vide</label><input id="contact-website" type="text" name="website" tabIndex={-1} autoComplete="off" /></div>
    <div className="privacy-field"><label htmlFor="contact-privacy"><input id="contact-privacy" name="privacy" type="checkbox" required {...attributes("privacy")} /><span>J’ai pris connaissance de la <Link href="/confidentialite">politique de confidentialité</Link> et du traitement de mes données pour répondre à ma demande. *</span></label>{fieldError("privacy")}</div>
    {notice && <div className={`form-notice notice-${notice.type}`} role={notice.type === "error" ? "alert" : "status"}>{notice.message}</div>}
    <button className="button button-dark form-submit" type="submit" disabled={pending || mode === "unavailable"}>{pending ? "Vérification en cours…" : mode === "development" ? "Tester le formulaire" : "Envoyer ma demande"}<Icon name={pending ? "clock" : "arrowUpRight"} /></button>
    <p className="form-help"><Icon name="lock" /> Vos informations servent à traiter votre demande et à vous recontacter. Sans les champs obligatoires, nous ne pouvons pas la traiter.</p>
    <noscript><p className="form-notice notice-error">JavaScript est nécessaire pour utiliser ce formulaire sécurisé. Activez-le ou utilisez les coordonnées de contact affichées sur le site.</p></noscript>
  </form>;
}
