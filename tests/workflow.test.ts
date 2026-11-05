import test from "node:test";
import assert from "node:assert/strict";
import { workflowReducer, initialWorkflowState, workflowDelay, type WorkflowState } from "../src/lib/workflow-state";
import { workflows } from "../src/config/workflows";
import { demoComparisons } from "../src/config/demo-comparisons";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { DemoScene } from "../src/components/demo-scenes";
import { quoteExample, quoteNet, quoteVat, invoiceExample, orderExample, carrierExample, urgencySignals } from "../src/config/demo-data";

test("validation activée : ni le timer ni l’étape suivante ne franchissent le contrôle", () => {
  let state = workflowReducer(initialWorkflowState, "start");
  for (let i = 0; i < 10; i++) state = workflowReducer(state, "tick");
  assert.equal(state.step, 4); assert.equal(state.phase, "approval");
  assert.deepEqual(workflowReducer(state, "next"), state);
  state = workflowReducer(state, "approve"); assert.equal(state.step, 5); assert.equal(state.phase, "running");
  assert.equal(workflowReducer(state, "tick").phase, "complete");
});
test("validation désactivée : l’étape humaine est sautée et le parcours termine", () => {
  let state = workflowReducer(initialWorkflowState, {type:"configure", approvalRequired:false});
  state = workflowReducer(state, "start");
  const visited: number[] = [];
  for (let i=0; i<8; i++) {visited.push(state.step); state=workflowReducer(state,"tick");}
  assert.ok(!visited.includes(4)); assert.equal(state.phase,"complete");
  assert.equal(workflowReducer(state,"reset").approvalRequired,false);
});
test("changer le contrôle remet un parcours en cours au départ", () => {
  const state = workflowReducer({...initialWorkflowState,step:4,phase:"approval"},{type:"configure",approvalRequired:false});
  assert.deepEqual(state,{step:0,phase:"idle",approvalRequired:false});
  assert.deepEqual(workflowReducer(state,"approve"),state);
});
test("pause, étape manuelle et reprise conservent le contrôle choisi", () => {
  let state: WorkflowState = {...initialWorkflowState,step:2,phase:"running"};
  state=workflowReducer(state,"pause");
  assert.deepEqual(workflowReducer(state,"tick"),state);
  state=workflowReducer(state,"next"); assert.equal(state.step,3); assert.equal(state.phase,"paused");
  state=workflowReducer(state,"next"); assert.equal(state.phase,"approval");
  assert.deepEqual(workflowReducer(state,"reset"),initialWorkflowState);
});
test("lecture : temps de lecture accru pour les sources révélées successivement", () => {
  assert.ok(workflowDelay(false)>=7500); assert.ok(workflowDelay(true)>=10000);
});
test("chaque scénario dispose d’un contrôle optionnel et d’hypothèses de durée", () => {
  assert.equal(new Set(workflows.map(item=>item.id)).size,workflows.length);
  for(const scenario of workflows){assert.equal(scenario.steps.length,6,scenario.id);assert.equal(scenario.steps[4].title,"Validation humaine",scenario.id);assert.ok(demoComparisons[scenario.id]?.scope,scenario.id);}
});

function scene(id:string, step:number, overrides:Record<string,unknown>={}) {
 return renderToStaticMarkup(createElement(DemoScene,{id,step,active:true,approved:true,topic:"suivi",setTopic:()=>{},channel:"email",setChannel:()=>{},appKind:"plant",setAppKind:()=>{},...overrides}));
}
test("devis, facture et stock : cohérence des valeurs affichées de bout en bout",()=>{
 assert.equal(quoteNet,quoteExample.visits*quoteExample.weeks*quoteExample.pricePerVisit);
 assert.equal(quoteVat,76.8);assert.equal(quoteNet+quoteVat,460.8);
 assert.equal(invoiceExample.net+invoiceExample.vat,invoiceExample.total);
 assert.equal(orderExample.stock-orderExample.quantity,22);
 assert.match(scene("demande",3),/DEV-2026-1045/);assert.match(scene("demande",5),/DEV-2026-1045.pdf/);
 assert.match(scene("facture",5),/2026-11-03_Atelier-Proprete_FAC-2026-118.pdf/);
 assert.match(scene("integration",5),/CC-1042-STR/);
});
test("service client : demande de référence, recherche transporteur et réponse concrète",()=>{
 assert.match(scene("chatbot",1),/numéro de suivi/);
 assert.match(scene("chatbot",2),new RegExp(carrierExample.reference));
 assert.match(scene("chatbot",3),/14 h et 18 h/);
 assert.match(scene("chatbot",5),/Suivre le colis/);
});
test("insatisfaction : signalement visible, collecte du contact puis reprise humaine",()=>{
 const start=scene("chatbot",0,{topic:"urgence"});
 assert.match(start,/signal-mark/);for(const signal of urgencySignals)assert.ok(start.includes(signal),signal);
 assert.match(scene("chatbot",1,{topic:"urgence"}),/quelle adresse email/);
 assert.match(scene("chatbot",5,{topic:"urgence",approved:false}),/Conseillère · Léa/);
});
test("appel, relance et application : résultats distincts selon la variante",()=>{
 assert.match(scene("telephone",2),/samedi/);assert.match(scene("telephone",3),/Je confirme/);
 assert.match(scene("telephone",5),/camille@horizon.example/);
 assert.match(scene("suivi",3,{channel:"call"}),/Assistant vocal/);
 assert.match(scene("suivi",3,{channel:"email"}),/EMAIL PRÊT/);
 assert.match(scene("application",5),/Monstera/);
 assert.match(scene("application",5,{appKind:"property"}),/Fissure apparente/);
 assert.ok(workflows.some(s=>s.id==="application"));assert.ok(!workflows.some(s=>s.id==="rapport"));
});
