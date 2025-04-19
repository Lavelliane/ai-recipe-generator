export interface MealPlan {
  id: string;
  user_id: string;
  title: string;
  description: string;
  start_date: string; // ISO date format
  end_date: string; // ISO date format
  created_at: string; // ISO datetime format
}

export type CreateMealPlanInput = Omit<MealPlan, 'id' | 'created_at'>;
export type UpdateMealPlanInput = Partial<Omit<MealPlan, 'id' | 'user_id' | 'created_at'>>;
