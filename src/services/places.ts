import placesData from '../../content/places.json';
import type { Place, PlaceCategory } from '../types';

export function getPlaces(): Place[] {
  const items = (placesData as { body: Array<Record<string, unknown>> }).body;

  return items
    .sort((a, b) => (a.sort_order as number) - (b.sort_order as number))
    .map((p, i) => ({
      id: `p${i + 1}`,
      name: p.name as string,
      category: p.category as PlaceCategory,
      type: p.type as string,
      address: p.address as string,
      description: p.description as string,
      walk_time: p.walk_time as string,
      lat: p.lat as number,
      lng: p.lng as number,
      image_url: (p.image_url as string) || '',
      is_featured: (p.is_featured as boolean) || false,
      sort_order: p.sort_order as number,
      is_active: true,
      created_at: '',
      updated_at: '',
    }));
}
