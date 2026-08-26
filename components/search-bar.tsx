'use client';

import { useState } from 'react';

export default function SearchBar({
  onSearch,
  disabled,
}: {
  onSearch: (query: string) => void;
  disabled?: boolean;
}) {
  const [value, setValue] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(value.trim());
      }}
      className="flex w-full max-w-xl items-center gap-2 rounded-full border border-stone-200 bg-white p-1.5 shadow-lg shadow-stone-900/5 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20"
    >
      <span className="pl-3 text-stone-400" aria-hidden>
        🔎
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search burgers, shawarma, groceries…"
        aria-label="Search halal stores"
        className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-stone-800 outline-none placeholder:text-stone-400"
      />
      <button
        type="submit"
        disabled={disabled}
        className="btn-primary !px-5 !py-2 text-sm"
      >
        Search
      </button>
    </form>
  );
}
