import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import "lenis/dist/lenis.css";
import { Navbar } from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import NewsletterBand from "@/components/layout/newsletter-band";
import { CartProvider } from "@/components/cart/cart-context";
import CartBar from "@/components/cart/cart-bar";
import SmoothScrollProvider from "@/components/providers/smooth-scroll-provider";
import MotionProvider from "@/components/motion/motion-provider";
import LoadingScreen from "@/components/motion/loading-screen";
import RouteProgress from "@/components/motion/route-progress";
import NewsletterPopup from "@/components/newsletter/newsletter-popup";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/next";
import { site } from "@/lib/site";
import { SITE_URL } from "@/lib/site-url";

/**
 * Franxurter - the display face, self-hosted so it never flashes or shifts.
 *
 * It ships in ONE weight, so it is declared at 400 and must never be given a
 * bold utility: asking for 700 makes the browser synthesise it, and a faked
 * bold on a display face at hero scale is immediately visible. Weight in this
 * system comes from the face you choose, not from a number.
 *
 * All three faces ship as subset WOFF2 (402 KB of TTF became 127 KB): the
 * Vietnamese block was dropped; every OpenType feature, the `wght` axis and
 * the hinting were kept. The TTFs stay beside them ONLY for the social card -
 * `next/og` rasterises through satori, which cannot parse WOFF2. Re-cut from
 * the TTFs with `pyftsubset --flavor=woff2 --layout-features='*'` if a face
 * is ever replaced.
 */
const franxurter = localFont({
  src: "../../public/font/Franxurter.woff2",
  variable: "--font-franxurter",
  weight: "400",
  style: "normal",
  display: "swap",
  fallback: ["Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
});

const jakarta = localFont({
  src: [
    {
      path: "../../public/font/PlusJakartaSans-Variable.woff2",
      weight: "200 800",
      style: "normal",
    },
    {
      path: "../../public/font/PlusJakartaSans-Italic-Variable.woff2",
      weight: "200 800",
      style: "italic",
    },
  ],
  variable: "--font-jakarta",
  display: "swap",
  fallback: ["Inter", "system-ui", "sans-serif"],
});

const baseUrl = SITE_URL;

const logoUrl = new URL("/logo/kozy-logo-web.png", baseUrl).toString();

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: baseUrl,
  logo: {
    "@type": "ImageObject",
    url: logoUrl,
    width: 720,
    height: 405,
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${site.name} - ${site.tagline}`,
    template: `%s - ${site.name}`,
  },
  description: site.description,
  // The puffed K (Shopify file IMG_6217.png), trimmed to the letter and
  // squared in `public/favicon/`. The wide wordmark used to stand in here and
  // shrank to an unreadable smudge at 16px. Transparent for the tab, so it
  // sits on either browser theme; the touch icon is on cream because iOS
  // paints transparency black.
  icons: {
    icon: [
      { url: "/favicon/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: ["/favicon/icon-32.png"],
    apple: [
      { url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} - ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    creator: process.env.TWITTER_CREATOR,
    site: process.env.TWITTER_SITE,
  },
};

/**
 * ⚠️ Nothing in this layout - or in anything it renders on every page (Navbar,
 * Footer, NewsletterBand) - may read `cookies()`, `headers()` or make a
 * `no-store` fetch. Any one of them makes EVERY route dynamic: no page is
 * cached at the CDN and each view is a function render. That is how the
 * Hobby plan's Fast Origin Transfer went in two days (Nov 2026). The cart and
 * the account link used to read cookies here; the cart is now read by the
 * browser and the account link always goes to `/account`. Check `next
 * build`: content routes should not be `ƒ`.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${franxurter.variable} ${jakarta.variable}`}>
      <head>
        {/* STAYS a raw <script>. `next/script` does not emit a real script
            element into the server HTML - it pushes the content into a
            `self.__next_s` array for its own runtime to inject on the client -
            and structured data that only exists after JavaScript runs is
            structured data a crawler may never read. This one is data, not
            code, so it has nothing to execute and nothing to gain. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {/* The two bootstrap scripts go through `next/script` rather than a
            bare <script> element.

            A raw <script> in a component tree only ever executes from the
            server-rendered HTML - React does not run one it renders on the
            client - and React 19 now warns about exactly that ("Encountered a
            script tag while rendering React component"). `beforeInteractive`
            hands them to Next's own script pipeline, which injects them into
            the initial document ahead of hydration: the same moment they ran
            before, minus the warning. Each needs a stable `id` so Next can
            dedupe it across navigations.

            This applies to the two EXECUTABLE scripts only. The JSON-LD
            above stays a raw tag - see the note on it. */}

        {/* The failure catch for the motion layer. Reveal targets - and the
            words of every split headline - are hidden by CSS; if the layer
            has not reported in within two seconds, this forces them all
            visible again. It touches no attribute on <html>,
            because React reconciles those and a script-added class there is a
            hydration mismatch. */}
        <Script id="kozy-motion-watchdog" strategy="beforeInteractive">
          {`(function(){try{setTimeout(function(){if(window.__motionReady)return;var s=document.createElement('style');s.textContent='[data-reveal],[data-reveal-client],[data-split] .split-word,[data-split] .split-unit{opacity:1!important;transform:none!important}[data-split] .split-mask{clip-path:none!important}';document.head.appendChild(s)},2000)}catch(e){}})()`}
        </Script>

        {/* Sync mobile viewport state into a cookie so server components can
            strictly paginate 10 items for mobile views and 24 items for desktop views.

            The reload it triggers is guarded twice (Nov 2026). It used to
            reload whenever the cookie disagreed with the viewport - and a
            client that cannot keep cookies (blocked, or a headless renderer
            with a narrow window and a desktop UA) never agrees, so it
            reloaded forever: a full page and every asset, per loop.
            1. The cookie is read back after writing; if it did not stick,
               reloading cannot help, so it does not.
            2. At most 3 reloads per tab session (sessionStorage), so even a
               window dragged back and forth across 768px cannot loop. */}
        <Script id="kozy-viewport-cookie" strategy="beforeInteractive">
          {`(function(){try{var R='kozy:vp-reloads';function read(){var x=document.cookie.match(/(?:^|; )kozy_is_mobile=([^;]*)/);return x?x[1]:null}function check(){var m=window.innerWidth<768?'1':'0';var current=read();if(current===m)return;document.cookie='kozy_is_mobile='+m+'; path=/; max-age=31536000; SameSite=Lax';if(read()!==m)return;var isMobileUA=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(navigator.userAgent);if(!(current!==null||(m==='1'&&!isMobileUA)))return;var n=0;try{n=Number(sessionStorage.getItem(R))||0;if(n>=3)return;sessionStorage.setItem(R,String(n+1))}catch(e){return}window.location.reload()}check();window.addEventListener('resize',function(){clearTimeout(window.__kzResize);window.__kzResize=setTimeout(check,250)})}catch(e){}})()`}
        </Script>
      </head>
      <body className="flex min-h-screen flex-col bg-paper text-ink antialiased">
        {/* First child of <body> and outside every provider: the curtain has
            no dependencies, so nothing about it waits on cart data, on the
            scroll layer, or on a Suspense boundary resolving. */}
        <LoadingScreen />
        {/* Suspense because it reads the query string, which would otherwise
            opt every statically rendered route into client rendering. */}
        <Suspense fallback={null}>
          <RouteProgress />
        </Suspense>
        <SmoothScrollProvider>
          <MotionProvider />
          <CartProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <NewsletterBand />
            <Footer />
            {/* After the footer so its spacer extends the end of the page,
                which is what lets the last of the content clear the bar. */}
            <CartBar />
            {/* Outside <main> and last in the tree: it is an overlay, not
                content, and nothing in the page should reflow around it. */}
            <NewsletterPopup />
          </CartProvider>
        </SmoothScrollProvider>
        {/* Client-only beacon to /_vercel/insights; it reads the route on
            the client (inside its own Suspense), so it does not make any
            static route dynamic - see §17 in CLAUDE.md. */}
        <Analytics />
      </body>
    </html>
  );
}
