'use client';

import { useState, useEffect, useRef, use } from 'react';
import { type DailyMeals, type Recipe } from '../utils/dummy';
import { 
  Card, 
  Badge, 
  Button, 
  Avatar 
} from '@heroui/react';
import { 
  CalendarIcon, 
  ClockIcon, 
  FireIcon, 
  FlagIcon, 
  UserIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  MicrophoneIcon,
  QuestionMarkCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getRecipeHelp } from '@/app/(private)/_actions/recipe-support/help';
import { useSpeechRecognition } from 'react-speech-recognition';

// Dynamically import Dictaphone with SSR disabled
const Dictaphone = dynamic(
  () => import('@/components/Dictaphone'),
  { ssr: false }
);

// Define the types based on our database schema
interface DatabaseRecipe {
  id: string;
  name: string;
  description: string;
  prep_time: number;
  cook_time: number;
  servings: number;
  image_url: string;
  ingredients: string[];
  instructions: string[];
  tags: string[];
  nutrition_info: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

interface DatabaseDailyMeal {
  date: string;
  breakfast: { id: string } | null;
  lunch: { id: string } | null;
  dinner: { id: string } | null;
  snacks: Array<{ id: string }>;
}

interface DatabaseMealPlan {
  id: string;
  user_id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  goal: string;
  daily_meals: DatabaseDailyMeal[];
  created_at: string;
}

interface UserPreferences {
  id: string;
  user_id: string;
  goal: string;
  dietary_preferences: string[];
  allergies: string;
  calorie_target?: number;
  created_at: string;
  updated_at: string;
}

interface MealPlanDashboardProps {
  mealPlan: DatabaseMealPlan;
  userPreferences?: UserPreferences | null;
  recipes: Record<string, DatabaseRecipe>;
}

export default function MealPlanDashboard({ mealPlan, userPreferences, recipes }: MealPlanDashboardProps) {
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('breakfast');
  const [currentRecipeStep, setCurrentRecipeStep] = useState(0);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceMode, setVoiceMode] = useState<'comment' | 'help'>('comment');
  const [isProcessingHelp, setIsProcessingHelp] = useState(false);
  const [helpResponse, setHelpResponse] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const handleVoiceComplete = async () => {
    setIsVoiceMode(true);
    
    // If in help mode, send the transcript to get recipe help
    if (voiceMode === 'help' && voiceTranscript && selectedRecipe) {
      setIsProcessingHelp(true);
      
      try {
        const helpResult = await getRecipeHelp({
          recipeName: selectedRecipe.name,
          currentStep: currentRecipeStep + 1,
          stepInstruction: selectedRecipe.instructions[currentRecipeStep],
          userQuery: voiceTranscript,
          dietaryRestrictions: userPreferences?.dietary_preferences || [],
        });
        
        if (helpResult.success && helpResult.instruction) {
          setHelpResponse(helpResult.instruction);
          try {
            const voice = await fetch('/api/voice', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ text: helpResult.instruction }),
            });

            console.log('voice', voice);

            if (voice.ok) {
              const audioBlob = await voice.blob();
              const audioUrl = URL.createObjectURL(audioBlob);

              if (audioRef.current) {
                setIsAudioPlaying(true);
                audioRef.current.src = audioUrl;
                audioRef.current.play().catch(error => {
                  console.error('Audio playback failed:', error);
                  setIsAudioPlaying(false);
                });

                // Set event listener to update state when audio ends
                audioRef.current.onended = () => {
                  setIsAudioPlaying(false);
                };
              }
            }
          } catch (voiceError) {
            console.error('Voice generation failed:', voiceError);
            setIsAudioPlaying(false);
            // Continue without voice
          }
          // Try to generate voice response if needed
          await handleResponseFromInstructor(helpResult.instruction);
        } else {
          setHelpResponse("Sorry, I couldn't provide help for that question.");
        }
      } catch (error) {
        console.error("Error getting recipe help:", error);
        setHelpResponse("Sorry, there was an error processing your help request.");
      } finally {
        setIsProcessingHelp(false);
      }
    }
  };

  const handleResponseFromInstructor = async (instruction: string) => {
    try {
      const voice = await fetch('/api/voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: instruction }),
      });

      if (voice.ok) {
        const audioBlob = await voice.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        if (audioRef.current) {
          setIsAudioPlaying(true);
          audioRef.current.src = audioUrl;
          audioRef.current.play().catch(error => {
            console.error('Audio playback failed:', error);
            setIsAudioPlaying(false);
          });

          // Set event listener to update state when audio ends
          audioRef.current.onended = () => {
            setIsAudioPlaying(false);
          };
        }
      }
    } catch (voiceError) {
      console.error('Voice generation failed:', voiceError);
      setIsAudioPlaying(false);
      // Continue without voice
    }
  }
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedRecipeId = searchParams.get('recipe');
  const selectedRecipe = selectedRecipeId ? recipes[selectedRecipeId] : null;
  
  // Reset step counter when recipe changes
  useEffect(() => {
    setCurrentRecipeStep(0);
  }, [selectedRecipeId]);
  
  // Guard against empty data
  if (!mealPlan.daily_meals || mealPlan.daily_meals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full">
        <CalendarIcon className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">No meal plan data available</h2>
        <p className="text-gray-500 mt-2">This meal plan has no daily meals scheduled.</p>
      </div>
    );
  }
  
  const currentDay = mealPlan.daily_meals[currentDayIndex];
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handlePreviousDay = () => {
    if (currentDayIndex > 0) {
      setCurrentDayIndex(currentDayIndex - 1);
    }
  };

  const handleNextDay = () => {
    if (currentDayIndex < mealPlan.daily_meals.length - 1) {
      setCurrentDayIndex(currentDayIndex + 1);
    }
  };

  const getRecipe = (mealId: string | null) => {
    if (!mealId) return null;
    return recipes[mealId] || null;
  };

  const calcTotalCalories = (dailyMeal: DatabaseDailyMeal) => {
    let total = 0;
    const breakfast = getRecipe(dailyMeal.breakfast?.id || null);
    const lunch = getRecipe(dailyMeal.lunch?.id || null);
    const dinner = getRecipe(dailyMeal.dinner?.id || null);
    
    if (breakfast) total += breakfast.nutrition_info.calories;
    if (lunch) total += lunch.nutrition_info.calories;
    if (dinner) total += dinner.nutrition_info.calories;
    
    dailyMeal.snacks.forEach(snack => {
      const snackRecipe = getRecipe(snack.id);
      if (snackRecipe) {
        total += snackRecipe.nutrition_info.calories;
      }
    });
    
    return total;
  };

  const calcTotalNutrient = (nutrient: 'protein' | 'carbs' | 'fat' | 'fiber') => {
    let total = 0;
    const breakfast = getRecipe(currentDay.breakfast?.id || null);
    const lunch = getRecipe(currentDay.lunch?.id || null);
    const dinner = getRecipe(currentDay.dinner?.id || null);
    
    if (breakfast) total += breakfast.nutrition_info[nutrient];
    if (lunch) total += lunch.nutrition_info[nutrient];
    if (dinner) total += dinner.nutrition_info[nutrient];
    
    currentDay.snacks.forEach(snack => {
      const snackRecipe = getRecipe(snack.id);
      if (snackRecipe) {
        total += snackRecipe.nutrition_info[nutrient];
      }
    });
    
    return total;
  };

  const handleViewRecipe = (recipeId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('recipe', recipeId);
    router.push(`?${params.toString()}`);
  };

  const handleCloseRecipe = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('recipe');
    router.push(`?${params.toString()}`);
  };

  const handleNextStep = () => {
    if (selectedRecipe && currentRecipeStep < selectedRecipe.instructions.length - 1) {
      setCurrentRecipeStep(currentRecipeStep + 1);
      setVoiceTranscript('');
      setHelpResponse(null);
      resetTranscript();
    }
  };

  const handlePreviousStep = () => {
    if (currentRecipeStep > 0) {
      setCurrentRecipeStep(currentRecipeStep - 1);
      setVoiceTranscript('');
      setHelpResponse(null);
      resetTranscript();
    }
  };

  // Set up voice assistant modes
  const handleVoiceModeToggle = (mode: 'comment' | 'help') => {
    setVoiceMode(mode);
    setShowVoiceAssistant(true);
  };

  const handleCloseVoiceAssistant = () => {
    setShowVoiceAssistant(false);
    setVoiceTranscript('');
    resetTranscript();
  };

  const handleTranscriptUpdate = (text: string) => {
    setVoiceTranscript(text);
  };

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto space-y-6">
      {/* Hidden audio element for response playback */}
      <audio ref={audioRef} className="hidden" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-amber-50 to-orange-100 p-6 rounded-xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-amber-900">{mealPlan.title}</h1>
          <p className="text-amber-700 mt-1">{mealPlan.description}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge className="bg-amber-200 text-amber-800">
              <FlagIcon className="w-4 h-4 mr-1" />
              {mealPlan.goal}
            </Badge>
            <Badge className="bg-amber-200 text-amber-800">
              <CalendarIcon className="w-4 h-4 mr-1" />
              {mealPlan.start_date} to {mealPlan.end_date}
            </Badge>
            <Badge className="bg-amber-200 text-amber-800">
              <FireIcon className="w-4 h-4 mr-1" />
              {userPreferences?.calorie_target || 2000} calories/day
            </Badge>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <Avatar src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80" />
            <div>
              <p className="font-medium">Your Plan</p>
              <p className="text-sm text-gray-600">Customized for you</p>
            </div>
          </div>
          {userPreferences?.dietary_preferences && userPreferences.dietary_preferences.length > 0 && (
            <div className="mt-3 flex gap-2">
              {userPreferences.dietary_preferences.map((preference, index) => (
                <Badge key={index} className="bg-white border border-gray-200">
                  {preference}
                </Badge>
              ))}
            </div>
          )}
          {userPreferences?.allergies && (
            <div className="mt-2">
              <Badge className="bg-red-100 text-red-800 border border-red-200">
                Allergies: {userPreferences.allergies}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Recipe Carousel */}
      {selectedRecipe && (
        <Card className="p-4 bg-white border-2 border-amber-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-amber-800">{selectedRecipe.name}</h2>
            <Button 
              variant="ghost"
              className="text-gray-500 hover:text-gray-700"
              onClick={handleCloseRecipe}
            >
              <XMarkIcon className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="mb-6 p-6 bg-amber-50 rounded-lg min-h-[200px]">
            <p className="text-lg font-medium mb-3">Step {currentRecipeStep + 1} of {selectedRecipe.instructions.length}</p>
            <p className="text-gray-700">{selectedRecipe.instructions[currentRecipeStep]}</p>
          </div>
          
          {/* Voice Assistant */}
          {showVoiceAssistant && (
            <div className="mb-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <MicrophoneIcon className="h-5 w-5 text-amber-600" />
                  <h3 className="font-medium text-gray-800">
                    {voiceMode === 'comment' ? 'Recipe Comment' : 'Recipe Help'}
                  </h3>
                </div>
                <Button 
                  variant="ghost" 
                  className="h-8 w-8 p-0 text-gray-500"
                  onClick={handleCloseVoiceAssistant}
                >
                  <XMarkIcon className="h-5 w-5" />
                </Button>
              </div>
              
              <Dictaphone 
                onTranscriptChange={handleTranscriptUpdate} 
                onComplete={handleVoiceComplete}
                setVoiceTranscript={setVoiceTranscript}
                transcript={transcript}
                listening={listening}
                resetTranscript={resetTranscript}
                browserSupportsSpeechRecognition={browserSupportsSpeechRecognition}
              />
              
              {voiceTranscript && (
                <div className="mt-3 bg-white p-3 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-500 mb-1">Transcript:</p>
                  <p className="text-gray-700">{voiceTranscript}</p>
                </div>
              )}
              
              {isProcessingHelp && (
                <div className="mt-3 p-3 bg-amber-50 rounded-lg animate-pulse">
                  <p className="text-amber-700">Processing your question...</p>
                </div>
              )}
              
              {helpResponse && !isProcessingHelp && (
                <div className="mt-3 bg-amber-50 p-3 rounded-lg border border-amber-200">
                  <p className="text-sm font-medium text-amber-800 mb-1">Chef's Advice:</p>
                  <p className="text-gray-700">{helpResponse}</p>
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-between">
            <Button
              variant="ghost"
              onClick={handlePreviousStep}
              disabled={currentRecipeStep === 0}
              className="flex items-center gap-1"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Previous Step
            </Button>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                className="text-amber-700 bg-amber-50"
                onClick={() => handleVoiceModeToggle('comment')}
              >
                <MicrophoneIcon className="h-4 w-4 mr-1" />
                Comment
              </Button>
              
              <Button
                variant="ghost"
                className="text-amber-700 bg-amber-50"
                onClick={() => handleVoiceModeToggle('help')}
              >
                <QuestionMarkCircleIcon className="h-4 w-4 mr-1" />
                Help
              </Button>
            </div>
            
            <Button
              variant="ghost"
              onPress={handleNextStep}
              disabled={currentRecipeStep === selectedRecipe.instructions.length - 1}
              className="flex items-center gap-1"
            >
              Next Step
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex justify-center mt-4">
            <div className="flex gap-2">
              {selectedRecipe.instructions.map((_, index) => (
                <span 
                  key={index}
                  className={`w-2 h-2 rounded-full cursor-pointer ${
                    index === currentRecipeStep ? 'bg-amber-600' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentRecipeStep(index)}
                />
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Day Navigation */}
      <div className="flex justify-between items-center">
        <Button 
          variant="ghost" 
          className="flex items-center gap-1"
          onClick={handlePreviousDay}
          disabled={currentDayIndex === 0}
        >
          <ChevronLeftIcon className="h-5 w-5" />
          Previous Day
        </Button>
        <h2 className="text-xl font-semibold">{formatDate(currentDay.date)}</h2>
        <Button 
          variant="ghost" 
          className="flex items-center gap-1"
          onClick={handleNextDay}
          disabled={currentDayIndex === mealPlan.daily_meals.length - 1}
        >
          Next Day
          <ChevronRightIcon className="h-5 w-5" />
        </Button>
      </div>

      {/* Daily Nutrition Summary */}
      <Card className="p-4 bg-gradient-to-r from-emerald-50 to-teal-100">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-200 p-3 rounded-full">
              <FireIcon className="h-6 w-6 text-emerald-700" />
            </div>
            <div>
              <p className="text-sm text-emerald-700">Daily Total</p>
              <p className="text-2xl font-bold text-emerald-900">{calcTotalCalories(currentDay)} calories</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div>
              <p className="text-sm text-emerald-700">Protein</p>
              <p className="text-xl font-semibold text-emerald-900">
                {calcTotalNutrient('protein')}g
              </p>
            </div>
            <div>
              <p className="text-sm text-emerald-700">Carbs</p>
              <p className="text-xl font-semibold text-emerald-900">
                {calcTotalNutrient('carbs')}g
              </p>
            </div>
            <div>
              <p className="text-sm text-emerald-700">Fat</p>
              <p className="text-xl font-semibold text-emerald-900">
                {calcTotalNutrient('fat')}g
              </p>
            </div>
            <div>
              <p className="text-sm text-emerald-700">Fiber</p>
              <p className="text-xl font-semibold text-emerald-900">
                {calcTotalNutrient('fiber')}g
              </p>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Custom Tabs */}
      <div className="w-full">
        <div className="flex space-x-1 bg-amber-50 p-1 rounded-lg">
          <button
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${activeTab === 'breakfast' ? 'bg-white shadow-sm' : 'hover:bg-amber-100'}`}
            onClick={() => setActiveTab('breakfast')}
          >
            Breakfast
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${activeTab === 'lunch' ? 'bg-white shadow-sm' : 'hover:bg-amber-100'}`}
            onClick={() => setActiveTab('lunch')}
          >
            Lunch
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${activeTab === 'dinner' ? 'bg-white shadow-sm' : 'hover:bg-amber-100'}`}
            onClick={() => setActiveTab('dinner')}
          >
            Dinner
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${activeTab === 'snacks' ? 'bg-white shadow-sm' : 'hover:bg-amber-100'}`}
            onClick={() => setActiveTab('snacks')}
          >
            Snacks
          </button>
        </div>
        
        <div className="mt-4">
          {activeTab === 'breakfast' && (
            currentDay.breakfast && getRecipe(currentDay.breakfast.id) ? (
              <RecipeCard recipe={getRecipe(currentDay.breakfast.id)!} />
            ) : (
              <EmptyMealCard mealType="breakfast" />
            )
          )}
          
          {activeTab === 'lunch' && (
            currentDay.lunch && getRecipe(currentDay.lunch.id) ? (
              <RecipeCard recipe={getRecipe(currentDay.lunch.id)!} />
            ) : (
              <EmptyMealCard mealType="lunch" />
            )
          )}
          
          {activeTab === 'dinner' && (
            currentDay.dinner && getRecipe(currentDay.dinner.id) ? (
              <RecipeCard recipe={getRecipe(currentDay.dinner.id)!} />
            ) : (
              <EmptyMealCard mealType="dinner" />
            )
          )}
          
          {activeTab === 'snacks' && (
            currentDay.snacks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentDay.snacks
                  .map(snack => ({ id: snack.id, recipe: getRecipe(snack.id) }))
                  .filter(item => item.recipe !== null)
                  .map((item, index) => (
                    <RecipeCard key={item.id} recipe={item.recipe!} isCompact />
                  ))}
              </div>
            ) : (
              <EmptyMealCard mealType="snacks" />
            )
          )}
        </div>
      </div>
    </div>
  );
}

interface RecipeCardProps {
  recipe: DatabaseRecipe;
  isCompact?: boolean;
}

function RecipeCard({ recipe, isCompact = false }: RecipeCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const handleViewFullRecipe = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('recipe', recipe.id);
    router.push(`?${params.toString()}`);
  };
  
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className={`flex ${isCompact ? 'flex-col' : 'flex-col md:flex-row'}`}>
        <div className={`${isCompact ? 'h-48' : 'h-56 md:w-1/3'} overflow-hidden`}>
          <img 
            src={recipe.image_url} 
            alt={recipe.name} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
          />
        </div>
        
        <div className={`p-4 ${isCompact ? '' : 'md:w-2/3'}`}>
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold">{recipe.name}</h3>
            <div className="flex items-center gap-1 text-amber-600">
              <FireIcon className="h-4 w-4" />
              <span className="text-sm font-semibold">{recipe.nutrition_info.calories} cal</span>
            </div>
          </div>
          
          <p className="text-gray-600 mt-1 mb-3">{recipe.description}</p>
          
          {!isCompact && recipe.tags && (
            <div className="flex flex-wrap gap-2 mb-3">
              {recipe.tags.map((tag, index) => (
                <Badge key={index} className="bg-gray-50 border border-gray-200">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="flex gap-4 mb-3">
            <div className="flex items-center gap-1">
              <ClockIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Prep: {recipe.prep_time} min</span>
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Cook: {recipe.cook_time} min</span>
            </div>
            <div className="flex items-center gap-1">
              <UserIcon className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Serves: {recipe.servings}</span>
            </div>
          </div>
          
          {!isCompact && (
            <div className="flex flex-col gap-2">
              <details className="cursor-pointer">
                <summary className="font-medium text-amber-800">Ingredients</summary>
                <ul className="mt-2 pl-5 list-disc space-y-1">
                  {recipe.ingredients.slice(0, 5).map((ingredient, index) => (
                    <li key={index} className="text-sm text-gray-700">{ingredient}</li>
                  ))}
                  {recipe.ingredients.length > 5 && (
                    <li className="text-sm text-amber-600 font-medium">+{recipe.ingredients.length - 5} more</li>
                  )}
                </ul>
              </details>
              
              <details className="cursor-pointer">
                <summary className="font-medium text-amber-800">Instructions</summary>
                <ol className="mt-2 pl-5 list-decimal space-y-1">
                  {recipe.instructions.slice(0, 3).map((instruction, index) => (
                    <li key={index} className="text-sm text-gray-700">{instruction}</li>
                  ))}
                  {recipe.instructions.length > 3 && (
                    <li className="text-sm text-amber-600 font-medium">+{recipe.instructions.length - 3} more steps</li>
                  )}
                </ol>
              </details>
            </div>
          )}
          
          <div className="mt-4">
            <Button
              className="bg-amber-600 hover:bg-amber-700"
              onClick={handleViewFullRecipe}
            >
              {isCompact ? 'View Details' : 'View Full Recipe'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

function EmptyMealCard({ mealType }: { mealType: string }) {
  return (
    <Card className="flex flex-col items-center justify-center p-8 bg-gray-50">
      <div className="text-gray-400 mb-3">
        <CalendarIcon className="h-12 w-12" />
      </div>
      <h3 className="text-lg font-medium text-gray-700">No {mealType} planned</h3>
      <p className="text-gray-500 mb-4 text-center">You don't have any {mealType} planned for this day</p>
      <Button>Add a {mealType}</Button>
    </Card>
  );
}
