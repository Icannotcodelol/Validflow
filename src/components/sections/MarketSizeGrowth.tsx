import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { MarketSizeGrowthData } from "@/types/sections";

interface Props {
  data: MarketSizeGrowthData;
}

export function MarketSizeGrowth({ data }: Props) {
  // Handle failed or missing data state
  if (data.status === 'failed' || !data.marketSize) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Size & Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {data.error || 'Market size and growth data could not be generated. Please try again.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

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
              <p className="text-2xl font-bold text-primary mb-1">{data.marketSize.total}</p>
              <p className="text-sm text-muted-foreground">{data.marketSize.analysis}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Growth Rate</h3>
              <p className="text-2xl font-bold text-primary mb-1">{data.marketSize.growth}</p>
              <p className="text-sm text-muted-foreground">Annual growth rate</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Market Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span>Serviceable Addressable Market (SAM)</span>
                  <span className="font-medium">{data.marketSize.addressable}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span>Serviceable Obtainable Market (SOM)</span>
                  <span className="font-medium">{data.marketSize.obtainable}</span>
                </div>
              </div>
            </div>

            {data.marketSize.projections && data.marketSize.projections.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Growth Projections</h3>
                <div className="space-y-2">
                  {data.marketSize.projections.map((projection, index) => (
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