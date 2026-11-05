import test from "node:test";
import assert from "node:assert/strict";
import { workflowReducer, initialWorkflowState, workflowDelay, createWorkflowState } from "../src/lib/workflow-state";
import { workflows, workflowPlan, workflowSteps } from "../src/config/workflows";
import { demoComparisons } from "../src/config/demo-comparisons";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { DemoScene } from "../src/components/demo-scenes";
import { quoteExample, quoteNet, quoteVat, invoiceExample, orderExample, carrierExample, urgencySignals } from "../src/config/demo-data";

test("les validations s’appliquent seulement au devis et à la facture",()=>{
 for(const item of workflows){
  assert.equal(!!item.reviewLabel,["demande","facture"].includes(item.id));
  for(const enabled of [true,false]){
   const plan=workflowPlan(item,enabled),steps=workflowSteps(item,enabled);
   let state=workflowReducer(createWorkflowState(plan),"start");
   for(let i=0;i<15;i++)state=workflowReducer(state,"tick");
   if(item.reviewLabel&&enabled){assert.equal(state.phase,"approval",item.id);assert.equal(steps[state.step].review,true);assert.deepEqual(workflowReducer(state,"next"),state);state=workflowReducer(state,"approve");state=workflowReducer(state,"tick");assert.equal(state.phase,"complete");}
   else {assert.equal(plan.approvalStep,null,item.id);assert.equal(state.phase,"complete",item.id);}
  }
 }
});
test("reset et changement de scénario conservent un plan cohérent",()=>{
 let state=workflowReducer(initialWorkflowState,"start");state=workflowReducer(state,"next");
 const plan=workflowPlan(workflows.find(item=>item.id==="telephone")!,true);
 state=workflowReducer(state,{type:"configure",plan});
 assert.equal(state.step,0);assert.equal(state.phase,"idle");assert.equal(state.approvalStep,null);
 assert.deepEqual(workflowReducer(state,"reset"),state);
 assert.deepEqual(workflowReducer(state,"approve"),state);
});
test("pause et pas à pas ne contournent pas une validation utile",()=>{
 let state=workflowReducer(initialWorkflowState,"start");state=workflowReducer(state,"pause");
 assert.deepEqual(workflowReducer(state,"tick"),state);
 for(let i=0;i<4;i++)state=workflowReducer(state,"next");
 assert.equal(state.phase,"approval");assert.deepEqual(workflowReducer(state,"resume"),state);
});
test("chaque parcours a des scènes et des hypothèses cohérentes",()=>{
 assert.equal(new Set(workflows.map(item=>item.id)).size,workflows.length);
 for(const item of workflows){assert.ok(demoComparisons[item.id]?.scope);assert.equal(item.steps[0].scene,0);assert.equal(item.steps.at(-1)?.scene,5);assert.ok(workflowDelay(item.id==="telephone")>=11000);}
 assert.deepEqual(workflowSteps(workflows.find(item=>item.id==="suivi")!,true).map(step=>step.verb),["Repérer","Vérifier","Contacter","Réponse","Planifier"]);
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
 assert.match(scene("suivi",2,{channel:"call"}),/Assistant vocal/);
 assert.match(scene("suivi",2,{channel:"email"}),/EMAIL ENVOYÉ/);
 assert.match(scene("application",5),/Monstera/);
 assert.match(scene("application",5,{appKind:"property"}),/Fissure apparente/);
 assert.ok(workflows.some(s=>s.id==="application"));assert.ok(!workflows.some(s=>s.id==="rapport"));
});

test("l’appel présente une forme d’onde et aucune bulle de chat",()=>{
 const call=scene("telephone",2);assert.match(call,/call-waveform/);assert.match(call,/APPEL EN COURS/);assert.ok(!call.includes("conversation-line"));
});
test("la relance sépare le contact envoyé, la réponse et la tâche",()=>{
 assert.match(scene("suivi",2),/EMAIL ENVOYÉ/);assert.ok(!scene("suivi",2).includes("vendredi à 14 h"));
 assert.match(scene("suivi",3),/vendredi à 14 h/);assert.ok(!scene("suivi",3).includes("crm-task"));assert.match(scene("suivi",5),/crm-task/);
});
