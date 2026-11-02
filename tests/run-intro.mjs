import { spawn, spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
mkdirSync(resolve(root, "work"), { recursive: true });
const env = { ...process.env, XDG_CACHE_HOME: resolve(root, ".cache") };
const cli = resolve(root, "node_modules/@playwright/cli/playwright-cli.js");
const session = "-s=converdive-intro-checks";
let serverOutput = "";
const server = spawn(
  process.execPath,
  [
    "node_modules/vite/bin/vite.js",
    "preview",
    "--host",
    "127.0.0.1",
    "--port",
    "4173",
    "--strictPort",
  ],
  { cwd: root, env, stdio: ["ignore", "pipe", "pipe"] },
);
server.stdout.on("data", (chunk) => {
  serverOutput += chunk;
});
server.stderr.on("data", (chunk) => {
  serverOutput += chunk;
});

function command(args) {
  const result = spawnSync(process.execPath, [cli, session, ...args], {
    cwd: root,
    env,
    encoding: "utf8",
    timeout: 60000,
  });
  if (result.error || result.status !== 0)
    throw new Error(result.error?.message || result.stdout || result.stderr);
  return result.stdout;
}

try {
  for (let attempt = 0; attempt < 60; attempt++) {
    if (server.exitCode !== null)
      throw new Error(`Production server exited: ${serverOutput}`);
    if (serverOutput.includes("Local:")) break;
    if (attempt === 59)
      throw new Error(`Production server failed to start: ${serverOutput}`);
    await new Promise((resolveWait) => setTimeout(resolveWait, 100));
  }
  command([
    "open",
    "http://127.0.0.1:4173/",
    "--config=.playwright/cli.config.json",
  ]);
  // The CLI wraps code as a function expression, so remove the formatter's
  // trailing statement terminator before supplying that expression.
  const browserCheck = readFileSync(resolve(root, "tests/intro.browser.js"), "utf8").trim().replace(/;$/, "");
  const output = command(["run-code", browserCheck]);
  const match = output.match(/### Result\s*\n(\{[^\n]+\})/);
  if (!match) throw new Error(output);
  const result = JSON.parse(match[1]);
  writeFileSync(
    resolve(root, "work/intro-checks.json"),
    JSON.stringify(result, null, 2) + "\n",
  );
  console.log(
    `${result.checksPassed} intro browser checks passed. Screenshots and results: work/`,
  );
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  try {
    command(["close"]);
  } catch {
    /* The browser may have failed to open. */
  }
  server.kill("SIGTERM");
}
