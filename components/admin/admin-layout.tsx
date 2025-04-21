"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LayoutDashboard, Users, Settings, LogOut, Shield, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowser } from "@/lib/supabase-browser"

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = getSupabaseBrowser()

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.push("/admin/login")
          return
        }

        // Check if user is an admin
        const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", session.user.id).single()

        if (!profile?.is_admin) {
          router.push("/")
          return
        }

        setIsAdmin(true)
      } catch (error) {
        router.push("/admin/login")
      } finally {
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [router, supabase])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#29ED00]"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-gray-900 p-4 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-[#29ED00]" />
          <span className="font-bold text-[#29ED00]">Securinets Admin</span>
        </div>
        <Button variant="ghost" size="icon" className="text-gray-400">
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-900 border-r border-gray-800 p-4">
        <div className="flex items-center gap-2 mb-8">
          <Shield className="h-6 w-6 text-[#29ED00]" />
          <span className="font-bold text-[#29ED00]">Securinets Admin</span>
        </div>

        <nav className="space-y-1 flex-1">
          <Link
            href="/admin"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/admin/registrations"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <Users className="h-5 w-5" />
            <span>Registrations</span>
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </nav>

        <Button
          variant="ghost"
          className="w-full justify-start text-gray-400 hover:text-white mt-auto"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5 mr-2" />
          <span>Sign Out</span>
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
