import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CTF - Securinets ENIT",
  description: "Join the elite ranks of cybersecurity enthusiasts at ENIT.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" style={{ scrollBehavior: "smooth" }}>
      <head>
      <link rel="icon" href="/favicon.ico" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
