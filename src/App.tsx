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
import { Alert, AlertDescription } from "@/components/ui/alert";

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

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (session?.user) {
          setIsAuthenticated(true);
          
          const { data: userRoles, error: rolesError } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();
          
          if (rolesError) throw rolesError;
          
          setIsAdmin(userRoles?.role === 'admin');
        } else {
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (err: any) {
        setError(err.message);
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        setIsAuthenticated(true);
        if (session?.user) {
          const { data: userRoles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .single();
          
          setIsAdmin(userRoles?.role === 'admin');
        }
      }
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
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
                    <Route path="/service-orders" element={<ServiceOrders />} />
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
                    <Route path="/task-management" element={<TaskManagement />} />
                    <Route path="/calendar" element={<Calendar />} />
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