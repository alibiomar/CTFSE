"use client"

import type React from "react"

import { useState } from "react"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getSupabaseBrowser } from "@/lib/supabase-browser"

export default function SettingsPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)
  const supabase = getSupabaseBrowser()

  async function handleMakeAdmin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      // First check if the user exists
      const { data: userExists, error: userError } = await supabase
        .from("profiles")
        .select("id, is_admin")
        .eq("email", email)
        .single()

      if (userError) {
        setMessage({
          text: "User not found with this email address",
          type: "error",
        })
        return
      }

      if (userExists.is_admin) {
        setMessage({
          text: "This user is already an admin",
          type: "error",
        })
        return
      }

      // Update the user to be an admin
      const { error: updateError } = await supabase.from("profiles").update({ is_admin: true }).eq("email", email)

      if (updateError) {
        setMessage({
          text: "Error updating user: " + updateError.message,
          type: "error",
        })
        return
      }

      setMessage({
        text: "User has been granted admin privileges",
        type: "success",
      })
      setEmail("")
    } catch (error) {
      setMessage({
        text: "An unexpected error occurred",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#29ED00]">Admin Settings</h1>
        <p className="text-gray-400 mt-1">Manage admin privileges and system settings</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-200">Admin Access</CardTitle>
            <CardDescription className="text-gray-400">Grant admin privileges to users</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleMakeAdmin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-white">
                  User Email
                </Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              {message && (
                <div
                  className={`p-3 rounded text-sm ${
                    message.type === "error" ? "bg-red-900/30 text-red-300" : "bg-green-900/30 text-green-300"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-[#29ED00] to-[#C400ED] hover:opacity-90"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-pulse">Processing</span>
                    <span className="inline-block animate-spin">⟳</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Grant Admin Access
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-200">System Settings</CardTitle>
            <CardDescription className="text-gray-400">Configure application settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-400">
              <Shield className="h-12 w-12 mx-auto mb-4 text-[#C400ED]" />
              <p>Additional settings will be available here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
