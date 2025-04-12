import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Define the User interface
interface User {
  id: string
  name: string
  email: string
  // Add any other user properties you need
}

// Define the store state and actions
interface UserState {
  user: User | null
  isLoggedIn: boolean
  setUser: (user: User) => void
  updateUser: (userData: Partial<User>) => void
  logout: () => void
}

// Create the store with persistence
const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      
      setUser: (user: User) => 
        set({ user, isLoggedIn: true }),
      
      updateUser: (userData: Partial<User>) => 
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
      
      logout: () => 
        set({ user: null, isLoggedIn: false }),
    }),
    {
      name: 'user-storage', // storage key
      // You can specify storage, e.g., sessionStorage
      // storage: createJSONStorage(() => sessionStorage),
    }
  )
)

export default useUserStore
