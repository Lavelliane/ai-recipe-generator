'use server'

import { createClient } from "@/lib/supabase/server"

export async function signUpNewUser({ email, password, name }: { email: string, password: string, name: string }) {
    const supabase = await createClient()
    
    // First, sign up the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        
      }
    })
    
    if (authError) {
        console.error(authError)
        return { error: authError.message }
    }
    
    // If auth was successful, insert the user into our custom users table
    if (authData.user) {
      const { error: dbError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: email,
          name: name,
          // We don't store the actual password, as Supabase Auth handles that
        })
      
      if (dbError) {
        console.error(dbError)
        return { error: dbError.message }
      }
    }
    
    return { data: authData }
  }

export async function signInUser({ email, password }: { email: string, password: string }) {
  const supabase = await createClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    return { error: error.message }
  }
  
  return { data }
}