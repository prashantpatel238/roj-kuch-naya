'use client';

import { PostLanguage } from '@/lib/models/post';

interface LanguageToggleProps {
  value: PostLanguage;
  onChange: (next: PostLanguage) => void;
}

export function LanguageToggle({ value, onChange }: LanguageToggleProps) {
  return (
    <div className="inline-flex rounded-full border border-slate-700 bg-slate-900 p-1">
      <button
        type="button"
        onClick={() => onChange('en')}
        className={buttonClasses(value === 'en')}
        aria-pressed={value === 'en'}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => onChange('hi')}
        className={buttonClasses(value === 'hi')}
        aria-pressed={value === 'hi'}
      >
        हिन्दी
      </button>
    </div>
  );
}

function buttonClasses(active: boolean) {
  return [
    'rounded-full px-3 py-1.5 text-sm transition',
    active
      ? 'bg-emerald-500 text-slate-950 font-semibold'
      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
  ].join(' ');
}
