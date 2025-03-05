import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import { CompanyIdProvider } from "@/components/dashboard/CompanyIdProvider";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <CompanyIdProvider>
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
    </CompanyIdProvider>
  );
};