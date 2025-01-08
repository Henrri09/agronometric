import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthGuard } from "./components/auth/AuthGuard";
import { AppSidebar } from "./components/AppSidebar";
import { Header } from "./components/Header";
import { SidebarProvider } from "./components/ui/sidebar";
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
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  <AuthGuard>
                    <div className="flex w-full">
                      <AppSidebar />
                      <div className="flex-1">
                        <Header />
                        <div className="mt-14">
                          <Dashboard />
                        </div>
                      </div>
                    </div>
                  </AuthGuard>
                }
              />
              <Route
                path="/service-orders"
                element={
                  <AuthGuard>
                    <div className="flex w-full">
                      <AppSidebar />
                      <div className="flex-1">
                        <Header />
                        <div className="mt-14">
                          <ServiceOrders />
                        </div>
                      </div>
                    </div>
                  </AuthGuard>
                }
              />
              <Route
                path="/service-orders/:id"
                element={
                  <AuthGuard>
                    <div className="flex w-full">
                      <AppSidebar />
                      <div className="flex-1">
                        <Header />
                        <div className="mt-14">
                          <ServiceOrderEdit />
                        </div>
                      </div>
                    </div>
                  </AuthGuard>
                }
              />
              <Route
                path="/machinery"
                element={
                  <AuthGuard>
                    <div className="flex w-full">
                      <AppSidebar />
                      <div className="flex-1">
                        <Header />
                        <div className="mt-14">
                          <Machinery />
                        </div>
                      </div>
                    </div>
                  </AuthGuard>
                }
              />
              <Route
                path="/parts-inventory"
                element={
                  <AuthGuard>
                    <div className="flex w-full">
                      <AppSidebar />
                      <div className="flex-1">
                        <Header />
                        <div className="mt-14">
                          <PartsInventory />
                        </div>
                      </div>
                    </div>
                  </AuthGuard>
                }
              />
              <Route
                path="/calendar"
                element={
                  <AuthGuard>
                    <div className="flex w-full">
                      <AppSidebar />
                      <div className="flex-1">
                        <Header />
                        <div className="mt-14">
                          <Calendar />
                        </div>
                      </div>
                    </div>
                  </AuthGuard>
                }
              />
              <Route
                path="/task-management"
                element={
                  <AuthGuard>
                    <div className="flex w-full">
                      <AppSidebar />
                      <div className="flex-1">
                        <Header />
                        <div className="mt-14">
                          <TaskManagement />
                        </div>
                      </div>
                    </div>
                  </AuthGuard>
                }
              />
              <Route
                path="/kanban"
                element={
                  <AuthGuard>
                    <div className="flex w-full">
                      <AppSidebar />
                      <div className="flex-1">
                        <Header />
                        <div className="mt-14">
                          <KanbanBoard />
                        </div>
                      </div>
                    </div>
                  </AuthGuard>
                }
              />
              <Route
                path="/maintenance-schedule"
                element={
                  <AuthGuard>
                    <div className="flex w-full">
                      <AppSidebar />
                      <div className="flex-1">
                        <Header />
                        <div className="mt-14">
                          <MaintenanceSchedule />
                        </div>
                      </div>
                    </div>
                  </AuthGuard>
                }
              />
              <Route
                path="/analytics"
                element={
                  <AuthGuard>
                    <div className="flex w-full">
                      <AppSidebar />
                      <div className="flex-1">
                        <Header />
                        <div className="mt-14">
                          <Analytics />
                        </div>
                      </div>
                    </div>
                  </AuthGuard>
                }
              />
              <Route
                path="/settings"
                element={
                  <AuthGuard>
                    <div className="flex w-full">
                      <AppSidebar />
                      <div className="flex-1">
                        <Header />
                        <div className="mt-14">
                          <Settings />
                        </div>
                      </div>
                    </div>
                  </AuthGuard>
                }
              />
              <Route
                path="/users"
                element={
                  <AuthGuard>
                    <div className="flex w-full">
                      <AppSidebar />
                      <div className="flex-1">
                        <Header />
                        <div className="mt-14">
                          <Users />
                        </div>
                      </div>
                    </div>
                  </AuthGuard>
                }
              />
            </Routes>
          </div>
          <Toaster position="top-right" />
        </SidebarProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;