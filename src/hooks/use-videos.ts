import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useVideos(category?: string) {
  return useQuery({
    queryKey: ["videos", category],
    queryFn: async () => {
      let query = supabase.from("videos").select("*").order("created_at", { ascending: false });
      if (category) query = query.eq("category", category);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}
