import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";

// Import pages
import { AuthenticatedRoutes } from "./routes/AuthenticatedRoutes";
import { SuperAdminRoutes } from "./routes/SuperAdminRoutes";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

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

  const checkAccess = () => {
    if (requiredRole === 'super_admin' && userRole !== 'super_admin') {
      return false;
    }

    if (requiredRole === 'admin' && !['admin', 'super_admin'].includes(userRole)) {
      return false;
    }

    if (!isAuthenticated && location.pathname !== '/login') {
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
                <Route path="/*" element={<AuthenticatedRoutes />} />
                <Route path="/super-admin/*" element={<SuperAdminRoutes />} />
              </Routes>
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};