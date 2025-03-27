import { AnalysisDocument } from "@/lib/ai/models";
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

interface AnalysisDisplayProps {
  analysis: AnalysisDocument;
  isLoading?: boolean;
  error?: string;
}

export function AnalysisDisplay({ analysis, isLoading, error }: AnalysisDisplayProps) {
  console.log('AnalysisDisplay - Rendering with data:', {
    status: analysis.status,
    sections: Object.keys(analysis.sections),
    sectionDetails: analysis.sections
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

  // Debug view for development
  const showDebugView = process.env.NODE_ENV === 'development';
  if (showDebugView) {
    console.log('Raw sections data:', JSON.stringify(analysis.sections, null, 2));
  }

  return (
    <div className="space-y-8">
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
      
      {showDebugView && (
        <div className="p-4 bg-gray-100 rounded-lg overflow-auto">
          <h3 className="text-lg font-semibold mb-2">Debug View</h3>
          <pre className="text-sm">{JSON.stringify(analysis.sections, null, 2)}</pre>
        </div>
      )}

      <div className="space-y-8">
        {analysis.sections.executiveSummary?.status === 'completed' && (
          <ExecutiveSummary data={analysis.sections.executiveSummary} />
        )}
        
        {analysis.sections.marketSizeGrowth?.status === 'completed' && (
          <MarketSizeGrowth data={analysis.sections.marketSizeGrowth} />
        )}
        
        {analysis.sections.targetUsers?.status === 'completed' && (
          <TargetUsers data={analysis.sections.targetUsers} />
        )}
        
        {analysis.sections.competition?.status === 'completed' && (
          <Competition data={analysis.sections.competition} />
        )}
        
        {analysis.sections.unitEconomics?.status === 'completed' && (
          <UnitEconomics data={analysis.sections.unitEconomics} />
        )}
        
        {analysis.sections.marketingChannels?.status === 'completed' && (
          <MarketingChannels data={analysis.sections.marketingChannels} />
        )}
        
        {analysis.sections.goToMarketPlan?.status === 'completed' && (
          <GoToMarketPlan data={analysis.sections.goToMarketPlan} />
        )}
        
        {analysis.sections.criticalThoughtQuestions?.status === 'completed' && (
          <CriticalThoughtQuestions data={analysis.sections.criticalThoughtQuestions} />
        )}
        
        {analysis.sections.vcSentiment?.status === 'completed' && (
          <VCSentiment data={analysis.sections.vcSentiment} />
        )}
        
        {analysis.sections.reportSummary?.status === 'completed' && (
          <ReportSummary data={analysis.sections.reportSummary} />
        )}
      </div>
    </div>
  );
} 