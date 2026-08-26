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

const FALLBACKS: { match: RegExp; emoji: string; gradient: string }[] = [
  { match: /mosque|masjid|place of worship/i, emoji: '🕌', gradient: 'from-emerald-100 to-brand-500/60' },
  { match: /brunch|breakfast/i, emoji: '🍳', gradient: 'from-amber-200 to-orange-300' },
  { match: /baker|bread|pastry/i, emoji: '🥐', gradient: 'from-amber-100 to-amber-300' },
  { match: /butcher|meat/i, emoji: '🥩', gradient: 'from-rose-200 to-red-300' },
  { match: /grocer|market|supermarket/i, emoji: '🛒', gradient: 'from-lime-200 to-emerald-300' },
  { match: /caf|coffee/i, emoji: '☕', gradient: 'from-stone-200 to-amber-200' },
  { match: /sweet|dessert|ice cream|chocolate/i, emoji: '🍰', gradient: 'from-pink-200 to-rose-300' },
  { match: /spa|wellness|hammam|sauna/i, emoji: '🧖', gradient: 'from-teal-200 to-cyan-300' },
  { match: /restaurant|kebab|grill|food/i, emoji: '🍽️', gradient: 'from-emerald-200 to-teal-300' },
];

export function fallbackFor(label: string) {
  return (
    FALLBACKS.find((f) => f.match.test(label)) ?? {
      emoji: '🍽️',
      gradient: 'from-emerald-200 to-teal-300',
    }
  );
}

export function StoreImage({
  store,
  className,
  priority,
}: {
  store: HalalStore;
  className?: string;
  priority?: boolean;
}) {
  if (store.image_url) {
    return (
      <Image
        src={store.image_url}
        alt={store.name}
        fill
        priority={priority}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className={clsx('object-cover', className)}
      />
    );
  }
  const fallback = fallbackFor(`${store.category ?? ''} ${store.name}`);
  return (
    <div
      className={clsx(
        'flex h-full w-full items-center justify-center bg-gradient-to-br',
        fallback.gradient
      )}
    >
      <span className="text-5xl drop-shadow-sm" aria-hidden>
        {fallback.emoji}
      </span>
    </div>
  );
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
      <article className="flex h-full flex-col">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-stone-100 shadow-sm ring-1 ring-stone-900/5">
          <StoreImage store={store} className="transition duration-500 group-hover:scale-105" />
          <div className="absolute left-2.5 top-2.5">
            <RatingBadge rating={store.averageRating} />
          </div>
          {distance && (
            <span className="absolute right-2.5 top-2.5 rounded-full bg-white/95 px-2 py-0.5 text-xs font-semibold text-stone-700 shadow-sm">
              {distance}
            </span>
          )}
        </div>
        <div className="px-1 pt-2.5">
          <h3 className="truncate text-[15px] font-semibold text-stone-900 transition group-hover:text-brand-700">
            {store.name}
          </h3>
          <p className="mt-0.5 truncate text-sm text-stone-500">
            {[store.category, store.neighborhood].filter(Boolean).join(' · ')}
          </p>
        </div>
      </article>
    </Link>
  );
}
