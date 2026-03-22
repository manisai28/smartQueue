import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, List, Activity, FileText,
  Settings, Zap, Users, ChevronRight, LogOut
} from 'lucide-react';
import { clsx } from 'clsx';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/queues', label: 'Queue Management', icon: List },
  { to: '/admin/active', label: 'Active Queues', icon: Users },
  { to: '/admin/metrics', label: 'Metrics', icon: Activity },
  { to: '/admin/logs', label: 'Logs', icon: FileText },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar() {
  const navigate = useNavigate();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-surface-900 border-r border-surface-700 flex flex-col z-40">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-surface-700">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-accent-cyan rounded-lg flex items-center justify-center shadow-glow-cyan">
            <Zap size={16} className="text-surface-950" />
          </div>
          <div>
            <p className="font-display font-700 text-white text-sm tracking-tight">SmartQueue</p>
            <p className="text-xs font-mono text-slate-500">Admin Console</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="label px-2 mb-3">Navigation</p>
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              clsx(isActive ? 'sidebar-item-active' : 'sidebar-item', 'group')
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={isActive ? 'text-accent-cyan' : 'text-slate-500 group-hover:text-slate-300'} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={12} className="text-accent-cyan" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-surface-700 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-7 h-7 bg-accent-cyan/20 rounded-full flex items-center justify-center">
            <span className="text-xs font-mono text-accent-cyan font-700">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-500 text-slate-300 truncate">admin@smartqueue.io</p>
            <p className="text-xs text-slate-600 font-mono">Super Admin</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/')}
          className="sidebar-item w-full text-accent-red hover:text-accent-red hover:bg-accent-red/10"
        >
          <LogOut size={15} />
          <span>Exit to Home</span>
        </button>
      </div>
    </aside>
  );
}
