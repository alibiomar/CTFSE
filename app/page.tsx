import RegistrationForm from "@/components/registration-form"
import TerminalEffect from "@/components/terminal-effect"
import GlitchLogo from "@/components/glitch-logo"

export default function Home() {
  return (
    <main className="min-h-screen bg-black bg-grid-[#29ED00]/10 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl">
        <div className="mb-12 text-center space-y-6">
          <div className="relative group">
            <GlitchLogo
              src="/logo.png"
              alt="Securinets ENIT Logo"
              width={180}
              height={180}
              className="mx-auto mb-4 transition-transform duration-500 repeat-infinite group-hover:scale-105 group-hover:rotate-1"
            />
            <div className="absolute inset-0 mx-auto w-48 h-48 blur-2xl bg-[#29ED00]/20 -z-10 group-hover:bg-[#C400ED]/30 transition-colors duration-500" />
          </div>

          <div className="space-y-3">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#29ED00] to-[#C400ED] tracking-tighter">
              <TerminalEffect text="SECURINETS ENIT" delay={500} />
            </h1>
            <div className="text-[#29ED00] text-sm font-mono opacity-80">
              <TerminalEffect
                text="[root@enit ~]$ ./init_registration_portal.sh"
                delay={1000}
                typingSpeed={50}
              />
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-[#29ED00] to-[#C400ED] rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-300 animate-pulse" />
          <div className="relative bg-gradient-to-br from-black to-gray-900 border-2 border-[#29ED00]/20 rounded-2xl p-1 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/circuit-board.svg')] opacity-10" />
            <div className="relative bg-black backdrop-blur-sm rounded-xl p-6 lg:p-8">
              <RegistrationForm />
            </div>
          </div>
        </div>

        <footer className="mt-8 text-center">
          <p className="text-sm font-mono text-transparent bg-gradient-to-r from-[#29ED00] to-[#C400ED] bg-clip-text animate-pulse">
            &lt;secure encrypted channel&gt; 

            <span className="mx-2">▮</span>
            ENIT 2025
            <span className="mx-2">▮</span>
            &lt;/channel&gt;
          </p>
        </footer>
      </div>

      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-48 h-48 bg-[#29ED00]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-[#C400ED]/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
    </main>
  )
}