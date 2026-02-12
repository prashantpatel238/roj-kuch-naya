import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50 px-6 py-16 text-center shadow-sm sm:px-10 sm:py-20">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-violet-200/40 blur-3xl" />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center">
        <p className="mb-4 inline-flex rounded-full bg-indigo-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700">
          MeritMantra
        </p>

        <h1 className="max-w-4xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
          MeritMantra – Practice Smart, Rank Higher
        </h1>

        <p className="mt-5 max-w-2xl text-base text-slate-600 sm:text-lg">
          Daily practice quizzes, current affairs drills, and focused revisions designed to keep your prep consistent and exam-ready.
        </p>

        <Link
          href="/quiz"
          className="mt-10 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Start Today&apos;s Quiz
        </Link>
      </div>
    </section>
  );
}
