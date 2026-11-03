import { useCallback, useEffect, useRef, useState } from "react";
import { Arrow } from "../Arrow";
import { OUTCOMES, phaseAt, TIMING } from "./timeline";
import { orbitalLayout, cubic, magneticCurve } from "./geometry";
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
  ["Logo", 450], ["Outcomes", 3200], ["Orbit", 5000], ["Magnet", 6250],
  ["Absorption", 7700], ["Rotation", 10050], ["Beam", 10550],
  ["Final", 12300], ["Handoff", 13800],
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
      return animation;
    };
    const logo = scene.querySelector(".logo-art")!;
    const phrases = [...scene.querySelectorAll<HTMLElement>(".outcome")];
    const labels = phrases.map(el => ({ x: 0, y: 0, width: el.offsetWidth, height: el.offsetHeight }));
    const wordmark = scene.querySelector<HTMLElement>(".intro-wordmark")!;
    // offset dimensions remain stable when rebuilding a scrubbed/rotated scene.
    const core = scene.querySelector<HTMLElement>(".logo-core")!;
    const width=scene.clientWidth, height=scene.clientHeight;
    const coreY=parseFloat(getComputedStyle(scene).getPropertyValue("--core-y"))*height/100;
    const textY=parseFloat(getComputedStyle(scene).getPropertyValue("--text-y"))*height/100;
    const source={x:width/2,y:coreY};
    scene.style.setProperty("--beam-start",`${coreY+core.offsetHeight*.42}px`);
    scene.style.setProperty("--beam-length",`${textY+wordmark.offsetHeight*.45-coreY-core.offsetHeight*.42}px`);
    const obstacles=[{x:width/2-core.offsetWidth/2,y:coreY-core.offsetHeight/2,width:core.offsetWidth,height:core.offsetHeight},
      {x:width/2-wordmark.offsetWidth/2,y:textY,width:wordmark.offsetWidth,height:wordmark.offsetHeight}];
    const layout=(t:number)=>orbitalLayout(t,width,height,labels,obstacles);
    const nearest=layout(TIMING.attract).map((p,index)=>({index,distance:Math.hypot(p.x-source.x,p.y-source.y)})).sort((a,b)=>a.distance-b.distance);
    const transfer=scene.querySelector(".transfer-paths")!;
    phrases.forEach((element,index)=>{
      element.style.left="0px"; element.style.top="0px";
      const rank=nearest.findIndex(item=>item.index===index);
      element.dataset.pullRank=String(rank);
      const appears=TIMING.firstPhrase+index*TIMING.phraseStagger;
      const pullTime=TIMING.attract+rank*TIMING.pullStagger;
      animate(element.querySelector(".outcome-label"),[
        {opacity:0,transform:"translateY(12px)"},{opacity:1,transform:"translateY(0)"}
      ],appears,TIMING.phraseEnter,ENTER);
      const start=layout(pullTime)[index], prior=layout(pullTime-50)[index];
      // Preserve orbital tangent as the inward curve takes over.
      const control1={x:start.x+(start.x-prior.x)*7,y:start.y+(start.y-prior.y)*7};
      const control2={x:source.x+(start.y-source.y)*.13,y:source.y-(start.x-source.x)*.13};
      const frames:Keyframe[]=[];
      const end=pullTime+TIMING.pullDuration;
      for(let t=0;t<end;t+=40){
        const u=Math.max(0,(t-pullTime)/TIMING.pullDuration);
        const eased=u*u;
        const p=t<=pullTime?layout(t)[index]:cubic(start,control1,control2,source,eased);
        const scale=1-Math.pow(u,2.5)*.96;
        frames.push({offset:t/end,transform:`translate(${p.x}px,${p.y}px) translate(-50%,-50%) scale(${scale})`,opacity:1-Math.pow(u,4)});
      }
      frames.push({offset:1,transform:`translate(${source.x}px,${source.y}px) translate(-50%,-50%) scale(.04)`,opacity:0});
      animate(element,frames,0,end,"linear");
      const path=document.createElementNS("http://www.w3.org/2000/svg","path");
      path.setAttribute("d",`M ${start.x} ${start.y} C ${control1.x} ${control1.y},${control2.x} ${control2.y},${source.x} ${source.y}`);
      path.setAttribute("stroke",COLORS[rank%COLORS.length]);transfer.append(path);paths.push(path);
      const length=path.getTotalLength();path.style.strokeDasharray=`${length*.15} ${length}`;
      animate(path,[{strokeDashoffset:0,opacity:0},{strokeDashoffset:-length*.3,opacity:.6},{strokeDashoffset:-length,opacity:0}],pullTime,TIMING.pullDuration,"ease-in");
      const pulse=scene.querySelectorAll(".absorption-pulse")[index];
      animate(pulse,[{opacity:0,transform:"scale(.45)"},{opacity:.65,transform:"scale(.9)",offset:.2},{opacity:0,transform:"scale(1.8)"}],end-80,480);
    });

    animate(logo, [
      { opacity: 0, transform: "scale(.88) translateY(12px)" },
      { opacity: 1, transform: "scale(1) translateY(0)" },
    ], TIMING.logo, 650, ENTER);
    animate(scene.querySelector(".intro-wordmark"), [
      { opacity: 0, transform: "translate(-50%,12px)" },
      { opacity: 1, transform: "translate(-50%,0)" },
    ], TIMING.wordmark, 570, ENTER);
    const wordmarkExit = animate(scene.querySelector(".intro-wordmark"), [
      { opacity: 1, filter: "brightness(1)", offset: 0 },
      { opacity: .85, filter: "brightness(1.5)", offset: .55 },
      { opacity: 0, filter: "brightness(2)", offset: 1 },
    ], TIMING.beamImpact, 500);
    wordmarkExit?.effect?.updateTiming({fill:"forwards"});
    animate(scene.querySelector(".magnetic-field"), [
      { opacity: 0, transform: "translate(-50%,-50%) scale(.55)", offset: 0 },
      { opacity: .85, transform: "translate(-50%,-50%) scale(.9)", offset: .18 },
      { opacity: 1, transform: "translate(-50%,-50%) scale(1)", offset: .72 },
      { opacity: .4, transform: "translate(-50%,-50%) scale(.88)", offset: 1 },
    ], TIMING.prepare, TIMING.beam - TIMING.prepare + 500,"linear");
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
      { opacity: 1, transform: "translateX(-50%) scaleY(1)", offset: .28 },
      { opacity: .7, transform: "translateX(-50%) scaleY(1)", offset: .78 },
      { opacity: 0, transform: "translateX(-50%) scaleY(.2)", offset: 1 },
    ], TIMING.beam, TIMING.beamDuration, "linear");
    scene.querySelectorAll(".positioning span").forEach((line,index)=>animate(line,[
      {opacity:0,transform:"translateY(16px)",filter:"blur(3px)"},
      {opacity:1,transform:"translateY(0)",filter:"blur(0px)"}
    ],TIMING.statement+index*TIMING.lineStagger,TIMING.lineEnter,ENTER));
    animate(scene.querySelector(".beam-impact"),[{opacity:0,transform:"translateX(-50%) scaleX(.1)"},{opacity:.9,transform:"translateX(-50%) scaleX(1)",offset:.22},{opacity:0,transform:"translateX(-50%) scaleX(1.3)"}],TIMING.beamImpact,850);
    scene.querySelectorAll(".field-line").forEach((line,index)=>{
      animate(line,[{opacity:.35},{opacity:.8},{opacity:.35}],TIMING.prepare,2800+index*170,"ease-in-out",Infinity);
    });
    scene.querySelectorAll(".field-flow").forEach((line,index)=>animate(line,[{strokeDashoffset:850,opacity:.2},{strokeDashoffset:0,opacity:.85},{strokeDashoffset:-850,opacity:.2}],TIMING.prepare,1700+index*170,"linear",Infinity));
    scene.querySelectorAll(".wave-accent").forEach((line,index)=>animate(line,[{strokeDashoffset:1800},{strokeDashoffset:-1800}],0,10000+index*2100,"linear",Infinity));
    animate(scene.querySelector(".ambient-waves"), [
      { opacity: .52, transform: "translateX(-1%)", offset: 0 },
      { opacity: .52, transform: "translateX(1%)", offset: .5 },
      { opacity: .52, transform: "translateX(-1%)", offset: 1 },
    ], 0, 4600, "ease-in-out", Infinity);
    animate(scene.querySelector(".ambient-energy"), [
      { opacity: .32, transform: "translateX(-2%) scale(.95)", offset: 0 },
      { opacity: .52, transform: "translateX(2%) scale(1.04)", offset: .5 },
      { opacity: .32, transform: "translateX(-2%) scale(.95)", offset: 1 },
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
        <path d="M-100 270 C220 40 500 390 830 215 S1260 150 1540 340" />
        <path className="wave-accent" d="M-60 690 C210 460 385 760 660 535 S1130 385 1500 615" />
        <path className="wave-accent" d="M-100 270 C220 40 500 390 830 215 S1260 150 1540 340" />
      </svg>
      <div className="magnetic-field" aria-hidden="true">
        <svg viewBox="-300 -300 600 600"><defs><linearGradient id="field-spectrum"><stop stopColor="#59e5ff"/><stop offset=".5" stopColor="#7e8bff"/><stop offset="1" stopColor="#df68df"/></linearGradient></defs>
          {Array.from({length:8},(_,i)=> <g className="field-line" key={i}>
            <path d={magneticCurve(i,true)} />
            <path className="field-flow" d={magneticCurve(i)} />
          </g>)}
        </svg>
      </div>
      <svg className="transfer-paths" aria-hidden="true" />
      <div className="logo-core">
        <div className="logo-aura" aria-hidden="true" />
        <div className="logo-flare" aria-hidden="true" />
        {OUTCOMES.map((_,i)=><i className="absorption-pulse" key={i} aria-hidden="true" />)}
        <div className="logo-turn"><img className="logo-art" src={logoSrc} alt="Converdive logo" /></div>
      </div>
      <div className="intro-wordmark" aria-label="Converdive">Converdive</div>
      <div className="outcomes" aria-hidden="true">{OUTCOMES.map((outcome, index) =>
        <div className={`outcome outcome-${index}`} key={outcome} data-outcome={index}>
          <span className="outcome-drift"><span className="outcome-label"><span className="outcome-dot" />{outcome}</span></span>
        </div>)}</div>
      <div className="energy-beam" aria-hidden="true"><i/><i/><i/></div>
      <div className="beam-impact" aria-hidden="true" />
      <p className="positioning" aria-label="For UK Cleaning Companies"><span>For</span><span>UK</span><span>Cleaning Companies</span></p>
    </div>
    <div className="intro-chrome">
      <div className="intro-top"><span /><button className="skip-intro" onClick={() => finish("skipped")}>Skip Intro <Arrow /></button></div>
      <div className="intro-bottom"><span /><button className="pause-intro" aria-label={paused ? "Play introduction" : "Pause introduction"} onClick={togglePause}>{paused ? "Play" : "Pause"} <span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span></button></div>
      <div className="intro-progress" aria-hidden="true" />
    </div>
    <p className="sr-only">Converdive. {OUTCOMES.join(". ")}. For UK Cleaning Companies.</p>
    {review && <div className="review-controls" aria-label="Animation review controls">
      <span>Intro review</span><button onClick={togglePause}>{paused ? "Play" : "Pause"}</button>
      <input ref={range} type="range" min="0" max={TIMING.complete} defaultValue="0" step="10" aria-label="Animation time in milliseconds" onChange={event => seek(Number(event.target.value))} />
      {REVIEW_STAGES.map(([label, time]) => <button key={label} onClick={() => seek(time)}>{label}</button>)}
      <button onClick={() => { renderTime(0); playing.current = true; setPaused(false); }}>Replay</button>
    </div>}
  </section>;
}
