import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Loader2, ChevronRight, Users, Clock } from 'lucide-react';
import { fetchServices, joinQueue } from '@/services/api';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function JoinQueue() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [joining, setJoining] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchServices().then(data => {
      setServices(data);
      setLoading(false);
    });
  }, []);

  const handleJoin = async () => {
    if (!selected) return;
    setJoining(true);
    try {
      const res = await joinQueue(selected, user?.id, user?.name);
      setResult(res);
    } catch (error) {
      console.error('Join failed:', error);
      // Show error toast or message
    } finally {
      setJoining(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-surface-950 grid-bg flex items-center justify-center px-4">
        <div className="max-w-md w-full animate-slide-in">
          <div className="card p-8 text-center border-accent-green/30 shadow-glow-green">
            <div className="w-16 h-16 bg-accent-green/15 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} className="text-accent-green" />
            </div>
            <p className="label mb-2">You're in the queue!</p>
            <div className="text-8xl font-mono font-700 text-accent-cyan my-4 leading-none">
              #{result.token}
            </div>
            <p className="text-slate-400 font-body mb-1">
              Service: <span className="text-white font-500">{result.serviceName || result.service}</span>
            </p>

            <div className="grid grid-cols-2 gap-3 mt-6 mb-6">
              <div className="bg-surface-700 rounded-xl p-4">
                <p className="label mb-1">Position</p>
                <p className="text-2xl font-display font-700 text-accent-amber">#{result.position}</p>
              </div>
              <div className="bg-surface-700 rounded-xl p-4">
                <p className="label mb-1">Est. Wait</p>
                <p className="text-2xl font-display font-700 text-accent-cyan">{result.estimatedWait}m</p>
              </div>
            </div>

            <p className="text-xs font-mono text-slate-500 mb-6">
              Joined at {new Date(result.joinedAt).toLocaleTimeString()}
            </p>

            <div className="flex gap-3">
              <Link to={`/track?serviceId=${selected}&token=${result.token}`} 
                className="btn-primary flex-1 text-center py-3">
                Track My Token
              </Link>
              <button onClick={() => setResult(null)} className="btn-secondary py-3 px-4">
                Join Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950 grid-bg px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 mb-8 text-sm font-body transition-colors">
          <ArrowLeft size={14} /> Back to Home
        </Link>

        <div className="mb-8">
          <p className="label mb-2">Step 1 of 1</p>
          <h1 className="font-display font-700 text-3xl text-white tracking-tight">Join a Queue</h1>
          <p className="text-slate-400 font-body mt-2">Select a service to get your virtual token.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={32} className="animate-spin text-accent-cyan" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {services.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelected(s.id)}
                  className={`card p-5 text-left transition-all duration-150 group ${
                    selected === s.id
                      ? 'border-accent-cyan/50 bg-accent-cyan/5 shadow-glow-cyan'
                      : 'hover:border-surface-500 hover:bg-surface-700/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{s.icon}</span>
                    {selected === s.id && (
                      <div className="w-5 h-5 bg-accent-cyan rounded-full flex items-center justify-center">
                        <CheckCircle size={12} className="text-surface-950" />
                      </div>
                    )}
                  </div>
                  <p className="font-display font-600 text-white mb-1">{s.name}</p>
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock size={10} /> ~{s.avgWaitTime}m wait
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleJoin}
              disabled={!selected || joining}
              className={`w-full py-4 rounded-xl font-display font-600 text-base flex items-center justify-center gap-3 transition-all duration-150 ${
                selected && !joining
                  ? 'bg-accent-cyan text-surface-950 shadow-glow-cyan hover:bg-accent-cyan/90 active:scale-98'
                  : 'bg-surface-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              {joining ? (
                <><Loader2 size={18} className="animate-spin" /> Joining Queue...</>
              ) : (
                <><ChevronRight size={18} /> Join Queue</>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}