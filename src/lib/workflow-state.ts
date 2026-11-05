export type WorkflowState = { step: number; phase: "idle" | "running" | "paused" | "approval" | "complete"; approvalRequired: boolean };
export type WorkflowAction = "start" | "tick" | "next" | "pause" | "resume" | "approve" | "reset" | { type: "configure"; approvalRequired: boolean };
export const initialWorkflowState: WorkflowState = { step: 0, phase: "idle", approvalRequired: true };

export function workflowReducer(state: WorkflowState, action: WorkflowAction): WorkflowState {
  if (typeof action === "object") return { ...initialWorkflowState, approvalRequired: action.approvalRequired };
  if (action === "reset") return { ...initialWorkflowState, approvalRequired: state.approvalRequired };
  if (action === "start" && state.phase === "idle") return { ...state, step: 0, phase: "running" };
  if (action === "pause" && state.phase === "running") return { ...state, phase: "paused" };
  if (action === "resume" && state.phase === "paused") return { ...state, phase: "running" };
  if (action === "approve" && state.phase === "approval") return { ...state, step: 5, phase: "running" };
  if ((action === "tick" && state.phase === "running") || (action === "next" && (state.phase === "running" || state.phase === "paused"))) {
    if (state.step === 5) return { ...state, phase: "complete" };
    if (state.step === 3) return state.approvalRequired ? { ...state, step: 4, phase: "approval" } : { ...state, step: 5 };
    return { ...state, step: state.step + 1 };
  }
  return state;
}

// Lecture volontairement lente ; la recherche dispose de plus de temps à l’écran.
export function workflowDelay(hasResearch: boolean): number { return hasResearch ? 10000 : 7500; }
