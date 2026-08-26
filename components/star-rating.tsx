'use client';

import { useState } from 'react';

export default function StarRating({
  initialValue = 0,
  onRate,
}: {
  initialValue?: number;
  onRate?: (value: number) => void | Promise<void>;
}) {
  const [value, setValue] = useState(initialValue);
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleRate = async (rating: number) => {
    setValue(rating);
    setSubmitting(true);
    try {
      await onRate?.(rating);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="flex items-center gap-1"
      role="radiogroup"
      aria-label="Rate this store"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={submitting}
          onClick={() => handleRate(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="text-2xl leading-none transition hover:scale-110 disabled:opacity-50"
          aria-checked={value === star}
          aria-label={`${star} star${star !== 1 ? 's' : ''}`}
          role="radio"
        >
          <span className={(hover || value) >= star ? 'text-amber-400' : 'text-stone-300'}>
            ★
          </span>
        </button>
      ))}
      {submitting && <span className="ml-1 text-xs text-stone-400">Saving…</span>}
    </div>
  );
}
