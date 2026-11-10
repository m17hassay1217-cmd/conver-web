/* Converdive Cycle 1 — browser-native technical prototype, no external dependencies. */
(()=>{
'use strict';
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const narrow=window.matchMedia('(max-width: 720px)');
const items=[
 {name:'Qualification misrouting',short:'Sales capacity spent on unsuitable enquiries',surface:'Commercial glass',visible:'Time-intensive assessments generate too few viable quotations.',m1:'Enquiries enter unsuitable assessment or site-survey routes.',m2:'Scope, geography, complexity and feasibility are not evaluated together.',root:'No reliable context-sensitive qualification and routing mechanism.',ai:'Interpret the enquiry, flag missing site/service details and recommend the next route.',automation:'Request approved clarifications, update records and route the case.',human:'Confirm viability, exceptions and estimating priorities.',effect:'More complete information before assessment; less avoidable handling effort may result.'},
 {name:'Quotation integrity',short:'Repeated revisions and inconsistent scope',surface:'Commercial flooring',visible:'Proposals need avoidable revision or rely on mismatched service assumptions.',m1:'Quoted scope does not reflect the latest agreed requirements.',m2:'Survey notes, customer communications and changes are not reconciled.',root:'No traceable, version-controlled requirements-to-proposal process.',ai:'Compare survey documents, messages and scope changes; detect discrepancies.',automation:'Record versions, request resolution and alert estimators.',human:'Approve cleaning specifications, prices and final quotation.',effect:'Fewer preventable clarifications or revisions may follow.'},
 {name:'Proposal progression',short:'Interested prospects stay unresolved',surface:'Tile / hard surface',visible:'Proposals stay outstanding without progressing toward a decision.',m1:'Open questions, requested revisions or approvals remain unresolved.',m2:'The next decision, accountable person or suitable timing is unclear.',root:'No dependable tracking of decision readiness and next actions.',ai:'Identify decision blockers and relevant follow-up context.',automation:'Assign next actions, notify owners and escalate overdue items.',human:'Negotiate, agree commitments and approve commercial terms.',effect:'A clearer next step may reduce unnecessary proposal stagnation.'},
 {name:'Account expansion',short:'Additional site opportunities not surfaced',surface:'Multi-site façade',visible:'Potential additional sites or services never become formal proposals.',m1:'New requirements are treated as isolated requests.',m2:'The link to existing accounts, sites or agreements is not recognized.',root:'No reliable account/site/opportunity relationship mapping.',ai:'Associate new requests with existing customer/site context; flag possible additions.',automation:'Create linked tasks and notify account owners.',human:'Judge opportunity relevance and approve contact or proposal.',effect:'More possible contract extensions may receive proper review.'}
];
const $=(s,ctx=document)=>ctx.querySelector(s);
const $$=(s,ctx=document)=>Array.from(ctx.querySelectorAll(s));
const el=(tag,attrs={},children=[])=>{const e=document.createElement(tag);for(const [k,v] of Object.entries(attrs)){if(k==='class')e.className=v;else if(k==='text')e.textContent=v;else e.setAttribute(k,v)}for(const ch of children)e.append(ch);return e};
let activeCause=-1,activeMethod=-1,activeWorkflow=-1,activeDelivery=0;
// SECTION 03 preview: click/tap is the discoverable equivalent of the magnifier.
const previews=$('#surfacePreviewGrid');
items.forEach((it,i)=>{
 const b=el('button',{class:'preview-card','type':'button','aria-label':`Explore problem ${i+1}: ${it.short}`});
 b.innerHTML=`<span class="magnify" aria-hidden="true">⌕</span><div class="surface-art" aria-hidden="true"></div><small>0${i+1} · ${it.surface}</small><strong>${it.short}</strong>`;
 b.addEventListener('click',()=>goCause(i));previews.append(b);
});
// SECTION 04 coverflow: all causal layers visible at once.
const coverflow=$('#coverflowTrack'),dots=$('#causeDots');
items.forEach((it,i)=>{
 const card=el('article',{class:'cause-card','aria-label':`Causal sequence ${i+1}: ${it.name}`});
 const blocks=[['VISIBLE PROBLEM',it.visible,'visible'],['MEDIATOR 01',it.m1,''],['MEDIATOR 02',it.m2,''],['POSSIBLE ROOT',it.root,'root']];
 card.innerHTML=`<span class="card-id">0${i+1} / 04 · HYPOTHESIS</span><h3>${it.name}</h3><div class="causal-chain">${blocks.map(([tag,copy,style])=>`<div class="cause-level ${style}"><span class="level-tag">${tag}</span><span class="level-copy">${copy}</span></div>`).join('')}</div>`;
 card.addEventListener('click',()=>{if(i!==activeCause)goCause(i)});coverflow.append(card);
 const d=el('button',{type:'button','aria-label':`Select causal cross-section ${i+1}`,text:`0${i+1}`});d.addEventListener('click',()=>goCause(i));dots.append(d);
});
function paintCause(idx){if(idx===activeCause)return;activeCause=idx;
 const cards=$$('.cause-card',coverflow),buttons=$$('button',dots);
 cards.forEach((c,i)=>{const delta=i-idx,dist=Math.abs(delta),x=delta*(narrow.matches?72:350),sc=dist===0?1:dist===1?.7:.54,z=dist===0?0:-170-dist*80,rotate=delta===0?0:delta<0?20:-20;
 c.style.transform=`translateX(calc(-50% + ${x}px)) translateZ(${z}px) scale(${sc}) rotateY(${rotate}deg)`;
 c.style.opacity=dist<=1?1:.13;c.style.filter=dist===0?'none':'saturate(.62) blur(1px)';c.style.zIndex=String(10-dist);c.classList.toggle('is-active',dist===0);c.setAttribute('aria-hidden',dist===0?'false':'true');
 c.style.pointerEvents=dist<=1?'auto':'none';
 });buttons.forEach((b,i)=>{b.classList.toggle('active',i===idx);b.setAttribute('aria-pressed',i===idx?'true':'false')});$('#causeCounter').textContent=`0${idx+1} / 04`;
}
function goCause(i){const next=Math.max(0,Math.min(3,i));paintCause(next);if(!narrow.matches&&!reduced.matches){const s=$('#causes'),rect=s.getBoundingClientRect(),base=window.scrollY+rect.top,travel=s.offsetHeight-window.innerHeight+74;window.scrollTo({top:base+travel*((next+.12)/4),behavior:'smooth'});}else if(document.activeElement?.closest('.preview-card'))$('#causes').scrollIntoView({behavior:reduced.matches?'instant':'smooth'});}
$('#causePrev').addEventListener('click',()=>goCause((activeCause+3)%4));$('#causeNext').addEventListener('click',()=>goCause((activeCause+1)%4));paintCause(0);
// SECTION 05 adaptive instrument: four methodologies + one differentiation synthesis.
const methods=[
 {tag:'01 / DIAGNOSE',title:'Understand before assuming.',desc:'We examine how the workflow actually operates, what information it uses and which conditions may explain visible friction.',label:'Optical reconstruction / signals become structure',kind:'diagnose'},
 {tag:'02 / PRIORITIZE',title:'Choose what is worth changing.',desc:'We compare consequences, controllability, feasibility and downstream influence before selecting an intervention.',label:'Precision focus / several options, one justified target',kind:'prioritize'},
 {tag:'03 / ENGINEER',title:'Make the solution fit the process.',desc:'We configure suitable intelligence and automation around existing work, with explicit human decision boundaries.',label:'Adaptive assembly / components fit the actual requirements',kind:'engineer'},
 {tag:'04 / VERIFY',title:'Prove what changed.',desc:'We test the intervention, check exceptions, measure operational impact and revise weak points.',label:'Calibration / compare, test and refine',kind:'verify'},
 {tag:'CONVERDIVE / DIFFERENTIATION',title:"We don't start with what AI can do. We start with what's worth changing.",desc:'Diagnose the real process. Prioritize a justified change. Engineer to fit. Verify the result.',label:'One connected method / Converdive',kind:'differentiate'}
];
const methodButtons=$('#methodControls');methods.forEach((m,i)=>{const b=el('button',{type:'button','aria-label':`Select ${m.tag}`,text:i<4?`0${i+1}`:'Our difference'});b.addEventListener('click',()=>goMethod(i));methodButtons.append(b);});
function paintMethod(index){if(index===activeMethod)return;activeMethod=index;const m=methods[index],node=$('#methodContent');node.classList.remove('is-entering');void node.offsetWidth;node.dataset.kind=m.kind;node.classList.add('is-entering');$('#methodStep').textContent=m.tag;$('#method-title').textContent=m.title;$('#methodDesc').textContent=m.desc;const ins=$('#instrument');ins.className=`instrument phase-${index}`;ins.setAttribute('aria-label',m.label);$('#instrumentCaption').textContent=m.label;$$('button',methodButtons).forEach((b,i)=>{b.classList.toggle('active',i===index);b.setAttribute('aria-pressed',i===index?'true':'false')});}
function goMethod(i){const next=Math.max(0,Math.min(4,i));paintMethod(next);if(!narrow.matches&&!reduced.matches){const s=$('#method'),base=window.scrollY+s.getBoundingClientRect().top,travel=s.offsetHeight-window.innerHeight+74;window.scrollTo({top:base+travel*((next+.15)/5),behavior:'smooth'});}}
paintMethod(0);
// Scroll scrub via rAF. Mobile/reduced-motion keep controls, avoid pinned scrollytelling.
let queued=false;function scrollScene(){queued=false;if(narrow.matches||reduced.matches)return;[
 ['#causes',4,paintCause],['#method',5,paintMethod]
 ].forEach(([selector,count,fn])=>{const s=$(selector),rect=s.getBoundingClientRect(),range=s.offsetHeight-window.innerHeight+74;if(rect.top<window.innerHeight&&rect.bottom>0&&range>0){const p=Math.max(0,Math.min(.999,(-rect.top)/range));fn(Math.min(count-1,Math.floor(p*count)));}});}
window.addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(scrollScene)}},{passive:true});window.addEventListener('resize',scrollScene);requestAnimationFrame(scrollScene);
// SECTION 06: simple guided playback, scenario selection and human boundary.
const optionWrap=$('#workflowOptions');items.forEach((it,i)=>{const b=el('button',{type:'button',class:'workflow-option'});b.innerHTML=`<span class="workflow-num">0${i+1} · SCENARIO</span><strong>${it.name}</strong><span>Click to play proposed change →</span>`;b.addEventListener('click',()=>openWorkflow(i));optionWrap.append(b)});
let wfTimer=null,stepTimer=null;
function openWorkflow(i){clearTimeout(wfTimer);clearInterval(stepTimer);activeWorkflow=i;const it=items[i];$$('.workflow-option',optionWrap).forEach((b,j)=>{b.classList.toggle('current',j===i);b.setAttribute('aria-pressed',j===i?'true':'false')});const details=$('#workflowDetails');details.innerHTML=`<div class="small-label">SIMULATED / NOT A LIVE CLIENT SYSTEM</div><h3>${it.name}</h3><p>${it.root}</p><div class="action-track"><div class="action-node"><small>01 · CONDITION</small><b>Controllable upstream process</b></div><div class="action-node"><small>02 · AI SUPPORT</small><b>${it.ai}</b></div><div class="action-node"><small>03 · AUTOMATED ACTIONS</small><b>${it.automation}</b></div><div class="action-node"><small>04 · HUMAN AUTHORITY</small><b>${it.human}</b></div></div><p class="small-note" style="margin-top:14px">Possible change: ${it.effect}</p>`;
 const nodes=$$('.action-node',details);let step=0;const apply=()=>{if(step<nodes.length)nodes[step++].classList.add('improved');else{clearInterval(stepTimer);wfTimer=setTimeout(()=>{if(activeWorkflow!==i)return;details.innerHTML='<p class="small-note">Scenario playback complete. Select the highlighted next scenario to continue.</p>';const ni=(i+1)%4;$$('.workflow-option',optionWrap).forEach((b,j)=>b.classList.toggle('current',j===ni));},1300);}};
 if(reduced.matches){nodes.forEach(n=>n.classList.add('improved'));}else{apply();stepTimer=setInterval(apply,850);}
}
$$('.workflow-option',optionWrap)[0].classList.add('current');
$('#workflowDetails').innerHTML='<p class="small-note">Select the highlighted first scenario to play the proposed intervention. After it finishes, the next scenario is highlighted.</p>';
// SECTION 07: exactly three visible owner outcome ripples.
const outcomeBtns=$$('#outcomeStates button');function selectOutcome(i){outcomeBtns.forEach((b,j)=>{b.classList.toggle('selected',j===i);b.setAttribute('aria-pressed',j===i?'true':'false')});$('.ripple-graphic').dataset.active=i}outcomeBtns.forEach((b,i)=>b.addEventListener('click',()=>selectOutcome(i)));selectOutcome(0);
// SECTION 08: lifecycle control layers affect the whole workflow, never 1:1 stages.
const deliveries=[
 ['Will this disrupt my operations?','Map & Connect','Review existing systems and make selective connections while preserving what already works.'],
 ['How long will implementation take?','Configure & Test','Scope and dependencies determine delivery time. Configure selected connections, then test before wider rollout.'],
 ['What if something goes wrong?','Launch with Safeguards','Introduce controlled release, human approvals, exceptions and safe fallback paths.'],
 ['What happens after launch?','Monitor & Maintain','Inspect failures, monitor agreed performance, maintain and refine the running system.']
];
const deliverySelector=$('#deliverySelector');deliveries.forEach(([question,title,desc],i)=>{const b=el('button',{type:'button'});b.innerHTML=`<span class="small-label">0${i+1} / 04</span><strong>${title}</strong><small>${question}</small>`;b.title=desc;b.addEventListener('click',()=>selectDelivery(i));deliverySelector.append(b)});
function selectDelivery(i){activeDelivery=i;$$('button',deliverySelector).forEach((b,j)=>{b.classList.toggle('current',i===j);b.setAttribute('aria-pressed',i===j?'true':'false')});$$('[data-delivery-layer]').forEach((b,j)=>b.classList.toggle('lit',j<=i));$('.delivery-display').dataset.stage=i;const d=$('.delivery-display>.small-note');d.textContent=`${deliveries[i][0]} ${deliveries[i][2]} This is a conceptual delivery state, not a live system status.`;}
selectDelivery(0);
// SECTION 09: no invented % improvement; user can edit all assumptions.
const fmtGBP=new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:0});const fmtNum=new Intl.NumberFormat('en-GB',{maximumFractionDigits:1});const clamp=(v,min,max)=>Math.min(max,Math.max(min,Number.isFinite(v)?v:min));
function compute(){const get=(id,max)=>clamp(Number($(`#${id}`).value),0,max),enq=get('monthlyEnquiries',1e6),base=get('bookingRate',100),uplift=get('rateGain',100),gross=get('jobValue',1e8),hours=get('hoursSaved',168),rate=get('hourlyCost',1e4),effective=Math.max(0,Math.min(100-base,uplift)),bookings=enq*effective/100,revenue=bookings*gross,monthlyHours=hours*52/12;
 $('#outBookings').textContent=fmtNum.format(bookings);$('#outRevenue').textContent=fmtGBP.format(revenue);$('#outAnnual').textContent=fmtGBP.format(revenue*12);$('#outHours').textContent=fmtNum.format(monthlyHours);$('#outStaff').textContent=fmtGBP.format(monthlyHours*rate);
 $('#rateGain').setAttribute('aria-description',`Effective improvement capped at ${fmtNum.format(100-base)} percentage points to avoid exceeding a 100 percent booking rate.`);
}$('#roiForm').addEventListener('input',compute);compute();
// SECTION 10: intentionally no network side effects until real backend is provided.
$('#contactForm').addEventListener('submit',e=>{e.preventDefault();$('#contactFeedback').textContent='Demo only — no message was sent or stored. Live contact integration is pending.';});
// Keyboard navigation while section in view. Avoid overriding typing or native links.
document.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key)||/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName||''))return;const c=$('#causes').getBoundingClientRect(),m=$('#method').getBoundingClientRect();if(c.top<window.innerHeight*.65&&c.bottom>window.innerHeight*.3){e.preventDefault();goCause((activeCause+(e.key==='ArrowRight'?1:3))%4);}else if(m.top<window.innerHeight*.65&&m.bottom>window.innerHeight*.3){e.preventDefault();goMethod((activeMethod+(e.key==='ArrowRight'?1:4))%5);}});
})();
