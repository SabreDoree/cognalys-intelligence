import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { caseStudies } from "@/config/case-studies";
import { siteConfig } from "@/config/site";
import { Icon } from "@/components/icon";
import styles from "@/components/realisations.module.css";

export const metadata: Metadata = {
  title: "Nos réalisations",
  description: "Découvrez les projets de Cognalys Intelligence pour D.E.S Déménagement et Gunstar.",
  alternates: { canonical: siteConfig.url + "/realisations" },
};

export default function Projects() {
  return <main id="contenu" className="shell">
    <header className={styles.hero}><Link href="/" className={styles.back}><Icon name="arrow"/>Retour à l’accueil</Link><h1>Nos réalisations</h1></header>
    <div className={styles.gallery}>
      {caseStudies.map(project => <Link key={project.slug} href={`/realisations/${project.slug}`} className={styles.clientCard}>
        <div className={styles.clientMark} data-client={project.slug} aria-hidden="true">
          {project.logo ? <Image src={(process.env.NEXT_PUBLIC_BASE_PATH || "") + project.logo} width={720} height={80} alt="" unoptimized/> : project.mark}
        </div>
        <div className={styles.clientBody}><small>{project.sector}</small><h2>{project.name}</h2><p>{project.summary}</p><span>Lire l’étude de cas <Icon name="arrow"/></span></div>
      </Link>)}
    </div>
  </main>;
}
