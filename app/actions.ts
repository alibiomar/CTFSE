// app/actions.ts
import { createClient } from "@/lib/supabase";

export async function checkEmailExists(email: string) {
  const supabase = createClient(); // Create client per request
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, full_name")
      .eq("email", email)
      .maybeSingle(); // Use maybeSingle for cleaner no-row handling

    if (error) {
      console.error("Error checking email:", error);
      return { exists: false, profile: null };
    }

    return {
      exists: !!data,
      profile: data,
    };
  } catch (error) {
    console.error("Unexpected error checking email:", error);
    return { exists: false, profile: null };
  }
}

export async function registerUser(formData: FormData) {
  const supabase = createClient(); // Create client per request
  try {
    // Extract and validate form data
    const email = formData.get("email");
    const fullName = formData.get("fullName");
    const phoneNumber = formData.get("phoneNumber");
    const facebookUrl = formData.get("facebookUrl");
    const university = formData.get("university");
    const ctfExperience = formData.get("ctfExperience") === "yes";
    const teamPreference = formData.get("teamPreference");
    const participationMode = formData.get("participationMode");

    // Type and presence validation
    if (typeof email !== "string" || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: "Invalid email address" };
    }
    if (typeof fullName !== "string" || !fullName.trim()) {
      return { success: false, error: "Full name is required" };
    }
    if (typeof teamPreference !== "string" || !["solo", "team"].includes(teamPreference)) {
      return { success: false, error: "Invalid team preference" };
    }
    if (typeof participationMode !== "string" || !["online", "onsite"].includes(participationMode)) {
      return { success: false, error: "Invalid participation mode" };
    }
    if (typeof phoneNumber === "string" && phoneNumber && !/^\+?\d{8}$/.test(phoneNumber)) {
      return { success: false, error: "Phone number must be exactly 8 digits (optional country code)" };
    }
    if (typeof facebookUrl === "string" && facebookUrl && !/^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9.]+$/.test(facebookUrl)) {
      return { success: false, error: "Invalid Facebook URL (e.g., https://facebook.com/username)" };
    }

    // Check if email exists
    const { exists, profile } = await checkEmailExists(email);
    if (exists) {
      return {
        success: false,
        error: "This email is already registered",
        profile,
        alreadyRegistered: true,
      };
    }

    // Insert profile into profiles table
    // Note: Supabase RLS should prevent unauthorized updates to is_admin
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: crypto.randomUUID(),
        full_name: fullName,
        email,
        phone_number: typeof phoneNumber === "string" ? phoneNumber || null : null,
        facebook_url: typeof facebookUrl === "string" ? facebookUrl || null : null,
        university: typeof university === "string" ? university || null : null,
        ctf_experience: ctfExperience,
        team_preference: teamPreference as "solo" | "team",
        participation_mode: participationMode as "online" | "onsite",
        is_admin: false,
      },
    ]);

    if (profileError) {
      console.error("Error saving profile:", profileError);
      return { success: false, error: "Failed to save registration" };
    }

    return {
      success: true,
      message: "Registration successful!",
    };
  } catch (error) {
    console.error("Unexpected error during registration:", error);
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}