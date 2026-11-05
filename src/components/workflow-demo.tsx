"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { demoComparisons } from "@/config/demo-comparisons";
import { demoResearch } from "@/config/demo-research";
import { workflows } from "@/config/workflows";
import { initialWorkflowState, workflowDelay, workflowReducer } from "@/lib/workflow-state";
import { Icon } from "./icon";

export function WorkflowDemo() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [state, dispatch] = useReducer(workflowReducer, initialWorkflowState);
  const [manual, setManual] = useState(false);
  const [question, setQuestion] = useState("retour");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const scenario = workflows[scenarioIndex];
  const comparison = demoComparisons[scenario.id];
  const current = scenario.steps[state.step];
  const sources = demoResearch(scenario.id, state.step, question);
  const hasResearch = sources.length > 0;
  const running = state.phase === "running";
  const done = state.phase === "complete";
  const idle = state.phase === "idle";
  const approval = state.phase === "approval";
  const visibleSteps = scenario.steps.map((step, index) => ({...step, index})).filter(step => state.approvalRequired || step.index !== 4);
  const position = visibleSteps.findIndex(step => step.index === state.step) + 1;
  const customerQuestion = question === "retour" ? "Puis-je retourner un produit ?" : "Comment suivre ma commande ?";
  const botAnswer = question === "retour" ? "Contactez le support avec la référence de commande." : "Ouvrez le lien de suivi fourni dans votre confirmation.";
  const botSource = question === "retour" ? "Procédure de retour" : "Guide de livraison";

  useEffect(() => {
    if (state.phase !== "running" || manual) return;
    const timer = window.setTimeout(() => dispatch("tick"), workflowDelay(hasResearch));
    return () => window.clearTimeout(timer);
  }, [state, manual, hasResearch]);

  function select(index: number) { setScenarioIndex(index); dispatch("reset"); }
  const status = idle ? "Prêt à démarrer" : done ? "Simulation terminée" : approval ? "Votre validation est attendue" : state.phase === "paused" ? "Simulation en pause" : manual ? "Avancez à votre rythme" : "Lecture tranquille";
  const description = !state.approvalRequired && state.step === 3 ? "Le système prépare le résultat à partir des informations utiles et des règles définies pour ce scénario." : !state.approvalRequired && state.step === 5 ? "Le système poursuit automatiquement selon les règles choisies. Une exception peut toujours être orientée vers votre équipe." : current.description;

  return <div className="workflow-demo demo-focused">
    <div className="demo-tabs" role="tablist" aria-label="Choisir un exemple d’automatisation">{workflows.map((item, index) => <button key={item.id} ref={el => { tabs.current[index] = el; }} id={`tab-${item.id}`} role="tab" aria-selected={scenarioIndex === index} aria-controls="workflow-panel" tabIndex={scenarioIndex === index ? 0 : -1} onClick={() => select(index)} onKeyDown={event => {
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % workflows.length;
      else if (event.key === "ArrowLeft") next = (index + workflows.length - 1) % workflows.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = workflows.length - 1;
      else return;
      event.preventDefault(); select(next); tabs.current[next]?.focus();
    }}><Icon name={item.icon} />{item.label}</button>)}</div>

    <div className="demo-preferences">
      <div className="approval-setting"><button type="button" role="switch" aria-checked={state.approvalRequired} aria-label="Validation humaine" className="demo-switch" onClick={() => dispatch({type:"configure", approvalRequired:!state.approvalRequired})}><span /></button><span><strong>Validation humaine <b>{state.approvalRequired ? "ON" : "OFF"}</b></strong><small>{state.approvalRequired ? "Le parcours attend votre accord." : "Le parcours continue automatiquement."} Changer ce choix remet le parcours au départ.</small></span></div>
      <label className="demo-pace">Rythme<select value={manual ? "manual" : "slow"} onChange={event => setManual(event.target.value === "manual")}><option value="slow">Lecture tranquille</option><option value="manual">Pas à pas</option></select></label>
    </div>
    {scenario.id === "chatbot" && <div className="chat-choice demo-question"><span>Question du client fictif :</span><button type="button" aria-pressed={question === "retour"} onClick={() => {setQuestion("retour"); dispatch("reset");}}>Retour produit</button><button type="button" aria-pressed={question === "suivi"} onClick={() => {setQuestion("suivi"); dispatch("reset");}}>Suivi de commande</button></div>}

    <div id="workflow-panel" role="tabpanel" aria-labelledby={`tab-${scenario.id}`} tabIndex={0} className={`demo-board ${running ? "demo-running" : ""}`} data-phase={state.phase}>
      <div className="demo-board-header"><h3>{scenario.subtitle}</h3><span className="simulation-badge">SIMULATION</span></div>
      <div className="demo-controls">
        <p className={`demo-status ${approval ? "status-approval" : ""}`} role="status" aria-live="polite"><span className={`status-dot ${running ? "status-running" : ""}`} />{status}</p>
        <div className="demo-actions">
          {!idle && <button className="icon-button reset-button" onClick={() => dispatch("reset")} aria-label="Réinitialiser la simulation"><Icon name="reset" /></button>}
          {idle && <button className="button button-cyan" onClick={() => dispatch("start")}><Icon name="play" />Essayer ce scénario</button>}
          {running && !manual && <button className="button button-outline" onClick={() => dispatch("pause")}><Icon name="pause" />Mettre en pause</button>}
          {state.phase === "paused" && !manual && <button className="button button-outline" onClick={() => dispatch("resume")}><Icon name="play" />Reprendre</button>}
          {(running || state.phase === "paused") && <button className="button button-cyan" onClick={() => dispatch("next")}>{state.step === 5 ? "Voir le résultat" : "Étape suivante"}<Icon name="arrow" /></button>}
          {approval && <button className="button button-cyan" onClick={() => dispatch("approve")}><Icon name="check" />{scenario.approval}</button>}
          {done && <button className="button button-outline" onClick={() => {dispatch("reset"); dispatch("start");}}><Icon name="reset" />Rejouer</button>}
        </div>
      </div>
      <div className="demo-route" style={{"--route-count":visibleSteps.length} as React.CSSProperties} aria-label="Parcours de la simulation">
        {visibleSteps.map((step, index) => <div key={step.title} className={`route-stop ${!idle && (done || step.index < state.step) ? "route-done" : ""} ${!idle && !done && step.index === state.step ? "route-current" : ""}`} aria-current={!idle && !done && step.index === state.step ? "step" : undefined}><span className="route-symbol"><Icon name={done || (!idle && step.index < state.step) ? "check" : step.icon} /></span><span>{step.verb}</span>{index < visibleSteps.length - 1 && <span className="route-wire" aria-hidden="true"><i /></span>}</div>)}
      </div>

      <div className="demo-stage">
        {idle ? <div className="demo-welcome"><span className="detail-icon"><Icon name={scenario.icon} /></span><h4>{scenario.id === "chatbot" ? customerQuestion : "Une tâche. Un parcours à découvrir."}</h4><p>Lancez la démonstration : une seule étape s’affiche à la fois.</p></div> : <div key={`${scenario.id}-${state.step}-${done}`} className={`demo-detail ${approval ? "detail-approval" : ""}`}>
          <div className="detail-top"><span className="detail-icon"><Icon name={done ? "check" : current.icon} /></span><span className="mono">{done ? "RÉSULTAT" : `ÉTAPE ${position} / ${visibleSteps.length}`}</span></div>
          <h4>{done ? state.approvalRequired ? scenario.complete : "Le parcours automatique est terminé." : current.title}</h4>
          <p className="stage-description">{done ? state.approvalRequired ? "Votre équipe a validé le résultat avant la suite du traitement." : "Aucun accord demandé à chaque étape dans ce mode. Les règles et les exceptions restent à définir pour votre projet." : description}</p>
          <div className="stage-evidence">
            {!done && hasResearch ? <div className="research-view" aria-label="Recherche simulée dans les sources autorisées"><p className="research-caption"><Icon name="search" />Recherche dans les sources autorisées <small>Données fictives</small></p><ol>{sources.map((source,index) => <li key={source.name} style={{animationDelay:`${.7 + index * 1.7}s`}}><span className="research-node"><Icon name={index === 2 ? "check" : "search"} /></span><div><small>{source.kind}</small><strong>{source.name}</strong><p>{source.result}</p></div></li>)}</ol><p className="research-result">Les éléments utiles passent à l’étape suivante.</p></div>
            : scenario.id === "chatbot" ? <div className="demo-conversation" aria-label="Conversation fictive du chatbot"><p className="chat-bubble chat-customer"><small>CLIENT FICTIF</small>{customerQuestion}</p>{state.step >= 3 && <p className="chat-bubble chat-agent"><small>{done || state.step === 5 ? state.approvalRequired ? "RÉPONSE VALIDÉE · SIMULATION" : "RÉPONSE AUTOMATIQUE · SIMULATION" : "RÉPONSE PRÉPARÉE"}</small>{botAnswer}<span className="chat-source">Source fictive : {botSource}</span></p>}</div>
            : scenario.id === "telephone" ? <div className="demo-call"><div className="call-wave" aria-hidden="true">{Array.from({length:18},(_,i)=><i key={i} style={{animationDelay:`${i * .09}s`}} />)}</div><p><strong>Accueil vocal · simulation visuelle</strong><span>{state.step < 2 ? "« Bonjour, je suis l’assistant vocal. Comment vous aider ? »" : "« Je prépare un récapitulatif pour l’équipe. »"}</span></p></div>
            : !done && state.step !== 4 && <div className="sample-record"><div className="record-heading"><span className="tiny-dot" />{current.system}<span>EXEMPLE</span></div><dl>{current.fields.slice(0,2).map(field => <div key={field.label}><dt>{field.label}</dt><dd>{!state.approvalRequired && (state.step === 3 || state.step === 5) ? field.label === current.fields[0].label ? field.value.replace(/validé(e)?/g,"préparé$1") : "Suite automatique selon les règles définies" : field.value}</dd></div>)}</dl></div>}
            {approval && <div className="approval-callout"><Icon name="hand" /><span>Le système attend votre accord pour continuer.</span></div>}
            {done && <div className="complete-callout"><Icon name="check" /> Simulation uniquement : aucune action réelle.</div>}
          </div>
        </div>}
      </div>
    </div>

    <details className="demo-comparison-disclosure" key={`comparison-${scenario.id}`}><summary><span>Temps estimés · avant / après</span><span>{comparison.human} → {comparison.system}<Icon name="arrow" /></span></summary><div className="demo-comparison">
      <article className="demo-before"><span className="comparison-label">AVANT · TRAITEMENT MANUEL</span><h3>Votre équipe fait chaque étape.</h3><ol>{comparison.before.map((text,index)=><li key={text}><span>{index+1}</span>{text}</li>)}</ol><p className="demo-time"><strong>{comparison.human}</strong><span>de travail humain estimé par cas</span></p></article>
      <article className="demo-after"><span className="comparison-label">APRÈS · AVEC UN SYSTÈME ADAPTÉ</span><h3>{state.approvalRequired ? "Le système prépare. Vous validez." : "Le système suit vos règles."}</h3><ol>{comparison.after.slice(0,2).map(text=><li key={text}><Icon name="check" />{text}</li>)}<li><Icon name={state.approvalRequired ? "hand" : "check"} />{state.approvalRequired ? "Votre accord est demandé avant la suite" : "Suite automatique ; exceptions à définir"}</li></ol><p className="demo-time"><strong>{comparison.system}</strong><span>de traitement automatique estimé</span></p><p className="demo-review">{state.approvalRequired ? `+ ${comparison.review} de vérification humaine estimée` : "Sans validation systématique dans ce mode ; gestion des exceptions non chiffrée."}</p></article>
    </div><p className="timing-assumption"><strong>Hypothèses illustratives, non mesurées.</strong> {comparison.scope} Les temps dépendent des outils, du volume, des erreurs et des validations. Le rythme de lecture ne représente pas ces durées.</p></details>
    <p className="demo-disclaimer">Données, recherches et connexions simulées. Aucun service connecté, appel ni message réel. Le contrôle humain se définit selon les actions et les risques de chaque projet.</p>
  </div>;
}
