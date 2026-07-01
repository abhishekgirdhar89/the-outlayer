import Script from "next/script";

/**
 * Google Analytics (GA4). Renders nothing when no measurement ID is configured,
 * so analytics is fully controlled from the admin (SEO / Meta → Analytics).
 */
export function GoogleAnalytics({ measurementId }: { measurementId?: string }) {
  const id = (measurementId || "").trim();
  if (!id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}');
        `}
      </Script>
    </>
  );
}
