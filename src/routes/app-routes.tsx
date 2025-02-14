import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./protected-route";
import { AppLayout } from "./app-layout";

import Login from "@/pages/Login";
import Register from "@/pages/Register";
import RequestReset from "@/pages/RequestReset";
import NewPassword from "@/pages/NewPassword";
import SetInitialPassword from "@/pages/SetInitialPassword";
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
import Tickets from "@/pages/Tickets";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/request-reset" element={<RequestReset />} />
      <Route path="/reset-password" element={<NewPassword />} />
      <Route path="/set-initial-password" element={<SetInitialPassword />} />

      {/* Super Admin Routes */}
      <Route
        path="/super-admin/*"
        element={
          <ProtectedRoute superAdminOnly>
            <AppLayout>
              <Routes>
                <Route path="/" element={<SuperAdmin />} />
                <Route path="/financial" element={<FinancialManagement />} />
                <Route path="/analytics" element={<SuperAdminAnalytics />} />
                <Route path="/support" element={<SupportTickets />} />
                <Route path="/tutorials" element={<TutorialManagement />} />
                <Route path="*" element={<Navigate to="/super-admin" replace />} />
              </Routes>
            </AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Regular User Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute nonSuperAdmin>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/machinery" element={<Machinery />} />
                <Route path="/parts-inventory" element={<PartsInventory />} />
                <Route path="/maintenance-schedule" element={<MaintenanceSchedule />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/task-management" element={<TaskManagement />} />
                <Route path="/documentation" element={<Documentation />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/service-orders" element={<ServiceOrders />} />
                <Route path="/tickets" element={<Tickets />} />
                <Route path="/users" element={<Users />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};