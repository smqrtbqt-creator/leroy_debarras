/**
 * Contrôles mobile (critères Semrush / Google Mobile-Friendly).
 * Usage: node tests/check-mobile.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const css = fs.readFileSync(path.join(root, "css", "style.css"), "utf8");
const htmlFiles = fs.readdirSync(root).filter((f) => f.endsWith(".html"));
let fails = 0;

function fail(msg) {
  console.error("FAIL:", msg);
  fails++;
}

function pass(msg) {
  console.log("PASS:", msg);
}

const viewportRe = /name="viewport"\s+content="width=device-width,\s*initial-scale=1(?:\.0)?"/i;

for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  if (!viewportRe.test(html)) fail(`${file} : viewport mobile manquant ou invalide`);
}

if (fails === 0) pass(`viewport correct sur ${htmlFiles.length} pages`);

if (!css.includes("overflow-x: clip")) fail("CSS sans overflow-x: clip");
else pass("overflow-x: clip sur html/body");

if (!css.includes("@media (max-width: 959px)")) fail("breakpoint mobile nav manquant (959px)");
else pass("menu mobile jusqu'à 959px");

if (!css.includes("min-height: 48px")) fail("cibles tactiles 48px absentes");
else pass("cibles tactiles min-height 48px");

if (!css.includes("font-size: 16px")) fail("base font-size 16px absente");
else pass("base font-size 16px");

const tinyRem = css.match(/font-size:\s*0\.8[0-4]\d*rem/g) || [];
if (tinyRem.length) fail(`polices trop petites: ${tinyRem.join(", ")}`);
else pass("aucune police < 0.85rem");

if (!css.includes("text-size-adjust: 100%")) fail("text-size-adjust manquant");
else pass("text-size-adjust activé");

if (!css.includes("env(safe-area-inset-bottom)")) fail("safe-area mobile manquante");
else pass("safe-area iOS prise en charge");

console.log(fails ? `\n${fails} échec(s)` : "\nContrôles mobile OK");
process.exit(fails ? 1 : 0);
