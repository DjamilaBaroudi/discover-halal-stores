import { createApi } from 'unsplash-js';
import type { HalalStore } from './types';

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY ?? '',
});

interface FoursquarePlace {
  fsq_place_id: string;
  name: string;
  categories?: { name: string }[];
  location?: {
    formatted_address?: string;
    address?: string;
    locality?: string;
  };
  distance?: number;
  tel?: string;
  website?: string;
}

async function getStorePhotos(query: string, count: number): Promise<string[]> {
  try {
    const response = await unsplash.search.getPhotos({ query, perPage: 40 });
    const results = response.response?.results ?? [];
    return results.map((r) => r.urls.regular);
  } catch {
    return [];
  }
}

export const DEFAULT_LOCATION = '52.520007,13.404954'; // Berlin

export async function fetchHalalStores(options?: {
  latLong?: string;
  query?: string;
  limit?: number;
}): Promise<HalalStore[]> {
  const latLong = options?.latLong ?? DEFAULT_LOCATION;
  const searchQuery = options?.query ?? 'halal';
  const limit = options?.limit ?? 12;

  const photos = await getStorePhotos(
    searchQuery === 'halal' ? 'halal food restaurant' : `${searchQuery} food`,
    40
  );

  const params = new URLSearchParams({
    query: searchQuery,
    ll: latLong,
    radius: '10000',
    limit: String(limit),
  });

  const res = await fetch(
    `https://places-api.foursquare.com/places/search?${params}`,
    {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.FOURSQUARE_API_KEY ?? ''}`,
        'X-Places-Api-Version': '2025-06-17',
      },
      next: { revalidate: 600 },
    }
  );

  if (!res.ok) {
    throw new Error(`Foursquare API error: ${res.status}`);
  }

  const data: { results?: FoursquarePlace[] } = await res.json();

  return (data.results ?? []).map((venue, idx) => ({
    id: venue.fsq_place_id,
    name: venue.name,
    category: venue.categories?.[0]?.name,
    address:
      venue.location?.formatted_address ??
      venue.location?.address ??
      venue.location?.locality ??
      '',
    neighborhood: venue.location?.locality || undefined,
    tel: venue.tel || undefined,
    website: venue.website || undefined,
    distance: venue.distance,
    image_url:
      photos[idx % Math.max(photos.length, 1)] ??
      `https://placehold.co/600x360/15803d/ffffff?text=${encodeURIComponent(venue.name)}`,
  }));
}
