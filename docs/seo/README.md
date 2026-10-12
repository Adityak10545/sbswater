# SEO — implementation and operations

The site is static HTML (no framework or bundler), currently staged on GitHub
Pages at `adityak10545.github.io/sbswater/` and intended for
`https://www.sbswater.in`. All SEO metadata is generated from one config file.

## How it works

| File | Purpose |
| --- | --- |
| `scripts/seo/seo.config.mjs` | Production URL, per-page titles, descriptions, index/noindex, breadcrumbs, service schema, organization details, optional GTM / Search Console IDs |
| `scripts/seo/build-seo.mjs` | Writes the `<!-- SEO:BEGIN -->…<!-- SEO:END -->` block into each page's `<head>`, and writes `robots.txt` and `sitemap.xml` |
| `scripts/seo/check-seo.mjs` | Validates the output (see below) |
| `assets/js/script.js` (top block) | `window.sbsTrack()` + phone / email / WhatsApp click events → `dataLayer` |

```bash
npm run seo:build   # after editing seo.config.mjs or adding a page
npm run seo:check   # exits 1 on any FAIL
```

Do not hand-edit tags inside the `SEO:BEGIN/END` block — they are overwritten.

**Adding a page:** add an entry to `PAGES` in `seo.config.mjs`, run both
commands. `seo:check` fails if any root `.html` file is missing from the config.

**Publishing a real blog post or project page:** create the page, add it to
`PAGES` with `index: true` and a unique title/description, then rebuild.

### What `seo:check` validates

- exactly one `<title>`, meta description and meta robots per page; `lang="en-IN"`
- indexable pages: one canonical equal to the sitemap URL, matching `og:url`,
  exactly one `<h1>`, unique title and description
- noindex pages have no canonical
- no staging host (`github.io`) in any `<head>`
- every JSON-LD block parses; breadcrumb positions are sequential, URLs are
  absolute, and each breadcrumb label is visible on the page
- every local link and image resolves to a real file; missing `#fragment`
  targets are warnings
- `sitemap.xml` is well-formed and lists exactly the indexable pages;
  `robots.txt` references it and does not block the site

## Index policy

**Indexed (in sitemap):** `/`, `about.html`, `service.html`,
`water-treatment-plant.html`, `reverse-osmosis-plant.html`,
`effluent-treatment-plant.html`, `portfolio.html`, `contact.html`,
`get-a-quote.html`, `careers.html`.

**`noindex, follow`:** `blog.html`, `blog-single.html`, `blog-standard.html`,
`service-single.html`, `portfolio-single.html`, `team.html`,
`team-single.html`, `index-2.html`, `404.html`. These are theme templates
still holding placeholder content (architecture/fitness copy, "Michel" as
author, fake comments). They stay reachable but out of search results. Flip
to `index: true` only after real content replaces the placeholders.

`robots.txt` disallows nothing on purpose: a crawler must be able to fetch a
page to see its `noindex`.

## Structured data

| Page | Types |
| --- | --- |
| Home | `Organization` (name, logo, address of the corporate office, phone, email, sales + HR contact points, social profiles), `WebSite` |
| WTP / RO / ETP pages | `Service` (provider → Organization, areaServed India), `BreadcrumbList` |
| About, Services, Projects, Contact, Careers | `BreadcrumbList` (mirrors the visible breadcrumb) |

Deliberately **not** added: `LocalBusiness` (no opening hours are published;
add it with `openingHoursSpecification` once hours are confirmed), `Review` /
`AggregateRating` (no genuine reviews on the site), `FAQPage` (Google limits
FAQ rich results to government and health sites), `Product`, prices.

Validate after deployment with the Rich Results Test
(<https://search.google.com/test/rich-results>) and the Schema Markup
Validator (<https://validator.schema.org/>).

## Conversion events

Pushed to `window.dataLayer`. Inert until a GTM container is installed.
No personal data is ever included.

| Event | Fires when | Params |
| --- | --- | --- |
| `generate_lead` | Contact or quote form saved successfully (backend returned `success: true`) | `form_type`: `contact` / `quote` |
| `job_application` | Career application saved successfully | `form_type`: `career` |
| `phone_click` | Any `tel:` link clicked | `link_location`: header / content / footer |
| `email_click` | Any `mailto:` link clicked | `link_location` |
| `whatsapp_click` | WhatsApp widget chat link clicked | `link_location` |

There is no newsletter or vendor-registration form on the site, so none is tracked.

---

## Before deployment (manual)

1. **Confirm the production host.** `SITE_URL` is `https://www.sbswater.in`
   (the website listed in the site footer). If the site will launch on a
   different host, change `SITE_URL` and run `npm run seo:build`. Today that
   domain still serves an old template site ("Industic | Industry & Factory").
2. **Point the domain at the new site.** For GitHub Pages: add the custom
   domain in the repo's *Settings → Pages* (this creates a `CNAME` file),
   set the DNS records your registrar needs, and enable *Enforce HTTPS*.
   `robots.txt` only works at the root of a host, so it has no effect at
   `adityak10545.github.io/sbswater/`.
3. **One canonical host.** Both `https://sbswater.in` and
   `https://www.sbswater.in` currently answer 200. Configure a 301 from the
   bare domain to `www` (GitHub Pages does this automatically when the custom
   domain is set to `www.sbswater.in` and both DNS records exist).
4. **Old URLs.** Before switching, list the old site's indexed URLs
   (Search Console → Pages, or `site:sbswater.in`). GitHub Pages cannot do
   server-side 301s; if old URLs had traffic or links, either host on a
   platform that supports redirects or accept that they will 404 and drop out.
5. **Supply the two missing Satva Biorefinery photos**
   (`assets/images/projects/satva-1.jpg`, `satva-2.jpg`). Until then
   `seo:check` reports them as FAIL. The page shows a "Photo coming soon"
   placeholder, so visitors do not see a broken image.

## After deployment (manual — needs account access)

### Google Search Console
1. Add a **Domain property** for `sbswater.in` and verify via the DNS TXT
   record (covers www, non-www, http and https). Alternative: URL-prefix
   property with the HTML-tag method — put the token in
   `INTEGRATIONS.googleSiteVerification` and rebuild.
2. *Sitemaps* → submit `https://www.sbswater.in/sitemap.xml`.
3. *URL Inspection* → inspect `/`, the three service pages and
   `contact.html`; use *Request indexing* on each.
4. Watch *Pages* (indexing), *Core Web Vitals* and *Enhancements →
   Breadcrumbs* for 4–6 weeks. Expect the old site's URLs to show as 404.

### GA4 + Google Tag Manager
1. Create a GA4 property and a GTM web container.
2. Put the container ID in `INTEGRATIONS.gtmId`, run `npm run seo:build`.
   The GTM snippet is then added to every page's head and body.
3. In GTM: add the GA4 configuration tag; add *Custom Event* triggers for
   the five events above and GA4 event tags forwarding `form_type` /
   `link_location`; mark `generate_lead` (and optionally `job_application`)
   as key events in GA4.
4. Consent: if you add a consent banner, enable Consent Mode in GTM.
   Review obligations under India's DPDP Act with whoever owns privacy.

### Google Business Profile (local SEO)
- Claim or create a profile for the **Shivajinagar, Pune corporate office**
  using exactly the name and address on the site:
  *SBS Water & Infra Projects Private Limited, Fifth Floor, Pride Silicon
  Plaza, 'B' Wing, S B Road, Shivajinagar, Pune – 411016*, phone
  +91 85509 04904, website `https://www.sbswater.in/`.
- Consider separate profiles for the Talawade factory and the Nipani regional
  office only if each is staffed and meets Google's eligibility rules.
- Category suggestion: *Water treatment supplier* / *Water purification
  company*; add services (ETP, STP, WTP, RO, ZLD, CPU).
- Add genuine plant photos, publish opening hours (then add them to the site
  and to `LocalBusiness` schema), and ask real clients for reviews.

---

## Performance notes

- **Image dimensions:** every `<img>` on the home, about and projects pages
  carries its intrinsic `width`/`height`; `img { height: auto; }` in
  `assets/sass/base/_base.scss` keeps the ratio when CSS changes the width.
  New images should get real dimensions too.
- **Hero:** WebP versions sit next to the JPEGs in `assets/images/plants/`.
  `_home-sbs.scss` serves them with `image-set()` (JPEG fallback first), and
  the preload in `seo.config.mjs` points at the same WebP files. Change both
  together.
- **Stylesheets:** each page links only the plugin CSS it uses. If a page
  starts using a plugin (Owl, Swiper, Odometer, Fancybox, Flaticon icons),
  add that plugin's stylesheet `<link>` back to that page.
- **Preloader / WOW.js:** both are released after `window.load`. Images
  below the first screen are `loading="lazy"` so they no longer hold that
  back. If the theme script fails, `script.js` removes the preloader and
  adds `.wow-fallback` after 4 s; a `<noscript>` style does the same with
  JavaScript off. Reduced-motion users get no scroll-reveal animations.

## Remaining improvements (not done yet)

| Priority | Item |
| --- | --- |
| High | Replace placeholder blog/insights content, or remove "Insights" from the menu until real articles exist. The home page "Insights" cards also link to the placeholder article. |
| Medium | The preloader still covers every page until `window.load`. Lifting it as soon as the first-screen image is ready (instead of all eager images) would cut perceived load time further; it is a visible behaviour change, so it needs sign-off. |
| Medium | `style.css` (356 KB, unminified, compiled from the theme) and `bootstrap.min.css` (156 KB) are most of the remaining CSS. Trimming unused theme rules inside `style.css` needs a per-component audit of the Sass partials. |
| Medium | Inner-page title backgrounds are large JPEGs (`balaji-sugar-etp.jpg` 805 KB, `dahod-smart-city-plant.jpg`); convert to WebP the same way as the home hero. |
| Medium | Client-logo marquee images (22 files, 665 KB; e.g. `2sigma.jpg` is 1536 px wide for a ~125 px slot) load eagerly; resize them to ~2× their display size. |
| Low | ~20 images on the services, contact and service-detail pages still have no `width`/`height`. |
| Low | `jquery-plugin-collection.js` bundles every theme plugin; most are unused on the real pages. |
| Low | Home counters use `<h3>` for numbers ("00+"); semantically these should not be headings. Change only with matching CSS updates. |
| Low | Dedicated pages for CPU, ZLD, STP, cooling tower blowdown and PCTP (listed on Services but without detail pages) — see `keyword-strategy.md`. |
| Low | Relative asset paths in `404.html` break when the 404 is served for a nested path (e.g. `/a/b`). |
