'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Button, Input, Select, SelectItem } from '@heroui/react';
import { generateAIMealPlan } from '../../_actions/generate-ai-meal-plan';
import { addToast } from '@heroui/react';

export default function NewMealPlanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD format
  });
  const [daysCount, setDaysCount] = useState(7);
  const [goal, setGoal] = useState('Weight Management');
  const [calorieTarget, setCalorieTarget] = useState(2000);
  const [dietaryPreferences, setDietaryPreferences] = useState(['no-preference']);
  const [allergies, setAllergies] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      addToast({
        title: "Generating meal plan",
        description: "This may take up to a minute. Please wait...",
        color: "warning",
      });

      console.log(startDate, 
        daysCount,
        {
          goal,
          dietaryPreferences,
          allergies,
          calorieTarget
        })
      
      const result = await generateAIMealPlan(
        startDate, 
        daysCount,
        {
          goal,
          dietaryPreferences,
          allergies,
          calorieTarget
        }
      );
      
      if (result.success && result.data) {
        addToast({
          title: "Success!",
          description: "Your meal plan has been created.",
          color: "success",
        });
        
        // Navigate to the meal plan page
        router.push(`/meal-plans/${result.data.id}`);
      } else {
        throw new Error(result.error || 'Failed to generate meal plan');
      }
    } catch (error) {
      console.error(error);
      addToast({
        title: "Error",
        description: "Failed to generate meal plan. Please try again.",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Generate AI Meal Plan</h1>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="start-date" className="block text-sm font-medium">
              Start Date
            </label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="days-count" className="block text-sm font-medium">
              Number of Days
            </label>
            <select 
              id="days-count"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              value={daysCount.toString()}
              onChange={(e) => setDaysCount(parseInt(e.target.value, 10))}
            >
              <option value="3">3 days</option>
              <option value="5">5 days</option>
              <option value="7">7 days</option>
              <option value="14">14 days</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="goal" className="block text-sm font-medium">
              Meal Plan Goal
            </label>
            <select 
              id="goal"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            >
              <option value="Weight Management">Weight Management</option>
              <option value="Muscle Building">Muscle Building</option>
              <option value="Weight Loss">Weight Loss</option>
              <option value="Healthy Eating">Healthy Eating</option>
              <option value="Energy Boost">Energy Boost</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="calories" className="block text-sm font-medium">
              Daily Calorie Target
            </label>
            <Input
              id="calories"
              type="number"
              value={calorieTarget.toString()}
              onChange={(e) => setCalorieTarget(parseInt(e.target.value, 10))}
              min={1200}
              max={4000}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="dietary-preferences" className="block text-sm font-medium">
              Dietary Preferences
            </label>
            <select 
              id="dietary-preferences"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              value={dietaryPreferences[0]}
              onChange={(e) => setDietaryPreferences([e.target.value])}
            >
              <option value="No Preference">No Preference</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Pescatarian">Pescatarian</option>
              <option value="Keto">Keto</option>
              <option value="Paleo">Paleo</option>
              <option value="Gluten-Free">Gluten-Free</option>
              <option value="Dairy-Free">Dairy-Free</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="allergies" className="block text-sm font-medium">
              Allergies or Restrictions (comma separated)
            </label>
            <Input
              id="allergies"
              placeholder="e.g., peanuts, shellfish, soy"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-amber-600 hover:bg-amber-700"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Meal Plan'}
          </Button>
          
          {loading && (
            <p className="text-center text-sm text-gray-500 mt-2">
              This may take up to a minute as our AI crafts a personalized meal plan for you.
            </p>
          )}
        </form>
      </Card>
    </div>
  );
} 