import { createClient } from '@/lib/supabase/server';
import MealPlansList from './_components/MealPlansList';

export default async function MealPlansPage() {
  const supabase = await createClient();
  
  // Fetch all meal plans for the user
  const { data: { user } } = await supabase.auth.getUser();
  const { data: mealPlans, error } = await supabase
    .from('meal_plans')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching meal plans:', error);
  }
  
  return <MealPlansList mealPlans={mealPlans} />;
} 