import Link from 'next/link';

const quizCards = [
  {
    title: 'Daily Quiz – 15 Questions',
    description: 'Sharpen your concepts every day with a quick 15-question practice set.',
    href: '/daily-quiz',
    buttonLabel: 'Start Daily Quiz'
  },
  {
    title: 'Weekly Quiz – 30 Questions',
    description: 'Test your weekly progress with a longer 30-question challenge round.',
    href: '/weekly-quiz',
    buttonLabel: 'Start Weekly Quiz'
  }
];

export default function QuizCTAs() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-6 md:grid-cols-2">
        {quizCards.map((card) => (
          <article
            key={card.title}
            className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div>
              <h3 className="text-xl font-bold text-slate-900">{card.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{card.description}</p>
            </div>

            <Link
              href={card.href}
              className="mt-6 inline-flex w-fit items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {card.buttonLabel}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
