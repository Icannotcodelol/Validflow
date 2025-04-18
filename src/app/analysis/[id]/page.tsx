"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import { AnalysisDocument, BaseSectionResponse } from '@/lib/ai/models';
import { AnalysisDisplay } from '@/components/AnalysisDisplay';

export default function AnalysisPage() {
  const params = useParams();
  const id = params?.id as string;
  const [analysis, setAnalysis] = useState<AnalysisDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    const fetchAnalysis = async () => {
      try {
        if (!id) {
          console.error('No analysis ID provided');
          setError('No analysis ID provided');
          setIsLoading(false);
          return;
        }

        console.log('Fetching analysis:', id);
        const response = await fetch(`/api/analyze?analysisId=${id}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || data.error || 'Failed to fetch analysis');
        }

        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch analysis');
        }

        console.log('Analysis data received:', {
          status: data.analysis.status,
          sections: Object.keys(data.analysis.sections as Record<string, BaseSectionResponse>),
          completedSections: Object.entries(data.analysis.sections as Record<string, BaseSectionResponse>)
            .filter(([_, section]) => section?.status === 'completed')
            .map(([key]) => key)
        });

        setAnalysis(data.analysis);

        // If analysis is complete or failed, stop polling
        if (data.analysis.status === 'completed' || data.analysis.status === 'failed') {
          clearInterval(pollInterval);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error fetching analysis:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
        setIsLoading(false);
        clearInterval(pollInterval); // Stop polling on error
      }
    };

    if (id) {
      // Initial fetch
      fetchAnalysis();
      
      // Set up polling every 5 seconds
      pollInterval = setInterval(fetchAnalysis, 5000);
    } else {
      setError('No analysis ID provided');
      setIsLoading(false);
    }

    // Cleanup
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-8 px-4 mt-16">
          <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-lg text-muted-foreground">Loading analysis...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-8 px-4 mt-16">
          <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Error Loading Analysis</h2>
              <p className="text-sm text-muted-foreground">{error || "Analysis not found"}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4 mt-16 space-y-12">
        <h1 className="text-3xl font-bold mb-8">Analysis Results</h1>
        <AnalysisDisplay 
          analysis={analysis} 
          isLoading={isLoading} 
          error={error}
        />
      </main>
    </div>
  );
} 