'use client';
import { Progress } from '@heroui/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@heroui/react'
import { usePreferences } from '@/store/use-preferences'

const OnboardingScreenProgress = () => {
  const [step, setStep] = useState<'goals' | 'preferences' | 'allergies'>('goals')
  const router = useRouter()
  const { 
    goal, 
    dietaryPreferences, 
    allergies, 
    setGoal, 
    toggleDietaryPreference, 
    setAllergies 
  } = usePreferences()

  const handleNext = () => {
    if (step === 'goals' && goal) {
      setStep('preferences')
    } else if (step === 'preferences') {
      setStep('allergies')
    } else if (step === 'allergies') {
      router.push('/flows/123')
    }
  }

  const handleBack = () => {
    if (step === 'preferences') {
      setStep('goals')
    } else if (step === 'allergies') {
      setStep('preferences')
    }
  }

  const getProgressValue = () => {
    switch (step) {
      case 'goals':
        return 33;
      case 'preferences':
        return 66;
      case 'allergies':
        return 100;
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="mb-8">
        <Progress value={getProgressValue()} className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${getProgressValue()}%` }}
          />
        </Progress>
      </div>

      {step === 'goals' ? (
        <>
          <h1 className="text-3xl font-bold text-center mb-12">What's Your Cooking Goal?</h1>
          
          <div className="flex flex-col gap-4 mb-8">
            <button 
              onClick={() => setGoal('cook-with-ingredients')}
              className={`w-full py-4 px-6 rounded-full text-lg transition-colors ${
                goal === 'cook-with-ingredients' 
                  ? 'bg-primary text-white hover:bg-orange-500' 
                  : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              I want to cook with what I have
            </button>

            <button 
              onClick={() => setGoal('quick-recipes')}
              className={`w-full py-4 px-6 rounded-full text-lg transition-colors ${
                goal === 'quick-recipes' 
                  ? 'bg-primary text-white hover:bg-orange-500' 
                  : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              I need quick recipes for busy days
            </button>

            <button 
              onClick={() => setGoal('healthy-meals')}
              className={`w-full py-4 px-6 rounded-full text-lg transition-colors ${
                goal === 'healthy-meals' 
                  ? 'bg-primary text-white hover:bg-orange-500' 
                  : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              I'm looking for healthy meal options
            </button>

            <button 
              onClick={() => setGoal('shopping-list')}
              className={`w-full py-4 px-6 rounded-full text-lg transition-colors ${
                goal === 'shopping-list' 
                  ? 'bg-primary text-white hover:bg-orange-500' 
                  : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              I want recipes with a smart shopping list
            </button>

            <button 
              onClick={() => setGoal('improve-skills')}
              className={`w-full py-4 px-6 rounded-full text-lg transition-colors ${
                goal === 'improve-skills' 
                  ? 'bg-primary text-white hover:bg-orange-500' 
                  : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              I want to improve my cooking skills
            </button>
          </div>
        </>
      ) : step === 'preferences' ? (
        <>
          <h1 className="text-3xl font-bold text-center mb-12">Your Dietary Preferences</h1>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button 
              onClick={() => toggleDietaryPreference('vegetarian-vegan')}
              className={`py-4 px-6 rounded-full text-lg transition-colors ${
                dietaryPreferences.includes('vegetarian-vegan')
                  ? 'bg-primary text-white hover:bg-orange-500' 
                  : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Vegetarian / Vegan
            </button>

            <button 
              onClick={() => toggleDietaryPreference('no-preference')}
              className={`py-4 px-6 rounded-full text-lg transition-colors ${
                dietaryPreferences.includes('no-preference')
                  ? 'bg-primary text-white hover:bg-orange-500' 
                  : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              No specific preference
            </button>

            <button 
              onClick={() => toggleDietaryPreference('keto-lowcarb')}
              className={`py-4 px-6 rounded-full text-lg transition-colors ${
                dietaryPreferences.includes('keto-lowcarb')
                  ? 'bg-primary text-white hover:bg-orange-500' 
                  : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Keto / Low-carb
            </button>

            <button 
              onClick={() => toggleDietaryPreference('gluten-dairy-free')}
              className={`py-4 px-6 rounded-full text-lg transition-colors ${
                dietaryPreferences.includes('gluten-dairy-free')
                  ? 'bg-primary text-white hover:bg-orange-500' 
                  : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Gluten-free / Dairy-free
            </button>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-center mb-12">Any Allergies or Dietary Restrictions?</h1>
          
          <div className="mb-8">
            <h2 className="text-lg mb-4">What are your allergies?</h2>
            <Input
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="Enter your allergies or dietary restrictions..."
              className="w-full p-4 rounded-full border border-gray-200 text-lg"
            />
          </div>
        </>
      )}

      <div className="flex justify-between">
        {step !== 'goals' && (
          <button
            onClick={handleBack}
            className="px-8 py-3 rounded-full text-gray-800 font-medium border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            Back
          </button>
        )}
        <div className={step !== 'goals' ? 'ml-auto' : ''}>
          <button
            onClick={handleNext}
            disabled={step === 'goals' ? !goal : false}
            className={`px-8 py-3 rounded-full text-white font-medium transition-colors ${
              (step === 'goals' && goal) || step === 'preferences' || (step === 'allergies' && allergies.trim())
                ? 'bg-primary hover:bg-orange-500' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {step === 'allergies' ? 'Save' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default OnboardingScreenProgress
