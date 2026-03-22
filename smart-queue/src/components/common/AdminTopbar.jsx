import { Bell, Search, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function AdminTopbar({ title, subtitle }) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = now.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <header className="h-16 bg-surface-900/80 backdrop-blur-sm border-b border-surface-700 flex items-center px-6 gap-4 sticky top-0 z-30">
      <div className="flex-1 min-w-0">
        <h1 className="font-display font-700 text-white text-lg tracking-tight truncate">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 font-mono">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Time display */}
        <div className="hidden md:flex items-center gap-2 bg-surface-800 border border-surface-600 rounded-lg px-3 py-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse-slow" />
          <span className="font-mono text-xs text-slate-400">{dateStr}</span>
          <span className="font-mono text-xs text-accent-cyan">{timeStr}</span>
        </div>

        <button
          onClick={handleRefresh}
          className="p-2 rounded-lg bg-surface-800 border border-surface-600 text-slate-400 hover:text-accent-cyan hover:border-accent-cyan/30 transition-all duration-150"
          title="Refresh data"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin text-accent-cyan' : ''} />
        </button>

        <button className="relative p-2 rounded-lg bg-surface-800 border border-surface-600 text-slate-400 hover:text-accent-cyan hover:border-accent-cyan/30 transition-all duration-150">
          <Bell size={14} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent-red rounded-full" />
        </button>
      </div>
    </header>
  );
}
