'use client';
import { Progress } from '@heroui/react'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@heroui/react'

const OnboardingScreenProgress = () => {
  const [step, setStep] = useState<'goals' | 'preferences' | 'allergies'>('goals')
  const [selectedGoal, setSelectedGoal] = useState<string>('')
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([])
  const [allergies, setAllergies] = useState<string>('')
  const router = useRouter()

  const handleNext = () => {
    if (step === 'goals' && selectedGoal) {
      setStep('preferences')
    } else if (step === 'preferences') {
      setStep('allergies')
    } else if (step === 'allergies') {
      
      router.push('/onboarding/final')
    }
  }

  const handleBack = () => {
    if (step === 'preferences') {
      setStep('goals')
    } else if (step === 'allergies') {
      setStep('preferences')
    }
  }

  const togglePreference = (preference: string) => {
    setSelectedPreferences(prev => 
      prev.includes(preference)
        ? prev.filter(p => p !== preference)
        : [...prev, preference]
    )
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
              onClick={() => setSelectedGoal('cook-with-ingredients')}
              className={`w-full py-4 px-6 rounded-full text-lg transition-colors ${
                selectedGoal === 'cook-with-ingredients' 
                  ? 'bg-primary text-white hover:bg-orange-500' 
                  : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              I want to cook with what I have
            </button>

            <button 
              onClick={() => setSelectedGoal('quick-recipes')}
              className={`w-full py-4 px-6 rounded-full text-lg transition-colors ${
                selectedGoal === 'quick-recipes' 
                  ? 'bg-primary text-white hover:bg-orange-500' 
                  : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              I need quick recipes for busy days
            </button>

            <button 
              onClick={() => setSelectedGoal('healthy-meals')}
              className={`w-full py-4 px-6 rounded-full text-lg transition-colors ${
                selectedGoal === 'healthy-meals' 
                  ? 'bg-primary text-white hover:bg-orange-500' 
                  : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              I'm looking for healthy meal options
            </button>

            <button 
              onClick={() => setSelectedGoal('shopping-list')}
              className={`w-full py-4 px-6 rounded-full text-lg transition-colors ${
                selectedGoal === 'shopping-list' 
                  ? 'bg-primary text-white hover:bg-orange-500' 
                  : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              I want recipes with a smart shopping list
            </button>

            <button 
              onClick={() => setSelectedGoal('improve-skills')}
              className={`w-full py-4 px-6 rounded-full text-lg transition-colors ${
                selectedGoal === 'improve-skills' 
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
              onClick={() => togglePreference('vegetarian-vegan')}
              className={`py-4 px-6 rounded-full text-lg transition-colors ${
                selectedPreferences.includes('vegetarian-vegan')
                  ? 'bg-primary text-white hover:bg-orange-500' 
                  : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Vegetarian / Vegan
            </button>

            <button 
              onClick={() => togglePreference('no-preference')}
              className={`py-4 px-6 rounded-full text-lg transition-colors ${
                selectedPreferences.includes('no-preference')
                  ? 'bg-primary text-white hover:bg-orange-500' 
                  : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              No specific preference
            </button>

            <button 
              onClick={() => togglePreference('keto-lowcarb')}
              className={`py-4 px-6 rounded-full text-lg transition-colors ${
                selectedPreferences.includes('keto-lowcarb')
                  ? 'bg-primary text-white hover:bg-orange-500' 
                  : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Keto / Low-carb
            </button>

            <button 
              onClick={() => togglePreference('gluten-dairy-free')}
              className={`py-4 px-6 rounded-full text-lg transition-colors ${
                selectedPreferences.includes('gluten-dairy-free')
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
            disabled={step === 'goals' ? !selectedGoal : false}
            className={`px-8 py-3 rounded-full text-white font-medium transition-colors ${
              (step === 'goals' && selectedGoal) || step === 'preferences' || (step === 'allergies' && allergies.trim())
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
