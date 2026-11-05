import Link from "next/link";
import { legalReady } from "@/config/site";
import { Icon } from "./icon";

export function LegalShell({ title, children }: { title: string; children: React.ReactNode }) {
  return <main id="contenu" className="legal-page"><div className="shell legal-shell"><Link href="/" className="text-link"><Icon name="arrow" style={{ transform: "rotate(180deg)" }} />Retour à l’accueil</Link><h1>{title}</h1>{!legalReady() && <aside className="legal-notice"><p><strong>Modèle à compléter avant publication.</strong> Les informations officielles et les modalités de traitement doivent être renseignées et validées par l’éditeur. Les champs manquants sont indiqués ci-dessous.</p></aside>}{children}</div></main>;
}

export function LegalValue({ value, optional = false }: { value: string; optional?: boolean }) {
  return value ? <>{value}</> : <span className="legal-placeholder">{optional ? "À préciser si applicable" : "À compléter avant publication"}</span>;
}
