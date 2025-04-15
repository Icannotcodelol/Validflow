"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"
import ExecutiveSummary from "@/components/dashboard/ExecutiveSummary"
import RadarChartSection from "@/components/dashboard/RadarChartSection"
import StrengthsWeaknesses from "@/components/dashboard/StrengthsWeaknesses"
import MarketOpportunity from "@/components/dashboard/MarketOpportunity"
import VCActivity from "@/components/dashboard/VCActivity"
import ConsumerBehavior from "@/components/dashboard/ConsumerBehavior"
import CompetitiveLandscape from "@/components/dashboard/CompetitiveLandscape"
import FinancialProjections from "@/components/dashboard/FinancialProjections"
import GoToMarketStrategy from "@/components/dashboard/GoToMarketStrategy"
import RiskAssessment from "@/components/dashboard/RiskAssessment"
import BarriersToEntry from "@/components/dashboard/BarriersToEntry"
import { sampleAnalysisResult } from "@/utils/sample-data"
import { AnalysisResult } from "@/types/dashboard"
import { AnalysisLoadingState } from "@/components/AnalysisLoadingState"

export default function DashboardPage() {
  const router = useRouter()
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentSection, setCurrentSection] = useState<string>()
  const [completedSections, setCompletedSections] = useState<string[]>([])

  useEffect(() => {
    // In development, use sample data
    if (process.env.NODE_ENV === 'development') {
      const result: AnalysisResult = {
        marketResearch: sampleAnalysisResult.marketResearch,
        analysis: sampleAnalysisResult.analysis,
        content: sampleAnalysisResult.content,
        sections: sampleAnalysisResult.sections
      }
      setAnalysisResult(result)
      setLoading(false)
      return
    }

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

  const { content, marketResearch, analysis } = analysisResult

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4 mt-16 space-y-12">
        <ExecutiveSummary data={content} />
        
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-6">Analysis</h2>
            <RadarChartSection data={analysis} />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">Strengths & Weaknesses</h2>
            <StrengthsWeaknesses data={analysis} />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">Market</h2>
            <MarketOpportunity data={marketResearch} />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">Barriers to Entry</h2>
            <BarriersToEntry data={marketResearch.marketDynamics} />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">Insights</h2>
            <div className="space-y-8">
              <ConsumerBehavior data={marketResearch.demographics} />
              <VCActivity data={{ trends: marketResearch.trends, vcActivity: marketResearch.vcActivity }} />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">Competition</h2>
            <CompetitiveLandscape data={marketResearch.competitors} />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">Financial</h2>
            <FinancialProjections data={analysis.detailedAnalysis.financialAnalysis} />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">Go-To-Market</h2>
            <GoToMarketStrategy data={analysis.detailedAnalysis.implementationPlan} />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">Risks</h2>
            <RiskAssessment data={analysis.detailedAnalysis.riskAssessment} />
          </section>
        </div>
      </main>
    </div>
  )
} 