import { useId, useLayoutEffect, useRef } from 'react';
import { gsap } from './animation';
import { useReducedMotion } from './motion';
import './hero-v3.css';

function QuestionText(){return <><span>How well does your</span>{' '}<em>enquiry-to-booking</em>{' '}<span>process actually work?</span></>}
const statement='We design targeted AI-enabled workflows to reduce unnecessary manual work and help commercial enquiries progress more smoothly.';
// Traced in the original 1672 × 941 image coordinates. Shared by the clear-glass
// text clip and edge illumination; object-fit cropping is applied to both.
const GLASS_OPENING='M 0 863 C 97 497 352 334 716 264 C 1071 196 1425 64 1672 153 C 1491 254 1457 413 1164 553 C 828 712 401 706 0 863 Z';
const edgeMask=`url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1672" height="941" viewBox="0 0 1672 941"><path d="${GLASS_OPENING}" fill="none" stroke="white" stroke-width="38"/></svg>`)}")`;
export const HERO_V3_SCORE={clarityEnd:.4,settleStart:.25,settleEnd:.45,statementEnd:.67,installationEnd:.68,contourEnd:.88};
export function HeroV3({backgroundUrl='/brand/neon-swept-st-pauls.png',contactHref='/?intro=skip#contact'}:{backgroundUrl?:string;contactHref?:string}){
 const root=useRef<HTMLElement>(null),reduced=useReducedMotion();
 const uid=useId().replace(/:/g,'');const headMask=`cv3-head-${uid}`,glassMask=`cv3-glass-${uid}`,paragraphMask=`cv3-paragraph-${uid}`;
 useLayoutEffect(()=>{
  const el=root.current;if(!el)return;
  const context=gsap.context(()=>{
   const $=gsap.utils.selector(el);
   const heading=el.querySelector<HTMLElement>('.cv3-heading')!;
   const image=el.querySelector<HTMLImageElement>('.cv3-image')!;
   const glassPath=el.querySelector<SVGPathElement>('.cv3-glass-path')!;
   const alignGlass=()=>{
    const b=image.getBoundingClientRect(),h=heading.getBoundingClientRect();
    const s=Math.max(b.width/1672,b.height/941),pos=innerWidth<=600?.63:.5;
    const x=b.left+(b.width-1672*s)*pos-h.left,y=b.top+(b.height-941*s)*.5-h.top;
    glassPath.setAttribute('transform',`matrix(${s} 0 0 ${s} ${x} ${y})`);
    heading.style.setProperty('--glass-width',`${1672*s}px`);heading.style.setProperty('--glass-height',`${941*s}px`);
    heading.style.setProperty('--glass-x',`${x}px`);heading.style.setProperty('--glass-y',`${y}px`);
   };
   gsap.set($('.cv3-copy'),{xPercent:-50,x:0,y:0});
   if(reduced){gsap.set($('.cv3-head-boundary,.cv3-paragraph-boundary'),{x:.3});gsap.set($('.cv3-support,.cv3-cta,.cv3-cta-surface'),{visibility:'visible'});gsap.set($('.cv3-head-soft,.cv3-support-soft,.cv3-contour'),{opacity:0});gsap.set($('.cv3-cta-surface,.cv3-cta-label,.cv3-cta-arrow'),{opacity:1});alignGlass();el.dataset.stage='complete';return;}
   gsap.set($('.cv3-head-boundary,.cv3-paragraph-boundary'),{x:-1.4});
   gsap.set($('.cv3-support,.cv3-cta,.cv3-cta-surface'),{visibility:'hidden'});
   gsap.set($('.cv3-cta-surface,.cv3-cta-label,.cv3-cta-arrow'),{opacity:0});
   const timeline=gsap.timeline({defaults:{ease:'power2.inOut'},onUpdate:alignGlass,scrollTrigger:{trigger:el,start:'top top',end:'bottom bottom',scrub:.55,invalidateOnRefresh:true,onRefresh:alignGlass,onUpdate:self=>{el.dataset.stage=self.progress<.4?'question':self.progress<.67?'statement':'cta'}}});
   timeline.to($('.cv3-head-boundary'),{x:.3,duration:.4},0)
    .to($('.cv3-head-soft'),{opacity:0,duration:.22},.18)
    .to($('.cv3-copy'),{y:-20,duration:.2},.25)
    .to($('.cv3-glass-sharp'),{opacity:0,duration:.2},.22)
    .to($('.cv3-intersection'),{opacity:.85,duration:.28,ease:'sine.inOut'},.12)
    .to($('.cv3-intersection'),{opacity:.35,duration:.2},.4)
    .set($('.cv3-support'),{visibility:'visible'},.43)
    .to($('.cv3-paragraph-boundary'),{x:.3,duration:.24},.43)
    .to($('.cv3-support-soft'),{opacity:0,duration:.16},.51)
    .to($('.cv3-image'),{yPercent:1.5,duration:1,ease:'none'},0)
    .set($('.cv3-cta'),{visibility:'visible'},.68)
    .fromTo($('.cv3-contour rect'),{strokeDasharray:600,strokeDashoffset:600},{strokeDashoffset:0,duration:.2,ease:'none'},.68)
    .set($('.cv3-cta-surface'),{visibility:'visible'},.88)
    .to($('.cv3-cta-surface'),{opacity:1,duration:.08},.88)
    .to($('.cv3-cta-label'),{opacity:1,duration:.07},.91)
    .to($('.cv3-cta-arrow'),{opacity:1,duration:.05},.95);
   alignGlass();
  },el);
  return()=>context.revert();
 },[reduced]);
 return <main ref={root} className={`cv3-hero ${reduced?'is-reduced':''}`} id="home" aria-labelledby="cv3-title">
  <div className="cv3-frame">
   <img className="cv3-image" src={backgroundUrl} alt="" fetchPriority="high"/>
   <div className="cv3-scrim" aria-hidden="true"/>
   <svg className="cv3-mask-definitions" aria-hidden="true"><defs>
    <clipPath id={headMask} clipPathUnits="objectBoundingBox"><path className="cv3-head-boundary" d="M-1 0H1C.78 .22 1.1 .62 .88 1H-1Z"/></clipPath>
    <clipPath id={glassMask} clipPathUnits="userSpaceOnUse"><path className="cv3-glass-path" d={GLASS_OPENING}/></clipPath>
    <clipPath id={paragraphMask} clipPathUnits="objectBoundingBox"><path className="cv3-paragraph-boundary" d="M-1 0H1Q.94 .5 1 1H-1Z"/></clipPath>
   </defs></svg>
   <div className="cv3-copy"><div className="cv3-heading">
    <h1 id="cv3-title" className="cv3-head-soft"><QuestionText/></h1>
    <div className="cv3-glass-sharp" aria-hidden="true" style={{clipPath:`url(#${glassMask})`}}><QuestionText/></div>
    <div className="cv3-head-sharp" aria-hidden="true" style={{clipPath:`url(#${headMask})`}}><QuestionText/></div>
    <div className="cv3-intersection" aria-hidden="true" style={{maskImage:edgeMask,WebkitMaskImage:edgeMask}}><QuestionText/></div>
   </div>
   <div className="cv3-support">
    <p className="cv3-support-soft">{statement}</p>
    <p className="cv3-support-sharp" aria-hidden="true" style={{clipPath:`url(#${paragraphMask})`}}>{statement}</p>
   </div>
   <div className="cv3-cta">
    <svg className="cv3-contour" viewBox="0 0 260 58" aria-hidden="true"><rect x="1" y="1" width="258" height="56" rx="28" pathLength="600"/></svg>
    <a className="cv3-cta-surface" href={contactHref}><span className="cv3-cta-label">Discuss your workflow</span><svg className="cv3-cta-arrow" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="M4 16 16 4M5 4h11v11" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg></a>
   </div></div>
   <div className="cv3-installation-space" aria-hidden="true" data-reserved="installation"/>
  </div>
 </main>;
}
