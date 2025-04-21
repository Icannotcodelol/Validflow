"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { Analysis } from "@/types/analysis"
import { AnalysisCard } from "@/components/dashboard/AnalysisCard"

export default function DashboardPage() {
  const router = useRouter()
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const response = await fetch('/api/analyses', {
          credentials: 'include',
        })

        if (!response.ok) {
          if (response.status === 401) {
            router.push('/signin')
            return
          }
          throw new Error('Failed to fetch analyses')
        }

        const data = await response.json()
        if (data.success) {
          setAnalyses(data.analyses)
        } else {
          throw new Error(data.message || 'Failed to fetch analyses')
        }
      } catch (error) {
        console.error('Error fetching analyses:', error)
        setError(error instanceof Error ? error.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalyses()
  }, [router])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4 mt-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Your Analyses</h1>
          <Button onClick={() => router.push('/validate')}>
            <Plus className="w-4 h-4 mr-2" />
            New Analysis
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading your analyses...</span>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-red-500">{error}</div>
          </div>
        ) : analyses.length === 0 ? (
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">No analyses yet</h2>
            <p className="text-muted-foreground mb-4">
              Start by creating your first analysis
            </p>
            <Button onClick={() => router.push('/validate')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Analysis
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {analyses.map((analysis) => (
              <AnalysisCard key={analysis.id} analysis={analysis} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
} 