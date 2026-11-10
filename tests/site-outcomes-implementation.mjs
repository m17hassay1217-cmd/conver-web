import { mkdirSync } from 'node:fs';
mkdirSync('work/site',{recursive:true});
import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage();
const base = process.env.SITE_BASE_URL || 'http://localhost:4190';
const checks = [];
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const check = (name, condition) => { checks.push({ name, pass: Boolean(condition) }); if (!condition) throw new Error(name); };
const settle = () => new Promise(resolve => setTimeout(resolve, 700));
const selectStage = async index => {
  await page.$eval(`#implementation .cv-implementation-stage-selector button:nth-child(${index + 1})`, element => element.click());
  await page.waitForFunction(expected => document.querySelector('#implementation').dataset.implementationStage === String(expected), {}, index);
};
const outcomeSelect = async index => {
  await page.$eval(`#outcomes .cv-outcomes-selectors button:nth-child(${index + 1})`, element => element.click());
  await page.waitForFunction(expected => document.querySelector('#outcomes').dataset.outcome === String(expected), {}, index);
};

try {
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`${base}/?intro=skip`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector("#implementation");await page.evaluate(() => document.fonts.ready);
  await page.$eval('#outcomes', element => element.scrollIntoView());
  check('Exactly three outcome ripples', (await page.$$('.cv-outcome-ripple')).length === 3);
  for (let index = 0; index < 3; index++) {
    await outcomeSelect(index);
    check(`Outcome ${index + 1} adds one cumulative reveal`, (await page.$$('.cv-owner-outcome.is-revealed')).length === index + 1);
  }
  await settle();
  check('All three completed outcomes remain readable', await page.$$eval('.cv-owner-outcome', elements => elements.every(element => +getComputedStyle(element).opacity >= .7)));
  check('All three completed rings expanded', (await page.$$('.cv-outcome-ripple.is-expanded')).length === 3);
  check('Outcome proportional hierarchy', await page.$$eval('.cv-owner-outcome h3', elements => elements.map(element => parseFloat(getComputedStyle(element).fontSize)).every((size, index, sizes) => index === 0 || size > sizes[index - 1])));

  await page.$eval('#implementation', element => element.scrollIntoView());
  await page.evaluate(() => { window.__cvPersistentWorkflowNode = document.querySelector('.cv-impl-existing-node'); });
  for (let index = 0; index < 4; index++) {
    await selectStage(index);
    check(`Stage ${index + 1} keeps the same existing workflow DOM`, await page.evaluate(() => window.__cvPersistentWorkflowNode === document.querySelector('.cv-impl-existing-node')));
    check(`Stage ${index + 1} retains all five original workflow nodes`, (await page.$$('.cv-impl-existing-node')).length === 5);
    if (index >= 1) check(`Stage ${index + 1} retains isolated test lane`, await page.$eval('.cv-impl-test-boundary', element => element.parentElement.classList.contains('is-present')));
    if (index >= 2) check(`Stage ${index + 1} retains human approval and fallback`, await page.$eval('.cv-impl-review-node', element => element.parentElement.classList.contains('is-present')));
    if (index === 2) {
      await page.$eval('.cv-implementation-figcaption button', element => element.click());
      check('Human approval authorizes the example fallback', await page.$eval('.cv-impl-review-node', element => element.parentElement.classList.contains('is-approved')));
    }
  }
  await page.waitForFunction(() => document.querySelector('.cv-impl-monitor-overlay').dataset.monitor === 'resolved');
  check('Monitor illustration finishes resolved', true);
  for (const expected of ['alert', 'inspected', 'resolved']) {
    await page.$eval('.cv-implementation-figcaption button', element => element.click());
    check(`Monitoring control advances to ${expected}`, await page.$eval('.cv-impl-monitor-overlay', (element, status) => element.dataset.monitor === status, expected));
  }
  check('Final workflow has five monitored nodes', (await page.$$('.cv-impl-existing-node.is-monitored')).length === 5);
  check('Selected live workflow route is explicit', (await page.$$('.cv-impl-route-authorized')).length === 2);

  for (const width of [768, 390, 320]) {
    await page.setViewport({ width, height: 900 });
    await page.goto(`${base}/?intro=skip`, { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => document.querySelector('#implementation').dataset.implementationStage === '3');
    check(`${width}px static outcome shows all three levels`, await page.$$eval('.cv-owner-outcome', elements => elements.every(element => +getComputedStyle(element).opacity === 1)));
    check(`${width}px mobile diagram remains readable`, await page.$eval('.cv-impl-mobile-diagram', element => getComputedStyle(element).display !== 'none'));
    check(`${width}px no horizontal page overflow`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await selectStage(0);
    check(`${width}px manual implementation selector works`, await page.$eval('#implementation', element => element.dataset.implementationStage === '0'));
  }

  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(`${base}/?intro=skip`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelector('#implementation').dataset.implementationStage === '3');
  check('Reduced motion starts at complete monitored state', await page.$eval('.cv-impl-monitor-overlay', element => element.dataset.monitor === 'resolved'));
  check('Reduced motion keeps all outcome copy readable', await page.$$eval('.cv-owner-outcome', elements => elements.every(element => +getComputedStyle(element).opacity === 1)));
  check('No browser runtime errors', errors.length === 0);
  console.log(JSON.stringify({ checks, errors }, null, 2));
} catch (error) {
  console.log(JSON.stringify({ checks, errors, failure: error.message }, null, 2));
  process.exitCode = 1;
} finally {
  await browser.close();
}
