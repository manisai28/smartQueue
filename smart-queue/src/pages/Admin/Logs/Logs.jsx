import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, RefreshCw, Download, X } from 'lucide-react';
import AdminTopbar from '@/components/common/AdminTopbar';
import { fetchLogs } from '@/services/api';
import { format } from 'date-fns';
import { clsx } from 'clsx';
import Loader from '@/components/common/Loader';

const LEVEL_STYLES = {
  INFO: 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20',
  WARN: 'text-accent-amber bg-accent-amber/10 border-accent-amber/20',
  ERROR: 'text-accent-red bg-accent-red/10 border-accent-red/20',
  DEBUG: 'text-slate-400 bg-surface-700 border-surface-600',
};

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [serviceFilter, setServiceFilter] = useState('ALL');
  const [selectedLog, setSelectedLog] = useState(null);

  const refresh = () => {
    setLoading(true);
    fetchLogs().then(d => { setLogs(d); setLoading(false); });
  };

  useEffect(() => { refresh(); }, []);

  const services = useMemo(() => ['ALL', ...new Set(logs.map(l => l.service))], [logs]);

  const filtered = useMemo(() => logs.filter(l => {
    const matchSearch = !search || l.message.toLowerCase().includes(search.toLowerCase()) || l.service.includes(search) || l.traceId.includes(search.toUpperCase());
    const matchLevel = levelFilter === 'ALL' || l.level === levelFilter;
    const matchService = serviceFilter === 'ALL' || l.service === serviceFilter;
    return matchSearch && matchLevel && matchService;
  }), [logs, search, levelFilter, serviceFilter]);

  const levelCounts = useMemo(() => {
    const counts = { INFO: 0, WARN: 0, ERROR: 0, DEBUG: 0 };
    logs.forEach(l => { if (counts[l.level] !== undefined) counts[l.level]++; });
    return counts;
  }, [logs]);

  return (
    <div className="flex flex-col flex-1">
      <AdminTopbar title="Logs" subtitle="Structured log viewer · ELK-style interface" />
      <main className="flex-1 p-6 flex flex-col gap-4 animate-fade-in min-h-0">

        {/* Stats Bar */}
        <div className="flex items-center gap-3 flex-wrap">
          {Object.entries(levelCounts).map(([level, count]) => (
            <button
              key={level}
              onClick={() => setLevelFilter(levelFilter === level ? 'ALL' : level)}
              className={clsx(
                'badge border cursor-pointer transition-all',
                LEVEL_STYLES[level],
                levelFilter === level ? 'opacity-100 ring-1 ring-current' : 'opacity-70 hover:opacity-100'
              )}
            >
              {level} <span className="ml-1 font-700">{count}</span>
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500">{filtered.length} / {logs.length} entries</span>
            <button onClick={refresh} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-surface-700 transition-all">
              <RefreshCw size={13} />
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search logs, trace IDs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-9 py-2.5 text-sm"
            />
          </div>
          <select
            value={serviceFilter}
            onChange={e => setServiceFilter(e.target.value)}
            className="select-field w-auto text-sm py-2.5"
          >
            {services.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {(search || levelFilter !== 'ALL' || serviceFilter !== 'ALL') && (
            <button
              onClick={() => { setSearch(''); setLevelFilter('ALL'); setServiceFilter('ALL'); }}
              className="flex items-center gap-1.5 btn-secondary py-2 px-3 text-xs"
            >
              <X size={12} /> Clear filters
            </button>
          )}
        </div>

        {/* Log Table */}
        {loading ? <Loader text="Fetching logs..." /> : (
          <div className="card overflow-hidden flex-1 flex flex-col min-h-0">
            <div className="overflow-auto flex-1">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-surface-800 z-10">
                  <tr className="border-b border-surface-700">
                    <th className="label text-left px-4 py-3 w-40">Timestamp</th>
                    <th className="label text-left px-4 py-3 w-36">Service</th>
                    <th className="label text-left px-4 py-3 w-20">Level</th>
                    <th className="label text-left px-4 py-3">Message</th>
                    <th className="label text-left px-4 py-3 w-24">Trace ID</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(log => (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
                      className={clsx(
                        'border-b border-surface-700/40 cursor-pointer transition-colors',
                        selectedLog?.id === log.id ? 'bg-surface-700' : 'hover:bg-surface-700/50'
                      )}
                    >
                      <td className="px-4 py-2.5 font-mono text-slate-500 whitespace-nowrap">
                        {format(new Date(log.timestamp), 'HH:mm:ss.SSS')}
                      </td>
                      <td className="px-4 py-2.5 font-mono text-slate-400">{log.service}</td>
                      <td className="px-4 py-2.5">
                        <span className={clsx('badge border text-xs py-0.5 px-2', LEVEL_STYLES[log.level])}>
                          {log.level}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-slate-300 font-body max-w-xs">{log.message}</td>
                      <td className="px-4 py-2.5 font-mono text-slate-600">{log.traceId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Expanded Log Detail */}
            {selectedLog && (
              <div className="border-t border-surface-600 bg-surface-700/50 p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-mono text-accent-cyan">Log Detail</p>
                  <button onClick={() => setSelectedLog(null)} className="text-slate-500 hover:text-slate-300">
                    <X size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  {[
                    { label: 'timestamp', value: selectedLog.timestamp },
                    { label: 'service', value: selectedLog.service },
                    { label: 'level', value: selectedLog.level },
                    { label: 'trace_id', value: selectedLog.traceId },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="font-mono text-slate-600 mb-0.5">{label}</p>
                      <p className="font-mono text-slate-300">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <p className="font-mono text-slate-600 text-xs mb-1">message</p>
                  <p className="font-mono text-accent-green text-xs bg-surface-800 rounded p-2">{selectedLog.message}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
