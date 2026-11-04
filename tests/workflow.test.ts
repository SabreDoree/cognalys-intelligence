import test from "node:test";
import assert from "node:assert/strict";
import { workflowReducer, initialWorkflowState, type WorkflowState } from "../src/lib/workflow-state";

test("simulation : la validation humaine ne peut jamais être franchie par le timer", () => {
  let state = workflowReducer(initialWorkflowState, "start");
  for (let i = 0; i < 10; i++) state = workflowReducer(state, "tick");
  assert.deepEqual(state, { step: 4, phase: "approval" });
  state = workflowReducer(state, "approve"); assert.deepEqual(state, { step: 5, phase: "running" });
  state = workflowReducer(state, "tick"); assert.equal(state.phase, "complete");
});
test("simulation : pause, reprise et reset", () => {
  let state: WorkflowState = { step: 2, phase: "running" };
  state = workflowReducer(state, "pause");
  state = workflowReducer(state, "tick"); assert.deepEqual(state, { step: 2, phase: "paused" });
  state = workflowReducer(state, "resume"); state = workflowReducer(state, "tick"); assert.equal(state.step, 3);
  assert.deepEqual(workflowReducer(state, "reset"), initialWorkflowState);
});
test("simulation : valider avant l'étape de contrôle n'a aucun effet", () => { assert.deepEqual(workflowReducer(initialWorkflowState, "approve"), initialWorkflowState); });
