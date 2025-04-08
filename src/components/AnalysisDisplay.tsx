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

export function AnalysisDisplay({ analysis, isLoading, error, hideProgress }: AnalysisDisplayProps) {
  console.log('[AnalysisDisplay] Rendering with analysis:', {
    id: analysis.id,
    status: analysis.status,
    sections: Object.keys(analysis.sections as Record<string, BaseSectionResponse>),
    completedSections: Object.entries(analysis.sections as Record<string, BaseSectionResponse>)
      .filter(([_, section]) => section?.status === 'completed')
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

  const renderSection = (key: string, section: BaseSectionResponse | undefined) => {
    if (!section) return null;

    const SectionComponent = {
      executiveSummary: ExecutiveSummary,
      marketSizeGrowth: MarketSizeGrowth,
      targetUsers: TargetUsers,
      competition: Competition,
      unitEconomics: UnitEconomics,
      marketingChannels: MarketingChannels,
      goToMarketPlan: GoToMarketPlan,
      vcSentiment: VCSentiment,
      criticalThoughtQuestions: CriticalThoughtQuestions,
      reportSummary: ReportSummary,
    }[key];

    if (!SectionComponent) {
      console.warn(`No component found for section: ${key}`);
      return null;
    }

    if (key === 'vcSentiment') {
      return (
        <SectionComponent
          key={key}
          status={section.status}
          error={section.error}
          data={section.data}
          isLandingPage={false}
        />
      );
    }

    return (
      <SectionComponent
        key={key}
        status={section.status}
        error={section.error}
        data={section.data}
      />
    );
  };

  return (
    <div className="space-y-8">
      {!hideProgress && (
        <div className="flex justify-between items-center">
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
      
      <div className="space-y-8">
        {[
          'executiveSummary',
          'marketSizeGrowth',
          'targetUsers',
          'competition',
          'unitEconomics',
        ].map(key => renderSection(key, (analysis.sections as Record<string, BaseSectionResponse>)[key]))}
        
        <RevenueCalculator />

        {[
          'marketingChannels',
          'goToMarketPlan',
          'vcSentiment',
          'criticalThoughtQuestions',
          'reportSummary'
        ].map(key => renderSection(key, (analysis.sections as Record<string, BaseSectionResponse>)[key]))}
      </div>
    </div>
  );
} 