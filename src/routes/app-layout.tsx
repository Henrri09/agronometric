import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";

interface AppLayoutProps {
  children: React.ReactNode;
}

function MainContent({ children }: AppLayoutProps) {
  const isMobile = useIsMobile();
  const { open } = useSidebar();
  
  return (
    <main className={`flex-1 overflow-auto p-6 transition-all duration-300`} 
          style={{ marginLeft: !isMobile ? (open ? '280px' : '64px') : '0' }}>
      {children}
    </main>
  );
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen flex flex-col w-full">
        <Header />
        <div className="flex flex-1 pt-14">
          <AppSidebar />
          <MainContent>{children}</MainContent>
        </div>
      </div>
    </SidebarProvider>
  );
};