/**
 * Configuration centrale — Leroy Débarras
 * Une seule source pour le domaine, le nom et les données d’entreprise.
 *
 * Avant mise en production :
 * 1. Renseigner SITE_URL (sans slash final) avec le domaine définitif.
 * 2. Exécuter : node tools/apply-site-url.mjs
 * 3. Compléter les champs métier réels (laisser null tant qu’ils ne sont pas fournis).
 *
 * Ne jamais inventer téléphone, e-mail, adresse, SIRET, assurances ou avis.
 */
(function (global) {
  "use strict";

  var SITE = {
    SITE_URL: "https://www.leroy-debarras.fr",
    SITE_NAME: "Leroy Débarras",
    BUSINESS_NAME: "Leroy Débarras",
    CITY: "Marcillac-la-Croisille",
    REGION: "Corrèze",
    POSTAL_CODE: null,
    ADDRESS: null,
    PHONE: null,
    PHONE_DISPLAY: null,
    EMAIL: null,
    FORM_ENDPOINT: null,
    OWNER_NAME: null,
    LEGAL_NAME: null,
    LEGAL_FORM: null,
    SIRET: null,
    PUBLICATION_DIRECTOR: null,
    HOSTING: null,
    YEAR_FOUNDED: null,
    EXPERIENCE: null,
    INSURANCE: null,
    CERTIFICATIONS: null,
    GEO_LAT: null,
    GEO_LNG: null,
    HOURS: null,
    SAME_AS: [],
    SOCIAL_IMAGE: "/images/og-social.jpg"
  };

  function filled(value) {
    if (value === null || value === undefined) return false;
    if (Array.isArray(value)) return value.length > 0;
    return String(value).trim().length > 0;
  }

  function origin() {
    var url = String(SITE.SITE_URL || "").trim().replace(/\/+$/, "");
    return url;
  }

  function absolute(path) {
    var p = path.charAt(0) === "/" ? path : "/" + path;
    var base = origin();
    return base ? base + p : p;
  }

  global.LeroySite = SITE;
  global.LeroySiteHelpers = {
    filled: filled,
    origin: origin,
    absolute: absolute
  };
})(typeof window !== "undefined" ? window : globalThis);
