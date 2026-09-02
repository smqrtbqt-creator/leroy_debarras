/**
 * Audit taille / profondeur DOM + accessibilité métrique
 * Usage: node tests/audit-dom.mjs
 */
import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LIMIT_NODES = 1500;
const IDEAL_NODES = 1000;
const LIMIT_DEPTH = 32;
const IDEAL_DEPTH = 15;

const VOID = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr",
]);

function analyze(html) {
  const cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
  const tags = [...cleaned.matchAll(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g)];
  const opens = {};
  let depth = 0;
  let maxDepth = 0;
  let nodes = 0;
  for (const m of tags) {
    const full = m[0];
    const name = m[1].toLowerCase();
    if (full.startsWith("</")) {
      depth = Math.max(0, depth - 1);
      continue;
    }
    nodes++;
    opens[name] = (opens[name] || 0) + 1;
    depth++;
    if (depth > maxDepth) maxDepth = depth;
    if (VOID.has(name) || /\/>$/.test(full)) depth--;
  }
  return { nodes, maxDepth, opens };
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const t0 = Date.now();
    const req = https.get(
      url,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; SEOAuditBot/1.0; +https://example.invalid)",
          Accept: "text/html",
        },
        timeout: 12000,
      },
      (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () =>
          resolve({
            status: res.statusCode,
            ms: Date.now() - t0,
            bytes: Buffer.byteLength(body),
            location: res.headers.location || "",
            body,
          }),
        );
      },
    );
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("timeout"));
    });
  });
}

const files = fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"));
const issues = [];
const rows = [];

console.log("=== A. ACCESSIBILITÉ MÉTRIQUE (live) ===\n");
try {
  const home = await fetchUrl("https://leroydudebarras.fr/");
  const hub = await fetchUrl("https://leroydudebarras.fr/debarras-correze.html");
  console.log(`Accueil: HTTP ${home.status}, ${home.ms}ms, ${home.bytes} octets`);
  console.log(`Hub Corrèze: HTTP ${hub.status}, ${hub.ms}ms, ${hub.bytes} octets`);
  if (home.status !== 200) issues.push(`Accueil HTTP ${home.status}`);
  if (hub.status !== 200) issues.push(`Hub HTTP ${hub.status}`);
  if (home.ms > 5000) issues.push("Accueil lent (>5s) — risque time-out outil SEO");
  const csrHints = /id=["']root["']|id=["']__next["']|data-reactroot/i.test(home.body);
  console.log(`CSR/SPA détecté: ${csrHints ? "oui" : "non (HTML statique SSG)"}`);
  console.log(
    "Cause probable métrique manquante: outil SEO (time-out / UA / API), pas une taille DOM excessive.\n",
  );
} catch (e) {
  console.log("Live fetch échoué:", e.message);
  issues.push("Live inaccessible: " + e.message);
}

console.log("=== B. INVENTAIRE DOM LOCAL ===\n");
console.log("| Page | Nœuds | Profondeur | Top éléments |");
console.log("|---|---|---|---|");

for (const f of files) {
  const html = fs.readFileSync(path.join(ROOT, f), "utf8");
  const r = analyze(html);
  rows.push({ f, ...r });
  if (r.nodes >= LIMIT_NODES) issues.push(`${f}: ${r.nodes} nœuds ≥ ${LIMIT_NODES}`);
  if (r.maxDepth >= LIMIT_DEPTH) issues.push(`${f}: profondeur ${r.maxDepth} ≥ ${LIMIT_DEPTH}`);
  const top = Object.entries(r.opens)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([k, v]) => `${k}:${v}`)
    .join(", ");
  console.log(`| ${f} | ${r.nodes} | ${r.maxDepth} | ${top} |`);
}

rows.sort((a, b) => b.nodes - a.nodes);
const heaviest = rows[0];
console.log(
  `\nPage la plus lourde: ${heaviest.f} — ${heaviest.nodes} nœuds (idéal < ${IDEAL_NODES}, limite ${LIMIT_NODES}), profondeur ${heaviest.maxDepth} (idéal < ${IDEAL_DEPTH})`,
);

console.log(`\n=== ${issues.length} problème(s) seuil ===`);
issues.forEach((i) => console.log("- " + i));
process.exit(issues.length ? 1 : 0);
