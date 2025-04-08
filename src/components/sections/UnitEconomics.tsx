import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UnitEconomicsData } from "@/types/sections";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";

interface UnitEconomicsProps {
  data?: UnitEconomicsData;
  status: 'pending' | 'completed' | 'failed';
  error?: string;
}

function UnitEconomicsContent({ data, status, error }: UnitEconomicsProps) {
  console.log('UnitEconomics - Rendering with:', { status, error, data });

  if (status === 'pending') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unit Economics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
            Generating unit economics analysis...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === 'failed') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unit Economics</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || 'Unit economics data could not be generated. Please try again.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (status === 'completed' && (!data || !data.pricing)) {
    console.warn('[UnitEconomics] Completed status but missing data or pricing.', data);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unit Economics</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="default">
            <Info className="h-4 w-4" />
            <AlertDescription>
              {error ? `Error: ${error}` : 'Unit economics data (pricing) is unavailable or the structure is incorrect.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (status === 'completed' && data && data.pricing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unit Economics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div>
              <h3 className="font-semibold mb-4">Pricing Model</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Model</h4>
                  <p className="text-muted-foreground">{data.pricing.model}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Strategy</h4>
                  <p className="text-muted-foreground">{data.pricing.strategy}</p>
                </div>
                {data.pricing.tiers && data.pricing.tiers.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Pricing Tiers</h4>
                    <div className="grid gap-4">
                      {data.pricing.tiers.map((tier, index) => (
                        <div key={index} className="p-4 bg-muted rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="font-medium">{tier.name}</h5>
                            <span className="text-muted-foreground">{tier.price}</span>
                          </div>
                          <ul className="list-disc list-inside text-sm text-muted-foreground">
                            {tier.features.map((feature, i) => (
                              <li key={i}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {data.costs && (
              <div>
                <h3 className="font-semibold mb-4">Cost Structure</h3>
                <div className="space-y-4">
                  {data.costs.fixed && data.costs.fixed.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Fixed Costs</h4>
                      <div className="grid gap-2">
                        {data.costs.fixed.map((cost, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span>{cost.name}</span>
                            <span className="text-muted-foreground">{cost.amount} ({cost.frequency})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {data.costs.variable && data.costs.variable.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Variable Costs</h4>
                      <div className="grid gap-2">
                        {data.costs.variable.map((cost, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span>{cost.name}</span>
                            <span className="text-muted-foreground">{cost.amount} per {cost.unit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {data.metrics && (
              <div>
                <h3 className="font-semibold mb-4">Key Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  {data.metrics.cac && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Customer Acquisition Cost</h4>
                      <p className="text-muted-foreground">{data.metrics.cac}</p>
                    </div>
                  )}
                  {data.metrics.ltv && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Lifetime Value</h4>
                      <p className="text-muted-foreground">{data.metrics.ltv}</p>
                    </div>
                  )}
                  {data.metrics.margin && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Contribution Margin</h4>
                      <p className="text-muted-foreground">{data.metrics.margin}</p>
                    </div>
                  )}
                  {data.metrics.paybackPeriod && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Payback Period</h4>
                      <p className="text-muted-foreground">{data.metrics.paybackPeriod}</p>
                    </div>
                  )}
                  {data.metrics.breakEvenPoint && (
                    <div>
                      <h4 className="text-sm font-medium mb-1">Break-Even Point</h4>
                      <p className="text-muted-foreground">{data.metrics.breakEvenPoint}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {data.projections && data.projections.length > 0 && (
              <div>
                <h3 className="font-semibold mb-4">Financial Projections</h3>
                <div className="space-y-4">
                  {data.projections.map((projection, index) => (
                    <div key={index} className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">{projection.period}</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <span className="text-sm text-muted-foreground">Revenue</span>
                          <p className="font-medium">{projection.revenue}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Costs</span>
                          <p className="font-medium">{projection.costs}</p>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Profit</span>
                          <p className="font-medium">{projection.profit}</p>
                        </div>
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

export function UnitEconomics(props: UnitEconomicsProps) {
  return (
    <ErrorBoundary>
      <UnitEconomicsContent {...props} />
    </ErrorBoundary>
  );
} 