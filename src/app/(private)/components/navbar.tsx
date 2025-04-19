'use client';

import { addToast, Input } from "@heroui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/app/(private)/_actions/sign-out";
import { createMealPlan } from "../_actions/generate-meal-plan";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const handleGenerateRecipeClick = async () => {
    const { success, data, error } = await createMealPlan()
    if (success) {
      console.log(data)
      addToast({
        title: "Meal Plan created successfully",
        description: "Your meal plan is ready",
        color: "success",
      })
      router.push(`/meal-plans/${data?.[0]?.id || ''}`)
    } else {
      console.error('Failed to create meal plan:', error)
    }
  };

  const handleProfileClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/sign-in');
      router.refresh();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <div className="sticky top-0 z-10 w-full bg-white">
      <nav className="h-16">
        <div className="h-full px-8 flex items-center justify-between">
          
          <div className="w-[400px]">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <Input
                type="text"
                placeholder="Search by food name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-sm rounded-full border border-gray-200 focus:ring-1 focus:ring-gray-200 focus:border-gray-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
          
            <button
              onClick={handleGenerateRecipeClick}
              className="flex items-center px-6 py-1.5 bg-black text-white rounded-full hover:bg-gray-800 transition-colors text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
              </svg>

              Generate Meal Plan
            </button>

           
            <div className="relative">
              <button
                onClick={handleProfileClick}
                className="flex rounded-full overflow-hidden focus:outline-none focus:ring-1 focus:ring-gray-200"
              >
                <img
                  src="/profile1.jpg"
                  alt="User profile"
                  className="h-6 w-6 rounded-full object-cover"
                />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg py-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}