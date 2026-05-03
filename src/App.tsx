import { useState } from 'react';
import { usePlaces } from './hooks/usePlaces';
import { Hero } from './components/Hero';
import { CategoryStrip } from './components/CategoryStrip';
import { PlaceCard } from './components/PlaceCard';
import { DetailSheet } from './components/DetailSheet';
import { MapView } from './components/MapView';
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

export default function App() {
  const { places } = usePlaces();
  const [activeCategory, setActiveCategory] = useState<'all' | PlaceCategory>('all');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [view, setView] = useState<'list' | 'map'>('list');

  const filtered = activeCategory === 'all' ? places : places.filter(p => p.category === activeCategory);
  const catCounts: Record<string, number> = { all: places.length };
  (['eat', 'shop', 'history', 'architecture'] as PlaceCategory[]).forEach(c => {
    catCounts[c] = places.filter(p => p.category === c).length;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#0F0C0A}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
      `}</style>

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
              </div>
            </div>
          )}
        </div>

        {selectedPlace && <DetailSheet place={selectedPlace} onClose={() => setSelectedPlace(null)} />}
      </div>
    </>
  );
}
