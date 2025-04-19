import { Analysis } from "@/types/analysis";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface AnalysisCardProps {
  analysis: Analysis;
}

interface FormData {
  description: string;
  [key: string]: any;
}

export function AnalysisCard({ analysis }: AnalysisCardProps) {
  const router = useRouter();
  const formData = analysis.sections?.formData?.data as FormData | undefined;
  
  // Get the executive summary if available
  const executiveSummary = analysis.sections?.executiveSummary as { 
    data?: { 
      title?: string;
      score?: number;
      verdict?: string;
    } 
  } | undefined;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 hover:bg-green-600';
      case 'processing':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'failed':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <Badge className={getStatusColor(analysis.status)}>
            {analysis.status === 'processing' && (
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
            )}
            {analysis.status.charAt(0).toUpperCase() + analysis.status.slice(1)}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {formatDate(analysis.created_at)}
          </span>
        </div>
        <h3 className="font-semibold text-lg line-clamp-2">
          {executiveSummary?.data?.title || formData?.description || 'Untitled Analysis'}
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {executiveSummary?.data?.score && (
          <div className="flex items-center gap-2">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="font-bold text-primary">
                {executiveSummary.data.score}
              </span>
            </div>
            <div className="text-sm">
              <p className="font-medium">Score</p>
              <p className="text-muted-foreground">Out of 100</p>
            </div>
          </div>
        )}
        
        <Button 
          className="w-full"
          onClick={() => router.push(`/analysis/${analysis.id}`)}
        >
          <Eye className="w-4 h-4 mr-2" />
          View Analysis
        </Button>
      </CardContent>
    </Card>
  );
} 