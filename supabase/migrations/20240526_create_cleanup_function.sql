-- Create a function to clean up unverified registrations older than 10 minutes
CREATE OR REPLACE FUNCTION public.cleanup_unverified_registrations()
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count BIGINT;
BEGIN
  -- Delete unverified registrations older than 10 minutes
  DELETE FROM public.inscriptions
  WHERE valide = FALSE
  AND created_at < (NOW() - INTERVAL '10 minutes')
  RETURNING * INTO deleted_count;
  
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

-- Grant execute permission to the anon role
GRANT EXECUTE ON FUNCTION public.cleanup_unverified_registrations() TO anon;
