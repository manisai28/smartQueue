import { useState } from 'react';
import { Save, Bell, Globe, Database, Shield, Zap } from 'lucide-react';
import AdminTopbar from '@/components/common/AdminTopbar';

const Section = ({ title, icon: Icon, children }) => (
  <div className="card p-6">
    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-surface-700">
      <div className="w-8 h-8 bg-surface-700 rounded-lg flex items-center justify-center">
        <Icon size={15} className="text-accent-cyan" />
      </div>
      <p className="section-title">{title}</p>
    </div>
    {children}
  </div>
);

const Toggle = ({ label, desc, defaultOn = false }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between py-3 border-b border-surface-700/50 last:border-0">
      <div>
        <p className="text-sm font-500 text-slate-300">{label}</p>
        {desc && <p className="text-xs text-slate-500 font-body mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => setOn(!on)}
        className={`w-10 h-5 rounded-full transition-all duration-200 relative ${on ? 'bg-accent-cyan' : 'bg-surface-600'}`}
      >
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${on ? 'left-5.5' : 'left-0.5'}`}
          style={{ left: on ? '22px' : '2px' }} />
      </button>
    </div>
  );
};

export default function Settings() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col flex-1">
      <AdminTopbar title="Settings" subtitle="Configure system preferences" />
      <main className="flex-1 p-6 space-y-4 animate-fade-in max-w-2xl">

        <Section title="Notifications" icon={Bell}>
          <Toggle label="SMS Notifications" desc="Send SMS when token is called" defaultOn={true} />
          <Toggle label="Email Alerts" desc="Receive admin email alerts" defaultOn={true} />
          <Toggle label="Queue Capacity Warnings" desc="Alert at 80% capacity" defaultOn={true} />
          <Toggle label="System Health Alerts" desc="Alert on service degradation" defaultOn={false} />
        </Section>

        <Section title="Queue Configuration" icon={Zap}>
          <div className="space-y-4">
            <div>
              <label className="label mb-2 block">Default Avg Wait Time (minutes)</label>
              <input type="number" defaultValue={15} className="input-field w-32" />
            </div>
            <div>
              <label className="label mb-2 block">Max Queue Capacity (per service)</label>
              <input type="number" defaultValue={50} className="input-field w-32" />
            </div>
            <div>
              <label className="label mb-2 block">Token Format</label>
              <select className="select-field w-48">
                <option>Numeric (001, 002...)</option>
                <option>Alphanumeric (A001, B002...)</option>
              </select>
            </div>
          </div>
          <Toggle label="Auto-advance Queue" desc="Automatically call next token" defaultOn={false} />
        </Section>

        <Section title="System" icon={Database}>
          <div className="space-y-4 mb-4">
            <div>
              <label className="label mb-2 block">Data Retention Period</label>
              <select className="select-field w-48">
                <option>7 days</option>
                <option>30 days</option>
                <option>90 days</option>
                <option>1 year</option>
              </select>
            </div>
            <div>
              <label className="label mb-2 block">Metrics Refresh Interval</label>
              <select className="select-field w-48">
                <option>5 seconds</option>
                <option>10 seconds</option>
                <option>30 seconds</option>
                <option>1 minute</option>
              </select>
            </div>
          </div>
          <Toggle label="Maintenance Mode" desc="Disable all queues temporarily" defaultOn={false} />
          <Toggle label="Debug Logging" desc="Enable verbose logging" defaultOn={false} />
        </Section>

        <Section title="Security" icon={Shield}>
          <Toggle label="Two-Factor Authentication" desc="Require 2FA for admin login" defaultOn={false} />
          <Toggle label="IP Allowlist" desc="Restrict admin access by IP" defaultOn={false} />
          <Toggle label="Audit Logging" desc="Log all admin actions" defaultOn={true} />
        </Section>

        <button onClick={handleSave} className={`btn-primary flex items-center gap-2 ${saved ? 'bg-accent-green text-surface-950' : ''}`}>
          <Save size={15} />
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </main>
    </div>
  );
}
