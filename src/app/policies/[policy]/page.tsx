import Prose from "@/components/prose";
import clsx from "clsx";
import { displayFace, Eyebrow } from "@/components/ui/section";
import { getShopPolicy } from "@/lib/shopify";
import { isPossibleHandle } from "@/lib/shopify/handle";
import { site } from "@/lib/site";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// On-demand ISR - see the note in `app/[page]/page.tsx`.
export const revalidate = 900;
export function generateStaticParams() {
  return [];
}

/**
 * A Shopify shop policy, at the path Shopify itself uses for it, so a menu
 * item of type SHOP_POLICY (`/policies/privacy-policy`) lands here unchanged.
 *
 * Policies live on `shop`, not among the store's pages, which is why the
 * footer's privacy link used to 404 through `[page]`. Only the policies the
 * merchant has written resolve; any other handle is a 404.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ policy: string }>;
}): Promise<Metadata> {
  const { policy: handle } = await params;
  if (!isPossibleHandle(handle)) notFound();
  const policy = await getShopPolicy(handle);

  if (!policy) return notFound();

  return { title: policy.title };
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ policy: string }>;
}) {
  const { policy: handle } = await params;
  if (!isPossibleHandle(handle)) notFound();
  const policy = await getShopPolicy(handle);

  if (!policy) return notFound();

  return (
    <article className="shell max-w-3xl py-4">
      <Eyebrow align="left">{site.name}</Eyebrow>
      <h1 className={clsx(displayFace, "mt-4 text-display-xl")}>
        {policy.title}
      </h1>
      <hr className="my-8 border-rule" />
      <Prose html={policy.body ?? ""} />
    </article>
  );
}
