import { useLayoutEffect, useRef } from 'react';
import { gsap } from './animation';
import { useReducedMotion } from './motion';
const currency = new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:0});
const decimal = new Intl.NumberFormat('en-GB',{maximumFractionDigits:1});
export function AnimatedNumber({value,money=false}:{value:number;money?:boolean}){
 const node=useRef<HTMLSpanElement>(null),proxy=useRef({value}),reduced=useReducedMotion();
 useLayoutEffect(()=>{
  const format=(n:number)=>money?currency.format(n):decimal.format(n);
  if(reduced){proxy.current.value=value;if(node.current)node.current.textContent=format(value);return;}
  const tween=gsap.to(proxy.current,{value,duration:.35,ease:'power2.out',onUpdate:()=>{if(node.current)node.current.textContent=format(proxy.current.value)}});
  return()=>{tween.kill()};
 },[value,money,reduced]);
 return <span ref={node} aria-label={money?currency.format(value):decimal.format(value)}>{money?currency.format(value):decimal.format(value)}</span>;
}
