import type { Metadata } from "next";
import { LegalShell } from "@/components/legal";

export const metadata: Metadata = { title: "Modèle de contrat client", description: "Modèle de contrat B2B pour un projet d’automatisation ou d’intégration." };

export default function ModeleContrat() {
  return <LegalShell title="Modèle de contrat client">
    <p>Ce modèle est à compléter et signer pour chaque projet avec le devis correspondant. En cas de différence, les conditions particulières du contrat prévalent.</p>
    <h2>Parties et projet</h2>
    <p>Prestataire : Amine Badaoui, entrepreneur individuel, Cognalys Intelligence, 15 rue Saint Aloïse, 67000 Strasbourg, SIREN 992 810 176.<br />Client : [raison sociale, forme, adresse, SIREN, représentant].<br />Date : [date] — Référence du devis : [référence].</p>
    <h2>1. Périmètre et livrables</h2>
    <p>Objectif : [besoin à résoudre]. Processus et outils concernés : [description]. Livrables à remettre : [solution, configuration, code si prévu, documentation, formation]. Sont exclus : [éléments non compris]. Accès, données et validations à fournir par le client : [liste]. Services tiers et abonnements : [liste, titulaire des comptes et payeur]. Tout changement de périmètre exige un accord écrit sur son coût et son délai.</p>
    <h2>2. Calendrier et validation</h2>
    <p>Début prévisionnel après acompte et remise des accès : [date]. Version de vérification : [date]. Le client teste les cas prévus au devis et communique par écrit les écarts constatés ; Cognalys corrige les non-conformités au périmètre. Date prévisionnelle de mise en service, après validation et paiement du solde : [date]. Les retards d’accès ou de validation décalent ce calendrier.</p>
    <h2>3. Prix et paiement</h2>
    <p>Prix du projet : [montant et régime de TVA]. Acompte de 50 % à la signature, payable avant le début de la réalisation. Solde de 50 % payable après présentation de la version de vérification et avant la mise en service finale. Frais tiers : [montant ou « à la charge directe du client »]. Aucun escompte pour paiement anticipé. Tout retard entre professionnels entraîne, dès le lendemain de l’échéance et sans rappel, des pénalités au taux de trois fois le taux de l’intérêt légal en vigueur, et l’indemnité forfaitaire légale de 40 € pour frais de recouvrement lorsqu’elle est applicable. Cognalys peut suspendre la prestation après notification écrite.</p>
    <h2>4. Droits, maintenance et responsabilité</h2>
    <p>Après paiement intégral, le client peut utiliser les livrables créés pour lui pour ses besoins professionnels, dans le monde entier et pendant la durée légale de protection. Si une cession plus large est convenue, décrire séparément chaque droit cédé (reproduction, adaptation, représentation), ses usages, son territoire, sa durée et son prix : [précisions ou « aucune cession supplémentaire »]. Les éléments préexistants et tiers restent soumis à leurs licences. Maintenance ou hébergement après livraison : [périmètre, durée, prix, délai d’intervention ou « aucun »]. Le client reste responsable des données et accès fournis, ainsi que de ses décisions fondées sur les résultats. Il vérifie les résultats des automatisations et de l’IA avant toute action sensible. Cognalys exécute la prestation avec diligence dans le périmètre convenu ; les changements ou interruptions de services tiers peuvent nécessiter un devis supplémentaire. Aucune responsabilité que la loi interdit d’exclure n’est limitée.</p>
    <h2>5. Données personnelles et fin du contrat</h2>
    <p>Si la solution traite des données personnelles pour le compte du client, une annexe RGPD précisant les traitements et les sous-traitants est signée avant tout accès. À la fin du contrat, les accès sont révoqués et les données sont restituées ou supprimées selon cette annexe. En cas de manquement grave non corrigé dans les 15 jours suivant une mise en demeure écrite, le contrat peut être résilié. Si le client arrête le projet hors faute de Cognalys, le travail réalisé et les dépenses engagées restent dus ; tout trop-perçu est restitué. Le droit français s’applique et les parties cherchent d’abord une solution amiable.</p>
    <p>Signatures précédées de « lu et approuvé », avec date :<br />Cognalys Intelligence : ____________________<br />Client : ____________________</p>
  </LegalShell>;
}
