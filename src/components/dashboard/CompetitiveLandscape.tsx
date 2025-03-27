"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketResearch } from "@/lib/models/analysis";

interface CompetitiveLandscapeProps {
  data: MarketResearch["competitors"];
}

export default function CompetitiveLandscape({ data }: CompetitiveLandscapeProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Competitive Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {data.map((competitor, index) => (
              <div key={index} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{competitor.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{competitor.type}</Badge>
                      <Badge variant="secondary">Market Share: {competitor.marketShare}</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Strengths</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {competitor.strengths.map((strength, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Weaknesses</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {competitor.weaknesses.map((weakness, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Strategy</h4>
                    <p className="text-sm text-muted-foreground">{competitor.strategy}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Pricing</h4>
                    <p className="text-sm text-muted-foreground">{competitor.pricing}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Key Differentiators</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {competitor.differentiators.map((differentiator, i) => (
                      <li key={i} className="text-sm text-muted-foreground">
                        {differentiator}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 