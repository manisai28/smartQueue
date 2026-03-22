import { useState, useEffect } from 'react';
import AdminTopbar from '@/components/common/AdminTopbar';
import { RequestRateChart, ErrorRateChart, LatencyChart, ThroughputChart } from '@/components/charts/Charts';
import { fetchMetrics } from '@/services/api';
import Loader from '@/components/common/Loader';

const MetricCard = ({ title, subtitle, children, badge }) => (
  <div className="card p-5">
    <div className="flex items-center justify-between mb-4">
      <div>
        <p className="section-title">{title}</p>
        {subtitle && <p className="text-xs font-mono text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {badge && (
        <span className="badge-cyan text-xs px-2 py-1">{badge}</span>
      )}
    </div>
    {children}
  </div>
);

export default function Metrics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('1h');

  useEffect(() => {
    fetchMetrics().then(d => { setData(d); setLoading(false); });
  }, [timeRange]);

  const latest = data[data.length - 1] || {};

  return (
    <div className="flex flex-col flex-1">
      <AdminTopbar title="Metrics" subtitle="System performance · Prometheus-style monitoring" />
      <main className="flex-1 p-6 space-y-4 animate-fade-in">

        {/* Time Range Selector */}
        <div className="flex items-center gap-2">
          <span className="label">Time Range:</span>
          {['15m', '1h', '6h', '24h'].map(r => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                timeRange === r
                  ? 'bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan'
                  : 'bg-surface-800 border-surface-600 text-slate-500 hover:text-slate-300'
              }`}
            >
              {r}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse-slow" />
            <span className="text-xs font-mono text-slate-500">Live feed</span>
          </div>
        </div>

        {/* Prometheus-style Summary Row */}
        {!loading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'queue_request_rate', value: `${latest.requestRate} req/m`, color: 'text-accent-cyan' },
              { label: 'queue_processing_rate', value: `${latest.processingRate} proc/m`, color: 'text-accent-green' },
              { label: 'queue_error_rate', value: `${latest.errorRate} err/m`, color: 'text-accent-red' },
              { label: 'queue_p95_latency', value: `${latest.p95Latency}ms`, color: 'text-accent-amber' },
            ].map(({ label, value, color }) => (
              <div key={label} className="card p-4">
                <p className="text-xs font-mono text-slate-600 mb-1">{label}</p>
                <p className={`font-mono font-700 text-xl ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        )}

        {loading ? <Loader text="Fetching metrics..." /> : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <MetricCard title="Request Rate" subtitle="queue_request_rate (req/min)" badge="PromQL">
              <RequestRateChart data={data} />
            </MetricCard>

            <MetricCard title="Error Rate" subtitle="queue_error_rate (err/min)" badge="PromQL">
              <ErrorRateChart data={data} />
            </MetricCard>

            <MetricCard title="p95 Latency" subtitle="queue_latency_p95 (milliseconds)" badge="PromQL">
              <LatencyChart data={data} />
            </MetricCard>

            <MetricCard title="Throughput" subtitle="queue_throughput_total (tokens/min)" badge="PromQL">
              <ThroughputChart data={data} />
            </MetricCard>
          </div>
        )}

        {/* Prometheus Expression Block */}
        {!loading && (
          <div className="card p-5">
            <p className="section-title mb-3">PromQL Expressions</p>
            <div className="space-y-2">
              {[
                'rate(queue_tokens_served_total[5m])',
                'histogram_quantile(0.95, rate(queue_request_duration_seconds_bucket[5m]))',
                'sum(queue_waiting_tokens) by (service)',
                'increase(queue_errors_total[1h])',
              ].map(expr => (
                <div key={expr} className="bg-surface-700 border border-surface-600 rounded-lg px-4 py-2.5 font-mono text-xs text-accent-green flex items-center justify-between group">
                  <span>{expr}</span>
                  <button className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-slate-300 transition-all text-xs">
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
