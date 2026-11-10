import { useEffect, useRef, useState } from 'react';
type Api={render:(node:HTMLElement,options:Record<string,unknown>)=>string;remove:(id:string)=>void};
declare global {interface Window{turnstile?:Api}}
let loading:Promise<Api>|undefined;
function load(){
 if(window.turnstile)return Promise.resolve(window.turnstile);
 return loading??=new Promise<Api>((resolve,reject)=>{
  const script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.async=true;script.defer=true;
  script.onload=()=>window.turnstile?resolve(window.turnstile):reject(Error('Security check did not load.'));
  script.onerror=()=>{loading=undefined;script.remove();reject(Error('Security check is unavailable. Reload the page before sending.'))};
  document.head.append(script);
 });
}
/** Optional official explicit-render integration. The receiving server must verify every token. */
export function TurnstileField({siteKey,onToken}:{siteKey:string;onToken:(token:string)=>void}){
 const node=useRef<HTMLDivElement>(null),callback=useRef(onToken),[error,setError]=useState('');callback.current=onToken;
 useEffect(()=>{let alive=true,id:string|undefined,api:Api|undefined;load().then(value=>{if(!alive||!node.current)return;api=value;id=value.render(node.current,{sitekey:siteKey,theme:'dark',size:'flexible',callback:(token:string)=>callback.current(token),'expired-callback':()=>callback.current(''),'error-callback':()=>{callback.current('');setError('Security check needs attention. Reload before sending.')}})}).catch(e=>{if(alive)setError(e.message)});return()=>{alive=false;if(api&&id)api.remove(id);callback.current('')};},[siteKey]);
 return <div className="cv-security-check"><div ref={node}/>{error&&<p role="alert">{error}</p>}</div>;
}
