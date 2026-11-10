import { Arrow } from '../components/Arrow';
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { gsap } from './animation';
import { CAUSAL_CHAINS, clampUnit } from './causal-data';
import { useSceneProgress } from './motion';
import './causes-sections.css';

gsap.registerPlugin(DrawSVGPlugin);

export function ProblemsSection() {
  const { ref, progress, interactive, setInteractive } = useSceneProgress(4);
  const [inspected, setInspected] = useState<number | null>(null);
  const [floatingPaused, setFloatingPaused] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const pairTrails = useRef<gsap.core.Timeline | null>(null);
  const returnFocus = useRef<HTMLButtonElement | null>(null);
  const exit = interactive === null ? clampUnit((progress - 0.84) / 0.16) : 0;
  useLayoutEffect(() => {
    const node = stage.current;
    if (!node) return;
    const measure = () => {
      const cards = node.querySelectorAll<HTMLElement>('.cv-problem-card-place');
      const surfaces = node.querySelectorAll<HTMLElement>('.cv-material-piece');
      cards.forEach((card, i) => {
        const surface = surfaces[i], gallery = surface?.offsetParent as HTMLElement | null;
        const constellation = card.offsetParent as HTMLElement | null;
        if (!surface || !gallery || !constellation) return;
        const x = gallery.offsetLeft + surface.offsetLeft + surface.offsetWidth / 2 - constellation.offsetLeft - card.offsetLeft - card.offsetWidth / 2;
        const y = gallery.offsetTop + surface.offsetTop + surface.firstElementChild!.clientHeight / 2 - constellation.offsetTop - card.offsetTop - card.offsetHeight / 2;
        card.style.setProperty('--cv-pair-x', `${x}px`);
        card.style.setProperty('--cv-pair-y', `${y}px`);
        const sourceX = constellation.offsetLeft + card.offsetLeft + card.offsetWidth;
        const sourceY = constellation.offsetTop + card.offsetTop + card.offsetHeight / 2;
        const targetX = gallery.offsetLeft + surface.offsetLeft + surface.offsetWidth / 2;
        const targetY = gallery.offsetTop + surface.offsetTop + surface.firstElementChild!.clientHeight / 2;
        const sx = sourceX / node.clientWidth * 1000, sy = sourceY / node.clientHeight * 448;
        const tx = targetX / node.clientWidth * 1000, ty = targetY / node.clientHeight * 448;
        node.querySelectorAll<SVGPathElement>('.cv-problem-pair-lines path')[i]?.setAttribute('d', `M${sx} ${sy}C${sx + (tx - sx) * 0.4} ${sy} ${tx - (tx - sx) * 0.4} ${ty} ${tx} ${ty}`);
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    node.querySelectorAll('.cv-problem-card-place,.cv-material-piece').forEach(element => observer.observe(element));
    void document.fonts.ready.then(measure);
    const context = gsap.context(() => {
      pairTrails.current = gsap.timeline({ paused: true }).fromTo('.cv-problem-pair-lines path', { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5, stagger: 0.22, ease: 'none' });
    }, node);
    return () => { observer.disconnect(); pairTrails.current = null; context.revert(); };
  }, []);
  useEffect(() => { pairTrails.current?.progress(interactive === null ? clampUnit(progress * 1.25) : 1); }, [progress, interactive]);
  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (inspected !== null && !node.open) node.showModal();
    if (inspected === null && node.open) node.close();
    if (inspected === null) returnFocus.current?.focus({ preventScroll: true });
  }, [inspected]);
  const chain = inspected === null ? null : CAUSAL_CHAINS[inspected];
  return (
    <section id="problems" data-section="03" ref={ref} className="cv-section cv-problems" data-float-paused={floatingPaused} aria-labelledby="cv-problems-title">
      <div className="cv-problems-sticky">
        <div className="cv-container">
          <div className="cv-problem-heading"><div><p className="cv-eyebrow">03 / Potential commercial problems</p><h2 id="cv-problems-title" className="cv-title">Where could valuable commercial-cleaning opportunities <span>lose momentum or value?</span></h2></div><div className="cv-problem-guide"><p className="cv-copy">Four possibilities worth investigating.<br />Select a problem to look closer.</p><button type="button" className="cv-float-toggle" aria-pressed={floatingPaused} aria-controls="cv-problem-constellation" onClick={() => setFloatingPaused(value => !value)}><span aria-hidden="true">{floatingPaused ? '▶' : 'Ⅱ'}</span> Pause floating</button></div></div>
          <div ref={stage} className="cv-problem-scene" style={{ '--cv-absorb': exit } as CSSProperties}>
            <svg className="cv-problem-pair-lines" viewBox="0 0 1000 448" preserveAspectRatio="none" aria-hidden="true"><path d="M225 75C370 75 420 60 620 75" /><path d="M465 170C640 170 670 160 885 160" /><path d="M250 290C400 290 460 307 625 307" /><path d="M465 380C650 380 690 370 890 370" /></svg>
            <div id="cv-problem-constellation" className="cv-problem-constellation">
              <svg className="cv-constellation-lines" viewBox="0 0 600 480" preserveAspectRatio="none" aria-hidden="true"><path d="M148 85H300V185H445M148 85V305H225V415H445M445 185V415M225 305H300V185" /><circle cx="300" cy="185" r="3" /><circle cx="225" cy="305" r="3" /></svg>
              {CAUSAL_CHAINS.map((problem, i) => {
                const reveal = interactive === null ? clampUnit(progress * 5.6 - i * 0.78 + 0.35) : 1;
                return <div className={`cv-problem-card-place cv-problem-place-${i + 1}`} key={problem.id} style={{ '--cv-pair-reveal': reveal, '--cv-float-delay': `${-i * 3.1}s` } as CSSProperties}>
                  <button type="button" className={`cv-problem-card cv-pair-${problem.material}`} onClick={event => { returnFocus.current = event.currentTarget; setInteractive(i); setInspected(i); }} aria-haspopup="dialog">
                    <span className="cv-problem-card-meta"><span><i />{problem.materialName}</span><span>0{i + 1}</span></span><strong>{problem.problem}</strong><span className="cv-inspect"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8" cy="8" r="5" /><path d="m12 12 5 5" /></svg>Inspect possibility</span>
                  </button>
                </div>;
              })}
            </div>
            <div className="cv-surface-gallery" aria-label="Four material surfaces paired with the four potential problems">
              {CAUSAL_CHAINS.map((surface, i) => {
                const reveal = interactive === null ? clampUnit(progress * 5.6 - i * 0.78 + 0.35) : 1;
                return <figure key={surface.id} className={`cv-material-piece cv-material-piece-${i + 1}`} style={{ '--cv-pair-reveal': reveal, '--cv-yaw': `${exit * (i === 0 ? 74 : 12)}deg` } as CSSProperties}>
                  <div className={`cv-material-object cv-material-${surface.material}`}><span className="cv-material-stain" /><span className="cv-material-fiducial">0{i + 1}</span><i className="cv-material-edge" /></div>
                  <figcaption><span>{surface.materialName}</span><small>{surface.mark}</small></figcaption>
                </figure>;
              })}
            </div>
          </div>
          <div className="cv-problem-footer"><p className="cv-scene-note">Recognizable scenarios, not a diagnosis of every contractor. The surface marks are visual metaphors.</p><a href="#causes" className="cv-underneath-link">Look beneath the surface <span aria-hidden="true">↓</span></a></div>
        </div>
      </div>
      <dialog ref={dialog} className="cv-problem-dialog" onKeyDown={event => { if (event.key !== 'Tab') return; const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])')); const first = controls[0], last = controls[controls.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); } }} aria-labelledby="cv-inspection-title" aria-describedby="cv-inspection-description" onCancel={() => setInspected(null)} onClose={() => setInspected(null)} onClick={event => { if (event.target === event.currentTarget) setInspected(null); }}>
        {chain && <div className="cv-inspection-content"><button type="button" autoFocus className="cv-dialog-close" onClick={() => setInspected(null)} aria-label="Close inspection">×</button><p className="cv-eyebrow">Potential problem {chain.number} / {chain.materialName}</p><div className={`cv-inspection-material cv-material-${chain.material}`} aria-hidden="true"><span className="cv-material-stain" /></div><h3 id="cv-inspection-title">{chain.problem}</h3><p id="cv-inspection-description">{chain.explanation}</p><div className="cv-inspection-consequence"><span>Possible consequence</span><p>{chain.consequence}</p></div><a href="#causes" onClick={() => setInspected(null)}>Explore the proposed causal structure <span aria-hidden="true"><Arrow/></span></a></div>}
      </dialog>
    </section>
  );
}
