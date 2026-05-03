import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CATEGORY_COLORS, MAP_CENTER, MAP_ZOOM, TILE_URL } from '../constants/categories';
import type { Place, PlaceCategory } from '../types';

function categoryIcon(cat: PlaceCategory): L.DivIcon {
  const color = CATEGORY_COLORS[cat].marker;
  return L.divIcon({
    className: '',
    html: `<div style="width:13px;height:13px;border-radius:50%;background:${color};border:2.5px solid #0F0C0A;box-shadow:0 0 0 2px ${color}44,0 2px 8px rgba(0,0,0,.4);cursor:pointer"></div>`,
    iconSize: [13, 13],
    iconAnchor: [7, 7],
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

interface Props {
  places: Place[];
  activeCategory: string;
  onSelect: (place: Place) => void;
}

export function MapView({ places, activeCategory, onSelect }: Props) {
  const filtered = activeCategory === 'all' ? places : places.filter(p => p.category === activeCategory);

  return (
    <MapContainer
      center={[MAP_CENTER.lat, MAP_CENTER.lng]}
      zoom={MAP_ZOOM}
      zoomControl={false}
      style={{ width: '100%', height: '100%' }}
    >
      <ResizeHandler />
      <TileLayer url={TILE_URL} maxZoom={19} />

      {/* Ferry terminal marker */}
      <Marker position={[29.95398, -90.05450]} icon={ferryIcon}>
        <Tooltip direction="top" offset={[0, -10]}>
          <b>Ferry Terminal</b><br />You are here!
        </Tooltip>
      </Marker>

      {/* Place markers */}
      {filtered.map(place => (
        <Marker
          key={place.id}
          position={[place.lat, place.lng]}
          icon={categoryIcon(place.category)}
          eventHandlers={{ click: () => onSelect(place) }}
        >
          <Tooltip direction="top" offset={[0, -10]}>{place.name}</Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}
