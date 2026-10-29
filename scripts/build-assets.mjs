/*------------------------------------------
    ASSET BUILD - minifies the site's own CSS and JS into *.min.css /
    *.min.js next to each source file, then points every page at the
    minified copy with a content-hash ?v= query so browsers and the CDN
    pick up changes immediately (the .htaccess caches assets for a year).

    Edit the unminified sources, then run:  npm run build
    (build:css → seo:build → this script)
-------------------------------------------*/
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { resolve, dirname, posix } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { transform } from "esbuild";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Sources we minify. Vendor files that already ship minified
// (jquery.min.js, bootstrap.*.min.*, swiper.min.css, and
// jquery-plugin-collection.js, a bundle of minified plugins) are only versioned.
const SOURCES = [
    "assets/sass/style.css",
    "assets/css/themify-icons.css",
    "assets/css/animate.css",
    "assets/css/odometer-theme-default.css",
    "assets/js/modernizr.custom.js",
    "assets/js/gsap-script.js",
    "assets/js/script.js",
    "assets/js/whatsapp-widget.js",
    "assets/js/hero-align.js",
    "assets/js/about-gallery.js",
    "assets/js/projects.js",
    "assets/js/form-api.js",
    "assets/js/contact-form.js",
    "assets/js/quote-form.js",
    "assets/js/career-form-api.js",
    "assets/js/careers-form.js",
];

const minPath = (file) => file.replace(/(\.min)?\.(css|js)$/, ".min.$2");
const hash = (buf) => createHash("sha256").update(buf).digest("hex").slice(0, 10);

let saved = 0;
for (const file of SOURCES) {
    const src = readFileSync(resolve(ROOT, file), "utf8");
    const loader = file.endsWith(".css") ? "css" : "js";
    // Classic scripts, not modules: esbuild keeps top-level names, so globals
    // shared between files (e.g. form-api.js → contact-form.js) still resolve.
    const { code } = await transform(src, { loader, minify: true, legalComments: "inline", charset: "utf8" });
    writeFileSync(resolve(ROOT, minPath(file)), code);
    saved += src.length - code.length;
}

// Point pages at the minified files, versioned by content hash.
const PAGE_DIRS = ["", "services", "blogs"];
const pages = PAGE_DIRS.flatMap((d) =>
    readdirSync(resolve(ROOT, d))
        .filter((f) => f.endsWith(".html"))
        .map((f) => (d ? `${d}/${f}` : f)),
);
const REF = /(<(?:link|script)\b[^>]*\s(?:href|src)=")([^"]*?assets\/(?:css|sass|js)\/[^"?]+?)(?:\.min)?\.(css|js)(?:\?[^"]*)?"/g;

for (const page of pages) {
    const file = resolve(ROOT, page);
    const html = readFileSync(file, "utf8");
    const out = html.replace(REF, (all, pre, base, ext) => {
        const rel = posix.normalize(posix.join(posix.dirname(page), base));
        const candidates = [`${rel}.min.${ext}`, `${rel}.${ext}`];
        const target = candidates.find((c) => existsSync(resolve(ROOT, c)));
        if (!target) throw new Error(`${page}: no file for ${base}.${ext}`);
        const href = base + target.slice(rel.length);
        return `${pre}${href}?v=${hash(readFileSync(resolve(ROOT, target)))}"`;
    });
    if (out !== html) writeFileSync(file, out);
}

console.log(`Minified ${SOURCES.length} files (${Math.round(saved / 1024)} KB smaller); ${pages.length} pages versioned.`);
