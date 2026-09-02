/**
 * Audit compatibilité mobile (critères Semrush / Google Mobile-Friendly)
 * Usage: node tests/audit-mobile-live.mjs
 */
import https from "https";

const URLS = [
  "https://leroydudebarras.fr/",
  "https://www.leroydudebarras.fr/",
  "https://leroydudebarras.fr/contact.html",
];

function get(url) {
  return new Promise((resolve, reject) => {
    const t0 = Date.now();
    https
      .get(
        url,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
            Accept: "text/html,application/xhtml+xml",
          },
          timeout: 15000,
        },
        (res) => {
          let body = "";
          res.on("data", (c) => (body += c));
          res.on("end", () =>
            resolve({
              url,
              status: res.statusCode,
              ms: Date.now() - t0,
              location: res.headers.location || "",
              body,
            }),
          );
        },
      )
      .on("error", reject)
      .on("timeout", function () {
        this.destroy();
        reject(new Error("timeout"));
      });
  });
}

function auditHtml(url, html) {
  const issues = [];
  const notes = [];

  const vp = html.match(/<meta[^>]*name=["']viewport["'][^>]*>/i)?.[0] || "";
  if (!vp) issues.push("viewport absent");
  else {
    if (!/width\s*=\s*device-width/i.test(vp)) issues.push("viewport sans width=device-width");
    if (!/initial-scale\s*=\s*1/i.test(vp)) issues.push("viewport sans initial-scale=1");
    if (/user-scalable\s*=\s*no/i.test(vp)) issues.push("user-scalable=no (bloque zoom)");
    if (/maximum-scale\s*=\s*1/i.test(vp)) issues.push("maximum-scale=1 (bloque zoom)");
    else notes.push(`viewport OK: ${vp}`);
  }

  const cssHref =
    html.match(/href=["']([^"']*style[^"']*\.css)["']/i)?.[1] || "";
  if (!cssHref) issues.push("feuille CSS principale introuvable");
  else notes.push(`CSS: ${cssHref}`);

  const inlineStyles = [...html.matchAll(/style=["']([^"']+)["']/gi)].map((m) => m[1]);
  const fixedWidths = inlineStyles.filter((s) => /width\s*:\s*\d{3,}px/i.test(s));
  if (fixedWidths.length) issues.push(`styles inline largeur fixe: ${fixedWidths.length}`);

  const tables = (html.match(/<table\b/gi) || []).length;
  if (tables) issues.push(`${tables} table(s) HTML (risque débordement)`);

  const imgsNoWidth = [...html.matchAll(/<img\b(?![^>]*\bwidth=)[^>]*>/gi)].length;
  if (imgsNoWidth > 3) notes.push(`${imgsNoWidth} images sans attribut width (mineur)`);

  const hasNavToggle = /nav-toggle|menu-toggle/i.test(html);
  const hasMobileMq = /--tap-min|max-width:\s*959px|max-width:\s*414px/i.test(html);
  if (!hasNavToggle) issues.push("pas de bouton menu mobile détecté dans HTML");
  if (!hasMobileMq && !cssHref.includes("style.min.css")) {
    notes.push("breakpoints non vérifiables sans CSS");
  }

  const smallTextHints = (html.match(/font-size:\s*0\.7|font-size:\s*1[0-1]px/gi) || []).length;
  if (smallTextHints) issues.push("indices texte petit dans HTML inline");

  return { issues, notes, cssHref };
}

async function auditCss(cssUrl, base) {
  const issues = [];
  const notes = [];
  const full = cssUrl.startsWith("http") ? cssUrl : base.replace(/\/$/, "") + cssUrl;
  const res = await get(full);
  const css = res.body;

  if (!/overflow-x:\s*clip/i.test(css)) issues.push("CSS live: pas overflow-x clip");
  if (!/max-width:\s*100%/i.test(css)) issues.push("CSS live: images pas fluides");
  if (!/@media\s*\(max-width:\s*959px\)/i.test(css)) issues.push("CSS live: breakpoint nav mobile absent");
  if (!/--tap-min/i.test(css)) issues.push("CSS live: --tap-min absent (cibles tactiles)");
  else notes.push("CSS live: variables tactiles présentes");

  const small = [...css.matchAll(/font-size:\s*([0-9.]+)(px|rem|em)/gi)]
    .map((m) => ({ v: +m[1], u: m[2].toLowerCase() }))
    .filter((f) => (f.u === "px" ? f.v < 12 : f.v < 0.75));
  if (small.length) issues.push(`CSS live: ${small.length} taille(s) < 12px`);

  const tightGap = [...css.matchAll(/gap:\s*([0-9.]+)px/gi)].filter(
    (m) => parseFloat(m[1]) > 0 && parseFloat(m[1]) < 8,
  );
  if (tightGap.length) issues.push(`CSS live: gap < 8px (${[...new Set(tightGap.map((m) => m[0]))].join(", ")})`);

  const fixed = css.match(/width:\s*([12]\d{3})px/g);
  if (fixed) issues.push(`CSS live: largeurs fixes ${fixed.join(", ")}`);

  if (/text-size-adjust:\s*none/i.test(css)) issues.push("CSS live: text-size-adjust:none");

  return { issues, notes, cssBytes: Buffer.byteLength(css) };
}

console.log("=== AUDIT MOBILE LIVE (Semrush / Google) ===\n");

for (const url of URLS) {
  console.log(`--- ${url} ---`);
  try {
    const page = await get(url);
    console.log(`HTTP ${page.status} en ${page.ms}ms`);
    if (page.status >= 300 && page.status < 400) {
      console.log(`Redirect → ${page.location}`);
      continue;
    }
    const htmlAudit = auditHtml(url, page.body);
    htmlAudit.notes.forEach((n) => console.log("  OK:", n));
    htmlAudit.issues.forEach((i) => console.log("  PROBLÈME:", i));

    if (htmlAudit.cssHref) {
      const cssAudit = await auditCss(htmlAudit.cssHref, url);
      console.log(`  CSS chargé: ${cssAudit.cssBytes} octets`);
      cssAudit.notes.forEach((n) => console.log("  OK:", n));
      cssAudit.issues.forEach((i) => console.log("  PROBLÈME:", i));
    }

    const cssOnPage = page.body.includes("style.min.css");
    const hasTapMinInCss = htmlAudit.cssHref && (await get(
      htmlAudit.cssHref.startsWith("http")
        ? htmlAudit.cssHref
        : new URL(htmlAudit.cssHref, url).href,
    )).body.includes("--tap-min");
    if (!hasTapMinInCss) {
      console.log("  PROBLÈME: CSS déployé semble ancien (sans optimisations mobile récentes)");
    }
  } catch (e) {
    console.log("  ERREUR:", e.message);
  }
  console.log("");
}
