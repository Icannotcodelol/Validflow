"use client"

import { useState } from "react"
import { DollarSign, TrendingUp, Users, Wallet, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { DetailedAnalysis } from "@/lib/models/analysis"

interface MetricProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
}

interface FinancialProjectionsProps {
  data: DetailedAnalysis["financialAnalysis"]
}

function MetricCard({ title, value, description, icon }: MetricProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface ProjectionRowProps {
  year: string
  users: string
  revenue: string
  costs: string
  profit: string
}

function ProjectionRow({ year, users, revenue, costs, profit }: ProjectionRowProps) {
  return (
    <div className="grid grid-cols-5 gap-4 py-4 border-b last:border-0">
      <div className="font-medium">{year}</div>
      <div>{users}</div>
      <div>{revenue}</div>
      <div>{costs}</div>
      <div className="font-medium text-primary">{profit}</div>
    </div>
  )
}

export default function FinancialProjections({ data }: FinancialProjectionsProps) {
  const [subscriptionPrice, setSubscriptionPrice] = useState(19.99)
  const [conversionRate, setConversionRate] = useState(5)
  const [churnRate, setChurnRate] = useState(8)

  // Use data from props or fallback to defaults
  const financials = data || {
    revenueStreams: [],
    costStructure: {
      fixed: [],
      variable: [],
      unitEconomics: {
        cac: '$35',
        ltv: '$220',
        margin: '60%',
        paybackPeriod: '6 months',
        breakEvenPoint: '1,000 customers'
      }
    },
    projections: {
      year1: "",
      year3: "",
      breakeven: ""
    }
  }

  // Calculate projections based on slider values
  const calculateProjections = (price: number, conversion: number, churn: number) => {
    const monthlyUsers = [1000, 5000, 20000] // Year 1, 2, 3 base users
    const results = monthlyUsers.map((users, index) => {
      const paidUsers = users * (conversion / 100)
      const retentionRate = 1 - (churn / 100)
      const activeUsers = paidUsers * Math.pow(retentionRate, index)
      const revenue = activeUsers * price * 12 // Annual revenue

      return {
        year: `Year ${index + 1}`,
        users: Math.round(activeUsers).toLocaleString(),
        revenue: `$${Math.round(revenue).toLocaleString()}`,
        costs: `$${Math.round(revenue * 0.6).toLocaleString()}`, // Assuming 60% costs
        profit: `$${Math.round(revenue * 0.4).toLocaleString()}`, // Assuming 40% profit
      }
    })

    return {
      conservative: results[0],
      moderate: results[1],
      optimistic: results[2],
    }
  }

  const projections = calculateProjections(subscriptionPrice, conversionRate, churnRate)

  const handleSubscriptionPriceChange = (values: number[]) => {
    setSubscriptionPrice(values[0])
  }

  const handleConversionRateChange = (values: number[]) => {
    setConversionRate(values[0])
  }

  const handleChurnRateChange = (values: number[]) => {
    setChurnRate(values[0])
  }

  const assumptions = [
    "10% monthly user growth rate",
    "15% conversion rate to premium",
    "Average revenue per user: $15/month",
    "Marketing costs: 30% of revenue",
    "Operating costs: 40% of revenue",
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Year 1 Projection</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financials.projections.year1}</div>
            <p className="text-xs text-muted-foreground">First year revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Year 3 Projection</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financials.projections.year3}</div>
            <p className="text-xs text-muted-foreground">Third year revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Break-even Point</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financials.projections.breakeven}</div>
            <p className="text-xs text-muted-foreground">Expected timeline</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Streams</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {financials.revenueStreams.map((stream, index) => (
                <li key={index} className="text-sm text-muted-foreground">
                  {stream}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Fixed Costs</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {financials.costStructure.fixed.map((cost, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {cost}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Variable Costs</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {financials.costStructure.variable.map((cost, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {cost}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Unit Economics</h4>
                <p className="text-sm text-muted-foreground">
                  {financials.costStructure.unitEconomics.cac}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Calculator</CardTitle>
          <CardDescription>Adjust parameters to see different scenarios</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Monthly Subscription Price</Label>
                <span className="font-medium">${subscriptionPrice.toFixed(2)}</span>
              </div>
              <Slider
                value={[subscriptionPrice]}
                onValueChange={handleSubscriptionPriceChange}
                min={4.99}
                max={39.99}
                step={1}
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Free to Paid Conversion Rate</Label>
                <span className="font-medium">{conversionRate}%</span>
              </div>
              <Slider
                value={[conversionRate]}
                onValueChange={handleConversionRateChange}
                min={1}
                max={15}
                step={0.5}
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Monthly Churn Rate</Label>
                <span className="font-medium">{churnRate}%</span>
              </div>
              <Slider
                value={[churnRate]}
                onValueChange={handleChurnRateChange}
                min={2}
                max={15}
                step={0.5}
              />
            </div>
          </div>

          <div className="grid gap-4">
            <h3 className="font-semibold">Year 3 Projections</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Conservative</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projections.conservative.revenue}</div>
                  <p className="text-xs text-muted-foreground">
                    {projections.conservative.users} paid users
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Moderate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projections.moderate.revenue}</div>
                  <p className="text-xs text-muted-foreground">
                    {projections.moderate.users} paid users
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Optimistic</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{projections.optimistic.revenue}</div>
                  <p className="text-xs text-muted-foreground">
                    {projections.optimistic.users} paid users
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Unit Economics</CardTitle>
          <CardDescription>Key metrics and ratios</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <h4 className="font-medium">Customer Acquisition Cost</h4>
            <div className="text-2xl font-bold">{financials.costStructure.unitEconomics.cac}</div>
            <p className="text-sm text-muted-foreground">Average cost to acquire a user</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Customer Lifetime Value</h4>
            <div className="text-2xl font-bold">{financials.costStructure.unitEconomics.ltv}</div>
            <p className="text-sm text-muted-foreground">Average value over customer lifetime</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Profit Margin</h4>
            <div className="text-2xl font-bold">{financials.costStructure.unitEconomics.margin}</div>
            <p className="text-sm text-muted-foreground">Average profit per customer</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Payback Period</h4>
            <div className="text-2xl font-bold">{financials.costStructure.unitEconomics.paybackPeriod}</div>
            <p className="text-sm text-muted-foreground">Time to recover CAC</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Break-Even Point</h4>
            <div className="text-2xl font-bold">{financials.costStructure.unitEconomics.breakEvenPoint}</div>
            <p className="text-sm text-muted-foreground">Customers needed for profitability</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3-Year Projections</CardTitle>
          <CardDescription>Financial forecasts and key metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="grid grid-cols-5 gap-4 text-sm text-muted-foreground mb-2">
                <div>Year</div>
                <div>Users</div>
                <div>Revenue</div>
                <div>Costs</div>
                <div>Net Profit</div>
              </div>
              <ProjectionRow {...projections.conservative} />
              <ProjectionRow {...projections.moderate} />
              <ProjectionRow {...projections.optimistic} />
            </div>

            <div>
              <h4 className="font-medium mb-3">Key Assumptions</h4>
              <div className="grid gap-2">
                {assumptions.map((assumption, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {assumption}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 