const CURRENT_AFFAIRS_PLACEHOLDERS = [
  {
    title: 'Policy Update: National Education Push',
    description:
      'A quick snapshot of today’s major policy move and why it matters for competitive exam preparation.'
  },
  {
    title: 'Economy Brief: Inflation & Market Signals',
    description:
      'Placeholder summary covering the key economic indicators, trends, and expected impact on daily headlines.'
  },
  {
    title: 'Global Watch: Regional Security Developments',
    description:
      'Short digest for international current affairs with important facts you can revise in under two minutes.'
  }
];

export default function CurrentAffairsPreview() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Current Affairs Preview</h2>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          Stay updated with concise, exam-focused highlights from major national and international events.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CURRENT_AFFAIRS_PLACEHOLDERS.map((item) => (
          <article
            key={item.title}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
