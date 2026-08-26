import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import StoreRatingClient from '@/components/store-rating-client';
import { fetchHalalStores, DEFAULT_LOCATION } from '@/lib/foursquare';
import { fetchMuslimActivities } from '@/lib/osm';
import { getConvexClient, api } from '@/lib/convex-server';
import { formatDistance, StoreImage } from '@/components/store-card';

export const revalidate = 600;

async function getStore(id: string) {
  const stores = id.startsWith('osm-')
    ? await fetchMuslimActivities(DEFAULT_LOCATION)
    : await fetchHalalStores({ limit: 30 });
  const store = stores.find((s) => s.id === id);
  if (!store) return null;

  try {
    await getConvexClient().mutation(api.stores.upsert, {
      externalId: store.id,
      name: store.name,
      address: store.address,
      neighborhood: store.neighborhood,
      category: store.category,
      imageUrl: store.image_url,
    });
  } catch (e) {
    console.error('Failed to sync store to Convex', e);
  }

  return store;
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const store = await getStore(params.id);
  return { title: store?.name ?? 'Store' };
}

export default async function HalalStorePage({
  params,
}: {
  params: { id: string };
}) {
  const store = await getStore(params.id);
  if (!store) notFound();

  const distance = formatDistance(store.distance);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${store.name} ${store.address}`
  )}`;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <Link
        href="/"
        className="text-sm font-medium text-stone-500 transition hover:text-brand-600"
      >
        ← Back to home
      </Link>

      {/* Hero image */}
      <div className="relative mt-6 aspect-[21/9] overflow-hidden rounded-3xl bg-stone-100 shadow-lg">
        <StoreImage store={store} priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          {store.category && (
            <span className="mb-2 inline-block rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-700">
              {store.category}
            </span>
          )}
          <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow sm:text-4xl">
            {store.name}
          </h1>
          {distance && (
            <p className="mt-1 text-sm font-medium text-white/80">
              {distance} from your location
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-5">
        {/* Details */}
        <section className="space-y-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm md:col-span-3">
          <h2 className="text-lg font-bold">Details</h2>
          <dl className="space-y-4 text-sm">
            <div className="flex gap-3">
              <span aria-hidden className="text-lg">📍</span>
              <div>
                <dt className="sr-only">Address</dt>
                <dd className="text-stone-700">{store.address}</dd>
              </div>
            </div>
            {store.tel && (
              <div className="flex gap-3">
                <span aria-hidden className="text-lg">📞</span>
                <div>
                  <dt className="sr-only">Phone</dt>
                  <dd>
                    <a
                      href={`tel:${store.tel.replace(/\s/g, '')}`}
                      className="font-medium text-brand-700 hover:underline"
                    >
                      {store.tel}
                    </a>
                  </dd>
                </div>
              </div>
            )}
            {store.website && (
              <div className="flex gap-3">
                <span aria-hidden className="text-lg">🌐</span>
                <div>
                  <dt className="sr-only">Website</dt>
                  <dd>
                    <a
                      href={store.website}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-brand-700 hover:underline"
                    >
                      {new URL(store.website).hostname.replace('www.', '')}
                    </a>
                  </dd>
                </div>
              </div>
            )}
            {store.neighborhood && (
              <div className="flex gap-3">
                <span aria-hidden className="text-lg">🏙️</span>
                <div>
                  <dt className="sr-only">Area</dt>
                  <dd className="text-stone-700">{store.neighborhood}</dd>
                </div>
              </div>
            )}
          </dl>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="btn-primary mt-2 w-full sm:w-auto"
          >
            🧭 Get directions
          </a>
        </section>

        {/* Rating */}
        <aside className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm md:col-span-2">
          <h2 className="text-lg font-bold">Rate this store</h2>
          <p className="mt-1 text-sm text-stone-500">
            Help others find the best halal spots.
          </p>
          <div className="mt-4">
            <StoreRatingClient storeId={store.id} />
          </div>
        </aside>
      </div>
    </main>
  );
}
