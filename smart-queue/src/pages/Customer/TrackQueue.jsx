import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Bell, Clock, Users, ChevronUp, Zap, Loader2 } from 'lucide-react';
import { fetchQueueStatus, trackMyQueue } from '@/services/api';
import { SERVICES } from '@/data/mockData';

export default function TrackQueue() {
  const [searchParams] = useSearchParams();
  const urlServiceId = searchParams.get('serviceId');
  const urlToken = searchParams.get('token');

  const [selected, setSelected] = useState(urlServiceId ? parseInt(urlServiceId) : 1);
  const [myToken, setMyToken] = useState(urlToken || '');
  const [tokenInput, setTokenInput] = useState(urlToken || '');
  const [status, setStatus] = useState(null);
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState(false);
  const intervalRef = useRef(null);

  const fetchData = async () => {
    if (!myToken) return;
    
    setTracking(true);
    try {
      // Get queue status for the service
      const queueStatus = await fetchQueueStatus(selected);
      setStatus(queueStatus);
      
      // Track your specific token
      const trackResult = await trackMyQueue(selected, myToken);
      setQueueData(trackResult);
    } catch (error) {
      console.error('Fetch failed:', error);
    } finally {
      setLoading(false);
      setTracking(false);
    }
  };

  const handleTrack = () => {
    if (!tokenInput) return;
    setMyToken(tokenInput);
    setLoading(true);
    fetchData();
  };

  useEffect(() => {
    if (myToken) {
      fetchData();
      intervalRef.current = setInterval(fetchData, 8000);
      return () => clearInterval(intervalRef.current);
    } else {
      setLoading(false);
    }
  }, [selected, myToken]);

  const ahead = queueData?.peopleAhead ?? (status ? Math.max(0, parseInt(myToken) - status.currentToken - 1) : '—');
  const estimatedWait = queueData?.estimatedWait ?? (status ? ahead * status.avgWaitTime : 0);
  const isNext = queueData?.position === 1 || (status && parseInt(myToken) === status.currentToken + 1);
  const isServing = queueData?.status === 'serving' || (status && parseInt(myToken) === status.currentToken);

  // If no token entered yet, show input form
  if (!myToken && !urlToken) {
    return (
      <div className="min-h-screen bg-surface-950 grid-bg px-4 py-8">
        <div className="max-w-lg mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 mb-8 text-sm transition-colors">
            <ArrowLeft size={14} /> Back
          </Link>

          <div className="card p-8 text-center">
            <Zap size={40} className="text-accent-cyan mx-auto mb-4" />
            <h1 className="font-display font-700 text-2xl text-white mb-2">Track Your Token</h1>
            <p className="text-slate-400 mb-6">Enter your token number to check your queue position</p>
            
            <div className="mb-6">
              <label className="label mb-2 block">Select Service</label>
              <select
                className="select-field mb-4"
                value={selected}
                onChange={e => setSelected(parseInt(e.target.value))}
              >
                {SERVICES.map(s => (
                  <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
                ))}
              </select>
              
              <label className="label mb-2 block">Token Number</label>
              <input
                type="text"
                value={tokenInput}
                onChange={e => setTokenInput(e.target.value.toUpperCase())}
                placeholder="e.g., B101, H202"
                className="w-full px-4 py-3 bg-surface-800 border border-surface-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan"
              />
            </div>
            
            <button
              onClick={handleTrack}
              disabled={!tokenInput}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              <ChevronUp size={18} /> Track My Token
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            onChange={e => setSelected(parseInt(e.target.value))}
          >
            {SERVICES.map(s => (
              <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
            ))}
          </select>
        </div>

        {loading && !queueData ? (
          <div className="flex justify-center py-12">
            <Loader2 size={32} className="animate-spin text-accent-cyan" />
          </div>
        ) : (
          <>
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
                {status?.serviceName || SERVICES.find(s => s.id === selected)?.name}
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
                  #{queueData?.currentServing || status?.currentToken || '—'}
                </p>
              </div>
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <ChevronUp size={14} className="text-accent-amber" />
                  <p className="label">Ahead of You</p>
                </div>
                <p className="text-3xl font-display font-700 text-accent-amber">
                  {ahead}
                </p>
              </div>
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={14} className="text-accent-green" />
                  <p className="label">Est. Wait</p>
                </div>
                <p className="text-3xl font-display font-700 text-accent-green">
                  {estimatedWait}m
                </p>
              </div>
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Users size={14} className="text-slate-400" />
                  <p className="label">Total Waiting</p>
                </div>
                <p className="text-3xl font-display font-700 text-slate-300">
                  {queueData?.queueLength || status?.totalWaiting || '—'}
                </p>
              </div>
            </div>

            <button
              onClick={fetchData}
              disabled={tracking}
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              {tracking ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
              Refresh Status
            </button>

            <p className="text-center text-xs font-mono text-slate-600 mt-4">
              Auto-refreshes every 8 seconds
            </p>
          </>
        )}
      </div>
    </div>
  );
}