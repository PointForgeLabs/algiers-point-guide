import { useMemo } from 'react';
import { getPlaces } from '../services/places';
import type { Place } from '../types';

export function usePlaces() {
  const places = useMemo<Place[]>(() => getPlaces(), []);
  return { places, loading: false, error: null };
}
