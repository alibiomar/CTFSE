import RegistrationForm from "@/components/registration-form"
import TerminalEffect from "@/components/terminal-effect"

export default function Home() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 text-[#29ED00] tracking-tight">
            <TerminalEffect text="SECURINETS ENIT" />
          </h1>
          <p className="text-[#C400ED] text-xl">
            <TerminalEffect text="Cybersecurity Club" delay={1500} />
          </p>
          <div className="mt-4 text-gray-400 text-sm">
            <TerminalEffect
              text="// Access granted to registration portal"
              delay={2500}
            />
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#29ED00] to-[#C400ED] rounded-lg blur opacity-75"></div>
          <div className="relative bg-black border border-gray-800 rounded-lg p-6">
            <RegistrationForm />
          </div>
        </div>

        <footer className="mt-6 text-gray-500 text-xs text-center">
          <p>
            &lt;encrypted&gt; Securinets ENIT - Defending the digital frontier
            &lt;/encrypted&gt;
          </p>
        </footer>
      </div>
    </main>
  )
}