import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { usePlaces } from './hooks/usePlaces';
import { useAdmin } from './hooks/useAdmin';
import { Hero } from './components/Hero';
import { CategoryStrip } from './components/CategoryStrip';
import { PlaceCard } from './components/PlaceCard';
import { DetailSheet } from './components/DetailSheet';
import { MapView } from './components/MapView';
import { AdminPanel } from './components/AdminPanel';
import { CATEGORY_COLORS } from './constants/categories';
import type { Place, PlaceCategory } from './types';

function SectionHeader({ label, sub, color = '#F5F0E8' }: { label: string; sub?: string; color?: string }) {
  return (
    <div style={{ padding: '20px 0 4px' }}>
      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color, margin: 0, lineHeight: 1.2 }}>{label}</h2>
      {sub && <span style={{ fontSize: 12, color: 'rgba(245,240,232,.3)' }}>{sub}</span>}
    </div>
  );
}

function Guide() {
  const { places, loading, add, update, remove } = usePlaces();
  const { isAdmin, login, logout } = useAdmin();
  const [activeCategory, setActiveCategory] = useState<'all' | PlaceCategory>('all');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [view, setView] = useState<'list' | 'map'>('list');
  const [showAdmin, setShowAdmin] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [loginSent, setLoginSent] = useState(false);

  const filtered = activeCategory === 'all' ? places : places.filter(p => p.category === activeCategory);
  const catCounts: Record<string, number> = { all: places.length };
  (['eat', 'shop', 'history', 'architecture'] as PlaceCategory[]).forEach(c => {
    catCounts[c] = places.filter(p => p.category === c).length;
  });

  const handleLogin = async () => {
    try { await login(loginEmail); setLoginSent(true); } catch { /* error handled by auth service */ }
  };

  if (loading) return <div style={{ height: '100vh', background: '#0F0C0A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(245,240,232,.4)', fontFamily: "'DM Sans',sans-serif" }}>Loading...</div>;

  return (
    <div style={{ width: '100%', height: '100vh', background: '#0F0C0A', color: '#F5F0E8', fontFamily: "'DM Sans',sans-serif", display: 'flex', flexDirection: 'column', position: 'relative' }}>

      {/* Top bar */}
      <div style={{ flexShrink: 0, background: 'rgba(15,12,10,.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(245,240,232,.06)', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 50 }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 700 }}>Algiers Point</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['list', 'map'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{ background: view === v ? 'rgba(245,240,232,.12)' : 'transparent', border: 'none', color: view === v ? '#F5F0E8' : 'rgba(245,240,232,.35)', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans',sans-serif", transition: 'all .2s' }}>
              {v === 'list' ? 'Guide' : 'Map'}
            </button>
          ))}
        </div>
      </div>

      <CategoryStrip active={activeCategory} onChange={setActiveCategory} counts={catCounts} />

      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {view === 'map' ? (
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <MapView places={places} activeCategory={activeCategory} onSelect={setSelectedPlace} />
            <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, background: 'rgba(15,12,10,.85)', backdropFilter: 'blur(8px)', borderRadius: 12, padding: '12px 16px', border: '1px solid rgba(245,240,232,.08)' }}>
              <div style={{ fontSize: 11, color: 'rgba(245,240,232,.5)', marginBottom: 4 }}>Tap a marker for details</div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {Object.entries(CATEGORY_COLORS).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, background: v.marker }} />
                    <span style={{ fontSize: 11, color: 'rgba(245,240,232,.6)', textTransform: 'capitalize' }}>{k === 'eat' ? 'Eat & Drink' : k}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ width: '100%', height: '100%', overflowY: 'auto' }}>
            <Hero />
            <div style={{ padding: '0 20px 100px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {activeCategory === 'all' ? (<>
                <SectionHeader label="Right Off the Ferry" sub="Start your walk here" />
                {places.filter(p => p.is_featured).map((p, i) => <PlaceCard key={p.id} place={p} index={i} onClick={() => setSelectedPlace(p)} />)}
                <SectionHeader label="Eat & Drink" sub={`${catCounts.eat} spots`} color="#E8C547" />
                {places.filter(p => p.category === 'eat' && !p.is_featured).map((p, i) => <PlaceCard key={p.id} place={p} index={i + 2} onClick={() => setSelectedPlace(p)} />)}
                <SectionHeader label="Shops & Culture" sub={`${catCounts.shop} spots`} color="#E87B6B" />
                {places.filter(p => p.category === 'shop').map((p, i) => <PlaceCard key={p.id} place={p} index={i + 12} onClick={() => setSelectedPlace(p)} />)}
                <SectionHeader label="History" sub={`${catCounts.history} spots`} color="#6BB8E8" />
                {places.filter(p => p.category === 'history' && !p.is_featured).map((p, i) => <PlaceCard key={p.id} place={p} index={i + 14} onClick={() => setSelectedPlace(p)} />)}
                <SectionHeader label="Architecture" sub={`${catCounts.architecture} spots`} color="#C49A6C" />
                {places.filter(p => p.category === 'architecture').map((p, i) => <PlaceCard key={p.id} place={p} index={i + 18} onClick={() => setSelectedPlace(p)} />)}
              </>) : (
                filtered.map((p, i) => <PlaceCard key={p.id} place={p} index={i} onClick={() => setSelectedPlace(p)} />)
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '0 24px 40px', textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'rgba(245,240,232,.25)', lineHeight: 1.6 }}>
                Made for <a href="https://algierspoint.org" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(245,240,232,.4)' }}>algierspoint.org</a>
                <br />
                <span style={{ fontSize: 10, color: 'rgba(245,240,232,.15)' }}>Built by Point Forge Labs</span>
              </div>
              {!isAdmin && (
                <button onClick={() => setShowLogin(true)} style={{ background: 'none', border: 'none', color: 'rgba(245,240,232,.1)', fontSize: 10, cursor: 'pointer', marginTop: 8, fontFamily: "'DM Sans',sans-serif" }}>Admin</button>
              )}
              {isAdmin && (
                <div style={{ marginTop: 8, display: 'flex', gap: 8, justifyContent: 'center' }}>
                  <button onClick={() => setShowAdmin(true)} style={{ background: 'rgba(232,197,71,.15)', border: '1px solid rgba(232,197,71,.3)', color: '#E8C547', padding: '6px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontFamily: "'DM Sans',sans-serif" }}>Manage Places</button>
                  <button onClick={logout} style={{ background: 'rgba(255,255,255,.06)', border: 'none', color: 'rgba(245,240,232,.4)', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 11, fontFamily: "'DM Sans',sans-serif" }}>Sign Out</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Admin panel overlay */}
      {showAdmin && isAdmin && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(15,12,10,.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={() => setShowAdmin(false)}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 480, background: '#1A1714', borderRadius: '24px 24px 0 0', animation: 'slideUp .35s cubic-bezier(.16,1,.3,1)', maxHeight: '90vh', overflow: 'hidden' }}>
            <AdminPanel places={places} onAdd={add} onUpdate={update} onDelete={remove} onClose={() => setShowAdmin(false)} />
          </div>
        </div>
      )}

      {/* Login modal */}
      {showLogin && !isAdmin && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(15,12,10,.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => { setShowLogin(false); setLoginSent(false); }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#1A1714', borderRadius: 20, padding: '32px 28px', width: '90%', maxWidth: 320, textAlign: 'center', animation: 'fadeInUp .3s cubic-bezier(.16,1,.3,1)' }}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: '#F5F0E8', marginBottom: 8 }}>Admin Access</h3>
            {loginSent ? (
              <p style={{ fontSize: 14, color: 'rgba(245,240,232,.7)', lineHeight: 1.5 }}>Check your email for the login link.</p>
            ) : (<>
              <p style={{ fontSize: 12, color: 'rgba(245,240,232,.4)', marginBottom: 20 }}>Enter your admin email</p>
              <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleLogin(); }}
                style={{ width: '100%', padding: 14, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, color: '#F5F0E8', fontSize: 14, fontFamily: "'DM Sans',sans-serif", outline: 'none', boxSizing: 'border-box' }} placeholder="you@email.com" autoFocus />
              <button onClick={handleLogin} style={{ width: '100%', padding: 14, background: '#E8C547', color: '#0F0C0A', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", marginTop: 12 }}>Send Magic Link</button>
            </>)}
          </div>
        </div>
      )}

      {selectedPlace && <DetailSheet place={selectedPlace} onClose={() => setSelectedPlace(null)} />}
    </div>
  );
}

function AdminRedirect() {
  // Handle magic link redirect - Supabase processes the token automatically
  return <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#0F0C0A}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      `}</style>
      <Routes>
        <Route path="/" element={<Guide />} />
        <Route path="/admin" element={<AdminRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
