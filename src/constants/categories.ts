import type { PlaceCategory } from '../types';

export const CATEGORY_COLORS: Record<PlaceCategory, { bg: string; accent: string; marker: string }> = {
  eat: { bg: '#2D4A3E', accent: '#E8C547', marker: '#E8C547' },
  shop: { bg: '#4A2D3E', accent: '#E87B6B', marker: '#E87B6B' },
  history: { bg: '#2D3A4A', accent: '#6BB8E8', marker: '#6BB8E8' },
  architecture: { bg: '#4A3A2D', accent: '#C49A6C', marker: '#C49A6C' },
};

export const CATEGORIES = [
  { id: 'all' as const, label: 'All', icon: '\u25A0' },
  { id: 'eat' as const, label: 'Eat & Drink', icon: '\u25A0' },
  { id: 'shop' as const, label: 'Shops', icon: '\u25C6' },
  { id: 'history' as const, label: 'History', icon: '\u25A0' },
  { id: 'architecture' as const, label: 'Architecture', icon: '\u25A0' },
] as const;

export const COLORS = {
  bg: '#0F0C0A',
  surface: '#1A1714',
  text: '#F5F0E8',
  gold: '#E8C547',
  muted: 'rgba(245, 240, 232, 0.55)',
} as const;

export const MAP_CENTER = { lat: 29.9520, lng: -90.0520 };
export const MAP_ZOOM = 16;
export const TILE_URL_DARK = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
export const TILE_URL_LIGHT = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
// Legacy export kept for backward compat in case anything still imports it.
export const TILE_URL = TILE_URL_DARK;
