import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-6xl md:text-8xl font-extrabold text-primary">404</h1>
        <h2 className="text-2xl font-bold text-foreground">PAGE NOT FOUND</h2>
        <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity glow-red"
        >
          🏠 Return to Home
        </Link>
      </div>
    </div>
  );
}
