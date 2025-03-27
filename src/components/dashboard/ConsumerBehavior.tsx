import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MarketResearch } from "@/lib/models/analysis"

interface ConsumerBehaviorProps {
  data: MarketResearch["demographics"]
}

export default function ConsumerBehavior({ data }: ConsumerBehaviorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Consumer Behavior Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-4">Primary Market Segments</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.primarySegments.map((segment, index) => (
                <div
                  key={index}
                  className="bg-muted/50 p-3 rounded-lg text-sm font-medium"
                >
                  {segment}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {data.segmentDetails.map((segment, index) => (
              <div key={index} className="space-y-4">
                <h3 className="font-semibold">{segment.name}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Characteristics</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {segment.characteristics.map((characteristic, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          {characteristic}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Preferences</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {segment.preferences.map((preference, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          {preference}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Pain Points</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {segment.painPoints.map((painPoint, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          {painPoint}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Acquisition Channels</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {segment.acquisitionChannels.map((channel, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          {channel}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 