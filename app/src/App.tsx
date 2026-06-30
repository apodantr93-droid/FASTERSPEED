import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';
import Layout from '@/components/layout/Layout';
import LoginPage from '@/pages/LoginPage';

// Admin pages
import AdminDashboard from '@/pages/admin/DashboardPage';
import ShipmentsPage from '@/pages/admin/ShipmentsPage';
import DriversPage from '@/pages/admin/DriversPage';
import ClientsPage from '@/pages/admin/ClientsPage';
import StatusesPage from '@/pages/admin/StatusesPage';
import AdminCalculator from '@/pages/admin/CalculatorPage';
import ReportsPage from '@/pages/admin/ReportsPage';
import LinksPage from '@/pages/admin/LinksPage';

// Driver pages
import DriverDashboard from '@/pages/driver/DriverDashboard';
import DriverMyShipments from '@/pages/driver/MyShipments';
import DriverNewShipment from '@/pages/driver/NewShipment';
import QRScanPage from '@/pages/driver/QRScanPage';
import DriverNotifications from '@/pages/driver/Notifications';

// Client pages
import ClientDashboard from '@/pages/client/ClientDashboard';
import ClientMyShipments from '@/pages/client/MyShipments';
import TrackShipment from '@/pages/client/TrackShipment';
import ClientCalculator from '@/pages/client/CalculatorPage';
import HistoryPage from '@/pages/client/HistoryPage';
import ClientNewShipment from '@/pages/client/NewShipment';

function RequireAuth({ allowedRoles }: { allowedRoles: string[] }) {
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(currentUser.role)) {
    const redirectMap: Record<string, string> = {
      admin: '/admin',
      driver: '/driver',
      client: '/client',
    };
    return <Navigate to={redirectMap[currentUser.role] || '/login'} replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default function App() {
  return (
    <DataProvider>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Routes */}
        <Route element={<RequireAuth allowedRoles={['admin']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/shipments" element={<ShipmentsPage />} />
          <Route path="/admin/drivers" element={<DriversPage />} />
          <Route path="/admin/clients" element={<ClientsPage />} />
          <Route path="/admin/statuses" element={<StatusesPage />} />
          <Route path="/admin/calculator" element={<AdminCalculator />} />
          <Route path="/admin/reports" element={<ReportsPage />} />
          <Route path="/admin/links" element={<LinksPage />} />
        </Route>

        {/* Driver Routes */}
        <Route element={<RequireAuth allowedRoles={['driver']} />}>
          <Route path="/driver" element={<DriverDashboard />} />
          <Route path="/driver/shipments" element={<DriverMyShipments />} />
          <Route path="/driver/new" element={<DriverNewShipment />} />
          <Route path="/driver/scan" element={<QRScanPage />} />
          <Route path="/driver/notifications" element={<DriverNotifications />} />
        </Route>

        {/* Client Routes */}
        <Route element={<RequireAuth allowedRoles={['client']} />}>
          <Route path="/client" element={<ClientDashboard />} />
          <Route path="/client/shipments" element={<ClientMyShipments />} />
          <Route path="/client/track" element={<TrackShipment />} />
          <Route path="/client/calculator" element={<ClientCalculator />} />
          <Route path="/client/history" element={<HistoryPage />} />
          <Route path="/client/new" element={<ClientNewShipment />} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </DataProvider>
  );
}
