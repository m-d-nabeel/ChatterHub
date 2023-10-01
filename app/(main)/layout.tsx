import NavigationSidebar from "@/components/navigation/navigation-sidebar";
import { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {

  return (
    <div className="h-full overflow-hidden">
      <div className="fixed inset-y-0 hidden h-full w-20 md:block z-50">
        <NavigationSidebar />
      </div>
      <main className="h-full md:pl-20">{children}</main>
    </div>
  );
};

export default MainLayout;
