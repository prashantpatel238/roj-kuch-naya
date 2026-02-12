import Link from 'next/link';

const archiveDates = [
  '12 Feb 2026',
  '05 Feb 2026',
  '29 Jan 2026',
  '22 Jan 2026'
];

export default function ArchiveSection() {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Archive</h2>
        <p className="mt-2 text-sm text-slate-600">Browse previous quiz and current affairs updates.</p>

        <ul className="mt-6 divide-y divide-slate-200">
          {archiveDates.map((date) => (
            <li key={date} className="flex items-center justify-between py-3">
              <span className="text-sm font-medium text-slate-800">{date}</span>
              <Link
                href="/archive"
                className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
              >
                View
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
