import { Arrow } from '../components/Arrow';
import { useEffect, useState } from 'react';
import { useSceneProgress } from './motion';
import './outcomes-implementation.css';

const stages = [
  {
    question: 'Will this disrupt my existing operations?',
    title: 'Map & Connect',
    copy: 'We identify what already works, where intervention is justified and how the new system should connect without blindly replacing existing processes.',
    readiness: 'Connected',
    detail: 'Selective connections. Your existing workflow stays intact.',
  },
  {
    question: 'How long will implementation take?',
    title: 'Configure & Test',
    copy: 'Timing depends on the systems, scope, data and exceptions involved. We configure the selected intervention, test its behavior and agree on rollout conditions.',
    readiness: 'Configured / Tested',
    detail: 'Example inputs and expected outputs, in an isolated test lane.',
  },
  {
    question: 'What if something goes wrong?',
    title: 'Launch with Safeguards',
    copy: 'Consequential decisions remain controlled. Human approvals, exception handling and fallback paths are introduced before wider activation.',
    readiness: 'Safeguarded / Launched',
    detail: 'An uncertain input is routed to a person before a fallback is authorized.',
  },
  {
    question: 'What happens after launch?',
    title: 'Monitor & Maintain',
    copy: 'We monitor performance, inspect failures, maintain integrations and refine the system as requirements change.',
    readiness: 'Monitored / Maintained',
    detail: 'An illustrative alert moves from detection through inspection to resolution.',
  },
];

const workflow = ['Enquiry', 'Survey', 'Quote', 'Approval', 'Booked Work'];
type MonitorStatus = 'alert' | 'inspected' | 'resolved';

function useStaticImplementation(setInteractive: (value: number | null) => void) {
  const [staticScene, setStaticScene] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 820px), (prefers-reduced-motion: reduce)');
    const update = () => {
      setStaticScene(media.matches);
      if (media.matches) setInteractive(3);
    };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [setInteractive]);
  return staticScene;
}

interface WorkflowDiagramProps {
  stage: number;
  approved: boolean;
  monitor: MonitorStatus;
  testRun: number;
}

function WorkflowDiagram({ stage, approved, monitor, testRun }: WorkflowDiagramProps) {
  const present = (minimum: number) => `cv-impl-layer ${stage >= minimum ? 'is-present' : ''}`;
  return (
    <>
      <svg className="cv-impl-diagram" viewBox="0 0 760 488" role="img" aria-labelledby="cv-implementation-diagram-title cv-implementation-diagram-desc">
        <title id="cv-implementation-diagram-title">Controlled integration with an existing sales workflow</title>
        <desc id="cv-implementation-diagram-desc">Enquiry, Survey, Quote, Approval and Booked Work remain structurally intact. A separate Converdive layer adds selective connections, isolated testing, human approval, authorized fallback and monitoring across the workflow.</desc>
        <defs>
          <marker id="cv-impl-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="m1 1 5 3-5 3" fill="none" stroke="currentColor" strokeWidth="1.2" /></marker>
        </defs>
        <text className="cv-impl-svg-eyebrow" x="24" y="28">YOUR EXISTING COMMERCIAL WORKFLOW</text>
        <text className="cv-impl-svg-caption cv-impl-existing-label" x="736" y="28" textAnchor="end">Structure preserved</text>

        <g className={`cv-impl-main-links ${stage >= 3 ? 'is-monitored' : ''}`} fill="none" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#cv-impl-arrow)">
          {[144, 292, 440, 588].map((x, linkIndex) => <path className={stage >= 2 && linkIndex >= 2 ? approved ? 'cv-impl-route-authorized' : 'cv-impl-route-held' : ''} key={x} d={`M${x} 104h28`} />)}
        </g>

        <g className={`${present(0)} cv-impl-connections`} fill="none" stroke="currentColor" strokeWidth="1.3" strokeDasharray="3 5">
          <path d="M84 136v36M380 136v36M676 136v36" />
        </g>

        {workflow.map((name, nodeIndex) => (
          <g className={`cv-impl-existing-node ${stage >= 3 ? 'is-monitored' : ''}`} key={name}>
            <rect x={24 + nodeIndex * 148} y="72" width="120" height="64" rx="5" />
            <text x={84 + nodeIndex * 148} y="109" textAnchor="middle">{name}</text>
            <circle className="cv-impl-port" cx={84 + nodeIndex * 148} cy="136" r={nodeIndex % 2 === 0 ? 3 : 0} />
          </g>
        ))}

        <g className={present(2)}>
          <text className="cv-impl-svg-live-label" x="584" y="158" textAnchor="end">{approved ? 'SELECTED ROUTE LIVE · AUTHORIZED' : 'SELECTED ROUTE · APPROVAL REQUIRED'}</text>
        </g>

        <g className={`${present(0)} cv-impl-integration-group`}>
          <rect className="cv-impl-integration" x="24" y="184" width="712" height="56" rx="5" />
          <path className="cv-impl-integration-symbol" d="M44 204h16v16H44zM51 197h16v16H51" fill="none" />
          <text className="cv-impl-svg-integration-title" x="84" y="209">Converdive integration layer</text>
          <text className="cv-impl-svg-caption" x="84" y="226">Selective intervention across the existing workflow</text>
          <text className="cv-impl-svg-status" x="716" y="216" textAnchor="end">CONNECTED</text>
        </g>

        <g className={`${present(1)} cv-impl-test-group`}>
          <rect className="cv-impl-test-boundary" x="24" y="268" width="712" height="72" rx="5" />
          <text className="cv-impl-svg-lane-label" x="40" y="284">ISOLATED TEST LANE / NOT LIVE</text>
          <path className="cv-impl-test-path" d="M184 312h104M472 312h80" fill="none" markerEnd="url(#cv-impl-arrow)" />
          <text className="cv-impl-svg-small" x="44" y="310">Example enquiry</text>
          <text className="cv-impl-svg-caption" x="44" y="326">Test input</text>
          <rect className="cv-impl-config-node" x="292" y="296" width="176" height="32" rx="4" />
          <text className="cv-impl-svg-small" x="380" y="317" textAnchor="middle">Configured rules</text>
          <text className="cv-impl-svg-small" x="572" y="310">Expected output</text>
          <text className="cv-impl-svg-caption cv-impl-validated" x="572" y="326">✓ Validated</text>
          {stage === 1 && <circle key={testRun} className="cv-impl-test-signal" cx="192" cy="312" r="3" aria-hidden="true" />}
        </g>

        <g className={`${present(2)} cv-impl-safeguard-group ${approved ? 'is-approved' : 'is-reviewing'}`}>
          <path className="cv-impl-safeguard-line" d="M24 368h712" />
          <text className="cv-impl-svg-lane-label" x="24" y="390">LIVE ROUTE / HUMAN APPROVAL &amp; EXCEPTION HANDLING</text>
          <path className="cv-impl-review-path" d="M176 422h108M476 422h72" fill="none" markerEnd="url(#cv-impl-arrow)" />
          <text className="cv-impl-svg-small cv-impl-warning" x="44" y="419">Uncertain input</text>
          <text className="cv-impl-svg-caption" x="44" y="435">Route to a person</text>
          <rect className="cv-impl-review-node" x="288" y="404" width="184" height="36" rx="4" />
          <text className="cv-impl-svg-small" x="380" y="427" textAnchor="middle">{approved ? 'Human approved ✓' : 'Human review'}</text>
          <rect className="cv-impl-fallback-node" x="552" y="404" width="184" height="36" rx="4" />
          <text className="cv-impl-svg-small" x="644" y="427" textAnchor="middle">{approved ? 'Authorized fallback' : 'Fallback on hold'}</text>
        </g>

        <g className={`${present(3)} cv-impl-monitor-overlay`} data-monitor={monitor}>
          <rect className="cv-impl-monitor-boundary" x="24" y="480" width="712" height="48" rx="5" />
          <circle className="cv-impl-monitor-dot" cx="44" cy="504" r="3" />
          <text className="cv-impl-svg-small" x="58" y="510">Monitoring</text>
          <path className="cv-impl-monitor-track" d="M308 504h100M464 504h104" />
          <text className={`cv-impl-svg-monitor-step ${monitor === 'alert' ? 'is-current' : ''}`} x="276" y="509" textAnchor="middle">Alert</text>
          <text className={`cv-impl-svg-monitor-step ${monitor === 'inspected' ? 'is-current' : ''}`} x="436" y="509" textAnchor="middle">Inspect</text>
          <text className={`cv-impl-svg-monitor-step ${monitor === 'resolved' ? 'is-current' : ''}`} x="636" y="509" textAnchor="middle">{monitor === 'resolved' ? 'Resolved ✓' : 'Resolve'}</text>
        </g>
      </svg>

      <div className="cv-impl-mobile-diagram" aria-label="Existing workflow with cumulative implementation layers">
        <p className="cv-impl-mobile-eyebrow">Your existing commercial workflow</p>
        <ol className={`cv-impl-mobile-workflow ${stage === 3 ? 'is-monitored' : ''}`}>
          {workflow.map(name => <li key={name}><span>{name}</span></li>)}
        </ol>
        <div className="cv-impl-mobile-integration"><i aria-hidden="true" /><div><strong>Converdive integration layer</strong><span>Selective connections across your workflow</span></div></div>
        {stage >= 1 && <div className="cv-impl-mobile-layer cv-impl-mobile-test"><p>Isolated test lane · Not live</p><div><span>Example enquiry</span><b aria-hidden="true">→</b><span>Configured rules</span><b aria-hidden="true">→</b><span>Expected output <em>✓ Validated</em></span></div></div>}
        {stage >= 2 && <div className={`cv-impl-mobile-layer cv-impl-mobile-safeguards ${approved ? 'is-approved' : ''}`}><p>Human approval · Exceptions · Fallback</p><span>Uncertain input → Human review</span><strong>{approved ? '✓ Human approved · Fallback authorized' : 'Approval required · Fallback on hold'}</strong></div>}
        {stage >= 3 && <div className="cv-impl-mobile-layer cv-impl-mobile-monitor"><p>Monitor &amp; Maintain</p><span>Alert → Inspect → Resolve</span><strong>{monitor === 'resolved' ? '✓ Illustrative alert resolved' : monitor === 'inspected' ? 'Inspecting the example failure' : 'Illustrative alert detected'}</strong></div>}
      </div>
    </>
  );
}

export function ImplementationSection() {
  const { ref, index, setInteractive } = useSceneProgress(4);
  const staticScene = useStaticImplementation(setInteractive);
  const [approved, setApproved] = useState(false);
  const [monitor, setMonitor] = useState<MonitorStatus>('resolved');
  const [testRun, setTestRun] = useState(0);
  const stage = stages[index];

  useEffect(() => {
    if (index < 2) { setApproved(false); return; }
    if (index === 2) {
      setApproved(staticScene);
      if (staticScene) return;
      const approvalTimer = window.setTimeout(() => setApproved(true), 2400);
      return () => window.clearTimeout(approvalTimer);
    }
    setApproved(true);
    setMonitor(staticScene ? 'resolved' : 'alert');
    if (staticScene) return;
    const inspectionTimer = window.setTimeout(() => setMonitor('inspected'), 1100);
    const resolutionTimer = window.setTimeout(() => setMonitor('resolved'), 2400);
    return () => { window.clearTimeout(inspectionTimer); window.clearTimeout(resolutionTimer); };
  }, [index, staticScene]);

  const advanceMonitor = () => setMonitor(current => current === 'alert' ? 'inspected' : current === 'inspected' ? 'resolved' : 'alert');

  return (
    <section id="implementation" data-section="08" className="cv-section cv-implementation" ref={ref} aria-labelledby="cv-implementation-title" data-implementation-stage={index}>
      <div className="cv-implementation-pin">
        <div className="cv-container cv-implementation-content">
          <header className="cv-implementation-header">
            <p className="cv-eyebrow">08 / Built around your business</p>
            <h2 className="cv-title" id="cv-implementation-title">How does this work inside<br />your existing business?</h2>
          </header>

          <div className="cv-implementation-layout">
            <div className="cv-implementation-narrative">
              <nav className="cv-implementation-stage-selector" aria-label="Explore implementation stages">
                {stages.map((item, stageIndex) => <button type="button" key={item.title} aria-pressed={stageIndex === index} onClick={() => setInteractive(stageIndex)}><span>0{stageIndex + 1}</span><i aria-hidden="true" /><span className="cv-impl-stage-selector-label">{item.title}</span></button>)}
              </nav>
              <div className="cv-implementation-stage-copy" key={stage.title}>
                <p className="cv-implementation-question">“{stage.question}”</p>
                <p className="cv-implementation-step">0{index + 1} / Implementation</p>
                <h3>{stage.title}</h3>
                <p className="cv-copy">{stage.copy}</p>
              </div>
              <div className="cv-implementation-readiness"><span aria-hidden="true" /><p>{stage.readiness}</p></div>
            </div>

            <figure className="cv-implementation-figure">
              <div className="cv-implementation-figure-topline"><span>A controlled implementation</span><span>0{index + 1} / 04</span></div>
              <WorkflowDiagram stage={index} approved={approved} monitor={monitor} testRun={testRun} />
              <figcaption className="cv-implementation-figcaption">
                <p>{stage.detail}</p>
                {index === 1 && <button type="button" onClick={() => setTestRun(value => value + 1)}>Run example test <span aria-hidden="true"><Arrow/></span></button>}
                {index === 2 && <button type="button" onClick={() => setApproved(value => !value)}>{approved ? 'Replay exception' : 'Authorize fallback'} <span aria-hidden="true"><Arrow/></span></button>}
                {index === 3 && <button type="button" onClick={advanceMonitor}>{monitor === 'alert' ? 'Inspect alert' : monitor === 'inspected' ? 'Resolve illustration' : 'Replay alert'} <span aria-hidden="true"><Arrow/></span></button>}
              </figcaption>
              <div className="cv-implementation-example-note"><span aria-hidden="true">◇</span> Illustrative system behavior, not live production status.</div>
            </figure>
          </div>

          <div className="cv-implementation-bottomline"><p>Layer by layer. With responsibility built in.</p><span>Scroll to explore <span aria-hidden="true">↓</span></span></div>
          <p className="cv-impl-sr-status" role="status" aria-live="polite" aria-atomic="true">{index === 2 ? approved ? 'Example human approval complete. Defined fallback authorized.' : 'Example uncertainty routed to human review.' : index === 3 ? monitor === 'resolved' ? 'Illustrative alert inspected and resolved.' : monitor === 'inspected' ? 'Illustrative alert is being inspected.' : 'Illustrative monitoring alert detected.' : ''}</p>
        </div>
      </div>
    </section>
  );
}

export default ImplementationSection;
