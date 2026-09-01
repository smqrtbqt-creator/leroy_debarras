/**
 * Build data/correze-data.mjs from official geo.api.gouv.fr dump (département 19).
 * Usage: node tools/build-correze-data.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const raw = JSON.parse(fs.readFileSync(path.join(root, "data", "correze-communes-raw.json"), "utf8"));

function slugify(name) {
  return String(name)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const SECTORS = [
  {
    id: "brive",
    name: "Brive-la-Gaillarde et son agglomération",
    blurb:
      "Bassin densément peuplé du sud-ouest : maisons de lotissement, appartements, caves et garages, accès souvent facilités par les grands axes.",
  },
  {
    id: "tulle",
    name: "Tulle et bassin de Tulle",
    blurb:
      "Préfecture et vallée de la Corrèze : logements en pente, accès parfois étroits, dépendances et pièces à vider au cas par cas.",
  },
  {
    id: "ussel",
    name: "Ussel et Haute-Corrèze",
    blurb:
      "Nord-est du département, moyenne montagne : granges, hangars, volumes ruraux et chantiers plus exposés au climat.",
  },
  {
    id: "uzerche",
    name: "Uzerche et Ouest Corrézien",
    blurb:
      "Ouest du département, autour de la Vézère : bourgs historiques, maisons de village et accès à préparer au devis.",
  },
  {
    id: "egletons",
    name: "Égletons et secteur Est",
    blurb:
      "Est Corrézien, plateau et communes autour d’Égletons : interventions locales déjà habituelles pour Leroy du Débarras.",
  },
  {
    id: "dordogne",
    name: "Vallée de la Dordogne",
    blurb:
      "Sud-est : Argentat-sur-Dordogne et communes de rive, souvent des volumes mixtes (maison, dépendance, extérieur).",
  },
  {
    id: "sud",
    name: "Sud Corrèze",
    blurb:
      "Sud du bassin de Brive et collines : villages, maisons de caractère, garages et terrains à remettre en ordre.",
  },
  {
    id: "plateau",
    name: "Plateau de Millevaches et nord",
    blurb:
      "Nord du département : communes rurales, granges et hangars, distances plus longues à préciser au devis.",
  },
];

/** Rough geographic assignment from commune centroid (lon, lat). */
function assignSector(lon, lat, name) {
  const n = name.toLowerCase();
  // Explicit overrides for strategic / border cases
  const overrides = {
    "Brive-la-Gaillarde": "brive",
    Malemort: "brive",
    Cosnac: "brive",
    "Saint-Pantaléon-de-Larche": "brive",
    Objat: "brive",
    Ussac: "brive",
    Donzenac: "brive",
    Tulle: "tulle",
    Naves: "tulle",
    Chameyrat: "tulle",
    "Laguenne-sur-Avalouze": "tulle",
    "Sainte-Fortunade": "tulle",
    Ussel: "ussel",
    Meymac: "ussel",
    "Bort-les-Orgues": "ussel",
    Neuvic: "ussel",
    Uzerche: "uzerche",
    Vigeois: "uzerche",
    Lubersac: "uzerche",
    Égletons: "egletons",
    "Rosiers-d’Égletons": "egletons",
    "Rosiers-d'Égletons": "egletons",
    Corrèze: "egletons",
    "Marcillac-la-Croisille": "egletons",
    "Argentat-sur-Dordogne": "dordogne",
    "Beaulieu-sur-Dordogne": "dordogne",
    "Saint-Privat": "dordogne",
    Turenne: "sud",
    "Collonges-la-Rouge": "sud",
    Meyssac: "sud",
    Beynat: "sud",
    Treignac: "plateau",
    Bugeat: "plateau",
    Peyrelevade: "plateau",
    Sornac: "plateau",
  };
  if (overrides[name]) return overrides[name];

  if (lat >= 45.55) return "plateau";
  if (lon >= 2.15 && lat >= 45.4) return "ussel";
  if (lon >= 1.95 && lat >= 45.35 && lat < 45.55) return "egletons";
  if (lon >= 1.85 && lat < 45.3) return "dordogne";
  if (lon < 1.55 && lat >= 45.35) return "uzerche";
  if (lat < 45.12 || (lon < 1.7 && lat < 45.2 && n.includes("collonges"))) return "sud";
  if (lon < 1.75 && lat < 45.28) return "brive";
  if (lon >= 1.55 && lon < 1.95 && lat >= 45.2 && lat < 45.4) return "tulle";
  if (lon < 1.55) return "uzerche";
  if (lat < 45.25) return "brive";
  return "tulle";
}

const communes = raw
  .map((c) => {
    const lon = c.centre?.coordinates?.[0];
    const lat = c.centre?.coordinates?.[1];
    const sectorId = assignSector(lon ?? 1.7, lat ?? 45.3, c.nom);
    return {
      name: c.nom,
      slug: slugify(c.nom),
      code: c.code,
      postalCodes: c.codesPostaux || [],
      sectorId,
      lon,
      lat,
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name, "fr"));

const bySlug = new Map();
for (const c of communes) {
  if (bySlug.has(c.slug)) throw new Error(`slug dupliqué: ${c.slug}`);
  bySlug.set(c.slug, c);
}

const out = `/**
 * Données Corrèze (département 19) — générées depuis geo.api.gouv.fr
 * Ne pas éditer les communes à la main : relancer tools/build-correze-data.mjs
 * Source: data/correze-communes-raw.json (${communes.length} communes)
 */
export const CORREZE_DEPARTMENT = {
  code: "19",
  name: "Corrèze",
  hubPath: "/debarras-correze.html",
};

export const CORREZE_SECTORS = ${JSON.stringify(SECTORS, null, 2)};

export const CORREZE_COMMUNES = ${JSON.stringify(
  communes.map(({ name, slug, code, postalCodes, sectorId }) => ({
    name,
    slug,
    code,
    postalCodes,
    sectorId,
  })),
  null,
  2,
)};

export function communesBySector(sectorId) {
  return CORREZE_COMMUNES.filter((c) => c.sectorId === sectorId);
}

export function findCommune(slugOrName) {
  const key = String(slugOrName || "").toLowerCase();
  return (
    CORREZE_COMMUNES.find((c) => c.slug === key) ||
    CORREZE_COMMUNES.find((c) => c.name.toLowerCase() === key) ||
    null
  );
}
`;

fs.writeFileSync(path.join(root, "data", "correze-data.mjs"), out);
console.log("wrote correze-data.mjs", communes.length, "communes");
for (const s of SECTORS) {
  const n = communes.filter((c) => c.sectorId === s.id).length;
  console.log(`  ${s.id}: ${n}`);
}
