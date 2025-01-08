import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { DashboardCards } from "@/components/super-admin/DashboardCards";
import { CompanyManagement } from "@/components/super-admin/CompanyManagement";

export default function SuperAdmin() {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkSuperAdminStatus();
  }, []);

  const checkSuperAdminStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();
      
      setIsSuperAdmin(roles?.role === "super_admin");
      if (roles?.role !== "super_admin") {
        navigate("/");
      }
    }
  };

  if (!isSuperAdmin) {
    return null;
  }

  return (
    <div className="p-6">
      <PageHeader
        title="Gestão de Empresas"
        description="Gerencie as empresas e seus administradores"
      />
      
      <DashboardCards />
      <CompanyManagement />
    </div>
  );
}