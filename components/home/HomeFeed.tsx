'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PostLanguage } from '@/lib/models/post';
import { LanguageToggle } from '@/components/home/LanguageToggle';
import { PostSection } from '@/components/home/PostSection';

const SECTION_CONFIG = [
  { title: 'Daily News', category: 'daily' as const },
  { title: 'Trending', category: 'trending' as const },
  { title: 'Rochak Jaankari', category: 'rochak' as const }
];

export function HomeFeed() {
  const [language, setLanguage] = useState<PostLanguage>('en');

  return (
    <div className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 sm:px-6 md:py-10 lg:px-8">
      <header className="sticky top-3 z-10 mb-8 rounded-2xl border border-slate-800 bg-slate-950/85 p-4 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Roz Kuch Naya</p>
            <h1 className="text-2xl font-bold text-white md:text-3xl">Delhi Information Hub</h1>
          </div>
          <LanguageToggle value={language} onChange={setLanguage} />
        </div>
      </header>

      <nav className="mb-8 flex flex-wrap gap-3 text-sm">
        <Link href="/about" className="rounded-full border border-slate-700 px-3 py-1 text-slate-300 hover:border-emerald-400 hover:text-emerald-300">
          About
        </Link>
        <Link href="/privacy-policy" className="rounded-full border border-slate-700 px-3 py-1 text-slate-300 hover:border-emerald-400 hover:text-emerald-300">
          Privacy Policy
        </Link>
        <Link href="/disclaimer" className="rounded-full border border-slate-700 px-3 py-1 text-slate-300 hover:border-emerald-400 hover:text-emerald-300">
          Disclaimer
        </Link>
        <Link href="/contact" className="rounded-full border border-slate-700 px-3 py-1 text-slate-300 hover:border-emerald-400 hover:text-emerald-300">
          Contact
        </Link>
      </nav>

      <main className="space-y-10">
        {SECTION_CONFIG.map((section) => (
          <PostSection
            key={section.category}
            title={section.title}
            category={section.category}
            language={language}
          />
        ))}
      </main>

      <footer className="mt-12 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} roz-kuch-naya. Informational content in Hindi and English.
      </footer>
    </div>
  );
}
