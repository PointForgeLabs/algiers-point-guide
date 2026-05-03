import { supabase, isConfigured } from './supabase';
import { DEFAULT_PLACES } from '../constants/defaults';
import type { Place, PlaceInsert, PlaceUpdate } from '../types';

export async function fetchPlaces(): Promise<Place[]> {
  if (!isConfigured) {
    // Return default places when Supabase is not configured
    return DEFAULT_PLACES.map((p, i) => ({
      ...p,
      id: `default-${i}`,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
  }

  const { data, error } = await supabase
    .from('places')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createPlace(place: PlaceInsert): Promise<Place> {
  const { data, error } = await supabase
    .from('places')
    .insert(place)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePlace(id: string, updates: PlaceUpdate): Promise<Place> {
  const { data, error } = await supabase
    .from('places')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePlace(id: string): Promise<void> {
  const { error } = await supabase
    .from('places')
    .update({ is_active: false })
    .eq('id', id);

  if (error) throw error;
}
