import { VideoPage } from "@/components/VideoPage";

export default function Highlights() {
  return (
    <VideoPage
      category="highlights"
      title="Match Highlights"
      subtitle="Rewatch the best moments from Rwanda Premier League"
      loadingMessage="Fetching highlights from the cloud..."
      emoji="🏆"
    />
  );
}
