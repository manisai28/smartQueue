import { useState, useEffect } from 'react';
import { List, Users, CheckSquare, Clock, Activity } from 'lucide-react';
import AdminTopbar from '@/components/common/AdminTopbar';
import StatCard from '@/components/common/StatCard';
import { QueueLengthChart, TokensServedChart, ServiceLoadChart } from '@/components/charts/Charts';
import PasscodeModal from './PasscodeModal';
import {
  fetchDashboardStats,
  fetchQueueLengthChart,
  fetchTokensServedChart,
  fetchServiceLoad,
} from '@/services/api';

export default function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [stats, setStats] = useState(null);
  const [queueData, setQueueData] = useState([]);
  const [tokensData, setTokensData] = useState([]);
  const [loadData, setLoadData] = useState([]);

  // Check if already authenticated (from session storage)
  useEffect(() => {
    const adminAuth = sessionStorage.getItem('admin_authenticated');
    if (adminAuth === 'true') {
      setIsAuthenticated(true);
      setShowModal(false);
    }
  }, []);

  // Fetch data only when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardStats().then(setStats);
      fetchQueueLengthChart().then(setQueueData);
      fetchTokensServedChart().then(setTokensData);
      fetchServiceLoad().then(setLoadData);
    }
  }, [isAuthenticated]);

  const handlePasscodeSuccess = () => {
    sessionStorage.setItem('admin_authenticated', 'true');
    setIsAuthenticated(true);
    setShowModal(false);
  };

  const handleCloseModal = () => {
    // Optional: redirect to home or show message
    window.location.href = '/'; // Redirect to home if they cancel
  };

  // If not authenticated, show nothing or loading state
  if (!isAuthenticated) {
    return (
      <>
        {showModal && (
          <PasscodeModal 
            onSuccess={handlePasscodeSuccess}
            onClose={handleCloseModal}
          />
        )}
      </>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <AdminTopbar title="Dashboard" subtitle="System overview — real-time monitoring" />

      <main className="flex-1 p-6 space-y-6 animate-fade-in">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            label="Total Queues"
            value={stats?.totalQueues ?? '—'}
            icon={List}
            color="cyan"
            trend={0}
          />
          <StatCard
            label="People Waiting"
            value={stats?.peopleWaiting ?? '—'}
            icon={Users}
            color="amber"
            trend={-12}
            trendLabel="vs last hour"
          />
          <StatCard
            label="Tokens Served Today"
            value={stats?.tokensServedToday ?? '—'}
            icon={CheckSquare}
            color="green"
            trend={8}
          />
          <StatCard
            label="Avg Wait Time"
            value={stats?.avgWaitTime ?? '—'}
            unit="min"
            icon={Clock}
            color="purple"
            trend={-5}
          />
        </div>

        {/* Queue Length Chart */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="section-title">Queue Length Over Time</p>
              <p className="text-xs text-slate-500 font-mono mt-0.5">24-hour view · all services</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse-slow" />
              <span className="text-xs font-mono text-slate-500">Live</span>
            </div>
          </div>
          <QueueLengthChart data={queueData} />
        </div>

        {/* Bottom charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card p-6">
            <p className="section-title mb-1">Tokens Served Per Hour</p>
            <p className="text-xs text-slate-500 font-mono mb-5">Today · 08:00 – 20:00</p>
            <TokensServedChart data={tokensData} />
          </div>

          <div className="card p-6">
            <p className="section-title mb-1">Service Load</p>
            <p className="text-xs text-slate-500 font-mono mb-5">Current utilization per service</p>
            <ServiceLoadChart data={loadData} />
          </div>
        </div>

        {/* System Health Row */}
        <div className="card p-5">
          <p className="section-title mb-4">System Health</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'API Gateway', status: 'healthy', latency: '42ms' },
              { label: 'Queue Service', status: 'healthy', latency: '18ms' },
              { label: 'SMS Gateway', status: 'degraded', latency: '320ms' },
              { label: 'Database', status: 'healthy', latency: '12ms' },
            ].map(({ label, status, latency }) => (
              <div key={label} className="bg-surface-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${status === 'healthy' ? 'bg-accent-green animate-pulse-slow' : 'bg-accent-amber animate-pulse'}`} />
                  <span className="text-xs font-mono text-slate-500">{status}</span>
                </div>
                <p className="text-sm font-500 text-slate-300">{label}</p>
                <p className="text-xs font-mono text-slate-600 mt-1">{latency} avg</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}