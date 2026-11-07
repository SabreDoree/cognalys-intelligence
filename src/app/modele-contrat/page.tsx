import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell } from "@/components/legal";

export const metadata: Metadata = { title: "Modèle de contrat client", description: "Modèle de contrat B2B pour un projet d’automatisation ou d’intégration." };

export default function ModeleContrat() {
  return <LegalShell title="Modèle de contrat client">
    <p>Ce modèle est à compléter et signer pour chaque projet. Il accompagne les <Link href="/cgv">CGV</Link> et le devis accepté ; les conditions particulières ci-dessous prévalent en cas de différence.</p>
    <h2>Parties et projet</h2>
    <p>Prestataire : Amine Badaoui, entrepreneur individuel, Cognalys Intelligence, 15 rue Saint Aloïse, 67000 Strasbourg, SIREN 992 810 176.<br />Client : [raison sociale, forme, adresse, SIREN, représentant].<br />Date : [date] — Référence du devis : [référence].</p>
    <h2>1. Périmètre et livrables</h2>
    <p>Objectif : [besoin à résoudre]. Processus et outils concernés : [description]. Livrables à remettre : [solution, configuration, code si prévu, documentation, formation]. Sont exclus : [éléments non compris]. Accès, données et validations à fournir par le client : [liste]. Services tiers et abonnements : [liste, titulaire des comptes et payeur]. Tout changement de périmètre exige un accord écrit sur son coût et son délai.</p>
    <h2>2. Calendrier et validation</h2>
    <p>Début prévisionnel après acompte et remise des accès : [date]. Version de vérification : [date]. Le client teste les cas prévus au devis et communique par écrit les écarts constatés ; Cognalys corrige les non-conformités au périmètre. Date prévisionnelle de mise en service, après validation et paiement du solde : [date]. Les retards d’accès ou de validation décalent ce calendrier.</p>
    <h2>3. Prix et paiement</h2>
    <p>Prix du projet : [montant et régime de TVA]. Acompte de 50 % à la signature, payable avant le début de la réalisation. Solde de 50 % payable après présentation de la version de vérification et avant la mise en service finale. Frais tiers : [montant ou « à la charge directe du client »]. Les pénalités de retard et l’indemnité de recouvrement sont définies dans les CGV.</p>
    <h2>4. Droits, maintenance et responsabilité</h2>
    <p>À paiement complet, le client reçoit les droits d’utilisation indiqués dans les CGV. Si une cession plus large est convenue, décrire séparément chaque droit cédé (reproduction, adaptation, représentation), ses usages, son territoire, sa durée et son prix : [précisions ou « aucune cession supplémentaire »]. Les éléments préexistants et tiers restent soumis à leurs licences. Maintenance ou hébergement après livraison : [périmètre, durée, prix, délai d’intervention ou « aucun »]. Les responsabilités des parties sont définies dans les CGV.</p>
    <h2>5. Données personnelles et fin du contrat</h2>
    <p>Si la solution traite des données personnelles pour le compte du client, une annexe RGPD précisant les traitements et les sous-traitants est signée avant tout accès. À la fin du contrat, les accès sont révoqués et les données sont restituées ou supprimées selon cette annexe. En cas de résiliation, le travail effectué et les dépenses engagées restent dus conformément aux CGV.</p>
    <p>Signatures précédées de « lu et approuvé », avec date :<br />Cognalys Intelligence : ____________________<br />Client : ____________________</p>
  </LegalShell>;
}
