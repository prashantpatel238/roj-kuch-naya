import type { Metadata } from 'next';
import { PostLanguage } from '@/lib/models/post';

export interface SeoPostInput {
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  imageUrl: string;
  createdAt: string;
}

export function buildPostMetadata(post: SeoPostInput, lang: PostLanguage): Metadata {
  const canonicalPath = `/${lang}/post/${post.slug}`;
  const alternateLang = lang === 'en' ? 'hi' : 'en';

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription,
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: `/en/post/${post.slug}`,
        hi: `/hi/post/${post.slug}`
      }
    },
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription,
      type: 'article',
      url: canonicalPath,
      siteName: 'roz-kuch-naya',
      locale: toOgLocale(lang),
      alternateLocale: [toOgLocale(alternateLang)],
      images: [
        {
          url: post.imageUrl,
          alt: post.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle || post.title,
      description: post.metaDescription,
      images: [post.imageUrl]
    }
  };
}

export function buildPostJsonLd(post: SeoPostInput, lang: PostLanguage) {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/${lang}/post/${post.slug}`;
  const publishedDate = toIsoDate(post.createdAt);

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.metaTitle || post.title,
    description: post.metaDescription,
    image: [post.imageUrl],
    datePublished: publishedDate,
    dateModified: publishedDate,
    inLanguage: lang,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    },
    publisher: {
      '@type': 'Organization',
      name: 'roz-kuch-naya'
    }
  };
}

export function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'http://localhost:3000').replace(
    /\/$/,
    ''
  );
}

function toOgLocale(lang: PostLanguage) {
  return lang === 'hi' ? 'hi_IN' : 'en_IN';
}

function toIsoDate(input: string) {
  const date = new Date(input);

  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString();
  }

  return date.toISOString();
}
