"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { demoComparisons } from "@/config/demo-comparisons";
import { workflows } from "@/config/workflows";
import { initialWorkflowState, workflowReducer } from "@/lib/workflow-state";
import { Icon } from "./icon";

export function WorkflowDemo() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [state, dispatch] = useReducer(workflowReducer, initialWorkflowState);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const scenario = workflows[scenarioIndex];
  const [question, setQuestion] = useState("retour");
  const comparison = demoComparisons[scenario.id];
  const current = scenario.steps[state.step];
  const running = state.phase === "running";
  const customerQuestion = question === "retour" ? "Puis-je retourner un produit ?" : "Comment suivre ma commande ?";
  const botAnswer = question === "retour" ? "Contactez le support avec la référence de commande. Source : procédure de retour fictive." : "Ouvrez le lien de suivi fourni dans votre confirmation. Source : guide de livraison fictif.";
  const done = state.phase === "complete";
  const idle = state.phase === "idle";
  const approval = state.phase === "approval";

  useEffect(() => {
    if (state.phase !== "running") return;
    const timer = window.setTimeout(() => dispatch("tick"), 2400);
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
    <div className="demo-comparison" aria-label="Comparaison illustrative avant et après">
      <article className="demo-before"><span className="comparison-label">AVANT · TRAITEMENT MANUEL</span><h3>Votre équipe fait chaque étape.</h3><ol>{comparison.before.map((text, index) => <li key={text}><span>{index + 1}</span>{text}</li>)}</ol><p className="demo-time"><strong>{comparison.human}</strong><span>de travail humain estimé par cas</span></p></article>
      <article className="demo-after"><span className="comparison-label">APRÈS · AVEC UN SYSTÈME ADAPTÉ</span><h3>Le système prépare. Vous contrôlez.</h3><ol>{comparison.after.map((text, index) => <li key={text}><Icon name={index === 2 ? "hand" : "check"} />{text}</li>)}</ol><p className="demo-time"><strong>{comparison.system}</strong><span>de traitement automatique estimé</span></p><p className="demo-review"><Icon name="hand" /> + {comparison.review} de vérification humaine estimée</p></article>
    </div>
    <p className="timing-assumption"><strong>Hypothèses illustratives, non mesurées.</strong> {comparison.scope} Les temps dépendent des outils, du volume, des erreurs et des validations. Le rythme de l’animation ne représente pas ces durées.</p>
    <div id="workflow-panel" role="tabpanel" aria-labelledby={`tab-${scenario.id}`} tabIndex={0} className={`demo-board ${running ? "demo-running" : ""}`} data-phase={state.phase}>
      <div className="demo-board-header"><div><span className="eyebrow">UN EXEMPLE CONCRET</span><h3>{scenario.subtitle}</h3></div><span className="simulation-badge"><span className="tiny-dot" /> SIMULATION</span></div>
      <div className="demo-route" aria-label="Parcours de la simulation">
        {scenario.steps.map((step, index) => <div key={step.title} className={`route-stop ${!idle && (done || index < state.step) ? "route-done" : ""} ${!idle && !done && index === state.step ? "route-current" : ""}`}><span className="route-symbol"><Icon name={index === 4 ? "hand" : step.icon} /></span><span>{step.verb}</span>{index < scenario.steps.length - 1 && <span className="route-wire" aria-hidden="true"><i /></span>}</div>)}
      </div>
      {idle && <div className="demo-start-hint"><Icon name="play" /><span>Choisissez un exemple puis lancez le parcours. Les connexions s’allument au fil des étapes.</span><button className="button button-cyan" onClick={() => dispatch("start")}>Essayer ce scénario<Icon name="arrow" /></button></div>}
      <div className="demo-body">
        <ol className="demo-steps" aria-label="Étapes du processus">{scenario.steps.map((step, index) => {
          const completed = done || (!idle && index < state.step);
          const active = !idle && !done && index === state.step;
          return <li key={`${scenario.id}-${index}`} className={`${completed ? "is-done" : ""} ${active ? "is-active" : ""} ${active && approval ? "is-approval" : ""}`} aria-current={active ? "step" : undefined}><span className="step-indicator">{completed ? <Icon name="check" /> : String(index + 1).padStart(2, "0")}</span><span>{step.title}<small>{completed ? "Étape simulée" : active ? (approval ? "Action requise" : state.phase === "paused" ? "En pause" : "En cours") : index === 4 ? "Vous gardez le contrôle" : ""}</small></span>{active && <span className="step-active-dot" />}</li>;
        })}</ol>
        <div key={`${scenario.id}-${state.step}-${done}`} className={`demo-detail ${approval ? "detail-approval" : ""}`}>
          <div className="demo-processing" aria-hidden="true"><span className="processing-spinner" />{running ? "Traitement simulé en cours…" : approval ? "Votre décision est attendue" : done ? "Parcours simulé terminé" : "Aperçu du scénario"}<span className="processing-bars"><i /><i /><i /><i /></span></div>
          <div className="detail-top"><span className="detail-icon"><Icon name={done ? "check" : current.icon} /></span><span className="mono">{done ? "PROCESSUS TERMINÉ" : `${String(state.step + 1).padStart(2, "0")} / 06 — ${current.verb.toUpperCase()}`}</span></div>
          <h4>{done ? scenario.complete : current.title}</h4>
          <p>{done ? "Les étapes répétitives sont prises en charge. Les décisions sensibles restent entre les mains de votre équipe." : current.description}</p>
          {scenario.id === "chatbot" && <div className="demo-conversation" aria-label="Conversation fictive du chatbot">
            <div className="chat-choice"><span>Choisissez la question :</span><button type="button" aria-pressed={question === "retour"} onClick={() => {setQuestion("retour"); dispatch("reset");}}>Retour produit</button><button type="button" aria-pressed={question === "suivi"} onClick={() => {setQuestion("suivi"); dispatch("reset");}}>Suivi de commande</button></div>
            <p className="chat-bubble chat-customer"><small>CLIENT FICTIF</small>{customerQuestion}</p>
            {!idle && state.step < 3 && <p className="chat-typing" aria-label="Recherche simulée"><i /><i /><i /><span>Recherche dans la documentation…</span></p>}
            {!idle && state.step >= 3 && <p className="chat-bubble chat-agent"><small>{done ? "RÉPONSE VALIDÉE · SIMULATION" : "BROUILLON · À VÉRIFIER"}</small>{botAnswer}</p>}
          </div>}
          {scenario.id === "telephone" && <div className="demo-call"><div className="call-wave" aria-hidden="true">{Array.from({length: 18},(_,i)=><i key={i} style={{animationDelay:`${i * .09}s`}} />)}</div><p><strong>Accueil vocal · simulation visuelle</strong><span>{state.step < 2 ? "« Bonjour, je suis l’assistant vocal. Comment vous aider ? »" : "« Je prépare un récapitulatif pour l’équipe. »"}</span><small>Aucun son, appel ni enregistrement réel.</small></p></div>}
          <div className="sample-record"><div className="record-heading"><span className="tiny-dot" />{current.system}<span>EXEMPLE</span></div><dl>{(scenario.id === "chatbot" ? [{label: "Question choisie", value: customerQuestion}, {label: "Statut", value: done ? "Réponse validée (simulation)" : state.step >= 3 ? "Brouillon en attente de contrôle" : "Recherche et préparation simulées"}] : current.fields).map(field => <div key={field.label}><dt>{field.label}</dt><dd>{field.value}</dd></div>)}</dl></div>
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
    <p className="demo-disclaimer"><Icon name="circle" /> Démonstration locale avec données fictives, chargements et connexions simulés. Aucun outil connecté, aucun appel ni message réel.</p>
  </div>;
}
