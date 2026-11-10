import { useState } from 'react';
import './decision-sections.css';
const gbp=(n:number)=>new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:0}).format(n);
const number=(n:number,digits=1)=>new Intl.NumberFormat('en-GB',{maximumFractionDigits:digits}).format(n);
export function calculateValue(n:number,b:number,d:number,v:number,h:number,c:number){
 const safe=(x:number,max:number)=>Math.min(max,Math.max(0,Number.isFinite(x)?x:0));
 const N=safe(n,10000),B=safe(b,100)/100,D=Math.min(safe(d,100)/100,1-B),V=safe(v,10000000),H=safe(h,168)*52/12,C=safe(c,500);
 return{current:N*B,additional:N*D,monthly:N*D*V,annual:N*D*V*12,hours:H,cost:H*C,effective:D*100};
}
export function CalculatorSection(){
 const [n,N]=useState(40),[b,B]=useState(15),[d,D]=useState(5),[v,V]=useState(12000),[h,H]=useState(5),[c,C]=useState(20),[kind,K]=useState('contract');
 const result=calculateValue(n,b,d,v,h,c);
 const field=(id:string,label:string,value:number,set:(n:number)=>void,max:number,suffix:string,step=1)=> <label className="cv-number-field" htmlFor={id}><span>{label}</span><div><input id={id} type="number" min="0" max={max} step={step} value={value} onChange={e=>set(Math.max(0,Math.min(max,Number(e.target.value)||0)))} /><span>{suffix}</span></div></label>;
 return <section id="value" data-section="09" className="cv-section cv-value"><div className="cv-container"><div className="cv-section-heading"><p className="cv-eyebrow">09 / THE VALUE OF A BETTER PROCESS</p><h2 className="cv-title">What could a better enquiry-to-booking process be worth?</h2><p className="cv-copy">Explore potential value using your own figures and transparent assumptions.</p></div>
 <div className="cv-calculator"><div className="cv-calc-inputs"><div className="cv-calc-label"><span>YOUR SCENARIO</span><small>Editable examples. Not industry statistics.</small></div>
 {field('cv-enquiries','Monthly commercial enquiries',n,N,10000,'enquiries')}
 <div className="cv-input-pair">{field('cv-booking-rate','Current booking rate',b,B,100,'%')}{field('cv-improvement','Hypothetical improvement',d,D,100,'pp')}</div>
 <p className="cv-field-help">Percentage points, not a relative percentage increase. The resulting booking rate cannot exceed 100%.</p>
 {field('cv-booking-value','Average value of newly booked work',v,V,10000000,'GBP')}
 <fieldset className="cv-value-kind"><legend>What does this value represent?</legend><label><input type="radio" name="value-kind" checked={kind==='job'} onChange={()=>K('job')}/> One-off job value</label><label><input type="radio" name="value-kind" checked={kind==='contract'} onChange={()=>K('contract')}/> Estimated first-year contract value</label></fieldset>
 <details className="cv-efficiency" open><summary>Optional: administrative efficiency</summary><div className="cv-input-pair">{field('cv-hours','Hours potentially saved',h,H,168,'/ week',.5)}{field('cv-hourly','Relevant employment cost',c,C,500,'GBP / hour',.5)}</div></details>
 </div><div className="cv-calc-results" aria-live="polite" aria-atomic="true"><div className="cv-calc-label"><span>ILLUSTRATIVE POTENTIAL</span><small>Not a forecast or a promise.</small></div>
 <div className="cv-recovered"><span>Recovered opportunity</span><div><strong data-result="additional">{number(result.additional)}</strong><p>additional bookings<br/>per month</p></div><small>Current expected bookings: {number(result.current)} / month.<br/>Effective assumed improvement: {number(result.effective)} percentage points.</small></div>
 <div className="cv-work-value"><span>Value of additional work</span><strong data-result="monthly">{gbp(result.monthly)}</strong><p>new-work booking value in one month</p><div><span>Annualized booking-value scenario</span><b data-result="annual">{gbp(result.annual)}</b></div></div>
 <p className="cv-contract-note">{kind==='contract'?'This is the face value of additional first-year contracts potentially booked—not revenue earned or recognized in that month.':'This is the gross value of additional jobs potentially booked—not profit or a net return.'}</p>
 <div className="cv-cost-value"><span>Efficiency potential · kept separate</span><p><b data-result="hours">{number(result.hours)}</b> administrative hours / month</p><p><b data-result="cost">{gbp(result.cost)}</b> monthly staff-cost equivalent</p><small>Time released does not necessarily reduce payroll. This is not added to booking value or presented as net ROI.</small></div>
 </div></div>
 <div className="cv-calc-transparency"><span className="cv-note-mark">i</span><p>These estimates are illustrative, not guaranteed outcomes. Actual results depend on enquiry quality, current processes, implementation scope and commercial circumstances.</p></div>
 <details className="cv-formula"><summary>See the assumptions and calculation</summary><p>Additional monthly bookings = enquiries × min(assumed percentage-point improvement, 100% − current booking rate). Booking value = additional bookings × selected job or contract value. Annualized scenario = monthly booking value × 12. Monthly hours = weekly hours × 52 ÷ 12. Staff-cost equivalent = monthly hours × relevant hourly cost. No implementation costs, ongoing fees, margin or profit assumptions have been supplied, so no net ROI is calculated.</p></details>
 </div></section>;
}
