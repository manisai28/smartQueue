import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Bell, Clock, Users, ChevronUp, Zap } from 'lucide-react';
import { fetchQueueStatus } from '@/services/api';
import { SERVICES } from '@/data/mockData';

const MY_TOKEN = 157;

export default function TrackQueue() {
  const location = useLocation();
  const stateToken = location.state?.token || MY_TOKEN;
  const stateService = location.state?.service || SERVICES[0];

  const [selected, setSelected] = useState(stateService.id);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myToken] = useState(stateToken);
  const intervalRef = useRef(null);

  const fetchStatus = async () => {
    const data = await fetchQueueStatus(selected);
    setStatus(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStatus();
    intervalRef.current = setInterval(fetchStatus, 8000);
    return () => clearInterval(intervalRef.current);
  }, [selected]);

  const ahead = status ? Math.max(0, myToken - status.currentToken - 1) : '—';
  const estimatedWait = status ? ahead * status.avgWaitTime : 0;
  const isNext = status && myToken === status.currentToken + 1;
  const isServing = status && myToken === status.currentToken;

  return (
    <div className="min-h-screen bg-surface-950 grid-bg px-4 py-8">
      <div className="max-w-lg mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 mb-8 text-sm transition-colors">
          <ArrowLeft size={14} /> Back
        </Link>

        {/* Service Selector */}
        <div className="mb-6">
          <label className="label mb-2 block">Select Service</label>
          <select
            className="select-field"
            value={selected}
            onChange={e => setSelected(e.target.value)}
          >
            {SERVICES.map(s => (
              <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
            ))}
          </select>
        </div>

        {isServing && (
          <div className="card p-4 border-accent-green/40 bg-accent-green/5 shadow-glow-green mb-4 flex items-center gap-3 animate-slide-in">
            <Zap size={20} className="text-accent-green" />
            <div>
              <p className="font-display font-600 text-accent-green">Now serving your token!</p>
              <p className="text-xs text-slate-400">Please proceed to the counter.</p>
            </div>
          </div>
        )}

        {isNext && !isServing && (
          <div className="card p-4 border-accent-amber/40 bg-accent-amber/5 mb-4 flex items-center gap-3 animate-slide-in">
            <Bell size={20} className="text-accent-amber" />
            <div>
              <p className="font-display font-600 text-accent-amber">You're next!</p>
              <p className="text-xs text-slate-400">Please be ready at the counter.</p>
            </div>
          </div>
        )}

        {/* Main Token Card */}
        <div className={`card p-8 mb-4 text-center ${isServing ? 'border-accent-green/40 shadow-glow-green' : isNext ? 'border-accent-amber/30' : 'border-surface-600'}`}>
          <p className="label mb-4">Your Token Number</p>
          <div className={`token-display mb-2 ${isServing ? 'text-accent-green' : isNext ? 'text-accent-amber' : 'text-accent-cyan'}`}>
            #{myToken}
          </div>
          <p className="text-xs font-mono text-slate-500">
            {status?.serviceName || stateService.name}
          </p>
        </div>

        {/* Status Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={14} className="text-accent-cyan" />
              <p className="label">Now Serving</p>
            </div>
            <p className="text-3xl font-display font-700 text-accent-cyan">
              #{loading ? '—' : status?.currentToken}
            </p>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-2">
              <ChevronUp size={14} className="text-accent-amber" />
              <p className="label">Ahead of You</p>
            </div>
            <p className="text-3xl font-display font-700 text-accent-amber">
              {loading ? '—' : ahead}
            </p>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={14} className="text-accent-green" />
              <p className="label">Est. Wait</p>
            </div>
            <p className="text-3xl font-display font-700 text-accent-green">
              {loading ? '—' : `${estimatedWait}m`}
            </p>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-2">
              <Users size={14} className="text-slate-400" />
              <p className="label">Total Waiting</p>
            </div>
            <p className="text-3xl font-display font-700 text-slate-300">
              {loading ? '—' : status?.totalWaiting}
            </p>
          </div>
        </div>

        <button
          onClick={fetchStatus}
          className="btn-secondary w-full flex items-center justify-center gap-2"
        >
          <RefreshCw size={14} />
          Refresh Status
        </button>

        <p className="text-center text-xs font-mono text-slate-600 mt-4">
          Auto-refreshes every 8 seconds
        </p>
      </div>
    </div>
  );
}
