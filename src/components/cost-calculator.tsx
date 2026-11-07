"use client";

import { useState } from "react";
import { Icon } from "./icon";
import styles from "./cost-calculator.module.css";

const euros = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const number = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });
const workingWeeks = 47;
const illustrativeShare = 0.5;
const sliders = [
  { key: "people", label: "Personnes concernées", unit: "pers.", min: 1, max: 50, step: 1 },
  { key: "time", label: "Heures par personne et par semaine", unit: "h", min: 0, max: 40, step: 0.5 },
  { key: "rate", label: "Coût horaire chargé", unit: "€/h", min: 10, max: 150, step: 1 },
] as const;

export function CostCalculator() {
  const [values, setValues] = useState({ people: 3, time: 6, rate: 35 });
  const cost = values.people * values.time * workingWeeks * values.rate;
  const recoveredHours = values.people * values.time * workingWeeks * illustrativeShare;

  return <section id="calculateur" className={`shell ${styles.section}`} aria-labelledby="cost-title">
    <header className={styles.header}>
      <p className={styles.kicker}>Calculateur de coût employeur</p>
      <h2 id="cost-title">Combien vous coûtent vos tâches répétitives ?</h2>
      <p>Prenez une tâche de votre équipe, comme préparer un devis ou relancer un client.</p>
    </header>
    <div className={styles.panel}>
      <div className={styles.controls}>
        <h3>Votre organisation actuelle</h3>
        {sliders.map(({ key, label, unit, min, max, step }) => {
          const value = values[key];
          return <div key={key} className={styles.field}>
            <div className={styles.label}>
              <label htmlFor={`cost-${key}`}>{label}</label>
              <span aria-hidden="true">{number.format(value)} {unit}</span>
            </div>
            <input className={styles.range} id={`cost-${key}`} type="range" min={min} max={max} step={step}
              value={value} aria-valuetext={`${number.format(value)} ${unit}`}
              onChange={event => {
                const next = event.currentTarget.valueAsNumber;
                setValues(previous => ({ ...previous, [key]: next }));
              }} />
          </div>;
        })}
      </div>
      <div className={styles.results}>
        <div role="status" aria-atomic="true">
          <h3>Coût annuel de cette tâche</h3>
          <p className={styles.amount}>{euros.format(cost)}</p>
          <p className={styles.scenario}>Si l’automatisation libère {illustrativeShare * 100} % du temps</p>
          <p className={styles.gain}><strong>{number.format(recoveredHours)} h</strong> récupérées, soit <strong>{euros.format(cost * illustrativeShare)}</strong> de temps de travail par an.</p>
        </div>
        <p className={styles.note}>Exemple sur {workingWeeks} semaines. Cognalys évalue le gain réalisable avec vous.</p>
        <a className={styles.cta} href="#contact">Étudier cette automatisation <Icon name="arrowUpRight"/></a>
      </div>
    </div>
  </section>;
}
