import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import {mkdirSync,writeFileSync} from 'node:fs';
const output='work/site';mkdirSync(output,{recursive:true});
const browser=await puppeteer.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const errors=[],checks=[],shots=[];
const page=await browser.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&!m.text().includes('favicon'))errors.push(m.text().slice(0,500))});
const origin=process.env.SITE_TEST_URL||'http://localhost:4190';
function check(name,value){checks.push({name,passed:!!value});if(!value)console.log('FAIL',name)}
async function to(id){await page.$eval(`#${id}`,el=>el.scrollIntoView({block:'start'}));await new Promise(r=>setTimeout(r,160));}
async function shot(name){await page.screenshot({path:`${output}/${name}.png`});shots.push(`${name}.png`)}
async function fill(id,value){await page.$eval(`#${id}`,(el,v)=>{const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;setter.call(el,String(v));el.dispatchEvent(new Event('input',{bubbles:true}))},value);await new Promise(r=>setTimeout(r,60))}
try{
 await page.setViewport({width:1440,height:1050,deviceScaleFactor:1});await page.goto(`${origin}/?intro=skip`,{waitUntil:'networkidle0'});await page.waitForSelector('[data-section="10"]');
 check('Ten sequential sections',JSON.stringify(await page.$$eval('[data-section]',els=>els.map(el=>el.dataset.section)))===JSON.stringify(['01','02','03','04','05','06','07','08','09','10']));
 check('All internal links resolve',await page.$$eval('a[href^="#"]',els=>els.every(el=>document.getElementById(el.getAttribute('href').slice(1)))));
 await new Promise(r=>setTimeout(r,600));await shot('desktop-01-home');
 const ids=['industry','problems','causes','approach','workflows','outcomes','implementation','value','contact'];
 for(let i=0;i<ids.length;i++){await to(ids[i]);await shot(`desktop-${String(i+2).padStart(2,'0')}-${ids[i]}`);console.log('Captured',ids[i])}
 await to('value');check('Default additional bookings = 2',await page.$eval('[data-result="additional"]',el=>el.textContent)==='2');check('Default monthly booking value = £24,000',await page.$eval('[data-result="monthly"]',el=>el.textContent)==='£24,000');check('Default annualized booking value = £288,000',await page.$eval('[data-result="annual"]',el=>el.textContent)==='£288,000');
 await fill('cv-booking-rate',99);check('Calculator caps improvement at 100% total',await page.$eval('[data-result="additional"]',el=>el.textContent)==='0.4');await fill('cv-enquiries',0);check('Zero enquiries produces zero new bookings',await page.$eval('[data-result="additional"]',el=>el.textContent)==='0');await fill('cv-enquiries',40);await fill('cv-booking-rate',15);
 await to('contact');await page.$$eval('.cv-contact-routes button',els=>els.find(el=>el.textContent.includes('Write to us')).click());check('Text form opens',!!await page.$('#cv-description'));check('Email required; invalid email rejected',await page.$eval('#cv-email',el=>{el.value='invalid';return !el.checkValidity()}));
 await page.select('#cv-preferred','phone');check('Phone required only for call preference',await page.$eval('#cv-phone',el=>el.required));await page.select('#cv-preferred','email');check('Phone removed for email preference',!await page.$('#cv-phone'));
 check('Unconfigured delivery disclosed',await page.$eval('.cv-form-config',el=>el.textContent.includes('not submitted')));check('No fabricated send success',await page.$eval('.cv-contact-form',el=>!el.textContent.includes('has been received')));await shot('desktop-10-contact-form');
 for(const width of [1440,1024,768,390,320]){await page.setViewport({width,height:900});await to('home');check(`No horizontal page overflow at ${width}`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));if(width===390){await shot('mobile-01-home');for(const id of ['causes','approach','workflows','outcomes','implementation','value','contact']){await to(id);await shot(`mobile-${id}`)}}}
 await page.setViewport({width:390,height:850});await to('home');await page.click('.cv-menu-button');check('Mobile navigation opens',await page.$eval('.cv-menu-button',el=>el.getAttribute('aria-expanded'))==='true');await page.click('.cv-nav-links a[href="#value"]');check('Mobile navigation closes after selection',await page.$eval('.cv-menu-button',el=>el.getAttribute('aria-expanded'))==='false');
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'reduce'}]);await page.goto(`${origin}/?intro=review`,{waitUntil:'networkidle0'});check('Reduced motion bypasses intro',!await page.$('[data-testid="intro-splash"]'));check('Reduced motion retains all ten sections',(await page.$$('[data-section]')).length===10);
 await page.emulateMediaFeatures([{name:'prefers-reduced-motion',value:'no-preference'}]);await page.goto(`${origin}/?intro=review`,{waitUntil:'domcontentloaded'});await page.waitForSelector('[data-testid="intro-splash"]');check('Review intro available',true);await page.keyboard.press('Escape');await page.waitForSelector('#home');check('Intro Escape skip works',!await page.$('[data-testid="intro-splash"]'));
 check('No runtime or shader errors',errors.length===0);
}finally{writeFileSync(`${output}/verification.json`,JSON.stringify({checks,errors,shots},null,2));await browser.close();console.log(JSON.stringify({checks,errors,shots},null,2));}
assert.ok(checks.every(c=>c.passed),'Some site checks failed');
