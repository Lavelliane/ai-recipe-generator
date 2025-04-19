'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import dayjs from 'dayjs';
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { z } from "zod";
import { fetchUnsplashImages } from "@/lib/unsplash-fetcher";
import { unsplashFetch } from "@/lib/flags";

// Define the schema for a recipe
const recipeSchema = z.object({
  name: z.string().describe("The name of the recipe"),
  description: z.string().describe("A brief description of the recipe"),
  prep_time: z.number().describe("Preparation time in minutes"),
  cook_time: z.number().describe("Cooking time in minutes"),
  servings: z.number().describe("Number of servings"),
  tags: z.array(z.string()).describe("Tags categorizing the recipe (e.g., 'breakfast', 'vegetarian')"),
  ingredients: z.array(z.string()).describe("List of ingredients with measurements"),
  instructions: z.array(z.string()).describe("Step-by-step cooking instructions"),
  nutrition_info: z.object({
    calories: z.number().describe("Total calories per serving"),
    protein: z.number().describe("Protein content in grams"),
    carbs: z.number().describe("Carbohydrate content in grams"),
    fat: z.number().describe("Fat content in grams"),
    fiber: z.number().describe("Fiber content in grams")
  }).describe("Nutritional information per serving"),
  keyword: z.string().describe("A short keyword to search for an image"),
  image_url: z.string().optional().describe("URL of the recipe image")
});

// Define basic meal plan structure
const mealPlanBaseSchema = z.object({
  title: z.string().describe("Title of the meal plan"),
  description: z.string().describe("Description of the meal plan"),
  goal: z.string().describe("Goal of the meal plan (e.g., 'Weight Management')"),
  daily_meals_overview: z.array(z.object({
    date: z.string().describe("Date in YYYY-MM-DD format"),
    meals: z.array(z.object({
      type: z.enum(["breakfast", "lunch", "dinner", "snack"]),
      name: z.string(),
      keyword: z.string()
    }))
  }))
});

export type GeneratedMealPlan = {
  title: string;
  description: string;
  goal: string;
  daily_meals: Array<{
    date: string;
    breakfast: { id: string } | null;
    lunch: { id: string } | null;
    dinner: { id: string } | null;
    snacks: Array<{ id: string }>;
  }>;
};

// Helper function to generate a recipe
async function generateRecipe(
  model: ChatOpenAI,
  recipeName: string,
  mealType: string,
  date: string,
  userPreferences: { 
    goal: string, 
    dietaryPreferences: string[], 
    allergies: string,
    calorieTarget?: number
  }
): Promise<any> {
  const systemPrompt = `You are a professional chef and nutritionist. 
Create a detailed recipe for "${recipeName}" as a ${mealType} meal.
Follow these dietary preferences: ${userPreferences.dietaryPreferences.join(', ')}
Avoid these allergens: ${userPreferences.allergies}
Target appropriate calorie count for a ${mealType} within a ${userPreferences.calorieTarget || 2000} calorie daily target.
Use realistic ingredients, preparation times, and nutrition facts.
Provide step-by-step instructions that are easy to follow.`;

  const structuredModel = model.withStructuredOutput(recipeSchema);
  
  return structuredModel.invoke([
    new SystemMessage(systemPrompt),
    new HumanMessage(`Create a detailed recipe for "${recipeName}" as a ${mealType} for ${date}.`)
  ]);
}

// Helper function to store a recipe in Supabase and return its ID
async function storeRecipeInSupabase(
  supabase: any,
  recipe: any,
  userId: string,
  mealType: string
): Promise<string> {
  const recipeToStore = {
    user_id: userId,
    name: recipe.name,
    description: recipe.description,
    image_url: recipe.image_url,
    prep_time: recipe.prep_time,
    cook_time: recipe.cook_time,
    servings: recipe.servings,
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    tags: [...recipe.tags, mealType], // Add meal type as a tag
    nutrition_info: recipe.nutrition_info
  };
  
  const { data, error } = await supabase
    .from('recipes')
    .insert(recipeToStore)
    .select('id');
    
  if (error) {
    console.error('Error storing recipe:', error);
    throw new Error(`Failed to store recipe: ${error.message}`);
  }
  
  return data[0].id;
}

export async function generateAIMealPlan(
  startDate: string, 
  daysCount: number = 7,
  userPreferences: { 
    goal: string, 
    dietaryPreferences: string[], 
    allergies: string,
    calorieTarget?: number
  }
): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }

    // Create LangChain model
    const model = new ChatOpenAI({
      modelName: "gpt-4o",
      maxTokens: 4000,
      temperature: 0.7,
    });

    // Format dates
    const formattedStartDate = dayjs(startDate).format('YYYY-MM-DD');
    const endDate = dayjs(startDate).add(daysCount - 1, 'day').format('YYYY-MM-DD');
    
    // Create date array for all days in the meal plan
    const dateArray = [];
    for (let i = 0; i < daysCount; i++) {
      dateArray.push(dayjs(startDate).add(i, 'day').format('YYYY-MM-DD'));
    }

    // STEP 1: Generate meal plan outline
    const outlinePrompt = `You are a professional nutritionist and meal planning expert. 
Create a ${daysCount}-day meal plan outline based on the user's preferences.
Each day should include breakfast, lunch, dinner, and 1-2 snacks. 
Ensure meals are diverse and match these dietary preferences: ${userPreferences.dietaryPreferences.join(', ')}
Avoid these allergens: ${userPreferences.allergies}
Target daily caloric intake of around ${userPreferences.calorieTarget || 2000} calories.
The meal plan should support this goal: ${userPreferences.goal}`;

    const structuredOutlineModel = model.withStructuredOutput(mealPlanBaseSchema);
    
    const mealPlanOutline = await structuredOutlineModel.invoke([
      new SystemMessage(outlinePrompt),
      new HumanMessage(`Create a ${daysCount}-day meal plan outline starting from ${formattedStartDate}.`)
    ]);
    
    // STEP 2: Generate detailed recipes for each meal in the outline and store them in the database
    const mealPlan: GeneratedMealPlan = {
      title: mealPlanOutline.title,
      description: mealPlanOutline.description,
      goal: mealPlanOutline.goal,
      daily_meals: []
    };

    // Fetch images flag
    const fetchImages = await unsplashFetch();

    // Process each day's meals
    for (const dayOutline of mealPlanOutline.daily_meals_overview) {
      const dailyPlan: {
        date: string;
        breakfast: { id: string } | null;
        lunch: { id: string } | null;
        dinner: { id: string } | null;
        snacks: Array<{ id: string }>;
      } = {
        date: dayOutline.date,
        breakfast: null,
        lunch: null,
        dinner: null,
        snacks: [] as Array<{ id: string }>
      };

      // Process each meal type
      const mealPromises = [];
      for (const meal of dayOutline.meals) {
        mealPromises.push(
          generateRecipe(model, meal.name, meal.type, dayOutline.date, userPreferences)
            .then(async (recipe) => {
              // Fetch image for the recipe
              const images = fetchImages 
                ? await fetchUnsplashImages(recipe.keyword) 
                : [{ urls: { regular: '/placeholder.jpg' } }];
              
              const recipeWithImage = {
                ...recipe,
                image_url: images[0]?.urls?.regular || '/placeholder.jpg'
              };
              
              // Store the recipe in Supabase and get its ID
              const recipeId = await storeRecipeInSupabase(supabase, recipeWithImage, user.id, meal.type);
              
              // Return recipe ID and type
              return {
                id: recipeId,
                type: meal.type
              };
            })
            .then(recipeInfo => {
              // Add to appropriate meal slot using the ID reference
              if (recipeInfo.type === 'breakfast') {
                dailyPlan.breakfast = { id: recipeInfo.id };
              } else if (recipeInfo.type === 'lunch') {
                dailyPlan.lunch = { id: recipeInfo.id };
              } else if (recipeInfo.type === 'dinner') {
                dailyPlan.dinner = { id: recipeInfo.id };
              } else if (recipeInfo.type === 'snack') {
                dailyPlan.snacks.push({ id: recipeInfo.id });
              }
            })
        );
      }

      // Wait for all meals to be processed
      await Promise.all(mealPromises);
      mealPlan.daily_meals.push(dailyPlan);
    }

    // Convert the meal plan to the format needed for database storage
    const dbMealPlan = {
      user_id: user.id,
      title: mealPlan.title,
      description: mealPlan.description,
      start_date: formattedStartDate,
      end_date: endDate,
      goal: mealPlan.goal,
      daily_meals: mealPlan.daily_meals
    };

    // Insert the meal plan into the database
    const { data, error } = await supabase
      .from('meal_plans')
      .insert(dbMealPlan)
      .select();

    if (error) {
      console.error('Error saving meal plan:', error);
      return { success: false, error };
    }

    // Return the created meal plan
    return { 
      success: true, 
      data: {
        ...data[0],
        mealPlanDetails: mealPlan
      } 
    };
  } catch (error) {
    console.error('Error generating meal plan:', error);
    return { success: false, error: 'Failed to generate meal plan' };
  }
} 