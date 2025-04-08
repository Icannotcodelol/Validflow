import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Circle } from "lucide-react";
import { AnalysisDocument, BaseSectionResponse } from "@/lib/ai/models";

const SECTION_LABELS: Record<keyof AnalysisDocument['sections'], string> = {
  executiveSummary: "Executive Summary",
  marketSizeGrowth: "Market Size & Growth",
  targetUsers: "Target Users",
  competition: "Competition",
  unitEconomics: "Unit Economics",
  marketingChannels: "Marketing Channels",
  goToMarketPlan: "Go-to-Market Plan",
  vcSentiment: "VC Sentiment",
  criticalThoughtQuestions: "Critical Questions",
  reportSummary: "Report Summary",
};

interface AnalysisProgressProps {
  analysis: AnalysisDocument;
}

export function AnalysisProgress({ analysis }: AnalysisProgressProps) {
  console.log('Analysis Progress - Sections:', analysis.sections);

  const sections = Object.entries(analysis.sections).map(([key, data]) => ({
    key,
    data: data as (BaseSectionResponse & any) | undefined,
  }));

  const completedSections = sections.filter(
    (section) => section.data?.status === "completed"
  ).length;

  const failedSections = sections.filter(
    (section) => section.data?.status === "failed"
  ).length;

  const totalSections = sections.length;
  const progress = (completedSections / totalSections) * 100;

  console.log('Analysis Progress - Stats:', {
    completed: completedSections,
    failed: failedSections,
    total: totalSections,
    progress
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {completedSections} of {totalSections} sections completed
          </div>
          <div className="text-sm font-medium">{Math.round(progress)}%</div>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="grid gap-2">
          {[
            'executiveSummary',
            'marketSizeGrowth',
            'targetUsers',
            'competition',
            'unitEconomics',
            'marketingChannels',
            'goToMarketPlan',
            'vcSentiment',
            'criticalThoughtQuestions',
            'reportSummary'
          ].map((sectionKey) => {
            const section = analysis.sections[sectionKey as keyof typeof analysis.sections];
            return (
              <div
                key={sectionKey}
                className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
              >
                <span className="text-sm">
                  {SECTION_LABELS[sectionKey as keyof typeof SECTION_LABELS]}
                </span>
                {section?.status === "completed" ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : section?.status === "failed" ? (
                  <XCircle className="h-4 w-4 text-red-500" />
                ) : (
                  <Circle className="h-4 w-4 text-gray-400" />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 