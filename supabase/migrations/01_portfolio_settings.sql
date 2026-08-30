-- ==============================================================================
-- Migration: Portfolio Settings & Storage Policies for Persistent Profile Photo
-- Table: portfolio_settings
-- Bucket: portfolio-images (Public)
-- ==============================================================================

-- 1. Create portfolio_settings table
CREATE TABLE IF NOT EXISTS public.portfolio_settings (
  id BIGINT PRIMARY KEY DEFAULT 1,
  profile_photo_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Ensure initial row with id=1 exists
INSERT INTO public.portfolio_settings (id, profile_photo_url, updated_at)
VALUES (1, NULL, now())
ON CONFLICT (id) DO NOTHING;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.portfolio_settings ENABLE ROW LEVEL SECURITY;

-- 4. Drop old policies if they exist to avoid conflict
DROP POLICY IF EXISTS "Allow public read access on portfolio_settings" ON public.portfolio_settings;
DROP POLICY IF EXISTS "Allow insert or update on portfolio_settings" ON public.portfolio_settings;

-- 5. Create RLS Policies for portfolio_settings
-- Read policy: Anyone (public / anon / visitors on Vercel) can read the profile photo URL
CREATE POLICY "Allow public read access on portfolio_settings"
ON public.portfolio_settings
FOR SELECT
TO anon, authenticated, public
USING (true);

-- Insert/Update/Upsert policy: Allow writing to settings
CREATE POLICY "Allow insert or update on portfolio_settings"
ON public.portfolio_settings
FOR ALL
TO anon, authenticated, public
USING (true)
WITH CHECK (true);

-- ==============================================================================
-- 6. Storage Bucket Policies for 'portfolio-images'
-- Note: Please ensure the 'portfolio-images' bucket is set to PUBLIC in Supabase Storage.
-- The following policies ensure public read access and allow photo uploads to profile/
-- ==============================================================================

-- Storage Read Policy: Allow anyone to view images in portfolio-images bucket
DROP POLICY IF EXISTS "Public Access for portfolio-images" ON storage.objects;
CREATE POLICY "Public Access for portfolio-images"
ON storage.objects
FOR SELECT
TO anon, authenticated, public
USING (bucket_id = 'portfolio-images');

-- Storage Upload Policy: Allow uploading files into portfolio-images bucket
DROP POLICY IF EXISTS "Allow upload to portfolio-images" ON storage.objects;
CREATE POLICY "Allow upload to portfolio-images"
ON storage.objects
FOR INSERT
TO anon, authenticated, public
WITH CHECK (bucket_id = 'portfolio-images');

-- Storage Update Policy: Allow updating existing files (upsert) in portfolio-images bucket
DROP POLICY IF EXISTS "Allow update to portfolio-images" ON storage.objects;
CREATE POLICY "Allow update to portfolio-images"
ON storage.objects
FOR UPDATE
TO anon, authenticated, public
USING (bucket_id = 'portfolio-images');
