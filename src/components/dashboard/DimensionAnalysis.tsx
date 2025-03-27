"use client"

import { Card } from "@/components/ui/card"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface KeyInsight {
  text: string
}

interface DimensionScore {
  name: string
  score: number
  rating: string
  description: string
  keyInsights: KeyInsight[]
}

interface DimensionAnalysisProps {
  dimensions: DimensionScore[]
}

export default function DimensionAnalysis({
  dimensions = [
    {
      name: "Market Opportunity",
      score: 85,
      rating: "Strong",
      description: "The global fitness app market is projected to grow at a CAGR of 21.1% from 2021 to 2028, reaching $14.7 billion by 2028. The pandemic has accelerated adoption of digital fitness solutions, creating a favorable environment for new entrants with innovative offerings.",
      keyInsights: [
        { text: "High growth rate in target demographic (25-45 year olds)" },
        { text: "Increasing willingness to pay for digital fitness solutions" },
        { text: "Shift from gym memberships to home-based fitness solutions" },
        { text: "Growing interest in personalized fitness experiences" }
      ]
    }
  ]
}: Partial<DimensionAnalysisProps>) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">8-Dimension Analysis</h2>
          <p className="text-sm text-muted-foreground">Comprehensive evaluation across key success factors</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 border rounded-lg p-1">
            <Button variant="default" size="sm" className="rounded-md">
              Radar
            </Button>
            <Button variant="ghost" size="sm" className="rounded-md">
              Bar
            </Button>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      {dimensions.map((dimension, index) => (
        <div key={index} className="border rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">{dimension.name}</h3>
            <div className="flex items-center gap-2">
              <div className="bg-gray-100 rounded-full h-[60px] w-[60px] flex items-center justify-center">
                <span className="text-2xl font-bold">{dimension.score}</span>
              </div>
              <div className="text-right">
                <p className="font-medium">Score</p>
                <p className="text-sm text-muted-foreground">{dimension.rating}</p>
              </div>
            </div>
          </div>

          <p className="text-muted-foreground mb-4">{dimension.description}</p>

          <div>
            <h4 className="font-medium mb-2">Key Insights</h4>
            <ul className="space-y-2">
              {dimension.keyInsights.map((insight, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                  <span className="text-sm text-muted-foreground">{insight.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </Card>
  )
} 