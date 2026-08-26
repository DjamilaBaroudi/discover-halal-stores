import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import type { HalalStore } from '@/lib/types';

export function RatingBadge({ rating }: { rating?: number }) {
  if (!rating || rating <= 0) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/95 px-2 py-0.5 text-xs font-bold text-amber-950 shadow">
      ★ {rating.toFixed(1)}
    </span>
  );
}

export function formatDistance(m?: number) {
  if (!m) return null;
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;
}

export default function StoreCard({
  store,
  className,
}: {
  store: HalalStore;
  className?: string;
}) {
  const distance = formatDistance(store.distance);

  return (
    <Link href={`/halal-store/${store.id}`} className={clsx('group block', className)}>
      <article className="card-glass flex h-full flex-col overflow-hidden">
        <div className="relative h-44 w-full overflow-hidden bg-stone-100">
          <Image
            src={store.image_url}
            alt={store.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
            unoptimized
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between">
            <RatingBadge rating={store.averageRating} />
            {distance && (
              <span className="rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-stone-700">
                {distance} away
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="truncate text-base font-semibold text-stone-900 transition group-hover:text-brand-700">
            {store.name}
          </h3>
          <p className="mt-1 line-clamp-1 text-sm text-stone-500">{store.address}</p>
          <div className="mt-3 flex items-center justify-between gap-2">
            {store.category ? (
              <span className="truncate rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
                {store.category}
              </span>
            ) : (
              <span />
            )}
            <span className="shrink-0 text-xs font-medium text-brand-600 opacity-0 transition group-hover:opacity-100">
              View →
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
