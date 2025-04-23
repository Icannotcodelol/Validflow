import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function PromotionalBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="w-full bg-gradient-to-r from-primary/90 to-primary text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-semibold">🎉 Limited Time Offer:</span>
            <span>New accounts get their first analysis completely free!</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-white/80 hover:bg-white/10"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 