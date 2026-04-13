import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, isPast, isToday } from "date-fns";
import { Calendar, MapPin, Clock } from "lucide-react";

interface Match {
  id: string;
  home_team: string;
  away_team: string;
  match_date: string;
  venue: string;
  status: string;
  created_at: string;
}

export default function Queued() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
    const channel = supabase
      .channel("match_queue_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "match_queue" }, () => fetchMatches())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchMatches = async () => {
    const { data } = await supabase.from("match_queue").select("*").order("match_date", { ascending: true });
    setMatches((data as Match[]) || []);
    setLoading(false);
  };

  const upcoming = matches.filter((m) => m.status === "upcoming");
  const live = matches.filter((m) => m.status === "live");
  const completed = matches.filter((m) => m.status === "completed");

  const statusColor = (status: string) => {
    if (status === "live") return "bg-red-500 animate-pulse";
    if (status === "completed") return "bg-muted-foreground";
    return "bg-green-500";
  };

  const statusLabel = (status: string) => {
    if (status === "live") return "🔴 LIVE";
    if (status === "completed") return "✅ Completed";
    return "📅 Upcoming";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const MatchCard = ({ match }: { match: Match }) => {
    const matchDate = new Date(match.match_date);
    const today = isToday(matchDate);

    return (
      <div className={`rounded-xl bg-card border border-border p-5 space-y-3 transition-all hover:border-primary/40 ${match.status === "live" ? "ring-2 ring-primary/50 border-primary" : ""}`}>
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold text-primary-foreground ${statusColor(match.status)}`}>
            {statusLabel(match.status)}
          </span>
          {today && match.status === "upcoming" && (
            <span className="text-xs font-semibold text-yellow-400">TODAY</span>
          )}
        </div>

        <div className="flex items-center justify-center gap-4 py-2">
          <div className="text-center flex-1">
            <p className="text-lg font-extrabold text-foreground">{match.home_team}</p>
          </div>
          <div className="text-2xl font-black text-primary">VS</div>
          <div className="text-center flex-1">
            <p className="text-lg font-extrabold text-foreground">{match.away_team}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {format(matchDate, "MMM d, yyyy")}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {format(matchDate, "h:mm a")}
          </span>
          {match.venue && (
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {match.venue}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-foreground flex items-center gap-2">
          📋 Match Queue
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Upcoming and scheduled matches</p>
      </div>

      {live.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-primary">🔴 Live Now</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {live.map((m) => <MatchCard key={m.id} match={m} />)}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-foreground">📅 Upcoming Matches</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcoming.map((m) => <MatchCard key={m.id} match={m} />)}
          </div>
        </section>
      )}

      {completed.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-lg font-bold text-muted-foreground">✅ Completed</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completed.map((m) => <MatchCard key={m.id} match={m} />)}
          </div>
        </section>
      )}

      {matches.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-lg font-medium">No matches scheduled yet</p>
          <p className="text-sm">Check back soon for upcoming fixtures!</p>
        </div>
      )}
    </div>
  );
}
