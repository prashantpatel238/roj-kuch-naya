import Link from 'next/link';
import ArchiveSection from '@/components/ArchiveSection';
import CurrentAffairsPreview from '@/components/CurrentAffairsPreview';
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import QuizCTAs from '@/components/QuizCTAs';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/40 to-slate-100">
      <Navbar />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-6 sm:py-8 lg:gap-10 lg:px-8 lg:py-10">
        <Hero />

        <section className="rounded-2xl border border-indigo-100 bg-white/90 p-6 text-center shadow-sm sm:p-8">
          <p className="mb-3 text-sm text-slate-600">Ready to test yourself?</p>
          <Link
            href="/quiz"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Start Daily Quiz
          </Link>
        </section>

        <CurrentAffairsPreview />
        <QuizCTAs />
        <ArchiveSection />
      </main>
    </div>
  );
}
