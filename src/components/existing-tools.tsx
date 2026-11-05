"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "./icon";
import { IntegrationCircuit, type Station } from "./integration-circuit";
import styles from "./existing-tools.module.css";

const assetPath = `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/integrations`;
const exampleDuration = 10000;

const examples = [
  {
    label: "Contacts", title: "Créer une fiche prospect",
    from: { id: "wordpress", name: "WordPress", event: "Formulaire envoyé" },
    to: { id: "hubspot", name: "HubSpot", event: "Contact créé" },
    data: "Nom, e-mail et téléphone du prospect",
  },
  {
    label: "Ventes", title: "Reporter une vente en comptabilité",
    from: { id: "shopify", name: "Shopify", event: "Commande payée" },
    to: { id: "sage", name: "Sage", event: "Vente enregistrée" },
    data: "Référence de commande, montant et TVA",
  },
  {
    label: "Agenda", title: "Retrouver un rendez-vous dans le CRM",
    from: { id: "google-workspace", name: "Google Workspace", event: "Rendez-vous ajouté" },
    to: { id: "salesforce", name: "Salesforce", event: "Activité ajoutée" },
    data: "Date, participants et objet du rendez-vous",
  },
  {
    label: "Factures", title: "Classer une facture dans OneDrive",
    from: { id: "cegid", name: "Cegid", event: "Facture validée" },
    to: { id: "microsoft-365", name: "Microsoft 365", event: "PDF classé" },
    data: "PDF de la facture et référence client",
  },
  {
    label: "Expéditions", title: "Envoyer le suivi d’un colis",
    from: { id: "sap", name: "SAP", event: "Colis expédié" },
    to: { id: "brevo", name: "Brevo", event: "E-mail envoyé" },
    data: "Adresse e-mail et numéro de suivi",
  },
] satisfies { label: string; title: string; from: Station; to: Station; data: string }[];

// Superposer les libellés réserve leur hauteur réelle, même avec un fort zoom.
function ExampleCopy({ active, field }: { active: number; field: "title" | "data" }) {
  return <span className={styles.copySlot}>{examples.map((example, index) => (
    <span key={example.from.id} aria-hidden={index !== active || undefined}>{example[field]}</span>
  ))}</span>;
}

type Playback = "auto" | "paused" | "once";

export function ExistingTools() {
  const figure = useRef<HTMLElement>(null);
  const options = useRef<Array<HTMLButtonElement | null>>([]);
  const [active, setActive] = useState(0);
  const [playback, setPlayback] = useState<Playback>("auto");
  const [motionAvailable, setMotionAvailable] = useState(false);
  const [reading, setReading] = useState(false);
  const autoAdvance = playback === "auto" && motionAvailable && !reading;
  const current = examples[active];

  useEffect(() => {
    const element = figure.current;
    if (!element) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = false;
    const update = () => setMotionAvailable(inView && !document.hidden && !motion.matches);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio >= .35;
      update();
    }, { threshold: [0, .35] });
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
    if (!autoAdvance) return;
    const timer = window.setInterval(() => setActive(index => (index + 1) % examples.length), exampleDuration);
    return () => window.clearInterval(timer);
  }, [autoAdvance]);

  function choose(index: number) {
    setActive(index);
    setPlayback("once");
  }

  function moveChoice(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = examples.length - 1;
    const positions: Record<string, number> = {
      ArrowLeft: (index + last) % examples.length,
      ArrowRight: (index + 1) % examples.length,
      Home: 0, End: last,
    };
    const next = positions[event.key];
    if (next === undefined) return;
    event.preventDefault();
    choose(next);
    options.current[next]?.focus();
  }

  return <section id="outils" className={`shell ${styles.section}`} aria-labelledby="existing-tools-heading">
    <div className={styles.copy}>
      <p className={styles.eyebrow}>Intégrations</p>
      <h2 id="existing-tools-heading">Gardez vos outils.{" "}<span>Nous les faisons travailler ensemble.</span></h2>
      <p className={styles.intro}>Votre équipe continue d’utiliser ses logiciels habituels. Un contact, une vente ou une facture peut passer de l’un à l’autre sans double saisie.</p>
      <p className={styles.note}>Nous vérifions avec vous les connexions que permettent vos accès et votre abonnement.</p>
    </div>

    <figure className={styles.figure} ref={figure} aria-label="Exemples de connexions entre logiciels" data-motion={motionAvailable ? playback : "paused"}>
      <div className={styles.scene}>
        <div className={styles.sceneHeader}>
          <div>
            <p className={styles.exampleLabel}>Exemple de connexion</p>
            <h3><ExampleCopy active={active} field="title" /></h3>
          </div>
          <button type="button" className={styles.play} aria-label={playback === "auto" ? "Mettre les exemples en pause" : "Reprendre la lecture des exemples"}
            onClick={() => setPlayback(playback === "auto" ? "paused" : "auto")}>
            <Icon name={playback === "auto" ? "pause" : "play"} /><span>{playback === "auto" ? "Pause" : "Lecture"}</span>
          </button>
        </div>
        <div id="integration-example" aria-live={playback === "auto" ? "off" : "polite"} aria-atomic="true"
          onPointerEnter={event => { if (event.pointerType === "mouse") setReading(true); }} onPointerLeave={() => setReading(false)}>
          <IntegrationCircuit key={current.from.id} from={current.from} to={current.to} assetPath={assetPath} />
          <p className={styles.payload}><Icon name="document" /><span>Données transmises</span><strong><ExampleCopy active={active} field="data" /></strong></p>
        </div>
      </div>

      <fieldset className={styles.picker}
        onFocus={() => setPlayback(mode => mode === "auto" ? "paused" : mode)}>
        <legend>Choisir un exemple</legend>
        <div className={styles.choices}>
          {examples.map((example, index) => (
            <button key={example.from.id} type="button" className={styles.choice} aria-pressed={index === active}
              aria-controls="integration-example" aria-label={`${example.label}, de ${example.from.name} à ${example.to.name}`}
              ref={button => { options.current[index] = button; }} onKeyDown={event => moveChoice(event, index)} onClick={() => choose(index)}>
              <span className={styles.logoPair} aria-hidden="true">
                <Image src={`${assetPath}/${example.from.id}.svg`} alt="" width={28} height={28} unoptimized />
                <Icon name="arrow" />
                <Image src={`${assetPath}/${example.to.id}.svg`} alt="" width={28} height={28} unoptimized />
              </span>
              <span>{example.label}</span>
            </button>
          ))}
        </div>
      </fieldset>
    </figure>
  </section>;
}
