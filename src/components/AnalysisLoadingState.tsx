import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Loader2, Clock } from "lucide-react"

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

// Define section dependencies (same as in analysis-processor.ts)
const SECTION_DEPENDENCIES: Record<string, string[]> = {
  executiveSummary: [],
  marketSizeGrowth: [],
  targetUsers: [],
  competition: ['marketSizeGrowth'],
  unitEconomics: ['marketSizeGrowth', 'competition'],
  marketingChannels: ['targetUsers', 'competition'],
  goToMarketPlan: ['marketingChannels', 'unitEconomics'],
  vcSentiment: ['marketSizeGrowth', 'competition'],
  criticalThoughtQuestions: ['executiveSummary', 'marketSizeGrowth'],
  validationRoadmap: ['criticalThoughtQuestions'],
  keyPerformanceIndicators: ['unitEconomics', 'marketingChannels'],
  experimentDesign: ['validationRoadmap'],
  reportSummary: ['executiveSummary', 'criticalThoughtQuestions']
};

// Calculate the maximum path length (critical path) for time estimation
const calculateCriticalPathLength = () => {
  const pathLengths: Record<string, number> = {};
  
  const calculateLength = (section: string): number => {
    if (pathLengths[section] !== undefined) return pathLengths[section];
    
    const dependencies = SECTION_DEPENDENCIES[section];
    if (!dependencies || dependencies.length === 0) {
      pathLengths[section] = 1;
      return 1;
    }
    
    const maxDependencyLength = Math.max(...dependencies.map(dep => calculateLength(dep)));
    pathLengths[section] = maxDependencyLength + 1;
    return pathLengths[section];
  };
  
  return Math.max(...Object.keys(SECTION_DEPENDENCIES).map(section => calculateLength(section)));
};

const CRITICAL_PATH_LENGTH = calculateCriticalPathLength();
const AVERAGE_SECTION_TIME = 0.5; // Average time in minutes for each section

export function AnalysisLoadingState({ currentSection, completedSections }: AnalysisLoadingStateProps) {
  const progress = (completedSections.length / ANALYSIS_STEPS.length) * 100;
  
  // Calculate remaining time based on critical path and parallel processing
  const remainingSteps = CRITICAL_PATH_LENGTH - Math.floor((completedSections.length / ANALYSIS_STEPS.length) * CRITICAL_PATH_LENGTH);
  const estimatedTimeRemaining = Math.ceil(remainingSteps * AVERAGE_SECTION_TIME);
  
  // Get currently processing sections (those that can be processed in parallel)
  const getProcessingSections = () => {
    return ANALYSIS_STEPS
      .filter(step => !completedSections.includes(step.id))
      .filter(step => 
        SECTION_DEPENDENCIES[step.id].every(dep => 
          completedSections.includes(dep)
        )
      );
  };
  
  const processingSections = getProcessingSections();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Analyzing Your Business Idea</CardTitle>
          <CardDescription>
            We're using advanced AI to analyze multiple aspects of your business idea in parallel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="bg-muted/50 rounded-md p-4">
              <p className="text-sm text-muted-foreground mb-3">
                Estimated time remaining: {estimatedTimeRemaining} minutes
              </p>
              <div className="space-y-2">
                {ANALYSIS_STEPS.map((step) => {
                  const isCompleted = completedSections.includes(step.id);
                  const isProcessing = processingSections.some(s => s.id === step.id);
                  const isWaiting = !isCompleted && !isProcessing;
                  const dependenciesComplete = SECTION_DEPENDENCIES[step.id].every(dep => 
                    completedSections.includes(dep)
                  );

                  return (
                    <div key={step.id} className="flex items-center text-sm">
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                      ) : isProcessing ? (
                        <Loader2 className="h-4 w-4 text-blue-500 animate-spin mr-2" />
                      ) : isWaiting && dependenciesComplete ? (
                        <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                      ) : (
                        <div className="h-4 w-4 border-2 rounded-full mr-2" />
                      )}
                      <span className={
                        isCompleted 
                          ? "text-muted-foreground line-through" 
                          : isProcessing
                            ? "text-blue-500 font-medium"
                            : isWaiting && dependenciesComplete
                              ? "text-yellow-500"
                              : "text-muted-foreground"
                      }>
                        {step.label}
                        {!isCompleted && !isProcessing && dependenciesComplete && " (Ready)"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-sm text-muted-foreground bg-muted/30 rounded-md p-4">
              <p className="mb-2">Your analysis will include:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Comprehensive market research</li>
                <li>Competitive landscape analysis</li>
                <li>Financial projections and metrics</li>
                <li>Strategic recommendations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 