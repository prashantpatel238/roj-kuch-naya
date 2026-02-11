import Link from 'next/link';

interface SeoPageLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function SeoPageLayout({ title, description, children }: SeoPageLayoutProps) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <nav className="mb-4 text-sm text-slate-400">
          <Link href="/" className="hover:text-emerald-300">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span>{title}</span>
        </nav>
        <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-slate-300">{description}</p>
      </header>

      <article className="prose prose-invert max-w-none rounded-2xl border border-slate-800 bg-slate-900/40 p-6 prose-headings:text-white prose-p:text-slate-300 prose-li:text-slate-300">
        {children}
      </article>
    </main>
  );
}
