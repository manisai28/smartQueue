import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import queueRoutes from './routes/queueRoutes.js';
import './config/redis.js'; // Import to initialize Redis connection

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', queueRoutes); // Queue routes (includes /queue/* and /admin/*)

// Simple services route (temporary mock)
app.get('/api/services', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, name: 'Bank Counter', avgWaitTime: 5, icon: '🏦', description: 'Banking services' },
      { id: 2, name: 'Hospital OPD', avgWaitTime: 15, icon: '🏥', description: 'Outpatient department' },
      { id: 3, name: 'Document Service', avgWaitTime: 10, icon: '📄', description: 'Document verification' },
      { id: 4, name: 'Customer Support', avgWaitTime: 8, icon: '💬', description: 'General inquiries' }
    ]
  });
});

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Database connection and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully to Supabase');
    
    // Sync models (create table if not exists)
    await sequelize.sync({ alter: false });
    console.log('✅ Database synced');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📍 Services API: http://localhost:${PORT}/api/services`);
      console.log(`📍 Queue API: http://localhost:${PORT}/api/queue/all`);
    });
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

startServer();