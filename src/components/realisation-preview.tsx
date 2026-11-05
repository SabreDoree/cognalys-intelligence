import Link from "next/link";
import { Icon } from "./icon";
import styles from "./realisations.module.css";

export function RealisationPreview() {
  return <section id="realisations" className={`${styles.preview} shell`} aria-labelledby="realisations-heading">
    <div className={styles.previewIntro}><span className={styles.eyebrow}>NOS RÉALISATIONS</span><h2 id="realisations-heading">Des idées aux outils<br />utilisés sur le terrain.</h2><p>Découvrez le travail réalisé pour D.E.S Déménagement : un site, des devis et un suivi commercial reliés entre eux.</p></div>
    <Link href="/realisations" className={styles.previewCard}>
      <div className={styles.cardTop}><span className={styles.monogram}>D.E.S</span><span className={styles.projectType}>Déménagement · Strasbourg</span><Icon name="arrowUpRight" /></div>
      <h3>De la demande en ligne<br />au suivi du dossier.</h3>
      <div className={styles.tags}><span>Site web</span><span>Devis & PDF</span><span>Relances</span><span>Gestion</span></div>
      <span className={styles.cardLink}>Découvrir la réalisation <Icon name="arrow" /></span>
    </Link>
  </section>;
}
