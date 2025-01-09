import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  superAdminOnly?: boolean;
  nonSuperAdmin?: boolean;
  minRole?: 'visitor' | 'common' | 'admin';
}

export const ProtectedRoute = ({ 
  children, 
  adminOnly = false, 
  superAdminOnly = false,
  nonSuperAdmin = false,
  minRole = 'visitor'
}: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'visitor' | 'common' | 'admin' | 'super_admin' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setIsAuthenticated(true);
          
          const { data: userRoles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .maybeSingle();
          
          setUserRole(userRoles?.role || 'visitor');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Super admin specific check
  if (superAdminOnly && userRole !== 'super_admin') {
    return <Navigate to="/" replace />;
  }

  // Non-super admin check
  if (nonSuperAdmin && userRole === 'super_admin') {
    return <Navigate to="/super-admin" replace />;
  }

  // Admin only check
  if (adminOnly && userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Role hierarchy check for minimum role requirement
  const roleHierarchy = {
    'visitor': 0,
    'common': 1,
    'admin': 2,
    'super_admin': 3
  };

  const userRoleLevel = userRole ? roleHierarchy[userRole] : 0;
  const requiredRoleLevel = roleHierarchy[minRole];

  if (userRoleLevel < requiredRoleLevel) {
    return <Navigate to="/" replace />;
  }

  return children;
};