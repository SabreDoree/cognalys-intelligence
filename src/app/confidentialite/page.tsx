import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { LegalShell, LegalValue } from "@/components/legal";

export const metadata: Metadata = { title: "Politique de confidentialité", description: "Traitement des demandes envoyées à Cognalys Intelligence." };

export default function Confidentialite() {
  const legal = siteConfig.legal;
  return <LegalShell title="Politique de confidentialité">
    <h2>Responsable et contact</h2>
    <p>Amine Badaoui, entrepreneur individuel, est responsable du traitement des demandes reçues sur ce site. Pour toute question ou demande relative à vos données : <a href={`mailto:${legal.privacyEmail}`}>{legal.privacyEmail}</a>. Ses coordonnées figurent dans les <Link href="/mentions-legales">mentions légales</Link>.</p>
    <h2>Données et utilisation</h2>
    <p>Le formulaire recueille votre nom, votre entreprise, votre email, votre message et, si vous le renseignez, votre téléphone. Des données techniques peuvent être traitées pour la sécurité du formulaire et de l’hébergement. Ces informations servent uniquement à examiner votre demande, vous répondre et, le cas échéant, préparer une prestation. Les champs obligatoires sont nécessaires pour traiter votre demande. N’envoyez pas de mot de passe ni de données sensibles.</p>
    <p>Pour les demandes individuelles, le traitement repose sur les mesures précontractuelles prises à votre demande ; pour les contacts professionnels, sur l’intérêt légitime à répondre aux sollicitations. La protection contre les abus repose sur l’intérêt légitime. La case du formulaire confirme la lecture de cette politique : elle ne vous inscrit pas à une newsletter.</p>
    <h2>Destinataires et prestataires</h2>
    <p>Seules les personnes chargées de répondre à la demande y ont accès. Le formulaire transmet le message à Formspree, qui le conserve dans son tableau de bord et l’envoie à la boîte <a href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>. Le site est hébergé par GitHub Pages. Prestataires concernés : <LegalValue value={legal.processors} />.</p>
    <h2>Conservation</h2>
    <p>Demandes sans suite et échanges associés : <LegalValue value={legal.requestRetention} />. Journaux techniques : <LegalValue value={legal.technicalLogRetention} />. Les documents contractuels et comptables sont conservés selon les obligations légales applicables.</p>
    <h2>Transferts hors de l’EEE</h2>
    <p><LegalValue value={legal.internationalTransfers} />. La localisation et les garanties de la messagerie doivent être vérifiées auprès de son fournisseur.</p>
    <h2>Vos droits</h2>
    <p>Vous pouvez demander l’accès, la rectification, l’effacement ou la limitation de vos données et, selon les cas, vous opposer au traitement ou exercer votre droit à la portabilité. Écrivez à <a href={`mailto:${legal.privacyEmail}`}>{legal.privacyEmail}</a>. Vous pouvez également <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer">saisir la CNIL</a>.</p>
    <h2>Cookies et démonstrations</h2>
    <p>Le site n’emploie pas de cookie publicitaire ou de mesure d’audience. Les démonstrations s’exécutent dans le navigateur sans enregistrer vos saisies. Les liens vers des services externes renvoient à leurs propres politiques.</p>
    <p>Dernière mise à jour : <LegalValue value={legal.updatedAt} />.</p>
  </LegalShell>;
}
