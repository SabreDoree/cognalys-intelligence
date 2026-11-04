export type WorkflowState = { step: number; phase: "idle" | "running" | "paused" | "approval" | "complete" };
export type WorkflowAction = "start" | "tick" | "pause" | "resume" | "approve" | "reset";
export const initialWorkflowState: WorkflowState = { step: 0, phase: "idle" };

export function workflowReducer(state: WorkflowState, action: WorkflowAction): WorkflowState {
  if (action === "reset") return initialWorkflowState;
  if (action === "start" && state.phase === "idle") return { step: 0, phase: "running" };
  if (action === "pause" && state.phase === "running") return { ...state, phase: "paused" };
  if (action === "resume" && state.phase === "paused") return { ...state, phase: "running" };
  if (action === "approve" && state.phase === "approval") return { step: 5, phase: "running" };
  if (action === "tick" && state.phase === "running") {
    if (state.step === 5) return { step: 5, phase: "complete" };
    if (state.step === 3) return { step: 4, phase: "approval" };
    return { ...state, step: state.step + 1 };
  }
  return state;
}
