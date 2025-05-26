-- This script sets up the initial database schema and functions
-- It's safe to run multiple times as it uses CREATE OR REPLACE

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the inscriptions table if it doesn't exist
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

-- Create indexes
DO $$
BEGIN
  -- Create index if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_inscriptions_token' 
    AND tablename = 'inscriptions'
  ) THEN
    CREATE INDEX idx_inscriptions_token ON public.inscriptions(token);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_inscriptions_email' 
    AND tablename = 'inscriptions'
  ) THEN
    CREATE INDEX idx_inscriptions_email ON public.inscriptions(email);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_inscriptions_valide_created_at' 
    AND tablename = 'inscriptions'
  ) THEN
    CREATE INDEX idx_inscriptions_valide_created_at ON public.inscriptions(valide, created_at);
  END IF;
END $$;

-- Create the cleanup function
CREATE OR REPLACE FUNCTION public.cleanup_unverified_registrations()
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count BIGINT;
BEGIN
  -- Delete unverified registrations older than 10 minutes
  WITH deleted AS (
    DELETE FROM public.inscriptions
    WHERE valide = FALSE
    AND created_at < (NOW() - INTERVAL '10 minutes')
    RETURNING 1
  )
  SELECT COUNT(*) INTO deleted_count FROM deleted;
  
  -- Log the cleanup
  RAISE NOTICE 'Cleaned up % unverified registrations', COALESCE(deleted_count, 0);
  
  -- Return the number of deleted rows
  RETURN COALESCE(deleted_count, 0);
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error in cleanup_unverified_registrations: %', SQLERRM;
    RETURN -1; -- Return -1 to indicate error
END;
$$;

-- Set up Row Level Security
ALTER TABLE public.inscriptions ENABLE ROW LEVEL SECURITY;

-- Allow public to insert new registrations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'inscriptions' 
    AND policyname = 'Enable insert for anon users'
  ) THEN
    CREATE POLICY "Enable insert for anon users"
    ON public.inscriptions
    AS PERMISSIVE FOR INSERT
    TO anon
    WITH CHECK (true);
  END IF;
  
  -- Allow public to update only the valide field (for email confirmation)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'inscriptions' 
    AND policyname = 'Enable update for anon users on valide field'
  ) THEN
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
  END IF;
  
  -- Allow public to select their own registration by token
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'inscriptions' 
    AND policyname = 'Enable select for anon users with matching token'
  ) THEN
    CREATE POLICY "Enable select for anon users with matching token"
    ON public.inscriptions
    AS PERMISSIVE FOR SELECT
    TO anon
    USING (true);
  END IF;
END $$;

-- Grant execute permission to the anon role
GRANT EXECUTE ON FUNCTION public.cleanup_unverified_registrations() TO anon;
