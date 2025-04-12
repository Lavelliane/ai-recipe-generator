'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * Checks if a user has existing preferences in the database
 * @returns {Promise<boolean>} True if preferences exist, false otherwise
 */
export async function checkUserPreferencesExist(): Promise<{ exists: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { exists: false, error: 'User not authenticated' };
    }
    
    // Call the RPC function to check if preferences exist
    const { data, error } = await supabase.rpc('check_user_preferences_exist', {
      p_user_id: user.id
    });

    console.log('data', data)
    
    if (error) {
      return { exists: false, error: error.message };
    }
    
    return { exists: !!data };
  } catch (error) {
    console.error('Error checking user preferences:', error);
    return { exists: false, error: 'Failed to check preferences' };
  }
}
