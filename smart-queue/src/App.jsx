import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<CustomerHome />} />
        <Route path="/join" element={<JoinQueue />} />
        <Route path="/track" element={<TrackQueue />} />
        <Route path="/queue-status" element={<QueueStatus />} />

        {/* Admin Routes */}
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
    </BrowserRouter>
  );
}
