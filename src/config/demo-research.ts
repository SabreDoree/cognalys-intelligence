export type DemoSource = { name: string; kind: string; result: string };
export function demoResearch(id: string, step: number, question: string): DemoSource[] {
  if (id === "chatbot" && step === 2) return question === "retour" ? [
    {name:"Base de connaissances",kind:"Documentation interne",result:"Procédure de retour retrouvée"},
    {name:"Conditions commerciales",kind:"Règles de l’entreprise",result:"Conditions applicables rapprochées"},
    {name:"Passage utile",kind:"Source de la réponse",result:"Contacter le support avec la référence de commande"},
  ] : [
    {name:"Base de connaissances",kind:"Documentation interne",result:"Guide de livraison retrouvé"},
    {name:"FAQ commandes",kind:"Questions fréquentes",result:"Rubrique « Suivre ma commande » sélectionnée"},
    {name:"Passage utile",kind:"Source de la réponse",result:"Lien de suivi dans l’email de confirmation"},
  ];
  const sources: Record<string, {step: number; rows: DemoSource[]}> = {
    facture:{step:2,rows:[{name:"Registre des factures",kind:"Base de données",result:"Référence EXEMPLE-001 recherchée"},{name:"Historique fournisseur",kind:"Documents archivés",result:"Numéro et fournisseur comparés"},{name:"Résultat",kind:"Contrôle illustratif",result:"Aucun doublon dans cet exemple"}]},
    suivi:{step:2,rows:[{name:"Fiche prospect",kind:"CRM",result:"Dernière proposition retrouvée"},{name:"Historique des échanges",kind:"Messagerie autorisée",result:"Contexte utile rassemblé"},{name:"Règles commerciales",kind:"Consignes internes",result:"Cadence et modèle de relance sélectionnés"}]},
    integration:{step:1,rows:[{name:"Catalogue produits",kind:"Base de données",result:"Références de la commande recherchées"},{name:"Outil de gestion",kind:"Logiciel connecté",result:"Correspondances des articles retrouvées"},{name:"Contrôle des quantités",kind:"Règle de gestion",result:"Trois lignes rapprochées"}]},
    rapport:{step:1,rows:[{name:"Ventes",kind:"Base de données",result:"Données de la semaine regroupées"},{name:"Demandes clients",kind:"CRM",result:"Dossiers en attente identifiés"},{name:"Planning",kind:"Outil interne",result:"Prochaines échéances récupérées"}]},
  };
  const entry = sources[id];
  return entry?.step === step ? entry.rows : [];
}
