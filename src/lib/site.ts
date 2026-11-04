/**
 * Brand content for Kozy Living.
 *
 * Every piece of editorial copy on the marketing surfaces lives here rather
 * than being inlined in JSX, so the voice can be revised in one pass without
 * touching layout. Commerce data (products, collections, prices) still comes
 * from Shopify - this file covers the storytelling around it.
 *
 * VOICE: "Kompanions", not products or pieces. Rest, ritual and intention,
 * not luxury or indulgence. "Krafted" with a K is the house spelling and is
 * used deliberately - never correct it to "crafted" in brand lines.
 *
 * UNVERIFIED VALUES are marked `TODO(brand)`. They are placeholders that keep
 * a surface from rendering empty; replace them before launch.
 */

export const productDiscovery = {
  title: "More of your kind.",
  browse: "Explore",
  cardLabel: "The kollection edit",
  soldOut: "Sold out",
  from: "from",
} as const;

/**
 * The size guide on the product page. The table, fit note and measuring
 * steps are the merchant's (`size_chart` metaobjects in Admin); this is only
 * the frame around them.
 */
export const sizeGuide = {
  open: "Size guide",
  title: "Find your fit",
  close: "Close size guide",
  units: "Units",
  unitLabels: { in: "in", cm: "cm" },
  yourSize: "Your pick",
  howToMeasure: "How to measure",
} as const;

export const productStudio = {
  eyebrow: "A note from the studio",
  title: "Small rituals. Thoughtful beginnings.",
  description: "We’re Kozy Living. We design textiles in-house and work with craft clusters across India to bring a little more intention to your everyday.",
  action: "Meet Kozy Living",
  stamp: "Krafted in India",
  founderLabel: "The person behind Kozy",
  originLabel: "Where we make",
  origin: "With craft clusters across India",
  materialLabel: "What we work with",
  material: "Natural fibres & traditional Dabu printing",
} as const;

export const site = {
  name: "Kozy Living",
  wordmark: "KOZY",
  wordmarkAccent: "LIVING",
  tagline: "Reimagined Indian Kraft to Give You Moments of Rest",
  /** The brand's own closing line. Used wherever one sentence has to carry it. */
  statement:
    "You don't need to add more to your day. Just do what you do with more intention.",
  origin: "India",
  description:
    "Craft-led, konscious textiles from India. Cotton waffle weaves, slub cottons, percale, linen blends and wool - designed in-house, made with craft clusters across the country, and finished with traditional Dabu hand-block printing.",
  founder: "Khushi Faruqui",
  founderCredential: "Textile Design, NIFT Delhi",
  /** Khushi's own account - distinct from `instagram` below, which is the
      brand's. Used only on `/founders-note`, where the byline is hers. */
  founderInstagram: "@khushifaruqii",
  founderInstagramUrl: "https://www.instagram.com/khushifaruqii/",
  instagram: "@kozyliving_",
  instagramUrl: "https://www.instagram.com/kozyliving_/",
  /**
   * The header logo (`LogoSquare`): KOZY, LIVING and "Rooted in Rituals".
   * The file in Shopify is a 3375x4219 portrait canvas with its ink (puffed
   * KOZY and its shadow, LIVING, the strapline) at (613,1698)-(2756,2707),
   * so the URL asks Shopify's CDN to crop to that box plus a few pixels
   * (`crop=region`); without it the mark renders tiny inside a mostly empty
   * canvas. `ShopImage` then adds the `width`. `width` and `height` are the
   * CROPPED box - they set the aspect ratio, not the bytes.
   *
   * ⚠️ The crop is in the file's own pixels, so it is tied to this upload
   * (`v=`). When the artwork is replaced in Shopify, re-measure the ink box
   * and update all of it together - a crop measured on an earlier file
   * (3836x2160) ran off the next canvas and cut the logo off.
   */
  logo: {
    url: "https://cdn.shopify.com/s/files/1/0978/6723/5641/files/Untitled_design_20261019_144701_0000.png?v=1793131320&crop=region&crop_left=607&crop_top=1692&crop_width=2156&crop_height=1022",
    width: 2156,
    height: 1022,
  },
  /**
   * The photograph on the social card (`components/opengraph-image.tsx`).
   * A 4:5 portrait with its own type baked in ("Shared rituals with your
   * furrie" at the top, a strapline at the foot), so the card shows it WHOLE
   * down its left side rather than cropping it to the card's 1.91:1 - a crop
   * that wide cuts off both lines of type. `?width=` is the card's own column
   * (630 tall at 4:5), so the CDN sends exactly the pixels drawn.
   */
  socialImage: {
    url: "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_1187_7a482946-4a79-4607-9ac5-0203344c6e13_copy_2_jpg.jpg?v=1792003821",
    width: 1200,
    height: 1500,
  },
} as const;

/**
 * Photographs of the founder herself - real stills, not studio product shots
 * standing in for a portrait. Used on `/founders-note` (masthead, the letter's
 * side column, the closing panel) and as the founder's card on `/about-us`.
 *
 * These are raw Shopify file URLs, not the transformed CDN images the
 * Storefront API returns, so `ShopImage`'s loader rewrites them by `?width=`
 * rather than by the `_NNNNx` filename suffix - see the note in
 * `shop-image.tsx`. Capped at 2048 there either way.
 */
export const founderImages = [
  {
    url: "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/WhatsApp_Image_2026-02-08_at_11.59.15_PM.jpg?v=1790369996",
    alt: "Khushi Faruqui, founder of Kozy Living.",
  },
  {
    url: "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_1171_43dfc109-e3d3-4a11-b902-f6443ff961fa.jpg?v=1790369997",
    alt: "Khushi Faruqui at work in the Kozy Living studio.",
  },
  {
    url: "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_6338_eea1aae1-4c9b-4571-8f07-f080a9d1fbeb.jpg?v=1790369997",
    alt: "Khushi Faruqui with Kozy Living textiles.",
  },
  {
    url: "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_2755_9be99538-96aa-4529-a92c-1c67d6431b73.jpg?v=1790369997",
    alt: "Khushi Faruqui, founder of Kozy Living.",
  },
  {
    url: "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_6412_d18c7de3-251f-46e0-9763-eb814a5fa2a5.jpg?v=1790370000",
    alt: "Khushi Faruqui in the studio with the craft clusters' work.",
  },
] as const;

/**
 * The reel on `/founders-note` - `founderImages` plus a silent clip and one
 * more still, for the auto-scrolling column beside the letter.
 *
 * One entry is a VIDEO, not a photograph - `FounderReel` renders it as a
 * silent, looping `<video>` rather than through `ShopImage`, which only
 * handles Shopify's image transform. Its `poster` is the one non-portrait
 * still in the set (a product promo frame): named `..._Poster_...` on
 * Shopify, and used here for exactly that job, so the reel never shows a
 * blank tile before the clip has a frame to paint.
 */
export const founderReel = [
  ...founderImages,
  {
    type: "video" as const,
    url: "https://cdn.shopify.com/videos/c/o/v/806a125208a44b90ad1c2e7ae99d6494.mp4",
    poster:
      "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/NEW_PRODUCT_WATCH_SALE_PROMO_Poster_25bd1395-74aa-4e03-8808-487406600e3f.png?v=1788636327",
    alt: "A moment from the Kozy Living studio, in motion.",
  },
  {
    url: "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_8778.jpg?v=1788636329",
    alt: "Khushi Faruqui with Kozy Living textiles.",
  },
  {
    url: "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_1235.jpg?v=1788636320",
    alt: "Kozy Living Textiles, styled.",
  },
  {
    url: "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/NEW_PRODUCT_WATCH_SALE_PROMO_Poster_-_4.jpg?v=1788636319",
    alt: "A Kozy Living Kompanion.",
  },
  {
    url: "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_1214.jpg?v=1788636316",
    alt: "Kozy Living Textiles, styled.",
  },
  {
    url: "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/NEW_PRODUCT_WATCH_SALE_PROMO_Poster_-_10.jpg?v=1788636316",
    alt: "A Kozy Living Kompanion.",
  },
] as const;

/*
 * NOTE: navigation lives in Shopify, not here.
 *
 * The header, the mobile drawer, the search overlay and the homepage category
 * rail all read the "main-menu" menu through `getPrimaryMenu()`. There is
 * deliberately no hard-coded nav in this file: a fallback list silently
 * replaced the real menu for months here, and shipped links to collection
 * handles the store never had.
 */

/** The quiet line above the header. */
export const announcement = "Reimagined Indian kraft to give you moments of rest";

/* ------------------------------------------------------------------ homepage
   The sections below map one-to-one onto the homepage layout, in page order.
------------------------------------------------------------------------- */

/**
 * Hero. One photographic frame carrying a flagged blurb top-left, a black pill
 * CTA top-right, and the wordmark bleeding across its bottom edge.
 *
 * There is deliberately no star rating here. The previous copy carried an
 * invented "4.9 / 2,400+ homes styled" - social proof is the one thing a
 * storefront must never make up, so the slot carries a factual origin flag
 * instead.
 */
export const hero = {
  flag: "Handkrafted by Indian kraft klusters",
  /**
   * The same claim, split for the two-line origin mark on the hero plate.
   * Kept beside `flag` rather than derived from it: the social card (which
   * cannot read this layout) still wants the sentence whole.
   */
  flagMark: { lead: "Handkrafted", place: "by Indian kraft klusters" },
  blurb:
    "Kozy Living Textiles are your in-between Kompanions - krafted from 100% natural fibres to turn everyday moments into mindful daily rituals.",
  /**
   * The statement panel in the top-right of the bento - the headline alone.
   * The body paragraph that used to sit under it was removed at the owner's
   * request; the panel now gives the whole box to the type.
   *
   * "Konscious", with the s - it read "Koncious" here while the story page
   * spelled it correctly.
   */
  statement: {
    lines: ["Kraft-led & Konscious", "textiles for", "everyday rituals"],
    /** Ringed by the hand-drawn ellipse. Must appear in `lines` verbatim. */
    circled: "everyday rituals",
  },
  /** The two small plates that close the bento. */
  tiles: [
    {
      tag: "#KESSENTIALS",
      handle: "kessentials",
      images: [
        "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_1675.jpg?v=1788636340",
        "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_1695.png?v=1788636343",
        "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_1677.jpg?v=1788636340",
      ],
    },
    {
      tag: "#KRAFTEDKOMPANIONS",
      // Was `kozy-lounge`, which the store has never had: the tile fell back
      // to bestseller photographs and a bare /search link.
      handle: "krafted-by-kozy",
      images: [
        "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/900E9CCD-5302-4863-A642-251A2207515C.jpg?v=1788636354",
        "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/85aeb9ef-fd0d-4cf2-a72f-af881a17b4fb.jpg?v=1788636352",
        "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_1033.jpg?v=1788636330",
      ],
    },
  ],
  primary: { label: "Shop Kompanions", href: "/search" },
  secondary: { label: "Our story", href: "/about-us" },
  /** The circular button that sits on the feature photograph. */
  circle: { label: "Shop now", href: "/search" },
  /** Set in the display face in the band below the frame. The O is the
      block-printed textile letter, not type - see WordmarkBand. */
  wordmark: "kozy living",
  metaLeft: "Rooted in Indian Kraft",
  metaRight: "100% Natural Fibres",
} as const;

/**
 * Every film the hero bento plays, in one list.
 *
 * All three plates draw from THIS list and nothing else - there are no
 * per-plate clips. Each starts on its own entry (the first three, in order)
 * and then takes the next free film from the shared queue, so the reel runs
 * end to end across the bento rather than each box looping a playlist of its
 * own. Two plates can never land on the same film: a film is checked out
 * while it is on screen and checked back in when it leaves, in
 * `@/lib/hero-clips`.
 *
 * Ordering matters twice over. The first three are what the page paints
 * before any JavaScript runs, so they are the ones worth leading with; and
 * because the queue is walked in order, the list is also the running order.
 * Keep at least one more film here than there are plates, or the queue has
 * nothing free to hand out.
 */
export const heroFilms = [
  // H.264/fast-start rendition of the 46.3 MB HEVC original (6.3 MB): it
  // starts reliably across browsers and costs far less to decode. It lived in
  // public/media until 2026-11-04, which put every play on Vercel's metered
  // bandwidth; this is the same file uploaded to Shopify. Do not swap it back
  // for the HEVC original.
  "https://cdn.shopify.com/videos/c/o/v/e1c708f50e1b4e5badb08fb0d360e217.mp4",
  "https://cdn.shopify.com/videos/c/o/v/3329bb6694284f05be3d3ff8a0bb6f22.mp4",
  "https://cdn.shopify.com/videos/c/o/v/65fa358ea2ec488f9c62e7f86d758f3c.mp4",
  "https://cdn.shopify.com/videos/c/o/v/e78b76a026054863975d667b63071a21.mp4",
  "https://cdn.shopify.com/videos/c/o/v/d761713a789d44c3bb7f5b6686912560.mp4",
  "https://cdn.shopify.com/videos/c/o/v/754450888c474683bb51918287cdcdca.mp4",
  "https://cdn.shopify.com/videos/c/o/v/4c106e1353e5404dbc1622f13a2de9d2.mp4",
] as const;

/** The oversized statement that opens the editorial half of the page. */
export const boldStatement = {
  title: ["The In-Between", "Luxury"],
  body: "Between one routine and the next, there is a little space to breathe. Kreate your Kozy Korner and simply be. No new rituals - just five minutes of mindful rest, with your Kompanion beside you.",
} as const;

/**
 * The staggered lookbook cluster, read four at a time. The arrows above the
 * cluster page through this list in fours, so its length should stay a
 * multiple of four - a short last page leaves a hole in the zigzag.
 *
 * The zigzag itself belongs to the four SLOTS, not to these entries (see
 * `LookbookDeck`), so reordering this list never changes the shape.
 *
 * `handle` does two jobs, as in the story band: it is the destination (only
 * when the collection is live - a dead handle opens the full catalogue) and,
 * where `images` is empty, the source of the plate's photography, borrowed
 * from that collection's products. Configured stills win over live ones.
 *
 * Tags name the fibre or the craft where the brand has named one; they feed
 * the alt text and the placeholder's ghost type, not the visible card.
 */
export type LookbookEntry = {
  tag: string;
  title: string;
  description: string;
  handle: string;
  /**
   * A product handle, for a card that is ONE Kompanion rather than a shelf -
   * the His & Her kit is a product in Shopify, not a collection. When set, the
   * card links to that product and borrows its photographs; `handle` is only
   * the fallback destination if the product has been removed.
   */
  product?: string;
  images: readonly string[];
};

export const lookbook: readonly LookbookEntry[] = [
  {
    tag: "dabu",
    description:
      "Our Dabu hand-block printed line - robes, slippers, pillows and kits.",
    title: "Krafted by Kozy",
    handle: "krafted-by-kozy",
    images: [],
  },
  {
    tag: "waffle",
    description: "Everyday waffle-weave staples in easy, honest cotton.",
    title: "Kessentials",
    handle: "kessentials",
    images: [
      "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_1675.jpg?v=1788636340",
      "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_1695.png?v=1788636343",
      "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_1677.jpg?v=1788636340",
      "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_1694_d0fd0a48-49cb-46ac-a8ec-fbf065b857f6.jpg?v=1788636341",
    ],
  },
  {
    tag: "pets",
    description:
      "Carriers, seating and clothing for the Kompanion who shares your slow hours.",
    title: "Pet Kollection",
    handle: "pet-collection",
    images: [],
  },
  {
    tag: "rituals",
    description:
      "A his & hers set in natural cotton, Natural Indigo and Tulsi - robes, slippers and more.",
    title: "His & Her Ritual Kit",
    // A single Kompanion rather than a shelf - see `product` on the type.
    product: "neelu-tulsi-his-hers-ritual-kit",
    handle: "ritual-kits",
    images: [],
  },
  {
    tag: "dabu",
    description:
      "Dabu-printed carriers and matching pieces for both ends of the leash.",
    title: "Pet & Parent",
    handle: "pet-parent",
    images: [
      "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_4035.png?v=1788636358",
      "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/CEDD7B20-D83F-4050-9CEB-D693C7AE6269.jpg?v=1788636170",
      "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/5A7D8EAA-E90A-4449-B0C0-4C7C5CA38535.jpg?v=1788636170",
      "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/DB2B40CD-1A34-48FC-98D5-63220DD3DD2B.jpg?v=1788636171",
    ],
  },
  {
    tag: "waffle",
    description:
      "Soft layers for slow mornings, long evenings and everything between.",
    title: "Bathrobes",
    handle: "bathrobes",
    images: [],
  },
  {
    tag: "dabu",
    description:
      "Hand-block printed pillows that bring a quiet, artful mood to a korner.",
    title: "Dabu Pillows",
    handle: "decorative-throw-pillows",
    images: [],
  },
  {
    tag: "slippers",
    description: "Soft slippers for the unhurried hours between rooms.",
    title: "Slippers",
    handle: "slippers",
    images: [],
  },
  {
    tag: "rituals",
    description:
      "Kompanions gathered into one set for a slower morning ritual.",
    title: "Ritual Kits",
    handle: "ritual-kits",
    images: [],
  },
  {
    tag: "dabu",
    description: "Dabu-printed carriers for the outings you take together.",
    title: "Pet Karrier",
    handle: "pet-carrier",
    images: [],
  },
  {
    tag: "pets",
    description:
      "Low, soft seating so your Kompanion has a korner of their own.",
    title: "Pet Seating",
    handle: "pet-seating",
    images: [],
  },
  {
    tag: "pets",
    description: "The same fibres and prints as their parent's, scaled down.",
    title: "Pet Klothing",
    handle: "pet-clothing",
    images: [],
  },
];

/**
 * The homepage story band - the brand's own section, sitting between the
 * icon ticker and the studio quote.
 *
 * FOUR PILLARS, and every claim here is one the brand already makes on
 * `/about-us` (see `whyKraft` and `sustainability`): the fibre, the makers,
 * the print and the purpose. Nothing invented, nothing certified that has not
 * been earned.
 *
 * `collection` is a Shopify handle and does two jobs: the card borrows that
 * collection's live product photography, and - only when the handle actually
 * exists on the store - the card links into it. A handle the merchant has not
 * built falls back to `href` and to the stills below, so the band never ships
 * a dead link or an empty frame.
 *
 * `lede.accent` is set in the UI face's true italic, in sage. Franxurter has
 * one upright weight and no italic, so the emphasis lives on Jakarta - and
 * sage measures 6.50 on the indigo scrim these cards carry, which is where
 * flat sage is allowed to hold type.
 */
export const aboutStory = {
  eyebrow: "About Kozy Living",
  /**
   * Broken by hand, and kept SHORT on purpose: this heading sets in Franxurter
   * inside the narrow left column of a two-column band, where a long line
   * simply rewraps and the hand-set rag stops meaning anything. The ellipse
   * loops the phrase below, so keep it verbatim and keep it on one line.
   */
  title: ["Behind your", "shared rituals"],
  summary:
    "To us, shared rituals go beyond our homes. They konnect us to the hands and heritage behind what we bring into them. At Kozy Living, we share these rituals with Indian craftspeople, collaborating to bring uplifting crafts into modern homes and everyday living.",
  circled: "shared rituals",
  body: "Kozy Living began with one idea: you don't need to add more to your day. Everything we make is designed in-house, worked in 100% natural fibres, and made with craft clusters across India - so the ten minutes you already take feel like a ritual rather than a gap.",
  /** Sits under the meter on wide screens, where the left column has room. */
  meterNote:
    "Four things we don't compromise on - the cloth, the hands, the print, and what the Kompanion is actually for.",
  primary: { label: "Read about our kraft", href: "/about-us" },
  secondary: { label: "Meet the Kompanions", href: "/search" },
  /** The panel that closes the rail - see the note in `story-board.tsx`. */
  closing: {
    label: "The long version",
    title: "Everything behind the cloth",
  },
  pillars: [
    {
      index: "01",
      kicker: "The cloth",
      lede: { lead: "Konsciousness is at the kore of", accent: "Kozy Living" },
      body: "We kollaborate with craft clusters across India to bring uplifting crafts like Dabu hand block printing into modern homes through Recrafted by Kozy.",
      cta: "See the weaves",
      collection: "kessentials",
      href: "/about-us",
      alt: "Waffle weave and slub cotton Kompanions folded on the studio table.",
      /** Owner-chosen photograph: shown in place of the collection's shots. */
      pinImages: true,
      images: [
        "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/189666_jpg.jpg?v=1791720168",
      ],
    },
    {
      index: "02",
      kicker: "The hands",
      lede: { lead: "Hand block printed by the", accent: "Kraft Klusters of India" },
      body: "Krafted by the Chippa community of Pipar City, each Kompanion celebrates generations of artisanal rituals & care through design.",
      cta: "Meet the collective",
      /* No handle: the makers are not a shelf. This card always goes to the
         story, and always uses the studio stills. */
      collection: null,
      href: "/about-us",
      alt: "Cloth on the studio table part-way through a hand-block print run.",
      images: [
        "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/9774ec93-dce6-49a1-ba50-ec350ae25b8b.jpg?v=1788636351",
        "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_1876_d3c112d9-c774-458b-b8a9-fd12fc7e056e.jpg?v=1788636349",
        "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_1880.jpg?v=1788636348",
      ],
    },
    {
      index: "03",
      kicker: "The print",
      lede: { lead: "Dabu", accent: "Handblock Printing" },
      body: "Kozy Living's first Kraft Kapsule Kollection features Dabu printing, a traditional mud-resist dyeing technique rooted in Jodhpur, Rajasthan.",
      cta: "See Dabu pieces",
      collection: "decorative-throw-pillows",
      href: "/blogs",
      alt: "A Dabu hand-block print in indigo, close on the weave.",
      images: [
        "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_1895_c94dd5b4-daca-47b9-94aa-d5aa31527cd5.jpg?v=1788636351",
        "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_4035.png?v=1788636358",
        "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/CEDD7B20-D83F-4050-9CEB-D693C7AE6269.jpg?v=1788636170",
      ],
    },
    {
      index: "04",
      kicker: "The point",
      lede: { lead: "The Kozy", accent: "Grounded Korner" },
      body: "Sitting on the floor can help you feel grounded and reconnect with yourself. Make room for a simple everyday ritual that brings you back to the present, with komfort rooted in tradition.",
      cta: "Shop Kompanions",
      // No floor-lounging collection exists yet (`kozy-lounge` never did), so
      // the card shows its own still and links to `href`. Name a real handle
      // here once the merchant creates one.
      collection: null,
      href: "/search",
      alt: "A floor lounge layered with biscuit pillows and a linen blend throw.",
      images: [
        "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_0689_jpg.jpg?v=1791719891",
      ],
    },
    {
      index: "05",
      kicker: "The ritual",
      lede: { lead: "Matching", accent: "Shared Rituals." },
      body: "Matching ritual robes for the shared rituals, kozy mornings and the little moments that make life together feel a little more Kozy.",
      cta: "Explore ritual kits",
      collection: "ritual-kits",
      href: "/search",
      alt: "Soft cotton pieces for everyday moments of rest.",
      images: [
        "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_1695.png?v=1788636343",
        "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_1675.jpg?v=1788636340",
      ],
    },
    {
      index: "06",
      kicker: "The Kompanions",
      lede: { lead: "Shared Rituals,", accent: "on your coffee dates" },
      body: "Karriers, furrie Klothing and shared accessories, so no outing is incomplete without your furrie Kompanion.",
      cta: "Meet the pet kollection",
      collection: "pet-collection",
      href: "/search",
      alt: "Hand-block printed pieces for pets and their people.",
      images: [
        "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_4035.png?v=1788636358",
        "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/CEDD7B20-D83F-4050-9CEB-D693C7AE6269.jpg?v=1788636170",
      ],
    },
  ],
} as const;

/**
 * The dark quote card. This is the brand's own closing line, so it is
 * attributed to the studio rather than to a named person - putting invented
 * words in a real founder's mouth is not a thing a storefront should do.
 *
 * TODO(brand): swap for a real line from Khushi if one is on record.
 */
export const testimonial = {
  quote: site.statement,
  name: site.name,
  role: "The studio philosophy",
  image:
    "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_1876_d3c112d9-c774-458b-b8a9-fd12fc7e056e.jpg?v=1788636349",
} as const;

/**
 * Scrolling strip between the quote and the closing CTA.
 *
 * Carries a brand line rather than a discount: the previous "Discount 20%"
 * ticker advertised an offer that does not exist.
 */
export const restTicker = {
  label: "Moments of Rest",
  repeat: 8,
} as const;

/** The closing call-to-action band that mirrors the hero. */
export const ctaBand = {
  pill: "Get started",
  body: "Meet the Kompanions krafted to sit alongside the routines you already have - and to make them feel like rituals.",
  wordmark: "shop now",
  href: "/search",
  seal: "krafted for moments of rest · ",
  image:
    "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_1876_d3c112d9-c774-458b-b8a9-fd12fc7e056e.jpg?v=1788636349",
  /**
   * Played in turn over `image` by `ClosingFilm`. Both are 720x1280 Reels
   * (7.8s, 16.5s) - portrait, so they are shown whole, never cover-cropped.
   */
  videos: [
    "https://cdn.shopify.com/videos/c/o/v/60506f057262408bb2c031bf02906384.mp4",
    "https://cdn.shopify.com/videos/c/o/v/07ea0efa4b784c2d94223580e7bbb60d.mp4",
  ],
} as const;

/** Journal teaser - copy left, image right. */
export const guidesFeature = {
  eyebrow: "The Journal",
  title: "Notes on rest, ritual and kraft",
  body: "How a waffle weave earns its texture, what Dabu hand-block printing actually involves, and how to care for natural fibres so they soften rather than wear out.",
  cta: "Read the journal",
  image:
    "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_1880.jpg?v=1788636348",
  href: "/blogs",
} as const;

/** Spotlight band copy. */
export const featureBand = {
  label: "Kompanion of the Month",
  eyebrow: "In the Spotlight",
} as const;

/**
 * Fallback journal entries. The homepage and `/blogs` read real articles from
 * the Shopify Storefront API; these only render when the store has no blog
 * configured yet, so the section never collapses to empty scaffolding.
 */
export const journalPosts = [
  {
    slug: "why-waffle-weave",
    title: "Why Waffle Weave Belongs in Your Slowest Hour",
    image:
      "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_1695.png?v=1788636343",
    excerpt:
      "The honeycomb structure holds air, which is what makes a waffle robe dry quickly and breathe against skin. A look at how the weave is built and why it suits an unhurried morning...",
  },
  {
    slug: "dabu-hand-block-printing",
    title: "Dabu: The Mud-Resist Print Behind Our Indigo",
    image:
      "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_1895_c94dd5b4-daca-47b9-94aa-d5aa31527cd5.jpg?v=1788636351",
    excerpt:
      "Before dye touches cloth, a mud-and-gum resist is hand-stamped onto it block by block. Nothing about the process is fast, and every repeat carries the hand that placed it...",
  },
  {
    slug: "in-between-moments",
    title: "The In-Between Moments Are the Ritual",
    image:
      "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_0129.jpg?v=1788636349",
    excerpt:
      "Not the grand reset, but the ten minutes on the floor before the day starts. A case for textiles that support the routines already in your day rather than asking for new ones...",
  },
] as const;

/* --------------------------------------------------------------------- faq */

type FaqLink = { label: string; href: string };
type FaqEntry = {
  /** Stable: the row's DOM id and React key. Never shown. */
  id: string;
  question: string;
  answer: string;
  link?: FaqLink;
};

/**
 * The FAQ board - homepage (after the journal) and every product page (under
 * the buy panel). Built by `lib/shop/faq.ts`, drawn by `components/faq/`.
 *
 * Three shared topics, then one set per category, for product pages, which
 * lead with their own category's set. The homepage shows its own five
 * (`home.items`), written by the owner.
 *
 * EVERY ANSWER HERE IS A CLAIM THE BRAND ALREADY MAKES - in `site`, `heritage`,
 * the story chapters, or the product descriptions in Shopify (the karrier's
 * weight bands, the kit's box, the slipper's jute base). The only delivery
 * figure is the owner's dispatch window on the homepage; the store publishes
 * no refund policy, so there are deliberately no questions about returns.
 *
 * The categories' Shopify collections live in `lib/shop/faq.ts`, not here:
 * a handle is an identifier, not copy.
 */
export const faq = {
  home: {
    eyebrow: "Questions, answered",
    title: "Ask the studio",
    lede: "From the cloth and the kraft to caring for what you take home. Here are the questions we hear most.",
    /* The homepage's own five, in the owner's words (2026-10-13). Kept apart
       from `topics` so the product pages' answers are not rewritten with
       them. The timeline is the owner's stated dispatch window. */
    items: [
      {
        id: "what-are-kompanions",
        question: "What are Kompanions?",
        answer:
          "Kozy Kompanions are textiles designed to accompany you through your everyday rituals, bringing komfort, kolour and Indian craft into each one.",
      },
      {
        id: "what-is-dabu",
        question: "What is Dabu hand-block printing?",
        answer:
          "Dabu is a traditional resist-printing technique from Rajasthan. Artisans use a mud resist and natural dyes to kraft hand-printed patterns.",
      },
      {
        id: "personalise",
        question: "Can I personalise my Kompanion?",
        answer:
          "Absolutely! Selected Kompanions can be kustomised with initials, embroidery or sizing. Konnect with our studio to explore more possibilities.",
        link: { label: site.instagram, href: site.instagramUrl },
      },
      {
        id: "bulk",
        question: "Do you take bulk or private-label orders?",
        answer:
          "Yes! We offer bespoke bulk production, private labelling and kustom textile development for brands, hospitality, gifting and interior projects.",
        link: { label: "Start a B2B enquiry", href: "/b2b-enquiries" },
      },
      {
        id: "kraft-timeline",
        question: "What is your Kraft timeline?",
        answer:
          "Ready-to-order Kompanions are dispatched within 5-7 business days, with delivery typically taking another 3-7 business days across India. Kustom and bulk orders may take longer.",
      },
    ],
  },
  /** The product page's head when the product fits no category. */
  product: {
    eyebrow: "Questions, answered",
    title: "Before it's yours",
    lede: "The things people ask the studio most, about the cloth, the kraft and the order.",
  },
  /** Labels for topic groups on product pages. */
  groups: { topics: "Ask about", categories: "By Kompanion" },
  /** The row count's noun, beside the list's head. */
  count: (n: number) => (n === 1 ? "1 question" : `${n} questions`),
  /** The link that closes a category's list, to that shelf. */
  shop: (label: string) => `Shop ${label}`,
  open: "Show answer",
  close: "Hide answer",

  topics: [
    {
      key: "kompanions",
      label: "Kompanions",
      items: [
        {
          id: "what-are-kompanions",
          question: "What are Kompanions?",
          answer:
            "It is what we call our textiles. They are not decor objects to be looked at - they are krafted to be used, leaned on and lived with, supporting the moments of rest already in your day.",
        },
        {
          id: "who-makes-them",
          question: "Who makes them?",
          answer:
            "Every Kompanion is designed in-house and made in collaboration with craft clusters across India, using artisanal processes including traditional Dabu hand-block printing.",
          link: { label: "Read about our kraft", href: "/the-kozy-story" },
        },
        {
          id: "what-is-dabu",
          question: "What is Dabu hand-block printing?",
          answer:
            "Dabu is a mud resist. The block is lifted from a tray of mud paste and laid down line by line; wherever the paste sits, the dye - natural indigo, or syahi, an iron black - cannot reach, and the pattern shows once the cloth is washed.",
        },
        {
          id: "print-variation",
          question: "Why does my print differ a little from the photograph?",
          answer:
            "Because a hand pressed it. Each repeat is laid down block by block, and the cloth keeps the small shifts only a hand-pressed block leaves. No two runs are identical, and that is the kraft, not a flaw.",
        },
      ],
    },
    {
      key: "fabric",
      label: "Fabric & care",
      items: [
        {
          id: "made-from",
          question: "What are your textiles made from?",
          answer:
            "100% natural fibres. Our material palette is cotton waffle weave, slub cotton, cotton percale, linen blends, wool and other premium natural Indian textiles. We use konsciously sourced natural dyes and surplus fabric from the industry.",
        },
        {
          id: "care",
          question: "How do I care for natural fibres?",
          answer:
            "Wash cool and gently, dry in shade, and skip the fabric softener - it coats the fibre and flattens a waffle weave's texture. Naturally dyed and hand-printed pieces will soften and settle with use; that shift is the material behaving as it should.",
        },
        {
          id: "surplus",
          question: "What does surplus fabric mean?",
          answer:
            "Alongside new cloth, we work with surplus fabric from the textile industry - material already made that would otherwise go unused - so a Kompanion asks less of the world to exist.",
        },
      ],
    },
    {
      key: "ordering",
      label: "Ordering",
      items: [
        /* `personalise` and `gift` (below) are inserted here at runtime, from
           the live add-ons, so their prices are Shopify's and never ours. */
        {
          id: "sizing-help",
          question: "I'm between sizes. Can someone help me choose?",
          answer:
            "Yes. Message the studio on Instagram with what you are choosing between and we will help you pick - the same goes for any kustomisation you have in mind.",
          link: { label: site.instagram, href: site.instagramUrl },
        },
        {
          id: "bulk",
          question: "Do you take bulk or private label orders?",
          answer:
            "Yes. Alongside retail we run bespoke bulk production partnerships, tailoring kustom textile concepts for luxury boutiques, interior studios and premium hospitality brands. Write to us with your brief to start a conversation.",
          link: { label: "Start a B2B enquiry", href: "/b2b-enquiries" },
        },
      ],
    },
  ],

  /* Which category a product belongs to is decided by precedence in
     `lib/shop/faq.ts`, not by this copy's order. */
  categories: {
    bathrobes: {
      label: "Bathrobes",
      eyebrow: "Robe questions",
      title: "Before the robe goes on",
      lede: "Waffle, natural dye, two ways with the sleeve - what to know before your post-bath ritual.",
      items: [
        {
          id: "robe-waffle",
          question: "Why waffle weave for a robe?",
          answer:
            "The honeycomb structure holds air. That is what makes a waffle robe dry quickly, absorb well after a bath and breathe against skin - and it softens beautifully with every wash.",
        },
        {
          id: "robe-sleeves",
          question: "What are the two sleeve styles?",
          answer:
            "Most of our robes come two ways: an open wide sleeve that falls loose, or a sleeve finished with an attached scrunchie detail. Choose either on the product page.",
        },
        {
          id: "robe-sizes",
          question: "How are the robes sized?",
          answer:
            "In paired sizes - S-M, M-L and L-XL - so each one covers a range rather than a single number.",
        },
        {
          id: "robe-dye",
          question: "Will a naturally dyed robe change with washing?",
          answer:
            "It will soften, and that is the point. Naturally dyed cloth settles with use and develops a character of its own wash by wash, and natural indigo is known for its kolourfastness and breathability.",
        },
      ],
    },
    pillows: {
      label: "Pillows",
      eyebrow: "Pillow questions",
      title: "Before it settles in",
      lede: "Fillers, prints, and why a textile form beats a ceramic one.",
      items: [
        {
          id: "pillow-filler",
          question: "Does it come with a filler?",
          answer:
            "Several of our pillows are offered two ways: the cover alone, or the cover with a recycled cotton and natural fibre filler. Where there is a choice, it is the Cushion Type option on the product page.",
        },
        {
          id: "pillow-print",
          question: "How are the pillows made?",
          answer:
            "Most are hand-block printed in Dabu by the craft clusters we work with; others are built from appliqué and patchwork. Either way, each one is designed in-house.",
        },
        {
          id: "pillow-homes",
          question: "Are they right for a home with pets or children?",
          answer:
            "That is part of why we make them. Our textile forms are a soft, unbreakable alternative to ceramic décor - made for homes with dogs and children in them, and for living in without the worry of something fragile.",
        },
      ],
    },
    slippers: {
      label: "Slippers",
      eyebrow: "Slipper questions",
      title: "Before the first step",
      lede: "What is underfoot, where they belong, and how the sizes run.",
      items: [
        {
          id: "slipper-materials",
          question: "What are the slippers made of?",
          answer:
            "Soft cotton uppers - double cloth cotton or cotton waffle, depending on the pair - padded with recycled cotton and natural fibre filling. The Kloud slippers sit on a recycled EVA sole with a natural jute base; the Puffers on a quilted, puffed waffle base that cushions every step.",
        },
        {
          id: "slipper-indoors",
          question: "Are they for indoors or out?",
          answer:
            "They are made for the house: slow mornings, post-shower resets and evening wind-downs. Soft cotton is happiest indoors.",
        },
        {
          id: "slipper-sizes",
          question: "How are the slippers sized?",
          answer: "In paired UK sizes, from UK 3-4 up to UK 11-12.",
        },
      ],
    },
    "ritual-kits": {
      label: "Ritual Kits",
      eyebrow: "Ritual kit questions",
      title: "Before the ritual begins",
      lede: "What a kit holds, how it arrives, and how to make it yours.",
      items: [
        {
          id: "kit-contents",
          question: "What is inside a ritual kit?",
          answer:
            "A robe and the Kompanions that belong beside it. The Ritual Companion Set, for one, holds an oversized bathrobe, slippers, an eye mask, a scrunchie and a tote bag. Each kit's description lists exactly what is in it.",
        },
        {
          id: "kit-box",
          question: "How does a kit arrive?",
          answer:
            "In our in-house, handmade quilted box packaging - made from the same care and natural fabrics as the Kompanions inside, and designed to be kept, as storage at home or a travel insert.",
        },
        {
          id: "kit-initials",
          question: "Can a kit be personalised?",
          answer:
            "Yes. Initials can be added to the bathrobe and to the kit's accessories, so every piece in the ritual is yours.",
        },
      ],
    },
    pet: {
      label: "Pet Kollection",
      eyebrow: "Pet questions",
      title: "For the furrie ones",
      lede: "Sizing by weight, fabrics for fur and paws, and matching with your pet.",
      items: [
        {
          id: "pet-karrier-size",
          question: "How do I choose a karrier size?",
          answer:
            "By your pet's weight. The Polka Pet Karrier, for one, runs Mini (up to 1.4 kg), Small (2-4 kg), Medium (4-6.5 kg) and Large (7-10 kg). Each karrier lists its own bands on its page.",
        },
        {
          id: "pet-fabric",
          question: "What are the pet Kompanions made from?",
          answer:
            "Soft textiles chosen for fur and paws: gentle textured cotton for the floor pillows and breathable, skin-safe modal silk for the puffer leash covers, konsciously krafted with eco-conscious dyes.",
        },
        {
          id: "pet-match",
          question: "Can I match with my pet?",
          answer:
            "Yes - that is what the Pet & Parent shelf is for: twin sets and bandanas in the same signature Kozy prints, for matching pet-parent rituals.",
          link: { label: "Shop Pet & Parent", href: "/search/pet-parent" },
        },
        {
          id: "pet-custom",
          question: "Can you make something to fit my pet?",
          answer:
            "Message the studio on Instagram. Need help choosing a size, or want a kustomisation? Tell us about your furrie baby and we will take it from there.",
          link: { label: site.instagram, href: site.instagramUrl },
        },
      ],
    },
  },

  /** Answers built from the product, or from the live add-ons. */
  dynamic: {
    sizes: {
      question: "Which sizes does it come in?",
      answer: (title: string) =>
        `${title} comes in the sizes below. Between two? Message the studio on Instagram and we will help you choose.`,
    },
    sleeves: {
      question: "Which sleeve should I choose?",
      answer:
        "This robe comes two ways. The open wide sleeve falls loose; the scrunchie detail is attached to the sleeve. Pick either in the panel above.",
    },
    filler: {
      question: "Does it come with a filler?",
      answer:
        "Your choice - pick a cover alone, or the cover with its filler, in the panel above.",
    },
    personalise: {
      question: "Can I personalise it?",
      answer: (price: string, max: number) =>
        `Yes. Any Kompanion can carry your initials, for ${price} each: letters A to Z, up to ${max} of them, added from the product page before you add it to your cart.`,
    },
    gift: {
      question: "Can I send it as a gift?",
      answer: (price: string) =>
        `Add a gift box from the product page, for ${price} each. It travels with the Kompanion on the same order.`,
    },
  },

  /** The indigo panel beside the list. */
  help: {
    eyebrow: "Still wondering?",
    title: "Write to the studio",
    body: "The studio reads everything that comes in - fabric, fit, a gift, a bulk brief.",
    primary: { label: "Message on Instagram", href: site.instagramUrl },
    secondary: { label: "Contact form", href: "/contact" },
  },
} as const satisfies {
  topics: readonly { key: string; label: string; items: readonly FaqEntry[] }[];
  categories: Record<
    string,
    {
      label: string;
      eyebrow: string;
      title: string;
      lede: string;
      items: readonly FaqEntry[];
    }
  >;
} & Record<string, unknown>;

/**
 * The footer's own words. Its LINKS are not here: every column and every large
 * link is the `kozy-living-footer` menu in Shopify Admin, and the legal row is
 * the shop policies the merchant has written - so a link is added, renamed or
 * reordered in Admin, never in this file.
 *
 * It used to carry hand-written columns: collection handles the store never
 * had, Pinterest and YouTube links to those sites' home pages (the brand has
 * neither account), an unverified email shown as fact, and policy links that
 * 404'd. Only Instagram is a confirmed channel, so it is the only one named.
 */
/**
 * The newsletter band that stands above the footer (`NewsletterBand`), its
 * own card rather than a row inside the footer panel. Same signup as the footer
 * used to carry and the arrival card - one server action, one record.
 */
export const letterBand = {
  label: "Letters from the studio",
  heading: "A mindful kind of inbox",
  body: "Rituals worth keeping, notes from the studio, and a first look at every new Kompanion.",
  note: "Unsubscribe whenever you like.",
  /** The same still as `kozyStory`'s "Slow mornings" frame. */
  image: {
    url: "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_1866.jpg?v=1788636345",
    alt: "The Dabu Speckled Cushion beside a cup of coffee and an open book.",
  },
} as const;

export const footer = {
  /** The brand block beside the menu columns. */
  brand: {
    heading: site.tagline,
    body: site.statement,
    follow: "Follow the studio",
    handle: site.instagram,
    href: site.instagramUrl,
  },
  /** Heads the column of the menu's standalone links (Home, Contact Us). */
  more: site.name,
  /** Leads a column's own page in the phone accordion: "Explore Kessentials". */
  explore: "Explore",
  /** The hero's origin flag itself, not a new use of the K spelling. */
  stamp: hero.flag,
  copyright: "All rights reserved.",
  /** The closing mark. Its "o" is the block-printed textile letter. */
  wordmark: "kozy living",
} as const;

/** The phone navigation drawer's own chrome - the links are Shopify's. */
export const navDrawer = {
  /** Leads a section's own page inside it: "Explore Pet Kollection". */
  explore: "Explore",
  account: "My account",
  open: "Open menu",
  close: "Close menu",
} as const;


/* ------------------------------------------------------------------ gi tag */

/**
 * The GI mark on the product buy panel.
 *
 * Every line here is the artwork's own wording, transcribed - including
 * "Kraft", which is the badge's spelling and must not be normalised away.
 *
 * `note` is the only line that is not on the badge, and it deliberately
 * explains what a Geographical Indication IS rather than making any further
 * claim about this product. A GI is a legal certification; the badge asserts
 * one, and this file does not get to add to it. See the note in CLAUDE.md
 * about the mark currently rendering on every product unconditionally.
 */
export const giTag = {
  title: "Jodhpur Block Print",
  /* Sits on the same line as the title, in caption size. */
  subtitle: "A GI Registered Kraft",
  note: "A Geographical Indication is a legal mark that ties a craft to the place it is made and the method registered to it. Jodhpur block print carries one.",
  /** Alt text for the mark itself, for anyone who cannot see it. */
  alt: "Jodhpur Block Print - a GI registered Kraft",
} as const;

/* -------------------------------------------------------------- add-ons */

/**
 * The storefront's own words around the personalisation add-ons. The add-ons
 * themselves - their titles, prices, help text, return note - are merchant
 * data in Shopify (the `product_add_on` metaobjects); this is only the chrome
 * around them, and the messages the add-to-cart action can return.
 */
export const addOns = {
  /** Above the add-on cards on the product page. */
  heading: "Make it yours",
  /** Shown beside an add-on the merchant has marked unavailable. */
  unavailable: "Currently unavailable",
  /** Running total under the cards, once anything is picked. */
  totalLabel: "Total with extras",
  /** Placeholder in the initials field. */
  initialsPlaceholder: "e.g. KF",
  /**
   * The property name written onto the order line. This is what the workshop
   * reads in Shopify Admin and on the packing slip ("Initials: KF"), and what
   * the Flow tagging keys off - change it with care.
   */
  orderLabels: {
    initials: "Initials",
  },
  errors: {
    missingText: "Add your initials, or untick the initials option.",
    invalidInitials: "Initials can only be the letters A to Z.",
    tooLong: (max: number) => `Initials can be at most ${max} letters.`,
    unavailable:
      "One of the extras you picked is no longer available. Please review and try again.",
    failed: "We couldn't add that with its extras. Please try again.",
  },
} as const;

/* -------------------------------------------------------- custom kit builder */

/**
 * `/kit-builder`: a ritual kit built from the base Kompanions, in one fabric,
 * with optional initials. The pieces, fabrics, threads and prices are all
 * merchant data in Admin (docs/custom-kit-builder.md); this is only the
 * framing around them.
 */
export const kitBuilder = {
  eyebrow: "Build your kit",
  title: "A ritual kit, made your way",
  circled: "your way",
  intro:
    "Choose the Kompanions you reach for, the fabric they are cut in, and the thread for your initials. One kit, put together for your own quiet hour.",
  /** A line under the intro: the promise the builder keeps at every step. */
  promise: "Every choice is priced as you make it.",
  steps: {
    pieces: {
      title: "Choose your Kompanions",
      short: "Kompanions",
      hint: (min: number) =>
        min > 1 ? `Pick at least ${min}.` : "Pick one or more.",
      sizes: "Then a size for each",
      noneInFabric: (fabric: string) =>
        `No Kompanions are available in ${fabric} right now.`,
      tryFabric: (fabric: string) => `Try ${fabric}`,
    },
    fabric: {
      title: "Choose your fabric",
      short: "Fabric",
      hint: "Every Kompanion in the kit is cut in the fabric you choose.",
      kitPrice: "Your kit in this fabric",
    },
    colour: {
      title: "Choose your kolour",
      short: "Kolour",
      hint: (fabric: string) => `The ${fabric} cloth for every Kompanion in your kit.`,
    },
    embroidery: {
      title: "Add your initials",
      short: "Initials",
      hint: "Pick a thread for your initials, or keep the kit plain.",
      none: "No embroidery",
      threadLabel: "Thread",
      label: "Your initials",
      lettersHint: (max: number) => `Up to ${max} letters, A to Z.`,
      placeholder: "e.g. PD",
      plainSummary: "No embroidery",
      noneTakeInitials: "None of the Kompanions in this kit take initials.",
    },
    review: { title: "Review your kit" },
  },
  /** The guide: what tells the shopper where they are and what comes next. */
  guide: {
    stepOf: (n: number, total: number) => `Step ${n} of ${total}`,
    progress: (done: number, total: number) => `${done} of ${total} chosen`,
    next: (step: string) => `Next: ${step}`,
    continue: "Continue",
    change: "Change",
    review: "Review kit",
    ready: "Your kit is ready",
    chosenCount: (count: number) =>
      count === 1 ? "1 Kompanion chosen" : `${count} Kompanions chosen`,
    beforeYouGo: (step: string) => `Before you go: ${step}`,
    emptyTitle: "Your kit begins here",
    emptyBody: "Choose your Kompanions and watch the kit come together.",
    each: "each",
    viewCart: "View cart",
    jumpTo: (step: string) => `Go to ${step}`,
  },
  fullKit: "The full ritual kit",
  fullKitHint: (count: number) => `All ${count} Kompanions`,
  chosen: "In your kit",
  choose: "Add to kit",
  from: "from",
  unavailable: "Currently unavailable",
  notInFabric: "Not in this fabric",
  chooseSize: "Choose a size",
  previewLabel: "Preview",
  previewNote: "Letterforms are hand-embroidered and will vary.",
  embroideredOn: "Stitched on",
  included: "Included",
  quantity: "Quantity",
  total: "Total",
  add: "Add kit to cart",
  adding: "Adding your kit…",
  added: "Your kit is in the cart.",
  another: "Build another kit",
  edit: "Edit",
  resting: {
    title: "The kit builder is resting",
    body: "We are preparing the next set of Kompanions. In the meantime, the kollection is open.",
    cta: "Explore the kollection",
  },
  /** The drawer's label for a kit line. */
  cartLabel: "Your kit",
  /**
   * Property names written onto the order. The workshop reads these in Admin
   * and on the packing slip - change them with care. Initials share the
   * add-ons' label so Flow and the packing slip treat both alike.
   */
  orderLabels: {
    fabric: "Fabric",
    colour: "Colour",
    thread: "Thread",
    initials: "Initials",
    embroiderOn: "Embroider on",
  },
  errors: {
    resting: "The kit builder is not available right now. Please try again shortly.",
    tooFew: (min: number) =>
      min > 1
        ? `Choose at least ${min} Kompanions for your kit.`
        : "Choose a Kompanion to start your kit.",
    size: (piece: string) => `Choose a size for the ${piece}.`,
    soldOut: (piece: string) =>
      `The ${piece} has just sold out in that size and fabric. Please choose another.`,
    fabric: "Please choose a fabric.",
    colour: "Choose a kolour for your kit.",
    thread: "Choose a thread kolour, or No embroidery.",
    initials: "Add your initials, or choose No embroidery.",
    invalidInitials: "Initials can only be the letters A to Z.",
    tooLong: (max: number) => `Initials can be at most ${max} letters.`,
    noEmbroiderable: "None of the Kompanions in this kit take initials.",
    busy: "Too many kits started just now. Please wait a moment and try again.",
    failed: "We couldn't add your kit. Please try again.",
  },
} as const;

/* -------------------------------------------------------------- kit atelier */

/**
 * The homepage's own kit builder ("the atelier"): the whole kit, built and
 * sent to the cart without leaving the homepage. It shares the rules, step
 * names, errors and order labels of `kitBuilder` above; only its framing and
 * its questions are its own, because it asks one question at a time.
 */
export const kitAtelier = {
  eyebrow: "The Kustom kit",
  title: "Build your own Kozy ritual.",
  circled: "Kozy ritual",
  intro:
    "Pick your favourite Kompanions, choose your Komfort print/fabric, add your initials thread & build your own Kustom Ritual Kit.",
  table: "The table",
  tableHint: "Tap a Kompanion to lay it on the table.",
  addPiece: (title: string) => `Lay the ${title} on the table`,
  removePiece: (title: string) => `Take the ${title} off the table`,
  notInFabric: "Not in this fabric",
  tag: "Your kit",
  questions: {
    pieces: {
      title: "Pick your Kompanions",
      hint: (min: number) =>
        min > 1
          ? `Choose your favourite Kompanions for your ritual kit - at least ${min}.`
          : "Choose your favourite Kompanions for your ritual kit.",
    },
    fabric: {
      title: "Choose your Komfort print",
      hint: "Choose between solid or block Dabu prints for your Kompanions.",
    },
    colour: {
      title: "Which kolour for the cloth?",
      hint: (fabric: string) => `${fabric}, in the kolour you choose.`,
    },
    embroidery: {
      title: "Add your initials",
      hint: "Choose the thread kolour and name for the initials.",
    },
    review: {
      title: "Make it yours",
      hint: "Bring all your picks together to create your Kozy Kustom Ritual Kit.",
      empty: "The table is empty. Start with your Kompanions.",
      start: "Choose Kompanions",
    },
  },
  /** The track's name for the last chapter. */
  reviewShort: "Your kit",
  back: "Back",
  sizeLabel: (title: string) => `${title} size`,
  initialsLabel: "Your initials",
  typeHere: "Type your letters",
  fullBuilder: "Open in the full builder",
  startOver: "Start over",
  /** Read out when the chapter changes; the panel itself is not announced. */
  announce: (n: number, total: number, question: string) =>
    `Step ${n} of ${total}. ${question}`,
} as const;

/* ------------------------------------------------------------------ buy now */

/**
 * The second button on the buy panel: straight to checkout with this one
 * Kompanion (and the extras picked for it), leaving the cart as it was.
 */
export const buyNow = {
  label: "Buy now",
  pending: "Preparing checkout…",
  redirecting: "Taking you to checkout…",
  errors: {
    unavailable: "This option has just sold out. Please choose another.",
    failed: "We couldn't start your checkout. Please try again.",
    busy: "Too many checkouts started just now. Please wait a moment and try again.",
  },
} as const;

/**
 * The buying controls on a product card (home rails, the shop grid, the
 * spotlight). Buy now adds and opens the cart; the bag adds quietly; once in
 * the cart both become a stepper and a way to check out.
 */
export const cardBuy = {
  buyNow: "Buy now",
  buying: "Adding…",
  checkout: "Checkout",
  soldOut: "Sold out",
  inCart: "In cart:",
  change: "Change",
  addTitle: "Add to cart",
  add: (title: string) => `Add ${title} to cart`,
  buy: (title: string) => `Buy ${title} now`,
  increase: (title: string) => `Add one more ${title}`,
  decrease: (title: string) => `One fewer ${title}`,
  remove: (title: string) => `Remove ${title} from cart`,
  stepperLabel: (title: string) => `${title} in your cart`,
  errors: {
    add: "We couldn't add that to your cart.",
    update: "We couldn't update that quantity.",
  },
} as const;

/** The option switcher on a line in the cart drawer. */
export const cartVariant = {
  label: (title: string) => `Change option for ${title}`,
  soldOut: "sold out",
  error: "We couldn't change that option.",
} as const;

/* ------------------------------------------------------------------ contact */

/**
 * TODO(brand): the email, phone and studio addresses below are placeholders
 * carried over from the site scaffold and have NOT been verified. Instagram is
 * the only channel confirmed. Replace before launch - these also feed the
 * footer and the organisation JSON-LD in `layout.tsx`.
 */
export const contact = {
  eyebrow: "Get in touch",
  title: "Say hello to the studio",
  body: [
    "Questions about a Kompanion, fabric and care, kustom sizing, or a bulk and private label brief? The studio reads everything that comes in.",
    "Send the form below, write to us directly, or reach us on Instagram - whichever is easiest for you.",
  ],
  email: "care@kozyliving.com",
  instagram: site.instagram,
  instagramUrl: site.instagramUrl,
  phone: "(+91) 8494 907 007",
  phoneHref: "+918494907007",
  locations: [
    {
      label: "Design Studio",
      lines: ["Kozy Living Studio", "India"],
    },
    {
      label: "B2B & Private Label",
      lines: [
        "Bespoke bulk production for boutiques,",
        "interior studios and hospitality.",
        "Share your brief to begin.",
      ],
    },
  ],
} as const;

/* ------------------------------------------------------------ b2b enquiries */

/**
 * `/b2b-enquiries` - the trade enquiry form. A designed route standing over
 * the Shopify page of the same handle (linked from the live menu under The
 * Kozy Story), whose body is empty.
 *
 * Every claim here is one the brand already makes in `heritage` and `faq`:
 * bespoke bulk production for boutiques, interior studios and hospitality, in
 * natural fibres, designed in-house. No lead times, minimum order quantities
 * or client names - none have been given to us, and a trade buyer takes a
 * stated MOQ as a commitment. Add them here once the brand confirms them.
 *
 * `businessTypes` and `quantities` are stored in Shopify as their label text,
 * so renaming one changes what NEW enquiries say; old records keep theirs.
 */
export const b2bEnquiry = {
  eyebrow: "B2B & Private Label",
  /** The brand's own supplied words - see the note on `foundersNote`. */
  title: "Krafted for your everyday rituals",
  /**
   * Ringed by the hand-drawn ellipse. Must appear in `title` verbatim.
   *
   * The last word alone, not "everyday rituals": `CircledWord`'s svg overhangs
   * its span by 6% a side, and the longer phrase wraps to the START of line
   * two at every width up to 1024 - which put the left arc 4-13px outside the
   * viewport, where `overflow-x: clip` on `html` shaved it off rather than
   * scrolling. Ring a phrase that can begin a line and this is what happens.
   */
  circled: "rituals",
  /** Search and share snippet only - not rendered on the page. */
  description:
    "Bulk and private label textiles from Kozy Living for hotels and resorts, spas, boutiques, interior studios and retailers. Request a quote.",
  body: [
    "Tell us about your rituals, your requirements, the Kompanions you have in mind and the quantity you are planning for",
  ],
  materials: {
    label: "What we Kraft in",
    items: [
      "Cotton waffle weave",
      "Slub cotton",
      "Cotton percale",
      "Linen blends",
      "Wool",
      "Dabu hand-block printing",
    ],
  },
  /**
   * The brand's own supplied words, all three steps.
   *
   * Step 01 is the same sentence as `body` above it, because that is how it
   * was given to us on both surfaces. The two sit about a screen apart and
   * read as a repeat - drop one before this goes in front of a trade buyer.
   */
  steps: {
    label: "How we Kraft together",
    items: [
      {
        title: "Share your brief",
        body: "Tell us about your rituals, your requirements, the Kompanions you have in mind and the quantity you are planning for",
      },
      {
        title: "We Kraft the direction",
        body: "We look at materials, kraft, finishes, kustomisation & timelines to shape the right direction for your Kompanions",
      },
      {
        title: "Bring it to life",
        body: "We come back with pricing, samples, kolourways & next steps — including private label, where it fits",
      },
    ],
  },
  form: {
    required: "Required",
    /** The form's three fieldsets, numbered in the markup. */
    sections: ["About you", "Your business", "Your order"],
    name: "Full name",
    company: "Company / business name",
    email: "Business email",
    phone: "Phone / WhatsApp number",
    businessType: "Business type",
    /** Every label is a segment the brand already names as a partner. */
    businessTypes: [
      "Hotel / Resort",
      "Spa / Wellness",
      "Retailer",
      "Interior / Design Studio",
      "Distributor / Wholesaler",
      "Other",
    ],
    products: "Products interested in",
    productsHint: "e.g. waffle bathrobes, slippers, Dabu-printed pillows, ritual kits",
    quantity: "Estimated quantity",
    quantityUnit: "units",
    quantities: ["Below 100", "100–500", "500–1,000", "1,000+", "Kustomised"],
    /** Picking `option` opens a required number field under the pills.
        `option` must match one of `quantities` verbatim. */
    custom: {
      option: "Kustomised",
      label: "Your quantity",
      placeholder: "e.g. 2500",
    },
    message: "Message / requirements",
    optional: "Optional",
    messageHint: "Kolours, sizes, branding or private label, timelines - anything that helps us quote.",
    submit: "Request a quote",
    sending: "Sending…",
    another: "Send another enquiry",
    browse: { label: "Browse Kompanions", href: "/search" },
    thanksEyebrow: "Enquiry received",
    thanks: "Thank you - your brief is with the studio.",
    thanksBody: "We usually reply within one business day, at the email you gave us.",
  },
} as const;

/* ------------------------------------------------------------- newsletter */

/** Copy for the ritual signup card. The two body lines follow the artwork. */
export const newsletter = {
  title: "Shall we share a ritual",
  /** Two lines, broken by hand - the rag is part of the drawing. */
  body: [
    "Sign up and we shall send you",
    "a little Kozy ritual, every now & then.",
  ],
  placeholder: "your email",
  cta: "Begin your ritual",
  sending: "Joining…",
  /** The card after Shopify has the address. */
  thanks: "Welcome to the ritual.",
  thanksBody:
    "A little Kozy ritual will find its way to your inbox, every now & then.",
  /**
   * The corner tab the card collapses into when it is closed unanswered.
   * `label` is a fragment, not a sentence - it sits beside an envelope mark and
   * is hidden entirely on a phone, where the tab is the mark alone. The two
   * accessible names carry the whole meaning, which is why they are written
   * out rather than derived from the label.
   */
  teaser: {
    label: "Share a ritual",
    open: "Open the newsletter signup",
    close: "Hide the newsletter tab for now",
  },
} as const;

/* ---------------------------------------------------------------- about page */

/**
 * Photography for `/about-us`. `src: null` renders the designed placeholder
 * plate rather than a broken image - drop real paths in as shoots land.
 */
export const aboutImages = {
  studio: {
    src: null,
    alt: "Waffle weave and slub cotton Kompanions laid out on the studio table.",
    aspect: "1/1",
  },
  kraft: {
    src: null,
    alt: "A Dabu hand-block being pressed into mud resist before the indigo dye bath.",
    aspect: "1/1",
  },
  lounge: {
    src: null,
    alt: "A floor lounge setup with biscuit floor pillows and a linen blend throw.",
    aspect: "2/3",
  },
} as const;

/**
 * The About masthead and the four collections beneath it. The numerals are the
 * ordering of the verticals - this section used to carry a fabricated
 * year-by-year company timeline.
 */
export const heritage = {
  eyebrow: "What we make",
  title: "Where Kraft Meets Everyday Living.",
  body: "Kozy Living reimagines Indian craft through contemporary textiles, playful prints and thoughtful essentials. Designed in-house and made with artisan communities across India, our pieces bring kolour, komfort and creativity to your everyday rituals.",
  collections: [
    {
      index: "01",
      title: "The Kozy Lounge",
      body: "Dabu-printed cushions, playful floor pillows and tactile home accents that bring traditional Indian craft into contemporary living. Designed to add kolour, character and komfort to your favourite korners.",
    },
    {
      index: "02",
      title: "Kessentials & Morning Luxuries",
      body: "Waffle-weave robes, komforting slippers and thoughtfully kurated ritual kits, designed around the little moments that make your day feel special. Everyday komforts, elevated through texture, detail and mindful design.",
    },
    {
      index: "03",
      title: "Pet & Parent",
      body: "Dabu-printed carriers, matching bandanas and thoughtfully krafted essentials for you and your Kozy Kompanion. Made for shared rituals, matching moments and little adventures together.",
    },
    {
      index: "04",
      title: "B2B & Private Label",
      body: "From bespoke textile concepts to kustom product development and bulk production, we collaborate with boutiques, interior studios and hospitality brands to bring distinctive, craft-led ideas to life.",
    },
  ],
} as const;

/**
 * Why craft-led textiles. The stat values are words, not invented percentages
 * - every figure here is a claim the brand actually makes.
 */
export const whyKraft = {
  eyebrow: "Why kraft-led",
  title: "Rooted in craft. Mindful by design.",
  body: [
    "We believe in creating with care. From Dabu hand-block printing in Rajasthan to natural cottons and thoughtfully chosen materials, our approach celebrates traditional skills, konscious material choices and the people behind every piece.",
    "Designed in-house and made in collaboration with artisan communities across India, our kollections bring together contemporary design, enduring craft and everyday rituals.",
  ],
  stats: [
    {
      value: "100%",
      label: "Natural Fibres",
      note: "Cotton, linen blends and wool - no synthetics",
    },
    {
      value: "Dabu",
      label: "Hand-Block Printed",
      note: "Traditional mud-resist printing, block by block",
    },
    {
      value: "In-House",
      label: "Designed in the Studio",
      note: "Made with craft clusters across India",
    },
    {
      value: "Surplus",
      label: "Konsciously Sourced",
      note: "Natural dyes and surplus industry fabric",
    },
  ],
  comparison: [
    {
      trait: "Fibre",
      conventional: "Synthetic blends and microfibre",
      kozy: "100% natural fibres",
    },
    {
      trait: "Print",
      conventional: "Bulk machine screen printing",
      kozy: "Dabu hand-block printing with craft clusters",
    },
    {
      trait: "Sourcing",
      conventional: "Virgin fabric ordered in volume",
      kozy: "Konsciously sourced natural and surplus fabric",
    },
    {
      trait: "Purpose",
      conventional: "Decor that is looked at",
      kozy: "Kompanions that are used, every day",
    },
    {
      trait: "Function",
      conventional: "One styled position, one job",
      kozy: "Multipurpose by design",
    },
  ],
} as const;

/** Five numbered steps from the studio to your everyday. */
export const studioToEveryday = {
  eyebrow: "Studio to everyday",
  title: "Five steps. No shortcuts.",
  steps: [
    {
      title: "Designed In-House",
      body: "Every print, form and Kompanion starts in our own studio, drawn around a routine somebody already has.",
    },
    {
      title: "Natural Fibres Only",
      body: "Cotton waffle weave, slub cotton, cotton percale, linen blends and wool - konsciously sourced, including surplus fabric from the industry.",
    },
    {
      title: "Made With Craft Clusters",
      body: "Production happens in collaboration with craft clusters across India, using artisanal processes rather than volume machinery.",
    },
    {
      title: "Hand-Block Printed",
      body: "Dabu mud-resist printing is stamped block by block before dyeing, so no two repeats are identical.",
    },
    {
      title: "Built Multipurpose",
      body: "Each Kompanion is designed to do more than one job, so it fits into everyday living instead of waiting for an occasion.",
    },
  ],
} as const;

export const sustainability = {
  eyebrow: "Konscious by default",
  title: ["Kraft that respects the hand", "and the material."],
  body: "Being konscious is not a line on our packaging - it decides which fibre we buy, who makes the cloth, and how long the Kompanion is expected to last.",
  pillars: [
    {
      title: "Natural Fibres Only",
      body: "100% natural Indian textiles - cotton waffle weave, slub cotton, percale, linen blends and wool.",
    },
    {
      title: "Surplus & Natural Dyes",
      body: "Konsciously sourced natural dyes and surplus fabric from the industry, kept in use rather than discarded.",
    },
    {
      title: "Craft Cluster Collaboration",
      body: "Made with craft clusters across India, sustaining artisanal processes like Dabu hand-block printing.",
    },
    {
      title: "Multipurpose Longevity",
      body: "Designed to be multipurpose and lived with daily, so one Kompanion replaces several single-use pieces.",
    },
  ],
} as const;

/**
 * Who makes it. Only the founder is a named individual - the previous version
 * of this section invented a four-person leadership team.
 */
export const collective = {
  eyebrow: "The collective",
  title: "Designed in-house. Made by hand.",
  strapline:
    "Rooted in Indian kraft, expressed through a modern design language",
  members: [
    {
      name: site.founder,
      role: "Founder & Design Lead",
      credential: site.founderCredential,
      body: "A textile design graduate of NIFT Delhi, Khushi founded Kozy Living on the belief that intention doesn't come from adding more, but from engaging deeply with the routines that already exist.",
    },
    {
      name: "Craft Clusters",
      role: "Makers across India",
      credential: "Artisanal processes, including Dabu",
      body: "Our Kompanions are made in collaboration with craft clusters across the country, whose hand-block printing and finishing carry techniques no machine reproduces.",
    },
    {
      name: "The Studio",
      role: "Design & Development",
      credential: "In-house print and product design",
      body: "Prints, organic forms and kolour are developed in-house, then worked out on the cloth itself - so what ships is what the material actually wants to do.",
    },
  ],
} as const;

/**
 * The signed note that closes the story.
 *
 * TODO(brand): written in studio voice and signed by the studio on purpose.
 * If Khushi wants this in first person, replace the body with her own words
 * before changing the signature to her name.
 */
export const studioNote = {
  eyebrow: "A note from the studio",
  title: "Intention doesn't come from adding more.",
  body: [
    "It comes from engaging deeply with the routines that already exist. The ten minutes on the floor before the day starts. The robe after a shower. The korner you keep coming back to.",
    "We krafted Kozy Living Textiles to sit inside those moments rather than ask for new ones - your in-between Kompanions, made from natural fibres by hands we know.",
  ],
  signature: `The ${site.name} Studio`,
  signatureRole: `Founded by ${site.founder} · ${site.founderCredential}`,
} as const;

/** Closing band on `/about-us` - the handoff to the shop. */
export const aboutCta = {
  eyebrow: "Natural fibres · Hand-block printed",
  title: ["Meet your", "in-between Kompanions."],
  body: "Krafted in small batches from 100% natural fibres, in collaboration with craft clusters across India.",
  cta: "Shop all Kompanions",
  href: "/search",
} as const;

/* ------------------------------------------------------- the kozy story page */

/**
 * `/the-kozy-story` - the brand's own account of itself, in the founder’s
 * words rather than the studio's.
 *
 * The handle is a Shopify page (`pages/the-kozy-story`, linked from the live
 * menu), so this copy DELIBERATELY shadows whatever body that page carries:
 * the route is a designed one, the same way `/shop-by-colour` is. See §4 of
 * CLAUDE.md.
 *
 * House spelling applied to the source copy: companions -> Kompanions, and
 * the standalone verb crafted -> krafted. The ordinary noun is left alone -
 * "Indian craft", "craft clusters" and "colour, craft & consciousness" are
 * correct as written.
 */
export const kozyStory = {
  eyebrow: "The Kozy Story",
  title: "Designed to give you moments of rest.",
  lede: "Kozy Living Textiles are your in-between Kompanions, krafted to turn everyday moments into mindful daily rituals.",
  hero: {
    /**
     * The masthead wall, in cell order (a, b, c on the top row; d, e below).
     * Chosen, not borrowed: this band used to take the collection's first
     * frames, which on this store are five studio shots of slippers and
     * robes - a shop grid, on the page that is meant to say who makes the
     * cloth and why. Each frame here carries one part of that story, and its
     * `tag` names the part.
     *
     * All are the store's own product photography (Shopify file URLs, sized
     * by `ShopImage`). Credits stay with what the store says: the Tulsi
     * robe's copy names the Yaseen Bhai Block Print Craft Cluster, so its
     * tag is the neutral "Printed by hand" rather than a claim about who is
     * in the frame. The process photographs are NOT repeated here - they
     * belong to the chapters band further down.
     */
    frames: [
      {
        url: "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_1235.jpg?v=1788636320",
        alt: "Eyes closed in low sun, wearing the Morning Sky Ritual Robe - waffle cotton with Dabu hand-block trim.",
        tag: "The ritual",
      },
      {
        url: "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_5245.jpg?v=1788636159",
        alt: "Close-up of Dabu hand-block prints in indigo and ochre.",
        tag: "Dabu hand-block",
      },
      {
        url: "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_0857.jpg?v=1788636322",
        alt: "The Tulsi Ritual Robe, Dabu hand-block printed in green and indigo.",
        tag: "Printed by hand",
      },
      {
        url: "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_1866.jpg?v=1788636345",
        alt: "The Dabu Speckled Cushion beside a cup of coffee and an open book.",
        tag: "Slow mornings",
      },
      {
        url: "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/9A8CCDE6-D286-47A8-9B01-7FC01ECB6AF0.jpg?v=1788636331",
        alt: "A dog asleep in an indigo Dabu print lounger.",
        tag: "Rest, for everyone",
      },
    ],
    /** The wall's closing cell - the one onward link in the band. */
    more: {
      eyebrow: "The Kompanions",
      note: "Every Kompanion, krafted from natural fibres.",
      label: "Shop all Kompanions",
      href: "/search",
    },
  },
  /** The band that closes the masthead - the site's signature bleeding line. */
  wordmark: "moments of rest",
  seal: "the kozy story · krafted for rest · ",
  /** Studio stills, used when the live collection photography is unavailable. */
  alt: "Waffle weave and Dabu hand-block printed Kompanions in the studio.",
  collection: "kessentials",
  /**
   * The chapters: how a Kompanion is made, told through the brand's own
   * process photography, in the order the work happens - the cloth is
   * printed as yardage, then patterned and cut, then finished.
   *
   * EVERY LINE HERE IS EITHER WHAT ITS PHOTOGRAPH SHOWS OR WHAT THE STORE
   * ALREADY SAYS. The maker credits are the merchant's own product copy in
   * Shopify: "Printed by Artisans of Yaseen Bhai Block Print Craft Cluster"
   * (Tulsi Ritual Robe), Dabu "of Jodhpur" (Sunshine Floor Pillow, the Flow
   * Kloud slippers), natural indigo and "Syahi (Iron Black)" (Dabu Speckled
   * Cushion, Polka Kloud Komfort). Nothing else is named: headcounts, years
   * and the individuals in these frames have not been given to us.
   *
   * TODO(brand): the copy credits the cluster for the work, NOT for these
   * particular photographs. Confirm with the studio before tying a named
   * printer or cluster to a specific frame.
   *
   * `media` is a raw Shopify file URL (resized by `ShopImage`'s loader - the
   * pattern photo is a HEIC, which only Safari can show as-is, and Shopify
   * converts it to WebP/JPEG as soon as a width is asked for) or a clip.
   * The clip's poster is a frame of it saved locally, so the card is never
   * an empty tint before the video decodes.
   */
  chaptersEyebrow: "How it is made",
  chaptersTitle: "Made by hand, with craft clusters across India.",
  chapters: [
    {
      index: "01",
      kicker: "Hand-block printing",
      title: "One block, pressed by hand.",
      body: "Every repeat is printed by hand, by block-print artisans in Jodhpur - among them the Yaseen Bhai Block Print Craft Cluster. The printer sets a carved wooden block against the last impression and presses it in, square by square, down a long padded table.",
      media: {
        type: "image",
        url: "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_1664_cc6a4799-b520-4db1-b9d2-bab197e0d74c.jpg?v=1790369997",
        alt: "A printer pressing a carved wooden block into white cloth, building a checked repeat by hand.",
      },
    },
    {
      index: "02",
      kicker: "Dabu mud-resist",
      title: "Printed in mud, before the dye.",
      body: "Dabu is a mud resist. The block is lifted from a tray of mud paste and laid down line by line; wherever the paste sits, the dye - natural indigo, or syahi, an iron black - cannot reach, and the pattern shows once the cloth is washed.",
      media: {
        type: "image",
        url: "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/PHOTO-2026-04-25-15-43-08_34c1e353-99d4-49b1-a326-7c28afb0d0cd.jpg?v=1790369996",
        alt: "A printer lifting a wooden block from a tray of mud paste to print striped chevrons in Dabu resist.",
      },
    },
    {
      index: "03",
      kicker: "Pattern & cutting",
      title: "Drafted on paper, then cut.",
      body: "Before any cloth is cut, each piece is drafted as a paper pattern - squared with a ruler, measured with the tape and checked against its spec sheet - so every Kompanion is cut to the same line.",
      media: {
        type: "image",
        url: "https://cdn.shopify.com/s/files/1/0700/6476/7047/files/IMG_1641.heic?v=1790369998",
        alt: "A pattern master drafting a paper pattern with an L-square, a tape measure around his neck.",
      },
    },
    {
      index: "04",
      kicker: "The finished cloth",
      title: "Krafted for your daily rituals.",
      body: "Printed, washed and finished, the cloth keeps the small shifts only a hand-pressed block leaves - then it is stitched into a Kompanion, labelled, and sent on to your everyday.",
      media: {
        type: "video",
        url: "https://cdn.shopify.com/videos/c/o/v/806a125208a44b90ad1c2e7ae99d6494.mp4",
        poster: "/media/finished-cloth-poster.jpg",
        alt: "Close-up of finished hand-printed cloth, green rings around a blue flower, with a Kozy Living label tape.",
      },
    },
  ],
  /**
   * The fibres, named and nothing more. Every weave here is one the brand
   * lists; no hand or weight counts, because none have been given to us.
   */
  fibresEyebrow: "The material palette",
  fibresTitle: "Five natural Indian textiles.",
  /** Follows the count ("5 weaves, all natural."). */
  fibresNote: "weaves, all natural.",
  /** Desktop only - it describes the hover card, which phones do not get. */
  fibresHint: "Hover or pick a row to see the cloth.",
  /**
   * The notes describe the WEAVE, not the product: "plain weave" and "slub"
   * are what those cloths are, which is checkable, where a hand-feel or a GSM
   * would be a claim nobody has given us. Keep them definitional.
   */
  fibres: [
    /*
     * `product` is the Kompanion the card shows for this weave - a handle
     * picked because the product's own Shopify copy names the fabric, so
     * the photograph is of the cloth the row describes. Waffle: the Kozy
     * Kloud Robe ("Fabric: 100% Natural Cotton Waffle"). Slub: the Kozy
     * Biscuit Floor Pillow ("breathable cotton slub").
     *
     * Percale, linen blends and wool have NO product in the catalogue yet,
     * so they carry none and the card shows the weave's name on an oat panel
     * rather than a borrowed photograph of some other cloth - that mismatch
     * is exactly what this list used to show. Add the handle here when one
     * ships. A handle that stops resolving falls back to the same panel.
     *
     * `video` is a clip of the cloth itself (owner's pick, 2026-10-28), shown
     * on the card in place of the panel. 720x830, 10s - near the card's 1:1,
     * so it is cover-cropped. A Kompanion's photograph still wins over it.
     */
    { index: "01", name: "Cotton waffle weave", note: "Textured and highly absorbent", product: "hoodie-robe" },
    { index: "02", name: "Slub cotton", note: "Irregular slub, woven in", product: "biscuits-floor-pillow-with-gusset" },
    {
      index: "03",
      name: "Cotton percale",
      note: "Plain weave, crisp and closed",
      video: "https://cdn.shopify.com/videos/c/o/v/215cdb8de5e94b01b457f71f11d381f4.mp4",
    },
    { index: "04", name: "Linen blends", note: "Linen worked with natural fibres" },
    { index: "05", name: "Wool", note: "Naturally insulating" },
  ],
  /** Card caption and the line under the list, when the weave has a Kompanion. */
  fibreSeenIn: "Seen in the",
  /** The same, for a weave with no Kompanion in the catalogue yet. */
  fibreInPalette: "Part of the material palette",
  /** The control under the list that steps to the next weave. */
  fibreNext: "Next weave",
  /**
   * The collage band. One solid line and three ghosted ones, with small
   * photographs scattered between them - the page's loudest gesture, and the
   * reason the story does not open on a column of body copy.
   */
  collage: {
    lead: "Kraft-led & Konscious",
    ghosts: ["Natural fibres", "Dabu hand-block", "Kolour & komfort"],
    note: "Four things the cloth carries before it ever reaches a room.",
    /** The lines switch the photographs; ghosted type does not say so alone. */
    hint: "Choose one to see it.",
  },
  /** The line the whole page is built to arrive at. */
  close: {
    eyebrow: "A reminder",
    /** Joined and set as one balanced run - the breaks are not kept. */
    lines: ["You don’t need to add", "more to your day. Just do", "what you do with more intention."],
    /** Ringed by the hand-drawn ellipse. Must appear in `lines` verbatim. */
    circled: "more intention",
    body: "Kozy Living Textiles is a reminder that intention is not another thing to add. It is the way you do what you already do.",
    primary: { label: "Read the founder’s note", href: "/founders-note" },
    secondary: { label: "Shop all Kompanions", href: "/search" },
  },
} as const;

/* ------------------------------------------------------- founder’s note page */

/**
 * `/founders-note` - Khushi's own letter, first person.
 *
 * `studioNote` on `/about-us` says a version of this in studio voice and is
 * signed by the studio; this is the founder speaking, and is the only place
 * on the site that does. Keep the two in step if either is revised.
 *
 * "Kozy Klub" is the brand's own term for its readers and is spelled that way
 * on purpose.
 *
 * `title`, `standfirst`, `body` and `pull` are the brand's own supplied words,
 * kept verbatim - including "rooted in Indian Kraft" and the ampersand in
 * "colour, craft & consciousness". They are hers to revise, not ours to tidy,
 * so leave the punctuation (no terminal full stops, plain hyphens) as it is.
 */
export const foundersNote = {
  eyebrow: "Founder’s note",
  /** Set as display type, split word by word. */
  title: "I wanted to make the everyday routines feel more Kozy",
  /**
   * The letter opens by introducing her, so the masthead byline under this
   * line carries the Instagram handle alone - the name and the credential are
   * already in the sentence the reader has just read.
   */
  standfirst:
    "Hello, I’m Khushi Faruqui - a Textile Designer and NIFT Delhi graduate",
  body: [
    "I’ve always been drawn to how textiles shape emotion, atmosphere and the way we experience our everyday lives and rituals",
    "While creating my own Kozy corner, I found myself looking for home textiles that felt expressive, comforting and contemporary, yet rooted in Indian Kraft. When I couldn’t find them, I began designing and crafting them myself",
    "Kozy Living grew from that exploration - a journey to bring colour, craft & consciousness into the rituals that make up our everyday lives",
    "We believe the everyday deserves to feel good - through colour, comfort, craft and the little moments in between",
  ],
  pull: "This is your invitation to make the everyday more Kozy",
  welcome: "Welcome to your Kozy Klub",
  signature: site.founder,
  signatureRole: site.founderCredential,
  cta: { label: "Meet the Kompanions", href: "/search" },
  back: { label: "The Kozy Story", href: "/the-kozy-story" },
} as const;

/**
 * The page turn on the curated shelves - shop by colour and shop by mood.
 * The summary reads "Showing 7-12 of 20 Kompanions"; the chip while the next
 * page loads reads "Turning to page 2…".
 */
export const shelfPaging = {
  showing: "Showing",
  of: "of",
  kompanion: "Kompanion",
  kompanions: "Kompanions",
  turning: "Turning to page",
} as const;

/**
 * `/shop-by-mood` - the index of rituals and the Kompanions gathered under
 * each. The MOODS themselves (names, one-line descriptions, order) are not
 * here: they are the `shop_mood` metaobjects in Shopify Admin, so the brand
 * can add a seventh or reword one without a deploy. This is only the page's
 * own framing around them.
 */
export const shopByMood = {
  metaTitle: "Shop by Mood",
  metaDescription:
    "Start with the moment rather than the thing. Kompanions gathered around the small rituals of a day - a slow morning, the first cup, an evening of rest, a lounge shared with someone you love.",
  eyebrow: "Shop by mood",
  /** The sage-deep line set above the headline, in the same face. */
  kicker: "Slow rituals:",
  /** `ring` must appear in `headline` verbatim - it is the phrase CircledWord loops. */
  headline: "Begin with the moment",
  ring: "moment",
  lede: "Kompanions gathered around the small rituals of a day. Choose the moment you are making room for, and what was krafted for it gathers below.",
  indexLabel: "The moods",
  /** The badge beside the eyebrow reads "6 moods". */
  moodsWord: "moods",
  comingSoon: "Coming soon",
  noMoods: "No moods are published yet.",
  browseAll: "Browse every Kompanion",
  /** Step one - the list. */
  index: {
    step: "Pick a mood",
    /** The hint beside the step: the swipe rail below `lg`, then one for a
        mouse and one for a finger on the desktop list. */
    hintRail: "Swipe to browse · tap to shop",
    hintPointer: "Hover to preview · click to shop",
    hintTouch: "Tap a mood to see its Kompanions",
    /** The pill on each card of the phone rail. */
    shop: "Shop this mood",
    /** The rail's dots read "Go to Caffeine Ritual". */
    goTo: "Go to",
    /** Flags the chosen row and the photograph showing it. */
    selected: "Selected",
    /** Tags the photograph while it shows a mood that is not chosen. */
    preview: "Preview",
    /** The photograph's caption reads "Mood 03". */
    moodWord: "Mood",
    /** On the chosen row - its Kompanions are already on the page. */
    showing: "See them below",
    clear: "Clear",
    /** Leads into `browseAll` under the list. */
    unsure: "Not sure where to start?",
  },
  /** Step two before anything is chosen. */
  resting: {
    step: "Browse its Kompanions",
    title: "Choose a moment to see what belongs to it",
    body: "Pick a mood above and the Kompanions made for it will gather here.",
    back: "Pick a mood",
  },
  /** Step two once a mood is chosen. */
  results: {
    /** "Mood 03 of 06". */
    eyebrow: "Mood",
    of: "of",
    /** The sticky chip rail: its name, and the chip back up to the list. */
    switcher: "Switch mood",
    back: "All moods",
    /** "Gathering Rest as a Ritual…" while the next shelf loads. */
    gathering: "Gathering",
    /** The card at the end of the shelf. */
    next: "Next mood",
    clear: "Clear mood",
  },
  /** The homepage's mood panels, the section after Shop by colour. */
  home: {
    eyebrow: "Shop by mood",
    title: "Choose your Kozy Ritual",
    action: "All moods",
    /** The pill at the foot of each panel. */
    explore: "Explore mood",
  },
} as const;
