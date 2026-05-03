export type PlaceCategory = 'eat' | 'shop' | 'history' | 'architecture';

export interface Place {
  id: string;
  name: string;
  category: PlaceCategory;
  type: string;
  address: string;
  description: string;
  walk_time: string;
  lat: number;
  lng: number;
  image_url: string;
  is_featured: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type PlaceInsert = Omit<Place, 'id' | 'created_at' | 'updated_at' | 'is_active'>;
export type PlaceUpdate = Partial<PlaceInsert>;
