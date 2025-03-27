"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MarketDynamics } from "@/lib/models/analysis"

interface BarriersToEntryProps {
  data: MarketDynamics
}

export default function BarriersToEntry({ data }: BarriersToEntryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Entry Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          <div>
            <h3 className="font-semibold mb-4">Entry Barriers</h3>
            <div className="space-y-4">
              {data.entryBarriers.map((barrier, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{barrier.barrier}</h4>
                    <Badge variant={barrier.impact === "High" ? "destructive" : "default"}>
                      {barrier.impact} Impact
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{barrier.mitigation}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">Market Forces</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Supplier Power</h4>
                  <p className="text-sm text-muted-foreground">{data.supplierPower}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Buyer Power</h4>
                  <p className="text-sm text-muted-foreground">{data.buyerPower}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Industry Rivalry</h4>
                  <p className="text-sm text-muted-foreground">{data.industryRivalry}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Substitutes</h3>
              <ul className="list-disc pl-5 space-y-1">
                {data.substitutes.map((substitute, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    {substitute}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 