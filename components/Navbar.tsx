'use client';

import Link from 'next/link';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/current-affairs', label: 'Current Affairs' },
  { href: '/daily-quiz', label: 'Daily Quiz' },
  { href: '/weekly-quiz', label: 'Weekly Quiz' },
  { href: '/archive', label: 'Archive' }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="text-xl font-bold text-indigo-700">
          MeritMantra
        </Link>

        <button
          type="button"
          className="inline-flex items-center rounded-md p-2 text-gray-700 transition hover:bg-gray-100 md:hidden"
          onClick={() => setIsOpen((prev: boolean) => !prev)}
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
        >
          <span className="text-2xl leading-none">☰</span>
        </button>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-700 transition hover:text-indigo-700"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {isOpen && (
        <div className="space-y-1 border-t border-gray-200 px-4 py-3 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-md px-2 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-indigo-700"
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
