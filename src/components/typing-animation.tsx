"use client"

import { useEffect, useState, useCallback } from "react"

interface TypingAnimationProps {
  staticText?: string
  ideas: string[]
  typingSpeed?: number
  deleteSpeed?: number
  pauseDuration?: number
  className?: string
}

/**
 * TypingAnimation component that creates a dynamic typing effect
 * showing different product ideas in sequence.
 */
export function TypingAnimation({
  staticText = "Validate my",
  ideas,
  typingSpeed = 50, // Speed of typing each character
  deleteSpeed = 30, // Speed of deleting each character
  pauseDuration = 2000, // Duration to show completed text (2 seconds)
  className = "",
}: TypingAnimationProps) {
  const [displayText, setDisplayText] = useState("")
  const [currentIdeaIndex, setCurrentIdeaIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  // Calculate the next animation step and return appropriate delay
  const animateText = useCallback(() => {
    // Ensure we have ideas to display
    if (!ideas || ideas.length === 0) {
      console.error('No ideas provided to TypingAnimation')
      return typingSpeed
    }

    const currentIdea = ideas[currentIdeaIndex]
    if (!currentIdea) {
      console.error('No idea found at index:', currentIdeaIndex)
      return typingSpeed
    }

    if (isDeleting) {
      // Deleting text
      if (displayText === "") {
        // Move to next idea when current is fully deleted
        setIsDeleting(false)
        setCurrentIdeaIndex((prev) => (prev + 1) % ideas.length)
        return typingSpeed
      }
      return deleteSpeed
    } else {
      // Typing text
      if (displayText === currentIdea) {
        // Pause when idea is fully typed
        setIsPaused(true)
        setIsDeleting(true)
        return pauseDuration
      }
      return typingSpeed
    }
  }, [currentIdeaIndex, displayText, isDeleting, isPaused, ideas, typingSpeed, deleteSpeed, pauseDuration])

  // Main animation effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!ideas || ideas.length === 0) return

      if (isPaused) {
        setIsPaused(false)
        return
      }

      const currentIdea = ideas[currentIdeaIndex]
      if (!currentIdea) return

      if (isDeleting) {
        // Delete one character at a time
        setDisplayText(displayText.slice(0, -1))
      } else {
        // Type one character at a time
        setDisplayText(currentIdea.slice(0, displayText.length + 1))
      }
    }, animateText())

    return () => clearTimeout(timer)
  }, [displayText, currentIdeaIndex, isDeleting, isPaused, ideas, animateText])

  return (
    <div className={className} aria-live="polite" role="status">
      <div className="flex flex-col leading-[1.15] min-h-[1.2em]">
        <div className="text-white font-bold">{staticText}</div>
        <div 
          className="text-[#9e3a8c] font-bold min-h-[1.2em] whitespace-pre-wrap mt-1"
          aria-label={`Current idea: ${displayText}`}
        >
          {displayText}
          <span className="animate-pulse ml-0.5 opacity-75">|</span>
        </div>
      </div>
    </div>
  )
} 