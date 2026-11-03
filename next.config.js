/**
 * Shopify photography never goes through Vercel's image optimiser: every
 * remote image renders through `ShopImage`, whose loader asks Shopify's CDN
 * for each width directly (CLAUDE.md §6). `/_next/image` only serves the
 * small local assets in `public/` - icons, the textile letters, the GI mark.
 *
 * So the optimiser is configured to cost as little as it can on the Hobby
 * plan, where image transformations are metered and an overrun pauses the
 * deployment (as Fast Origin Transfer did in Nov 2026 - CLAUDE.md §17):
 *
 * - `remotePatterns` names only THIS project's two Shopify file prefixes.
 *   It used to allow all of `cdn.shopify.com/s/files/**` (every Shopify
 *   store on the internet) plus `**.myshopify.com` and two unrelated sites,
 *   so anyone could use `/_next/image?url=…` as a free resizer on our quota.
 *     0978/6723/5641 - the live store (customer accounts: shopify.com/97867235641)
 *     0700/6476/7047 - the dev store, which hosts the stills hard-coded in
 *                      `site.ts`. Keep the dev store, or those stills 404.
 * - WebP only. AVIF + WebP stored and transformed every variant twice.
 * - 31-day cache. The 4-hour default re-transformed every variant six times
 *   a day. A replaced local asset should get a new filename.
 */
const SHOPIFY_STORE_FILES = ["/s/files/1/0978/6723/5641/**", "/s/files/1/0700/6476/7047/**"];

/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    formats: ["image/webp"],
    minimumCacheTTL: 2678400,
    // Next's default list ends at 3840, but `ShopImage` caps every width at
    // 2048 (the fragment's own cap), so a 3840 candidate was a second copy of
    // the 2048 URL in every srcset - a few KB per page across ~1,200 URLs.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    remotePatterns: SHOPIFY_STORE_FILES.map((pathname) => ({
      protocol: "https",
      hostname: "cdn.shopify.com",
      pathname,
    })),
  },
  async headers() {
    // Files in `public/` are served by Vercel's CDN with `max-age=0`, so a
    // returning browser re-asks for every icon and poster on every visit. A
    // week is long enough to stop that, short enough that a replaced file
    // shows up. Hashed `/_next/static` assets already carry their own
    // immutable headers.
    //
    // The three root icons are fetched by browsers, iOS and crawlers by
    // fixed path whatever the <head> says. Without the files those requests
    // fell through to the `/[page]` catch-all and rendered a full 404 page in
    // a function, once per request.
    const week = "public, max-age=604800, stale-while-revalidate=86400";
    return [
      "/media/:path*", "/icons/:path*", "/kozy/:path*", "/logo/:path*", "/newsletter/:path*", "/favicon/:path*", "/font/:path*",
      "/favicon.ico", "/apple-touch-icon.png", "/apple-touch-icon-precomposed.png",
    ].map(
      (source) => ({ source, headers: [{ key: "Cache-Control", value: week }] }),
    );
  },
  async redirects() {
    return [
      { source: "/journal", destination: "/blogs", permanent: true },
      { source: "/journal/:slug", destination: "/blogs", permanent: false },
      { source: "/about", destination: "/about-us", permanent: true },
    ];
  },
};
