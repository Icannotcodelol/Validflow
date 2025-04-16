"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import { AnalysisDocument, BaseSectionResponse } from '@/lib/ai/models';
import { AnalysisDisplay } from '@/components/AnalysisDisplay';
import { AnalysisLoadingState } from '@/components/AnalysisLoadingState';

export default function AnalysisPage() {
  const params = useParams();
  const id = params?.id as string;
  const [analysis, setAnalysis] = useState<AnalysisDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const pollIntervalRef = useRef<NodeJS.Timeout>();

  // Function to stop polling
  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearTimeout(pollIntervalRef.current);
      pollIntervalRef.current = undefined;
    }
  };

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        if (!id) {
          setError('No analysis ID provided');
          setIsLoading(false);
          return;
        }

        const response = await fetch(`/api/analyze?analysisId=${id}`, {
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (response.status === 401) {
          setError('Authentication error');
          setIsLoading(false);
          stopPolling();
          return;
        }

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || data.error || 'Failed to fetch analysis');
        }

        const analysisData = data.analysis || data;

        // Update analysis state regardless of completion
        setAnalysis(analysisData);
        
        // Only stop loading when the analysis is complete or failed
        if (analysisData.status === 'completed' || analysisData.status === 'failed') {
          setIsLoading(false);
          stopPolling();
        } else {
          // Continue polling while processing
          pollIntervalRef.current = setTimeout(fetchAnalysis, 2000);
        }
      } catch (error) {
        console.error('Error fetching analysis:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
        setIsLoading(false);
        stopPolling();
      }
    };

    fetchAnalysis();

    return () => {
      stopPolling();
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4 mt-16">
        {error ? (
          <div className="text-center text-red-500">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          <>
            {/* Always show the loading state while processing */}
            {(isLoading || analysis?.status === 'processing') && (
              <div className="mb-8">
                <AnalysisLoadingState
                  currentSection={Object.entries(analysis?.sections || {})
                    .find(([_, section]) => (section as BaseSectionResponse)?.status === 'pending')?.[0]}
                  completedSections={Object.entries(analysis?.sections || {})
                    .filter(([_, section]) => (section as BaseSectionResponse)?.status === 'completed')
                    .map(([key]) => key)}
                />
              </div>
            )}
            
            {/* Show analysis display as soon as we have any data */}
            {analysis && (
              <AnalysisDisplay
                analysis={analysis}
                isLoading={isLoading}
                error={error}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
} 