import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CriticalThoughtQuestionsData } from "@/types/sections";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface CriticalThoughtQuestionsProps {
  data?: CriticalThoughtQuestionsData;
  status: 'pending' | 'completed' | 'failed';
  error?: string;
}

const getPriorityColor = (priority?: string) => {
  if (!priority) return 'bg-gray-100 text-gray-800';
  switch (priority.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

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

  if (status === 'completed' && data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Critical Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Critical Questions */}
          <div className="space-y-6">
            {data.questions.map((item, index) => (
              <div key={index} className="p-6 bg-muted rounded-lg space-y-4">
                {/* Question Header */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">{item.category}</div>
                    <h3 className="font-medium">{item.question}</h3>
                  </div>
                  <Badge className={getPriorityColor(item.priority)}>
                    {item.priority} Priority
                  </Badge>
                </div>

                {/* Analysis */}
                <div className="text-sm text-muted-foreground">
                  {item.analysis}
                </div>

                {/* Implications & Recommendations */}
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Implications */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Implications</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {item.implications.map((imp, i) => (
                        <li key={i} className="text-muted-foreground">{imp}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {item.recommendations.map((rec, i) => (
                        <li key={i} className="text-muted-foreground">{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Risk Assessment */}
          <div>
            <h3 className="font-semibold mb-4">Risk Assessment</h3>
            <div className="grid gap-4">
              {data.riskAssessment && (
                <>
                  {/* High Priority Risks */}
                  {data.riskAssessment.highPriority.length > 0 && (
                    <div className="p-4 bg-red-50 rounded-lg">
                      <h4 className="font-medium text-red-800 mb-2">High Priority</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {data.riskAssessment.highPriority.map((risk, i) => (
                          <li key={i} className="text-red-700">{risk}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Medium Priority Risks */}
                  {data.riskAssessment.mediumPriority.length > 0 && (
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium text-yellow-800 mb-2">Medium Priority</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {data.riskAssessment.mediumPriority.map((risk, i) => (
                          <li key={i} className="text-yellow-700">{risk}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Low Priority Risks */}
                  {data.riskAssessment.lowPriority.length > 0 && (
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">Low Priority</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {data.riskAssessment.lowPriority.map((risk, i) => (
                          <li key={i} className="text-green-700">{risk}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Action Items */}
          {data.actionItems && data.actionItems.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4">Action Items</h3>
              <div className="grid gap-4">
                {data.actionItems.map((item, index) => (
                  <div key={index} className="p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">{item.item}</div>
                      <Badge className={getPriorityColor(item.priority)}>
                        {item.priority} Priority
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Timeline: {item.timeline} • Owner: {item.owner}
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
