import { useState, useEffect } from 'react';
import { List, Users, CheckSquare, Clock, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext'; // Fixed path
import AdminTopbar from '@/components/common/AdminTopbar'; // Fixed path
import StatCard from '@/components/common/StatCard'; // Fixed path
import { QueueLengthChart, TokensServedChart, ServiceLoadChart } from '@/components/charts/Charts'; // Fixed path
import PasscodeModal from './PasscodeModal'; // Make sure this exists
import {
  fetchDashboardStats,
  fetchQueueLengthChart,
  fetchTokensServedChart,
  fetchServiceLoad,
} from '@/services/api'; // Fixed path

export default function Dashboard() {
  const navigate = useNavigate();
  
  // Passcode state (hardcoded only)
  const [isPasscodeVerified, setIsPasscodeVerified] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [stats, setStats] = useState(null);
  const [queueData, setQueueData] = useState([]);
  const [tokensData, setTokensData] = useState([]);
  const [loadData, setLoadData] = useState([]);

  // Check if passcode already verified in this session
  useEffect(() => {
    const adminVerified = sessionStorage.getItem('admin_verified');
    if (adminVerified === 'true') {
      setIsPasscodeVerified(true);
      setShowModal(false);
    }
  }, []);

  // Fetch data only when passcode is verified
  useEffect(() => {
    if (isPasscodeVerified) {
      fetchDashboardStats().then(setStats);
      fetchQueueLengthChart().then(setQueueData);
      fetchTokensServedChart().then(setTokensData);
      fetchServiceLoad().then(setLoadData);
    }
  }, [isPasscodeVerified]);

  const handlePasscodeSuccess = () => {
    sessionStorage.setItem('admin_verified', 'true');
    setIsPasscodeVerified(true);
    setShowModal(false);
  };

  const handleCloseModal = () => {
    // Go back to home
    navigate('/');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_verified');
    navigate('/');
  };

  // Show passcode modal if not verified
  if (!isPasscodeVerified) {
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
      <AdminTopbar 
        title="Dashboard" 
        subtitle="System overview — real-time monitoring" 
      />
      
      {/* Logout button */}
      <div className="absolute top-4 right-4 z-50">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 bg-surface-800 hover:bg-surface-700 rounded-lg transition-colors"
        >
          <LogOut size={16} className="text-slate-400" />
          <span className="text-sm text-slate-300">Exit Admin</span>
        </button>
      </div>

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