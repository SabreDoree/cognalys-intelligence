import Image from "next/image";
import styles from "./integration-band.module.css";
const rows = [
 [["google-workspace","Google Workspace"],["microsoft-365","Microsoft 365"],["salesforce","Salesforce"],["hubspot","HubSpot"],["shopify","Shopify"],["wordpress","WordPress"],["sage","Sage"],["cegid","Cegid"],["sap","SAP"],["brevo","Brevo"]],
 [["openai","OpenAI"],["anthropic","Anthropic"],["mistralai","Mistral AI"],["n8n","n8n"],["stripe","Stripe"],["notion","Notion"],["slack","Slack"],["whatsapp","WhatsApp"],["airtable","Airtable"],["calendly","Calendly"],["discord","Discord"],["woocommerce","WooCommerce"]],
];
export function IntegrationBand() {
 return <section id="integrations" className={styles.band} aria-labelledby="integrations-title">
  <header className={styles.heading}><h2 id="integrations-title">Le meilleur de la technologie, <span>à vos côtés.</span></h2><p>Les outils que nous pouvons connecter à votre entreprise.</p></header>
  {rows.map((row,index)=><div className={styles.viewport} key={index}><div className={`${styles.track} ${index?styles.reverse:""}`}>{[0,1].map(copy=><ul key={copy} aria-hidden={copy===1?true:undefined}>{row.map(([id,name])=><li key={id}><Image src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/integrations/${id}.svg`} alt="" width={28} height={28} unoptimized/><span>{name}</span></li>)}</ul>)}</div></div>)}
 </section>;
}
