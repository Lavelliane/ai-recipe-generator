'use server'

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function signOut() {
  const supabase = await createClient()
  
  // Sign out the user from Supabase Auth
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error("Error signing out:", error.message)
    throw new Error("Failed to sign out")
  }
  
  // Redirect to sign-in page after successful sign out
  redirect('/sign-in')
}
