'use client';

import React from 'react';
import { formatDate } from '@/utilities/dateFormat';

type CurrentAffairsItem = {
  _id?: string;
  title?: string;
  summary?: string;
  date?: string | Date | null;
};

type CurrentAffairsResponse = {
  items?: CurrentAffairsItem[];
};

export default function CurrentAffairsPreview() {
  const [items, setItems] = React.useState([] as CurrentAffairsItem[]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null as string | null);

  React.useEffect(() => {
    const fetchCurrentAffairs = async () => {
      try {
        const response = await fetch('/api/currentAffairs');

        if (!response.ok) {
          throw new Error('Unable to load current affairs updates right now.');
        }

        const data = (await response.json()) as CurrentAffairsResponse;
        setItems(Array.isArray(data?.items) ? data.items : []);
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : 'Failed to fetch current affairs updates.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchCurrentAffairs();
  }, []);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Current Affairs Preview</h2>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          Stay updated with concise, exam-focused highlights from major national and international events.
        </p>
      </div>

      {isLoading ? (
        <p className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
          Loading...
        </p>
      ) : error ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700 shadow-sm">
          {error}
        </p>
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-sm">
          No current affairs found
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item: CurrentAffairsItem, index: number) => (
            <article
              key={item._id ?? `current-affairs-${index}`}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
                {formatDate(item.date ?? '')}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">{item.title ?? 'Untitled update'}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {item.summary ?? 'Summary unavailable for this current affairs item.'}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
