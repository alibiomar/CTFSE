"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LockIcon, MailIcon, ShieldIcon } from "lucide-react"
import TerminalEffect from "@/components/terminal-effect"
import { getSupabaseBrowser } from "@/lib/supabase-browser"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = getSupabaseBrowser()

  // Handle redirect errors
  useEffect(() => {
    const errorParam = searchParams.get("error")
    const redirected = searchParams.get("redirected")
    if (errorParam === "not-admin") {
      setError("You do not have admin privileges")
    } else if (errorParam === "auth-failed") {
      setError("Authentication service unavailable. Please try again later.")
    } else if (errorParam === "config") {
      setError("Server configuration error. Please contact support.")
    } else if (errorParam === "too-many-redirects") {
      setError("Too many redirects. Please clear your browser cache and try again.")
    } else if (redirected) {
      setError("Please log in to access the admin panel")
    }
  }, [searchParams])

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setError(null)

      if (!isValidEmail(email)) {
        setError("Please enter a valid email address")
        return
      }
      if (password.length < 8) {
        setError("Password must be at least 8 characters long")
        return
      }

      setLoading(true)

      try {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (authError) {
          if (authError.status === 400) {
            setError("Invalid email or password")
          } else {
            setError("Authentication failed. Please try again later.")
          }
          return
        }

        // Redirect to admin panel (server-side checks will handle admin status)
        router.push("/admin")
      } catch (err) {
        setError("An unexpected error occurred. Please try again.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    },
    [email, password, router, supabase]
  )

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-[#29ED00] tracking-tight">
            <TerminalEffect text="SECURINETS ENIT" />
          </h1>
          <p className="text-[#C400ED] text-xl">
            <TerminalEffect text="Admin Access" delay={1500} />
          </p>
          <div className="mt-4 text-gray-400 text-sm">
            <TerminalEffect text="// Restricted area - Authentication required" delay={2500} />
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#29ED00] to-[#C400ED] rounded-lg blur opacity-75"></div>
          <div className="relative bg-black border border-gray-800 rounded-lg p-6">
            <form onSubmit={handleLogin} className="space-y-4" aria-label="Admin Login Form">
              <div className="space-y-1">
                <Label htmlFor="email" className="text-[#29ED00]">
                  <span className="flex items-center gap-2">
                    <MailIcon size={16} aria-hidden="true" />
                    Admin Email
                  </span>
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
                    required
                    disabled={loading}
                    className="bg-gray-900 border-gray-800 text-white pl-3 focus:border-[#C400ED] focus:ring-[#C400ED]"
                    placeholder="admin@securinets.org"
                    aria-describedby={error ? "email-error" : undefined}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="password" className="text-[#29ED00]">
                  <span className="flex items-center gap-2">
                    <LockIcon size={16} aria-hidden="true" />
                    Password
                  </span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="bg-gray-900 border-gray-800 text-white pl-3 focus:border-[#C400ED] focus:ring-[#C400ED]"
                    placeholder="••••••••••••"
                    aria-describedby={error ? "password-error" : undefined}
                  />
                </div>
              </div>

              {error && (
                <div
                  id="error-message"
                  className="p-3 rounded text-sm bg-red-900/30 text-red-300"
                  role="alert"
                >
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#29ED00] to-[#C400ED] hover:opacity-90 text-white font-bold"
                aria-label={loading ? "Authenticating..." : "Access Admin Panel"}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-pulse">Authenticating</span>
                    <span className="inline-block animate-spin">⟳</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <ShieldIcon size={16} aria-hidden="true" />
                    Access Admin Panel
                  </span>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}