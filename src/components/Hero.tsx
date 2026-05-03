export function Hero() {
  return (
    <div style={{ padding: '36px 24px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -20, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle,rgba(232,197,71,.08) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: '#E8C547', marginBottom: 12, animation: 'fadeInUp .5s cubic-bezier(.16,1,.3,1) 0s both' }}>
        Est. 1719 &middot; National Historic District
      </div>
      <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 38, fontWeight: 800, lineHeight: 1.05, margin: '0 0 14px', animation: 'fadeInUp .5s cubic-bezier(.16,1,.3,1) .08s both' }}>
        Welcome to<br />
        <span style={{ background: 'linear-gradient(135deg,#E8C547,#C49A6C,#E87B6B)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'shimmer 4s linear infinite' }}>
          Algiers Point
        </span>
      </h1>
      <p style={{ fontSize: 14, lineHeight: 1.65, color: 'rgba(var(--text-rgb),.6)', maxWidth: 360, animation: 'fadeInUp .5s cubic-bezier(.16,1,.3,1) .15s both' }}>
        New Orleans' second-oldest neighborhood, just a ferry ride from Canal Street. Stroll past Victorian cottages, grab a bite, and discover where jazz was born.
      </p>
      <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(var(--text-rgb),.06)', border: '1px solid rgba(var(--text-rgb),.08)', borderRadius: 100, padding: '8px 16px', animation: 'fadeInUp .5s cubic-bezier(.16,1,.3,1) .22s both' }}>
        <span style={{ fontSize: 16 }}>&#x26F4;</span>
        <span style={{ fontSize: 12, color: 'rgba(var(--text-rgb),.7)' }}>Ferry every 30 min</span>
      </div>
    </div>
  );
}
