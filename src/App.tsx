import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthGuard } from "./components/auth/AuthGuard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ServiceOrders from "./pages/ServiceOrders";
import ServiceOrderEdit from "./pages/ServiceOrderEdit";
import Machinery from "./pages/Machinery";
import PartsInventory from "./pages/PartsInventory";
import Calendar from "./pages/Calendar";
import TaskManagement from "./pages/TaskManagement";
import KanbanBoard from "./pages/KanbanBoard";
import MaintenanceSchedule from "./pages/MaintenanceSchedule";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Users from "./pages/Users";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <AuthGuard>
                <Dashboard />
              </AuthGuard>
            }
          />
          <Route
            path="/service-orders"
            element={
              <AuthGuard>
                <ServiceOrders />
              </AuthGuard>
            }
          />
          <Route
            path="/service-orders/:id"
            element={
              <AuthGuard>
                <ServiceOrderEdit />
              </AuthGuard>
            }
          />
          <Route
            path="/machinery"
            element={
              <AuthGuard>
                <Machinery />
              </AuthGuard>
            }
          />
          <Route
            path="/parts-inventory"
            element={
              <AuthGuard>
                <PartsInventory />
              </AuthGuard>
            }
          />
          <Route
            path="/calendar"
            element={
              <AuthGuard>
                <Calendar />
              </AuthGuard>
            }
          />
          <Route
            path="/task-management"
            element={
              <AuthGuard>
                <TaskManagement />
              </AuthGuard>
            }
          />
          <Route
            path="/kanban"
            element={
              <AuthGuard>
                <KanbanBoard />
              </AuthGuard>
            }
          />
          <Route
            path="/maintenance-schedule"
            element={
              <AuthGuard>
                <MaintenanceSchedule />
              </AuthGuard>
            }
          />
          <Route
            path="/analytics"
            element={
              <AuthGuard>
                <Analytics />
              </AuthGuard>
            }
          />
          <Route
            path="/settings"
            element={
              <AuthGuard>
                <Settings />
              </AuthGuard>
            }
          />
          <Route
            path="/users"
            element={
              <AuthGuard>
                <Users />
              </AuthGuard>
            }
          />
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </QueryClientProvider>
  );
}

export default App;