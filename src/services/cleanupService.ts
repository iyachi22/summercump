import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';

const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
const CLEANUP_THRESHOLD_MINUTES = 10; // Delete unverified registrations older than 10 minutes

export const useCleanupService = () => {
  useEffect(() => {
    // Run cleanup immediately when the component mounts
    const cleanup = async () => {
      try {
        console.log(`[CleanupService][${new Date().toISOString()}] Starting cleanup of unverified registrations...`);
        
        // Call the database function to clean up unverified registrations
        const { data, error } = await supabase
          .rpc('cleanup_unverified_registrations');
        
        if (error) {
          console.error('[CleanupService] Error cleaning up unverified registrations:', error);
        } else if (data !== null && data !== undefined) {
          const deletedCount = Number(data);
          if (deletedCount > 0) {
            console.log(`[CleanupService] Cleanup completed. Deleted ${deletedCount} unverified registrations.`);
          } else if (deletedCount === 0) {
            console.log('[CleanupService] No unverified registrations to clean up.');
          } else {
            console.error('[CleanupService] Error during cleanup (database function returned negative value)');
          }
        }
      } catch (error) {
        console.error('[CleanupService] Unexpected error during cleanup:', error);
      }
    };

    // Run cleanup on mount
    cleanup();

    // Set up interval for periodic cleanup
    const intervalId = setInterval(cleanup, CLEANUP_INTERVAL);

    // Clean up interval on unmount
    return () => {
      console.log('[CleanupService] Cleaning up interval...');
      clearInterval(intervalId);
    };
  }, []);
};

/**
 * Manually trigger cleanup of unverified registrations
 * @returns {Promise<{deletedCount: number}>} Number of deleted registrations
 */
export const cleanupUnverifiedRegistrations = async () => {
  try {
    console.log(`[CleanupService][${new Date().toISOString()}] Manually triggering cleanup...`);
    
    // Call the database function to clean up unverified registrations
    const { data, error } = await supabase
      .rpc('cleanup_unverified_registrations');
    
    if (error) {
      console.error('[CleanupService] Error during manual cleanup:', error);
      throw error;
    }
    
    const deletedCount = data !== null && data !== undefined ? Number(data) : 0;
    
    if (deletedCount >= 0) {
      console.log(`[CleanupService] Manual cleanup completed. Deleted ${deletedCount} unverified registrations.`);
    } else {
      console.error('[CleanupService] Error during manual cleanup (database function returned negative value)');
      throw new Error('Error during cleanup (database error)');
    }
    
    return { deletedCount };
  } catch (error) {
    console.error('[CleanupService] Unexpected error during manual cleanup:', error);
    throw error;
  }
};

/**
 * Get count of unverified registrations
 * @returns {Promise<number>} Count of unverified registrations
 */
export const getUnverifiedRegistrationsCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('inscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('valide', false);
    
    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('[CleanupService] Error getting unverified registrations count:', error);
    throw error;
  }
};
