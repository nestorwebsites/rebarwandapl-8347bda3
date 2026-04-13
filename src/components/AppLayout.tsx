import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

export function AppLayout() {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
        <footer className="py-4 px-6 text-center border-t border-border">
          <p className="text-xs text-muted-foreground">
            Created by Fils Nestor™ © All rights Reserved
          </p>
        </footer>
      </div>
    </div>
  );
}
