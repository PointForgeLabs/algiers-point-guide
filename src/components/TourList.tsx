import type { Tour } from '../types';

interface Props {
  tours: Tour[];
  onSelect: (tour: Tour) => void;
}

export function TourList({ tours, onSelect }: Props) {
  if (tours.length === 0) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: 'rgba(var(--text-rgb),.5)' }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, marginBottom: 8, color: 'var(--text)' }}>No tours yet</div>
        <div style={{ fontSize: 14 }}>Audio walking tours will appear here once they're published.</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 20px 100px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ padding: '8px 0 12px' }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 800, margin: 0, lineHeight: 1.1 }}>
          Audio Walking Tours
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(var(--text-rgb),.6)', marginTop: 8 }}>
          Pop in earbuds and let a local walk you through the neighborhood.
        </p>
      </div>

      {tours.map((t, i) => (
        <div
          key={t.slug}
          onClick={() => onSelect(t)}
          style={{
            background: '#3E2D4A', borderRadius: 16, overflow: 'hidden', cursor: 'pointer',
            animation: `fadeInUp .4s cubic-bezier(.16,1,.3,1) ${i * 0.04}s both`,
            transition: 'transform .2s, box-shadow .2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 30px rgba(0,0,0,.3)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = ''; }}
        >
          {t.cover_image && (
            <div style={{ width: '100%', height: 140, overflow: 'hidden', position: 'relative' }}>
              <img src={t.cover_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).parentElement!.style.display = 'none'; }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 50, background: 'linear-gradient(transparent,#3E2D4A)' }} />
            </div>
          )}
          <div style={{ padding: '18px 20px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#B485E8' }}>
                {t.stops.length} stops &middot; {t.duration}
              </span>
              <span style={{ fontSize: 18, color: '#B485E8' }}>&#x25B6;</span>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: '#F5F0E8', margin: '0 0 8px', lineHeight: 1.2 }}>
              {t.title}
            </h2>
            <p style={{ fontSize: 13.5, color: 'rgba(245,240,232,.65)', margin: 0, lineHeight: 1.55, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {t.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
