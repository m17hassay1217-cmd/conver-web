/** Shared surface identities keep the symptom and its proposed causal structure connected. */
export const CAUSAL_CHAINS = [
  {
    id: 'qualification',
    number: '01',
    title: 'Qualification',
    material: 'glass',
    materialName: 'Glass',
    mark: 'Clouded assessment',
    problem: 'Valuable sales capacity spent on unsuitable enquiries',
    consequence: 'Time-consuming assessment or survey work produces fewer commercially viable quotations.',
    explanation: 'A promising-looking enquiry may ask for more assessment than its commercial fit warrants. The point to investigate is how the enquiry reaches the right assessment route.',
    levels: [
      'Valuable sales capacity spent on unsuitable enquiries.',
      'Enquiries follow inappropriate assessment or survey routes.',
      'Scope, complexity, location and feasibility are not evaluated together.',
      'No dependable context-sensitive qualification and routing mechanism.',
    ],
  },
  {
    id: 'specification',
    number: '02',
    title: 'Specification integrity',
    material: 'carpet',
    materialName: 'Commercial carpet',
    mark: 'Misaligned fibres',
    problem: 'Cleaning proposals repeatedly revised or incorrectly scoped',
    consequence: 'Avoidable rework, inconsistent service assumptions and delayed quotation decisions.',
    explanation: 'Requirements can change between the site visit and the proposal. If those changes do not reach the same specification, a quotation may need repeated correction.',
    levels: [
      'Cleaning proposals repeatedly revised or incorrectly scoped.',
      'Proposed scope does not fully reflect the latest agreed requirements.',
      'Survey observations, customer messages and subsequent changes are not reconciled reliably.',
      'No traceable, version-controlled requirements-to-proposal process.',
    ],
  },
  {
    id: 'progression',
    number: '03',
    title: 'Proposal progression',
    material: 'tile',
    materialName: 'Industrial tile',
    mark: 'Interrupted joint',
    problem: 'Interested prospects remain undecided after receiving proposals',
    consequence: 'Viable opportunities remain outstanding without clear progress.',
    explanation: 'Interest alone does not resolve a question, a requested revision or an internal approval. A useful investigation looks at what decision is needed next and who can make it.',
    levels: [
      'Interested prospects remain undecided after proposals.',
      'Customer questions, revisions or approval dependencies remain unresolved.',
      'The necessary next decision, responsible person or suitable timing is unclear.',
      'No dependable mechanism tracking decision readiness and next actions.',
    ],
  },
  {
    id: 'expansion',
    number: '04',
    title: 'Account expansion',
    material: 'steel',
    materialName: 'Brushed stainless steel',
    mark: 'Disconnected impressions',
    problem: 'Additional recurring-contract opportunities go unidentified',
    consequence: 'Potential additional sites or services never progress into formal commercial proposals.',
    explanation: 'A new site or service request may arrive without the context of an existing account. The relationship between that requirement and the current agreement may deserve a closer look.',
    levels: [
      'Additional recurring-contract opportunities go unidentified.',
      'New requirements are treated as isolated requests.',
      'Their relationship to existing customer sites and agreements goes unrecognized.',
      'No dependable connection between customer accounts, site-specific requirements and new commercial opportunities.',
    ],
  },
] as const;

export const CAUSAL_LEVEL_LABELS = ['Visible problem', 'Mediator 1', 'Mediator 2', 'Potential controllable root'] as const;
export const clampUnit = (value: number) => Math.min(1, Math.max(0, value));
