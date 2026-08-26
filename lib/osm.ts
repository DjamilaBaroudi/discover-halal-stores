import type { HalalStore } from './types';

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

const CACHE_TTL = 60 * 60 * 1000;
const cache = new Map<string, { at: number; data: { elements?: OverpassElement[] } }>();

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function fetchMuslimActivities(
  latLong: string
): Promise<HalalStore[]> {
  const [lat, lng] = latLong.split(',').map(Number);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return [];

  const query = `[out:json][timeout:25];
(
  node["amenity"="place_of_worship"]["religion"="muslim"](around:10000,${lat},${lng});
  way["amenity"="place_of_worship"]["religion"="muslim"](around:10000,${lat},${lng});
);
out center;`;

  const endpoints = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://overpass.private.coffee/api/interpreter',
  ];

  const cacheKey = `${lat.toFixed(2)},${lng.toFixed(2)}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.at < CACHE_TTL) {
    return toStores(cached.data.elements ?? [], lat, lng);
  }

  let data: { elements?: OverpassElement[] } | null = null;
  let lastError: unknown = null;
  for (const endpoint of endpoints) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 20_000);
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'discover-halal-stores/1.0',
          Accept: 'application/json',
        },
        body: `data=${encodeURIComponent(query)}`,
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`Overpass API error: ${res.status}`);
      const json: { elements?: OverpassElement[] } = await res.json();
      if (json.elements) {
        data = json;
        break;
      }
    } catch (e) {
      lastError = e;
    }
  }

  if (!data) {
    throw lastError ?? new Error('All Overpass endpoints failed');
  }

  cache.set(cacheKey, { at: Date.now(), data });
  return toStores(data.elements ?? [], lat, lng);
}

function toStores(elements: OverpassElement[], lat: number, lng: number) {
  return elements
    .map((el) => {
      const tags = el.tags ?? {};
      const point =
        el.lat !== undefined && el.lon !== undefined
          ? { lat: el.lat, lon: el.lon }
          : el.center;
      const street = [tags['addr:street'], tags['addr:housenumber']]
        .filter(Boolean)
        .join(' ');
      const city = tags['addr:city'] ?? tags['addr:suburb'];
      const address = [street, tags['addr:postcode'], city]
        .filter(Boolean)
        .join(', ');

      return {
        id: `osm-${el.type}-${el.id}`,
        name: tags.name ?? 'Mosque',
        category: 'Mosque',
        address,
        neighborhood: city || undefined,
        tel: tags.phone ?? tags['contact:phone'] ?? undefined,
        website: tags.website ?? tags['contact:website'] ?? undefined,
        distance: point ? haversine(lat, lng, point.lat, point.lon) : undefined,
        lat: point?.lat,
        lng: point?.lon,
      } satisfies HalalStore;
    })
    .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
}
