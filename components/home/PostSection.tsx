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
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

const PAGE_SIZE = 6;

export function PostSection({ title, category, language }: PostSectionProps) {
  const [items, setItems] = useState<HomePost[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeLanguageFilter, setActiveLanguageFilter] = useState<PostLanguage | null>(language);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadPosts({ reset: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, language]);

  async function requestPosts(pageToLoad: number, languageFilter?: PostLanguage) {
    const query = new URLSearchParams({
      category,
      limit: String(PAGE_SIZE),
      page: String(pageToLoad)
    });

    if (languageFilter) {
      query.set('language', languageFilter);
    }

    const response = await fetch(`/api/posts?${query.toString()}`, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error('Unable to load posts.');
    }

    return (await response.json()) as PostsResponse;
  }

  async function loadPosts({ reset = false }: { reset?: boolean } = {}) {
    setLoading(true);
    setError(null);

    const nextPage = reset ? 1 : page;

    try {
      if (reset) {
        const filteredData = await requestPosts(nextPage, language);

        if (filteredData.items.length > 0) {
          setItems(filteredData.items);
          setHasMore(filteredData.pagination.hasMore);
          setPage(nextPage + 1);
          setActiveLanguageFilter(language);
          return;
        }

        const fallbackData = await requestPosts(nextPage);
        setItems(fallbackData.items);
        setHasMore(fallbackData.pagination.hasMore);
        setPage(nextPage + 1);
        setActiveLanguageFilter(null);
        return;
      }

      const data = await requestPosts(nextPage, activeLanguageFilter ?? undefined);
      setItems((prev) => [...prev, ...data.items]);
      setPage(nextPage + 1);
      setHasMore(data.pagination.hasMore);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : 'Unknown error';
      setError(message);
      if (reset) {
        setItems([]);
        setHasMore(true);
        setPage(1);
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
        <p className="rounded-lg border border-amber-700/50 bg-amber-900/20 p-4 text-sm text-amber-200">
          No published posts found yet. Please add/generate posts in MongoDB and verify Vercel env vars
          <code className="mx-1 rounded bg-slate-900 px-1 py-0.5 text-xs text-amber-100">MONGODB_URI</code>
          and
          <code className="mx-1 rounded bg-slate-900 px-1 py-0.5 text-xs text-amber-100">MONGODB_DB</code>
          are set.
        </p>
      ) : null}

      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => void loadPosts()}
          disabled={loading || !hasMore}
          className="w-full rounded-xl border border-emerald-500/40 px-5 py-3 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:rounded-full sm:py-2"
        >
          {loading ? 'Loading...' : hasMore ? 'Load More' : 'No more posts'}
        </button>
      </div>
    </section>
  );
}
