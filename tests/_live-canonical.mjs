import fs from "fs";

const urls = [
  "https://leroydudebaras.fr/",
  "https://www.leroydudebaras.fr/",
  "http://leroydudebaras.fr/",
  "https://leroydudebaras.fr/services.html",
  "https://leroydudebaras.fr/index.html",
  "https://leroydudebaras.fr/contact.html",
];

async function check(u) {
  try {
    const r = await fetch(u, {
      redirect: "manual",
      headers: { "User-Agent": "Mozilla/5.0 LeroyCanonicalAudit/1.0" },
    });
    const loc = r.headers.get("location") || "";
    let info = { url: u, status: r.status, location: loc };
    if (r.status === 200) {
      const html = await r.text();
      const all = [...html.matchAll(/rel=["']canonical["']/gi)];
      const m =
        html.match(/rel=["']canonical["'][^>]*href=["']([^"']+)/i) ||
        html.match(/href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
      info.canonicalCount = all.length;
      info.canonical = m ? m[1] : null;
      const og = html.match(/property=["']og:url["'][^>]*content=["']([^"']+)/i);
      info.ogUrl = og ? og[1] : null;
    }
    console.log(JSON.stringify(info));
  } catch (e) {
    console.log(JSON.stringify({ url: u, error: e.message }));
  }
}

for (const u of urls) await check(u);

const sm = await fetch("https://leroydudebaras.fr/sitemap.xml").then((r) => r.text());
const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
console.log("sitemap count", locs.length);
console.log("sitemap apex?", locs.every((l) => l.startsWith("https://leroydudebaras.fr")));
console.log("sitemap www?", locs.some((l) => l.includes("www.")));
console.log("sitemap index.html?", locs.some((l) => l.endsWith("/index.html")));
