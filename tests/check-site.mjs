/**
 * Contrôles SEO / contenu du site Leroy du Débarras.
 * Usage : node tests/check-site.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
let fails = 0;

function fail(msg) {
  fails += 1;
  console.error("FAIL", msg);
}

function ok(msg) {
  console.log("OK", msg);
}

const htmlFiles = fs.readdirSync(root).filter((f) => f.endsWith(".html"));
const titles = new Map();
const h1s = new Map();
const forbidden = /agence-ia-web\.com/i;
const fakePhone = /0[1-9](?:[\s.-]?\d{2}){4}/;

for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  if (forbidden.test(html)) fail(`${file} contient agence-ia-web.com`);
  const title = (html.match(/<title>([^<]+)<\/title>/) || [])[1];
  const h1 = (html.match(/<h1[^>]*>([^<]+)<\/h1>/) || [])[1];
  const canon = (html.match(/rel="canonical" href="([^"]+)"/) || [])[1];
  const desc = (html.match(/name="description" content="([^"]+)"/) || [])[1];
  const og = (html.match(/property="og:image" content="([^"]+)"/) || [])[1];
  if (!title) fail(`${file} sans title`);
  if (!h1) fail(`${file} sans H1`);
  if (!canon) fail(`${file} sans canonical`);
  if (!desc) fail(`${file} sans description`);
  if (!og) fail(`${file} sans og:image`);
  if (!html.includes('lang="fr"')) fail(`${file} lang`);
  if (titles.has(title)) fail(`title dupliqué : ${title} (${file} / ${titles.get(title)})`);
  else titles.set(title, file);
  if (h1s.has(h1) && file !== "404.html") fail(`H1 dupliqué : ${h1}`);
  else h1s.set(h1, file);
  if (file !== "mentions-legales.html" && file !== "politique-confidentialite.html" && fakePhone.test(html.replace(/site-config[\s\S]*?script/, ""))) {
    /* ignore */
  }
}

const robots = fs.readFileSync(path.join(root, "robots.txt"), "utf8");
if (!robots.includes("Sitemap:")) fail("robots sans Sitemap");
if (forbidden.test(robots)) fail("robots agence-ia-web");

const sm = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
if (sm.includes("mentions-legales") || sm.includes("politique-confidentialite") || sm.includes("404.html")) {
  fail("sitemap contient des pages noindex");
}
if (forbidden.test(sm)) fail("sitemap agence-ia-web");

const cfg = fs.readFileSync(path.join(root, "js", "site-config.js"), "utf8");
if (!cfg.includes("SITE_URL")) fail("config SITE_URL");
if (!cfg.includes("EMAIL: null")) fail("config attend EMAIL: null");
if (!cfg.includes("PHONE:")) fail("config PHONE");
if (!cfg.includes("ADDRESS:")) fail("config ADDRESS");

const index = fs.readFileSync(path.join(root, "index.html"), "utf8");
if (!index.includes("Débarras, nettoyage et évacuation à Marcillac-la-Croisille")) {
  fail("H1 accueil");
}
if (!index.includes("application/ld+json")) fail("JSON-LD accueil");

const indexTitle = (index.match(/<title>([^<]+)<\/title>/) || [])[1];
const indexDesc = (index.match(/name="description" content="([^"]+)"/) || [])[1];
const indexCanon = (index.match(/rel="canonical" href="([^"]+)"/) || [])[1];
const expectedTitle = "Débarras, Nettoyage &amp; Évacuation | Leroy Débarras";
const expectedDesc =
  "Débarras de maisons, granges et garages : nettoyage, évacuation des déchets et enlèvement de végétaux.";
const expectedCanon = "https://leroydudebaras.fr/";

if (indexTitle !== expectedTitle) fail(`title accueil : "${indexTitle}"`);
else ok("title accueil");
if (indexDesc !== expectedDesc) fail(`description accueil : ${indexDesc?.length} car.`);
else ok("description accueil");
if (indexCanon !== expectedCanon) fail(`canonical accueil : ${indexCanon}`);
else ok("canonical accueil");
if ((index.match(/rel="canonical"/g) || []).length !== 1) fail("canonical accueil multiple");
if ((index.match(/<meta name="description"/g) || []).length !== 1) fail("description accueil multiple");
if (indexTitle.length > 60) fail(`title accueil trop long (${indexTitle.length})`);
if (indexDesc.length < 100 || indexDesc.length > 130) {
  fail(`description accueil hors plage (${indexDesc.length})`);
}

const jsonldMatch = index.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
if (jsonldMatch) {
  try {
    const data = JSON.parse(jsonldMatch[1]);
    if (!data["@graph"]?.length) fail("JSON-LD accueil sans @graph");
    else ok("JSON-LD accueil valide");
    if (JSON.stringify(data).includes('"taxID"')) fail("JSON-LD accueil contient taxID");
  } catch {
    fail("JSON-LD accueil invalide");
  }
}

for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const imgs = html.match(/<img\b[^>]*>/g) || [];
  for (const img of imgs) {
    if (!/\balt=/.test(img)) fail(`${file} : img sans attribut alt`);
  }
  if ((html.match(/rel="canonical"/g) || []).length > 1) fail(`${file} : canonical multiple`);
  if ((html.match(/<meta name="description"/g) || []).length > 1) fail(`${file} : description multiple`);
}

ok(`${htmlFiles.length} pages HTML`);
ok(`${titles.size} titles uniques`);
if (fails) {
  console.error(fails, "échec(s)");
  process.exit(1);
}
console.log("PASS");
