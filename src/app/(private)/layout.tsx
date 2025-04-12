import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { signOut } from "./_actions/sign-out";

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in')
  }

  return (
    <div className="bg-white h-screen w-full">
      <div className="flex justify-end p-4">
        <form action={signOut} method="post" encType="multipart/form-data">
          <button 
            type="submit" 
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium text-gray-700 transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>
      {children}
    </div>
  );
}