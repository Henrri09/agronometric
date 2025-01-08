import { Route, Routes } from "react-router-dom";
import SuperAdmin from "@/pages/SuperAdmin";
import FinancialManagement from "@/pages/super-admin/FinancialManagement";
import SuperAdminAnalytics from "@/pages/super-admin/SuperAdminAnalytics";
import SupportTickets from "@/pages/super-admin/SupportTickets";

export const SuperAdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SuperAdmin />} />
      <Route path="/financial" element={<FinancialManagement />} />
      <Route path="/analytics" element={<SuperAdminAnalytics />} />
      <Route path="/support" element={<SupportTickets />} />
    </Routes>
  );
};