import { Eye } from "lucide-react";
import { getThumbnailUrl } from "@/lib/youtube";

interface VideoCardProps {
  title: string;
  youtubeUrl: string;
  category: string;
  views: number;
  onClick: () => void;
}

const categoryConfig: Record<string, { emoji: string; label: string; color: string }> = {
  home: { emoji: "🏠", label: "Featured", color: "bg-accent text-foreground" },
  livefeed: { emoji: "🔴", label: "Live Feed", color: "bg-primary/20 text-primary" },
  highlights: { emoji: "🏆", label: "Highlights", color: "bg-gold/20 text-gold" },
  trainings: { emoji: "⚽", label: "Trainings", color: "bg-success/20 text-success" },
  shorts: { emoji: "📱", label: "Shorts", color: "bg-blue-500/20 text-blue-400" },
  international: { emoji: "🌍", label: "International", color: "bg-purple-500/20 text-purple-300" },
};

export function VideoCard({ title, youtubeUrl, category, views, onClick }: VideoCardProps) {
  const config = categoryConfig[category] || categoryConfig.livefeed;

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-300 glow-red-hover"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={getThumbnailUrl(youtubeUrl)}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-2 left-2">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${config.color}`}>
            {config.emoji} {config.label}
          </span>
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-1 mt-1.5 text-muted-foreground text-xs">
          <Eye size={12} />
          <span>{views} views</span>
        </div>
      </div>
    </div>
  );
}
