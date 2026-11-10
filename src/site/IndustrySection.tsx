import type { CSSProperties } from 'react';
import { useSceneProgress } from './motion';
import { clampUnit } from './causal-data';
import './causes-sections.css';

const INDUSTRIES = [
  { name: 'HVAC', x: 13, y: 17, angle: -7, code: 'HV' },
  { name: 'Plumbing', x: 52, y: 8, angle: 5, code: 'PL' },
  { name: 'Roofing', x: 6, y: 43, angle: -3, code: 'RF' },
  { name: 'Pest Control', x: 57, y: 31, angle: 7, code: 'PC' },
  { name: 'Logistics', x: 29, y: 61, angle: -6, code: 'LG' },
  { name: 'Memberships', x: 7, y: 83, angle: 4, code: 'MB' },
  { name: 'Med Spas', x: 59, y: 79, angle: -4, code: 'MS' },
  { name: 'Commercial Cleaning', x: 44, y: 54, angle: 0, code: 'CC' },
];
const REASONS = [
  { title: 'Recurring contract value', body: 'Commercial cleaning work can involve continuing service relationships, meaning one confirmed account may represent recurring business rather than a single isolated appointment.' },
  { title: 'Multi-stage commercial complexity', body: 'Enquiries may involve site-specific requirements, surveys, cleaning specifications, quotations, revisions, approvals and multiple handoffs.' },
  { title: 'Accessible regional market', body: 'Smaller and regional contractors coexist with large providers, creating a potentially addressable market for tailored workflow improvements.' },
];

export function IndustrySection() {
  const { ref, progress, interactive, setInteractive, index } = useSceneProgress(3);
  const selection = interactive === null ? progress : (interactive + 1) / 3;
  const chosen = selection > 0.58;
  return (
    <section id="industry" data-section="02" ref={ref} className="cv-section cv-industry" aria-labelledby="cv-industry-title">
      <div className="cv-industry-sticky">
        <div className="cv-container cv-industry-layout">
          <div className={`cv-industry-field ${chosen ? 'is-selected' : ''}`} style={{ '--cv-scan': `${10 + selection * 82}%` } as CSSProperties}>
            <div className="cv-field-heading"><span className="cv-kicker">A considered focus</span><span className="cv-field-index">08 industries / 01 focus</span></div>
            <div className="cv-industry-space" aria-label="Industries considered: HVAC, Plumbing, Roofing, Pest Control, Logistics, Memberships, Med Spas, and Commercial Cleaning">
              <svg className="cv-industry-selection-thread" viewBox="0 0 600 455" preserveAspectRatio="none" aria-hidden="true"><path d="M480 247C550 247 560 315 485 353S410 399 410 455" pathLength="1" style={{ strokeDashoffset: 1 - clampUnit((selection - 0.58) / 0.42) }} /></svg>
              <div className="cv-field-orbit cv-field-orbit-a" aria-hidden="true" /><div className="cv-field-orbit cv-field-orbit-b" aria-hidden="true" />
              <div className="cv-scanner-aperture" aria-hidden="true"><i /><i /><i /><i /></div>
              {INDUSTRIES.map((item, itemIndex) => (
                <div key={item.name} className={`cv-industry-marker ${itemIndex === 7 ? 'cv-industry-cleaning' : ''}`} style={{ left: `${item.x}%`, top: `${item.y}%`, '--cv-marker-angle': `${item.angle}deg` } as CSSProperties}>
                  <span className="cv-marker-symbol" aria-hidden="true">{itemIndex === 7 ? <svg viewBox="0 0 28 28"><path d="M6 8h16v13H6zM10 8V5h8v3M14 12v5M11.5 14.5h5" /></svg> : item.code}</span>
                  <span>{item.name}</span>{itemIndex === 7 && <i className="cv-selected-point" aria-hidden="true" />}
                </div>
              ))}
            </div>
            <div className="cv-field-foot"><span>Strategic selection</span><span>{chosen ? 'UK commercial cleaning' : 'Explore the fit'}</span></div>
            <svg className="cv-industry-exit" viewBox="0 0 600 180" preserveAspectRatio="none" aria-hidden="true"><path d="M410 0C410 70 515 54 515 113S470 160 470 180" pathLength="1" style={{ strokeDashoffset: 1 - clampUnit((selection - 0.58) / 0.42) }} /></svg>
          </div>
          <div className="cv-industry-copy">
            <div className="cv-industry-question"><p className="cv-eyebrow">02 / Industry selection</p><h2 id="cv-industry-title" className="cv-title">Why UK commercial <span>cleaning contractors?</span></h2></div>
            <div className="cv-reason-list">
              {REASONS.map((reason, reasonIndex) => {
                const reveal = interactive === null ? clampUnit((progress * 3 - reasonIndex) * 2 + 0.2) : 1;
                return <article className={`cv-reason ${index === reasonIndex ? 'is-current' : ''}`} key={reason.title} style={{ '--cv-wipe': `${(1 - reveal) * 100}%` } as CSSProperties}>
                  <span className="cv-reason-number">0{reasonIndex + 1}</span><div><h3>{reason.title}</h3><p>{reason.body}</p></div><span className="cv-squeegee" aria-hidden="true" />
                </article>;
              })}
            </div>
            <div className="cv-industry-controls" role="group" aria-label="Explore the three reasons">{REASONS.map((reason, i) => <button type="button" key={reason.title} aria-label={reason.title} aria-pressed={index === i} onClick={() => setInteractive(i)}>0{i + 1}</button>)}</div>
            <p className="cv-scene-note">A deliberate focus. These properties are not exclusive to cleaning, and other industries may present strong opportunities too.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
