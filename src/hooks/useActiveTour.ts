import { useCallback, useState } from 'react';
import type { Tour } from '../types';

export interface ActiveTourState {
  tour: Tour | null;
  stopIndex: number;
  start: (tour: Tour) => void;
  end: () => void;
  next: () => void;
  prev: () => void;
  jumpTo: (index: number) => void;
}

export function useActiveTour(): ActiveTourState {
  const [tour, setTour] = useState<Tour | null>(null);
  const [stopIndex, setStopIndex] = useState(0);

  const start = useCallback((t: Tour) => {
    setTour(t);
    setStopIndex(0);
  }, []);

  const end = useCallback(() => {
    setTour(null);
    setStopIndex(0);
  }, []);

  const next = useCallback(() => {
    setStopIndex(i => (tour ? Math.min(i + 1, tour.stops.length - 1) : i));
  }, [tour]);

  const prev = useCallback(() => {
    setStopIndex(i => Math.max(i - 1, 0));
  }, []);

  const jumpTo = useCallback((index: number) => {
    setStopIndex(i => (tour ? Math.min(Math.max(index, 0), tour.stops.length - 1) : i));
  }, [tour]);

  return { tour, stopIndex, start, end, next, prev, jumpTo };
}
