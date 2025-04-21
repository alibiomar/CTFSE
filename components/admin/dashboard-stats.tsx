"use client"

import { useEffect, useState } from "react"
import { Users, Shield, User, UsersRound, Monitor } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseBrowser } from "@/lib/supabase-browser"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    withCtfExperience: 0,
    soloPreference: 0,
    teamPreference: 0,
    onlineParticipation: 0,
    onsiteParticipation: 0,
  })
  interface Profile {
    id: string
    full_name: string | null
    email: string | null
    ctf_experience: boolean
    team_preference: string | null
    participation_mode: string | null
  }
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseBrowser()

  useEffect(() => {
    async function fetchData() {
      try {
        // Get total registrations
        const { count: totalCount } = await supabase.from("profiles").select("*", { count: "exact", head: true })

        // Get CTF experience count
        const { data: ctfData } = await supabase.from("profiles").select("ctf_experience").eq("ctf_experience", true)

        // Get team preference counts
        const { data: teamData } = await supabase.from("profiles").select("team_preference")

        // Get participation mode counts
        const { data: participationData } = await supabase.from("profiles").select("participation_mode")

        // Get all profiles data
        const { data: profilesData, error } = await supabase
          .from("profiles")
          .select("id, full_name, email, ctf_experience, team_preference, participation_mode")

        if (error) {
          console.error("Error fetching profiles:", error)
        } else {
          setProfiles(profilesData || [])
        }

        const withCtfExperience = ctfData?.length || 0
        const soloPreference = teamData?.filter((item) => item.team_preference === "solo").length || 0
        const teamPreference = teamData?.filter((item) => item.team_preference === "team").length || 0
        const onlineParticipation = participationData?.filter((item) => item.participation_mode === "online").length || 0
        const onsiteParticipation = participationData?.filter((item) => item.participation_mode === "onsite").length || 0

        setStats({
          totalRegistrations: totalCount || 0,
          withCtfExperience,
          soloPreference,
          teamPreference,
          onlineParticipation,
          onsiteParticipation,
        })
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [supabase])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-gray-900 border-gray-800">
              <CardHeader className="pb-2">
                <div className="h-5 w-24 bg-gray-800 rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-gray-800 rounded animate-pulse mt-1"></div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-gray-800 rounded-full animate-pulse mr-4"></div>
                  <div className="h-8 w-12 bg-gray-800 rounded animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="h-8 w-40 bg-gray-800 rounded animate-pulse mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-800 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-200 text-lg">Total Registrations</CardTitle>
            <CardDescription className="text-gray-400">All registered participants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-10 w-10 text-[#29ED00] mr-4" />
              <div className="text-3xl font-bold text-white">{stats.totalRegistrations}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-200 text-lg">CTF Experience</CardTitle>
            <CardDescription className="text-gray-400">Participants with prior experience</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Shield className="h-10 w-10 text-[#C400ED] mr-4" />
              <div className="text-3xl font-bold text-white">{stats.withCtfExperience}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-200 text-lg">Solo Preference</CardTitle>
            <CardDescription className="text-gray-400">Participants who prefer solo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <User className="h-10 w-10 text-[#29ED00] mr-4" />
              <div className="text-3xl font-bold text-white">{stats.soloPreference}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-200 text-lg">Team Preference</CardTitle>
            <CardDescription className="text-gray-400">Participants who prefer teams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <UsersRound className="h-10 w-10 text-[#C400ED] mr-4" />
              <div className="text-3xl font-bold text-white">{stats.teamPreference}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-200 text-lg">Online Participation</CardTitle>
            <CardDescription className="text-gray-400">Participants choosing online</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Monitor className="h-10 w-10 text-[#29ED00] mr-4" />
              <div className="text-3xl font-bold text-white">{stats.onlineParticipation}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-200 text-lg">Onsite Participation</CardTitle>
            <CardDescription className="text-gray-400">Participants choosing onsite</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Monitor className="h-10 w-10 text-[#C400ED] mr-4" />
              <div className="text-3xl font-bold text-white">{stats.onsiteParticipation}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-200 text-xl">Registered Profiles</CardTitle>
          <CardDescription className="text-gray-400">Complete list of all registered participants</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800 hover:bg-gray-800/50">
                <TableHead className="text-gray-400">ID</TableHead>
                <TableHead className="text-gray-400">Full Name</TableHead>
                <TableHead className="text-gray-400">Email</TableHead>
                <TableHead className="text-gray-400">CTF Experience</TableHead>
                <TableHead className="text-gray-400">Team Preference</TableHead>
                <TableHead className="text-gray-400">Participation Mode</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.length > 0 ? (
                profiles.map((profile) => (
                  <TableRow key={profile.id} className="border-gray-800 hover:bg-gray-800/50">
                    <TableCell className="text-gray-300">{profile.id}</TableCell>
                    <TableCell className="text-gray-300">{profile.full_name || "N/A"}</TableCell>
                    <TableCell className="text-gray-300">{profile.email || "N/A"}</TableCell>
                    <TableCell className="text-gray-300">
                      {profile.ctf_experience ? "Yes" : "No"}
                    </TableCell>
                    <TableCell className="text-gray-300 capitalize">
                      {profile.team_preference || "N/A"}
                    </TableCell>
                    <TableCell className="text-gray-300 capitalize">
                      {profile.participation_mode || "N/A"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="border-gray-800">
                  <TableCell colSpan={6} className="text-center text-gray-400 py-4">
                    No profiles found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}