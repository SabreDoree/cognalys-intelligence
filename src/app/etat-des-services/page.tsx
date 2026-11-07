import { Providers } from "./providers";
import { siteConfig } from "@/config/site";
import styles from "./status.module.css";

export const metadata = { title: "État des services", alternates: { canonical: siteConfig.url + "/etat-des-services/" } };

export default function StatusPage() {
  return <main id="contenu" className={`shell ${styles.page}`}>
    <h1>État des services</h1>
    <section><h2>Services Cognalys</h2><p>Aperçu · statuts simulés en attendant la connexion de la supervision.</p>
      <div className={styles.cards}>{[["Kiro", "Europe 1"], ["Vanta", "Europe 2"], ["Sora", "Europe 3"], ["Modèles IA · LLM", ""]].map(([name, region],i) =>
        <div key={name}><strong>{name}</strong>{region && <small>{region}</small>}<span><i />{i === 3 ? "Disponible" : "En ligne"}</span></div>)}</div>
    </section>
    <section><h2>Services externes</h2><p>Consultez les incidents signalés par les fournisseurs de vos outils.</p><Providers /></section>
    <section><h2>Que se passe-t-il si mon automatisation ne fonctionne pas ?</h2>
      <p>En cas d’interruption, Cognalys analyse le dossier et identifie les opérations déjà effectuées avant toute reprise. Vous disposez d’un interlocuteur qui vous explique l’impact sur votre activité et vous tient informé jusqu’à la résolution de l’incident.</p>
      <a className="button button-cyan" href={`mailto:${siteConfig.contact.email}?subject=Automatisation%20interrompue`}>Signaler un problème</a>
    </section>
  </main>;
}
