import { createClient } from '@/lib/supabase/server';
import MealPlanDashboard from "./_components/meal-plan-dashboard";
import { notFound } from 'next/navigation';

export default async function MealPlanPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const supabase = await createClient();
    
    // Fetch meal plan data from the database
    const { data: mealPlanData, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('id', id)
        .single();
    
    if (error || !mealPlanData) {
        console.error("Error fetching meal plan:", error);
        notFound();
    }
    
    // Fetch user preferences for this user
    const { data: userPreferences } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', mealPlanData.user_id)
        .single();
    
    // Collect all recipe IDs from the meal plan
    const recipeIds: string[] = [];
    for (const dailyMeal of mealPlanData.daily_meals) {
        if (dailyMeal.breakfast?.id) recipeIds.push(dailyMeal.breakfast.id);
        if (dailyMeal.lunch?.id) recipeIds.push(dailyMeal.lunch.id);
        if (dailyMeal.dinner?.id) recipeIds.push(dailyMeal.dinner.id);
        if (dailyMeal.snacks?.length) {
            dailyMeal.snacks.forEach((snack: { id: string }) => recipeIds.push(snack.id));
        }
    }
    
    // Fetch all recipes in a single request
    const { data: recipes, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .in('id', recipeIds);
    
    if (recipesError) {
        console.error("Error fetching recipes:", recipesError);
    }
    
    // Create a map of recipe id to recipe data for easy lookup
    const recipeMap: Record<string, any> = {};
    if (recipes) {
        recipes.forEach(recipe => {
            recipeMap[recipe.id] = recipe;
        });
    }
        
    return (
        <div className="bg-white min-h-screen w-full py-8">
            <MealPlanDashboard 
                mealPlan={mealPlanData} 
                userPreferences={userPreferences}
                recipes={recipeMap} 
            />
        </div>
    )
}
