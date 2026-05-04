import type { Tour } from '../types';

// Vite glob — picks up any JSON file dropped into content/tours by Decap.
// `eager: true` so we get a synchronous record at build time and avoid lazy
// loading every tour file at runtime.
const modules = import.meta.glob<{ default: unknown }>('../../content/tours/*.json', { eager: true });

export function getTours(): Tour[] {
  return Object.values(modules)
    .map(m => m.default as Tour)
    .filter(t => t && t.slug && Array.isArray(t.stops))
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getTourBySlug(slug: string): Tour | null {
  return getTours().find(t => t.slug === slug) ?? null;
}
