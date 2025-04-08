import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketingChannelsData } from "@/types/sections";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Info, AlertCircle } from "lucide-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface MarketingChannelsProps {
  data?: MarketingChannelsData;
  status: 'pending' | 'completed' | 'failed';
  error?: string;
}

function MarketingChannelsContent({ data, status, error }: MarketingChannelsProps) {
  console.log('MarketingChannels - Rendering with:', { status, error, data });

  if (status === 'pending') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Marketing Channel Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
            Generating marketing channels analysis...
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (status === 'failed') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Marketing Channel Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || 'Failed to load marketing channels data.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (status === 'completed' && (!data || !data.channels || data.channels.length === 0)) {
    console.warn('[MarketingChannels] Completed status but missing data or channels.', data);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Marketing Channel Strategy</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="default"> 
            <Info className="h-4 w-4" />
            <AlertDescription>
              {error ? `Error: ${error}` : 'No marketing channels data available or the structure is incorrect.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  if (status === 'completed' && data && data.channels) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Marketing Channel Strategy</CardTitle>
            <CardDescription>
              Overview of marketing channels and their performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {/* Channel Strategies */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Channel Strategies</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {data.channels.map((channel, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">{channel.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{channel.description}</p>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Type:</span> {channel.type}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Budget:</span> {channel.budget}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Timeline:</span> {channel.timeline}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Metrics */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {data.channels.map((channel, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">{channel.name}</h4>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Reach:</span> {channel.metrics.reach}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Cost:</span> {channel.metrics.cost}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">ROI:</span> {channel.metrics.roi}
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">Conversion:</span> {channel.metrics.conversionRate}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Budget Breakdown */}
              {data.budget && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Budget Breakdown</h3>
                  <div className="space-y-4">
                    <div className="text-sm">
                      <span className="font-medium">Total Budget:</span> {data.budget.total}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Timeline:</span> {data.budget.timeline}
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {data.budget.breakdown.map((item, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">{item.category}</h4>
                          <div className="space-y-2">
                            <div className="text-sm">
                              <span className="font-medium">Amount:</span> {item.amount}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Percentage:</span> {item.percentage}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {data.recommendations && data.recommendations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {data.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Analysis */}
              {data.analysis && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Analysis</h3>
                  <p className="text-sm whitespace-pre-wrap">{data.analysis}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export function MarketingChannels(props: MarketingChannelsProps) {
  return (
    <ErrorBoundary>
      <MarketingChannelsContent {...props} />
    </ErrorBoundary>
  );
} 