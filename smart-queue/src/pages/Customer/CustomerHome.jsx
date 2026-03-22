import { Link, useNavigate } from 'react-router-dom';
import { Zap, Users, Clock, ArrowRight, BarChart3, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const features = [
  { icon: Zap, title: 'Instant Token', desc: 'Get a queue token in seconds with no paperwork.' },
  { icon: Clock, title: 'Real-time Wait', desc: 'Track your position and estimated wait live.' },
  { icon: BarChart3, title: 'Queue Insights', desc: 'See all service loads before choosing a queue.' },
];

export default function CustomerHome() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface-950 grid-bg relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent-cyan/4 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-accent-purple/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-surface-700/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-accent-cyan rounded-lg flex items-center justify-center shadow-glow-cyan">
            <Zap size={16} className="text-surface-950" />
          </div>
          <span className="font-display font-700 text-white tracking-tight">SmartQueue</span>
        </div>
        
        {/* User info and logout */}
        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-surface-800 rounded-lg">
              <div className="w-6 h-6 bg-accent-cyan/20 rounded-full flex items-center justify-center">
                <span className="text-xs text-accent-cyan font-medium">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-slate-300">{user.name}</span>
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <Link to="/queue-status" className="btn-secondary text-sm py-2 px-4">View Queues</Link>
            <Link to="/admin" className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
              Admin Dashboard <ArrowRight size={14} />
            </Link>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-surface-800 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={18} className="text-slate-400 hover:text-red-400 transition-colors" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-4xl mx-auto px-8 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 badge-cyan mb-8 text-sm px-4 py-1.5">
          <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse-slow" />
          System Online · 6 services active
        </div>

        <h1 className="font-display font-800 text-5xl md:text-7xl text-white tracking-tight leading-none mb-6 text-balance">
          Welcome back, <br />
          <span className="text-accent-cyan">{user?.name?.split(' ')[0] || 'Guest'}!</span>
        </h1>

        <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto font-body leading-relaxed">
          Join a virtual queue from anywhere. Real-time tracking, instant notifications,
          and smart estimated wait times for every service.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/join" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-4">
            <Users size={18} />
            Join a Queue
          </Link>
          <Link to="/track" className="btn-secondary inline-flex items-center gap-2 text-base px-8 py-4">
            <Clock size={18} />
            Track My Token
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-20">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card-hover p-6 text-left group">
              <div className="w-10 h-10 bg-accent-cyan/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent-cyan/15 transition-colors">
                <Icon size={18} className="text-accent-cyan" />
              </div>
              <h3 className="font-display font-600 text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-400 font-body leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Stats ticker */}
        <div className="mt-16 pt-8 border-t border-surface-700/50 grid grid-cols-3 gap-6">
          {[
            { label: 'Tokens Today', value: '342' },
            { label: 'Avg Wait', value: '18 min' },
            { label: 'Services', value: '6' },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="font-display font-700 text-2xl text-accent-cyan">{value}</p>
              <p className="text-xs font-mono text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}