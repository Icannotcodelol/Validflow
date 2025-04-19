"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/components/providers/SessionProvider"
import Header from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface Analysis {
  id: string
  created_at: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  sections: {
    executiveSummary?: {
      status: string
      title?: string
      verdict?: string
      score?: number
    }
    formData?: {
      description: string
      industry: string
    }
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = useSupabase()
  const [loading, setLoading] = useState(true)
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.push('/signin?redirectTo=/dashboard')
          return
        }

        const { data, error } = await supabase
          .from('analyses')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })

        if (error) throw error

        setAnalyses(data || [])
      } catch (error) {
        console.error('Error fetching analyses:', error)
        setError(error instanceof Error ? error.message : 'Failed to load analyses')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalyses()
  }, [supabase, router])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>
      case 'processing':
        return <Badge className="bg-blue-500">Processing</Badge>
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-8 px-4 mt-16">
          <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4 mt-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Analyses</h1>
          <Button onClick={() => router.push('/validate')}>
            New Analysis
          </Button>
        </div>

        {error ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-red-500">{error}</div>
            </CardContent>
          </Card>
        ) : analyses.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">No analyses yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by creating your first analysis
                </p>
                <Button onClick={() => router.push('/validate')}>
                  Create Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {analyses.map((analysis) => (
              <Card key={analysis.id} className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => router.push(`/analysis/${analysis.id}`)}>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="mb-1">
                        {analysis.sections?.executiveSummary?.title || 
                         analysis.sections?.formData?.industry || 
                         'Untitled Analysis'}
                      </CardTitle>
                      <CardDescription>
                        {analysis.sections?.formData?.description?.slice(0, 150)}
                        {analysis.sections?.formData?.description && analysis.sections.formData.description.length > 150 ? '...' : ''}
                      </CardDescription>
                    </div>
                    {getStatusBadge(analysis.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <div>
                      Created {new Date(analysis.created_at).toLocaleDateString()}
                    </div>
                    {analysis.sections?.executiveSummary?.score && (
                      <div className="flex items-center gap-2">
                        <span>Score:</span>
                        <span className="font-medium">
                          {analysis.sections.executiveSummary.score}/100
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
} 