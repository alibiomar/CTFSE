"use client"

import { useState, useEffect } from "react"

interface TerminalEffectProps {
  text: string
  delay?: number
  typingSpeed?: number
}

export default function TerminalEffect({ text, delay = 0, typingSpeed = 50 }: TerminalEffectProps) {
  const [displayText, setDisplayText] = useState("")
  const [cursorVisible, setCursorVisible] = useState(true)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    // Initial delay before typing starts
    timeout = setTimeout(() => {
      setIsTyping(true)
      let currentIndex = 0

      const typingInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayText(text.substring(0, currentIndex + 1))
          currentIndex++
        } else {
          clearInterval(typingInterval)
          setIsTyping(false)
        }
      }, typingSpeed)

      return () => clearInterval(typingInterval)
    }, delay)

    return () => clearTimeout(timeout)
  }, [text, delay, typingSpeed])

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 500)

    return () => clearInterval(cursorInterval)
  }, [])

  return (
    <span className="inline-block">
      {displayText}
      {(isTyping || cursorVisible) && <span className="text-[#29ED00] animate-pulse">_</span>}
    </span>
  )
}
