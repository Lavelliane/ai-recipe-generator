interface Recipe {
    title: string;
    tags: string[];
    allergens: string[];
    ingredients: string[];
    instructions: string[];
}

export default function RecipeGenerator({ recipeList }: { recipeList: string[] }) {
    return (
        <div>
            <h1>Recipe Generator</h1>
        </div>
    )
}