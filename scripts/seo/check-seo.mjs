/*------------------------------------------
    SEO CHECK - validates the built pages against seo.config.mjs:
    one title/description/robots per page, unique titles and descriptions,
    canonicals that match the sitemap, parseable JSON-LD, robots.txt,
    and local links/images that resolve to real files.

    Usage: npm run seo:check   (exits 1 on any FAIL)
-------------------------------------------*/
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { resolve, dirname, posix } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE_URL, PAGES } from "./seo.config.mjs";
import { pageUrl } from "./build-seo.mjs";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const fails = [];
const warns = [];
const fail = (m) => fails.push(m);
const warn = (m) => warns.push(m);

const decode = (s) =>
    s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const all = (html, re) => [...html.matchAll(re)];
const head = (html) => html.split(/<\/head>/i)[0];

// every HTML page at the root or in a page folder must be configured
const PAGE_DIRS = ["", "services", "blogs"];
const htmlFiles = PAGE_DIRS.flatMap((d) =>
    existsSync(resolve(ROOT, d))
        ? readdirSync(resolve(ROOT, d))
              .filter((f) => f.endsWith(".html"))
              .map((f) => (d ? `${d}/${f}` : f))
        : [],
);
for (const f of htmlFiles) {
    if (!PAGES.some((p) => p.file === f)) fail(`${f}: not listed in seo.config.mjs`);
}

const titles = new Map();
const descs = new Map();
const idsByFile = new Map();
const pagesHtml = new Map();

for (const page of PAGES) {
    const html = readFileSync(resolve(ROOT, page.file), "utf8");
    pagesHtml.set(page.file, html);
    const h = head(html);
    const f = page.file;

    const t = all(h, /<title>([\s\S]*?)<\/title>/gi);
    const d = all(h, /<meta\s+name="description"\s+content="([^"]*)"/gi);
    const r = all(h, /<meta\s+name="robots"\s+content="([^"]*)"/gi);
    const c = all(h, /<link\s+rel="canonical"\s+href="([^"]*)"/gi);
    const ogUrl = all(h, /<meta\s+property="og:url"\s+content="([^"]*)"/gi);

    if (t.length !== 1) fail(`${f}: ${t.length} <title> tags`);
    if (d.length !== 1) fail(`${f}: ${d.length} meta descriptions`);
    if (r.length !== 1) fail(`${f}: ${r.length} meta robots tags`);
    if (!/<html lang="en-IN"/.test(html)) fail(`${f}: html lang is not en-IN`);
    if (/adityak10545\.github\.io/.test(h)) fail(`${f}: staging host in <head>`);

    const title = t[0] ? decode(t[0][1].trim()) : "";
    const desc = d[0] ? decode(d[0][1]) : "";
    if (page.index) {
        if (title.length > 65) warn(`${f}: title is ${title.length} chars`);
        if (desc.length < 70 || desc.length > 170) warn(`${f}: description is ${desc.length} chars`);
        if (!/^index/.test(r[0]?.[1] || "")) fail(`${f}: indexable page is not "index"`);
        if (c.length !== 1) fail(`${f}: ${c.length} canonical tags`);
        else if (c[0][1] !== pageUrl(page)) fail(`${f}: canonical ${c[0][1]} != ${pageUrl(page)}`);
        if (ogUrl[0]?.[1] !== pageUrl(page)) fail(`${f}: og:url does not match canonical`);
        if (titles.has(title)) fail(`${f}: duplicate title with ${titles.get(title)}`);
        if (descs.has(desc)) fail(`${f}: duplicate description with ${descs.get(desc)}`);
        titles.set(title, f);
        descs.set(desc, f);
        if (all(html.split(/<body/i)[1] || "", /<h1[\s>]/gi).length !== 1) fail(`${f}: expected exactly one <h1>`);
    } else {
        if (!/noindex/.test(r[0]?.[1] || "")) fail(`${f}: should be noindex`);
        if (c.length) fail(`${f}: noindex page has a canonical`);
    }

    // JSON-LD
    for (const [, json] of all(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
        let data;
        try {
            data = JSON.parse(json);
        } catch (e) {
            fail(`${f}: JSON-LD does not parse (${e.message})`);
            continue;
        }
        if (data["@context"] !== "https://schema.org") fail(`${f}: JSON-LD @context`);
        const nodes = data["@graph"] || [data];
        for (const n of nodes) {
            if (!n["@type"]) fail(`${f}: JSON-LD node without @type`);
            if (n["@type"] === "BreadcrumbList") {
                n.itemListElement.forEach((li, i) => {
                    if (li.position !== i + 1) fail(`${f}: breadcrumb position ${li.position}`);
                    if (!li.item.startsWith(SITE_URL)) fail(`${f}: breadcrumb item not absolute`);
                    const visible = decode(html).replace(/<[^>]+>/g, " ");
                    if (!visible.includes(li.name)) fail(`${f}: breadcrumb "${li.name}" not visible on page`);
                });
            }
        }
    }

    // collect element ids for fragment checks
    idsByFile.set(f, new Set(all(html, /\sid="([^"]+)"/g).map((m) => m[1])));
}

// local links, fragments and images
const strip = (u) => u.split("?")[0];
for (const [f, html] of pagesHtml) {
    const body = html.replace(/<!--[\s\S]*?-->/g, "");
    for (const [, href] of all(body, /<a\b[^>]*\shref="([^"]*)"/gi)) {
        if (/^(https?:|mailto:|tel:|javascript:|#?$)/i.test(href)) continue;
        const [path, frag] = href.split("#");
        // links are relative to the page's own folder
        const target = path ? posix.normalize(posix.join(posix.dirname(f), strip(path))) : f;
        if (path && !existsSync(resolve(ROOT, target))) {
            fail(`${f}: broken link → ${href}`);
            continue;
        }
        if (frag && /\.html$/.test(target) && idsByFile.has(target) && !idsByFile.get(target).has(frag)) {
            warn(`${f}: link fragment #${frag} not found in ${target}`);
        }
    }
    for (const [, src] of all(body, /<(?:img|source|link)\b[^>]*\s(?:src|href)="([^"]*)"/gi)) {
        if (/^(https?:|data:|\/\/)/i.test(src)) continue;
        if (!existsSync(resolve(ROOT, posix.dirname(f), strip(src)))) fail(`${f}: missing asset → ${src}`);
    }
}

// sitemap
const sitemap = readFileSync(resolve(ROOT, "sitemap.xml"), "utf8");
if (!/^<\?xml version="1.0" encoding="UTF-8"\?>\s*<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">[\s\S]*<\/urlset>\s*$/.test(sitemap))
    fail("sitemap.xml: unexpected structure");
const locs = all(sitemap, /<loc>([^<]*)<\/loc>/g).map((m) => m[1]);
const expected = PAGES.filter((p) => p.index).map(pageUrl);
if (new Set(locs).size !== locs.length) fail("sitemap.xml: duplicate URLs");
for (const [entry] of all(sitemap, /<url>[\s\S]*?<\/url>/g)) {
    if (!/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/.test(entry)) fail(`sitemap.xml: missing or invalid <lastmod> in ${entry.match(/<loc>([^<]*)/)?.[1]}`);
}
for (const u of expected) if (!locs.includes(u)) fail(`sitemap.xml: missing ${u}`);
for (const u of locs) if (!expected.includes(u)) fail(`sitemap.xml: unexpected ${u}`);

// robots.txt
const robots = readFileSync(resolve(ROOT, "robots.txt"), "utf8");
if (!robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) fail("robots.txt: sitemap line missing");
if (/^Disallow:\s*\/\s*$/m.test(robots)) fail("robots.txt: blocks the whole site");

for (const w of warns) console.log("WARN  " + w);
for (const m of fails) console.log("FAIL  " + m);
console.log(
    `\n${PAGES.length} pages, ${expected.length} indexable, ${locs.length} sitemap URLs - ` +
        (fails.length ? `${fails.length} FAIL` : "PASS") +
        (warns.length ? `, ${warns.length} WARN` : ""),
);
process.exit(fails.length ? 1 : 0);
