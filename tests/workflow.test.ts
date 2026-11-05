import test from "node:test";
import assert from "node:assert/strict";
import { workflowReducer, initialWorkflowState, workflowDelay, type WorkflowState } from "../src/lib/workflow-state";
import { workflows } from "../src/config/workflows";
import { demoComparisons } from "../src/config/demo-comparisons";
import { demoResearch } from "../src/config/demo-research";

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
test("les sources du chatbot correspondent à la question, uniquement à l’étape recherche", () => {
  assert.deepEqual(demoResearch("chatbot",1,"retour"),[]);
  assert.match(demoResearch("chatbot",2,"retour")[2].result,/support/);
  assert.match(demoResearch("chatbot",2,"suivi")[2].result,/suivi/);
  assert.deepEqual(demoResearch("telephone",2,"retour"),[]);
  for(const [id,step] of [["facture",2],["suivi",2],["integration",1],["rapport",1]] as const) assert.equal(demoResearch(id,step,"retour").length,3);
});
