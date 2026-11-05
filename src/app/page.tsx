import type { Metadata } from "next";
import { siteConfig, legalReady } from "@/config/site";
import { contactMode } from "@/lib/contact-handler";
import { HeroFlow } from "@/components/hero-flow";
import { Possibilities } from "@/components/possibilities";
import { Icon } from "@/components/icon";
import { WorkflowDemo } from "@/components/workflow-demo";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = { ...(siteConfig.url ? { alternates: { canonical: siteConfig.url } } : {}) };

export default function Home() {
  const booking = siteConfig.bookingUrl;
  const schema = { "@context": "https://schema.org", "@type": "Organization", name: siteConfig.name, description: siteConfig.description, ...(siteConfig.url ? { url: siteConfig.url, logo: `${siteConfig.url}/wordmark.svg` } : {}), ...(siteConfig.contact.email ? { email: siteConfig.contact.email } : {}), ...(siteConfig.socials.length ? { sameAs: siteConfig.socials.map(item => item.url) } : {}) };

  return <main id="contenu">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
    <section className="hero" aria-labelledby="hero-heading">
      <div className="shell hero-layout"><div className="hero-copy">
        <p className="eyebrow hero-eyebrow"><span className="tiny-dot" />{siteConfig.hero.eyebrow}</p>
        <h1 id="hero-heading">{siteConfig.hero.title}<br /><span>{siteConfig.hero.accent}</span></h1>
        <p className="hero-description">{siteConfig.hero.description}</p>
        <div className="hero-actions"><a className="button button-cyan" href="#contact">{siteConfig.hero.primaryCta}<Icon name="arrowUpRight" /></a><a className="text-link" href="#demonstration">{siteConfig.hero.secondaryCta}<Icon name="arrow" /></a></div>
        <p className="hero-note"><span className="note-line" />{siteConfig.hero.note}</p>
      </div><HeroFlow /></div>
      <div className="shell benefit-strip"><span>Votre besoin, notre point de départ.</span><p><Icon name="workflow" /> Automatisation</p><p><Icon name="spark" /> Intelligence artificielle</p><p><Icon name="plug" /> Outils sur mesure</p></div>
    </section>

    <section id="demonstration" className="section demo-section" aria-labelledby="demo-heading"><div className="shell">
      <div className="section-intro"><div><p className="eyebrow"><span className="section-number">01</span> ESSAYEZ PAR VOUS-MÊME</p><h2 id="demo-heading">Voyez ce que votre entreprise<br /><span className="accent">pourrait déléguer.</span></h2></div><p>Chatbot, accueil téléphonique, devis, factures… Choisissez un cas et découvrez chaque étape à votre rythme. Avec ou sans validation humaine : à vous de choisir.</p></div>
      <WorkflowDemo />
    </div></section>

    <section id="solutions" className="section possibilities-section" aria-labelledby="solutions-heading"><div className="shell">
      <div className="section-intro"><div><p className="eyebrow"><span className="section-number">02</span> QUELQUES IDÉES POUR VOUS PROJETER</p><h2 id="solutions-heading">Imaginez ce qui devient<br /><span className="accent">possible pour vous.</span></h2></div><p>Voici quelques possibilités pour vous inspirer. Choisissez un exemple et découvrez comment une solution peut répondre à un besoin concret. Votre projet peut être complètement différent.</p></div>
      <Possibilities />
      <div className="possibilities-invitation"><Icon name="spark" /><p><strong>Votre projet ne ressemble à aucun de ces exemples ?</strong> Notre offre ne se limite pas à cette liste. Présentez-nous votre idée : nous en étudierons les possibilités avec vous.</p><a className="text-link" href="#contact">Présentez-nous votre projet<Icon name="arrowUpRight" /></a></div>
    </div></section>

    <section id="methode" className="section method-section" aria-labelledby="method-heading"><div className="shell">
      <div className="section-intro"><div><p className="eyebrow"><span className="section-number">03</span> ON COMMENCE PAR VOTRE OBJECTIF</p><h2 id="method-heading">Pas besoin d’être expert.<br />On vous accompagne.</h2></div><p>Vous connaissez votre métier. Nous vous aidons à préciser votre besoin et à étudier les options, puis nous construisons et testons la solution retenue avec vous.</p></div>
      <ol className="method-grid">{siteConfig.method.map((item, index) => <li key={item.title}><div className="method-index"><span>0{index + 1}</span><Icon name={item.icon} /></div><h3>{item.title}</h3><p>{item.description}</p><div className="method-result"><Icon name="check" />{item.result}</div></li>)}</ol>
    </div></section>

    <section className="section principles-section" aria-labelledby="principles-heading"><div className="shell principles-layout">
      <div className="principles-copy"><p className="eyebrow"><span className="section-number">04</span> UNE AIDE, PAS UNE BOÎTE NOIRE</p><h2 id="principles-heading">Les tâches avancent.<br /><span className="accent">Les décisions<br />restent les vôtres.</span></h2><p>Une solution utile respecte votre organisation. Elle reste compréhensible, contrôlable et capable d’évoluer.</p></div>
      <div className="principles-list">{siteConfig.principles.map(item => <article key={item.title}><span className="principle-icon"><Icon name={item.icon} /></span><div><h3>{item.title}</h3><p>{item.description}</p></div></article>)}</div>
    </div></section>

    <section id="faq" className="section faq-section" aria-labelledby="faq-heading"><div className="shell faq-layout"><div><p className="eyebrow"><span className="section-number">05</span> QUESTIONS FRÉQUENTES</p><h2 id="faq-heading">Les bonnes<br />questions.<br /><span className="muted">Des réponses claires.</span></h2><a href="#contact" className="text-link">Parlons de votre situation<Icon name="arrowUpRight" /></a></div><div className="faq-list">{siteConfig.faq.map((item, index) => <details className="faq-item" name="faq" key={item.question}><summary><span className="faq-number">{String(index + 1).padStart(2, "0")}</span><span>{item.question}</span><Icon name="plus" /></summary><div className="faq-answer"><p>{item.answer}</p></div></details>)}</div></div></section>

    <section id="contact" className="section contact-section light-section" aria-labelledby="contact-heading"><div className="shell contact-layout"><div className="contact-copy"><p className="eyebrow"><span className="section-number">06</span> VOTRE PREMIÈRE IDÉE COMMENCE ICI</p><h2 id="contact-heading">{siteConfig.form.title}</h2><p className="contact-lead">{siteConfig.form.description}</p><div className="contact-expect"><h3>Lors du premier échange</h3><ul><li><Icon name="check" />Vous nous présentez votre idée ou votre besoin.</li><li><Icon name="check" />Nous examinons vos objectifs, vos outils et vos contraintes.</li><li><Icon name="check" />Nous définissons ce qu’il faut étudier pour avancer.</li></ul></div>{booking && <a className="booking-card" href={booking} target="_blank" rel="noopener noreferrer"><Icon name="calendar" /><span>Vous préférez choisir un créneau ?<strong>Réserver un échange</strong></span><Icon name="arrowUpRight" /></a>}<div className="contact-direct">{siteConfig.contact.email && <a href={`mailto:${siteConfig.contact.email}`}><Icon name="mail" />{siteConfig.contact.email}</a>}{siteConfig.contact.phone && <a href={`tel:${siteConfig.contact.phoneHref}`}>{siteConfig.contact.phone}</a>}</div><p className="contact-note">Une idée, un besoin, une question.<br /><strong>Le projet commence par un échange.</strong></p></div><ContactForm initialMode={process.env.NEXT_PUBLIC_STATIC_EXPORT === "true" ? "unavailable" : contactMode(process.env, legalReady())} /></div></section>
  </main>;
}
