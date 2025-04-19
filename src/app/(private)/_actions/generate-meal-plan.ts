'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import dayjs from 'dayjs'

export async function createMealPlan(){
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    console.log(user)
    const { data, error } = await supabase.from('meal_plans').insert({
      user_id: user?.id,
      title: `Meal Plan ${dayjs().format('DD-MM-YYYY')}`,
      description: 'This is a sample meal plan',
      start_date: dayjs().format('YYYY-MM-DD'),
      end_date: dayjs().add(7, 'day').format('YYYY-MM-DD')
    }).select()

    if (error) {
      console.error('Error creating meal plan:', error);
      return { success: false, error: error }
    } else {
      console.log(data)
      return { success: true, data: data }
    }
  }