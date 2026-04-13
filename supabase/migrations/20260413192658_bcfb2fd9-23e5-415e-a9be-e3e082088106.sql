
-- Create videos table
CREATE TABLE public.videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  youtube_url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('livefeed', 'highlights', 'trainings', 'shorts')),
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin_config table (single row for admin password)
CREATE TABLE public.admin_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hashed_password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_config ENABLE ROW LEVEL SECURITY;

-- Videos: anyone can read
CREATE POLICY "Anyone can view videos" ON public.videos FOR SELECT USING (true);

-- Videos: anyone can insert (admin will be checked client-side, but we keep it open for the admin to publish)
CREATE POLICY "Anyone can insert videos" ON public.videos FOR INSERT WITH CHECK (true);

-- Videos: anyone can update (for view count increments and admin edits)
CREATE POLICY "Anyone can update videos" ON public.videos FOR UPDATE USING (true);

-- Videos: anyone can delete (admin deletes)
CREATE POLICY "Anyone can delete videos" ON public.videos FOR DELETE USING (true);

-- Admin config: anyone can read (to verify password hash)
CREATE POLICY "Anyone can read admin config" ON public.admin_config FOR SELECT USING (true);

-- Admin config: anyone can insert (for initial setup)
CREATE POLICY "Anyone can insert admin config" ON public.admin_config FOR INSERT WITH CHECK (true);

-- Admin config: anyone can update (for password changes)
CREATE POLICY "Anyone can update admin config" ON public.admin_config FOR UPDATE USING (true);
