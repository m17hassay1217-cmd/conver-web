import{chromium}from'playwright';import{mkdirSync,writeFileSync}from'node:fs';mkdirSync('work/v3',{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});const checks=[],errors=[];
function check(name,pass,detail){checks.push({name,pass,...(detail?{detail}:{})});if(!pass)process.exitCode=1}
try{const page=await browser.newPage();page.on('pageerror',e=>errors.push(e.message));for(const[width,height]of[[1440,900],[1280,800],[768,1024],[390,844],[375,812]]){
await page.setViewportSize({width,height});await page.goto('http://127.0.0.1:4198/?hero=v3');await page.evaluate(()=>document.fonts.ready);await page.waitForFunction(()=>document.querySelector('.cv3-image')?.naturalWidth===1672);check(`${width}: original background loaded`,true);
check(`${width}: isolated hero`,await page.locator('header,nav,canvas').count()===0);
for(const p of [0,.2,.5,.7,1,.5,0]){await page.evaluate(p=>scrollTo({top:(document.documentElement.scrollHeight-innerHeight)*p,behavior:'instant'}),p);await page.waitForTimeout(1000);
const sizes=await page.evaluate(()=>{const h=document.querySelector('.cv3-heading').getBoundingClientRect(),s=document.querySelector('.cv3-support').getBoundingClientRect(),c=document.querySelector('.cv3-cta').getBoundingClientRect();return{h:{top:h.top,bottom:h.bottom,height:h.height},s:{top:s.top,bottom:s.bottom},c:{top:c.top,bottom:c.bottom},lines:Math.round(document.querySelector('h1').offsetHeight/parseFloat(getComputedStyle(document.querySelector('h1')).lineHeight)),overflow:document.documentElement.scrollWidth>innerWidth}});
check(`${width} progress ${p}: no horizontal overflow`,!sizes.overflow);
if(p>=.5)check(`${width} progress ${p}: text separation`,sizes.h.bottom+40<=sizes.s.top,sizes);
if(p===1){check(`${width}: CTA visible`,await page.locator('.cv3-cta-surface').isVisible());check(`${width}: balanced headline lines`,sizes.lines<=(width<=600?4:3),sizes);await page.screenshot({path:`work/v3/${width}-final.png`})}
if(p===0)check(`${width}: CTA not prematurely focusable`,!await page.locator('.cv3-cta-surface').isVisible());}
}
await page.emulateMedia({reducedMotion:'reduce'});await page.goto('http://127.0.0.1:4198/?hero=v3');await page.waitForTimeout(200);check('Reduced motion shows final content without pinned distance',await page.locator('.cv3-cta-surface').isVisible()&&await page.locator('.cv3-hero').evaluate(el=>el.offsetHeight<=innerHeight));check('No runtime errors',errors.length===0,errors);
}finally{await browser.close();writeFileSync('work/v3/layout-qa.json',JSON.stringify({background:'Original supplied PNG; decoded dimensions1672×941. See asset checksum in V3 report.',checks,errors},null,2));console.log(JSON.stringify(checks.filter(x=>!x.pass),null,2))}
