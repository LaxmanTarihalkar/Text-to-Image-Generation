import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';

// Public pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// User dashboard pages
import Dashboard from './pages/dashboard/Dashboard';
import Generate from './pages/dashboard/Generate';
import History from './pages/dashboard/History';
import Favorites from './pages/dashboard/Favorites';
import Subscription from './pages/dashboard/Subscription';
import PaymentHistory from './pages/dashboard/PaymentHistory';
import Profile from './pages/dashboard/Profile';
import Settings from './pages/dashboard/Settings';

// Admin pages
import AdminDashboard from './admin/AdminDashboard';
import AdminUsers from './admin/AdminUsers';
import AdminImages from './admin/AdminImages';
import AdminReports from './admin/AdminReports';
import AdminPayments from './admin/AdminPayments';
import AdminAnnouncements from './admin/AdminAnnouncements';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Admin route wrapper
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return children;
};

const PageLoader = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-16 h-16 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      <p className="text-slate-500 dark:text-slate-400 font-medium">Loading Pixora AI...</p>
    </div>
  </div>
);

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User dashboard routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="generate" element={<Generate />} />
        <Route path="history" element={<History />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="subscription" element={<Subscription />} />
        <Route path="payments" element={<PaymentHistory />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="images" element={<AdminImages />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="announcements" element={<AdminAnnouncements />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function ToasterWrapper() {
  const { isDark } = useTheme();
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: isDark
          ? {
              background: '#1e293b',
              color: '#f8fafc',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
            }
          : {
              background: '#ffffff',
              color: '#0f172a',
              border: '1px solid rgba(139, 92, 246, 0.25)',
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            },
        success: { iconTheme: { primary: '#8b5cf6', secondary: isDark ? '#f8fafc' : '#ffffff' } },
        error: { iconTheme: { primary: '#ef4444', secondary: isDark ? '#f8fafc' : '#ffffff' } },
      }}
    />
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
        <ToasterWrapper />
      </AuthProvider>
    </ThemeProvider>
  );
}
