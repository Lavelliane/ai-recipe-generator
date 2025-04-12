'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

type Goal = 'cook-with-ingredients' | 'quick-recipes' | 'healthy-meals' | 'shopping-list' | 'improve-skills' | '';
type DietaryPreference = 'vegetarian-vegan' | 'no-preference' | 'keto-lowcarb' | 'gluten-dairy-free';

interface PreferenceData {
  goal: Goal;
  dietaryPreferences: DietaryPreference[];
  allergies: string;
}

export async function storeUserPreferences(data: PreferenceData) {
  try {
    const cookieStore = cookies();
    
   const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { error: 'User not authenticated', success: false };
    }
    
    // Check if user already has preferences
    const { data: existingPreferences, error: fetchError } = await supabase
      .from('user_preferences')
      .select('id')
      .eq('user_id', user.id)
      .single();
    
    let result;
    
    if (existingPreferences) {
      // Update existing preferences
      result = await supabase
        .from('user_preferences')
        .update({
          goal: data.goal,
          dietary_preferences: data.dietaryPreferences,
          allergies: data.allergies,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
    } else {
      // Insert new preferences
      result = await supabase
        .from('user_preferences')
        .insert({
          user_id: user.id,
          goal: data.goal,
          dietary_preferences: data.dietaryPreferences,
          allergies: data.allergies
        });
    }
    
    if (result.error) {
      return { 
        error: result.error.message, 
        success: false 
      };
    }
    
    // Revalidate any paths that might display user preferences
    revalidatePath('/profile');
    revalidatePath('/dashboard');
    
    return { 
      success: true 
    };
    
  } catch (error) {
    console.error('Error storing preferences:', error);
    return { 
      error: 'Failed to store preferences', 
      success: false 
    };
  }
}
