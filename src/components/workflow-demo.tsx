"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { workflows } from "@/config/workflows";
import { initialWorkflowState, workflowReducer } from "@/lib/workflow-state";
import { Icon } from "./icon";

export function WorkflowDemo() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [state, dispatch] = useReducer(workflowReducer, initialWorkflowState);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const scenario = workflows[scenarioIndex];
  const current = scenario.steps[state.step];
  const done = state.phase === "complete";
  const idle = state.phase === "idle";
  const approval = state.phase === "approval";

  useEffect(() => {
    if (state.phase !== "running") return;
    const timer = window.setTimeout(() => dispatch("tick"), 1900);
    return () => window.clearTimeout(timer);
  }, [state]);

  function select(index: number) { setScenarioIndex(index); dispatch("reset"); }
  const status = idle ? "Prêt à démarrer" : done ? "Simulation terminée" : approval ? "Votre validation est attendue" : state.phase === "paused" ? "Simulation en pause" : "Simulation en cours";

  return <div className="workflow-demo">
    <div className="demo-tabs" role="tablist" aria-label="Choisir un exemple d’automatisation">{workflows.map((item, index) => <button key={item.id} ref={el => { tabs.current[index] = el; }} id={`tab-${item.id}`} role="tab" aria-selected={scenarioIndex === index} aria-controls="workflow-panel" tabIndex={scenarioIndex === index ? 0 : -1} onClick={() => select(index)} onKeyDown={event => {
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % workflows.length;
      else if (event.key === "ArrowLeft") next = (index + workflows.length - 1) % workflows.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = workflows.length - 1;
      else return;
      event.preventDefault(); select(next); tabs.current[next]?.focus();
    }}><Icon name={item.icon} />{item.label}</button>)}</div>
    <div id="workflow-panel" role="tabpanel" aria-labelledby={`tab-${scenario.id}`} tabIndex={0} className="demo-board">
      <div className="demo-board-header"><div><span className="eyebrow">UN EXEMPLE CONCRET</span><h3>{scenario.subtitle}</h3></div><span className="simulation-badge"><span className="tiny-dot" /> SIMULATION</span></div>
      <div className="demo-body">
        <ol className="demo-steps" aria-label="Étapes du processus">{scenario.steps.map((step, index) => {
          const completed = done || (!idle && index < state.step);
          const active = !idle && !done && index === state.step;
          return <li key={`${scenario.id}-${index}`} className={`${completed ? "is-done" : ""} ${active ? "is-active" : ""} ${active && approval ? "is-approval" : ""}`} aria-current={active ? "step" : undefined}><span className="step-indicator">{completed ? <Icon name="check" /> : String(index + 1).padStart(2, "0")}</span><span>{step.title}<small>{completed ? "Étape simulée" : active ? (approval ? "Action requise" : state.phase === "paused" ? "En pause" : "En cours") : index === 4 ? "Vous gardez le contrôle" : ""}</small></span>{active && <span className="step-active-dot" />}</li>;
        })}</ol>
        <div className={`demo-detail ${approval ? "detail-approval" : ""}`}>
          <div className="detail-top"><span className="detail-icon"><Icon name={done ? "check" : current.icon} /></span><span className="mono">{done ? "PROCESSUS TERMINÉ" : `${String(state.step + 1).padStart(2, "0")} / 06 — ${current.verb.toUpperCase()}`}</span></div>
          <h4>{done ? scenario.complete : current.title}</h4>
          <p>{done ? "Les étapes répétitives sont prises en charge. Les décisions sensibles restent entre les mains de votre équipe." : current.description}</p>
          <div className="sample-record"><div className="record-heading"><span className="tiny-dot" />{current.system}<span>EXEMPLE</span></div><dl>{current.fields.map(field => <div key={field.label}><dt>{field.label}</dt><dd>{field.value}</dd></div>)}</dl></div>
          {approval && <div className="approval-callout"><Icon name="hand" /><span>Le processus est en pause.<br /><strong>À vous de valider pour continuer.</strong></span></div>}
          {done && <div className="complete-callout"><Icon name="check" /> Aucun email envoyé. Aucune donnée enregistrée.</div>}
        </div>
      </div>
      <div className="demo-controls">
        <p className={`demo-status ${approval ? "status-approval" : ""}`} role="status" aria-live="polite"><span className={`status-dot ${state.phase === "running" ? "status-running" : ""}`} />{status}</p>
        <div className="demo-actions">{!idle && <button className="icon-button reset-button" onClick={() => dispatch("reset")} aria-label="Réinitialiser la simulation"><Icon name="reset" /></button>}
          {idle && <button className="button button-cyan" onClick={() => dispatch("start")}><Icon name="play" />Lancer la simulation</button>}
          {state.phase === "running" && <button className="button button-outline" onClick={() => dispatch("pause")}><Icon name="pause" />Mettre en pause</button>}
          {state.phase === "paused" && <button className="button button-cyan" onClick={() => dispatch("resume")}><Icon name="play" />Reprendre</button>}
          {approval && <button className="button button-cyan" onClick={() => dispatch("approve")}><Icon name="check" />{scenario.approval}</button>}
          {done && <button className="button button-outline" onClick={() => { dispatch("reset"); dispatch("start"); }}><Icon name="reset" />Rejouer la simulation</button>}
        </div>
      </div>
    </div>
    <p className="demo-disclaimer"><Icon name="circle" /> Simulation pédagogique avec des données fictives. Aucun outil connecté, aucune action réelle.</p>
  </div>;
}
