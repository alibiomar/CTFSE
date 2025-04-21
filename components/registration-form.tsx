"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  LockIcon,
  UserIcon,
  MailIcon,
  ShieldIcon,
  PhoneIcon,
  GlobeIcon,
  BuildingIcon,
  UsersIcon,
  UserCheck,
  MonitorIcon,
  MapPinIcon,
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
  const [participationMode, setParticipationMode] = useState("on-site")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null)
  const [existingProfile, setExistingProfile] = useState<any>(null)
  const [checkingEmail, setCheckingEmail] = useState(false)

  const handleEmailBlur = async () => {
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setCheckingEmail(true)
      const result = await checkEmailExists(email)
      setCheckingEmail(false)
      if (result.exists) {
        setExistingProfile(result.profile)
        setMessage({ text: "You are already registered with this email.", type: "error" })
      } else {
        setExistingProfile(null)
        setMessage(null)
      }
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    // Client-side validation
    if (!fullName) {
      setMessage({ text: "Full name is required", type: "error" })
      setLoading(false)
      return
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage({ text: "Invalid email address", type: "error" })
      setLoading(false)
      return
    }
    if (!password || password.length < 6) {
      setMessage({ text: "Password must be at least 6 characters", type: "error" })
      setLoading(false)
      return
    }
    if (phoneNumber && !/^\+?\d{8,}$/.test(phoneNumber)) {
      setMessage({ text: "Invalid phone number", type: "error" })
      setLoading(false)
      return
    }
    if (facebookUrl && !/^https?:\/\/(www\.)?facebook\.com\/.+$/.test(facebookUrl)) {
      setMessage({ text: "Invalid Facebook URL", type: "error" })
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
          text: result.message || "Registration successful! Check your email for confirmation.",
          type: "success",
        })
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
        if (result.alreadyRegistered && result.profile) {
          setExistingProfile(result.profile)
          setMessage({
            text: "You are already registered with the following information:",
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
        text: error.message || "An unexpected error occurred. Please try again.",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  if (existingProfile) {
    return (
      <div className="space-y-4 bg-gray-900/50 p-6 rounded-lg border border-[#29ED00]/30">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-red-500/20 p-3 rounded-full">
            <UserCheck size={24} className="text-[#29ED00]" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-center text-[#C400ED] mb-4">Already Registered</h3>
        <div className="space-y-3 text-gray-300">
          <div className="flex items-start gap-2">
            <UserIcon size={16} className="mt-1 text-[#29ED00]" />
            <div>
              <p className="text-xs text-gray-500">Full Name</p>
              <p>{existingProfile.full_name}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MailIcon size={16} className="mt-1 text-[#29ED00]" />
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p>{existingProfile.email}</p>
            </div>
          </div>
        </div>
        <Button
          onClick={() => {
            setExistingProfile(null)
            setMessage(null)
            setEmail("")
          }}
          className="w-full mt-4 bg-[#C400ED] hover:bg-[#C400ED]/80 text-white"
        >
          Register with a different email
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSignUp} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="fullName" className="text-[#29ED00]">
          <span className="flex items-center gap-2">
            <UserIcon size={16} />
            Full Name
          </span>
        </Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="bg-gray-900 border-gray-800 text-white pl-3 focus:border-[#C400ED] focus:ring-[#C400ED]"
          placeholder="John Doe"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="email" className="text-[#29ED00]">
          <span className="flex items-center gap-2">
            <MailIcon size={16} />
            Email
          </span>
        </Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleEmailBlur}
            required
            className="bg-gray-900 border-gray-800 text-white pl-3 focus:border-[#C400ED] focus:ring-[#C400ED]"
            placeholder="your@email.com"
          />
          {checkingEmail && (
            <span className="text-xs text-gray-400 mt-1 animate-pulse">Checking email...</span>
          )}
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="password" className="text-[#29ED00]">
          <span className="flex items-center gap-2">
            <LockIcon size={16} />
            Password
          </span>
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="bg-gray-900 border-gray-800 text-white pl-3 focus:border-[#C400ED] focus:ring-[#C400ED]"
          placeholder="••••••••••••"
        />
        <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
      </div>
      <div className="space-y-1">
        <Label htmlFor="phoneNumber" className="text-[#29ED00]">
          <span className="flex items-center gap-2">
            <PhoneIcon size={16} />
            Phone Number (Optional)
          </span>
        </Label>
        <Input
          id="phoneNumber"
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="bg-gray-900 border-gray-800 text-white pl-3 focus:border-[#C400ED] focus:ring-[#C400ED]"
          placeholder="+216 XX XXX XXX"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="facebookUrl" className="text-[#29ED00]">
          <span className="flex items-center gap-2">
            <GlobeIcon size={16} />
            Facebook URL (Optional)
          </span>
        </Label>
        <Input
          id="facebookUrl"
          type="url"
          value={facebookUrl}
          onChange={(e) => setFacebookUrl(e.target.value)}
          className="bg-gray-900 border-gray-800 text-white pl-3 focus:border-[#C400ED] focus:ring-[#C400ED]"
          placeholder="https://facebook.com/yourusername"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="university" className="text-[#29ED00]">
          <span className="flex items-center gap-2">
            <BuildingIcon size={16} />
            University (Optional)
          </span>
        </Label>
        <Input
          id="university"
          type="text"
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
          className="bg-gray-900 border-gray-800 text-white pl-3 focus:border-[#C400ED] focus:ring-[#C400ED]"
          placeholder="ENIT, INSAT, FST, TEK-UP, etc."
        />
      </div>
      <div className="space-y-1">
        <Label className="text-[#29ED00]">
          <span className="flex items-center gap-2">
            <ShieldIcon size={16} />
            Have you participated in CTF competitions before?
          </span>
        </Label>
        <RadioGroup
          value={ctfExperience}
          onValueChange={setCtfExperience}
          className="flex gap-4 pt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="ctf-yes" className="border-[#29ED00]" />
            <Label htmlFor="ctf-yes" className="text-white">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="ctf-no" className="border-[#29ED00]" />
            <Label htmlFor="ctf-no" className="text-white">No</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="space-y-1">
        <Label className="text-[#29ED00]">
          <span className="flex items-center gap-2">
            <UsersIcon size={16} />
            Do you prefer to participate solo or as a team?
          </span>
        </Label>
        <RadioGroup
          value={teamPreference}
          onValueChange={setTeamPreference}
          className="flex gap-4 pt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="solo" id="team-solo" className="border-[#29ED00]" />
            <Label htmlFor="team-solo" className="text-white">Solo</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="team" id="team-team" className="border-[#29ED00]" />
            <Label htmlFor="team-team" className="text-white">Team</Label>
          </div>
        </RadioGroup>
      </div>
      <div className="space-y-1">
        <Label className="text-[#29ED00]">
          <span className="flex items-center gap-2">
            <MonitorIcon size={16} />
            How would you like to participate?
          </span>
        </Label>
        <RadioGroup
          value={participationMode}
          onValueChange={setParticipationMode}
          className="flex gap-4 pt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="online" id="mode-online" className="border-[#29ED00]" />
            <Label htmlFor="mode-online" className="text-white">Online</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="onsite" id="mode-onsite" className="border-[#29ED00]" />
            <Label htmlFor="mode-onsite" className="text-white">On-site</Label>
          </div>
        </RadioGroup>
      </div>
      {message && !existingProfile && (
        <div
          className={`p-3 rounded text-sm ${
            message.type === "error" ? "bg-red-900/30 text-red-300" : "bg-green-900/30 text-green-300"
          }`}
          role="alert"
        >
          {message.text}
        </div>
      )}
      <Button
        type="submit"
        disabled={loading || !!existingProfile}
        className="w-full bg-gradient-to-r from-[#29ED00] to-[#C400ED] hover:opacity-90 text-white font-bold"
        aria-label={loading ? "Processing..." : "Register for Securinets"}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="animate Pulse">Processing</span>
            <span className="inline-block animate-spin">⟳</span>
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <ShieldIcon size={16} />
            Register for Securinets
          </span>
        )}
      </Button>
      <div className="text-xs text-gray-500 text-center mt-4">
        <p>By registering, you agree to join the elite ranks of cybersecurity enthusiasts</p>
      </div>
    </form>
  )
}