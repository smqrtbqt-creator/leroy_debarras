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
const expectedTitle = "Débarras, Nettoyage &amp; Évacuation | Leroy du Débarras";
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
if (indexTitle.replace(/&amp;/g, "&").length < 50 || indexTitle.replace(/&amp;/g, "&").length > 60) {
  fail(`title accueil hors plage (${indexTitle.replace(/&amp;/g, "&").length})`);
}
if (indexDesc.length < 100 || indexDesc.length > 130) {
  fail(`description accueil hors plage (${indexDesc.length})`);
}
if (!index.includes('hreflang="fr"') || !index.includes('hreflang="x-default"')) {
  fail("hreflang accueil manquant");
} else ok("hreflang accueil");

const jsonldMatch = index.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
if (jsonldMatch) {
  try {
    const data = JSON.parse(jsonldMatch[1]);
    if (!data["@graph"]?.length) fail("JSON-LD accueil sans @graph");
    else ok("JSON-LD accueil valide");
    const raw = JSON.stringify(data);
    if (raw.includes('"taxID"') || raw.includes('"vatID"')) {
      fail("JSON-LD accueil : taxID/vatID non attendus (SIRET FR)");
    }
    const types = data["@graph"].flatMap((n) => (Array.isArray(n["@type"]) ? n["@type"] : [n["@type"]]));
    if (!types.includes("LocalBusiness") || !types.includes("WebSite") || !types.includes("WebPage")) {
      fail("JSON-LD accueil : types manquants (LocalBusiness/WebSite/WebPage)");
    }
    if (!types.includes("FAQPage")) fail("JSON-LD accueil : FAQPage manquant");
    const biz = data["@graph"].find((n) => {
      const t = n["@type"];
      return t === "LocalBusiness" || (Array.isArray(t) && t.includes("LocalBusiness"));
    });
    if (!biz?.description || !biz?.image || !biz?.telephone || !biz?.address) {
      fail("JSON-LD LocalBusiness incomplet");
    }
    if (!biz?.priceRange) fail("JSON-LD LocalBusiness sans priceRange");
    if (!biz?.geo?.latitude || !biz?.geo?.longitude) fail("JSON-LD LocalBusiness sans geo");
    if (typeof biz?.logo !== "object" || !biz.logo.url) fail("JSON-LD logo doit être ImageObject");
    if (typeof biz?.image === "string") fail("JSON-LD image doit être ImageObject");
    else if (biz?.image && !biz.image.url) fail("JSON-LD image.url manquant");
    ok("JSON-LD LocalBusiness Google-ready (image/logo/geo/priceRange)");
  } catch {
    fail("JSON-LD accueil invalide");
  }
}

for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  const imgs = html.match(/<img\b[^>]*>/g) || [];
  for (const img of imgs) {
    if (!/\balt=/.test(img)) fail(`${file} : img sans attribut alt`);
    if (/alt=""/.test(img) && file === "index.html") fail(`${file} : img avec alt vide`);
  }
  if ((html.match(/rel="canonical"/g) || []).length > 1) fail(`${file} : canonical multiple`);
  if ((html.match(/<meta name="description"/g) || []).length > 1) fail(`${file} : description multiple`);
}

ok(`${htmlFiles.length} pages HTML`);
ok(`${titles.size} titles uniques`);

const FACEBOOK_URL = "https://www.facebook.com/p/Leroy-Du-D%C3%A9barras-61588277545987/";
const WORKWAVE_URL = "https://workwave.fr/artisan/cory-leroy-00016";

function withoutScripts(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, "");
}

function hasSocialAnchor(body, url, label) {
  const re = new RegExp(
    `<a\\b[^>]*href="${url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>\\s*${label}\\s*</a>`,
    "i",
  );
  return re.test(body);
}

if (jsonldMatch) {
  try {
    const data = JSON.parse(jsonldMatch[1]);
    const biz = data["@graph"]?.find((n) => {
      const t = n["@type"];
      return t === "LocalBusiness" || (Array.isArray(t) && t.includes("LocalBusiness"));
    });
    const sameAs = Array.isArray(biz?.sameAs) ? biz.sameAs : [];
    if (!sameAs.includes(FACEBOOK_URL)) fail("sameAs Facebook manquant dans JSON-LD");
    else ok("sameAs Facebook JSON-LD");
    if (!sameAs.includes(WORKWAVE_URL)) fail("sameAs Workwave manquant dans JSON-LD");
    else ok("sameAs Workwave JSON-LD");
  } catch {
    fail("sameAs JSON-LD illisible");
  }
}

for (const file of htmlFiles) {
  const body = withoutScripts(fs.readFileSync(path.join(root, file), "utf8"));
  if (!body.includes(`href="${FACEBOOK_URL}"`)) fail(`${file} : lien Facebook absent du HTML`);
  if (!body.includes(`href="${WORKWAVE_URL}"`)) fail(`${file} : lien Workwave absent du HTML`);
  if (!hasSocialAnchor(body, FACEBOOK_URL, "Facebook")) fail(`${file} : balise <a> Facebook invalide`);
  if (!hasSocialAnchor(body, WORKWAVE_URL, "Workwave")) fail(`${file} : balise <a> Workwave invalide`);
  if (!body.includes('aria-label="Leroy du Débarras sur Facebook"')) {
    fail(`${file} : aria-label Facebook manquant`);
  }
  if (!body.includes('aria-label="Leroy du Débarras sur Workwave"')) {
    fail(`${file} : aria-label Workwave manquant`);
  }
  if (!body.includes('target="_blank"') || !body.includes('rel="noopener noreferrer"')) {
    fail(`${file} : attributs lien externe manquants`);
  }
}
if (fails === 0) ok("liens sociaux HTML footer (Facebook + Workwave)");

if (fails) {
  console.error(fails, "échec(s)");
  process.exit(1);
}
console.log("PASS");
