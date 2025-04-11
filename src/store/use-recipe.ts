import { create } from 'zustand';
import { generateRecipesFromIngredients } from '@/actions/recipe/action';

export interface Recipe {
  title: string;
  tags: string[];
  allergens: string[];
  ingredients: string[];
  instructions: string[];
  image: string;
}

interface RecipeStore {
  recipe: Recipe | null;
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  ingredients: string[];
  setRecipe: (recipe: Recipe) => void;
  setIngredients: (ingredients: string[]) => void;
  clearRecipe: () => void;
  generateRecipes: (ingredients: string[], preferences: { goal: string, dietaryPreferences: string[], allergies: string }) => Promise<void>;
}

export const useRecipe = create<RecipeStore>((set) => ({
  recipe: null,
  recipes: [],
  loading: false,
  error: null,
  ingredients: [],
  setRecipe: (recipe) => set({ recipe }),
  clearRecipe: () => set({ recipe: null }),
  setIngredients: (ingredients: string[]) => set({ ingredients }),
  generateRecipes: async (ingredients, preferences) => {
    try {
      set({ loading: true, error: null });
      const response = await generateRecipesFromIngredients(ingredients, preferences);
      
      if (response.success && response.recipes) {
        set({ 
          recipes: response.recipes as Recipe[],
          loading: false 
        });
      } else {
        set({ 
          error: response.error || 'Failed to generate recipes',
          loading: false 
        });
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        loading: false 
      });
    }
  }
}));
