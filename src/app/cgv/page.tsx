import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell } from "@/components/legal";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Conditions générales de vente", description: "Conditions applicables aux prestations de Cognalys Intelligence pour les clients professionnels." };

export default function CGV() {
  return <LegalShell title="Conditions générales de vente">
    <p>Version du 7 novembre 2026. Ces conditions concernent les prestations vendues à des clients professionnels par Amine Badaoui, entrepreneur individuel, sous le nom Cognalys Intelligence. <Link href="/mentions-legales">Identité et coordonnées du prestataire</Link>.</p>
    <h2>1. Offre et commande</h2>
    <p>Chaque projet fait l’objet d’un devis ou contrat précisant le périmètre, les livrables, le prix, les éventuels frais de services tiers et le calendrier prévisionnel. La commande est formée par l’acceptation écrite du devis et des présentes CGV. Le devis prévaut sur les CGV pour ses conditions particulières. Les modifications demandées ensuite font l’objet d’un accord écrit et, si nécessaire, d’un prix et d’un délai révisés. Aucun barème unique n’est applicable aux projets sur mesure : le prix est établi dans chaque devis.</p>
    <h2>2. Réalisation et réception</h2>
    <p>Le client fournit les informations, accès et validations nécessaires. Les délais annoncés dans le devis courent à compter de la réception de l’acompte et de ces éléments ; tout retard du client peut décaler le calendrier. Une version de vérification est présentée au client avant la mise en service. Le client signale par écrit les écarts au périmètre convenu ; Cognalys corrige les non-conformités relevant de ce périmètre. La mise en service intervient après validation et règlement du solde.</p>
    <h2>3. Prix et règlement</h2>
    <p>Les prix, taxes applicables et éventuels abonnements tiers sont indiqués au devis. Sauf disposition différente du devis, 50 % du prix sont facturés à la commande et exigibles avant le début de la réalisation ; les 50 % restants sont exigibles avant la mise en service finale. Aucun escompte n’est accordé pour paiement anticipé. Tout retard de paiement entre professionnels entraîne, dès le lendemain de l’échéance et sans rappel, des pénalités au taux de trois fois le taux de l’intérêt légal en vigueur, ainsi que l’indemnité forfaitaire légale de 40 € pour frais de recouvrement lorsque celle-ci est applicable. En cas d’impayé, la prestation peut être suspendue après notification écrite.</p>
    <h2>4. Outils, maintenance et données</h2>
    <p>Les licences, abonnements et conditions des outils tiers restent à la charge du client, sauf mention contraire au devis. Une maintenance ou un hébergement après la mise en service n’est fourni que s’il est expressément prévu au devis ou dans un accord distinct. Chaque partie protège les informations confidentielles de l’autre. Lorsque Cognalys traite des données personnelles pour le compte du client, les parties signent avant tout accès une annexe de sous-traitance précisant notamment les traitements, les instructions, les mesures de sécurité et les sous-traitants autorisés.</p>
    <h2>5. Livrables et droits</h2>
    <p>Après paiement intégral, le client obtient un droit d’utilisation des livrables créés spécifiquement pour lui, pour ses besoins professionnels et la durée légale de protection, dans le monde entier. Toute cession exclusive ou droit de modification, reproduction, adaptation ou diffusion au-delà de cet usage doit être décrit distinctement dans le contrat, avec son périmètre, sa destination, sa durée et son territoire. Les outils, composants préexistants, bibliothèques et éléments tiers restent soumis à leurs droits et licences.</p>
    <h2>6. Responsabilités</h2>
    <p>Cognalys exécute la prestation avec diligence selon le périmètre convenu. Le client reste responsable des données qu’il fournit, des décisions prises à partir des résultats et des accès à ses systèmes. Les résultats produits par une automatisation ou une IA doivent être vérifiés par le client lorsqu’ils ont une conséquence juridique, financière ou sensible. Les interruptions et changements imposés par des services tiers peuvent nécessiter une intervention ou un devis supplémentaire. Aucune clause ne limite une responsabilité que la loi interdit d’exclure.</p>
    <h2>7. Arrêt du projet et litiges</h2>
    <p>En cas de manquement grave, la partie lésée peut résilier le contrat si le manquement n’est pas corrigé dans les 15 jours suivant une mise en demeure écrite. En cas d’arrêt demandé par le client hors faute de Cognalys, le travail réalisé et les dépenses engagées jusqu’à la date d’arrêt restent dus ; les sommes perçues en excès sont restituées. Les parties recherchent d’abord une solution amiable. Le droit français s’applique ; le tribunal compétent est déterminé selon les règles de droit commun.</p>
    <p>Un <Link href="/modele-contrat">modèle de contrat de prestation</Link> permet de préciser chaque projet.</p>
  </LegalShell>;
}
