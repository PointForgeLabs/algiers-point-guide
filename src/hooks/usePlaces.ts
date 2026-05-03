import { useState, useEffect, useCallback } from 'react';
import { fetchPlaces, createPlace, updatePlace, deletePlace } from '../services/places';
import type { Place, PlaceInsert, PlaceUpdate } from '../types';

export function usePlaces() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchPlaces();
      setPlaces(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load places');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const add = async (p: PlaceInsert) => { await createPlace(p); await load(); };
  const update = async (id: string, u: PlaceUpdate) => { await updatePlace(id, u); await load(); };
  const remove = async (id: string) => { await deletePlace(id); await load(); };

  return { places, loading, error, add, update, remove, reload: load };
}
