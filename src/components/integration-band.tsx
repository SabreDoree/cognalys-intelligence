"use client";
import Image from "next/image";
import { useState } from "react";
import styles from "./integration-band.module.css";
const rows = [
 [["google-workspace","Google Workspace"],["microsoft-365","Microsoft 365"],["salesforce","Salesforce"],["hubspot","HubSpot"],["shopify","Shopify"],["wordpress","WordPress"],["sage","Sage"],["cegid","Cegid"],["sap","SAP"],["brevo","Brevo"]],
 [["openai","OpenAI"],["anthropic","Anthropic"],["mistralai","Mistral AI"],["n8n","n8n"],["stripe","Stripe"],["notion","Notion"],["slack","Slack"],["whatsapp","WhatsApp"],["airtable","Airtable"],["calendly","Calendly"],["discord","Discord"],["woocommerce","WooCommerce"]],
];
export function IntegrationBand() {
 const [paused,setPaused]=useState(false);
 return <section className={styles.band} aria-label="Logiciels et systèmes à connecter" data-paused={paused}>
  <div className={styles.heading}><div><h3>Vos outils. Un écosystème connecté.</h3><p>CRM, comptabilité, messageries, e-commerce et IA : des connexions adaptées à votre activité.</p></div><button type="button" onClick={()=>setPaused(!paused)} aria-pressed={paused}>{paused?"Reprendre":"Mettre en pause"}<span className={styles.sr}> le défilement des logos</span></button></div>
  {rows.map((row,index)=><div className={styles.viewport} key={index}><div className={`${styles.track} ${index?styles.reverse:""}`}>{[0,1].map(copy=><ul key={copy} aria-hidden={copy===1?true:undefined}>{row.map(([id,name])=><li key={id}><Image src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/integrations/${id}.svg`} alt="" width={28} height={28} unoptimized/><span>{name}</span></li>)}</ul>)}</div></div>)}
  <p className={styles.note}>Exemples d’intégrations possibles, selon les API, vos accès et vos abonnements. Une autre solution ? Nous étudions aussi les connexions sur mesure.</p>
 </section>;
}
