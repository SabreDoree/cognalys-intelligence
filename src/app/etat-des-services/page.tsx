import { Providers } from "./providers";
import { siteConfig } from "@/config/site";
import styles from "./status.module.css";

export const metadata = { title: "État des services", alternates: { canonical: siteConfig.url + "/etat-des-services/" } };

export default function StatusPage() {
  return <main id="contenu" className={`shell ${styles.page}`}>
    <h1>État des services</h1>
    <section><h2>Services Cognalys</h2><p>Aperçu · statuts simulés en attendant la connexion de la supervision.</p>
      <div className={styles.cards}>{["Europe 01", "Europe 02", "Europe 03", "Modèles IA · LLM"].map((name,i) =>
        <div key={name}><strong>{name}</strong><span><i />{i === 3 ? "Disponible" : "En ligne"}</span></div>)}</div>
    </section>
    <section><h2>Services externes</h2><p>Consultez les incidents signalés par les fournisseurs de vos outils.</p><Providers /></section>
    <section><h2>Que se passe-t-il si mon automatisation ne fonctionne pas ?</h2>
      <p>Un devis tarde à partir ou une commande reste bloquée ? Vérifiez le service concerné ci-dessus. Si le problème persiste, indiquez-nous le nom de l’automatisation, l’étape interrompue et l’heure approximative. Ces informations nous aident à retrouver l’exécution concernée.</p>
      <a className="button button-cyan" href={`mailto:${siteConfig.contact.email}?subject=Automatisation%20interrompue`}>Signaler un problème</a>
    </section>
  </main>;
}
