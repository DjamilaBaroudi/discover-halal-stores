'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import useTrackLocation from '@/hooks/use-track-location';
import StoreCard from '@/components/store-card';
import SearchBar from '@/components/search-bar';
import type { HalalStore } from '@/lib/types';

type SortKey = 'distance' | 'name';

const CATEGORY_FILTERS = ['All', 'Restaurant', 'Grocery', 'Cafe', 'Bakery', 'Market'] as const;

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
    async (ll: string, query: string) => {
      setFetching(true);
      setFetchError(null);
      try {
        const params = new URLSearchParams({ latLong: ll, limit: '30' });
        if (query) params.set('query', query);
        const res = await fetch(`/api/stores?${params}`);
        if (!res.ok) throw new Error();
        setStores(await res.json());
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
    if (latLong) load(latLong, '');
  }, [latLong, load]);

  const visible = useMemo(() => {
    let list = [...stores];
    if (activeFilter !== 'All') {
      list = list.filter((s) =>
        s.category?.toLowerCase().includes(activeFilter.toLowerCase())
      );
    }
    list.sort((a, b) =>
      sort === 'distance'
        ? (a.distance ?? Infinity) - (b.distance ?? Infinity)
        : a.name.localeCompare(b.name)
    );
    return list;
  }, [stores, activeFilter, sort]);

  const heading = searched
    ? 'Results'
    : stores.length > 0
      ? 'Featured stores'
      : null;

  return (
    <section id="explore">
      <div className="flex flex-col items-center gap-4">
        <SearchBar
          onSearch={(q) => {
            if (latLong) load(latLong, q || 'halal');
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

      {stores.length > 0 && (
        <>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-bold tracking-tight">{heading}</h2>
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORY_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                    activeFilter === f
                      ? 'bg-brand-600 text-white shadow'
                      : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {f}
                </button>
              ))}
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
          </div>

          {visible.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          ) : (
            <p className="mt-8 rounded-2xl bg-white p-8 text-center text-stone-500 ring-1 ring-stone-200">
              No stores match this filter yet — try another category.
            </p>
          )}
        </>
      )}

      {(fetching || (latLong && stores.length === 0 && !fetchError)) && (
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-white ring-1 ring-stone-200">
              <div className="h-44 rounded-t-2xl bg-stone-200" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-2/3 rounded bg-stone-200" />
                <div className="h-3 w-1/2 rounded bg-stone-100" />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
