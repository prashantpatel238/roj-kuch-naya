import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'roz-kuch-naya',
  description: 'Production-ready Next.js 14 boilerplate with MongoDB integration.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  );
}
