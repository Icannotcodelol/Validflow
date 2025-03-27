import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { CriticalThoughtQuestionsData } from "@/types/sections";

interface Props {
  data: CriticalThoughtQuestionsData;
}

export function CriticalThoughtQuestions({ data }: Props) {
  // Handle failed or missing data state
  if (data.status === 'failed' || !data.questions || data.questions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Critical Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {data.error || 'Critical questions could not be generated. Please try again.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const getImportanceColor = (importance: string) => {
    switch (importance.toLowerCase()) {
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
        <CardTitle>Critical Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {data.questions.map((category, index) => (
            <div key={index}>
              <h3 className="font-semibold mb-4">{category.category}</h3>
              <div className="grid gap-4">
                {category.questions && category.questions.map((question, qIndex) => (
                  <div key={qIndex} className="p-6 bg-muted rounded-lg">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-2">
                        <p className="font-medium">{question.question}</p>
                        {question.context && (
                          <p className="text-sm text-muted-foreground">{question.context}</p>
                        )}
                      </div>
                      <Badge className={getImportanceColor(question.importance)}>
                        {question.importance.charAt(0).toUpperCase() + question.importance.slice(1)} Priority
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 