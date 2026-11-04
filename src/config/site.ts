/**
 * CONFIGURATION PUBLIQUE — aucun secret ici.
 * Les coordonnées et informations officielles restent vides tant qu'elles
 * n'ont pas été confirmées. Ne pas inventer de références ou de résultats.
 */
function httpUrl(value: string | undefined): string {
  if (!value) return "";
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.toString().replace(/\/$/, "") : "";
  } catch { return ""; }
}

export const siteConfig = {
  name: "Cognalys Intelligence",
  shortName: "cognalys",
  tagline: "Des solutions sur mesure pour faire avancer votre entreprise.",
  description: "Automatisation, intelligence artificielle, logiciels connectés et outils sur mesure : Cognalys Intelligence étudie votre projet, quel que soit votre secteur.",
  url: httpUrl(process.env.NEXT_PUBLIC_SITE_URL),
  bookingUrl: httpUrl(process.env.NEXT_PUBLIC_BOOKING_URL),
  contact: { email: "", phone: "", phoneHref: "" },
  socials: [] as { label: string; url: string }[],
  legal: {
    validated: false,
    legalName: "",
    legalForm: "",
    capital: "",
    address: "",
    siren: "",
    registration: "",
    vatNumber: "",
    publicationDirector: "",
    hostName: "",
    hostAddress: "",
    hostPhone: "",
    privacyEmail: "",
    // À fixer selon vos pratiques réelles, y compris la boîte de réception.
    requestRetention: "",
    technicalLogRetention: "",
    // Noms / localisation / rôle des prestataires effectivement activés.
    processors: "",
    internationalTransfers: "",
    updatedAt: "",
  },
  form: {
    minFillMs: 2_000,
    tokenMaxAgeMs: 30 * 60_000,
    maxBodyBytes: 16_384,
    submissionsPerHour: 5,
    tokensPerHour: 30,
    title: "Parlons de votre projet.",
    description: "Une idée précise, un problème à résoudre ou une possibilité à explorer ? Racontez-nous votre besoin. Nous étudions chaque demande pour identifier une solution adaptée et vérifier sa faisabilité.",
  },
  nav: [
    { label: "Exemples concrets", href: "/#solutions" },
    { label: "Démonstration", href: "/#demonstration" },
    { label: "Comment ça marche", href: "/#methode" },
    { label: "FAQ", href: "/#faq" },
  ],
  hero: {
    eyebrow: "AUTOMATISATION · INTELLIGENCE ARTIFICIELLE · SUR MESURE",
    title: "Votre entreprise a ses défis.",
    accent: "Créons les solutions qui la font avancer.",
    description: "Automatiser une tâche, connecter vos logiciels, créer un outil sur mesure ou explorer une idée : nous étudions votre projet avec vous.",
    primaryCta: "Parlons de votre projet",
    secondaryCta: "Explorer les possibilités",
    note: "Quel que soit votre secteur. Aucune connaissance en IA nécessaire.",
  },
  problems: [
    { icon: "copy", title: "La même saisie. Plusieurs fois.", description: "Un email, un tableur, puis votre CRM. La même information passe de main en main.", solution: "Une information saisie une fois, transmise aux bons outils." },
    { icon: "route", title: "Des outils qui s’ignorent.", description: "Vos équipes jonglent entre les logiciels et cherchent la bonne version d’un dossier.", solution: "Des connexions qui font circuler les données utiles." },
    { icon: "clock", title: "Des suivis qui passent à côté.", description: "Une relance oubliée, un document en attente, une opportunité qui finit par se perdre.", solution: "Des étapes suivies, des rappels déclenchés au bon moment." },
  ],
  services: [
    { id: "processus", icon: "workflow", number: "01", title: "Automatisation des processus", description: "Transformez les tâches récurrentes en enchaînements fiables, avec des règles claires et des points de contrôle.", example: "D’une demande reçue à un dossier prêt à traiter.", tags: ["Administratif", "Opérations"], benefit: "Moins de ressaisie et de manipulations manuelles." },
    { id: "agents", icon: "spark", number: "02", title: "Agents & assistants IA", description: "Retrouvez une information, classez une demande ou préparez une réponse à partir des sources que vous avez choisies.", example: "Un assistant qui s’appuie sur votre documentation.", tags: ["Connaissance", "Assistance"], benefit: "Une aide ciblée, avec vérification humaine si nécessaire." },
    { id: "commercial", icon: "users", number: "03", title: "Suivi commercial & CRM", description: "Centralisez les demandes, mettez à jour vos dossiers et programmez les relances selon vos règles commerciales.", example: "Un prospect qualifié, attribué et suivi dans le CRM.", tags: ["Prospection", "Relation client"], benefit: "Un suivi plus régulier et une information mieux partagée." },
    { id: "documents", icon: "document", number: "04", title: "Traitement des documents", description: "Extrayez les informations utiles de vos factures, formulaires et dossiers, puis orientez-les vers le bon outil.", example: "Une facture lue, contrôlée, puis classée.", tags: ["Extraction", "Classement"], benefit: "Moins de tri manuel, avec contrôle des données extraites." },
    { id: "integrations", icon: "plug", number: "05", title: "Intégrations & outils sur mesure", description: "Reliez vos logiciels par leurs API ou créez une interface simple quand votre organisation a un besoin spécifique.", example: "Vos outils de gestion et vos équipes enfin synchronisés.", tags: ["Connexions", "Sur mesure"], benefit: "Un fonctionnement adapté à vos outils et à leurs possibilités." },
    { id: "maintenance", icon: "shield", number: "06", title: "Maintenance & accompagnement", description: "Gardez vos automatisations compréhensibles, surveillez les erreurs et faites évoluer les scénarios avec votre activité.", example: "Une anomalie détectée et un processus ajusté.", tags: ["Supervision", "Évolution"], benefit: "Un périmètre de suivi défini ensemble, dès le départ." },
  ],
  method: [
    { title: "Comprendre votre objectif", description: "Nous partons de votre idée, du problème à résoudre et des contraintes de votre entreprise. Le besoin passe avant la technologie.", result: "Un besoin clairement défini", icon: "search" },
    { title: "Étudier la solution adaptée", description: "Nous vérifions la faisabilité et les ressources nécessaires, puis définissons avec vous le périmètre, le budget et les étapes du projet.", result: "Un périmètre concret", icon: "target" },
    { title: "Construire et tester", description: "Nous concevons la solution et la testons sur des cas représentatifs, y compris les erreurs et les exceptions.", result: "Une solution vérifiée avec vous", icon: "workflow" },
    { title: "Déployer et accompagner", description: "Nous mettons la solution en service, expliquons son fonctionnement et organisons le suivi selon le périmètre convenu.", result: "Une prise en main accompagnée", icon: "arrowUpRight" },
  ],
  principles: [
    { title: "Votre besoin avant l’outil", description: "Nous ciblons un problème réel et un résultat utile à votre organisation.", icon: "target" },
    { title: "Vos logiciels, autant que possible", description: "Nous privilégions vos outils existants, selon leurs possibilités d’intégration.", icon: "plug" },
    { title: "La main reste à vos équipes", description: "Les actions sensibles peuvent nécessiter une validation humaine explicite.", icon: "hand" },
    { title: "Des solutions qui se maintiennent", description: "Des règles lisibles, des erreurs identifiables et un accompagnement défini ensemble.", icon: "shield" },
  ],
  faq: [
    { question: "Mon projet ne ressemble à aucun de vos exemples. Peut-on en parler ?", answer: "Oui. Les exemples servent à vous donner des idées : ils ne constituent pas une liste fermée de prestations. Nous étudions les demandes d’automatisation, d’IA, de connexion entre logiciels et d’outils sur mesure, sans nous limiter à un secteur. Après avoir compris le besoin, nous confirmons ce qui est réalisable et ce que nous pouvons prendre en charge." },
    { question: "Je n’ai pas encore d’idée précise. Par où commencer ?", answer: "Décrivez ce que vous aimeriez améliorer : gagner du temps, mieux suivre votre activité, faciliter le travail de vos équipes ou proposer un nouveau service. Nous explorons les pistes avec vous et vérifions leur intérêt et leur faisabilité. Vous n’avez pas besoin de connaître la technologie ni d’avoir déjà défini une solution." },
    { question: "Est-ce que tout doit passer par l’IA ?", answer: "Non. Transférer une information ou déclencher un rappel peut se faire avec des règles simples. L’IA devient utile pour lire un message, repérer des informations dans un document ou préparer un texte. Nous choisissons la méthode adaptée au besoin, avec un contrôle humain lorsque le contenu ou la décision le demande." },
    { question: "Quelles tâches peut-on automatiser ?", answer: "Les tâches récurrentes qui suivent des règles identifiables : transfert de données, création de dossiers, rappels, classement de documents ou mise à jour d’un CRM. L’IA peut aider à traiter du texte ou des documents moins structurés. Nous vérifions d’abord si le processus est suffisamment clair et si l’automatisation est pertinente." },
    { question: "Faut-il changer nos logiciels existants ?", answer: "Pas nécessairement. Nous cherchons d’abord à connecter les outils que vous utilisez déjà. La faisabilité dépend de leurs API, des accès disponibles et des conditions de l’éditeur. Si une connexion n’est pas possible, nous vous présentons les options et leurs limites." },
    { question: "Faut-il des compétences techniques dans l’équipe ?", answer: "Non pour l’usage courant d’une solution conçue à cet effet. Nous prévoyons une prise en main adaptée aux utilisateurs. Les accès, les responsabilités de maintenance et les éventuelles interventions techniques sont définis au début du projet." },
    { question: "Comment est défini le budget d’un projet ?", answer: "Le budget dépend du nombre d’outils, de la complexité des règles, du volume à traiter et du niveau de suivi attendu. Nous établissons une proposition après avoir cadré le besoin. Les éventuels abonnements à des services tiers sont identifiés séparément." },
    { question: "Combien de temps prend un projet ?", answer: "Le calendrier dépend du périmètre, de la disponibilité des accès et des validations nécessaires. Nous le précisons après l’analyse du besoin. Commencer par un processus bien délimité permet d’avancer par étapes et de vérifier l’utilité de la solution." },
    { question: "Proposez-vous une maintenance ?", answer: "Oui, un accompagnement peut être prévu pour surveiller les scénarios, traiter les anomalies et faire évoluer les automatisations. Le périmètre, les modalités d’intervention et les conditions sont précisés dans la proposition." },
    { question: "Comment sont protégées les données ?", answer: "Nous examinons les données nécessaires, les accès, l’hébergement et les prestataires avant la mise en place. Nous privilégions les accès limités et les données utiles au traitement. Les choix de sécurité, de conservation et de transfert sont documentés pour chaque projet ; ils dépendent aussi des outils retenus." },
    { question: "Peut-on commencer par un petit projet ?", answer: "Oui. Un premier processus bien défini permet de tester la solution dans votre contexte, de recueillir les retours de l’équipe et de décider ensuite de la suite. Il n’est pas nécessaire de transformer toute votre organisation d’un seul coup." },
  ],
};

export function legalMissingFields(): string[] {
  const fields = ["legalName", "legalForm", "address", "siren", "registration", "publicationDirector", "hostName", "hostAddress", "hostPhone", "privacyEmail", "requestRetention", "technicalLogRetention", "processors", "internationalTransfers", "updatedAt"] as const;
  return fields.filter((field) => !siteConfig.legal[field].trim());
}

export function legalReady(): boolean {
  return siteConfig.legal.validated && legalMissingFields().length === 0 && !!siteConfig.contact.email;
}

export function isIndexable(): boolean {
  return process.env.SITE_INDEXABLE === "true" && !!siteConfig.url && legalReady();
}
