import { useState, useEffect } from 'react';
import AdminTopbar from '@/components/common/AdminTopbar';
import Badge from '@/components/common/Badge';
import Loader from '@/components/common/Loader';
import { fetchAdminQueues } from '@/services/api';

export default function ActiveQueues() {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminQueues().then(d => { setQueues(d); setLoading(false); });
  }, []);

  return (
    <div className="flex flex-col flex-1">
      <AdminTopbar title="Active Queues" subtitle="Live overview of all service queues" />
      <main className="flex-1 p-6 animate-fade-in">
        {loading ? <Loader /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {queues.map(q => (
              <div key={q.id} className={`card p-5 ${q.status === 'closed' ? 'opacity-50' : 'hover:border-surface-500'} transition-all`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{q.icon}</span>
                    <div>
                      <p className="font-display font-600 text-white text-sm">{q.name}</p>
                      <p className="text-xs font-mono text-slate-500">ID: {q.id}</p>
                    </div>
                  </div>
                  <Badge variant={q.status === 'open' ? 'green' : 'red'}>{q.status}</Badge>
                </div>

                {/* Current Token */}
                <div className="bg-surface-700 rounded-xl p-4 mb-4 text-center">
                  <p className="label mb-1">Now Serving</p>
                  <p className="font-mono font-700 text-3xl text-accent-cyan">#{q.currentToken}</p>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="label mb-1">Waiting</p>
                    <p className="font-display font-600 text-xl text-accent-amber">{q.waiting}</p>
                  </div>
                  <div>
                    <p className="label mb-1">Served</p>
                    <p className="font-display font-600 text-xl text-accent-green">{q.served}</p>
                  </div>
                  <div>
                    <p className="label mb-1">Avg Wait</p>
                    <p className="font-display font-600 text-xl text-slate-300">{q.avgWaitTime}m</p>
                  </div>
                </div>

                {/* Load bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-mono text-slate-600 mb-1">
                    <span>Capacity</span>
                    <span>{q.waiting}/{q.maxCapacity}</span>
                  </div>
                  <div className="h-2 bg-surface-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(q.waiting / q.maxCapacity) * 100}%`, backgroundColor: q.color }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
