import { Home, Radio, Trophy, Dribbble, Smartphone, Settings, Menu, X } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useState } from "react";

const items = [
  { title: "Home", url: "/", emoji: "🏠" },
  { title: "Live Feed", url: "/livefeed", emoji: "🔴" },
  { title: "Highlights", url: "/highlights", emoji: "🏆" },
  { title: "Trainings", url: "/trainings", emoji: "⚽" },
  { title: "Shorts", url: "/shorts", emoji: "📱" },
  { title: "International Sports", url: "/international", emoji: "🌍" },
  { title: "Match Queue", url: "/queued", emoji: "📋" },
  { title: "Settings", url: "/settings", emoji: "⚙️" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="md:hidden">
      <button onClick={() => setOpen(!open)} className="p-2 text-foreground">
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>
      {open && (
        <div className="absolute top-14 left-0 right-0 bg-card border-b border-border z-50 p-4">
          <nav className="flex flex-col gap-1">
            {items.map((item) => {
              const active = item.url === "/" ? location.pathname === "/" : location.pathname.startsWith(item.url);
              return (
                <NavLink
                  key={item.title}
                  to={item.url}
                  end={item.url === "/"}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-accent"
                  }`}
                  activeClassName=""
                  onClick={() => setOpen(false)}
                >
                  <span className="text-lg">{item.emoji}</span>
                  <span>{item.title}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
}
