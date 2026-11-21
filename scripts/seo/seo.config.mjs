/*------------------------------------------
    SEO CONFIG - single source of truth for page metadata, structured data,
    robots.txt and sitemap.xml. After editing, run:  npm run seo:build
    then check the result with:                      npm run seo:check
-------------------------------------------*/

// Production origin used for canonicals, Open Graph URLs, sitemap and
// robots.txt. No trailing slash. Must be the host the site is served from
// in production (robots.txt only works at the root of a host).
export const SITE_URL = "https://www.sbswater.in";

// Optional integrations. Leave empty until real values exist - nothing is
// emitted for an empty value, so no placeholder IDs reach production.
export const INTEGRATIONS = {
    // Google Tag Manager container ID, e.g. "GTM-XXXXXXX". GA4 should be
    // configured inside GTM so there is only one tag installation.
    gtmId: "GTM-PRZ28JG3",
    // GA4 measurement ID loaded directly via gtag.js, e.g. "G-XXXXXXXXXX".
    // If set, do NOT also add a GA4 tag inside GTM or pageviews double-count.
    gaMeasurementId: "G-NNJEKH2XJY",
    // Content of the google-site-verification meta tag (HTML-tag method).
    // Not needed if the domain is verified via DNS.
    googleSiteVerification: "",
};

export const SITE_NAME = "SBS Water & Infra Projects Private Limited";
export const LOCALE = "en_IN";
export const HTML_LANG = "en-IN";

export const DEFAULT_IMAGE = {
    path: "assets/images/brand/og-image.jpg",
    width: 1200,
    height: 630,
    alt: "SBS Water & Infra Projects Private Limited logo",
};

// Verified from the site footer, contact and careers pages.
export const ORGANIZATION = {
    name: SITE_NAME,
    alternateName: "SBS Water",
    logo: "assets/images/brand/icon-512.png",
    email: "marketing@sbswater.in",
    telephone: "+91-8550904904",
    foundingDate: "2019",
    address: {
        streetAddress:
            "Fifth Floor, Pride Silicon Plaza, 'B' Wing, S B Road, Shivajinagar",
        addressLocality: "Pune",
        addressRegion: "Maharashtra",
        postalCode: "411016",
        addressCountry: "IN",
    },
    contactPoints: [
        {
            contactType: "sales",
            telephone: "+91-8550904904",
            email: "marketing@sbswater.in",
        },
        {
            contactType: "human resources",
            telephone: "+91-8956896310",
            email: "hr@sbswater.in",
        },
    ],
    sameAs: [
        "https://www.facebook.com/SbsWaterAndInfraProjects/",
        "https://www.instagram.com/sbs_water/",
        "https://www.linkedin.com/company/sbs-sustainable-business-solutions/",
    ],
};

/*
    One entry per HTML file.
      path:       public clean URL (no .html) - must match the rewrites in
                  .htaccess; used for canonicals, sitemap and internal links
      index:      true  → indexable, canonical, listed in sitemap
                  false → "noindex, follow", no canonical, not in sitemap
      breadcrumb: [[label, file], ...] - must mirror the visible breadcrumb
      service:    emits Service structured data for genuine service pages
      preload:    LCP images to preload ({ href, media })
      article:    emits BlogPosting structured data for blog articles
                  (headline = the visible <h1>, image = the lead image)
*/
export const PAGES = [
    {
        file: "index.html",
        path: "/",
        index: true,
        title: "Water & Wastewater Treatment Plant Company in Pune | SBS Water",
        description:
            "SBS Water designs, manufactures and commissions ETP, STP, ZLD, CPU, RO and water treatment plants for sugar, distillery and process industries across India.",
        home: true,
        // Mirrors .hero-bg-drone in assets/sass/page/_home-sbs.scss (the first
        // frame of the hero video, shown until it plays), which serves WebP via
        // image-set() with the JPEGs as fallback
        preload: [
            {
                href: "assets/images/plants/hero-drone.webp",
                type: "image/webp",
                media: "(min-width: 992px)",
            },
            {
                href: "assets/images/plants/hero-drone-1200.webp",
                type: "image/webp",
                media: "(max-width: 991px)",
            },
        ],
    },
    {
        file: "about.html",
        path: "/about-us",
        index: true,
        title: "About SBS Water & Infra Projects | Water Treatment Company, Pune",
        description:
            "Pune-based SBS Water & Infra Projects has designed, manufactured and commissioned CPU, ETP, STP, WTP, RO and ZLD plants for industries in India and abroad since 2019.",
        breadcrumb: [["Home", "index.html"], ["About Us", "about.html"]],
    },
    {
        file: "service.html",
        path: "/services",
        index: true,
        title: "Water & Wastewater Treatment Services | SBS Water",
        description:
            "Condensate polishing, WTP, RO, ETP, ZLD, STP and cooling tower blowdown treatment plants, plus plant revamping, for sugar, distillery and process industries.",
        breadcrumb: [["Home", "index.html"], ["Services", "service.html"]],
    },
    {
        file: "services/condensate-polishing-unit.html",
        path: "/services/condensate-polishing-unit",
        index: true,
        title: "Condensate Polishing Unit (CPU) Manufacturer | SBS Water",
        description:
            "RO-based and Biological condensate polishing units for sugar and distillery plants, recovering about 85% of process condensate for cooling tower and process reuse.",
        breadcrumb: [
            ["Home", "index.html"],
            ["Services", "service.html"],
            ["Condensate Polishing Unit", "services/condensate-polishing-unit.html"],
        ],
        service: {
            name: "Condensate Polishing Unit (CPU)",
            serviceType: "Condensate polishing unit design, manufacturing and commissioning",
        },
    },
    {
        file: "services/water-treatment-plant.html",
        path: "/services/water-treatment-plant",
        index: true,
        title: "Industrial Water Treatment Plant (WTP) Manufacturer | SBS Water",
        description:
            "Industrial WTPs that treat river, canal and borewell water for process, cooling and utility use in sugar mills, distilleries and process plants. 15+ delivered.",
        breadcrumb: [
            ["Home", "index.html"],
            ["Services", "service.html"],
            ["Water Treatment Plant", "services/water-treatment-plant.html"],
        ],
        service: {
            name: "Water Treatment Plant (WTP)",
            serviceType: "Industrial water treatment plant design, manufacturing and commissioning",
        },
    },
    {
        file: "services/reverse-osmosis-plant.html",
        path: "/services/reverse-osmosis-plant",
        index: true,
        title: "Industrial Reverse Osmosis (RO) Plant Manufacturer | SBS Water",
        description:
            "High-recovery industrial RO systems, standalone or integrated with CPU, WTP and ETP plants, with 85-90% recovery and permeate TDS below 100 ppm in RO-based CPUs.",
        breadcrumb: [
            ["Home", "index.html"],
            ["Services", "service.html"],
            ["Reverse Osmosis Systems", "services/reverse-osmosis-plant.html"],
        ],
        service: {
            name: "Reverse Osmosis (RO) Plant",
            serviceType: "Industrial reverse osmosis system design, manufacturing and commissioning",
        },
    },
    {
        file: "services/effluent-treatment-plant.html",
        path: "/services/effluent-treatment-plant",
        index: true,
        title: "Effluent Treatment Plant (ETP) for Sugar & Distillery | SBS Water",
        description:
            "ETPs for sugar, distillery and process industries combining physico-chemical, anaerobic, aerobic and tertiary treatment for pollution control compliance and reuse.",
        breadcrumb: [
            ["Home", "index.html"],
            ["Services", "service.html"],
            ["Effluent Treatment Plant", "services/effluent-treatment-plant.html"],
        ],
        service: {
            name: "Effluent Treatment Plant (ETP)",
            serviceType: "Industrial effluent treatment plant design, manufacturing and commissioning",
        },
    },
    {
        file: "services/sewage-treatment-plant.html",
        path: "/services/sewage-treatment-plant",
        index: true,
        title: "Sewage Treatment Plant (STP) Manufacturer in Pune | SBS Water",
        description:
            "MBBR-based Sewage Treatment Plants for industries, townships, commercial buildings and institutions, with tertiary filtration and ozone disinfection for water reuse.",
        breadcrumb: [
            ["Home", "index.html"],
            ["Services", "service.html"],
            ["Sewage Treatment Plant", "services/sewage-treatment-plant.html"],
        ],
        service: {
            name: "Sewage Treatment Plant (STP)",
            serviceType: "Sewage treatment plant design, manufacturing and commissioning",
        },
    },
    {
        file: "portfolio.html",
        path: "/portfolio",
        index: true,
        title: "Portfolio: CPU, WTP & ETP Plants Delivered in India | SBS Water",
        description:
            "Portfolio of SBS Water: 53+ condensate polishing, water treatment and effluent treatment plants delivered for India's sugar, distillery and biofuel industries.",
        breadcrumb: [["Home", "index.html"], ["Portfolio", "portfolio.html"]],
    },
    {
        file: "contact.html",
        path: "/contact",
        index: true,
        title: "Contact SBS Water | Water Treatment Engineers in Pune",
        description:
            "Contact SBS Water about ETP, ZLD, STP or water treatment plants. Call +91 85509 04904, email marketing@sbswater.in or visit our Shivajinagar, Pune office.",
        breadcrumb: [["Home", "index.html"], ["Contact", "contact.html"]],
    },
    {
        file: "get-a-quote.html",
        path: "/get-a-quote",
        index: true,
        title: "Get a Quote for a Water Treatment Plant | SBS Water",
        description:
            "Request a consultation for a new or upgraded ETP, ZLD, STP, CPU, RO or water treatment plant, with a scheme built around your water, capacity and reuse goals.",
    },
    {
        file: "careers.html",
        path: "/careers",
        index: true,
        title: "Careers at SBS Water | Water Treatment Engineering Jobs, Pune",
        description:
            "Join SBS Water & Infra Projects in Pune. We hire process design, site execution, commissioning, manufacturing and sales professionals for water treatment projects.",
        breadcrumb: [["Home", "index.html"], ["Careers", "careers.html"]],
    },

    {
        file: "blogs.html",
        path: "/blogs",
        index: true,
        title: "Blogs: Water & Wastewater Treatment Articles | SBS Water",
        description:
            "Articles from SBS Water on distillery effluent treatment, zero liquid discharge, condensate polishing and water reuse for sugar, distillery and process industries.",
        breadcrumb: [["Home", "index.html"], ["Blogs", "blogs.html"]],
    },
    {
        file: "blogs/distillery-effluent-treatment-zero-liquid-discharge.html",
        path: "/blogs/distillery-effluent-treatment-zero-liquid-discharge",
        index: true,
        title: "Distillery Effluent Treatment: Why ZLD Is a Paradigm Shift",
        description:
            "Learn what a distillery effluent treatment plant must handle, why treat and discharge no longer works, and how zero liquid discharge changes the design.",
        breadcrumb: [
            ["Home", "index.html"],
            ["Blogs", "blogs.html"],
            ["Distillery Effluent Treatment", "blogs/distillery-effluent-treatment-zero-liquid-discharge.html"],
        ],
        article: {
            headline: "Distillery Effluent Treatment: Inflows That a Plant Should Consider and Why ZLD Is a Paradigm Shift",
            image: { path: "assets/images/service-detail/etp-distillery.webp", width: 1200, height: 900 },
            datePublished: "2026-10-16",
            dateModified: "2026-10-20",
        },
    },
    {
        file: "blogs/condensate-polishing-in-sugar-mills.html",
        path: "/blogs/condensate-polishing-in-sugar-mills",
        index: true,
        title: "Condensate Polishing in Sugar Mills: What It Saves",
        description:
            "Sugar mills make tonnes of hot, near-pure water every day and often waste it. Here is how condensate polishing works and what reusing that water saves.",
        breadcrumb: [
            ["Home", "index.html"],
            ["Blogs", "blogs.html"],
            ["Condensate Polishing in Sugar Mills", "blogs/condensate-polishing-in-sugar-mills.html"],
        ],
        article: {
            headline: "Condensate Polishing in Sugar Mills: What It Is and What Reusing It Saves",
            image: { path: "assets/images/service-detail/svc-cpu.webp", width: 1200, height: 900 },
            datePublished: "2026-10-16",
            dateModified: "2026-10-20",
        },
    },

    {
        file: "404.html",
        index: false,
        title: "Page Not Found | SBS Water & Infra Projects",
        description: "The page you are looking for could not be found.",
    },
];
