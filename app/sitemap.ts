import type { MetadataRoute } from 'next';
import { getDatabase } from '@/lib/db/mongodb';
import { getPostsCollection } from '@/lib/models/post';

const DEFAULT_SITE_URL = 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5
    }
  ];

  try {
    const db = await getDatabase();
    const collection = getPostsCollection(db);

    const posts = await collection
      .find(
        { status: 'published' },
        {
          projection: {
            slug: 1,
            createdAt: 1
          }
        }
      )
      .sort({ createdAt: -1 })
      .toArray();

    const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/en/post/${post.slug}`,
      lastModified: post.createdAt ? new Date(post.createdAt) : new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en/post/${post.slug}`,
          hi: `${baseUrl}/hi/post/${post.slug}`
        }
      }
    }));

    return [...staticEntries, ...postEntries];
  } catch {
    return staticEntries;
  }
}

function getBaseUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || DEFAULT_SITE_URL).replace(
    /\/$/,
    ''
  );
}
