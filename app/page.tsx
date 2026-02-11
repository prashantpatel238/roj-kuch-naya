import Link from 'next/link';
import { StatusCard } from '@/components/ui/StatusCard';

const checks = [
  {
    title: 'Runtime',
    value: 'Next.js 14 + TypeScript',
    description: 'App Router enabled with strict TypeScript and production defaults.'
  },
  {
    title: 'Styling',
    value: 'Tailwind CSS',
    description: 'Utility-first styling wired via global CSS + Tailwind config.'
  },
  {
    title: 'Database',
    value: 'MongoDB Ready',
    description: 'Reusable Mongo client in lib/db with server-side env validation.'
  }
];

export default function HomePage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl p-8 md:p-12">
      <header className="space-y-4">
        <p className="inline-flex rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-300">
          Production-ready starter
        </p>
        <h1 className="text-3xl font-bold tracking-tight md:text-5xl">roz-kuch-naya</h1>
        <p className="max-w-2xl text-slate-300">
          This project ships with App Router, API routes, Tailwind CSS, ESLint + Prettier, and
          MongoDB integration baked in.
        </p>
      </header>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {checks.map((item) => (
          <StatusCard key={item.title} {...item} />
        ))}
      </section>

      <section className="mt-10 rounded-lg border border-slate-800 bg-slate-900/60 p-5 text-sm text-slate-300">
        <p>
          API check:{' '}
          <Link href="/api/health" className="font-medium text-emerald-300 underline">
            /api/health
          </Link>{' '}
          and{' '}
          <Link href="/api/status" className="font-medium text-emerald-300 underline">
            /api/status
          </Link>
        </p>
      </section>
    </main>
  );
}
