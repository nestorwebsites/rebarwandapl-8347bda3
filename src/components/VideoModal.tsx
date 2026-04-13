import { X } from "lucide-react";
import { extractYoutubeId } from "@/lib/youtube";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { VideoComments } from "@/components/VideoComments";

interface VideoModalProps {
  videoId: string;
  title: string;
  youtubeUrl: string;
  onClose: () => void;
}

export function VideoModal({ videoId, title, youtubeUrl, onClose }: VideoModalProps) {
  const ytId = extractYoutubeId(youtubeUrl);

  useEffect(() => {
    supabase.rpc("increment_views" as never, { video_id: videoId } as never).then(() => {});

    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [videoId, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-10 right-0 text-foreground hover:text-primary transition-colors">
          <X size={24} />
        </button>
        <div className="rounded-xl overflow-hidden border border-border bg-card">
          <div className="aspect-video">
            {ytId ? (
              <iframe
                src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                title={title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                Invalid YouTube URL
              </div>
            )}
          </div>
          <div className="p-4 space-y-4">
            <h2 className="text-lg font-bold text-foreground">{title}</h2>
            <VideoComments videoId={videoId} />
          </div>
        </div>
      </div>
    </div>
  );
}
