import Image from 'next/image';
import Link from 'next/link';
import ExploreStores from '@/components/explore-stores';
import { fetchHalalStores } from '@/lib/foursquare';
import type { HalalStore } from '@/lib/types';

export const revalidate = 600;

export default async function Home() {
  let featured: HalalStore[] = [];
  try {
    featured = await fetchHalalStores({ limit: 9 });
  } catch (e) {
    console.error('Failed to load featured stores', e);
  }

  return (
    <main className="mx-auto max-w-6xl px-4">
      {/* Hero */}
      <section className="relative mt-4 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-brand-700 to-brand-500 px-6 py-20 text-center text-white sm:px-12 sm:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full bg-amber-400/20 blur-3xl"
        />
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-100">
          Halal food, made easy
        </p>
        <h1 className="mx-auto mt-3 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          Discover halal stores{' '}
          <span className="text-amber-300">near you</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-brand-50/90">
          Search restaurants, groceries and cafes. See what&apos;s closest, and
          rate your favourites.
        </p>
        <div className="mt-8 flex justify-center">
          <Link href="#explore" className="btn-primary !bg-white !text-brand-700 hover:!bg-brand-50">
            Start exploring ↓
          </Link>
        </div>
      </section>

      {/* Stats strip */}
      <section className="mt-8 grid grid-cols-3 gap-4 text-center">
        {[
          { value: featured.length ? `${featured.length}+` : '—', label: 'Featured spots' },
          { value: '100%', label: 'Halal verified' },
          { value: 'Free', label: 'Forever' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-white p-5 ring-1 ring-stone-200">
            <p className="text-2xl font-extrabold text-brand-700">{s.value}</p>
            <p className="mt-1 text-sm text-stone-500">{s.label}</p>
          </div>
        ))}
      </section>

      <div className="mt-14">
        <ExploreStores initialStores={featured} />
      </div>
    </main>
  );
}
