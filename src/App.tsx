import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

// Page imports
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Machinery from "./pages/Machinery";
import ServiceOrders from "./pages/ServiceOrders";
import ServiceOrderRegister from "./pages/ServiceOrderRegister";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import KanbanBoard from "./pages/KanbanBoard";
import Calendar from "./pages/Calendar";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => {
  // Simple auth check - replace with your actual auth logic
  const isAuthenticated = true; // This should be dynamic based on your auth state

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {isAuthenticated ? (
            <SidebarProvider>
              <div className="min-h-screen flex w-full">
                <AppSidebar />
                <main className="flex-1 overflow-auto">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/machinery" element={<Machinery />} />
                    <Route path="/service-orders" element={<ServiceOrders />} />
                    <Route path="/service-orders/register" element={<ServiceOrderRegister />} />
                    <Route path="/kanban" element={<KanbanBoard />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </main>
              </div>
            </SidebarProvider>
          ) : (
            <Routes>
              <Route path="*" element={<Login />} />
            </Routes>
          )}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;