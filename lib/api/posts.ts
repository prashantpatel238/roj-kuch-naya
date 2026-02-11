import { headers } from 'next/headers';
import { PostLanguage } from '@/lib/models/post';

export interface FullPostResponse {
  post: {
    _id: string;
    title: string;
    slug: string;
    category: string;
    language: PostLanguage;
    content: string;
    metaTitle: string;
    metaDescription: string;
    imageUrl: string;
    createdAt: string;
  };
}

export async function fetchPostBySlugFromApi(slug: string, language?: string) {
  const baseUrl = resolveBaseUrl();
  const query = new URLSearchParams();

  if (language) {
    query.set('language', language);
  }

  const suffix = query.toString() ? `?${query.toString()}` : '';
  const response = await fetch(`${baseUrl}/api/posts/${encodeURIComponent(slug)}${suffix}`, {
    next: { revalidate: 120, tags: [`post:${slug}`] }
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as FullPostResponse;
}

function resolveBaseUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL;

  if (configured) {
    return configured.replace(/\/$/, '');
  }

  const headerStore = headers();
  const host = headerStore.get('x-forwarded-host') ?? headerStore.get('host') ?? 'localhost:3000';
  const protocol = headerStore.get('x-forwarded-proto') ?? 'http';

  return `${protocol}://${host}`;
}
