import { clsx } from 'clsx';
import { TrendingUp, TrendingDown } from 'lucide-react';

const colorMap = {
  cyan: {
    glow: 'shadow-glow-cyan',
    border: 'hover:border-accent-cyan/30',
    text: 'text-accent-cyan',
    bg: 'bg-accent-cyan/5',
    dot: 'bg-accent-cyan',
  },
  green: {
    glow: 'shadow-glow-green',
    border: 'hover:border-accent-green/30',
    text: 'text-accent-green',
    bg: 'bg-accent-green/5',
    dot: 'bg-accent-green',
  },
  amber: {
    glow: 'shadow-glow-amber',
    border: 'hover:border-accent-amber/30',
    text: 'text-accent-amber',
    bg: 'bg-accent-amber/5',
    dot: 'bg-accent-amber',
  },
  red: {
    glow: 'shadow-glow-red',
    border: 'hover:border-accent-red/30',
    text: 'text-accent-red',
    bg: 'bg-accent-red/5',
    dot: 'bg-accent-red',
  },
  purple: {
    glow: '',
    border: 'hover:border-accent-purple/30',
    text: 'text-accent-purple',
    bg: 'bg-accent-purple/5',
    dot: 'bg-accent-purple',
  },
};

export default function StatCard({ label, value, unit, icon: Icon, color = 'cyan', trend, trendLabel, sublabel }) {
  const c = colorMap[color] || colorMap.cyan;
  const isPositive = trend > 0;

  return (
    <div className={clsx('stat-card transition-all duration-200 group', c.border, c.glow)}>
      {/* Background accent */}
      <div className={clsx('absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl', c.bg)} />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <span className="label">{label}</span>
          <div className={clsx('p-2 rounded-lg', c.bg)}>
            <Icon size={16} className={c.text} />
          </div>
        </div>

        <div className="flex items-baseline gap-2 mt-2">
          <span className={clsx('value-xl', c.text)}>{value}</span>
          {unit && <span className="text-slate-500 text-sm font-mono">{unit}</span>}
        </div>

        {sublabel && (
          <p className="text-xs text-slate-500 font-body mt-1">{sublabel}</p>
        )}

        {trend !== undefined && (
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-surface-600">
            <div className={clsx('flex items-center gap-1 text-xs font-mono', isPositive ? 'text-accent-green' : 'text-accent-red')}>
              {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>{Math.abs(trend)}%</span>
            </div>
            <span className="text-xs text-slate-600">{trendLabel || 'vs last hour'}</span>
          </div>
        )}
      </div>

      {/* Decorative corner dot */}
      <div className={clsx('absolute top-4 right-4 w-1.5 h-1.5 rounded-full animate-pulse-slow', c.dot)} />
    </div>
  );
}
