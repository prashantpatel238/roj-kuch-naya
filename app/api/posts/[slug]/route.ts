import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { getDatabase } from '@/lib/db/mongodb';
import { getPostsCollection, isPostLanguage } from '@/lib/models/post';
import type { PostLanguage } from '@/lib/models/post';

interface RouteContext {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return [];
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const slug = decodeURIComponent(params.slug || '').trim();
    const languageParam = request.nextUrl.searchParams.get('language');

    if (!slug) {
      return NextResponse.json({ message: 'Slug is required.' }, { status: 400 });
    }

    if (languageParam && !isPostLanguage(languageParam)) {
      return NextResponse.json({ message: 'Invalid language.' }, { status: 400 });
    }

    const language: PostLanguage | undefined = languageParam
      ? (languageParam as PostLanguage)
      : undefined;

    const db = await getDatabase();
    const collection = getPostsCollection(db);

    const filter = {
      slug,
      ...(language ? { language } : {}),
      status: 'published' as const
    };

    const post = await collection.findOne(filter);

    if (!post) {
      return NextResponse.json({ message: 'Post not found.' }, { status: 404 });
    }

    return NextResponse.json({
      post: {
        _id: String(post._id),
        title: post.title,
        slug: post.slug,
        category: post.category,
        language: post.language,
        content: post.content,
        metaTitle: post.metaTitle,
        metaDescription: post.metaDescription,
        imageUrl: post.imageUrl,
        createdAt: post.createdAt
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Failed to fetch post.'
      },
      { status: 500 }
    );
  }
}
