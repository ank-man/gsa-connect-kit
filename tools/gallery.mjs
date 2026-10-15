#!/usr/bin/env node
// Writes index.html: the browsable template catalog served from the kit's GitHub Pages.
//   OWNER=<github-user-or-org> node tools/gallery.mjs
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { THEMES } from "./themes.mjs";

const kit = resolve(import.meta.dirname, "..");
const owner = process.env.OWNER || "ank-man";
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const groups = [...new Set(THEMES.map((t) => t.group))];

const cards = THEMES.map((t) => {
  const repo = `gsa-connect-${t.id}`;
  const accent = t.palette?.accent || "#BA0C2F";
  return `<article class="tpl" data-group="${esc(t.group)}" data-q="${esc(`${t.name} ${t.tagline} ${t.bestFor} ${t.layout}`.toLowerCase())}" style="--a:${accent}">
  <a class="shot" href="https://${owner}.github.io/${repo}/" target="_blank" rel="noopener"><img src="docs/screenshots/${t.id}.jpg" alt="${esc(t.name)} template preview" loading="lazy" width="390" height="844"></a>
  <div class="body">
    <p class="kicker"><span class="dot"></span>${esc(t.group)} · ${esc(t.layout)}</p>
    <h3>${esc(t.name)}</h3>
    <p class="tag">${esc(t.tagline)}</p>
    <p class="best"><b>Best for</b> ${esc(t.bestFor)}</p>
    <div class="btns">
      <a class="btn primary" href="https://github.com/${owner}/${repo}/generate" target="_blank" rel="noopener">Use template</a>
      <a class="btn" href="https://${owner}.github.io/${repo}/" target="_blank" rel="noopener">Live demo ↗</a>
    </div>
  </div>
</article>`;
}).join("\n");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>GSA Connect Templates</title>
<meta name="description" content="${THEMES.length} free digital business card templates for UGA graduate and professional students: CV, research, QR, NFC and Apple, Google and Samsung Wallet. Powered by ScholarTap.">
<link rel="icon" href="shared/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
:root { --accent:#BA0C2F; --bg:#f6f3ef; --surface:#fff; --ink:#18130f; --muted:#6c645d; --line:#e4ddd6; color-scheme: light; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --bg:#121012; --surface:#1c191b; --ink:#f2eeea; --muted:#a59d97; --line:#322d30; color-scheme: dark; } }
:root[data-theme="dark"] { --bg:#121012; --surface:#1c191b; --ink:#f2eeea; --muted:#a59d97; --line:#322d30; color-scheme: dark; }
* { box-sizing: border-box; }
body { margin:0; background:var(--bg); color:var(--ink); font:400 16px/1.55 Inter, system-ui, sans-serif; }
a { color: inherit; }
.wrap { max-width: 1240px; margin: 0 auto; padding: 0 16px; }
header.hero { padding: 56px 0 28px; }
.eyebrow { font-size: 12px; letter-spacing: .16em; text-transform: uppercase; color: var(--accent); font-weight: 600; margin: 0 0 12px; }
h1 { font: 800 clamp(36px, 7vw, 68px)/1 Fraunces, Georgia, serif; letter-spacing: -.02em; margin: 0; max-width: 16ch; }
.lede { max-width: 62ch; color: var(--muted); font-size: 18px; margin: 18px 0 0; }
.feats { display: flex; flex-wrap: wrap; gap: 8px; margin: 22px 0 0; padding: 0; list-style: none; }
.feats li { padding: 6px 12px; border: 1px solid var(--line); border-radius: 999px; font-size: 14px; background: var(--surface); }
.quick { margin-top: 26px; background: var(--surface); border: 1px solid var(--line); border-radius: 14px; padding: 16px 18px; max-width: 760px; }
.quick h2 { font-size: 14px; margin: 0 0 8px; letter-spacing: .06em; text-transform: uppercase; }
.quick pre { margin: 0; overflow-x: auto; font: 13.5px/1.6 ui-monospace, Menlo, monospace; }
.bar { position: sticky; top: 0; z-index: 3; background: color-mix(in srgb, var(--bg) 92%, transparent); backdrop-filter: blur(10px); border-bottom: 1px solid var(--line); padding: 12px 0; }
.bar .wrap { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.chip { border: 1px solid var(--line); background: var(--surface); color: var(--ink); border-radius: 999px; padding: 7px 13px; font: 500 14px Inter, sans-serif; cursor: pointer; min-height: 36px; }
.chip[aria-pressed="true"] { background: var(--ink); color: var(--bg); border-color: var(--ink); }
input[type=search] { margin-left: auto; min-width: 220px; flex: 1 1 220px; max-width: 320px; padding: 9px 12px; border-radius: 10px; border: 1px solid var(--line); background: var(--surface); color: var(--ink); font: inherit; }
.count { color: var(--muted); font-size: 14px; margin: 18px 0 0; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 18px; padding: 16px 0 48px; }
.tpl { background: var(--surface); border: 1px solid var(--line); border-radius: 16px; overflow: hidden; display: flex; flex-direction: column; }
.shot { display: block; aspect-ratio: 390 / 560; overflow: hidden; background: var(--line); border-bottom: 4px solid var(--a); }
.shot img { width: 100%; height: auto; display: block; transition: transform .5s ease; }
.tpl:hover .shot img { transform: translateY(-6%); }
.body { padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
.kicker { margin: 0; font-size: 12px; color: var(--muted); display: flex; align-items: center; gap: 6px; text-transform: capitalize; }
.dot { width: 9px; height: 9px; border-radius: 50%; background: var(--a); }
h3 { margin: 0; font: 600 20px/1.2 Fraunces, Georgia, serif; }
.tag { margin: 0; font-size: 14px; }
.best { margin: 0; font-size: 13px; color: var(--muted); }
.best b { color: var(--ink); font-weight: 600; }
.btns { display: flex; gap: 8px; margin-top: auto; padding-top: 8px; }
.btn { flex: 1; text-align: center; text-decoration: none; padding: 9px 10px; border-radius: 10px; border: 1px solid var(--line); font-weight: 600; font-size: 14px; }
.btn.primary { background: var(--a); border-color: var(--a); color: #fff; }
footer { border-top: 1px solid var(--line); padding: 22px 0 40px; color: var(--muted); font-size: 14px; }
footer strong { color: var(--accent); }
</style>
</head>
<body>
<header class="hero wrap">
  <p class="eyebrow">UGA Graduate Student Association · GSA Connect</p>
  <h1>A digital business card for every major.</h1>
  <p class="lede">${THEMES.length} free, open-source card templates for graduate and professional students. Host your CV, research and links on GitHub Pages, share by QR or NFC tap, and add your card to Apple, Google or Samsung Wallet.</p>
  <ul class="feats"><li>📇 Save-contact vCard</li><li>📄 CV &amp; publications</li><li>🔳 QR + NFC</li><li>👛 Apple · Google · Samsung Wallet</li><li>🧩 Setup form + live preview</li><li>🆓 Free hosting</li><li><a href="nfc.html">📶 Program an NFC card →</a></li></ul>
  <div class="quick"><h2>Three-minute start</h2><pre>gh repo create my-card --template ${owner}/gsa-connect-entomology --public --clone
cd my-card && npm run setup     # form opens → upload photo &amp; CV → Publish</pre></div>
</header>
<nav class="bar" aria-label="Filter templates"><div class="wrap">
  <button class="chip" aria-pressed="true" data-g="">All</button>
  ${groups.map((g) => `<button class="chip" aria-pressed="false" data-g="${esc(g)}">${esc(g)}</button>`).join("\n  ")}
  <input type="search" placeholder="Search: chemistry, law, insects…" aria-label="Search templates">
</div></nav>
<main class="wrap">
  <p class="count" id="count"></p>
  <div class="grid" id="grid">
${cards}
  </div>
</main>
<footer><div class="wrap">GSA Connect kit · MIT licensed · Powered by <strong>ScholarTap</strong> · <a href="https://github.com/${owner}/gsa-connect-kit">Source on GitHub</a></div></footer>
<script>
const chips = [...document.querySelectorAll(".chip")], q = document.querySelector("input[type=search]"), tpls = [...document.querySelectorAll(".tpl")];
let group = "";
function apply() {
  const s = q.value.trim().toLowerCase(); let n = 0;
  tpls.forEach((t) => { const ok = (!group || t.dataset.group === group) && (!s || t.dataset.q.includes(s)); t.hidden = !ok; n += ok; });
  document.getElementById("count").textContent = n + " template" + (n === 1 ? "" : "s");
}
chips.forEach((c) => c.onclick = () => { group = c.dataset.g; chips.forEach((x) => x.setAttribute("aria-pressed", x === c)); apply(); });
q.oninput = apply; apply();
</script>
</body>
</html>
`;
await writeFile(resolve(kit, "index.html"), html);

// Universal NFC writer for GSA tabling events: same page as each card's, but not tied to one card.
const nfc = (await readFile(resolve(kit, "shared/nfc.html"), "utf8"))
  .replace('src="js/vendor/qrcode.js"', 'src="shared/js/vendor/qrcode.js"')
  .replace('href="favicon.svg"', 'href="shared/favicon.svg"')
  .replace("<h1>Program your NFC card</h1>", "<h1>GSA Connect NFC writer</h1>")
  .replace('fetch("card.json"', 'fetch("card.json?none"');
await writeFile(resolve(kit, "nfc.html"), nfc);
console.log(`✓ index.html (${THEMES.length} templates, owner ${owner})`);
