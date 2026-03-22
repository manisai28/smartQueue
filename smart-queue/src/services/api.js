import {
  SERVICES,
  generateQueues,
  generateQueueLengthData,
  generateTokensServedData,
  generateServiceLoadData,
  generateMetricsData,
  generateLogs,
  STATS,
} from '../data/mockData';

// Simulate async delay
const delay = (ms = 300) => new Promise(res => setTimeout(res, ms));

// ── Customer API ─────────────────────────────────────────────────────────────

export const fetchServices = async () => {
  await delay(200);
  return SERVICES;
};

export const joinQueue = async (serviceId) => {
  await delay(500);
  const service = SERVICES.find(s => s.id === serviceId);
  const tokenNumber = Math.floor(Math.random() * 50) + 150;
  const position = Math.floor(Math.random() * 20) + 3;
  return {
    token: tokenNumber,
    service: service.name,
    position,
    estimatedWait: position * service.avgWaitTime,
    joinedAt: new Date().toISOString(),
  };
};

export const fetchQueueStatus = async (serviceId) => {
  await delay(200);
  const service = SERVICES.find(s => s.id === serviceId);
  return {
    serviceId,
    serviceName: service?.name,
    currentToken: Math.floor(Math.random() * 10) + 140,
    totalWaiting: Math.floor(Math.random() * 20) + 5,
    avgWaitTime: service?.avgWaitTime || 15,
    status: 'open',
  };
};

export const fetchAllQueues = async () => {
  await delay(300);
  return generateQueues();
};

// ── Admin API ─────────────────────────────────────────────────────────────────

export const fetchDashboardStats = async () => {
  await delay(200);
  return STATS;
};

export const fetchQueueLengthChart = async () => {
  await delay(250);
  return generateQueueLengthData();
};

export const fetchTokensServedChart = async () => {
  await delay(250);
  return generateTokensServedData();
};

export const fetchServiceLoad = async () => {
  await delay(200);
  return generateServiceLoadData();
};

export const fetchAdminQueues = async () => {
  await delay(300);
  return generateQueues();
};

export const callNextToken = async (serviceId) => {
  await delay(400);
  return { success: true, calledToken: Math.floor(Math.random() * 10) + 150 };
};

export const removeToken = async (serviceId, tokenId) => {
  await delay(300);
  return { success: true };
};

export const toggleCounter = async (serviceId, open) => {
  await delay(300);
  return { success: true, status: open ? 'open' : 'closed' };
};

export const fetchMetrics = async () => {
  await delay(300);
  return generateMetricsData();
};

export const fetchLogs = async () => {
  await delay(400);
  return generateLogs();
};
