import { useMemo } from 'react';
import { getTours } from '../services/tours';
import type { Tour } from '../types';

export function useTours() {
  const tours = useMemo<Tour[]>(() => getTours(), []);
  return { tours };
}
