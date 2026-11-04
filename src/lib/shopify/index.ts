import { houseSpelling, houseSpellingSeo } from "./house-spelling";
import { NextRequest, NextResponse } from "next/server";
import {
  ADDON_PRODUCT_TAG,
  HIDDEN_PRODUCT_TAG,
  KIT_CONTAINER_TAG,
  KIT_PIECE_TAG,
  SHOPIFY_GRAPHQL_API_ENDPOINT,
  TAGS,
} from "../constants";
import { colourFromMetaobject, type ColourValue } from "../shop/colours";
import { moodFromMetaobject, type MoodValue } from "../shop/moods";
import { isShopifyError } from "../type-guards";
import { ensureStartWith } from "../utils";
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation,
} from "./mutations/cart";
import { getAddOnsQuery } from "./queries/add-ons";
import { getKitBuilderQuery } from "./queries/kit-builder";
import { FABRIC_OPTION, sameOption } from "../shop/kit";
import { getCartQuery } from "./queries/cart";
import {
  getCollectionProductsQuery,
  getCollectionsQuery,
} from "./queries/collection";
import {
  getCatalogQuery,
  getCollectionOrderQuery,
  searchCatalogQuery,
} from "./queries/catalog";
import { getColourPaletteQuery } from "./queries/colours";
import { getMoodsQuery } from "./queries/moods";
import { getProductSizeChartQuery } from "./queries/size-chart";
import {
  parseMeasurements,
  pickSizeChart,
  SIZE_CHART_METAOBJECT_TYPE,
  type ProductSizeChart,
  type RichTextNode,
  type SizeChart,
} from "../shop/size-chart";
import { getMenuQuery } from "./queries/menu";
import {
  getProductQuery,
  getProductRecommendationsQuery,
  getProductsQuery,
  searchProductsQuery,
} from "./queries/product";
import {
  Article,
  Blog,
  Cart,
  CartItem,
  CartLineInput,
  CartLineUpdateInput,
  CartUserError,
  CartWarning,
  CatalogProduct,
  Collection,
  Connection,
  Image,
  KitBuilder,
  KitColour,
  KitFabric,
  KitPiece,
  KitThread,
  KitVariant,
  Menu,
  Money,
  Page,
  Product,
  ProductAddOn,
  ShopifyAddOnMetaobject,
  ShopifyAddOnsOperation,
  ShopifyAddToCartOperation,
  ShopifyArticle,
  ShopifyArticleOperation,
  ShopifyArticlesOperation,
  ShopifyBlogOperation,
  ShopifyBlogsOperation,
  ShopifyCart,
  ShopifyCartOperation,
  ShopifyCatalogOperation,
  ShopifyCatalogProduct,
  ShopifyCollection,
  ShopifyColourPaletteOperation,
  ShopifyKitBuilderOperation,
  ShopifyCollectionOrderOperation,
  ShopifyCollectionProductsOperation,
  ShopifyCollectionsOperation,
  ShopifyCreateCartOperation,
  ShopifyMenuOperation,
  ShopifyMoodsOperation,
  ShopifyPageOperation,
  ShopifyPagesOperation,
  ShopifyShopPoliciesOperation,
  ShopPolicy,
  ShopifyProduct,
  ShopifyProductOperation,
  ShopifyProductRecommendationsOperation,
  ShopifyProductsOperation,
  ShopifySearchCatalogOperation,
  ShopifySearchProductsOperation,
  ShopifyRemoveFromCartOperation,
  ShopifyUpdateCartOperation,
} from "./types";
import { headers } from "next/headers";
import { revalidateTag } from "next/cache";
// Per-request memo. The header, the mobile drawer, the search overlay and the
// homepage's category rail all ask for the menu in one render; the fetch
// cache would dedupe them in production, but a POST is never deduped by
// `fetch` itself and development caches nothing, so without this each one
// was its own round trip.
import { cache as reactCache } from "react";
import { getPageQuery, getPagesQuery } from "./queries/page";
import {
  getShopPoliciesQuery,
  getShopPolicyNamesQuery,
} from "./queries/policies";
import {
  getArticleQuery,
  getArticlesQuery,
  getBlogQuery,
  getBlogsQuery,
} from "./queries/blog";

const domain = process.env.SHOPIFY_STORE_DOMAIN
  ? ensureStartWith(process.env.SHOPIFY_STORE_DOMAIN, "https://")
  : "";
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key =
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
  process.env.SHOPIFY_STOREFRONT_PUBLIC_TOKEN;
/**
 * Next and React signal control flow by throwing: the dynamic-rendering
 * bailout, `notFound()`, `redirect()`. Those errors carry a `digest` and MUST
 * reach the framework untouched - a `catch` that swallows one can leave a
 * route statically rendered with the data it was about to fetch missing, and
 * the failure is silent.
 *
 * Every Shopify call in this app sits behind a `catch` that degrades to empty
 * data, so the check belongs at the bottom of the stack.
 */
export function isFrameworkControlFlowError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const digest = (error as { digest?: unknown }).digest;
  if (typeof digest !== "string") return false;

  return (
    digest === "DYNAMIC_SERVER_USAGE" ||
    digest === "NEXT_NOT_FOUND" ||
    digest.startsWith("NEXT_REDIRECT") ||
    digest.startsWith("BAILOUT_TO_CLIENT_SIDE_RENDERING")
  );
}

/* ---------------------------------------------------------------------------
   How long Shopify data may go stale

   Every cached call carries a TAG and a TTL, and it needs both.

   The tag is the fast path: Shopify POSTs a webhook to `/api/revalidate` when a
   product, collection, blog or metaobject changes, and that clears the tag
   immediately. When it is wired up, the site is seconds behind the Admin.

   The TTL is the floor, and it is the part that was missing. `cache:
   "force-cache"` with tags alone means Next holds a response FOREVER until a
   webhook says otherwise - so on any store where the webhooks are not
   registered, or that is running on localhost where Shopify cannot reach it,
   the catalogue freezes at whatever it was the first time it was fetched and
   never moves again. That is exactly what happened here: colour metafields
   added in Admin did not appear on the site at all, because the site was still
   serving a day-old copy of the catalogue.

   A webhook is an optimisation. The TTL is the guarantee.

   Development defaults to no caching at all, so editing Shopify and refreshing
   the browser shows the change. Production defaults to 15 minutes.
   `SHOPIFY_CACHE_SECONDS` overrides both.

   It was a minute, and that was measured to be too short for the Hobby plan
   (2026-11-04). This TTL also sets how often an ISR page may rebuild, and one
   automated client requesting `/` every 168s rebuilt the homepage around the
   clock with 7 real visitors a day: ~500 ISR write units an hour, or ~360K a
   month against a 200K limit. The three `export const revalidate` values on
   the ISR routes repeat this number, because Next needs a literal there and
   the lower of the two wins. Move them together.
--------------------------------------------------------------------------- */

export const SHOPIFY_CACHE_SECONDS = (() => {
  const configured = Number(process.env.SHOPIFY_CACHE_SECONDS);
  if (Number.isFinite(configured) && configured >= 0) return configured;

  return process.env.NODE_ENV === "production" ? 900 : 0;
})();

type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;
export async function shopifyFetch<T>({
  cache,
  revalidate = SHOPIFY_CACHE_SECONDS,
  headers,
  query,
  tags,
  variables,
}: {
  /** Only `"no-store"` is honoured - a caller saying "never cache this" means it. */
  cache?: RequestCache;
  /** Seconds this response may be reused. `0` disables caching for the call. */
  revalidate?: number;
  headers?: HeadersInit;
  query: string;
  tags?: string[];
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T } | never> {
  // Fail loudly and early rather than sending an unauthenticated request that
  // Shopify answers with an opaque 403.
  if (!domain || !key) {
    throw new Error(
      "Shopify is not configured: set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN."
    );
  }

  const uncached = cache === "no-store" || revalidate <= 0;

  try {
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": key,
        ...headers,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
      // `cache` and `next.revalidate` are mutually exclusive in Next - setting
      // both is a conflict it resolves in ways that are hard to predict - so
      // exactly one of them is sent. A TTL of 0 means the same thing as
      // "no-store" and is expressed that way rather than as `revalidate: 0`.
      ...(uncached
        ? { cache: "no-store" as RequestCache }
        : { next: { ...(tags ? { tags } : {}), revalidate } }),
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body,
    };
  } catch (error) {
    // Control-flow throws pass straight through: wrapping one turns a
    // framework signal into an ordinary object that callers then swallow.
    if (isFrameworkControlFlowError(error)) throw error;

    if (isShopifyError(error)) {
      throw {
        cause: error.cause?.toString() || "unknown",
        status: error.status || 500,
        message: error.message,
        query,
      };
    }

    throw {
      error,
      query,
    };
  }
}

function removeEdgesAndNodes<T>(array: Connection<T>): T[] {
  return array.edges.map((edge) => edge?.node);
}

function reshapeImages(images: Connection<Image>, productTitle: string) {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => {
    const filename = image.url.match(/.*\/(.*)\..*/)?.[1];

    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`,
    };
  });
}
function reshapeProduct(
  product: ShopifyProduct,
  filterHiddenProducts: boolean = true
) {
  // An add-on is filtered even where hidden products are allowed through (the
  // product page passes `false`): it is a charge, not something to browse,
  // and its page must 404 rather than render an orphan "Add to cart". A kit
  // piece or container likewise: sold only through /kit-builder, which reads
  // them through its own reshape, never this one.
  if (
    !product ||
    product.tags.includes(ADDON_PRODUCT_TAG) ||
    product.tags.includes(KIT_PIECE_TAG) ||
    product.tags.includes(KIT_CONTAINER_TAG) ||
    (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))
  ) {
    return undefined;
  }

  const { images, variants, collections, ...rest } = product;

  return {
    ...rest,
    title: houseSpelling(product.title),
    description: houseSpelling(product.description),
    descriptionHtml: houseSpelling(product.descriptionHtml),
    seo: houseSpellingSeo(product.seo),
    images: reshapeImages(images, product.title),
    variants: removeEdgesAndNodes(variants),
    // The nested collection titles are merchant copy too - they travel with
    // the product and get rendered as badges and labels downstream, so they
    // need the same normalising the top-level collection gets.
    collections: collections
      ? removeEdgesAndNodes(collections).map((entry) => ({
          ...entry,
          title: houseSpelling(entry.title),
        }))
      : [],
  };
}
function reshapeProducts(products: ShopifyProduct[]) {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
}
/**
 * Rewrites a Shopify menu URL into a route this app actually serves.
 *
 * Parsed with `URL` rather than by stripping the configured domain: menu items
 * come back on whichever domain the storefront is published under, so a store
 * with a primary custom domain returns links that never match
 * `SHOPIFY_STORE_DOMAIN` and would otherwise stay absolute.
 */
function normalizeMenuPath(url: string): string {
  let pathname: string;

  try {
    pathname = new URL(url).pathname;
  } catch {
    // Already relative, or not a URL at all.
    pathname = url.split("?")[0] || "/";
  }

  // Trailing slashes would defeat the prefix checks below and the active-state
  // comparison in the nav.
  if (pathname.length > 1) pathname = pathname.replace(/\/+$/, "");

  if (pathname === "" || pathname === "/") return "/";

  // Shopify pluralises where this app does not.
  if (pathname.startsWith("/products/")) {
    return pathname.replace("/products/", "/product/");
  }

  // `/collections`, `/collections/all` and `/collections/<handle>`.
  if (pathname === "/collections") return "/search";
  if (pathname.startsWith("/collections/")) {
    const handle = pathname.split("/")[2];
    return !handle || handle === "all" ? "/search" : `/search/${handle}`;
  }

  // Shopify pages are served at the app root: /pages/about-us -> /about-us.
  if (pathname.startsWith("/pages/")) return pathname.replace("/pages", "");

  // /blogs/... and everything else already matches a route.
  return pathname;
}

type ShopifyMenuItemShape = {
  title: string;
  url: string;
  items?: ShopifyMenuItemShape[];
};

function reshapeMenuItem(item: ShopifyMenuItemShape): Menu {
  return {
    title: houseSpelling(item.title),
    path: normalizeMenuPath(item.url),
    ...(item.items?.length ? { items: item.items.map(reshapeMenuItem) } : {}),
  };
}

/**
 * One Shopify menu by handle. Returns `[]` when the handle does not exist -
 * Shopify answers with a null menu rather than an error, so callers that need
 * to try more than one handle must check the length, not catch. That is what
 * `getPrimaryMenu` is for.
 */
export async function getMenu(handle: string): Promise<Menu[]> {
  const res = await shopifyFetch<ShopifyMenuOperation>({
    query: getMenuQuery,
    // On the default TTL like everything else (see SHOPIFY_CACHE_SECONDS):
    // uncached in development, so an Admin edit shows on refresh, and at most
    // 15 minutes behind in production. No tag - Shopify sends no webhook for
    // menus - so the TTL alone is what brings an edit through.
    //
    // It was `no-store`, so header edits would appear instantly. The cost was
    // that the header awaits this outside any Suspense boundary: EVERY page,
    // on every request, sat on a live Shopify round trip before it could send
    // its first byte - ~0.5-0.7s of TTFB on a warm cache, on /about-us as
    // much as on the homepage.
    variables: {
      handle,
    },
  });

  return res.body?.data?.menu?.items.map(reshapeMenuItem) || [];
}

/**
 * The first of `handles` that names a menu with items. Shopify answers an
 * unknown handle with a null menu rather than an error, so an empty result
 * means "try the next one", and a failed call is logged and skipped rather
 * than taking the page down with it.
 */
async function firstMenu(handles: (string | undefined)[]): Promise<Menu[]> {
  for (const handle of handles) {
    if (!handle) continue;
    try {
      const menu = await getMenu(handle);
      if (menu.length) return menu;
    } catch (error) {
      if (isFrameworkControlFlowError(error)) throw error;
      console.error(`Failed to load the "${handle}" Shopify menu`, error);
    }
  }

  return [];
}

/**
 * The site navigation, resolved against the handles a Shopify store is likely
 * to use for it. `main-menu` is Shopify's default handle and is what this
 * store's "kozy-living-menu" actually resolves to - a menu's display name and
 * its handle drift apart the moment someone renames it in Admin, so both are
 * tried and the first that returns items wins.
 *
 * `NEXT_PUBLIC_SHOPIFY_MENU_HANDLE` takes priority when set, so a store that
 * uses a third handle needs an env var rather than a code change.
 */
export const getPrimaryMenu = reactCache(
  async (): Promise<Menu[]> =>
    firstMenu([
      process.env.NEXT_PUBLIC_SHOPIFY_MENU_HANDLE,
      "main-menu",
      "kozy-living-menu",
    ])
);

/**
 * The footer's navigation: the `kozy-living-footer` menu in Admin, read the
 * same way as the header's and on the same TTL. Its top-level items with
 * children become the footer's columns; the ones without become its large
 * standalone links (see `components/layout/footer.tsx`).
 *
 * Shopify's own default `footer` menu is deliberately NOT a candidate: on this
 * store it holds a single "Search" link, and a footer of one link is worse
 * than the fallback. If no footer menu resolves, the primary menu stands in -
 * still the merchant's navigation, never a list hard-coded here.
 */
export const getFooterMenu = reactCache(async (): Promise<Menu[]> => {
  const footer = await firstMenu([
    process.env.SHOPIFY_FOOTER_MENU_HANDLE,
    "kozy-living-footer",
  ]);

  return footer.length ? footer : getPrimaryMenu();
});

/* ------------------------------------------------------------- policies */

const POLICY_SLOTS = [
  "privacyPolicy",
  "termsOfService",
  "refundPolicy",
  "shippingPolicy",
] as const;

function presentPolicies(
  shop: ShopifyShopPoliciesOperation["data"]["shop"] | undefined
): ShopPolicy[] {
  return POLICY_SLOTS.flatMap((slot) => {
    const policy = shop?.[slot];
    return policy?.handle
      ? [{ ...policy, title: houseSpelling(policy.title) }]
      : [];
  });
}

/**
 * The shop policies the merchant has actually written, names only - the
 * footer's legal row. Unwritten ones are absent, not linked to a 404.
 */
export const getShopPolicyNames = reactCache(
  async (): Promise<ShopPolicy[]> => {
    const res = await shopifyFetch<ShopifyShopPoliciesOperation>({
      query: getShopPolicyNamesQuery,
    });

    return presentPolicies(res.body?.data?.shop);
  }
);

/** One policy with its body, for `/policies/<handle>`. */
export async function getShopPolicy(
  handle: string
): Promise<ShopPolicy | undefined> {
  const res = await shopifyFetch<ShopifyShopPoliciesOperation>({
    query: getShopPoliciesQuery,
  });

  return presentPolicies(res.body?.data?.shop).find(
    (policy) => policy.handle === handle
  );
}

export async function getProducts({
  query,
  reverse,
  sortKey,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const normalizedQuery = query?.trim().replace(/\s+/g, " ");

  if (normalizedQuery) {
    const [searchResponse, collections] = await Promise.all([
      shopifyFetch<ShopifySearchProductsOperation>({
        query: searchProductsQuery,
        tags: [TAGS.products],
        variables: { query: normalizedQuery },
      }),
      getCollections(),
    ]);

    const normalizedNeedle = normalizedQuery.toLocaleLowerCase();
    const matchingCollections = collections
      .filter(
        (collection) =>
          collection.handle &&
          (collection.title.toLocaleLowerCase().includes(normalizedNeedle) ||
            collection.handle
              .replace(/-/g, " ")
              .toLocaleLowerCase()
              .includes(normalizedNeedle))
      )
      .slice(0, 5);

    const collectionProducts = await Promise.all(
      matchingCollections.map((collection) =>
        getCollectionProducts({ collection: collection.handle })
      )
    );
    const searchedProducts = reshapeProducts(
      removeEdgesAndNodes(searchResponse.body.data.search)
    );
    const productsById = new Map(
      [...searchedProducts, ...collectionProducts.flat()].map((product) => [
        product.id,
        product,
      ])
    );
    const products = Array.from(productsById.values());

    if (sortKey === "PRICE") {
      products.sort(
        (a, b) =>
          Number(a.priceRange.minVariantPrice.amount) -
          Number(b.priceRange.minVariantPrice.amount)
      );
    } else if (sortKey === "CREATED_AT") {
      products.sort(
        (a, b) =>
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      );
    }

    return reverse ? products.reverse() : products;
  }

  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getProductsQuery,
    tags: [TAGS.products],
    variables: {
      query: normalizedQuery,
      reverse,
      sortKey,
    },
  });

  return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
}

function reshapeCollection(
  collection: ShopifyCollection
): Collection | undefined {
  if (!collection) return undefined;

  return {
    ...collection,
    // Merchant copy, so it goes through the house spelling on the way in.
    title: houseSpelling(collection.title),
    description: houseSpelling(collection.description),
    seo: houseSpellingSeo(collection.seo),
    path: `/search/${collection.handle}`,
  };
}

function reshapeCollections(collections: ShopifyCollection[]) {
  const reshapedCollections = [];

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);

      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }

  return reshapedCollections;
}

export async function getCollections(): Promise<Collection[]> {
  const res = await shopifyFetch<ShopifyCollectionsOperation>({
    query: getCollectionsQuery,
    tags: [TAGS.collections],
  });

  const shopifyCollections = removeEdgesAndNodes(res?.body?.data?.collections);
  const collections = [
    {
      handle: "",
      title: "All",
      description: "All products",
      image: null,
      seo: {
        title: "All",
        description: "All products",
      },
      path: "/search",
      updatedAt: new Date().toISOString(),
    },
    // Filter out the hidden products
    ...reshapeCollections(shopifyCollections).filter(
      (collection) => !collection.handle.startsWith("hidden")
    ),
  ];

  return collections;
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    tags: [TAGS.collections, TAGS.products],
    variables: {
      handle: collection,
      reverse,
      sortKey: sortKey === "CREATED_AT" ? "CREATED" : sortKey,
    },
  });

  if (!res.body.data.collection) {
    console.log(`No collection found for \`${collection}\``);
    return [];
  }

  return reshapeProducts(
    removeEdgesAndNodes(res.body.data.collection.products)
  );
}

/* ------------------------------------------------------------------ catalog

   The shop page reads the catalogue once and does the rest - facets, filtering,
   sorting, paging - over that one array. Shopify's own storefront filters were
   the obvious alternative and were rejected after checking what this store
   actually returns: `filters` on a collection comes back with Availability and
   Price only (the merchant has not configured Search & Discovery), there is no
   `collection(handle: "all")` to hang them off for the unfiltered shop page,
   and facet counts across a set the API will not describe cannot be made exact.

   Reading the whole catalogue is only affordable because `productCardFragment`
   is small; see the note there. */

/** Shopify caps a connection at 250 nodes per page. */
const CATALOG_PAGE_SIZE = 250;

/**
 * Hard ceiling on the catalogue walk. A store past this size wants Shopify's
 * own filtered pagination rather than an in-memory pass, and stopping is far
 * better than a request that walks forever: the shop page degrades to the first
 * `CATALOG_LIMIT` products with a warning in the log, rather than timing out.
 */
export const CATALOG_LIMIT = 2000;

function reshapeCatalogProduct(
  product: ShopifyCatalogProduct
): CatalogProduct | undefined {
  if (
    !product ||
    product.tags?.includes(HIDDEN_PRODUCT_TAG) ||
    product.tags?.includes(ADDON_PRODUCT_TAG) ||
    product.tags?.includes(KIT_PIECE_TAG) ||
    product.tags?.includes(KIT_CONTAINER_TAG)
  ) {
    return undefined;
  }

  const { collections, images, variants, metafields, moods, ...rest } = product;

  return {
    ...rest,
    title: houseSpelling(product.title),
    tags: product.tags ?? [],
    options: product.options ?? [],
    collections: collections
      ? removeEdgesAndNodes(collections).map((entry) => ({
          ...entry,
          title: houseSpelling(entry.title),
        }))
      : [],
    // Both connections are optional in practice: a cached catalogue entry
    // written before the fragment carried them deserialises without either.
    images: images ? reshapeImages(images, product.title) : [],
    variants: variants ? removeEdgesAndNodes(variants) : [],
    // Storefront returns one slot per requested identifier and fills the ones
    // this store has no definition for with `null`. Dropping them here means
    // every reader downstream sees only metafields that exist.
    metafields: (metafields ?? []).filter(
      (field): field is NonNullable<typeof field> => Boolean(field)
    ),
    moods: (moods ?? []).filter(
      (field): field is NonNullable<typeof field> => Boolean(field)
    ),
  };
}

/**
 * The brand's moods, in the merchant's own order - the `shop_mood`
 * metaobjects, read directly for the same reason as the colour palette below:
 * the shop-by-mood index must show a mood nothing is tagged with yet.
 *
 * Degrades to `[]`, and the page then shows the moods its products carry.
 */
export async function getMoods(): Promise<MoodValue[]> {
  try {
    const res = await shopifyFetch<ShopifyMoodsOperation>({
      query: getMoodsQuery,
      tags: [TAGS.products],
      variables: { first: 50 },
    });

    return (res.body?.data?.metaobjects?.nodes ?? [])
      .map(moodFromMetaobject)
      .filter((mood): mood is MoodValue => Boolean(mood));
  } catch (error) {
    if (isFrameworkControlFlowError(error)) throw error;

    console.warn("Mood metaobjects unavailable:", error);
    return [];
  }
}

/**
 * The brand's colour palette, in the merchant's own order.
 *
 * Read straight from the `shop_color` metaobjects rather than gathered from
 * products, so the shop-by-colour picker can show a colour the catalogue has
 * not been tagged with yet - a palette missing a shade because nothing is in
 * stock in it reads as a broken page, not as an empty shelf.
 *
 * Degrades to `[]` rather than throwing: a store with no such definition simply
 * gets the colours its products carry, which is what every other surface uses.
 *
 * Tagged with `products` so the existing Shopify webhook refreshes it - colours
 * and the products carrying them change in the same editing session.
 */
export async function getColourPalette(): Promise<ColourValue[]> {
  try {
    const res = await shopifyFetch<ShopifyColourPaletteOperation>({
      query: getColourPaletteQuery,
      tags: [TAGS.products],
      variables: { first: 50 },
    });

    const nodes = res.body?.data?.metaobjects?.nodes ?? [];

    return nodes
      .map(colourFromMetaobject)
      .filter((colour): colour is ColourValue => Boolean(colour));
  } catch (error) {
    if (isFrameworkControlFlowError(error)) throw error;

    console.warn("Colour palette metaobjects unavailable:", error);
    return [];
  }
}

/* ------------------------------------------------------------ add-ons

   Personalisation add-ons (initials, gift box) are `product_add_on`
   metaobjects the merchant edits in Admin, each pointing at a hidden product
   variant that is the thing actually charged. See
   docs/personalisation-add-ons.md for the Admin side. */

const ADDON_KINDS = new Set<ProductAddOn["kind"]>(["initials", "gift_box"]);

/** Ceiling on a merchant-set `max_length`, whatever the definition allows. */
const ADDON_TEXT_CEILING = 10;

function reshapeAddOn(node: ShopifyAddOnMetaobject): ProductAddOn | undefined {
  const field = (key: string) => node.fields.find((f) => f.key === key);
  const text = (key: string) => field(key)?.value?.trim() || null;
  // Shopify serialises a boolean field as the string "true" or "false".
  const flag = (key: string) => field(key)?.value === "true";

  const kind = text("kind") as ProductAddOn["kind"] | null;
  const variant = field("variant")?.reference;

  // Off in Admin, or offered only per product - which this storefront does
  // not implement (docs, section 8). Unknown kinds are skipped rather than
  // guessed at: the picker would not know which input to draw.
  if (!flag("active") || !flag("apply_to_all")) return undefined;
  if (!kind || !ADDON_KINDS.has(kind)) return undefined;
  if (!variant?.id || !variant.price) return undefined;

  const textLabel = text("text_label");
  const maxLength = Number(text("max_length"));

  return {
    id: node.id,
    kind,
    title: text("title") ?? node.handle,
    variantId: variant.id,
    price: variant.price,
    available: variant.availableForSale !== false,
    textLabel,
    // A required field with no label would be an input nobody can name.
    textRequired: Boolean(textLabel) && flag("text_required"),
    maxLength:
      Number.isInteger(maxLength) && maxLength > 0
        ? Math.min(maxLength, ADDON_TEXT_CEILING)
        : ADDON_TEXT_CEILING,
    helpText: text("help_text"),
    policyNote: text("policy_note"),
    chargePerUnit: flag("charge_per_unit"),
  };
}

/**
 * Every add-on the storefront should offer, in the merchant's order.
 *
 * Memoised per request - the product page and the add-to-cart action can both
 * ask - and on the standard TTL, so a price edit in Admin is live within 15
 * minutes in production. Degrades to `[]`: a store with no definition, or with
 * Storefronts access switched off, just sells without add-ons.
 */
export const getAddOns = reactCache(async (): Promise<ProductAddOn[]> => {
  try {
    const res = await shopifyFetch<ShopifyAddOnsOperation>({
      query: getAddOnsQuery,
      tags: [TAGS.products],
      variables: { first: 20 },
    });

    return (res.body?.data?.metaobjects?.nodes ?? [])
      .map(reshapeAddOn)
      .filter((addOn): addOn is ProductAddOn => Boolean(addOn));
  } catch (error) {
    if (isFrameworkControlFlowError(error)) throw error;

    console.warn("Add-on metaobjects unavailable:", error);
    return [];
  }
});

/* -------------------------------------------------------------- size charts

   `size_chart` metaobjects, referenced by `custom.size_chart` on a product or
   a collection. The rules - parsing, matching, which chart wins - are in
   `lib/shop/size-chart.ts`; this only turns the API shape into a chart. */

type SizeChartRef = {
  reference: {
    handle: string;
    type: string;
    fields: {
      key: string;
      value: string | null;
      reference: { image?: Image } | null;
    }[];
  } | null;
} | null;

function reshapeSizeChart(ref: SizeChartRef): SizeChart | null {
  const node = ref?.reference;
  if (!node || node.type !== SIZE_CHART_METAOBJECT_TYPE) return null;
  const field = (key: string) => node.fields.find((f) => f.key === key);
  const text = (key: string) => field(key)?.value?.trim() || null;

  const table = parseMeasurements(text("measurements"));
  if (!table) return null;

  let howToMeasure: RichTextNode | null = null;
  try {
    const raw = text("how_to_measure");
    howToMeasure = raw ? (JSON.parse(raw) as RichTextNode) : null;
  } catch {
    // A malformed rich text value drops the steps, not the chart.
  }

  const image = field("guide_image")?.reference?.image;
  return {
    handle: node.handle,
    name: text("name") ?? node.handle,
    unit: text("unit")?.toLowerCase() === "cm" ? "cm" : "in",
    ...table,
    fitNote: text("fit_note"),
    howToMeasure,
    guideImage: image?.url
      ? { url: image.url, altText: image.altText, width: image.width, height: image.height }
      : null,
  };
}

/**
 * The chart for one product page, or null. Never throws: a guide that fails
 * to load is a missing link, not a broken product page.
 */
export const getProductSizeChart = reactCache(
  async (handle: string): Promise<ProductSizeChart | null> => {
    try {
      const res = await shopifyFetch<{
        data: {
          product: {
            options: { name: string; values: string[] }[];
            sizeChart: SizeChartRef;
            collections: { nodes: { sizeChart: SizeChartRef }[] };
          } | null;
        };
        variables: { handle: string };
      }>({
        query: getProductSizeChartQuery,
        tags: [TAGS.products, TAGS.collections],
        variables: { handle },
      });

      const product = res.body?.data?.product;
      if (!product) return null;

      return pickSizeChart(
        reshapeSizeChart(product.sizeChart),
        product.collections.nodes
          .map((collection) => reshapeSizeChart(collection.sizeChart))
          .filter((chart): chart is SizeChart => Boolean(chart)),
        product.options
      );
    } catch (error) {
      if (isFrameworkControlFlowError(error)) throw error;

      console.warn("Size chart unavailable:", error);
      return null;
    }
  }
);

/* ------------------------------------------------------- custom kit builder

   Four metaobject types the merchant edits in Admin - `kit_builder` (one entry
   of settings), `kit_piece`, `kit_fabric` and `embroidery_thread` - each read
   by key. See docs/custom-kit-builder.md, section 5. */

type KitFields = { key: string; value: string | null; reference: unknown }[];

function kitFieldReader<R>(fields: KitFields) {
  const field = (key: string) => fields.find((f) => f.key === key);
  // Admin text is pasted as often as typed; runs of whitespace (a stray tab
  // from a copied table) collapse rather than reaching a shopper.
  const text = (key: string) =>
    field(key)?.value?.replace(/\s+/g, " ").trim() || null;
  return {
    text,
    // Shopify serialises a boolean field as the string "true" or "false".
    flag: (key: string) => field(key)?.value === "true",
    int: (key: string) => {
      const value = Number(field(key)?.value);
      return Number.isInteger(value) ? value : null;
    },
    ref: (key: string) => (field(key)?.reference ?? null) as R | null,
  };
}

/** Entries the merchant numbered come first, in their order; the rest after. */
function bySortOrder<T>(entries: { sort: number | null; entry: T }[]): T[] {
  return entries
    .map((item, index) => ({ ...item, index }))
    .sort(
      (a, b) =>
        (a.sort ?? Number.MAX_SAFE_INTEGER) - (b.sort ?? Number.MAX_SAFE_INTEGER) ||
        a.index - b.index
    )
    .map(({ entry }) => entry);
}

function reshapeKitPiece(
  node: NonNullable<ShopifyKitBuilderOperation["data"]["pieces"]>["nodes"][number]
): { sort: number | null; entry: KitPiece } | undefined {
  const { text, flag, int, ref } = kitFieldReader<{
    title?: string;
    featuredImage?: Image | null;
    images?: { nodes: Image[] };
    variants?: { nodes: KitVariant[] };
  }>(node.fields);
  const product = ref("product");

  // Off in Admin, or its product is Draft/archived and no longer resolves.
  // Deliberately NOT through `reshapeProduct`: that drops kit pieces by tag.
  if (!flag("active") || !product?.variants?.nodes.length) return undefined;

  const variants = product.variants.nodes;
  const sizeOptions: KitPiece["sizeOptions"] = [];
  for (const variant of variants) {
    for (const option of variant.selectedOptions) {
      if (sameOption(option.name, FABRIC_OPTION)) continue;
      let entry = sizeOptions.find((o) => o.name === option.name);
      if (!entry) sizeOptions.push((entry = { name: option.name, values: [] }));
      if (!entry.values.includes(option.value)) entry.values.push(option.value);
    }
  }

  const productTitle = houseSpelling(product.title ?? node.handle);

  return {
    sort: int("sort_order"),
    entry: {
      id: node.id,
      handle: node.handle,
      title: houseSpelling(text("title") ?? productTitle),
      description: text("description"),
      embroiderable: flag("embroiderable"),
      productTitle,
      image: product.featuredImage ?? null,
      images: product.images?.nodes ?? [],
      variants,
      // A lone "Default Title" is not a size anyone picks.
      sizeOptions: sizeOptions.filter(
        (option) => !(option.values.length === 1 && option.values[0] === "Default Title")
      ),
    },
  };
}

function reshapeKitFabric(
  node: NonNullable<ShopifyKitBuilderOperation["data"]["fabrics"]>["nodes"][number]
): { sort: number | null; entry: KitFabric } | undefined {
  const { text, flag, int, ref } = kitFieldReader<{ image?: Image | null }>(
    node.fields
  );
  const optionValue = text("option_value");
  // With no option value there is no variant this fabric could select.
  if (!flag("active") || !optionValue) return undefined;

  return {
    sort: int("sort_order"),
    entry: {
      id: node.id,
      handle: node.handle,
      title: text("title") ?? optionValue,
      optionValue,
      description: text("description"),
      swatch: ref("swatch")?.image ?? null,
      isDefault: flag("is_default"),
    },
  };
}

function reshapeKitThread(
  node: NonNullable<ShopifyKitBuilderOperation["data"]["threads"]>["nodes"][number]
): { sort: number | null; entry: KitThread } | undefined {
  const { text, flag, int, ref } = kitFieldReader<{ image?: Image | null }>(
    node.fields
  );
  const title = text("title");
  const colour = text("colour");
  const swatch = ref("swatch")?.image ?? null;
  // A thread needs a name for the order and something to show.
  if (!flag("active") || !title || (!colour && !swatch)) return undefined;

  return {
    sort: int("sort_order"),
    entry: {
      id: node.id,
      handle: node.handle,
      title,
      colour: colour && /^#[0-9a-f]{6}$/i.test(colour) ? colour : null,
      swatch,
    },
  };
}

function reshapeKitColour(
  node: NonNullable<ShopifyKitBuilderOperation["data"]["colours"]>["nodes"][number]
): { sort: number | null; entry: KitColour } | undefined {
  const { text, flag, int, ref } = kitFieldReader<{
    image?: Image | null;
    id?: string;
  }>(node.fields);
  const title = text("title");
  const fabricId = ref("fabric")?.id;
  const swatch = ref("swatch")?.image ?? null;
  const colour = text("colour");
  // Without a fabric the colour would be offered under neither; without a
  // photo or a hex there is nothing to pick.
  if (!flag("active") || !title || !fabricId || (!swatch && !colour)) return undefined;

  return {
    sort: int("sort_order"),
    entry: {
      id: node.id,
      handle: node.handle,
      title,
      fabricId,
      swatch,
      colour: colour && /^#[0-9a-f]{6}$/i.test(colour) ? colour : null,
    },
  };
}

/**
 * The kit builder as the merchant has set it up, or `null` when it is
 * switched off or cannot work: no settings entry, no container, fewer pieces
 * than a kit needs, or no fabric to pick variants by.
 *
 * Memoised per request - the page and `addKitItem` both read it - on the
 * standard TTL, so a price or a new thread colour is live within 15 minutes
 * in production. Degrades to `null` (the page then says it is resting).
 */
export const getKitBuilder = reactCache(async (): Promise<KitBuilder | null> => {
  try {
    const res = await shopifyFetch<ShopifyKitBuilderOperation>({
      query: getKitBuilderQuery,
      tags: [TAGS.products],
    });
    const data = res.body?.data;
    const settings = data?.settings?.nodes[0];
    if (!settings) return null;

    const { text, flag, int, ref } = kitFieldReader<{
      id?: string;
      availableForSale?: boolean;
      price?: Money;
    }>(settings.fields);
    const container = ref("container_variant");
    if (!flag("active") || !container?.id) return null;

    const pieces = bySortOrder(
      (data?.pieces?.nodes ?? [])
        .map(reshapeKitPiece)
        .filter((piece): piece is NonNullable<typeof piece> => Boolean(piece))
    );
    const fabrics = bySortOrder(
      (data?.fabrics?.nodes ?? [])
        .map(reshapeKitFabric)
        .filter((fabric): fabric is NonNullable<typeof fabric> => Boolean(fabric))
    );
    const colours = bySortOrder(
      (data?.colours?.nodes ?? [])
        .map(reshapeKitColour)
        .filter((colour): colour is NonNullable<typeof colour> => Boolean(colour))
    ).filter((colour) => fabrics.some((fabric) => fabric.id === colour.fabricId));
    const threads = bySortOrder(
      (data?.threads?.nodes ?? [])
        .map(reshapeKitThread)
        .filter((thread): thread is NonNullable<typeof thread> => Boolean(thread))
    );

    // The default fabric leads, whatever its sort order says: it is the one
    // preselected, so it should also be the first card read.
    const defaultIndex = fabrics.findIndex((fabric) => fabric.isDefault);
    if (defaultIndex > 0) fabrics.unshift(...fabrics.splice(defaultIndex, 1));
    if (defaultIndex === -1 && fabrics[0]) fabrics[0] = { ...fabrics[0], isDefault: true };

    const minPieces = Math.max(1, int("min_pieces") ?? 2);
    if (!fabrics.length || pieces.length < minPieces) return null;

    const initials = ref("initials_variant");
    const maxLength = int("initials_max_length");

    return {
      title: text("title") ?? "Kustom Ritual Kit",
      containerVariantId: container.id,
      containerAvailable: container.availableForSale !== false,
      currencyCode:
        pieces[0]?.variants[0]?.price.currencyCode ??
        container.price?.currencyCode ??
        "INR",
      minPieces,
      initialsMaxLength:
        maxLength && maxLength > 0 ? Math.min(maxLength, ADDON_TEXT_CEILING) : 2,
      initialsVariantId: initials?.id ?? null,
      initialsPrice: initials?.id ? (initials.price ?? null) : null,
      embroideryNote: text("embroidery_note"),
      policyNote: text("policy_note"),
      pieces,
      fabrics,
      colours,
      threads,
    };
  } catch (error) {
    if (isFrameworkControlFlowError(error)) throw error;

    console.warn("Kit builder metaobjects unavailable:", error);
    return null;
  }
});

/**
 * Every published product, in Shopify's best-selling order.
 *
 * That order is the catalogue's canonical one: it is what an unsorted shop page
 * shows, and it is the ranking "Trending" sorts by from any starting point.
 */
export async function getCatalog(): Promise<CatalogProduct[]> {
  const products: CatalogProduct[] = [];
  let after: string | null = null;

  while (products.length < CATALOG_LIMIT) {
    const res: { body: ShopifyCatalogOperation } = await shopifyFetch<ShopifyCatalogOperation>({
      query: getCatalogQuery,
      tags: [TAGS.products, TAGS.collections],
      variables: { first: CATALOG_PAGE_SIZE, after },
    });

    const connection = res.body?.data?.products;
    if (!connection) break;

    for (const edge of connection.edges ?? []) {
      const product = reshapeCatalogProduct(edge?.node);
      if (product) products.push(product);
    }

    if (!connection.pageInfo?.hasNextPage || !connection.pageInfo.endCursor) {
      return products;
    }

    after = connection.pageInfo.endCursor;
  }

  console.warn(
    `Catalogue walk stopped at ${CATALOG_LIMIT} products; the shop page is showing a truncated catalogue.`
  );

  return products;
}

/**
 * The product ids of one collection in the merchant's own order, or `null` when
 * Shopify has no such collection.
 *
 * Used only as an ordering index over `getCatalog()`, so a collection page's
 * default sort matches what the merchant arranged in Admin.
 */
export async function getCollectionProductOrder(
  handle: string
): Promise<string[] | null> {
  const ids: string[] = [];
  let after: string | null = null;

  while (ids.length < CATALOG_LIMIT) {
    const res: { body: ShopifyCollectionOrderOperation } =
      await shopifyFetch<ShopifyCollectionOrderOperation>({
        query: getCollectionOrderQuery,
        tags: [TAGS.collections, TAGS.products],
        variables: { handle, first: CATALOG_PAGE_SIZE, after },
      });

    const collection = res.body?.data?.collection;
    if (!collection) return null;

    for (const edge of collection.products?.edges ?? []) {
      if (edge?.node?.id) ids.push(edge.node.id);
    }

    const pageInfo = collection.products?.pageInfo;
    if (!pageInfo?.hasNextPage || !pageInfo.endCursor) break;

    after = pageInfo.endCursor;
  }

  return ids;
}

/**
 * Product ids matching a search term, in Shopify's relevance order.
 *
 * The shop page intersects these with the catalogue, so search keeps Shopify's
 * matching and ranking while the facets, counts and paging stay one code path.
 */
export async function searchCatalogIds(query: string): Promise<string[]> {
  const normalized = query.trim().replace(/\s+/g, " ");
  if (!normalized) return [];

  const res = await shopifyFetch<ShopifySearchCatalogOperation>({
    query: searchCatalogQuery,
    tags: [TAGS.products],
    variables: { query: normalized, first: CATALOG_PAGE_SIZE },
  });

  const ids: string[] = [];
  for (const edge of res.body?.data?.search?.edges ?? []) {
    if (edge?.node?.id) ids.push(edge.node.id);
  }

  return ids;
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const res = await shopifyFetch<ShopifyProductOperation>({
    query: getProductQuery,
    tags: [TAGS.products],
    variables: {
      handle,
    },
  });
  return reshapeProduct(res.body.data.product, false);
}

export async function getProductRecommendations(
  productId: string
): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyProductRecommendationsOperation>({
    query: getProductRecommendationsQuery,
    tags: [TAGS.products],
    variables: {
      productId,
    },
  });

  return reshapeProducts(res.body.data.productRecommendations);
}

/**
 * Raised when Shopify accepts the request (HTTP 200, no top-level `errors`) but
 * rejects the operation via `userErrors`. `message` is safe to show to a user.
 */
export class CartMutationError extends Error {
  readonly code: string | null;
  /** GraphQL path of the offending argument, e.g. `["cartId"]`. */
  readonly field: string[] | null;

  constructor(
    message: string,
    code: string | null = null,
    field: string[] | null = null
  ) {
    super(message);
    this.name = "CartMutationError";
    this.code = code;
    this.field = field;
  }

  /** True when Shopify no longer recognises the cart id we sent. */
  get isMissingCart(): boolean {
    return this.field?.includes("cartId") ?? false;
  }
}

/** Raised when the cart id no longer resolves - checked out, or expired. */
export class CartNotFoundError extends Error {
  constructor() {
    super("Cart no longer exists");
    this.name = "CartNotFoundError";
  }
}

/**
 * Folds Shopify's flat line list into Kompanions with their add-ons nested
 * underneath. Shopify returns a child line as a sibling that names its parent;
 * every surface here wants the pairing instead, so it is made once.
 *
 * A child whose parent is not in the list (it should not happen - removing a
 * parent removes its children) stays a line of its own rather than vanishing
 * along with the money it represents.
 */
function nestCartLines(flat: CartItem[]): CartItem[] {
  const parents = new Map<string, CartItem>();
  for (const line of flat) {
    if (line.id && !line.parentRelationship?.parent?.id) {
      parents.set(line.id, { ...line, addOns: [] });
    }
  }

  const lines: CartItem[] = [];
  for (const line of flat) {
    const parentId = line.parentRelationship?.parent?.id;
    const parent = parentId ? parents.get(parentId) : undefined;

    if (parent) {
      parent.addOns!.push(line);
    } else if (line.id && parents.has(line.id)) {
      lines.push(parents.get(line.id)!);
    } else {
      lines.push(line);
    }
  }

  return lines;
}

function reshapeCart(cart: ShopifyCart): Cart {
  // `cost` and `totalTaxAmount` are both nullable on the Storefront API - a
  // brand-new cart has no tax until an address is attached. Rebuild the object
  // instead of mutating the response in place.
  const currencyCode =
    cart.cost?.totalAmount?.currencyCode ??
    cart.cost?.subtotalAmount?.currencyCode ??
    "INR";
  const zero: Money = { amount: "0.0", currencyCode };

  const lines = nestCartLines(cart.lines ? removeEdgesAndNodes(cart.lines) : []);

  return {
    ...cart,
    checkoutUrl: cart.checkoutUrl ?? "",
    // Kompanions, not lines. Shopify's own figure counts every add-on, so a
    // tote with initials and a gift box read as "3" in the header badge.
    totalQuantity: lines.reduce((sum, line) => sum + line.quantity, 0),
    cost: {
      subtotalAmount: cart.cost?.subtotalAmount ?? zero,
      totalAmount: cart.cost?.totalAmount ?? zero,
      totalTaxAmount: cart.cost?.totalTaxAmount ?? zero,
    },
    lines,
  };
}

/**
 * Unwraps a cart mutation payload. Shopify reports rejections through
 * `userErrors` with a null cart, so both have to be checked before reshaping.
 */
function unwrapCartMutation(
  payload: {
    cart: ShopifyCart | null;
    userErrors?: CartUserError[] | null;
    warnings?: CartWarning[] | null;
  },
  operation: string
): { cart: Cart; warnings: CartWarning[] } {
  const userError = payload?.userErrors?.[0];

  if (userError) {
    throw new CartMutationError(
      userError.message,
      userError.code,
      userError.field
    );
  }

  if (!payload?.cart) {
    // A null cart with no userErrors means the cart id resolved to nothing.
    throw new CartMutationError(
      `${operation} did not return a cart`,
      null,
      ["cartId"]
    );
  }

  return {
    cart: reshapeCart(payload.cart),
    warnings: payload.warnings ?? [],
  };
}

/**
 * Mints a cart, optionally with its first lines. The drawer's cart is created
 * empty (`withLiveCart` adds to it straight after); Buy now creates its own
 * single-Kompanion cart with the line already in it, saving a round trip.
 */
export async function createCart(lines: CartLineInput[] = []): Promise<Cart> {
  const res = await shopifyFetch<ShopifyCreateCartOperation>({
    query: createCartMutation,
    variables: { lineItems: lines },
    cache: "no-store",
  });

  return unwrapCartMutation(res.body.data.cartCreate, "cartCreate").cart;
}

export async function getCart(
  cartId: string | undefined,
  /**
   * Server Actions must read through the cache, not from it. `revalidateTag`
   * marks the entry stale rather than deleting it, so a cached read inside an
   * action can hand back a pre-mutation cart and make the action operate on
   * line ids that no longer exist.
   */
  options?: { fresh?: boolean }
): Promise<Cart | undefined> {
  if (!cartId) return undefined;

  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId },
    ...(options?.fresh
      ? { cache: "no-store" as const }
      : { tags: [TAGS.cart] }),
  });

  // Old carts become `null` once you check out.
  if (!res.body.data.cart) {
    return undefined;
  }

  return reshapeCart(res.body.data.cart);
}

export async function removeFromCart(
  cartId: string,
  lineIds: string[]
): Promise<Cart> {
  if (lineIds.length === 0) {
    const cart = await getCart(cartId, { fresh: true });
    if (!cart) throw new CartNotFoundError();
    return cart;
  }

  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds,
    },
    cache: "no-store",
  });

  return unwrapCartMutation(res.body.data.cartLinesRemove, "cartLinesRemove")
    .cart;
}

export async function updateCart(
  cartId: string,
  lines: CartLineUpdateInput[]
): Promise<{ cart: Cart; warnings: CartWarning[] }> {
  const res = await shopifyFetch<ShopifyUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      cartId,
      lines,
    },
    cache: "no-store",
  });

  return unwrapCartMutation(res.body.data.cartLinesUpdate, "cartLinesUpdate");
}

export async function addToCart(
  cartId: string,
  lines: CartLineInput[]
): Promise<{ cart: Cart; warnings: CartWarning[] }> {
  const res = await shopifyFetch<ShopifyAddToCartOperation>({
    query: addToCartMutation,
    variables: {
      cartId,
      lines,
    },
    cache: "no-store",
  });

  return unwrapCartMutation(res.body.data.cartLinesAdd, "cartLinesAdd");
}

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  // We always need to respond with a 200 status code to Shopify,
  // otherwise it will continue to retry the request.

  const collectionWebhooks = [
    "collections/create",
    "collections/delete",
    "collections/update",
  ];
  const productWebhooks = [
    "products/create",
    "products/delete",
    "products/update",
    // The colour palette lives in `shop_color` metaobjects, and editing one -
    // renaming a shade, restyling it, adding a seventh - changes what the shop
    // renders without touching a single product. Without these, a palette edit
    // would sit behind the TTL with no way to publish it sooner.
    "metaobjects/create",
    "metaobjects/delete",
    "metaobjects/update",
  ];
  const blogWebhooks = [
    "articles/create",
    "articles/delete",
    "articles/update",
    "blogs/create",
    "blogs/delete",
    "blogs/update",
  ];
  const topic = (await headers()).get("x-shopify-topic") || "unknown";
  const secret = req.nextUrl.searchParams.get("secret");
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);
  const isBlogUpdate = blogWebhooks.includes(topic);

  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    console.error("Invalid revalidation secret.");
    return NextResponse.json({ status: 200 });
  }

  if (!isCollectionUpdate && !isProductUpdate && !isBlogUpdate) {
    // We don't need to revalidate anything for any other topics.
    return NextResponse.json({ status: 200 });
  }

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections, "max");
  }

  if (isProductUpdate) {
    revalidateTag(TAGS.products, "max");
  }

  if (isBlogUpdate) {
    revalidateTag(TAGS.blogs, "max");
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}

// Pages ride on the same TTL as everything else. They were `no-store`, and a
// `no-store` fetch during render makes the whole route dynamic - so every
// `/[page]` view, including every bot probing `/wp-login.php`, rendered on a
// function instead of coming out of the CDN.
export async function getPage(handle: string): Promise<Page> {
  const res = await shopifyFetch<ShopifyPageOperation>({
    query: getPageQuery,
    variables: { handle },
  });

  return res.body.data.pageByHandle;
}

export async function getPages(): Promise<Page[]> {
  const res = await shopifyFetch<ShopifyPagesOperation>({
    query: getPagesQuery,
  });

  return removeEdgesAndNodes(res.body.data.pages);
}

/* --------------------------------------------------------------- blogs */

/**
 * Shopify leaves `excerpt` as an empty string when the merchant never filled
 * one in, so cards would render as bare titles. Fall back to the opening of the
 * body, cut on a word boundary.
 */
function summarize(content: string, limit = 180): string | null {
  const text = content?.replace(/\s+/g, " ").trim();

  if (!text) return null;
  if (text.length <= limit) return text;

  const cut = text.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");

  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:]$/, "")}...`;
}

/**
 * Shopify serves articles at `/blogs/<blog>/<article>`; the storefront mirrors
 * that path exactly so links copied out of the admin - or already indexed by
 * search engines - resolve without a redirect.
 */
function reshapeArticle(
  article: ShopifyArticle,
  blogHandle?: string,
  blogTitle?: string
): Article | undefined {
  if (!article) return undefined;

  const { blog, content, ...rest } = article;
  const handleOfBlog = blog?.handle ?? blogHandle;

  // Without a blog handle there is no addressable URL for the article.
  if (!handleOfBlog) return undefined;

  return {
    ...rest,
    title: houseSpelling(article.title),
    excerpt: houseSpelling(article.excerpt?.trim() || summarize(content)),
    blogHandle: handleOfBlog,
    blogTitle: houseSpelling(blog?.title ?? blogTitle ?? handleOfBlog),
    path: `/blogs/${handleOfBlog}/${article.handle}`,
  };
}

function reshapeArticles(
  articles: ShopifyArticle[],
  blogHandle?: string,
  blogTitle?: string
): Article[] {
  const reshaped: Article[] = [];

  for (const article of articles) {
    const next = reshapeArticle(article, blogHandle, blogTitle);
    if (next) reshaped.push(next);
  }

  return reshaped;
}

/** Every blog on the store, without their articles. */
export async function getBlogs(first = 20): Promise<Omit<Blog, "articles">[]> {
  const res = await shopifyFetch<ShopifyBlogsOperation>({
    query: getBlogsQuery,
    tags: [TAGS.blogs],
    variables: { first },
  });

  return removeEdgesAndNodes(res.body.data.blogs).map((blog) => ({
    ...blog,
    path: `/blogs/${blog.handle}`,
  }));
}

/** One blog with its articles, newest first. */
export async function getBlog(
  handle: string,
  first = 50
): Promise<Blog | undefined> {
  const res = await shopifyFetch<ShopifyBlogOperation>({
    query: getBlogQuery,
    tags: [TAGS.blogs],
    variables: { handle, first },
  });

  const blog = res.body.data.blog;

  if (!blog) return undefined;

  const { articles, ...rest } = blog;

  return {
    ...rest,
    path: `/blogs/${blog.handle}`,
    articles: articles
      ? reshapeArticles(
          removeEdgesAndNodes(articles),
          blog.handle,
          blog.title
        )
      : [],
  };
}

/** A single article, addressed the way Shopify addresses it. */
export async function getArticle(
  blogHandle: string,
  handle: string
): Promise<Article | undefined> {
  const res = await shopifyFetch<ShopifyArticleOperation>({
    query: getArticleQuery,
    tags: [TAGS.blogs],
    variables: { blogHandle, handle },
  });

  const blog = res.body.data.blog;
  const article = blog?.articleByHandle;

  if (!article) return undefined;

  return reshapeArticle(article, blog?.handle, blog?.title);
}

/** Articles across every blog, newest first. */
export async function getArticles(first = 24): Promise<Article[]> {
  const res = await shopifyFetch<ShopifyArticlesOperation>({
    query: getArticlesQuery,
    tags: [TAGS.blogs],
    variables: { first },
  });

  return reshapeArticles(removeEdgesAndNodes(res.body.data.articles));
}
