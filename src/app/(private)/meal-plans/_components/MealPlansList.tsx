'use client';

import Link from 'next/link';
import { Card, Button } from '@heroui/react';
import { CalendarIcon, PlusIcon } from '@heroicons/react/24/outline';

interface MealPlan {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  goal?: string;
  user_id: string;
}

interface MealPlansListProps {
  mealPlans: MealPlan[] | null;
}

export default function MealPlansList({ mealPlans }: MealPlansListProps) {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Meal Plans</h1>
        <Link href="/meal-plans/new">
          <Button className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700">
            <PlusIcon className="h-5 w-5" />
            New Meal Plan
          </Button>
        </Link>
      </div>
      
      {mealPlans && mealPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mealPlans.map((plan) => (
            <Link key={plan.id} href={`/meal-plans/${plan.id}`}>
              <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                <h2 className="text-xl font-bold mb-2">{plan.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{plan.description}</p>
                <div className="flex items-center gap-2 text-gray-500">
                  <CalendarIcon className="h-5 w-5" />
                  <span>{new Date(plan.start_date).toLocaleDateString()} to {new Date(plan.end_date).toLocaleDateString()}</span>
                </div>
                {plan.goal && (
                  <div className="mt-3">
                    <span className="inline-block bg-amber-100 text-amber-800 text-sm px-2.5 py-0.5 rounded">
                      {plan.goal}
                    </span>
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-8 text-center">
          <div className="mb-4 flex justify-center">
            <CalendarIcon className="h-16 w-16 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Meal Plans Yet</h2>
          <p className="text-gray-500 mb-6">
            Create your first AI-generated meal plan to get started on your healthy eating journey.
          </p>
          <Link href="/meal-plans/new">
            <Button className="bg-amber-600 hover:bg-amber-700">
              Create Your First Meal Plan
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
} 