export type WorkflowStep = { scene:number; review:boolean; title:string; verb:string; icon:string; description:string; system:string; fields:{label:string;value:string}[] };
export type WorkflowScenario = {id:string;label:string;icon:string;subtitle:string;benefit:string;approval:string;complete:string;reviewLabel?:string;steps:WorkflowStep[]};
function scenario(id:string,label:string,icon:string,subtitle:string,benefit:string,complete:string,rows:[string,string,string][]):WorkflowScenario {
 return {id,label,icon,subtitle,benefit,complete,approval:id==="demande"?"Valider et envoyer le devis":id==="chatbot"?"Valider la réponse": "Valider et continuer",reviewLabel:id==="demande"?"Relire le devis avant envoi":id==="facture"?"Vérifier les données avant classement":undefined,steps:rows.map(([title,verb,description],i)=>({scene:i,review:i===4,title,verb,description,icon:i===4?"hand":icon,system:title,fields:[]})).filter(step=>!step.review||id==="demande"||id==="facture")};
}
export const workflows:WorkflowScenario[] = [
 scenario("demande","Demande de devis","mail","Un email reçu. Un devis prêt à partir.","Répondre avant qu’un prospect ne passe à la concurrence.","Le devis est dans la boîte du client.",[
 ["La demande arrive dans votre boîte mail","Recevoir","Un prospect veut faire nettoyer ses bureaux. Le message arrive dans votre boîte habituelle."],
 ["Le bon besoin est repéré","Comprendre","Les mots « demande de devis » déclenchent le transfert vers l’agent chargé des devis."],
 ["L’agent devis relève les informations utiles","Préparer","Surface, fréquence, lieu et date : le devis est préparé à partir du mail et d’une grille tarifaire définie."],
 ["Le devis se remplit","Chiffrer","Les lignes et les montants sont calculés. Les conditions proviennent du modèle de l’entreprise."],
 ["Validation humaine","Vérifier","Vous vérifiez le tarif, le périmètre et le destinataire avant d’autoriser l’envoi."],
 ["Le devis est envoyé","Envoyer","Le client reçoit son devis en pièce jointe. Une tâche de suivi est créée pour votre équipe."],
 ]),
 scenario("telephone","Accueil téléphonique","phone","Un client appelle. Il obtient des réponses.","Prendre en charge une demande même quand votre équipe est occupée.","Le client a ses réponses et son récapitulatif.",[
 ["Un appel arrive pendant votre intervention","Décrocher","L’assistant se présente et répond à une première question sur vos prestations."],
 ["Le client précise son besoin","Échanger","La conversation continue : surface, fréquence et localisation. Le client n’a pas à rappeler pour tout expliquer."],
 ["L’assistant répond aux questions pratiques","Renseigner","Il consulte les horaires et prestations de l’entreprise pour répondre sur le samedi et les produits inclus."],
 ["Le client demande les informations par mail","Récapituler","L’assistant demande son adresse email, la fait confirmer et prépare un récapitulatif de la conversation."],
 ["Validation humaine","Vérifier","Le récapitulatif attend votre accord dans ce mode. Sans ce contrôle, il suit les règles d’envoi définies."],
 ["Les informations partent par mail","Envoyer","Le mail reprend le besoin et les informations demandées. L’équipe retrouve le contexte pour préparer un devis."],
 ]),
 scenario("facture","Facture reçue","document","Une facture lue, puis rangée au bon endroit.","Réduire la saisie comptable et le temps passé à chercher les pièces.","La facture est classée, son écriture préparée.",[
 ["La facture arrive en pièce jointe","Recevoir","Un fournisseur envoie une facture PDF. Le document reste visible pendant la lecture."],
 ["Les données sont repérées sur la facture","Lire","Fournisseur, numéro, date et montants sont surlignés, puis rapprochés des champs de suivi."],
 ["Les montants et les doublons sont contrôlés","Contrôler","Le total HT plus la TVA doit correspondre au TTC. La référence est comparée au registre des factures."],
 ["Le dossier de comptabilité est choisi","Orienter","Les dossiers sans rapport sont écartés. L’année, le mois et le fournisseur déterminent la destination."],
 ["Validation humaine","Vérifier","Vous pouvez vérifier la lecture et le dossier avant le classement. Aucun paiement n’est déclenché."],
 ["Le fichier rejoint le bon dossier","Classer","La facture est renommée et rangée dans Comptabilité / 2026 / Novembre / Fournisseurs. Le suivi est mis à jour."],
 ]),
 scenario("suivi","Relance de devis","users","Un devis oublié devient une conversation.","Réactiver les opportunités déjà présentes dans votre suivi commercial.","Le prospect a répondu. Le prochain rappel est prévu.",[
 ["Un devis attend une réponse depuis huit jours","Repérer","Le dossier ressort automatiquement, sans fouiller les emails ou le tableur."],
 ["Les conditions de relance sont vérifiées","Vérifier","Le prospect n’a ni répondu ni demandé de suspendre les échanges. L’historique du devis est retrouvé."],
 ["Le prospect est contacté","Contacter","Un email ou un appel reprend le devis envoyé et propose un échange avec le commercial."],
 ["Le prospect répond","Réponse","Le prospect demande à être rappelé vendredi à 14 h. La demande est rattachée à son dossier."],
 ["Validation humaine","Autoriser","Le commercial peut valider la relance avant l’envoi ou l’appel. Les règles de contact restent définies par l’entreprise."],
 ["Le rappel est enregistré","Planifier","Le prospect demande un rappel vendredi à 14 h. Le dossier et la tâche du commercial sont mis à jour."],
 ]),
 scenario("chatbot","Service client","spark","Une vraie demande. Une réponse qui fait avancer.","Résoudre les demandes courantes et transmettre les situations délicates avec leur contexte.","La demande est prise en charge.",[
 ["Le client ouvre la discussion","Accueillir","Choisissez une situation dans la fenêtre de discussion : colis, retour ou client mécontent."],
 ["L’assistant demande ce qui manque","Préciser","Une référence de suivi, un numéro de commande ou un contact : il pose une question utile à la suite."],
 ["Les bonnes sources sont consultées","Rechercher","Le suivi transporteur ou les règles de retour sont recherchés. Une insatisfaction peut déclencher un transfert humain."],
 ["Une réponse concrète est préparée","Répondre","Le client obtient un statut précis, une marche à suivre ou la confirmation d’une reprise par un conseiller."],
 ["Validation humaine","Vérifier","Ce mode permet de relire la réponse. Le transfert à un conseiller reste possible même sans validation systématique."],
 ["La conversation avance jusqu’à une solution","Résoudre","La suite tient compte du besoin : suivre le colis, demander un retour ou passer la main à un conseiller."],
 ]),
 scenario("integration","Commande e-commerce","plug","Une vente. Le stock, le client et l’expédition à jour.","Éviter de recopier chaque commande dans trois logiciels.","La commande est prête à être expédiée.",[
 ["Deux lampes sont commandées sur la boutique","Vendre","Emma commande deux lampes de bureau. Une seule commande doit alimenter le suivi client, le stock et la préparation."],
 ["La fiche client est retrouvée","Client","L’adresse email permet de retrouver le bon client et d’ajouter la commande à son historique, sans créer de doublon."],
 ["Le stock passe de 24 à 22 lampes","Stock","Les deux articles commandés sont réservés dans l’outil de gestion."],
 ["Le bon de préparation se remplit","Préparer","L’équipe retrouve le produit, la quantité et la destination. Aucune nouvelle saisie de la commande."],
 ["Validation humaine","Vérifier","Un collaborateur peut contrôler la préparation avant le lancement de l’expédition."],
 ["Le suivi repart dans les bons outils","Expédier","La référence de colis rejoint la commande, la fiche client et l’email de confirmation."],
 ]),
 scenario("application","Votre application","phone","Votre application prend une photo. Cognalys l’analyse.","Ajouter une fonctionnalité utile à votre application sans construire tout le traitement vous-même.","L’application affiche le résultat reçu.",[
 ["L’utilisateur prend une photo dans votre app","Photographier","Deux exemples de fonctionnalités : reconnaître une plante ou repérer des dégradations sur un état des lieux."],
 ["L’application transmet la photo à Cognalys","Transmettre","Votre application envoie la photo et le type de résultat attendu au service prévu pour votre projet."],
 ["Un traitement spécialisé analyse l’image","Analyser","Sur les serveurs Cognalys, le traitement cherche les éléments utiles à la fonctionnalité de votre application."],
 ["Une réponse structurée est préparée","Structurer","Le résultat prend la forme de données que votre application peut afficher et exploiter."],
 ["Validation humaine","Vérifier","Un contrôle peut être prévu selon les usages. Pour une réponse instantanée sans validation systématique, désactivez l’interrupteur."],
 ["Le résultat s’affiche dans votre application","Afficher","L’utilisateur reste dans votre interface. Vous choisissez le parcours, le traitement et les informations présentées."],
 ]),
];

export function workflowSteps(item:WorkflowScenario,reviewEnabled:boolean):WorkflowStep[]{return item.steps.filter(step=>!step.review||reviewEnabled);}
export function workflowPlan(item:WorkflowScenario,reviewEnabled:boolean){const steps=workflowSteps(item,reviewEnabled);const review=steps.findIndex(step=>step.review);return {stepCount:steps.length,approvalStep:review<0?null:review};}
