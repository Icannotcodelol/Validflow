import { useState } from "react"
import { AlertTriangle, ArrowRight, Shield, Brain, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DetailedAnalysis } from "@/lib/models/analysis"

interface RiskProps {
  title: string
  likelihood: "high" | "medium" | "low"
  impact: "high" | "medium" | "low"
  description: string
  mitigation: string[]
}

interface RiskAssessmentProps {
  data: DetailedAnalysis["riskAssessment"]
}

interface RiskItem {
  title: string;
  description: string;
  severity: "High Risk" | "Medium Risk" | "Low Risk";
  probability: number;
  impact: number;
  mitigation: string[];
  contingencyPlan: string;
}

function ThoughtQuestions() {
  const questions = [
    {
      question: "How will you handle a major technical failure in your core AI feature?",
      context: "Consider backup systems, user communication, and recovery procedures.",
    },
    {
      question: "What's your plan if a competitor launches a similar product with better funding?",
      context: "Think about your unique advantages and how to maintain market position.",
    },
    {
      question: "How will you ensure user data privacy while maintaining AI functionality?",
      context: "Balance between personalization and privacy protection.",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">3 Critical Thought Questions</CardTitle>
        </div>
        <CardDescription>Key questions you should be able to answer about your risk management strategy</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {questions.map((q, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <span className="text-sm font-medium text-primary">{index + 1}</span>
                </div>
                <div>
                  <h4 className="font-medium">{q.question}</h4>
                  <p className="text-sm text-muted-foreground">{q.context}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function RiskCard({ title, likelihood, impact, description, mitigation }: RiskProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant={likelihood === "high" ? "destructive" : likelihood === "medium" ? "secondary" : "outline"}
            >
              {likelihood.toUpperCase()} Risk
            </Badge>
            <Badge variant="outline">{impact.toUpperCase()} Impact</Badge>
          </div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-primary" />
              Risk Description
            </h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Mitigation Strategy
            </h4>
            <ul className="grid gap-2">
              {mitigation.map((strategy, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-primary mt-0.5" />
                  <span>{strategy}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const getSeverity = (impact: string): "High Risk" | "Medium Risk" | "Low Risk" => {
  switch (impact) {
    case "High":
      return "High Risk"
    case "Medium":
      return "Medium Risk"
    default:
      return "Low Risk"
  }
}

const getLikelihoodFromSeverity = (severity: "High Risk" | "Medium Risk" | "Low Risk"): "high" | "medium" | "low" => {
  switch (severity) {
    case "High Risk":
      return "high"
    case "Medium Risk":
      return "medium"
    default:
      return "low"
  }
}

export default function RiskAssessment({ data }: RiskAssessmentProps) {
  const [expandedRisk, setExpandedRisk] = useState<number | null>(null);

  // Combine and transform all risks into the desired format
  const allRisks: RiskItem[] = [
    ...data.marketRisks.map(risk => ({
      title: "Market Risk: " + risk.risk,
      description: risk.risk,
      severity: getSeverity(risk.impact),
      probability: risk.likelihood === "High" ? 75 : risk.likelihood === "Medium" ? 50 : 25,
      impact: risk.impact === "High" ? 75 : risk.impact === "Medium" ? 50 : 25,
      mitigation: [risk.mitigation],
      contingencyPlan: "Adjust strategy based on market feedback and pivot if necessary."
    })),
    ...data.operationalRisks.map(risk => ({
      title: "Technical Risk: " + risk.risk,
      description: risk.risk,
      severity: getSeverity(risk.impact),
      probability: risk.likelihood === "High" ? 75 : risk.likelihood === "Medium" ? 50 : 25,
      impact: risk.impact === "High" ? 75 : risk.impact === "Medium" ? 50 : 25,
      mitigation: [risk.mitigation],
      contingencyPlan: "Implement backup systems and maintain contingency resources."
    })),
    ...data.financialRisks.map(risk => ({
      title: "Financial Risk: " + risk.risk,
      description: risk.risk,
      severity: getSeverity(risk.impact),
      probability: risk.likelihood === "High" ? 75 : risk.likelihood === "Medium" ? 50 : 25,
      impact: risk.impact === "High" ? 75 : risk.impact === "Medium" ? 50 : 25,
      mitigation: [risk.mitigation],
      contingencyPlan: "Maintain cash reserves and explore alternative funding options."
    }))
  ].sort((a, b) => {
    const severityScore = (sev: string) => sev === "High Risk" ? 3 : sev === "Medium Risk" ? 2 : 1;
    return severityScore(b.severity) - severityScore(a.severity);
  });

  const getLikelihoodColor = (likelihood: string) => {
    switch (likelihood.toLowerCase()) {
      case "high":
        return "bg-red-500 hover:bg-red-600"
      case "medium":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "low":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-blue-500 hover:bg-blue-600"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case "high":
        return "bg-red-500 hover:bg-red-600"
      case "medium":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "low":
        return "bg-green-500 hover:bg-green-600"
      default:
        return "bg-blue-500 hover:bg-blue-600"
    }
  }

  const riskMatrix = {
    high: {
      label: "High",
      count: allRisks.filter((r) => r.severity === "High Risk").length,
      description: "Critical risks requiring immediate attention",
    },
    medium: {
      label: "Medium",
      count: allRisks.filter((r) => r.severity === "Medium Risk").length,
      description: "Significant risks requiring monitoring",
    },
    low: {
      label: "Low",
      count: allRisks.filter((r) => r.severity === "Low Risk").length,
      description: "Minor risks with limited impact",
    },
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Top Risk Analysis</CardTitle>
          <p className="text-sm text-muted-foreground">Detailed analysis of highest priority risks</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allRisks.map((risk, index) => (
              <div
                key={index}
                className="border rounded-lg overflow-hidden"
              >
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
                  onClick={() => setExpandedRisk(expandedRisk === index ? null : index)}
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    <div>
                      <h3 className="font-medium">{risk.title}</h3>
                      <p className="text-sm text-muted-foreground">{risk.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={risk.severity === "High Risk" ? "destructive" : "secondary"}
                    >
                      {risk.severity}
                    </Badge>
                    {expandedRisk === index ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {expandedRisk === index && (
                  <div className="p-4 border-t bg-muted/50">
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Probability</h4>
                          <div className="h-2 bg-muted rounded-full">
                            <div
                              className="h-full bg-orange-500 rounded-full"
                              style={{ width: `${risk.probability}%` }}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{risk.probability}%</p>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">Impact</h4>
                          <div className="h-2 bg-muted rounded-full">
                            <div
                              className="h-full bg-orange-500 rounded-full"
                              style={{ width: `${risk.impact}%` }}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{risk.impact}%</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Mitigation Strategy</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {risk.mitigation.map((strategy, i) => (
                            <li key={i} className="text-sm text-muted-foreground">
                              {strategy}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Contingency Plan</h4>
                        <p className="text-sm text-muted-foreground">{risk.contingencyPlan}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <ThoughtQuestions />
        
        <div className="grid gap-4 md:grid-cols-3">
          {Object.entries(riskMatrix).map(([key, value]) => (
            <Card key={key}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    variant={
                      key === "high" ? "destructive" : key === "medium" ? "secondary" : "outline"
                    }
                  >
                    {value.label} Risk
                  </Badge>
                  <span className="text-2xl font-bold">{value.count}</span>
                </div>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {allRisks.map((risk, index) => (
            <RiskCard 
              key={index} 
              title={risk.title} 
              likelihood={getLikelihoodFromSeverity(risk.severity)} 
              impact={getLikelihoodFromSeverity(risk.severity)} 
              description={risk.description} 
              mitigation={risk.mitigation} 
            />
          ))}
        </div>
      </div>
    </div>
  )
} 