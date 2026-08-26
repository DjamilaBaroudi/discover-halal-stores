'use client';

import { useState } from 'react';
import useSWR from 'swr';
import StarRating from './star-rating';

interface StoreRecord {
  ratingCount: number;
  ratingSum: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function StoreRatingClient({ storeId }: { storeId: string }) {
  const { data, mutate } = useSWR<StoreRecord[]>(`/api/stores/${storeId}`, fetcher);
  const [optimistic, setOptimistic] = useState<number | null>(null);

  const record = data?.[0];
  const average =
    record && record.ratingCount > 0
      ? record.ratingSum / record.ratingCount
      : undefined;

  const handleRate = async (value: number) => {
    await fetch(`/api/stores/${storeId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: value }),
    });
    mutate();
  };

  return (
    <div>
      <StarRating
        initialValue={optimistic ?? undefined}
        onRate={async (v) => {
          setOptimistic(v);
          await handleRate(v);
        }}
      />
      {typeof average === 'number' && (
        <p className="mt-2 text-sm text-stone-500">
          Average rating: {average.toFixed(1)} / 5 ({record?.ratingCount}{' '}
          {record?.ratingCount === 1 ? 'rating' : 'ratings'})
        </p>
      )}
    </div>
  );
}
