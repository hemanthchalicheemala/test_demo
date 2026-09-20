import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth, dashboardPath } from './lib/auth';
import { Spinner } from './components/ui';
import { Layout } from './components/Layout';
import type { Role } from './types';
import type { ReactNode } from 'react';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotificationsPage from './pages/Notifications';

import TenantDashboard from './pages/tenant/Dashboard';
import MyApplications from './pages/tenant/Applications';
import TenantPayments from './pages/tenant/Payments';
import TenantComplaints from './pages/tenant/Complaints';
import RentalAgreement from './pages/tenant/Agreement';

import OwnerDashboard from './pages/owner/Dashboard';
import MyProperties from './pages/owner/MyProperties';
import PropertyForm from './pages/owner/PropertyForm';
import OwnerRequests from './pages/owner/Requests';
import OwnerTenants from './pages/owner/Tenants';
import OwnerPayments from './pages/owner/Payments';
import OwnerComplaints from './pages/owner/Complaints';
import OwnerAnnouncements from './pages/owner/Announcements';

import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminProperties from './pages/admin/Properties';
import AdminRequests from './pages/admin/Requests';
import AdminComplaints from './pages/admin/Complaints';

function Protected({ roles, children }: { roles?: Role[]; children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner label="Loading…" />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to={dashboardPath(user.role)} replace />;
  return <>{children}</>;
}

export function App() {
  const { user, loading } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center"><Spinner label="Loading RentConnect…" /></div>;

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={user ? <Navigate to={dashboardPath(user.role)} replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={dashboardPath(user.role)} replace /> : <Register />} />

      <Route element={<Protected><Layout /></Protected>}>
        {/* Shared */}
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />

        {/* Tenant */}
        <Route path="/tenant" element={<Protected roles={['TENANT']}><TenantDashboard /></Protected>} />
        <Route path="/tenant/applications" element={<Protected roles={['TENANT']}><MyApplications /></Protected>} />
        <Route path="/tenant/payments" element={<Protected roles={['TENANT']}><TenantPayments /></Protected>} />
        <Route path="/tenant/complaints" element={<Protected roles={['TENANT']}><TenantComplaints /></Protected>} />
        <Route path="/tenant/agreement" element={<Protected roles={['TENANT']}><RentalAgreement /></Protected>} />
        <Route path="/tenant/notifications" element={<Protected roles={['TENANT']}><NotificationsPage /></Protected>} />

        {/* Owner */}
        <Route path="/owner" element={<Protected roles={['OWNER']}><OwnerDashboard /></Protected>} />
        <Route path="/owner/properties" element={<Protected roles={['OWNER']}><MyProperties /></Protected>} />
        <Route path="/owner/properties/new" element={<Protected roles={['OWNER']}><PropertyForm /></Protected>} />
        <Route path="/owner/properties/:id/edit" element={<Protected roles={['OWNER']}><PropertyForm /></Protected>} />
        <Route path="/owner/requests" element={<Protected roles={['OWNER']}><OwnerRequests /></Protected>} />
        <Route path="/owner/tenants" element={<Protected roles={['OWNER']}><OwnerTenants /></Protected>} />
        <Route path="/owner/payments" element={<Protected roles={['OWNER']}><OwnerPayments /></Protected>} />
        <Route path="/owner/complaints" element={<Protected roles={['OWNER']}><OwnerComplaints /></Protected>} />
        <Route path="/owner/announcements" element={<Protected roles={['OWNER']}><OwnerAnnouncements /></Protected>} />
        <Route path="/owner/notifications" element={<Protected roles={['OWNER']}><NotificationsPage /></Protected>} />

        {/* Admin */}
        <Route path="/admin" element={<Protected roles={['ADMIN']}><AdminDashboard /></Protected>} />
        <Route path="/admin/users" element={<Protected roles={['ADMIN']}><AdminUsers /></Protected>} />
        <Route path="/admin/properties" element={<Protected roles={['ADMIN']}><AdminProperties /></Protected>} />
        <Route path="/admin/requests" element={<Protected roles={['ADMIN']}><AdminRequests /></Protected>} />
        <Route path="/admin/complaints" element={<Protected roles={['ADMIN']}><AdminComplaints /></Protected>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
