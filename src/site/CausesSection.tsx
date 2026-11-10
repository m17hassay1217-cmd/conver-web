import { useEffect, useLayoutEffect, useRef, type CSSProperties, type KeyboardEvent } from 'react';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { gsap } from './animation';
import { CAUSAL_CHAINS, CAUSAL_LEVEL_LABELS, clampUnit } from './causal-data';
import { useSceneProgress } from './motion';
import './causes-sections.css';

gsap.registerPlugin(DrawSVGPlugin);

export function CausesSection() {
  const { ref, progress, interactive, setInteractive } = useSceneProgress(4);
  const layerDrawing = useRef<gsap.core.Timeline | null>(null);
  const exitDrawing = useRef<gsap.core.Timeline | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const scrollPosition = Math.min(3, Math.max(0, (progress - 0.1) / 0.72 * 3));
  const base = Math.floor(scrollPosition);
  const transition = clampUnit((scrollPosition - base - 0.7) / 0.3);
  // Give each complete chain a stable reading interval before the next surface advances.
  const scenePosition = interactive ?? Math.min(3, base + transition * transition * (3 - 2 * transition));
  const active = Math.round(scenePosition);
  const entry = interactive === null ? clampUnit(progress / 0.1) : 1;
  const exit = interactive === null ? clampUnit((progress - 0.87) / 0.13) : 0;
  useLayoutEffect(() => {
    const context = gsap.context(() => {
      layerDrawing.current = gsap.timeline({ paused: true }).fromTo('.cv-causal-connection path', { drawSVG: '0%' }, { drawSVG: '100%', duration: 1, stagger: 0.035, ease: 'none' });
      exitDrawing.current = gsap.timeline({ paused: true })
        .fromTo('.cv-root-join', { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.23, stagger: 0.025, ease: 'none' }, 0)
        .fromTo('.cv-root-exit', { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.54, ease: 'none' }, 0.2)
        .to('.cv-root-join', { autoAlpha: 0, duration: 0.12 }, 0.76)
        .to('.cv-root-exit', { drawSVG: '100% 100%', duration: 0.22, ease: 'none' }, 0.78);
    }, ref);
    return () => { layerDrawing.current = null; exitDrawing.current = null; context.revert(); };
  }, [ref]);
  useEffect(() => { layerDrawing.current?.progress(entry); }, [entry]);
  useEffect(() => { exitDrawing.current?.progress(exit); }, [exit]);
  const select = (index: number) => setInteractive(Math.min(3, Math.max(0, index)));
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); select(active + (event.key === 'ArrowRight' ? 1 : -1)); }
    if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); select(event.key === 'Home' ? 0 : 3); }
  };
  return (
    <section id="causes" data-section="04" className="cv-section cv-causes" ref={ref} aria-labelledby="cv-causes-title" style={{ '--cv-cause-exit': exit } as CSSProperties}>
      <div className="cv-causes-sticky">
        <div className="cv-container cv-causes-content">
          <div className="cv-causes-heading"><div><p className="cv-eyebrow">04 / Root-cause cross-sections</p><h2 className="cv-title" id="cv-causes-title">A visible problem.<br /><span>A deeper structure.</span></h2></div><p className="cv-copy">Look through four potential causal chains.<br />Each is a hypothesis to investigate,<br className="cv-desktop-break" /> with two intermediate layers.</p></div>
          <div className="cv-coverflow" role="region" aria-roledescription="carousel" aria-label="Potential causal structures" tabIndex={0} onKeyDown={onKeyDown} onPointerDown={event => { if (event.pointerType === 'touch') touchStart.current = { x: event.clientX, y: event.clientY }; }} onPointerUp={event => { const start = touchStart.current; touchStart.current = null; if (!start) return; const dx = event.clientX - start.x; const dy = event.clientY - start.y; if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.25) select(active + (dx < 0 ? 1 : -1)); }} onPointerCancel={() => { touchStart.current = null; }}>
            {CAUSAL_CHAINS.map((chain, i) => {
              const offset = i - scenePosition;
              const distance = Math.abs(offset);
              const entering = i === 0 ? (1 - entry) * 87 : 0;
              const sceneStyle = {
                '--cv-scene-x': `${offset * 77}%`,
                '--cv-scene-z': `${-Math.min(distance, 2) * 150}px`,
                '--cv-scene-yaw': `${-Math.max(-1, Math.min(1, offset)) * 22 + entering}deg`,
                '--cv-scene-scale': 1 - Math.min(distance, 2) * 0.16,
                '--cv-scene-opacity': Math.max(0, 1 - distance * 0.42),
                '--cv-layer-open': entry,
                zIndex: 10 - Math.round(distance * 2),
              } as CSSProperties;
              return <article key={chain.id} className={`cv-cause-scene ${active === i ? 'is-active' : ''}`} style={sceneStyle} aria-hidden={active !== i} aria-roledescription="slide" aria-label={`${chain.number} of 04: ${chain.title}`}>
                <header className="cv-cause-card-header"><div><span className="cv-cause-number">{chain.number}</span><h3>{chain.title}</h3></div><span className="cv-cause-material-name">{chain.materialName}<i /></span></header>
                <div className="cv-causal-layers">
                  {chain.levels.map((level, layerIndex) => <div key={level} className={`cv-causal-level cv-causal-level-${layerIndex}`}>
                    <div className="cv-slab-space" aria-hidden="true"><div className={`cv-causal-slab cv-material-${chain.material}`} style={{ '--cv-layer': layerIndex } as CSSProperties}>{layerIndex === 0 && <span className="cv-material-stain" />}<span className="cv-slab-number">{['V', 'M1', 'M2', 'R'][layerIndex]}</span><i className="cv-slab-front" /><i className="cv-slab-side" /></div></div>
                    <div className="cv-causal-annotation"><svg className="cv-causal-connection" viewBox="0 0 30 100" preserveAspectRatio="none" aria-hidden="true"><path d={layerIndex < 3 ? "M0 40H14V94M10 89L14 94L18 89" : "M0 40H14V70"} /></svg><span className="cv-causal-level-label">{CAUSAL_LEVEL_LABELS[layerIndex]}</span><p>{level}</p></div>
                  </div>)}
                </div>
              </article>;
            })}
          </div>
          <div className="cv-cause-navigation"><div className="cv-cause-selectors" role="group" aria-label="Choose a causal chain"><button type="button" className="cv-cause-arrow" onClick={() => select(active - 1)} disabled={active === 0} aria-label="Previous causal chain">←</button>{CAUSAL_CHAINS.map((chain, i) => <button type="button" key={chain.id} className={`cv-cause-choice ${active === i ? 'is-active' : ''}`} onClick={() => select(i)} aria-pressed={active === i}><span>0{i + 1}</span><span className="cv-choice-title">{chain.title}</span></button>)}<button type="button" className="cv-cause-arrow" onClick={() => select(active + 1)} disabled={active === 3} aria-label="Next causal chain">→</button></div><p className="cv-cause-instructions"><span aria-live="polite" aria-atomic="true">0{active + 1} / 04</span><span>Scroll, select or use arrow keys</span></p></div>
          <p className="cv-scene-note cv-causal-note">Illustrative causal examples. These are potential controllable conditions, not proven universal root causes.</p>
          <div className="cv-root-assembly" aria-hidden="true" style={{ '--cv-assembly-reveal': clampUnit(exit * 3), '--cv-assembly-leave': clampUnit((exit - 0.66) / 0.34) } as CSSProperties}>
            {CAUSAL_CHAINS.map(chain => <div key={chain.id} className="cv-root-mini"><div className={`cv-root-mini-surface cv-material-${chain.material}`}><span className="cv-material-stain" /></div><i className="cv-root-marker" /><span>{chain.title}</span></div>)}
          </div>
          <svg className="cv-causal-exit-trail" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">{[184, 411, 639, 866].map(x => <path key={x} className="cv-root-join" d={`M${x} 0V30H950`} />)}<path className="cv-root-exit" d="M950 30H150C50 30 50 172 150 172V600" /></svg>
        </div>
      </div>
    </section>
  );
}
