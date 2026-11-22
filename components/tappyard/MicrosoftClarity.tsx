import Script from 'next/script';

interface MicrosoftClarityProps {
  /**
   * Microsoft Clarity Project ID.
   * Defaults to NEXT_PUBLIC_CLARITY_PROJECT_ID environment variable or 'zfpf7cf0vv'.
   */
  projectId?: string;
}

/**
 * Microsoft Clarity Analytics Component for Next.js App Router
 *
 * Uses next/script with strategy="afterInteractive" to ensure
 * zero impact on initial page load, First Contentful Paint (FCP),
 * and Core Web Vitals, while automatically tracking user sessions,
 * heatmaps, scroll depth, and client-side navigation.
 */
export default function MicrosoftClarity({
  projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || 'zfpf7cf0vv',
}: MicrosoftClarityProps) {
  if (!projectId) return null;

  return (
    <Script
      id="microsoft-clarity"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${projectId}");
        `,
      }}
    />
  );
}
