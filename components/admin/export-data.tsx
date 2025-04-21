"use client"

import { useState } from "react"
import { Download, FileSpreadsheet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseBrowser } from "@/lib/supabase-browser"

export default function ExportData() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [exported, setExported] = useState(false)
  const supabase = getSupabaseBrowser()

  async function handleExport() {
    setLoading(true)
    setError(null)

    try {
      // Get all registrations
      const { data, error } = await supabase.from("profiles").select("*")

      if (error) {
        setError(error.message || "Error fetching data")
        return
      }

      if (!data || data.length === 0) {
        setError("No data to export")
        return
      }

      // Convert to CSV
      const headers = [
        "Full Name",
        "Email",
        "Phone Number",
        "Facebook URL",
        "University",
        "CTF Experience",
        "Team Preference",
        "Registration Date",
      ]

      const csvRows = [
        headers.join(","),
        ...data.map((reg) =>
          [
            `"${reg.full_name || ""}"`,
            `"${reg.email || ""}"`,
            `"${reg.phone_number || ""}"`,
            `"${reg.facebook_url || ""}"`,
            `"${reg.university || ""}"`,
            reg.ctf_experience ? "Yes" : "No",
            reg.team_preference === "team" ? "Team" : "Solo",
            new Date(reg.created_at).toLocaleString(),
          ].join(","),
        ),
      ]

      const csvContent = csvRows.join("\n")

      // Create a download link
      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `securinets-registrations-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setExported(true)
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gray-900 border-gray-800 max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-gray-200">Export Registrations</CardTitle>
        <CardDescription className="text-gray-400">Download all registration data as a CSV file</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <FileSpreadsheet className="h-16 w-16 text-[#C400ED] mb-6" />

        {exported ? (
          <div className="text-center">
            <p className="text-[#29ED00] mb-4">Export successful!</p>
            <Button onClick={handleExport} className="bg-[#29ED00] hover:bg-[#29ED00]/80 text-black font-medium">
              <Download className="mr-2 h-4 w-4" />
              Download Again
            </Button>
          </div>
        ) : (
          <>
            <p className="text-gray-300 mb-6 text-center max-w-md">
              This will generate a CSV file containing all registration data including names, emails, universities, and
              preferences.
            </p>

            {error && <div className="p-3 rounded text-sm bg-red-900/30 text-red-300 mb-4 w-full">{error}</div>}

            <Button onClick={handleExport} disabled={loading} className="bg-[#C400ED] hover:bg-[#C400ED]/80">
              {loading ? (
                <span className="flex items-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                  Exporting...
                </span>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export as CSV
                </>
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
