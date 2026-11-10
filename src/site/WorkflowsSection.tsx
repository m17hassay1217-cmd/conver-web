import { Arrow } from '../components/Arrow';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useReducedMotion } from './motion';
import { workflowDemos, unifiedStages, type WorkflowDemo, type WorkflowRole } from './workflow-data';
import './method-workflows.css';

const roleClass = (role: WorkflowRole) => role.toLowerCase();
gsap.registerPlugin(Flip, DrawSVGPlugin, MotionPathPlugin);

type DiagramProps = { workflow: WorkflowDemo; workflowIndex: number; step: number; finished: boolean; playing: boolean; staticComplete: boolean; playbackId: number; onStep: (step: number) => void; onComplete: (index: number) => void };

function WorkflowDiagram({ workflow, workflowIndex, step, finished, playing, staticComplete, playbackId, onStep, onComplete }: DiagramProps) {
  const diagramRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const playingRef = useRef(playing);
  playingRef.current = playing;

  useLayoutEffect(() => {
    const diagram = diagramRef.current;
    if (!diagram) return;
    const paths = Array.from(diagram.querySelectorAll<SVGPathElement>('.cv-flow-edge-active'));
    const bases = Array.from(diagram.querySelectorAll<SVGPathElement>('.cv-flow-edge-base'));
    const signal = diagram.querySelector<SVGCircleElement>('.cv-flow-signal');
    const symbols = Array.from(diagram.querySelectorAll<HTMLElement>('.cv-flow-node-symbol'));
    let context: gsap.Context | undefined;
    let measuredWidth = 0;
    const build = () => {
      const width = diagram.getBoundingClientRect().width;
      if (Math.abs(width - measuredWidth) < .5) return;
      measuredWidth = width;
      const time = timelineRef.current?.time() ?? 0;
      context?.revert();
      const origin = diagram.getBoundingClientRect();
      const centers = symbols.map(symbol => { const rect = symbol.getBoundingClientRect(); return rect.left - origin.left + rect.width / 2; });
      paths.forEach((path, i) => {
        const d = `M${centers[i]} 28H${centers[i + 1]}`;
        path.setAttribute('d', d);
        bases[i].setAttribute('d', d);
      });
      context = gsap.context(() => {
        gsap.set(paths, { drawSVG: staticComplete ? '100%' : '0%' });
        gsap.set(signal, { x: centers[0], y: 28, opacity: staticComplete ? 0 : 1 });
        if (staticComplete) { timelineRef.current = null; return; }
        // One clock owns signal travel, edge activation and all six semantic steps.
        const timeline = gsap.timeline({ paused: true, onComplete: () => onComplete(workflowIndex) });
        paths.forEach((path, i) => {
          const start = .22 + i * .65;
          timeline.to(path, { drawSVG: '100%', duration: .48, ease: 'none' }, start)
            .to(signal, { motionPath: { path, align: path, alignOrigin: [.5, .5] }, duration: .48, ease: 'none' }, start)
            .call(() => onStep(i + 1), [], start + .48);
        });
        timeline.to(signal, { opacity: 0, duration: .18 }, 3.72);
        timeline.time(time, true);
        timelineRef.current = timeline;
        if (playingRef.current) timeline.play();
      }, diagram);
    };
    build();
    const observer = new ResizeObserver(build);
    observer.observe(diagram);
    return () => { observer.disconnect(); context?.revert(); timelineRef.current = null; };
  }, [workflow.id, workflowIndex, playbackId, staticComplete, onStep, onComplete]);

  useLayoutEffect(() => { if (playing) timelineRef.current?.play(); else timelineRef.current?.pause(); }, [playing]);

  return <div className="cv-flow-scroll" role="region" tabIndex={0} aria-label={`${workflow.name}: six-stage workflow. Scroll horizontally on smaller screens.`}>
    <div ref={diagramRef} className="cv-flow-canvas">
      <svg className="cv-flow-connections" aria-hidden="true" width="100%" height="56"><g>{Array.from({ length: 5 }, (_, i) => <g key={i}><path className="cv-flow-edge-base"/><path className="cv-flow-edge-active"/></g>)}</g><circle className="cv-flow-signal" cx="0" cy="0" r="3.5"/></svg>
    <ol className="cv-flow-nodes">
      {workflow.nodes.map((node, i) => <li key={node.label} data-status={i < step || finished ? 'complete' : i === step ? 'active' : 'waiting'} className={`cv-flow-node cv-role-${roleClass(node.role)}`}>
        <div className="cv-flow-node-symbol" aria-hidden="true">{node.role === 'AI' ? '✧' : node.role === 'Human' ? <svg viewBox="0 0 24 24"><circle cx="12" cy="7" r="3"/><path d="M6 20v-3a6 6 0 0 1 12 0v3"/></svg> : node.role === 'Automation' ? <svg viewBox="0 0 24 24"><path d="M5 5h14v14H5zM9 9h6v6H9zM8 2v3M16 2v3M8 19v3M16 19v3M2 8h3M2 16h3M19 8h3M19 16h3"/></svg> : <svg viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6M9 16h6"/></svg>}</div>
        <span className="cv-flow-role">{node.role}</span>
        <h4>{node.label}</h4>
        <span className="cv-flow-node-order">0{i + 1}<span>{i < step || finished ? ' ✓' : i === step ? ' / active' : ''}</span></span>
      </li>)}
    </ol></div>
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
  const sectionRef = useRef<HTMLElement>(null);
  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [playbackId, setPlaybackId] = useState(0);
  const [completed, setCompleted] = useState<boolean[]>([false, false, false, false]);
  const [announcement, setAnnouncement] = useState('Select Intelligent qualification to begin.');
  const next = completed.findIndex(done => !done);
  const allComplete = completed.every(Boolean);

  const captureLayout = useCallback(() => {
    if (reduced || !sectionRef.current) return;
    flipState.current = Flip.getState(sectionRef.current.querySelectorAll('.cv-workflow-rail, .cv-workflow-bottom, .cv-workflow-result'));
  }, [reduced]);

  useLayoutEffect(() => {
    const state = flipState.current;
    flipState.current = null;
    if (!state || reduced) return;
    const context = gsap.context(() => {
      Flip.from(state, { duration: .58, ease: 'power3.inOut', nested: true, prune: true, scale: false });
      if (active !== null) gsap.fromTo('.cv-workflow-panel', { opacity: .25 }, { opacity: 1, duration: .4, delay: .12 });
    }, sectionRef);
    return () => context.revert();
  }, [active, completed, reduced]);

  const finish = useCallback((workflowIndex: number, collapse = true) => {
    captureLayout();
    const panel = sectionRef.current?.querySelector(`#cv-workflow-panel-${workflowDemos[workflowIndex].id}`);
    if (collapse && panel?.contains(document.activeElement)) sectionRef.current?.querySelector<HTMLButtonElement>(`#cv-workflow-trigger-${workflowDemos[workflowIndex].id}`)?.focus({ preventScroll: true });
    setCompleted(previous => previous.map((done, i) => i === workflowIndex || done));
    setStep(5);
    setPlaying(false);
    if (collapse) setActive(null);
    setAnnouncement(`${workflowDemos[workflowIndex].name} complete. ${workflowDemos[workflowIndex].change}`);
  }, [captureLayout]);

  useLayoutEffect(() => {
    if (reduced && active !== null && playing) finish(active, false);
  }, [reduced, active, playing, finish]);

  const open = (workflowIndex: number, replay = false) => {
    captureLayout();
    if (active === workflowIndex && !replay) { setActive(null); setPlaying(false); return; }
    setActive(workflowIndex);
    const finished = completed[workflowIndex] && !replay;
    setReviewing(finished || reduced);
    setPlaybackId(previous => previous + 1);
    setStep(reduced || finished ? 5 : 0);
    setPlaying(!reduced && !finished);
    setAnnouncement(`${workflowDemos[workflowIndex].name}. ${finished || reduced ? 'Complete workflow shown.' : 'Demonstration started. Pause or complete at any time.'}`);
    if (reduced) setCompleted(previous => previous.map((done, i) => i === workflowIndex || done));
  };

  return <section ref={sectionRef} id="workflows" className="cv-section cv-workflows-section" data-section="06" aria-labelledby="cv-workflows-heading">
    <div className="cv-container">
      <header className="cv-workflows-header"><div><p className="cv-eyebrow">06 — How AI changes the workflow</p><h2 className="cv-title" id="cv-workflows-heading">See where the<br/>work changes.</h2></div><div className="cv-workflows-intro"><p className="cv-copy">Intelligence interprets. Automation moves the work. People retain authority.</p><p>Explore four potential interventions in a commercial cleaning workflow.</p></div></header>
      <div className="cv-workflow-guide"><p><span className={allComplete ? 'is-complete' : ''}/>{allComplete ? 'All four explored. See the connected workflow below.' : 'Select the highlighted workflow to see what changes.'}</p><span>{completed.filter(Boolean).length} / 4 explored</span></div>
      <div className="cv-workflow-rails">
        {workflowDemos.map((workflow, i) => {
          const expanded = active === i;
          const done = completed[i];
          const highlighted = next === i && !expanded;
          return <article key={workflow.id} data-flip-id={`workflow-${workflow.id}`} className={`cv-workflow-rail ${expanded ? 'is-expanded' : ''} ${done ? 'is-completed' : ''} ${highlighted ? 'is-next' : ''} ${active !== null && !expanded ? 'is-secondary' : ''}`}>
            <h3 className="cv-workflow-rail-heading"><button id={`cv-workflow-trigger-${workflow.id}`} type="button" className="cv-workflow-trigger" aria-expanded={expanded} aria-controls={`cv-workflow-panel-${workflow.id}`} onClick={() => open(i)}>
              <span className="cv-workflow-order">0{i + 1}</span><span className="cv-workflow-name">{workflow.name}<span>{done ? workflow.change : workflow.condition}</span></span>
              <span className="cv-workflow-mini" aria-hidden="true">{workflow.nodes.map((node, j) => <i key={j} data-role={node.role}/>)}</span>
              <span className="cv-workflow-state">{expanded ? 'Close' : done ? 'Explore again' : highlighted ? 'Explore next' : 'Explore'} <span aria-hidden="true">{done && !expanded ? '✓' : expanded ? '−' : '+'}</span></span>
            </button></h3>
            {expanded && <div id={`cv-workflow-panel-${workflow.id}`} role="region" aria-labelledby={`cv-workflow-trigger-${workflow.id}`} className="cv-workflow-panel">
              <div className="cv-flow-topline"><p><span>Potential original condition</span>{workflow.condition}</p><div className="cv-flow-playback">{!reduced && <button type="button" onClick={() => { if (step === 5 && !playing) open(i, true); else setPlaying(value => !value); }}>{step === 5 && !playing ? 'Replay' : playing ? 'Pause' : 'Play'}</button>}<button type="button" onClick={() => finish(i)}>{done ? 'Close workflow' : 'Complete demo'} <span aria-hidden="true"><Arrow/></span></button></div></div>
              <WorkflowDiagram workflow={workflow} workflowIndex={i} step={step} finished={step === 5 && !playing} playing={playing} staticComplete={reduced || reviewing} playbackId={playbackId} onStep={setStep} onComplete={finish}/>
              <div className="cv-flow-current" aria-live={playing ? 'off' : 'polite'}><span className={`cv-flow-current-role cv-role-${roleClass(workflow.nodes[step].role)}`}>{workflow.nodes[step].role}</span><div><h4>{workflow.nodes[step].label}</h4><p>{workflow.nodes[step].detail}</p></div><span className="cv-flow-counter">0{step + 1} / 06</span></div>
              <div className="cv-flow-responsibilities">
                <div className="cv-responsibility-ai"><h4><span>✧</span> AI interpretation</h4><ul>{workflow.ai.map(action => <li key={action}>{action}</li>)}</ul></div>
                <div className="cv-responsibility-automation"><h4><span aria-hidden="true"><svg viewBox="0 0 20 20"><path d="M4 3v10h11M11 9l4 4-4 4"/></svg></span> Conventional automation</h4><ul>{workflow.automation.map(action => <li key={action}>{action}</li>)}</ul></div>
                <div className="cv-responsibility-human"><h4><span aria-hidden="true">◇</span> Human control</h4><ul>{workflow.human.map(action => <li key={action}>{action}</li>)}</ul></div>
              </div>
              <p className="cv-flow-potential"><span>Potential change</span>{workflow.change}</p>
            </div>}
          </article>;
        })}
      </div>
      <div className="cv-workflow-bottom" data-flip-id="workflow-controls"><div className="cv-workflow-legend" aria-label="Workflow roles"><span><i className="cv-legend-ai"/>AI interpretation</span><span><i className="cv-legend-automation"/>Automated action</span><span><i className="cv-legend-human"/>Human authority</span></div><button type="button" className="cv-workflow-replay" onClick={() => { captureLayout(); setCompleted([false, false, false, false]); setActive(null); setPlaying(false); setStep(0); setAnnouncement('Demonstrations reset. Select Intelligent qualification to begin.'); }}>Replay all <span aria-hidden="true">↻</span></button></div>
      <p className="cv-workflow-control-note">{reduced ? 'Reduced motion: select a workflow to view its complete state.' : 'Each demonstration takes about four seconds. Pause to inspect, or complete it at any time.'} AI does not approve prices, scope or commercial commitments.</p>
      <div className="cv-workflow-result" data-flip-id="workflow-result">{allComplete && <UnifiedWorkflow/>}</div>
      <div className="cv-sr-only" role="status" aria-live="polite">{announcement}</div>
    </div>
  </section>;
}

export default WorkflowsSection;
