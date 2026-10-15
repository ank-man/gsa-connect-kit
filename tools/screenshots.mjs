#!/usr/bin/env node
// Screenshots every assembled repo for the gallery + each repo's README.
//   npm i -D playwright-core && npx playwright install chromium
//   node tools/screenshots.mjs            (serves ../ and writes docs/screenshots/<id>.jpg)
// Set CHROME_PATH to use an existing Chrome/Chromium binary.
import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { THEMES } from "./themes.mjs";

const kit = resolve(import.meta.dirname, "..");
const root = resolve(process.env.OUT || resolve(kit, ".."));
const outDir = resolve(kit, "docs/screenshots");
const port = 4190;
await mkdir(outDir, { recursive: true });

const first = resolve(root, `gsa-connect-${THEMES[0].id}`);
const server = spawn(process.execPath, [resolve(first, "scripts/dev.mjs"), ".."], { env: { ...process.env, PORT: String(port), NO_OPEN: "1" }, stdio: "ignore" });
await new Promise((r) => setTimeout(r, 800));

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1.5 });
const only = process.argv.slice(2);
for (const t of THEMES.filter((t) => !only.length || only.includes(t.id))) {
  await page.goto(`http://localhost:${port}/gsa-connect-${t.id}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(400);
  await page.screenshot({ path: resolve(outDir, `${t.id}.jpg`), type: "jpeg", quality: 78 });
  console.log("📸", t.id);
}
await browser.close();
server.kill();
