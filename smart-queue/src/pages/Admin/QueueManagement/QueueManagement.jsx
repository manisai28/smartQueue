import { useState, useEffect } from 'react';
import { ChevronRight, Trash2, ToggleLeft, ToggleRight, Loader2, Users, Clock, RefreshCw } from 'lucide-react';
import AdminTopbar from '@/components/common/AdminTopbar';
import Badge from '@/components/common/Badge';
import Loader from '@/components/common/Loader';
import { fetchAdminQueues, callNextToken, removeToken, toggleCounter, fetchAllQueues } from '@/services/api';
import { clsx } from 'clsx';
import { format } from 'date-fns';

export default function QueueManagement() {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);
  const [tokens, setTokens] = useState([]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchQueues = async () => {
    setLoading(true);
    try {
      const data = await fetchAllQueues();
      setQueues(data);
      if (data.length > 0 && !selectedQueue) {
        setSelectedQueue(data[0]);
        // Generate mock tokens for display (since Redis doesn't store full token details list)
        generateMockTokens(data[0]);
      } else if (selectedQueue) {
        const updated = data.find(q => q.id === selectedQueue.id);
        if (updated) {
          setSelectedQueue(updated);
          generateMockTokens(updated);
        }
      }
    } catch (error) {
      console.error('Fetch queues error:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockTokens = (queue) => {
    // Generate mock tokens for display based on waiting count
    const mockTokens = [];
    for (let i = 1; i <= Math.min(queue.waiting, 10); i++) {
      mockTokens.push({
        id: `${queue.id}-${i}`,
        number: `${queue.prefix || 'T'}${queue.counter + i || 100 + i}`,
        name: `Customer ${i}`,
        joinedAt: new Date(Date.now() - i * 60000).toISOString(),
        priority: i === 1 ? 'high' : 'normal',
      });
    }
    setTokens(mockTokens);
  };

  useEffect(() => {
    fetchQueues();
  }, []);

  const handleCallNext = async (queueId) => {
    setActionLoading('call');
    try {
      const res = await callNextToken(queueId);
      showToast(`Token #${res.calledToken} called successfully`);
      await fetchQueues(); // Refresh queues
    } catch (error) {
      showToast(error.message || 'Failed to call next token', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveToken = async (queueId, tokenId) => {
    setActionLoading(tokenId);
    try {
      await removeToken(queueId, tokenId);
      setTokens(prev => prev.filter(t => t.id !== tokenId));
      showToast('Token removed');
      await fetchQueues(); // Refresh queues to update waiting count
    } catch (error) {
      showToast('Failed to remove token', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggle = async (queue) => {
    setActionLoading('toggle-' + queue.id);
    const newOpen = queue.status !== 'open';
    try {
      await toggleCounter(queue.id, newOpen);
      showToast(`Counter ${newOpen ? 'opened' : 'closed'}`);
      await fetchQueues();
    } catch (error) {
      showToast('Failed to toggle counter', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const getIcon = (serviceName) => {
    if (serviceName.includes('Bank')) return '🏦';
    if (serviceName.includes('Hospital')) return '🏥';
    if (serviceName.includes('Document')) return '📄';
    if (serviceName.includes('Customer')) return '💬';
    return '🎫';
  };

  return (
    <div className="flex flex-col flex-1">
      <AdminTopbar title="Queue Management" subtitle="Manage tokens and service counters" />

      {/* Toast */}
      {toast && (
        <div className={clsx(
          'fixed top-4 right-4 z-50 px-4 py-3 rounded-lg border font-body text-sm animate-slide-in flex items-center gap-2',
          toast.type === 'success' ? 'bg-surface-800 border-accent-green/30 text-accent-green' : 'bg-surface-800 border-accent-red/30 text-accent-red'
        )}>
          <div className="w-2 h-2 rounded-full bg-current" />
          {toast.msg}
        </div>
      )}

      {loading ? <div className="flex-1 flex items-center justify-center"><Loader /></div> : (
        <div className="flex-1 flex overflow-hidden">
          {/* Queue List Sidebar */}
          <div className="w-72 border-r border-surface-700 overflow-y-auto">
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <p className="label">Services ({queues.length})</p>
                <button onClick={fetchQueues} className="p-1 hover:bg-surface-700 rounded-lg transition">
                  <RefreshCw size={14} className="text-slate-400" />
                </button>
              </div>
              <div className="space-y-1">
                {queues.map(q => (
                  <button
                    key={q.id}
                    onClick={() => {
                      setSelectedQueue(q);
                      generateMockTokens(q);
                    }}
                    className={clsx(
                      'w-full text-left p-3 rounded-lg transition-all duration-150 group',
                      selectedQueue?.id === q.id
                        ? 'bg-accent-cyan/10 border border-accent-cyan/30'
                        : 'hover:bg-surface-700'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{getIcon(q.name)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-500 text-slate-200 truncate">{q.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-mono text-slate-500">{q.waiting} waiting</span>
                          <span className={clsx('text-xs font-mono', q.status === 'open' ? 'text-accent-green' : 'text-accent-red')}>
                            · {q.status}
                          </span>
                        </div>
                      </div>
                      {selectedQueue?.id === q.id && <ChevronRight size={12} className="text-accent-cyan" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Queue Detail */}
          {selectedQueue && (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{getIcon(selectedQueue.name)}</span>
                    <h2 className="font-display font-700 text-xl text-white">{selectedQueue.name}</h2>
                    <Badge variant={selectedQueue.status === 'open' ? 'green' : 'red'}>
                      {selectedQueue.status === 'open' ? 'Open' : 'Closed'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500 font-mono">
                    <span className="flex items-center gap-1"><Users size={12} /> {selectedQueue.waiting} waiting</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> ~{selectedQueue.avgWaitTime}m avg</span>
                    <span>Now: #{selectedQueue.currentServing || 'None'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggle(selectedQueue)}
                    disabled={actionLoading === 'toggle-' + selectedQueue.id}
                    className={clsx(
                      'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-500 transition-all border',
                      selectedQueue.status === 'open'
                        ? 'bg-accent-red/10 text-accent-red border-accent-red/30 hover:bg-accent-red/20'
                        : 'bg-accent-green/10 text-accent-green border-accent-green/30 hover:bg-accent-green/20'
                    )}
                  >
                    {actionLoading === 'toggle-' + selectedQueue.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : selectedQueue.status === 'open' ? (
                      <><ToggleRight size={14} /> Close Counter</>
                    ) : (
                      <><ToggleLeft size={14} /> Open Counter</>
                    )}
                  </button>

                  <button
                    onClick={() => handleCallNext(selectedQueue.id)}
                    disabled={actionLoading === 'call' || selectedQueue.status !== 'open' || selectedQueue.waiting === 0}
                    className="btn-primary flex items-center gap-2 py-2.5 px-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading === 'call' ? <Loader2 size={14} className="animate-spin" /> : <ChevronRight size={14} />}
                    Call Next
                  </button>
                </div>
              </div>

              {/* Token Table */}
              <div className="card overflow-hidden">
                <div className="px-5 py-3.5 border-b border-surface-700 flex items-center justify-between">
                  <p className="text-sm font-500 text-slate-300">Queue Tokens</p>
                  <span className="text-xs font-mono text-slate-500">{tokens.length} entries</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-surface-700">
                        {['Token #', 'Customer', 'Joined At', 'Est. Wait', 'Priority', 'Actions'].map(h => (
                          <th key={h} className="label text-left px-5 py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tokens.map((token, i) => (
                        <tr key={token.id} className={clsx('border-b border-surface-700/50 table-row-hover', i === 0 && 'bg-accent-cyan/5')}>
                          <td className="px-5 py-3.5">
                            <span className="font-mono font-500 text-accent-cyan">#{token.number}</span>
                            {i === 0 && <span className="ml-2 badge-cyan text-xs py-0.5 px-2">NEXT</span>}
                          </td>
                          <td className="px-5 py-3.5 text-sm text-slate-300 font-500">{token.name}</td>
                          <td className="px-5 py-3.5 text-xs font-mono text-slate-500">
                            {format(new Date(token.joinedAt), 'HH:mm:ss')}
                          </td>
                          <td className="px-5 py-3.5 text-xs font-mono text-slate-400">
                            ~{(i + 1) * selectedQueue.avgWaitTime}m
                          </td>
                          <td className="px-5 py-3.5">
                            <Badge variant={token.priority === 'high' ? 'amber' : 'purple'} dot={false}>
                              {token.priority}
                            </Badge>
                          </td>
                          <td className="px-5 py-3.5">
                            <button
                              onClick={() => handleRemoveToken(selectedQueue.id, token.id)}
                              disabled={actionLoading === token.id}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-accent-red hover:bg-accent-red/10 transition-all"
                            >
                              {actionLoading === token.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                            </button>
                          </td>
                        </tr>
                      ))}
                      {tokens.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-5 py-8 text-center text-slate-500">
                            No tokens in queue
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}