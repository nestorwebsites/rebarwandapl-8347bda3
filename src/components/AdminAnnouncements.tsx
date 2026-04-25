import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Megaphone, Trash2, Pencil, Eye, EyeOff } from "lucide-react";

interface Announcement {
  id: string;
  message: string;
  active: boolean;
  created_at: string;
}

export function AdminAnnouncements() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const fetchItems = async () => {
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });
    setItems((data as Announcement[]) || []);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = async () => {
    if (!message.trim()) {
      toast.error("Write a message first");
      return;
    }
    setSaving(true);
    const { error } = await supabase
      .from("announcements")
      .insert({ message: message.trim(), active: true });
    setSaving(false);
    if (error) {
      toast.error("Failed to add message");
    } else {
      toast.success("Announcement added");
      setMessage("");
      fetchItems();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    await supabase.from("announcements").delete().eq("id", id);
    toast.success("Deleted");
    fetchItems();
  };

  const handleToggle = async (id: string, active: boolean) => {
    await supabase.from("announcements").update({ active: !active }).eq("id", id);
    fetchItems();
  };

  const handleSaveEdit = async (id: string) => {
    if (!editText.trim()) return;
    await supabase
      .from("announcements")
      .update({ message: editText.trim(), updated_at: new Date().toISOString() })
      .eq("id", id);
    setEditingId(null);
    toast.success("Updated");
    fetchItems();
  };

  return (
    <div className="rounded-xl bg-card border border-border p-6 space-y-4">
      <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
        <Megaphone size={20} /> Announcements & Ads
      </h3>
      <p className="text-xs text-muted-foreground">
        These messages appear on the Home page. Toggle visibility, edit, or delete anytime.
      </p>

      <div className="space-y-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your announcement, news flash, or advertisement..."
          rows={3}
          className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
        <button
          onClick={handleAdd}
          disabled={saving}
          className="w-full md:w-auto px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 glow-red disabled:opacity-50"
        >
          {saving ? "Posting..." : "📢 Post Announcement"}
        </button>
      </div>

      <div className="divide-y divide-border border border-border rounded-lg overflow-hidden">
        {items.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">No announcements yet</div>
        ) : (
          items.map((a) => (
            <div key={a.id} className="p-4 hover:bg-accent/50 transition-colors">
              {editingId === a.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(a.id)}
                      className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 rounded-lg bg-secondary text-foreground text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground whitespace-pre-wrap break-words">{a.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {a.active ? "🟢 Visible on Home" : "⚪ Hidden"}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleToggle(a.id, a.active)}
                      className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                      title={a.active ? "Hide" : "Show"}
                    >
                      {a.active ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(a.id);
                        setEditText(a.message);
                      }}
                      className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="p-1.5 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
