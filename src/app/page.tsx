"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, BarChart3, CheckCircle, ChevronRight, Lightbulb, Target } from "lucide-react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { TypingAnimation } from "@/components/typing-animation"
import { productIdeas } from "@/lib/product-ideas"
import { AnalysisDisplay } from "@/components/AnalysisDisplay"
import { AnalysisDocument, UserInputSchema, ExecutiveSummarySchema, MarketSizeGrowthSchema, TargetUsersSchema, CompetitionSchema, UnitEconomicsSchema, MarketingChannelsSchema, GoToMarketPlanSchema, CriticalThoughtQuestionsSchema, VCSentimentSchema, ReportSummarySchema } from "@/lib/ai/models"

interface Detail {
  title: string
  content: string
}

interface Dimension {
  name: string
  score: number
  description: string
  details: Detail[]
}

// Placeholder function to safely create schemas with defaults for missing fields
// Adjust default values as needed
const safeCreate = (schema: any, data: any) => {
  try {
    // Attempt to parse, providing defaults indirectly if needed
    // This is a simplified approach; a more robust implementation might merge defaults
    const fullData = {
      sectionId: data.sectionId || 'default-id',
      createdAt: data.createdAt || new Date(),
      updatedAt: data.updatedAt || new Date(),
      status: data.status || 'completed',
      error: data.error || undefined,
      ...data // Spread provided data
    };
    // For nested schemas like MarketSizeGrowth, ensure sub-objects exist
    if (schema === MarketSizeGrowthSchema) {
      fullData.totalAddressableMarket = fullData.totalAddressableMarket || {};
      fullData.serviceableAddressableMarket = fullData.serviceableAddressableMarket || {};
      fullData.serviceableObtainableMarket = fullData.serviceableObtainableMarket || {};
      fullData.growthRate = fullData.growthRate || {};
      fullData.marketTrends = fullData.marketTrends || [];
      fullData.marketDrivers = fullData.marketDrivers || [];
      fullData.marketChallenges = fullData.marketChallenges || [];
    }
     if (schema === TargetUsersSchema) {
      fullData.primaryUserPersonas = fullData.primaryUserPersonas || [];
      fullData.userSegments = fullData.userSegments || [];
    }
    if (schema === CompetitionSchema) {
      fullData.directCompetitors = fullData.directCompetitors || [];
      fullData.indirectCompetitors = fullData.indirectCompetitors || [];
      fullData.competitiveAdvantages = fullData.competitiveAdvantages || [];
      fullData.marketGaps = fullData.marketGaps || [];
    }
     if (schema === UnitEconomicsSchema) {
      fullData.pricing = fullData.pricing || { tiers: [] };
      fullData.costs = fullData.costs || { fixed: [], variable: [] };
      fullData.metrics = fullData.metrics || {};
      fullData.projections = fullData.projections || [];
    }
    if (schema === MarketingChannelsSchema) {
      fullData.channels = fullData.channels || [];
      fullData.budget = fullData.budget || { breakdown: [] };
      fullData.recommendations = fullData.recommendations || [];
    }
    if (schema === GoToMarketPlanSchema) {
      fullData.launchStrategy = fullData.launchStrategy || { phases: [] };
      fullData.keyPartnerships = fullData.keyPartnerships || [];
      fullData.resourceRequirements = fullData.resourceRequirements || { team: [], technology: [] };
    }
    if (schema === VCSentimentSchema) {
      fullData.overview = fullData.overview || {};
      fullData.investmentAttractiveness = fullData.investmentAttractiveness || { strengths: [], weaknesses: [], opportunities: [], threats: [] };
      fullData.marketActivity = fullData.marketActivity || { notableTransactions: [], comparableExits: [] };
      fullData.marketTrends = fullData.marketTrends || { trends: [], investorSentiment: { keyFactors: [], concerns: [] } };
      fullData.fundingStrategy = fullData.fundingStrategy || { recommendedRound: { valuation: { basis: [] } }, useOfFunds: [], targetInvestors: [], milestones: [] };
    }
    if (schema === CriticalThoughtQuestionsSchema) {
      fullData.questions = fullData.questions || [];
    }
     if (schema === ReportSummarySchema) {
      fullData.keyRecommendations = fullData.keyRecommendations || [];
      fullData.nextSteps = fullData.nextSteps || [];
    }

    // Use parse to validate and potentially strip extra fields if not using .passthrough()
    // return schema.parse(fullData);
    // Use safeParse for resilience, returning undefined on failure
    const result = schema.safeParse(fullData);
    if (result.success) {
      return result.data;
    } else {
      console.error("Schema validation failed for", data.sectionId, result.error.issues);
      // Return a default structure or minimal valid object
      return {
        sectionId: data.sectionId || 'failed-validation-id',
        createdAt: data.createdAt || new Date(),
        updatedAt: data.updatedAt || new Date(),
        status: 'failed',
        error: 'Schema validation failed: ' + result.error.message,
      };
    }
  } catch (error) {
    console.error("Error creating schema object:", error);
    // Return a fallback structure on error
     return {
        sectionId: data.sectionId || 'error-id',
        createdAt: data.createdAt || new Date(),
        updatedAt: data.updatedAt || new Date(),
        status: 'failed',
        error: 'Failed to create schema object.',
      };
  }
};

/*
// Commenting out the sampleAnalysis data block
const sampleAnalysis: AnalysisDocument = {
  // ... entire sample analysis object ...
};
*/

export default function Home() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [selectedDimension, setSelectedDimension] = useState<Dimension | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [session, setSession] = useState<any>(null)
  const [isAuthChecking, setIsAuthChecking] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        setSession(currentSession)
      } catch (error) {
        console.error('Error checking session:', error)
      } finally {
        setIsAuthChecking(false)
      }
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const handleTryValidFlow = async () => {
    setIsLoading(true)
    try {
      if (!session) {
        console.log('No session found, redirecting to signin')
        router.push('/signin?redirectTo=/validate')
        return
      }

      console.log('Session found:', session)

      // Check if user has credits or free analysis
      const { data: credits, error: creditsError } = await supabase
        .from('user_credits')
        .select('credits_balance, has_unlimited, unlimited_until, free_analysis_used')
        .eq('user_id', session.user.id)
        .single()

      console.log('Credits data:', credits)
      console.log('Credits error:', creditsError)

      if (creditsError || !credits) {
        // No credits record, create one with free analysis
        const { data: newCredits, error: insertError } = await supabase
          .from('user_credits')
          .insert({
            user_id: session.user.id,
            credits_balance: 0,
            has_unlimited: false,
            free_analysis_used: false
          })
          .select()
          .single()

        console.log('New credits created:', newCredits)
        console.log('Insert error:', insertError)

        if (!insertError && newCredits) {
          router.push('/validate')
        } else {
          console.error('Error creating credits:', insertError)
          router.push('/validate')
        }
      } else {
        const now = new Date()
        const hasValidUnlimited = credits.has_unlimited && 
          credits.unlimited_until && 
          new Date(credits.unlimited_until) > now

        if (hasValidUnlimited || credits.credits_balance > 0 || !credits.free_analysis_used) {
          router.push('/validate')
        } else {
          router.push('/pricing')
        }
      }
    } catch (error) {
      console.error('Error in handleTryValidFlow:', error)
      router.push('/validate')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDimensionClick = (dimension: Dimension) => {
    setSelectedDimension(dimension)
  }

  const handleBackClick = () => {
    setSelectedDimension(null)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <Lightbulb className="h-6 w-6 text-primary" />
          <span className="ml-2 text-xl font-bold">ValidFlow</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/about">
            About
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {!isAuthChecking && (
            session ? (
              <>
                <Link href="/validate">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={async () => {
                    await supabase.auth.signOut()
                    router.push('/')
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )
          )}
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section with background image */}
          <section 
            className="w-full min-h-[80vh] relative flex items-center py-12 md:py-24 lg:py-32 xl:py-48 bg-cover bg-center bg-no-repeat overflow-hidden" 
            style={{ 
              backgroundImage: "url('/images/hero-bg.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80"></div>
            <div className="container relative pl-8 md:pl-12 pr-4 md:pr-6 z-10">
              <div className="max-w-3xl">
                <div className="relative">
                  <div className="space-y-8">
                    <div className="h-[180px] sm:h-[200px] flex items-center">
                      <TypingAnimation
                        ideas={productIdeas}
                        className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                        staticText="ValidFlow"
                        typingSpeed={100}
                        deleteSpeed={50}
                        pauseDuration={2000}
                      />
                    </div>
                    <p className="max-w-[600px] text-white/90 md:text-xl text-left">
                      AI-powered analysis to evaluate your product concept, highlight strengths, weaknesses, and market
                      opportunities before you invest time and resources.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row mt-8">
                  <Button 
                    size="lg" 
                    className="gap-1 bg-black hover:bg-black/90"
                    onClick={handleTryValidFlow}
                    disabled={isLoading || isAuthChecking}
                  >
                    {isLoading ? "Loading..." : "Try ValidFlow"} {!isLoading && <ArrowRight className="h-4 w-4" />}
                  </Button>
                  <Link href="/pricing">
                    <Button size="lg" variant="outline" className="bg-black hover:bg-black/90 text-white border-white/20">
                      View Pricing
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section with solid background */}
          <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Our AI-powered platform analyzes your product idea across multiple dimensions to provide comprehensive
                    validation insights.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
                <div className="flex flex-col justify-center space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Lightbulb className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">1. Input Your Idea</h3>
                    <p className="text-muted-foreground">
                      Share details about your product concept, target market, and business model through our structured form.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-center space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">2. AI Analysis</h3>
                    <p className="text-muted-foreground">
                      Our AI engine analyzes market trends, competitor landscape, and evaluates your idea across 8 key dimensions.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-center space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">3. Get Actionable Insights</h3>
                    <p className="text-muted-foreground">
                      Receive a comprehensive validation report with strengths, weaknesses, and recommendations for your next steps.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sample Analysis Section - Commented Out */}
          <section id="sample-analysis" className="w-full py-12 md:py-24 lg:py-32 border-t">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">See ValidFlow in Action</h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Explore an example analysis generated by ValidFlow for a hypothetical business idea.
                  </p>
                </div>
              </div>
              {/* 
              <div className="mx-auto max-w-5xl">
                <AnalysisDisplay analysis={sampleAnalysis} hideProgress={true} />
              </div> 
              */}
              {/* TODO: Embed landing page video here */}
              <div className="mx-auto max-w-4xl mt-8 text-center">
                <p className="text-muted-foreground">[Video Placeholder: A short video demonstrating the ValidFlow analysis will be embedded here.]</p>
              </div>
            </div>
          </section>

          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Ready to Validate Your Idea?
                  </h2>
                  <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Start with our free tier or upgrade to premium for comprehensive insights.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/validate">
                    <Button size="lg">Get Started</Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">© 2025 ValidFlow. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
} 