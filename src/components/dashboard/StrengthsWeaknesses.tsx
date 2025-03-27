"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle } from "lucide-react"
import { DashboardAnalysis } from "@/types/dashboard"

interface StrengthsWeaknessesProps {
  data: DashboardAnalysis;
}

export default function StrengthsWeaknesses({ data }: StrengthsWeaknessesProps) {
  const strengths = [
    {
      title: "Market Fit",
      description: data.detailedAnalysis.marketFit.needAlignment || "Not available",
      score: data.detailedAnalysis.marketFit.score || 0,
    },
    {
      title: "Financial Viability",
      description: data.detailedAnalysis.financialAnalysis.projections.year1 || "Not available",
      score: data.detailedAnalysis.financialAnalysis.score || 0,
    },
    {
      title: "Technical Feasibility",
      description: data.detailedAnalysis.implementationPlan.criticalPath[0] || "Not available",
      score: data.detailedAnalysis.implementationPlan.feasibilityScore || 0,
    }
  ].filter((item) => item.score >= 70);

  const weaknesses = [
    {
      title: "Market Fit",
      description: data.detailedAnalysis.marketFit.needAlignment || "Not available",
      score: data.detailedAnalysis.marketFit.score || 0,
    },
    {
      title: "Financial Viability",
      description: data.detailedAnalysis.financialAnalysis.projections.year1 || "Not available",
      score: data.detailedAnalysis.financialAnalysis.score || 0,
    },
    {
      title: "Technical Feasibility",
      description: data.detailedAnalysis.implementationPlan.criticalPath[0] || "Not available",
      score: data.detailedAnalysis.implementationPlan.feasibilityScore || 0,
    }
  ].filter((item) => item.score < 70);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            Strengths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {strengths.map((strength, index) => (
              <div key={index}>
                <h3 className="font-medium mb-1">{strength.title}</h3>
                <p className="text-sm text-muted-foreground">{strength.description}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500"
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{strength.score}%</span>
                </div>
              </div>
            ))}
            {strengths.length === 0 && (
              <p className="text-sm text-muted-foreground">No major strengths identified yet.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            Areas for Improvement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {weaknesses.map((weakness, index) => (
              <div key={index}>
                <h3 className="font-medium mb-1">{weakness.title}</h3>
                <p className="text-sm text-muted-foreground">{weakness.description}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500"
                      style={{ width: `${weakness.score}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{weakness.score}%</span>
                </div>
              </div>
            ))}
            {weaknesses.length === 0 && (
              <p className="text-sm text-muted-foreground">No major weaknesses identified yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 