# Vercel hosting: the November 2026 pause and what keeps it from happening again

The storefront runs on Vercel's **Hobby** plan; Shopify is the backend. On
2026-11-02 Vercel paused the deployment for over-use. This document records
what caused it, what was changed in the code and in the Vercel dashboard,
how the result was measured, and what is still open.

The code-side rules are also in `CLAUDE.md` §17. Read this document for the
**dashboard settings** as well: they live in Vercel, not in the repo, and
nothing in git will tell you if one is switched off.

**Status (2026-11-04, 15:37 IST):** redeployed on a new Vercel account. The
bots are stopped, but at the current rate ISR Writes would pass the monthly
limit: see *The remaining problem* in §5.

---

## 1. What happened

| | |
| --- | --- |
| Launched | 2026-11-01 |
| Paused | 2026-11-02, for **Fast Origin Transfer** (function → CDN bytes) |
| Usage at pause | ~40 GB against Hobby's 10 GB/month; Active CPU 11h 1m against 4h |
| Requests | 763,758 in Nov 1-3: 56.8% via Ohio (`cle1`), 42.4% via Virginia (`iad1`), 0.2% via Mumbai (`bom1`) |
| Who | Crawlers running in US cloud regions, not Indian shoppers. No ads were running. |

## 2. Root causes

1. **Every page rendered on every request.** The root layout and the Navbar
   read `cookies()`, which makes every route dynamic (`private, no-store`).
   Nothing was served from the CDN cache.
2. **Each render is heavy**: `/` ~798 KB, `/search` ~656 KB, a product page
   ~466 KB.
3. **The shop's URL space is unbounded.** Every filter, sort and page is a
   plain link, and facets stack (`/search?size=…&sleeve-detail=…&sort=…&page=…`
   × every collection). `robots.txt` blocked nothing, so crawlers walked it.
4. **Links prefetched on sight.** Scrolling the homepage fetched ~1 MB of
   product pages nobody opened.
5. **Functions ran in Washington (`iad1`)**, Vercel's default, far from the
   shoppers.

## 3. Code changes

| Commit | Change |
| --- | --- |
| `5188df9` | `Link` comes from `@/components/ui/intent-link`: prefetches on hover / focus / touch instead of on sight. |
| `8c88961` | Cart read in the browser (`readCart()` server action), so the layout and Navbar no longer read cookies and pages are static / ISR again. `robots.ts`: `Disallow: /*?`, `/api/`, `/account`, and 23 AI-training / SEO crawlers turned away entirely; preview deployments serve `Disallow: /`. `noindex` + canonical on every query-string page (`queryPageMetadata`). `nofollow` on filter / sort / page links. `isPossibleHandle()` before any Shopify lookup on dynamic routes. `/api/search` CDN-cached (`s-maxage=300`), `q` capped at 80 chars. Image optimiser limited to this project's own Shopify file prefixes. One-week browser cache on `public/`. |
| `72aab60` | The viewport-cookie bootstrap can no longer reload forever (max 3 reloads per tab). |
| `a46c12f` | Vercel Web Analytics (`<Analytics />`). |
| `ea564e4` | The first hero film (6.3 MB) moved from `public/media/` to Shopify's CDN. No video is served by Vercel now. |
| `ae5cb1f` | `public/favicon.ico` and root `apple-touch-icon(-precomposed).png`. Browsers, iOS and crawlers request these fixed paths; without them each one fell through to `/[page]` and rendered a 404 page in a function. |

After any change to shared chrome (layout, Navbar, Footer, NewsletterBand),
run `next build` and check that `/`, the content pages and
`/product/[handle]` are still `○` / `●`, not `ƒ`. See `CLAUDE.md` §17.

## 4. Vercel dashboard settings

**These are not in the repo.** If any is switched off, the November traffic
comes straight back.

| Where | Setting | Why |
| --- | --- | --- |
| Settings → Functions → Function Region | **Mumbai, `bom1`** only | Shoppers are in India. A region change only applies to deployments made after it. |
| Settings → Domains | **`kozyliving.in` is primary**; `www.kozyliving.in` → 308 to it | Matches `SITE_URL`, the canonicals, the sitemap and Shopify's "Forward to headless" redirect. It was the other way round until 2026-11-04, so every canonical URL redirected. |
| Settings → Deployment Retention | On | Old deployments are deleted automatically. An old deployment's own URL keeps running in whatever region it was built for. |
| Firewall → Bot Management → **Bot Protection** | **Challenge** | Non-browser clients get the "Vercel Security Checkpoint". Verified bots (Googlebot, Bingbot…) pass. |
| Firewall → Bot Management → **AI Bots** | **On** (deny) | Blocks AI crawlers before any function runs. |
| Firewall → Project rules → **Allow robots.txt** | Request Path equals `/robots.txt` → **Bypass**. First in the list. | Blocked bots could not read `robots.txt`, so they never learned they were disallowed and retried forever. This lets them read that one file and nothing else. |
| Firewall → Project rules → **Block scanner probes** | **Deny** | Scanner paths (`/wp-login.php`, `/.env`…). Conditions as set in the dashboard. |
| Analytics | Enabled | `<Analytics />` reports nothing until this is on. |

Verified from outside on 2026-11-04, requesting with the user agents of the
blocked bots:

| Request | Amazonbot / GPTBot user agent |
| --- | --- |
| `kozyliving.in/robots.txt` | 200 |
| `www.kozyliving.in/robots.txt` | 308 → `kozyliving.in/robots.txt` |
| `/`, `/search`, `/sitemap.xml` | 403 / 429 (blocked) |

Any non-browser client, `curl` included, gets 429 on pages. That is Bot
Protection, not a fault. Test pages in a real browser.

## 5. Results (new account, 2026-11-04)

| Metric | At the pause (Nov 1-3) | After (first day) | Hobby limit |
| --- | --- | --- | --- |
| Fast Origin Transfer | ~40 GB | 22 MB | 10 GB / month |
| Active CPU | 11h 1m | 21s | 4h / month |
| CDN requests | 763,758 | ~1.1K | 1M / month |
| Function errors / timeouts | – | 0% / 0% | – |
| Traffic origin | 99% US data centres | ~67% Mumbai | – |

- **Function invocations:** 152 in 12h. `/search` leads (87 runs, ~115 ms CPU
  each). It is dynamic by design: shop state lives in the URL. `/` runs only
  for ISR refreshes (at most once a minute then; every 15 minutes since the fix below).
- **Firewall:** 1.5-1.7K requests a day denied, almost all **Amazonbot**
  walking `/search` with query strings (~75 every 5 minutes), plus GPTBot.
  **Total transfer to them: 0 B.** Without the firewall that was ~0.9 GB of
  Fast Origin Transfer a day from Amazonbot alone: the November pattern.
- **Origin transfer by region:** 18% shows in Washington (`iad1`) in bursts
  that line up with deployments (03:30, 08:30, 14:30-15:30 IST). Active CPU
  in `iad1` is only 2s, all before the region switch, so functions are not
  running there. Most likely deployment traffic rather than visitors; this
  is inferred from the timing, not confirmed.

### The remaining problem: a steady homepage rebuild

Figures from about 14 hours (to 15:37 IST), projected to 720 hours from the
hours with no deployment:

| Metric | So far | Per hour | Per month | Hobby limit |
| --- | --- | --- | --- | --- |
| ISR Writes | 7.6K | ~500 | **~360K** | 200K |
| Fast Origin Transfer | 140 MB | ~7.5 MB | ~5.4 GB | 10 GB |
| Active CPU | 2m 41s | ~10s | ~2h | 4h |

All three run flat through the night, so they do not follow shoppers. The
logs show the homepage rebuilding every 2m 47-48s, a machine-regular interval.
Nothing in the site's code runs on that timer, so something outside it is
requesting `/`, and each request after the 60s TTL triggered a rebuild. What
that requester is has not been confirmed. The suspects are two AWS addresses
in California, `13.57.148.235` and `54.183.149.156`, whose traffic is regular.

**Fixed in code:** the production TTL behind every Shopify fetch and the ISR
`revalidate` values went from 60s to 900s. A request every 168s now rebuilds
the homepage about every 17 minutes instead of every 3, roughly 6x fewer. The
projection is ~60K ISR writes, ~1 GB Fast Origin Transfer and ~20 minutes of
Active CPU a month, to be confirmed against Usage after a deploy. Setting
`SHOPIFY_CACHE_SECONDS` in Vercel overrides the default.

Still not cached: `/search` and `/search/[collection]`, which read
`searchParams` and render on every request. That was Googlebot's and Bingbot's
main cost in the same data (338 and 103 requests in 12h, 40.8% and 8% cached).

## 6. To check

**2026-11-05 / 06, after Amazonbot has had 24-48h to re-read `robots.txt`:**

1. **Firewall → Traffic → AI Crawlers.** Amazonbot's steady ~75 per 5 min
   should be falling.
2. **Usage → CDN Requests.** Observability counts denied requests (3K in
   12h). If Usage also bills them and Amazonbot does not stop, that is ~26K a
   day, ~780K a month, close to the 1M limit. Day one suggested denied
   requests are not billed (Usage showed 1.1K while 1.4K had been denied);
   confirm it.
3. **If both go wrong (still billed, still crawling): Plan B.** Add a Project
   rule: AS name Amazon **and** user agent contains `Amazonbot` → **Deny**,
   with a duration (a persistent action) if the plan offers one. Failing
   that, report it through developer.amazon.com/amazonbot.

**Weekly for the first month:** Usage → Fast Origin Transfer, Active CPU and
CDN Requests should grow with real visitors, not faster. Origin transfer
should be almost entirely `bom1`.

**Once:** share a product link on WhatsApp. If no preview card appears, Bot
Protection is challenging the preview fetcher, and it needs its own Bypass
rule.

## 7. Still open

In order of importance.

1. **Narrow the Shopify Admin token.** The custom app the site uses holds
   nearly every Admin scope (themes, orders, payments). The site needs only
   **metaobjects** (contact / B2B forms, add-ons, kit builder) and
   **customers** (newsletter). Reduce the scopes in Shopify Admin → Settings
   → Apps → the custom app → Configuration, then replace the token in
   Vercel's environment variables and redeploy.
2. **Hobby is for non-commercial use.** A live shop belongs on **Pro**
   ($20/month, with a spend limit). Until then a pause is possible however
   low usage is.
3. **A pause takes the whole shop down.** `shop.kozyliving.in` (Shopify's
   primary domain) runs the "Forward to headless" theme, which redirects
   every shopper to `kozyliving.in`. If Vercel pauses, shoppers land on a dead
   site.
4. **The 15-minute cache TTL (§5) delays Admin edits** by up to that long,
   unless the Shopify webhooks to `/api/revalidate` are registered. Check them
   in Shopify Admin → Settings → Notifications → Webhooks.

Smaller, from `CLAUDE.md` §10: two Shopify originals too large for Shopify to
resize (`Simple_Aesthetic_…_-_14/-_15.png`, `IMG_1283.png`), and the PWA
manifest has no square icon.

## 8. Do not undo

- Do not read `cookies()` / `headers()` or make a `no-store` fetch in
  anything rendered on every page.
- Do not import `Link` from `next/link`, and do not pass a bare `prefetch` on
  dynamic routes.
- Do not loosen `robots.ts` (`/*?` especially) or drop `nofollow` from
  filter links.
- Do not put video or large media in `public/`. Upload it to Shopify.
- Do not add middleware without a `matcher` that excludes `_next/static`,
  `_next/image` and files with an extension.
- Do not turn off Bot Protection, AI Bots or the `robots.txt` Bypass rule,
  and keep the Bypass rule first.
