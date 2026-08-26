'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import useTrackLocation from '@/hooks/use-track-location';
import StoreCard from '@/components/store-card';
import SearchBar from '@/components/search-bar';
import type { HalalStore } from '@/lib/types';

const StoresMap = dynamic(() => import('@/components/stores-map'), {
  ssr: false,
});

type SortKey = 'distance' | 'name';

interface Filter {
  label: string;
  emoji: string;
  query?: string | string[];
  endpoint?: string;
}

const FILTERS: Filter[] = [
  { label: 'All', emoji: '✨', query: 'halal' },
  { label: 'Restaurants', emoji: '🍽️', query: 'halal restaurant' },
  { label: 'Brunch', emoji: '🍳', query: 'halal brunch' },
  { label: 'Groceries', emoji: '🛒', query: 'halal grocery' },
  { label: 'Bakeries', emoji: '🥐', query: 'halal bakery' },
  { label: 'Butchers', emoji: '🥩', query: 'halal butcher' },
  { label: 'Cafés', emoji: '☕', query: 'halal cafe' },
  { label: 'Sweets', emoji: '🍰', query: 'halal dessert' },
  { label: 'Spa & Wellness', emoji: '🧖', query: 'halal spa' },
  { label: 'Mosques & Activities', emoji: '🕌', endpoint: '/api/activities' },
];

export default function ExploreStores({
  initialStores,
}: {
  initialStores: HalalStore[];
}) {
  const { latLong, error: locationError, isLoading, trackLocation } =
    useTrackLocation();
  const [stores, setStores] = useState<HalalStore[]>(initialStores);
  const [searched, setSearched] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [sort, setSort] = useState<SortKey>('distance');
  const [view, setView] = useState<'list' | 'map'>('list');

  const load = useCallback(
    async (ll: string, filter: Filter) => {
      setFetching(true);
      setFetchError(null);
      try {
        const { endpoint = '/api/stores', query = '' } = filter;
        const queries = Array.isArray(query) ? query : [query];
        const responses = await Promise.all(
          queries.map(async (q) => {
            const params = new URLSearchParams({ latLong: ll });
            if (endpoint === '/api/stores') params.set('limit', '30');
            if (q) params.set('query', q);
            const res = await fetch(`${endpoint}?${params}`);
            if (!res.ok) throw new Error();
            return (await res.json()) as HalalStore[];
          })
        );
        const merged = responses.flat();
        const seen = new Set<string>();
        const unique = merged.filter((s) => {
          if (seen.has(s.id)) return false;
          seen.add(s.id);
          return true;
        });
        setStores(unique);
        setActiveFilter(filter.label);
        setSearched(true);
      } catch {
        setFetchError('Something went wrong fetching stores. Please try again.');
      } finally {
        setFetching(false);
      }
    },
    []
  );

  useEffect(() => {
    if (latLong) load(latLong, FILTERS[0]);
  }, [latLong, load]);

  const visible = useMemo(() => {
    const list = [...stores];
    list.sort((a, b) =>
      sort === 'distance'
        ? (a.distance ?? Infinity) - (b.distance ?? Infinity)
        : a.name.localeCompare(b.name)
    );
    return list;
  }, [stores, sort]);

  return (
    <section id="explore">
      <div className="flex flex-col items-center gap-4">
        <SearchBar
          onSearch={(q) => {
            if (latLong) load(latLong, { ...FILTERS[0], query: q || 'halal' });
            else trackLocation();
          }}
          disabled={fetching || isLoading}
        />
        {!latLong && (
          <button onClick={trackLocation} disabled={isLoading} className="btn-primary">
            {isLoading ? 'Finding your location…' : '📍 Use my location'}
          </button>
        )}
        {locationError && <p className="text-sm text-red-600">{locationError}</p>}
        {fetchError && <p className="text-sm text-red-600">{fetchError}</p>}
      </div>

      <div className="mt-8 -mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max gap-2 sm:mx-auto sm:w-fit sm:flex-wrap sm:justify-center">
          {FILTERS.map((f) => (
            <button
              key={f.label}
              onClick={() => {
                if (latLong) load(latLong, f);
                else trackLocation();
              }}
              disabled={fetching || isLoading}
              className={clsx(
                'flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition',
                activeFilter === f.label
                  ? 'bg-stone-900 text-white shadow'
                  : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50 hover:ring-stone-300'
              )}
            >
              <span aria-hidden>{f.emoji}</span>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-stone-400">
        Places are found via &quot;halal&quot; searches and community data —
        halal status isn&apos;t certified, please confirm with the venue.
      </p>

      {(visible.length > 0 || fetching) && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold tracking-tight">
            {fetching
              ? 'Loading…'
              : searched
                ? `${visible.length} place${visible.length === 1 ? '' : 's'}`
                : 'Popular near you'}
          </h2>
          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="Sort stores"
              className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-stone-600 ring-1 ring-stone-200"
            >
              <option value="distance">Closest</option>
              <option value="name">A–Z</option>
            </select>
            <div className="flex rounded-full bg-white p-0.5 ring-1 ring-stone-200">
              {(['list', 'map'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  aria-pressed={view === v}
                  className={clsx(
                    'rounded-full px-4 py-1 text-sm font-medium capitalize transition',
                    view === v
                      ? 'bg-stone-900 text-white shadow'
                      : 'text-stone-600 hover:text-stone-900'
                  )}
                >
                  {v === 'list' ? '☰ List' : '🗺️ Map'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {visible.length > 0 && view === 'map' && (
        <div className="mt-4 h-[65vh] min-h-[420px] overflow-hidden rounded-2xl shadow-sm ring-1 ring-stone-900/5">
          <StoresMap stores={visible} userLocation={latLong} />
        </div>
      )}

      {visible.length > 0 && view === 'list' && (
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 lg:grid-cols-4">
          {visible.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      )}

      {fetching && view === 'list' && (
        <div
          className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 lg:grid-cols-4"
          aria-busy
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/3] rounded-2xl bg-stone-200" />
              <div className="mt-2.5 h-4 w-3/4 rounded bg-stone-200" />
              <div className="mt-1.5 h-3 w-1/2 rounded bg-stone-100" />
            </div>
          ))}
        </div>
      )}

      {!fetching && !fetchError && searched && visible.length === 0 && (
        <p className="mt-8 rounded-2xl bg-white p-8 text-center text-stone-500 ring-1 ring-stone-200">
          No places found for this — try another category or search term.
        </p>
      )}
    </section>
  );
}
