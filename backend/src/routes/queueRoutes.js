import express from 'express';
import {
  joinQueue,
  trackQueue,
  getQueueStatus,
  getAllQueues,
  callNextToken,
  toggleCounter,
  removeToken,
  getDashboardStats,
} from '../controllers/queueController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Customer Routes (Public or with auth)
router.post('/queue/join', joinQueue);
router.get('/queue/track/:serviceId/:token', trackQueue);
router.get('/queue/status/:serviceId', getQueueStatus);
router.get('/queue/all', getAllQueues);

// Admin Routes (with authentication)
router.get('/admin/stats', authenticate, getDashboardStats);
router.post('/admin/queues/:serviceId/call-next', authenticate, callNextToken);
router.patch('/admin/queues/:serviceId/counter', authenticate, toggleCounter);
router.delete('/admin/queues/:serviceId/token/:token', authenticate, removeToken);

export default router;