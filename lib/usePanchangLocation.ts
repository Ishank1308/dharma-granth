'use client';

import { useEffect, useState } from 'react';
import { PRESET_LOCATIONS, type LocationConfig } from './panchang';
import { useLocalStorage } from './useLocalStorage';

function findLocation(id: string | null | undefined) {
  return PRESET_LOCATIONS.find((location) => location.id === id);
}

export function usePanchangLocation() {
  const [savedLocation, setSavedLocation] = useLocalStorage<LocationConfig>(
    'dharma.panchang.location',
    PRESET_LOCATIONS[0],
  );
  const [linkedLocation, setLinkedLocation] = useState<LocationConfig>();

  useEffect(() => {
    function readCity() {
      setLinkedLocation(findLocation(new URLSearchParams(window.location.search).get('city')));
    }

    readCity();
    window.addEventListener('popstate', readCity);
    return () => window.removeEventListener('popstate', readCity);
  }, []);

  function selectCity(id: string) {
    const location = findLocation(id);
    if (!location) return;

    setLinkedLocation(location);
    setSavedLocation(location);
    const url = new URL(window.location.href);
    url.searchParams.set('city', location.id);
    window.history.replaceState(window.history.state, '', url);
  }

  return {
    location: linkedLocation ?? findLocation(savedLocation?.id) ?? PRESET_LOCATIONS[0],
    selectCity,
  };
}

export function panchangDayHref(path: string, city: string, date?: string) {
  const params = new URLSearchParams();
  if (date) params.set('date', date);
  params.set('city', city);
  return `${path}?${params}`;
}
