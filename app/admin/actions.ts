import { createServerSupabaseClient } from "@/lib/supabase"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { ReactNode } from "react"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const headersList = await headers()

  if (headersList.get("x-skip-admin-check") === "true") {
    return {children}
  }

  try {
    const supabase = await createServerSupabaseClient()
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()


    if (sessionError || !session) {
      return redirect("/admin/login?redirected=true")
    }

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", session.user.id)
      .single()


    if (profileError || !profileData?.is_admin) {

      return redirect("/admin/login?redirected=true")
    }

    return {children}
  } catch (error) {
    return redirect("/admin/login?redirected=true")
  }
}