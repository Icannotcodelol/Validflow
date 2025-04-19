"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"
import { AnalysisLoadingState } from "@/components/AnalysisLoadingState"
import VerdictOverview from "@/components/dashboard/VerdictOverview"
import DimensionAnalysis from "@/components/dashboard/DimensionAnalysis"

interface KeyFinding {
  type: "strength" | "warning" | "weakness"
  text: string
}

interface DimensionScore {
  name: string
  score: number
  rating: string
  description: string
  keyInsights: { text: string }[]
}

interface AnalysisData {
  score: number
  verdict: string
  title: string
  summary: string
  findings: KeyFinding[]
  submissionDate: string
  dimensions: DimensionScore[]
  sections: Record<string, { status: string }>
}

export default function DashboardPage() {
  const router = useRouter()
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentSection, setCurrentSection] = useState<string>()
  const [completedSections, setCompletedSections] = useState<string[]>([])

  useEffect(() => {
    // In production, load from localStorage and track progress
    const result = localStorage.getItem('analysisResult')
    if (!result) {
      router.push('/validate')
      return
    }
    
    try {
      const parsed = JSON.parse(result)
      
      // Update progress based on sections status
      if (parsed.sections) {
        const completed: string[] = []
        let current: string | undefined
        
        Object.entries(parsed.sections).forEach(([key, section]: [string, any]) => {
          if (section?.status === 'completed') {
            completed.push(key)
          } else if (section?.status === 'pending' && !current) {
            current = key
          }
        })
        
        setCompletedSections(completed)
        setCurrentSection(current)
      }
      
      setAnalysisResult(parsed)
      setLoading(false)
    } catch (e) {
      console.error('Error parsing analysis result:', e)
      router.push('/validate')
    }
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-8 px-4 mt-16">
          <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <AnalysisLoadingState
              currentSection={currentSection}
              completedSections={completedSections}
            />
          </div>
        </main>
      </div>
    )
  }

  if (!analysisResult) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading analysis data...</h2>
          <p className="text-sm text-muted-foreground">Please wait while we prepare your results.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4 mt-16 space-y-12">
        <VerdictOverview
          score={analysisResult.score}
          verdict={analysisResult.verdict}
          title={analysisResult.title}
          summary={analysisResult.summary}
          findings={analysisResult.findings}
          submissionDate={analysisResult.submissionDate}
        />
        
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-6">Analysis Dimensions</h2>
            <DimensionAnalysis dimensions={analysisResult.dimensions} />
          </section>
        </div>
      </main>
    </div>
  )
} 