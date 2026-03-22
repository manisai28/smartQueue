import { Outlet } from 'react-router-dom';
import AdminSidebar from '@/components/common/AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-surface-950">
      <AdminSidebar />
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}
