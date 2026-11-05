"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./icon";
import { IntegrationCircuit } from "./integration-circuit";
import styles from "./existing-tools.module.css";

const assetPath = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/integrations`;
const exampleDuration = 7200;

const examples = [
  {
    from: { id: "wordpress", name: "WordPress" }, to: { id: "hubspot", name: "HubSpot" },
    title: "Du formulaire à la fiche contact",
    description: "Une demande reçue sur WordPress crée une fiche prospect dans HubSpot.",
  },
  {
    from: { id: "shopify", name: "Shopify" }, to: { id: "sage", name: "Sage" },
    title: "De la commande à la comptabilité",
    description: "Une commande passée sur Shopify alimente le journal des ventes dans Sage.",
  },
  {
    from: { id: "google-workspace", name: "Google Workspace" }, to: { id: "salesforce", name: "Salesforce" },
    title: "De l’agenda au suivi client",
    description: "Un rendez-vous de Google Agenda s’ajoute à la fiche du client dans Salesforce.",
  },
  {
    from: { id: "cegid", name: "Cegid" }, to: { id: "microsoft-365", name: "Microsoft 365" },
    title: "De la facture au dossier partagé",
    description: "Une facture validée dans Cegid est classée dans un dossier OneDrive de Microsoft 365.",
  },
  {
    from: { id: "sap", name: "SAP" }, to: { id: "brevo", name: "Brevo" },
    title: "De l’expédition au message de suivi",
    description: "Une expédition enregistrée dans SAP déclenche l’envoi d’un e-mail de suivi via Brevo.",
  },
];

export function ExistingTools() {
  const figure = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [playback, setPlayback] = useState<"auto" | "paused" | "once">("auto");
  const autoPlay = playback === "auto";
  const [motionAvailable, setMotionAvailable] = useState(false);
  const running = autoPlay && motionAvailable;
  const current = examples[active];

  useEffect(() => {
    const element = figure.current;
    if (!element) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = false;
    const update = () => setMotionAvailable(inView && !document.hidden && !motion.matches);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    observer.observe(element);
    motion.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setActive(index => (index + 1) % examples.length), exampleDuration);
    return () => window.clearInterval(timer);
  }, [running]);

  function selectExample(index: number) {
    setPlayback("once");
    setActive(index);
  }

  return <section id="outils" className={`shell ${styles.section}`} aria-labelledby="existing-tools-heading">
    <div className={styles.copy}>
      <p className={styles.eyebrow}>Intégrations</p>
      <h2 id="existing-tools-heading">Gardez vos outils.{" "}<span>Nous les faisons travailler ensemble.</span></h2>
      <p className={styles.intro}>Nous relions votre site, votre messagerie et vos logiciels métier. Votre équipe retrouve chaque information dans l’outil qu’elle utilise déjà.</p>
      <p className={styles.note}>Nous vérifions les connexions possibles selon votre abonnement et les accès fournis par chaque éditeur.</p>
    </div>
    <figure className={styles.figure} ref={figure} data-motion={motionAvailable ? playback : "paused"} aria-label="Exemples de connexions entre logiciels">
      <div className={styles.boardHeader}>
        <span className={styles.boardTitle}><Icon name="workflow" />Connexions possibles</span>
        <div className={styles.controls}>
          <button type="button" className={styles.play} aria-label={autoPlay ? "Mettre les exemples en pause" : "Reprendre la lecture des exemples"} onClick={() => setPlayback(autoPlay ? "paused" : "auto")}>
            <Icon name={autoPlay ? "pause" : "play"} /><span>{autoPlay ? "Pause" : "Lecture"}</span>
          </button>
          <button type="button" aria-label="Exemple suivant" onClick={() => selectExample((active + 1) % examples.length)}><Icon name="arrow" /></button>
        </div>
      </div>
      <div className={styles.field}>
        <div className={styles.stage}>
          <IntegrationCircuit active={active} count={examples.length} stacked={false} hubUrl={`${assetPath}/cognalys-hub.svg`} />
          <IntegrationCircuit active={active} count={examples.length} stacked hubUrl={`${assetPath}/cognalys-hub.svg`} />
          {(["from", "to"] as const).map(side => (
            <div key={side} className={`${styles.bank} ${side === "from" ? styles.input : styles.output}`} role="group" aria-label={side === "from" ? "Outils de départ" : "Outils de destination"}>
              {examples.map((example, index) => {
                const tool = example[side];
                const other = side === "from" ? example.to : example.from;
                return <button type="button" key={tool.id} className={styles.brand} aria-pressed={active === index}
                  aria-label={`${tool.name}, afficher l’exemple avec ${other.name}`} aria-controls="integration-example"
                  onClick={() => selectExample(index)}>
                  <span className={styles.mark} data-brand={tool.id}>
                    <Image src={`${assetPath}/${tool.id}.svg`} alt="" width={40} height={40} unoptimized />
                  </span>
                  <span className={styles.brandName}>{tool.name}</span>
                </button>;
              })}
            </div>
          ))}
        </div>
      </div>
      <figcaption id="integration-example" className={styles.caption} aria-live={running ? "off" : "polite"} aria-atomic="true">
        <div><strong>{current.title}</strong><p>{current.description}</p></div>
        <div className={styles.steps} aria-hidden="true">{examples.map((item, index) => <i key={item.from.id} data-active={index === active} />)}</div>
      </figcaption>
    </figure>
  </section>;
}
