import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";

import Login from "@/pages/Login";
import Register from "@/pages/Register";
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
import Documentation from "@/pages/Documentation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'visitor' | 'common' | 'admin' | 'super_admin';
}

const ProtectedRoute = ({ children, requiredRole = 'visitor' }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string>('visitor');
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
          .single();
        
        setUserRole(userRoles?.role || 'visitor');
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Check access based on role and route
  const checkAccess = () => {
    if (requiredRole === 'super_admin' && userRole !== 'super_admin') {
      return false;
    }

    if (requiredRole === 'admin' && !['admin', 'super_admin'].includes(userRole)) {
      return false;
    }

    if (!isAuthenticated) {
      return false;
    }

    return true;
  };

  if (!checkAccess()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AppLayout = ({ children }: { children: React.ReactNode }) => {
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

export const AppRoutes = () => {
  return (
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
                    <ProtectedRoute requiredRole="super_admin">
                      <SuperAdmin />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/super-admin/financial" 
                  element={
                    <ProtectedRoute requiredRole="super_admin">
                      <FinancialManagement />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/super-admin/analytics" 
                  element={
                    <ProtectedRoute requiredRole="super_admin">
                      <SuperAdminAnalytics />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/super-admin/support" 
                  element={
                    <ProtectedRoute requiredRole="super_admin">
                      <SupportTickets />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/users" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Users />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/machinery" element={<Machinery />} />
                <Route path="/service-orders" element={<ServiceOrders />} />
                <Route 
                  path="/analytics" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Analytics />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Settings />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/task-management" element={<TaskManagement />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/parts-inventory" element={<PartsInventory />} />
                <Route path="/maintenance-schedule" element={<MaintenanceSchedule />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};