import { useLayoutEffect, useRef, useState, useCallback, useSyncExternalStore, type Dispatch, type SetStateAction } from 'react';
import { gsap, ScrollTrigger, MOTION } from './animation';
// All consumers share one OS-preference listener. Animation state stays local.
let preference: MediaQueryList | undefined;
let fontRefreshQueued=false;
const subscribers = new Set<() => void>();
const preferenceChanged = () => subscribers.forEach(notify => notify());
const media = () => preference ??= window.matchMedia('(prefers-reduced-motion: reduce)');
function subscribe(notify: () => void) { const mq=media(); if (!subscribers.size) mq.addEventListener('change',preferenceChanged); subscribers.add(notify); return () => { subscribers.delete(notify); if (!subscribers.size) mq.removeEventListener('change',preferenceChanged); }; }
export function useReducedMotion(){ return useSyncExternalStore(subscribe,()=>media().matches,()=>true); }
/** CSS owns sticky positioning; GSAP exclusively owns the shared scroll timeline. */
export function useSceneProgress(steps:number){
 const ref=useRef<HTMLElement>(null),[progress,setProgress]=useState(0),[interactive,setOverride]=useState<number|null>(null);
 const override=useRef<number|null>(null),manualAt=useRef(0),last=useRef(-1);
 const setInteractive:Dispatch<SetStateAction<number|null>>=useCallback(next=>{window.scrollTo({top:scrollY,behavior:'instant'});manualAt.current=scrollY;const value=typeof next==='function'?next(override.current):next;override.current=value;setOverride(value)},[]);
 useLayoutEffect(()=>{
  const el=ref.current;if(!el)return;
  const mm=gsap.matchMedia();
  mm.add('(min-width: 821px) and (prefers-reduced-motion: no-preference)',()=>{
   const playhead={value:0};
   const timeline=gsap.to(playhead,{value:1,ease:'none',paused:true,onUpdate:()=>{
    const value=Math.round(playhead.value*1000)/1000;
    if(Math.abs(value-last.current)>=.001){last.current=value;setProgress(value);el.style.setProperty('--cv-scene-progress',String(value));}
    if(override.current!==null&&Math.abs(scrollY-manualAt.current)>48){override.current=null;setOverride(null)}
   }});
   const trigger=ScrollTrigger.create({id:`cv-${el.id}`,trigger:el,start:'top top',end:()=>`+=${Math.max(1,el.offsetHeight-innerHeight)}`,animation:timeline,scrub:MOTION.scrub,invalidateOnRefresh:true});
   el.dataset.motionEngine='gsap-scrolltrigger';
   return()=>{trigger.kill();timeline.kill();delete el.dataset.motionEngine};
  });
  mm.add('(max-width: 820px), (prefers-reduced-motion: reduce)',()=>{last.current=0;setProgress(0);el.style.setProperty('--cv-scene-progress','0');el.dataset.motionEngine='manual';return()=>{delete el.dataset.motionEngine}});
  // Refresh after local fonts/layout settle without adding scroll listeners per scene.
  if(!fontRefreshQueued){fontRefreshQueued=true;void document.fonts.ready.then(()=>ScrollTrigger.refresh())}
  return()=>{mm.revert()};
 },[]);
 const index=interactive??Math.min(steps-1,Math.floor(progress*steps));
 return{ref,progress,index,interactive,setInteractive};
}
