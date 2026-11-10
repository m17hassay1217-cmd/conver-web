import { useEffect, useRef, useState } from 'react';
import { HeroSection, IntroSplash } from './HeroSection';
import { IndustrySection } from './IndustrySection';
import { ProblemsSection } from './ProblemsSection';
import { CausesSection } from './CausesSection';
import { MethodSection } from './MethodSection';
import { WorkflowsSection } from './WorkflowsSection';
import { OutcomesSection } from './OutcomesSection';
import { ImplementationSection } from './ImplementationSection';
import { CalculatorSection } from './CalculatorSection';
import { ContactSection } from './ContactSection';
import { useReducedMotion } from './motion';
import logo from '../assets/converdive-logo.svg';
import './site.css';
const links=[['industry','Why cleaning'],['problems','The challenges'],['approach','Our approach'],['workflows','How it works'],['outcomes','Outcomes'],['value','Value'],['contact','Let’s talk']] as const;
const VISIT='converdive:complete-site:intro:v1';
function seen(){try{return localStorage.getItem(VISIT)==='true'}catch{return false}}
export function Website(){
 const reduced=useReducedMotion(),mode=new URLSearchParams(location.search).get('intro');
 const [intro,setIntro]=useState(()=>!matchMedia('(prefers-reduced-motion: reduce)').matches&&mode!=='skip'&&(mode==='review'||mode==='1'||!seen()));
 const [menu,setMenu]=useState(false),[active,setActive]=useState('home');const main=useRef<HTMLElement>(null);
 function done(){setIntro(false);if(mode!=='review')try{localStorage.setItem(VISIT,'true')}catch{}requestAnimationFrame(()=>main.current?.focus({preventScroll:true}))}
 useEffect(()=>{if(reduced)setIntro(false)},[reduced]);
 useEffect(()=>{if(!intro)return;const previous=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=previous}},[intro]);
 useEffect(()=>{let frame=0;const update=()=>{frame=0;const sections=Array.from(document.querySelectorAll<HTMLElement>('[data-section]'));const match=sections.find(el=>{const r=el.getBoundingClientRect();return r.top<=innerHeight*.4&&r.bottom>innerHeight*.4});if(match)setActive(match.id)};const scroll=()=>{if(!frame)frame=requestAnimationFrame(update)};window.addEventListener('scroll',scroll,{passive:true});return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',scroll)}},[]);
 return <><div className="cv-site" inert={intro} aria-hidden={intro||undefined}><a href="#main-content" className="cv-skip-link">Skip to content</a><header className="cv-nav"><div className="cv-nav-inner"><a className="cv-brand" href="#home" aria-label="Converdive home"><img src={logo} alt="" width="42" height="35"/><span>Converdive</span></a><button className="cv-menu-button" onClick={()=>setMenu(!menu)} aria-expanded={menu} aria-controls="cv-navigation">{menu?'Close ×':'Menu +'}</button><nav id="cv-navigation" className={`cv-nav-links ${menu?'is-open':''}`} aria-label="Main navigation" onKeyDown={e=>{if(e.key==='Escape')setMenu(false)}}>{links.map(([id,label])=><a href={`#${id}`} key={id} aria-current={active===id?'true':undefined} className={id==='contact'?'cv-nav-contact':''} onClick={()=>setMenu(false)}>{label}</a>)}</nav></div></header><main id="main-content" ref={main} tabIndex={-1} className="cv-main">{!intro&&<HeroSection/>}<IndustrySection/><ProblemsSection/><CausesSection/><MethodSection/><WorkflowsSection/><OutcomesSection/><ImplementationSection/><CalculatorSection/><ContactSection/></main></div>{intro&&<IntroSplash onComplete={done}/>}</>;
}
