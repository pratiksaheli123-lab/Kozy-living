import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

/**
 * Crawl budget is real money here. In Nov 2026 the Hobby plan's Fast Origin
 * Transfer went in two days, most likely to crawlers walking the shop's
 * filter links: every facet is a plain link and facets stack
 * (`?size=s-m%2Cl-xl&sleeve-detail=…&sort=…&page=…` × every collection), so
 * the URL space is effectively unbounded, and each one is a 400-650 KB render.
 *
 * - `/*?` keeps compliant crawlers off EVERY query-string URL: filters,
 *   sort, pages, `?colour=`, `?mood=`, kit-builder state, `?mobile=`, utm
 *   tags. The bare pages (`/search/bathrobes`, `/shop-by-colour`) and every
 *   product page stay crawlable, and the sitemap lists them.
 *   Filtered pages ALSO carry `noindex` (see `queryPageMetadata`), for
 *   crawlers that reach one from an external link.
 * - Bulk AI-training scrapers and SEO-tool crawlers are turned away
 *   entirely: they bring no shoppers. Search engines and AI *search*
 *   assistants (OAI-SearchBot, PerplexityBot, ChatGPT-User) are left in.
 * - robots.txt only binds polite bots. The rest are for Vercel Firewall's
 *   Bot Protection / AI Bots rules, which live in the dashboard, not here.
 */
const BLOCKED_BOTS = [
  // AI training crawlers
  "GPTBot",
  "ClaudeBot",
  "anthropic-ai",
  "CCBot",
  "Bytespider",
  "meta-externalagent",
  "Amazonbot",
  "Applebot-Extended",
  "Google-Extended",
  "GoogleOther",
  "cohere-ai",
  "Diffbot",
  "omgili",
  "ImagesiftBot",
  "Timpibot",
  // SEO tools and aggressive general crawlers
  "AhrefsBot",
  "SemrushBot",
  "MJ12bot",
  "DotBot",
  "DataForSeoBot",
  "BLEXBot",
  "PetalBot",
  "SeznamBot",
  "barkrowler",
];

export default function robots(): MetadataRoute.Robots {
  // A preview deployment is a full copy of the store on a `*.vercel.app`
  // host, and it bills the same quota. Nothing should crawl it.
  // (`VERCEL_ENV` is set at build time; it is unset locally.)
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        // `/_next/` is allowed explicitly because `/*?` would otherwise
        // catch `/_next/static/…?dpl=…` and `/_next/image?url=…`, which
        // Googlebot needs to render pages and index images. The longest
        // matching rule wins, so this beats `/*?`.
        allow: ["/", "/_next/"],
        disallow: ["/*?", "/api/", "/account"],
      },
      { userAgent: BLOCKED_BOTS, disallow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
