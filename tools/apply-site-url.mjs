/**
 * Après modification de SITE_URL dans js/site-config.js :
 *   node tools/build-pages.mjs
 *   node tools/minify.mjs
 *
 * Ce script rappelle la consigne. La régénération des canonicals
 * se fait via build-pages.mjs (source unique).
 */
import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const r1 = spawnSync(process.execPath, [path.join(root, "tools", "build-pages.mjs")], {
  stdio: "inherit",
});
if (r1.status) process.exit(r1.status);
const r2 = spawnSync(process.execPath, [path.join(root, "tools", "minify.mjs")], {
  stdio: "inherit",
});
process.exit(r2.status || 0);
