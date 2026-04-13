import { VideoPage } from "@/components/VideoPage";

export default function Shorts() {
  return (
    <VideoPage
      category="shorts"
      title="Mobile Shorts"
      subtitle="Quick clips and trending moments"
      loadingMessage="Loading vertical feed..."
      emoji="📱"
    />
  );
}
