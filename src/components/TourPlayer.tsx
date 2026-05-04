import { useEffect, useRef, useState } from 'react';
import type { Tour } from '../types';

interface Props {
  tour: Tour;
  stopIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onEnd: () => void;
}

function fmt(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function TourPlayer({ tour, stopIndex, onPrev, onNext, onEnd }: Props) {
  const stop = tour.stops[stopIndex];
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  // Auto-pause + reset when changing stops; user has to hit play.
  useEffect(() => {
    setPlaying(false);
    setPosition(0);
    setDuration(0);
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
  }, [stopIndex, tour.slug]);

  const togglePlay = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = audioRef.current;
    if (!el) return;
    const t = Number(e.target.value);
    el.currentTime = t;
    setPosition(t);
  };

  const atFirst = stopIndex === 0;
  const atLast = stopIndex === tour.stops.length - 1;

  return (
    <div style={{
      flexShrink: 0,
      background: 'rgba(var(--bg-rgb),.97)', backdropFilter: 'blur(14px)',
      borderTop: '1px solid rgba(var(--text-rgb),.08)',
      padding: '12px 16px 16px',
      animation: 'slideUp .3s cubic-bezier(.16,1,.3,1)',
      position: 'relative',
      zIndex: 100,
    }}>
      {stop.audio && (
        <audio
          ref={audioRef}
          src={stop.audio}
          onLoadedMetadata={e => setDuration((e.target as HTMLAudioElement).duration)}
          onTimeUpdate={e => setPosition((e.target as HTMLAudioElement).currentTime)}
          onEnded={() => setPlaying(false)}
          preload="metadata"
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#B485E8', marginBottom: 2 }}>
            Stop {stopIndex + 1} of {tour.stops.length}
          </div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 17, fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {stop.name}
          </div>
        </div>
        <button
          onClick={onEnd}
          aria-label="End tour"
          style={{ background: 'transparent', border: 'none', color: 'rgba(var(--text-rgb),.5)', fontSize: 13, cursor: 'pointer', padding: '6px 8px', fontFamily: "'DM Sans',sans-serif", flexShrink: 0 }}
        >
          &times; End
        </button>
      </div>

      {!stop.audio && (
        <div style={{ fontSize: 12, color: 'rgba(var(--text-rgb),.45)', padding: '8px 0' }}>
          No audio recorded for this stop yet.
        </div>
      )}

      {stop.audio && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4, marginBottom: 8 }}>
          <span style={{ fontSize: 11, color: 'rgba(var(--text-rgb),.5)', fontVariantNumeric: 'tabular-nums', minWidth: 36 }}>{fmt(position)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={position}
            onChange={seek}
            style={{ flex: 1, accentColor: '#B485E8' }}
          />
          <span style={{ fontSize: 11, color: 'rgba(var(--text-rgb),.5)', fontVariantNumeric: 'tabular-nums', minWidth: 36, textAlign: 'right' }}>{fmt(duration)}</span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14 }}>
        <button
          onClick={onPrev}
          disabled={atFirst}
          aria-label="Previous stop"
          style={{ background: 'rgba(var(--text-rgb),.06)', border: 'none', color: atFirst ? 'rgba(var(--text-rgb),.25)' : 'var(--text)', width: 44, height: 44, borderRadius: 22, cursor: atFirst ? 'default' : 'pointer', fontSize: 16, lineHeight: 1 }}
        >
          &#x23EE;
        </button>
        <button
          onClick={togglePlay}
          disabled={!stop.audio}
          aria-label={playing ? 'Pause' : 'Play'}
          style={{ background: '#B485E8', border: 'none', color: '#0F0C0A', width: 56, height: 56, borderRadius: 28, cursor: stop.audio ? 'pointer' : 'default', fontSize: 22, lineHeight: 1, opacity: stop.audio ? 1 : 0.4 }}
        >
          {playing ? '\u23F8' : '\u25B6'}
        </button>
        <button
          onClick={onNext}
          disabled={atLast}
          aria-label="Next stop"
          style={{ background: 'rgba(var(--text-rgb),.06)', border: 'none', color: atLast ? 'rgba(var(--text-rgb),.25)' : 'var(--text)', width: 44, height: 44, borderRadius: 22, cursor: atLast ? 'default' : 'pointer', fontSize: 16, lineHeight: 1 }}
        >
          &#x23ED;
        </button>
      </div>

      {stop.directions_to_next && !atLast && (
        <div style={{ marginTop: 10, padding: '10px 12px', background: 'rgba(180,133,232,.1)', borderLeft: '3px solid #B485E8', borderRadius: 6, fontSize: 13, color: 'rgba(var(--text-rgb),.75)', lineHeight: 1.5 }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: '#B485E8', marginBottom: 4 }}>To next stop</div>
          {stop.directions_to_next}
        </div>
      )}
    </div>
  );
}
