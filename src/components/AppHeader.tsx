import { useLocation } from "react-router-dom";
import { MobileNav } from "./MobileNav";

export function AppHeader() {
  const location = useLocation();
  const isAdmin = location.pathname === "/admin";

  return (
    <header className="h-14 flex items-center justify-between px-4 md:px-6 border-b border-border bg-card/50 backdrop-blur sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <MobileNav />
        <h1 className="text-lg md:text-xl font-extrabold tracking-wider text-foreground">
          REBA <span className="text-primary">RWANDA</span>
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center text-sm font-bold text-primary">
            N
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-xs font-semibold text-foreground">Nestor</p>
            <p className="text-[10px] text-muted-foreground">{isAdmin ? "Admin" : "Member"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
