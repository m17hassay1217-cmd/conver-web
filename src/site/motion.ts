import { useEffect, useRef, useState, useCallback, type Dispatch, type SetStateAction } from 'react';
export function useReducedMotion() {
 const [reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
 useEffect(()=>{const mq=matchMedia('(prefers-reduced-motion: reduce)');const change=()=>setReduced(mq.matches);mq.addEventListener('change',change);return()=>mq.removeEventListener('change',change)},[]);
 return reduced;
}
export function useSceneProgress(steps:number){
 const ref=useRef<HTMLElement>(null),[progress,setProgress]=useState(0),[interactive,setOverride]=useState<number|null>(null);
 const manualAt=useRef(0),reduced=useReducedMotion();
 const setInteractive:Dispatch<SetStateAction<number|null>>=useCallback((next)=>{manualAt.current=scrollY;setOverride(next)},[]);
 useEffect(()=>{
  let frame=0;const update=()=>{frame=0;const el=ref.current;if(!el)return;const mobile=innerWidth<=820;if(reduced||mobile){setProgress(0);return;}const rect=el.getBoundingClientRect();const span=Math.max(1,rect.height-innerHeight);setProgress(Math.max(0,Math.min(1,-rect.top/span)));if(interactive!==null&&Math.abs(scrollY-manualAt.current)>48)setOverride(null)};
  const queue=()=>{if(!frame)frame=requestAnimationFrame(update)};update();window.addEventListener('scroll',queue,{passive:true});window.addEventListener('resize',queue);return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',queue);window.removeEventListener('resize',queue)};
 },[reduced,interactive]);
 const index=interactive??Math.min(steps-1,Math.floor(progress*steps));
 return{ref,progress,index,interactive,setInteractive};
}
