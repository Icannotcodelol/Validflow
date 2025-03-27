import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { CompetitionData } from "@/types/sections";

interface Props {
  data: CompetitionData;
}

export function Competition({ data }: Props) {
  // Handle failed or missing data state
  if (data.status === 'failed' || (!data.directCompetitors && !data.indirectCompetitors)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Competition Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {data.error || 'Competition analysis could not be generated. Please try again.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const getThreatLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Competition Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Feature Comparison</TabsTrigger>
            <TabsTrigger value="positioning">Market Positioning</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {data.directCompetitors && data.directCompetitors.length > 0 && (
              <div>
                <h3 className="font-semibold mb-4">Direct Competitors</h3>
                <div className="grid gap-4">
                  {data.directCompetitors.map((competitor, index) => (
                    <div key={index} className="p-6 bg-muted rounded-lg space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{competitor.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{competitor.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {competitor.marketShare && (
                            <Badge variant="outline">
                              Market Share: {competitor.marketShare}
                            </Badge>
                          )}
                          {competitor.marketPosition && (
                            <Badge variant="secondary">
                              {competitor.marketPosition.pricingTier} / {competitor.marketPosition.featureTier}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-medium mb-2">Strengths</h5>
                          <ul className="space-y-1">
                            {competitor.strengths.map((strength, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start space-x-2">
                                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0" />
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium mb-2">Weaknesses</h5>
                          <ul className="space-y-1">
                            {competitor.weaknesses.map((weakness, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start space-x-2">
                                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0" />
                                <span>{weakness}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {competitor.pricing && (
                        <div>
                          <h5 className="text-sm font-medium mb-2">Pricing</h5>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <span className="text-sm text-muted-foreground">Model:</span>
                              <p className="font-medium">{competitor.pricing.model}</p>
                            </div>
                            {competitor.pricing.startingPrice && (
                              <div>
                                <span className="text-sm text-muted-foreground">Starting at:</span>
                                <p className="font-medium">{competitor.pricing.startingPrice}</p>
                              </div>
                            )}
                            {competitor.pricing.enterprise && (
                              <div>
                                <span className="text-sm text-muted-foreground">Enterprise:</span>
                                <p className="font-medium">{competitor.pricing.enterprise}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.indirectCompetitors && data.indirectCompetitors.length > 0 && (
              <div>
                <h3 className="font-semibold mb-4">Indirect Competitors</h3>
                <div className="grid gap-4">
                  {data.indirectCompetitors.map((competitor, index) => (
                    <div key={index} className="p-6 bg-muted rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{competitor.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{competitor.description}</p>
                          {competitor.overlapAreas && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {competitor.overlapAreas.map((area, i) => (
                                <Badge key={i} variant="outline">{area}</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <Badge className={getThreatLevelColor(competitor.threatLevel)}>
                          {competitor.threatLevel} Threat
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="features">
            {data.featureComparison ? (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Feature</TableHead>
                      {data.directCompetitors?.map((competitor) => (
                        <TableHead key={competitor.name}>{competitor.name}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.featureComparison.features.map((feature) => (
                      <TableRow key={feature}>
                        <TableCell className="font-medium">{feature}</TableCell>
                        {data.directCompetitors?.map((competitor) => (
                          <TableCell key={competitor.name}>
                            {competitor.features?.[feature]?.supported ? (
                              <span className="text-green-600">✓</span>
                            ) : (
                              <span className="text-red-600">✗</span>
                            )}
                            {competitor.features?.[feature]?.notes && (
                              <span className="text-xs text-muted-foreground ml-2">
                                ({competitor.features[feature].notes})
                              </span>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No feature comparison data available
              </div>
            )}
          </TabsContent>

          <TabsContent value="positioning">
            {data.marketPositioning ? (
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid />
                    <XAxis 
                      type="number" 
                      dataKey="x" 
                      name={data.marketPositioning.axisX.label}
                      domain={[0, 100]}
                      label={{ 
                        value: data.marketPositioning.axisX.label,
                        position: 'bottom'
                      }}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="y" 
                      name={data.marketPositioning.axisY.label}
                      domain={[0, 100]}
                      label={{ 
                        value: data.marketPositioning.axisY.label,
                        angle: -90,
                        position: 'left'
                      }}
                    />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }}
                      content={({ payload }) => {
                        if (payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-2 border rounded shadow-sm">
                              <p className="font-medium">{data.competitor}</p>
                              <p className="text-sm text-muted-foreground">
                                {data.marketPositioning.axisX.label}: {data.x}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {data.marketPositioning.axisY.label}: {data.y}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Scatter 
                      data={data.marketPositioning.positions} 
                      fill="#8884d8"
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No market positioning data available
              </div>
            )}
          </TabsContent>
        </Tabs>

        {data.competitiveAdvantages && data.competitiveAdvantages.length > 0 && (
          <div className="mt-8">
            <h3 className="font-semibold mb-4">Our Competitive Advantages</h3>
            <div className="space-y-2">
              {data.competitiveAdvantages.map((advantage, index) => (
                <div key={index} className="flex items-start space-x-2 p-3 bg-muted rounded-lg">
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-sm">{advantage}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.marketGaps && data.marketGaps.length > 0 && (
          <div className="mt-8">
            <h3 className="font-semibold mb-4">Market Gaps & Opportunities</h3>
            <div className="space-y-2">
              {data.marketGaps.map((gap, index) => (
                <div key={index} className="flex items-start space-x-2 p-3 bg-muted rounded-lg">
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                  <span className="text-sm">{gap}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 