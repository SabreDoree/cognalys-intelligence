// Toutes les personnes, pièces, tarifs, politiques et réponses ci-dessous sont fictifs.
export const quoteExample = { reference:"DEV-2026-1045", company:"Bureaux Horizon", email:"camille@horizon.example", surface:120, visits:2, weeks:4, pricePerVisit:48, vatRate:.2, start:"16 novembre 2026", city:"Strasbourg" };
export const quoteNet = quoteExample.visits * quoteExample.weeks * quoteExample.pricePerVisit;
export const quoteVat = Math.round(quoteNet * quoteExample.vatRate * 100) / 100;
export const invoiceExample = {vendor:"Atelier Propreté",reference:"FAC-2026-118",date:"03/11/2026",net:240,vat:48,total:288,filename:"2026-11-03_Atelier-Proprete_FAC-2026-118.pdf",folder:"Comptabilité / 2026 / Novembre / Fournisseurs"};
export const orderExample = {reference:"CMD-1042",name:"Emma Martin",email:"emma@client.example",product:"Lampe de bureau",quantity:2,unitNet:39,vatRate:.2,stock:24,tracking:"CC-1042-STR"};
export const carrierExample = {reference:"CC-784219",carrier:"Colis & Co · transporteur fictif",status:"En cours de livraison",event:"Arrivé à l’agence de Strasbourg · 08:42",delivery:"Aujourd’hui entre 14 h et 18 h"};
export type ChatTopic = "suivi" | "retour" | "urgence";
export const upsetMessage = "C’est inadmissible, j’attends depuis dix jours ! Personne ne me répond. Je veux parler à un responsable maintenant.";
export const urgencySignals = ["C’est inadmissible", "depuis dix jours", "Personne ne me répond", "un responsable maintenant"];
export const money = (value:number) => new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR"}).format(value);
