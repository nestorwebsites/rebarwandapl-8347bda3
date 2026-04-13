import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { extractYoutubeId } from "@/lib/youtube";
import { VideoModal } from "@/components/VideoModal";

const categoryConfig: Record<string, { emoji: string; label: string }> = {
  livefeed: { emoji: "🔴", label: "Live Feed" },
  highlights: { emoji: "🏆", label: "Highlights" },
  trainings: { emoji: "⚽", label: "Trainings" },
  shorts: { emoji: "📱", label: "Shorts" },
};

interface Video {
  id: string;
  title: string;
  youtube_url: string;
  category: string;
  views: number;
}

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Video[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from("videos")
        .select("*")
        .ilike("title", `%${query.trim()}%`)
        .limit(10);
      setResults(data || []);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <div ref={ref} className="relative">
        <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-1.5 w-48 sm:w-64 md:w-80">
          <Search size={14} className="text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search videos..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
          />
        </div>
        {open && results.length > 0 && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-card border border-border rounded-lg shadow-lg z-50 max-h-72 overflow-y-auto">
            {results.map((v) => {
              const config = categoryConfig[v.category] || categoryConfig.livefeed;
              return (
                <button
                  key={v.id}
                  onClick={() => { setSelectedVideo(v); setOpen(false); setQuery(""); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-accent/50 transition-colors text-left"
                >
                  <img
                    src={`https://img.youtube.com/vi/${extractYoutubeId(v.youtube_url)}/mqdefault.jpg`}
                    alt=""
                    className="w-16 h-10 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{v.title}</p>
                    <span className="text-[10px] text-muted-foreground">
                      {config.emoji} {config.label} · {v.views} views
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
      {selectedVideo && (
        <VideoModal
          videoId={selectedVideo.id}
          title={selectedVideo.title}
          youtubeUrl={selectedVideo.youtube_url}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </>
  );
}
