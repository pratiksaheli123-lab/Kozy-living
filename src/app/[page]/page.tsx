import Prose from "@/components/prose";
import clsx from "clsx";
import { displayFace, Eyebrow } from "@/components/ui/section";
import { getPage } from "@/lib/shopify";
import { isPossibleHandle } from "@/lib/shopify/handle";
import { site } from "@/lib/site";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// On-demand ISR: nothing is built ahead, each handle renders on its first
// visit and is then served from the CDN, refreshed at most every 15 minutes
// (the Shopify fetch TTL). An empty list is what enables this - see
// "All paths at runtime" in Next's generateStaticParams docs.
export const revalidate = 900;
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page: handle } = await params;
  if (!isPossibleHandle(handle)) return notFound();
  const page = await getPage(handle);

  if (!page) return notFound();

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.bodySummary,
    openGraph: {
      publishedTime: page.createdAt,
      modifiedTime: page.updatedAt,
      type: "article",
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page: handle } = await params;
  if (!isPossibleHandle(handle)) return notFound();
  const page = await getPage(handle);

  if (!page) return notFound();

  return (
    <article className="shell max-w-3xl py-4">
      <Eyebrow align="left">{site.name}</Eyebrow>
      <h1 className={clsx(displayFace, "mt-4 text-display-xl")}>
        {page.title}
      </h1>
      <hr className="my-8 border-rule" />
      <Prose html={page.body as string} />
      <p className="eyebrow mt-14 border-t border-rule pt-6 text-muted">
        {`Last updated ${new Intl.DateTimeFormat(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        }).format(new Date(page.updatedAt))}`}
      </p>
    </article>
  );
}
