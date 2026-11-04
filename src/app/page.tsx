import clsx from "clsx";
import Link from "@/components/ui/intent-link";
import { Suspense } from "react";
import {
  getArticles,
  getCatalog,
  getCollectionProducts,
  getCollections,
  getMoods,
  getPrimaryMenu,
  getProduct,
  getProducts,
} from "@/lib/shopify";
import { shopCategories } from "@/lib/menu";
import { Product } from "@/lib/shopify/types";
import ProductCard from "@/components/product-card";
import { CardBuyControls } from "@/components/cart/card-buy-controls";
import ArticleCard from "@/components/blog/article-card";
import Price from "@/components/price";
import Marquee from "@/components/ui/marquee";
import IconMarquee from "@/components/ui/icon-marquee";
import Carousel from "@/components/ui/carousel";
import Plate from "@/components/ui/plate";
import Seal from "@/components/ui/seal";
import ActionButton from "@/components/ui/action-button";
import CircledWord from "@/components/ui/circled-word";
import WordmarkBand from "@/components/ui/wordmark-band";
import { ArrowUpRight } from "@/components/ui/arrow-badge";
import CollectionPillRail from "@/components/ui/collection-pill-rail";
import { splitText } from "@/components/motion/split-text";
import ColourRail, { type RailColour } from "@/components/shop/colour-rail";
import StoryBand, { StoryBandFallback } from "@/components/home/story-band";
import ClosingFilm from "@/components/home/closing-film";
import KitAtelierSection, {
  KitAtelierFallback,
} from "@/components/home/kit-atelier-section";
import MoodPanels, { type MoodPanel } from "@/components/home/mood-panels";
import { moodEntries, moodHref, SHOP_BY_MOOD_PATH } from "@/lib/shop/moods";
import { FaqFallback, HomeFaq } from "@/components/faq/faq-section";
import LookbookDeck, {
  type LookbookCard,
} from "@/components/home/lookbook-deck";
import { galleryFor, imageKey } from "@/lib/shop/gallery";
import {
  getColourEntries,
  shopColourHref,
  SHOP_BY_COLOUR_PATH,
} from "@/lib/shop/palette";
import {
  displayFace,
  Eyebrow,
  Headline,
  SectionHead,
} from "@/components/ui/section";
import {
  boldStatement,
  ctaBand,
  restTicker,
  featureBand,
  guidesFeature,
  hero,
  heroFilms,
  lookbook,
  journalPosts,
  shopByMood,
  site,
  testimonial,
} from "@/lib/site";

export const metadata = {
  title: `${site.name} - ${site.tagline}`,
  description: site.description,
  openGraph: { type: "website" },
};

/**
 * Homepage. Merchandise first, story second, the way the stores this one sits
 * beside are built (Brooklinen, Parachute, Okhai, Jaypore all run hero →
 * categories → products → why-us → story → journal):
 *
 *   hero → category pills → bold statement + lookbook → ritual showcase →
 *   bestsellers → shop by colour → standards ticker → new arrivals →
 *   standards ticker → the story band → studio quote → rest ticker →
 *   spotlight → guides → journal → FAQ → standards ticker → closing "shop now".
 *
 * The pills sit directly under the hero as the category row, so the first
 * thing after the frame is a way into the shop; the lookbook under them is
 * itself four shelves, so the opening reads as navigation, then the edit.
 *
 * Products may repeat between the rails, the spotlight and the lookbook. That
 * is deliberate: a shopper who arrives mid-page still meets the same core
 * Kompanions wherever they land.
 */
export default function Home() {
  return (
    <>
      <Hero />

      <Suspense fallback={null}>
        <CollectionFilters />
      </Suspense>

      {/* Below the hero's full-viewport frame, so it streams rather than
          holding the first byte of the whole page on its Shopify lookups. */}
      <Suspense fallback={<StatementFallback />}>
        <BoldStatement />
      </Suspense>

      <Suspense fallback={<RailFallback />}>
        <Bestsellers />
      </Suspense>

      <Suspense fallback={null}>
        <ShopByColour />
      </Suspense>

      <Suspense fallback={null}>
        <ShopByMood />
      </Suspense>

      <StandardsTicker />

      {/* The Kustom kit, built end to end without leaving the page: after
          the shelves and moods have shown what the Kompanions are, the
          place to make a set of them your own (owner's call, 2026-10-13). */}
      <Suspense fallback={<KitAtelierFallback />}>
        <KitAtelierSection />
      </Suspense>

      <Suspense fallback={null}>
        <CuratedEdits />
      </Suspense>

      {/* Reversed, so it does not read as the pass above repeated. */}
      <StandardsTicker reverse />

      <Suspense fallback={<StoryBandFallback />}>
        <StoryBand />
      </Suspense>

      <RestTicker />

      <Suspense fallback={null}>
        <Spotlight />
      </Suspense>

      <Suspense fallback={null}>
        <Journal />
      </Suspense>

      {/* Last before the close: the questions a shopper still has after the
          shelves and the story, answered beside a way to ask the studio. */}
      <Suspense fallback={<FaqFallback home />}>
        <HomeFaq />
      </Suspense>

      <StandardsTicker />
      <ClosingBand />
    </>
  );
}

/* ----------------------------------------------------------------- helpers */

/** Collection first, all products as the fallback for an unconfigured store. */
async function productsFrom(
  collection: string,
  fallbackSort?: { sortKey: string; reverse?: boolean },
): Promise<Product[]> {
  try {
    const fromCollection = await getCollectionProducts({ collection });
    if (fromCollection.length) return fromCollection;
  } catch {
    // Collection does not exist on this store - fall through.
  }

  try {
    return await getProducts(fallbackSort ?? {});
  } catch {
    return [];
  }
}

/* -------------------------------------------------------------------- hero */

/**
 * One photographic frame with everything laid over it: the origin flag and
 * blurb top-left, the CTA pill top-right, and the wordmark crossing the
 * frame's bottom edge so it reads as ink on both the photograph and the page.
 */
/**
 * Wraps the ringed phrase where it appears inside a line, so the ellipse can
 * loop a few words mid-sentence rather than a whole line.
 */
function ringWord(
  line: string,
  phrase: string,
  tone?: "deep" | "sage" | "white",
) {
  const at = line.indexOf(phrase);
  if (at === -1) return line;

  return (
    <>
      {line.slice(0, at)}
      <CircledWord tone={tone}>{phrase}</CircledWord>
      {line.slice(at + phrase.length)}
    </>
  );
}

function Hero() {
  const { statement } = hero;

  return (
    <section className="shell py-[var(--hero-gap)]">
      {/* Exactly the viewport minus the header and the gap above and below. */}
      <div className="hero-bento hero-frame" data-reveal-group>
        {/* ------------------------------------------------------- feature */}
        <Plate
          aspect={null}
          videos={heroFilms}
          videoStart={0}
          videoControls
          videoPoster="/media/hero-main-poster.jpg"
          tone={2}
          placeholderText="kozy"
          className="bento-feature group h-full w-full"
          sizes="(min-width: 1024px) 55vw, 100vw"
          alt="A floor lounge set with waffle weave and slub cotton Kompanions in warm daylight."
          reveal={false}
        >
          {/* Origin mark. A glass pill here read as a third button beside the
              two real ones at the foot of the plate; a hairline-ruled stack
              is quieter and cannot be mistaken for a control. It carries its
              own shadow because the plate's scrim is bottom-weighted and the
              top-left corner of a pale photograph gives cream type nothing. */}
          <div className="absolute left-3 top-3 z-20 flex items-stretch gap-2.5 md:left-5 md:top-5">
            <span
              aria-hidden
              className="w-px shrink-0 bg-sage/80 drop-shadow-[0_1px_2px_rgba(35,50,75,0.55)]"
            />
            <p className="flex flex-col leading-tight [text-shadow:0_1px_6px_rgba(35,50,75,0.65)]">
              <span className="eyebrow text-sage-wash">{hero.flagMark.lead}</span>
              <span className="text-ui font-semibold text-paper">
                {hero.flagMark.place}
              </span>
            </p>
          </div>

          {/* Black gradient to transparent layer for mobile view only */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-4/5 rounded-b-plate bg-gradient-to-t from-black/85 via-black/50 via-50% to-transparent lg:hidden"
          />

          <div className="absolute inset-x-3 bottom-3 z-20 flex flex-col gap-3.5 md:inset-x-5 md:bottom-5 md:gap-4">
            {/* Mobile-only textual context in crisp white */}
            <div className="flex flex-col gap-2 lg:hidden max-w-lg">
              {/* The heading is the whole caption now the paragraph is gone,
                  so it scales with the plate: 8vw keeps the widest line
                  ("Kraft-led & Konscious", 9.68em) inside a 320px screen. */}
              <h2
                data-split=""
                className="display-face font-normal leading-[1.04] tracking-[-0.015em] text-[clamp(1.75rem,8vw,2.75rem)] text-white drop-shadow-sm"
              >
                {statement.lines.map((line) => (
                  <span key={line} className="block">
                    {splitText(ringWord(line, statement.circled, "white"))}
                  </span>
                ))}
              </h2>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:gap-3">
              <ActionButton
                label={hero.primary.label}
                href={hero.primary.href}
                icon="arrow"
                variant="solid"
                className="action-btn-ivory-well"
              />
              <ActionButton
                label={hero.secondary.label}
                href={hero.secondary.href}
                icon="down"
                variant="solid"
                className="action-btn-ivory-well"
              />
            </div>
          </div>
        </Plate>

        {/* --------------------------------------------------------- saying */}
        {/* The headline alone, sized to the panel. It sat at display-lg in
            three forced lines, which used under half of this box once the
            paragraph beneath it went. Now it flows as one balanced run and
            takes its size from the panel's own width (`.bento-say-title`),
            so it fills the box at every desktop width. */}
        <div className="bento-say panel hidden lg:flex flex-col justify-center p-6 md:p-8 lg:p-9">
          <h2
            data-split=""
            className={clsx(displayFace, "bento-say-title text-balance")}
          >
            {splitText(
              ringWord(statement.lines.join(" "), statement.circled),
            )}
          </h2>
        </div>

        {/* ---------------------------------------------------- two closers */}
        <Suspense fallback={<HeroTileFallbacks />}>
          <HeroProductTiles />
        </Suspense>
      </div>

      {/* The wordmark band. It used to live inside the frame; the bento has no
          room for it, so it closes the section instead - with the block-printed
          textile letter standing in for the O. */}
      <WordmarkBand text={hero.wordmark} className="mt-6 md:mt-8" />

      <div className="flex items-center justify-between pb-10 pt-4">
        <p className="eyebrow">{hero.metaLeft}</p>
        <p className="eyebrow">{hero.metaRight}</p>
      </div>

      <h1 className="sr-only">
        {site.name} - {site.tagline}
      </h1>
    </section>
  );
}

/** One lead image per product first, then alternate shots, with no duplicates. */
function collectionGallery(products: Product[], limit = 8) {
  const ordered = [
    ...products.map((product) => product.featuredImage),
    ...products.flatMap((product) => product.images),
  ];
  const seen = new Set<string>();

  return ordered
    .filter((image) => {
      if (!image?.url || seen.has(image.url)) return false;
      seen.add(image.url);
      return true;
    })
    .slice(0, limit);
}

async function HeroProductTiles() {
  const collections = await Promise.all(
    hero.tiles.map((tile) =>
      getCollectionProducts({ collection: tile.handle }).catch(() => []),
    ),
  );
  const needsFallback = collections.some((products) => !products.length);
  const fallback = needsFallback
    ? await getProducts({ sortKey: "BEST_SELLING" }).catch(() => [])
    : [];

  return hero.tiles.map((tile, index) => {
    const products = collections[index]?.length
      ? collections[index]!
      : fallback;
    const liveGallery = collectionGallery(products);
    const tileFallback = "images" in tile && Array.isArray(tile.images)
      ? (tile.images as readonly string[]).map((url) => ({ url, altText: tile.tag }))
      : [];
    const gallery = liveGallery.length >= 2 ? liveGallery : tileFallback.length ? tileFallback : liveGallery;

    return (
      <Link
        key={tile.tag}
        href={collections[index]?.length ? `/search/${tile.handle}` : "/search"}
        className={clsx(index === 0 ? "bento-one" : "bento-two")}
        prefetch={false}
      >
        <Plate
          aspect={null}
          gallery={gallery}
          galleryAuto={Boolean(gallery && gallery.length > 1)}
          galleryDelay={index * 1600}
          galleryInterval={4000}
          showIndicators={true}
          // First viewport on desktop - the only reels on the page that are.
          priority
          tone={index === 0 ? 0 : 3}
          tag={tile.tag}
          placeholderText={index === 0 ? "kraft" : "rest"}
          arrow
          arrowTone={index === 0 ? "card" : "sage"}
          className="group h-full w-full"
          sizes="(min-width: 1024px) 22vw, 50vw"
          alt=""
          reveal={false}
        />
      </Link>
    );
  });
}

function HeroTileFallbacks() {
  return hero.tiles.map((tile, index) => (
    <Plate
      key={tile.tag}
      aspect={null}
      tone={index === 0 ? 0 : 3}
      tag={tile.tag}
      placeholderText={index === 0 ? "kraft" : "rest"}
      arrow
      arrowTone={index === 0 ? "card" : "sage"}
      className={clsx(
        "group h-full w-full",
        index === 0 ? "bento-one" : "bento-two",
      )}
      reveal={false}
    />
  ));
}

/* ------------------------------------------------- statement + lookbook */

/**
 * The oversized statement, then the staggered lookbook cluster beneath it.
 *
 * The head is inset from the left edge rather than flush to it, with the ↘
 * answering it from three-quarters across - the two together leave an open
 * band that the connecting paragraph then sits inside.
 *
 * Below that, four plates of ONE height at four different depths: highest,
 * then a drop, then the deepest, then back up halfway. Because only the first
 * plate rides at the top, the paragraph can occupy the gap the other three
 * leave - which is why the copy is absolutely placed at `lg` and simply
 * stacked below that. The cluster pages through the whole `lookbook` in fours
 * - see `LookbookDeck`, which owns the paging and the zigzag.
 */
async function BoldStatement() {
  /* The lookbook is editorial copy carrying a collection handle, and two of
     those handles have never existed on this store. An unknown collection is a
     404 now that the shop page tells a typo apart from an empty shelf, so the
     handle is resolved against Shopify before it becomes a link and a plate
     whose collection is not there opens the full catalogue instead. */
  const live = new Set(
    (await getCollections().catch(() => [])).map(
      (collection) => collection.handle,
    ),
  );

  /* A card that names a `product` is one Kompanion, not a shelf: it links to
     that product and shows its photographs. Resolved first, because whether
     the product still exists decides both the link and the pictures. */
  const products = await Promise.all(
    lookbook.map((entry) =>
      entry.product ? getProduct(entry.product).catch(() => undefined) : undefined,
    ),
  );

  /* Entries without configured stills borrow their collection's product
     photography - or their own product's. Each fetch is caught on its own: an
     outage costs a plate its photograph (it falls back to Plate's toned
     placeholder), never the section - and this section is not behind
     Suspense, so it must not throw. */
  const borrowed = await Promise.all(
    lookbook.map((entry, index) => {
      if (entry.images.length) return [];
      const product = products[index];
      if (product) return galleryFor([product], 12);
      return live.has(entry.handle)
        ? getCollectionProducts({ collection: entry.handle })
            .then((items) => galleryFor(items, 12))
            .catch(() => [])
        : [];
    }),
  );

  /* This store's collections overlap heavily - Slippers holds the Kessentials
     pair, Dabu Pillows the Kloud cushion - so the same photograph would open
     two different pages of the deck. Claim frames in list order and skip any
     already on an earlier plate - by `imageKey`, since the curated stills and
     the borrowed ones name the same file differently. */
  const claimed = new Set(
    lookbook.flatMap((entry) => entry.images.map(imageKey)),
  );

  const cards: LookbookCard[] = lookbook.map((entry, index) => {
    const alt = `${entry.title} - ${entry.tag}`;
    let images = entry.images.map((url) => ({ url, altText: alt }));

    if (!images.length) {
      const fresh = borrowed[index].filter((image) => !claimed.has(imageKey(image.url)));
      // Everything already shown elsewhere: a repeat beats a blank plate.
      images = (fresh.length ? fresh : borrowed[index])
        .slice(0, 4)
        .map((image) => ({ url: image.url, altText: image.altText || alt }));
      images.forEach((image) => claimed.add(imageKey(image.url)));
    }

    return {
      title: entry.title,
      tag: entry.tag,
      description: entry.description,
      href: products[index]
        ? `/product/${products[index]!.handle}`
        : live.has(entry.handle)
          ? `/search/${entry.handle}`
          : "/search",
      images,
    };
  });

  return (
    <section
      aria-labelledby="statement"
      className="shell pb-10 pt-12 md:pb-16 md:pt-20"
    >
      <div className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-4">
        <h2
          id="statement"
          data-split=""
          className={clsx(
            displayFace,
            "text-display-xl lg:col-span-7 lg:col-start-3",
          )}
        >
          {boldStatement.title.map((line) => (
            <span key={line} className="block">
              {splitText(line)}
            </span>
          ))}
        </h2>
        {/* Sits below the baseline of the head, not level with it - the ↘ in
            the reference hangs into the band the paragraph occupies. */}
        <ArrowDownRight className="mb-2 hidden h-10 w-10 shrink-0 md:block md:h-16 md:w-16 lg:col-span-2 lg:col-start-10 lg:mb-0 lg:h-20 lg:w-20 lg:translate-y-6" />
      </div>

      <LookbookDeck cards={cards} intro={boldStatement.body} />
    </section>
  );
}

/**
 * Holds roughly the statement's height while its lookups stream, so the
 * sections under it do not jump when it lands. Static copy, so the head is
 * the real one.
 */
function StatementFallback() {
  return (
    <section aria-hidden className="shell pb-10 pt-12 md:pb-16 md:pt-20">
      <p className={clsx(displayFace, "text-display-xl lg:pl-[16.66%]")}>
        {boldStatement.title.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
      <div className="mt-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="plate aspect-[3/4] animate-pulse" />
        ))}
      </div>
    </section>
  );
}

/** The heavy ↘ that answers the statement. Drawn to match the display weight. */
function ArrowDownRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 7l10 10" />
      <path d="M17 8v9H8" />
    </svg>
  );
}

/* --------------------------------------------------------------- filters */

async function CollectionFilters() {
  const categories = shopCategories(await getPrimaryMenu());
  if (!categories.length) return null;

  return (
    // The category row every reference store puts directly under the hero,
    // run edge to edge as a ticker. Kept tight: the statement below brings
    // its own top space.
    <section aria-label="Browse categories" className="overflow-x-clip pb-2 md:pb-4">
      <CollectionPillRail items={categories} />
    </section>
  );
}

/* --------------------------------------------------------------- rails */

const BESTSELLERS_COLLECTION_HANDLE = "bestsellers";

async function Bestsellers() {
  // The merchant's hand-picked "Bestsellers" collection, in its Admin order.
  // It used to ask for `popular`, which never existed, so the rail silently
  // fell through to the store-wide BEST_SELLING sort. That fallback stays for
  // the day the collection is renamed or emptied, and "View all" follows the
  // same guard rather than linking a handle that would 404.
  const [products, collections] = await Promise.all([
    productsFrom(BESTSELLERS_COLLECTION_HANDLE, { sortKey: "BEST_SELLING" }),
    getCollections().catch(() => []),
  ]);
  if (!products.length) return null;

  const viewAllHref = collections.some(
    (collection) => collection.handle === BESTSELLERS_COLLECTION_HANDLE,
  )
    ? `/search/${BESTSELLERS_COLLECTION_HANDLE}`
    : "/search";

  return (
    <section aria-labelledby="bestsellers" className="overflow-x-clip">
      <SectionHead
        eyebrow="Bestsellers"
        title={<span id="bestsellers">Step into morning luxuries</span>}
        count={products.length}
        action="View all"
        actionHref={viewAllHref}
      />
      <Carousel label="Bestselling objects">
        {products.map((product, index) => (
          <ProductCard
            key={product.handle}
            product={product}
            priority={index < 3}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 85vw"
          />
        ))}
      </Carousel>
    </section>
  );
}

/**
 * The palette, as a way into the shop.
 *
 * Six coils, each a link into the SHOP filtered to that colour - `/search?
 * colour=...`, the same parameter the shop's own sidebar writes, so a shopper
 * lands on the grid with the checkbox already ticked and every other filter
 * still available to them. "All colours" leads to /shop-by-colour instead, for
 * browsing the palette itself.
 *
 * The same rail component as that page, reading the same Shopify metaobjects.
 * Nothing about this section is written down here: add a seventh colour in
 * Shopify and it appears, reorder them and this reorders.
 *
 * Counts are off. On the shop page the number is how a shopper judges whether a
 * colour is worth a click; here it is a teaser, and "2 Kompanions" under a coil
 * undersells a palette.
 */
async function ShopByColour() {
  const entries = await getColourEntries();

  // Nothing to tease if the merchant has not built the palette yet, or if every
  // colour is still waiting on products.
  if (!entries.some((entry) => entry.count > 0)) return null;

  const colours: RailColour[] = entries.map((entry) => ({
    ...entry,
    href: shopColourHref(entry.key),
  }));

  return (
    <section aria-labelledby="shop-by-colour" className="overflow-x-clip">
      <SectionHead
        eyebrow="Shop by kolour"
        title={<span id="shop-by-colour">Choose your Kozy kolour</span>}
        action="All kolours"
        actionHref={SHOP_BY_COLOUR_PATH}
      />
      <div className="shell pb-10 md:pb-14">
        <ColourRail colours={colours} showCounts={false} mobileGrid />
      </div>
    </section>
  );
}

/** More than this and a closed panel is too narrow for its own title. */
const MAX_MOOD_PANELS = 5;

/**
 * The second way in, beside colour: not "what shade" but "what moment".
 *
 * One tall photograph per live mood, and the one under the pointer opens wide
 * - see `mood-panels.tsx`. Each is a link to /shop-by-mood with that mood
 * already chosen, landing on its Kompanions. Moods with nothing in them yet
 * are left out here: /shop-by-mood shows them as "coming soon", but a teaser
 * that leads to an empty shelf is not one.
 *
 * Like the colour rail above it, nothing here is written down: the moods,
 * their order and their lines are the `shop_mood` metaobjects in Shopify.
 */
async function ShopByMood() {
  const [catalog, moods] = await Promise.all([getCatalog(), getMoods()]);
  const live = moodEntries(moods, catalog)
    .entries.filter((entry) => entry.count > 0)
    .slice(0, MAX_MOOD_PANELS);

  if (!live.length) return null;

  const panels: MoodPanel[] = live.map((entry) => ({
    key: entry.key,
    label: entry.label,
    description: entry.description,
    count: entry.count,
    href: moodHref(entry.key),
    image: entry.images[0]
      ? { url: entry.images[0].url, altText: entry.images[0].altText }
      : null,
  }));

  const copy = shopByMood.home;

  return (
    <section aria-labelledby="shop-by-mood" className="overflow-x-clip">
      <SectionHead
        eyebrow={copy.eyebrow}
        title={<span id="shop-by-mood">{copy.title}</span>}
        action={copy.action}
        actionHref={SHOP_BY_MOOD_PATH}
      />
      <div className="shell pb-10 md:pb-14">
        <MoodPanels
          moods={panels}
          label={copy.eyebrow}
          explore={copy.explore}
        />
      </div>
    </section>
  );
}

function RailFallback() {
  return (
    <div className="shell py-16">
      <div className="mx-auto h-10 w-64 animate-pulse rounded-chip bg-wash" />
      <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="panel p-3">
            <div className="plate aspect-square w-full animate-pulse" />
            <div className="mt-4 h-4 w-2/3 animate-pulse rounded-chip bg-wash" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------- standards ticker */

/**
 * The house glyphs on a quiet band. It runs three times on this page - after
 * the first shelves, before the story band and before the closing band - and
 * alternates direction so no pass reads as the one before it repeated.
 */
function StandardsTicker({ reverse = false }: { reverse?: boolean }) {
  return (
    <section
      aria-label="What every Kompanion carries"
      className="overflow-x-clip bg-paper py-6 md:py-8"
    >
      <IconMarquee reverse={reverse} />
    </section>
  );
}
/* ------------------------------------------------------------ rest ticker */

/** Full-bleed ticker, each repeat punctuated by the sage asterisk. */
function RestTicker() {
  return (
    <section aria-label="Moments of rest" className="rule-y overflow-x-clip py-5 md:py-7">
      <Marquee
        phrases={Array.from(
          { length: restTicker.repeat },
          () => restTicker.label,
        )}
        size="display"
        separator="✳"
        separatorTone="sage"
        duration={38}
        className="[--sep-scale:1.4]"
      />
    </section>
  );
}

/* ------------------------------------------------------------ commerce */

async function CuratedEdits() {
  // Newest first across the whole catalogue. This used to ask for a `blend`
  // collection the store has never had, fail, and land here anyway - one
  // wasted Shopify round trip and a "No collection found" log line on every
  // homepage regeneration.
  const products = (
    await getProducts({ sortKey: "CREATED_AT", reverse: true }).catch(() => [])
  ).slice(0, 3);

  if (!products.length) return null;

  return (
    <section aria-labelledby="curated-edits">
      <SectionHead
        eyebrow="Just In"
        title={<span id="curated-edits">New Kompanions</span>}
        count={products.length}
        action="View all"
        actionHref="/search"
      />
      <ul className="shell grid grid-cols-1 gap-3 pb-10 sm:grid-cols-2 lg:grid-cols-3 md:pb-14">
        {products.map((product) => (
          <li key={product.handle}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------- spotlight */

async function Spotlight() {
  let product: Product | undefined;
  try {
    const [first] = await getProducts({ sortKey: "BEST_SELLING" });
    product = first;
  } catch {
    return null;
  }

  if (!product) return null;

  const price = product.priceRange.minVariantPrice;

  return (
    <section aria-labelledby="feature" className="shell py-10 md:py-14">
      <div className="panel grid grid-cols-1 overflow-hidden lg:grid-cols-2">
        <div className="p-3">
          <Plate
            src={product.featuredImage?.url}
            alt={product.featuredImage?.altText || product.title}
            aspect="1/1"
            // This section is streamed through Suspense. Opting it into the
            // global DOM-scanned reveal lets GSAP write inline styles in the
            // short window after the HTML arrives but before React hydrates
            // the boundary, producing a real hydration mismatch. The panel is
            // already below the fold and does not need a second entrance.
            reveal={false}
            placeholderText="spotlight"
            tone={2}
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        </div>

        <div className="flex flex-col justify-center p-6 md:p-12">
          <Eyebrow align="left">{featureBand.eyebrow}</Eyebrow>
          <Headline id="feature" size="lg" className="mt-4">
            {product.title}
          </Headline>
          <p className="ui-mono mt-4 font-semibold">
            <Price amount={price.amount} currencyCode={price.currencyCode} />
          </p>
          {product.description ? (
            <p className="body-mono mt-5 max-w-measure">
              {product.description.slice(0, 240)}
              {product.description.length > 240 ? "…" : ""}
            </p>
          ) : null}
          {/* The same one-tap controls as every card, so the featured
              Kompanion is as quick to buy as it is to look at. */}
          <CardBuyControls
            // Only what the controls read: the whole product would ship its
            // description and every image to the client for nothing.
            product={{
              id: product.id,
              handle: product.handle,
              title: product.title,
              availableForSale: product.availableForSale,
              featuredImage: product.featuredImage,
              variants: product.variants,
            }}
            className="mt-8 max-w-sm"
          />
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link href={`/product/${product.handle}`} className="btn-outline">
              View piece
            </Link>
            <Link href="/search" className="link-arrow">
              All objects <ArrowUpRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
/* -------------------------------------------------------------- journal */

async function Journal() {
  const articles = await getArticles(3).catch(() => []);

  return (
    <section aria-labelledby="journal">
      <SectionHead
        eyebrow="Dispatch"
        title={<span id="journal">From the Living Journal</span>}
        action="More entries"
        actionHref="/blogs"
      />
      <ul className="shell grid grid-cols-1 gap-3 pb-10 md:grid-cols-3 md:pb-14">
        {articles.length
          ? articles.map((article, index) => (
              <li key={article.id}>
                <ArticleCard article={article} index={index} />
              </li>
            ))
          : journalPosts.map((post, index) => (
              <li key={post.slug}>
                <Link href="/blogs" className="group block">
                  <Plate
                    src={"image" in post ? (post.image as string) : undefined}
                    aspect="4/3"
                    arrow
                    tone={(index % 4) as 0 | 1 | 2 | 3}
                    placeholderText="journal"
                    sizes="(min-width: 768px) 33vw, 100vw"
                    alt={post.title}
                  />
                  <h3 className="serif mt-4 text-display-sm">{post.title}</h3>
                  <p className="body-mono mt-2 line-clamp-3">{post.excerpt}</p>
                </Link>
              </li>
            ))}
      </ul>
    </section>
  );
}

/* -------------------------------------------------------- closing band */

/** Mirrors the hero: one frame, a pill, a paragraph, and the wordmark. */
function ClosingBand() {
  return (
    <section
      aria-label="Start shopping"
      className="shell overflow-x-clip pb-[9vw] pt-4"
    >
      <div className="relative">
        <Plate
          src={"image" in ctaBand ? (ctaBand.image as string) : undefined}
          aspect="2/1"
          tone={3}
          placeholderText="home"
          className="w-full min-h-[22rem]"
          sizes="100vw"
          alt="A lived-in floor lounge: biscuit pillows, a waffle throw and an unhurried morning."
        >
          {/* Over the still, which stays as the fallback if the film fails. */}
          <ClosingFilm clips={ctaBand.videos} />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 rounded-plate bg-gradient-to-b from-black/55 via-black/20 to-transparent"
          />
          <div className="absolute inset-x-3 top-3 z-20 flex flex-col items-start gap-3 md:inset-x-5 md:top-5 md:flex-row md:items-start md:justify-between md:gap-6">
            <ActionButton
              label={ctaBand.pill}
              href={ctaBand.href}
              variant="glass"
            />
            <p className="max-w-[22rem] text-spec text-paper md:max-w-[18rem] md:text-right drop-shadow-sm">
              {ctaBand.body}
            </p>
          </div>
        </Plate>

        <Link
          href={ctaBand.href}
          aria-label={ctaBand.wordmark}
          data-split=""
          className="wordmark absolute inset-x-0 bottom-0 z-10 block translate-y-[46%] select-none whitespace-nowrap text-center leading-[0.78] text-ink"
        >
          {splitText(ctaBand.wordmark)}
        </Link>

        <div className="absolute bottom-0 hidden md:block right-4 z-20 translate-y-[28%] md:right-12">
          <Seal text={ctaBand.seal} size="md" reverse />
        </div>
      </div>
    </section>
  );
}
