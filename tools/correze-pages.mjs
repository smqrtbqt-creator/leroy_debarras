/**
 * Génère le hub Corrèze + les pages villes stratégiques.
 * Appelé depuis tools/build-pages.mjs
 */
import {
  CORREZE_COMMUNES,
  CORREZE_SECTORS,
  communesBySector,
  findCommune,
} from "../data/correze-data.mjs";
import { CORREZE_CITY_PAGES } from "../data/correze-cities.mjs";

const IMG = {
  "goulotte-chantier": {
    webp: "/images/goulotte-chantier.webp",
    jpg: "/images/goulotte-chantier.jpg",
    alt: "Évacuation lors d’un débarras de maison",
    w: 1024,
    h: 576,
  },
  "chantier-interieur": {
    webp: "/images/chantier-interieur.webp",
    jpg: "/images/chantier-interieur.jpg",
    alt: "Pièce encombrée à débarrasser",
    w: 768,
    h: 1024,
  },
  encombrants: {
    webp: "/images/encombrants.webp",
    jpg: "/images/encombrants.jpg",
    alt: "Encombrants prêts à être triés et évacués",
    w: 1024,
    h: 682,
  },
  "chantier-exterieur": {
    webp: "/images/chantier-exterieur.webp",
    jpg: "/images/chantier-exterieur.jpg",
    alt: "Évacuation de végétaux et charges extérieures",
    w: 1024,
    h: 768,
  },
  "outils-nettoyage": {
    webp: "/images/outils-nettoyage.webp",
    jpg: "/images/outils-nettoyage.jpg",
    alt: "Matériel de nettoyage pour remise en état",
    w: 1024,
    h: 682,
  },
  "chantier-arbre": {
    webp: "/images/chantier-arbre.webp",
    jpg: "/images/chantier-arbre.jpg",
    alt: "Abords et végétaux après travaux",
    w: 768,
    h: 952,
  },
  brouette: {
    webp: "/images/brouette.webp",
    jpg: "/images/brouette.jpg",
    alt: "Brouette pour chantier de débarras",
    w: 1024,
    h: 682,
  },
};

export const faqCorreze = [
  {
    q: "Intervenez-vous dans toute la Corrèze ?",
    a: "Oui. Leroy du Débarras couvre le département de la Corrèze (19). La base est à Marcillac-la-Croisille ; les déplacements vers Brive, Tulle, Ussel et les communes rurales se discutent selon le volume et l’accès.",
  },
  {
    q: "Combien coûte un débarras de maison ?",
    a: "Il n’y a pas de tarif unique : le devis dépend du volume, de l’accès, du type de biens et des prestations (tri, évacuation, nettoyage). Décrivez le chantier pour obtenir une estimation.",
  },
  {
    q: "Faites-vous les débarras après succession ?",
    a: "Oui. Tri, enlèvement, évacuation et nettoyage si besoin, pour préparer une vente, une location ou une transmission. Le rythme peut être progressif pièce par pièce.",
  },
  {
    q: "Pouvez-vous vider une grange ?",
    a: "Oui. Grange, hangar ou garage : objets lourds, ferraille, bois et encombrants. Le tri sur place oriente chaque flux vers une filière adaptée.",
  },
  {
    q: "Évacuez-vous les déchets après le débarras ?",
    a: "Oui. Chargement, transport et évacuation vers la déchetterie ou les filières adaptées (déchets verts, ferraille, etc.), selon ce qui est présent sur place.",
  },
  {
    q: "Faites-vous également le nettoyage ?",
    a: "Oui, un nettoyage après débarras ou après chantier peut être ajouté au devis, ainsi que des travaux extérieurs (débroussaillage, végétaux, gouttières).",
  },
  {
    q: "Intervenez-vous dans les communes rurales ?",
    a: "Oui. Les communes hors agglomération font partie du territoire. Indiquez la commune : nous confirmons le déplacement selon le chantier.",
  },
  {
    q: "Que deviennent les objets récupérables ?",
    a: "Selon leur état, certains biens peuvent être orientés vers le réemploi ou le recyclage ; le reste est évacué. Aucun partenariat inventé : le circuit se précise au devis.",
  },
];

export function registerCorrezePages({ pageShell, pic, serviceNode, esc }) {
  const cityBySlug = Object.fromEntries(CORREZE_CITY_PAGES.map((c) => [c.slug, c]));

  function cityPath(slug) {
    const c = cityBySlug[slug];
    return c ? `/${c.file}` : null;
  }

  function communeLabel(slug) {
    const c = findCommune(slug);
    return c ? c.name : slug;
  }

  function sectorBlocks() {
    return CORREZE_SECTORS.map((sector) => {
      const list = communesBySector(sector.id);
      const pills = list
        .map((c) => {
          const page = cityBySlug[c.slug];
          if (page) {
            return `<a class="commune-pill" href="/${page.file}">${esc(c.name)}</a>`;
          }
          return `<span>${esc(c.name)}</span>`;
        })
        .join("");
      return `<div class="zones-block">
        <h3 class="section-title" style="font-size:1.25rem">${esc(sector.name)}</h3>
        <p>${esc(sector.blurb)}</p>
        <div class="communes">${pills}</div>
      </div>`;
    }).join("");
  }

  function cityCards() {
    return CORREZE_CITY_PAGES.map((c) => {
      const commune = findCommune(c.slug);
      return `<article class="card">
        <div class="card-body">
          <h3>${esc(c.h1)}</h3>
          <p>${esc(c.lede)}</p>
          <a class="more" href="/${c.file}">Voir ${esc(commune?.name || c.slug)}</a>
        </div>
      </article>`;
    }).join("");
  }

  pageShell({
    file: "debarras-correze.html",
    title: "Débarras en Corrèze | Leroy du Débarras",
    desc: "Débarras de maisons, appartements, granges et garages en Corrèze : tri, évacuation, nettoyage. Entreprise locale à Marcillac-la-Croisille.",
    path: "/debarras-correze.html",
    h1: "Débarras en Corrèze",
    lede: "Leroy du Débarras intervient dans le département de la Corrèze (19) pour vider, trier et évacuer : maisons, appartements, granges, garages, caves et abords.",
    crumbs: [
      { href: "/", label: "Accueil" },
      { href: "/debarras-correze.html", label: "Débarras en Corrèze" },
    ],
    faq: faqCorreze,
    jsonldExtra: serviceNode(
      "Débarras en Corrèze",
      "/debarras-correze.html",
      "Débarras, nettoyage et évacuation sur l’ensemble du département de la Corrèze.",
    ),
    bodyInner: `
  <section>
    <div class="container split">
      <div class="prose">
        <h2>Une entreprise locale pour toute la Corrèze</h2>
        <p>Basée à <a href="/debarras-marcillac-la-croisille.html">Marcillac-la-Croisille</a>, Leroy du Débarras couvre le département&nbsp;19 : du bassin de <a href="/debarras-brive-la-gaillarde.html">Brive-la-Gaillarde</a> à <a href="/debarras-ussel.html">Ussel</a>, en passant par <a href="/debarras-tulle.html">Tulle</a> et les communes rurales.</p>
        <p>Chaque chantier est évalué selon le volume, l’accès et les prestations demandées. Pas besoin de vider toute la maison : une pièce, un garage ou une grange suffisent à justifier une intervention.</p>
      </div>
      ${pic({ ...IMG["goulotte-chantier"] })}
    </div>
  </section>
  <section>
    <div class="container prose">
      <h2>Débarras de maisons</h2>
      <p>Vide complet ou partiel : meubles, électroménager, cartons, grenier. Voir aussi la page <a href="/debarras-maison.html">débarras de maison</a>.</p>
      <h2>Débarras d’appartements</h2>
      <p>Étages, caves d’immeuble, stationnement : le détail d’accès compte autant que le volume. <a href="/debarras-appartement.html">Débarras d’appartement</a>.</p>
      <h2>Débarras de granges</h2>
      <p>Objets lourds, ferraille, bois, matériel entreposé. Souvent couplé au <a href="/tri-et-recuperation.html">tri</a> et à l’<a href="/evacuation.html">évacuation</a>.</p>
      <h2>Débarras de garages</h2>
      <p>Outils, pneus, encombrants : un garage se traite seul ou avec le logement. <a href="/caves-greniers-garages.html">Caves, greniers et garages</a>.</p>
      <h2>Débarras de caves et greniers</h2>
      <p>Accès réduit, poussière, charges fractionnées : ces volumes demandent du temps. Ils figurent souvent dans un débarras de maison ou d’appartement.</p>
      <h2>Débarras après succession</h2>
      <p>Intervention progressive, respect des objets à conserver. <a href="/debarras-succession.html">Débarras après succession</a>.</p>
      <h2>Nettoyage après débarras</h2>
      <p>Remise en état des pièces pour visite, vente ou location. Complément possible après chantier : <a href="/nettoyage-fin-chantier.html">nettoyage après chantier</a>.</p>
      <h2>Évacuation et tri des déchets</h2>
      <p>Chargement, transport, déchetterie, ferraille, déchets verts. <a href="/tri-et-recuperation.html">Tri</a> et <a href="/evacuation.html">évacuation</a>.</p>
      <h2>Débroussaillage et enlèvement des végétaux</h2>
      <p>Terrains, jardins, abords : <a href="/nettoyage-exterieur.html">travaux extérieurs</a> et enlèvement des végétaux.</p>
    </div>
  </section>
  <section>
    <div class="container prose">
      <h2>Comment fonctionne la prestation&nbsp;?</h2>
      <ol class="prose-list">
        <li>Vous décrivez le lieu, les pièces et l’accès via le <a href="/contact.html">formulaire de devis</a>.</li>
        <li>Nous précisons ensemble le volume, le tri et l’évacuation.</li>
        <li>Intervention sur place : tri, chargement, évacuation, nettoyage si prévu.</li>
      </ol>
    </div>
  </section>
  <section>
    <div class="container">
      <h2 class="section-title">Villes et communes stratégiques</h2>
      <p class="section-intro">Pages dédiées pour les bassins où la demande locale est la plus claire. Les autres communes de Corrèze sont listées par secteur ci-dessous.</p>
      <div class="cards cards-3">${cityCards()}</div>
    </div>
  </section>
  <section>
    <div class="container">
      <h2 class="section-title">Zones d’intervention en Corrèze</h2>
      <p class="section-intro">${CORREZE_COMMUNES.length} communes du département 19, regroupées par secteurs. Une commune sans page dédiée reste éligible au devis.</p>
      <div class="correze-map" role="img" aria-label="Corrèze : secteurs Brive, Tulle, Ussel, Uzerche, Égletons, Dordogne, Sud et plateau">
        <div class="correze-map-grid">
          ${CORREZE_SECTORS.map((s) => `<div class="correze-map-cell" data-sector="${esc(s.id)}"><strong>${esc(s.name)}</strong><span>${communesBySector(s.id).length} communes</span></div>`).join("")}
        </div>
      </div>
      ${sectorBlocks()}
      <p>Pour le détail opérationnel autour de la base : <a href="/zones-intervention.html">zones d’intervention</a>.</p>
    </div>
  </section>`,
  });

  for (const city of CORREZE_CITY_PAGES) {
    const commune = findCommune(city.slug);
    if (!commune) throw new Error(`Commune introuvable pour page ville: ${city.slug}`);
    const img = IMG[city.img] || IMG["chantier-interieur"];
    const nearbyLinks = city.nearby
      .map((slug) => {
        const path = cityPath(slug);
        const label = communeLabel(slug);
        if (path) return `<li><a href="${path}">Débarras à ${esc(label)}</a></li>`;
        return `<li>${esc(label)}</li>`;
      })
      .join("");

    pageShell({
      file: city.file,
      title: city.title,
      desc: city.desc,
      path: `/${city.file}`,
      h1: city.h1,
      lede: city.lede,
      crumbs: [
        { href: "/", label: "Accueil" },
        { href: "/debarras-correze.html", label: "Débarras en Corrèze" },
        { href: `/${city.file}`, label: commune.name },
      ],
      faq: city.faq,
      jsonldExtra: serviceNode(
        city.h1,
        `/${city.file}`,
        city.desc,
        commune.name,
      ),
      bodyInner: `
  <section>
    <div class="container split">
      <div class="prose">
        <h2>Intervention à ${esc(commune.name)}</h2>
        <p>${esc(city.angle)}</p>
        <h3>Types de biens et prestations</h3>
        <ul>
          ${city.housing.map((h) => `<li>${esc(h)}</li>`).join("")}
        </ul>
        <p>Prestations liées : <a href="/debarras-maison.html">maison</a>, <a href="/debarras-appartement.html">appartement</a>, <a href="/caves-greniers-garages.html">cave / garage / grange</a>, <a href="/debarras-succession.html">succession</a>, <a href="/evacuation.html">évacuation</a>, <a href="/nettoyage-exterieur.html">extérieurs</a>.</p>
        <p><a href="/debarras-correze.html">Voir tout le débarras en Corrèze</a> · <a href="/contact.html">Demander un devis</a></p>
      </div>
      ${pic({ ...img })}
    </div>
  </section>
  <section>
    <div class="container prose">
      <h2>Communes et secteurs proches</h2>
      <ul>${nearbyLinks}</ul>
      <p>Secteur : <strong>${esc(CORREZE_SECTORS.find((s) => s.id === commune.sectorId)?.name || "Corrèze")}</strong>. Code postal fréquent : ${(commune.postalCodes || []).slice(0, 3).map(esc).join(", ") || "à préciser"}.</p>
    </div>
  </section>`,
    });
  }

  return {
    hubFile: "debarras-correze.html",
    cityFiles: CORREZE_CITY_PAGES.map((c) => c.file),
    communeCount: CORREZE_COMMUNES.length,
    cityCount: CORREZE_CITY_PAGES.length,
  };
}
