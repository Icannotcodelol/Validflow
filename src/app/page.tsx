"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, BarChart3, CheckCircle, ChevronRight, Lightbulb, Target } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/components/providers/SessionProvider"
import { User } from "@supabase/supabase-js"
import Header from "@/components/Header"

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
  const supabase = useSupabase()
  const [user, setUser] = useState<User | null>(null)
  const [selectedDimension, setSelectedDimension] = useState<Dimension | null>(null)
  // Removed dimensions data as it came from sampleAnalysis
  // const dimensions: Dimension[] = [ ... ];

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleDimensionClick = (dimension: Dimension) => {
    setSelectedDimension(dimension)
  }

  const handleBackClick = () => {
    setSelectedDimension(null)
  }

  const handleTryValidFlow = () => {
    if (user) {
      router.push('/validate')
    } else {
      router.push('/signin')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 relative">
        {/* Background image with overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ 
            backgroundImage: "url('/mountains.jpg')",
            backgroundPosition: "center",
            backgroundSize: "cover"
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 pt-32 pb-20 min-h-screen flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              ValidFlow
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-pink-400 mb-8">
              AI-powered product validation
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl">
              Get instant, comprehensive analysis of your product concept. 
              Identify strengths, weaknesses, and market opportunities 
              before investing time and resources.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={handleTryValidFlow}
                className="text-lg px-8 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {user ? 'Try ValidFlow' : 'Get Started'}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push('/pricing')}
                className="text-lg px-8 border-2 border-white text-white hover:bg-white/10"
              >
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 