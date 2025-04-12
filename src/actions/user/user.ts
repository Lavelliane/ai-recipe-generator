'use server';

import { createClient } from '@/lib/supabase/server';
import { User } from '@supabase/supabase-js';

/**
 * Retrieves the current authenticated user from Supabase
 * @returns Promise with user data or error
 */
export async function getCurrentUser(): Promise<{ data: User | null; error?: string }> {
  try {
    const supabase = await createClient();
    
    // Get the current authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      return { data: null, error: authError.message };
    }
    
    if (!user) {
      return { data: null };
    }

    
    return { data: user };
  } catch (error) {
    console.error('Error retrieving user:', error);
    return { data: null, error: 'Failed to retrieve user data' };
  }
}
