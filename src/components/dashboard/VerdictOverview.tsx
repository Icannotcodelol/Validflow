"use client"

import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Plus, AlertTriangle, Minus, Share2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface KeyFinding {
  type: "strength" | "warning" | "weakness"
  text: string
}

interface VerdictOverviewProps {
  score: number
  verdict: string
  title: string
  summary: string
  findings: KeyFinding[]
  submissionDate: string
}

export default function VerdictOverview({
  score,
  verdict,
  title,
  summary,
  findings,
  submissionDate = new Date().toLocaleDateString(),
}: Partial<VerdictOverviewProps>) {
  if (!score || !verdict || !title || !summary || !findings) {
    return <div>Loading analysis data...</div>;
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start gap-6">
        <div className="flex-1 max-w-[65%]">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-sm text-muted-foreground">Submitted on {submissionDate}</p>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl">Validation Verdict</h2>
              <Badge variant="default" className={`${
                verdict === "Highly Promising" ? "bg-emerald-500 hover:bg-emerald-600" :
                verdict === "Promising" ? "bg-blue-500 hover:bg-blue-600" :
                verdict === "Needs Work" ? "bg-yellow-500 hover:bg-yellow-600" :
                "bg-red-500 hover:bg-red-600"
              }`}>
                {verdict}
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-[120px] w-[120px] rounded-full bg-emerald-50 flex items-center justify-center">
                <span className="text-5xl font-bold text-emerald-500">{score}</span>
              </div>
              <div>
                <p className="font-medium">Overall Assessment Score</p>
                <p className="text-sm text-muted-foreground">Out of 100 possible points</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 max-w-[90%]">
            <p className="text-muted-foreground">{summary}</p>
            <p className="text-muted-foreground">The solution offers meaningful differentiation through its adaptive AI technology, though the competitive landscape is increasingly crowded. Revenue potential is substantial with the subscription model, but customer acquisition costs may be higher than estimated.</p>
          </div>
        </div>

        <div className="w-[35%] shrink-0">
          <div className="flex justify-end gap-2 mb-8">
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          <div className="border-l pl-6">
            <h3 className="text-lg font-semibold mb-4">TL;DR Key Findings</h3>
            <div className="space-y-6">
              {findings.map((finding, index) => (
                <div key={index} className="flex items-start gap-2">
                  {finding.type === "strength" && (
                    <Plus className="h-4 w-4 text-emerald-500 mt-1 shrink-0" />
                  )}
                  {finding.type === "warning" && (
                    <AlertTriangle className="h-4 w-4 text-amber-500 mt-1 shrink-0" />
                  )}
                  {finding.type === "weakness" && (
                    <Minus className="h-4 w-4 text-red-500 mt-1 shrink-0" />
                  )}
                  <span className="text-sm">
                    {finding.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
} 