import { useState, useEffect } from "react";
import { toast } from "sonner";

const accentColors = ["#E63939", "#22C55E", "#3B82F6", "#F59E0B", "#8B5CF6", "#EC4899"];

export default function SettingsPage() {
  const [name, setName] = useState(() => localStorage.getItem("reba_user_name") || "Nestor");
  const [selectedColor, setSelectedColor] = useState(() => localStorage.getItem("reba_accent_color") || accentColors[0]);

  useEffect(() => {
    const saved = localStorage.getItem("reba_accent_color");
    if (saved) {
      document.documentElement.style.setProperty("--user-accent", saved);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("reba_user_name", name);
    localStorage.setItem("reba_accent_color", selectedColor);
    document.documentElement.style.setProperty("--user-accent", selectedColor);
    toast.success("Settings Applied Successfully");
  };

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-foreground flex items-center gap-2">
          ⚙️ Preferences
        </h2>
      </div>

      <div className="rounded-xl bg-card border border-border p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Choose Accent Color</label>
          <div className="flex gap-3">
            {accentColors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-10 h-10 rounded-full transition-transform hover:scale-110 ${
                  selectedColor === color ? "ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110" : ""
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity glow-red"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}
