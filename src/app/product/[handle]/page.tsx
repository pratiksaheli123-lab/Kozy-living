import Gallery from "@/components/product/gallery";
import { ProductProvider } from "@/components/product/product-context";
import { ProductDescription } from "@/components/product/product-description";
import { FaqFallback, ProductFaq } from "@/components/faq/faq-section";
import CategoryShelf from "@/components/product/category-shelf";
import StudioNote from "@/components/product/studio-note";
import ProductCard from "@/components/product-card";
import Carousel from "@/components/ui/carousel";
import { SectionHead } from "@/components/ui/section";
import Marquee from "@/components/ui/marquee";
import { HIDDEN_PRODUCT_TAG } from "@/lib/constants";
import {
  getAddOns,
  getProduct,
  getProductRecommendations,
  getProductSizeChart,
} from "@/lib/shopify";
import { isPossibleHandle } from "@/lib/shopify/handle";
import { Image } from "@/lib/shopify/types";
import { featureBand, site } from "@/lib/site";
import { Metadata } from "next";
import Link from "@/components/ui/intent-link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

// On-demand ISR: each product renders on its first visit and is then served
// from the CDN, refreshed at most every 15 minutes (the Shopify fetch TTL). This
// only holds while nothing in the tree reads cookies, headers or
// searchParams - the cart is fetched by the browser for exactly that reason
// (see CartProvider). An empty list is what enables runtime ISR.
export const revalidate = 900;
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  if (!isPossibleHandle(handle)) notFound();
  const product = await getProduct(handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: { index: indexable, follow: indexable },
    },
    openGraph: url ? { images: [{ url, width, height, alt }] } : null,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  if (!isPossibleHandle(handle)) notFound();
  // In parallel: the add-ons are one store-wide query and the size chart one
  // small lookup, both cached on the same TTL as the product, so they cost
  // the page no extra wait.
  const [product, addOns, sizeChart] = await Promise.all([
    getProduct(handle),
    getAddOns(),
    getProductSizeChart(handle),
  ]);
  if (!product) return notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage?.url,
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "AggregateOffer",
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      lowPrice: product.priceRange.minVariantPrice.amount,
      highPrice: product.priceRange.maxVariantPrice.amount,
    },
  };

  const band = Array.from({ length: 8 }, () => featureBand.label);

  return (
    <ProductProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* The gallery and the buy panel arrive as a pair, a beat apart. */}
      <div
        data-reveal-group
        className="shell grid grid-cols-1 gap-3 pb-10 pt-4 lg:grid-cols-[1.1fr_1fr]"
      >
        <Suspense
          fallback={
            <div className="plate aspect-square w-full animate-pulse" />
          }
        >
          <Gallery
            images={product.images.slice(0, 6).map((image: Image) => ({
              src: image.url,
              altText: image.altText,
            }))}
          />
        </Suspense>

        <div className="panel p-6 md:p-10">
          {/* Sticky so the buy panel stays reachable past a tall gallery. */}
          <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
            <Suspense fallback={null}>
              <ProductDescription
                product={product}
                addOns={addOns}
                sizeChart={sizeChart}
              />
            </Suspense>
          </div>
        </div>
      </div>

      <Suspense fallback={null}>
        <CategoryShelf product={product} />
      </Suspense>

      <StudioNote />

      <Suspense fallback={<FaqFallback />}>
        <ProductFaq product={product} addOns={addOns} />
      </Suspense>

      {/* A visual break before the final product recommendations. */}
      <div className="rule-y py-5">
        <Marquee
          phrases={band}
          size="display"
          separator="✳"
          separatorTone="sage"
          duration={40}
        />
      </div>

      <Suspense fallback={null}>
        <RelatedProducts id={product.id} />
      </Suspense>

      <nav className="shell flex flex-wrap items-center gap-x-3 gap-y-2 pb-10 pt-2">
        <Link href="/" className="spec-mono hover:underline">
          Home
        </Link>
        <span aria-hidden className="spec-mono opacity-50">
          /
        </span>
        <Link href="/search" className="spec-mono hover:underline">
          Shop
        </Link>
        <span aria-hidden className="spec-mono opacity-50">
          /
        </span>
        <span className="spec-mono opacity-70">{product.title}</span>
      </nav>
    </ProductProvider>
  );
}

async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);
  if (!relatedProducts?.length) return null;
  const shelf = relatedProducts.slice(0, 9);

  return (
    <section aria-labelledby="related">
      <SectionHead
        eyebrow="Pairs well with"
        title={<span id="related">You May Also Like</span>}
        count={shelf.length}
        action="View all"
        actionHref="/search"
      />
      <Carousel label="Related objects">
        {shelf.map((product) => (
          <ProductCard key={product.handle} product={product} />
        ))}
      </Carousel>
    </section>
  );
}
