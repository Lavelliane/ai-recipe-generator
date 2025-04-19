import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "./components/navbar";
import Sidebar from "./components/sidebar";

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
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 pl-64">
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}