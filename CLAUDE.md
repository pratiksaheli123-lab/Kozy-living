# CLAUDE.md — Kozy Living storefront

**Read this file before starting any work in this repo.** It records the things
that are not recoverable from reading the code quickly: the design system's
hard rules, which copy is ours and which is the merchant's, the motion layer's
timing constraints, and the handful of traps that silently produce a wrong
result rather than an error.

When you change something this file describes, update this file in the same
pass.

---

## 1. What this is

A headless Shopify storefront for **Kozy Living** — a craft-led Indian textile
brand. Not furniture, not lighting, not homeware generally: **textiles**.
Cotton waffle weave, slub cotton, percale, linen blends and wool, designed
in-house and made with craft clusters across India, finished with traditional
Dabu hand-block printing.

|  |  |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| Styling | Tailwind 3.4 + a large hand-written `@layer components` in `globals.css` |
| Commerce | Shopify Storefront GraphQL API (`/api/2026-07/graphql.json`) |
| Motion | GSAP + ScrollTrigger, Lenis smooth scroll |
| Commands | `npm run dev` · `npm run build` · `npm run lint` |

> ⚠️ **`README.md` is stale and actively misleading.** It describes a previous
> incarnation of this project: a "Warm Ivory Oat / Terracotta / Amber Glow"
> palette, "artisanal furniture and warm ambient lighting", and FSC timber
> claims. None of that is true any more. Trust **this** file and
> `src/app/globals.css` for the design system, and `src/lib/site.ts` for the
> brand. Do not use the README as a source.

---

## 2. Brand voice — non-negotiable

Read the VOICE note at the top of `src/lib/site.ts` before writing any copy.

- **"Kompanions"**, not products, pieces or items.
- **"Krafted" with a K** is the house spelling of the branded verb. Never
  "correct" it to a C. See §6 for how this is enforced on merchant data.
  - The ordinary English word is still ordinary: "craft clusters",
    "craft-led", "handcrafted", "Craft Technique" are all correct as written.
    Only the standalone word *crafted* takes the K.
  - Owner-requested exceptions (2026-10-29), each confined to its line: the
    hero flag reads "Handkrafted by Indian kraft klusters" (`flag` /
    `flagMark` in `site.ts`), and the tagline / announcement read
    "Reimagined Indian kraft to give you moments of rest". Those two lines
    are the only places "kraft" and "klusters" take the K. Do not spread
    them to other uses of "handcrafted", "craft" or "clusters".
- **The K brand words** (owner's call, 2026-10-13). In our own copy these
  word families start with a K: kolour, komfort, kollection, kustom,
  konscious, konnect, Kompanion, korner, kozy (for cosy), kurated, krafted.
  Shop by kolour, Explore the kollection, Konsciously sourced.
  - Only these words. Other C words stay as they are: cart, checkout,
    close, choose, cotton, care, craft (the noun), clusters.
  - **Our copy only, not Shopify data.** Product, collection and menu titles
    are left as the merchant typed them (`house-spelling.ts` still makes
    only its two narrow swaps). Handles, URLs (`/shop-by-colour`), query
    params (`?colour=`), code names and product names quoted in copy
    ("Ritual Companion Set") keep their C.
  - **Order property names keep their C** (`kitBuilder.orderLabels.colour`
    is `Colour`): past orders carry it, and `/account` and the workshop read
    it.
  - The founder's note (`foundersNote`) is kept verbatim. Her words are
    hers to revise.
- Rest, ritual and intention. **Not** luxury, indulgence or "elevate".
- **Never invent social proof, certifications or figures.** This has been a
  real problem here: earlier copy carried an invented "4.9 / 2,400+ homes
  styled" star rating, FSC/OEKO-TEX/Fair Trade badges the brand has not
  claimed, a fabricated company timeline, and a four-person leadership team
  that does not exist. All were removed. `whyKraft.stats` now reads
  `100%` / `Dabu` / `In-House` / `Surplus` — mostly words rather than invented
  percentages, and every figure is a claim the brand actually makes.
- Unverified values are marked `TODO(brand)` in `site.ts` — placeholders that
  keep a surface from rendering empty. Do not present them as fact.
- The only named individual is the founder, **Khushi Faruqui** (Textile Design,
  NIFT Delhi). The only confirmed contact channel is Instagram
  `@kozyliving_`. Phone, email and studio address in `site.ts` are marked
  `TODO(brand)` and are **not** verified.

---

## 3. Design system

Full derivation lives in the comment block at the top of `src/app/globals.css`.
The essentials:

### Palette — four colours plus derived shades

| Token | Hex | Job |
| --- | --- | --- |
| `indigo` / `ink` / `coal` | `#23324B` | Type, wordmarks, dark panels, buttons |
| `cream` / `paper` | `#FFF6EB` | The page ground |
| `ivory` / `card` | `#F6F4F0` | Card and panel surfaces |
| `oat` / `tint` | `#E8D9C4` | Image plates, tints, type on dark |
| `sage` | `#A9BDAF` | The accent: seal, chips, statement fills |
| `sage-deep` | `#5F7178` | Hover, and small sage type on light |
| `sage-wash` | `#DBE1D9` | Soft fills |
| `muted` | `#5E6879` | Secondary copy (5.26 on cream) |

Cream is the ground and ivory the card, **not** the other way round. They sit
1.027 apart, and that sliver is what lets a rounded card read as a surface with
no border.

**ONE HARD RULE: oat against sage measures 1.43.** They may sit beside each
other as blocks; neither may ever carry type on the other.

Measured pairs in use: indigo/cream 12.05 · indigo/ivory 11.73 · indigo/oat
9.30 · oat/indigo 9.30 · sage/indigo 6.50 · indigo/sage 6.50 · sage-deep/cream
4.77 · muted/cream 5.26.

Flat `sage` measures **1.85 on cream** — it disappears on light grounds. Sage
type is only allowed on indigo. On cream use `sage-deep`.

### Type — two faces, two jobs

- **Franxurter** (`--font-display`, `.display-face`, `.wordmark`) — the display
  face. **Single weight.** Never apply a bold utility to it; the browser
  synthesises one and it is immediately visible at hero scale. This is why the
  `text-display-*` size utilities deliberately carry **no** `fontWeight`.
  **It has no italic.**
- **Plus Jakarta Sans** (`--font-ui`, `.serif`, `.body-mono`, `.ui-mono`, …) —
  everything else: nav, buttons, labels, body, product titles, captions, and
  every heading below `display-lg`. It ships a **real italic** variable font,
  so any italic emphasis must live on this face.

`.serif` is a legacy name. It is the **UI face at bold**, not a serif.

### Reusable classes (all in `globals.css`)

Layout `.shell` `.shell-tight` `.rule-x/y/t/b` ·
Type `.eyebrow` `.body-mono` `.ui-mono` `.spec-mono` `.micro-mono` `.serif`
`.display-face` `.wordmark` `.on-dark` ·
Controls `.btn-solid` `.btn-outline` `.btn-sage` `.action-btn(-solid/-glass)`
`.circle-btn` `.arrow-btn` `.link-arrow` `.chip` `.pill` `.badge` `.field-bare` ·
Surfaces `.plate` `.panel` `.panel-ink` `.panel-sage` `.panel-sage-wash`
`.glass` `.notch-tr` ·
Motion `.marquee-track` `.seal` `.seal-ring` `.rail`

**Prefer these over new one-off utilities.** Several are load-bearing geometry,
not convenience:

- `.notch-tr` is three tangent arcs composed as mask layers, sized to receive
  an `.arrow-btn` exactly. Do not replace it with a radial-gradient.
- A mask applies to an element *and its descendants*, which is why the corner
  arrow is a **sibling** of the masked plate, never a child.
- `.rail` sets `scroll-padding-inline: var(--gutter)` so the first cell lands
  on the page grid rather than flush to the screen edge.

### The social card renders outside the browser

`src/components/opengraph-image.tsx` has no access to `globals.css` or to
`next/font`, so it repeats the palette by hand - which is exactly how it spent
months drawn in the *previous* project's colours (espresso ground, amber
accent) with the title set in a generic `serif` this brand does not own.
`.serif` here is the UI face at bold, not a serif, which is very likely how
that got in. It is now indigo / oat / sage, set in Franxurter.

Its left column is a photograph, `site.socialImage` (owner's pick,
2026-10-15): a 4:5 portrait with its own type baked in, so it is shown
**whole** at the card's height (504x630), never cropped to 1.91:1 - a crop
that wide cuts off both of its lines of type. The file is fetched and inlined
before satori sees it, so a CDN failure drops the photograph (the panel then
fills the card) instead of 500ing the route. Replacing the photo means
updating its `width`/`height` too - the column is derived from them.

**`next/og` cannot use Plus Jakarta Sans.** It rasterises through satori,
which parses fonts with opentype and does not handle **variable** fonts -
handing it one fails deep in the parser and, because the image is streamed,
surfaces as a 500 on the route rather than as a catchable error. Both Jakarta
files here are variable. `staticFont()` in that file reads the sfnt table
directory and refuses anything carrying `fvar`, so a variable face degrades to
the default rather than taking the route down.

If you touch the palette, these two files do not follow automatically:
`src/components/opengraph-image.tsx` and `src/app/manifest.ts` (whose
`theme_color` tints the browser chrome on Android).

### Signature motifs

The giant lowercase `.wordmark` bleeding past its frame, whose **O is a
photograph of the Dabu block print** (`public/kozy/o.png`, cut to the letter)
rather than type — `WordmarkBand` pins it by *height* to the Franxurter O's
0.586em and takes its width from the artwork's trimmed 474x512 ink box, with a
side bearing that keeps the substitution advance-for-advance · the rotating
sage `.seal` (the closing CTA, the story chapter marks, and back-to-top — it
stood in for that O until the textile letter replaced it) ·
the hand-drawn ellipse `CircledWord` · the `.arrow-btn` parked in a notched
card corner · the `Plate` photographic card.

`Plate` (`src/components/ui/plate.tsx`) is the single funnel for **every**
image on the site — radius, notch, corner arrow, caption, scrim and the toned
placeholder all live there. `src` is optional on purpose: without one it
renders a designed oat placeholder carrying the plate's label as ghost display
type, so a missing shoot reads as a graphic panel rather than a broken image.

---

## 4. Content model — know which half you are editing

**Roughly half the words on this storefront are not in this repo.**

| Source | What it holds |
| --- | --- |
| `src/lib/site.ts` | All editorial/marketing copy. Hero, statements, lookbook, about page, FAQ, footer, newsletter, the homepage story band. One file so the voice can be revised in one pass. |
| **Shopify Admin** | Product titles and descriptions, collection titles and descriptions, **the entire navigation menu**, blog articles, images, prices, colour metaobjects, and the personalisation add-ons (§13). |

**There is deliberately no hard-coded nav in this repo.** The header, mobile
drawer, search overlay and homepage category rail all read the Shopify menu via
`getPrimaryMenu()`, which tries `NEXT_PUBLIC_SHOPIFY_MENU_HANDLE`, then
`main-menu`, then `kozy-living-menu` (this store uses `main-menu`). A
hard-coded fallback list silently replaced the real menu for months and shipped
links to collection handles the store never had — do not reintroduce one.

The menu is on the **same cache TTL as every other Shopify call** (none in dev,
60s in production) and memoised per request with React `cache()`. It used to
be `no-store`, and because the header awaits it outside any Suspense boundary,
every page on every request waited on a live Shopify round trip before sending
its first byte — warm TTFB measured 0.5–0.7s, now 0.01–0.05s. A menu edit in
Admin now takes up to a minute to reach production. Do not put it back on
`no-store`; if instant menu edits ever matter, revalidate a tag instead.

### The footer — `kozy-living-footer`, same rule

`components/layout/footer.tsx` reads the **`kozy-living-footer`** menu through
`getFooterMenu()` (`SHOPIFY_FOOTER_MENU_HANDLE` overrides; if nothing resolves
it falls back to the primary menu, never to a list in this repo). Shopify's
default `footer` menu is deliberately not tried - here it holds one "Search"
link. How the menu maps onto the panel:

- top-level items **with children** → plain columns headed by their own
  (linked) title; `--cols` holds them on one row from `xl`, `auto-fit`
  below; a `<details name>` accordion below `md`;
- top-level items **without children** (Home, Contact Us - and any group the
  merchant empties, e.g. Kessentials as of 2026-10-14) → one last column
  under the brand name (`footer.more`);
- the legal row is **`getShopPolicyNames()`** - only policies the merchant
  has written - with the small back-to-top seal at its end. Every
  `/search/<handle>` and `/policies/<handle>` link is guarded against what
  exists (the guard stands down if the lookup fails).

Plain headings and sentence-case links are the owner's call (2026-10-14):
pill-headed columns read as buttons, small tracked caps read slowly, and the
standalone items as CTA pills looked like a second menu. A photo strip of
studio stills was tried as a top row and removed.

Copy is `footer` in `site.ts`. It names only Instagram: the old hand-written
columns carried Pinterest/YouTube links to those sites' home pages and the
unverified `care@` address. The footer is on the page's **cream** ground
(owner's call, 2026-10-14 - it was an indigo panel for a while); indigo is
reserved for the newsletter band above it. The closing wordmark ("kozy
living", textile O, ink) deliberately echoes the hero's. It is an endless
full-bleed ticker on `.marquee-track` (two runs of three `WordmarkBand`
copies - each run must stay wider than the widest screen or the -50% loop
shows a seam), shown whole above the legal row; it was once a single copy
cut off by the page's end.

**The newsletter is not in the footer.** It stands above it as its own card,
`components/layout/newsletter-band.tsx` (rendered in `layout.tsx`, copy
`letterBand`): a narrow `Plate` photograph (1/5, `md`+ only) beside an
indigo panel (owner's call, 2026-10-14 - it was sage). Copy and form sit
side by side from `lg` to keep the band short. The form's button is the
`outline` (ivory) pill: the solid one is indigo on indigo.

**Shop policies are not pages.** They live on `shop`, so `[page]` 404'd every
policy link. `app/policies/[policy]` serves them at Shopify's own path, which
is what a SHOP_POLICY menu item normalises to.

### Enquiry forms — both write `contact_message`

The contact form (`components/contact/`) and the B2B form on `/b2b-enquiries`
(`components/b2b/`) are server actions that create a `contact_message`
metaobject through the Admin API (`lib/shopify/admin.ts`). They share one
inbox in Admin → Content → Metaobjects, told apart by the `source` field
(`storefront-contact-form` / `storefront-b2b-form`). That definition has no
trade columns, so the B2B action writes company, business type, products and
quantity as labelled lines at the top of `message`. Giving them real fields
means a separate `b2b_enquiry` definition. Do not add fields to
`contact_message`: the contact form would then have to satisfy them.

- The B2B honeypot is named `website`. **`company` is the contact form's
  honeypot but a real, required field on the B2B form**, so do not copy the
  honeypot across by name.
- React 19 resets a form after its action runs. The B2B action echoes
  `values` back on failure, and the fields re-seed from them through
  `defaultValue` / `defaultChecked`.
- Picking the **Kustomised** quantity opens a required `customQuantity`
  field; the action requires it only then and stores
  `Kustomised - 2,500 units`. `form.custom.option` in `site.ts` must match
  that entry in `quantities` verbatim, or the field never opens.
- `/b2b-enquiries` shadows the empty Shopify page of the same handle, the
  same way `/founders-note` does. Its choice lists are in `b2bEnquiry` in
  `site.ts` and are stored as label text.

### Handles vs titles

A **handle** is an identifier that appears in URLs and in Shopify lookups. A
**title** is copy. Never rewrite a handle in code to fix a spelling — the
lookup will 404. Handles are renamed in Shopify Admin, with a redirect.

---

## 5. Homepage section order

`src/app/page.tsx`. Sections are mostly `Suspense`-streamed server components.

```text
Hero (bento + wordmark band)
CollectionFilters         ← Suspense   category pills, directly under the hero
BoldStatement (+ staggered lookbook)  ← Suspense
Bestsellers               ← Suspense
ShopByColour              ← Suspense
ShopByMood                ← Suspense   expanding mood panels ("Start with a moment")
StandardsTicker
KitAtelierSection         ← Suspense   the Kustom kit builder (§15)
CuratedEdits              ← Suspense   ("New Kompanions")
StandardsTicker (reverse)
StoryBand  ("Our story")  ← Suspense
RestTicker
Spotlight                 ← Suspense
Journal                   ← Suspense
StandardsTicker
ClosingBand
```

The order is merchandise first, story second - the pattern the comparable
stores share (Brooklinen, Parachute, Okhai, Jaypore: hero → categories →
products → why-us → story → journal). The pills are the category row under
the hero; on a phone they are one swipeable row, not a four-line wrap.
**Products repeating across the rails, spotlight and lookbook is deliberate**
(the owner's call): a shopper meets the core Kompanions wherever they land.
Do not de-duplicate them.

`BoldStatement` is behind Suspense (with `StatementFallback`) because it sits
below the hero's full-viewport frame; unwrapped, its Shopify lookups held the
first byte of the whole page.

### The paged lookbook (under "The In-Between Luxury")

`BoldStatement` resolves the data; `src/components/home/lookbook-deck.tsx`
(client) renders it. The four staggered plates are **pages of `lookbook` in
`site.ts`**, turned together by one prev/next pair above the cluster. Keep
that list a multiple of four. The zigzag belongs to the four *slots*
(`DROP` in the deck), not to the entries.

- Entries with empty `images` borrow their collection's product photography.
  Collections here share products heavily, so frames are deduped across the
  whole deck with `imageKey()` (`src/lib/shop/gallery.ts`). Compare with that,
  **not** with URLs: the image fragment's transform renames the file
  (`IMG_1695.png` → `IMG_1695_2048x.png.webp`).
- An entry with `product` set is one Kompanion, not a shelf (the His & Her
  Ritual Kit is a Shopify *product*, not a collection): it links to
  `/product/<handle>` and borrows that product's photographs, with `handle`
  as the fallback destination if the product is gone.
- Only the first page carries `data-reveal`. Pages mounted by a click use
  `reveal={false}` and the `.lookbook-turn` CSS entrance. A `data-reveal`
  element mounted after its scroll trigger has passed would sit at opacity 0.

The story band sits where it does on purpose: it says who works the fibres and
why. The icon ticker above
it (the page's second of three) replaced a static fibre strip; the band that
used to sit before it, `ExperienceBand`, was removed.

---

### Product-page discovery and studio note

The product page follows the gallery and buy panel with `CategoryShelf`, then
compact `StudioNote`, category FAQ, the "Kompanion of the Month" ticker, and
the original "You May Also Like" carousel using `ProductCard`. Copy lives in `productStudio` and
`productDiscovery` in `site.ts`; both sections keep the existing palette/fonts.

The category shelf complements automatic Shopify recommendations. `sameCategoryFor`
uses actual collection membership, prefers deeper menu categories, then the
smallest matching collection with other products. It excludes the current
product and generic promotional shelves; no membership means no shelf. The
lightweight catalogue supplies up to four sample-style cards, with a link to
the selected live collection. These discovery cards link to product details.
The shelf header is a compact title and outline collection CTA, with no
eyebrow, description, or separate category/count row.

## 6. The Shopify layer

`src/lib/shopify/index.ts`. Everything from the API passes through a
`reshape*` function on the way in — these are the choke points, and the right
place to add anything that must apply site-wide:

`reshapeProduct` · `reshapeCatalogProduct` · `reshapeCollection` ·
`reshapeMenuItem` · `reshapeArticle` · `reshapeCart` · `reshapeImages` ·
`reshapeAddOn`

`reshapeCart` also **nests add-on lines under their parent** and recomputes
`totalQuantity` from the parents - see §13.

### House spelling normalisation

`src/lib/shopify/house-spelling.ts` enforces **Krafted-with-a-K** on merchant
copy as it crosses into the app, applied at the reshape choke points above.

This exists because the spelling problem is in **Shopify data, not the code**.
The store carries a collection titled `Crafted by Kozy bathrobes` one click
away in the nav from `Krafted by Kozy`. Normalising centrally covers the shop
heading, breadcrumb, nav, search results, cards and the `<title>` sent to
Google in one rule.

There are **two** rules, both narrow and case-preserving:

```text
Crafted      → Krafted     crafted → krafted     CRAFTED → KRAFTED
Pet Collection → Pet Kollection  (only after "Pet", only as whole words)

untouched: handcrafted · hand-crafted · craft · craft clusters ·
           Craft Technique · "this collection is empty" · carpet collection ·
           Pet Collections · handles like krafted-by-kozy and pet-collection
```

The bare noun is never touched. "Kollection" is the name of one shelf, not a
replacement for a word the storefront's own chrome says constantly.

Applied at every reshape choke point, **including the nested `collections`
array on a product** — those titles travel with the product and get rendered
downstream as badges and labels, and they were missed on the first pass.

### Known Shopify data defects (fix in Admin, not in code)

- The live store (2026-10) renamed six handles, and the code follows them
  (`docs/store-migration.md` §10.2): `krafted-by-kozy`,
  `krafted-by-kozy-bathrobes`, `krafted-by-kozy-slippers`,
  `kessentials-slippers`, `decorative-throw-pillows` (was
  `dabu-printed-pillows`) and `decorative-shaped-pillows`. A stale handle
  fails silently: the guard below turns the link into `/search` and a
  lookbook plate with no stills renders its blank oat placeholder (that is
  how "Krafted by Kozy" and "Dabu Pillows" went photo-less on the homepage).
- Collections `kozy-lounge` and `blend` do not exist, and nothing asks for
  them any more (2026-11-04): every homepage regeneration was logging three
  "No collection found" lines. The hero's #KRAFTEDKOMPANIONS tile reads
  `krafted-by-kozy`; story card 04 has `collection: null` (its still and
  `/search`) until a floor-lounging collection exists; "New Kompanions" reads
  the whole catalogue newest-first directly. (The homepage Bestsellers rail
  used to ask for a non-existent `popular`; it now reads the merchant's
  `bestsellers` collection, in its Admin order.) A "No collection found" line
  in the Vercel logs means a hard-coded handle has gone stale.

### Guard the handle, always

This storefront **404s an unknown collection** (a typo must not render as "this
collection is empty"). So any hard-coded handle must be checked before it
becomes a link:

```ts
const live = new Set((await getCollections().catch(() => [])).map(c => c.handle));
href = live.has(handle) ? `/search/${handle}` : fallbackHref;
```

`BoldStatement`, `HeroProductTiles` and `StoryBand` all do this. Keep it.

### Image sizing — set once, in the fragment

`src/lib/shopify/fragments/image.ts` is the single choke point every image URL
passes through, and it carries
`url(transform: { maxWidth: 2048, preferredContentType: WEBP })`.

This is not a nicety. The originals on this store are enormous — a product
shot measured 3375x4219 and **9.44 MB** — and Next's optimiser has to download
the whole file before it can resize it, once per width variant. A product page
asks for a dozen of those at several widths, the optimiser gives up at 7s, and
the page fills with `/_next/image … 500` and broken frames. Shopify's own CDN
does that first resize in about a second instead.

Both arguments are load-bearing: capping alone left PNGs as PNGs, and a 2048px
PNG of a photograph is still 6.55 MB. WEBP rather than JPG because these
images have alpha.

`fragments/cart.ts` spells its image fields out instead of spreading this
fragment, so it repeats the cap at 512 (a cart thumb renders at ~64px). If you
add another place that selects `Image.url` by hand, cap it there too.

⚠️ **Comments inside these fragments must be GraphQL `#` comments.** They live
inside a JS template literal, and a `/* */` comment containing backticks
closes the string early — which is a parse error that points at the wrong
line.

⚠️ `width` and `height` still describe the **original**, not the transformed
URL. Nothing reads them today — every surface renders through `next/image`
with `fill` — but do not assume they match the bytes you fetched.

### Shopify images skip Next's optimiser entirely — `ShopImage`

`src/components/ui/shop-image.tsx` wraps `next/image` with a loader that asks
**Shopify's CDN** for each srcset width directly: it resizes at the edge,
negotiates WebP from the browser's `Accept` header and caches for a year. A
384px card variant is ~42 KB, fetched straight from the CDN, where the
optimiser used to pull a multi-MB original through this server to make it.
**Every component that renders a remote image imports it as `Image` from
there** (Plate, the rotator, gallery, cart, tiles, search results…).

- Transformed URLs carry their size in the **filename**
  (`IMG_4114_2048x.png.webp`) and Shopify **ignores** `?width=` on those. The
  loader rewrites the `_2048x` suffix; `?width=` is only for raw file URLs
  (the stills hard-coded in `site.ts`). Capped at 2048.
- It is a wrapper, not `images.loaderFile`: a global custom loader makes
  next-server 404 `/_next/image`, which every *local* asset still needs.
- Next 16's `priority` only preloads; it no longer sets `fetchpriority`. The
  wrapper adds `fetchPriority="high"` for priority images.

### Image reels — `ProductImageRotator`

Every layer of a reel sits in the same box, so every mounted `<img>` is "in
view" and lazy loading fetches it at once. The reel now **mounts a shot one
interval before its turn** (on screen + next); it used to mount all of them,
and also "preloaded" every ORIGINAL with `new Image().src` outside the srcset.
Together those pulled ~100 photographs before the loading curtain lifted.
`priority` is passed down from the plate — only the hero tiles are in the
first viewport — never hard-coded on every reel's first shot.

### Local assets are sized for their largest use

`next/image` without `sizes` builds its srcset from the file's **intrinsic
width**, so a 1303px icon painted at 80px requested 1920/3840px variants. The
icons are now ≤256px, `gi-tag.png` is 189x320 (was 2528x4288, 7.8 MB), and the
JSON-LD/manifest/postcard use `public/logo/kozy-logo-web.png` (720x405,
56 KB). The favicon is `public/favicon/` - the puffed K from Shopify's
`IMG_6217.png`, trimmed to the letter and squared (32 and 192 transparent;
the 180 touch icon on cream, since iOS paints transparency black).
`public/favicon.ico` (16/32/48, from the 192) and the two root
`apple-touch-icon*.png` copies exist only because browsers, iOS and
crawlers request those fixed paths whatever the `<head>` says; without them
each request was a 404 rendered by the `/[page]` function (§17). Regenerate
them when the mark changes. The 3.2 MB masters in `public/logo/` are untouched; do not point
anything that renders on every page at them.

**The header logo is Shopify's file, not that one.** `LogoSquare` (header and
phone drawer) renders `site.logo` - `Untitled_design_20261019_144701_0000.png`
(3375x4219 portrait canvas: puffed KOZY, LIVING, "Rooted in Rituals"; swapped
in 2026-10-28) - through `ShopImage`, with `crop=region` in the URL so the
CDN trims it to its ink box (2156x1022 with margin) before resizing. That
is why the URL carries crop params and why `width`/`height` are the cropped
box. ⚠️ The crop is in the file's own pixels, tied to that upload's `v=`:
when the artwork was re-uploaded once before, the old crop ran off the new
canvas and cut the logo off. Replacing the artwork means
re-measuring its ink box and updating the URL, `width` and `height` together.

`public/icons/categories/` holds the category rail's illustrated icons
(owner's set, 2026-10-15), cut from the Shopify uploads: trimmed to the ink
box and capped at 128px (the originals are ~2 MB each). `slippers.png`
arrived with a grey checkerboard painted into its pixels and no alpha; it
was flood-filled out. `categoryIcon()` in `collection-pill-rail.tsx` picks
one by matching the menu item's title and path ("kit" first, so Ritual Kits
and Custom Kit share the kit bag); anything unmatched falls back to a
react-icons glyph. The drawing's box is centred on the pill's end cap (28px
in the 44px pill, 32px in the 48px one) so its corners clear the curve; a
bigger box runs into the border. The well has no ground, and on the indigo states the
drawing gets a cream hairline (`drop-shadow`) because its deep green
vanishes on indigo.

`public/kozy/` holds the two block-printed textile letters, and unlike
`public/logo/` **no master is kept here** — both were delivered at 1254x1254
and ~2.5 MB, and both were deleted once the shipped file was cut. Re-cutting
either one means going back to the source artwork outside this repo.

- `o.png` (474x512, 148 KB) is the wordmark's O — see §3.
- `k.png` (178x192, 27 KB) is the separator in the footer's wordmark
  ticker (sized `0.4em`, so it scales with the ticker) and the category rail's separator
  (`.cat-pill-sep`, in place of the `✳` that was there). It is one `src`
  repeated ~40 times down the rail — the marquee carries several copies of the
  menu — so it is one request however long the menu gets.

Both are **trimmed to their ink box**, and that is load-bearing rather than
tidiness: `WordmarkBand` derives the letter's aspect ratio from the file's
dimensions, so re-exporting with transparent padding silently shrinks the O
inside the word, and `.cat-pill-sep-mark` sets height with width auto for the
same reason. The caps are sized from the largest render — the hero type tops
out at 16rem, so the O paints at ~150px (~300px at 2x); the separator paints
at 20/24px.

Fonts ship as subset **WOFF2** (402 KB of TTF → 127 KB). The TTFs stay only
for the social card, because satori cannot parse WOFF2 — see the note on the
font block in `layout.tsx`.

### Shop URL state

`src/lib/shop/filters.ts` — **every** piece of shop state (collection, query,
sort, each facet, price band, page) lives in the URL and nowhere else. A filter
is a link, not a click handler. That is what makes the shop server-rendered,
shareable, back-button-correct and functional without JS. Do not move shop
state into React state.

**Pagination** runs on three grids with one rule. Page size depends on the
device, decided on the server by `isMobileRequest()`
(`lib/shop/viewport.ts`: `?mobile=` override, then the `kozy_is_mobile`
cookie, then the user agent):

| | desktop | phone |
| --- | --- | --- |
| `/search` | 24 (`PRODUCTS_PER_PAGE`) | 10 |
| `/shop-by-colour`, `/shop-by-mood` | 12 (`SHELF_PER_PAGE`) | 6 |

The curated shelves page smaller because their sets run to ~20 and would
never turn at 24; 12 fills whole rows at 2, 3 and 4 columns. Page 1 is never
written, and a non-canonical `page` (1, 0, past the end, or set with nothing
chosen) redirects. `colourHref(key, page)` / `moodHref(key, page)` build the
shelf URLs. On the shelves, `PagedShelf` (`components/shop/paged-shelf.tsx`)
wraps grid + `Pagination` (`scroll={false}`): it glides to the shelf top
itself and dims the old page under a "Turning to page N…" chip.

⚠️ **Pending UI state must be dropped when the URL value changes, not just
compared against it.** `PagedShelf` and `MoodShop` both read "pending while
the URL still shows the value it was clicked FROM", and Back returns to
exactly that value: the chip came back and stuck, and a mood the shopper had
left showed as chosen. Both now reset in render when the prop changes.

### Variants — the price follows the selection

24 of the store's 92 products are priced per variant (a shirt runs ₹1,200 →
₹4,000 by size). The buy panel's price is `ProductPrice`
(`components/product/product-price.tsx`): it reads "from" plus the range floor
until the picker resolves to one variant, then shows that variant's price,
its `compareAtPrice` if it is higher, and the variant's own sold-out state.
It used to show `minVariantPrice` whatever was picked, while the cart charged
the real variant.

- **`useSelectedVariant()` is the one resolver.** The price and `AddToCart`
  both read it, so the price shown is always the price charged. Do not resolve
  the variant a second way anywhere on the panel.
- **Cards DO pick a variant now - out loud** (owner's call, 2026-10-01,
  reversing the earlier "never pick" rule for speed to checkout). See
  *Card buying* in §13 for how the pick is made, shown and undone. The table
  row's `QuickAdd` still only adds single-variant products.
- Variant images are not switched by the gallery: as of 2026-10-01 no product
  has a different image per variant. If the merchant starts adding them,
  select `image` on the variant and drive the gallery from the same hook.

### Shop by mood — `/shop-by-mood`

The sibling of `/shop-by-colour`, on the same contract: one mood at a time,
every choice a plain link, `?mood=<handle>` is the state, and step two stays
empty until a mood is picked. The moods are **`shop_mood` metaobjects**
(`name`, `description`, `sort_order`) referenced by the product metafield
**`custom.shop_mood`**. The names and descriptions are merchant copy in Admin;
only the page's framing is `shopByMood` in `site.ts`.

- `lib/shop/moods.ts` does the merge that `palette.ts` does for colour:
  metaobjects lead the order, the catalogue fills the counts, and moods only
  products still carry trail at the end. A mood with nothing tagged renders as
  a dimmed "coming soon" row (Gifting Rituals, as of 2026-10-01).
- ⚠️ **Moods ride on the product as their own `moods:` alias** in
  `productCardFragment`, not inside `metafields`. `productColours()` takes the
  first `metafields` entry that has a value, so a mood placed there would be
  read as a colour on every product that has no colour.
- **The page states its own two steps** (owner asked for it to be easy to
  understand end to end): "1 Pick a mood" heads the list, "2" heads the
  shelf. Keep both labels; a first visit should need no reading.
- **The list** (`components/shop/mood-index.tsx`): every row shows number,
  name, the merchant's line and count AT REST - nothing folded away, nothing
  open until chosen. The chosen row floods indigo with a "Selected" flag and
  unfolds a photo strip, "See them below" and "Clear". Every row head is a
  plain `<Link>` to `?mood=<handle>#kompanions`, so it works with JS off.
  Beside it (`lg`+) the stage photograph is tagged "Preview" or "Selected";
  with nothing chosen it walks through the moods by itself (`CYCLE_MS`,
  desktop + fine pointer only, never under reduced motion, only on screen)
  and the row it shows draws a progress line.
- **Below `lg` the list is replaced by a photo rail**
  (`components/shop/mood-rail.tsx`): one swipeable card per mood with its
  lead photograph, count, line and a "Shop this mood" pill, plus dots and an
  "02 / 06" counter. Six text rows put ~1,100px between the headline and the
  first Kompanion on a phone, and the stage (the only mood photography) is
  desktop-only. The chosen card is RINGED, not flooded, and brings itself
  into view on arrival. ⚠️ It aligns to the card's START edge (the snap
  point), never the centre: on a tablet a centred position fell between two
  snap points and the browser snapped back to the first card. On phones the
  shelf's chrome (switcher chips, masthead, next-mood card) is trimmed in a
  `max-width: 639px` block.
- **The shelf**: a sticky chip switcher (`MoodSwitcher`, under the header)
  so moods can be changed from deep in the cards; a "Next mood" card at the
  foot (`MoodNext`); "Clear mood" in the masthead. The old prev/next arrows
  were replaced by the chips.
- **Click state is shared** by `components/shop/mood-shop.tsx` (`MoodShop`
  provider around both sections): `pending` marks the clicked mood chosen at
  once (valid only while the URL still shows the mood it was clicked from)
  and `MoodResults` dims the old shelf under a `Gathering <mood>…` chip until
  the server answers. ⚠️ **Lenis's `anchors` option smooth-scrolls on any
  same-path `#hash` click, from a `window` listener.** Left alone it carried
  the page away before the row had turned, so `choose()` stops the click's
  propagation at React's root and scrolls itself - 450ms later from the
  list, at once from the chips. The route hairline listens in the capture
  phase and is unaffected.
- The stage wipes between moods with `Plate galleryTransition="wipe"`
  (`.plate-wipe` in `globals.css`): the outgoing still is held for longer
  than a wipe takes, so a pointer running down the list never exposes the
  oat ground. The chosen row's height is `grid-template-rows: 0fr → 1fr`.
- Everything that mounts after a click enters on keyed CSS (`.mood-turn`,
  `.mood-card-in`, `.mood-stage-*`), not `data-reveal`.
- **The homepage teases it** with `components/home/mood-panels.tsx`, after
  Shop by colour: one tall photograph per LIVE mood (max 5), in **equal
  shares at rest** (owner's call - nothing open, so no mood reads as the
  pick). The one under the pointer or holding focus opens wide
  (`flex-grow`); leaving the ROW (not a panel - the gaps are inside it)
  settles it back. Below `lg` it is a snap rail. On a
  touch screen at `lg`+ the first tap opens a panel and the second follows it
  - read at `pointerdown`, because a tap focuses the link (which opens it)
  before the click arrives. Titles are pinned to a CLOSED panel's width and
  descriptions to an OPEN one's (`--unit`, from `100cqw` of `.mood-panels`),
  so no text re-wraps mid-animation.
- `moodEntries` claims lead photographs **scarcest first**: a mood with one
  Kompanion picks before one with eleven. In index order, Rest as a Ritual
  took Shared Lounging's only photograph and the two showed the same picture.
- Moods are not a facet in the `/search` sidebar. Adding one means teaching
  `facets.ts` to read `product.moods` and reserving `mood` in `RESERVED_PARAMS`.

---

## 7. Motion — and the rules that keep breaking

`src/components/motion/motion-provider.tsx` drives motion from **data
attributes scanned from the DOM**, not from wrapper components:

```text
data-reveal         fade + rise on enter
data-reveal-group   stagger this element's children instead
data-reveal-media   (inside either) photo settles from scale 1.12 — Plate sets it
data-split          words rise out of masks — markup from motion/split-text.tsx
data-magnetic       leans toward the cursor (fine pointers only)
data-parallax       drifts against scroll, for large photography
(no attribute)      every .marquee-track speeds up with scroll velocity
```

**Split headlines.** `Headline` at `xl`/`lg` splits by default (`split={false}`
opts out); the hero statements, the bold statement, `WordmarkBand`, the closing
"shop now" and the newsletter band heading are split by hand with `splitText()`. The
split is emitted **in the render**, never done at runtime — a runtime splitter
rewrites text nodes React owns. Components inside a split (e.g. `CircledWord`)
travel whole as a `.split-unit`. Split by **word, never by glyph**: Franxurter
has 2,104 kerning pairs and a glyph in its own box cannot be kerned.
A split near the very end of a page can never climb to the default
`top 92%` start (the footer wordmark tops out at ~93% on a phone), so it
sets its own with `data-split-start` (`WordmarkBand`'s `revealStart`).
**Do not use `clamp()` for this** - it also clamps the start to 0, and a
trigger starting at 0 never fired at scroll 0: the hero headline stayed
hidden. The mask is
a `clip-path` in `em` (see the comment in `globals.css`) — not
`overflow: hidden`, which moves the baseline, and not percentages, which broke
on `leading-[0.8]`.

**The curtain hands over early.** `LoadingScreen` fires `kozy:loader-exit` and
drops `data-loader` (scroll + clicks unlock) as the panels *start* to lift; the
motion layer's first scan runs then, so the first fold arrives while it is
being uncovered. `kozy:loader-done` follows when the curtain unmounts. Floors:
1300ms from navigation start **and** 1000ms after first contentful paint (the
CSS entrance in `.loader-char` is timed against these — move them together).
It waits for fonts and the images in the first viewport, **not** `window.load`.

⚠️ In `next dev`, React's double-mount runs `LoadingScreen`'s cleanup at
hydration, which drops `data-loader`. The effect now re-sets the attribute
when it runs again. Without that, `kozy:loader-exit` never fired in dev, and
every first-fold reveal waited for `loader-done`, after the curtain had
already cleared. If first-fold animations look late in dev only, check this
first.

**Navigation feedback.** `RouteProgress` (a sage hairline, in the root layout)
starts on a same-origin link click heard in the *capture* phase — `<Link>`
cancels the event in its own handler — or a `method="get"` /
`data-route-progress` form, waits 120ms so prefetched routes never flash it,
and finishes when the pathname or query commits. `product/[handle]/loading.tsx`
gives product navigation an instant skeleton.

Reveal targets start hidden **in CSS**, under `prefers-reduced-motion:
no-preference`, so the hidden state is correct before first paint with no class
on `<html>`. A head-script watchdog force-shows everything if the motion layer
never reports in — a JS failure degrades to an unanimated page, never a blank
one.

### Rule 1 — the motion layer never touches an unhydrated node

Streamed HTML is in the DOM before React hydrates it, and an inline style
written in that gap is a genuine hydration mismatch, after which the tree is
not patched. This bit twice while it was an authoring rule ("never put
`data-reveal` inside Suspense").

It is now **enforced in the motion layer**: a node without React's
`__reactFiber$` key is skipped, left unclaimed, and retried every 100ms
(bounded). So `data-reveal` inside a streamed section is safe. The old
workarounds — `Spotlight`'s `reveal={false}`, `StoryBoard` running its own
`useGSAP` entrance — still work and were left alone. That key is a React
internal: if reveals ever stop firing after a React upgrade, check it first.

### Rule 1b — start states before paint, triggers a frame later

On a route change the scan runs inside `useGSAP`'s layout effect, so start
states are on before the new page paints (it used to be a rAF late: a group
painted visible, vanished, then animated in). Triggers are armed **one frame
later**, because Next resets the scroll after this effect and a trigger armed
against the old scroll position fires for everything above it at once.
Everything is created through `contextSafe`, so `revertOnUpdate` really does
clean up — triggers created in a rAF outside the context used to leak across
the whole session.

### Rule 2 — the DOM is watched, not scanned once

Suspense boundaries resolve after the first pass. A `MutationObserver`
re-scans, coalesced to one pass per frame. An element hidden by CSS but never
claimed by a trigger stays at `opacity: 0` forever — i.e. a whole product rail
silently missing.

Also: the reveal's **translate** is disabled on touch devices (fade only), so a
rail does not travel under the finger that is scrolling it.

### Rule 3 — bootstrap scripts go through `next/script`

A bare `<script>` in a component tree only ever executes from the
server-rendered HTML — React does not run one it renders on the client — and
React 19 warns about exactly that ("Encountered a script tag while rendering
React component"). The two bootstrap scripts in `layout.tsx` (the motion
watchdog and the viewport-cookie sync) use `next/script` with
`strategy="beforeInteractive"` and a stable `id`. The JSON-LD block stays a
raw `<script>` because it is data, not code.

### Draw-on SVG strokes — do not use `getTotalLength()`

`CircledWord` (the hand-drawn ellipse) stretches a `0 0 200 60` viewBox to the
word's box with `preserveAspectRatio="none"`, and carries
`vector-effect: non-scaling-stroke`. That combination means the browser
generates the stroke — **dashes included** — in *screen* space, while
`getTotalLength()` reports *user* space. Around a long phrase those were 388 vs
660, so the ring drew ~60% of the way round and left the last word outside it.

`pathLength` is the textbook fix and **does not work here**: Chrome normalises
it against the user-space length while still dashing in screen space.

The working approach, and the one to copy for any future draw-on stroke:
sample the path with `getPointAtLength()`, push each point through
`getScreenCTM()`, and sum the screen-space distances. Measure again in
`onEnter` (fonts and Suspense can resize the word after mount), and **drop the
dasharray entirely on complete** — a stale dasharray measured against an old
width re-opens the ring on the next resize.

`CircledWord` also waits for the curtain. A ring in the first fold used to
set up its scroll trigger at mount, under the curtain, so the whole draw
played behind the panels. It now sets up on `kozy:loader-exit` (with the
motion layer's `loader-done` fallback and 5s bail), waits for
`document.fonts.ready`, and delays 0.75s when it is already on screen. The
panels lift upward, so the top of the page is uncovered last, and at 0.75s
the sage panel's foot has just left the screen (measured).

---

## 8. The story band (homepage "Our story")

Added in this session. Files:

- `src/components/home/story-band.tsx` — async server component: resolves live
  Shopify photography + destinations, exports `StoryBandFallback`.
- `src/components/home/story-board.tsx` — client component: the grid, meter,
  rail, arrows, entrance.
- `aboutStory` in `src/lib/site.ts` — all copy and fallback stills.
- `.story-grid` / `.story-card-shade` / `.story-card-icon` etc. in
  `globals.css`.

**The closing sage panel is load-bearing, not decoration.** A snap rail can
only park a cell at its start while a viewport of scrolling remains. With four
cards and two visible, the fourth could never reach the snapport and `04` would
sit dead in the meter forever. The fifth cell is what the last card scrolls
against.

The constraint that follows, and that any width change must respect:

> With **n** cells and a cell width **w** (as a fraction of the rail viewport),
> card **k** can reach the snapport iff `k·w ≤ n·w − 1`.
> For k=3, n=5 that means **w ≥ 50%**. Cells may not be narrower than half the
> rail.

Because width is pinned by that rule, **height below `lg` comes from an aspect
ratio, not a step scale** (`aspect-[2/3] min-h-[24rem]`). With a fixed height
the card flattened as the viewport grew and went *landscape* (1.15:1 at 600px),
which this composition cannot survive — it stacks a lede over a body and a pill
and needs the photograph between them. At `lg` the rail is in a fixed
two-column grid, so heights are pinned there instead.

Italic emphasis on the cards is **Jakarta italic in sage on the indigo scrim**
(6.50), because Franxurter has no italic and sage may not carry type on light.

### The staggered card — `is-active`

Two cards are on screen and they are deliberately not the same. The card the
meter is on carries `is-active` and everything else follows from that class:

| | leading (`is-active`) | queued |
| --- | --- | --- |
| copy block | at the foot (`bottom: 1.25/1.5rem`) | raised (`bottom: 26%`) |
| card height | `100%` of the cell | `91%`, centred by the cell |
| photograph | clear | ivory haze (`.story-card-veil`) |
| scrim | bottom-weighted | plus `.story-card-shade-raised` |

Pressing an arrow moves the class and the two trade states — that travelling
copy is the movement the band is built around, and it is what the reference
layout is actually doing.

Three things are load-bearing here and easy to break:

- **The copy block is absolutely positioned**, not the tail of a flex column.
  It travels relative to the *card's* height, and a percentage `translateY`
  resolves against the element's own height instead.
- **`.story-card-shade-raised` exists because raised copy leaves the dark
  band.** The standing gradient is open at ~35% where the raised block lands,
  which measured about 3.4 for cream type. If you change the raise distance,
  move that gradient's stops with it.
- **The veil is ivory and sits *under* the scrim**, so it softens the
  photograph without lifting the ground the copy is read against.

### Card proportions

The card must stay portrait. Height below `lg` comes from `aspect-[2/3]`;
at `lg`/`xl` it is pinned (`31rem` / `35rem`) so the rail balances the
editorial column beside it. The verified range is **0.57–0.78** across
320→2560. Two numbers are coupled and drift apart if you touch one alone:

- shorten the cards and the left column develops a void under the meter
  (it was ~280px before this was tuned; it is now 50–70px);
- lengthen them and the widest breakpoints go square.

`.story-copy` is `align-self: center` at `lg` for the same reason — anchoring
it to the bottom put the entire surplus into one gap.

The headline rings "shared rituals" with `CircledWord`. Building this band is
what exposed the screen-space dash bug in that shared component (§7) — the
hero's shorter "real rest" was only ~17% short and nobody had noticed.

---

## 9. Verifying UI work — read this before screenshotting

`npm run dev` + Playwright (already in `node_modules`, no install needed).

1. **The loading curtain** holds the page ~1.3–3s cold (`MIN_MS` /
   `MIN_VISIBLE_MS` / `MAX_MS` in `components/motion/loading-screen.tsx`).
   `[data-loader]` is dropped as the panels *start* to lift — clicks pass
   through from then — but the panels stay on screen ~1.2s more. Do **not**
   use a fixed wait. For interaction wait on the attribute; for a screenshot
   wait for the element itself:

   ```js
   await page.waitForFunction(() => !document.querySelector("[data-loader]")); // clickable
   await page.waitForFunction(() => !document.querySelector(".loader"));       // fully gone
   ```

2. **The newsletter popup** fires 15s after arrival — or the instant the
   cursor crosses the top edge — and intercepts every tap (Headless UI
   portal). Suppress it in `page.addInitScript`:

   ```js
   localStorage.setItem("kozy:newsletter",
     JSON.stringify({ state: "subscribed", at: Date.now() }));
   ```

   `subscribed` is the state to preset: it silences the corner teaser too.
   `dismissed` silences only the card and *shows* the teaser, which is what to
   preset when the teaser is the thing under test (§12).

3. **Node resolves `require("playwright")` from the script's own directory**,
   not the cwd. A script in a temp dir cannot see the project's
   `node_modules` — write throwaway scripts to the repo root and delete them
   after.
4. **Element screenshots are not inert.** `locator.screenshot()` on a box
   taller than the viewport re-snapped a `scroll-snap-type: mandatory` rail
   mid-test and reset its `scrollLeft`. Assert interaction state *before*
   taking the picture.
5. `next dev` backgrounded through a tool may report "exited with code 0" while
   still listening; and a killed session leaves a lock so it refuses to start,
   naming a **dead** PID. Check the port
   (`netstat -ano | Select-String ":3000"`) rather than believing either.
6. **The viewport-cookie bootstrap reloads a first visit** whose width
   disagrees with its user agent (e.g. a 390px headless Chrome). A check at a
   mobile width tears down mid-run ("Execution context was destroyed") unless
   the cookie is preset:
   `context.addCookies([{ name: "kozy_is_mobile", value: "1", url }])`.
7. **Never leave two dev servers running against this repo.** Turbopack keeps a
   persistent cache in `.next`, and a second server on another port writes to
   the same one. The symptoms do not name the cause:
   - `Persisting failed: Another write batch or compaction is already active`
     repeating in the log, and
   - **metadata routes 404 for no reason** - `/manifest.webmanifest` served a
     404 from a corrupted cache while `next build` happily listed it as a
     static route.
   Check the port before starting one, and if the cache is already poisoned:
   stop every server, `rm -rf .next`, start one.

Check real breakpoints, not just two. The sweep that caught the landscape-card
bug: 320 / 360 / 390 / 414 / 480 / 540 / 600 / 640 / 700 / 767 / 768 / 820 /
912 / 1024 / 1180 / 1280 / 1366 / 1440 / 1536 / 1920 / 2560. Assert
`document.documentElement.scrollWidth === clientWidth` at each — the layout has
`overflow-x: clip` on `html`/`body`, which hides overflow rather than fixing
it.

---

## 10. Known pre-existing issues (not yours unless asked)

- **A few Shopify originals are too big for Shopify itself to resize.** This
  was "the image optimiser 500s everywhere"; most of it is fixed — see
  *Image sizing* in §6 — but files around 18 MB come back untransformed and
  still time out. Fixing those means re-uploading the assets smaller in
  Shopify; there is nothing left to do in code. Known offenders:
  `Simple_Aesthetic_Fashion_Brand_Photo_Collage_Instagram_Post_-_14/-_15.png`
  (3375x4219, 18.38 MB) and `IMG_1283.png`.
- `README.md` is stale — see §1.
- `scripts/` is empty despite a commit adding Shopify test scripts.
- **There are two GI tag assets, on purpose.** `public/icons/gi-tag.png` is
  the original artwork, with the badge occupying only the middle ~54% of a
  mostly-transparent canvas — so at any height you set, the mark renders about
  half the box and sits off-centre. It has been resized to 189x320 (25 KB; it
  was 2528x4288 and 7.8 MB) with the same proportions, so the card's hand
  positioning is unchanged. `public/icons/gi-tag-mark.png` is that artwork
  trimmed to its ink box (now 240x256). The product buy panel uses the trimmed
  one; `product-card.tsx` still positions the original by hand. Move it over
  when you next touch it.
- **The GI mark is shown on every product, unconditionally** — in the gallery,
  on the card, and now beside the price. A GI registration is a legal
  certification for *Jodhpur block print* specifically, so this is a real
  claim about provenance, not decoration. If the catalogue ever carries a
  product that is not block print, this needs gating on the collection or a
  tag. Flagged, not changed: all three placements predate and match each
  other.
- **The PWA manifest has no usable icon.** `src/app/manifest.ts` points its
  only icon at `/logo/kozy-logo-web.png` — 720x405 and non-square (it was the
  3.18 MB master; the weight is fixed, the shape is not). Chrome
  wants a square 192 and a square 512 to offer an install prompt, so it
  currently offers none. This needs real square assets cut from the mark; it
  is not something to fake. The colours in that file were the dead palette too
  and have been fixed.

---

## 11. Conventions

- **Comments explain *why*, not *what*.** This codebase's comments carry
  derivations, measured contrast ratios, and the bug that motivated the code.
  Match that register — a comment that restates the line below it is noise
  here; one that records why the obvious approach failed is the house style.
- Copy goes in `src/lib/site.ts`, never inlined in JSX.
- New photographic surfaces go through `Plate`; new CTAs through
  `ActionButton`; new rails through `.rail` or `Carousel`. A remote image
  outside `Plate` imports `Image` from `@/components/ui/shop-image`.
- **`Link` is imported from `@/components/ui/intent-link`, never from
  `next/link`.** It prefetches on hover / focus / touch instead of on sight
  (§17). Do not pass a bare `prefetch` (= `true`) except to a static route
  that is worth it (the logo to `/`): on a dynamic route `true` is a full
  server render per link per page view.
- **Never point a `<Link>` at a route handler.** `<Link>` prefetches, and a
  prefetch is a real GET: `/api/auth/logout` deletes every customer cookie on
  GET, so the "Sign out" `ActionButton` signed customers out the moment it
  scrolled into view in production, and the header's sign-in link minted a new
  PKCE verifier on every page view. `ActionButton` now renders a plain `<a>`
  for `/api/` hrefs; anywhere else, use `<a>` or `prefetch={false}`. (The
  header's account link now always goes to `/account`, which shows the
  sign-in panel to signed-out visitors - §17.)
- Layouts that *reorder* between breakpoints get an explicit
  `grid-template-areas` map in `globals.css` (`.hero-bento`, `.story-grid`),
  not a pile of `order-*` utilities.
- Never nest an `<a>` or `<button>` inside a card that is itself a link —
  render the pill as a styled `<span>`. Invalid markup and a duplicate tab stop.
- Prefer native scrolling + scroll-snap over transform tracks: touch,
  trackpad, keyboard and the scrollbar then work for free.

---

## 12. The newsletter — three surfaces, one record

Added in this session. The signup exists in three places and they have to
agree:

| | file | shape |
| --- | --- | --- |
| Arrival card | `newsletter/newsletter-popup.tsx` + `newsletter-postcard.tsx` | the full drawing, in a Headless UI `Dialog` |
| Corner teaser | `newsletter/newsletter-teaser.tsx` | what the card collapses into once closed |
| Newsletter band | `ui/newsletter.tsx` in `layout/newsletter-band.tsx` | a bare field and one pill, on its own card above the footer |

### The card's layout

One landscape postcard (13 x 9 tiles) at every width - the phone gets the
desktop card scaled down (owner's call, 2026-10-11; it used to be a separate
7 x 11 portrait card). Everything on the card is sized in `cqw` of the card,
so it shrinks as one piece.

- **The K frame is a `border-image`** of one 3x3 block
  (`public/newsletter/ritual-border-tile.svg`, `round`), one tile wide
  (`--ritual-tile`). It used to be a whole frame drawn as one SVG and stretched
  `100% 100%`, which squashed tiles whenever the card left its aspect. Do not
  go back to a stretched frame: the card grows past its aspect when an error
  shows.
- The `max-width: 600px` block only adds **floors** where pure scaling stops
  being usable: the field stays 16px (iOS zooms into anything smaller), copy
  and pill stay at 11px+, the pill's minimum drops 44px → 30px. Those floors
  add height, and a taller card makes `round` visibly stretch the side
  columns of Ks, so the same block takes the height back out of the vertical
  padding. Measured: exactly 13:9 from 360px up, 3px over at 320px. If you
  raise a floor, re-measure the card's aspect.

All three post to the same server action (`newsletter/actions.ts` → Shopify
Admin `customerCreate`, falling through to `customerEmailMarketingConsentUpdate`
when the address already exists). Copy for all three is in `newsletter` in
`site.ts`. Nothing about the signup is hard-coded in JSX.

### The record — `newsletter/newsletter-state.ts`

One module owns "has this visitor been asked, and what did they say". It used
to be private to the popup, and the footer stored a subscribed customer in
Shopify without touching it — so someone who signed up in the footer still got
the card fifteen seconds later, asking for the address they had just given.

Two stores, because the two answers do not have the same shelf life:

```text
localStorage    kozy:newsletter          the answer to the offer
                  subscribed  terminal — no surface asks again, ever
                  dismissed   snoozes the CARD for 30 days
sessionStorage  kozy:newsletter-teaser   the teaser waved off for this session
```

Closing the teaser is deliberately *not* the month-long snooze: "not while I
am reading this" is a smaller statement than "not this month".

- Read through `useNewsletterState()`, which is **`useSyncExternalStore`**, not
  an effect that seeds state. `getSnapshot` is called on every render and must
  return the *same object* until something changes, so the read is cached at
  module scope and dropped only on a write — a fresh read per call is a new
  reference and re-renders forever.
- Same-tab fan-out is a `kozy:newsletter-change` event. The `storage` event
  only fires in the *other* tabs, so without it a footer signup would not
  silence the card mounted beside it.
- Every accessor is wrapped in try/catch: private browsing, blocked site data
  and a full quota all **throw** on access rather than returning empty.

### When the teaser is on screen

`ready && !quiet && !cardOpen && !teaserClosed && record === "dismissed" &&
suppressed(record)`.

`ready` is false on the server and through hydration — neither store is
readable there, so the first paint must not carry a tab the client removes.

### The teaser is not a fourth seal

The rotating `.seal` is reserved (hero wordmark, closing CTA, back-to-top);
a fourth one parked in a corner is what turns a stamp into decoration. The tab
borrows **`.cat-pill`'s silhouette** instead — label, then a circular icon well
socketed into the end — in that pill's own hover colours: indigo ground, oat
label (9.30), sage well with an indigo glyph (6.50).

Load-bearing details in `.newsletter-teaser`:

- **`z-index: 880`** — under the header (999), the cart drawer (1000), the
  route hairline (1050) and the card itself (1100). A standing offer is the
  least urgent thing on screen and must never sit over a cart being checked
  out of.
- **`[data-above-cart-bar]`** clears the mobile cart bar by its own height
  (`4rem + 1px`) below `md`. That bar is fixed to the same edge, full width and
  taller than the tab, so with anything in the cart the tab is simply behind
  it. The flag comes from `useCart()`.
- **Below 480px the label goes `sr-only`** and the tab is the mark alone, at
  48px. The accessible name is on the button either way, so nothing is lost to
  a screen reader.
- The hover is the lift alone. `.cat-pill` answers a hover by flooding indigo,
  but this tab is already indigo and the palette has no second one to move to —
  `coal` is the same hex as `ink`. Darkening it by hand would put a fifth
  colour in a four-colour system.

### Triggers

15s after arrival (paused while the tab is hidden), **or** exit intent,
whichever comes first. Exit intent is bound to `document`'s `mouseout` with a
null `relatedTarget` and `clientY <= 0`, and only on `(hover: hover) and
(pointer: fine)` — a touch screen has no hover, so `mouseout` there fires on
taps and would spring the card on the first one.

`QUIET_PATHS` (`/contact`, `/account`, prefix-matched) suppress the card **and**
the teaser: someone mid-enquiry or inside their account is mid-task.

---

## 13. Personalisation add-ons — initials (₹499) and gift box (₹999)

Any product can take initials and/or a gift box, charged per unit and shown on
the Shopify order indented under the product, with `Initials: KF` beside it.
The full plan, the Admin setup and the edge-case tables are in
`docs/personalisation-add-ons.md`; this is what the code relies on.

### The model

- Each add-on is a **hidden Shopify product** (tag `kozy-addon`, SKUs
  `KOZY-ADDON-INITIALS` / `KOZY-ADDON-GIFTBOX`) plus a **`product_add_on`
  metaobject** that points at its variant and carries the rules (kind, label,
  max length, per-unit, active, apply-to-all). Prices come from the variant, so
  a price edit is an Admin change only.
- `getAddOns()` reads every entry in one cached query
  (`queries/add-ons.ts`) and `reshapeAddOn` keeps the ones that are `active`
  and `apply_to_all`. **Per-product add-ons are not implemented** - an entry
  with `apply_to_all` off is ignored. The `required` field is read by nothing.
- In the cart, an add-on is a **nested cart line** (`CartLineInput.parent`,
  Storefront API 2025-10+). Its text is a line-item property on the child.
- `kozy-addon` products are dropped in `reshapeProduct` (even where hidden
  products are let through) and `reshapeCatalogProduct`, so they never list,
  search, recommend or get a page.

### The cart is addressed by LINE id, not variant

`updateItemQuantity`, `removeItem`, the optimistic reducer, the reservation map
and the drawer's `key` all use the cart **line id**. They used the variant id,
and two totes with different initials are one variant and two lines. An
optimistic line has no id until the server answers, so its buttons are
disabled for that beat (it has a `tempKey` for React).

### Traps, all measured against the live store

- **Shopify merges two lines of one variant with identical attributes.** A
  personalised parent therefore carries a private `_kozy_line: <uuid>`
  attribute (`ADDON_PARENT_ATTRIBUTE`). Plain lines deliberately do not, so they
  still merge.
- **Child quantity does not follow the parent.** `updateItemQuantity` sends the
  parent and its per-unit children in **one** `cartLinesUpdate`, then re-syncs
  them if stock clamped the parent.
- **Removing a parent removes its children** (Shopify cascades). Removing a
  child alone leaves the parent.
- **`parentRelationship` is on `CartLine`, not `BaseCartLine`** - select it in
  an inline fragment or the query fails.
- **Shopify's `totalQuantity` counts add-on lines**; `reshapeCart` replaces it
  with the parents' sum, or the header reads "3" for one tote.
- `addItem` adds the parent first, finds it by its marker, then nests the
  children by **`parent.lineId`**, never `parent.merchandiseId`, which is
  ambiguous when the cart already holds that variant. If the children fail,
  the parent is removed again: a personalised product must never sit in the
  cart without its paid line.
- The server re-reads the add-ons from Shopify and re-validates the text on
  every add. Never trust ids, prices or text from the browser.
- Initials are **A–Z only, 1–6 letters** (the owner's rule). The shared rule is
  `lib/shop/add-ons.ts`; the field filters as the shopper types, and the
  server rejects anything else.
- The order property name `Initials` comes from `addOns.orderLabels` in
  `site.ts`. The workshop, the packing slip and the Shopify Flow tags read it -
  change it with care.

### Surfaces

| File | Role |
| --- | --- |
| `components/product/add-on-picker.tsx` | The cards on the buy panel. Beside the add-to-cart form, not inside it, so Enter in the field does not submit. |
| `components/cart/add-to-cart.tsx` | Owns the choices, validates, sends them, clears them after a successful add. Also renders Buy now (see below). |
| `components/cart/modal.tsx` | Lists add-ons under their line, each removable; the line price includes them. |
| Product cards / quick-add | Add the plain product, never add-ons (see *Card buying*). |

### Buy now — a cart of its own

The buy panel's second button (`buyNow` in `cart/actions.ts`, copy in `buyNow`
in `site.ts`) checks out **this one Kompanion and the extras picked for it**,
and nothing else.

- It **creates a separate Shopify cart** and sends the browser to that cart's
  `checkoutUrl`. It never reads or writes the `cartId` cookie, never touches
  the optimistic cart, and never opens the drawer. Adding to the shared cart
  and checking *that* out would have bought everything else in it too. The
  shopper's cart is still there, unchanged, when they come back.
- Same validation as `addItem`, by the same code: variant id, quantity,
  `resolveAddOnLines`, and personalisation through `addPersonalisedLine`
  (parent first, children nested by line id, rollback). It also refuses an
  add-on's own variant id on a *plain* buy, which `addItem` only checks when
  extras are asked for.
- Shopify clamps a sold-out line to nothing instead of failing, so the
  returned cart is checked for the line (and every add-on under it) before the
  URL goes back. The URL must be `https`.
- Rate-limited at 20 per 10 minutes per client (`rate-limit.ts`, bucket
  `buy-now`), because every call mints a cart.
- Both buttons are in **one form**, so one `useFormStatus` pending state holds
  both. The pressed button's `name="intent"` value (`add` / `buy`) comes
  through in the FormData. After success the buttons stay disabled until the
  page unloads, and a `pageshow` with `persisted` (Back from checkout via
  bfcache) re-enables them. Add-on choices are kept, so Back finds the
  initials still typed.
- Buy now is hidden whenever Add to cart is disabled (no variant chosen, sold
  out). A product **card's** Buy now is a different thing - it adds to the
  shared cart and opens the drawer - see below.

### Card buying — Buy now, Add, and the stepper they become

`CardBuyControls` (`components/cart/card-buy-controls.tsx`, copy in `cardBuy`)
is on every `ProductCard` (home rails, the shop grid, shop-by-colour/mood,
related products) and on the homepage Spotlight.

| State | Controls |
| --- | --- |
| Not in cart | bag-plus **Add** (quiet) · **Buy now** (adds AND opens the drawer) |
| In cart (a *plain* line of this product) | `− n +` stepper · **Checkout** · "Size · Change" under it |
| Sold out | one disabled pill |

- The morph into a stepper is Baymard's list-page finding: the number is the
  confirmation, it stops accidental duplicates, and quantity changes without
  a trip to the cart. Personalised lines are never driven by the card - with
  only a personalised line in the cart the card still offers Buy now.
- **Which variant.** `lib/shop/variant-preference.ts`, in order: the variant
  last picked for this product (product page or drawer switcher), the variant
  sharing the most option values with what the shopper picked anywhere ("M"),
  the first in stock. Stored in `localStorage` (`kozy:variant-pref`) and read
  through `useSyncExternalStore`. The card's guess only drives the optimistic
  line: `addPreferredItem` re-resolves by **handle** against live stock with
  the same ranking (`lib/shop/variant-match.ts`, kept hook-free so the server
  can import it), so a remembered size that sold out falls back silently and
  the card then tracks the variant the server actually added.
- **The drawer is where a pick is undone.** Every multi-variant line has a
  native `<select>` (`LineVariantSelect`), fed lazily by `getVariantChoices`
  the first time the drawer opens with that product. `changeLineVariant`
  sends `cartLinesUpdate` with a new `merchandiseId`; measured: attributes and
  nested add-ons survive (initials stay on a re-sized tote), and switching to a
  variant already in the cart as a plain line merges them.
- **The drawer no longer opens itself on every quantity rise.** It is opened
  explicitly by the product page's Add to cart, a card's Buy now and
  `QuickAdd`; a card's Add and stepper stay quiet (the mobile cart bar and
  header badge confirm). The just-added line gets a fading sage wash and is
  scrolled into view (`justAdded` / `flagAdded` in the context). Closes within
  400ms of opening are ignored - a double-clicked Buy now otherwise closed the
  drawer on its own second click, which landed on the backdrop.
- **Card Checkout** goes straight to `cart.checkoutUrl`, unless a mutation is
  pending or a line is unavailable, in which case it opens the drawer.
- A stock clamp ("Limited stock…") is shown on the card as well as the
  drawer: the count otherwise snapped back with no word of why.

⚠️ **`isMutating` was always false during a mutation**, and so the drawer's
"Updating…" hold on checkout never once showed. `runCartMutation` is called
inside actions / `startTransition`, and React 19 holds state set there until
the action settles. The count now lives in a ref (`hasPendingMutations()`,
synchronous) and reaches the render through a microtask, outside the
transition. Anything new that must know "is the cart settled?" in a click
handler reads `hasPendingMutations()`, not `isMutating`.

A missing product - including an add-on's handle - renders the not-found page
with **status 200 + noindex**, because `product/[handle]/loading.tsx` streams
the skeleton before the lookup finishes. That is the existing behaviour for
every unknown handle, not something the add-ons introduced.

---

## 14. Custom kit builder — `/kit-builder`

A shopper builds a kit from the base Kompanions (Bathrobe, Slippers, Makeup
Pouch, Eye Mask) in one fabric, with optional initials in a chosen thread.
Research, the Admin setup and the edge cases are in
`docs/custom-kit-builder.md`; this is what the code relies on.

### The model

- **Pieces are Unlisted products** tagged `kozy-kit-piece`, each with a
  **Fabric** option (`Solid` / `Block printed`) and usually Size. The fabric's
  price is the variant's price; there is no surcharge product.
- **The kit is a ₹0 container** (Unlisted, tag `kozy-kit`, SKU `KOZY-KIT`,
  inventory untracked) with every piece nested under it by line id. The
  container carries `Kit`, `Fabric`, `Thread`, `Initials` and `Embroider on`;
  each piece carries `Kit`.
- Four metaobject types drive it, all read by key in `getKitBuilder()`
  (`queries/kit-builder.ts`): `kit_builder` (one settings entry, incl.
  `container_variant`, `min_pieces`, `initials_max_length`, optional
  `initials_variant`), `kit_piece`, `kit_fabric` (`option_value`),
  `kit_colour` and `embroidery_thread`. `null` means the builder rests.
- **Colour is one choice per kit, written on the order, not a variant**
  (`Colour: Sage` on the container; owner's call 2026-10-08, "Option A").
  Each `kit_colour` names its `kit_fabric` through a metaobject reference, so
  Solid and Block printed offer their own lists; a fabric with none skips the
  step, and switching fabric clears the colour. Stock is therefore per size +
  fabric, NOT per colour. If stock per colour is ever needed, Colour becomes a
  third variant option and `findKitVariant` must match it too.
- `lib/shop/kit.ts` holds the rules both sides share - variant resolution by
  Fabric + Size, `isKitLine`, `KitRequest` - so the page and the server always
  pick the same variant.

### Traps

- **Unlisted products are invisible to listings.** Shopify returns them only by
  handle, id or reference, so the builder reaches pieces ONLY through
  `kit_piece.product`. And `reshapeProduct` / `reshapeCatalogProduct` drop
  both kit tags, so pieces have their own `reshapeKitPiece`; never route them
  through the product reshapes.
- **Option values are compared forgivingly** (`sameOption`: case, spacing,
  NFKC). The store has `Block printed` on the products and `Block Printed` in
  the fabric entry; that is one fabric. Matching is by option **name**, not
  position - the products list Size before Fabric.
- **Shopify's linked "Fabric" option** (category metafield) returns the
  entry's **Label** as the option value - verified 2026-10-08.
- **A kit is whole or absent.** `addKitItem` removes the container (which
  cascades) if any piece fails to land, and brings every line down to the
  lowest quantity if stock clamps one. `updateItemQuantity` does the same for
  kits: the container is never stock-tracked, so it is the pieces that clamp.
- **The visible `Kit: K-XXXXX` code is load-bearing.** The Customer Account
  API exposes no nesting, so `/account` (`components/account/order-items.tsx`)
  groups an order's lines by it; the container is the line carrying `Fabric`.
  Order line items load in a **separate, non-throwing** query
  (`fetchOrderLineItems`) so a refused field costs the item list, not the
  account page.
- **The piece tiles use `Plate`'s `objectFit="contain"`**, the only caller of
  it. Three of the four studio shots are landscape (pouch and slippers 3:2,
  mask 2:1) and `cover` cut both ends off in the portrait tile. Contain mode
  puts the plate on ivory and blends the photo with `mix-blend-darken`: the
  shots' near-white grounds (#FDFCFA-#FEFAF5, measured) resolve to exactly the
  ivory, so there is no box round the piece. `multiply` left one ~3 levels
  darker. A shot on a ground darker than ivory would show its box again.
- The drawer renders a kit through `KitCartLine`: no per-piece remove and no
  size switcher (a nested line cannot be re-parented); "Edit" goes back to the
  builder.
- URL state (`?pieces=bathrobe,makeup-pouch&bathrobe=M&fabric=…&thread=…`)
  uses the metaobject **handles** and is written with `replaceState`; the
  page reads it on the server. Initials never enter the URL.

### The shared model

The rules both kit surfaces must agree on - `derive()` (steps, issues per
step), `nextAfter()`, pricing (`priceInFabric`, `unitPrice`), `kitRequest()`,
`kitQuery()` and the selection helpers - live in
`components/kit-builder/kit-model.ts`, pure and React-free. The page builder
and the homepage atelier (§15) each keep their own UI state on top of it.
Change a rule there, never in one of the two components.

### The guided flow (2026-10-13)

`components/kit-builder/kit-builder.tsx` is an accordion with **one step open
at a time**, a sticky review beside it (`lg`+), and a fixed action bar on
phones (`.kit-bar`). CSS is the `kit builder` block at the end of
`globals.css`.

- Steps are **Kompanions → Fabric → Kolour → Initials**, built per render by
  `derive()`: a single fabric drops its step, a fabric with no colours drops
  Kolour, no threads drops Initials. Thread and letters are one step.
- **Done = valid AND answered.** Fabric and embroidery are valid untouched
  (a default fabric, no thread), so `confirmed` records the answer; without
  it the guide ticks steps nobody looked at. Adding to the cart needs only
  validity - a shopper who skips ahead is not stopped, the review offers
  "Before you go: …" instead.
- **Auto-advance** after a complete single answer (a fabric - including the
  one already chosen, which is how the default is accepted - a kolour, or No
  embroidery), `ADVANCE_MS` later. Multi-choice steps wait for Continue.
  `derive()` is pure so the advance can compute the NEXT state's target
  before React renders it.
- Every CTA (each step's Continue, the review button, the phone bar) points
  at the same place: the first unfinished step (`nextAfter`). Do not point
  one of them at the step holding the error instead - they disagreed once
  ("Next: Fabric" beside "Next: Kolour").
- `goTo()` measures the DOM rather than reading state: it also runs from a
  timer a render old. It scrolls through Lenis, aiming at where the step head
  will be AFTER the open step above it folds (`foldShift`), and moves focus
  to the new head, because the clicked control has just become `inert`.
- A URL kit that is complete arrives with every step done and folded; a
  partial one confirms only its pieces.
- At `lg` the review is a flex column capped at the screen (`max-h`): the
  heading and the footer (quantity, total, button) keep their height, and
  only the middle (flat lay + lines, `data-lenis-prevent`) scrolls. Do not go
  back to pinning the footer `sticky` over a scrolling panel - it covered the
  quantity and total on a 768px-tall laptop. Under 820px tall the flat lay
  goes 3:1 so it gives up height first. The steps column has a matching
  `min-h` - a sticky element only sticks while its grid row has room.
- `/kit-builder` is in the newsletter's `QUIET_PATHS`: mid-task, and the
  teaser would sit where the phone bar is.
- The page rests (no builder) when the container is unsellable or there are
  no pieces - `addKitItem` would refuse either.

<!-- BEGIN:nextjs-agent-rules -->

## 15. The Kustom kit on the homepage — `KitAtelierSection`

A second, complete kit builder on the homepage (owner's call, 2026-10-13):
a shopper can build a kit and send it to the cart without leaving `/`. It
sits after Shop by mood and the ticker under it (§5).

| File | Role |
| --- | --- |
| `components/home/kit-atelier-section.tsx` | Server: reads `getKitBuilder()`, frames the section, renders **nothing** when the builder rests (no settings, unsellable container, no pieces) |
| `components/home/kit-atelier.tsx` | Client: the track, the table and the one-question-at-a-time pane |
| `kitAtelier` in `site.ts` | Its own framing and questions; errors, labels and step names are `kitBuilder`'s |
| `kit atelier` block in `globals.css` | Table, places, props, chips, motion |

- **On the page's cream**, not in a panel (owner's call; it was an indigo
  room first). Ink type, muted for quiet lines; sage only as a fill (track
  "done", success panel) or as a tick on ink. Accents that must be read are
  `sage-deep`.
- **The table is ivory, not oat.** The Kompanions are cream cloth and
  washed into an oat ground. Every piece photograph sits in a
  `mix-blend-darken` wrapper so the shots' near-white grounds resolve to
  the ivory. The blend is on the ANIMATED WRAPPER (the element that makes
  the stacking context), not the `<img>` - inside a transformed wrapper an
  img blends against nothing and shows its white box.
- **Every place on the table is a button**: tapping the ghosted piece lays
  it down (`atelier-drop`), tapping again lifts it off. Laying a piece that
  needs a size from another chapter turns back to the Kompanions chapter.
- **The table's props live in their own top strip** (`atelier-props`):
  fabric sample, embroidery hoop, price tag. Floating over the places they
  hid the pieces (the tag covered the slippers on a phone). Do not put them
  back over the grid. The tag shows "—", not "₹0.00", while a piece waits
  for its size.
- **Chapters** are the model's steps plus "Your kit". Fabric, kolour and
  "No embroidery" turn the page by themselves (`ADVANCE_MS`); pieces and
  letters wait for Next. Every primary button names its destination and
  goes to the first unfinished chapter, as on `/kit-builder`.
- **Nothing goes in the URL** (it is the homepage). "Open in the full
  builder" hands the kit to `/kit-builder` as its query (`kitQuery`);
  initials never travel.
- **The newsletter card holds off while a kit is half built.** The atelier
  sets `data-kozy-task` on `<html>` (`TASK_ATTRIBUTE` in
  `newsletter-state.ts`) while it has pieces and has not added; the popup
  re-arms its countdown instead of opening. Any future mid-task surface can
  use the same attribute.
- After a turn the new question (`h3`, `tabIndex=-1`) takes focus - the
  pressed control unmounts with its pane - and a derived `aria-live` line
  reads out "Step n of N" plus the question.

## 16. Size charts — the "Size guide" drawer

Replaces the MP Size Chart theme app, which a headless site never ran
(owner's setup, 2026-10-28). The charts are merchant data in Admin; the
rules are `lib/shop/size-chart.ts`, the drawer
`components/product/size-guide.tsx`, the frame copy `sizeGuide` in
`site.ts`.

- **`size_chart` metaobjects** (`name`, `unit`, `measurements`,
  `how_to_measure` rich text, `guide_image`, `fit_note`), referenced by
  **`custom.size_chart`** on a product or a collection. Live entries:
  Bathrobe, Slippers, Furrie clothes, attached to `bathrobes`,
  `ritual-kits`, `slippers` and `pet-clothing` plus products outside them.
- **The table is multi-line text, not JSON**: one row per line, commas
  between cells, the first line the headings, the first column the size.
  The people typing it copy from a printed chart.
- **A heading ending `(in)` / `(cm)` marks a measurement column**, the only
  kind the cm/in toggle converts. `unit` is only the unit the drawer opens
  in. Per-chart conversion is wrong: the slipper chart's US / UK / EU
  columns are size systems. Converted precision follows the source (34 →
  86, 8.7 → 22.1); a cell that is not a bare number or range is shown as
  typed.
- **Which chart:** the product's own wins outright; otherwise the first
  collection chart whose sizes MATCH one of the product's options.
  `ritual-kits` carries the bathrobe chart and also holds UK-sized slipper
  kits, which must not be offered a robe table.
- **Sizes match forgivingly** (`sizeKey`): case, spaces and dashes, a `UK`
  prefix, and `XXL` = `2XL`. Measured spellings on the store: `S-M` /
  `s-m` / `L- XL`, `UK 3-4` / `uk-3-4` / `3-4`. The guide sits under
  whichever option matched (`Size`, `Slipper size`, `His Size`…) and washes
  the picked size's row sage.
- Its own query (`getProductSizeChart`), not a field on the product
  fragment, which every listing and search spreads. It never throws: a
  failed lookup is a missing link.
- With a guide, that option's legend goes `sr-only` and a flex row carries
  the visible label and the link. Absolutely pinning the link against the
  fieldset ran it into the first row of pills below desktop.

## 17. Caching and crawl budget — why the Hobby deployment was paused

The full incident record - including the **Vercel dashboard settings**
(region, domains, firewall rules) that live outside the repo, the measured
results and what is still open - is `docs/vercel-hosting.md`.

Launched 2026-11-01; paused by Vercel on 2026-11-02 for **Fast Origin
Transfer** (function → CDN bytes): ~40 GB against Hobby's 10 GB/month fair
use, 99.6% in `iad1`. That region is where the **functions** run (Vercel's
default), not where visitors are. No ads were running.

The cause, measured on a local production build:

- **Every route rendered per request.** The root layout read `cookies()` for
  the cart and the Navbar read it for the account link; either one makes
  every page dynamic (`private, no-store`). Nothing came from the CDN.
- **Each render is heavy**: `/` 798 KB, `/search` 656 KB, a product 466 KB
  (uncompressed, which is what the function sends).
- **The shop's URL space is unbounded.** Filters are plain links (§6) and
  facets stack (`?size=s-m%2Cl-xl&sleeve-detail=…&sort=…&page=…` × every
  collection). robots.txt blocked nothing, and the sitemap listed
  `demo-next-store.pages.dev` URLs. Crawlers walked it.
- **Links prefetched on sight.** The desktop menu, product cards and table
  forced `prefetch` (= full render); scrolling the homepage fetched ~1 MB of
  product pages nobody opened.

What changed, and the rules that keep it fixed:

- **Nothing rendered on every page may read `cookies()` / `headers()` or make
  a `no-store` fetch** (root layout, Navbar, Footer, NewsletterBand). The
  cart is read by the browser: `CartProvider` calls the `readCart()` server
  action on mount, on a bfcache restore, and after every mutation inside
  `runCartMutation`, setting it in `startTransition` so it commits with the
  action (React 19 entangles it) and the optimistic line is never counted
  twice. Cart actions no longer call `updateTag`: it re-rendered the whole
  route into each action response. The header's account icon always links
  to `/account`. `getPage` / `getPages` use the normal TTL, not `no-store`.
- **Check `next build` after any change to shared chrome.** `/`, the content
  pages, `/product/[handle]`, `/[page]`, `/policies/[policy]` and blog
  articles must be `○` / `●`, not `ƒ`. Dynamic segments get on-demand ISR
  from `revalidate` + `generateStaticParams() { return [] }`. Still `ƒ` on
  purpose: `/account`, and the pages that read `searchParams` (`/search`,
  `/search/[collection]`, `/shop-by-*`, `/kit-builder`).
- **Crawlers stay off query strings.** `robots.ts` disallows `/*?` (with
  `/_next/` allowed back, or Googlebot cannot render), `/api/` and `/account`,
  and turns away AI-training and SEO-tool crawlers. Every query-driven page
  builds its metadata with `queryPageMetadata()` (`lib/shop/seo.ts`):
  canonical to the bare page, and `noindex, nofollow` once any parameter is
  set. Filter, sort and page links carry `rel="nofollow"`. `SITE_URL`
  (`lib/site-url.ts`) is the one origin for metadata, robots and sitemap.
- **`Link` is `@/components/ui/intent-link`** (all imports were swapped). It
  holds `prefetch={false}` until hover / focus / touch, then hands Next its
  default. Scrolling the homepage now sends one 0.6 KB request instead of 11
  (~1 MB). Next 16's `false` really is off - it never registers the link -
  so an explicit `prefetch={false}` (the shop's filter links) stays off even
  on hover.
- **There is no middleware, on purpose.** A `middleware.ts` / `proxy.ts` puts
  a function invocation in front of every matched request. If one is ever
  added, its `matcher` must exclude `_next/static`, `_next/image`, and files
  with an extension.
- **Vercel's image optimiser is for local files only** (`next.config.js`).
  Shopify photos go through `ShopImage` → Shopify's CDN, so
  `remotePatterns` lists only this project's two Shopify file prefixes
  (live `0978/6723/5641`, dev `0700/6476/7047` for the `site.ts` stills -
  **keep the dev store**). It used to allow every Shopify store's files and
  `**.myshopify.com`, i.e. a free resizer on our metered quota. WebP only,
  31-day cache, no 3840 width (a duplicate of the 2048 cap).
- **`public/` files get a week of browser cache** (`headers()` in
  `next.config.js`). Every hero film is on Shopify's CDN, including the
  first (`heroFilms` in `site.ts`; it was `public/media/hero-main.mp4`,
  6.3 MB on Vercel's bandwidth, until 2026-11-04). Do not put video in
  `public/`. Only the posters (`public/media/*-poster.jpg`) stay local.
- **`/api/search` is CDN-cached** (`s-maxage=300`) and caps `q` at 80
  characters. Results are the same for everyone.
- **Dynamic routes check `isPossibleHandle()`** (`lib/shopify/handle.ts`)
  before asking Shopify. `/[page]` is a root catch-all, so every scanner
  probe (`/wp-login.php`, `/.env`) lands there.
- **Vercel Web Analytics** (`<Analytics />` from `@vercel/analytics/next`,
  last in `<body>` in `layout.tsx`, added 2026-11-04). It is a client beacon
  and wraps its own `useSearchParams` in Suspense, so the route table above
  is unchanged (verified with `next build`). It only reports once Analytics
  is enabled for the project in the Vercel dashboard. Hobby includes a
  monthly event quota; custom `track()` events count against it.
- **Preview deployments serve `Disallow: /`** (`VERCEL_ENV` in `robots.ts`).
- **The viewport-cookie bootstrap cannot loop.** It reloaded whenever the
  `kozy_is_mobile` cookie disagreed with the window, so a client that cannot
  keep cookies reloaded forever. It now reads the cookie back before
  reloading and caps reloads at 3 per tab session (`kozy:vp-reloads` in
  sessionStorage). Measured: cookies blocked → 1 load; first phone-width
  visit with a desktop UA → exactly 1 corrective reload.
- **Who the traffic was** (Usage → Edge Requests, 2026-11-01..03): 763,758
  requests, 56.8% entering at `cle1` (Ohio) and 42.4% at `iad1` (Virginia),
  only 1,869 (0.2%) at `bom1` (Mumbai). Edge regions, unlike Fast Origin
  Transfer, follow the client, so 99% came from US-East data centres (the
  AWS/cloud regions crawlers run in), not Indian shoppers. Active CPU was
  11h 1m against Hobby's 4h.
- **Shopify side:** `shop.kozyliving.in` is Shopify's primary domain (and
  checkout) and runs the `Forward to headless` theme, which JS-redirects to
  `kozyliving.in`. While Vercel is down that sends shoppers to a dead site.
  The runtime Admin app holds nearly every Admin scope (themes, orders,
  payments); the site needs only metaobjects + customers.
- **Outside the repo (dashboard):** Firewall → Bot Protection and the AI Bots
  managed ruleset on; function region `bom1` for Indian shoppers. Hobby is
  for non-commercial use, so a live shop belongs on Pro with a spend limit.

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
