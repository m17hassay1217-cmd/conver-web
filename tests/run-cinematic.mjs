import { chromium } from 'playwright';
import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';

// A real-browser integration suite. Set INTRO_BASE_URL to inspect an already
// running preview; otherwise this runner starts its own isolated Vite process.
const root = resolve(import.meta.dirname, '..');
const out = resolve(root, 'work/cinematic');
mkdirSync(out, { recursive: true });
const base = process.env.INTRO_BASE_URL || 'http://127.0.0.1:4174/';
const server = process.env.INTRO_BASE_URL ? null : spawn(process.execPath,
  ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', '4174', '--strictPort'],
  { cwd: root, stdio: 'pipe' });
const checks = [], errors = [], layoutIssues = [], metrics = [], checkpoints = [];
let browser;
const check = (condition, name, detail) => {
  checks.push({ name, pass: Boolean(condition), ...(detail ? { detail } : {}) });
};
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const shotOptions = { type: 'png', style: '.review-controls { visibility:hidden !important }' };

try {
  for (let i = 0; i < 80; i++) {
    try { if ((await fetch(base)).ok) break; } catch {}
    if (i === 79) throw new Error(`Preview did not start: ${base}`);
    await new Promise(r => setTimeout(r, 100));
  }
  browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true,
    env: { ...process.env, XDG_CONFIG_HOME: '/tmp/converdive-browser-config' } });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  const seek = async time => {
    await page.getByRole('slider', { name: 'Animation time in milliseconds' }).fill(String(time));
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  };
  const review = async (width, height) => {
    await page.setViewportSize({ width, height });
    await page.goto(`${base}?intro=review`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => !!document.querySelector('.opening-splash')?.dataset.beamOrigin);
    await seek(1500);
  };
  await review(1440, 900);
  check(await page.locator('.outcome-label').count() === 7, 'exactly seven outcome phrases');
  check(await page.locator('.outcome-label').evaluateAll(els => els.every(el => +getComputedStyle(el).opacity > .99)), 'all seven phrases are visible at 1.5s');
  check(await page.locator('.logo-art').evaluate(el => el.complete && el.naturalWidth > 0), 'approved logo asset decodes');
  check(await page.evaluate(() => document.fonts.check('500 48px "Bespoke Stencil"') && document.fonts.check('500 48px "Cabinet Grotesk"') && document.fonts.check('500 16px "Space Grotesk"')), 'all three brand font families loaded');

  const pausedTransform = await page.locator('.outcome').first().evaluate(el => el.style.transform);
  await page.waitForTimeout(120);
  check(pausedTransform === await page.locator('.outcome').first().evaluate(el => el.style.transform), 'seek pauses animation deterministically');
  await page.locator('.review-controls').getByRole('button', { name: 'Play', exact: true }).click();
  await page.waitForTimeout(220);
  check(pausedTransform !== await page.locator('.outcome').first().evaluate(el => el.style.transform), 'phrases continue drifting during actual playback');

  for (const [width, height] of [[1440, 900], [390, 844]]) {
    await review(width, height);
    for (const time of [1500, 3500, 4500, 5400, 6000, 6800, 7600]) {
      await seek(time);
      const path = resolve(out, `${width}-${time}.png`);
      await page.screenshot({ ...shotOptions, path });
      checkpoints.push({ width, height, time, path, state: await page.locator('.opening-splash').evaluate(el => ({ phase: el.dataset.phase, absorbed: +el.dataset.absorbed, beamProgress: +el.dataset.beamProgress })) });
    }
  }
  await review(1440, 900);
  await seek(4500);
  const absorbed = Number(await page.locator('.opening-splash').getAttribute('data-absorbed'));
  check(absorbed > 0 && absorbed < 7, 'controlled overlapping absorption at 4.5s', absorbed);
  check(await page.locator('.outcomes').evaluate(el => getComputedStyle(el).maskImage !== 'none'), 'spatial mask present at the absorption source');
  await seek(5400);
  check(Number(await page.locator('.opening-splash').getAttribute('data-absorbed')) === 7, 'all phrases absorbed before beam release');
  await seek(5600);
  check(await page.locator('.logo-turn').evaluate(el => Math.abs(new DOMMatrix(getComputedStyle(el).transform).b - 1) < .015), 'logo rotates exactly 90 degrees clockwise');
  const propagation = [];
  for (const t of [5650, 5850, 6000, 6150, 6300]) {
    await seek(t);
    propagation.push(Number(await page.locator('.opening-splash').getAttribute('data-beam-progress')));
  }
  check(propagation.every((p, i) => !i || p >= propagation[i - 1]) && propagation.some(p => p > 0 && p < 1) && propagation.at(-1) === 1, 'beam progressively reaches the wordmark', propagation);
  const beamGeometry = await page.evaluate(() => {
    const root = document.querySelector('.opening-splash');
    const word = document.querySelector('.intro-wordmark').getBoundingClientRect();
    const logo = document.querySelector('.logo-core').getBoundingClientRect();
    const from = root.dataset.beamOrigin.split(',').map(Number), to = root.dataset.beamImpact.split(',').map(Number);
    return { from, to, sourceInsideLogo: from[0] >= logo.left - 2 && from[0] <= logo.right + 2 && from[1] >= logo.top - 2 && from[1] <= logo.bottom + 2,
      impactInsideText: to[0] >= word.left - 3 && to[0] <= word.right + 3 && to[1] >= word.top - 3 && to[1] <= word.bottom + 3 };
  });
  check(beamGeometry.sourceInsideLogo && beamGeometry.impactInsideText, 'beam endpoints match measured logo and text', beamGeometry);
  await seek(6000);
  const first = hash(await page.screenshot(shotOptions));
  await seek(6050);
  const changed = hash(await page.screenshot(shotOptions));
  await seek(6000);
  const repeated = hash(await page.screenshot(shotOptions));
  check(first !== changed, 'energy changes over time at the beam checkpoint');
  check(first === repeated, 'backward seek reproduces the same rendered frame');
  await seek(7600);
  check(await page.locator('.intro-wordmark').evaluate(el => +getComputedStyle(el).opacity < .01), 'company wordmark clears before final typography');
  check(JSON.stringify(await page.locator('.positioning span').allTextContents()) === JSON.stringify(['For', 'UK', 'Cleaning Companies']), 'final phrase uses the exact requested three lines');
  const typography = await page.locator('.intro-wordmark,.positioning span').evaluateAll(els => els.map(el => ({ color: getComputedStyle(el).color, font: getComputedStyle(el).fontFamily, filter: getComputedStyle(el).filter })));
  check(JSON.stringify(typography.map(v => v.color)) === JSON.stringify(['rgb(241, 241, 237)', 'rgb(187, 206, 217)', 'rgb(240, 249, 255)', 'rgb(241, 241, 237)']), 'incumbent typography colors preserved', typography);
  check(typography[0].font.includes('Bespoke Stencil') && typography.slice(1).every(v => v.font.includes('Cabinet Grotesk') && v.filter === 'none'), 'incumbent fonts remain without color-changing filters');

  // Test visible label rectangles, not just centers, throughout readable orbit.
  for (const [width, height] of [[320, 740], [390, 844], [768, 1024], [844, 390], [1440, 900]]) {
    await review(width, height);
    for (const time of [1500, 1800, 2200, 2600, 3000, ...Array.from({length:21}, (_,i) => 3100 + i * 100)]) {
      await seek(time);
      const issues = await page.evaluate(time => {
        const rect = el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; };
        const labels = [...document.querySelectorAll('.outcome')].filter(el => el.dataset.absorbed !== 'true').map(rect);
        const word = rect(document.querySelector('.intro-wordmark'));
        const overlap = (a, b) => a.x < b.x + b.w - 1 && a.x + a.w > b.x + 1 && a.y < b.y + b.h - 1 && a.y + a.h > b.y + 1;
        const issues = [];
        labels.forEach((r, i) => {
          if (r.x < -1 || r.x + r.w > innerWidth + 1 || r.y < -1 || r.y + r.h > innerHeight + 1) issues.push(`label ${i} clipped`);
          if (overlap(r, word)) issues.push(`label ${i} overlaps wordmark`);
          if (time <= 3000) labels.forEach((s, j) => { if (j < i && overlap(r, s)) issues.push(`labels ${i}/${j} collide`); });
        });
        if (document.documentElement.scrollWidth > innerWidth) issues.push('horizontal overflow');
        return issues;
      }, time);
      if (issues.length) layoutIssues.push({ width, height, time, issues });
    }
    check(!layoutIssues.some(v => v.width === width && v.height === height), `phrase field fits ${width}×${height} through orbit and capture`);
    if (width === 320 || height === 390) {
      await seek(1500);
      await page.screenshot({ ...shotOptions, path: resolve(out, `${width}x${height}-1500.png`) });
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await seek(6000);
  const beforeResize = await page.locator('.opening-splash').getAttribute('data-beam-origin');
  await page.setViewportSize({ width: 844, height: 390 });
  await page.waitForTimeout(100);
  check(beforeResize !== await page.locator('.opening-splash').getAttribute('data-beam-origin'), 'rotation/resize recalculates the shared coordinates at a paused timestamp');
  await page.getByRole('button', { name: 'Skip Intro' }).click();
  check(await page.locator('.opening-splash').count() === 0, 'Skip Intro immediately exits review mode');
  check(await page.locator('main').evaluate(el => document.activeElement === el), 'Skip Intro hands keyboard focus to main');
  await page.goto(`${base}?intro=1`);
  await page.getByRole('button', { name: 'Skip Intro' }).focus();
  await page.keyboard.press('Enter');
  check(await page.locator('.opening-splash').count() === 0, 'Skip Intro works from keyboard');
  await page.goto(`${base}?intro=1`);
  await page.getByRole('button', { name: 'Skip Intro' }).click();
  await page.goto(base);
  check(await page.locator('.opening-splash').count() === 0, 'returning visitors automatically skip');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${base}?intro=review`);
  check(await page.locator('.opening-splash').count() === 0 && await page.locator('.site-header .brand').isVisible(), 'reduced motion directly reveals permanent brand and handoff');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto(`${base}?intro=1`);
  await page.locator('.opening-splash').waitFor();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.locator('.opening-splash').waitFor({state:'detached'});
  check(await page.locator('.homepage-handoff').isVisible(), 'changing motion preference during playback exits safely');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await review(1440, 900);

  // Continuous playback evidence, including rAF samples and actual captured frames.
  const session = await context.newCDPSession(page);
  const frames = [];
  session.on('Page.screencastFrame', async event => {
    const filename = `playback-${String(frames.length).padStart(4, '0')}.jpg`;
    writeFileSync(resolve(out, filename), Buffer.from(event.data, 'base64'));
    frames.push({ filename, timestamp: event.metadata.timestamp });
    await session.send('Page.screencastFrameAck', { sessionId: event.sessionId }).catch(() => {});
  });
  await session.send('Page.startScreencast', { format: 'jpeg', quality: 72, maxWidth: 1440, maxHeight: 900, everyNthFrame: 2 });
  await page.goto(`${base}?intro=1`);
  await page.evaluate(() => {
    window.__introFrameTimes = [];
    let previous;
    const tick = now => {
      if (previous) window.__introFrameTimes.push(now - previous);
      previous = now;
      if (document.querySelector('.opening-splash')) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  await page.locator('.opening-splash').waitFor({ state: 'detached', timeout: 16000 });
  await session.send('Page.stopScreencast');
  check(await page.locator('.homepage-handoff').isVisible(), 'uninterrupted playback reaches the existing handoff');
  check(frames.length > 20, 'continuous playback has substantial visual evidence', frames.length);
  const frameTimes = await page.evaluate(() => window.__introFrameTimes || []);
  const sorted = [...frameTimes].sort((a, b) => a - b);
  metrics.push({ viewport: '1440×900', captureOverhead: true, samples: sorted.length, medianMs: sorted[Math.floor(sorted.length * .5)], p95Ms: sorted[Math.floor(sorted.length * .95)], over50ms: sorted.filter(v => v > 50).length });
  if (frames.length) {
    writeFileSync(resolve(out, 'playback-frames.txt'), frames.map((frame, i) => `file '${frame.filename}'\nduration ${Math.max(.001, (frames[i + 1]?.timestamp ?? frame.timestamp + 1 / 30) - frame.timestamp).toFixed(4)}`).join('\n'));
    const encoded = spawnSync('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', 'playback-frames.txt', '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuv420p', '-crf', '35', '-b:v', '0', 'playback.webm'], { cwd: out, encoding: 'utf8' });
    check(encoded.status === 0, 'continuous playback video encoded', encoded.status === 0 ? 'work/cinematic/playback.webm' : encoded.stderr.slice(-800));
  }
  check(errors.length === 0, 'no browser runtime exceptions', errors);
  await context.close();
} catch (error) {
  errors.push(error.stack || error.message);
} finally {
  await browser?.close();
  server?.kill('SIGTERM');
  const report = { checksPassed: checks.filter(c => c.pass).length, checksFailed: checks.filter(c => !c.pass).length, checks, layoutIssues, errors, metrics, checkpoints };
  writeFileSync(resolve(out, 'verification.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ passed: report.checksPassed, failed: report.checksFailed, errors, layoutIssues, metrics, report: 'work/cinematic/verification.json' }, null, 2));
  if (report.checksFailed || errors.length) process.exitCode = 1;
}
