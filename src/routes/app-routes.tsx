import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./protected-route";
import { AppLayout } from "./app-layout";

import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ResetPassword from "@/pages/ResetPassword";
import Dashboard from "@/pages/Dashboard";
import Users from "@/pages/Users";
import Machinery from "@/pages/Machinery";
import ServiceOrders from "@/pages/ServiceOrders";
import Analytics from "@/pages/Analytics";
import Settings from "@/pages/Settings";
import TaskManagement from "@/pages/TaskManagement";
import Calendar from "@/pages/Calendar";
import PartsInventory from "@/pages/PartsInventory";
import MaintenanceSchedule from "@/pages/MaintenanceSchedule";
import SuperAdmin from "@/pages/SuperAdmin";
import FinancialManagement from "@/pages/super-admin/FinancialManagement";
import SuperAdminAnalytics from "@/pages/super-admin/SuperAdminAnalytics";
import SupportTickets from "@/pages/super-admin/SupportTickets";
import TutorialManagement from "@/pages/super-admin/TutorialManagement";
import Documentation from "@/pages/Documentation";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Routes>
                {/* Routes accessible by all authenticated users */}
                <Route path="/" element={<Dashboard />} />
                <Route path="/documentation" element={<Documentation />} />
                <Route path="/machinery" element={<Machinery />} />
                <Route path="/parts-inventory" element={<PartsInventory />} />
                <Route path="/maintenance-schedule" element={<MaintenanceSchedule />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/task-management" element={<TaskManagement />} />

                {/* Routes accessible by common users and admins only */}
                <Route 
                  path="/analytics" 
                  element={
                    <ProtectedRoute minRole="common">
                      <Analytics />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/service-orders" 
                  element={
                    <ProtectedRoute minRole="common">
                      <ServiceOrders />
                    </ProtectedRoute>
                  } 
                />

                {/* Routes accessible by admins only */}
                <Route 
                  path="/users" 
                  element={
                    <ProtectedRoute adminOnly>
                      <Users />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute adminOnly>
                      <Settings />
                    </ProtectedRoute>
                  } 
                />

                {/* Super admin routes */}
                <Route 
                  path="/super-admin" 
                  element={
                    <ProtectedRoute superAdminOnly>
                      <SuperAdmin />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/super-admin/financial" 
                  element={
                    <ProtectedRoute superAdminOnly>
                      <FinancialManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/super-admin/analytics" 
                  element={
                    <ProtectedRoute superAdminOnly>
                      <SuperAdminAnalytics />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/super-admin/support" 
                  element={
                    <ProtectedRoute superAdminOnly>
                      <SupportTickets />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/super-admin/tutorials" 
                  element={
                    <ProtectedRoute superAdminOnly>
                      <TutorialManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};