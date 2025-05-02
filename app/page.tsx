"use client";
import { useState, useEffect } from "react";
import CyberInterface from "@/components/cyber-interface";

export default function Home() {
  const [currentTime, setCurrentTime] = useState("");
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);

  // Set a deadline 4 hours from component mount
  const deadline = new Date();
  deadline.setHours(deadline.getHours()+4 );

  // Update current time every second in Africa/Tunis and check registration status
  useEffect(() => {
    const updateTime = () => {
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Africa/Tunis",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      const parts = formatter.formatToParts(new Date());
      const formatted = `${parts.find((p) => p.type === "year")!.value}-${parts.find((p) => p.type === "month")!.value}-${parts.find((p) => p.type === "day")!.value} ${parts.find((p) => p.type === "hour")!.value}:${parts.find((p) => p.type === "minute")!.value}:${parts.find((p) => p.type === "second")!.value}`;
      setCurrentTime(formatted);

      // Check if the deadline has passed
      if (new Date() >= deadline) {
        setIsRegistrationOpen(false);
      }
    };

    updateTime(); // Initial update
    const interval = setInterval(updateTime, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  if (isRegistrationOpen) {
    return <CyberInterface />;
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
                <div className="text-green-500 font-mono text-[0.55rem] sm:tracking-tight sm:text-sm">
                  SECURINETS::CTF_SYSTEM
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="text-green-500 font-mono text-[0.5rem] sm:text-xs">STATUS: OFFLINE</div>
                <div className="text-green-500 font-mono text-[0.5rem] sm:text-xs">
                  [{currentTime}]
                </div>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div className="relative p-4 sm:p-6 bg-black/50">
            <div className="space-y-6 bg-black p-6 sm:p-8 rounded-xl border-2 border-[#29ED00]/20 shadow-2xl shadow-to-green-200/10 max-w-xl sm:max-w-2xl mx-auto text-center">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#29ED00] to-green-200 bg-clip-text text-transparent">
                Registration Closed
              </h2>
              <p className="text-gray-300 text-md sm:text-lg">
                The registration for Securinets ENIT CTF is now closed. Good luck to all participants!
              </p>
              <p className="text-gray-500 text-xs sm:text-sm">
                Event starts at 10:00 AM (Africa/Tunis).
              </p>
            </div>
          </div>

          {/* Footer bar */}
          <div className="relative bg-black/80 rounded-b-lg p-2 sm:p-3 border-t border-green-500/30">
            <div className="flex items-center justify-between">
              <div className="text-green-500/70 font-mono text-[0.55rem] sm:text-xs">CONNECTION SECURE [TLS 1.3]</div>
              <div className="text-green-500/70 font-mono text-[0.55rem] sm:text-xs flex items-center">
                <span className="inline-block w-1.5 sm:w-2 h-1.5 sm:h-2 bg-green-500 rounded-full mr-1 sm:mr-2 animate-pulse"></span>
                ENIT 2025 // SYSTEM INACTIVE
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}