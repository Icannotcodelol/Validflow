import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ReportSummaryData } from "@/types/sections";

interface ReportSummaryProps {
  data?: ReportSummaryData;
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

  if (status === 'completed' && (!data || !data.summary)) {
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
    return (
      <Card>
        <CardHeader>
          <CardTitle>Report Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Summary */}
            <div>
              <h3 className="font-semibold mb-4">Summary</h3>
              <div className="p-6 bg-muted rounded-lg">
                <p className="text-muted-foreground whitespace-pre-wrap">{data.summary}</p>
              </div>
            </div>

            {/* Key Findings */}
            {data.keyFindings && data.keyFindings.length > 0 && (
              <div>
                <h3 className="font-semibold mb-4">Key Findings</h3>
                <div className="p-6 bg-muted rounded-lg">
                  <ul className="list-disc list-inside space-y-2">
                    {data.keyFindings.map((finding, index) => (
                      <li key={index} className="text-muted-foreground">{finding}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Recommendations */}
            {data.recommendations && data.recommendations.length > 0 && (
              <div>
                <h3 className="font-semibold mb-4">Recommendations</h3>
                <div className="grid gap-4">
                  {data.recommendations.map((rec, index) => (
                    <div key={index} className="p-6 bg-muted rounded-lg">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium">{rec.category}</h4>
                        <Badge className={getPriorityColor(rec.priority)}>
                          {rec.priority} Priority
                        </Badge>
                      </div>
                      <ul className="list-disc list-inside space-y-2">
                        {rec.items.map((item, i) => (
                          <li key={i} className="text-muted-foreground">{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Steps */}
            {data.nextSteps && data.nextSteps.length > 0 && (
              <div>
                <h3 className="font-semibold mb-4">Next Steps</h3>
                <div className="grid gap-4">
                  {data.nextSteps.map((step, index) => (
                    <div key={index} className="p-6 bg-muted rounded-lg">
                      <h4 className="font-medium mb-3">{step.action}</h4>
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Timeline:</span> {step.timeline}
                        </div>
                        {step.resources && step.resources.length > 0 && (
                          <div>
                            <span className="text-sm font-medium">Required Resources:</span>
                            <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                              {step.resources.map((resource, i) => (
                                <li key={i}>{resource}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
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