const PALETTES = [
  { bg: '#E8DFD0', accent: '#C4A882', pattern: '#D4C9B8' },
  { bg: '#D4E1D4', accent: '#8BA888', pattern: '#C2D4C2' },
  { bg: '#D8DDE8', accent: '#8B96AA', pattern: '#C8CDD8' },
  { bg: '#E8E0D0', accent: '#B8A080', pattern: '#D8D0C0' },
  { bg: '#E0D8E8', accent: '#A090B0', pattern: '#D0C8D8' },
  { bg: '#D8E8E0', accent: '#80B0A0', pattern: '#C8D8D0' },
];

export default function RoomPlaceholder({ name, variant = 0 }: { name: string; variant?: number }) {
  const p = PALETTES[variant % PALETTES.length];
  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ background: p.bg }}>
      <svg viewBox="0 0 400 300" className="w-4/5 h-4/5 opacity-50">
        <rect x="140" y="40" width="120" height="100" rx="4" fill="none" stroke={p.accent} strokeWidth="2" />
        <line x1="200" y1="40" x2="200" y2="140" stroke={p.accent} strokeWidth="1" />
        <line x1="140" y1="90" x2="260" y2="90" stroke={p.accent} strokeWidth="1" />
        <rect x="80" y="170" width="240" height="80" rx="8" fill={p.pattern} stroke={p.accent} strokeWidth="2" />
        <rect x="90" y="175" width="100" height="35" rx="4" fill={p.bg} stroke={p.accent} strokeWidth="1" />
        <rect x="210" y="175" width="100" height="35" rx="4" fill={p.bg} stroke={p.accent} strokeWidth="1" />
        <line x1="40" y1="260" x2="360" y2="260" stroke={p.accent} strokeWidth="1" opacity="0.5" />
      </svg>
      <span className="absolute bottom-4 text-xs tracking-wider opacity-40" style={{ color: p.accent }}>{name}</span>
    </div>
  );
}
