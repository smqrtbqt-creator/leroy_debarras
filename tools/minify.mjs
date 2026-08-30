/**
 * Minifie css/style.css et js/script.js (sans dépendance).
 * Usage : node tools/minify.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

function minifyCss(s) {
  return s
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
}

function minifyJs(s) {
  return s
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

const css = fs.readFileSync(path.join(root, "css", "style.css"), "utf8");
fs.writeFileSync(path.join(root, "css", "style.min.css"), minifyCss(css));
const js = fs.readFileSync(path.join(root, "js", "script.js"), "utf8");
fs.writeFileSync(path.join(root, "js", "script.min.js"), minifyJs(js));
console.log("minified css + js");
