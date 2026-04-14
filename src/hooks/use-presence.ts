import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function usePresence(channelName: string) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = crypto.randomUUID();
    const channel = supabase.channel(channelName, {
      config: { presence: { key: id } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        setCount(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ user_id: id, online_at: new Date().toISOString() });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelName]);

  return count;
}

// Read-only version for admin: listens but doesn't track itself
export function usePresenceCount(channelName: string) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const channel = supabase.channel(`${channelName}-admin-listener`, {
      config: { presence: { key: `admin-${crypto.randomUUID()}` } },
    });

    // We need to subscribe to the SAME channel to see presence.
    // Actually, presence only works on the same channel name.
    // So admin must join the same channel but we won't count admin separately.
    const realChannel = supabase.channel(channelName, {
      config: { presence: { key: `admin-${crypto.randomUUID()}` } },
    });

    realChannel
      .on("presence", { event: "sync" }, () => {
        const state = realChannel.presenceState();
        // Subtract admin viewers (keys starting with "admin-")
        const viewers = Object.keys(state).filter(k => !k.startsWith("admin-")).length;
        setCount(viewers);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await realChannel.track({ admin: true, online_at: new Date().toISOString() });
        }
      });

    // cleanup the unused channel
    supabase.removeChannel(channel);

    return () => {
      supabase.removeChannel(realChannel);
    };
  }, [channelName]);

  return count;
}
