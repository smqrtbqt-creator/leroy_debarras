/**
 * Audit balises hreflang — Leroy du Débarras (site monolingue fr-FR)
 * Usage: node tests/audit-hreflang.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = "https://leroydudebarras.fr";
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

function expectedUrl(rel) {
  if (rel === "index.html") return BASE + "/";
  if (rel === "404.html") return null;
  return BASE + "/" + rel.replace(/\\/g, "/");
}

function parseHreflang(html) {
  const out = [];
  const re =
    /<link[^>]*rel=["']alternate["'][^>]*>/gi;
  for (const m of html.matchAll(re)) {
    const tag = m[0];
    const lang = (tag.match(/hreflang=["']([^"']+)["']/i) || [])[1];
    const href = (tag.match(/href=["']([^"']+)["']/i) || [])[1];
    if (lang && href) out.push({ lang, href });
  }
  return out;
}

const files = walk(ROOT).map((f) => path.relative(ROOT, f).replace(/\\/g, "/"));

console.log("=== INVENTAIRE HREFLANG ===\n");
console.log("| Page | Balises | Problème |");
console.log("|---|---|---|");

for (const rel of files) {
  const html = fs.readFileSync(path.join(ROOT, rel), "utf8");
  const alts = parseHreflang(html);
  const canon = (html.match(/rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) ||
    html.match(/href=["']([^"']+)["'][^>]*rel=["']canonical["']/i) || [])[1];
  const expected = expectedUrl(rel);
  const problems = [];
  const is404 = rel === "404.html";
  const summary = alts.map((a) => `${a.lang}→${a.href}`).join("; ") || "—";

  if (is404) {
    if (alts.length) problems.push("404 ne doit pas avoir de hreflang");
  } else {
    const fr = alts.find((a) => a.lang === "fr-FR");
    const frBare = alts.find((a) => a.lang === "fr");
    const xd = alts.find((a) => a.lang === "x-default");
    const langs = alts.map((a) => a.lang);
    const dup = langs.filter((l, i) => langs.indexOf(l) !== i);

    if (!fr) {
      problems.push(frBare ? "code fr au lieu de fr-FR" : "auto-référente fr-FR manquante");
    } else {
      if (!/^https:\/\//i.test(fr.href)) problems.push("fr-FR non-https/relative");
      if (expected && fr.href !== expected) problems.push(`fr-FR≠URL page (${expected})`);
      if (canon && fr.href !== canon) problems.push("fr-FR≠canonical");
    }

    if (!xd) problems.push("x-default manquant");
    else {
      if (!/^https:\/\//i.test(xd.href)) problems.push("x-default non-https/relative");
      if (fr && xd.href !== fr.href) problems.push("x-default≠fr-FR (bidirectionnalité)");
      if (canon && xd.href !== canon) problems.push("x-default≠canonical");
    }

    if (dup.length) problems.push(`codes dupliqués: ${[...new Set(dup)].join(",")}`);

    // Site monolingue : seules fr-FR + x-default attendues
    const unexpected = langs.filter((l) => l !== "fr-FR" && l !== "x-default" && l !== "fr");
    if (unexpected.length) problems.push(`codes inattendus: ${unexpected.join(",")}`);
  }

  const status = problems.length ? problems.join("; ") : "OK";
  if (problems.length) issues.push({ rel, alts, problems });
  console.log(`| ${rel} | ${summary} | ${status} |`);
}

console.log(`\n=== ${issues.length} page(s) avec problème ===`);
for (const i of issues) {
  console.log(`- ${i.rel}: ${i.problems.join("; ")}`);
}

process.exit(issues.length ? 1 : 0);
