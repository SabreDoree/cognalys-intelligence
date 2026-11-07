import type { Metadata } from "next";
import { siteConfig, legalReady } from "@/config/site";
import { contactMode } from "@/lib/contact-handler";
import { Icon } from "@/components/icon";
import { IntegrationBand } from "@/components/integration-band";
import { ExistingTools } from "@/components/existing-tools";
import { WorkflowDemo } from "@/components/workflow-demo";
import { CostCalculator } from "@/components/cost-calculator";
import { ContactForm } from "@/components/contact-form";
import { LandingHero } from "@/components/landing-hero";
import { RealisationPreview } from "@/components/realisation-preview";
export const metadata:Metadata={...(siteConfig.url?{alternates:{canonical:siteConfig.url}}:{})};
const benefits=[
 {icon:"mail",title:"Plus de demandes traitées",text:"Devis, appels et questions clients pris en charge."},
 {icon:"users",title:"Des prospects suivis",text:"Relances et rappels sans dossiers oubliés."},
 {icon:"document",title:"Moins de saisie",text:"Documents lus, données reprises et fichiers classés."},
 {icon:"plug",title:"Votre besoin sur mesure",text:"Logiciels connectés et fonctionnalités pour vos applications."},
];
const method=["Comprendre votre besoin","Définir le périmètre et le prix","Construire et tester","Déployer et accompagner"];
const faqIndexes=[0,2,4,6,7,8,9];
export default function Home(){
 const schema={"@context":"https://schema.org","@type":"Organization",name:siteConfig.name,description:siteConfig.description,...(siteConfig.url?{url:siteConfig.url,logo:`${siteConfig.url}/wordmark.svg`}:{}),...(siteConfig.contact.email?{email:siteConfig.contact.email}:{})};
 return <main id="contenu" className="home-compact"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,"\\u003c")}}/>
  <LandingHero/>
  <section id="demonstration" className="compact-demo-section" aria-labelledby="demo-heading"><div className="shell"><div className="compact-section-heading"><h2 id="demo-heading">Essayez sur un cas concret.</h2><p>Choisissez un cas. Regardez le résultat.</p></div><WorkflowDemo/></div></section>
  <ExistingTools/>
  <IntegrationBand/>
  <RealisationPreview/>
  <section id="solutions" className="compact-section shell" aria-labelledby="solutions-heading"><h2 id="solutions-heading">Ce que vous pouvez y gagner.</h2><div className="compact-benefits">{benefits.map(item=><article key={item.title}><Icon name={item.icon}/><h3>{item.title}</h3><p>{item.text}</p></article>)}</div><p className="compact-invitation">Un autre besoin ? <a href="#contact">Nous étudions aussi les projets hors de ces exemples.<Icon name="arrowUpRight"/></a></p></section>
  <CostCalculator/>
  <section id="methode" className="compact-method compact-section" aria-labelledby="method-heading"><div className="shell"><h2 id="method-heading">Du besoin à la mise en service.</h2><ol>{method.map((text,index)=><li key={text}><span>{index+1}</span>{text}</li>)}</ol></div></section>
  <section id="a-propos" className="compact-section shell compact-about" aria-labelledby="about-heading"><div><span className="about-label">À PROPOS DE COGNALYS</span><h2 id="about-heading">Des outils conçus pour votre quotidien.</h2></div><div><p>Cognalys Intelligence conçoit des automatisations, connecte les logiciels métier et crée des outils sur mesure pour les entreprises. Chaque projet part d’un besoin concret : traiter des demandes, préparer des documents ou organiser le suivi commercial.</p><a className="text-link" href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}<Icon name="arrowUpRight" /></a></div></section>
  <section id="faq" className="compact-section shell compact-faq" aria-labelledby="faq-heading"><h2 id="faq-heading">Les réponses utiles.</h2><div className="faq-list">{faqIndexes.map(index=>siteConfig.faq[index]).map(item=><details className="faq-item" name="faq" key={item.question}><summary><span>{item.question}</span><Icon name="plus"/></summary><div className="faq-answer"><p>{item.answer}</p></div></details>)}</div></section>
  <section id="contact" className="contact-section compact-section light-section" aria-labelledby="contact-heading"><div className="shell compact-contact"><div><h2 id="contact-heading">Quel travail voulez-vous simplifier ?</h2><p>Décrivez votre besoin. Nous étudions les possibilités et le périmètre du projet.</p>{siteConfig.contact.email&&<a className="text-link" href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>}{siteConfig.bookingUrl&&<a className="text-link" href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer">Choisir un créneau<Icon name="calendar"/></a>}</div><ContactForm formspreeEndpoint={siteConfig.form.formspreeEndpoint} initialMode={process.env.NEXT_PUBLIC_STATIC_EXPORT==="true"?"unavailable":contactMode(process.env,legalReady())}/></div></section>
 </main>;
}
