import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info, Calendar, Target, Users, CheckCircle, Check, Zap, Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ReportSummary as ReportSummaryData, ActionableItem, BaseSectionResponse } from "@/lib/ai/models";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ReportSummaryProps extends BaseSectionResponse {
  data?: ReportSummaryData['data'];
}

const priorityBadgeVariant = (priority?: 'high' | 'medium' | 'low' | string): "destructive" | "secondary" | "outline" | "default" => {
  switch (priority?.toLowerCase()) {
    case 'high': return 'destructive';
    case 'medium': return 'secondary';
    case 'low': return 'outline';
    default: return 'default';
  }
};

const recommendationBadgeVariant = (recommendation?: 'Proceed' | 'Pivot' | 'Halt'): "default" | "secondary" | "destructive" | "outline" => {
  switch (recommendation) {
    case 'Proceed': return 'default';
    case 'Pivot': return 'secondary';
    case 'Halt': return 'destructive';
    default: return 'outline';
  }
};

function ActionableItemDisplay({ item }: { item: ActionableItem }) {
  return (
    <div className="p-3 border rounded-md bg-background text-sm space-y-2">
      <div className="flex justify-between items-start">
        <p className="font-medium">{item.step}</p>
        {item.priority && <Badge variant={priorityBadgeVariant(item.priority)}>{item.priority}</Badge>}
      </div>
      {item.timeline && <p className="text-xs text-muted-foreground flex items-center"><Calendar className="h-3 w-3 mr-1" /> {item.timeline}</p>}
      {item.resourcesNeeded && item.resourcesNeeded.length > 0 && 
        <p className="text-xs text-muted-foreground flex items-center"><Users className="h-3 w-3 mr-1" /> Resources: {item.resourcesNeeded.join(', ')}</p>
      }
      {item.decisionCriteria && <p className="text-xs text-muted-foreground flex items-center"><Target className="h-3 w-3 mr-1" /> Criteria: {item.decisionCriteria}</p>}
    </div>
  );
}

function ReportSummaryContent({ data, status, error }: ReportSummaryProps) {
  console.log('ReportSummary - Rendering with:', { status, error, data });

  if (status === 'pending') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Report Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
            Generating final report summary...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === 'failed') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Report Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || 'Report summary could not be generated. Please try again.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (status === 'completed' && (!data || !data.summary || !data.overallRecommendation)) {
    console.warn('[ReportSummary] Completed status but missing data or summary.', data);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Report Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="default">
            <Info className="h-4 w-4" />
            <AlertDescription>
              {error ? `Error: ${error}` : 'Report summary data is unavailable or the structure is incorrect.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (status === 'completed' && data) {
    type RecommendationCategory = {
      category: string;
      items: ActionableItem[];
      priority: 'high' | 'medium' | 'low';
    };
    
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
        <CardHeader>
          <CardTitle>Final Summary & Next Steps</CardTitle>
          <div className="flex items-center justify-between pt-2">
             <CardDescription>Overall assessment and actionable plan forward.</CardDescription>
             {data.overallRecommendation && (
               <Badge variant={recommendationBadgeVariant(data.overallRecommendation)} className="text-sm px-3 py-1">
                 {data.overallRecommendation === 'Proceed' && <Check className="h-4 w-4 mr-1"/>}
                 {data.overallRecommendation === 'Pivot' && <Zap className="h-4 w-4 mr-1"/>}
                 {data.overallRecommendation === 'Halt' && <Flag className="h-4 w-4 mr-1"/>}
                 {data.overallRecommendation}
               </Badge>
             )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
            {/* Summary */}
            <div>
              <h3 className="font-semibold mb-2">Summary</h3>
              <div className="p-4 bg-muted/50 rounded-lg border">
                <p className="text-muted-foreground whitespace-pre-wrap text-sm">{data.summary}</p>
              </div>
            </div>

            {/* Key Findings */}
            {data.keyFindings && data.keyFindings.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Key Findings</h3>
                <div className="p-4 bg-muted/50 rounded-lg border">
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {data.keyFindings.map((finding: string, index: number) => <li key={index}>{finding}</li>)}
                  </ul>
                </div>
              </div>
            )}

            {/* Recommendations */}
            {data.recommendations && data.recommendations.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Recommendations</h3>
                <Accordion type="multiple" className="w-full space-y-3">
                  {data.recommendations.map((recCat: RecommendationCategory, index: number) => (
                    <AccordionItem key={index} value={`rec-cat-${index}`}>
                      <AccordionTrigger className="text-base bg-muted/50 border px-4 rounded-md hover:no-underline">
                         <div className="flex justify-between items-center w-full">
                            <span>{recCat.category}</span>
                            <Badge variant={priorityBadgeVariant(recCat.priority)}>{recCat.priority} Priority</Badge>
                         </div>
                      </AccordionTrigger>
                      <AccordionContent className="pt-3 space-y-2">
                         {recCat.items.map((item: ActionableItem, i: number) => <ActionableItemDisplay key={i} item={item} />)}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

            {/* Next Steps */}
            {data.nextSteps && data.nextSteps.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Immediate Next Steps</h3>
                <div className="space-y-2">
                  {data.nextSteps.map((step: ActionableItem, index: number) => <ActionableItemDisplay key={index} item={step} />)}
                </div>
              </div>
            )}
        </CardContent>
      </Card>
    );
  }

  return null;
}

export function ReportSummary(props: ReportSummaryProps) {
  return (
    <ErrorBoundary>
      <ReportSummaryContent {...props} />
    </ErrorBoundary>
  );
} 