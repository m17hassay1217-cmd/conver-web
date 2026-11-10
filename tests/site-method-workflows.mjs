import { mkdirSync } from 'node:fs';
mkdirSync('work/site',{recursive:true});
import assert from 'node:assert/strict';
import puppeteer from 'puppeteer-core';

const url = process.env.CONVERDIVE_TEST_URL || 'http://localhost:4190/?intro=skip';
const browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const errors = [];
try {
  const page = await browser.newPage();
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewport({ width: 1440, height: 1050 });
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.cv-method-steps button');
  await page.$eval('#approach', element => element.scrollIntoView({block:'start'}));
  const phases = ['diagnose', 'prioritize', 'engineer', 'verify'];
  for (let i = 0; i < phases.length; i++) {
    await page.$eval(`.cv-method-steps button:nth-child(${i + 1})`, element => element.click());
    await page.waitForFunction(phase => document.querySelector('.cv-method-stage')?.getAttribute('data-state') === phase, {}, phases[i]);
    assert.equal(await page.$eval('.cv-method-copy h3', element => element.textContent.toLowerCase()), phases[i]);
    assert.equal(await page.$eval('.cv-instrument', element => element.getAttribute('data-phase')), phases[i]);
  }
  await page.$eval('.cv-method-difference button', element => element.click());
  await page.waitForFunction(() => document.querySelector('.cv-method-stage')?.getAttribute('data-state') === 'synthesis');
  assert.match(await page.$eval('.cv-method-synthesis', element => element.textContent), /We don't start with what AI can do/);
  assert.equal(await page.$$eval('.cv-method-steps button', elements => elements.length), 4);

  await page.$eval('#workflows', element => element.scrollIntoView({block:'start'}));
  const names = ['qualification', 'specification', 'progression', 'expansion'];
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    await page.evaluate(() => { window.__workflowObserved=[]; window.__workflowObserver?.disconnect(); window.__workflowObserver=new MutationObserver(()=>{const step=document.querySelector('.cv-flow-counter')?.textContent?.trim().slice(0,2);if(step&&!window.__workflowObserved.includes(step))window.__workflowObserved.push(step)});window.__workflowObserver.observe(document.querySelector('#workflows'),{childList:true,subtree:true,characterData:true}); });
    await page.$eval(`#cv-workflow-trigger-${name}`, element => element.click());
    assert.equal(await page.$$eval('.cv-flow-node', elements => elements.length), 6);
    const observed = new Set();
    const start = Date.now();
    while (Date.now() - start < 5200) {
      const state = await page.evaluate(() => ({ step: document.querySelector('.cv-flow-counter')?.textContent?.trim().slice(0, 2), done: document.querySelectorAll('.cv-workflow-rail.is-completed').length, open: !!document.querySelector('.cv-workflow-rail.is-expanded') }));
      if (state.step) observed.add(state.step);
      if (!state.open && state.done === i + 1) break;
      await new Promise(resolve => setTimeout(resolve, 80));
    }
    assert.deepEqual(await page.evaluate(()=>window.__workflowObserved), ['01', '02', '03', '04', '05', '06'], `${name}: the signal must visit every node`);
    assert.equal(await page.$$eval('.cv-workflow-rail.is-completed', elements => elements.length), i + 1);
    assert.equal(await page.$$eval('.cv-workflow-rail.is-expanded', elements => elements.length), 0);
    if (i < 3) assert.equal(await page.$eval('.cv-workflow-rail.is-next .cv-workflow-trigger', element => element.id), `cv-workflow-trigger-${names[i + 1]}`);
  }
  assert.equal(await page.$$eval('.cv-unified-node', elements => elements.length), 7);
  assert.equal(await page.$$eval('.cv-unified-branch', elements => elements.length), 2);
  assert.match(await page.$eval('#cv-unified-desc', element => element.textContent), /joins specification before quotation/);
  assert.match(await page.$eval('.cv-workflow-disclaimer', element => element.textContent), /conceptual illustration/);

  await page.$eval('#cv-workflow-trigger-qualification', element => element.click());
  assert.match(await page.$eval('.cv-flow-counter', element => element.textContent), /06/);
  await page.$eval('.cv-flow-playback button', element => element.click());
  await page.waitForFunction(() => document.querySelector('.cv-flow-counter')?.textContent?.trim().startsWith('01'));
  await page.$eval('.cv-flow-playback button', element => element.click());
  const paused = await page.$eval('.cv-flow-counter', element => element.textContent);
  await new Promise(resolve => setTimeout(resolve, 900));
  assert.equal(await page.$eval('.cv-flow-counter', element => element.textContent), paused);
  await page.$eval('.cv-flow-playback button:last-child', element => element.click());
  await page.$eval('.cv-workflow-replay', element => element.click());
  assert.equal(await page.$$eval('.cv-workflow-rail.is-completed', elements => elements.length), 0);
  assert.equal(await page.$$eval('.cv-unified-workflow', elements => elements.length), 0);

  const mobile = await browser.newPage();
  mobile.on('pageerror', error => errors.push(error.message));
  await mobile.setViewport({ width: 390, height: 844 });
  await mobile.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await mobile.goto(url, { waitUntil: 'domcontentloaded' });
  await mobile.waitForSelector('.cv-workflow-trigger');
  for (const name of names) {
    await mobile.$eval(`#cv-workflow-trigger-${name}`, element => element.click());
    assert.equal(await mobile.$$eval('.cv-flow-node', elements => elements.length), 6);
    assert.equal(await mobile.$$eval('.cv-flow-node[data-status="complete"]', elements => elements.length), 6);
  }
  assert.equal(await mobile.$$eval('.cv-workflow-rail.is-completed', elements => elements.length), 4);
  assert.equal(await mobile.$$eval('.cv-unified-node', elements => elements.length), 7);
  assert.ok(await mobile.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Workflow overflow must remain local');
  assert.deepEqual(errors, []);
  console.log('PASS: four methods + synthesis; six-node timed completion in every workflow; next guidance, review, replay, pause, reset, unified branch; 390px reduced-motion states and local overflow.');
} finally {
  await browser.close();
}
