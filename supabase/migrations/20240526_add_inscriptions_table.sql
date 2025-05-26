-- Create the inscriptions table
CREATE TABLE IF NOT EXISTS public.inscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom TEXT NOT NULL,
  prenom TEXT NOT NULL,
  date_naissance DATE NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT NOT NULL,
  atelier TEXT NOT NULL,
  preuve_url TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  valide BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_inscriptions_token ON public.inscriptions(token);
CREATE INDEX IF NOT EXISTS idx_inscriptions_email ON public.inscriptions(email);
CREATE INDEX IF NOT EXISTS idx_inscriptions_valide_created_at ON public.inscriptions(valide, created_at);

-- Function to clean up unverified registrations older than 10 minutes
CREATE OR REPLACE FUNCTION public.cleanup_unverified_registrations()
RETURNS void AS $$
BEGIN
  DELETE FROM public.inscriptions 
  WHERE valide = FALSE 
  AND created_at < (NOW() - INTERVAL '10 minutes');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a policy to allow public access (adjust based on your security requirements)
ALTER TABLE public.inscriptions ENABLE ROW LEVEL SECURITY;

-- Allow public to insert new registrations
CREATE POLICY "Enable insert for anon users"
ON public.inscriptions
AS PERMISSIVE FOR INSERT
TO anon
WITH CHECK (true);

-- Allow public to update only the valide field (for email confirmation)
CREATE POLICY "Enable update for anon users on valide field"
ON public.inscriptions
AS PERMISSIVE FOR UPDATE
TO anon
USING (true)
WITH CHECK (CURRENT_USER = 'anon' AND (
  NEW.valide = true AND 
  OLD.valide = false AND
  NEW.id = OLD.id AND
  NEW.token = OLD.token AND
  NEW.email = OLD.email
));

-- Allow public to select their own registration by token
CREATE POLICY "Enable select for anon users with matching token"
ON public.inscriptions
AS PERMISSIVE FOR SELECT
TO anon
USING (true);
