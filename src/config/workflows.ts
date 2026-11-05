export type WorkflowStep = {
  title: string;
  verb: string;
  icon: string;
  description: string;
  system: string;
  fields: { label: string; value: string }[];
};
export type WorkflowScenario = {
  id: string;
  label: string;
  icon: string;
  subtitle: string;
  approval: string;
  complete: string;
  steps: WorkflowStep[];
};

export const workflows: WorkflowScenario[] = [
  {
    id: "demande", label: "Demande client", icon: "mail", subtitle: "De l’email reçu au suivi programmé.", approval: "Valider la proposition", complete: "Le dossier est prêt. Le suivi est programmé.",
    steps: [
      { title: "Demande reçue", verb: "Réception", icon: "mail", description: "Une demande arrive dans votre boîte email. Elle déclenche le processus selon les règles définies.", system: "Boîte de réception", fields: [{ label: "De", value: "Bureaux Horizon · entreprise fictive" }, { label: "Objet", value: "Devis pour le nettoyage de nos bureaux" }, { label: "Message", value: "Bonjour, nous souhaitons un devis pour le nettoyage de nos bureaux, deux fois par semaine." }] },
      { title: "Informations analysées", verb: "Analyse", icon: "spark", description: "Les informations utiles sont repérées. Un dossier incomplet peut être orienté vers une vérification humaine.", system: "Analyse de la demande", fields: [{ label: "Type de besoin", value: "Nettoyage de bureaux · deux passages par semaine" }, { label: "Organisation", value: "Bureaux Horizon" }, { label: "Prochaine action", value: "Préparer le dossier commercial" }] },
      { title: "Fiche client créée", verb: "Organisation", icon: "users", description: "Le dossier est créé ou mis à jour. Une vérification préalable permet de limiter les doublons.", system: "Votre suivi client", fields: [{ label: "Fiche", value: "Bureaux Horizon" }, { label: "Statut", value: "Nouvelle demande" }, { label: "Responsable", value: "Équipe commerciale" }] },
      { title: "Proposition préparée", verb: "Préparation", icon: "document", description: "Un brouillon est préparé à partir de vos modèles et de vos règles. Il reste en attente de contrôle.", system: "Espace documentaire", fields: [{ label: "Document", value: "Brouillon de proposition" }, { label: "Contenu", value: "Besoin identifié et prochaines étapes" }, { label: "Envoi", value: "Bloqué en attente de validation" }] },
      { title: "Validation humaine", verb: "À vous de jouer", icon: "hand", description: "Un collaborateur vérifie le contenu et autorise la suite. L’automatisation attend sa décision.", system: "Point de contrôle", fields: [{ label: "À vérifier", value: "Périmètre, contenu et destinataire" }, { label: "Décision attendue", value: "Validation du collaborateur" }, { label: "Règle", value: "Aucune suite sans votre accord" }] },
      { title: "Suivi programmé", verb: "Suivi", icon: "calendar", description: "Après validation, une tâche de suivi est planifiée selon vos règles. Le statut du dossier est mis à jour.", system: "Votre outil de suivi", fields: [{ label: "Dossier", value: "Proposition validée" }, { label: "Action", value: "Suivi commercial à planifier" }, { label: "Échéance", value: "Selon vos règles internes" }] },
    ],
  },
  {
    id: "facture", label: "Facture reçue", icon: "document", subtitle: "Du document reçu au classement contrôlé.", approval: "Valider les informations", complete: "Les informations sont vérifiées. La facture est classée.",
    steps: [
      { title: "Document reçu", verb: "Réception", icon: "mail", description: "Une facture arrive par email ou dans un dossier partagé.", system: "Dossier de réception", fields: [{ label: "Document", value: "Facture-exemple.pdf" }, { label: "Origine", value: "Fournisseur fictif" }, { label: "Action", value: "Début du traitement" }] },
      { title: "Données extraites", verb: "Extraction", icon: "spark", description: "Le numéro, la date et les montants sont extraits. La lecture automatique peut nécessiter une correction.", system: "Lecture du document", fields: [{ label: "Numéro", value: "EXEMPLE-001" }, { label: "Montant", value: "À contrôler sur le document" }, { label: "Données", value: "Préparées pour vérification" }] },
      { title: "Doublons vérifiés", verb: "Vérification", icon: "search", description: "La référence est comparée aux documents déjà traités pour repérer un éventuel doublon.", system: "Registre documentaire", fields: [{ label: "Référence", value: "EXEMPLE-001" }, { label: "Comparaison", value: "Numéro et fournisseur" }, { label: "Résultat illustratif", value: "Aucun doublon trouvé" }] },
      { title: "Fiche préparée", verb: "Préparation", icon: "document", description: "Une fiche de traitement regroupe le document source et les informations extraites.", system: "Espace de contrôle", fields: [{ label: "Pièce jointe", value: "Document source conservé" }, { label: "Fiche", value: "Brouillon à vérifier" }, { label: "Paiement", value: "Non déclenché par ce scénario" }] },
      { title: "Validation humaine", verb: "À vous de jouer", icon: "hand", description: "Un collaborateur compare les données au document et valide le classement.", system: "Point de contrôle", fields: [{ label: "À vérifier", value: "Référence, date et montants" }, { label: "Décision", value: "Confirmer les informations" }, { label: "En cas d’erreur", value: "Correction avant validation" }] },
      { title: "Facture classée", verb: "Classement", icon: "check", description: "Le document validé est classé et la fiche est mise à jour. Aucun paiement n’est exécuté.", system: "Votre outil de gestion", fields: [{ label: "Document", value: "Classé selon vos règles" }, { label: "Statut", value: "Vérifié" }, { label: "Paiement", value: "Hors du périmètre de cette simulation" }] },
    ],
  },
  {
    id: "suivi", label: "Suivi commercial", icon: "users", subtitle: "D’un dossier en attente à une relance maîtrisée.", approval: "Valider le brouillon", complete: "Le brouillon est validé. Le suivi est mis à jour.",
    steps: [
      { title: "Dossier identifié", verb: "Détection", icon: "users", description: "Un dossier atteint une échéance définie dans votre outil de suivi.", system: "Votre suivi client", fields: [{ label: "Dossier", value: "Prospect fictif" }, { label: "Situation", value: "Proposition en attente" }, { label: "Échéance", value: "Selon votre cadence de suivi" }] },
      { title: "Conditions vérifiées", verb: "Vérification", icon: "search", description: "Le système vérifie l’absence de réponse, d’opposition ou de mise en pause avant de préparer une action.", system: "Règles commerciales", fields: [{ label: "Réponse reçue", value: "Non, dans cet exemple" }, { label: "Mise en pause", value: "Non" }, { label: "Opposition", value: "Non" }] },
      { title: "Contexte rassemblé", verb: "Organisation", icon: "copy", description: "Les éléments nécessaires au suivi sont regroupés depuis le dossier commercial.", system: "Historique du dossier", fields: [{ label: "Source", value: "Échanges et proposition" }, { label: "Objectif", value: "Connaître l’avancement de la décision" }, { label: "Responsable", value: "Commercial du dossier" }] },
      { title: "Brouillon préparé", verb: "Préparation", icon: "mail", description: "Une relance est préparée à partir de votre modèle et du contexte disponible.", system: "Brouillon de relance", fields: [{ label: "Message", value: "Bonjour, avez-vous pu examiner notre proposition ?" }, { label: "Personnalisation", value: "À vérifier par le commercial" }, { label: "Envoi", value: "En attente de validation" }] },
      { title: "Validation humaine", verb: "À vous de jouer", icon: "hand", description: "Le commercial vérifie le destinataire, la pertinence et le ton du message.", system: "Point de contrôle", fields: [{ label: "À vérifier", value: "Message et destinataire" }, { label: "Décision", value: "Valider le brouillon" }, { label: "Alternative", value: "Modifier ou interrompre le suivi" }] },
      { title: "Suivi mis à jour", verb: "Suivi", icon: "calendar", description: "Le dossier est actualisé et la prochaine étape est enregistrée selon les règles convenues.", system: "Votre suivi client", fields: [{ label: "Statut", value: "Brouillon validé" }, { label: "Historique", value: "Action consignée" }, { label: "Suite", value: "Selon la réponse du prospect" }] },
    ],
  },
];


// Les scénarios restent des simulations locales ; aucune API vocale ou IA appelée.
function scenario(id: string, label: string, icon: string, subtitle: string, complete: string, rows: [string, string, string, string, string][]): WorkflowScenario {
 return { id, label, icon, subtitle, complete, approval: "Valider pour continuer", steps: rows.map(([title, verb, description, system, value], index) => ({ title, verb, description, system, icon: index === 4 ? "hand" : icon, fields: [{ label: "Exemple fictif", value }, { label: "État", value: index === 4 ? "En attente de votre validation" : "Étape illustrée, sans action réelle" }] })) };
}
workflows.push(
 scenario("chatbot", "Chatbot client", "spark", "Une question client devient une réponse guidée.", "La réponse a été validée dans cette simulation.", [
 ["Question reçue", "Écouter", "Le client choisit une question fréquente dans la fenêtre de discussion.", "Conversation client", "Puis-je retourner un produit ?"],
 ["Besoin identifié", "Comprendre", "Le sujet est repéré. Une demande ambiguë serait orientée vers un conseiller.", "Orientation", "Sujet : conditions de retour"],
 ["Source retrouvée", "Rechercher", "L’assistant consulte uniquement la documentation autorisée pour ce sujet.", "Documentation fictive", "Procédure de retour · exemple pédagogique"],
 ["Réponse préparée", "Rédiger", "Une réponse accompagnée de sa source est préparée. Elle n’est pas encore diffusée.", "Brouillon", "La procédure prévoit de contacter le support avec la référence de commande."],
 ["Validation humaine", "Vérifier", "Dans cette démonstration, vérifiez la réponse et sa source avant de poursuivre.", "Contrôle du conseiller", "En production, le niveau de contrôle est défini selon les sujets et les risques."],
 ["Client orienté", "Répondre", "La réponse validée peut être présentée et le client orienté vers un conseiller si nécessaire.", "Conversation", "Aucun message réel envoyé."],
 ]),
 scenario("telephone", "Accueil téléphonique", "users", "Un appel devient une demande qualifiée, prête à rappeler.", "Le compte rendu est validé. Le rappel peut être attribué.", [
 ["Appel entrant", "Accueillir", "L’accueil vocal se présente comme automatisé. Le client peut demander un interlocuteur humain.", "Accueil vocal fictif", "Bonjour, je suis l’assistant vocal. Quel est le motif de votre appel ?"],
 ["Motif précisé", "Qualifier", "L’agent pose quelques questions utiles à l’organisation du rappel.", "Dialogue fictif", "Je souhaite un devis pour une prestation la semaine prochaine."],
 ["Informations regroupées", "Structurer", "Le motif et la disponibilité indiquée par le client sont regroupés, sans collecte excessive.", "Fiche d’appel", "Besoin : devis · Disponibilité : demain matin"],
 ["Compte rendu préparé", "Résumer", "Un résumé est préparé pour le collaborateur compétent. Aucun rendez-vous n’est confirmé automatiquement.", "Compte rendu", "Demande de devis à rappeler, créneau à confirmer."],
 ["Validation humaine", "Contrôler", "Un collaborateur vérifie le résumé et l’attribution avant de planifier la suite.", "Point de contrôle", "Vérifier les coordonnées et la disponibilité."],
 ["Rappel organisé", "Transmettre", "La demande peut être attribuée au bon interlocuteur, avec son contexte.", "Suivi de l’appel", "Simulation visuelle : aucun appel, son ni enregistrement réel."],
 ]),
 scenario("integration", "Logiciels connectés", "plug", "Une commande circule sans être recopiée partout.", "La commande validée est prête pour l’équipe.", [
 ["Commande reçue", "Recevoir", "Une commande arrive dans votre outil de vente.", "Boutique fictive", "Commande EX-042 · trois lignes"],
 ["Données rapprochées", "Comparer", "Les références sont comparées au catalogue de l’outil de gestion.", "Catalogue", "Références et quantités à vérifier"],
 ["Doublon contrôlé", "Vérifier", "L’identifiant de commande permet de rechercher un traitement déjà effectué.", "Registre", "EX-042 : nouvelle commande dans cet exemple"],
 ["Dossier préparé", "Transférer", "Une fiche est préparée dans le logiciel de gestion selon les règles choisies.", "Gestion", "Fiche en attente de validation"],
 ["Validation humaine", "Autoriser", "Un collaborateur contrôle les éventuelles différences avant d’autoriser la suite.", "Contrôle", "Quantités et correspondances vérifiées"],
 ["Équipe informée", "Notifier", "Une notification peut être préparée pour l’équipe concernée.", "Préparation", "Aucune commande réelle créée."],
 ]),
 scenario("rapport", "Bilan d’activité", "calendar", "Les chiffres se rassemblent pour préparer votre point d’équipe.", "Le bilan a été validé dans cette simulation.", [
 ["Échéance atteinte", "Démarrer", "Le créneau prévu déclenche la préparation du bilan.", "Planning", "Point hebdomadaire · exemple"],
 ["Sources consultées", "Collecter", "Les données autorisées sont récupérées dans les sources prévues.", "Sources fictives", "Ventes · demandes clients · planning"],
 ["Chiffres rapprochés", "Calculer", "Les indicateurs sont calculés selon des règles convenues.", "Tableau", "Calculs illustratifs, aucune donnée réelle"],
 ["Bilan préparé", "Synthétiser", "Un récapitulatif met en évidence les éléments à examiner.", "Brouillon de bilan", "Dossiers en attente et prochaines étapes"],
 ["Validation humaine", "Relire", "Le responsable vérifie les chiffres et la synthèse avant diffusion.", "Contrôle", "Les erreurs de source peuvent fausser le bilan."],
 ["Point d’équipe prêt", "Partager", "Le bilan validé est prêt à être partagé selon les règles définies.", "Équipe", "Aucun rapport réel transmis."],
 ]),
);
