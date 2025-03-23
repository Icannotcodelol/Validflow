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

export function TypingAnimation({
  staticText = "Validate my",
  ideas,
  typingSpeed = 50,
  deleteSpeed = 30,
  pauseDuration = 720,
  className = "",
}: TypingAnimationProps) {
  const [displayText, setDisplayText] = useState("")
  const [currentIdeaIndex, setCurrentIdeaIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const animateText = useCallback(() => {
    const currentIdea = ideas[currentIdeaIndex]
    
    if (isDeleting) {
      // Deleting text
      if (displayText === "") {
        setIsDeleting(false)
        setCurrentIdeaIndex((prev) => (prev + 1) % ideas.length)
        return typingSpeed
      }
      // Only start deleting after the pause
      if (isPaused) {
        return pauseDuration
      }
      return deleteSpeed
    } else {
      // Typing text
      if (displayText === currentIdea) {
        // Finished typing current idea
        setIsPaused(true)
        setIsDeleting(true)
        return pauseDuration
      }
      return typingSpeed
    }
  }, [currentIdeaIndex, displayText, isDeleting, isPaused, ideas, typingSpeed, deleteSpeed, pauseDuration])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isPaused) {
        setIsPaused(false)
        return
      }

      const currentIdea = ideas[currentIdeaIndex]
      if (isDeleting) {
        setDisplayText(displayText.slice(0, -1))
      } else {
        setDisplayText(currentIdea.slice(0, displayText.length + 1))
      }
    }, animateText())

    return () => clearTimeout(timer)
  }, [displayText, currentIdeaIndex, isDeleting, isPaused, ideas, animateText])

  return (
    <div className={className} aria-live="polite">
      <div className="flex flex-col leading-[1.15]">
        <div className="text-white">{staticText}</div>
        <div className="text-[#121628]">{displayText}</div>
      </div>
    </div>
  )
} 