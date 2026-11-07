import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { siteConfig } from "@/config/site";
import styles from "@/components/realisations.module.css";

const title = "Comment suivre un déménagement de la demande de devis au paiement ?";
const description = "Découvrez le projet D.E.S Déménagement : site web, demandes de devis, documents PDF, emails, relances et interface de gestion connectée aux outils de l’équipe.";
export const metadata: Metadata = {
  title, description,
  ...(siteConfig.url ? { alternates: { canonical: `${siteConfig.url}/realisations/des-demenagement` } } : {}),
  openGraph: { title, description, type: "article", locale: "fr_FR", ...(siteConfig.url ? { url: `${siteConfig.url}/realisations/des-demenagement` } : {}) },
  twitter: { card: "summary_large_image", title, description },
};

const deliverables = [
  { icon: "plug", title: "Un site pour recevoir les demandes", text: "Présentation des services de déménagement, débarras et transport urgent. Un parcours de demande de devis recueille les informations utiles : départ, arrivée, volume, accès, étages et photos.", detail: "Un point d’entrée en ligne, adapté au mobile." },
  { icon: "document", title: "Des devis et documents préparés", text: "Une grille tarifaire prend en compte le volume, la distance, la main-d’œuvre et les contraintes d’accès. Les données alimentent des modèles de documents pour produire les devis PDF et les contrats après validation du devis.", detail: "Des modèles réutilisables et des règles métier personnalisées." },
  { icon: "mail", title: "Les emails reliés aux dossiers", text: "Préparation de brouillons de devis dans Gmail, pièces jointes PDF et scénarios d’envoi selon le statut du dossier. Après validation du devis, le contrat peut être généré et envoyé avec les documents associés.", detail: "Une validation humaine conservée aux étapes prévues." },
  { icon: "clock", title: "Un suivi des relances", text: "Des règles de relance à J+2, J+7 et J+14 structurent le suivi des devis. L’interface permet de retrouver les dossiers à reprendre et de consulter leur statut pour adapter les actions commerciales.", detail: "Des échéances définies pour organiser le suivi." },
  { icon: "folder", title: "Une interface de gestion sur mesure", text: "Recherche de dossiers, filtres par statut, devis et factures, montants, soldes et échéances : une WebApp rassemble les informations de gestion et distingue les dossiers payés et impayés.", detail: "Les informations utiles regroupées dans une même interface." },
  { icon: "workflow", title: "Les outils de l’équipe connectés", text: "Google Sheets pour le suivi, Google Docs pour les modèles, Drive pour les documents, Gmail pour les échanges, Agenda pour la planification et Discord pour les notifications et les salons associés aux devis.", detail: "Une continuité entre les documents, les échanges et les opérations." },
];
const steps = [
  { icon: "users", title: "Demande reçue", text: "Le client renseigne les détails du déménagement sur le site." },
  { icon: "document", title: "Devis préparé", text: "Les informations servent à l’estimation et au document PDF." },
  { icon: "mail", title: "Échange suivi", text: "Le devis est transmis selon le scénario prévu, puis les relances sont suivies." },
  { icon: "check", title: "Dossier organisé", text: "Contrat, documents et statut accompagnent la suite de la prestation." },
];

export default function RealisationsPage() {
  return <main id="contenu" className={styles.page}>
    <div className="shell">
      <div className={styles.hero}>
        <Link href="/realisations" className={styles.back}><Icon name="arrow" />Toutes les réalisations</Link>
        <span className={styles.eyebrow}>NOS RÉALISATIONS · PROJET D.E.S</span>
        <h1>{title}</h1>
        <p>Pour D.E.S Déménagement, nous avons travaillé sur toute la chaîne : recevoir une demande, préparer les documents et organiser le suivi commercial.</p>
        <div className={styles.heroActions}><a className="button button-cyan" href="#projet-des">Explorer le projet<Icon name="arrow" /></a><a className="text-link" href="https://des-demenagements.fr/" target="_blank" rel="noopener noreferrer">Visiter le site D.E.S<Icon name="arrowUpRight" /><span className={styles.srOnly}> (nouvel onglet)</span></a></div>
      </div>
      <article id="projet-des" className={styles.caseStudy} aria-labelledby="project-heading">
        <header className={styles.projectHeader}>
          <div><Image src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/clients/des-demenagement.webp`} alt="DES Déménagements" width={964} height={290} className={styles.desArticle} unoptimized /><h2 id="project-heading">D.E.S Déménagement</h2><p>Déménagement · Débarras · Transport urgent<br />Strasbourg / Grand-Est / Europe</p></div>
          <div className={styles.projectScope}><span>LE PÉRIMÈTRE</span><p>Site web, automatisations<br />et outils de gestion.</p></div>
        </header>
        <section className={styles.context} aria-labelledby="context-heading"><div><span className={styles.eyebrow}>LE BESOIN</span><h3 id="context-heading">Relier le commercial<br />à l’administratif.</h3></div><p>Une demande de déménagement mobilise des informations, un chiffrage, des documents et plusieurs échanges. Le projet vise à faire circuler ces données entre les outils de l’équipe et à structurer les étapes du dossier, du premier contact au suivi de paiement.</p></section>
        <section className={styles.journey} aria-labelledby="journey-heading"><div className={styles.sectionHeading}><h3 id="journey-heading">Un même dossier, de bout en bout.</h3><p>Vue simplifiée du parcours conçu pour D.E.S.</p></div><ol className={styles.steps}>{steps.map((step, index) => <li key={step.title}><span className={styles.stepIcon}><Icon name={step.icon} /></span><span className={styles.stepNumber}>0{index + 1}</span><h4>{step.title}</h4><p>{step.text}</p></li>)}</ol></section>
        <section className={styles.deliverables} aria-labelledby="deliverables-heading"><div className={styles.sectionHeading}><span className={styles.eyebrow}>CE QUE NOUS AVONS CONSTRUIT</span><h3 id="deliverables-heading">Le site. Les documents. Le suivi.</h3></div><div className={styles.grid}>{deliverables.map((item, index) => <article key={item.title} className={styles.feature}><div className={styles.featureTop}><Icon name={item.icon} /><span>0{index + 1}</span></div><h4>{item.title}</h4><p>{item.text}</p><div className={styles.featureDetail}>{item.detail}</div></article>)}</div></section>
        <section className={styles.support} aria-labelledby="support-heading"><div><span className={styles.eyebrow}>AUTOUR DU PARCOURS CLIENT</span><h3 id="support-heading">Le suivi commercial, aussi.</h3></div><div><p>Le travail comprend également des tableaux de prospection partenaires : bailleurs sociaux, agences immobilières et autres prescripteurs. Des vues de suivi, un tableau de bord et une recherche permettent de retrouver les entreprises et leurs échanges.</p><p>Des supports accompagnent ce dispositif : signatures email, fiche contact et aide à la prospection téléphonique pour l’équipe commerciale.</p></div></section>
        <aside className={styles.note}><Icon name="document" /><div><h3>Un projet qui continue d’évoluer.</h3><p>L’import de documents PDF ou photo avec extraction OCR et le regroupement des anciens devis font partie des développements engagés. Le préremplissage automatique et certains cas d’import restent à fiabiliser. Cette présentation décrit le travail réalisé ; aucun gain de temps ou de chiffre d’affaires n’est chiffré sans mesure.</p></div></aside>
        <div className={styles.projectFooter}><div><strong>Voir le point d’entrée client.</strong><p>Le site public présente les services et le parcours de demande de devis.</p></div><a className="button button-cyan" href="https://des-demenagements.fr/" target="_blank" rel="noopener noreferrer">des-demenagements.fr<Icon name="arrowUpRight" /><span className={styles.srOnly}> (nouvel onglet)</span></a></div>
      </article>
      <section className={styles.cta} aria-labelledby="case-cta"><div><h2 id="case-cta">Et dans votre activité ?</h2><p>Partons des tâches qui vous prennent du temps et des outils que vous utilisez déjà.</p></div><Link href="/#contact" className="button button-cyan">Parlons de votre projet<Icon name="arrowUpRight" /></Link></section>
    </div>
  </main>;
}
