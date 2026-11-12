import { useId, useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from './animation';
import { useReducedMotion } from './motion';
import './hero-v3.css';

function QuestionText(){return <>How well does your <span className="cv3-unbroken">enquiry-to-booking</span> process actually work?</>}
const statement='We design targeted AI-enabled workflows to reduce unnecessary manual work and help commercial enquiries progress more smoothly.';
/** Reserved progress is an integration seam: the future installation owns .55–.82. */
export const HERO_V3_SCORE={clarityEnd:.22,settleStart:.22,settleEnd:.36,statementEnd:.54,installationEnd:.82,contourEnd:.97};
export function HeroV3({backgroundUrl='/brand/neon-swept-st-pauls.png',contactHref='/?intro=skip#contact'}:{backgroundUrl?:string;contactHref?:string}){
 const root=useRef<HTMLElement>(null),reduced=useReducedMotion();
 const uid=useId().replace(/:/g,'');const rimMask=`cv3-rim-${uid}`;const headlineMask=`cv3-head-${uid}`,paragraphMask=`cv3-paragraph-${uid}`;
 useLayoutEffect(()=>{
  const el=root.current;if(!el)return;
  const context=gsap.context(()=>{
   const $=gsap.utils.selector(el);
   gsap.set($('.cv3-copy'),{xPercent:-50,x:0,y:0});
   if(reduced){gsap.set($('.cv3-head-boundary,.cv3-paragraph-boundary'),{x:.3});gsap.set($('.cv3-support,.cv3-cta'),{visibility:'visible'});gsap.set($('.cv3-copy'),{y:()=>-innerHeight*.06});gsap.set($('.cv3-heading'),{scale:.94});gsap.set($('.cv3-head-soft,.cv3-support-soft,.cv3-contour,.cv3-rim'),{opacity:0});gsap.set($('.cv3-cta-surface'),{opacity:1});el.dataset.stage='complete';return;}
   gsap.set($('.cv3-head-boundary'),{x:-1.4});gsap.set($('.cv3-paragraph-boundary'),{x:-1.4});
   gsap.set($('.cv3-support,.cv3-cta'),{visibility:'hidden'});gsap.set($('.cv3-cta-surface'),{opacity:0,visibility:'hidden'});
   const timeline=gsap.timeline({defaults:{ease:'power2.inOut'},scrollTrigger:{trigger:el,start:'top top',end:'bottom bottom',scrub:.65,invalidateOnRefresh:true,onUpdate:self=>{el.dataset.stage=self.progress<.22?'question':self.progress<.36?'settle':self.progress<.55?'statement':self.progress<.82?'reserved':'cta'}}});
   timeline.to($('.cv3-head-boundary'),{x:.3,duration:.22},0)
    .to($('.cv3-head-soft'),{opacity:0,duration:.13},.1)
    .to($('.cv3-rim'),{opacity:0,duration:.02},.2)
    .to($('.cv3-copy'),{y:()=>-innerHeight*.06,duration:.14},.22)
    .to($('.cv3-heading'),{scale:.94,duration:.14},.22)
    .to($('.cv3-intersection'),{'--light-x':'118%','--light-y':'5%',duration:.34,ease:'sine.inOut'},.23)
    .set($('.cv3-support'),{visibility:'visible'},.36)
    .to($('.cv3-paragraph-boundary'),{x:.3,duration:.18},.36)
    .to($('.cv3-support-soft'),{opacity:0,duration:.12},.42)
    .to($('.cv3-illumination'),{'--field-x':'95%','--field-y':'13%',duration:.4,ease:'sine.inOut'},.18)
    .to($('.cv3-image'),{yPercent:2.5,duration:1,ease:'none'},0)
    .set($('.cv3-cta'),{visibility:'visible'},.82)
    .fromTo($('.cv3-contour rect'),{strokeDasharray:600,strokeDashoffset:600},{strokeDashoffset:0,duration:.15,ease:'power2.out'},.82)
    .set($('.cv3-cta-surface'),{visibility:'visible'},.89)
    .to($('.cv3-cta-surface'),{opacity:1,duration:.1},.89)
    .to($('.cv3-contour'),{opacity:.18,duration:.03},.97);

  },el);
  return()=>context.revert();
 },[reduced]);
 return <main ref={root} className={`cv3-hero ${reduced?'is-reduced':''}`} id="home" aria-labelledby="cv3-title">
  <div className="cv3-frame">
   <img className="cv3-image" src={backgroundUrl} alt="" fetchPriority="high"/>
   <img className="cv3-image cv3-illumination" src={backgroundUrl} alt="" aria-hidden="true"/>
   <div className="cv3-scrim" aria-hidden="true"/>
   <svg className="cv3-mask-definitions" aria-hidden="true"><defs>
    <clipPath id={headlineMask} clipPathUnits="objectBoundingBox"><path className="cv3-head-boundary" d="M-1 0H1C.78 .22 1.1 .62 .88 1H-1Z"/></clipPath>
    <clipPath id={rimMask} clipPathUnits="objectBoundingBox"><path className="cv3-head-boundary" d="M.98 0C.76 .22 1.08 .62 .86 1H.9C1.12 .62 .8 .22 1.02 0Z"/></clipPath>
    <clipPath id={paragraphMask} clipPathUnits="objectBoundingBox"><path className="cv3-paragraph-boundary" d="M-1 0H1Q.94 .5 1 1H-1Z"/></clipPath>
   </defs></svg>
   <div className="cv3-copy"><div className="cv3-heading">
    <h1 id="cv3-title" className="cv3-head-soft">{<QuestionText/>}</h1>
    <div className="cv3-head-sharp" aria-hidden="true" style={{clipPath:`url(#${headlineMask})`}}>{<QuestionText/>}</div>
    <div className="cv3-rim" aria-hidden="true" style={{clipPath:`url(#${rimMask})`}}>{<QuestionText/>}</div>
    <div className="cv3-intersection" aria-hidden="true" style={{clipPath:`url(#${headlineMask})`}}>{<QuestionText/>}</div>
   </div>
   <div className="cv3-support">
    <p className="cv3-support-soft">{statement}</p>
    <p className="cv3-support-sharp" aria-hidden="true" style={{clipPath:`url(#${paragraphMask})`}}>{statement}</p>
   </div></div>
   <div className="cv3-installation-space" aria-hidden="true" data-reserved="installation"/>
   <div className="cv3-cta">
    <svg className="cv3-contour" viewBox="0 0 250 56" aria-hidden="true"><rect x="1" y="1" width="248" height="54" rx="27" pathLength="600"/></svg>
    <a className="cv3-cta-surface" href={contactHref}>Discuss your workflow <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="M4 16 16 4M5 4h11v11" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg></a>
   </div>
  </div>
 </main>;
}
