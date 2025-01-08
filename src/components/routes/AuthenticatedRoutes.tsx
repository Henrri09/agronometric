import { Route, Routes, Navigate } from "react-router-dom";
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
import Documentation from "@/pages/Documentation";

export const AuthenticatedRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/documentation" element={<Documentation />} />
      <Route path="/users" element={<Users />} />
      <Route path="/machinery" element={<Machinery />} />
      <Route path="/service-orders" element={<ServiceOrders />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/task-management" element={<TaskManagement />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/parts-inventory" element={<PartsInventory />} />
      <Route path="/maintenance-schedule" element={<MaintenanceSchedule />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};