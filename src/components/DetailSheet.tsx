import { CATEGORY_COLORS } from '../constants/categories';
import type { Place } from '../types';

interface Props {
  place: Place;
  onClose: () => void;
}

export function DetailSheet({ place, onClose }: Props) {
  const c = CATEGORY_COLORS[place.category];

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(var(--bg-rgb),.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 480, background: c.bg, borderRadius: '24px 24px 0 0', maxHeight: '85vh', overflowY: 'auto', animation: 'slideUp .35s cubic-bezier(.16,1,.3,1)', position: 'relative' }}>
        {place.image_url && (
          <div style={{ width: '100%', height: 200, borderRadius: '24px 24px 0 0', overflow: 'hidden', position: 'relative' }}>
            <img src={place.image_url} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: `linear-gradient(transparent,${c.bg})` }} />
          </div>
        )}
        <div style={{ padding: place.image_url ? '0 24px 36px' : '28px 24px 36px' }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,.2)', margin: '0 auto 16px' }} />
          <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 20, background: 'rgba(0,0,0,.4)', border: 'none', color: '#fff', width: 32, height: 32, borderRadius: 16, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
            &times;
          </button>
          <span style={{ display: 'inline-block', background: c.accent, color: c.bg, fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: 4, marginBottom: 12, fontFamily: "'DM Sans',sans-serif" }}>
            {place.type}
          </span>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, fontWeight: 700, color: '#F5F0E8', margin: '0 0 6px', lineHeight: 1.15 }}>{place.name}</h2>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: 'rgba(245,240,232,.5)', margin: '0 0 16px' }}>{place.address}</p>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 15, color: 'rgba(245,240,232,.85)', margin: '0 0 24px', lineHeight: 1.65 }}>{place.description}</p>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, background: 'rgba(255,255,255,.08)', borderRadius: 12, padding: '14px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.1em', color: 'rgba(245,240,232,.4)', marginBottom: 4, fontFamily: "'DM Sans',sans-serif" }}>Walk from ferry</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: c.accent, fontWeight: 700 }}>{place.walk_time}</div>
            </div>
            <a href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}&travelmode=walking`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, background: c.accent, borderRadius: 12, padding: '14px 16px', textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, fontWeight: 700, color: c.bg }}>Directions &rarr;</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
