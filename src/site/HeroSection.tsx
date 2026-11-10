import { Arrow } from '../components/Arrow';
import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { SplitText } from 'gsap/SplitText';
import logo from '../assets/converdive-logo.svg';
import { HeroFallback, HeroSceneBoundary } from './HeroFallback';
import './hero-section.css';
import { useReducedMotion } from './motion';

gsap.registerPlugin(MotionPathPlugin, SplitText);

const HeroInstallation = lazy(() => import('./HeroInstallation').then(module => ({ default: module.HeroInstallation })));

const OUTCOMES = [
  ['Less Admin', -.31, -.18, -.27, -.22],
  ['Faster Responses', .27, -.22, .31, -.17],
  ['Smoother Operations', -.30, .05, -.34, -.01],
  ['Speed-to-Lead', .31, .05, .28, .10],
  ['Pipeline Control', -.22, .24, -.27, .20],
  ['More Sales Capacity', .22, .25, .27, .20],
  ['Less Owner Chasing', 0, -.31, .05, -.29],
] as const;

/** A short, optional brand entrance. Completion is idempotent, including Escape. */
export function IntroSplash({ onComplete }: { onComplete: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const done = useRef(false);
  const complete = useCallback(() => {
    if (done.current) return;
    done.current = true;
    onComplete();
  }, [onComplete]);

  useLayoutEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onPreference = () => { if (preference.matches) complete(); };
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') complete(); };
    if (preference.matches) { complete(); return; }

    // MotionPath owns every animated transform. CSS supplies only the layout.
    // The curved anchors are viewport-relative, so all seven trajectories keep
    // their intended relationship to the symbol on a phone or wide display.
    const context = gsap.context(() => {
      const select = gsap.utils.selector(root);
      const wordmark = SplitText.create(select('.cv-intro-wordmark'), { type: 'chars', aria: 'auto' });
      const positioning = SplitText.create(select('.cv-intro-positioning'), { type: 'words', aria: 'auto' });
      gsap.set(select('.cv-intro-phrase, .cv-intro-symbol, .cv-intro-orbit, .cv-intro-compression, .cv-intro-wordmark, .cv-intro-positioning'), { xPercent: -50, yPercent: -50 });
      gsap.set(select('.cv-intro-phrase, .cv-intro-symbol, .cv-intro-orbit, .cv-intro-compression, .cv-intro-wordmark, .cv-intro-positioning'), { opacity: 0 });
      gsap.set(select('.cv-intro-progress'), { scaleX: 0, transformOrigin: 'left center' });
      gsap.set(select('.cv-intro-symbol'), { y: 12, scale: .92 });
      gsap.set(select('.cv-intro-orbit'), { rotation: -18, scale: .9 });
      gsap.set(wordmark.chars, { yPercent: 30, opacity: 0 });
      gsap.set(positioning.words, { yPercent: 45, opacity: 0 });

      const timeline = gsap.timeline({ defaults: { ease: 'power2.inOut' }, onComplete: complete });
      timeline.to(select('.cv-intro-symbol'), { opacity: 1, y: 0, scale: 1, duration: .6 }, .05)
        .to(select('.cv-intro-orbit'), { opacity: .8, rotation: -10, scale: 1, duration: .8 }, .12)
        .to(select('.cv-intro-orbit'), { opacity: 0, rotation: 0, scale: .08, duration: .85 }, 1.65)
        .to(select('.cv-intro-symbol'), { scale: .86, duration: .65 }, 1.8)
        .to(select('.cv-intro-symbol'), { opacity: 0, y: -18, scale: .8, duration: .55 }, 2.85);

      select('.cv-intro-phrase').forEach((element, index) => {
        const [, x, y, curveX, curveY] = OUTCOMES[index];
        const width = window.innerWidth;
        const height = window.innerHeight;
        gsap.set(element, { x: x * width, y: y * height, scale: .97 });
        timeline.to(element, { opacity: .9, duration: .3 }, .1 + index * .035)
          .to(element, {
            motionPath: { path: [
              { x: x * width, y: y * height },
              { x: curveX * width, y: curveY * height },
              { x: x * width * .46, y: y * height * .46 },
              { x: 0, y: 0 },
            ], curviness: .9, autoRotate: false },
            duration: 2.18, ease: 'power2.inOut',
          }, .12 + index * .035)
          .to(element, { opacity: 0, scale: .28, duration: .57 }, 1.74 + index * .035);
      });

      timeline.set(select('.cv-intro-compression'), { opacity: .65, scaleX: 8, scaleY: 8 }, 2.12)
        .to(select('.cv-intro-compression'), { scaleX: 220, scaleY: 1, y: 75, opacity: 0, duration: .65 }, 2.12)
        .set(select('.cv-intro-wordmark'), { opacity: 1 }, 2.2)
        .to(wordmark.chars, { yPercent: 0, opacity: 1, stagger: .025, duration: .5, ease: 'power3.out' }, 2.2)
        .to(select('.cv-intro-wordmark'), { opacity: 0, y: -12, duration: .35 }, 3.05)
        .set(select('.cv-intro-positioning'), { opacity: 1 }, 3.24)
        .to(positioning.words, { yPercent: 0, opacity: 1, stagger: .065, duration: .48, ease: 'power3.out' }, 3.24)
        .to(select('.cv-intro-progress'), { scaleX: 1, duration: 4.1, ease: 'none' }, 0)
        .to(root.current, { opacity: 0, yPercent: -2, duration: .33 }, 4.07);
      return () => { wordmark.revert(); positioning.revert(); };
    }, root);

    // A bounded escape hatch also covers suspended/inactive browser tabs.
    const timer = window.setTimeout(complete, 4500);
    preference.addEventListener('change', onPreference);
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(timer);
      context.revert();
      preference.removeEventListener('change', onPreference);
      window.removeEventListener('keydown', onKey);
    };
  }, [complete]);

  return <div ref={root} className="cv-intro" aria-label="Converdive introduction" data-testid="intro-splash">
    <div className="cv-intro-stage">
      <div className="cv-intro-orbit" aria-hidden="true" />
      <div className="cv-intro-symbol"><img src={logo} alt="Converdive symbol" /></div>
      <div className="cv-intro-phrases" aria-hidden="true">
        {OUTCOMES.map(([phrase]) => <span key={phrase} className="cv-intro-phrase">
          <i />{phrase}
        </span>)}
      </div>
      <div className="cv-intro-compression" aria-hidden="true" />
      <div className="cv-intro-wordmark">Converdive</div>
      <p className="cv-intro-positioning">For UK commercial cleaning companies.</p>
    </div>
    <button type="button" className="cv-intro-skip" onClick={complete}>Skip intro <span aria-hidden="true"><Arrow/></span></button>
    <span className="cv-intro-progress" aria-hidden="true" />
  </div>;
}

/** Paint the complete still before initializing an optional WebGL context. */
function DeferredInstallation() {
  const reduced=useReducedMotion();
  const [requested,setRequested]=useState(()=>window.innerWidth>820&&!matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if(!requested)return;
    let cancelled = false;
    const timer = window.setTimeout(() => { if (!cancelled) setReady(true); }, 120);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [requested]);
  return ready ? <HeroSceneBoundary><Suspense fallback={<HeroFallback />}><HeroInstallation /></Suspense></HeroSceneBoundary> : <HeroFallback onPlay={!requested&&!reduced?()=>setRequested(true):undefined} />;
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
    <DeferredInstallation />
    <div className="cv-hero-continuation" aria-hidden="true">
      <span className="cv-hero-continuation-note">A closer look at what happens between.</span>
      <svg viewBox="0 0 500 190" preserveAspectRatio="none"><defs><linearGradient id="cv-hero-path" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#65BEDB" stopOpacity="0" /><stop offset=".3" stopColor="#65BEDB" stopOpacity=".7" /><stop offset="1" stopColor="#BDE7F1" /></linearGradient></defs><path d="M350 -8C350 68 250 38 250 110V195" /></svg>
      <span className="cv-hero-scroll">SCROLL TO EXPLORE <span>↓</span></span>
    </div>
  </section>;
}
