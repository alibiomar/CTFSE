"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import {
  UserIcon,
  MailIcon,
  LockIcon,
  PhoneIcon,
  UsersIcon,
  BuildingIcon,
  ShieldIcon,
  GlobeIcon,
  MonitorIcon,
  UserCheck,
} from "lucide-react"
import { registerUser, checkEmailExists } from "@/app/actions"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function RegistrationForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [facebookUrl, setFacebookUrl] = useState("")
  const [university, setUniversity] = useState("")
  const [ctfExperience, setCtfExperience] = useState("no")
  const [teamPreference, setTeamPreference] = useState("solo")
  const [participationMode, setParticipationMode] = useState("online")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null)
  const [existingProfile, setExistingProfile] = useState<any>(null)
  const [checkingEmail, setCheckingEmail] = useState(false)

  const handleEmailBlur = async () => {
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setCheckingEmail(true)
      try {
        const result = await checkEmailExists(email)
        if (result.exists) {
          setExistingProfile(result.profile)
          setMessage({ text: "You are already registered with this email.", type: "error" })
        } else {
          setExistingProfile(null)
          setMessage(null)
        }
      } catch (error) {
        setMessage({ text: "Error checking email availability", type: "error" })
      } finally {
        setCheckingEmail(false)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    // Validation
    if (!fullName.trim()) {
      setMessage({ text: "Full name is required", type: "error" })
      setLoading(false)
      return
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage({ text: "Valid email is required", type: "error" })
      setLoading(false)
      return
    }
    if (!password || password.length < 6) {
      setMessage({ text: "Password must be at least 6 characters", type: "error" })
      setLoading(false)
      return
    }
    if (phoneNumber && !/^\+?\d{8,}$/.test(phoneNumber)) {
      setMessage({ text: "Invalid phone number format", type: "error" })
      setLoading(false)
      return
    }
    if (facebookUrl && !/^https?:\/\/(www\.)?facebook\.com\/.+$/.test(facebookUrl)) {
      setMessage({ text: "Please enter a valid Facebook URL", type: "error" })
      setLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append("email", email)
      formData.append("password", password)
      formData.append("fullName", fullName)
      formData.append("phoneNumber", phoneNumber)
      formData.append("facebookUrl", facebookUrl)
      formData.append("university", university)
      formData.append("ctfExperience", ctfExperience)
      formData.append("teamPreference", teamPreference)
      formData.append("participationMode", participationMode)

      const result = await registerUser(formData)

      if (result.success) {
        setMessage({
          text: result.message || "Registration successful! Check your email.",
          type: "success",
        })
        // Reset form
        setEmail("")
        setPassword("")
        setFullName("")
        setPhoneNumber("")
        setFacebookUrl("")
        setUniversity("")
        setCtfExperience("no")
        setTeamPreference("solo")
        setParticipationMode("online")
      } else {
        if (result.alreadyRegistered) {
          setExistingProfile(result.profile)
          setMessage({
            text: "You are already registered with this email",
            type: "error",
          })
        } else {
          setMessage({
            text: result.error || "Registration failed. Please try again.",
            type: "error",
          })
        }
      }
    } catch (error: any) {
      setMessage({
        text: error.message || "An unexpected error occurred",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  if (existingProfile) {
    return (
      <div className="space-y-6 bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-8 rounded-xl border-2 border-[#29ED00]/20 shadow-2xl shadow-[#C400ED]/10 max-w-2xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="p-4 bg-[#29ED00]/10 rounded-full border border-[#29ED00]/30">
            <UserCheck size={32} className="text-[#29ED00] animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-[#29ED00] to-[#C400ED] bg-clip-text text-transparent">
            Already Registered
          </h3>
        </div>
        
        <div className="space-y-4 text-gray-300">
          <div className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg">
            <UserIcon size={20} className="flex-shrink-0 mt-1 text-[#29ED00]" />
            <div>
              <p className="text-sm font-medium text-[#29ED00]">Full Name</p>
              <p className="text-base">{existingProfile.full_name}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg">
            <MailIcon size={20} className="flex-shrink-0 mt-1 text-[#29ED00]" />
            <div>
              <p className="text-sm font-medium text-[#29ED00]">Email</p>
              <p className="text-base">{existingProfile.email}</p>
            </div>
          </div>
        </div>

        <Button
          onClick={() => {
            setExistingProfile(null)
            setMessage(null)
            setEmail("")
          }}
          className="w-full bg-[#C400ED] hover:bg-[#C400ED]/90 transition-transform duration-200 hover:scale-[1.02]"
        >
          Use Different Email
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
      {/* Personal Information Section */}
      <div className="space-y-6 p-6 bg-gray-900/50 rounded-xl border border-[#29ED00]/10">
        <div className="flex items-center gap-3 mb-4">
          <UserIcon className="text-[#29ED00]" size={24} />
          <h2 className="text-xl font-bold bg-gradient-to-r from-[#29ED00] to-[#C400ED] bg-clip-text text-transparent">
            Personal Information
          </h2>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-gray-400">
              Full Name *
            </Label>
            <div className="relative">
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="pl-10 bg-gray-800/50 border-gray-700 focus:border-[#29ED00] focus:ring-1 focus:ring-[#29ED00]"
                placeholder="John Doe"
              />
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-400">
              Email *
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                required
                className="pl-10 bg-gray-800/50 border-gray-700 focus:border-[#29ED00] focus:ring-1 focus:ring-[#29ED00]"
                placeholder="your@email.com"
              />
              <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              {checkingEmail && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 animate-pulse">
                  Checking...
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-400">
              Password *
            </Label>
            <div className="relative">
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="pl-10 bg-gray-800/50 border-gray-700 focus:border-[#29ED00] focus:ring-1 focus:ring-[#29ED00]"
                placeholder="••••••••••••"
              />
              <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            </div>
            <p className="text-xs text-gray-500">Minimum 6 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="university" className="text-gray-400">
              University
            </Label>
            <div className="relative">
              <Input
                id="university"
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-700 focus:border-[#29ED00] focus:ring-1 focus:ring-[#29ED00]"
                placeholder="ENIT, INSAT, FST, etc."
              />
              <BuildingIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="space-y-6 p-6 bg-gray-900/50 rounded-xl border border-[#29ED00]/10">
        <div className="flex items-center gap-3 mb-4">
          <GlobeIcon className="text-[#29ED00]" size={24} />
          <h2 className="text-xl font-bold bg-gradient-to-r from-[#29ED00] to-[#C400ED] bg-clip-text text-transparent">
            Contact Information
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-gray-400">
              Phone Number
            </Label>
            <div className="relative">
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-700 focus:border-[#29ED00] focus:ring-1 focus:ring-[#29ED00]"
                placeholder="+216 XX XXX XXX"
              />
              <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="facebookUrl" className="text-gray-400">
              Facebook Profile
            </Label>
            <div className="relative">
              <Input
                id="facebookUrl"
                type="url"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-700 focus:border-[#29ED00] focus:ring-1 focus:ring-[#29ED00]"
                placeholder="https://facebook.com/username"
              />
              <UsersIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* Participation Preferences Section */}
      <div className="space-y-6 p-6 bg-gray-900/50 rounded-xl border border-[#29ED00]/10">
        <div className="flex items-center gap-3 mb-4">
          <ShieldIcon className="text-[#29ED00]" size={24} />
          <h2 className="text-xl font-bold bg-gradient-to-r from-[#29ED00] to-[#C400ED] bg-clip-text text-transparent">
            Participation Preferences
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-400">CTF Experience</Label>
              <RadioGroup
                value={ctfExperience}
                onValueChange={setCtfExperience}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="yes"
                    id="ctf-yes"
                    className="h-5 w-5 border-gray-600 text-[#29ED00]"
                  />
                  <Label htmlFor="ctf-yes" className="text-gray-300">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="no"
                    id="ctf-no"
                    className="h-5 w-5 border-gray-600 text-[#29ED00]"
                  />
                  <Label htmlFor="ctf-no" className="text-gray-300">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-400">Team Preference</Label>
              <RadioGroup
                value={teamPreference}
                onValueChange={setTeamPreference}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="solo"
                    id="team-solo"
                    className="h-5 w-5 border-gray-600 text-[#29ED00]"
                  />
                  <Label htmlFor="team-solo" className="text-gray-300">
                    Solo
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="team"
                    id="team-team"
                    className="h-5 w-5 border-gray-600 text-[#29ED00]"
                  />
                  <Label htmlFor="team-team" className="text-gray-300">
                    Team
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-400">Participation Mode</Label>
              <RadioGroup
                value={participationMode}
                onValueChange={setParticipationMode}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="online"
                    id="mode-online"
                    className="h-5 w-5 border-gray-600 text-[#29ED00]"
                  />
                  <Label htmlFor="mode-online" className="text-gray-300">
                    Online Participation
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="onsite"
                    id="mode-onsite"
                    className="h-5 w-5 border-gray-600 text-[#29ED00]"
                  />
                  <Label htmlFor="mode-onsite" className="text-gray-300">
                    On-site Participation
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg border ${
            message.type === "error"
              ? "bg-red-900/20 border-red-500/30 text-red-300"
              : "bg-green-900/20 border-green-500/30 text-green-300"
          }`}
        >
          <div className="flex items-center gap-2">
            <ShieldIcon className="h-5 w-5" />
            <span>{message.text}</span>
          </div>
        </div>
      )}

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-[#29ED00] to-[#C400ED] hover:from-[#29ED00]/90 hover:to-[#C400ED]/90 text-white font-bold py-6 text-lg transition-all duration-300 hover:scale-[1.02]"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Processing Registration...</span>
          </div>
        ) : (
          <span className="flex items-center gap-2">
            <ShieldIcon className="h-5 w-5" />
            Join Our CTF
          </span>
        )}
      </Button>

      <p className="text-center text-sm text-gray-500">
        By registering, you agree to our terms and join our cybersecurity community
      </p>
    </form>
  )
}