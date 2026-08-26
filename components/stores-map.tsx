'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import type { HalalStore } from '@/lib/types';
import { formatDistance } from './store-card';

const pinIcon = L.divIcon({
  className: '',
  html: '<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#15803d;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35)"></div>',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -26],
});

const userIcon = L.divIcon({
  className: '',
  html: '<div style="width:16px;height:16px;border-radius:50%;background:#2563eb;border:3px solid #fff;box-shadow:0 0 0 4px rgba(37,99,235,.25)"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

export default function StoresMap({
  stores,
  userLocation,
}: {
  stores: HalalStore[];
  userLocation?: string | null;
}) {
  const points = stores.filter(
    (s) => typeof s.lat === 'number' && typeof s.lng === 'number'
  );
  const [userLat, userLng] = (userLocation ?? '')
    .split(',')
    .map(Number)
    .filter(Number.isFinite);
  const hasUser = typeof userLat === 'number' && typeof userLng === 'number';

  const storeTuples = points.map(
    (s) => [s.lat as number, s.lng as number] as [number, number]
  );
  let bounds: L.LatLngBounds | null = null;
  if (storeTuples.length > 0) {
    bounds = L.latLngBounds(storeTuples);
    if (hasUser) bounds.extend([userLat, userLng]);
  }

  const center: [number, number] = bounds
    ? [bounds.getCenter().lat, bounds.getCenter().lng]
    : hasUser
      ? [userLat, userLng]
      : [52.52, 13.405];

  return (
    <MapContainer
      key={points.map((s) => s.id).join(',')}
      center={center}
      bounds={bounds ?? undefined}
      boundsOptions={bounds ? { padding: [40, 40] } : undefined}
      zoom={bounds ? undefined : 13}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {hasUser && <Marker position={[userLat, userLng]} icon={userIcon} />}
      {points.map((store) => (
        <Marker
          key={store.id}
          position={[store.lat as number, store.lng as number]}
          icon={pinIcon}
        >
          <Popup>
            <div className="min-w-[160px]">
              <p className="m-0 text-sm font-semibold">{store.name}</p>
              <p className="m-0 mt-0.5 text-xs text-stone-500">
                {[store.category, formatDistance(store.distance)]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
              <Link
                href={`/halal-store/${store.id}`}
                className="mt-1.5 inline-block text-xs font-semibold text-brand-700 hover:underline"
              >
                View details →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
