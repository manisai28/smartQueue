import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadialBarChart, RadialBar,
} from 'recharts';

const GRID_STYLE = { stroke: '#1f2d42', strokeDasharray: '3 3' };
const AXIS_STYLE = { fontSize: 10, fontFamily: 'JetBrains Mono', fill: '#475569' };
const TOOLTIP_STYLE = { backgroundColor: '#111827', border: '1px solid #1f2d42', borderRadius: '8px' };

export function QueueLengthChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <defs>
          {[['bank', '#00d4ff'], ['hospital', '#00ff8c'], ['docs', '#ffb800'], ['passport', '#8b5cf6']].map(([key, color]) => (
            <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.2} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid {...GRID_STYLE} />
        <XAxis dataKey="time" tick={AXIS_STYLE} interval={3} />
        <YAxis tick={AXIS_STYLE} />
        <Tooltip contentStyle={TOOLTIP_STYLE} labelStyle={{ color: '#64748b', fontSize: 11 }} />
        <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
        <Area type="monotone" dataKey="bank" name="Bank" stroke="#00d4ff" fill="url(#grad-bank)" strokeWidth={1.5} dot={false} />
        <Area type="monotone" dataKey="hospital" name="Hospital" stroke="#00ff8c" fill="url(#grad-hospital)" strokeWidth={1.5} dot={false} />
        <Area type="monotone" dataKey="docs" name="Docs" stroke="#ffb800" fill="url(#grad-docs)" strokeWidth={1.5} dot={false} />
        <Area type="monotone" dataKey="passport" name="Passport" stroke="#8b5cf6" fill="url(#grad-passport)" strokeWidth={1.5} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function TokensServedChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid {...GRID_STYLE} />
        <XAxis dataKey="hour" tick={AXIS_STYLE} />
        <YAxis tick={AXIS_STYLE} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'JetBrains Mono' }} />
        <Bar dataKey="served" name="Served" fill="#00d4ff" radius={[3, 3, 0, 0]} fillOpacity={0.85} />
        <Bar dataKey="target" name="Target" fill="#1f2d42" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ServiceLoadChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
        <CartesianGrid {...GRID_STYLE} horizontal={false} />
        <XAxis type="number" tick={AXIS_STYLE} domain={[0, 100]} />
        <YAxis dataKey="name" type="category" tick={AXIS_STYLE} width={55} />
        <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v}%`, 'Load']} />
        <Bar dataKey="load" name="Load" radius={[0, 4, 4, 0]}>
          {data?.map((entry, i) => (
            <rect key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function RequestRateChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="grad-req" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid {...GRID_STYLE} />
        <XAxis dataKey="time" tick={AXIS_STYLE} interval={9} />
        <YAxis tick={AXIS_STYLE} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Line type="monotone" dataKey="requestRate" name="Req/min" stroke="#00d4ff" strokeWidth={1.5} dot={false} />
        <Line type="monotone" dataKey="processingRate" name="Proc/min" stroke="#00ff8c" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ErrorRateChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="grad-err" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ff4560" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#ff4560" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid {...GRID_STYLE} />
        <XAxis dataKey="time" tick={AXIS_STYLE} interval={9} />
        <YAxis tick={AXIS_STYLE} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Area type="monotone" dataKey="errorRate" name="Errors" stroke="#ff4560" fill="url(#grad-err)" strokeWidth={1.5} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function LatencyChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid {...GRID_STYLE} />
        <XAxis dataKey="time" tick={AXIS_STYLE} interval={9} />
        <YAxis tick={AXIS_STYLE} unit="ms" />
        <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v) => [`${v}ms`, 'p95 Latency']} />
        <Line type="monotone" dataKey="p95Latency" name="p95 Latency" stroke="#ffb800" strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ThroughputChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="grad-tp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid {...GRID_STYLE} />
        <XAxis dataKey="time" tick={AXIS_STYLE} interval={9} />
        <YAxis tick={AXIS_STYLE} />
        <Tooltip contentStyle={TOOLTIP_STYLE} />
        <Area type="monotone" dataKey="throughput" name="Throughput" stroke="#8b5cf6" fill="url(#grad-tp)" strokeWidth={1.5} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
