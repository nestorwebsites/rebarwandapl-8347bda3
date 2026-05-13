import { useEffect, useState } from "react";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 1800);
    const hideTimer = setTimeout(() => setVisible(false), 2400);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
      <div className="relative flex flex-col items-center gap-6 px-6 text-center">
        <div className="text-5xl md:text-7xl animate-bounce">⚽</div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
          REBA RWANDA <span className="text-primary">PREMIER LEAGUE</span> LIVE
        </h1>
        <p className="text-sm md:text-base text-muted-foreground uppercase tracking-[0.3em]">
          by NESTOR
        </p>
        <div className="mt-4 h-1 w-48 overflow-hidden rounded-full bg-secondary">
          <div className="h-full w-1/2 animate-[loading_1.2s_ease-in-out_infinite] bg-primary" />
        </div>
      </div>
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
