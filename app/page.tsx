import type { Metadata } from 'next';
import HomeClient from '@/components/tappyard/HomeClient';
import { HOME_FAQS, SITE_URL } from '@/data/homeFaqs';
import {
  buildFaqJsonLd,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from '@/lib/structuredData';

export const metadata: Metadata = {
  title: {
    absolute: 'Free Games to Play Online - No Download | TAPPYARD',
  },
  description:
    'Free games to play online in your browser. Play 3D runners, 2048 puzzles, Cupcake 2048, block zen, 1-tap reflex, and sorting games. No download.',
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: 'Free Games to Play Online - No Download | TAPPYARD',
    description:
      'Free games to play online in your browser. Play 3D runners, 2048 puzzles, Cupcake 2048, block zen, 1-tap reflex, and sorting games. No download.',
    url: SITE_URL,
    type: 'website',
    images: [
      {
        url: '/og/tappyard-og.png',
        width: 1200,
        height: 630,
        alt: 'TAPPYARD - Free Online Browser Games',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Games to Play Online - No Download | TAPPYARD',
    description:
      'Free games to play online in your browser. Play 3D runners, 2048 puzzles, Cupcake 2048, block zen, 1-tap reflex, and sorting games. No download.',
    images: ['/og/tappyard-og.png'],
  },
};

export default function TappyardHome() {
  const websiteJsonLd = buildWebSiteJsonLd();
  const organizationJsonLd = buildOrganizationJsonLd();
  const faqJsonLd = buildFaqJsonLd(HOME_FAQS);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HomeClient />
    </>
  );
}
