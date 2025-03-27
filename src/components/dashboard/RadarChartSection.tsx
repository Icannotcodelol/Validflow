import { useState } from "react"
import { Download, HelpCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts"
import { DashboardAnalysis } from "@/types/dashboard"

interface Dimension {
  id: string
  name: string
  score: number
  color: string
}

interface DimensionDetail {
  title: string
  score: number
  status: string
  description: string
  insights: string[]
}

type DimensionDetails = {
  [key: string]: DimensionDetail
}

interface RadarChartSectionProps {
  data: DashboardAnalysis
}

export default function RadarChartSection({ data }: RadarChartSectionProps) {
  const [hoveredDimension, setHoveredDimension] = useState<string | null>(null)

  const dimensions: Dimension[] = [
    { id: "strengths", name: "Strengths & Weaknesses", score: 85, color: "#22c55e" },
    { id: "market", name: "Market Opportunity", score: 80, color: "#22c55e" },
    { id: "insights", name: "Market Insights", score: 75, color: "#eab308" },
    { id: "competitive", name: "Competition", score: 70, color: "#eab308" },
    { id: "financial", name: "Financial", score: 65, color: "#eab308" },
    { id: "gtm", name: "Go-To-Market", score: 75, color: "#22c55e" },
    { id: "risks", name: "Risks", score: 70, color: "#eab308" },
  ]

  const radarData = dimensions.map(d => ({
    subject: d.name,
    score: d.score,
    fullMark: 100,
    id: d.id,
    color: d.color,
    displayScore: hoveredDimension === d.id ? d.score * 1.1 : d.score,
  }))

  const dimensionDetails: DimensionDetails = {
    strengths: {
      title: "Strengths & Weaknesses",
      score: 85,
      status: "Strong",
      description: "Comprehensive analysis of your idea's key advantages and areas for improvement, helping identify critical success factors and potential challenges.",
      insights: [
        "Strong technical differentiation through AI capabilities",
        "Clear market positioning and unique value proposition",
        "Areas for improvement in customer acquisition strategy",
        "Opportunity to strengthen competitive advantages",
      ],
    },
    market: {
      title: "Market Opportunity",
      score: 80,
      status: "Promising",
      description: "Analysis of market size, growth potential, and target audience characteristics to evaluate the business opportunity.",
      insights: [
        "Large and growing target market",
        "Clear market segmentation opportunities",
        "Strong growth potential in key segments",
        "Favorable market timing and conditions",
      ],
    },
    insights: {
      title: "Market Insights",
      score: 75,
      status: "Good",
      description: "Analysis of VC activity and consumer behavior trends to understand market dynamics and opportunities.",
      insights: [
        "High VC interest in the sector",
        "Positive consumer behavior trends",
        "Growing market validation",
        "Strong investor confidence",
      ],
    },
    competitive: {
      title: "Competition",
      score: 70,
      status: "Moderate",
      description: "Evaluation of competitive landscape, market positioning, and differentiation strategies.",
      insights: [
        "Clear competitive advantages identified",
        "Market positioning opportunities",
        "Differentiation strategy effectiveness",
        "Competitive response planning",
      ],
    },
    financial: {
      title: "Financial",
      score: 65,
      status: "Developing",
      description: "Assessment of financial projections, revenue potential, and resource requirements.",
      insights: [
        "Realistic revenue projections",
        "Clear path to profitability",
        "Resource allocation optimization",
        "Financial risk management",
      ],
    },
    gtm: {
      title: "Go-To-Market",
      score: 75,
      status: "Solid",
      description: "Analysis of market entry strategy, customer acquisition, and growth plans.",
      insights: [
        "Well-defined target audience",
        "Effective marketing channels",
        "Clear value proposition",
        "Scalable growth strategy",
      ],
    },
    risks: {
      title: "Risks",
      score: 70,
      status: "Managed",
      description: "Comprehensive risk assessment and mitigation strategies across key areas.",
      insights: [
        "Identified key risk areas",
        "Effective mitigation strategies",
        "Risk monitoring framework",
        "Contingency planning",
      ],
    },
  }

  const handleLabelClick = (label: string) => {
    const dimension = dimensions.find(d => d.name === label)
    if (dimension) {
      // Find the tab in the main dashboard navigation
      const mainTab = document.querySelector(`.grid-cols-8 button[value="${dimension.id}"]`) as HTMLButtonElement
      if (mainTab) {
        mainTab.click()
      }
    }
  }

  const handleMouseEnter = (data: any) => {
    if (data && data.payload) {
      setHoveredDimension(data.payload.id)
    }
  }

  const handleMouseLeave = () => {
    setHoveredDimension(null)
  }

  const chartData = [
    {
      category: "Market Fit",
      score: data.detailedAnalysis.marketFit.score,
    },
    {
      category: "Financial Viability",
      score: data.detailedAnalysis.financialAnalysis.score,
    },
    {
      category: "Technical Feasibility",
      score: data.detailedAnalysis.implementationPlan.feasibilityScore,
    },
    {
      category: "Risk Level",
      score: 100 - data.detailedAnalysis.riskAssessment.riskScore, // Invert risk score
    },
    {
      category: "Market Size",
      score: data.detailedAnalysis.marketFit.marketSizeScore,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>7-Dimension Analysis</CardTitle>
            <CardDescription>Comprehensive evaluation across key success factors</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Tabs defaultValue="radar">
              <TabsList>
                <TabsTrigger value="radar">Radar</TabsTrigger>
                <TabsTrigger value="bar">Bar</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <Tabs defaultValue="radar">
              <TabsContent value="radar" className="mt-0">
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={(props) => {
                          const { x, y, payload } = props
                          return (
                            <g 
                              transform={`translate(${x},${y})`}
                              className="cursor-pointer"
                              onClick={() => handleLabelClick(payload.value)}
                            >
                              <text
                                x={0}
                                y={0}
                                dy={16}
                                textAnchor="middle"
                                fill={hoveredDimension === dimensions.find(d => d.name === payload.value)?.id ? '#1d4ed8' : '#64748b'}
                                fontSize={hoveredDimension === dimensions.find(d => d.name === payload.value)?.id ? 13 : 12}
                                fontWeight={hoveredDimension === dimensions.find(d => d.name === payload.value)?.id ? 600 : 400}
                              >
                                {payload.value}
                              </text>
                            </g>
                          )
                        }}
                      />
                      <Radar
                        name="Score"
                        dataKey="displayScore"
                        stroke={hoveredDimension ? "#1d4ed8" : "#2563eb"}
                        fill={hoveredDimension ? "#1d4ed8" : "#2563eb"}
                        fillOpacity={hoveredDimension ? 0.8 : 0.6}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        className="transition-colors duration-200"
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              <TabsContent value="bar" className="mt-0">
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={radarData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" angle={-45} textAnchor="end" height={100} />
                      <YAxis domain={[0, 100]} />
                      <Legend />
                      <Bar
                        dataKey="displayScore"
                        name="Score"
                        fill="#2563eb"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="border rounded-lg p-4">
            {dimensionDetails[hoveredDimension || "strengths"] && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{dimensionDetails[hoveredDimension || "strengths"].title}</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <HelpCircle className="h-4 w-4" />
                          <span className="sr-only">More information</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          {dimensionDetails[hoveredDimension || "strengths"].description}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xl font-bold">{dimensionDetails[hoveredDimension || "strengths"].score}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Score</div>
                    <div className="text-lg font-semibold">{dimensionDetails[hoveredDimension || "strengths"].status}</div>
                  </div>
                </div>

                <p className="text-sm mb-4">{dimensionDetails[hoveredDimension || "strengths"].description}</p>

                <div>
                  <h4 className="text-sm font-medium mb-2">Key Insights</h4>
                  <ul className="space-y-1">
                    {dimensionDetails[hoveredDimension || "strengths"].insights.map((insight: string, index: number) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <Info className="h-4 w-4 mt-0.5 text-primary" />
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 