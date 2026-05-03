-- Create enum for place categories
CREATE TYPE place_category AS ENUM ('eat', 'shop', 'history', 'architecture');

-- Main places table
CREATE TABLE places (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category place_category NOT NULL,
  type TEXT NOT NULL,
  address TEXT NOT NULL,
  description TEXT NOT NULL,
  walk_time TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  image_url TEXT DEFAULT '',
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER places_updated_at
  BEFORE UPDATE ON places
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_places_category ON places(category);
CREATE INDEX idx_places_active ON places(is_active);

-- Enable RLS
ALTER TABLE places ENABLE ROW LEVEL SECURITY;

-- Public read: anyone can view active places
CREATE POLICY "Public can read active places"
  ON places FOR SELECT
  USING (is_active = true);

-- Admin write: only authenticated users can insert/update/delete
CREATE POLICY "Authenticated users can insert"
  ON places FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update"
  ON places FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete"
  ON places FOR DELETE TO authenticated USING (true);
