"use client";
import { useEffect, useReducer, useRef, useState, type CSSProperties } from "react";
import { demoComparisons } from "@/config/demo-comparisons";
import type { ChatTopic } from "@/config/demo-data";
import { workflows } from "@/config/workflows";
import { initialWorkflowState, workflowDelay, workflowReducer } from "@/lib/workflow-state";
import { DemoScene } from "./demo-scenes";
import { Icon } from "./icon";

export function WorkflowDemo() {
 const [scenarioIndex,setScenarioIndex]=useState(0);
 const [state,dispatch]=useReducer(workflowReducer,initialWorkflowState);
 const [manual,setManual]=useState(false);
 const [topic,setTopic]=useState<ChatTopic>("suivi");
 const [channel,setChannel]=useState("email");
 const [appKind,setAppKind]=useState("plant");
 const tabs=useRef<(HTMLButtonElement|null)[]>([]);
 const scenario=workflows[scenarioIndex];
 const comparison=demoComparisons[scenario.id];
 const current=scenario.steps[state.step];
 const running=state.phase==="running",idle=state.phase==="idle",done=state.phase==="complete",approval=state.phase==="approval";
 const visibleSteps=scenario.steps.map((step,index)=>({...step,index})).filter(step=>state.approvalRequired||step.index!==4);
 const position=visibleSteps.findIndex(step=>step.index===state.step)+1;
 const longReading=["chatbot","telephone","application"].includes(scenario.id)||state.step===2;
 useEffect(()=>{if(state.phase!=="running"||manual)return;const timer=window.setTimeout(()=>dispatch("tick"),workflowDelay(longReading));return()=>window.clearTimeout(timer);},[state,manual,longReading]);
 function select(index:number){setScenarioIndex(index);dispatch("reset");}
 const status=idle?"À vous de lancer le scénario":done?"Résultat de la simulation":approval?"Votre accord est attendu":state.phase==="paused"?"En pause":manual?"Avancez à votre rythme":"Lecture tranquille";
 return <div className="workflow-demo demo-focused demo-concrete">
  <div className="demo-tabs" role="tablist" aria-label="Choisir un exemple concret">{workflows.map((item,index)=><button key={item.id} ref={el=>{tabs.current[index]=el;}} id={`tab-${item.id}`} role="tab" aria-selected={index===scenarioIndex} aria-controls="workflow-panel" tabIndex={index===scenarioIndex?0:-1} onClick={()=>select(index)} onKeyDown={event=>{let next=index;if(event.key==="ArrowRight")next=(index+1)%workflows.length;else if(event.key==="ArrowLeft")next=(index+workflows.length-1)%workflows.length;else if(event.key==="Home")next=0;else if(event.key==="End")next=workflows.length-1;else return;event.preventDefault();select(next);tabs.current[next]?.focus();}}><Icon name={item.icon}/>{item.label}</button>)}</div>
  <div className="demo-preferences"><div className="approval-setting"><button type="button" role="switch" aria-checked={state.approvalRequired} aria-label="Validation humaine" className="demo-switch" onClick={()=>dispatch({type:"configure",approvalRequired:!state.approvalRequired})}><span/></button><span><strong>Validation humaine <b>{state.approvalRequired?"ON":"OFF"}</b></strong><small>{state.approvalRequired?"Vous autorisez la dernière action.":"Le scénario suit automatiquement les règles prévues."} Changer ce choix remet le parcours au départ.</small></span></div><label className="demo-pace">Rythme<select aria-label="Rythme" value={manual?"manual":"slow"} onChange={e=>setManual(e.target.value==="manual")}><option value="slow">Lecture tranquille</option><option value="manual">Pas à pas</option></select></label></div>
  <div id="workflow-panel" role="tabpanel" aria-labelledby={`tab-${scenario.id}`} tabIndex={0} className={`demo-board ${running?"demo-running":""}`} data-phase={state.phase}>
   <div className="demo-board-header"><h3>{scenario.subtitle}</h3><span className="simulation-badge">DÉMONSTRATION FICTIVE</span></div>
   <div className="demo-controls"><p className="demo-status" role="status" aria-live="polite"><span className={`status-dot ${running?"status-running":""}`}/>{status}</p><div className="demo-actions">
    {!idle&&<button className="icon-button reset-button" onClick={()=>dispatch("reset")} aria-label="Réinitialiser la simulation"><Icon name="reset"/></button>}
    {idle&&<button className="button button-cyan" onClick={()=>dispatch("start")}><Icon name="play"/>Lancer ce scénario</button>}
    {running&&!manual&&<button className="button button-outline" onClick={()=>dispatch("pause")}><Icon name="pause"/>Pause</button>}
    {state.phase==="paused"&&!manual&&<button className="button button-outline" onClick={()=>dispatch("resume")}><Icon name="play"/>Reprendre</button>}
    {(running||state.phase==="paused")&&<button className="button button-cyan" onClick={()=>dispatch("next")}>{state.step===5?"Terminer":"Étape suivante"}<Icon name="arrow"/></button>}
    {approval&&<button className="button button-cyan" onClick={()=>dispatch("approve")}><Icon name="check"/>{scenario.approval}</button>}
    {done&&<button className="button button-outline" onClick={()=>{dispatch("reset");dispatch("start");}}><Icon name="reset"/>Rejouer</button>}
   </div></div>
   <div className="demo-route" style={{"--route-count":visibleSteps.length} as CSSProperties} aria-label="Parcours de la simulation">{visibleSteps.map((step,index)=><div key={step.title} className={`route-stop ${!idle&&(done||step.index<state.step)?"route-done":""} ${!idle&&!done&&step.index===state.step?"route-current":""}`} aria-current={!idle&&!done&&step.index===state.step?"step":undefined}><span className="route-symbol"><Icon name={done||(!idle&&step.index<state.step)?"check":step.icon}/></span><span>{step.verb}</span>{index<visibleSteps.length-1&&<span className="route-wire" aria-hidden="true"><i/></span>}</div>)}</div>
   <div className="concrete-stage" key={`${scenario.id}-${state.step}-${topic}-${channel}-${appKind}`}>
    <div className="scene-heading"><span className="scene-kicker">{idle?"LE POINT DE DÉPART":`ÉTAPE ${position} / ${visibleSteps.length}`}</span><h4>{current.title}</h4><p>{current.description}</p>{approval&&<span className="approval-notice"><Icon name="hand"/>L’action attend votre validation dans ce mode.</span>}</div>
    <div className="scene-canvas"><DemoScene id={scenario.id} step={state.step} active={!idle} approved={state.approvalRequired} topic={topic} setTopic={value=>{setTopic(value);dispatch("reset");}} channel={channel} setChannel={value=>{setChannel(value);dispatch("reset");}} appKind={appKind} setAppKind={value=>{setAppKind(value);dispatch("reset");}}/></div>
   </div>
   <div className="scene-benefit"><Icon name="target"/><p><small>L’INTÉRÊT POUR VOUS</small>{scenario.benefit}</p></div>
  </div>
  {scenario.id==="application" ? <details className="demo-comparison-disclosure"><summary><span>Pour les développeurs · ce que nous prenons en charge</span><span>Voir le périmètre<Icon name="arrow"/></span></summary><div className="developer-scope"><h4>Votre interface. Un traitement adapté à votre produit.</h4><p>Nous pouvons concevoir le traitement spécialisé, son service et la réponse structurée à intégrer dans votre application. Vous gardez votre expérience utilisateur.</p><ul><li>Analyse d’image : plante, état des lieux ou autre besoin à étudier.</li><li>Échange entre votre application et les serveurs Cognalys.</li><li>Format des résultats, accès et gestion des erreurs définis avec vos développeurs.</li></ul><p className="timing-assumption"><strong>Temps de réponse illustratif : 3–15 s par image.</strong> Aucun délai réel mesuré ou garanti. Le réseau, le traitement, le volume et les contrôles influencent ce délai. Coût et calendrier d’intégration étudiés selon le projet.</p></div></details> : <details className="demo-comparison-disclosure" key={`comparison-${scenario.id}`}><summary><span>Avant / après · temps estimés</span><span>{comparison.human} → {comparison.system}<Icon name="arrow"/></span></summary><div className="demo-comparison"><article className="demo-before"><span className="comparison-label">AVANT · À LA MAIN</span><h3>Votre équipe fait chaque étape.</h3><ol>{comparison.before.map((text,index)=><li key={text}><span>{index+1}</span>{text}</li>)}</ol><p className="demo-time"><strong>{comparison.human}</strong><span>de travail humain estimé par cas</span></p></article><article className="demo-after"><span className="comparison-label">APRÈS · AVEC UN SYSTÈME ADAPTÉ</span><h3>{state.approvalRequired?"Le système prépare. Vous validez.":"Le système suit vos règles."}</h3><ol>{comparison.after.map(text=><li key={text}><Icon name="check"/>{text}</li>)}</ol><p className="demo-time"><strong>{comparison.system}</strong><span>de traitement automatique estimé</span></p><p className="demo-review">{state.approvalRequired?`+ ${comparison.review} de vérification humaine estimée`:"Sans validation systématique ; temps des exceptions non chiffré."}</p></article></div><p className="timing-assumption"><strong>Hypothèses illustratives, non mesurées.</strong> {comparison.scope} Les temps varient selon les outils, les volumes, les erreurs et les validations. Le rythme de lecture ne représente pas ces durées.</p></details>}
  <p className="demo-disclaimer">Tous les noms, documents, tarifs et échanges sont fictifs. Aucun mail, appel, paiement, recherche externe ou envoi de photo réel. Les règles et connexions sont définies pour chaque projet.</p>
 </div>;
}
