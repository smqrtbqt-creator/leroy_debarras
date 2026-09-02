/**
 * Audit balises canonical — Leroy du Débarras
 * Usage: node tests/audit-canonical.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = "https://leroydudebaras.fr";
const issues = [];

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".git" || e.name === "tests") continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith(".html")) acc.push(p);
  }
  return acc;
}

function expectedCanon(rel) {
  if (rel === "index.html") return BASE + "/";
  if (rel === "404.html") return null; // pas de canonical sur 404
  return BASE + "/" + rel.replace(/\\/g, "/");
}

const files = walk(ROOT).map((f) => path.relative(ROOT, f).replace(/\\/g, "/"));

console.log("=== INVENTAIRE CANONICAL ===\n");
console.log("| Page | Count | Canonical | Problème |");
console.log("|---|---|---|---|");

for (const rel of files) {
  const html = fs.readFileSync(path.join(ROOT, rel), "utf8");
  const matches = [
    ...html.matchAll(/<link[^>]*rel=["']canonical["'][^>]*>/gi),
    ...html.matchAll(/<link[^>]*href=["'][^"']+["'][^>]*rel=["']canonical["'][^>]*>/gi),
  ];
  // dedupe by full match
  const tags = [...new Set(matches.map((m) => m[0]))];
  const hrefs = tags
    .map((t) => {
      const m = t.match(/href=["']([^"']+)["']/i);
      return m ? m[1] : null;
    })
    .filter(Boolean);

  const expected = expectedCanon(rel);
  const problems = [];
  const is404 = rel === "404.html";

  if (is404) {
    if (hrefs.length > 0) problems.push("404 ne doit pas avoir de canonical");
  } else {
    if (hrefs.length === 0) problems.push("ABSENTE");
    if (hrefs.length > 1) problems.push(`DOUBLON (${hrefs.length})`);
  }

  const href = hrefs[0];
  if (href && !is404) {
    if (!/^https:\/\//i.test(href)) problems.push("non-https ou relative");
    if (/^http:\/\//i.test(href)) problems.push("http au lieu de https");
    if (/[?]/.test(href)) problems.push("paramètres query");
    if (/#/.test(href)) problems.push("ancre #");
    const pathPart = href.replace(/^https?:\/\/[^/]+/i, "") || "/";
    if (/[A-Z]/.test(pathPart)) problems.push("majuscules dans le chemin");
    if (expected && href !== expected) {
      problems.push(`cible≠attendue (attendu: ${expected})`);
    }
    if (href.endsWith(".html/") || (href !== BASE + "/" && href.endsWith("/") && href.includes(".html"))) {
      problems.push("slash final incohérent");
    }
  }

  // hreflang coherence
  const hreflangs = [...html.matchAll(/rel=["']alternate["'][^>]*hreflang=["']([^"']+)["'][^>]*href=["']([^"']+)["']/gi)];
  const hreflangs2 = [...html.matchAll(/hreflang=["']([^"']+)["'][^>]*href=["']([^"']+)["'][^>]*rel=["']alternate["']/gi)];
  const alts = [...hreflangs, ...hreflangs2].map((m) => ({ lang: m[1], href: m[2] }));
  if (href && alts.length) {
    const fr = alts.find((a) => a.lang === "fr-FR" || a.lang === "fr");
    const xd = alts.find((a) => a.lang === "x-default");
    if (!is404) {
      if (!fr) problems.push("hreflang auto-référente fr-FR absente");
      else if (fr.href !== href) problems.push(`hreflang fr-FR≠canonical`);
      if (!xd) problems.push("hreflang x-default absente");
      else if (xd.href !== href) problems.push(`hreflang x-default≠canonical`);
    }
  } else if (href && !is404) {
    problems.push("hreflang absentes");
  }

  const noindex = /noindex/i.test((html.match(/name=["']robots["'][^>]*content=["']([^"']+)/i) || [])[1] || "");
  if (noindex && hrefs.length && rel === "404.html") {
    // 404 with canonical is debatable - note only
  }

  const status = problems.length ? problems.join("; ") : "OK";
  if (problems.length) issues.push({ rel, hrefs, expected, problems });
  console.log(`| ${rel} | ${hrefs.length} | ${href || "—"} | ${status} |`);
}

console.log(`\n=== ${issues.length} page(s) avec problème ===`);
issues.forEach((i) => {
  console.log(`- ${i.rel}: ${i.problems.join("; ")}`);
  console.log(`  actuel: ${i.hrefs.join(" | ") || "(aucun)"}`);
  console.log(`  attendu: ${i.expected}`);
});

process.exit(issues.length ? 1 : 0);
