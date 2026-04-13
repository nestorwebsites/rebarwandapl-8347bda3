import { useNavigate } from "react-router-dom";
import { MobileNav } from "./MobileNav";

export function AppHeader() {
  const navigate = useNavigate();

  const handleRefresh = () => {
    navigate("/");
    window.location.reload();
  };

  return (
    <header className="h-14 flex items-center justify-between px-4 md:px-6 border-b border-border bg-card/50 backdrop-blur sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <MobileNav />
        <h1
          onClick={handleRefresh}
          className="text-sm md:text-lg font-extrabold tracking-wider text-foreground leading-tight cursor-pointer hover:text-primary transition-colors"
        >
          REBA <span className="text-primary">RWANDA</span> <span className="hidden sm:inline">PREMIER LEAGUE LIVE</span>
        </h1>
      </div>
    </header>
  );
}
