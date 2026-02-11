import type { mongo } from 'mongoose';

export const POST_CATEGORIES = ['daily', 'trending', 'rochak'] as const;
export const POST_LANGUAGES = ['hi', 'en'] as const;
export const POST_STATUSES = ['draft', 'published'] as const;

export type PostCategory = (typeof POST_CATEGORIES)[number];
export type PostLanguage = (typeof POST_LANGUAGES)[number];
export type PostStatus = (typeof POST_STATUSES)[number];

export interface Post {
  title: string;
  slug: string;
  category: PostCategory;
  language: PostLanguage;
  content: string;
  metaTitle: string;
  metaDescription: string;
  imageUrl: string;
  status: PostStatus;
  createdAt: Date;
}

export type PostDocument = Post & { _id: mongo.ObjectId };

const POSTS_COLLECTION = 'posts';

export function getPostsCollection(db: mongo.Db): mongo.Collection<Post> {
  return db.collection<Post>(POSTS_COLLECTION);
}

export async function ensurePostIndexes(db: mongo.Db): Promise<string[]> {
  const collection = getPostsCollection(db);

  const indexResults = await collection.createIndexes([
    {
      key: { slug: 1 },
      name: 'idx_posts_slug_unique',
      unique: true
    },
    {
      key: { category: 1 },
      name: 'idx_posts_category'
    }
  ]);

  return indexResults;
}

export function isPostCategory(value: string): value is PostCategory {
  return (POST_CATEGORIES as readonly string[]).includes(value);
}

export function isPostLanguage(value: string): value is PostLanguage {
  return (POST_LANGUAGES as readonly string[]).includes(value);
}

export function isPostStatus(value: string): value is PostStatus {
  return (POST_STATUSES as readonly string[]).includes(value);
}

export type PostQuery = mongo.Filter<Post>;
