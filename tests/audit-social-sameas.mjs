import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

const hrefs = [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)].map((m) => m[1]);
const social = [...new Set(hrefs.filter((h) => /facebook|instagram|linkedin|youtube|tiktok|workwave|x\.com|twitter/i.test(h)))];

console.log("=== Liens sociaux visibles (index.html) ===");
social.forEach((u) => console.log(u));

const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
const d = JSON.parse(m[1]);
const biz = d["@graph"].find((n) => {
  const t = n["@type"];
  return t === "LocalBusiness" || (Array.isArray(t) && t.includes("LocalBusiness"));
});

console.log("\n=== sameAs JSON-LD ===");
(biz.sameAs || []).forEach((u) => console.log(u));

console.log("\n=== Cohérence ===");
for (const u of social) {
  const inSame = (biz.sameAs || []).includes(u);
  console.log(u);
  console.log("  dans sameAs:", inSame ? "OUI" : "NON");
}
for (const u of biz.sameAs || []) {
  if (!social.includes(u)) console.log("sameAs sans lien visible:", u);
}

const fb = social.find((u) => /facebook/i.test(u));
if (fb) {
  const issues = [];
  if (/m\.facebook\.com|web\.facebook\.com/i.test(fb)) issues.push("domaine mobile/web");
  if (/facebook\.com\/people\//i.test(fb)) issues.push("forme /people/");
  if (/facebook\.com\/p\//i.test(fb)) issues.push("forme /p/ (non vanity username)");
  if (/[?&](ref|hl|fbclid)=/i.test(fb)) issues.push("paramètres tracking");
  if (/\/$/.test(fb)) issues.push("slash final");
  console.log("\n=== Audit Facebook ===");
  console.log("URL:", fb);
  console.log("Issues:", issues.length ? issues.join(", ") : "aucune");
  // Propose ID form
  const id = (fb.match(/(\d{10,})/) || [])[1];
  if (id) console.log("Forme ID proposée: https://www.facebook.com/" + id);
}
