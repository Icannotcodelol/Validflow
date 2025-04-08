import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VCSentimentData } from "@/types/sections";
import { Badge } from "@/components/ui/badge";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";

interface VCSentimentProps {
  data?: VCSentimentData;
  status: 'pending' | 'completed' | 'failed';
  error?: string;
  isLandingPage?: boolean;
}

const getScoreColor = (score?: number) => {
  if (score === undefined) return 'bg-gray-100 text-gray-800';
  if (score >= 75) return 'bg-green-100 text-green-800';
  if (score >= 50) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

const LANDING_PAGE_DATA: VCSentimentData = {
  status: 'completed',
  sectionId: 'vc-sentiment-example',
  createdAt: new Date(),
  updatedAt: new Date(),
  overview: {
    score: 85,
    confidence: 90,
    summary: "MealPrep demonstrates strong potential for VC investment, with a scalable business model, growing market demand, and innovative features. The combination of AI-driven personalization, integration with grocery delivery services, and focus on sustainability presents a compelling growth opportunity.",
    verdict: "Highly Attractive Investment Opportunity"
  },
  marketActivity: {
    investmentVolume: {
      total: "$9.5B",
      timeframe: "Last 12 months",
      growth: "20% YoY",
      trend: "Increasing",
      analysis: "Strong and consistent growth in the food-tech sector"
    },
    notableTransactions: [
      {
        date: "2025-02",
        company: "Kitchenful",
        round: "Series A",
        amount: "$10M",
        valuation: "$50M",
        investors: ["VentureFriends", "Goodwater"]
      },
      {
        date: "2025-01",
        company: "Meallogix",
        round: "Pre-Series A",
        amount: "$1.7M",
        valuation: "N/A",
        investors: ["Tech Coast Angels", "Spark Growth"]
      },
      {
        date: "2024-12",
        company: "FreshPlate",
        round: "Seed",
        amount: "$8M",
        valuation: "$40M",
        investors: ["Y Combinator", "Sequoia"]
      }
    ],
    comparableExits: [
      {
        company: "MealGenius",
        type: "Strategic Acquisition",
        value: "Undisclosed",
        date: "2024-11",
        details: "Strategic acquisition to enhance meal planning capabilities"
      },
      {
        company: "SmartKitchen",
        type: "IPO",
        value: "Successful",
        date: "2024-09",
        details: "Successful public market reception for AI-powered food tech"
      }
    ]
  },
  investmentAttractiveness: {
    score: 85,
    confidence: 90,
    strengths: [
      "Strong product-market fit with increasing demand for meal planning and grocery delivery solutions",
      "Clear path to profitability with multiple revenue streams (subscriptions, commissions, sponsorships)",
      "AI-driven personalization features and integration with local grocery delivery services",
      "Focus on sustainability and reducing food waste aligns with consumer trends",
      "High user retention potential through network effects and convenience"
    ],
    weaknesses: [
      "High initial capital requirements for technology development and partnerships",
      "Dependency on third-party grocery delivery services",
      "Competitive market with established players in both meal planning and delivery sectors"
    ],
    opportunities: [
      "Expansion into corporate wellness programs and international markets",
      "Strategic partnerships with grocery delivery platforms to enhance user experience",
      "Growing consumer demand for AI-driven meal planning and sustainable practices",
      "Potential integration with smart home devices for seamless meal prep automation"
    ],
    threats: [
      "Intense competition from well-funded competitors like HelloFresh and Blue Apron",
      "Regulatory changes in food delivery logistics",
      "Economic downturns impacting consumer spending on subscriptions"
    ]
  },
  marketTrends: {
    overview: "The meal planning and grocery delivery sector is experiencing rapid growth driven by AI-powered personalization, sustainability focus, and subscription models.",
    trends: [
      {
        name: "AI-driven personalization",
        impact: "High",
        timeline: "Immediate"
      },
      {
        name: "Sustainability in food tech",
        impact: "Medium",
        timeline: "Mid-term"
      },
      {
        name: "Subscription-based meal planning",
        impact: "High",
        timeline: "Immediate"
      }
    ],
    investorSentiment: {
      overall: "Highly Positive",
      keyFactors: [
        "Strong market growth potential",
        "Multiple revenue streams",
        "Technology-driven differentiation"
      ],
      concerns: [
        "Market competition",
        "Customer acquisition costs",
        "Execution risks"
      ],
      outlook: "The sector is expected to maintain strong growth momentum with increasing investor interest in AI-powered solutions."
    }
  },
  fundingStrategy: {
    recommendedRound: {
      type: "Series A",
      targetAmount: "$10M",
      timing: "Q2 2025",
      valuation: {
        range: "$45M - $55M",
        basis: [
          "Comparable company valuations",
          "Growth trajectory",
          "Market opportunity"
        ]
      }
    },
    useOfFunds: [
      {
        category: "Product Development",
        allocation: "40%",
        details: "Enhance AI capabilities and user experience"
      },
      {
        category: "Market Expansion",
        allocation: "30%",
        details: "Enter new markets and establish partnerships"
      },
      {
        category: "Team Growth",
        allocation: "20%",
        details: "Hire key technical and business roles"
      },
      {
        category: "Operations",
        allocation: "10%",
        details: "Improve infrastructure and processes"
      }
    ],
    targetInvestors: [
      {
        type: "Food Tech VCs",
        focus: ["AI/ML", "Food Technology", "Sustainability"],
        examples: ["Food Tech Ventures", "Sustainable Future Capital"]
      },
      {
        type: "Strategic Investors",
        focus: ["Grocery", "Delivery", "Consumer Tech"],
        examples: ["Retail Innovation Fund", "Digital Consumer Fund"]
      }
    ],
    milestones: [
      {
        milestone: "Market Expansion",
        impact: "Enter 5 new major markets",
        timeline: "6 months"
      },
      {
        milestone: "User Growth",
        impact: "Reach 100,000 active users",
        timeline: "12 months"
      },
      {
        milestone: "Revenue Target",
        impact: "Achieve $1M MRR",
        timeline: "18 months"
      }
    ]
  }
};

function VCSentimentContent({ data, status, error, isLandingPage }: VCSentimentProps) {
  const displayData = isLandingPage ? LANDING_PAGE_DATA : data;

  if (status === 'pending') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>VC Sentiment Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
            Analyzing VC sentiment...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (status === 'failed') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>VC Sentiment Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || "VC Sentiment Analysis could not be generated."}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Check if we have any data to display
  if (!displayData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>VC Sentiment Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="default">
            <Info className="h-4 w-4" />
            <AlertDescription>
              VC Sentiment data is unavailable.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>VC Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Overview Section */}
          {displayData.overview && (
            <div>
              <h3 className="font-semibold mb-4 text-xl">Investment Overview</h3>
              <div className="p-6 bg-muted rounded-lg space-y-4">
                {displayData.overview.score !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Overall Score</span>
                    <Badge className={getScoreColor(displayData.overview.score)}>
                      {displayData.overview.score}/100
                    </Badge>
                  </div>
                )}
                {displayData.overview.summary && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">{displayData.overview.summary}</p>
                  </div>
                )}
                {displayData.overview.verdict && (
                  <p className="text-sm font-medium">{displayData.overview.verdict}</p>
                )}
              </div>
            </div>
          )}

          {/* Investment Attractiveness Section */}
          {displayData.investmentAttractiveness && (
            <div>
              <h3 className="font-semibold mb-4 text-xl">Investment Attractiveness</h3>
              <div className="p-6 bg-muted rounded-lg space-y-6">
                {displayData.investmentAttractiveness.score !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Score</span>
                    <Badge className={getScoreColor(displayData.investmentAttractiveness.score)}>
                      {displayData.investmentAttractiveness.score}/100
                    </Badge>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {displayData.investmentAttractiveness.strengths && displayData.investmentAttractiveness.strengths.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-green-700">Strengths</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {displayData.investmentAttractiveness.strengths.map((strength, i) => (
                          <li key={i} className="text-gray-600">{strength}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {displayData.investmentAttractiveness.weaknesses && displayData.investmentAttractiveness.weaknesses.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-red-700">Weaknesses</h4>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        {displayData.investmentAttractiveness.weaknesses.map((weakness, i) => (
                          <li key={i} className="text-gray-600">{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Market Activity Section */}
          {displayData.marketActivity?.investmentVolume && (
            <div>
              <h3 className="font-semibold mb-4 text-xl">Market Activity</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {displayData.marketActivity.investmentVolume.total && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm font-medium text-blue-800">Total Investment Volume</div>
                      <div className="text-2xl font-bold text-blue-900 mt-1">
                        {displayData.marketActivity.investmentVolume.total}
                      </div>
                      {displayData.marketActivity.investmentVolume.timeframe && (
                        <div className="text-sm text-blue-600 mt-1">
                          {displayData.marketActivity.investmentVolume.timeframe}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {displayData.marketActivity?.notableTransactions && displayData.marketActivity.notableTransactions.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">Notable Transactions</h4>
                    <div className="bg-white rounded-lg border">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50 border-b">
                              <th className="text-left p-4 font-medium text-sm text-gray-600">Date</th>
                              <th className="text-left p-4 font-medium text-sm text-gray-600">Company</th>
                              <th className="text-left p-4 font-medium text-sm text-gray-600">Round</th>
                              <th className="text-left p-4 font-medium text-sm text-gray-600">Amount</th>
                              <th className="text-left p-4 font-medium text-sm text-gray-600">Investors</th>
                            </tr>
                          </thead>
                          <tbody>
                            {displayData.marketActivity?.notableTransactions?.map((transaction, index) => (
                              <tr key={index} className="border-b last:border-0">
                                <td className="p-4">{transaction.date || 'N/A'}</td>
                                <td className="p-4">{transaction.company || 'N/A'}</td>
                                <td className="p-4">{transaction.round || 'N/A'}</td>
                                <td className="p-4">{transaction.amount || 'N/A'}</td>
                                <td className="p-4">{transaction.investors?.join(', ') || 'N/A'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Market Trends Section */}
          {displayData.marketTrends && (
            <div>
              <h3 className="font-semibold mb-4 text-xl">Market Trends</h3>
              <div className="p-6 bg-muted rounded-lg space-y-6">
                {displayData.marketTrends.overview && (
                  <div className="text-sm text-gray-600">
                    {displayData.marketTrends.overview}
                  </div>
                )}

                {displayData.marketTrends.trends && displayData.marketTrends.trends.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayData.marketTrends.trends.map((trend, index) => (
                      <div key={index} className="p-4 bg-white rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{trend.name}</h4>
                          <Badge variant={trend.impact === "High" ? "default" : "secondary"}>
                            {trend.impact}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500">
                          Timeline: {trend.timeline}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {displayData.marketTrends.investorSentiment && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Investor Sentiment</h4>
                      <Badge variant="outline">
                        {displayData.marketTrends.investorSentiment.overall}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {displayData.marketTrends.investorSentiment.keyFactors && displayData.marketTrends.investorSentiment.keyFactors.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-green-700">Key Factors</h5>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {displayData.marketTrends.investorSentiment.keyFactors.map((factor, i) => (
                              <li key={i} className="text-gray-600">{factor}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {displayData.marketTrends.investorSentiment.concerns && displayData.marketTrends.investorSentiment.concerns.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium text-red-700">Concerns</h5>
                          <ul className="list-disc list-inside text-sm space-y-1">
                            {displayData.marketTrends.investorSentiment.concerns.map((concern, i) => (
                              <li key={i} className="text-gray-600">{concern}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {displayData.marketTrends.investorSentiment.outlook && (
                      <div className="mt-4 p-4 bg-white rounded-lg border text-sm text-gray-600">
                        <span className="font-medium">Market Outlook:</span> {displayData.marketTrends.investorSentiment.outlook}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Show partial data notice only if specific required data is missing */}
          {(!displayData.investmentAttractiveness?.strengths?.length || 
            !displayData.marketTrends?.trends?.length) && status === 'completed' && (
            <Alert variant="default">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Some sections of the VC sentiment analysis are still being generated.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function VCSentiment(props: VCSentimentProps) {
  return (
    <ErrorBoundary>
      <VCSentimentContent {...props} />
    </ErrorBoundary>
  );
} 