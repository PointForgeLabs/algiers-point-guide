import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CATEGORY_COLORS, MAP_CENTER, MAP_ZOOM, TILE_URL_DARK, TILE_URL_LIGHT } from '../constants/categories';
import type { Place, PlaceCategory, Tour } from '../types';
import type { Theme } from '../hooks/useTheme';

const TOUR_ACCENT = '#B485E8';

function categoryIcon(cat: PlaceCategory, theme: Theme): L.DivIcon {
  const color = CATEGORY_COLORS[cat].marker;
  const ring = theme === 'light' ? '#FFFFFF' : '#0F0C0A';
  return L.divIcon({
    className: '',
    html: `<div style="width:13px;height:13px;border-radius:50%;background:${color};border:2.5px solid ${ring};box-shadow:0 0 0 2px ${color}44,0 2px 8px rgba(0,0,0,.4);cursor:pointer"></div>`,
    iconSize: [13, 13],
    iconAnchor: [7, 7],
  });
}

function tourStopIcon(index: number, isCurrent: boolean, theme: Theme): L.DivIcon {
  const ring = theme === 'light' ? '#FFFFFF' : '#0F0C0A';
  const size = isCurrent ? 36 : 26;
  const fontSize = isCurrent ? 15 : 12;
  const pulse = isCurrent ? `box-shadow:0 0 0 3px ${TOUR_ACCENT}55, 0 0 0 8px ${TOUR_ACCENT}22, 0 4px 14px rgba(0,0,0,.5);` : `box-shadow:0 0 0 2px ${TOUR_ACCENT}33, 0 2px 8px rgba(0,0,0,.4);`;
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${TOUR_ACCENT};border:3px solid ${ring};${pulse}display:flex;align-items:center;justify-content:center;color:#0F0C0A;font-family:'DM Sans',sans-serif;font-size:${fontSize}px;font-weight:700;cursor:pointer">${index + 1}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

const ferryIcon = L.divIcon({
  className: '',
  html: '<div style="font-size:24px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.5))">&#x26F4;</div>',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

// Keep Leaflet's internal size in sync with its container.
// A one-shot invalidateSize() on mount races browser layout — the parent
// flexbox often hasn't finalized when it fires, so Leaflet reads the wrong
// dimensions and renders only one tile with markers stacked in the corner.
function ResizeHandler() {
  const map = useMap();
  useEffect(() => {
    const container = map.getContainer();
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(container);
    return () => observer.disconnect();
  }, [map]);
  return null;
}

// Pan to the current tour stop whenever it changes.
function TourFollower({ tour, stopIndex }: { tour: Tour | null; stopIndex: number }) {
  const map = useMap();
  useEffect(() => {
    if (!tour) return;
    const stop = tour.stops[stopIndex];
    if (!stop) return;
    map.flyTo([stop.lat, stop.lng], Math.max(map.getZoom(), 17), { duration: 0.6 });
  }, [tour, stopIndex, map]);
  return null;
}

interface Props {
  places: Place[];
  activeCategory: string;
  onSelect: (place: Place) => void;
  theme: Theme;
  activeTour: Tour | null;
  activeStopIndex: number;
  onStopSelect: (index: number) => void;
}

export function MapView({ places, activeCategory, onSelect, theme, activeTour, activeStopIndex, onStopSelect }: Props) {
  const filtered = activeCategory === 'all' ? places : places.filter(p => p.category === activeCategory);
  const tileUrl = theme === 'light' ? TILE_URL_LIGHT : TILE_URL_DARK;

  return (
    <MapContainer
      center={[MAP_CENTER.lat, MAP_CENTER.lng]}
      zoom={MAP_ZOOM}
      zoomControl={false}
      style={{ width: '100%', height: '100%' }}
    >
      <ResizeHandler />
      <TourFollower tour={activeTour} stopIndex={activeStopIndex} />
      {/* key forces TileLayer to re-mount when theme flips so tiles swap immediately */}
      <TileLayer key={theme} url={tileUrl} maxZoom={19} />

      {/* Ferry terminal marker */}
      <Marker position={[29.95309626074462, -90.05550878079588]} icon={ferryIcon}>
        <Tooltip direction="top" offset={[0, -10]}>
          <b>Ferry Terminal</b><br />You are here!
        </Tooltip>
      </Marker>

      {/* Place markers — dimmed while a tour is active so tour stops dominate */}
      {filtered.map(place => (
        <Marker
          key={place.id}
          position={[place.lat, place.lng]}
          icon={categoryIcon(place.category, theme)}
          opacity={activeTour ? 0.35 : 1}
          eventHandlers={{ click: () => onSelect(place) }}
        >
          <Tooltip direction="top" offset={[0, -10]}>{place.name}</Tooltip>
        </Marker>
      ))}

      {/* Active tour stop markers */}
      {activeTour?.stops.map((stop, i) => (
        <Marker
          key={`${activeTour.slug}-${i}`}
          position={[stop.lat, stop.lng]}
          icon={tourStopIcon(i, i === activeStopIndex, theme)}
          eventHandlers={{ click: () => onStopSelect(i) }}
          zIndexOffset={1000 + (i === activeStopIndex ? 100 : 0)}
        >
          <Tooltip direction="top" offset={[0, -16]}>{stop.name}</Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}
