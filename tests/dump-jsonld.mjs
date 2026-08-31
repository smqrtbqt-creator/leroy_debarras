import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
if (!match) {
  console.error("No JSON-LD");
  process.exit(1);
}
const data = JSON.parse(match[1]);
console.log(JSON.stringify(data, null, 2));

const graph = data["@graph"] || [];
const issues = [];
for (const node of graph) {
  const t = node["@type"];
  if (t === "LocalBusiness") {
    if (!node.name) issues.push("LocalBusiness: name manquant");
    if (!node.url) issues.push("LocalBusiness: url manquant");
    if (!node.address) issues.push("LocalBusiness: address manquant");
    if (!node.telephone) issues.push("LocalBusiness: telephone manquant");
    if (!node.image) issues.push("LocalBusiness: image manquant");
    if (node.taxID) issues.push("LocalBusiness: taxID présent (souvent rejeté pour SIRET)");
    if (typeof node.image === "object" && !node.image.url) issues.push("LocalBusiness: image.url manquant");
    if (node.foundingDate && !/^\d{4}(-\d{2}-\d{2})?$/.test(node.foundingDate)) {
      issues.push("LocalBusiness: foundingDate format suspect");
    }
  }
  if (t === "FAQPage") {
    if (!Array.isArray(node.mainEntity) || !node.mainEntity.length) {
      issues.push("FAQPage: mainEntity vide");
    }
    for (const q of node.mainEntity || []) {
      if (!q.name || !q.acceptedAnswer?.text) issues.push("FAQPage: question/réponse incomplète");
    }
  }
  if (t === "Service") {
    if (!node.name || !node.provider) issues.push("Service incomplet");
  }
}
console.log("\n--- Issues ---");
console.log(issues.length ? issues.join("\n") : "aucune issue structurelle locale");
