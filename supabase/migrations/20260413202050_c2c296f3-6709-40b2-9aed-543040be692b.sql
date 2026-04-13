CREATE OR REPLACE FUNCTION public.increment_views(video_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.videos SET views = views + 1 WHERE id = video_id;
$$;