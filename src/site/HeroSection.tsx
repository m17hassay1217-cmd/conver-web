import { Arrow } from '../components/Arrow';
import { useCallback, useEffect, useRef, type CSSProperties } from 'react';
import logo from '../assets/converdive-logo.svg';
import { HeroInstallation } from './HeroInstallation';
import './hero-section.css';

const OUTCOMES = [
  ['Less Admin', '-31vw', '-18vh', '-27vw', '-22vh'],
  ['Faster Responses', '27vw', '-22vh', '31vw', '-17vh'],
  ['Smoother Operations', '-30vw', '5vh', '-34vw', '-1vh'],
  ['Speed-to-Lead', '31vw', '5vh', '28vw', '10vh'],
  ['Pipeline Control', '-22vw', '24vh', '-27vw', '20vh'],
  ['More Sales Capacity', '22vw', '25vh', '27vw', '20vh'],
  ['Less Owner Chasing', '0vw', '-31vh', '5vw', '-29vh'],
];

/** A short, optional brand entrance. Completion is idempotent, including Escape. */
export function IntroSplash({ onComplete }: { onComplete: () => void }) {
  const done = useRef(false);
  const complete = useCallback(() => {
    if (done.current) return;
    done.current = true;
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onPreference = () => { if (preference.matches) complete(); };
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') complete(); };
    const timer = window.setTimeout(complete, 4750);
    onPreference();
    preference.addEventListener('change', onPreference);
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(timer);
      preference.removeEventListener('change', onPreference);
      window.removeEventListener('keydown', onKey);
    };
  }, [complete]);

  return <div className="cv-intro" aria-label="Converdive introduction" data-testid="intro-splash">
    <div className="cv-intro-stage">
      <div className="cv-intro-orbit" aria-hidden="true" />
      <div className="cv-intro-symbol"><img src={logo} alt="Converdive symbol" /></div>
      <div className="cv-intro-phrases" aria-hidden="true">
        {OUTCOMES.map(([phrase, x, y, curveX, curveY], index) => <span key={phrase}
          className="cv-intro-phrase"
          style={{ '--phrase-x': x, '--phrase-y': y, '--curve-x': curveX, '--curve-y': curveY, '--phrase-delay': `${index * 35}ms` } as CSSProperties}>
          <i />{phrase}
        </span>)}
      </div>
      <div className="cv-intro-compression" aria-hidden="true" />
      <div className="cv-intro-wordmark">Converdive</div>
      <p className="cv-intro-positioning" aria-label="For UK commercial cleaning companies.">
        {['For UK', 'commercial cleaning', 'companies.'].map((part, i) => <span key={part} style={{ '--line-index': i } as CSSProperties}>{part} </span>)}
      </p>
    </div>
    <button type="button" className="cv-intro-skip" onClick={complete}>Skip intro <span aria-hidden="true"><Arrow/></span></button>
    <span className="cv-intro-progress" aria-hidden="true" />
  </div>;
}

export function HeroSection() {
  return <section id="home" className="cv-section cv-hero" data-section="01" aria-labelledby="cv-hero-title">
    <div className="cv-hero-architecture" aria-hidden="true"><i /><i /><i /></div>
    <div className="cv-container cv-hero-content">
      <div className="cv-hero-eyebrow cv-eyebrow"><span />FOR UK COMMERCIAL CLEANING CONTRACTORS</div>
      <h1 id="cv-hero-title">How well does your<br className="cv-hero-desktop-break" /> enquiry-to-booking process<br className="cv-hero-desktop-break" /> <em>actually work?</em></h1>
      <p className="cv-hero-statement">An enquiry isn't a booked job. What happens between them<br className="cv-hero-desktop-break" /> determines how work progresses.</p>
      <p className="cv-hero-explanation">Converdive starts by understanding how your business handles enquiries, then designs targeted improvements where they could make a meaningful difference.</p>
    </div>
    <HeroInstallation />
    <div className="cv-hero-continuation" aria-hidden="true">
      <span className="cv-hero-continuation-note">A closer look at what happens between.</span>
      <svg viewBox="0 0 500 190" preserveAspectRatio="none"><defs><linearGradient id="cv-hero-path" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#65BEDB" stopOpacity="0" /><stop offset=".3" stopColor="#65BEDB" stopOpacity=".7" /><stop offset="1" stopColor="#BDE7F1" /></linearGradient></defs><path d="M350 -8C350 68 250 38 250 110V195" /></svg>
      <span className="cv-hero-scroll">SCROLL TO EXPLORE <span>↓</span></span>
    </div>
  </section>;
}
