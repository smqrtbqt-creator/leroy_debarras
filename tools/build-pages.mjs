/**
 * Génère les pages HTML à partir de js/site-config.js (SITE_URL).
 * Usage : node tools/build-pages.mjs
 */
import fs from "fs";
import path from "path";
import vm from "vm";
import { fileURLToPath } from "url";
import { registerCorrezePages } from "./correze-pages.mjs";
import { socialButton, footerSocialCol } from "./social-fragments.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const configSrc = fs.readFileSync(path.join(root, "js", "site-config.js"), "utf8");
const sandbox = {};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.runInNewContext(configSrc, sandbox);
const site = sandbox.LeroySite;
const BASE = String(site.SITE_URL || "").replace(/\/+$/, "");

function abs(p) {
  const pathName = p.startsWith("/") ? p : "/" + p;
  return BASE ? BASE + pathName : pathName;
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pic({ webp, jpg, alt = "", w, h, className, lazy = true, fetchpriority }) {
  const extra = [
    className ? `class="${className}"` : "",
    lazy ? `loading="lazy" decoding="async"` : `decoding="async"`,
    fetchpriority ? `fetchpriority="${fetchpriority}"` : "",
  ]
    .filter(Boolean)
    .join(" ");
  return `<picture>
  <source type="image/webp" srcset="${webp}">
  <img src="${jpg}" alt="${esc(alt)}" width="${w}" height="${h}" ${extra}>
</picture>`;
}

function beforeAfter({ before, after }) {
  return `<div class="before-after">
  <figure>
    ${pic({ ...before, className: "before-after-img" })}
    <figcaption><strong>Avant</strong> — ${esc(before.caption || before.alt)}</figcaption>
  </figure>
  <figure>
    ${pic({ ...after, className: "before-after-img" })}
    <figcaption><strong>Après</strong> — ${esc(after.caption || after.alt)}</figcaption>
  </figure>
</div>`;
}

const jardinAvantApres = {
  before: {
    webp: "/images/jardin-avant.webp",
    jpg: "/images/jardin-avant.jpg",
    alt: "Massif envahi par les mauvaises herbes et les hautes graminées",
    caption: "massif envahi par les mauvaises herbes",
    w: 1024,
    h: 768,
  },
  after: {
    webp: "/images/jardin-apres.webp",
    jpg: "/images/jardin-apres.jpg",
    alt: "Massif dégagé, paillage et bordure en pierres",
    caption: "massif dégagé, paillage et bordure en pierres",
    w: 1024,
    h: 768,
  },
};

const navItems = [
  ["/", "Accueil", "index.html"],
  ["/services.html", "Services", "services.html"],
  ["/debarras-correze.html", "Corrèze", "debarras-correze.html"],
  ["/zones-intervention.html", "Zones", "zones-intervention.html"],
  ["/a-propos.html", "À propos", "a-propos.html"],
];

function nav(current) {
  const links = navItems
    .map(([href, label]) => {
      const cur = href === current ? ` aria-current="page"` : "";
      return `<li><a href="${href}"${cur}>${label}</a></li>`;
    })
    .join("");
  const contactCur = current === "/contact.html" ? ` aria-current="page"` : "";
  return `<header class="site-header">
    <div class="container header-inner">
      <a class="logo" href="/">
        <strong>Leroy du Débarras</strong>
        <span>Marcillac-la-Croisille · Corrèze</span>
      </a>
      <button class="nav-toggle" id="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Ouvrir le menu">
        <span></span>
      </button>
      <nav class="site-nav" id="site-nav" aria-label="Navigation principale">
        <ul>
          ${links}
          <li><a class="nav-cta" href="/contact.html"${contactCur}>Demander un devis gratuit</a></li>
        </ul>
      </nav>
    </div>
  </header>`;
}

function breadcrumbs(items) {
  const li = items
    .map((it, i) => {
      const last = i === items.length - 1;
      if (last) return `<li><span aria-current="page">${esc(it.label)}</span></li>`;
      return `<li><a href="${it.href}">${esc(it.label)}</a></li>`;
    })
    .join("");
  return `<nav class="breadcrumbs" aria-label="Fil d’Ariane"><ol>${li}</ol></nav>`;
}

function breadcrumbJson(items, pageUrl) {
  const node = {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.label,
      item: abs(it.href === "/" ? "/" : it.href),
    })),
  };
  if (pageUrl) node["@id"] = `${pageUrl}#breadcrumb`;
  return node;
}

function webPageNode({ url, name, description, breadcrumbId }) {
  const node = {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { "@id": abs("/#website") },
    about: { "@id": abs("/#business") },
    inLanguage: "fr-FR",
  };
  if (breadcrumbId) node.breadcrumb = { "@id": breadcrumbId };
  return node;
}

function imageObject(url, width = 1200, height = 630) {
  return {
    "@type": "ImageObject",
    "@id": `${url}#image`,
    url,
    contentUrl: url,
    width,
    height,
  };
}

function faqBlock(items) {
  const html = items
    .map(
      (it) => `<details>
      <summary>${esc(it.q)}</summary>
      <p>${it.a}</p>
    </details>`,
    )
    .join("");
  return `<section class="faq" aria-labelledby="faq-title">
    <div class="container">
      <h2 id="faq-title">Questions fréquentes</h2>
      ${html}
    </div>
  </section>`;
}

function faqJson(items, { id, url } = {}) {
  const node = {
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a.replace(/<[^>]+>/g, "") },
    })),
  };
  if (id) node["@id"] = id;
  if (url) node.url = url;
  return node;
}

function ctaBand(title, text) {
  return `<section class="cta-band">
    <div class="container">
      <h2>${esc(title)}</h2>
      <p class="lede" style="margin:10px 0 18px;max-width:40rem">${esc(text)}</p>
      <div class="actions">
        <a class="btn btn-primary" href="/contact.html">Demander un devis gratuit</a>
        <a class="btn btn-secondary" href="/contact.html" data-phone-link="label" hidden>Appeler Leroy du Débarras</a>
      </div>
    </div>
  </section>`;
}

function socialLinks(options = {}) {
  const links = Array.isArray(site.SOCIAL_LINKS)
    ? site.SOCIAL_LINKS.filter((l) => l && l.href && l.label && l.id)
    : [];
  if (!links.length) return "";
  const title = options.title || "Réseaux et annuaires";
  const intro = options.intro
    ? `<p class="section-intro">${esc(options.intro)}</p>`
    : "";
  const buttons = links.map((l) => socialButton(l, esc)).join("\n        ");
  const sectionId = options.id ? ` id="${esc(options.id)}"` : "";

  if (options.variant === "footer") {
    return `<p class="social-label">${esc(title)}</p><div class="social-buttons social-buttons--footer">${buttons}</div>`;
  }

  return `<section class="social-band"${sectionId} aria-labelledby="social-title">
    <div class="container">
      <h2 id="social-title" class="section-title">${esc(title)}</h2>
      ${intro}
      <div class="social-buttons">${buttons}</div>
    </div>
  </section>`;
}

function footer() {
  const links = Array.isArray(site.SOCIAL_LINKS)
    ? site.SOCIAL_LINKS.filter((l) => l && l.href && l.label && l.id)
    : [];
  return `<footer class="site-footer">
    <div class="container footer-grid">
      <div>
        <h2>Leroy du Débarras</h2>
        <p>Débarras, nettoyage, tri et évacuation autour de Marcillac-la-Croisille, en Corrèze.</p>
        <p data-require="PHONE"><a data-phone-link="label" href="/contact.html">Téléphone</a></p>
        <p data-require="EMAIL"><a data-email-link="label" href="/contact.html">E-mail</a></p>
        <p data-require="ADDRESS"><span data-site="ADDRESS"></span> <span data-site="POSTAL_CODE" data-empty=""></span> <span data-site="CITY"></span></p>
      </div>
      <div>
        <h2>Prestations</h2>
        <ul>
          <li><a href="/debarras-maison.html">Débarras de maisons et logements</a></li>
          <li><a href="/nettoyage-fin-chantier.html">Nettoyage après chantier</a></li>
          <li><a href="/nettoyage-exterieur.html">Travaux extérieurs</a></li>
          <li><a href="/tri-et-recuperation.html">Tri et récupération</a></li>
          <li><a href="/evacuation.html">Évacuation</a></li>
          <li><a href="/caves-greniers-garages.html">Grange, hangar, garage, cave</a></li>
        </ul>
      </div>
      <div>
        <h2>Informations</h2>
        <ul>
          <li><a href="/services.html">Toutes les prestations</a></li>
          <li><a href="/debarras-correze.html">Débarras en Corrèze</a></li>
          <li><a href="/zones-intervention.html">Zones d’intervention</a></li>
          <li><a href="/a-propos.html">À propos</a></li>
          <li><a href="/contact.html">Contact et devis</a></li>
          <li><a href="/mentions-legales.html">Mentions légales</a></li>
          <li><a href="/politique-confidentialite.html">Confidentialité</a></li>
        </ul>
      </div>
      ${footerSocialCol(links, esc)}
    </div>
    <div class="container legal">
      <p>© <span id="year"></span> Leroy du Débarras — Marcillac-la-Croisille, Corrèze.</p>
    </div>
  </footer>
  <div class="sticky-cta" aria-label="Actions rapides">
    <a class="btn btn-ghost" href="/contact.html" data-phone-link="label" hidden>Appeler</a>
    <a class="btn btn-primary" href="/contact.html">Demander un devis</a>
  </div>`;
}

function layout({ title, desc, path, current, noindex, jsonld, extraHead, body, skipCanonical }) {
  const robots = noindex ? "noindex, follow" : "index, follow";
  const canonical = path === "/" ? `${BASE}/` : abs(path);
  const ogImage = abs(site.SOCIAL_IMAGE || "/images/og-social.jpg");
  const graph = Array.isArray(jsonld) ? jsonld : jsonld ? [jsonld] : [];
  const canonBlock = skipCanonical
    ? ""
    : `  <link rel="canonical" href="${canonical}">
  <link rel="alternate" hreflang="fr-FR" href="${canonical}">
  <link rel="alternate" hreflang="x-default" href="${canonical}">
`;
  return `<!DOCTYPE html>
<html lang="fr-FR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="robots" content="${robots}">
${canonBlock}  <meta name="referrer" content="strict-origin-when-cross-origin">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="fr_FR">
  <meta property="og:site_name" content="Leroy du Débarras">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(desc)}">
  <meta name="twitter:image" content="${ogImage}">
  <link rel="icon" href="/images/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.bunny.net" crossorigin>
  <link rel="preload" as="style" href="https://fonts.bunny.net/css?family=source-sans-3:400,600,700|literata:500,600,700&amp;display=swap">
  <link rel="stylesheet" href="https://fonts.bunny.net/css?family=source-sans-3:400,600,700|literata:500,600,700&amp;display=swap" media="print" data-defer-css>
  <noscript><link rel="stylesheet" href="https://fonts.bunny.net/css?family=source-sans-3:400,600,700|literata:500,600,700&amp;display=swap"></noscript>
  <link rel="stylesheet" href="/css/style.min.css">
  ${extraHead || ""}
  ${
    graph.length
      ? `<script type="application/ld+json">${JSON.stringify({
          "@context": "https://schema.org",
          "@graph": graph,
        })}</script>`
      : ""
  }
</head>
<body>
  <a class="skip-link" href="#contenu">Aller au contenu</a>
  ${nav(current)}
  <main id="contenu">
    ${body}
  </main>
  ${footer()}
  <script src="/js/site-config.js" defer></script>
  <script src="/js/script.min.js" defer></script>
</body>
</html>
`;
}

const ogImageUrl = abs(site.SOCIAL_IMAGE || "/images/og-social.jpg");
const ogImage = imageObject(ogImageUrl, 1200, 630);

const businessNode = {
  "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
  "@id": abs("/#business"),
  name: site.BUSINESS_NAME || "Leroy du Débarras",
  url: abs("/"),
  description:
    "Débarras, nettoyage et évacuation à Marcillac-la-Croisille : maisons, granges, garages, tri et enlèvement des déchets.",
  image: ogImage,
  logo: {
    "@type": "ImageObject",
    "@id": abs("/#logo"),
    url: ogImageUrl,
    contentUrl: ogImageUrl,
    width: 1200,
    height: 630,
  },
  areaServed: [
    { "@type": "City", name: "Marcillac-la-Croisille" },
    { "@type": "AdministrativeArea", name: "Corrèze" },
  ],
};
if (site.YEAR_FOUNDED) {
  businessNode.foundingDate = String(site.YEAR_FOUNDED).trim();
}
if (site.OWNER_NAME) {
  businessNode.founder = { "@type": "Person", name: String(site.OWNER_NAME) };
}
if (Array.isArray(site.SAME_AS) && site.SAME_AS.length) {
  businessNode.sameAs = site.SAME_AS.filter(Boolean);
} else if (Array.isArray(site.SOCIAL_LINKS) && site.SOCIAL_LINKS.length) {
  businessNode.sameAs = site.SOCIAL_LINKS.map((l) => l && l.href).filter(Boolean);
}
if (site.PHONE) {
  const digits = String(site.PHONE).replace(/[^\d]/g, "");
  businessNode.telephone = digits.startsWith("0")
    ? "+33" + digits.slice(1)
    : digits.startsWith("33")
      ? "+" + digits
      : digits;
}
if (site.PRICE_RANGE) {
  businessNode.priceRange = String(site.PRICE_RANGE).trim();
}
if (site.GEO_LAT && site.GEO_LNG) {
  businessNode.geo = {
    "@type": "GeoCoordinates",
    latitude: Number(site.GEO_LAT),
    longitude: Number(site.GEO_LNG),
  };
}
if (site.ADDRESS || site.POSTAL_CODE || site.CITY) {
  businessNode.address = {
    "@type": "PostalAddress",
    ...(site.ADDRESS ? { streetAddress: site.ADDRESS } : {}),
    ...(site.POSTAL_CODE ? { postalCode: site.POSTAL_CODE } : {}),
    addressLocality: site.CITY || "Marcillac-la-Croisille",
    addressRegion: site.REGION || "Corrèze",
    addressCountry: "FR",
  };
}
if (businessNode.telephone || site.EMAIL) {
  businessNode.contactPoint = {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["French", "fr"],
    areaServed: "FR",
    ...(businessNode.telephone ? { telephone: businessNode.telephone } : {}),
    ...(site.EMAIL ? { email: site.EMAIL } : {}),
  };
}
if (Array.isArray(site.HOURS) && site.HOURS.length) {
  businessNode.openingHoursSpecification = site.HOURS;
} else if (typeof site.HOURS === "string" && site.HOURS.trim()) {
  businessNode.openingHours = site.HOURS.trim();
}

const websiteNode = {
  "@type": "WebSite",
  "@id": abs("/#website"),
  url: abs("/"),
  name: "Leroy du Débarras",
  description:
    "Site de Leroy du Débarras : débarras, nettoyage et évacuation à Marcillac-la-Croisille et en Corrèze.",
  publisher: { "@id": abs("/#business") },
  inLanguage: "fr-FR",
};

function serviceNode(name, url, desc, areaName) {
  const pageUrl = abs(url);
  return {
    "@type": "Service",
    "@id": `${pageUrl}#service`,
    name,
    serviceType: name,
    url: pageUrl,
    provider: { "@id": abs("/#business") },
    areaServed: areaName
      ? [
          { "@type": "City", name: areaName },
          { "@type": "AdministrativeArea", name: "Corrèze" },
        ]
      : { "@type": "AdministrativeArea", name: "Corrèze" },
    description: desc,
  };
}

function correzeLinksNote() {
  return `<p>Interventions dans tout le département de la Corrèze : <a href="/debarras-correze.html">débarras en Corrèze</a>, <a href="/debarras-brive-la-gaillarde.html">Brive-la-Gaillarde</a>, <a href="/debarras-tulle.html">Tulle</a>, <a href="/debarras-ussel.html">Ussel</a> et <a href="/debarras-egletons.html">Égletons</a>.</p>`;
}

const faqHome = [
  {
    q: "Faut-il vider toute la maison ?",
    a: "Non. Pas besoin de vider toute votre maison. Leroy du Débarras peut intervenir pour une maison entière, une grange, un hangar, un jardin, une pièce, une cave, un garage, ou seulement quelques encombrants. Chaque intervention est adaptée au volume à évacuer et à l’état des lieux.",
  },
  {
    q: "Combien coûte un débarras ?",
    a: "Le tarif dépend du volume, de l’accès, du type de biens et des prestations demandées (tri, évacuation, nettoyage). Un devis est établi après échange sur votre situation, sans grille de prix unique.",
  },
  {
    q: "Comment obtenir un devis ?",
    a: "Décrivez les lieux, les pièces concernées et l’accès via le formulaire. Des photos aident à estimer le volume. Nous revenons vers vous pour préciser l’intervention.",
  },
  {
    q: "Dans quelles communes intervenez-vous ?",
    a: "La zone principale est Marcillac-la-Croisille, en Corrèze, avec des déplacements vers les communes alentours (secteurs d’Égletons, de Tulle et d’Argentat-sur-Dordogne selon le chantier). Pour une commune plus éloignée, demandez confirmation.",
  },
];

const faqMaison = [
  {
    q: "Peut-on débarrasser seulement une pièce ?",
    a: "Oui. Un débarras peut être partiel : une chambre, un grenier, une cave ou seulement les meubles d’un séjour. L’essentiel est de décrire ce qui doit partir et ce qui reste.",
  },
  {
    q: "Que deviennent les objets débarrassés ?",
    a: "Les biens sont triés puis évacués. Selon leur état, certains peuvent être orientés vers une filière de réemploi ou de recyclage, les autres vers une évacuation adaptée. Nous n’inventons pas de partenariat : le circuit exact est précisé au devis selon le chantier.",
  },
  {
    q: "Faites-vous le nettoyage après débarras ?",
    a: "Oui, un nettoyage après débarras peut être prévu si vous le souhaitez, pour laisser les volumes plus exploitables. Il est à indiquer dès la demande de devis.",
  },
];

const faqSuccession = [
  {
    q: "Intervenez-vous après une succession ?",
    a: "Oui. Le débarras après succession se prépare avec calme : tri, enlèvement, évacuation, et nettoyage si besoin, pour préparer une vente, une location ou une transmission.",
  },
  {
    q: "Faut-il tout vider d’un coup ?",
    a: "Non. On peut avancer pièce par pièce, garder des objets de famille et n’évacuer que ce qui doit partir. L’organisation se discute avant l’intervention.",
  },
];

const faqCaves = [
  {
    q: "Peut-on vider une cave ?",
    a: "Oui. Les caves demandent souvent de tenir compte de l’accès, de l’humidité, de la poussière et des objets lourds. Décrivez l’escalier, la largeur de passage et le volume approximatif.",
  },
  {
    q: "Intervenez-vous dans un grenier ou un garage ?",
    a: "Oui. Greniers, garages et dépendances font partie des interventions courantes, y compris lorsque l’encombrement rend le passage difficile.",
  },
];

const faqExt = [
  {
    q: "Intervenez-vous pour les jardins ?",
    a: "Oui, pour le débroussaillage, la tonte, le nettoyage de gouttières, le nettoyage de terrain, l’évacuation des végétaux et des encombrants extérieurs, ainsi que la remise en ordre après un débarras.",
  },
  {
    q: "Intervenez-vous sur les arbres ?",
    a: "Oui, pour l’abattage de petits arbres et le débitage d’arbres tombés. Les limites (hauteur, accès, type d’arbre) sont confirmées au cas par cas. Aucune certification n’est affichée tant qu’elle n’est pas fournie par l’entreprise.",
  },
  {
    q: "Faites-vous le nettoyage de gouttières ?",
    a: "Oui. Le nettoyage de gouttières peut être demandé seul ou avec un débarras, un nettoyage de maison ou des travaux extérieurs. L’accès (hauteur, toit) se précise au devis.",
  },
];

const faqChantier = [
  {
    q: "Intervenez-vous après des travaux ?",
    a: "Oui. Après un chantier, Leroy du Débarras peut assurer le nettoyage de fin de chantier, le tri, le chargement et l’évacuation des matériaux, cartons, déchets et encombrants restants.",
  },
];

const faqTri = [
  {
    q: "Triez-vous les métaux et les déchets ?",
    a: "Oui. Le tri porte notamment sur les déchets, la ferraille, l’inox et le cuivre, avec séparation des matériaux et évacuation vers les filières adaptées, selon ce qui est présent sur place.",
  },
];

const pages = [];

pages.push({
  file: "index.html",
  html: layout({
    title: "Débarras, Nettoyage & Évacuation | Leroy du Débarras",
    desc: "Débarras de maisons, granges et garages : nettoyage, évacuation des déchets et enlèvement de végétaux.",
    path: "/",
    current: "/",
    extraHead: `<link rel="preload" as="image" href="/images/hero.webp" type="image/webp">`,
    jsonld: [
      businessNode,
      websiteNode,
      webPageNode({
        url: abs("/"),
        name: "Débarras, Nettoyage & Évacuation | Leroy du Débarras",
        description:
          "Débarras de maisons, granges et garages : nettoyage, évacuation des déchets et enlèvement de végétaux.",
      }),
      faqJson(faqHome, { id: abs("/#faq"), url: abs("/") }),
    ],
    body: `
    <section class="hero">
      ${pic({
        webp: "/images/hero.webp",
        jpg: "/images/hero.jpg",
        alt: "Balai et pelle, matériel de nettoyage et de débarras",
        w: 1600,
        h: 900,
        lazy: false,
        fetchpriority: "high",
      })}
      <div class="hero-overlay"></div>
      <div class="container hero-content">
        <p class="hero-kicker">Marcillac-la-Croisille · Corrèze · Secteur alentours</p>
        <h1>Débarras, nettoyage et évacuation à Marcillac-la-Croisille</h1>
        <p class="lede">Leroy du Débarras intervient pour remettre en état vos espaces, évacuer ce qui vous encombre et vous débarrasser des déchets et objets dont vous n’avez plus besoin.</p>
        <div class="actions">
          <a class="btn btn-primary" href="/contact.html">Demander un devis gratuit</a>
          <a class="btn btn-secondary" href="/services.html">Voir nos services</a>
        </div>
      </div>
    </section>
    ${socialLinks({
      id: "reseaux",
      title: "Retrouvez-nous sur nos réseaux",
      intro:
        "Page Facebook officielle de Leroy du Débarras : actualités, photos de chantiers et demande de devis en message.",
    })}
    <section>
      <div class="container prose">
        <h2 class="section-title">Une intervention adaptée à votre besoin</h2>
        <p>Pas besoin de vider toute votre maison.</p>
        <p>Leroy du Débarras peut intervenir pour :</p>
        <ul>
          <li>une maison entière ;</li>
          <li>une grange ;</li>
          <li>un hangar ;</li>
          <li>un jardin ;</li>
          <li>une pièce ;</li>
          <li>une cave ;</li>
          <li>un garage ;</li>
          <li>quelques encombrants seulement.</li>
        </ul>
        <p>Chaque intervention est adaptée au volume à évacuer et à l’état des lieux.</p>
        <p>Dans tout le département&nbsp;: <a href="/debarras-correze.html">débarras en Corrèze</a> (Brive, Tulle, Ussel et communes rurales).</p>
      </div>
    </section>
    <section>
      <div class="container">
        <h2 class="section-title">Nos services</h2>
        <p class="section-intro">Débarras de maisons et logements, nettoyage de locaux, travaux extérieurs, tri et récupération, évacuation.</p>
        <div class="cards cards-3">
          <article class="card">
            ${pic({ webp: "/images/goulotte-chantier.webp", jpg: "/images/goulotte-chantier.jpg", alt: "Goulottes de chantier sur une maison pour l’évacuation lors d’un débarras", w: 1024, h: 576 })}
            <div class="card-body"><h3>Débarras de maisons et logements</h3><p>Maison complète, appartement, grange, hangar, garage, une seule pièce, après déménagement, encombrants.</p><a class="more" href="/debarras-maison.html">Débarras de maisons</a></div>
          </article>
          <article class="card">
            ${pic({ webp: "/images/chantier-interieur.webp", jpg: "/images/chantier-interieur.jpg", alt: "Pièce fortement encombrée à nettoyer et débarrasser", w: 768, h: 1024 })}
            <div class="card-body"><h3>Débarras et nettoyage de locaux</h3><p>Grange, maison, pièces fortement encombrées, remise en ordre et fin de chantier.</p><a class="more" href="/nettoyage-fin-chantier.html">Nettoyage et chantier</a></div>
          </article>
          <article class="card">
            ${pic({ webp: "/images/brouette.webp", jpg: "/images/brouette.jpg", alt: "Brouette de chantier pour le débarras après travaux", w: 1024, h: 682 })}
            <div class="card-body"><h3>Débarras après chantier</h3><p>Matériaux, cartons, déchets et encombrants restants : nettoyage, tri, chargement et évacuation.</p><a class="more" href="/nettoyage-fin-chantier.html">Fin de chantier</a></div>
          </article>
          <article class="card">
            ${pic({ webp: "/images/outils-nettoyage.webp", jpg: "/images/outils-nettoyage.jpg", alt: "Balai et pelle pour le nettoyage, dont les gouttières", w: 1024, h: 682 })}
            <div class="card-body"><h3>Travaux extérieurs</h3><p>Débroussaillage, tonte, gouttières, végétaux, petits arbres, terrains et jardins.</p><a class="more" href="/nettoyage-exterieur.html">Travaux extérieurs</a></div>
          </article>
          <article class="card">
            ${pic({ webp: "/images/encombrants.webp", jpg: "/images/encombrants.jpg", alt: "Encombrants et objets à trier et récupérer", w: 1024, h: 682 })}
            <div class="card-body"><h3>Tri et récupération</h3><p>Déchets, ferraille, inox, cuivre : séparation des matériaux et filières adaptées.</p><a class="more" href="/tri-et-recuperation.html">Tri et récupération</a></div>
          </article>
          <article class="card">
            ${pic({ webp: "/images/chantier-exterieur.webp", jpg: "/images/chantier-exterieur.jpg", alt: "Remorque chargée pour l’évacuation des déchets verts", w: 1024, h: 768 })}
            <div class="card-body"><h3>Évacuation</h3><p>Chargement, transport, remorquage, déchetterie, déchets verts, ferraille.</p><a class="more" href="/evacuation.html">Évacuation</a></div>
          </article>
        </div>
      </div>
    </section>
    <section>
      <div class="container">
        <h2 class="section-title">Pourquoi nous contacter</h2>
        <ul class="trust">
          <li><strong>Intervention locale</strong> Entreprise basée sur le secteur de Marcillac-la-Croisille, habituée aux maisons de Corrèze.</li>
          <li><strong>Devis personnalisé</strong> Chaque chantier est évalué selon le volume et l’accès, sans prix affiché au hasard.</li>
          <li><strong>Contact direct</strong> Une demande claire, un retour humain. Pas de parcours en ligne opaque.</li>
          <li><strong>Volume adapté</strong> Maison entière, grange, hangar, jardin, pièce, cave, garage ou quelques encombrants seulement.</li>
          <li><strong>Respect des lieux</strong> On n’emporte pas « à la va-vite » : ce qui doit rester est préservé.</li>
          <li><strong>Tri et évacuation</strong> Ferraille, inox, cuivre, déchets verts : les filières suivent ce qui est sur place.</li>
        </ul>
      </div>
    </section>
    <section>
      <div class="container">
        <h2 class="section-title">Chantiers réalisés</h2>
        <p class="section-intro">Photos de chantiers Leroy du Débarras, autour de Marcillac-la-Croisille.</p>
        <h3 class="subsection-title">Avant / après — massif et abords</h3>
        ${beforeAfter(jardinAvantApres)}
        <div class="cards cards-3">
          <article class="card">
            ${pic({ webp: "/images/chantier-interieur.webp", jpg: "/images/chantier-interieur.jpg", alt: "Dépendance encombrée : débarras et nettoyage", w: 768, h: 1024 })}
            <div class="card-body"><h3>Débarras</h3><p>Cave, grange ou dépendance : tri et évacuation des encombrants.</p></div>
          </article>
          <article class="card">
            ${pic({ webp: "/images/chantier-exterieur.webp", jpg: "/images/chantier-exterieur.jpg", alt: "Travaux extérieurs : branches, végétaux et évacuation", w: 1024, h: 768 })}
            <div class="card-body"><h3>Travaux extérieurs</h3><p>Ramassage et évacuation des végétaux.</p></div>
          </article>
          <article class="card">
            ${pic({ webp: "/images/chantier-arbre.webp", jpg: "/images/chantier-arbre.jpg", alt: "Jardin et arbres, remise en état des abords", w: 768, h: 952 })}
            <div class="card-body"><h3>Jardins et abords</h3><p>Entretien des parcelles et des arbres, selon le chantier.</p></div>
          </article>
        </div>
      </div>
    </section>
    ${faqBlock(faqHome)}
    ${ctaBand("Besoin de faire de la place ?", "Vendre un bien, vider une maison, nettoyer une grange, remettre un jardin en état ou évacuer des encombrants : contactez Leroy du Débarras pour discuter de votre besoin.")}
    `,
  }),
});

function pageShell({ file, title, desc, path, h1, lede, crumbs, faq, jsonldExtra, bodyInner, extraHead }) {
  const items = crumbs;
  const pageUrl = path === "/" ? `${BASE}/` : abs(path);
  const breadcrumb = breadcrumbJson(items, pageUrl);
  const jsonld = [
    businessNode,
    websiteNode,
    breadcrumb,
    webPageNode({
      url: pageUrl,
      name: title,
      description: desc,
      breadcrumbId: breadcrumb["@id"],
    }),
  ];
  if (faq && faq.length) {
    jsonld.push(faqJson(faq, { id: `${pageUrl}#faq`, url: pageUrl }));
  }
  if (jsonldExtra) jsonld.push(...(Array.isArray(jsonldExtra) ? jsonldExtra : [jsonldExtra]));
  // FAQ HTML visible + FAQPage JSON-LD aligné (éligibilité rich results selon politiques Google).
  const isCorreze =
    path === "/debarras-correze.html" ||
    path === "/zones-intervention.html" ||
    /^\/debarras-(?!maison|appartement|succession)/.test(path);
  const currentNav = [
    "/services.html",
    "/zones-intervention.html",
    "/debarras-correze.html",
    "/a-propos.html",
    "/contact.html",
  ].includes(path)
    ? path
    : isCorreze
      ? "/debarras-correze.html"
      : path === "/services.html" ||
          [
            "/debarras-maison.html",
            "/debarras-appartement.html",
            "/debarras-succession.html",
            "/caves-greniers-garages.html",
            "/nettoyage-exterieur.html",
            "/nettoyage-fin-chantier.html",
            "/tri-et-recuperation.html",
            "/evacuation.html",
          ].includes(path)
        ? "/services.html"
        : "/services.html";
  pages.push({
    file,
    html: layout({
      title,
      desc,
      path,
      current: currentNav,
      extraHead,
      jsonld,
      body: `
      <header class="page-hero">
        <div class="container">
          ${breadcrumbs(items)}
          <h1>${esc(h1)}</h1>
          <p class="lede">${lede}</p>
        </div>
      </header>
      ${bodyInner}
      ${faq ? faqBlock(faq) : ""}
      ${ctaBand("Besoin de faire de la place ?", "Que ce soit pour vendre un bien, vider une maison, nettoyer une grange, remettre un jardin en état ou simplement évacuer des encombrants, contactez Leroy du Débarras pour discuter de votre besoin.")}
      `,
    }),
  });
}

pageShell({
  file: "services.html",
  title: "Prestations de débarras, nettoyage et évacuation | Leroy du Débarras",
  desc: "Débarras de maisons et logements, nettoyage de locaux, travaux extérieurs, tri, récupération et évacuation à Marcillac-la-Croisille et en Corrèze.",
  path: "/services.html",
  h1: "Nos services",
  lede: "Leroy du Débarras intervient pour remettre en état vos espaces, évacuer ce qui vous encombre et vous débarrasser des déchets et objets dont vous n’avez plus besoin.",
  crumbs: [
    { href: "/", label: "Accueil" },
    { href: "/services.html", label: "Services" },
  ],
  bodyInner: `
  <section class="prose">
    <div class="container">
      <h2>Débarras de maisons et logements</h2>
      <ul>
        <li>Débarras complet de maison</li>
        <li>Débarras d’appartement</li>
        <li>Débarras de grange</li>
        <li>Débarras de hangar</li>
        <li>Débarras de garage</li>
        <li>Débarras d’une seule pièce</li>
        <li>Débarras après déménagement</li>
        <li>Évacuation d’encombrants</li>
      </ul>
      <p><a href="/debarras-maison.html">Maisons</a> · <a href="/debarras-appartement.html">Appartements</a> · <a href="/caves-greniers-garages.html">Grange, hangar, garage, cave</a> · <a href="/debarras-succession.html">Après succession</a></p>
      <h2>Débarras et nettoyage de locaux</h2>
      <ul>
        <li>Nettoyage de grange</li>
        <li>Nettoyage de maison</li>
        <li>Nettoyage de pièces fortement encombrées</li>
        <li>Nettoyage après chantier</li>
        <li>Nettoyage et remise en ordre des lieux</li>
        <li>Nettoyage de gouttières</li>
        <li>Évacuation des matériaux et déchets laissés en fin de chantier</li>
      </ul>
      <p><a href="/nettoyage-fin-chantier.html">Nettoyage et fin de chantier</a></p>
      <h2>Travaux extérieurs</h2>
      <ul>
        <li>Débroussaillage</li>
        <li>Tonte</li>
        <li>Nettoyage de gouttières</li>
        <li>Enlèvement de végétaux</li>
        <li>Évacuation des déchets verts</li>
        <li>Abattage de petits arbres</li>
        <li>Débitage d’arbres tombés</li>
        <li>Nettoyage de terrains et jardins</li>
      </ul>
      <p><a href="/nettoyage-exterieur.html">Travaux extérieurs</a></p>
      <h2>Tri et récupération</h2>
      <ul>
        <li>Tri des déchets</li>
        <li>Tri de la ferraille</li>
        <li>Tri de l’inox</li>
        <li>Tri du cuivre</li>
        <li>Séparation des différents matériaux</li>
        <li>Évacuation des déchets vers les filières adaptées</li>
      </ul>
      <p><a href="/tri-et-recuperation.html">Tri et récupération</a></p>
      <h2>Évacuation</h2>
      <ul>
        <li>Chargement</li>
        <li>Transport</li>
        <li>Remorquage</li>
        <li>Évacuation vers la déchetterie</li>
        <li>Évacuation des déchets verts</li>
        <li>Évacuation de ferraille et matériaux</li>
      </ul>
      <p><a href="/evacuation.html">Évacuation</a></p>
      <p>Pour le département entier : <a href="/debarras-correze.html">débarras en Corrèze</a>. Pour le secteur opérationnel autour de la base : <a href="/zones-intervention.html">zones d’intervention</a>.</p>
    </div>
  </section>`,
});

pageShell({
  file: "debarras-maison.html",
  title: "Débarras de maison à Marcillac-la-Croisille | Leroy du Débarras",
  desc: "Débarras de maison à Marcillac-la-Croisille : vide complet ou partiel, meubles, cave, grenier, garage, tri et évacuation. Devis gratuit.",
  path: "/debarras-maison.html",
  h1: "Débarras de maison à Marcillac-la-Croisille",
  lede: "Vider une maison en Corrèze, ce n’est pas seulement « tout jeter ». Il s’agit de trier, d’évacuer ce qui doit partir, et de laisser les pièces utilisables.",
  crumbs: [
    { href: "/", label: "Accueil" },
    { href: "/services.html", label: "Services" },
    { href: "/debarras-maison.html", label: "Débarras de maison" },
  ],
  faq: faqMaison,
  jsonldExtra: serviceNode(
    "Débarras de maison à Marcillac-la-Croisille",
    "/debarras-maison.html",
    "Débarras complet ou partiel de maisons, tri et évacuation.",
  ),
  bodyInner: `
  <section>
    <div class="container split">
      <div class="prose">
        <h2>Maison complète, une pièce, ou seulement des encombrants</h2>
        <p>Pas besoin de vider toute votre maison. Leroy du Débarras peut intervenir pour une maison entière, une grange, un hangar, un garage, une seule pièce, un débarras après déménagement, ou l’évacuation de quelques encombrants. Chaque intervention est adaptée au volume à évacuer et à l’état des lieux.</p>
        <h3>Débarras de maisons et logements</h3>
        <ul>
          <li>Débarras complet de maison</li>
          <li>Débarras d’appartement</li>
          <li>Débarras de grange</li>
          <li>Débarras de hangar</li>
          <li>Débarras de garage</li>
          <li>Débarras d’une seule pièce</li>
          <li>Débarras après déménagement</li>
          <li>Évacuation d’encombrants</li>
        </ul>
        <p>Les accès difficiles (escalier étroit, cour, chemin) se précisent dès le devis, car ils changent le temps de travail.</p>
        <p>Le <a href="/debarras-appartement.html">débarras d’appartement</a> suit la même logique, avec des contraintes d’immeuble. Grange, hangar, garage et cave : <a href="/caves-greniers-garages.html">page dépendances</a>. Pour une situation successorale, voir le <a href="/debarras-succession.html">débarras après succession</a>.</p>
      </div>
      ${pic({ webp: "/images/goulotte-chantier.webp", jpg: "/images/goulotte-chantier.jpg", alt: "Goulottes de chantier sur une maison pour l’évacuation lors d’un débarras", w: 1024, h: 576 })}
    </div>
  </section>
  <section>
    <div class="container prose">
      <h2>Tri, évacuation et nettoyage</h2>
      <p>Le tri permet de séparer ce qui peut encore servir de ce qui doit être évacué. L’évacuation sort les volumes du logement. Un nettoyage après débarras peut être ajouté pour faciliter une visite, une vente ou une remise en location.</p>
      <p>Les <a href="/caves-greniers-garages.html">caves, greniers et garages</a> sont souvent les pièces les plus longues : poussière, objets lourds, passage réduit.</p>
      ${correzeLinksNote()}
    </div>
  </section>`,
});

pageShell({
  file: "debarras-appartement.html",
  title: "Débarras d’appartement en Corrèze | Leroy du Débarras",
  desc: "Débarras d’appartement en Corrèze : tri, enlèvement des meubles et évacuation, y compris caves d’immeuble. Devis à Marcillac-la-Croisille et alentours.",
  path: "/debarras-appartement.html",
  h1: "Débarras d’appartement",
  lede: "Un appartement se vide avec les mêmes exigences de soin, et des contraintes propres : étages, parties communes, stationnement, cave de résidence.",
  crumbs: [
    { href: "/", label: "Accueil" },
    { href: "/services.html", label: "Services" },
    { href: "/debarras-appartement.html", label: "Débarras d’appartement" },
  ],
  jsonldExtra: serviceNode(
    "Débarras d’appartement",
    "/debarras-appartement.html",
    "Vide d’appartement, tri et évacuation en Corrèze.",
  ),
  bodyInner: `
  <section>
    <div class="container split">
      <div class="prose">
        <h2>Volumes plus petits, accès parfois plus longs</h2>
        <p>Un T2 n’a pas le cube d’une maison, mais un 4e étage sans ascenseur ou une cave en fond de bâtiment change le chantier. Indiquez l’étage, l’ascenseur, le stationnement et si une cave ou un grenier d’immeuble est à vider.</p>
        <p>Le travail reste un <a href="/debarras-maison.html">débarras</a> : meubles, électroménager, cartons, puis évacuation. Le <a href="/nettoyage-exterieur.html">nettoyage</a> concerne rarement un jardin d’appartement, sauf loggia, cave ou abords.</p>
        ${correzeLinksNote()}
      </div>
      ${pic({ webp: "/images/chantier-interieur.webp", jpg: "/images/chantier-interieur.jpg", alt: "Volume encombré à vider dans un logement", w: 768, h: 1024 })}
    </div>
  </section>`,
});

pageShell({
  file: "debarras-succession.html",
  title: "Débarras après succession en Corrèze | Leroy du Débarras",
  desc: "Débarras de maison après succession en Corrèze : tri, enlèvement, évacuation et nettoyage pour préparer une vente ou une location. Ton calme, devis clair.",
  path: "/debarras-succession.html",
  h1: "Débarras de maison après succession",
  lede: "Vider le logement d’un proche demande de l’organisation, pas de précipitation. On avance avec ce que la famille souhaite garder, et ce qui doit partir.",
  crumbs: [
    { href: "/", label: "Accueil" },
    { href: "/services.html", label: "Services" },
    { href: "/debarras-succession.html", label: "Débarras après succession" },
  ],
  faq: faqSuccession,
  jsonldExtra: serviceNode(
    "Débarras après succession",
    "/debarras-succession.html",
    "Débarras de logement après succession en Corrèze.",
  ),
  bodyInner: `
  <section>
    <div class="container split">
      <div class="prose">
        <h2>Organisation et respect des lieux</h2>
        <p>Une succession n’est pas un chantier comme un autre. Les objets ont une histoire. Le rôle de l’entreprise est pratique : aider à trier, enlever, évacuer, puis nettoyer si vous le demandez, pour que le logement puisse être vendu, loué ou simplement fermé sereinement.</p>
        <h3>Ce que l’on peut prévoir ensemble</h3>
        <ul>
          <li>Un tri pièce par pièce</li>
          <li>L’enlèvement des meubles et encombrants</li>
          <li>L’évacuation hors du logement</li>
          <li>Un nettoyage après débarras</li>
          <li>La préparation du bien avant visites</li>
        </ul>
        <p>Aucun tarif n’est affiché ici : le volume et l’état du logement varient trop. Le devis suit la visite des lieux ou un échange détaillé, photos à l’appui.</p>
        <p>Les maisons de Corrèze ont souvent cave et grenier : voir aussi <a href="/caves-greniers-garages.html">caves, greniers et garages</a>.</p>
      </div>
      ${pic({ webp: "/images/chantier-exterieur.webp", jpg: "/images/chantier-exterieur.jpg", alt: "Chantier autour d’une maison, évacuation des végétaux", w: 1024, h: 768 })}
    </div>
  </section>`,
});

pageShell({
  file: "caves-greniers-garages.html",
  title: "Débarras de cave, grenier et garage en Corrèze | Leroy du Débarras",
  desc: "Vider une cave, un grenier ou un garage à Marcillac-la-Croisille : accès, volume, objets lourds et encombrement. Devis Leroy du Débarras.",
  path: "/caves-greniers-garages.html",
  h1: "Caves, granges, hangars et garages",
  lede: "Ces volumes se remplissent pendant des années. Les vider demande du temps, de la méthode, et une lecture honnête de l’accès.",
  crumbs: [
    { href: "/", label: "Accueil" },
    { href: "/services.html", label: "Services" },
    { href: "/caves-greniers-garages.html", label: "Caves, greniers, garages" },
  ],
  faq: faqCaves,
  jsonldExtra: serviceNode(
    "Débarras de caves, greniers et garages",
    "/caves-greniers-garages.html",
    "Évacuation d’encombrants en cave, grenier, garage et dépendance.",
  ),
  bodyInner: `
  <section class="prose">
    <div class="container">
      <h2>Grange et hangar</h2>
      <p>Une grange ou un hangar se traite comme un volume à part : objets lourds, ferraille, bois, restes de matériel agricole. Le <a href="/tri-et-recuperation.html">tri</a> (ferraille, inox, cuivre) et l’<a href="/evacuation.html">évacuation</a> font souvent l’essentiel du chantier. Un <a href="/nettoyage-fin-chantier.html">nettoyage de grange</a> peut suivre.</p>
      <h2>Cave</h2>
      <p>Humidité, faible hauteur, escalier raide, objets oubliés : une cave se vide rarement « en cinq minutes ». Signalez la largeur des marches, la présence d’électricité et le type de sol. L’évacuation se fait souvent par seaux, cartons ou charges fractionnées.</p>
      ${pic({ webp: "/images/chantier-interieur.webp", jpg: "/images/chantier-interieur.jpg", alt: "Cave ou dépendance encombrée à débarrasser", w: 768, h: 1024 })}
      <h2>Grenier</h2>
      <p>Poussière, isolation, trappe étroite, cartons anciens : le grenier demande de la prudence pour ne pas détériorer le logement en descendant les charges. Un <a href="/debarras-maison.html">débarras de maison</a> inclut souvent cet étage.</p>
      ${pic({ webp: "/images/chantier-interieur.webp", jpg: "/images/chantier-interieur.jpg", alt: "Objets entreposés dans une dépendance", w: 768, h: 1024 })}
      <h2>Garage</h2>
      <p>Outils, pneus, bois, vélos, restes de bricolage : le garage concentre le lourd et le volumineux. Une dépendance isolée se traite parfois avec du <a href="/nettoyage-exterieur.html">nettoyage de terrain</a> autour.</p>
      ${pic({ webp: "/images/chantier-exterieur.webp", jpg: "/images/chantier-exterieur.jpg", alt: "Accès à une propriété, chantier d’évacuation", w: 1024, h: 768 })}
      <h3>Contraintes à préciser au devis</h3>
      <ul>
        <li>Accès (largeur, étage, distance au stationnement)</li>
        <li>Volume approximatif</li>
        <li>Objets lourds</li>
        <li>Poussière et état des lieux</li>
        <li>Encombrement (passage libre ou non)</li>
      </ul>
    </div>
  </section>`,
});

pageShell({
  file: "nettoyage-exterieur.html",
  title: "Nettoyage extérieur et débroussaillage à Marcillac-la-Croisille | Leroy du Débarras",
  desc: "Nettoyage extérieur, débroussaillage, nettoyage de gouttières et remise en état de terrain à Marcillac-la-Croisille. Devis Leroy du Débarras.",
  path: "/nettoyage-exterieur.html",
  h1: "Nettoyage extérieur et remise en état",
  lede: "Après un débarras, ou simplement lorsque le terrain a repris le dessus : débroussailler, nettoyer les gouttières, ramasser, évacuer, rendre le terrain lisible.",
  crumbs: [
    { href: "/", label: "Accueil" },
    { href: "/services.html", label: "Services" },
    { href: "/nettoyage-exterieur.html", label: "Nettoyage extérieur" },
  ],
  faq: faqExt,
  jsonldExtra: serviceNode(
    "Nettoyage extérieur et débroussaillage",
    "/nettoyage-exterieur.html",
    "Débroussaillage, nettoyage de gouttières, nettoyage de terrain et évacuation des végétaux.",
  ),
  bodyInner: `
  <section>
    <div class="container split">
      <div class="prose">
        <h2>Débroussaillage, tonte et terrain</h2>
        <p>Autour de Marcillac-la-Croisille, les parcelles se ferment vite. Leroy du Débarras intervient pour remettre jardins et terrains en état, nettoyer les gouttières, puis évacuer les déchets verts.</p>
        <h3>Travaux extérieurs</h3>
        <ul>
          <li>Débroussaillage</li>
          <li>Tonte</li>
          <li>Nettoyage de gouttières</li>
          <li>Enlèvement de végétaux</li>
          <li>Évacuation des déchets verts</li>
          <li>Abattage de petits arbres</li>
          <li>Débitage d’arbres tombés</li>
          <li>Nettoyage de terrains et jardins</li>
        </ul>
        <p>L’abattage de petits arbres et le débitage d’arbres tombés se confirment au cas par cas (accès, hauteur). Ce n’est pas un service de paysagisme ornemental : l’objectif est la remise en état utile du terrain.</p>
        <div class="placeholder-box">
          <p><strong>À renseigner avant production</strong> (ne pas inventer) : certifications éventuelles, assurances, matériel spécifique, interventions en hauteur. Tant que ces éléments ne sont pas fournis par l’entreprise, ils ne sont pas affichés comme des preuves.</p>
        </div>
      </div>
      ${pic({ webp: "/images/outils-nettoyage.webp", jpg: "/images/outils-nettoyage.jpg", alt: "Balai et pelle, nettoyage de gouttières et travaux extérieurs", w: 1024, h: 682 })}
    </div>
  </section>
  <section>
    <div class="container">
      <h2 class="section-title">Avant / après</h2>
      <p class="section-intro">Débroussaillage et remise en état d’un massif : enlèvement des mauvaises herbes, paillage et finition des abords.</p>
      ${beforeAfter(jardinAvantApres)}
    </div>
  </section>
  <section>
    <div class="container split">
      ${pic({ webp: "/images/chantier-arbre.webp", jpg: "/images/chantier-arbre.jpg", alt: "Jardin et arbres, abords à entretenir", w: 768, h: 952 })}
      <div class="prose">
        <h2>Après un vide-maison</h2>
        <p>Une maison vidée laisse parfois un jardin à l’abandon, du bois, des restes de mobilier dehors. On peut enchaîner débarras intérieur et nettoyage extérieur, pour que le bien soit présentable.</p>
        <p>Les communes concernées sont listées sur les pages <a href="/debarras-correze.html">débarras en Corrèze</a> et <a href="/zones-intervention.html">zones d’intervention</a>.</p>
      </div>
    </div>
  </section>`,
});

pageShell({
  file: "nettoyage-fin-chantier.html",
  title: "Nettoyage après chantier en Corrèze | Leroy du Débarras",
  desc: "Nettoyage de fin de chantier, tri, chargement et évacuation des matériaux et déchets à Marcillac-la-Croisille. Devis Leroy du Débarras.",
  path: "/nettoyage-fin-chantier.html",
  h1: "Débarras après chantier",
  lede: "Vous venez de terminer des travaux et il reste des matériaux, cartons, déchets ou encombrants ? Leroy du Débarras peut intervenir pour effectuer le nettoyage de fin de chantier, le tri, le chargement et l’évacuation.",
  crumbs: [
    { href: "/", label: "Accueil" },
    { href: "/services.html", label: "Services" },
    { href: "/nettoyage-fin-chantier.html", label: "Fin de chantier" },
  ],
  faq: faqChantier,
  jsonldExtra: serviceNode(
    "Nettoyage après chantier",
    "/nettoyage-fin-chantier.html",
    "Nettoyage de fin de chantier, tri, chargement et évacuation des déchets.",
  ),
  bodyInner: `
  <section>
    <div class="container split">
      <div class="prose">
        <h2>Débarras et nettoyage de locaux</h2>
        <ul>
          <li>Nettoyage de grange</li>
          <li>Nettoyage de maison</li>
          <li>Nettoyage de pièces fortement encombrées</li>
          <li>Nettoyage après chantier</li>
          <li>Nettoyage et remise en ordre des lieux</li>
          <li>Nettoyage de gouttières</li>
          <li>Évacuation des matériaux et déchets laissés en fin de chantier</li>
        </ul>
        <p>Le chantier intérieur (débarras) et le <a href="/tri-et-recuperation.html">tri</a> se combinent souvent avec l’<a href="/evacuation.html">évacuation</a> vers la déchetterie ou les filières adaptées.</p>
      </div>
      ${pic({ webp: "/images/chantier-interieur.webp", jpg: "/images/chantier-interieur.jpg", alt: "Locaux encombrés à nettoyer après débarras ou chantier", w: 768, h: 1024 })}
    </div>
  </section>`,
});

pageShell({
  file: "tri-et-recuperation.html",
  title: "Tri et récupération | Leroy du Débarras en Corrèze",
  desc: "Tri des déchets, ferraille, inox et cuivre, séparation des matériaux et évacuation vers les filières adaptées. Leroy du Débarras, Marcillac-la-Croisille.",
  path: "/tri-et-recuperation.html",
  h1: "Tri et récupération",
  lede: "Séparer les matériaux sur place, c’est alléger l’évacuation et diriger chaque flux vers une filière adaptée, selon ce qui est réellement présent.",
  crumbs: [
    { href: "/", label: "Accueil" },
    { href: "/services.html", label: "Services" },
    { href: "/tri-et-recuperation.html", label: "Tri et récupération" },
  ],
  faq: faqTri,
  jsonldExtra: serviceNode(
    "Tri et récupération",
    "/tri-et-recuperation.html",
    "Tri des déchets, ferraille, inox, cuivre et évacuation vers les filières adaptées.",
  ),
  bodyInner: `
  <section>
    <div class="container split">
      <div class="prose">
        <h2>Ce qui est trié</h2>
        <ul>
          <li>Tri des déchets</li>
          <li>Tri de la ferraille</li>
          <li>Tri de l’inox</li>
          <li>Tri du cuivre</li>
          <li>Séparation des différents matériaux</li>
          <li>Évacuation des déchets vers les filières adaptées</li>
        </ul>
        <p>Aucun partenariat inventé : le circuit exact se précise au devis selon le chantier. Voir aussi l’<a href="/evacuation.html">évacuation</a> et le <a href="/debarras-maison.html">débarras de maisons</a>.</p>
      </div>
      ${pic({ webp: "/images/encombrants.webp", jpg: "/images/encombrants.jpg", alt: "Encombrants et objets à trier et récupérer", w: 1024, h: 682 })}
    </div>
  </section>`,
});

pageShell({
  file: "evacuation.html",
  title: "Évacuation, chargement et transport | Leroy du Débarras",
  desc: "Chargement, transport, remorquage, évacuation vers la déchetterie, déchets verts, ferraille et matériaux. Leroy du Débarras en Corrèze.",
  path: "/evacuation.html",
  h1: "Évacuation",
  lede: "Une fois le tri fait, il reste à charger, transporter et évacuer. Le volume et l’accès déterminent l’organisation du chantier.",
  crumbs: [
    { href: "/", label: "Accueil" },
    { href: "/services.html", label: "Services" },
    { href: "/evacuation.html", label: "Évacuation" },
  ],
  jsonldExtra: serviceNode(
    "Évacuation et transport",
    "/evacuation.html",
    "Chargement, transport, remorquage et évacuation vers la déchetterie.",
  ),
  bodyInner: `
  <section>
    <div class="container split">
      <div class="prose">
        <h2>Chargement et transport</h2>
        <ul>
          <li>Chargement</li>
          <li>Transport</li>
          <li>Remorquage</li>
          <li>Évacuation vers la déchetterie</li>
          <li>Évacuation des déchets verts</li>
          <li>Évacuation de ferraille et matériaux</li>
        </ul>
        <p>Utile après un <a href="/debarras-maison.html">débarras</a>, un <a href="/nettoyage-fin-chantier.html">chantier</a> ou des <a href="/nettoyage-exterieur.html">travaux extérieurs</a>.</p>
      </div>
      ${pic({ webp: "/images/chantier-exterieur.webp", jpg: "/images/chantier-exterieur.jpg", alt: "Chargement et évacuation des déchets verts", w: 1024, h: 768 })}
    </div>
  </section>`,
});

pageShell({
  file: "zones-intervention.html",
  title: "Zones d’intervention en Corrèze | Leroy du Débarras",
  desc: "Débarras et nettoyage autour de Marcillac-la-Croisille : secteurs d’Égletons, de Tulle et d’Argentat-sur-Dordogne. Demandez confirmation pour une commune plus loin.",
  path: "/zones-intervention.html",
  h1: "Zones d’intervention",
  lede: "La zone principale est Marcillac-la-Croisille. Pour une vue d’ensemble du département (277 communes), voir la page <a href=\"/debarras-correze.html\">débarras en Corrèze</a>. Les déplacements vers les communes alentours se discutent selon le chantier.",
  crumbs: [
    { href: "/", label: "Accueil" },
    { href: "/zones-intervention.html", label: "Zones d’intervention" },
  ],
  bodyInner: `
  <section>
    <div class="container">
      <div class="zones-block">
        <h2 class="section-title">Marcillac-la-Croisille</h2>
        <p>Commune d’attache du site et point de départ des interventions. Les villages immédiatement voisins sont traités en priorité.</p>
        <p class="communes-text">Marcillac-la-Croisille, Champagnac-la-Noaille, Saint-Pardoux-la-Croisille, Lafage-sur-Sombre, Clergoux, Saint-Priest-de-Gimel, Gimel-les-Cascades</p>
      </div>
      <div class="zones-block">
        <h2 class="section-title">Secteur d’Égletons</h2>
        <p>Communes du plateau et de la haute Corrèze, à courte distance au nord-est.</p>
        <p class="communes-text">Égletons, Rosiers-d’Égletons, Eyrein, Moustier-Ventadour, Sarran, Corrèze, Chaumeil, Saint-Yrieix-le-Déjalat</p>
      </div>
      <div class="zones-block">
        <h2 class="section-title">Secteur de Tulle</h2>
        <p>Vers l’ouest : bassins de vie de Tulle et communes de la vallée de la Corrèze.</p>
        <p class="communes-text">Tulle, Laguenne-sur-Avalouze, Sainte-Fortunade, Naves, Chameyrat</p>
      </div>
      <div class="zones-block">
        <h2 class="section-title">Secteur d’Argentat-sur-Dordogne</h2>
        <p>Vers le sud : Dordogne corrézienne, lorsque le déplacement reste cohérent avec le volume du chantier.</p>
        <p class="communes-text">Argentat-sur-Dordogne, Saint-Privat, Servières-le-Château, Saint-Martin-la-Méanne</p>
      </div>
      <p>Une commune plus éloignée n’est pas refusée par principe : <a href="/contact.html">demandez confirmation</a> en indiquant le lieu et le type de prestation. Voir aussi <a href="/debarras-correze.html">toutes les communes de Corrèze</a> regroupées par secteur.</p>
      ${pic({ webp: "/images/chantier-arbre.webp", jpg: "/images/chantier-arbre.jpg", alt: "Abords et jardin dans le secteur de Marcillac-la-Croisille", w: 768, h: 952 })}
    </div>
  </section>`,
});

pageShell({
  file: "a-propos.html",
  title: "À propos de Leroy du Débarras | Entreprise locale en Corrèze",
  desc: "Leroy du Débarras, entreprise locale à Marcillac-la-Croisille : débarras, nettoyage, tri et évacuation, avec un contact simple et un travail soigné.",
  path: "/a-propos.html",
  h1: "Une entreprise locale à votre service",
  lede: "Leroy du Débarras est dirigée par Cory Leroy, à Marcillac-la-Croisille. Entreprise créée en 2026. Expérience : 5 ans.",
  crumbs: [
    { href: "/", label: "Accueil" },
    { href: "/a-propos.html", label: "À propos" },
  ],
  bodyInner: `
  <section>
    <div class="container split">
      <div class="prose">
        <h2>Travailler ici, avec les maisons d’ici</h2>
        <p>Leroy du Débarras est dirigée par Cory Leroy. L’entreprise a été créée en 2026. Cory Leroy a 5 ans d’expérience dans le métier.</p>
        <p>Nous intervenons pour remettre en état vos espaces, évacuer ce qui vous encombre et vous débarrasser des déchets et objets dont vous n’avez plus besoin. L’idée est simple : un interlocuteur, un devis clair, un chantier adapté au volume réel.</p>
        <h3>Ce que vous pouvez attendre</h3>
        <ul>
          <li>Proximité et connaissance du secteur</li>
          <li>Disponibilité pour expliquer le besoin sans jargon</li>
          <li>Travail soigné et respect des biens qui restent</li>
          <li>Simplicité : pas de parcours commercial inutile</li>
          <li>Transparence sur ce qui est possible ou non sur place</li>
        </ul>
        <div class="placeholder-box">
          <p><strong>À compléter encore</strong></p>
          <ul>
            <li>Assurances : <span data-site="INSURANCE">À renseigner</span></li>
            <li>Certifications : <span data-site="CERTIFICATIONS">À renseigner</span></li>
          </ul>
        </div>
      </div>
      ${pic({ webp: "/images/chantier-exterieur.webp", jpg: "/images/chantier-exterieur.jpg", alt: "Chantier Leroy du Débarras autour d’une maison", w: 1024, h: 768 })}
    </div>
  </section>`,
});

const contactForm = `
<form class="form" id="devis-form" novalidate>
  <input type="hidden" name="startedAt" value="">
  <p class="hp" aria-hidden="true"><label>Ne pas remplir <input type="text" name="website" tabindex="-1" autocomplete="off"></label></p>
  <div class="form-row form-row-2">
    <div>
      <label for="name">Nom</label>
      <input id="name" name="name" autocomplete="name" required>
      <p class="field-error" id="err-name" role="status"></p>
    </div>
    <div>
      <label for="phone">Téléphone</label>
      <input id="phone" name="phone" type="tel" autocomplete="tel" required>
      <p class="field-error" id="err-phone" role="status"></p>
    </div>
  </div>
  <div class="form-row form-row-2">
    <div>
      <label for="email">E-mail</label>
      <input id="email" name="email" type="email" autocomplete="email" required>
      <p class="field-error" id="err-email" role="status"></p>
    </div>
    <div>
      <label for="commune">Commune</label>
      <input id="commune" name="commune" required>
      <p class="field-error" id="err-commune" role="status"></p>
    </div>
  </div>
  <div class="form-row form-row-2">
    <div>
      <label for="service">Type de prestation</label>
      <select id="service" name="service">
        <option value="debarras-maison">Débarras de maison / logement</option>
        <option value="appartement">Débarras d’appartement</option>
        <option value="grange">Grange / hangar / garage</option>
        <option value="piece">Une pièce / encombrants</option>
        <option value="chantier">Nettoyage après chantier</option>
        <option value="exterieur">Travaux extérieurs</option>
        <option value="gouttieres">Nettoyage de gouttières</option>
        <option value="tri">Tri et récupération</option>
        <option value="evacuation">Évacuation</option>
        <option value="succession">Après succession</option>
        <option value="autre">Autre / plusieurs</option>
      </select>
    </div>
    <div>
      <label for="housing">Type de logement</label>
      <select id="housing" name="housing">
        <option value="maison">Maison</option>
        <option value="appartement">Appartement</option>
        <option value="dependance">Grange / hangar / garage</option>
        <option value="piece">Une pièce / cave</option>
        <option value="terrain">Terrain / extérieur</option>
        <option value="autre">Autre</option>
      </select>
    </div>
  </div>
  <div class="form-row form-row-2">
    <div>
      <label for="volume">Volume approximatif</label>
      <select id="volume" name="volume">
        <option value="piece">Une pièce</option>
        <option value="plusieurs">Plusieurs pièces</option>
        <option value="logement">Logement entier</option>
        <option value="inconnu">Je ne sais pas</option>
      </select>
    </div>
    <div>
      <label for="access">Accès</label>
      <select id="access" name="access">
        <option value="facile">Accès facile</option>
        <option value="etage">Étage / escalier</option>
        <option value="etroit">Passage étroit</option>
        <option value="distance">Stationnement éloigné</option>
      </select>
    </div>
  </div>
  <div>
    <label for="description">Description</label>
    <textarea id="description" name="description" required></textarea>
    <p class="field-error" id="err-desc" role="status"></p>
  </div>
  <button class="btn btn-primary" type="submit">Demander mon devis</button>
  <p class="form-status" id="form-status" hidden role="status" aria-live="polite"></p>
</form>`;

pageShell({
  file: "contact.html",
  title: "Demander un devis | Leroy du Débarras à Marcillac-la-Croisille",
  desc: "Demandez un devis gratuit pour un débarras, un nettoyage, des travaux extérieurs, un tri ou une évacuation à Marcillac-la-Croisille et en Corrèze.",
  path: "/contact.html",
  h1: "Demander un devis",
  lede: "Décrivez le besoin. Le téléphone et l’e-mail publics s’afficheront ici dès qu’ils seront communiqués par l’entreprise.",
  crumbs: [
    { href: "/", label: "Accueil" },
    { href: "/contact.html", label: "Contact" },
  ],
  bodyInner: `
  <section>
    <div class="container split">
      ${contactForm}
      <aside class="contact-aside">
        <h2>Coordonnées</h2>
        <p data-require="PHONE">Téléphone : <a data-phone-link="label" href="#">À renseigner</a></p>
        <p data-require="EMAIL">E-mail : <a data-email-link="label" href="#">À renseigner</a></p>
        <p data-require="ADDRESS">Adresse : <span data-site="ADDRESS"></span>, <span data-site="POSTAL_CODE" data-empty=""></span> <span data-site="CITY"></span></p>
        <p>Zone : Marcillac-la-Croisille et communes alentours. Voir les <a href="/zones-intervention.html">secteurs</a>.</p>
        <p>NAP (Google Business Profile) : le nom, l’adresse et le téléphone devront être identiques ici, sur la fiche Google et sur les mentions légales, dès qu’ils seront fournis. Rien n’est inventé en attendant.</p>
        <p><a class="btn btn-ghost" href="/contact.html" data-phone-link="label" hidden>Appeler Leroy du Débarras</a></p>
      </aside>
    </div>
  </section>`,
});

function legalPage({ file, title, desc, path, h1, inner }) {
  const pageUrl = abs(path);
  const crumbs = [
    { href: "/", label: "Accueil" },
    { href: path, label: h1 },
  ];
  const breadcrumb = breadcrumbJson(crumbs, pageUrl);
  pages.push({
    file,
    html: layout({
      title,
      desc,
      path,
      current: "/",
      noindex: true,
      jsonld: [
        businessNode,
        websiteNode,
        breadcrumb,
        webPageNode({
          url: pageUrl,
          name: title,
          description: desc,
          breadcrumbId: breadcrumb["@id"],
        }),
      ],
      body: `
      <header class="page-hero">
        <div class="container">
          ${breadcrumbs(crumbs)}
          <h1>${esc(h1)}</h1>
        </div>
      </header>
      <section class="prose"><div class="container">${inner}</div></section>`,
    }),
  });
}

legalPage({
  file: "mentions-legales.html",
  title: "Mentions légales | Leroy du Débarras",
  desc: "Mentions légales du site Leroy du Débarras. Informations d’entreprise à compléter avant mise en production.",
  path: "/mentions-legales.html",
  h1: "Mentions légales",
  inner: `
  <p>Les mentions ci-dessous sont des <strong>emplacements à compléter</strong>. Aucune information juridique n’a été inventée.</p>
  <ul>
    <li>Raison sociale : <span data-site="LEGAL_NAME">À renseigner</span></li>
    <li>Nom commercial : Leroy du Débarras</li>
    <li>Statut juridique : <span data-site="LEGAL_FORM">À renseigner</span></li>
    <li>SIRET : <span data-site="SIRET">${esc(site.SIRET || "À renseigner")}</span></li>
    <li>Adresse : <span data-site="ADDRESS">${esc(site.ADDRESS || "À renseigner")}</span>, <span data-site="POSTAL_CODE" data-empty="">${esc(site.POSTAL_CODE || "")}</span> <span data-site="CITY">${esc(site.CITY || "Marcillac-la-Croisille")}</span></li>
    <li>Responsable de publication : <span data-site="PUBLICATION_DIRECTOR">À renseigner</span></li>
    <li>E-mail : <span data-site="EMAIL">À renseigner</span></li>
    <li>Téléphone : <span data-site="PHONE_DISPLAY">${esc(site.PHONE_DISPLAY || site.PHONE || "À renseigner")}</span></li>
    <li>Hébergeur : <span data-site="HOSTING">À renseigner</span></li>
  </ul>
  <p>Le site présente les activités de débarras, nettoyage, tri et évacuation autour de Marcillac-la-Croisille. Le nom de domaine définitif sera indiqué dans la configuration <code>SITE_URL</code>.</p>`,
});

legalPage({
  file: "politique-confidentialite.html",
  title: "Politique de confidentialité | Leroy du Débarras",
  desc: "Politique de confidentialité du site Leroy du Débarras, préparée pour le futur formulaire de devis.",
  path: "/politique-confidentialite.html",
  h1: "Politique de confidentialité",
  inner: `
  <p>Cette page décrit le traitement prévu des données du formulaire de devis. Elle sera finalisée lorsque le responsable de traitement, l’hébergeur et l’outil d’envoi seront connus.</p>
  <h2>Données collectées via le formulaire</h2>
  <p>Lorsque le formulaire sera connecté : nom, téléphone, e-mail, commune, type de prestation, type de logement, description, volume et accès. Un champ anti-spam non visible peut être traité sans être lu comme une donnée métier.</p>
  <h2>Finalité</h2>
  <p>Répondre à une demande de devis et recontacter la personne. Pas de revente de fichiers, pas de newsletter cachée.</p>
  <h2>Base légale</h2>
  <p>Intérêt légitime / mesures précontractuelles à la demande de la personne (à confirmer par le conseil de l’entreprise).</p>
  <h2>Durée de conservation</h2>
  <p><strong>À renseigner</strong> (exemple courant : le temps du devis puis archivage limité — à valider juridiquement).</p>
  <h2>Destinataires</h2>
  <p>Leroy du Débarras, et le prestataire technique d’envoi lorsqu’il sera choisi (e-mail, backend ou CRM). Champ : <span data-site="FORM_ENDPOINT">non connecté</span>.</p>
  <h2>Droits</h2>
  <p>Accès, rectification, effacement, opposition : demander via l’e-mail qui sera publié. Autorité de contrôle : CNIL.</p>
  <h2>Cookies</h2>
  <p>Le site statique n’installe pas de cookie de mesure tant qu’aucun outil n’est ajouté. Si un outil d’audience est installé plus tard, cette page devra être mise à jour.</p>`,
});

pages.push({
  file: "404.html",
  html: layout({
    title: "Page introuvable | Leroy du Débarras",
    desc: "La page demandée n’existe pas sur le site Leroy du Débarras.",
    path: "/404.html",
    current: "/",
    noindex: true,
    skipCanonical: true,
    body: `
    <header class="page-hero">
      <div class="container">
        <h1>Page introuvable</h1>
        <p class="lede">Ce lien n’existe pas ou plus. Revenez à l’accueil ou demandez un devis.</p>
        <div class="actions" style="margin-top:18px">
          <a class="btn btn-primary" href="/">Accueil</a>
          <a class="btn btn-ghost" href="/contact.html">Demander un devis</a>
          <a class="btn btn-ghost" href="/services.html">Services</a>
        </div>
      </div>
    </header>`,
  }),
});

const correzeMeta = registerCorrezePages({ pageShell, pic, serviceNode, esc });

for (const p of pages) {
  fs.writeFileSync(path.join(root, p.file), p.html.replace(/\n{3,}/g, "\n\n"));
  console.log("wrote", p.file);
}

const indexable = [
  ["/", "index.html"],
  ["/services.html", "services.html"],
  ["/debarras-correze.html", "debarras-correze.html"],
  ...correzeMeta.cityFiles.map((f) => [`/${f}`, f]),
  ["/debarras-maison.html", "debarras-maison.html"],
  ["/debarras-appartement.html", "debarras-appartement.html"],
  ["/debarras-succession.html", "debarras-succession.html"],
  ["/caves-greniers-garages.html", "caves-greniers-garages.html"],
  ["/nettoyage-exterieur.html", "nettoyage-exterieur.html"],
  ["/nettoyage-fin-chantier.html", "nettoyage-fin-chantier.html"],
  ["/tri-et-recuperation.html", "tri-et-recuperation.html"],
  ["/evacuation.html", "evacuation.html"],
  ["/zones-intervention.html", "zones-intervention.html"],
  ["/a-propos.html", "a-propos.html"],
  ["/contact.html", "contact.html"],
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable
  .map(
    ([loc]) => `  <url>
    <loc>${abs(loc)}</loc>
  </url>`,
  )
  .join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(root, "sitemap.xml"), sitemap);

const robots = `User-agent: *
Allow: /

Sitemap: ${abs("/sitemap.xml")}
`;
fs.writeFileSync(path.join(root, "robots.txt"), robots);

console.log("sitemap + robots", indexable.length, "urls");
console.log("correze:", correzeMeta.communeCount, "communes,", correzeMeta.cityCount, "city pages");
console.log("SITE_URL =", BASE);
