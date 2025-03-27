import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketResearch } from "@/lib/models/analysis";

interface MarketOpportunityProps {
  data: MarketResearch;
}

export function MarketOpportunity({ data }: MarketOpportunityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Opportunity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div>
            <h3 className="font-semibold mb-2">Market Size</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Market</p>
                <p className="text-lg font-semibold">{data.marketSize.total}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Addressable Market</p>
                <p className="text-lg font-semibold">{data.marketSize.addressable}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Obtainable Market</p>
                <p className="text-lg font-semibold">{data.marketSize.obtainable}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Target Segments</h3>
            <div className="grid gap-4">
              {data.demographics.segmentDetails.map((segment, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">{segment.name}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Characteristics</p>
                      <ul className="list-disc list-inside">
                        {segment.characteristics.map((char, i) => (
                          <li key={i} className="text-sm">{char}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pain Points</p>
                      <ul className="list-disc list-inside">
                        {segment.painPoints.map((point, i) => (
                          <li key={i} className="text-sm">{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Market Trends</h3>
            <div className="grid gap-4">
              {data.trends.map((trend, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">{trend.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{trend.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Opportunities</p>
                      <ul className="list-disc list-inside">
                        {trend.opportunities.map((opp, i) => (
                          <li key={i} className="text-sm">{opp}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Threats</p>
                      <ul className="list-disc list-inside">
                        {trend.threats.map((threat, i) => (
                          <li key={i} className="text-sm">{threat}</li>
                        ))}
                      </ul>
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