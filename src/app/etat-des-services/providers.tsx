"use client";
import { useEffect, useState } from "react";
import styles from "./status.module.css";

const providers = [
  ["Google Workspace", "https://www.google.com/appsstatus/dashboard/", "", "google-workspace"],
  ["Google Cloud · API", "https://status.cloud.google.com/", "", ""],
  ["Microsoft 365", "https://status.cloud.microsoft/", "", "microsoft-365"],
  ["Shopify", "https://www.shopifystatus.com/", "", "shopify"],
  ["Stripe", "https://status.stripe.com/", "", "stripe"],
  ["HubSpot", "https://status.hubspot.com/", "api/v2/status.json", "hubspot"],
  ["Salesforce", "https://status.salesforce.com/", "", "salesforce"],
  ["Brevo", "https://status.brevo.com/", "", "brevo"],
  ["Slack", "https://slack-status.com/", "", "slack"],
  ["Notion", "https://www.notion-status.com/", "api/v2/status.json", "notion"],
  ["Airtable", "https://status.airtable.com/", "api/v2/status.json", "airtable"],
  ["Calendly", "https://www.calendlystatus.com/", "api/v2/status.json", "calendly"],
  ["Dropbox", "https://status.dropbox.com/", "api/v2/status.json", ""],
  ["WhatsApp Business", "https://metastatus.com/whatsapp-business-api", "", "whatsapp"],
];
const labels: Record<string,string> = { none:"Opérationnel", minor:"Perturbation partielle", major:"Incident majeur", critical:"Incident critique", maintenance:"Maintenance" };

export function Providers() {
  const [states, setStates] = useState<Record<string,string>>({});
  useEffect(() => {
    let active = true;
    async function refresh() {
      await Promise.all(providers.filter(([, , feed]) => feed).map(async ([name,url,feed]) => {
        let value = "État inconnu";
        try {
          const res = await fetch(url + feed, { cache:"no-store", signal:AbortSignal.timeout(8000) });
          if (res.ok) {
            const data = await res.json();
            const label = labels[data.status?.indicator];
            if (label) value = label + " · vérifié à " + new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"});
          }
        } catch { /* The official dashboard remains available. */ }
        if (active) setStates(prev => ({...prev,[name]:value}));
      }));
    }
    void refresh();
    const timer = window.setInterval(refresh,300000);
    return () => { active=false; window.clearInterval(timer); };
  },[]);
  return <ul className={styles.list}>{providers.map(([name,url,feed,logo]) => <li key={name}>
    <strong>{logo && <span aria-hidden="true" style={{backgroundImage:`url(${process.env.NEXT_PUBLIC_BASE_PATH || ""}/integrations/${logo}.svg)`}}/>}{name}</strong>
    <small>{feed ? states[name] ?? "Vérification en cours…" : "Statut chez le fournisseur"}</small>
    <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`Consulter le statut de ${name}`}>Statut officiel ↗</a>
  </li>)}</ul>;
}
