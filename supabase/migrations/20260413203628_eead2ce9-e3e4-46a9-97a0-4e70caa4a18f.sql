
CREATE TABLE public.match_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  match_date TIMESTAMP WITH TIME ZONE NOT NULL,
  venue TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'upcoming',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.match_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view matches" ON public.match_queue FOR SELECT USING (true);
CREATE POLICY "Anyone can insert matches" ON public.match_queue FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update matches" ON public.match_queue FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete matches" ON public.match_queue FOR DELETE USING (true);
