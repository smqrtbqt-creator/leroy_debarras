/**
 * Audit JSON-LD complet — Leroy du Débarras
 * Usage: node tests/audit-jsonld.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const issues = [];

function issue(page, type, prop, severity, msg) {
  issues.push({ page, type, prop, severity, msg });
}

function walkHtml(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === ".git") continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkHtml(p, acc);
    else if (e.name.endsWith(".html")) acc.push(p);
  }
  return acc;
}

function extract(html) {
  return [...html.matchAll(/<script type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)].map(
    (m) => m[1].trim(),
  );
}

function nodesOf(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data.flatMap(nodesOf);
  if (data["@graph"]) return data["@graph"];
  return [data];
}

function typeOf(n) {
  const t = n["@type"];
  return Array.isArray(t) ? t : t ? [t] : [];
}

function hasType(n, name) {
  return typeOf(n).includes(name);
}

const files = walkHtml(ROOT).map((f) => path.relative(ROOT, f).replace(/\\/g, "/"));
const inventory = [];

for (const rel of files) {
  const html = fs.readFileSync(path.join(ROOT, rel), "utf8");
  const micro = /itemtype|itemprop|itemscope/i.test(html);
  const blocks = extract(html);
  inventory.push({ rel, blocks: blocks.length, micro });

  if (micro) issue(rel, "Microdata", "*", "avertissement", "Microdata détecté — unifier en JSON-LD");

  blocks.forEach((raw, i) => {
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      issue(rel, "JSON", "*", "critique", `JSON invalide: ${e.message}`);
      return;
    }
    if (!data["@context"]) issue(rel, "Root", "@context", "critique", "@context manquant");
    // Ignore // inside https:// URLs
    const withoutUrls = raw.replace(/https?:\/\/[^\s"']+/g, "");
    if (/\/\/|\/\*/.test(withoutUrls)) issue(rel, "JSON", "*", "critique", "Commentaires dans JSON-LD");

    const nodes = nodesOf(data);
    if (!data["@graph"] && nodes.length > 1) {
      issue(rel, "Root", "@graph", "avertissement", "Plusieurs entités sans @graph");
    }

    for (const n of nodes) {
      const types = typeOf(n);
      if (!types.length) issue(rel, "?", "@type", "critique", "Entité sans @type");

      // Empty props
      for (const [k, v] of Object.entries(n)) {
        if (v === "" || v === null || (Array.isArray(v) && v.length === 0)) {
          issue(rel, types.join("|"), k, "critique", "Propriété vide");
        }
      }

      if (hasType(n, "LocalBusiness") || hasType(n, "HomeAndConstructionBusiness")) {
        if (!n.name) issue(rel, "LocalBusiness", "name", "critique", "name manquant");
        if (!n.url) issue(rel, "LocalBusiness", "url", "critique", "url manquant");
        if (!n.image) issue(rel, "LocalBusiness", "image", "critique", "image manquant (requis Google)");
        if (!n.address) issue(rel, "LocalBusiness", "address", "critique", "address manquant");
        else {
          if (!n.address.streetAddress)
            issue(rel, "PostalAddress", "streetAddress", "critique", "streetAddress manquant");
          if (!n.address.addressLocality)
            issue(rel, "PostalAddress", "addressLocality", "critique", "addressLocality manquant");
          if (!n.address.addressCountry)
            issue(rel, "PostalAddress", "addressCountry", "critique", "addressCountry manquant");
        }
        if (!n.telephone) issue(rel, "LocalBusiness", "telephone", "avertissement", "telephone recommandé");
        if (!n.priceRange) issue(rel, "LocalBusiness", "priceRange", "avertissement", "priceRange recommandé");
        if (!n.geo) issue(rel, "LocalBusiness", "geo", "avertissement", "geo recommandé");
        if (!n.openingHoursSpecification && !n.openingHours) {
          issue(rel, "LocalBusiness", "openingHours", "avertissement", "horaires recommandés");
        }
        if (typeof n.logo === "string") {
          issue(rel, "LocalBusiness", "logo", "avertissement", "logo devrait être ImageObject avec url");
        } else if (n.logo && typeof n.logo === "object" && !n.logo.url) {
          issue(rel, "LocalBusiness", "logo.url", "critique", "ImageObject logo sans url");
        }
        if (typeof n.image === "string") {
          if (!/^https:\/\//.test(n.image)) {
            issue(rel, "LocalBusiness", "image", "critique", "image URL non absolue https");
          }
        } else if (n.image && typeof n.image === "object") {
          if (!n.image.url) issue(rel, "LocalBusiness", "image.url", "critique", "ImageObject image sans url");
          else if (!/^https:\/\//.test(n.image.url)) {
            issue(rel, "LocalBusiness", "image.url", "critique", "image.url non absolue https");
          }
        }
        if (n.taxID || n.vatID) {
          issue(rel, "LocalBusiness", "taxID", "avertissement", "taxID/vatID souvent rejeté pour SIRET FR");
        }
        if (n.foundingDate && !/^\d{4}(-\d{2}-\d{2})?$/.test(String(n.foundingDate))) {
          issue(rel, "LocalBusiness", "foundingDate", "critique", "foundingDate format invalide");
        }
      }

      if (hasType(n, "Offer")) {
        if (n.price == null && !n.priceSpecification)
          issue(rel, "Offer", "price", "critique", "Offer sans price");
        if (n.price != null && !n.priceCurrency)
          issue(rel, "Offer", "priceCurrency", "critique", "Offer sans priceCurrency");
        if (!n.availability) issue(rel, "Offer", "availability", "critique", "Offer sans availability");
      }

      if (hasType(n, "Service")) {
        if (!n.name) issue(rel, "Service", "name", "critique", "name manquant");
        if (!n.provider) issue(rel, "Service", "provider", "avertissement", "provider recommandé");
        if (n.offers) {
          const offers = Array.isArray(n.offers) ? n.offers : [n.offers];
          for (const o of offers) {
            if (o["@type"] === "Offer" && !o.availability) {
              issue(rel, "Offer", "availability", "critique", `Service Offer sans availability (${o.name || n.name})`);
            }
          }
        }
      }

      if (hasType(n, "FAQPage")) {
        const qs = n.mainEntity || [];
        if (!qs.length) issue(rel, "FAQPage", "mainEntity", "critique", "mainEntity vide");
        for (const q of qs) {
          if (!q.name) issue(rel, "FAQPage", "Question.name", "critique", "Question sans name");
          if (!q.acceptedAnswer?.text)
            issue(rel, "FAQPage", "Answer.text", "critique", "Answer sans text");
        }
      }

      if (hasType(n, "BreadcrumbList")) {
        const items = n.itemListElement || [];
        if (!items.length) issue(rel, "BreadcrumbList", "itemListElement", "critique", "vide");
        items.forEach((it, idx) => {
          if (!it.position) issue(rel, "BreadcrumbList", `position[${idx}]`, "critique", "position manquante");
          if (!it.name) issue(rel, "BreadcrumbList", `name[${idx}]`, "critique", "name manquant");
          if (!it.item) issue(rel, "BreadcrumbList", `item[${idx}]`, "critique", "item URL manquant");
          else if (typeof it.item === "string" && !/^https:\/\//.test(it.item)) {
            issue(rel, "BreadcrumbList", `item[${idx}]`, "critique", "item URL relative");
          }
        });
      }

      if (hasType(n, "WebPage") || hasType(n, "WebSite")) {
        if (!n.url && !n["@id"]) issue(rel, types[0], "url", "avertissement", "url/@id manquant");
      }

      if (n.aggregateRating) {
        issue(rel, types.join("|"), "aggregateRating", "critique", "aggregateRating — vérifier preuves réelles");
      }
    }
  });

  if (!blocks.length && !/noindex/i.test(html) && !rel.includes("404")) {
    // pages indexables sans JSON-LD
    if (!/mentions-legales|politique-confidentialite|payment/i.test(rel)) {
      issue(rel, "Root", "*", "avertissement", "Aucun JSON-LD sur page indexable");
    }
  }
}

console.log("=== INVENTAIRE ===");
inventory.forEach((r) => {
  console.log(`${r.rel}: ${r.blocks} bloc(s) JSON-LD${r.micro ? " + microdata" : ""}`);
});

const crit = issues.filter((i) => i.severity === "critique");
const warn = issues.filter((i) => i.severity === "avertissement");

console.log(`\n=== ${crit.length} CRITIQUES ===`);
crit.forEach((i) => console.log(`[${i.page}] ${i.type}.${i.prop}: ${i.msg}`));
console.log(`\n=== ${warn.length} AVERTISSEMENTS (échantillon 40) ===`);
warn.slice(0, 40).forEach((i) => console.log(`[${i.page}] ${i.type}.${i.prop}: ${i.msg}`));
if (warn.length > 40) console.log(`... +${warn.length - 40} avertissements`);

// Aggregate by message
const byMsg = new Map();
for (const i of issues) {
  const k = `${i.severity}|${i.type}.${i.prop}: ${i.msg}`;
  byMsg.set(k, (byMsg.get(k) || 0) + 1);
}
console.log("\n=== RÉSUMÉ PAR TYPE D'ERREUR ===");
[...byMsg.entries()]
  .sort((a, b) => b[1] - a[1])
  .forEach(([k, c]) => console.log(`${c}× ${k}`));

fs.writeFileSync(
  path.join(ROOT, "tests", ".jsonld-audit.json"),
  JSON.stringify({ at: new Date().toISOString(), inventory, issues }, null, 2),
);
process.exit(crit.length ? 1 : 0);
