import { useState } from "react";
import { useVideos } from "@/hooks/use-videos";
import { VideoCard } from "@/components/VideoCard";
import { VideoModal } from "@/components/VideoModal";
import { LoadingState } from "@/components/LoadingState";

interface VideoPageProps {
  category: string;
  title: string;
  subtitle: string;
  loadingMessage: string;
  emoji: string;
}

interface Video {
  id: string;
  title: string;
  youtube_url: string;
  category: string;
  views: number;
}

export function VideoPage({ category, title, subtitle, loadingMessage, emoji }: VideoPageProps) {
  const { data: videos, isLoading, refetch } = useVideos(category);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-2xl">{emoji}</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">{title}</h2>
        </div>
        <p className="text-muted-foreground">{subtitle}</p>
        {category === "livefeed" && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/30">
            <span className="w-2 h-2 rounded-full bg-primary pulse-live" />
            <span className="text-xs font-semibold text-primary">Live Status: Active</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <LoadingState message={loadingMessage} />
      ) : videos && videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((v) => (
            <VideoCard
              key={v.id}
              title={v.title}
              youtubeUrl={v.youtube_url}
              category={v.category}
              views={v.views}
              onClick={() => setSelectedVideo(v)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">{emoji}</p>
          <p className="mt-2">No videos yet in this category.</p>
        </div>
      )}

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
