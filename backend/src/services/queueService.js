import redisClient from '../config/redis.js';

// Service types (matching your frontend)
const SERVICES = {
  1: { id: 1, name: 'Bank Counter', prefix: 'B', avgWaitTime: 5 },
  2: { id: 2, name: 'Hospital OPD', prefix: 'H', avgWaitTime: 15 },
  3: { id: 3, name: 'Document Service', prefix: 'D', avgWaitTime: 10 },
  4: { id: 4, name: 'Customer Support', prefix: 'C', avgWaitTime: 8 },
};

// Generate next token number
const generateTokenNumber = async (serviceId) => {
  const key = `counter:${serviceId}`;
  const nextNum = await redisClient.incr(key);
  const service = SERVICES[serviceId];
  return `${service.prefix}${nextNum}`;
};

// Join a queue
export const joinQueue = async (serviceId, userId, userName) => {
  try {
    const service = SERVICES[serviceId];
    if (!service) {
      throw new Error('Invalid service');
    }

    // Check if counter is open
    const statusKey = `status:${serviceId}`;
    const isOpen = await redisClient.get(statusKey);
    if (isOpen === 'closed') {
      throw new Error('Counter is closed');
    }

    // Generate token number
    const token = await generateTokenNumber(serviceId);
    
    // Add token to queue list
    const queueKey = `queue:${serviceId}`;
    await redisClient.rPush(queueKey, token);
    
    // Store token details in hash
    const tokenKey = `token:${serviceId}:${token}`;
    await redisClient.hSet(tokenKey, {
      token,
      serviceId,
      serviceName: service.name,
      userId: userId || 'guest',
      userName: userName || 'Guest',
      joinedAt: new Date().toISOString(),
      status: 'waiting',
    });
    
    // Get position in queue
    const queue = await redisClient.lRange(queueKey, 0, -1);
    const position = queue.findIndex(t => t === token) + 1;
    
    // Get currently serving
    const servingKey = `serving:${serviceId}`;
    const currentServing = await redisClient.get(servingKey);
    
    // Calculate estimated wait time
    const estimatedWait = position * service.avgWaitTime;
    
    // Set TTL for token (24 hours auto-expiry)
    await redisClient.expire(tokenKey, 86400);
    
    return {
      success: true,
      token,
      serviceId,
      serviceName: service.name,
      position,
      currentServing,
      estimatedWait,
      joinedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Join queue error:', error);
    throw error;
  }
};

// Track queue position
export const trackQueue = async (serviceId, token) => {
  try {
    const queueKey = `queue:${serviceId}`;
    const tokenKey = `token:${serviceId}:${token}`;
    
    // Check if token exists
    const tokenDetails = await redisClient.hGetAll(tokenKey);
    if (!tokenDetails || Object.keys(tokenDetails).length === 0) {
      throw new Error('Token not found or already served');
    }
    
    // Get position in queue
    const queue = await redisClient.lRange(queueKey, 0, -1);
    const position = queue.findIndex(t => t === token) + 1;
    
    // Get currently serving
    const servingKey = `serving:${serviceId}`;
    const currentServing = await redisClient.get(servingKey);
    
    // Get queue length
    const queueLength = await redisClient.lLen(queueKey);
    
    // Get service details
    const service = SERVICES[serviceId];
    
    // Calculate estimated wait
    const estimatedWait = position * service.avgWaitTime;
    
    return {
      success: true,
      token,
      serviceId,
      serviceName: service.name,
      position,
      currentServing,
      estimatedWait,
      peopleAhead: position - 1,
      queueLength,
      status: tokenDetails.status || 'waiting',
    };
  } catch (error) {
    console.error('Track queue error:', error);
    throw error;
  }
};

// Get queue status
export const getQueueStatus = async (serviceId) => {
  try {
    const queueKey = `queue:${serviceId}`;
    const servingKey = `serving:${serviceId}`;
    const statusKey = `status:${serviceId}`;
    
    const queueLength = await redisClient.lLen(queueKey);
    const currentServing = await redisClient.get(servingKey);
    const isOpen = await redisClient.get(statusKey);
    const service = SERVICES[serviceId];
    
    // Get first few tokens (for display)
    const nextTokens = await redisClient.lRange(queueKey, 0, 4);
    
    return {
      success: true,
      serviceId,
      serviceName: service.name,
      currentServing: currentServing || 'None',
      totalWaiting: queueLength,
      avgWaitTime: service.avgWaitTime,
      status: isOpen || 'open',
      nextTokens: nextTokens.slice(0, 5),
    };
  } catch (error) {
    console.error('Get queue status error:', error);
    throw error;
  }
};

// Get all queues status
export const getAllQueues = async () => {
  try {
    const queues = [];
    
    for (const [id, service] of Object.entries(SERVICES)) {
      const queueKey = `queue:${id}`;
      const servingKey = `serving:${id}`;
      const statusKey = `status:${id}`;
      
      const queueLength = await redisClient.lLen(queueKey);
      const currentServing = await redisClient.get(servingKey);
      const isOpen = await redisClient.get(statusKey);
      
      queues.push({
        id: parseInt(id),
        name: service.name,
        waiting: queueLength,
        currentServing: currentServing || 'None',
        avgWaitTime: service.avgWaitTime,
        status: isOpen || 'open',
        prefix: service.prefix,
      });
    }
    
    return queues;
  } catch (error) {
    console.error('Get all queues error:', error);
    throw error;
  }
};

// Admin: Call next token
export const callNextToken = async (serviceId) => {
  try {
    const queueKey = `queue:${serviceId}`;
    const servingKey = `serving:${serviceId}`;
    
    // Check if queue has tokens
    const queueLength = await redisClient.lLen(queueKey);
    if (queueLength === 0) {
      throw new Error('Queue is empty');
    }
    
    // Remove first token from queue
    const nextToken = await redisClient.lPop(queueKey);
    
    // Update currently serving
    await redisClient.set(servingKey, nextToken);
    
    // Update token status
    const tokenKey = `token:${serviceId}:${nextToken}`;
    await redisClient.hSet(tokenKey, {
      status: 'serving',
      servedAt: new Date().toISOString(),
    });
    
    const service = SERVICES[serviceId];
    
    return {
      success: true,
      serviceId,
      serviceName: service.name,
      calledToken: nextToken,
      remainingQueue: queueLength - 1,
    };
  } catch (error) {
    console.error('Call next token error:', error);
    throw error;
  }
};

// Admin: Toggle counter status
export const toggleCounter = async (serviceId, isOpen) => {
  try {
    const statusKey = `status:${serviceId}`;
    const newStatus = isOpen ? 'open' : 'closed';
    await redisClient.set(statusKey, newStatus);
    
    const service = SERVICES[serviceId];
    
    return {
      success: true,
      serviceId,
      serviceName: service.name,
      status: newStatus,
    };
  } catch (error) {
    console.error('Toggle counter error:', error);
    throw error;
  }
};

// Admin: Remove token from queue
export const removeToken = async (serviceId, token) => {
  try {
    const queueKey = `queue:${serviceId}`;
    
    // Remove token from queue list
    await redisClient.lRem(queueKey, 1, token);
    
    // Update token status
    const tokenKey = `token:${serviceId}:${token}`;
    await redisClient.hSet(tokenKey, {
      status: 'removed',
      removedAt: new Date().toISOString(),
    });
    
    return { success: true };
  } catch (error) {
    console.error('Remove token error:', error);
    throw error;
  }
};

// Get dashboard stats
export const getDashboardStats = async () => {
  try {
    let totalQueues = 0;
    let totalWaiting = 0;
    
    for (const [id, service] of Object.entries(SERVICES)) {
      const queueKey = `queue:${id}`;
      const queueLength = await redisClient.lLen(queueKey);
      totalQueues++;
      totalWaiting += queueLength;
    }
    
    // Mock values for today's stats (you can expand later)
    return {
      totalQueues,
      peopleWaiting: totalWaiting,
      tokensServedToday: Math.floor(Math.random() * 100) + 50,
      avgWaitTime: 12,
    };
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    throw error;
  }
};

export default {
  joinQueue,
  trackQueue,
  getQueueStatus,
  getAllQueues,
  callNextToken,
  toggleCounter,
  removeToken,
  getDashboardStats,
};