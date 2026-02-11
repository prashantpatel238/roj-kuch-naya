import Link from 'next/link';

export interface HomePost {
  _id: string;
  title: string;
  slug: string;
  metaDescription: string;
  imageUrl: string;
  createdAt: string;
  language: 'hi' | 'en';
}

interface PostCardProps {
  post: HomePost;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/70 shadow-sm">
      <div className="h-40 w-full bg-slate-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.imageUrl} alt={post.title} className="h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="space-y-3 p-4">
        <p className="text-xs text-slate-400">{formatDate(post.createdAt)}</p>
        <h3 className="text-lg font-semibold text-white">{post.title}</h3>
        <p className="text-sm text-slate-300">{post.metaDescription}</p>
        <Link href={`/${post.language}/post/${post.slug}`} className="text-sm font-medium text-emerald-300 hover:text-emerald-200">
          Read more →
        </Link>
      </div>
    </article>
  );
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
