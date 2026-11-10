import { useEffect } from 'react';
import type { CSSProperties } from 'react';
import { useSceneProgress } from './motion';
import './outcomes-implementation.css';

const outcomes = [
  {
    label: 'Operational relief',
    title: 'Less Work. Less to Worry About.',
    copy: 'Less repetitive administration, manual chasing and effort spent keeping the process moving.',
  },
  {
    label: 'Capacity and control',
    title: 'More Time. More Capacity. More Control.',
    copy: 'Clearer pipeline visibility, smoother progression and more room to focus on valuable opportunities.',
  },
  {
    label: 'Commercial value',
    title: 'Less Wasted Cost. More Potential Revenue.',
    copy: 'Better use of commercial resources, fewer overlooked opportunities and more potential value from recurring contracts.',
  },
];

export function OutcomesSection() {
  const { ref, index, progress, interactive, setInteractive } = useSceneProgress(3);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 820px), (prefers-reduced-motion: reduce)');
    const showComplete = () => { if (media.matches) setInteractive(2); };
    showComplete();
    media.addEventListener('change', showComplete);
    return () => media.removeEventListener('change', showComplete);
  }, [setInteractive]);

  return (
    <section
      id="outcomes"
      data-section="07"
      className="cv-section cv-outcomes"
      ref={ref}
      aria-labelledby="cv-outcomes-title"
      data-outcome={index}
      style={{ '--outcome-progress': progress } as CSSProperties}
    >
      <div className="cv-outcomes-pin">
        <div className="cv-container cv-outcomes-content">
          <header className="cv-outcomes-header">
            <p className="cv-eyebrow">07 / The owner’s perspective</p>
            <h2 className="cv-title" id="cv-outcomes-title">What do you<br />actually get?</h2>
            <p className="cv-copy cv-outcomes-intro">A better way for work to move.<br />More room for your business to grow.</p>
          </header>

          <div className="cv-outcomes-composition">
            <div className="cv-outcomes-field" aria-hidden="true">
              <div className={`cv-outcome-ripple cv-outcome-ripple-3 ${index >= 2 ? 'is-expanded' : ''}`} />
              <div className={`cv-outcome-ripple cv-outcome-ripple-2 ${index >= 1 ? 'is-expanded' : ''}`} />
              <div className="cv-outcome-ripple cv-outcome-ripple-1 is-expanded" />
              <div className="cv-outcomes-core">
                <svg viewBox="0 0 68 36" focusable="false">
                  <path d="M5 18h58M18 18V7h18v22h15V18" />
                  <rect x="1" y="14" width="8" height="8" rx="2" />
                  <rect x="28" y="14" width="8" height="8" rx="2" />
                  <rect x="59" y="14" width="8" height="8" rx="2" />
                </svg>
                <span>CONTROL</span>
              </div>
              <span className="cv-outcomes-orbit-label">Visibility · Responsibility · Reliability</span>
              <span className="cv-outcomes-orbit-number cv-outcomes-orbit-number-1">01</span>
              <span className={`cv-outcomes-orbit-number cv-outcomes-orbit-number-2 ${index >= 1 ? 'is-visible' : ''}`}>02</span>
              <span className={`cv-outcomes-orbit-number cv-outcomes-orbit-number-3 ${index >= 2 ? 'is-visible' : ''}`}>03</span>
            </div>

            <div className="cv-outcomes-list" aria-label="Three levels of owner value">
              {outcomes.map((outcome, outcomeIndex) => (
                <article
                  className={`cv-owner-outcome cv-owner-outcome-${outcomeIndex + 1} ${outcomeIndex <= index ? 'is-revealed' : ''} ${outcomeIndex === index ? 'is-current' : ''}`}
                  key={outcome.title}
                >
                  <div className="cv-owner-outcome-kicker"><span>0{outcomeIndex + 1}</span>{outcome.label}</div>
                  <h3>{outcome.title}</h3>
                  <p>{outcome.copy}</p>
                </article>
              ))}
            </div>
          </div>

          <footer className="cv-outcomes-footer">
            <div className="cv-outcomes-selectors" aria-label="Explore owner outcomes">
              {outcomes.map((outcome, outcomeIndex) => (
                <button
                  type="button"
                  key={outcome.label}
                  aria-label={`Show outcome ${outcomeIndex + 1}: ${outcome.label}`}
                  aria-pressed={index === outcomeIndex}
                  onClick={() => setInteractive(outcomeIndex)}
                ><span>0{outcomeIndex + 1}</span><i aria-hidden="true" /></button>
              ))}
            </div>
            <p>{interactive === null ? 'Scroll to expand the picture' : 'Explore each level of value'}<span aria-hidden="true"> ↓</span></p>
            <p className="cv-outcomes-qualification">Potential value, grounded in how your business works.</p>
          </footer>
        </div>
      </div>
    </section>
  );
}

export default OutcomesSection;
