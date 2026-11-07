"use client";

import { useState } from "react";
import { Icon } from "./icon";
import styles from "./cost-calculator.module.css";

const amount = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const hours = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });

const fields = {
  people: { label: "Personnes concernées", unit: "pers.", initial: "3", max: 10000, step: 1 },
  time: { label: "Temps par personne et par semaine", unit: "h", initial: "6", max: 168, step: "any" },
  rate: { label: "Coût horaire employeur", unit: "€/h", initial: "35", max: 10000, step: "any" },
  weeks: { label: "Semaines travaillées par an", unit: "sem.", initial: "47", max: 52, step: 1 },
  setup: { label: "Mise en place", unit: "€", initial: "0", max: 10000000, step: "any" },
  monthly: { label: "Fonctionnement mensuel", unit: "€/mois", initial: "0", max: 1000000, step: "any" },
} as const;

type Field = keyof typeof fields;
const keys = Object.keys(fields) as Field[];

export function CostCalculator() {
  const [values, setValues] = useState(() => Object.fromEntries(keys.map(key => [key, fields[key].initial])) as Record<Field, string>);
  const [share, setShare] = useState(50);
  function valid(key: Field) {
    const value = Number(values[key]);
    return values[key] !== "" && Number.isFinite(value) && value >= 0 && value <= fields[key].max
      && (fields[key].step !== 1 || Number.isInteger(value));
  }
  const ready = keys.every(valid);
  const annualHours = Number(values.people) * Number(values.time) * Number(values.weeks);
  const currentCost = annualHours * Number(values.rate);
  const savedHours = annualHours * share / 100;
  const savedValue = currentCost * share / 100;
  const budget = Number(values.setup) + 12 * Number(values.monthly);

  function field(key: Field) {
    const { label, unit, max, step } = fields[key];
    const error = !valid(key);
    return <div key={key} className={styles.field}>
      <label htmlFor={`cost-${key}`}>{label}</label>
      <div className={styles.inputBox}>
        <input id={`cost-${key}`} type="number" min="0" max={max} step={step}
          aria-invalid={error} aria-describedby={error ? `cost-error-${key}` : undefined}
          value={values[key]} onChange={event => setValues({ ...values, [key]: event.target.value })} />
        <span>{unit}</span>
      </div>
      {error && <small id={`cost-error-${key}`}>Saisissez {step === 1 ? "un entier" : "une valeur"} entre 0 et {max}.</small>}
    </div>;
  }

  return <section id="calculateur" className={`shell ${styles.section}`} aria-labelledby="cost-title">
    <header className={styles.header}>
      <p className={styles.kicker}>Calculateur de coût employeur</p>
      <h2 id="cost-title">Combien vous coûtent vos tâches répétitives ?</h2>
      <p>Pensez à une tâche comme préparer un devis, recopier une facture ou relancer un client. Ajustez les chiffres pour votre équipe.</p>
    </header>
    <div className={styles.panel}>
      <div className={styles.controls}>
        <h3>Votre organisation actuelle</h3>
        <div className={styles.grid}>{field("people")}{field("time")}{field("rate")}{field("weeks")}</div>
        <p className={styles.hint}>Pour le coût horaire, utilisez le coût total pour l’entreprise, cotisations employeur comprises.</p>
        <div className={styles.sliderLabel}><label htmlFor="cost-share">Part du temps que vous pensez pouvoir automatiser</label><strong>{share} %</strong></div>
        <input className={styles.range} id="cost-share" type="range" min="0" max="100" step="1" value={share}
          aria-valuetext={`${share} pour cent`} onChange={event => setShare(Number(event.target.value))}/>
        <div className={styles.scale} aria-hidden="true"><span>0 %</span><span>100 %</span></div>
        <details className={styles.budget}><summary>Intégrer le coût du projet</summary>
          <div className={styles.grid}>{field("setup")}{field("monthly")}</div>
        </details>
      </div>
      <div className={styles.results}>
        <div role="status" aria-atomic="true">
          <p className={styles.kicker}>Projection annuelle</p>
          <h3>Valeur du temps récupérable</h3>
          <p className={styles.amount}>{ready ? amount.format(savedValue) : "—"}</p>
          <p className={styles.hours}>{ready ? `${hours.format(savedHours)} h libérables sur ${hours.format(annualHours)} h consacrées à cette tâche.` : "Vérifiez les valeurs saisies pour afficher l’estimation."}</p>
          <div className={styles.track} aria-hidden="true"><i style={{width: ready && annualHours > 0 ? `${share}%` : "0%"}} /></div>
          <dl className={styles.breakdown}>
            <div><dt>Coût actuel de la tâche</dt><dd>{ready ? amount.format(currentCost) : "—"}</dd></div>
            <div><dt>Travail manuel restant</dt><dd>{ready ? amount.format(currentCost - savedValue) : "—"}</dd></div>
            {ready && budget > 0 && <>
              <div><dt>Budget du projet en année 1</dt><dd>{amount.format(budget)}</dd></div>
              <div><dt>Valeur après frais en année 1</dt><dd>{amount.format(savedValue - budget)}</dd></div>
            </>}
          </dl>
        </div>
        <p className={styles.note}>Ce montant valorise le temps disponible pour d’autres missions. L’économie de trésorerie dépend des dépenses effectivement évitées.</p>
        <a className={styles.cta} href="#contact">Étudier cette automatisation <Icon name="arrowUpRight"/></a>
      </div>
    </div>
  </section>;
}
