import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { Icon } from "@/components/icon";
import styles from "@/components/realisations.module.css";

const title = "Comment vendre chaque drop sur son propre site et automatiser les commandes ?";
const description = "Pour Gunstar, Cognalys a créé une boutique de vêtements sur mesure avec paiement Stripe et traitement automatisé des commandes.";
export const metadata: Metadata = {
  title, description, alternates: { canonical: siteConfig.url + "/realisations/gunstar" },
  openGraph: { title, description, type: "article" },
};

export default function Gunstar() {
  return <main id="contenu" className="shell"><article>
    <header className={styles.hero}>
      <Link className={styles.back} href="/realisations"><Icon name="arrow"/>Toutes les réalisations</Link>
      <div className={styles.gunstarBanner}><Image src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/clients/gunstar.webp`} width={720} height={80} alt="Gunstar" unoptimized /></div>
      <h1>{title}</h1>
      <p>Gunstar voulait garder la main sur la présentation de ses collections, du premier écran jusqu’à l’achat. Cognalys a construit le site de la marque, intégré Stripe pour les paiements en ligne et automatisé le traitement des commandes.</p>
    </header>
    <div className={styles.caseText}>
      <section><h2>Une boutique au rythme des collections</h2><p>La visite commence par une vidéo plein écran. Un clic ouvre la galerie, où le prochain drop côtoie les archives. Une pièce épuisée peut ainsi rester visible dans l’histoire de la marque, avec sa disponibilité clairement indiquée.</p></section>
      <section><h2>Encaisser directement depuis le site</h2><p>Gunstar a choisi une boutique développée sur mesure, sans passer par Shopify. La marque décide de la présentation de ses pièces. Stripe prend en charge le paiement en ligne et relie l’achat au parcours de commande conçu pour Gunstar.</p></section>
      <section><h2>Passer du paiement à la commande</h2><p>Une vente déclenche le traitement automatisé de la commande. L’intérêt pour l’équipe est concret au moment d’un drop, lorsque plusieurs clients achètent sur une courte période. Elle peut consacrer son attention à la préparation des vêtements et aux demandes particulières.</p></section>
      <a className="button button-cyan" href="https://gunstar.world/" target="_blank" rel="noopener noreferrer">Visiter Gunstar <Icon name="arrowUpRight"/></a>
    </div>
  </article></main>;
}
