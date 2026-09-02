/**
 * Audit SEO complet — Leroy du Débarras
 * Usage : node tests/audit-seo.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const CANON_BASE = "https://leroydudebaras.fr";
const INDEX_TITLE = "Débarras, Nettoyage & Évacuation | Leroy Débarras";
const INDEX_DESC =
  "Débarras de maisons, granges et garages : nettoyage, évacuation des déchets et enlèvement de végétaux.";
const OLD_DOMAIN = /leroy-debarras\.fr|www\.leroydudebaras/i;

const htmlFiles = fs.readdirSync(root).filter((f) => f.endsWith(".html"));
const report = {
  images: { total: 0, withAlt: 0, emptyAlt: 0, noAlt: 0, files: [] },
  issues: [],
  pages: [],
  jsonld: [],
};

function decode(s) {
  return String(s || "").replace(/&amp;/g, "&").replace(/&quot;/g, '"');
}

for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  const canon = (html.match(/rel="canonical" href="([^"]+)"/) || [])[1];
  const viewport = (html.match(/name="viewport" content="([^"]*)"/) || [])[1];
  const robots = (html.match(/name="robots" content="([^"]*)"/) || [])[1];
  const titleCount = (html.match(/<title>/g) || []).length;
  const descCount = (html.match(/<meta name="description"/g) || []).length;
  const canonCount = (html.match(/rel="canonical"/g) || []).length;

  if (titleCount !== 1) report.issues.push(`${file}: ${titleCount} balises title`);
  if (descCount !== 1) report.issues.push(`${file}: ${descCount} meta description`);
  if (file === "404.html") {
    if (canonCount !== 0) report.issues.push(`${file}: ne doit pas avoir de canonical`);
  } else if (canonCount !== 1) {
    report.issues.push(`${file}: ${canonCount} canonical`);
  }
  if (OLD_DOMAIN.test(html)) report.issues.push(`${file}: ancien domaine détecté`);
  if (canon && !canon.startsWith(CANON_BASE)) report.issues.push(`${file}: canonical hors domaine (${canon})`);
  if (!viewport?.includes("width=device-width")) report.issues.push(`${file}: viewport manquant/incorrect`);

  const imgs = html.match(/<img\b[^>]*>/g) || [];
  for (const img of imgs) {
    report.images.total++;
    if (!/\balt=/.test(img)) {
      report.images.noAlt++;
      report.images.files.push(`${file}: sans alt`);
    } else if (/alt=""/.test(img)) {
      report.images.emptyAlt++;
    } else {
      report.images.withAlt++;
    }
  }

  const jsonlds = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  for (const m of jsonlds) {
    try {
      const data = JSON.parse(m[1]);
      const graph = data["@graph"] || [data];
      for (const node of graph) {
        report.jsonld.push({ file, type: node["@type"], id: node["@id"] });
        if (node["@type"] === "LocalBusiness" && node.taxID) {
          report.issues.push(`${file}: LocalBusiness taxID deprecated`);
        }
      }
    } catch {
      report.issues.push(`${file}: JSON-LD invalide`);
    }
  }

  report.pages.push({
    file,
    title: decode(title),
    titleLen: decode(title).length,
    descLen: desc?.length || 0,
    canon,
    robots,
    imgCount: imgs.length,
  });
}

// Images folder
const imgDir = path.join(root, "images");
const imageFiles = fs.readdirSync(imgDir).filter((f) => /\.(jpg|jpeg|webp|png)$/i.test(f));
const imageSizes = imageFiles.map((f) => {
  const stat = fs.statSync(path.join(imgDir, f));
  return { file: f, kb: Math.round(stat.size / 1024) };
}).sort((a, b) => b.kb - a.kb);

// robots + sitemap
const robots = fs.readFileSync(path.join(root, "robots.txt"), "utf8");
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");

const index = report.pages.find((p) => p.file === "index.html");

console.log("=== AUDIT SEO ===\n");
console.log("INDEX title:", index?.title, `(${index?.titleLen} car.)`);
console.log("INDEX desc len:", index?.descLen);
console.log("INDEX canonical:", index?.canon);
console.log("\nImages:", report.images);
console.log("\nTop images (Ko):", imageSizes.slice(0, 8));
console.log("\nRobots sitemap line:", robots.match(/Sitemap:.+/)?.[0]);
console.log("Sitemap URLs:", (sitemap.match(/<loc>/g) || []).length);
console.log("Sitemap old domain:", OLD_DOMAIN.test(sitemap));
console.log("\nJSON-LD types:", [...new Set(report.jsonld.map((j) => j.type))].join(", "));
console.log("\nIssues:", report.issues.length ? report.issues.join("\n") : "aucune");
console.log("\nPages title lengths:", report.pages.map((p) => `${p.file}:${p.titleLen}`).join(", "));

// Live checks (optional, requires network)
try {
  const res = await fetch("https://leroydudebaras.fr/");
  const liveHtml = await res.text();
  const liveTitle = (liveHtml.match(/<title>([^<]*)<\/title>/) || [])[1];
  const liveCanon = (liveHtml.match(/rel="canonical" href="([^"]+)"/) || [])[1];
  const liveDesc = (liveHtml.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  console.log("\nLIVE index status:", res.status);
  console.log("LIVE title:", decode(liveTitle), `(${decode(liveTitle).length} car.)`);
  console.log("LIVE desc len:", liveDesc?.length);
  console.log("LIVE canonical:", liveCanon);
  const sm = await fetch("https://leroydudebaras.fr/sitemap.xml");
  console.log("LIVE sitemap status:", sm.status);
  const rb = await fetch("https://leroydudebaras.fr/robots.txt");
  console.log("LIVE robots status:", rb.status);
} catch (e) {
  console.log("\nLIVE checks skipped:", e.message);
}
