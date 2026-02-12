'use client';

import Link from 'next/link';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/current-affairs', label: 'Current Affairs' },
  { href: '/quiz', label: 'Daily Quiz' },
  { href: '/quiz', label: 'Weekly Quiz' },
  { href: '/archive', label: 'Archive' }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-30 w-full border-b border-indigo-100/70 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-indigo-700">
          MeritMantra
        </Link>

        <button
          type="button"
          className="inline-flex items-center rounded-md p-2 text-gray-700 transition hover:bg-indigo-50 md:hidden"
          onClick={() => setIsOpen((prev: boolean) => !prev)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
        >
          <span className="text-2xl leading-none">☰</span>
        </button>

        <div className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-indigo-50 hover:text-indigo-700"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {isOpen && (
        <div className="space-y-1 border-t border-indigo-100/80 px-4 py-3 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              className="block rounded-md px-2 py-2 text-sm font-medium text-gray-700 transition hover:bg-indigo-50 hover:text-indigo-700"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
