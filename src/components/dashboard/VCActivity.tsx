import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trend, VCInvestment } from "@/lib/models/analysis"

interface VCActivityProps {
  data: {
    trends: Trend[];
    vcActivity: VCInvestment;
  }
}

export default function VCActivity({ data }: VCActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Trends & VC Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div>
            <h3 className="font-semibold mb-4">Investment Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-1">Active VCs</p>
                <p className="text-2xl font-bold">{data.vcActivity.activeVCs}+</p>
                <p className="text-sm text-muted-foreground">in {data.trends[0]?.name || "the industry"}</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-1">Total Investment</p>
                <p className="text-2xl font-bold">{data.vcActivity.totalInvestment}</p>
                <p className="text-sm text-muted-foreground">Last 12 months</p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-1">Average Deal Size</p>
                <p className="text-2xl font-bold">{data.vcActivity.averageDealSize}</p>
                <p className="text-sm text-muted-foreground">Recent rounds</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Notable Recent Deals</h4>
              <div className="space-y-3">
                {data.vcActivity.notableDeals.map((deal, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">{deal.company}</p>
                      <p className="text-sm text-muted-foreground">by {deal.investor}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{deal.amount}</p>
                      <p className="text-sm text-muted-foreground">{deal.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Market Trends</h3>
            <div className="space-y-6">
              {data.trends.map((trend, index) => (
                <div key={index} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{trend.name}</h3>
                    <Badge variant={trend.impact === "High" ? "destructive" : "default"}>
                      {trend.impact} Impact
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{trend.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Opportunities</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {trend.opportunities.map((opportunity, i) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            {opportunity}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Threats</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {trend.threats.map((threat, i) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            {threat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>Timeframe: {trend.timeframe}</span>
                    <span>•</span>
                    <span>Source: {trend.source}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 