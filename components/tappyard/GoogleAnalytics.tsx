import Script from 'next/script';

interface GoogleAnalyticsProps {
  gaId: string;
}

/**
 * Google Analytics component using next/script with strategy="lazyOnload"
 * to eliminate Total Blocking Time (TBT) and maintain 100% Core Web Vitals.
 */
export default function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  if (!gaId) return null;

  return (
    <>
      <Script
        id="google-analytics-tag"
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics-init"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
