import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VCActivity as VCActivityType } from "@/lib/models/analysis";

interface VCActivityProps {
  data: VCActivityType;
}

export function VCActivity({ data }: VCActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>VC Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div>
            <h3 className="font-semibold mb-2">Market Overview</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Active VCs</p>
                <p className="text-lg font-semibold">{data.marketOverview.activeVCs}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Investment</p>
                <p className="text-lg font-semibold">{data.marketOverview.totalInvestment}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Average Deal Size</p>
                <p className="text-lg font-semibold">{data.marketOverview.averageDealSize}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Recent Deals</h3>
            <div className="grid gap-4">
              {data.recentDeals.map((deal, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{deal.company}</h4>
                    <span className="text-sm text-gray-600">{deal.date}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Round</p>
                      <p className="font-medium">{deal.round}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="font-medium">{deal.amount}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Lead Investors</p>
                    <p className="font-medium">{deal.leadInvestors.join(", ")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Investment Trends</h3>
            <div className="grid gap-4">
              {data.investmentTrends.map((trend, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">{trend.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{trend.description}</p>
                  <div>
                    <p className="text-sm font-medium mb-1">Key Points:</p>
                    <ul className="list-disc list-inside">
                      {trend.keyPoints.map((point, i) => (
                        <li key={i} className="text-sm">{point}</li>
                      ))}
                    </ul>
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