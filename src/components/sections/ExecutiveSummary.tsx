import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import type { ExecutiveSummaryData } from "@/types/sections";

interface ExecutiveSummaryProps {
  data?: ExecutiveSummaryData;
  status: 'pending' | 'completed' | 'failed';
  error?: string;
}

function ExecutiveSummaryContent({ data, status, error }: ExecutiveSummaryProps) {
  console.log('ExecutiveSummary - Rendering with:', { status, error, data });

  if (status === 'pending') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
            Generating summary...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === 'failed') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">
            {error || 'This section could not be generated. Please try again.'}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === 'completed' && (!data || !data.summary)) {
    console.warn('[ExecutiveSummary] Completed status but missing data or summary.', data);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Executive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">
            {error ? `Error: ${error}` : 'No summary data is available for this section, or the data structure is incorrect.'}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === 'completed' && data) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Executive Summary</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {data?.title && (
            <div>
              <h3 className="font-semibold mb-2">Project</h3>
              <p className="text-muted-foreground">{data.title}</p>
            </div>
          )}

          {data?.score !== undefined && (
            <div>
              <h3 className="font-semibold mb-2">Viability Score</h3>
              <div className="flex items-center gap-2">
                <div className={`text-lg font-semibold ${
                  data.score >= 80 ? 'text-green-600' :
                  data.score >= 60 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {data.score}/100
                </div>
                {data.verdict && (
                  <span className="text-muted-foreground capitalize">
                    ({data.verdict})
                  </span>
                )}
              </div>
            </div>
          )}

          {data?.summary && (
            <div>
              <h3 className="font-semibold mb-2">Summary</h3>
              <p className="text-muted-foreground">{data.summary}</p>
            </div>
          )}

          {data?.keyFindings && data.keyFindings.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4">Key Findings</h3>
              <div className="grid gap-3">
                {data.keyFindings.map((finding: { type: 'strength' | 'weakness' | 'opportunity' | 'threat'; text: string }, index: number) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg ${
                      finding.type === 'strength' ? 'bg-green-50 text-green-900' :
                      finding.type === 'weakness' ? 'bg-red-50 text-red-900' :
                      finding.type === 'opportunity' ? 'bg-blue-50 text-blue-900' :
                      'bg-yellow-50 text-yellow-900'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium capitalize">
                        {finding.type}
                      </span>
                    </div>
                    <p className="text-sm">{finding.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
}

export function ExecutiveSummary(props: ExecutiveSummaryProps) {
  return (
    <ErrorBoundary>
      <ExecutiveSummaryContent {...props} />
    </ErrorBoundary>
  );
} 