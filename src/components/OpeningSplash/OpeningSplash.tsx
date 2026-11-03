import { useCallback, useEffect, useRef, useState } from "react";
import { Arrow } from "../Arrow";
import { OUTCOMES, phaseAt, TIMING } from "./timeline";
import "./opening-splash.css";

export type IntroCompletion = "played" | "skipped";
export type OpeningSplashProps = {
  logoSrc: string;
  onComplete: (reason: IntroCompletion) => void;
  review?: boolean;
};

const EASE = "cubic-bezier(.4,0,.2,1)";
const ENTER = "cubic-bezier(.16,1,.3,1)";
const COLORS = ["#75e8f3", "#84afff", "#ac86ff", "#ee83d9"];
const REVIEW_STAGES = [
  ["Logo", 450], ["Outcomes", 2760], ["Magnet", 3470],
  ["Absorption", 4600], ["Rotation", 6330], ["Beam", 6940],
  ["Final", 7970], ["Handoff", 9250],
] as const;

export function OpeningSplash({ logoSrc, onComplete, review = false }: OpeningSplashProps) {
  const root = useRef<HTMLElement>(null);
  const animations = useRef<Animation[]>([]);
  const clock = useRef(0);
  const playing = useRef(true);
  const done = useRef(false);
  const range = useRef<HTMLInputElement>(null);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [geometry, setGeometry] = useState(0);

  const finish = useCallback((reason: IntroCompletion) => {
    if (done.current) return;
    done.current = true;
    onComplete(reason);
  }, [onComplete]);

  const renderTime = useCallback((time: number) => {
    clock.current = Math.max(0, Math.min(time, TIMING.complete));
    for (const animation of animations.current) animation.currentTime = clock.current;
    if (root.current) {
      root.current.dataset.phase = phaseAt(clock.current);
      root.current.style.setProperty("--progress", String(clock.current / TIMING.complete));
    }
    if (range.current) range.current.value = String(clock.current);
  }, []);

  useEffect(() => {
    let cancelled = false;
    Promise.all([document.fonts.ready, ...[...document.images].filter(image => image.closest(".opening-splash")).map(image => image.decode().catch(() => {}))]).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => { if (preference.matches) finish("skipped"); };
    change();
    preference.addEventListener("change", change);
    return () => preference.removeEventListener("change", change);
  }, [finish]);

  useEffect(() => {
    if (!ready || !root.current) return;
    const scene = root.current;
    const list: Animation[] = [];
    const paths: SVGPathElement[] = [];
    let frame = 0;
    let previous = performance.now();
    const animate = (target: Element | null, frames: Keyframe[], delay: number, duration: number, easing = EASE, iterations = 1) => {
      if (!target) return;
      const animation = target.animate(frames, { delay, duration, easing, iterations, fill: "both" });
      animation.pause();
      list.push(animation);
    };
    const logo = scene.querySelector(".logo-art")!;
    const logoBox = logo.getBoundingClientRect();
    const cx = logoBox.x + logoBox.width / 2;
    const cy = logoBox.y + logoBox.height / 2;
    const phrases = [...scene.querySelectorAll<HTMLElement>(".outcome")];
    const measured = phrases.map((element, index) => {
      const rect = element.getBoundingClientRect();
      const x = rect.x + rect.width / 2;
      const y = rect.y + rect.height / 2;
      return { element, index, x, y, distance: Math.hypot(cx - x, cy - y) };
    });
    const nearest = [...measured].sort((a, b) => a.distance - b.distance);
    const transfer = scene.querySelector(".transfer-paths")!;
    for (const item of measured) {
      const { element, index, x, y } = item;
      const rank = nearest.indexOf(item);
      element.dataset.pullRank = String(rank);
      const appears = TIMING.firstPhrase + index * TIMING.phraseStagger;
      animate(element.querySelector(".outcome-label"), [
        { opacity: 0, transform: "translateY(12px) scale(.96)" },
        { opacity: 1, transform: "translateY(0) scale(1)" },
      ], appears, TIMING.phraseEnter, ENTER);
      const drift = element.querySelector(".outcome-drift");
      animate(drift, [
        { transform: "translate(0,0)", offset: 0 },
        { transform: `translate(${index % 2 ? 5 : -6}px,${index % 3 ? -6 : 5}px)`, offset: .48 },
        { transform: "translate(0,0)", offset: 1 },
      ], appears + TIMING.phraseEnter, 2700 + index * 140, "ease-in-out", Infinity);
      const dx = cx - x;
      const dy = cy - y;
      const arc = index % 2 ? 1 : -1;
      const pullTime = TIMING.attract + rank * TIMING.pullStagger;
      animate(element, [
        { transform: "translate(-50%,-50%) scale(1)", opacity: 1, offset: 0 },
        { transform: `translate(calc(-50% - ${dx * .025}px),calc(-50% - ${dy * .025}px)) scale(1.025)`, opacity: 1, offset: .2 },
        { transform: `translate(calc(-50% + ${dx * .52 + arc * 15}px),calc(-50% + ${dy * .46}px)) scale(.76)`, opacity: .9, offset: .65 },
        { transform: `translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(.04)`, opacity: 0, offset: 1 },
      ], pullTime, TIMING.pullDuration, "cubic-bezier(.5,0,.85,.57)");
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", `M ${x} ${y} Q ${(x + cx) / 2 + arc * 32} ${(y + cy) / 2} ${cx} ${cy}`);
      path.setAttribute("stroke", COLORS[rank % COLORS.length]);
      transfer.append(path);
      paths.push(path);
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length} ${length}`;
      animate(path, [
        { strokeDashoffset: length, opacity: 0, offset: 0 },
        { strokeDashoffset: length * .72, opacity: .36, offset: .35 },
        { strokeDashoffset: 0, opacity: .68, offset: .82 },
        { strokeDashoffset: -length * .1, opacity: 0, offset: 1 },
      ], pullTime, TIMING.pullDuration);
    }

    animate(logo, [
      { opacity: 0, transform: "scale(.88) translateY(12px)" },
      { opacity: 1, transform: "scale(1) translateY(0)" },
    ], TIMING.logo, 650, ENTER);
    animate(scene.querySelector(".intro-wordmark"), [
      { opacity: 0, transform: "translate(-50%,12px)" },
      { opacity: 1, transform: "translate(-50%,0)" },
    ], TIMING.wordmark, 570, ENTER);
    animate(scene.querySelector(".intro-wordmark"), [
      { opacity: 1, filter: "brightness(1)", offset: 0 },
      { opacity: .85, filter: "brightness(1.5)", offset: .55 },
      { opacity: 0, filter: "brightness(2)", offset: 1 },
    ], TIMING.beam + 380, 440);
    animate(scene.querySelector(".magnetic-field"), [
      { opacity: 0, transform: "translate(-50%,-50%) scale(.55)", offset: 0 },
      { opacity: .54, transform: "translate(-50%,-50%) scale(.84)", offset: .33 },
      { opacity: .9, transform: "translate(-50%,-50%) scale(1)", offset: .72 },
      { opacity: .4, transform: "translate(-50%,-50%) scale(.88)", offset: 1 },
    ], TIMING.prepare, 3250);
    animate(scene.querySelector(".logo-aura"), [
      { opacity: 0, transform: "scale(.7)", offset: 0 },
      { opacity: .42, transform: "scale(1)", offset: .28 },
      { opacity: 1, transform: "scale(1.18)", offset: .82 },
      { opacity: .72, transform: "scale(.95)", offset: 1 },
    ], TIMING.prepare, TIMING.beam - TIMING.prepare);
    animate(scene.querySelector(".logo-flare"), [
      { opacity: 0, transform: "scale(.6)", offset: 0 },
      { opacity: .85, transform: "scale(1.25)", offset: .58 },
      { opacity: .24, transform: "scale(.9)", offset: 1 },
    ], TIMING.intensify, 1150);
    animate(scene.querySelector(".logo-turn"), [
      { transform: "rotate(0deg)", offset: 0 },
      { transform: "rotate(90deg)", offset: 1 },
    ], TIMING.rotate, 650);
    animate(scene.querySelector(".energy-beam"), [
      { opacity: 0, transform: "translateX(-50%) scaleY(0)", offset: 0 },
      { opacity: 1, transform: "translateX(-50%) scaleY(1)", offset: .58 },
      { opacity: .7, transform: "translateX(-50%) scaleY(1)", offset: .78 },
      { opacity: 0, transform: "translateX(-50%) scaleY(.2)", offset: 1 },
    ], TIMING.beam, 950, "cubic-bezier(.2,.7,.2,1)");
    animate(scene.querySelector(".positioning"), [
      { opacity: 0, transform: "translate(-50%,12px) scale(.96)", offset: 0 },
      { opacity: 1, transform: "translate(-50%,0) scale(1)", offset: 1 },
    ], TIMING.statement, 690, ENTER);
    animate(scene.querySelector(".ambient-waves"), [
      { opacity: .12, transform: "translateX(-1%)", offset: 0 },
      { opacity: .3, transform: "translateX(1%)", offset: .5 },
      { opacity: .12, transform: "translateX(-1%)", offset: 1 },
    ], 0, 4600, "ease-in-out", Infinity);
    animate(scene.querySelector(".ambient-energy"), [
      { opacity: .15, transform: "translateX(-2%) scale(.95)", offset: 0 },
      { opacity: .28, transform: "translateX(2%) scale(1.04)", offset: .5 },
      { opacity: .15, transform: "translateX(-2%) scale(.95)", offset: 1 },
    ], 0, 5200, "ease-in-out", Infinity);
    animate(scene.querySelector(".intro-scene"), [
      { transform: "translateY(0)", offset: 0 },
      { transform: "translateY(-28%)", offset: .42 },
      { transform: "translateY(-100%)", offset: 1 },
    ], TIMING.slide, TIMING.complete - TIMING.slide);
    animate(scene.querySelector(".intro-chrome"), [{ opacity: 1 }, { opacity: 0 }], TIMING.slide, 250);
    animations.current = list;
    renderTime(clock.current);
    const tick = (now: number) => {
      const delta = document.hidden ? 0 : Math.min(now - previous, 80);
      previous = now;
      if (playing.current) renderTime(clock.current + delta);
      if (clock.current >= TIMING.complete && !review) finish("played");
      if (!done.current) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const measuredWidth = scene.clientWidth;
    const measuredHeight = scene.clientHeight;
    const resize = new ResizeObserver(() => {
      if (scene.clientWidth !== measuredWidth || scene.clientHeight !== measuredHeight) setGeometry(value => value + 1);
    });
    resize.observe(scene);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      list.forEach(animation => animation.cancel());
      paths.forEach(path => path.remove());
      animations.current = [];
    };
  }, [ready, geometry, finish, renderTime, review]);

  function togglePause() { playing.current = !playing.current; setPaused(!playing.current); }
  function seek(time: number) { playing.current = false; setPaused(true); renderTime(time); }

  return <section ref={root} className="opening-splash" aria-label="Converdive introduction" data-testid="opening-splash" data-phase="arrival">
    <div className="intro-scene">
      <div className="asphalt" aria-hidden="true" />
      <div className="ambient-energy" aria-hidden="true" />
      <svg className="ambient-waves" aria-hidden="true" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <path d="M-60 660 C200 440 370 730 650 505 S1120 355 1500 585" />
        <path d="M-60 690 C210 460 385 760 660 535 S1130 385 1500 615" />
        <path d="M-60 720 C220 490 400 790 675 570 S1140 420 1500 650" />
      </svg>
      <div className="magnetic-field" aria-hidden="true"><i /><i /><i /></div>
      <svg className="transfer-paths" aria-hidden="true" />
      <div className="logo-core">
        <div className="logo-aura" aria-hidden="true" />
        <div className="logo-flare" aria-hidden="true" />
        <div className="logo-turn"><img className="logo-art" src={logoSrc} alt="Converdive logo" /></div>
      </div>
      <div className="intro-wordmark" aria-label="Converdive">Converdive</div>
      <div className="outcomes" aria-hidden="true">{OUTCOMES.map((outcome, index) =>
        <div className={`outcome outcome-${index}`} key={outcome} data-outcome={index}>
          <span className="outcome-drift"><span className="outcome-label"><span className="outcome-dot" />{outcome}</span></span>
        </div>)}</div>
      <div className="energy-beam" aria-hidden="true" />
      <p className="positioning">For cleaning companies in the UK</p>
    </div>
    <div className="intro-chrome">
      <div className="intro-top"><span /><button className="skip-intro" onClick={() => finish("skipped")}>Skip Intro <Arrow /></button></div>
      <div className="intro-bottom"><span /><button className="pause-intro" aria-label={paused ? "Play introduction" : "Pause introduction"} onClick={togglePause}>{paused ? "Play" : "Pause"} <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span></button></div>
      <div className="intro-progress" aria-hidden="true" />
    </div>
    <p className="sr-only">Converdive. {OUTCOMES.join(". ")}. For cleaning companies in the UK.</p>
    {review && <div className="review-controls" aria-label="Animation review controls">
      <span>Intro review</span><button onClick={togglePause}>{paused ? "Play" : "Pause"}</button>
      <input ref={range} type="range" min="0" max={TIMING.complete} defaultValue="0" step="10" aria-label="Animation time in milliseconds" onChange={event => seek(Number(event.target.value))} />
      {REVIEW_STAGES.map(([label, time]) => <button key={label} onClick={() => seek(time)}>{label}</button>)}
      <button onClick={() => { renderTime(0); playing.current = true; setPaused(false); }}>Replay</button>
    </div>}
  </section>;
}
