import { useState, useEffect } from 'react';
import { CATEGORY_COLORS } from '../constants/categories';
import type { Place, PlaceInsert } from '../types';

const IS: React.CSSProperties = { width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, color: '#F5F0E8', fontSize: 14, fontFamily: "'DM Sans',sans-serif", outline: 'none', boxSizing: 'border-box' };
const LS: React.CSSProperties = { fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'rgba(245,240,232,.4)', marginBottom: 4, display: 'block', fontFamily: "'DM Sans',sans-serif" };

interface Props {
  places: Place[];
  onAdd: (p: PlaceInsert) => Promise<void>;
  onUpdate: (id: string, u: Partial<PlaceInsert>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onClose: () => void;
}

const EMPTY: PlaceInsert = { name: '', category: 'eat', type: '', address: '', description: '', walk_time: '', lat: 29.951, lng: -90.058, image_url: '', is_featured: false, sort_order: 0 };

export function AdminPanel({ places, onAdd, onUpdate, onDelete, onClose }: Props) {
  const [editing, setEditing] = useState<(PlaceInsert & { id?: string }) | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [list, setList] = useState(places);

  useEffect(() => { setList(places); }, [places]);

  if (editing) {
    const f = editing;
    const set = (k: string, v: unknown) => setEditing({ ...f, [k]: v });

    const handleSave = async () => {
      if (f.id) {
        const { id: _, ...updates } = f;
        await onUpdate(f.id!, updates);
      } else {
        await onAdd(f);
      }
      setEditing(null);
    };

    return (
      <div style={{ padding: 20, maxHeight: '80vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: '#F5F0E8', margin: 0 }}>{f.id ? 'Edit Place' : 'Add New Place'}</h3>
          <button onClick={() => setEditing(null)} style={{ background: 'rgba(255,255,255,.08)', border: 'none', color: '#F5F0E8', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>Cancel</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div><label style={LS}>Name</label><input style={IS} value={f.name} onChange={e => set('name', e.target.value)} placeholder="Place name" /></div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}><label style={LS}>Category</label>
              <select style={{ ...IS, appearance: 'auto' as never }} value={f.category} onChange={e => set('category', e.target.value)}>
                <option value="eat">Eat & Drink</option><option value="shop">Shops & Culture</option><option value="history">History</option><option value="architecture">Architecture</option>
              </select></div>
            <div style={{ flex: 1 }}><label style={LS}>Type / Style</label><input style={IS} value={f.type} onChange={e => set('type', e.target.value)} placeholder="e.g. Pizza, Gothic" /></div>
          </div>
          <div><label style={LS}>Address</label><input style={IS} value={f.address} onChange={e => set('address', e.target.value)} placeholder="Street address" /></div>
          <div><label style={LS}>Description</label><textarea style={{ ...IS, minHeight: 80, resize: 'vertical' }} value={f.description} onChange={e => set('description', e.target.value)} placeholder="What makes this place special?" /></div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}><label style={LS}>Walk from Ferry</label><input style={IS} value={f.walk_time} onChange={e => set('walk_time', e.target.value)} placeholder="e.g. 5 min" /></div>
            <div style={{ flex: 1 }}><label style={LS}>Featured?</label>
              <button onClick={() => set('is_featured', !f.is_featured)} style={{ ...IS, cursor: 'pointer', textAlign: 'left', background: f.is_featured ? 'rgba(232,197,71,.15)' : 'rgba(255,255,255,.06)', borderColor: f.is_featured ? '#E8C547' : 'rgba(255,255,255,.1)', color: f.is_featured ? '#E8C547' : 'rgba(245,240,232,.5)' }}>
                {f.is_featured ? '\u2713 Yes' : '\u2717 No'}</button></div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}><label style={LS}>Latitude</label><input style={IS} type="number" step="0.0001" value={f.lat} onChange={e => set('lat', parseFloat(e.target.value) || 0)} /></div>
            <div style={{ flex: 1 }}><label style={LS}>Longitude</label><input style={IS} type="number" step="0.0001" value={f.lng} onChange={e => set('lng', parseFloat(e.target.value) || 0)} /></div>
          </div>
          <div><label style={LS}>Photo URL</label><input style={IS} value={f.image_url} onChange={e => set('image_url', e.target.value)} placeholder="https://..." />
            {f.image_url && <img src={f.image_url} alt="preview" style={{ marginTop: 8, width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, border: '1px solid rgba(255,255,255,.1)' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
          </div>
          <button onClick={handleSave} disabled={!f.name.trim()} style={{ width: '100%', padding: 14, background: '#E8C547', color: '#0F0C0A', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: f.name.trim() ? 'pointer' : 'not-allowed', fontFamily: "'DM Sans',sans-serif", opacity: f.name.trim() ? 1 : .4, marginBottom: 20 }}>
            {f.id ? 'Save Changes' : 'Add Place'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxHeight: '80vh', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, color: '#F5F0E8', margin: 0 }}>Manage Places</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setEditing({ ...EMPTY })} style={{ background: '#E8C547', border: 'none', color: '#0F0C0A', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>+ Add</button>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,.08)', border: 'none', color: '#F5F0E8', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>Done</button>
        </div>
      </div>
      <p style={{ fontSize: 12, color: 'rgba(245,240,232,.35)', marginBottom: 16, fontFamily: "'DM Sans',sans-serif" }}>{list.length} places total. Tap any entry to edit.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {list.map(place => {
          const co = CATEGORY_COLORS[place.category];
          return (
            <div key={place.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,.04)', borderRadius: 10, padding: '10px 12px', borderLeft: `3px solid ${co?.accent || '#666'}` }}>
              <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => setEditing({ ...place })}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#F5F0E8', fontFamily: "'DM Sans',sans-serif" }}>{place.name}</div>
                <div style={{ fontSize: 11, color: 'rgba(245,240,232,.4)', fontFamily: "'DM Sans',sans-serif" }}>{place.type} &middot; {place.walk_time} walk</div>
              </div>
              {confirmDelete === place.id ? (
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => { onDelete(place.id); setConfirmDelete(null); }} style={{ background: '#E87B6B', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans',sans-serif" }}>Delete</button>
                  <button onClick={() => setConfirmDelete(null)} style={{ background: 'rgba(255,255,255,.08)', border: 'none', color: '#F5F0E8', padding: '6px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontFamily: "'DM Sans',sans-serif" }}>Keep</button>
                </div>
              ) : (
                <button onClick={() => setConfirmDelete(place.id)} style={{ background: 'none', border: 'none', color: 'rgba(245,240,232,.25)', cursor: 'pointer', fontSize: 18, padding: '4px 8px', lineHeight: 1 }}>&times;</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
