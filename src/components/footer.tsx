import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { Icon } from "./icon";

export function Footer() {
  return <footer className="site-footer"><div className="shell">
    <div className="footer-top"><Link href="/" className="brand" aria-label={`${siteConfig.name} — accueil`}><Image src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/wordmark.svg`} alt="Cognalys Intelligence — Repensons vos systèmes avec intelligence" width={940} height={175} className="brand-logo" priority /></Link><p>L’intelligence utile à votre quotidien.</p><Link href="/#top" className="back-top">Retour en haut <Icon name="arrowUpRight" /></Link></div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} {siteConfig.name}</span><nav aria-label="Informations légales">{siteConfig.contact.email && <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>}<Link href="/mentions-legales">Mentions légales</Link><Link href="/confidentialite">Confidentialité</Link><Link href="/cgv">CGV</Link><Link href="/modele-contrat">Modèle de contrat</Link>{siteConfig.socials.map(item => <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer">{item.label}</a>)}</nav><span className="footer-note"><span className="tiny-dot" /> Automatisation. Intégration. Intelligence.</span></div>
  </div></footer>;
}
