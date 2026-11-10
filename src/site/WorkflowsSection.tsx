import { Arrow } from '../components/Arrow';
import { useEffect, useState, type CSSProperties } from 'react';
import { workflowDemos, unifiedStages, type WorkflowDemo, type WorkflowRole } from './workflow-data';
import './method-workflows.css';

const roleClass = (role: WorkflowRole) => role.toLowerCase();

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReduced(media.matches);
    change();
    media.addEventListener('change', change);
    return () => media.removeEventListener('change', change);
  }, []);
  return reduced;
}

function WorkflowDiagram({ workflow, step, finished }: { workflow: WorkflowDemo; step: number; finished: boolean }) {
  return <div className="cv-flow-scroll" role="region" tabIndex={0} aria-label={`${workflow.name}: six-stage workflow. Scroll horizontally on smaller screens.`}>
    <ol className="cv-flow-nodes" style={{ '--flow-progress': step / 5 } as CSSProperties}>
      <span className="cv-flow-track" aria-hidden="true"><span/><i/></span>
      {workflow.nodes.map((node, i) => <li key={node.label} data-status={i < step || finished ? 'complete' : i === step ? 'active' : 'waiting'} className={`cv-flow-node cv-role-${roleClass(node.role)}`}>
        <div className="cv-flow-node-symbol" aria-hidden="true">{node.role === 'AI' ? '✧' : node.role === 'Human' ? <svg viewBox="0 0 24 24"><circle cx="12" cy="7" r="3"/><path d="M6 20v-3a6 6 0 0 1 12 0v3"/></svg> : node.role === 'Automation' ? <svg viewBox="0 0 24 24"><path d="M5 5h14v14H5zM9 9h6v6H9zM8 2v3M16 2v3M8 19v3M16 19v3M2 8h3M2 16h3M19 8h3M19 16h3"/></svg> : '↳'}</div>
        <span className="cv-flow-role">{node.role}</span>
        <h4>{node.label}</h4>
        <span className="cv-flow-node-order">0{i + 1}<span>{i < step || finished ? ' ✓' : i === step ? ' / active' : ''}</span></span>
      </li>)}
    </ol>
  </div>;
}

function UnifiedWorkflow() {
  const labels = [['Enquiry'], ['Qualification'], ['Site requirements', '/ survey'], ['Specification'], ['Quotation'], ['Approval'], ['Confirmed work']];
  return <div className="cv-unified-workflow">
    <div className="cv-unified-heading"><p className="cv-eyebrow">Four interventions. One connected workflow.</p><h3>The whole journey<br/>starts to work together.</h3><p>A coherent commercial cleaning workflow, with intelligence, controlled automation and human authority in the right places.</p></div>
    <div className="cv-unified-scroll" role="region" tabIndex={0} aria-label="Unified workflow diagram. Scroll horizontally on smaller screens.">
      <svg viewBox="0 0 1184 372" role="img" aria-labelledby="cv-unified-title cv-unified-desc">
        <title id="cv-unified-title">One connected commercial cleaning workflow</title>
        <desc id="cv-unified-desc">Enquiry, Qualification, Site Requirements or Survey, Specification, Quotation, Approval, Confirmed Work. An existing-account opportunity branches from the enquiry through agreement context and account-manager review, and joins specification before quotation. Account expansion does not depend on a new booking.</desc>
        <defs><marker id="cv-unified-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0l8 4-8 4" fill="none" stroke="#7DADB5" strokeWidth="1.2"/></marker></defs>
        <g fill="none" stroke="#608B96" strokeWidth="1.2" markerEnd="url(#cv-unified-arrow)">
          {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${176 + i * 160} 108h24`}/>)}
          <path d="M108 152v100q0 8 8 8h84" strokeDasharray="4 5"/>
          <path d="M416 260h48"/>
          <path d="M704 260h40q8 0 8-8v-76q0-8-8-8H596q-8 0-8-8v-8"/>
        </g>
        {unifiedStages.map((stage, i) => <g key={stage} className={`cv-unified-node ${i === 5 ? 'is-human' : ''}`}>
          <rect x={40 + i * 160} y="64" width="136" height="88" rx="3"/>
          <text className="cv-unified-order" x={52 + i * 160} y="84">0{i + 1}{i === 5 ? ' / HUMAN' : ''}</text>
          <text x={108 + i * 160} y={labels[i].length > 1 ? 111 : 118} textAnchor="middle">{labels[i].map((line, j) => <tspan key={line} x={108 + i * 160} dy={j === 0 ? 0 : 17}>{line}</tspan>)}</text>
        </g>)}
        <g className="cv-unified-branch"><rect x="200" y="220" width="216" height="80" rx="3"/><text x="216" y="242" className="cv-unified-order">EXISTING-ACCOUNT BRANCH</text><text x="216" y="267">Relationship + agreement context</text><text x="216" y="284" className="cv-unified-small">Recognize a relevant new requirement</text></g>
        <g className="cv-unified-branch is-human"><rect x="464" y="220" width="240" height="80" rx="3"/><text x="480" y="242" className="cv-unified-order">HUMAN AUTHORITY</text><text x="480" y="267">Account-manager review</text><text x="480" y="284" className="cv-unified-small">Confirm relevance. Authorize proposals.</text></g>
        <text x="40" y="344" className="cv-unified-footnote">Existing-account opportunities join the commercial journey before a proposal is authorized.</text>
      </svg>
    </div>
    <p className="cv-workflow-disclaimer">This is a conceptual illustration of the kind of system Converdive aims to build—not evidence that a real client system is already operating.</p>
  </div>;
}

export function WorkflowsSection() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [completed, setCompleted] = useState<boolean[]>([false, false, false, false]);
  const [announcement, setAnnouncement] = useState('Select Intelligent qualification to begin.');
  const next = completed.findIndex(done => !done);
  const allComplete = completed.every(Boolean);

  const finish = (workflowIndex: number, collapse = true) => {
    setCompleted(previous => previous.map((done, i) => i === workflowIndex || done));
    setStep(5);
    setPlaying(false);
    if (collapse) setActive(null);
    setAnnouncement(`${workflowDemos[workflowIndex].name} complete. ${workflowDemos[workflowIndex].change}`);
  };

  useEffect(() => {
    if (active === null || !playing || reduced) return;
    const timer = window.setTimeout(() => {
      if (step < 5) setStep(previous => previous + 1);
      else finish(active);
    }, step === 5 ? 700 : 650);
    return () => window.clearTimeout(timer);
  }, [active, step, playing, reduced]);

  useEffect(() => {
    if (reduced && active !== null && playing) finish(active, false);
  }, [reduced, active, playing]);

  const open = (workflowIndex: number, replay = false) => {
    if (active === workflowIndex && !replay) { setActive(null); setPlaying(false); return; }
    setActive(workflowIndex);
    const finished = completed[workflowIndex] && !replay;
    setStep(reduced || finished ? 5 : 0);
    setPlaying(!reduced && !finished);
    setAnnouncement(`${workflowDemos[workflowIndex].name}. ${finished || reduced ? 'Complete workflow shown.' : 'Demonstration started. Pause or complete at any time.'}`);
    if (reduced) setCompleted(previous => previous.map((done, i) => i === workflowIndex || done));
  };

  return <section id="workflows" className="cv-section cv-workflows-section" data-section="06" aria-labelledby="cv-workflows-heading">
    <div className="cv-container">
      <header className="cv-workflows-header"><div><p className="cv-eyebrow">06 — How AI changes the workflow</p><h2 className="cv-title" id="cv-workflows-heading">See where the<br/>work changes.</h2></div><div className="cv-workflows-intro"><p className="cv-copy">Intelligence interprets. Automation moves the work. People retain authority.</p><p>Explore four potential interventions in a commercial cleaning workflow.</p></div></header>
      <div className="cv-workflow-guide"><p><span className={allComplete ? 'is-complete' : ''}/>{allComplete ? 'All four explored. See the connected workflow below.' : 'Select the highlighted workflow to see what changes.'}</p><span>{completed.filter(Boolean).length} / 4 explored</span></div>
      <div className="cv-workflow-rails">
        {workflowDemos.map((workflow, i) => {
          const expanded = active === i;
          const done = completed[i];
          const highlighted = next === i && !expanded;
          return <article key={workflow.id} className={`cv-workflow-rail ${expanded ? 'is-expanded' : ''} ${done ? 'is-completed' : ''} ${highlighted ? 'is-next' : ''} ${active !== null && !expanded ? 'is-secondary' : ''}`}>
            <h3 className="cv-workflow-rail-heading"><button id={`cv-workflow-trigger-${workflow.id}`} type="button" className="cv-workflow-trigger" aria-expanded={expanded} aria-controls={`cv-workflow-panel-${workflow.id}`} onClick={() => open(i)}>
              <span className="cv-workflow-order">0{i + 1}</span><span className="cv-workflow-name">{workflow.name}<span>{done ? workflow.change : workflow.condition}</span></span>
              <span className="cv-workflow-mini" aria-hidden="true">{workflow.nodes.map((node, j) => <i key={j} data-role={node.role}/>)}</span>
              <span className="cv-workflow-state">{expanded ? 'Close' : done ? 'Explore again' : highlighted ? 'Explore next' : 'Explore'} <span aria-hidden="true">{done && !expanded ? '✓' : expanded ? '−' : '+'}</span></span>
            </button></h3>
            {expanded && <div id={`cv-workflow-panel-${workflow.id}`} role="region" aria-labelledby={`cv-workflow-trigger-${workflow.id}`} className="cv-workflow-panel">
              <div className="cv-flow-topline"><p><span>Potential original condition</span>{workflow.condition}</p><div className="cv-flow-playback">{!reduced && <button type="button" onClick={() => { if (step === 5 && !playing) open(i, true); else setPlaying(value => !value); }}>{step === 5 && !playing ? 'Replay' : playing ? 'Pause' : 'Play'}</button>}<button type="button" onClick={() => finish(i)}>{done ? 'Close workflow' : 'Complete demo'} <span aria-hidden="true"><Arrow/></span></button></div></div>
              <WorkflowDiagram workflow={workflow} step={step} finished={step === 5 && !playing}/>
              <div className="cv-flow-current" aria-live={playing ? 'off' : 'polite'}><span className={`cv-flow-current-role cv-role-${roleClass(workflow.nodes[step].role)}`}>{workflow.nodes[step].role}</span><div><h4>{workflow.nodes[step].label}</h4><p>{workflow.nodes[step].detail}</p></div><span className="cv-flow-counter">0{step + 1} / 06</span></div>
              <div className="cv-flow-responsibilities">
                <div className="cv-responsibility-ai"><h4><span>✧</span> AI interpretation</h4><ul>{workflow.ai.map(action => <li key={action}>{action}</li>)}</ul></div>
                <div className="cv-responsibility-automation"><h4><span aria-hidden="true">↳</span> Conventional automation</h4><ul>{workflow.automation.map(action => <li key={action}>{action}</li>)}</ul></div>
                <div className="cv-responsibility-human"><h4><span aria-hidden="true">◇</span> Human control</h4><ul>{workflow.human.map(action => <li key={action}>{action}</li>)}</ul></div>
              </div>
              <p className="cv-flow-potential"><span>Potential change</span>{workflow.change}</p>
            </div>}
          </article>;
        })}
      </div>
      <div className="cv-workflow-bottom"><div className="cv-workflow-legend" aria-label="Workflow roles"><span><i className="cv-legend-ai"/>AI interpretation</span><span><i className="cv-legend-automation"/>Automated action</span><span><i className="cv-legend-human"/>Human authority</span></div><button type="button" className="cv-workflow-replay" onClick={() => { setCompleted([false, false, false, false]); setActive(null); setPlaying(false); setStep(0); setAnnouncement('Demonstrations reset. Select Intelligent qualification to begin.'); }}>Replay all <span aria-hidden="true">↻</span></button></div>
      <p className="cv-workflow-control-note">{reduced ? 'Reduced motion: select a workflow to view its complete state.' : 'Each demonstration takes about four seconds. Pause to inspect, or complete it at any time.'} AI does not approve prices, scope or commercial commitments.</p>
      {allComplete && <UnifiedWorkflow/>}
      <div className="cv-sr-only" role="status" aria-live="polite">{announcement}</div>
    </div>
  </section>;
}

export default WorkflowsSection;
