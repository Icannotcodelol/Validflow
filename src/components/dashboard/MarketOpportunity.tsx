import { BarChart3, TrendingUp, Users, Target, LineChart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MarketResearch } from "@/lib/models/analysis"

interface MarketStatProps {
  title: string
  value: string
  description: string
  trend: string
  icon: React.ReactNode
}

function MarketStat({ title, value, description, trend, icon }: MarketStatProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="pl-10">
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="text-sm text-primary mt-1">{trend}</p>
      </div>
    </div>
  )
}

interface MarketOpportunityProps {
  data: MarketResearch
}

export default function MarketOpportunity({ data }: MarketOpportunityProps) {
  const targetSegments = [
    {
      name: "Fitness Enthusiasts (25-40)",
      size: "45%",
      description: "Tech-savvy individuals seeking personalized workout guidance",
      characteristics: [
        "High disposable income",
        "Values convenience and personalization",
        "Active social media users",
        "Health-conscious lifestyle",
      ],
    },
    {
      name: "Busy Professionals (30-50)",
      size: "30%",
      description: "Time-constrained professionals looking for efficient workout solutions",
      characteristics: [
        "Limited time for exercise",
        "Willing to pay for convenience",
        "Goal-oriented mindset",
        "Interested in data-driven approaches",
      ],
    },
    {
      name: "Fitness Beginners (18-35)",
      size: "25%",
      description: "Newcomers to fitness seeking guidance and motivation",
      characteristics: [
        "Price-sensitive",
        "Need more guidance and support",
        "Motivated by progress tracking",
        "Prefer structured programs",
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Market Size</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.marketSize.total}</div>
            <p className="text-xs text-muted-foreground">Growth: {data.marketSize.growth}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Addressable Market</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.marketSize.addressable}</div>
            <p className="text-xs text-muted-foreground">Of total market</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Obtainable Market</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.marketSize.obtainable}</div>
            <p className="text-xs text-muted-foreground">Realistic target</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Trends</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.trends.length}</div>
            <p className="text-xs text-muted-foreground">Key trends identified</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Market Trends Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {data.trends.map((trend, index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-medium">{trend.name}</h3>
                <p className="text-sm text-muted-foreground">{trend.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div>
                    <p className="text-sm font-medium mb-1">Impact</p>
                    <p className="text-sm text-muted-foreground">{trend.impact}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Timeframe</p>
                    <p className="text-sm text-muted-foreground">{trend.timeframe}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Source</p>
                    <p className="text-sm text-muted-foreground">{trend.source}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm font-medium mb-1">Opportunities</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {trend.opportunities.map((opportunity, i) => (
                        <li key={i} className="text-sm text-muted-foreground">{opportunity}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Threats</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {trend.threats.map((threat, i) => (
                        <li key={i} className="text-sm text-muted-foreground">{threat}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Market Size & Growth</CardTitle>
          <CardDescription>Key market statistics and growth indicators</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-8">
          <div className="grid gap-6 md:grid-cols-3">
            <MarketStat
              title="Total Addressable Market"
              value="$14.7B"
              description="Global fitness app market size by 2028"
              trend="Growing at 21.1% CAGR"
              icon={<BarChart3 className="h-4 w-4 text-primary" />}
            />
            <MarketStat
              title="Market Growth Rate"
              value="21.1%"
              description="Compound Annual Growth Rate (2021-2028)"
              trend="Accelerated by digital transformation"
              icon={<TrendingUp className="h-4 w-4 text-primary" />}
            />
            <MarketStat
              title="Target Users"
              value="85M"
              description="Potential users in primary markets"
              trend="42% year-over-year growth"
              icon={<Users className="h-4 w-4 text-primary" />}
            />
          </div>

          <div>
            <h3 className="font-semibold mb-4">Target Market Segments</h3>
            <div className="grid gap-4">
              {targetSegments.map((segment, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{segment.name}</h4>
                    <div className="text-sm font-medium text-primary">{segment.size}</div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{segment.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {segment.characteristics.map((characteristic, charIndex) => (
                      <div
                        key={charIndex}
                        className="text-sm flex items-center gap-2 text-muted-foreground"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {characteristic}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 