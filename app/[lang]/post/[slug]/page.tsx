import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { fetchPostBySlugFromApi } from '@/lib/api/posts';
import { PostLanguage } from '@/lib/models/post';

interface LocalizedPostPageProps {
  params: {
    lang: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: LocalizedPostPageProps): Promise<Metadata> {
  const lang = getLanguage(params.lang);

  if (!lang) {
    return {
      title: 'Post Not Found | roz-kuch-naya',
      description: 'The requested article could not be found.'
    };
  }

  const data = await fetchPostBySlugFromApi(params.slug, lang);

  if (!data) {
    return {
      title: 'Post Not Found | roz-kuch-naya',
      description: 'The requested article could not be found.'
    };
  }

  return {
    title: data.post.metaTitle || data.post.title,
    description: data.post.metaDescription,
    openGraph: {
      title: data.post.metaTitle || data.post.title,
      description: data.post.metaDescription,
      images: [{ url: data.post.imageUrl }]
    },
    alternates: {
      canonical: `/${lang}/post/${data.post.slug}`
    }
  };
}

export default async function LocalizedPostPage({ params }: LocalizedPostPageProps) {
  const lang = getLanguage(params.lang);

  if (!lang) {
    notFound();
  }

  const data = await fetchPostBySlugFromApi(params.slug, lang);

  if (!data) {
    notFound();
  }

  const post = data.post;

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <Link href="/" className="text-sm text-slate-300 hover:text-emerald-300">
          ← Back to homepage
        </Link>

        <div className="inline-flex rounded-full border border-slate-700 bg-slate-900 p-1 text-sm">
          <Link href={`/en/post/${post.slug}`} className={toggleClass(lang === 'en')}>
            English
          </Link>
          <Link href={`/hi/post/${post.slug}`} className={toggleClass(lang === 'hi')}>
            हिन्दी
          </Link>
        </div>
      </nav>

      <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-emerald-300">{post.category}</p>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{post.title}</h1>
        <p className="mt-3 text-sm text-slate-400">{formatDate(post.createdAt)}</p>

        <div className="my-6 h-56 overflow-hidden rounded-xl bg-slate-800 sm:h-72">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.imageUrl} alt={post.title} className="h-full w-full object-cover" />
        </div>

        <div className="prose prose-invert max-w-none whitespace-pre-wrap break-words text-slate-200">
          {post.content}
        </div>
      </article>
    </main>
  );
}

function getLanguage(value: string): PostLanguage | null {
  if (value === 'en' || value === 'hi') {
    return value;
  }

  return null;
}

function toggleClass(active: boolean) {
  return [
    'rounded-full px-3 py-1.5 transition',
    active
      ? 'bg-emerald-500 font-semibold text-slate-950'
      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
  ].join(' ');
}

function formatDate(input: string) {
  const date = new Date(input);

  if (Number.isNaN(date.getTime())) {
    return 'Recently published';
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}
