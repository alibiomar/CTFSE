"use client"

import { useState, useEffect } from "react"
import { Download, Search, ChevronDown, ChevronUp, UserCheck, X, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getSupabaseBrowser } from "@/lib/supabase-browser"

type Registration = {
  id: string
  full_name: string
  email: string
  phone_number: string
  facebook_url: string
  university: string
  ctf_experience: boolean
  team_preference: string
  created_at: string
}

export default function RegistrationsTable() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)
  const supabase = getSupabaseBrowser()

  useEffect(() => {
    fetchRegistrations()
  }, [searchQuery, sortBy, sortOrder])

  async function fetchRegistrations() {
    setLoading(true)
    try {
      let query = supabase.from("profiles").select("*")

      // Apply search if provided
      if (searchQuery) {
        query = query.or(
          `full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,university.ilike.%${searchQuery}%`,
        )
      }

      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === "asc" })

      const { data, error } = await query



      setRegistrations(data || [])
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  function handleSort(column: string) {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  async function handleExport() {
    try {
      // Get all registrations
      const { data, error } = await supabase.from("profiles").select("*")

      if (error) {
        alert("Error exporting data: " + error.message)
        return
      }

      if (!data || data.length === 0) {
        alert("No data to export")
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
    } catch (error) {
      alert("An unexpected error occurred during export")
    }
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#29ED00]">Registrations</h1>
          <p className="text-gray-400 mt-1">View and manage all participant registrations</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={handleExport} className="bg-[#C400ED] hover:bg-[#C400ED]/80">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search by name, email, or university..."
          className="pl-10 bg-gray-800 border-gray-700 text-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="rounded-lg border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-900 text-gray-300">
              <tr>
                <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort("full_name")}>
                  <div className="flex items-center">
                    <span>Name</span>
                    {sortBy === "full_name" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </th>
                <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort("email")}>
                  <div className="flex items-center">
                    <span>Email</span>
                    {sortBy === "email" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </th>
                <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort("university")}>
                  <div className="flex items-center">
                    <span>University</span>
                    {sortBy === "university" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </th>
                <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort("ctf_experience")}>
                  <div className="flex items-center">
                    <span>CTF Exp.</span>
                    {sortBy === "ctf_experience" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </th>
                <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort("team_preference")}>
                  <div className="flex items-center">
                    <span>Preference</span>
                    {sortBy === "team_preference" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </th>
                <th className="px-4 py-3 text-left cursor-pointer" onClick={() => handleSort("created_at")}>
                  <div className="flex items-center">
                    <span>Registered</span>
                    {sortBy === "created_at" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      ))}
                  </div>
                </th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-black">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#29ED00] mb-2"></div>
                      <span>Loading registrations...</span>
                    </div>
                  </td>
                </tr>
              ) : registrations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                    <UserCheck className="h-12 w-12 mx-auto mb-4 text-[#29ED00]" />
                    <p>No registrations found</p>
                    {searchQuery && <p className="mt-2 text-sm">Try adjusting your search query</p>}
                  </td>
                </tr>
              ) : (
                registrations.map((reg) => (
                  <tr key={reg.id} className="border-t border-gray-800 hover:bg-gray-900/50">
                    <td className="px-4 py-3 text-white">{reg.full_name}</td>
                    <td className="px-4 py-3 text-gray-300">{reg.email}</td>
                    <td className="px-4 py-3 text-gray-300">{reg.university}</td>
                    <td className="px-4 py-3">
                      {reg.ctf_experience ? (
                        <Badge className="bg-[#29ED00]/20 text-[#29ED00] hover:bg-[#29ED00]/30">Yes</Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-400">
                          No
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        className={
                          reg.team_preference === "team"
                            ? "bg-[#C400ED]/20 text-[#C400ED] hover:bg-[#C400ED]/30"
                            : "bg-[#29ED00]/20 text-[#29ED00] hover:bg-[#29ED00]/30"
                        }
                      >
                        {reg.team_preference === "team" ? "Team" : "Solo"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{new Date(reg.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-white"
                            onClick={() => setSelectedRegistration(reg)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-900 border-gray-800 text-white">
                          <DialogHeader>
                            <DialogTitle className="text-[#29ED00]">Registration Details</DialogTitle>
                          </DialogHeader>
                          {selectedRegistration && (
                            <div className="space-y-4 mt-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-gray-400">Full Name</p>
                                  <p className="text-white">{selectedRegistration.full_name}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400">Email</p>
                                  <p className="text-white">{selectedRegistration.email}</p>
                                </div>
                              </div>

                              <div>
                                <p className="text-xs text-gray-400">Phone Number</p>
                                <p className="text-white">{selectedRegistration.phone_number}</p>
                              </div>

                              <div>
                                <p className="text-xs text-gray-400">Facebook URL</p>
                                <p className="text-white">
                                  <a
                                    href={selectedRegistration.facebook_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#C400ED] hover:underline"
                                  >
                                    {selectedRegistration.facebook_url}
                                  </a>
                                </p>
                              </div>

                              <div>
                                <p className="text-xs text-gray-400">University</p>
                                <p className="text-white">{selectedRegistration.university}</p>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-gray-400">CTF Experience</p>
                                  <Badge
                                    className={
                                      selectedRegistration.ctf_experience
                                        ? "bg-[#29ED00]/20 text-[#29ED00]"
                                        : "bg-gray-800 text-gray-400"
                                    }
                                  >
                                    {selectedRegistration.ctf_experience ? "Yes" : "No"}
                                  </Badge>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-400">Team Preference</p>
                                  <Badge
                                    className={
                                      selectedRegistration.team_preference === "team"
                                        ? "bg-[#C400ED]/20 text-[#C400ED]"
                                        : "bg-[#29ED00]/20 text-[#29ED00]"
                                    }
                                  >
                                    {selectedRegistration.team_preference === "team" ? "Team" : "Solo"}
                                  </Badge>
                                </div>
                              </div>

                              <div>
                                <p className="text-xs text-gray-400">Registration Date</p>
                                <p className="text-white">
                                  {new Date(selectedRegistration.created_at).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
