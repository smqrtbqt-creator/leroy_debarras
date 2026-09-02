/**
 * Audit mobile — viewport, typo, touch, overflow risks
 * Usage: node tests/audit-mobile.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const issues = [];
const notes = [];

function fail(msg) {
  issues.push(msg);
}
function ok(msg) {
  notes.push("OK " + msg);
}

const htmlFiles = fs
  .readdirSync(ROOT)
  .filter((f) => f.endsWith(".html"));

for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(ROOT, file), "utf8");
  const vp = (html.match(/<meta[^>]*name=["']viewport["'][^>]*>/i) || [])[0];
  if (!vp) fail(`${file}: viewport absent`);
  else {
    if (!/width\s*=\s*device-width/i.test(vp)) fail(`${file}: viewport sans device-width`);
    if (!/initial-scale\s*=\s*1(\.0)?/i.test(vp)) fail(`${file}: viewport sans initial-scale=1`);
    if (/user-scalable\s*=\s*no/i.test(vp)) fail(`${file}: user-scalable=no`);
    if (/maximum-scale\s*=\s*1(\.0)?/i.test(vp)) fail(`${file}: maximum-scale=1`);
  }
}

const css = fs.readFileSync(path.join(ROOT, "css", "style.css"), "utf8");

if (!/html\s*\{[^}]*font-size:\s*16px/s.test(css) && !/:root[^}]*--/.test(css)) {
  /* still check body */
}
if (!/font-size:\s*1rem/.test(css)) fail("CSS: pas de font-size 1rem de base");
if (/text-size-adjust:\s*none/i.test(css)) fail("CSS: text-size-adjust:none");
if (/user-scalable/i.test(css)) fail("CSS: user-scalable");

const fontSizes = [...css.matchAll(/font-size:\s*([0-9.]+)(px|rem|em)/gi)].map((m) => ({
  raw: m[0],
  v: parseFloat(m[1]),
  u: m[2].toLowerCase(),
}));
for (const f of fontSizes) {
  const px = f.u === "px" ? f.v : f.u === "rem" || f.u === "em" ? f.v * 16 : null;
  if (px != null && px < 12) fail(`texte < 12px: ${f.raw}`);
}

if (!/\.btn\s*\{[^}]*(min-height:\s*(48px|var\(--tap-min\)))/s.test(css)) {
  fail("CSS: .btn sans min-height tactile (≥44px)");
}
if (!/\.nav-toggle\s*\{[^}]*(min-height:\s*(48px|var\(--tap-min\)))/s.test(css)) {
  fail("CSS: .nav-toggle sans taille tactile");
}
if (!/@media\s*\(max-width:\s*959px\)/.test(css)) fail("CSS: breakpoint mobile nav manquant");
if (!/@media\s*\(max-width:\s*414px\)/.test(css)) fail("CSS: breakpoint ≤414px manquant");
if (!/overflow-x:\s*clip/.test(css)) fail("CSS: overflow-x clip manquant");
if (!/img\s*\{[^}]*max-width:\s*100%/s.test(css)) fail("CSS: images non fluides");
if (/width:\s*1000px/.test(css) || /width:\s*[12]\d{3}px/.test(css)) {
  fail("CSS: largeur fixe large détectée");
}

// gaps trop serrés entre cibles potentielles (ignore 0)
const tightGaps = [...css.matchAll(/gap:\s*([0-9.]+)px/gi)].filter(
  (m) => parseFloat(m[1]) > 0 && parseFloat(m[1]) < 8
);
if (tightGaps.length) {
  fail(`CSS: gap < 8px (cibles tactiles): ${[...new Set(tightGaps.map((m) => m[0]))].join(", ")}`);
}

if (!/--tap-min:/.test(css) || !/--tap-gap:/.test(css)) {
  fail("CSS: variables --tap-min / --tap-gap manquantes");
}
if (!/overflow-wrap:\s*anywhere/i.test(css)) fail("CSS: overflow-wrap manquant");
if (!/\.communes-text[\s\S]*overflow-wrap:\s*anywhere/i.test(css)) {
  fail("CSS: .communes-text sans overflow-wrap");
}

ok(`viewport OK sur ${htmlFiles.length} pages`);
ok(`tailles police scannées: ${fontSizes.length}`);

console.log("=== AUDIT MOBILE ===\n");
notes.forEach((n) => console.log(n));
if (issues.length) {
  console.log("\nProblèmes:");
  issues.forEach((i) => console.log("- " + i));
} else {
  console.log("\nAucun problème bloquant.");
}
process.exit(issues.length ? 1 : 0);
