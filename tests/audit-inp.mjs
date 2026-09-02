/**
 * Audit INP / chargement JS — Leroy du Débarras
 * Usage: node tests/audit-inp.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const issues = [];
const inventory = [];

function walkHtml(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".git", "tests"].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkHtml(p, acc);
    else if (e.name.endsWith(".html")) acc.push(p);
  }
  return acc;
}

const htmlFiles = walkHtml(ROOT);
const sample = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");

// Scripts externes (src)
const srcScripts = [...sample.matchAll(/<script([^>]*src=["']([^"']+)["'][^>]*)>/gi)].map((m) => ({
  attrs: m[1],
  src: m[2],
}));

const thirdPartyHosts = /googletagmanager|google-analytics|gtag|hotjar|facebook\.net|fbevents|clarity|cookiebot|tawk|crisp|intercom|segment|doubleclick/i;

console.log("=== INVENTAIRE SCRIPTS (index.html) ===\n");
console.log("| Script | Position | defer/async | Tiers | Impact INP estimé |");
console.log("|---|---|---|---|---|");

for (const s of srcScripts) {
  const defer = /\bdefer\b/i.test(s.attrs);
  const async = /\basync\b/i.test(s.attrs);
  const tier = thirdPartyHosts.test(s.src);
  const blocking = !defer && !async;
  const impact = blocking
    ? "ÉLEVÉ (bloque parsing)"
    : tier
      ? "MOYEN (tiers)"
      : "FAIBLE (local + defer)";
  if (blocking) issues.push(`Script bloquant: ${s.src}`);
  if (tier) issues.push(`Script tiers détecté: ${s.src}`);
  inventory.push(s);
  console.log(`| ${s.src} | fin body (layout) | ${defer ? "defer" : async ? "async" : "sync"} | ${tier ? "oui" : "non"} | ${impact} |`);
}

const jsonld = (sample.match(/<script type=["']application\/ld\+json["']/gi) || []).length;
console.log(`\nJSON-LD (non exécuté): ${jsonld} bloc(s)`);

const inlineOnload = /onload\s*=/i.test(sample);
if (inlineOnload) issues.push("Handler inline onload encore présent (fonts)");

const fontDefer = /data-defer-css/i.test(sample);
if (!fontDefer) issues.push("Fonts: data-defer-css manquant");

// Toutes les pages : pas de script sync externe
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");
  for (const m of html.matchAll(/<script([^>]*src=["']([^"']+)["'][^>]*)>/gi)) {
    const attrs = m[1];
    const src = m[2];
    if (!/\bdefer\b/i.test(attrs) && !/\basync\b/i.test(attrs)) {
      issues.push(`${rel}: script sans defer/async → ${src}`);
    }
    if (thirdPartyHosts.test(src)) issues.push(`${rel}: script tiers → ${src}`);
  }
  if (/onload\s*=\s*["'][^"']*media/i.test(html)) {
    issues.push(`${rel}: onload inline fonts`);
  }
}

const scriptSrc = fs.readFileSync(path.join(ROOT, "js", "script.js"), "utf8");
if (!/requestIdleCallback/.test(scriptSrc)) issues.push("script.js: pas de requestIdleCallback");
if (!/scheduler\.yield|setTimeout\(resolve,\s*0\)/.test(scriptSrc)) {
  issues.push("script.js: pas de yield / découpage tâches");
}
if (!/addEventListener\("click"/.test(scriptSrc)) issues.push("script.js: menu click manquant");
if (/nav\.querySelectorAll\("a"\)\.forEach/.test(scriptSrc)) {
  issues.push("script.js: N listeners sur liens nav (préférer délégation)");
}
if (/document\.addEventListener\("keydown"/.test(scriptSrc) && !/removeEventListener\("keydown"/.test(scriptSrc)) {
  issues.push("script.js: keydown permanent sur document");
}

const css = fs.readFileSync(path.join(ROOT, "css", "style.css"), "utf8");
if (!/content-visibility:\s*auto/.test(css)) issues.push("CSS: content-visibility manquant");
if (!/@media \(max-width: 959px\)[\s\S]*backdrop-filter:\s*none/.test(css)) {
  issues.push("CSS: backdrop-filter toujours actif sur mobile");
}

const sizes = {
  "script.js": fs.statSync(path.join(ROOT, "js", "script.js")).size,
  "script.min.js": fs.statSync(path.join(ROOT, "js", "script.min.js")).size,
  "site-config.js": fs.statSync(path.join(ROOT, "js", "site-config.js")).size,
};
console.log("\n=== TAILLES ===");
Object.entries(sizes).forEach(([k, v]) => console.log(`${k}: ${v} octets`));
if (sizes["script.min.js"] > 40_000) issues.push("script.min.js > 40 Ko");

console.log(`\n=== ${issues.length} problème(s) ===`);
issues.forEach((i) => console.log("- " + i));
process.exit(issues.length ? 1 : 0);
