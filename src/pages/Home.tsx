import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Zap, Megaphone, Home as HomeIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useVideos } from "@/hooks/use-videos";
import { VideoCard } from "@/components/VideoCard";
import { VideoModal } from "@/components/VideoModal";

interface Announcement {
  id: string;
  message: string;
}

interface Video {
  id: string;
  title: string;
  youtube_url: string;
  category: string;
  views: number;
}

export default function Home() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const { data: homeVideos, refetch } = useVideos("home");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data } = await supabase
        .from("announcements")
        .select("id, message")
        .eq("active", true)
        .order("created_at", { ascending: false });
      setAnnouncements((data as Announcement[]) || []);
    };
    fetchAnnouncements();

    const channel = supabase
      .channel("announcements-home")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "announcements" },
        () => fetchAnnouncements()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
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

      {/* Announcements */}
      {announcements.length > 0 && (
        <div className="rounded-xl bg-card border border-border p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Megaphone size={16} className="text-primary" />
            <h3 className="font-semibold text-foreground">Announcements</h3>
          </div>
          <div className="space-y-3">
            {announcements.map((a) => (
              <div
                key={a.id}
                className="rounded-lg bg-secondary/50 border border-border p-3 text-sm text-foreground whitespace-pre-wrap break-words"
              >
                {a.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Home Videos */}
      {homeVideos && homeVideos.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HomeIcon size={18} className="text-primary" />
            <h3 className="text-xl font-bold text-foreground">Featured Videos</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {homeVideos.map((v) => (
              <VideoCard
                key={v.id}
                title={v.title}
                youtubeUrl={v.youtube_url}
                category={v.category}
                views={v.views}
                onClick={() => setSelectedVideo(v as Video)}
              />
            ))}
          </div>
        </div>
      )}

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

      {selectedVideo && (
        <VideoModal
          videoId={selectedVideo.id}
          title={selectedVideo.title}
          youtubeUrl={selectedVideo.youtube_url}
          onClose={() => {
            setSelectedVideo(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}
