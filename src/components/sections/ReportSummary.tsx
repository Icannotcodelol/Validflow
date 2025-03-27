import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReportSummaryData {
  overallAssessment?: string;
  keyRecommendations?: string[];
  nextSteps?: string[];
  riskLevel?: 'High' | 'Medium' | 'Low';
  confidenceScore?: number;
  status: 'pending' | 'completed' | 'failed';
  error?: string;
}

interface ReportSummaryProps {
  data: ReportSummaryData;
}

export function ReportSummary({ data }: ReportSummaryProps) {
  console.log('ReportSummary - Rendering with data:', data);

  // Early return if data is invalid or has error
  if (!data || data.status === 'failed' || data.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Report Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">
            {data?.error || 'This section could not be generated. Please try again.'}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Early return if no assessment is available
  if (!data.overallAssessment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Report Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">
            No summary data is available for this section.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Overall Assessment</h3>
            <p className="text-muted-foreground">{data.overallAssessment}</p>
          </div>

          {data.keyRecommendations && data.keyRecommendations.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4">Key Recommendations</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                {data.keyRecommendations.map((recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                ))}
              </ul>
            </div>
          )}

          {data.nextSteps && data.nextSteps.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4">Next Steps</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                {data.nextSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
          )}

          {data.riskLevel && (
            <div>
              <h3 className="font-semibold mb-4">Risk Assessment</h3>
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Risk Level:</span>
                  <span className={`text-sm px-2 py-1 rounded ${
                    data.riskLevel === 'High' ? 'bg-red-100 text-red-800' :
                    data.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {data.riskLevel}
                  </span>
                </div>
                {data.confidenceScore !== undefined && (
                  <div className="text-sm text-muted-foreground">
                    Confidence Score: {data.confidenceScore}%
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 