import { AnalysisDocument, BaseSectionResponse } from "@/lib/ai/models";
import { ExecutiveSummary } from "./sections/ExecutiveSummary";
import { MarketSizeGrowth } from "./sections/MarketSizeGrowth";
import { TargetUsers } from "./sections/TargetUsers";
import { Competition } from "./sections/Competition";
import { UnitEconomics } from "./sections/UnitEconomics";
import { MarketingChannels } from "./sections/MarketingChannels";
import { GoToMarketPlan } from "./sections/GoToMarketPlan";
import { CriticalThoughtQuestions } from "./sections/CriticalThoughtQuestions";
import { VCSentiment } from "./sections/VCSentiment";
import { ReportSummary } from "./sections/ReportSummary";
import { ValidationRoadmap } from "./sections/ValidationRoadmap";
import { KeyPerformanceIndicators } from "./sections/KeyPerformanceIndicators";
import { ExperimentDesign } from "./sections/ExperimentDesign";
import { AnalysisProgress } from "./AnalysisProgress";
import { Download } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { exportToPDF, exportToCSV, exportToJSON } from "@/utils/export";
import RevenueCalculator from "./tools/RevenueCalculator";

interface AnalysisDisplayProps {
  analysis: AnalysisDocument;
  isLoading?: boolean;
  error?: string;
  hideProgress?: boolean;
}

export function AnalysisDisplay({ analysis, isLoading, error, /* hideProgress */ }: AnalysisDisplayProps) {
  console.log('[AnalysisDisplay] Rendering with analysis:', {
    status: analysis.status,
    sections: Object.keys(analysis.sections || {}),
    completedSections: Object.entries(analysis.sections || {})
      .filter(([_, section]) => (section as BaseSectionResponse)?.status === 'completed')
      .map(([key]) => key)
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // Keep console.log for development debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('Raw sections data:', JSON.stringify(analysis.sections, null, 2));
  }

  const sections = [
    'executiveSummary',
    'marketSizeGrowth',
    'targetUsers',
    'competition',
    'unitEconomics',
    'revenueCalculator',
    'marketingChannels',
    'goToMarketPlan',
    'vcSentiment',
    'criticalThoughtQuestions',
    'validationRoadmap',
    'keyPerformanceIndicators',
    'experimentDesign',
    'reportSummary'
  ] as const;

  const sectionComponents = {
    executiveSummary: ExecutiveSummary,
    marketSizeGrowth: MarketSizeGrowth,
    targetUsers: TargetUsers,
    competition: Competition,
    unitEconomics: UnitEconomics,
    revenueCalculator: RevenueCalculator,
    marketingChannels: MarketingChannels,
    goToMarketPlan: GoToMarketPlan,
    vcSentiment: VCSentiment,
    criticalThoughtQuestions: CriticalThoughtQuestions,
    validationRoadmap: ValidationRoadmap,
    keyPerformanceIndicators: KeyPerformanceIndicators,
    experimentDesign: ExperimentDesign,
    reportSummary: ReportSummary
  } as const;

  return (
    <div className="space-y-8">
      {/* Comment out or remove the entire progress section */}
      {/* 
      {!hideProgress && (
        <div className="flex justify-between items-center mb-6 p-4 bg-card border rounded-lg shadow-sm">
          <AnalysisProgress analysis={analysis} />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => exportToPDF(analysis)}>
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportToCSV(analysis)}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportToJSON(analysis)}>
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      */}
      
      {/* Analysis Sections Rendering */}
      <div className="space-y-8">
        {sections.map(sectionKey => {
          // Handle Revenue Calculator separately since it's not an analysis section
          if (sectionKey === 'revenueCalculator') {
            return (
              <div key={sectionKey} className="mb-8">
                <RevenueCalculator />
              </div>
            );
          }

          // Type assertion to exclude 'revenueCalculator' from section keys
          const section = analysis.sections?.[sectionKey as Exclude<typeof sectionKey, 'revenueCalculator'>] as BaseSectionResponse | undefined;
          
          if (!section || section.status !== 'completed') {
            console.log(`[AnalysisDisplay] Skipping section ${sectionKey}:`, section);
            return null;
          }

          const SectionComponent = sectionComponents[sectionKey];
          if (!SectionComponent) {
            console.warn(`No component found for section: ${sectionKey}`);
            return null;
          }

          console.log(`[AnalysisDisplay] Rendering section ${sectionKey}`);
          return (
            <div key={sectionKey} className="mb-8">
              {sectionKey === 'vcSentiment' ? (
                <SectionComponent {...section} isLandingPage={false} />
              ) : (
                <SectionComponent {...section} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 