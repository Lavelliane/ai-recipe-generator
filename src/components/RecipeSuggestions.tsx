import { useState } from 'react';
import { useRecipe } from '@/store/use-recipe';
import Image from 'next/image';

export function RecipeSuggestions() {
  const { recipes, loading, error, generateRecipes, ingredients: storedIngredients } = useRecipe();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateRecipes = async () => {
    if (storedIngredients.length === 0) return;
    
    setIsGenerating(true);
    await generateRecipes(storedIngredients);
    setIsGenerating(false);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Recipe Suggestions</h2>
        <button
          onClick={handleGenerateRecipes}
          disabled={loading || isGenerating || storedIngredients.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading || isGenerating ? 'Generating...' : 'Generate Recipes'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-800 rounded-md">
          {error}
        </div>
      )}

      {storedIngredients.length === 0 && (
        <div className="p-4 bg-yellow-100 text-yellow-800 rounded-md">
          Add ingredients to generate recipe suggestions
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe, index) => (
          <div key={index} className="border rounded-lg overflow-hidden shadow-md">
            {recipe.image && (
              <div className="relative w-full h-48">
                <Image 
                  src={recipe.image} 
                  alt={`${recipe.title} image`} 
                  fill 
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
              
              <div className="mb-2 flex flex-wrap gap-1">
                {recipe.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              
              {recipe.allergens.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-sm text-gray-700">Allergens:</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {recipe.allergens.map((allergen, allergenIndex) => (
                      <span key={allergenIndex} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        {allergen}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mb-4">
                <h4 className="font-medium text-sm text-gray-700">Ingredients:</h4>
                <ul className="list-disc list-inside mt-1">
                  {recipe.ingredients.map((ingredient, ingredientIndex) => (
                    <li key={ingredientIndex} className="text-sm">{ingredient}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-gray-700">Instructions:</h4>
                <ol className="list-decimal list-inside mt-1">
                  {recipe.instructions.map((instruction, instructionIndex) => (
                    <li key={instructionIndex} className="text-sm mb-1">{instruction}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 