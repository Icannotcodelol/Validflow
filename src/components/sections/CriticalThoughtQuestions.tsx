import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info, Calendar, Target, Users, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CriticalThoughtQuestions as CriticalThoughtQuestionsData, ActionableItem, BaseSectionResponse } from "@/lib/ai/models";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface CriticalThoughtQuestionsProps extends BaseSectionResponse {
  data?: CriticalThoughtQuestionsData['data'];
}

const priorityBadgeVariant = (priority?: 'high' | 'medium' | 'low' | string) => {
  switch (priority?.toLowerCase()) {
    case 'high': return 'destructive';
    case 'medium': return 'secondary';
    case 'low': return 'outline';
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

function CriticalThoughtQuestionsContent({ data, status, error }: CriticalThoughtQuestionsProps) {
  console.log('CriticalThoughtQuestions - Rendering with:', { status, error, data });

  if (status === 'pending') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Critical Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
            Generating critical questions...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === 'failed') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Critical Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || 'Critical questions could not be generated. Please try again.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (status === 'completed' && (!data || !data.questions || data.questions.length === 0)) {
    console.warn('[CriticalThoughtQuestions] Completed status but missing data or questions.', data);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Critical Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="default">
            <Info className="h-4 w-4" />
            <AlertDescription>
              {error ? `Error: ${error}` : 'Critical questions data is unavailable or the structure is incorrect.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (status === 'completed' && data && data.questions) {
    type QuestionItem = {
      category: string;
      question: string;
      analysis: string;
      priority: 'high' | 'medium' | 'low';
      implications: string[];
      recommendations: ActionableItem[];
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>Critical Questions & Validation Steps</CardTitle>
          <CardDescription>Key questions to address and actionable steps to validate assumptions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Critical Questions with Actionable Recommendations */}
          <Accordion type="multiple" className="w-full space-y-4">
            {data.questions.map((item: QuestionItem, index: number) => (
              <AccordionItem key={index} value={`question-${index}`}>
                <AccordionTrigger>
                  <div className="flex justify-between items-center w-full pr-4">
                    <span className="text-left font-medium">{item.category}: {item.question}</span>
                    <Badge variant={priorityBadgeVariant(item.priority)}>{item.priority}</Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 space-y-4">
                  {/* Analysis */}
                  <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                    <h4 className="font-medium text-foreground mb-1">Analysis</h4>
                    {item.analysis}
                  </div>

                  {/* Implications */}
                  {item.implications && item.implications.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Implications</h4>
                      <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                        {item.implications.map((imp: string, i: number) => <li key={i}>{imp}</li>)}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations (Actionable Items) */}
                  {item.recommendations && item.recommendations.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Recommended Validation Steps</h4>
                      <div className="space-y-2">
                        {item.recommendations.map((rec: ActionableItem, i: number) => <ActionableItemDisplay key={i} item={rec} />)}
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Risk Assessment */}
          {data.riskAssessment && (data.riskAssessment.highPriority?.length > 0 || data.riskAssessment.mediumPriority?.length > 0 || data.riskAssessment.lowPriority?.length > 0) && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="risk-assessment">
                <AccordionTrigger className="font-semibold text-base">Risk Assessment</AccordionTrigger>
                <AccordionContent className="pt-2 grid gap-4 md:grid-cols-3">
                  {/* High Priority Risks */}
                  {data.riskAssessment.highPriority && data.riskAssessment.highPriority.length > 0 && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="font-medium text-red-800 mb-2">High Priority</h4>
                      <ul className="list-disc list-inside text-sm space-y-1 text-red-700">
                        {data.riskAssessment.highPriority.map((risk: string, i: number) => <li key={i}>{risk}</li>)}
                      </ul>
                    </div>
                  )}
                  {/* Medium Priority Risks */}
                  {data.riskAssessment.mediumPriority && data.riskAssessment.mediumPriority.length > 0 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-medium text-yellow-800 mb-2">Medium Priority</h4>
                      <ul className="list-disc list-inside text-sm space-y-1 text-yellow-700">
                        {data.riskAssessment.mediumPriority.map((risk: string, i: number) => <li key={i}>{risk}</li>)}
                      </ul>
                    </div>
                  )}
                  {/* Low Priority Risks */}
                  {data.riskAssessment.lowPriority && data.riskAssessment.lowPriority.length > 0 && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">Low Priority</h4>
                      <ul className="list-disc list-inside text-sm space-y-1 text-green-700">
                        {data.riskAssessment.lowPriority.map((risk: string, i: number) => <li key={i}>{risk}</li>)}
                      </ul>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </CardContent>
      </Card>
    );
  }

  return null;
}

export function CriticalThoughtQuestions(props: CriticalThoughtQuestionsProps) {
  return (
    <ErrorBoundary>
      <CriticalThoughtQuestionsContent {...props} />
    </ErrorBoundary>
  );
}
