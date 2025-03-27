import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FinancialProjections as FinancialProjectionsType } from "@/lib/models/analysis";

interface FinancialProjectionsProps {
  data: FinancialProjectionsType;
}

export function FinancialProjections({ data }: FinancialProjectionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Projections</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div>
            <h3 className="font-semibold mb-2">Revenue Streams</h3>
            <div className="grid gap-4">
              {data.revenueStreams.map((stream, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">{stream.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{stream.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Year 1</p>
                      <p className="font-medium">{stream.year1}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Year 3</p>
                      <p className="font-medium">{stream.year3}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Cost Structure</h3>
            <div className="grid gap-4">
              {data.costStructure.map((cost, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">{cost.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{cost.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Year 1</p>
                      <p className="font-medium">{cost.year1}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Year 3</p>
                      <p className="font-medium">{cost.year3}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Key Metrics</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Breakeven Point</p>
                <p className="text-lg font-semibold">{data.keyMetrics.breakevenPoint}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Gross Margin</p>
                <p className="text-lg font-semibold">{data.keyMetrics.grossMargin}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Net Margin</p>
                <p className="text-lg font-semibold">{data.keyMetrics.netMargin}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Unit Economics</h3>
            <div className="grid gap-4">
              {data.unitEconomics.map((metric, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">{metric.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{metric.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Current</p>
                      <p className="font-medium">{metric.current}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Target</p>
                      <p className="font-medium">{metric.target}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 