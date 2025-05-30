-- Create the ateliers table
CREATE TABLE IF NOT EXISTS public.ateliers (
  id TEXT PRIMARY KEY,
  nom TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  level TEXT,
  duration TEXT
);

-- Create the inscription_atelier join table
CREATE TABLE IF NOT EXISTS public.inscription_atelier (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inscription_id UUID NOT NULL REFERENCES public.inscriptions(id) ON DELETE CASCADE,
  atelier_id TEXT NOT NULL REFERENCES public.ateliers(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(inscription_id, atelier_id)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_inscription_atelier_inscription_id ON public.inscription_atelier(inscription_id);
CREATE INDEX IF NOT EXISTS idx_inscription_atelier_atelier_id ON public.inscription_atelier(atelier_id);

-- Drop the old atelier column from inscriptions
ALTER TABLE public.inscriptions DROP COLUMN IF EXISTS atelier;

-- Create a function to insert an inscription with multiple ateliers
CREATE OR REPLACE FUNCTION public.create_inscription_with_ateliers(
  p_inscription JSONB,
  p_atelier_ids TEXT[]
) RETURNS SETOF public.inscriptions AS $$
DECLARE
  v_inscription_id UUID;
  v_atelier_id TEXT;
BEGIN
  -- Insert the inscription
  INSERT INTO public.inscriptions (
    nom, prenom, date_naissance, email, telephone, preuve_url, token, valide
  ) VALUES (
    p_inscription->>'nom',
    p_inscription->>'prenom',
    (p_inscription->>'date_naissance')::DATE,
    p_inscription->>'email',
    p_inscription->>'telephone',
    p_inscription->>'preuve_url',
    p_inscription->>'token',
    (p_inscription->>'valide')::BOOLEAN
  ) RETURNING id INTO v_inscription_id;

  -- Insert the atelier relationships
  FOREACH v_atelier_id IN ARRAY p_atelier_ids LOOP
    INSERT INTO public.inscription_atelier (inscription_id, atelier_id)
    VALUES (v_inscription_id, v_atelier_id);
  END LOOP;

  -- Return the created inscription
  RETURN QUERY SELECT * FROM public.inscriptions WHERE id = v_inscription_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default ateliers if they don't exist
INSERT INTO public.ateliers (id, nom, description, icon, level, duration)
VALUES 
  ('web', 'Développement Web', 'Apprenez à créer des sites web modernes', '💻', 'Débutant', '2 semaines'),
  ('ai', 'Intelligence Artificielle', 'Découvrez les fondamentaux de l''IA', '🤖', 'Intermédiaire', '2 semaines'),
  ('design', 'Infographie', 'Maîtrisez les outils de design graphique', '🎨', 'Débutant', '2 semaines'),
  ('content', 'Création de Contenu', 'Développez votre présence en ligne', '✍️', 'Débutant', '1 semaine'),
  ('video', 'Montage Vidéo', 'Créez des vidéos professionnelles', '🎬', 'Intermédiaire', '2 semaines'),
  ('entrepreneur', 'Entrepreneuriat', 'Développez votre esprit d''entreprise', '💼', 'Intermédiaire', '2 semaines'),
  ('entrepreneur-en', 'Entrepreneuriat (Anglais)', 'Develop your business mindset', '🌍', 'Intermédiaire', '2 semaines')
ON CONFLICT (id) DO NOTHING;

-- Update RLS policies for the new tables
ALTER TABLE public.ateliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inscription_atelier ENABLE ROW LEVEL SECURITY;

-- Allow public read access to ateliers
CREATE POLICY "Enable read access for all users"
ON public.ateliers
FOR SELECT
TO public
USING (true);

-- Allow public to insert into inscription_atelier (only through the function)
CREATE POLICY "Enable insert for anon users on inscription_atelier"
ON public.inscription_atelier
AS PERMISSIVE FOR INSERT
TO anon
WITH CHECK (true);
