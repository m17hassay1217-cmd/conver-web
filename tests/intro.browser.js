async (page) => {
  const checks = [];
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const expect = (condition, label) => {
    if (!condition) throw new Error(label);
    checks.push(label);
  };
  const base = "http://127.0.0.1:4173/";
  const key = "converdive:intro-seen:v1";
  const phase = () =>
    page.locator(".opening-splash").getAttribute("data-phase");
  const seek = async (time) => {
    await page.getByRole("slider").evaluate((el, t) => {
      Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      ).set.call(el, String(t));
      el.dispatchEvent(new Event("input", { bubbles: true }));
      el.dispatchEvent(new Event("change", { bubbles: true }));
    }, time);
    await page.waitForTimeout(35);
  };
  const capture = async (name) =>
    page.screenshot({
      path: `work/${name}.jpg`,
      type: "jpeg",
      quality: 85,
      style: ".review-controls{visibility:hidden}",
    });
  const visibleWords = () =>
    page
      .locator(".outcome-label")
      .evaluateAll(
        (els) =>
          els.filter((el) => Number(getComputedStyle(el).opacity) > 0.99)
            .length,
      );
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(base + "?intro=review");
  await page.getByRole("button", { name: "Outcomes", exact: true }).click();
  await page.evaluate(() => document.fonts.ready);
  await seek(2450);
  expect(
    (await visibleWords()) === 7,
    "Seven complete outcome phrases visible during reading hold",
  );
  await capture("01-outcomes-desktop");
  const geometry = await page.locator(".outcome").evaluateAll((els) => {
    const identity = document
      .querySelector(".central-identity")
      .getBoundingClientRect();
    return els.map((el) => {
      const b = el.getBoundingClientRect();
      return {
        rank: Number(el.dataset.pullRank),
        distance: Math.hypot(
          b.x + b.width / 2 - identity.x - identity.width / 2,
          b.y + b.height / 2 - identity.y - identity.height / 2,
        ),
      };
    });
  });
  expect(
    geometry
      .sort((a, b) => a.distance - b.distance)
      .every((item, index) => item.rank === index),
    "Attraction rank follows measured nearest-first distance",
  );
  for (let index = 0; index < 7; index++) {
    await seek(700 + index * 200);
    const started = await page
      .locator(".outcome-label")
      .evaluateAll(
        (els) =>
          els.filter((el) => Number(getComputedStyle(el).opacity) > 0.001)
            .length,
      );
    expect(
      started === index,
      `Phrase ${index + 1} begins at ${700 + index * 200}ms with 200ms spacing`,
    );
  }
  await seek(2180);
  expect((await visibleWords()) === 7, "Last phrase fully settles at 2180ms");
  const before = await page
    .locator(".outcome")
    .evaluateAll((els) => els.map((el) => getComputedStyle(el).transform));
  await seek(3170);
  const after = await page
    .locator(".outcome")
    .evaluateAll((els) => els.map((el) => getComputedStyle(el).transform));
  expect(
    JSON.stringify(before) === JSON.stringify(after),
    "Outcome phrases stay still throughout the one-second reading hold",
  );
  await seek(2650);
  expect(
    (await page
      .locator(".magnetic-field")
      .evaluate((el) => Number(getComputedStyle(el).opacity))) === 0,
    "Magnetic preparation waits until final half-second of hold",
  );
  await seek(2920);
  expect(
    (await page
      .locator(".magnetic-field")
      .evaluate((el) => Number(getComputedStyle(el).opacity))) > 0,
    "Magnetic glow prepares during final half-second",
  );
  await seek(3820);
  await capture("02-attraction-desktop");
  expect((await phase()) === "attraction", "Magnetic attraction stage plays");
  await seek(4880);
  await capture("03-energy-desktop");
  expect(
    await page
      .locator(".outcome")
      .evaluateAll((els) =>
        els.every((el) => Number(getComputedStyle(el).opacity) === 0),
      ),
    "All seven phrases absorbed before positioning reveal",
  );
  await seek(6100);
  await capture("04-positioning-desktop");
  expect(
    (await page
      .locator(".positioning")
      .evaluate((el) => Number(getComputedStyle(el).opacity))) === 1,
    "Positioning statement fully revealed",
  );
  await seek(7300);
  await capture("05-handoff-desktop");
  expect(
    (await page
      .locator(".intro-scene")
      .evaluate((el) => getComputedStyle(el).transform)) !==
      "matrix(1, 0, 0, 1, 0, 0)",
    "Upward slide reveals permanent header below",
  );
  for (const [width, height] of [
    [768, 1024],
    [390, 844],
    [320, 568],
    [844, 390],
  ]) {
    await page.setViewportSize({ width, height });
    await page.getByRole("button", { name: "Outcomes", exact: true }).click();
    await page.waitForTimeout(80);
    const boxes = await page.locator(".outcome").evaluateAll((els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, right: r.right, bottom: r.bottom };
      }),
    );
    expect(
      boxes.every(
        (b) => b.x >= 0 && b.y >= 0 && b.right <= width && b.bottom <= height,
      ),
      `All outcomes fit ${width}×${height}`,
    );
    expect(
      !boxes.some((a, i) =>
        boxes.some(
          (b, j) =>
            i !== j &&
            a.x < b.right &&
            a.right > b.x &&
            a.y < b.bottom &&
            a.bottom > b.y,
        ),
      ),
      `No phrase overlap at ${width}×${height}`,
    );
    if (width === 390) {
      await capture("06-outcomes-mobile");
      await page
        .getByRole("button", { name: "Positioning", exact: true })
        .click();
      await capture("07-positioning-mobile");
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(base + "?intro=1");
  await page.getByRole("button", { name: "Pause introduction" }).click();
  const paused = await page
    .locator(".opening-splash")
    .evaluate((el) => getComputedStyle(el).getPropertyValue("--progress"));
  await page.waitForTimeout(250);
  expect(
    (await page
      .locator(".opening-splash")
      .evaluate((el) =>
        getComputedStyle(el).getPropertyValue("--progress"),
      )) === paused,
    "Pause freezes the shared animation clock",
  );
  await page.getByRole("button", { name: "Skip Intro" }).focus();
  await page.keyboard.press("Enter");
  expect(
    (await page.locator(".opening-splash").count()) === 0,
    "Keyboard Skip Intro immediately removes splash",
  );
  expect(
    (await page.evaluate((k) => localStorage.getItem(k), key)) === "true",
    "Skip remembers the visit",
  );
  expect(
    await page
      .locator("#main-content")
      .evaluate((el) => document.activeElement === el),
    "Skip moves focus to homepage handoff",
  );
  await page.goto(base);
  expect(
    (await page.locator(".opening-splash").count()) === 0,
    "Returning visitor automatically bypasses intro",
  );
  await page.getByRole("link", { name: "Replay introduction" }).click();
  expect(
    (await page.locator(".opening-splash").count()) === 1,
    "Explicit replay overrides returning-visitor state",
  );
  await page.evaluate((k) => localStorage.removeItem(k), key);
  await page.goto(base);
  await page.waitForSelector(".opening-splash");
  await page.waitForSelector(".opening-splash", {
    state: "detached",
    timeout: 12000,
  });
  expect(
    (await page.evaluate((k) => localStorage.getItem(k), key)) === "true",
    "Full uninterrupted playback completes and remembers visitor",
  );
  await capture("08-homepage-handoff");
  expect(
    await page.locator(".site-header .wordmark").isVisible(),
    "Permanent Converdive header remains after playback",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate((k) => localStorage.removeItem(k), key);
  await page.goto(base + "?intro=1");
  expect(
    (await page.locator(".opening-splash").count()) === 0,
    "Reduced-motion preference bypasses even explicit intro replay",
  );
  expect(
    await page.locator("#main-content").isVisible(),
    "Reduced-motion users receive the homepage immediately",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto(base + "?intro=1");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(80);
  expect(
    (await page.locator(".opening-splash").count()) === 0,
    "Live reduced-motion preference change safely exits the intro",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const privatePage = await page.context().newPage();
  await privatePage.addInitScript(() =>
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Storage blocked", "SecurityError");
      },
    }),
  );
  await privatePage.goto(base + "?intro=1");
  await privatePage.getByRole("button", { name: "Skip Intro" }).click();
  expect(
    await privatePage.locator("#main-content").isVisible(),
    "Blocked storage does not break skip or handoff",
  );
  await privatePage.close();
  expect(errors.length === 0, "No browser runtime errors in production build");
  return { checksPassed: checks.length, checks, errors };
};
