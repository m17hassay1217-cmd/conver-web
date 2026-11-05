import { useCallback, useEffect, useRef, useState } from 'react';
import { Arrow } from '../Arrow';
import { OUTCOMES, phaseAt, REVIEW_STAGES, TIMING } from './timeline';
import { measureScene, renderPhrases, smooth } from './scene';
import { createEnergy } from './energy';
import './opening-splash.css';

export type IntroCompletion = 'played' | 'skipped';
export type OpeningSplashProps = { logoSrc: string; onComplete: (reason: IntroCompletion) => void; review?: boolean };
const EASE = 'cubic-bezier(.4,0,.2,1)';
const ENTER = 'cubic-bezier(.16,1,.3,1)';

export function OpeningSplash({logoSrc,onComplete,review=false}: OpeningSplashProps) {
  const root=useRef<HTMLElement>(null);
  const animations=useRef<Animation[]>([]);
  const draw=useRef<((time:number)=>void)|null>(null);
  const clock=useRef(0),playing=useRef(true),done=useRef(false);
  const range=useRef<HTMLInputElement>(null);
  const [paused,setPaused]=useState(false),[ready,setReady]=useState(false),[geometry,setGeometry]=useState(0);
  const finish=useCallback((reason:IntroCompletion)=>{if(done.current)return;done.current=true;onComplete(reason);},[onComplete]);
  const renderTime=useCallback((time:number)=>{
    clock.current=Math.max(0,Math.min(time,TIMING.complete));
    for(const animation of animations.current)animation.currentTime=clock.current;
    draw.current?.(clock.current);
    if(root.current){root.current.dataset.phase=phaseAt(clock.current);root.current.style.setProperty('--progress',String(clock.current/TIMING.complete));}
    if(range.current)range.current.value=String(clock.current);
  },[]);
  useEffect(()=>{
    let cancelled=false;
    Promise.all([document.fonts.ready,...[...document.images].filter(image=>image.closest('.opening-splash')).map(image=>image.decode().catch(()=>{}))]).then(()=>{if(!cancelled)setReady(true);});
    return()=>{cancelled=true;};
  },[]);
  useEffect(()=>{
    const preference=matchMedia('(prefers-reduced-motion: reduce)');
    const change=()=>{if(preference.matches)finish('skipped');};change();preference.addEventListener('change',change);
    return()=>preference.removeEventListener('change',change);
  },[finish]);
  useEffect(()=>{
    if(!ready||!root.current)return;
    const scene=root.current;
    const model=measureScene(scene);
    const energy=createEnergy(scene.querySelector<HTMLCanvasElement>('.energy-canvas')!,model);
    const name=scene.querySelector<HTMLElement>('.intro-wordmark')!;
    const list:Animation[]=[];
    let frame=0,previous=performance.now();
    const animate=(selector:string,frames:Keyframe[],delay:number,duration:number,easing=EASE,iterations=1,fill:FillMode='both')=>{
      const target=scene.querySelector(selector);if(!target)return;
      const animation=target.animate(frames,{delay,duration,easing,iterations,fill});animation.pause();list.push(animation);
    };
    const outcomes=scene.querySelector<HTMLElement>('.outcomes')!;
    outcomes.style.maskImage=`radial-gradient(circle at ${model.source.x}px ${model.source.y}px,transparent ${model.gate}px,#000 ${model.gate+5}px)`;
    draw.current=(time)=>{
      renderPhrases(scene,model,time);energy.render(time);
      const progress=smooth((time-TIMING.wordmarkExit)/TIMING.wordmarkExitDuration),r=progress*51;
      name.style.maskImage=progress===0?'none':`linear-gradient(to right,#000 ${50-r}%,transparent ${51-r}%,transparent ${49+r}%,#000 ${50+r}%)`;
      // These attributes expose actual coordinated VFX states to browser review.
      scene.dataset.time=String(time);
      scene.dataset.beamProgress=String(smooth((time-TIMING.beam)/TIMING.beamTravel));
      scene.dataset.absorbed=String(model.flights.filter(f=>time>=f.end).length);
      scene.dataset.beamOrigin=`${model.beamFrom.x},${model.beamFrom.y}`;
      scene.dataset.beamImpact=`${model.impact.x},${model.impact.y}`;
    };
    animate('.logo-art',[{opacity:0,transform:'scale(.92) translateY(8px)'},{opacity:1,transform:'scale(1) translateY(0)'}],TIMING.logo,TIMING.logoEnter,ENTER);
    animate('.intro-wordmark',[{opacity:0,transform:'translate(-50%,10px)'},{opacity:1,transform:'translate(-50%,0)'}],TIMING.wordmark,TIMING.wordmarkEnter,ENTER);
    // Only opacity and geometry change. No brightness filter or colored text fill.
    animate('.intro-wordmark',[{opacity:1,transform:'translate(-50%,0)'},{opacity:0,transform:'translate(-50%,-4px)'}],TIMING.wordmarkExit,TIMING.wordmarkExitDuration,EASE,1,'forwards');
    OUTCOMES.forEach((_,i)=>animate(`.outcome-${i} .outcome-label`,[{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],TIMING.firstPhrase+i*TIMING.phraseStagger,TIMING.phraseEnter,ENTER));
    animate('.logo-turn',[{transform:'rotate(0deg)'},{transform:'rotate(90deg)'}],TIMING.rotate,TIMING.rotationDuration);
    scene.querySelectorAll('.positioning span').forEach((_,i)=>animate(`.positioning span:nth-child(${i+1})`,[
      {opacity:0,transform:'translateY(8px)',clipPath:'inset(0 50% 0 50%)'},
      {opacity:1,transform:'translateY(0)',clipPath:'inset(0 0% 0 0%)'}
    ],TIMING.statement+i*TIMING.lineStagger,TIMING.lineEnter,ENTER));
    animate('.ambient-waves',[{opacity:.18,transform:'translateX(-1%)'},{opacity:.26,transform:'translateX(1%)'},{opacity:.18,transform:'translateX(-1%)'}],0,5500,'ease-in-out',Infinity);
    animate('.ambient-energy',[{opacity:.22,transform:'translateX(-1%)'},{opacity:.34,transform:'translateX(1%)'},{opacity:.22,transform:'translateX(-1%)'}],0,6500,'ease-in-out',Infinity);
    animate('.intro-scene',[{transform:'translateY(0)'},{transform:'translateY(-100%)'}],TIMING.slide,TIMING.complete-TIMING.slide);
    animate('.intro-chrome',[{opacity:1},{opacity:0}],TIMING.slide,180);
    animations.current=list;renderTime(clock.current);
    const tick=(now:number)=>{
      const delta=document.hidden?0:Math.min(now-previous,80);previous=now;
      if(playing.current&&!document.hidden&&delta>0)renderTime(clock.current+delta);
      if(clock.current>=TIMING.complete){if(!review)finish('played');else{playing.current=false;setPaused(true);}}
      if(!done.current)frame=requestAnimationFrame(tick);
    };
    frame=requestAnimationFrame(tick);
    const resize=new ResizeObserver(()=>{if(scene.clientWidth!==model.width||scene.clientHeight!==model.height)setGeometry(value=>value+1);});resize.observe(scene);
    return()=>{cancelAnimationFrame(frame);resize.disconnect();list.forEach(a=>a.cancel());animations.current=[];draw.current=null;energy.destroy();};
  },[ready,geometry,finish,renderTime,review]);
  function togglePause(){playing.current=!playing.current;setPaused(!playing.current);}
  function seek(time:number){playing.current=false;setPaused(true);renderTime(time);}
  return <section ref={root} className="opening-splash" aria-label="Converdive introduction" data-testid="opening-splash" data-phase="arrival">
    <div className="intro-scene">
      <div className="asphalt" aria-hidden="true"/>
      <div className="ambient-energy" aria-hidden="true"/>
      <svg className="ambient-waves" aria-hidden="true" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <path d="M-60 660 C200 440 370 730 650 505 S1120 355 1500 585"/>
        <path d="M-60 690 C210 460 385 760 660 535 S1130 385 1500 615"/>
        <path d="M-60 720 C220 490 400 790 675 570 S1140 420 1500 650"/>
        <path d="M-100 270 C220 40 500 390 830 215 S1260 150 1540 340"/>
      </svg>
      <canvas className="energy-canvas" aria-hidden="true"/>
      <div className="logo-core"><div className="logo-turn"><img className="logo-art" src={logoSrc} alt="Converdive logo"/></div></div>
      <div className="intro-wordmark" aria-label="Converdive">Converdive</div>
      <div className="outcomes" aria-hidden="true">{OUTCOMES.map((outcome,index)=><div className={`outcome outcome-${index}`} key={outcome} data-outcome={index}><span className="outcome-label"><span className="outcome-dot"/>{outcome}</span></div>)}</div>
      <p className="positioning" aria-label="For UK Cleaning Companies"><span>For</span><span>UK</span><span>Cleaning Companies</span></p>
    </div>
    <div className="intro-chrome">
      <div className="intro-top"><span/><button className="skip-intro" onClick={()=>finish('skipped')}>Skip Intro <Arrow/></button></div>
      <div className="intro-bottom"><span/><button className="pause-intro" aria-label={paused?'Play introduction':'Pause introduction'} onClick={togglePause}>{paused?'Play':'Pause'} <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" aria-hidden="true">{paused?<path d="m3 2 6 4-6 4Z"/>:<path d="M4 2v8m4-8v8"/>}</svg></button></div>
      <div className="intro-progress" aria-hidden="true"/>
    </div>
    <p className="sr-only">Converdive. {OUTCOMES.join('. ')}. For UK Cleaning Companies.</p>
    {review&&<div className="review-controls" aria-label="Animation review controls"><span>Intro review</span><button onClick={togglePause}>{paused?'Play':'Pause'}</button>
      <input ref={range} type="range" min="0" max={TIMING.complete} defaultValue="0" step="10" aria-label="Animation time in milliseconds" onChange={event=>seek(Number(event.target.value))}/>
      {REVIEW_STAGES.map(([label,time])=><button key={label} onClick={()=>seek(time)}>{label}</button>)}
      <button onClick={()=>{renderTime(0);playing.current=true;setPaused(false);}}>Replay</button>
    </div>}
  </section>;
}
