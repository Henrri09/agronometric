import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Machinery from "./pages/Machinery";
import ServiceOrders from "./pages/ServiceOrders";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import TaskManagement from "./pages/TaskManagement";
import Calendar from "./pages/Calendar";
import PartsInventory from "./pages/PartsInventory";
import MaintenanceSchedule from "./pages/MaintenanceSchedule";
import SuperAdmin from "./pages/SuperAdmin";
import FinancialManagement from "./pages/super-admin/FinancialManagement";
import SuperAdminAnalytics from "./pages/super-admin/SuperAdminAnalytics";
import SupportTickets from "./pages/super-admin/SupportTickets";
import Documentation from "./pages/Documentation";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, adminOnly = false, superAdminOnly = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setIsAuthenticated(true);
        
        const { data: userRoles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        setIsAdmin(userRoles?.role === 'admin');
        setIsSuperAdmin(userRoles?.role === 'super_admin');
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (superAdminOnly && !isSuperAdmin) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && !isAdmin && !isSuperAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppLayout = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <Header />
        <div className="flex flex-1 pt-12">
          <AppSidebar />
          <main className={`flex-1 overflow-auto p-6 ${!isMobile ? 'ml-64' : ''}`}>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/documentation" element={<Documentation />} />
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
                      path="/users" 
                      element={
                        <ProtectedRoute adminOnly>
                          <Users />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/machinery" 
                      element={
                        <ProtectedRoute adminOnly>
                          <Machinery />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/service-orders" 
                      element={
                        <ProtectedRoute adminOnly>
                          <ServiceOrders />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/analytics" 
                      element={
                        <ProtectedRoute adminOnly>
                          <Analytics />
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
                    <Route 
                      path="/task-management" 
                      element={
                        <ProtectedRoute adminOnly>
                          <TaskManagement />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/calendar" 
                      element={
                        <ProtectedRoute adminOnly>
                          <Calendar />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/parts-inventory" 
                      element={
                        <ProtectedRoute adminOnly>
                          <PartsInventory />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/maintenance-schedule" 
                      element={
                        <ProtectedRoute adminOnly>
                          <MaintenanceSchedule />
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
