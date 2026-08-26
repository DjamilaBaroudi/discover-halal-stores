import type { Metadata } from 'next';
import Link from 'next/link';
import { ConvexClientProvider } from './ConvexClientProvider';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Halal Stores — Discover halal food near you',
    template: '%s | Halal Stores',
  },
  description:
    'Find halal restaurants and stores near your location. Search, browse, and rate halal spots.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ConvexClientProvider>
        <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-lg font-extrabold tracking-tight">
              <span className="text-brand-600">Halal</span>Stores
            </Link>
            <nav className="text-sm font-medium text-stone-600">
              <Link href="/" className="transition hover:text-brand-600">
                Home
              </Link>
            </nav>
          </div>
        </header>

        {children}

        <footer className="mt-20 border-t border-stone-200 bg-white py-8 text-center text-sm text-stone-500">
          Data by{' '}
          <a
            className="underline hover:text-brand-600"
            href="https://developer.foursquare.com"
            target="_blank"
            rel="noreferrer"
          >
            Foursquare
          </a>{' '}
          · Photos by{' '}
          <a
            className="underline hover:text-brand-600"
            href="https://unsplash.com"
            target="_blank"
            rel="noreferrer"
          >
            Unsplash
          </a>
        </footer>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
