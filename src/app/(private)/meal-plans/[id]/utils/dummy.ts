// Types for Meal Plan
export interface Recipe {
  id: string;
  name: string;
  description: string;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  imageUrl: string;
  ingredients: string[];
  instructions: string[];
  tags: string[];
  nutritionInfo: NutritionInfo;
}

export interface NutritionInfo {
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  fiber: number; // in grams
}

export interface MealPlan {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  goal: string;
  meals: DailyMeals[];
}

export interface DailyMeals {
  date: string;
  breakfast: Recipe | null;
  lunch: Recipe | null;
  dinner: Recipe | null;
  snacks: Recipe[];
}

// Dummy Data
export const dummyMealPlan: MealPlan = {
  id: "mp001",
  name: "Balanced Weekly Plan",
  description: "A nutritionally balanced meal plan focusing on whole foods and protein.",
  startDate: "2023-06-01",
  endDate: "2023-06-07",
  goal: "Weight Management",
  meals: [
    {
      date: "2023-06-01",
      breakfast: {
        id: "r001",
        name: "Avocado Toast with Poached Eggs",
        description: "Creamy avocado spread on whole grain toast topped with perfectly poached eggs.",
        prepTime: 10,
        cookTime: 5,
        servings: 2,
        imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=2070&auto=format&fit=crop",
        ingredients: [
          "2 slices whole grain bread",
          "1 ripe avocado",
          "2 eggs",
          "1 tbsp lemon juice",
          "Salt and pepper to taste",
          "Red pepper flakes (optional)"
        ],
        instructions: [
          "Toast the bread until golden brown.",
          "Mash the avocado with lemon juice, salt, and pepper.",
          "Spread the avocado mixture on the toast.",
          "Poach the eggs for 3-4 minutes.",
          "Place eggs on top of the avocado toast.",
          "Sprinkle with red pepper flakes if desired."
        ],
        tags: ["breakfast", "high-protein", "vegetarian"],
        nutritionInfo: {
          calories: 350,
          protein: 15,
          carbs: 30,
          fat: 20,
          fiber: 8
        }
      },
      lunch: {
        id: "r002",
        name: "Mediterranean Quinoa Bowl",
        description: "Protein-packed quinoa bowl with fresh vegetables and feta cheese.",
        prepTime: 15,
        cookTime: 20,
        servings: 4,
        imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop",
        ingredients: [
          "1 cup quinoa",
          "2 cups vegetable broth",
          "1 cucumber, diced",
          "1 cup cherry tomatoes, halved",
          "1/2 red onion, finely chopped",
          "1/2 cup kalamata olives, pitted",
          "1/2 cup feta cheese, crumbled",
          "2 tbsp olive oil",
          "1 lemon, juiced",
          "2 tbsp fresh mint, chopped"
        ],
        instructions: [
          "Rinse quinoa under cold water.",
          "Cook quinoa in vegetable broth for 15-20 minutes.",
          "Let quinoa cool to room temperature.",
          "Combine quinoa with all vegetables and feta cheese.",
          "Mix olive oil and lemon juice for dressing.",
          "Pour dressing over the bowl and toss.",
          "Garnish with fresh mint before serving."
        ],
        tags: ["lunch", "vegetarian", "meal-prep"],
        nutritionInfo: {
          calories: 320,
          protein: 12,
          carbs: 45,
          fat: 15,
          fiber: 6
        }
      },
      dinner: {
        id: "r003",
        name: "Herb-Roasted Salmon with Vegetables",
        description: "Perfectly roasted salmon fillet with seasonal vegetables.",
        prepTime: 10,
        cookTime: 25,
        servings: 2,
        imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=1974&auto=format&fit=crop",
        ingredients: [
          "2 salmon fillets (6 oz each)",
          "2 tbsp olive oil",
          "2 cloves garlic, minced",
          "1 tbsp fresh dill, chopped",
          "1 tbsp fresh parsley, chopped",
          "1 lemon, sliced",
          "1 zucchini, sliced",
          "1 bell pepper, sliced",
          "1 red onion, sliced",
          "Salt and pepper to taste"
        ],
        instructions: [
          "Preheat oven to 400°F (200°C).",
          "Place salmon and vegetables on a baking sheet.",
          "Mix olive oil, garlic, herbs, salt, and pepper.",
          "Drizzle the mixture over salmon and vegetables.",
          "Place lemon slices on top of the salmon.",
          "Roast for 20-25 minutes until salmon is flaky."
        ],
        tags: ["dinner", "high-protein", "omega-3"],
        nutritionInfo: {
          calories: 420,
          protein: 35,
          carbs: 15,
          fat: 25,
          fiber: 4
        }
      },
      snacks: [
        {
          id: "r004",
          name: "Greek Yogurt with Berries and Honey",
          description: "Creamy Greek yogurt topped with fresh berries and a drizzle of honey.",
          prepTime: 5,
          cookTime: 0,
          servings: 1,
          imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1974&auto=format&fit=crop",
          ingredients: [
            "1 cup Greek yogurt",
            "1/2 cup mixed berries",
            "1 tbsp honey",
            "1 tbsp chia seeds (optional)"
          ],
          instructions: [
            "Place yogurt in a bowl.",
            "Top with mixed berries.",
            "Drizzle with honey.",
            "Sprinkle with chia seeds if desired."
          ],
          tags: ["snack", "high-protein", "quick"],
          nutritionInfo: {
            calories: 180,
            protein: 20,
            carbs: 15,
            fat: 6,
            fiber: 3
          }
        }
      ]
    },
    {
      date: "2023-06-02",
      breakfast: {
        id: "r005",
        name: "Overnight Oats with Fruit",
        description: "Nutritious overnight oats with fresh fruits and nuts.",
        prepTime: 5,
        cookTime: 0,
        servings: 1,
        imageUrl: "https://images.unsplash.com/photo-1504387828636-abeb50778c0c?q=80&w=1974&auto=format&fit=crop",
        ingredients: [
          "1/2 cup rolled oats",
          "1 cup almond milk",
          "1 tbsp chia seeds",
          "1 tbsp maple syrup",
          "1/2 banana, sliced",
          "1/4 cup strawberries, sliced",
          "1 tbsp almond butter",
          "2 tbsp chopped walnuts"
        ],
        instructions: [
          "Mix oats, almond milk, chia seeds, and maple syrup in a jar.",
          "Cover and refrigerate overnight.",
          "In the morning, top with sliced fruit, almond butter, and walnuts."
        ],
        tags: ["breakfast", "vegan", "meal-prep"],
        nutritionInfo: {
          calories: 350,
          protein: 10,
          carbs: 45,
          fat: 15,
          fiber: 10
        }
      },
      lunch: {
        id: "r006",
        name: "Chicken and Chickpea Salad",
        description: "Hearty salad with grilled chicken, chickpeas, and a tangy dressing.",
        prepTime: 15,
        cookTime: 15,
        servings: 2,
        imageUrl: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?q=80&w=1942&auto=format&fit=crop",
        ingredients: [
          "2 chicken breasts",
          "1 can chickpeas, drained and rinsed",
          "4 cups mixed greens",
          "1 cucumber, diced",
          "1 cup cherry tomatoes, halved",
          "1/4 red onion, thinly sliced",
          "2 tbsp olive oil",
          "1 tbsp balsamic vinegar",
          "1 tsp Dijon mustard",
          "Salt and pepper to taste"
        ],
        instructions: [
          "Season chicken breasts with salt and pepper.",
          "Grill chicken for 6-7 minutes per side or until cooked through.",
          "Let chicken rest, then slice.",
          "In a large bowl, combine mixed greens, chickpeas, cucumber, tomatoes, and onion.",
          "Whisk together olive oil, balsamic vinegar, and Dijon mustard.",
          "Add sliced chicken to the salad.",
          "Drizzle with dressing and toss to combine."
        ],
        tags: ["lunch", "high-protein", "meal-prep"],
        nutritionInfo: {
          calories: 380,
          protein: 35,
          carbs: 25,
          fat: 14,
          fiber: 8
        }
      },
      dinner: {
        id: "r007",
        name: "Vegetable Stir-Fry with Tofu",
        description: "Quick and flavorful vegetable stir-fry with crispy tofu.",
        prepTime: 20,
        cookTime: 15,
        servings: 3,
        imageUrl: "https://images.unsplash.com/photo-1512058556646-c4da40fba323?q=80&w=1972&auto=format&fit=crop",
        ingredients: [
          "1 block extra-firm tofu, pressed and cubed",
          "2 tbsp sesame oil",
          "2 cloves garlic, minced",
          "1 tbsp ginger, grated",
          "1 bell pepper, sliced",
          "1 cup broccoli florets",
          "1 carrot, julienned",
          "1 cup snap peas",
          "3 tbsp soy sauce",
          "1 tbsp maple syrup",
          "1 tsp cornstarch mixed with 2 tbsp water",
          "2 green onions, sliced",
          "1 tbsp sesame seeds"
        ],
        instructions: [
          "Heat 1 tbsp sesame oil in a large pan over medium-high heat.",
          "Add tofu and cook until golden brown on all sides. Remove from pan.",
          "Add remaining oil, garlic, and ginger to the pan.",
          "Add vegetables and stir-fry for 5-7 minutes.",
          "Mix soy sauce, maple syrup, and cornstarch mixture.",
          "Return tofu to the pan, add sauce, and cook for 2 minutes.",
          "Garnish with green onions and sesame seeds."
        ],
        tags: ["dinner", "vegetarian", "quick"],
        nutritionInfo: {
          calories: 320,
          protein: 18,
          carbs: 30,
          fat: 16,
          fiber: 7
        }
      },
      snacks: [
        {
          id: "r008",
          name: "Hummus with Veggie Sticks",
          description: "Creamy hummus served with fresh vegetable sticks.",
          prepTime: 10,
          cookTime: 0,
          servings: 2,
          imageUrl: "https://images.unsplash.com/photo-1598449388299-f554ef64bc35?q=80&w=1971&auto=format&fit=crop",
          ingredients: [
            "1 cup hummus",
            "2 carrots, cut into sticks",
            "1 cucumber, cut into sticks",
            "1 bell pepper, cut into strips",
            "1 tbsp olive oil for drizzling",
            "Paprika for garnish"
          ],
          instructions: [
            "Place hummus in a serving bowl.",
            "Drizzle with olive oil and sprinkle with paprika.",
            "Arrange vegetable sticks around the hummus."
          ],
          tags: ["snack", "vegan", "quick"],
          nutritionInfo: {
            calories: 220,
            protein: 8,
            carbs: 20,
            fat: 12,
            fiber: 6
          }
        }
      ]
    }
  ]
};

export const userPreferences = {
  dietaryRestrictions: ["gluten-free", "dairy-free"],
  allergies: ["peanuts", "shellfish"],
  goal: "Weight Management",
  calorieTarget: 2000
};
