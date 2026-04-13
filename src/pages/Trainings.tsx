import { VideoPage } from "@/components/VideoPage";

export default function Trainings() {
  return (
    <VideoPage
      category="trainings"
      title="Skill Trainings"
      subtitle="Master your game with professional drills"
      loadingMessage="Accessing training database..."
      emoji="⚽"
    />
  );
}
