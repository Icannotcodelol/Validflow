import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VCSentimentData } from "@/types/sections";
import { Badge } from "@/components/ui/badge";

interface VCSentimentProps {
  data: VCSentimentData;
}

export function VCSentiment({ data }: VCSentimentProps) {
  console.log('VCSentiment - Rendering with data:', data);

  // Early return if data is invalid or has error
  if (!data || data.status === 'failed' || data.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>VC Sentiment Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {data?.error || "VC Sentiment Analysis could not be rendered due to missing data."}
          </p>
        </CardContent>
      </Card>
    );
  }

  // Show loading state if pending
  if (data.status === 'pending') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>VC Sentiment Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Analyzing VC sentiment...</p>
        </CardContent>
      </Card>
    );
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 75) return 'text-green-600';
    if (confidence >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>VC Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {data.sentiment && (
            <div>
              <h3 className="font-semibold mb-4">Market Sentiment</h3>
              <div className="p-6 bg-muted rounded-lg">
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Overall Sentiment</span>
                    <Badge className={getSentimentColor(data.sentiment.overall)}>
                      {data.sentiment.overall.charAt(0).toUpperCase() + data.sentiment.overall.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Confidence Score:</span>
                    <span className={`font-semibold ${getConfidenceColor(data.sentiment.confidence)}`}>
                      {data.sentiment.confidence}%
                    </span>
                  </div>
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Key Factors</h4>
                    <div className="grid gap-2">
                      {data.sentiment.keyFactors.map((factor, i) => (
                        <div key={i} className="flex items-start space-x-2">
                          <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {data.marketTrends && data.marketTrends.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4">Market Trends</h3>
              <div className="grid gap-4">
                {data.marketTrends.map((trend, index) => (
                  <div key={index} className="p-6 bg-muted rounded-lg">
                    <div className="flex flex-col space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{trend.trend}</h4>
                        <Badge variant="outline">
                          {trend.confidence}% Confidence
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{trend.impact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.notableTransactions && data.notableTransactions.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4">Notable Transactions</h3>
              <div className="grid gap-4">
                {data.notableTransactions.map((transaction, index) => (
                  <div key={index} className="p-6 bg-muted rounded-lg">
                    <div className="flex flex-col space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{transaction.company}</h4>
                        <Badge variant="outline" className="bg-green-50">
                          {transaction.amount}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Led by {transaction.investors.join(', ')}</span>
                        <span>{transaction.date}</span>
                      </div>
                      {transaction.purpose && (
                        <p className="text-sm text-muted-foreground">{transaction.purpose}</p>
                      )}
                      {transaction.valuation && (
                        <div className="text-sm">
                          <span className="font-medium">Valuation: </span>
                          <span className="text-muted-foreground">{transaction.valuation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.recommendations && data.recommendations.length > 0 && (
            <div>
              <h3 className="font-semibold mb-4">Recommendations</h3>
              <div className="grid gap-4">
                {data.recommendations.map((rec, index) => (
                  <div key={index} className="p-6 bg-muted rounded-lg">
                    <div className="flex flex-col space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{rec.category}</h4>
                        <Badge className={`
                          ${rec.priority === 'high' ? 'bg-red-100 text-red-800' : ''}
                          ${rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${rec.priority === 'low' ? 'bg-green-100 text-green-800' : ''}
                        `}>
                          {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} Priority
                        </Badge>
                      </div>
                      <ul className="list-disc list-inside space-y-1">
                        {rec.items.map((item, i) => (
                          <li key={i} className="text-sm text-muted-foreground">{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 