"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { cookies } from "next/headers"

export async function checkEmailExists(email: string) {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, full_name")
      .eq("email", email)
      .single()

    if (error && error.code !== "PGRST116") {
      return { exists: false, profile: null }
    }

    return {
      exists: !!data,
      profile: data,
    }
  } catch (error) {
    return { exists: false, profile: null }
  }
}

export async function registerUser(formData: FormData) {
  try {
    const supabase = createServerSupabaseClient()

    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const fullName = formData.get("fullName") as string
    const phoneNumber = formData.get("phoneNumber") as string
    const facebookUrl = formData.get("facebookUrl") as string
    const university = formData.get("university") as string
    const ctfExperience = formData.get("ctfExperience") === "yes"
    const teamPreference = formData.get("teamPreference") as string

    // Validate inputs
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: "Invalid email address" }
    }
    if (!password || password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters" }
    }
    if (!fullName) {
      return { success: false, error: "Full name is required" }
    }
    if (!["solo", "team"].includes(teamPreference)) {
      return { success: false, error: "Invalid team preference" }
    }
    if (phoneNumber && !/^\+?\d{8,}$/.test(phoneNumber)) {
      return { success: false, error: "Invalid phone number" }
    }
    if (facebookUrl && !/^https?:\/\/(www\.)?facebook\.com\/.+$/.test(facebookUrl)) {
      return { success: false, error: "Invalid Facebook URL" }
    }

    // Normalize optional fields
    const normalizedPhoneNumber = phoneNumber || null
    const normalizedFacebookUrl = facebookUrl || null
    const normalizedUniversity = university || null

    // Check if user already exists
    const { exists, profile } = await checkEmailExists(email)
    if (exists) {
      return {
        success: false,
        error: "You are already registered",
        profile,
        alreadyRegistered: true,
      }
    }

    // Register the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })

    if (authError || !authData.user) {
      return { success: false, error: authError?.message || "Failed to register user" }
    }

    // Create profile entry with authenticated user session
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: authData.user.id,
        full_name: fullName,
        email,
        phone_number: normalizedPhoneNumber,
        facebook_url: normalizedFacebookUrl,
        university: normalizedUniversity,
        ctf_experience: ctfExperience,
        team_preference: teamPreference as "solo" | "team",
        is_admin: false,
      },
    ])

    if (profileError) {

      await supabase.auth.admin.deleteUser(authData.user.id)
      return { success: false, error: `Failed to create profile: ${profileError.message}` }
    }

    return {
      success: true,
      message: "Registration successful! Check your email for confirmation.",
    }
  } catch (error) {
    return { success: false, error: "An unexpected error occurred. Please try again." }
  }
}