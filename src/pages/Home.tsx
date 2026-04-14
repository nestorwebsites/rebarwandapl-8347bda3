import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export default function Home() {

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero */}
      <div className="space-y-3">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          Sports Dashboard
        </h2>
        <p className="text-muted-foreground text-lg">
          Stream Rwanda's finest sports content live and on-demand.
        </p>
        <div className="flex gap-3 pt-2">
          <Link
            to="/livefeed"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity glow-red"
          >
            🔴 Go Live Now
          </Link>
          <Link
            to="/highlights"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-secondary text-secondary-foreground font-semibold text-sm hover:bg-accent transition-colors border border-border"
          >
            🏆 Recent Goals
          </Link>
        </div>
      </div>


      {/* Latest Updates */}
      <div className="rounded-xl bg-card border border-border p-5">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={16} className="text-gold" />
          <h3 className="font-semibold text-foreground">Latest Updates</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Stay tuned for the latest Amavubi matches and Rwanda Premier League action. 
          Stream live games, catch up on highlights, and master your skills with professional training content.
        </p>
      </div>
    </div>
  );
}
