'use server';

import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { z } from "zod";
import { fetchUnsplashImages } from "@/lib/unsplash-fetcher";
import { unsplashFetch } from "@/lib/flags";


const recipeSchema = z.object({
  recipes: z.array(
    z.object({
      title: z.string().describe("The name of the recipe"),
      tags: z.array(z.string()).describe("Tags categorizing the recipe (e.g., 'vegan', 'quick', 'dessert')"),
      allergens: z.array(z.string()).describe("Common allergens present in the recipe (e.g., 'dairy', 'nuts', 'gluten')"),
      ingredients: z.array(z.string()).describe("The full list of ingredients with measurements"),
      instructions: z.array(z.string()).describe("Step-by-step cooking instructions"),
      keyword: z.string().describe("Summarize the recipe name in two words")
    })
  ).describe("A list of recipes that can be made with the provided ingredients")
});

export type GenerateRecipesResponse = {
  success: boolean;
  recipes?: (z.infer<typeof recipeSchema>["recipes"][0] & { image?: string | null })[];
  error?: string;
};

export async function generateRecipesFromIngredients(ingredients: string[], preferences: { goal: string, dietaryPreferences: string[], allergies: string }): Promise<GenerateRecipesResponse> {
  try {
    if (!ingredients || ingredients.length === 0) {
      return {
        success: false,
        error: "No ingredients provided",
        recipes: []
      };
    }

  
    const model = new ChatOpenAI({
      modelName: "gpt-4o-search-preview",
      maxTokens: 2048,
    });

    
    const systemMessage = new SystemMessage(
      "You are a creative culinary expert specialized in generating Filipino recipes from available ingredients. " +
      "Create diverse, practical recipes using the provided ingredients. You can suggest additional common ingredients " +
      "that might be needed to complete the recipes. Provide clear, step-by-step instructions."
    );

    const ingredientsList = ingredients.join(", ");
    const humanMessage = new HumanMessage(
      `I have the following ingredients: ${ingredientsList}. Please suggest 3 recipes I could make with these ingredients, The preferences are my dietary preferences: ${JSON.stringify(preferences)}.` +
      "possibly adding a few common ingredients I might have in my pantry. "
    );

   
    const response = await model
      .withStructuredOutput(recipeSchema)
      .invoke([systemMessage, humanMessage]);

    const fetchImages = await unsplashFetch()

    // Fetch images for each recipe in parallel
    const recipesWithImages = await Promise.all(
      response.recipes.map(async (recipe) => {
        const images = fetchImages ? await fetchUnsplashImages(recipe.keyword) : [
            {
                urls: {
                    regular: '/placeholder.jpg'
                }
            }
        ];
        return {
          ...recipe,
          image: images[0]?.urls?.regular || null
        };
      })
    );

    console.log(recipesWithImages);

    return {
      success: true,
      recipes: recipesWithImages
    };
  } catch (error) {
    console.error("Error generating recipes:", error);
    return {
      success: false,
      error: "Failed to generate recipes",
      recipes: []
    };
  }
}