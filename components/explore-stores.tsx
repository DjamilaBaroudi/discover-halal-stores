'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import useTrackLocation from '@/hooks/use-track-location';
import StoreCard from '@/components/store-card';
import SearchBar from '@/components/search-bar';
import type { HalalStore } from '@/lib/types';

type SortKey = 'distance' | 'name';

const FILTERS = [
  { label: 'All', emoji: '✨', query: 'halal' },
  { label: 'Restaurants', emoji: '🍽️', query: 'halal restaurant' },
  { label: 'Brunch', emoji: '🍳', query: 'halal brunch' },
  { label: 'Groceries', emoji: '🛒', query: 'halal grocery' },
  { label: 'Bakeries', emoji: '🥐', query: 'bakery' },
  { label: 'Butchers', emoji: '🥩', query: 'halal butcher' },
  { label: 'Cafés', emoji: '☕', query: 'cafe' },
  { label: 'Sweets', emoji: '🍰', query: 'dessert' },
  { label: 'Spa & Wellness', emoji: '🧖', query: 'spa' },
] as const;

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

  const load = useCallback(
    async (ll: string, query: string, filter: string) => {
      setFetching(true);
      setFetchError(null);
      try {
        const params = new URLSearchParams({ latLong: ll, limit: '30' });
        if (query) params.set('query', query);
        const res = await fetch(`/api/stores?${params}`);
        if (!res.ok) throw new Error();
        setStores(await res.json());
        setActiveFilter(filter);
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
    if (latLong) load(latLong, 'halal', 'All');
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
            if (latLong) load(latLong, q || 'halal', 'All');
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
                if (latLong) load(latLong, f.query, f.label);
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

      {(visible.length > 0 || fetching) && (
        <div className="mt-6 flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold tracking-tight">
            {fetching
              ? 'Loading…'
              : searched
                ? `${visible.length} place${visible.length === 1 ? '' : 's'}`
                : 'Popular near you'}
          </h2>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="Sort stores"
            className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-stone-600 ring-1 ring-stone-200"
          >
            <option value="distance">Closest</option>
            <option value="name">A–Z</option>
          </select>
        </div>
      )}

      {visible.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3 lg:grid-cols-4">
          {visible.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      )}

      {fetching && (
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
