import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Send, Trash2, Reply, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { isAdminLoggedIn } from "@/lib/admin-auth";

interface Comment {
  id: string;
  video_id: string;
  parent_id: string | null;
  author_name: string;
  content: string;
  created_at: string;
}

interface VideoCommentsProps {
  videoId: string;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function CommentItem({
  comment,
  replies,
  onReply,
  onDelete,
  isAdmin,
}: {
  comment: Comment;
  replies: Comment[];
  onReply: (parentId: string) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
}) {
  const [showReplies, setShowReplies] = useState(true);

  return (
    <div className="space-y-2">
      <div className="group flex gap-3">
        <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-xs font-bold text-primary shrink-0 mt-0.5">
          {comment.author_name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground">{comment.author_name}</span>
            <span className="text-[10px] text-muted-foreground">{timeAgo(comment.created_at)}</span>
          </div>
          <p className="text-sm text-foreground/80 mt-0.5 break-words">{comment.content}</p>
          <div className="flex items-center gap-3 mt-1">
            <button
              onClick={() => onReply(comment.id)}
              className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary transition-colors"
            >
              <Reply size={10} /> Reply
            </button>
            {isAdmin && (
              <button
                onClick={() => onDelete(comment.id)}
                className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={10} /> Delete
              </button>
            )}
            {replies.length > 0 && (
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center gap-1 text-[10px] text-primary/70 hover:text-primary transition-colors"
              >
                {showReplies ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                {replies.length} {replies.length === 1 ? "reply" : "replies"}
              </button>
            )}
          </div>
        </div>
      </div>

      {showReplies && replies.length > 0 && (
        <div className="ml-10 pl-3 border-l border-border/50 space-y-2">
          {replies.map((reply) => (
            <div key={reply.id} className="group flex gap-3">
              <div className="w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center text-[10px] font-bold text-muted-foreground shrink-0 mt-0.5">
                {reply.author_name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground">{reply.author_name}</span>
                  <span className="text-[10px] text-muted-foreground">{timeAgo(reply.created_at)}</span>
                </div>
                <p className="text-sm text-foreground/80 mt-0.5 break-words">{reply.content}</p>
                {isAdmin && (
                  <button
                    onClick={() => onDelete(reply.id)}
                    className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 mt-1"
                  >
                    <Trash2 size={10} /> Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function VideoComments({ videoId }: VideoCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState(() => localStorage.getItem("reba_comment_name") || "");
  const [content, setContent] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const isAdmin = isAdminLoggedIn();

  const fetchComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("video_id", videoId)
      .order("created_at", { ascending: true });
    setComments((data as Comment[]) || []);
  };

  useEffect(() => {
    fetchComments();

    const channel = supabase
      .channel(`comments-${videoId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "comments", filter: `video_id=eq.${videoId}` }, () => {
        fetchComments();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [videoId]);

  const handleSubmit = async () => {
    const trimName = name.trim() || "Anonymous";
    if (!content.trim()) return;

    setSubmitting(true);
    localStorage.setItem("reba_comment_name", trimName);

    const { error } = await supabase.from("comments").insert({
      video_id: videoId,
      parent_id: replyingTo,
      author_name: trimName,
      content: content.trim(),
    } as never);

    setSubmitting(false);
    if (error) {
      toast.error("Failed to post comment");
    } else {
      setContent("");
      setReplyingTo(null);
      fetchComments();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this comment?")) return;
    await supabase.from("comments").delete().eq("id", id);
    toast.success("Comment deleted");
    fetchComments();
  };

  const topLevel = comments.filter((c) => !c.parent_id);
  const getReplies = (parentId: string) => comments.filter((c) => c.parent_id === parentId);
  const replyingComment = replyingTo ? comments.find((c) => c.id === replyingTo) : null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-foreground">
        Comments ({comments.length})
      </h3>

      {/* Comment form */}
      <div className="space-y-2">
        {replyingComment && (
          <div className="flex items-center gap-2 text-xs text-primary bg-primary/10 px-3 py-1.5 rounded-lg">
            <Reply size={12} />
            <span>Replying to <strong>{replyingComment.author_name}</strong></span>
            <button onClick={() => setReplyingTo(null)} className="ml-auto text-muted-foreground hover:text-foreground">✕</button>
          </div>
        )}
        <div className="flex gap-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-24 sm:w-32 px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <div className="flex-1 flex gap-1">
            <input
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !submitting && handleSubmit()}
              placeholder={replyingTo ? "Write a reply..." : "Write a comment..."}
              className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={handleSubmit}
              disabled={submitting || !content.trim()}
              className="px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {topLevel.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">No comments yet. Be the first!</p>
        ) : (
          topLevel.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              replies={getReplies(c.id)}
              onReply={setReplyingTo}
              onDelete={handleDelete}
              isAdmin={isAdmin}
            />
          ))
        )}
      </div>
    </div>
  );
}
