import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";
import type { MarketSizeGrowth as MarketSizeGrowthData, BaseSectionResponse } from "@/lib/ai/models";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface MarketSizeGrowthProps extends BaseSectionResponse {
  data?: MarketSizeGrowthData['data'];
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

  if (status === 'completed' && (!data || !data.totalAddressableMarket || !data.growthRate)) {
    console.warn('[MarketSizeGrowth] Completed status but missing essential data fields (TAM, GrowthRate).', data);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Size & Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="default">
            <Info className="h-4 w-4" />
            <AlertDescription>
              {error ? `Error: ${error}` : 'Market size data is incomplete or the structure is incorrect.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (status === 'completed' && data) {
    const { 
      totalAddressableMarket,
      serviceableAddressableMarket,
      serviceableObtainableMarket,
      growthRate,
      marketTrends,
      marketDrivers,
      marketChallenges
    } = data;

    const displayRate = growthRate?.current || growthRate?.projected || "N/A";
    const displayDrivers = growthRate?.factors?.join('; ') || "No specific drivers listed.";
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Size & Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Total Market Size (TAM)</h3>
                {totalAddressableMarket?.size && 
                  <p className="text-lg font-semibold text-primary mb-1">{totalAddressableMarket.size}</p>
                }
                {totalAddressableMarket?.description && 
                   <p className="text-sm text-muted-foreground">{totalAddressableMarket.description}</p>
                }
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Growth Rate & Drivers</h3>
                <p className="text-2xl font-bold text-primary mb-2">{displayRate}</p>
                <p className="text-sm text-muted-foreground">{displayDrivers}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 text-lg">Market Breakdown</h3>
              <div className="grid gap-4 md:grid-cols-1">
                <div className="p-4 bg-muted rounded-lg border">
                  <h4 className="font-medium mb-1 text-base">Serviceable Addressable Market (SAM)</h4>
                  {serviceableAddressableMarket?.size && 
                    <p className="text-md font-semibold text-primary mb-2">{serviceableAddressableMarket.size}</p>
                  }
                  {serviceableAddressableMarket?.description && 
                    <p className="text-sm text-muted-foreground mb-2">{serviceableAddressableMarket.description}</p>
                  }
                  {serviceableAddressableMarket?.limitations && serviceableAddressableMarket.limitations.length > 0 && (
                     <div>
                        <p className="text-xs font-medium text-muted-foreground">Limitations:</p>
                        <ul className="list-disc list-inside text-xs text-muted-foreground">
                          {serviceableAddressableMarket.limitations.map((limitation: string, i: number) => <li key={i}>{limitation}</li>)}
                        </ul>
                     </div>
                  )}
                </div>
                <div className="p-4 bg-muted rounded-lg border">
                  <h4 className="font-medium mb-1 text-base">Serviceable Obtainable Market (SOM)</h4>
                   {serviceableObtainableMarket?.size && 
                    <p className="text-md font-semibold text-primary mb-2">{serviceableObtainableMarket.size}</p>
                  }
                  {serviceableObtainableMarket?.description && 
                    <p className="text-sm text-muted-foreground mb-2">{serviceableObtainableMarket.description}</p>
                  }
                  {serviceableObtainableMarket?.timeframe && 
                    <p className="text-xs text-muted-foreground mb-2">Timeframe: {serviceableObtainableMarket.timeframe}</p>
                  }
                   {serviceableObtainableMarket?.assumptions && serviceableObtainableMarket.assumptions.length > 0 && (
                     <div>
                        <p className="text-xs font-medium text-muted-foreground">Assumptions:</p>
                        <ul className="list-disc list-inside text-xs text-muted-foreground">
                          {serviceableObtainableMarket.assumptions.map((assumption: string, i: number) => <li key={i}>{assumption}</li>)}
                        </ul>
                     </div>
                  )}
                </div>
              </div>
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