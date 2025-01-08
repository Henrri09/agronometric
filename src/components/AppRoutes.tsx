import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { AppLayout } from "./routes/AppLayout";
import { LazyLoadingSpinner } from "./routes/LazyLoadingSpinner";

// Lazy loaded components
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Users = lazy(() => import("@/pages/Users"));
const Machinery = lazy(() => import("@/pages/Machinery"));
const ServiceOrders = lazy(() => import("@/pages/ServiceOrders"));
const Analytics = lazy(() => import("@/pages/Analytics"));
const Settings = lazy(() => import("@/pages/Settings"));
const TaskManagement = lazy(() => import("@/pages/TaskManagement"));
const Calendar = lazy(() => import("@/pages/Calendar"));
const PartsInventory = lazy(() => import("@/pages/PartsInventory"));
const MaintenanceSchedule = lazy(() => import("@/pages/MaintenanceSchedule"));
const SuperAdmin = lazy(() => import("@/pages/SuperAdmin"));
const FinancialManagement = lazy(() => import("@/pages/super-admin/FinancialManagement"));
const SuperAdminAnalytics = lazy(() => import("@/pages/super-admin/SuperAdminAnalytics"));
const SupportTickets = lazy(() => import("@/pages/super-admin/SupportTickets"));
const Documentation = lazy(() => import("@/pages/Documentation"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={
        <Suspense fallback={<LazyLoadingSpinner />}>
          <Login />
        </Suspense>
      } />
      <Route path="/register" element={
        <Suspense fallback={<LazyLoadingSpinner />}>
          <Register />
        </Suspense>
      } />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Suspense fallback={<LazyLoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/documentation" element={<Documentation />} />
                  <Route path="/super-admin" element={
                    <ProtectedRoute requiredRole="super_admin">
                      <SuperAdmin />
                    </ProtectedRoute>
                  } />
                  <Route path="/super-admin/financial" element={
                    <ProtectedRoute requiredRole="super_admin">
                      <FinancialManagement />
                    </ProtectedRoute>
                  } />
                  <Route path="/super-admin/analytics" element={
                    <ProtectedRoute requiredRole="super_admin">
                      <SuperAdminAnalytics />
                    </ProtectedRoute>
                  } />
                  <Route path="/super-admin/support" element={
                    <ProtectedRoute requiredRole="super_admin">
                      <SupportTickets />
                    </ProtectedRoute>
                  } />
                  <Route path="/users" element={
                    <ProtectedRoute requiredRole="admin">
                      <Users />
                    </ProtectedRoute>
                  } />
                  <Route path="/machinery" element={<Machinery />} />
                  <Route path="/service-orders" element={<ServiceOrders />} />
                  <Route path="/analytics" element={
                    <ProtectedRoute requiredRole="admin">
                      <Analytics />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute requiredRole="admin">
                      <Settings />
                    </ProtectedRoute>
                  } />
                  <Route path="/task-management" element={<TaskManagement />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/parts-inventory" element={<PartsInventory />} />
                  <Route path="/maintenance-schedule" element={<MaintenanceSchedule />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};