import { Share2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExecutiveSummary as ExecutiveSummaryType } from "@/lib/models/analysis"

interface ExecutiveSummaryProps {
  data: {
    title?: string;
    verdict?: string;
    score?: number;
    summary?: string;
    keyFindings?: Array<{
      type: string;
      text: string;
    }>;
  };
}

export default function ExecutiveSummary({ data }: ExecutiveSummaryProps) {
  // Default values
  const {
    title = "Business Analysis",
    verdict = "Pending Analysis",
    score = 0,
    summary = "Analysis in progress...",
    keyFindings = []
  } = data || {};

  // Get current date for submission date
  const submissionDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Verdict</h3>
              <p className="text-muted-foreground">{verdict}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Score</h3>
              <div className="text-2xl font-bold">{score}/100</div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Summary</h3>
              <p className="text-muted-foreground">{summary}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Key Findings</h3>
              <ul className="list-disc pl-5 space-y-2">
                {keyFindings.map((finding, index) => (
                  <li key={index} className="text-muted-foreground">
                    {finding.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 