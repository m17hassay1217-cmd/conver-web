import { chromium } from 'playwright';
import { mkdirSync,writeFileSync } from 'node:fs';
const out='work/v2',checks=[],errors=[],frames=[];mkdirSync(`${out}/screens`,{recursive:true});
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1440,height:900}});page.on('pageerror',e=>errors.push(e.message));
const check=(name,pass,detail)=>{checks.push({name,pass:!!pass,...(detail?{detail}:{})});if(!pass)process.exitCode=1};
const seek=async(id,p)=>{await page.evaluate(({id,p})=>{const el=document.getElementById(id);scrollTo({top:el.offsetTop+(el.offsetHeight-innerHeight)*p,behavior:'instant'})},{id,p});await page.waitForTimeout(1200)};
try{
 await page.goto((process.env.SITE_TEST_URL||'http://localhost:4195')+'/?intro=skip');await page.evaluate(()=>document.fonts.ready);
 await page.getByRole('button',{name:'Pause transfer animation'}).click();check('Hero transfer pauses',await page.getByRole('button',{name:'Resume transfer animation'}).count()===1);await page.getByRole('button',{name:'Resume transfer animation'}).click();check('Hero transfer resumes',await page.getByRole('button',{name:'Pause transfer animation'}).count()===1);
 for(const id of ['causes','approach','outcomes','implementation']){
  await seek(id,.35);await page.screenshot({path:`${out}/screens/transition-${id}-held.png`});
  const next=await page.locator(`#${id}`).evaluate(el=>el.nextElementSibling?.id);await page.evaluate(id=>{const el=document.getElementById(id);scrollTo({top:el.offsetTop+el.offsetHeight-innerHeight*.38,behavior:'instant'})},id);await page.waitForTimeout(1000);await page.screenshot({path:`${out}/screens/transition-${id}-to-${next}.png`});check(`${id} exit reveals its next section`,await page.locator(`#${next}`).evaluate(el=>el.getBoundingClientRect().top<innerHeight));
 }
 await seek('implementation',.5);
 for(const [i,name] of ['Map & Connect','Configure & Test','Launch with Safeguards','Monitor & Maintain'].entries()){
  await page.locator('.cv-implementation-stage-selector button').nth(i).click();await page.waitForTimeout(500);
  const rect=await page.locator('.cv-implementation-content').evaluate(el=>{const r=el.getBoundingClientRect();return{top:r.top,bottom:r.bottom,height:r.height}});frames.push({stage:name,...rect});check(`${name}: complete composition fits below header`,rect.top>=87&&rect.bottom<=901,rect);
 }
 await seek('implementation',.94);await page.waitForTimeout(2600);
 await page.screenshot({path:`${out}/screens/desktop-implementation-resolved.png`});
 await seek('contact',0);await page.getByRole('button',{name:'Book a call',exact:true}).click();await page.locator('#cv-business').fill('QA Cleaning');await page.locator('#cv-name').fill('Tester');await page.locator('#cv-email').fill('qa@example.com');await page.locator('#cv-description').fill('An example enquiry for keyboard verification.');await page.locator('#cv-phone').fill('-------');await page.locator('.cv-contact-form button[type="submit"]').click();check('Invalid phone is focused and linked to its error',await page.locator('#cv-phone').evaluate(el=>document.activeElement===el&&el.getAttribute('aria-invalid')==='true'&&!!document.getElementById(el.getAttribute('aria-describedby'))));
 await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.querySelector('#causes')?.getAttribute('data-motion-engine')==='manual');check('Runtime motion preference switches scenes to manual',await page.locator('#causes').getAttribute('data-motion-engine')==='manual');
 await page.setViewportSize({width:720,height:900});await page.goto((process.env.SITE_TEST_URL||'http://localhost:4195')+'/?intro=skip');check('Reflow at 200% of a 1440px viewport has no horizontal page overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 check('No runtime errors in continuity review',errors.length===0,errors);
}catch(error){check('Continuity test completes',false,error.stack)}finally{await browser.close();writeFileSync(`${out}/continuity.json`,JSON.stringify({checks,frames,errors},null,2));console.log(JSON.stringify({checks,frames,errors},null,2))}
