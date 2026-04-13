import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { isAdminLoggedIn, setAdminLoggedIn } from "@/lib/admin-auth";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, Pencil, Eye, ExternalLink, RefreshCw, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { AdminMatchQueue } from "@/components/AdminMatchQueue";

interface Video {
  id: string;
  title: string;
  youtube_url: string;
  category: string;
  views: number;
  created_at: string;
}

const categories = [
  { value: "livefeed", label: "🔴 Live Feed" },
  { value: "highlights", label: "🏆 Highlights" },
  { value: "trainings", label: "⚽ Trainings" },
  { value: "shorts", label: "📱 Shorts" },
];

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { verifyPassword, initialized } = useAdminAuth();

  const handleLogin = async () => {
    setLoading(true);
    const valid = await verifyPassword(password);
    setLoading(false);
    if (valid) {
      setAdminLoggedIn(true);
      onLogin();
      toast.success("Admin access granted");
    } else {
      toast.error("Invalid password");
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <Lock className="mx-auto text-primary" size={40} />
          <h2 className="text-2xl font-extrabold tracking-wider text-foreground">ADMIN DASHBOARD</h2>
          <p className="text-sm text-muted-foreground">Enter admin password to continue</p>
        </div>
        <div className="rounded-xl bg-card border border-border p-6 space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Admin Password"
            className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleLogin}
            disabled={loading || !initialized}
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity glow-red disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("livefeed");
  const [publishing, setPublishing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { changePassword } = useAdminAuth();
  const queryClient = useQueryClient();

  const fetchVideos = async () => {
    const { data } = await supabase.from("videos").select("*").order("created_at", { ascending: false });
    setVideos(data || []);
  };

  useEffect(() => { fetchVideos(); }, []);

  const handlePublish = async () => {
    if (!title.trim() || !url.trim()) {
      toast.error("Fill in all fields");
      return;
    }
    setPublishing(true);
    const { error } = await supabase.from("videos").insert({ title: title.trim(), youtube_url: url.trim(), category });
    setPublishing(false);
    if (error) {
      toast.error("Failed to publish");
    } else {
      toast.success("Published successfully!");
      setTitle("");
      setUrl("");
      fetchVideos();
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this video?")) return;
    await supabase.from("videos").delete().eq("id", id);
    toast.success("Video deleted");
    fetchVideos();
    queryClient.invalidateQueries({ queryKey: ["videos"] });
  };

  const handleRename = async (id: string) => {
    if (!editTitle.trim()) return;
    await supabase.from("videos").update({ title: editTitle.trim() }).eq("id", id);
    setEditingId(null);
    toast.success("Renamed");
    fetchVideos();
    queryClient.invalidateQueries({ queryKey: ["videos"] });
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (newPassword !== confirmPassword) { toast.error("Passwords don't match"); return; }
    const ok = await changePassword(newPassword);
    if (ok) {
      toast.success("Password updated");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast.error("Failed to update password");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-wider text-foreground">ADMIN DASHBOARD</h2>
          <p className="text-sm text-muted-foreground">REBA RWANDA PREMIER LEAGUE LIVE — Cloud Controller</p>
        </div>
        <div className="flex gap-2">
          <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:bg-accent border border-border">
            <ExternalLink size={14} /> View Website
          </Link>
          <button onClick={fetchVideos} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 glow-red">
            <RefreshCw size={14} /> Sync
          </button>
        </div>
      </div>

      {/* Publish */}
      <div className="rounded-xl bg-card border border-border p-6 space-y-4">
        <h3 className="text-lg font-bold text-foreground">Publish New Content</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Video Title" className="px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="YouTube URL" className="px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full md:w-auto px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <button onClick={handlePublish} disabled={publishing} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 glow-red disabled:opacity-50">
          {publishing ? "Publishing..." : "🚀 Publish to Site"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl bg-card border border-border p-5">
          <h3 className="text-sm text-muted-foreground mb-1">Current Cloud Database</h3>
          <p className="text-3xl font-extrabold text-foreground">{videos.length} <span className="text-base font-medium text-muted-foreground">Videos</span></p>
        </div>
        <div className="rounded-xl bg-card border border-border p-5">
          <h3 className="text-sm text-muted-foreground mb-1">Total Views</h3>
          <p className="text-3xl font-extrabold text-foreground">{videos.reduce((s, v) => s + v.views, 0)} <span className="text-base font-medium text-muted-foreground">Views</span></p>
        </div>
      </div>

      {/* Video List */}
      <div className="rounded-xl bg-card border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-bold text-foreground">All Videos</h3>
        </div>
        <div className="divide-y divide-border">
          {videos.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">No videos yet</div>
          ) : (
            videos.map((v) => (
              <div key={v.id} className="flex items-center justify-between p-4 gap-4 hover:bg-accent/50 transition-colors">
                <div className="flex-1 min-w-0">
                  {editingId === v.id ? (
                    <div className="flex gap-2">
                      <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="flex-1 px-3 py-1.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" onKeyDown={(e) => e.key === "Enter" && handleRename(v.id)} />
                      <button onClick={() => handleRename(v.id)} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium">Save</button>
                      <button onClick={() => setEditingId(null)} className="px-3 py-1.5 rounded-lg bg-secondary text-foreground text-xs">Cancel</button>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-foreground truncate">{v.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{v.youtube_url}</p>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {categories.find((c) => c.value === v.category)?.label}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Eye size={12} /> {v.views}
                  </span>
                  <button onClick={() => { setEditingId(v.id); setEditTitle(v.title); }} className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(v.id)} className="p-1.5 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Match Queue */}
      <AdminMatchQueue />

      {/* Change Password */}
      <div className="rounded-xl bg-card border border-border p-6 space-y-4">
        <h3 className="text-lg font-bold text-foreground">🔐 Change Password</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" className="px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className="px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <button onClick={handleChangePassword} className="px-6 py-2.5 rounded-lg bg-secondary text-foreground font-medium text-sm hover:bg-accent border border-border">
          Update Password
        </button>
      </div>

      {/* Logout */}
      <button
        onClick={() => { setAdminLoggedIn(false); window.location.reload(); }}
        className="text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        Logout from Admin
      </button>
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(isAdminLoggedIn());

  if (!authed) {
    return <AdminLogin onLogin={() => setAuthed(true)} />;
  }

  return <AdminDashboard />;
}
