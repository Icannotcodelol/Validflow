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
  isLoading: boolean;
  error?: string;
}

export function AnalysisDisplay({ analysis, isLoading, error }: AnalysisDisplayProps) {
  const sectionComponents = {
    executiveSummary: ExecutiveSummary,
    marketSizeGrowth: MarketSizeGrowth,
    targetUsers: TargetUsers,
    competition: Competition,
    unitEconomics: UnitEconomics,
    marketingChannels: MarketingChannels,
    goToMarketPlan: GoToMarketPlan,
    vcSentiment: VCSentiment,
    criticalThoughtQuestions: CriticalThoughtQuestions,
    validationRoadmap: ValidationRoadmap,
    keyPerformanceIndicators: KeyPerformanceIndicators,
    experimentDesign: ExperimentDesign,
    reportSummary: ReportSummary
  } as const;

  // Define the order of sections as they should appear
  const sectionOrder = [
    'executiveSummary',
    'marketSizeGrowth',
    'targetUsers',
    'competition',
    'unitEconomics',
    'marketingChannels',
    'goToMarketPlan',
    'vcSentiment',
    'criticalThoughtQuestions',
    'validationRoadmap',
    'keyPerformanceIndicators',
    'experimentDesign',
    'reportSummary'
  ] as const;

  // Filter completed sections and sort them according to sectionOrder
  const completedSections = sectionOrder.filter(sectionKey => 
    (analysis.sections?.[sectionKey] as BaseSectionResponse)?.status === 'completed'
  );

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {completedSections.length === 0 && isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Show a message if analysis has started but no sections are complete yet */}
          {completedSections.length === 0 && (
            <div className="text-center p-4">
              <h2 className="text-xl font-semibold mb-2">Analysis in Progress</h2>
              <p className="text-sm text-muted-foreground">The first results will appear here as soon as they're ready.</p>
            </div>
          )}
          
          {/* Render completed sections in order */}
          {completedSections.map(sectionKey => {
            const section = analysis.sections?.[sectionKey] as BaseSectionResponse;
            const SectionComponent = sectionComponents[sectionKey];

            if (!SectionComponent) {
              console.warn(`No component found for section: ${sectionKey}`);
              return null;
            }

            return (
              <div key={sectionKey} className="mb-8 animate-fadeIn">
                {sectionKey === 'vcSentiment' ? (
                  <SectionComponent {...section} isLandingPage={false} />
                ) : (
                  <SectionComponent {...section} />
                )}
              </div>
            );
          })}

          {/* Show loading indicator for next section if analysis is still in progress */}
          {(analysis as AnalysisDocument).status === 'processing' && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
            </div>
          )}
        </div>
      )}
    </div>
  );
} 