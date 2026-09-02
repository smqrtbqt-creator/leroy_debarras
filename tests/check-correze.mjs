/**
 * Tests SEO local Corrèze — hub, pages villes, données communes.
 * Usage: node tests/check-correze.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CORREZE_COMMUNES, CORREZE_SECTORS } from "../data/correze-data.mjs";
import { CORREZE_CITY_PAGES } from "../data/correze-cities.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = "https://leroydudebarras.fr";
let fails = 0;

function fail(msg) {
  console.error("FAIL:", msg);
  fails++;
}

function pass(msg) {
  console.log("PASS:", msg);
}

function readHtml(file) {
  const p = path.join(root, file);
  if (!fs.existsSync(p)) {
    fail(`fichier manquant: ${file}`);
    return "";
  }
  return fs.readFileSync(p, "utf8");
}

function titleOf(html) {
  const m = html.match(/<title>([^<]+)<\/title>/);
  return m ? m[1] : "";
}

function descOf(html) {
  const m = html.match(/<meta name="description" content="([^"]*)"/);
  return m ? m[1] : "";
}

function canonicalOf(html) {
  const m = html.match(/<link rel="canonical" href="([^"]+)"/);
  return m ? m[1] : "";
}

function h1Of(html) {
  const m = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
  return m ? m[1] : "";
}

// --- Communes data ---
const slugs = CORREZE_COMMUNES.map((c) => c.slug);
if (slugs.length !== 277) fail(`attendu 277 communes, obtenu ${slugs.length}`);
else pass("277 communes officielles Corrèze");

const slugSet = new Set(slugs);
if (slugSet.size !== slugs.length) fail("slugs communes dupliqués");
else pass("aucun slug commune dupliqué");

const sectorIds = new Set(CORREZE_SECTORS.map((s) => s.id));
for (const c of CORREZE_COMMUNES) {
  if (!sectorIds.has(c.sectorId)) fail(`secteur inconnu pour ${c.name}: ${c.sectorId}`);
}
if (fails === 0) pass("toutes les communes ont un secteur valide");

for (const city of CORREZE_CITY_PAGES) {
  if (!slugSet.has(city.slug)) fail(`page ville sans commune: ${city.slug}`);
  for (const n of city.nearby) {
    if (!slugSet.has(n)) fail(`voisin inconnu ${n} pour ${city.slug}`);
  }
}
if (fails === 0) pass("pages villes et voisins valides");

// --- Hub ---
const hub = readHtml("debarras-correze.html");
if (hub) {
  if (h1Of(hub) !== "Débarras en Corrèze") fail("H1 hub incorrect");
  else pass("hub H1");

  if (titleOf(hub) !== "Débarras en Corrèze | Leroy du Débarras") fail("title hub incorrect");
  else pass("hub title");

  if (canonicalOf(hub) !== `${BASE}/debarras-correze.html`) fail("canonical hub incorrect");
  else pass("hub canonical");

  const d = descOf(hub);
  if (d.length < 100 || d.length > 160) fail(`hub description longueur ${d.length}`);
  else pass("hub description");

  if (!hub.includes('application/ld+json')) fail("hub sans JSON-LD");
  else pass("hub JSON-LD");

  for (const city of CORREZE_CITY_PAGES) {
    if (!hub.includes(`/${city.file}`)) fail(`hub sans lien vers ${city.file}`);
  }
  if (fails === 0) pass("hub liens vers toutes les pages villes");
}

// --- City pages ---
const titles = new Set();
const descs = new Set();
const h1s = new Set();

for (const city of CORREZE_CITY_PAGES) {
  const html = readHtml(city.file);
  if (!html) continue;

  const t = titleOf(html);
  const d = descOf(html);
  const h = h1Of(html);
  const can = canonicalOf(html);

  if (titles.has(t)) fail(`title dupliqué: ${t}`);
  titles.add(t);

  if (descs.has(d)) fail(`description dupliquée: ${city.file}`);
  descs.add(d);

  if (h1s.has(h)) fail(`H1 dupliqué: ${h}`);
  h1s.add(h);

  if (can !== `${BASE}/${city.file}`) fail(`canonical ${city.file}: ${can}`);
  if (!html.includes("/debarras-correze.html")) fail(`${city.file} sans lien hub`);
  if (!html.includes("/debarras-maison.html")) fail(`${city.file} sans lien service maison`);
  if (!html.includes('alt="')) fail(`${city.file} image sans alt`);

  const imgs = [...html.matchAll(/<img[^>]+>/g)];
  for (const img of imgs) {
    if (!/alt="[^"]*"/.test(img[0])) fail(`${city.file} img sans attribut alt`);
  }
}
if (fails === 0) pass("pages villes: titles/desc/H1 uniques, canonical, maillage, alt");

// --- Sitemap ---
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
if (!sitemap.includes(`${BASE}/debarras-correze.html`)) fail("sitemap sans hub");
for (const city of CORREZE_CITY_PAGES) {
  if (!sitemap.includes(`${BASE}/${city.file}`)) fail(`sitemap sans ${city.file}`);
}
if (fails === 0) pass("sitemap contient hub + villes");

const urlCount = (sitemap.match(/<loc>/g) || []).length;
const expected = 12 + 1 + CORREZE_CITY_PAGES.length; // base pages + hub + cities
if (urlCount < expected) fail(`sitemap ${urlCount} urls, attendu >= ${expected}`);
else pass(`sitemap ${urlCount} urls`);

// --- Robots ---
const robots = fs.readFileSync(path.join(root, "robots.txt"), "utf8");
if (!robots.includes("Allow: /")) fail("robots sans Allow");
if (!robots.includes(`${BASE}/sitemap.xml`)) fail("robots sitemap URL");
else pass("robots.txt");

console.log(fails ? `\n${fails} échec(s)` : "\nTous les tests Corrèze OK");
process.exit(fails ? 1 : 0);
