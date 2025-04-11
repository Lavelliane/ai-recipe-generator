import { useRecipe } from '@/store/use-recipe';
import Image from 'next/image';

interface RecipeSuggestionsProps {
    currentRecipeIndex: number;
}

export function RecipeSuggestions({ currentRecipeIndex }: RecipeSuggestionsProps) {
    const { recipes, loading, error } = useRecipe();
    const currentRecipe = recipes[currentRecipeIndex];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div 
                    className="animate-spin rounded-full h-12 w-12 border-b-2" 
                    style={{ borderColor: '#FFA725' }}
                ></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-100 text-red-800 rounded-md">
                {error}
            </div>
        );
    }

    if (!currentRecipe) {
        return (
            <div className="p-4 bg-yellow-100 text-yellow-800 rounded-md">
                No recipe available
            </div>
        );
    }

    return (
        <div className="w-full space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Recipe {currentRecipeIndex + 1} of {recipes.length}</h2>
            </div>

            <div className="border rounded-lg overflow-hidden shadow-md">
                {currentRecipe.image && (
                    <div className="relative w-full h-64">
                        <Image 
                            src={currentRecipe.image} 
                            alt={`${currentRecipe.title} image`} 
                            fill 
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                )}
                <div className="p-6">
                    <h3 className="text-2xl font-semibold mb-4">{currentRecipe.title}</h3>
                    
                    <div className="mb-4 flex flex-wrap gap-2">
                        {currentRecipe.tags.map((tag, tagIndex) => (
                            <span 
                                key={tagIndex} 
                                className="px-3 py-1 text-sm rounded-full"
                                style={{ backgroundColor: 'rgba(255, 167, 37, 0.2)', color: '#FFA725' }}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                    
                    {currentRecipe.allergens.length > 0 && (
                        <div className="mb-6">
                            <h4 className="font-medium text-base text-gray-700 mb-2">Allergens:</h4>
                            <div className="flex flex-wrap gap-2">
                                {currentRecipe.allergens.map((allergen, allergenIndex) => (
                                    <span 
                                        key={allergenIndex} 
                                        className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full"
                                    >
                                        {allergen}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <div className="mb-6">
                        <h4 className="font-medium text-base text-gray-700 mb-2">Ingredients:</h4>
                        <ul className="list-disc list-inside space-y-1">
                            {currentRecipe.ingredients.map((ingredient, ingredientIndex) => (
                                <li key={ingredientIndex} className="text-base">{ingredient}</li>
                            ))}
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="font-medium text-base text-gray-700 mb-2">Instructions:</h4>
                        <ol className="list-decimal list-inside space-y-2">
                            {currentRecipe.instructions.map((instruction, instructionIndex) => (
                                <li key={instructionIndex} className="text-base">{instruction}</li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
} 