export type WorkflowRole = 'Input' | 'AI' | 'Automation' | 'Human';

export interface WorkflowNode {
  label: string;
  role: WorkflowRole;
  detail: string;
}

export interface WorkflowDemo {
  id: string;
  name: string;
  short: string;
  condition: string;
  nodes: WorkflowNode[];
  ai: string[];
  automation: string[];
  human: string[];
  change: string;
}

export const workflowDemos: WorkflowDemo[] = [
  {
    id: 'qualification',
    name: 'Intelligent qualification',
    short: 'Qualification',
    condition: 'Context-sensitive qualification and routing are inconsistent.',
    nodes: [
      { label: 'Enquiry received', role: 'Input', detail: 'The original enquiry enters the workflow with its customer and site context.' },
      { label: 'Requirements interpreted', role: 'AI', detail: 'Interpret enquiry text and extract site and service requirements.' },
      { label: 'Missing information detected', role: 'AI', detail: 'Identify missing details. Automation can request those details where authorized.' },
      { label: 'Appropriate route recommended', role: 'AI', detail: 'Suggest an appropriate next step for the requirements and available information.' },
      { label: 'Human exception / feasibility review', role: 'Human', detail: 'People decide feasibility and handle unusual requests or important exceptions.' },
      { label: 'Estimating or survey readiness', role: 'Automation', detail: 'Update enquiry records, then route the approved information and tasks.' },
    ],
    ai: ['Interpret enquiry text', 'Extract site and service requirements', 'Identify missing details', 'Suggest an appropriate next step'],
    automation: ['Request missing details where authorized', 'Update enquiry records', 'Route information and tasks'],
    human: ['Decide feasibility', 'Handle unusual requests or important exceptions'],
    change: 'Fewer unnecessary assessments and better-prepared opportunities.',
  },
  {
    id: 'specification',
    name: 'Specification integrity',
    short: 'Specification',
    condition: 'Survey information and quotation requirements are not reliably reconciled.',
    nodes: [
      { label: 'Survey notes / messages', role: 'Input', detail: 'Survey notes, customer messages and specifications enter together.' },
      { label: 'Requirement comparison', role: 'AI', detail: 'Compare the survey notes, customer messages and specifications.' },
      { label: 'Contradiction detection', role: 'AI', detail: 'Identify missing or contradictory requirements and draft a change summary.' },
      { label: 'Controlled revision record', role: 'Automation', detail: 'Maintain version references, notify responsible estimators and track unresolved changes.' },
      { label: 'Estimator approval', role: 'Human', detail: 'A responsible person approves scope, prices and commercial commitments.' },
      { label: 'Updated quotation inputs', role: 'Automation', detail: 'Carry approved revisions into the quotation inputs with their version references.' },
    ],
    ai: ['Compare survey notes, customer messages and specifications', 'Identify missing or contradictory requirements', 'Draft change summaries'],
    automation: ['Maintain version references', 'Notify responsible estimators', 'Track unresolved changes'],
    human: ['Approve scope', 'Approve prices', 'Approve commercial commitments'],
    change: 'Less avoidable quotation rework and more consistent scope information.',
  },
  {
    id: 'progression',
    name: 'Decision progression',
    short: 'Progression',
    condition: 'Outstanding proposal decisions lack dependable ownership and next-action tracking.',
    nodes: [
      { label: 'Proposal sent', role: 'Input', detail: 'An issued proposal begins a traceable decision process.' },
      { label: 'Questions / dependencies identified', role: 'AI', detail: 'Interpret outstanding correspondence, identify unresolved commercial questions and suggest relevant next actions.' },
      { label: 'Owner assigned', role: 'Automation', detail: 'Make responsibility and due dates visible to the relevant team.' },
      { label: 'Contextual follow-up', role: 'Automation', detail: 'Send authorized follow-ups using the relevant context.' },
      { label: 'Exception escalation', role: 'Automation', detail: 'Escalate unresolved items to a person for negotiation, commitments or sensitive objections.' },
      { label: 'Customer decision', role: 'Human', detail: 'People negotiate, approve commitments and handle sensitive objections and customer decisions.' },
    ],
    ai: ['Interpret outstanding correspondence', 'Identify unresolved commercial questions', 'Suggest relevant next actions'],
    automation: ['Track due dates', 'Send authorized follow-ups', 'Escalate unresolved items'],
    human: ['Negotiate', 'Approve commitments', 'Handle sensitive objections and customer decisions'],
    change: 'More consistent proposal progression and fewer unattended next actions.',
  },
  {
    id: 'expansion',
    name: 'Existing-account expansion',
    short: 'Account expansion',
    condition: 'New requirements are not reliably associated with existing accounts and agreements.',
    nodes: [
      { label: 'New service / site enquiry', role: 'Input', detail: 'A requirement for an additional service or site enters the workflow.' },
      { label: 'Account relationship recognition', role: 'AI', detail: 'Relate incoming information to known customers and sites.' },
      { label: 'Existing agreement comparison', role: 'AI', detail: 'Identify relevant agreement context for the new requirements.' },
      { label: 'Opportunity flagged', role: 'Automation', detail: 'Create a linked opportunity record, notify the account manager and maintain follow-up visibility.' },
      { label: 'Account-manager review', role: 'Human', detail: 'Confirm commercial relevance, review requirements and authorize proposals.' },
      { label: 'Appropriate commercial proposal', role: 'Human', detail: 'An appropriate proposal proceeds only with human commercial authorization.' },
    ],
    ai: ['Relate incoming information to known customers and sites', 'Identify relevant agreement context', 'Flag potential additional work'],
    automation: ['Create linked opportunity records', 'Notify account managers', 'Maintain follow-up visibility'],
    human: ['Confirm commercial relevance', 'Review requirements', 'Authorize proposals'],
    change: 'Additional work is identified and assessed rather than being overlooked.',
  },
];

export const unifiedStages = ['Enquiry', 'Qualification', 'Site requirements / survey', 'Specification', 'Quotation', 'Approval', 'Confirmed work'];
