import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex flex-col w-full">
        <Header />
        <div className="flex flex-1 pt-14">
          <AppSidebar />
          <main className={`flex-1 overflow-auto p-6 transition-all duration-300 ${!isMobile ? 'ml-[80px] peer-data-[state=expanded]:ml-[280px]' : ''}`}>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};