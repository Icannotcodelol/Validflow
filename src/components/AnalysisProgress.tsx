import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Circle, Loader2 } from "lucide-react";
import { AnalysisDocument, BaseSectionResponse } from "@/lib/ai/models";

const SECTION_LABELS: Record<string, string> = {
  executiveSummary: "Executive Summary",
  marketSizeGrowth: "Market Size & Growth",
  targetUsers: "Target Users",
  competition: "Competition",
  unitEconomics: "Unit Economics",
  marketingChannels: "Marketing Channels",
  goToMarketPlan: "Go-to-Market Plan",
  vcSentiment: "VC Sentiment",
  criticalThoughtQuestions: "Critical Questions",
  validationRoadmap: "Validation Roadmap",
  keyPerformanceIndicators: "Key Performance Indicators",
  experimentDesign: "Experiment Design",
  reportSummary: "Report Summary",
};

interface AnalysisProgressProps {
  analysis: AnalysisDocument;
}

export function AnalysisProgress({ analysis }: AnalysisProgressProps) {
  // Ensure analysis.sections is treated as an object, default to {} if not
  const sectionsObject = 
    typeof analysis.sections === 'object' && analysis.sections !== null 
      ? analysis.sections 
      : {};
      
  // Now safely use sectionsObject with Object.entries
  const sections = Object.entries(sectionsObject).map(([key, data]) => ({
    key,
    data: data as (BaseSectionResponse & any) | undefined, // Keep existing cast for data
  }));

  // Calculate progress
  const totalSections = Object.keys(SECTION_LABELS).length;
  const completedSections = sections.filter(s => s.data?.status === 'completed').length;
  const progressPercentage = totalSections > 0 ? (completedSections / totalSections) * 100 : 0;

  // Sort sections to match the defined order in SECTION_LABELS
  const sortedSections = sections.sort((a, b) => {
    const orderA = Object.keys(SECTION_LABELS).indexOf(a.key);
    const orderB = Object.keys(SECTION_LABELS).indexOf(b.key);
    return (orderA === -1 ? Infinity : orderA) - (orderB === -1 ? Infinity : orderB);
  });

  // Find the first pending section
  const currentSection = sortedSections.find(s => s.data?.status === 'pending');

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Analysis Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress Bar - Removed for simplicity, can be added back */}
          {/* Status Indicator */}
          <div className="text-center text-sm text-muted-foreground mb-4">
            {currentSection ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing: {SECTION_LABELS[currentSection.key] || currentSection.key}...
              </span>
            ) : analysis.status === 'completed' ? (
              <span className="flex items-center justify-center text-green-600">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Analysis Complete
              </span>
            ) : analysis.status === 'failed' ? (
              <span className="flex items-center justify-center text-red-600">
                <XCircle className="mr-2 h-4 w-4" />
                Analysis Failed
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing Analysis...
              </span>
            )}
          </div>

          {/* Section Status List */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {sortedSections.map(({ key, data }) => {
              const label = SECTION_LABELS[key] || key;
              const status = data?.status || 'queued'; // Default to queued if no data yet
              const Icon = 
                status === 'completed' ? CheckCircle2 : 
                status === 'failed' ? XCircle : 
                status === 'pending' ? Loader2 : 
                Circle; // Queued or unknown
              
              const colorClass = 
                status === 'completed' ? 'text-green-600' : 
                status === 'failed' ? 'text-red-600' : 
                status === 'pending' ? 'text-blue-600' : 
                'text-muted-foreground';

              const iconProps = status === 'pending' ? { className: `mr-2 h-4 w-4 animate-spin ${colorClass}` } : { className: `mr-2 h-4 w-4 ${colorClass}` };

              return (
                <div key={key} className="flex items-center text-sm">
                  <Icon {...iconProps} />
                  <span className={status === 'pending' ? 'font-semibold' : ''}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 