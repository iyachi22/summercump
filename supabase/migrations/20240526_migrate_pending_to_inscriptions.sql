-- Migration script to move data from pending_inscriptions to inscriptions
-- and mark them as verified since they've already confirmed their email

-- First, create the inscriptions table if it doesn't exist
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

-- Copy data from pending_inscriptions to inscriptions
-- Note: This assumes the pending_inscriptions table exists and has the same structure
-- as when the data was inserted. Adjust the column names as needed.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pending_inscriptions') THEN
    INSERT INTO public.inscriptions (
      nom, 
      prenom, 
      date_naissance, 
      email, 
      telephone, 
      atelier, 
      preuve_url, 
      token, 
      valide,
      created_at,
      updated_at
    )
    SELECT 
      nom, 
      prenom, 
      date_naissance, 
      email, 
      telephone, 
      atelier, 
      preuve_url, 
      COALESCE(token, uuid_generate_v4()::text), -- Generate token if null
      TRUE, -- Mark as verified since they've already confirmed
      COALESCE(created_at, now()),
      now()
    FROM public.pending_inscriptions
    WHERE NOT EXISTS (
      SELECT 1 FROM public.inscriptions i 
      WHERE i.email = pending_inscriptions.email
    );
    
    RAISE NOTICE 'Migrated % rows from pending_inscriptions to inscriptions', 
      (SELECT COUNT(*) FROM public.pending_inscriptions);
  ELSE
    RAISE NOTICE 'Table pending_inscriptions does not exist, skipping migration';
  END IF;
END $$;
