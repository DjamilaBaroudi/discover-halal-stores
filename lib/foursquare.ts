import type { HalalStore } from './types';

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

interface FoursquarePlace {
  fsq_place_id: string;
  name: string;
  latitude?: number;
  longitude?: number;
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
  if (!UNSPLASH_ACCESS_KEY) return [];
  try {
    const params = new URLSearchParams({
      query,
      per_page: String(count),
      orientation: 'landscape',
    });
    const res = await fetch(
      `https://api.unsplash.com/search/photos?${params}`,
      {
        headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return [];
    const data: { results?: { urls?: { regular?: string } }[] } =
      await res.json();
    return (data.results ?? [])
      .map((r) => r.urls?.regular)
      .filter((url): url is string => Boolean(url));
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

  const [photos, res] = await Promise.all([
    getStorePhotos(
      searchQuery === 'halal' ? 'halal food restaurant' : `${searchQuery} food`,
      Math.max(limit, 20)
    ),
    fetch(
      `https://places-api.foursquare.com/places/search?${new URLSearchParams({
        query: searchQuery,
        ll: latLong,
        radius: '10000',
        limit: String(limit),
      })}`,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${process.env.FOURSQUARE_API_KEY ?? ''}`,
          'X-Places-Api-Version': '2025-06-17',
        },
        next: { revalidate: 600 },
      }
    ),
  ]);

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
    lat: venue.latitude,
    lng: venue.longitude,
    image_url: photos.length > 0 ? photos[idx % photos.length] : undefined,
  }));
}
