import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, HelpCircle, AlertTriangle, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  data: {
    questions: Array<{
      category: string;
      question: string;
      importance: 'high' | 'medium' | 'low';
      considerations?: string[];
    }>[];
    riskAreas?: Array<{
      area: string;
      description: string;
      mitigation: string;
    }>;
    status: 'completed' | 'failed' | 'pending';
    error?: string;
  };
}

export function CriticalQuestions({ data }: Props) {
  if (!data) {
    return renderError("No data provided for Critical Questions section.");
  }

  if (data.status === "failed" || data.error) {
    return renderError(data.error || "Failed to generate Critical Questions analysis.");
  }

  const importanceColors = {
    high: "text-red-500 bg-red-50",
    medium: "text-yellow-500 bg-yellow-50",
    low: "text-green-500 bg-green-50"
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          <CardTitle>Critical Questions Analysis</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Questions by Category */}
        <div className="space-y-6">
          {data.questions?.map((categoryGroup, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{categoryGroup[0].category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryGroup.map((item, qIndex) => (
                  <div key={qIndex} className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <p className="font-medium">{item.question}</p>
                        <Badge 
                          variant="secondary" 
                          className={importanceColors[item.importance]}
                        >
                          {item.importance.toUpperCase()} Priority
                        </Badge>
                      </div>
                    </div>
                    {item.considerations && (
                      <div className="pl-4 border-l-2 border-muted">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Considerations:</p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {item.considerations.map((consideration, cIndex) => (
                            <li key={cIndex} className="ml-2">{consideration}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Risk Areas */}
        {data.riskAreas && data.riskAreas.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">Risk Areas</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {data.riskAreas.map((risk, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{risk.area}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">{risk.description}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <p className="text-sm font-medium">Mitigation Strategy</p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{risk.mitigation}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function renderError(message: string) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-destructive" />
          <CardTitle>Critical Questions</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
} 