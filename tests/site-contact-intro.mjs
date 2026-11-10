import { mkdirSync } from 'node:fs';
mkdirSync('work/site',{recursive:true});
import puppeteer from 'puppeteer-core';
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
const browser=await puppeteer.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const base='http://localhost:4190',checks=[];
try{
 const page=await browser.newPage();await page.setViewport({width:1440,height:1050});await page.goto(base+'/?intro=1');await page.waitForSelector('.cv-intro');await new Promise(r=>setTimeout(r,650));await page.screenshot({path:'work/site/intro-phrases.png'});await new Promise(r=>setTimeout(r,2000));await page.screenshot({path:'work/site/intro-wordmark.png'});await page.click('.cv-intro-skip');await page.waitForSelector('#home');assert.ok(!await page.$('.cv-intro'));checks.push('Skip button completes intro');await page.goto(base+'/');await page.waitForSelector('#home');assert.ok(!await page.$('.cv-intro'));checks.push('Returning visitor skips intro');
 await page.goto(base+'/?intro=skip#contact');await page.$$eval('.cv-contact-routes button',els=>els.find(el=>el.textContent.includes('Write to us')).click());
 await page.type('#cv-business','Example Cleaning Ltd');await page.type('#cv-name','Preview Tester');await page.type('#cv-email','preview@example.com');await page.type('#cv-description','Please review our enquiry follow-up process.');await page.$eval('.cv-contact-form button[type=submit]',el=>el.click());await page.waitForFunction(()=>document.querySelector('.cv-form-message')?.textContent.includes('Nothing has been sent'));checks.push('Valid preview form explicitly confirms nothing was sent');
 await page.$$eval('.cv-contact-routes button',els=>els.find(el=>el.textContent.includes('Book a call')).click());assert.equal(await page.$eval('#cv-preferred',el=>el.value),'phone');assert.ok(await page.$eval('#cv-phone',el=>el.required));checks.push('Voice route opens required call details without fabricated calendar');
 const fallback=await browser.newPage();await fallback.evaluateOnNewDocument(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type==='webgl'||type==='webgl2'?null:original.call(this,type,...args)}});await fallback.goto(base+'/?intro=skip');await fallback.waitForSelector('.cv-installation-static');assert.ok(await fallback.$('#cv-hero-title'));checks.push('No-WebGL fallback retains open-vessel metaphor and hero copy');
 console.log(JSON.stringify({checks,passed:checks.length},null,2));writeFileSync('work/site/contact-intro-qa.json',JSON.stringify({checks,passed:checks.length},null,2));
}finally{await browser.close()}
