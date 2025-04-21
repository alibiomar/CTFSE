"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Loader2,
  UserIcon,
  MailIcon,
  LockIcon,
  PhoneIcon,
  UsersIcon,
  BuildingIcon,
  ShieldIcon,
  GlobeIcon,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { registerUser, checkEmailExists } from "@/app/actions";
import GlitchLogo from "@/components/glitch-logo";

// Utility function for debouncing
function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// RegistrationForm component moved outside CyberInterface
function RegistrationForm({
  handleSubmit,
  fullName,
  setFullName,
  email,
  setEmail,
  password,
  setPassword,
  university,
  setUniversity,
  phoneNumber,
  setPhoneNumber,
  facebookUrl,
  setFacebookUrl,
  ctfExperience,
  setCtfExperience,
  teamPreference,
  setTeamPreference,
  participationMode,
  setParticipationMode,
  formLoading,
  message,
  checkingEmail,
  handleEmailBlur,
}: {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  fullName: string;
  setFullName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  university: string;
  setUniversity: (value: string) => void;
  phoneNumber: string;
  setPhoneNumber: (value: string) => void;
  facebookUrl: string;
  setFacebookUrl: (value: string) => void;
  ctfExperience: string;
  setCtfExperience: (value: string) => void;
  teamPreference: string;
  setTeamPreference: (value: string) => void;
  participationMode: string;
  setParticipationMode: (value: string) => void;
  formLoading: boolean;
  message: { text: string; type: "error" | "success" } | null;
  checkingEmail: boolean;
  handleEmailBlur: () => void;
}) {
  return (
    <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 max-w-xl sm:max-w-2xl mx-auto">
      {/* Personal Information Section */}
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 bg-black rounded-xl border border-[#29ED00]/10">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <UserIcon className="text-[#29ED00] w-5 h-5 sm:w-6 sm:h-6" />
          <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#29ED00] to-green-200 bg-clip-text text-transparent">
            Personal Information
          </h2>
        </div>

        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-gray-400 text-xs sm:text-sm">
              Full Name *
            </Label>
            <div className="relative">
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="pl-8 sm:pl-10 bg-black border-gray-700 focus:border-[#29ED00] focus:ring-1 focus:ring-[#29ED00] text-sm sm:text-base"
                placeholder="John Doe"
              />
              <UserIcon className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-400 text-xs sm:text-sm">
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
                className="pl-8 sm:pl-10 bg-black border-gray-700 focus:border-[#29ED00] focus:ring-1 focus:ring-[#29ED00] text-sm sm:text-base"
                placeholder="your@email.com"
              />
              <MailIcon className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              {checkingEmail && (
                <span className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-[0.65rem] sm:text-xs text-gray-400 animate-pulse">
                  Checking...
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-400 text-xs sm:text-sm">
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
                className="pl-8 sm:pl-10 bg-black border-gray-700 focus:border-[#29ED00] focus:ring-1 focus:ring-[#29ED00] text-sm sm:text-base"
                placeholder="••••••••••••"
              />
              <LockIcon className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </div>
            <p className="text-[0.65rem] sm:text-xs text-gray-500">Minimum 6 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="university" className="text-gray-400 text-xs sm:text-sm">
              University
            </Label>
            <div className="relative">
              <Input
                id="university"
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="pl-8 sm:pl-10 bg-black border-gray-700 focus:border-[#29ED00] focus:ring-1 focus:ring-[#29ED00] text-sm sm:text-base"
                placeholder="ENIT, INSAT, FST, etc."
              />
              <BuildingIcon className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 bg-black rounded-xl border border-[#29ED00]/10">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <GlobeIcon className="text-[#29ED00] w-5 h-5 sm:w-6 sm:h-6" />
          <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#29ED00] to-green-200 bg-clip-text text-transparent">
            Contact Information
          </h2>
        </div>

        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-gray-400 text-xs sm:text-sm">
              Phone Number
            </Label>
            <div className="relative">
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="pl-8 sm:pl-10 bg-black border-gray-700 focus:border-[#29ED00] focus:ring-1 focus:ring-[#29ED00] text-sm sm:text-base"
                placeholder="+216 XX XXX XXX"
              />
              <PhoneIcon className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4 sm:h-[18px] sm:w-[18px]" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="facebookUrl" className="text-gray-400 text-xs sm:text-sm">
              Facebook Profile
            </Label>
            <div className="relative">
              <Input
                id="facebookUrl"
                type="url"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                className="pl-8 sm:pl-10 bg-black border-gray-700 focus:border-[#29ED00] focus:ring-1 focus:ring-[#29ED00] text-sm sm:text-base"
                placeholder="https://facebook.com/username"
              />
              <UsersIcon className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </div>
          </div>
        </div>
      </div>

      {/* Participation Preferences Section */}
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 bg-black rounded-xl border border-[#29ED00]/10">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <ShieldIcon className="text-[#29ED00] w-5 h-5 sm:w-6 sm:h-6" />
          <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#29ED00] to-green-200 bg-clip-text text-transparent">
            Participation Preferences
          </h2>
        </div>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-400 text-xs sm:text-sm">CTF Experience</Label>
              <RadioGroup
                value={ctfExperience}
                onValueChange={setCtfExperience}
                className="flex gap-3 sm:gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="yes"
                    id="ctf-yes"
                    className="h-4 sm:h-5 w-4 sm:w-5 border-gray-600 text-[#29ED00]"
                  />
                  <Label htmlFor="ctf-yes" className="text-gray-300 text-xs sm:text-sm">
                    Yes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="no"
                    id="ctf-no"
                    className="h-4 sm:h-5 w-4 sm:w-5 border-gray-600 text-[#29ED00]"
                  />
                  <Label htmlFor="ctf-no" className="text-gray-300 text-xs sm:text-sm">
                    No
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-400 text-xs sm:text-sm">Team Preference</Label>
              <RadioGroup
                value={teamPreference}
                onValueChange={setTeamPreference}
                className="flex gap-3 sm:gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="solo"
                    id="team-solo"
                    className="h-4 sm:h-5 w-4 sm:w-5 border-gray-600 text-[#29ED00]"
                  />
                  <Label htmlFor="team-solo" className="text-gray-300 text-xs sm:text-sm">
                    Solo
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="team"
                    id="team-team"
                    className="h-4 sm:h-5 w-4 sm:w-5 border-gray-600 text-[#29ED00]"
                  />
                  <Label htmlFor="team-team" className="text-gray-300 text-xs sm:text-sm">
                    Team
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-400 text-xs sm:text-sm">Participation Mode</Label>
              <RadioGroup
                value={participationMode}
                onValueChange={setParticipationMode}
                className="flex flex-col gap-2 sm:gap-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="online"
                    id="mode-online"
                    className="h-4 sm:h-5 w-4 sm:w-5 border-gray-600 text-[#29ED00]"
                  />
                  <Label htmlFor="mode-online" className="text-gray-300 text-xs sm:text-sm">
                    Online Participation
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="onsite"
                    id="mode-onsite"
                    className="h-4 sm:h-5 w-4 sm:w-5 border-gray-600 text-[#29ED00]"
                  />
                  <Label htmlFor="mode-onsite" className="text-gray-300 text-xs sm:text-sm">
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
          className={`p-3 sm:p-4 rounded-lg border ${
            message.type === "error"
              ? "bg-red-900/20 border-red-500/30 text-red-300"
              : "bg-green-900/20 border-green-500/30 text-green-300"
          }`}
        >
          <div className="flex items-center gap-2">
            <ShieldIcon className="h-4 sm:h-5 w-4 sm:w-5" />
            <span className="text-xs sm:text-sm">{message.text}</span>
          </div>
        </div>
      )}

      <Button
        type="submit"
        disabled={formLoading}
        className="w-full bg-gradient-to-r from-[#29ED00] to-green-200 hover:from-[#29ED00]/90 hover:to-green-200/90 text-white font-bold py-4 sm:py-6 text-sm sm:text-lg transition-all duration-300 hover:scale-[1.02]"
      >
        {formLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 sm:h-5 w-4 sm:w-5 animate-spin" />
            <span>Processing Registration...</span>
          </div>
        ) : (
          <span className="flex items-center gap-2">
            <ShieldIcon className="h-4 sm:h-5 w-4 sm:w-5" />
            Join Our CTF
          </span>
        )}
      </Button>

      <p className="text-center text-[0.65rem] sm:text-sm text-gray-500">
        By registering, you agree to our terms and join our Securinets community
      </p>
    </form>
  );
}

// Self-contained component that includes both the interface and registration form
export default function CyberInterface() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [university, setUniversity] = useState("");
  const [ctfExperience, setCtfExperience] = useState("no");
  const [teamPreference, setTeamPreference] = useState("solo");
  const [participationMode, setParticipationMode] = useState("online");
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);
  const [existingProfile, setExistingProfile] = useState<any>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);

  // System metrics state
  const [cpuUsage, setCpuUsage] = useState(0);
  const [memoryUsage, setMemoryUsage] = useState("N/A");
  const [ping, setPing] = useState(0);
  // State for gauge animation
  const [gaugeHeight, setGaugeHeight] = useState(cpuUsage);

  // Simulating loading sequence
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + Math.random() * 5;
          if (next >= 100) {
            clearInterval(interval);
            setTimeout(() => setLoading(false), 500);
            return 100;
          }
          return next;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [loading]);

  // Measure system metrics
  useEffect(() => {
    // Approximate CPU usage
    const measureCpuUsage = () => {
      const start = performance.now();
      // Simulate a light workload
      let i = 0;
      while (i < 1000000) i++;
      const end = performance.now();
      const duration = end - start;
      // Normalize to a percentage (this is a rough approximation)
      const usage = Math.min(100, Math.round((duration / 10) * navigator.hardwareConcurrency));
      setCpuUsage(usage);
      setGaugeHeight(usage); // Sync gauge height with CPU usage
    };

    // Measure memory usage (Chrome-based browsers only)
    const measureMemoryUsage = () => {
      if ("memory" in performance) {
        const memory = (performance as any).memory;
        const used = memory.usedJSHeapSize / (1024 * 1024); // Convert to MB
        const total = memory.totalJSHeapSize / (1024 * 1024); // Convert to MB
        setMemoryUsage(`${used.toFixed(1)} MB / ${total.toFixed(1)} MB`);
      } else {
        setMemoryUsage("N/A");
      }
    };

    // Measure ping
    const measurePing = async () => {
      try {
        const start = performance.now();
        await fetch("https://www.google.com/favicon.ico", { mode: "no-cors" });
        const end = performance.now();
        setPing(Math.round(end - start));
      } catch {
        setPing(0); // Fallback if request fails
      }
    };

    // Initial measurements
    measureCpuUsage();
    measureMemoryUsage();
    measurePing();

    // Update metrics every 5 seconds
    const interval = setInterval(() => {
      measureCpuUsage();
      measureMemoryUsage();
      measurePing();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleEmailBlur = useCallback(
    debounce(async () => {
      if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setCheckingEmail(true);
        try {
          const result = await checkEmailExists(email);
          if (result.exists) {
            setExistingProfile(result.profile);
            setMessage({ text: "You are already registered with this email.", type: "error" });
          } else {
            setExistingProfile(null);
            setMessage(null);
          }
        } catch (error) {
          setMessage({ text: "Error checking email availability", type: "error" });
        } finally {
          setCheckingEmail(false);
        }
      }
    }, 500),
    [email]
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage(null);

    // Validation
    if (!fullName.trim()) {
      setMessage({ text: "Full name is required", type: "error" });
      setFormLoading(false);
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage({ text: "Valid email is required", type: "error" });
      setFormLoading(false);
      return;
    }
    if (!password || password.length < 6) {
      setMessage({ text: "Password must be at least 6 characters", type: "error" });
      setFormLoading(false);
      return;
    }
    if (phoneNumber && !/^\+?\d{8,}$/.test(phoneNumber)) {
      setMessage({ text: "Invalid phone number format", type: "error" });
      setFormLoading(false);
      return;
    }
    if (facebookUrl && !/^https?:\/\/(www\.)?facebook\.com\/.+$/.test(facebookUrl)) {
      setMessage({ text: "Please enter a valid Facebook URL", type: "error" });
      setFormLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("fullName", fullName);
      formData.append("phoneNumber", phoneNumber);
      formData.append("facebookUrl", facebookUrl);
      formData.append("university", university);
      formData.append("ctfExperience", ctfExperience);
      formData.append("teamPreference", teamPreference);
      formData.append("participationMode", participationMode);

      const result = await registerUser(formData);

      if (result.success) {
        setMessage({
          text: result.message || "Registration successful! Check your email.",
          type: "success",
        });

        // Animate gauge to 100% on success
        setGaugeHeight(100);
        // Reset gauge to cpuUsage after 2 seconds
        setTimeout(() => {
          setGaugeHeight(cpuUsage);
        }, 2000);

        // Reset form
        setEmail("");
        setPassword("");
        setFullName("");
        setPhoneNumber("");
        setFacebookUrl("");
        setUniversity("");
        setCtfExperience("no");
        setTeamPreference("solo");
        setParticipationMode("online");
      } else {
        if (result.alreadyRegistered) {
          setExistingProfile(result.profile);
          setMessage({
            text: "You are already registered with this email",
            type: "error",
          });
        } else {
          setMessage({
            text: result.error || "Registration failed. Please try again.",
            type: "error",
          });
        }
      }
    } catch (error: any) {
      setMessage({
        text: error.message || "An unexpected error occurred",
        type: "error",
      });
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl text-center">
                <div className="  flex items-center justify-center">
                  <GlitchLogo
                    src="/logo.png"
                    alt="Securinets ENIT Logo"
                    width={300}
                    height={300}
                    className="mx-auto transition-transform duration-500 repeat-infinite group-hover:scale-105 group-hover:rotate-1 z-40"
                  />
          </div>

          <div className="text-green-500 text-xs sm:text-sm font-mono mb-4">
            [system] Initializing secure environment...
          </div>

          <div className="w-full bg-black border border-green-500/50 rounded-full h-3 sm:h-4 mb-6">
            <div
              className="bg-gradient-to-r from-green-500 to-green-200 h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="text-green-400 text-[0.65rem] sm:text-xs font-mono">
            {Math.floor(progress)}% ■ Establishing encrypted connection
          </div>
        </div>
      </div>
    );
  }

  // Existing Profile View
  if (existingProfile) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl relative">
          <div className="absolute inset-0 bg-green-900/10 rounded-xl overflow-hidden">
            <div className="absolute top-0 left-1/4 w-32 sm:w-48 h-32 sm:h-48 bg-green-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-40 sm:w-64 h-40 sm:h-64 bg-to-green-200/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative border-2 border-green-500/30 rounded-xl p-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-black to-green-950 opacity-90"></div>

            <div className="relative bg-black/80 rounded-t-lg p-3 sm:p-4 border-b border-green-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 sm:w-3 h-2 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="text-green-500 font-mono text-xs sm:text-sm">SECURINETS::CTF_SYSTEM</div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="text-green-500 font-mono text-[0.65rem] sm:text-xs">STATUS: ONLINE</div>
                  <div className="text-green-500 font-mono text-[0.65rem] sm:text-xs">
                    [{new Date().toISOString().split("T")[0]}]
                  </div>
                </div>
              </div>
            </div>

            <div className="relative p-4 sm:p-6 bg-black/50">
              <div className="space-y-6 bg-black p-6 sm:p-8 rounded-xl border-2 border-[#29ED00]/20 shadow-2xl shadow-to-green-200/10 max-w-xl sm:max-w-2xl mx-auto">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-3 sm:p-4 bg-[#29ED00]/10 rounded-full border border-[#29ED00]/30">
                    <UserCheck size={24} className="text-[#29ED00] animate-pulse sm:h-8 sm:w-8" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#29ED00] to-green-200 bg-clip-text text-transparent">
                    Already Registered
                  </h3>
                </div>

                <div className="space-y-4 text-gray-300">
                  <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-800/30 rounded-lg">
                    <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-1 text-[#29ED00]" />
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-[#29ED00]">Full Name</p>
                      <p className="text-sm sm:text-base">{existingProfile.full_name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-800/30 rounded-lg">
                    <MailIcon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 mt-1 text-[#29ED00]" />
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-[#29ED00]">Email</p>
                      <p className="text-sm sm:text-base">{existingProfile.email}</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setExistingProfile(null);
                    setMessage(null);
                    setEmail("");
                  }}
                  className="w-full bg-to-green-200 hover:bg-to-green-200/90 transition-transform duration-200 hover:scale-[1.02] text-sm sm:text-base py-2 sm:py-3"
                >
                  Use Different Email
                </Button>
              </div>
            </div>

            <div className="relative bg-black/80 rounded-b-lg p-2 sm:p-3 border-t border-green-500/30">
              <div className="flex items-center justify-between">
                <div className="text-green-500/70 font-mono text-[0.65rem] sm:text-xs">CONNECTION SECURE [TLS 1.3]</div>
                <div className="text-green-500/70 font-mono text-[0.65rem] sm:text-xs flex items-center">
                  <span className="inline-block w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-500 rounded-full mr-1 sm:mr-2 animate-pulse"></span>
                  ENIT 2025 // SYSTEM ACTIVE
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-4xl relative">
        {/* Circuit board background with glow effect */}
        <div className="absolute inset-0 bg-green-900/10 rounded-xl overflow-hidden">
          <div className="absolute top-0 left-1/4 w-32 sm:w-48 h-32 sm:h-48 bg-green-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-40 sm:w-64 h-40 sm:h-64 bg-to-green-200/10 rounded-full blur-3xl"></div>
        </div>

        {/* Main interface container */}
        <div className="relative border-2 border-green-500/30 rounded-xl p-1 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black to-green-950 opacity-90"></div>

          {/* Header bar */}
          <div className="relative bg-black/80 rounded-t-lg p-3 sm:p-4 border-b border-green-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 sm:w-3 h-2 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="text-green-500 font-mono text-[0.65rem] sm:tracking-tight sm:text-sm">
                  SECURINETS::CTF_SYSTEM
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="text-green-500 font-mono text-[0.55rem] sm:text-xs">STATUS: ONLINE</div>
                <div className="text-green-500 font-mono text-[0.55rem] sm:text-xs">
                  [{new Date().toISOString().split("T")[0]}]
                </div>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="relative grid grid-cols-1 md:grid-cols-5 gap-3 sm:gap-4 p-4 sm:p-6 bg-black/50">
            {/* Left section with sphere */}
            <div className="md:col-span-1 flex flex-col items-center justify-start">
              <div className="relative w-36 sm:w-40 h-24 sm:h-32">
                <div className="absolute inset-0 flex items-center justify-center">
                  <GlitchLogo
                    src="/logo.png"
                    alt="Securinets ENIT Logo"
                    width={300}
                    height={300}
                    className="mx-auto transition-transform duration-500 repeat-infinite group-hover:scale-105 group-hover:rotate-1 z-40"
                  />
                </div>
              </div>

              <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3 w-full">
                <div className="h-1.5 sm:h-2 bg-green-500/30 rounded-full w-full"></div>
                <div className="h-1.5 sm:h-2 bg-green-500/20 rounded-full w-3/4"></div>
                <div className="h-1.5 sm:h-2 bg-green-500/10 rounded-full w-1/2"></div>
              </div>

              <div className="mt-4 sm:mt-6 w-full font-medium text-[0.65rem] sm:text-xs text-green-500/70">
                SYSTEM METRICS
                <div className="mt-1 sm:mt-2 font-mono flex flex-col gap-0.5 sm:gap-1 w-full">
                  <div className="text-left pr-1 sm:pr-2">CPU:</div>
                  <div className="text-center">{cpuUsage}%</div>
                  <div className="text-left pr-1 sm:pr-2">MEM:</div>
                  <div className="text-center">{memoryUsage}</div>
                  <div className="text-left pr-1 sm:pr-2">PING:</div>
                  <div className="text-center">{ping === 0 ? "N/A" : `${ping}ms`}</div>
                </div>
              </div>
            </div>

            {/* Right section with form and text */}
            <div className="md:col-span-4 space-y-3 sm:space-y-4">
              <div className="bg-black/70 p-3 sm:p-4 rounded-lg border border-green-500/20">
                <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-500 to-green-200 bg-clip-text text-transparent mb-2 sm:mb-3">
                  SECURINETS ENIT CTF REGISTRATION
                </h2>
                <p className="text-green-400 text-xs sm:text-sm mb-3 sm:mb-4">
                  Complete the registration form to participate in the elite cybersecurity challenge. Join the ranks of
                  security experts defending digital infrastructure.
                </p>
                <div className="h-1.5 sm:h-2 bg-gradient-to-r from-green-500 to-green-200 rounded-full w-full mb-3 sm:mb-4"></div>

                {/* Registration form embedded */}
                <div className="mt-4 sm:mt-6">
                  <RegistrationForm
                    handleSubmit={handleSubmit}
                    fullName={fullName}
                    setFullName={setFullName}
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    university={university}
                    setUniversity={setUniversity}
                    phoneNumber={phoneNumber}
                    setPhoneNumber={setPhoneNumber}
                    facebookUrl={facebookUrl}
                    setFacebookUrl={setFacebookUrl}
                    ctfExperience={ctfExperience}
                    setCtfExperience={setCtfExperience}
                    teamPreference={teamPreference}
                    setTeamPreference={setTeamPreference}
                    participationMode={participationMode}
                    setParticipationMode={setParticipationMode}
                    formLoading={formLoading}
                    message={message}
                    checkingEmail={checkingEmail}
                    handleEmailBlur={handleEmailBlur}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer bar */}
          <div className="relative bg-black/80 rounded-b-lg p-2 sm:p-3 border-t border-green-500/30">
            <div className="flex items-center justify-between">
              <div className="text-green-500/70 font-mono text-[0.65rem] sm:text-xs">CONNECTION SECURE [TLS 1.3]</div>
              <div className="text-green-500/70 font-mono text-[0.65rem] sm:text-xs flex items-center">
                <span className="inline-block w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-500 rounded-full mr-1 sm:mr-2 animate-pulse"></span>
                ENIT 2025 // SYSTEM ACTIVE
              </div>
            </div>
          </div>
        </div>

        {/* Side meters/gauges */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 transform translate-x-full hidden lg:flex flex-col h-48 sm:h-64 w-5 sm:w-6 space-y-2">
          <div className="bg-black/70 border border-green-500/30 rounded-lg flex-1 w-full relative overflow-hidden">
            <div
              className="absolute bottom-0 w-full bg-green-500/50 transition-all duration-500"
              style={{ height: `${gaugeHeight}%` }}
            ></div>
            <div className="absolute inset-0 flex flex-col justify-between px-1 py-2">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-px w-full bg-green-500/30"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}