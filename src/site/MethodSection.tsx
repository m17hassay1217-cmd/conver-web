import { Arrow } from '../components/Arrow';
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { useReducedMotion, useSceneProgress } from './motion';
import './method-workflows.css';

gsap.registerPlugin(SplitText, DrawSVGPlugin);

const methods = [
  { name: 'Diagnose', detail: 'We examine how your existing commercial workflow actually operates before deciding which problems deserve intervention.', measure: 'Reconstruct the actual workflow', instrument: 'Optical reconstruction', code: '01 / OBSERVE' },
  { name: 'Prioritize', detail: 'We identify the most consequential, controllable and commercially worthwhile point to improve.', measure: 'Focus on the change that matters', instrument: 'Precision focusing', code: '02 / FOCUS' },
  { name: 'Engineer', detail: 'We design and connect an appropriate intervention around the existing business instead of forcing a generic AI template onto it.', measure: 'Build around the existing business', instrument: 'Adaptive assembly', code: '03 / CONNECT' },
  { name: 'Verify', detail: 'We test what changed, measure performance, inspect exceptions and refine the implementation where needed.', measure: 'Calibrate against the outcome', instrument: 'Calibration and feedback', code: '04 / MEASURE' },
];

const phases = ['diagnose', 'prioritize', 'engineer', 'verify', 'synthesis'];

function PrecisionInstrument({ phase, reduced }: { phase: number; reduced: boolean }) {
  const instrumentRef = useRef<HTMLDivElement>(null);
  const ticks = Array.from({ length: 60 }, (_, i) => i * 6);
  useLayoutEffect(() => {
    if (reduced) return;
    const context = gsap.context(() => {
      if (phase === 0) gsap.fromTo('.cv-optic-signal', { x: (i) => (i - 5) * 6, y: (i) => (i - 4) * 4, opacity: .15 }, { x: 0, y: 0, opacity: 1, duration: 1, stagger: .023, ease: 'power3.out' });
      if (phase === 1) {
        gsap.fromTo('.cv-focus-candidates > circle', { opacity: 1 }, { opacity: .23, duration: .9 });
        gsap.fromTo('.cv-selected-point', { scale: 1.2, opacity: .1, svgOrigin: '340 300' }, { scale: 1, opacity: 1, duration: .8, ease: 'power3.out' });
      }
      if (phase === 3) {
        gsap.fromTo('.cv-calibration-wave', { scale: .25, opacity: .7, svgOrigin: '340 300' }, { scale: 1.25, opacity: 0, duration: 1.5, repeat: 1, ease: 'power2.out' });
        gsap.fromTo('.cv-instrument-calibration > path', { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.1, stagger: .1, ease: 'power2.inOut' });
      }
    }, instrumentRef);
    return () => context.revert();
  }, [phase, reduced]);
  return <div ref={instrumentRef} className="cv-instrument" data-phase={phases[phase]} aria-hidden="true">
    <svg viewBox="0 0 680 600" className="cv-instrument-svg">
      <defs>
        <linearGradient id="cv-metal" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#8C9B9E"/><stop offset=".13" stopColor="#425E6A"/><stop offset=".35" stopColor="#122731"/><stop offset=".59" stopColor="#61747B"/><stop offset=".66" stopColor="#304A57"/><stop offset="1" stopColor="#0B1D27"/></linearGradient>
        <filter id="cv-metal-depth" x="-25%" y="-25%" width="150%" height="160%"><feDropShadow dx="0" dy="12" stdDeviation="11" floodColor="#02090E" floodOpacity=".68"/></filter>
        <radialGradient id="cv-lens"><stop stopColor="#86C8D8" stopOpacity=".16"/><stop offset=".7" stopColor="#2B7488" stopOpacity=".04"/><stop offset="1" stopColor="#84C7D8" stopOpacity=".27"/></radialGradient>
        <linearGradient id="cv-glass" x1="0" y1="1" x2="1" y2="0"><stop stopColor="#74B3C6" stopOpacity=".02"/><stop offset=".5" stopColor="#B6D5DB" stopOpacity=".2"/><stop offset=".6" stopColor="#74B3C6" stopOpacity=".03"/><stop offset="1" stopColor="#74B3C6" stopOpacity=".13"/></linearGradient>
      </defs>
      <g className="cv-instrument-guide" fill="none" stroke="#6F8894" strokeOpacity=".18">
        <path d="M52 306H628M340 40V558"/><circle cx="340" cy="300" r="248" strokeDasharray="2 10"/><path d="M76 172V100h72M532 100h72v72M604 428v72h-72M148 500H76v-72"/>
        <path d="M248 550h184M340 540v20M250 546v8M430 546v8"/>
      </g>
      <g className="cv-instrument-body" filter="url(#cv-metal-depth)">
        <g className="cv-lens-back"><ellipse cx="340" cy="300" rx="218" ry="202" fill="#091B24" stroke="#405662" strokeWidth="3"/><ellipse cx="340" cy="300" rx="204" ry="190" fill="none" stroke="#1D3540" strokeWidth="12"/></g>
        <g className="cv-instrument-modules">
          {[0, 1, 2, 3].map((part) => <g key={part} className={`cv-instrument-module cv-module-${part}`}>
            <path d={['M176 170l-44-24-24 44 40 26z', 'M504 170l44-24 24 44-40 26z', 'M504 430l44 24 24-44-40-26z', 'M176 430l-44 24-24-44 40-26z'][part]} fill="url(#cv-metal)" stroke="#5C7480"/>
            <circle cx={[139, 541, 541, 139][part]} cy={[178, 178, 422, 422][part]} r="7" fill="#0B1D26" stroke="#6A7A82"/><path d={`M${[135,537,537,135][part]} ${[178,178,422,422][part]}h8`} stroke="#6A7A82"/>
          </g>)}
        </g>
        <g className="cv-instrument-outer">
          <circle cx="340" cy="300" r="187" fill="url(#cv-metal)" stroke="#748692" strokeWidth="1.1"/>
          <circle cx="340" cy="300" r="176" fill="#0C202B" stroke="#203B47" strokeWidth="5"/>
          {ticks.map((angle, i) => <line key={angle} x1="340" y1="117" x2="340" y2={i % 5 === 0 ? '128' : '122'} transform={`rotate(${angle} 340 300)`} stroke={i % 5 === 0 ? '#ABBCC0' : '#546E79'} strokeWidth={i % 5 === 0 ? '1.2' : '.7'}/>)}
          <path d="M212 170a183 183 0 0 1 252 1" fill="none" stroke="#A5BAC0" strokeOpacity=".4"/>
          <path d="M204 426a183 183 0 0 0 272-1" fill="none" stroke="#07151D" strokeWidth="3"/>
        </g>
        <g className="cv-instrument-lens">
          <circle cx="340" cy="300" r="154" fill="url(#cv-lens)" stroke="#688E9B" strokeOpacity=".7"/>
          <circle cx="340" cy="300" r="146" fill="url(#cv-glass)" stroke="#528394" strokeOpacity=".35"/>
          <ellipse cx="340" cy="300" rx="116" ry="146" fill="none" stroke="#70B3C8" strokeOpacity=".28"/>
          <ellipse cx="340" cy="300" rx="65" ry="146" fill="none" stroke="#70B3C8" strokeOpacity=".18"/>
          <path d="M197 277Q340 240 483 277M197 325Q340 365 483 325" fill="none" stroke="#70B3C8" strokeOpacity=".24"/>
          <path d="M238 200Q296 152 367 165" fill="none" stroke="#C5DEE2" strokeWidth="2" strokeOpacity=".38"/>
        </g>
        <g className="cv-instrument-aperture">
          {Array.from({ length: 6 }, (_, i) => <path key={i} className="cv-aperture-blade" d="M340 143A157 157 0 0 1 476 222L382 293 340 256z" transform={`rotate(${i * 60} 340 300)`} fill="url(#cv-metal)" fillOpacity=".85" stroke="#5E7A85" strokeOpacity=".55"/>)}
          <circle cx="340" cy="300" r="44" fill="#0A202B" stroke="#78B6C9" strokeOpacity=".8"/>
        </g>
        <g className="cv-instrument-signals">
          {Array.from({ length: 12 }, (_, i) => <g key={i} className={`cv-optic-signal cv-signal-${i}`} style={{ '--signal-index': i } as CSSProperties}><rect x={268 + (i % 4) * 45} y={244 + Math.floor(i / 4) * 44} width={i % 3 === 0 ? 19 : 8} height="4" rx="1" fill={i % 4 === 0 ? '#D6A980' : '#8CBFCA'}/></g>)}
        </g>
        <g className="cv-focus-candidates" fill="none" stroke="#7EA5B2">
          <circle cx="256" cy="248" r="5"/><circle cx="421" cy="252" r="5"/><circle cx="272" cy="375" r="5"/><circle cx="431" cy="356" r="5"/>
          <g className="cv-selected-point"><circle cx="340" cy="300" r="8" fill="#65BEDB" fillOpacity=".18"/><path d="M340 280v12M340 308v12M320 300h12M348 300h12" stroke="#B1DCE5"/><circle cx="340" cy="300" r="2" fill="#B1DCE5"/></g>
        </g>
        <g className="cv-engineer-links" fill="none" stroke="#77AEBE" strokeWidth="1.5"><path d="M159 192h67v54h48M521 192h-67v54h-48M159 408h67v-54h48M521 408h-67v-54h-48"/><rect x="274" y="246" width="132" height="108" rx="4" fill="#102C37" fillOpacity=".65"/><path d="M294 272h28v20h36v36h28M294 324h14v-12h35v-42h43"/><circle cx="294" cy="272" r="3"/><circle cx="386" cy="328" r="3"/></g>
        <g className="cv-instrument-calibration" fill="none">
          <circle className="cv-calibration-wave" cx="340" cy="300" r="110" stroke="#81B9C0" strokeOpacity=".5"/>
          <path d="M220 309h29l14-12 18 27 17-51 16 30 19-6 18 10 14-7h91" stroke="#8CB9C3" strokeWidth="2"/>
          <path d="M312 358l19 18 38-39" stroke="#9CBFB8" strokeWidth="2.5"/>
          <path d="M340 184v10M340 406v10M224 300h10M446 300h10" stroke="#A9C6CA"/>
        </g>
      </g>
      <g fill="#6F8B98" fontFamily="inherit" fontSize="8" letterSpacing="2"><text x="78" y="77">CONVERDIVE / PRECISION SYSTEM</text><text x="78" y="530">HUMAN JUDGEMENT, ENGINEERED</text><text x="554" y="530">M—04</text></g>
    </svg>
    <div className="cv-instrument-label"><span className="cv-instrument-dot"/>{phase < 4 ? methods[phase].instrument : 'A worthwhile change, measured.'}</div>
  </div>;
}

export function MethodSection() {
  const { ref, index, interactive, setInteractive } = useSceneProgress(5);
  const reduced = useReducedMotion();
  const copyRef = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);
  const active = Math.min(index, 4);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setEntered(true); observer.disconnect(); } }, { threshold: .08 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  useLayoutEffect(() => {
    if (!entered || reduced || !ref.current) return;
    const context = gsap.context(() => {
      gsap.timeline()
        .fromTo('.cv-entry-line', { drawSVG: '0%' }, { drawSVG: '100%', duration: .65, ease: 'power2.inOut' })
        .fromTo('.cv-method-brand', { x: 24, opacity: 0, filter: 'blur(5px)' }, { x: 0, opacity: 1, filter: 'blur(0px)', duration: .65, ease: 'power3.out' }, .2);
    }, ref);
    return () => context.revert();
  }, [entered, reduced, ref]);

  useLayoutEffect(() => {
    const copy = copyRef.current;
    if (!copy || !entered || active === 4 || reduced) return;
    let cancelled = false;
    let split: SplitText | undefined;
    const context = gsap.context(() => {}, copy);
    // Split after the actual face is ready; autoSplit rebuilds lines on width/font changes.
    void document.fonts.ready.then(() => {
      if (cancelled) return;
      context.add(() => {
        split = SplitText.create(copy.querySelector('.cv-method-detail'), {
          type: 'lines,words,chars', autoSplit: true, aria: 'auto',
          onSplit: (self) => {
            const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
            timeline.fromTo(copy.querySelector('h3'), { x: -24, opacity: .25 }, { x: 0, opacity: 1, duration: .55 }, 0);
            if (active === 0) timeline.fromTo(self.words, { x: (i) => (i % 3 - 1) * 12, y: (i) => (i % 2 ? 4 : -4), opacity: .12 }, { x: 0, y: 0, opacity: 1, duration: .65, stagger: .013 }, .08);
            if (active === 1) timeline.fromTo(self.lines, { clipPath: 'inset(0 100% 0 0)', x: -8 }, { clipPath: 'inset(0 0% 0 0)', x: 0, duration: .75, stagger: .08 }, .05);
            if (active === 2) timeline.fromTo(self.words, { x: (i) => i % 2 ? -8 : 8, y: 9, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: .55, stagger: .018 }, .08);
            if (active === 3) timeline.fromTo(self.chars, { filter: 'blur(3px)', opacity: .15 }, { filter: 'blur(0px)', opacity: 1, duration: .55, stagger: .003 }, .08);
            return timeline;
          },
        });
      });
    });
    return () => { cancelled = true; context.revert(); split?.revert(); };
  }, [active, reduced, entered]);

  return <section ref={ref} id="approach" className={`cv-section cv-method-section ${entered ? 'is-entered' : ''}`} data-section="05" aria-labelledby="cv-method-heading">
    <div className="cv-method-sticky cv-container">
      <div className="cv-method-entry">
        <svg viewBox="0 0 210 80" aria-hidden="true"><path className="cv-entry-line" d="M2 1v19q0 25 25 25h125q20 0 20 16" fill="none" stroke="currentColor"/><circle className="cv-entry-port" cx="172" cy="65" r="6" fill="none" stroke="currentColor"/><path d="M163 65h18M172 56v18" stroke="currentColor" strokeWidth=".6"/></svg>
        <p>That's where <span className="cv-method-brand">Converdive</span> comes in.</p>
      </div>
      <header className="cv-method-heading"><p className="cv-eyebrow">05 — Why Converdive?</p><h2 id="cv-method-heading" className="cv-title">A method before<br/>a solution.</h2></header>
      <div className="cv-method-stage" data-state={phases[active]}>
        <div className="cv-method-stage-body" aria-hidden={active === 4}>
          <div ref={copyRef} className="cv-method-copy" key={active} data-reveal={phases[active]} aria-live="polite">
            <p className="cv-method-number">{methods[Math.min(active, 3)].code}</p>
            <h3>{methods[Math.min(active, 3)].name}</h3>
            <p role="paragraph" className="cv-method-detail">{methods[Math.min(active, 3)].detail}</p>
            <p className="cv-method-intent"><span/> {methods[Math.min(active, 3)].measure}</p>
          </div>
          <PrecisionInstrument phase={active} reduced={reduced}/>
        </div>
        <div className="cv-method-synthesis" aria-hidden={active !== 4}>
          <span className="cv-synthesis-identity">Converdive<span> / The difference</span></span>
          <h3>We don't start with what AI can do.<br/><span>We start with what's worth changing.</span></h3>
          <p>We understand your workflow, identify where intervention is justified, engineer the appropriate change and measure whether it delivers value.</p>
        </div>
      </div>
      <nav className="cv-method-controls" aria-label="Explore the Converdive methodology">
        <div className="cv-method-steps">{methods.map((method, i) => <button key={method.name} type="button" aria-pressed={active === i} onClick={() => setInteractive(i)}><span>0{i + 1}</span>{method.name}<i aria-hidden="true"/></button>)}</div>
        <div className="cv-method-difference"><button type="button" aria-pressed={active === 4} onClick={() => setInteractive(4)}>Our difference <span aria-hidden="true"><Arrow/></span></button>{interactive !== null && <button className="cv-resume-scroll" type="button" onClick={() => setInteractive(null)}>Resume scroll</button>}</div>
      </nav>
      <p className="cv-method-scroll-note">Scroll to follow the method, or select a stage.</p>
    </div>
    <div className="cv-method-transcript cv-sr-only"><h3>The four methods</h3><ol>{methods.map(method => <li key={method.name}><h4>{method.name}</h4><p>{method.detail}</p></li>)}</ol><h3>Our difference</h3><p>We don't start with what AI can do. We start with what's worth changing.</p><p>We understand your workflow, identify where intervention is justified, engineer the appropriate change and measure whether it delivers value.</p></div>
  </section>;
}

export default MethodSection;
