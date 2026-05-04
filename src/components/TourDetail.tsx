import type { Tour } from '../types';

interface Props {
  tour: Tour;
  onBack: () => void;
  onStart: () => void;
}

export function TourDetail({ tour, onBack, onStart }: Props) {
  return (
    <div style={{ padding: '12px 20px 100px', overflowY: 'auto', height: '100%' }}>
      <button
        onClick={onBack}
        style={{ background: 'transparent', border: 'none', color: 'rgba(var(--text-rgb),.55)', cursor: 'pointer', fontSize: 14, padding: '8px 0', fontFamily: "'DM Sans',sans-serif" }}
      >
        &larr; All tours
      </button>

      {tour.cover_image && (
        <div style={{ width: '100%', height: 200, borderRadius: 16, overflow: 'hidden', marginTop: 8, marginBottom: 16 }}>
          <img src={tour.cover_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: '#B485E8', marginBottom: 10 }}>
        {tour.stops.length} stops &middot; {tour.duration}
      </div>
      <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 30, fontWeight: 800, margin: '0 0 14px', lineHeight: 1.1 }}>
        {tour.title}
      </h1>
      <p style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(var(--text-rgb),.7)', marginBottom: 24 }}>
        {tour.description}
      </p>

      <button
        onClick={onStart}
        style={{
          width: '100%', padding: '16px', borderRadius: 12, border: 'none', cursor: 'pointer',
          background: '#B485E8', color: '#0F0C0A',
          fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 700, letterSpacing: '.02em',
          marginBottom: 28,
        }}
      >
        &#x25B6;&nbsp; Start Tour
      </button>

      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: 'rgba(var(--text-rgb),.5)', marginBottom: 12 }}>
        Stops
      </div>
      <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {tour.stops.map((stop, i) => (
          <li key={`${tour.slug}-${i}`} style={{ display: 'flex', gap: 12, padding: '12px 14px', background: 'rgba(var(--text-rgb),.04)', borderRadius: 10, border: '1px solid rgba(var(--text-rgb),.06)' }}>
            <div style={{ width: 28, height: 28, borderRadius: 14, background: '#B485E8', color: '#0F0C0A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
              {i + 1}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>
                {stop.name}
              </div>
              {stop.directions_to_next && i < tour.stops.length - 1 && (
                <div style={{ fontSize: 12, color: 'rgba(var(--text-rgb),.5)', lineHeight: 1.4 }}>
                  {stop.directions_to_next}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
