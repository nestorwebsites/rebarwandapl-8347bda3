import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";

interface Match {
  id: string;
  home_team: string;
  away_team: string;
  match_date: string;
  venue: string;
  status: string;
}

const statuses = [
  { value: "upcoming", label: "📅 Upcoming" },
  { value: "live", label: "🔴 Live" },
  { value: "completed", label: "✅ Completed" },
];

export function AdminMatchQueue() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [matchDate, setMatchDate] = useState("");
  const [venue, setVenue] = useState("");
  const [adding, setAdding] = useState(false);

  const fetchMatches = async () => {
    const { data } = await supabase.from("match_queue").select("*").order("match_date", { ascending: true });
    setMatches((data as Match[]) || []);
  };

  useEffect(() => { fetchMatches(); }, []);

  const handleAdd = async () => {
    if (!homeTeam.trim() || !awayTeam.trim() || !matchDate) {
      toast.error("Fill in teams and date");
      return;
    }
    setAdding(true);
    const { error } = await supabase.from("match_queue").insert({
      home_team: homeTeam.trim(),
      away_team: awayTeam.trim(),
      match_date: new Date(matchDate).toISOString(),
      venue: venue.trim(),
    });
    setAdding(false);
    if (error) {
      toast.error("Failed to add match");
    } else {
      toast.success("Match added to queue!");
      setHomeTeam("");
      setAwayTeam("");
      setMatchDate("");
      setVenue("");
      fetchMatches();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this match?")) return;
    await supabase.from("match_queue").delete().eq("id", id);
    toast.success("Match removed");
    fetchMatches();
  };

  const handleStatusChange = async (id: string, status: string) => {
    await supabase.from("match_queue").update({ status }).eq("id", id);
    toast.success("Status updated");
    fetchMatches();
  };

  return (
    <div className="rounded-xl bg-card border border-border p-6 space-y-4">
      <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
        <Calendar size={20} /> Match Queue Manager
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input value={homeTeam} onChange={(e) => setHomeTeam(e.target.value)} placeholder="Home Team" className="px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        <input value={awayTeam} onChange={(e) => setAwayTeam(e.target.value)} placeholder="Away Team" className="px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        <input type="datetime-local" value={matchDate} onChange={(e) => setMatchDate(e.target.value)} className="px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        <input value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Venue (optional)" className="px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>
      <button onClick={handleAdd} disabled={adding} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 glow-red disabled:opacity-50">
        {adding ? "Adding..." : "➕ Add Match to Queue"}
      </button>

      <div className="divide-y divide-border">
        {matches.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No matches in queue</p>
        ) : (
          matches.map((m) => (
            <div key={m.id} className="flex items-center justify-between py-3 gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{m.home_team} vs {m.away_team}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(m.match_date), "MMM d, yyyy · h:mm a")}
                  {m.venue && ` · ${m.venue}`}
                </p>
              </div>
              <select
                value={m.status}
                onChange={(e) => handleStatusChange(m.id, e.target.value)}
                className="px-2 py-1 rounded-lg bg-secondary border border-border text-foreground text-xs focus:outline-none"
              >
                {statuses.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <button onClick={() => handleDelete(m.id)} className="p-1.5 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
