import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import type { MarketSizeGrowthData } from "@/types/sections";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface MarketSizeGrowthProps {
  data?: MarketSizeGrowthData;
  status: 'pending' | 'completed' | 'failed';
  error?: string;
}

function MarketSizeGrowthContent({ data, status, error }: MarketSizeGrowthProps) {
  console.log('MarketSizeGrowth - Rendering with:', { status, error, data });

  if (status === 'pending') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Size & Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
            Generating market analysis...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === 'failed') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Size & Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || 'Market size and growth data could not be generated. Please try again.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (status === 'completed' && (!data || !data.marketSize)) {
    console.warn('[MarketSizeGrowth] Completed status but missing data or marketSize.', data);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Size & Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="default">
            <Info className="h-4 w-4" />
            <AlertDescription>
              {error ? `Error: ${error}` : 'Market size data is unavailable or the structure is incorrect.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (status === 'completed' && data && data.marketSize) {
    const { marketSize } = data;
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Size & Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Total Market Size</h3>
                <p className="text-2xl font-bold text-primary mb-1">{marketSize.total}</p>
                <p className="text-sm text-muted-foreground">{marketSize.analysis}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Growth Rate</h3>
                <p className="text-2xl font-bold text-primary mb-1">{marketSize.growth}</p>
                <p className="text-sm text-muted-foreground">Annual growth rate</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Market Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span>Serviceable Addressable Market (SAM)</span>
                    <span className="font-medium">{marketSize.addressable}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span>Serviceable Obtainable Market (SOM)</span>
                    <span className="font-medium">{marketSize.obtainable}</span>
                  </div>
                </div>
              </div>

              {marketSize.projections && marketSize.projections.length > 0 && (
                <div>
                  <h3 className="font-medium mb-2">Growth Projections</h3>
                  <div className="space-y-2">
                    {marketSize.projections.map((projection, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <span>{projection.year}</span>
                        <span className="font-medium">{projection.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return null;
}

export function MarketSizeGrowth(props: MarketSizeGrowthProps) {
  return (
    <ErrorBoundary>
      <MarketSizeGrowthContent {...props} />
    </ErrorBoundary>
  );
} 