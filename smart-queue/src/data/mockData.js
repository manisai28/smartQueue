// Mock data for all services - simulates API responses

export const SERVICES = [
  { id: 'bank', name: 'Bank Counter', icon: '🏦', avgWaitTime: 12, maxCapacity: 50, color: '#00d4ff' },
  { id: 'hospital', name: 'Hospital OPD', icon: '🏥', avgWaitTime: 25, maxCapacity: 80, color: '#00ff8c' },
  { id: 'docs', name: 'Document Service', icon: '📋', avgWaitTime: 8, maxCapacity: 30, color: '#ffb800' },
  { id: 'passport', name: 'Passport Office', icon: '🛂', avgWaitTime: 35, maxCapacity: 40, color: '#8b5cf6' },
  { id: 'dmv', name: 'DMV / Licensing', icon: '🚗', avgWaitTime: 20, maxCapacity: 60, color: '#ff4560' },
  { id: 'tax', name: 'Tax Services', icon: '💰', avgWaitTime: 15, maxCapacity: 25, color: '#3b82f6' },
];

export const generateQueues = () =>
  SERVICES.map((s, i) => ({
    ...s,
    status: i === 4 ? 'closed' : 'open',
    currentToken: 100 + Math.floor(Math.random() * 50),
    waiting: Math.floor(Math.random() * 30) + 2,
    served: Math.floor(Math.random() * 80) + 20,
    counterOpen: i !== 4,
    tokens: Array.from({ length: Math.floor(Math.random() * 15) + 5 }, (_, j) => ({
      id: `${s.id}-${j}`,
      number: 100 + Math.floor(Math.random() * 50) + j,
      name: ['Alice M.', 'Bob K.', 'Charlie R.', 'Diana S.', 'Eve T.', 'Frank L.', 'Grace P.', 'Henry W.'][j % 8],
      joinedAt: new Date(Date.now() - (j * 5 + Math.random() * 3) * 60000).toISOString(),
      priority: j === 0 ? 'high' : 'normal',
    })),
  }));

export const generateQueueLengthData = () => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  return hours.map(h => ({
    time: `${String(h).padStart(2, '0')}:00`,
    bank: Math.floor(Math.sin((h - 9) * 0.4) * 15 + 15 + Math.random() * 5),
    hospital: Math.floor(Math.sin((h - 10) * 0.35) * 20 + 20 + Math.random() * 8),
    docs: Math.floor(Math.sin((h - 8) * 0.5) * 10 + 10 + Math.random() * 4),
    passport: Math.floor(Math.sin((h - 9.5) * 0.45) * 12 + 12 + Math.random() * 6),
  }));
};

export const generateTokensServedData = () => {
  return Array.from({ length: 12 }, (_, i) => ({
    hour: `${String(8 + i).padStart(2, '0')}:00`,
    served: Math.floor(Math.random() * 40 + 20),
    target: 45,
  }));
};

export const generateServiceLoadData = () => {
  return SERVICES.map(s => ({
    name: s.name.split(' ')[0],
    load: Math.floor(Math.random() * 60 + 30),
    capacity: 100,
    color: s.color,
  }));
};

export const generateMetricsData = () => {
  const now = Date.now();
  return Array.from({ length: 60 }, (_, i) => ({
    time: new Date(now - (59 - i) * 60000).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }),
    requestRate: Math.floor(Math.random() * 30 + 10),
    processingRate: Math.floor(Math.random() * 25 + 8),
    errorRate: Math.floor(Math.random() * 5),
    p95Latency: Math.floor(Math.random() * 300 + 100),
    throughput: Math.floor(Math.random() * 50 + 20),
  }));
};

export const generateLogs = () => {
  const services = ['queue-manager', 'token-service', 'api-gateway', 'auth-service', 'notification', 'scheduler'];
  const levels = ['INFO', 'INFO', 'INFO', 'WARN', 'ERROR', 'DEBUG'];
  const messages = [
    'Token {N} issued for Bank Counter service',
    'Queue bank processed next token successfully',
    'Customer notification sent via SMS',
    'Queue capacity threshold at 80% — hospital service',
    'Failed to connect to SMS gateway, retrying...',
    'Health check passed for all services',
    'Token N+{N} called for Document Service',
    'Counter #3 opened by admin user',
    'Rate limit warning: 95 req/min on api-gateway',
    'Queue cleared: tax service end-of-day',
    'Scheduled report generated: daily_summary.json',
    'Authentication token refreshed for admin@smartqueue.io',
    'WebSocket connection established from client 192.168.1.{N}',
    'Cache invalidated for queue:hospital metrics',
    'DB query took 340ms — consider optimization',
  ];

  return Array.from({ length: 80 }, (_, i) => {
    const level = levels[Math.floor(Math.random() * levels.length)];
    return {
      id: i,
      timestamp: new Date(Date.now() - i * 37000 - Math.random() * 20000).toISOString(),
      service: services[Math.floor(Math.random() * services.length)],
      level,
      message: messages[Math.floor(Math.random() * messages.length)].replace('{N}', Math.floor(Math.random() * 999)),
      traceId: Math.random().toString(36).substring(2, 10).toUpperCase(),
    };
  });
};

export const STATS = {
  totalQueues: 6,
  peopleWaiting: 87,
  tokensServedToday: 342,
  avgWaitTime: 18,
};
