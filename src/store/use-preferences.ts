import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Goal = 'cook-with-ingredients' | 'quick-recipes' | 'healthy-meals' | 'shopping-list' | 'improve-skills' | '';

type DietaryPreference = 'vegetarian-vegan' | 'no-preference' | 'keto-lowcarb' | 'gluten-dairy-free';

interface UserPreferences {
  goal: Goal;
  dietaryPreferences: DietaryPreference[];
  allergies: string;
  combined: {
    goal: Goal;
    dietaryPreferences: DietaryPreference[];
    allergies: string;
  };
}

interface PreferencesStore extends UserPreferences {
  setGoal: (goal: Goal) => void;
  setDietaryPreferences: (preferences: DietaryPreference[]) => void;
  toggleDietaryPreference: (preference: DietaryPreference) => void;
  setAllergies: (allergies: string) => void;
  resetPreferences: () => void;
}

const initialState: UserPreferences = {
  goal: '',
  dietaryPreferences: [],
  allergies: '',
  combined: {
    goal: '',
    dietaryPreferences: [],
    allergies: ''
  }
}

export const usePreferences = create<PreferencesStore>()(
  persist(
    (set) => ({
      ...initialState,
      
      setGoal: (goal) => set((state) => {
        const combined = {
          ...state.combined,
          goal
        };
        return { goal, combined };
      }),
      
      setDietaryPreferences: (dietaryPreferences) => set((state) => {
        const combined = {
          ...state.combined,
          dietaryPreferences
        };
        return { dietaryPreferences, combined };
      }),
      
      toggleDietaryPreference: (preference) => set((state) => {
        const dietaryPreferences = state.dietaryPreferences.includes(preference)
          ? state.dietaryPreferences.filter(p => p !== preference)
          : [...state.dietaryPreferences, preference];
        
        const combined = {
          ...state.combined,
          dietaryPreferences
        };
        
        return { dietaryPreferences, combined };
      }),
      
      setAllergies: (allergies) => set((state) => {
        const combined = {
          ...state.combined,
          allergies
        };
        return { allergies, combined };
      }),
      
      resetPreferences: () => set(initialState)
    }),
    {
      name: 'user-preferences'
    }
  )
)
