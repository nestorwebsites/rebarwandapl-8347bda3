import { VideoPage } from "@/components/VideoPage";

export default function International() {
  return (
    <VideoPage
      category="international"
      title="International Sports"
      subtitle="Global matches, leagues and sports highlights from around the world"
      loadingMessage="Fetching international sports..."
      emoji="🌍"
    />
  );
}
