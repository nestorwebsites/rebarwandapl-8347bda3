import { Home, Radio, Trophy, Dribbble, Smartphone, Settings, ClipboardList } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";

const items = [
  { title: "Home", url: "/", icon: Home, emoji: "🏠" },
  { title: "Live Feed", url: "/livefeed", icon: Radio, emoji: "🔴" },
  { title: "Highlights", url: "/highlights", icon: Trophy, emoji: "🏆" },
  { title: "Trainings", url: "/trainings", icon: Dribbble, emoji: "⚽" },
  { title: "Shorts", url: "/shorts", icon: Smartphone, emoji: "📱" },
  { title: "Match Queue", url: "/queued", icon: ClipboardList, emoji: "📋" },
  { title: "Settings", url: "/settings", icon: Settings, emoji: "⚙️" },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="hidden md:flex w-56 flex-col border-r border-border bg-sidebar min-h-screen p-4 pt-6">
      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const active = item.url === "/" ? location.pathname === "/" : location.pathname.startsWith(item.url);
          return (
            <NavLink
              key={item.title}
              to={item.url}
              end={item.url === "/"}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active
                  ? "bg-primary/15 text-primary border-l-2 border-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
              activeClassName=""
            >
              <span className="text-lg">{item.emoji}</span>
              <span>{item.title}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
