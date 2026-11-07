import Image from "next/image";
import Link from "next/link";
import { Icon } from "./icon";
import styles from "./realisations.module.css";

export function RealisationPreview() {
  return <section id="realisations" className={`${styles.preview} shell`} aria-labelledby="realisations-heading">
    <div className={styles.previewIntro}><span className={styles.eyebrow}>NOS RÉALISATIONS</span><h2 id="realisations-heading">Des idées aux outils<br />utilisés sur le terrain.</h2><p>Du suivi des devis à la vente en ligne, découvrez les outils construits pour nos clients.</p><Link href="/realisations" className="text-link">Toutes les réalisations <Icon name="arrow" /></Link></div>
    <Link href="/realisations/des-demenagement" className={styles.previewCard}>
      <div className={styles.cardTop}><Image src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/clients/des-demenagement.webp`} alt="DES Déménagements" width={964} height={290} className={styles.desPreview} unoptimized /><span className={styles.projectType}>Déménagement · Strasbourg</span><Icon name="arrowUpRight" /></div>
      <h3>De la demande en ligne<br />au suivi du dossier.</h3>
      <div className={styles.tags}><span>Site web</span><span>Devis & PDF</span><span>Relances</span><span>Gestion</span></div>
      <span className={styles.cardLink}>Découvrir la réalisation <Icon name="arrow" /></span>
    </Link>
  </section>;
}
