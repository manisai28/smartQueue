import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Users, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import { fetchAllQueues } from '@/services/api';
import Badge from '@/components/common/Badge';
import Loader from '@/components/common/Loader';

export default function QueueStatus() {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllQueues().then(data => {
      setQueues(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-surface-950 grid-bg px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 mb-8 text-sm transition-colors">
          <ArrowLeft size={14} /> Back
        </Link>

        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="label mb-2">Live Status</p>
            <h1 className="font-display font-700 text-3xl text-white tracking-tight">All Queues</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse-slow" />
            <span className="text-xs font-mono text-slate-500">Live</span>
          </div>
        </div>

        {loading ? <Loader text="Fetching queue status..." /> : (
          <div className="space-y-3">
            {queues.map(q => (
              <div key={q.id} className={`card p-5 transition-all duration-200 hover:border-surface-500 ${q.status === 'closed' ? 'opacity-60' : ''}`}>
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{q.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-display font-600 text-white">{q.name}</h3>
                      {q.status === 'open' ? (
                        <Badge variant="green">Open</Badge>
                      ) : (
                        <Badge variant="red" dot={false}>Closed</Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Users size={12} className="text-slate-500" />
                        <span><span className="text-white font-500">{q.waiting}</span> waiting</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Clock size={12} className="text-slate-500" />
                        <span>~<span className="text-white font-500">{q.avgWaitTime}</span> min avg</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <TrendingUp size={12} className="text-slate-500" />
                        <span><span className="text-white font-500">{q.served}</span> served today</span>
                      </div>
                    </div>

                    {/* Load bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs font-mono text-slate-600 mb-1">
                        <span>Queue load</span>
                        <span>{Math.round((q.waiting / q.maxCapacity) * 100)}%</span>
                      </div>
                      <div className="h-1.5 bg-surface-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.round((q.waiting / q.maxCapacity) * 100)}%`,
                            backgroundColor: q.color,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {q.status === 'open' && (
                    <Link
                      to="/join"
                      state={{ serviceId: q.id }}
                      className="shrink-0 btn-primary text-sm py-2 px-4"
                    >
                      Join
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/track" className="btn-secondary inline-flex items-center gap-2 text-sm">
            Already have a token? Track it
          </Link>
        </div>
      </div>
    </div>
  );
}
