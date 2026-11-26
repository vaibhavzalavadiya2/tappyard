import { SITE_NAME, SITE_URL } from '@/data/homeFaqs';

export interface BreadcrumbItemInput {
  name: string;
  url: string;
}

export interface FaqItemInput {
  question: string;
  answer: string;
}

export interface VideoGameSchemaInput {
  name: string;
  description: string;
  url: string;
  genre: string | string[];
  image?: string;
  datePublished?: string;
  inLanguage?: string;
}

export interface ArticleSchemaInput {
  headline: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  dateModified: string;
}

export function buildWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description:
      'Free instant browser games online — arcade runners, number puzzles, spatial grids, and reflex challenges with zero downloads.',
  };
}

export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icons/icon-512.png`,
  };
}

export function buildVideoGameJsonLd(input: VideoGameSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: input.name,
    description: input.description,
    url: input.url,
    ...(input.image ? { image: input.image } : {}),
    genre: input.genre,
    gamePlatform: 'Web browser',
    applicationCategory: 'Game',
    operatingSystem: 'Any',
    inLanguage: input.inLanguage ?? 'en',
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function buildFaqJsonLd(faqs: FaqItemInput[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItemInput[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildArticleJsonLd(input: ArticleSchemaInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.headline,
    description: input.description,
    url: input.url,
    image: input.image,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    mainEntityOfPage: input.url,
    inLanguage: 'en',
    author: {
      '@type': 'Organization',
      name: `${SITE_NAME} Editorial Team`,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icons/icon-512.png`,
      },
    },
  };
}
