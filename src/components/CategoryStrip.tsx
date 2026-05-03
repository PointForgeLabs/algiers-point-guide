import { CATEGORIES } from '../constants/categories';
import type { PlaceCategory } from '../types';

interface Props {
  active: string;
  onChange: (id: 'all' | PlaceCategory) => void;
  counts: Record<string, number>;
}

export function CategoryStrip({ active, onChange, counts }: Props) {
  return (
    <div style={{ flexShrink: 0, display: 'flex', gap: 8, padding: '12px 20px', overflowX: 'auto', background: 'rgba(var(--bg-rgb),.9)', borderBottom: '1px solid rgba(var(--text-rgb),.04)' }}>
      {CATEGORIES.map(cat => {
        const isActive = active === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            style={{
              padding: '8px 16px', borderRadius: 100, fontSize: 12, border: 'none', cursor: 'pointer',
              fontWeight: isActive ? 700 : 500, whiteSpace: 'nowrap', transition: 'all .25s',
              fontFamily: "'DM Sans',sans-serif",
              background: isActive ? 'var(--text)' : 'rgba(var(--text-rgb),.06)',
              color: isActive ? 'var(--bg)' : 'rgba(var(--text-rgb),.55)',
            }}
          >
            {cat.icon} {cat.label} <span style={{ marginLeft: 4, fontSize: 10, opacity: .5 }}>{counts[cat.id] ?? 0}</span>
          </button>
        );
      })}
    </div>
  );
}
