import { Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'visitor' | 'common' | 'admin' | 'super_admin';
}

export const ProtectedRoute = ({ children, requiredRole = 'visitor' }: ProtectedRouteProps) => {
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

  const visitorAllowedRoutes = [
    '/service-orders',
    '/machinery',
    '/calendar',
    '/documentation',
    '/parts-inventory',
    '/maintenance-schedule'
  ];

  const commonUserRestrictedRoutes = [
    '/users',
    '/analytics'
  ];

  const checkAccess = () => {
    const currentPath = location.pathname;

    if (requiredRole === 'super_admin' && userRole !== 'super_admin') {
      return false;
    }

    if (requiredRole === 'admin' && !['admin', 'super_admin'].includes(userRole)) {
      return false;
    }

    if (!isAuthenticated) {
      if (!visitorAllowedRoutes.includes(currentPath)) {
        return false;
      }
    } else if (userRole === 'common' && commonUserRestrictedRoutes.includes(currentPath)) {
      return false;
    }

    return true;
  };

  if (!checkAccess()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};