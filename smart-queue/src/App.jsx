import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

// Auth Pages
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';

// Customer Pages
import CustomerHome from './pages/Customer/CustomerHome';
import JoinQueue from './pages/Customer/JoinQueue';
import TrackQueue from './pages/Customer/TrackQueue';
import QueueStatus from './pages/Customer/QueueStatus';

// Admin Pages
import AdminLayout from './pages/Admin/AdminLayout';
import Dashboard from './pages/Admin/Dashboard/Dashboard';
import QueueManagement from './pages/Admin/QueueManagement/QueueManagement';
import ActiveQueues from './pages/Admin/ActiveQueues/ActiveQueues';
import Metrics from './pages/Admin/Metrics/Metrics';
import Logs from './pages/Admin/Logs/Logs';
import Settings from './pages/Admin/Settings/Settings';

// Component to handle root redirect based on auth
const RootRedirect = () => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-white">Loading...</div>
    </div>;
  }
  
  if (isAuthenticated) {
    // If logged in, redirect based on role
    if (user?.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/customer-home" replace />;
    }
  }
  
  // Not logged in, go to login
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Root route - redirects based on auth */}
          <Route path="/" element={<RootRedirect />} />

          {/* Customer Routes (Protected - requires login) */}
          <Route path="/customer-home" element={
            <ProtectedRoute requiredRole="customer">
              <CustomerHome />
            </ProtectedRoute>
          } />
          <Route path="/join" element={
            <ProtectedRoute requiredRole="customer">
              <JoinQueue />
            </ProtectedRoute>
          } />
          <Route path="/track" element={
            <ProtectedRoute requiredRole="customer">
              <TrackQueue />
            </ProtectedRoute>
          } />
          <Route path="/queue-status" element={
            <ProtectedRoute requiredRole="customer">
              <QueueStatus />
            </ProtectedRoute>
          } />

          {/* Admin Routes - NO AUTHENTICATION REQUIRED */}
          {/* Admin will use hardcoded passcode inside dashboard */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="queues" element={<QueueManagement />} />
            <Route path="active" element={<ActiveQueues />} />
            <Route path="metrics" element={<Metrics />} />
            <Route path="logs" element={<Logs />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;