import { CATEGORY_COLORS } from '../constants/categories';
import type { Place } from '../types';

interface Props {
  place: Place;
  index: number;
  onClick: () => void;
}

export function PlaceCard({ place, index, onClick }: Props) {
  const c = CATEGORY_COLORS[place.category];

  return (
    <div
      onClick={onClick}
      style={{
        background: c.bg, borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
        animation: `fadeInUp .4s cubic-bezier(.16,1,.3,1) ${index * 0.03}s both`,
        transition: 'transform .2s,box-shadow .2s',
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 30px rgba(0,0,0,.3)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}
    >
      {place.image_url && (
        <div style={{ width: '100%', height: 120, overflow: 'hidden', position: 'relative' }}>
          <img src={place.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 40, background: `linear-gradient(transparent,${c.bg})` }} />
        </div>
      )}
      <div style={{ padding: '16px 20px 20px', position: 'relative' }}>
        {place.is_featured && (
          <div style={{ position: 'absolute', top: 0, right: 0, background: c.accent, color: c.bg, fontSize: 9, fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '0 0 0 10px', fontFamily: "'DM Sans',sans-serif" }}>
            Start Here
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: c.accent, fontFamily: "'DM Sans',sans-serif" }}>{place.type}</span>
          <span style={{ fontSize: 11, color: 'rgba(245,240,232,.4)', fontFamily: "'DM Sans',sans-serif", whiteSpace: 'nowrap' }}>{place.walk_time} walk</span>
        </div>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 19, fontWeight: 700, color: '#F5F0E8', margin: '0 0 6px', lineHeight: 1.2 }}>{place.name}</h3>
        <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12.5, color: 'rgba(245,240,232,.55)', margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {place.description}
        </p>
      </div>
    </div>
  );
}
