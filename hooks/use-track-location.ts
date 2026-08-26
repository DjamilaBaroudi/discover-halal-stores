'use client';

import { useCallback, useState } from 'react';

interface UseTrackLocationResult {
  latLong: string | null;
  error: string | null;
  isLoading: boolean;
  trackLocation: () => void;
}

export default function useTrackLocation(): UseTrackLocationResult {
  const [latLong, setLatLong] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const trackLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatLong(`${position.coords.latitude},${position.coords.longitude}`);
        setIsLoading(false);
      },
      () => {
        setError('Unable to retrieve your location. Please allow location access.');
        setIsLoading(false);
      },
      { timeout: 10_000 }
    );
  }, []);

  return { latLong, error, isLoading, trackLocation };
}
