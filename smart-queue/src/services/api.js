import axios from 'axios';


// Use environment variable for API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance for real API calls
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - automatically add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Mock data imports (for development fallback)
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

// Simulate async delay (for mock data)
const delay = (ms = 300) => new Promise(res => setTimeout(res, ms));

// Flag to use mock data (set to false when backend is ready)
const USE_MOCK_DATA = true; // Change to false when using real backend

// ── Customer API ─────────────────────────────────────────────────────────────

export const fetchServices = async () => {
  if (USE_MOCK_DATA) {
    await delay(200);
    return SERVICES;
  }
  
  try {
    const response = await apiClient.get('/services');
    return response.data.data;
  } catch (error) {
    console.error('Fetch services error:', error);
    // Fallback to mock data
    return SERVICES;
  }
};

export const joinQueue = async (serviceId, userId = null) => {
  if (USE_MOCK_DATA) {
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
  }
  
  try {
    const response = await apiClient.post('/queue/join', { serviceId, userId });
    return response.data.data;
  } catch (error) {
    console.error('Join queue error:', error);
    throw error;
  }
};

export const fetchQueueStatus = async (serviceId) => {
  if (USE_MOCK_DATA) {
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
  }
  
  try {
    const response = await apiClient.get(`/queue/status/${serviceId}`);
    return response.data.data;
  } catch (error) {
    console.error('Fetch queue status error:', error);
    throw error;
  }
};

export const fetchAllQueues = async () => {
  if (USE_MOCK_DATA) {
    await delay(300);
    return generateQueues();
  }
  
  try {
    const response = await apiClient.get('/queue/all');
    return response.data.data;
  } catch (error) {
    console.error('Fetch all queues error:', error);
    return generateQueues();
  }
};

export const trackMyQueue = async (tokenId) => {
  if (USE_MOCK_DATA) {
    await delay(200);
    return {
      token: tokenId,
      position: Math.floor(Math.random() * 10) + 1,
      currentServing: Math.floor(Math.random() * 5) + 100,
      estimatedWait: Math.floor(Math.random() * 20) + 5,
    };
  }
  
  try {
    const response = await apiClient.get(`/queue/track/${tokenId}`);
    return response.data.data;
  } catch (error) {
    console.error('Track queue error:', error);
    throw error;
  }
};

// ── Admin API ─────────────────────────────────────────────────────────────────

export const fetchDashboardStats = async () => {
  if (USE_MOCK_DATA) {
    await delay(200);
    return STATS;
  }
  
  try {
    const response = await apiClient.get('/admin/stats');
    return response.data.data;
  } catch (error) {
    console.error('Fetch dashboard stats error:', error);
    return STATS;
  }
};

export const fetchQueueLengthChart = async () => {
  if (USE_MOCK_DATA) {
    await delay(250);
    return generateQueueLengthData();
  }
  
  try {
    const response = await apiClient.get('/admin/charts/queue-length');
    return response.data.data;
  } catch (error) {
    console.error('Fetch queue length chart error:', error);
    return generateQueueLengthData();
  }
};

export const fetchTokensServedChart = async () => {
  if (USE_MOCK_DATA) {
    await delay(250);
    return generateTokensServedData();
  }
  
  try {
    const response = await apiClient.get('/admin/charts/tokens-served');
    return response.data.data;
  } catch (error) {
    console.error('Fetch tokens served chart error:', error);
    return generateTokensServedData();
  }
};

export const fetchServiceLoad = async () => {
  if (USE_MOCK_DATA) {
    await delay(200);
    return generateServiceLoadData();
  }
  
  try {
    const response = await apiClient.get('/admin/charts/service-load');
    return response.data.data;
  } catch (error) {
    console.error('Fetch service load error:', error);
    return generateServiceLoadData();
  }
};

export const fetchAdminQueues = async () => {
  if (USE_MOCK_DATA) {
    await delay(300);
    return generateQueues();
  }
  
  try {
    const response = await apiClient.get('/admin/queues');
    return response.data.data;
  } catch (error) {
    console.error('Fetch admin queues error:', error);
    return generateQueues();
  }
};

export const callNextToken = async (serviceId) => {
  if (USE_MOCK_DATA) {
    await delay(400);
    return { success: true, calledToken: Math.floor(Math.random() * 10) + 150 };
  }
  
  try {
    const response = await apiClient.post(`/admin/queues/${serviceId}/call-next`);
    return response.data;
  } catch (error) {
    console.error('Call next token error:', error);
    throw error;
  }
};

export const removeToken = async (serviceId, tokenId) => {
  if (USE_MOCK_DATA) {
    await delay(300);
    return { success: true };
  }
  
  try {
    const response = await apiClient.delete(`/admin/queues/${serviceId}/token/${tokenId}`);
    return response.data;
  } catch (error) {
    console.error('Remove token error:', error);
    throw error;
  }
};

export const toggleCounter = async (serviceId, open) => {
  if (USE_MOCK_DATA) {
    await delay(300);
    return { success: true, status: open ? 'open' : 'closed' };
  }
  
  try {
    const response = await apiClient.patch(`/admin/queues/${serviceId}/counter`, { open });
    return response.data;
  } catch (error) {
    console.error('Toggle counter error:', error);
    throw error;
  }
};

export const fetchMetrics = async () => {
  if (USE_MOCK_DATA) {
    await delay(300);
    return generateMetricsData();
  }
  
  try {
    const response = await apiClient.get('/admin/metrics');
    return response.data.data;
  } catch (error) {
    console.error('Fetch metrics error:', error);
    return generateMetricsData();
  }
};

export const fetchLogs = async (filters = {}) => {
  if (USE_MOCK_DATA) {
    await delay(400);
    return generateLogs();
  }
  
  try {
    const response = await apiClient.get('/admin/logs', { params: filters });
    return response.data.data;
  } catch (error) {
    console.error('Fetch logs error:', error);
    return generateLogs();
  }
};

// Export the apiClient for direct use if needed
export default apiClient;