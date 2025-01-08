import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { useEffect, useState, lazy, Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Lazy load pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Users = lazy(() => import("./pages/Users"));
const Machinery = lazy(() => import("./pages/Machinery"));
const ServiceOrders = lazy(() => import("./pages/ServiceOrders"));
const Analytics = lazy(() => import("./pages/Analytics"));
const Settings = lazy(() => import("./pages/Settings"));
const TaskManagement = lazy(() => import("./pages/TaskManagement"));
const Calendar = lazy(() => import("./pages/Calendar"));
const PartsInventory = lazy(() => import("./pages/PartsInventory"));
const MaintenanceSchedule = lazy(() => import("./pages/MaintenanceSchedule"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Desativa o refetch automático ao focar a janela
      retry: 1, // Reduz o número de tentativas de retry
      staleTime: 5 * 60 * 1000, // Define 5 minutos como tempo de cache
    },
  },
});

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
  </div>
);

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
            <Suspense fallback={<LoadingFallback />}>
              {children}
            </Suspense>
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
          <Route 
            path="/login" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Login />
              </Suspense>
            } 
          />
          <Route 
            path="/register" 
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Register />
              </Suspense>
            } 
          />
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
