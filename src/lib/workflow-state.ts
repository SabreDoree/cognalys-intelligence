export type WorkflowPlan = { stepCount:number; approvalStep:number|null };
export type WorkflowState = WorkflowPlan & {step:number;phase:"idle"|"running"|"paused"|"approval"|"complete"};
export type WorkflowAction = "start"|"tick"|"next"|"pause"|"resume"|"approve"|"reset"|{type:"configure";plan:WorkflowPlan};
export function createWorkflowState(plan:WorkflowPlan):WorkflowState {
 if(plan.stepCount<1 || !Number.isInteger(plan.stepCount) || (plan.approvalStep!==null && (plan.approvalStep<1 || plan.approvalStep>=plan.stepCount-1))) throw new Error("Invalid workflow plan");
 return {...plan,step:0,phase:"idle"};
}
export const initialWorkflowState=createWorkflowState({stepCount:6,approvalStep:4});
export function workflowReducer(state:WorkflowState,action:WorkflowAction):WorkflowState {
 if(typeof action==="object")return createWorkflowState(action.plan);
 if(action==="reset")return createWorkflowState(state);
 if(action==="start"&&state.phase==="idle")return {...state,phase:"running"};
 if(action==="pause"&&state.phase==="running")return {...state,phase:"paused"};
 if(action==="resume"&&state.phase==="paused")return {...state,phase:"running"};
 if(action==="approve"&&state.phase==="approval")return {...state,step:state.step+1,phase:"running"};
 if((action==="tick"&&state.phase==="running")||(action==="next"&&(state.phase==="running"||state.phase==="paused"))){
  if(state.step===state.stepCount-1)return {...state,phase:"complete"};
  const next=state.step+1;
  return {...state,step:next,phase:next===state.approvalStep?"approval":state.phase};
 }
 return state;
}
export function workflowDelay(longReading:boolean):number{return longReading?16000:11000;}
