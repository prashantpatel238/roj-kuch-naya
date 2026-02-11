'use client';

import { useEffect, useState } from 'react';
import { PostCategory, PostLanguage } from '@/lib/models/post';
import { HomePost, PostCard } from '@/components/home/PostCard';

interface PostSectionProps {
  title: string;
  category: PostCategory;
  language: PostLanguage;
}

interface PostsResponse {
  items: HomePost[];
  pagination: {
    total: number;
    offset: number;
    limit: number;
    hasMore: boolean;
  };
}

const PAGE_SIZE = 6;

export function PostSection({ title, category, language }: PostSectionProps) {
  const [items, setItems] = useState<HomePost[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadPosts({ reset: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, language]);

  async function loadPosts({ reset = false }: { reset?: boolean } = {}) {
    setLoading(true);
    setError(null);

    const nextOffset = reset ? 0 : offset;

    try {
      const query = new URLSearchParams({
        category,
        language,
        limit: String(PAGE_SIZE),
        offset: String(nextOffset)
      });

      const response = await fetch(`/api/posts?${query.toString()}`);

      if (!response.ok) {
        throw new Error('Unable to load posts.');
      }

      const data = (await response.json()) as PostsResponse;

      setItems((prev) => (reset ? data.items : [...prev, ...data.items]));
      setOffset(nextOffset + data.items.length);
      setHasMore(data.pagination.hasMore);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Unknown error';
      setError(message);
      if (reset) {
        setItems([]);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight text-white">{title}</h2>
        <span className="text-sm text-slate-400">{items.length} loaded</span>
      </div>

      {error ? (
        <p className="rounded-lg border border-rose-700 bg-rose-900/30 p-4 text-sm text-rose-300">{error}</p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>

      {!loading && items.length === 0 && !error ? (
        <p className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-400">
          No posts available right now.
        </p>
      ) : null}

      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => void loadPosts()}
          disabled={loading || !hasMore}
          className="rounded-full border border-emerald-500/40 px-5 py-2 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Loading...' : hasMore ? 'Load More' : 'No more posts'}
        </button>
      </div>
    </section>
  );
}
