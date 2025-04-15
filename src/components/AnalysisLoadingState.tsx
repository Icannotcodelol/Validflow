import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Loader2 } from "lucide-react"

const ANALYSIS_STEPS = [
  { id: 'executiveSummary', label: 'Executive Summary' },
  { id: 'marketSizeGrowth', label: 'Market Size & Growth' },
  { id: 'targetUsers', label: 'Target Users' },
  { id: 'competition', label: 'Competition Analysis' },
  { id: 'unitEconomics', label: 'Unit Economics' },
  { id: 'marketingChannels', label: 'Marketing Channels' },
  { id: 'goToMarketPlan', label: 'Go-to-Market Plan' },
  { id: 'vcSentiment', label: 'VC Sentiment' },
  { id: 'criticalThoughtQuestions', label: 'Critical Questions' },
  { id: 'reportSummary', label: 'Report Summary' }
]

interface AnalysisLoadingStateProps {
  currentSection?: string;
  completedSections: string[];
}

export function AnalysisLoadingState({ currentSection, completedSections }: AnalysisLoadingStateProps) {
  const progress = (completedSections.length / ANALYSIS_STEPS.length) * 100

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="border rounded-lg shadow-sm">
        <CardContent className="p-6 space-y-6">
          {/* Progress Header */}
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">Analyzing Your Business Idea</h3>
            <p className="text-sm text-muted-foreground">
              Please wait while we generate your comprehensive analysis...
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground text-center">
              {Math.round(progress)}% Complete
            </p>
          </div>

          {/* Current Status */}
          <div className="bg-muted/50 rounded-md p-4">
            <p className="text-sm text-muted-foreground mb-3">
              Estimated time remaining: {Math.ceil((ANALYSIS_STEPS.length - completedSections.length) * 1)} minutes
            </p>
            <div className="space-y-2">
              {ANALYSIS_STEPS.map((step) => {
                const isCompleted = completedSections.includes(step.id)
                const isCurrent = currentSection === step.id

                return (
                  <div key={step.id} className="flex items-center text-sm">
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                    ) : isCurrent ? (
                      <Loader2 className="h-4 w-4 text-blue-500 animate-spin mr-2" />
                    ) : (
                      <div className="h-4 w-4 border-2 rounded-full mr-2" />
                    )}
                    <span className={
                      isCompleted 
                        ? "text-muted-foreground line-through" 
                        : isCurrent 
                          ? "text-blue-500 font-medium"
                          : "text-muted-foreground"
                    }>
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Info Box */}
          <div className="text-sm text-muted-foreground bg-muted/30 rounded-md p-4">
            <p className="mb-2">Your analysis will include:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Comprehensive market research</li>
              <li>Competitive landscape analysis</li>
              <li>Financial projections and metrics</li>
              <li>Strategic recommendations</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 