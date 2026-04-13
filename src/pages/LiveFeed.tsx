import { VideoPage } from "@/components/VideoPage";

export default function LiveFeed() {
  return (
    <VideoPage
      category="livefeed"
      title="Live Broadcasting"
      subtitle="Real-time match updates from the field"
      loadingMessage="Syncing live data streams..."
      emoji="🔴"
    />
  );
}
