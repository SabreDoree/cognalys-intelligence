import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { LegalShell, LegalValue } from "@/components/legal";

export const metadata: Metadata = {
  title: "Mentions légales", description: "Informations sur l’éditeur, l’hébergement et les conditions d’utilisation du site Cognalys Intelligence.",
  ...(siteConfig.url ? { alternates: { canonical: `${siteConfig.url}/mentions-legales` } } : {}),
};

export default function MentionsLegales() {
  const legal = siteConfig.legal;
  return <LegalShell title="Mentions légales">
    <p>Ce site présente les services d’automatisation et d’intégration d’intelligence artificielle proposés sous le nom commercial {siteConfig.name}.</p>
    <h2>1. Éditeur du site</h2>
    <dl>
      <div><dt>Nom commercial</dt><dd>{siteConfig.name}</dd></div>
      <div><dt>Dénomination / identité</dt><dd><LegalValue value={legal.legalName} /></dd></div>
      <div><dt>Forme juridique</dt><dd><LegalValue value={legal.legalForm} /></dd></div>
      <div><dt>Capital social</dt><dd><LegalValue value={legal.capital} optional /></dd></div>
      <div><dt>Adresse</dt><dd><LegalValue value={legal.address} /></dd></div>
      <div><dt>SIREN</dt><dd><LegalValue value={legal.siren} /></dd></div>
      <div><dt>Immatriculation</dt><dd><LegalValue value={legal.registration} /></dd></div>
      <div><dt>TVA intracommunautaire</dt><dd><LegalValue value={legal.vatNumber} optional /></dd></div>
      <div><dt>Email</dt><dd><LegalValue value={siteConfig.contact.email} /></dd></div>
      <div><dt>Téléphone</dt><dd><LegalValue value={siteConfig.contact.phone} /></dd></div>
      <div><dt>Direction de publication</dt><dd><LegalValue value={legal.publicationDirector} /></dd></div>
    </dl>
    <h2>2. Hébergement</h2><dl><div><dt>Hébergeur</dt><dd><LegalValue value={legal.hostName} /></dd></div><div><dt>Adresse</dt><dd><LegalValue value={legal.hostAddress} /></dd></div><div><dt>Téléphone</dt><dd><LegalValue value={legal.hostPhone} /></dd></div></dl>
    <h2>3. Présentation des services</h2><p>Les informations figurant sur ce site décrivent les domaines d’intervention de {siteConfig.name}. La faisabilité, le périmètre, les conditions financières, les délais et les modalités de maintenance d’un projet sont précisés dans une proposition spécifique. Le contenu de ce site ne constitue pas une garantie de résultat.</p>
    <h2>4. Démonstrations</h2><p>Les démonstrations présentes sur ce site sont des simulations pédagogiques. Les organisations et dossiers utilisés dans ces exemples sont fictifs. Aucun email n’est envoyé, aucun dossier client réel n’est créé et aucun logiciel métier n’est connecté pendant ces simulations.</p>
    <h2>5. Propriété intellectuelle</h2><p>Les contenus, signes distinctifs et éléments graphiques du site sont protégés selon les droits applicables. Les composants logiciels et polices de caractères tiers restent soumis à leurs licences respectives. Toute réutilisation doit respecter ces droits et licences.</p>
    <h2>6. Données personnelles</h2><p>Les modalités de traitement des données du formulaire et les informations relatives aux droits des personnes sont détaillées dans la <Link href="/confidentialite">politique de confidentialité</Link>.</p>
    <h2>7. Contact et mise à jour</h2><p>Pour signaler une erreur ou poser une question sur le site, utilisez les coordonnées de l’éditeur ci-dessus. Dernière mise à jour des présentes mentions : <LegalValue value={legal.updatedAt} />.</p>
  </LegalShell>;
}
