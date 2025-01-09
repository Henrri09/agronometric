import { Route, Routes } from "react-router-dom";
import { AppLayout } from "./app-layout";
import { ProtectedRoute } from "./protected-route";

// Pages
import Index from "@/pages/Index";
import Analytics from "@/pages/Analytics";
import Calendar from "@/pages/Calendar";
import Documentation from "@/pages/Documentation";
import Login from "@/pages/Login";
import Machinery from "@/pages/Machinery";
import MaintenanceSchedule from "@/pages/MaintenanceSchedule";
import PartsInventory from "@/pages/PartsInventory";
import Register from "@/pages/Register";
import ServiceOrders from "@/pages/ServiceOrders";
import ServiceOrderEdit from "@/pages/ServiceOrderEdit";
import Settings from "@/pages/Settings";
import SuperAdmin from "@/pages/SuperAdmin";
import TaskManagement from "@/pages/TaskManagement";
import Users from "@/pages/Users";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route element={<AppLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Index />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/machinery" element={<Machinery />} />
          <Route path="/maintenance-schedule" element={<MaintenanceSchedule />} />
          <Route path="/parts-inventory" element={<PartsInventory />} />
          <Route path="/service-orders" element={<ServiceOrders />} />
          <Route path="/service-orders/:id" element={<ServiceOrderEdit />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/super-admin" element={<SuperAdmin />} />
          <Route path="/task-management" element={<TaskManagement />} />
          <Route path="/users" element={<Users />} />
        </Route>
      </Route>
    </Routes>
  );
}