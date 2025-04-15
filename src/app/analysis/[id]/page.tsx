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
  const [currentSection, setCurrentSection] = useState<string>();
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const pollIntervalRef = useRef<NodeJS.Timeout>();

  // Function to stop polling
  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearTimeout(pollIntervalRef.current);
      pollIntervalRef.current = undefined;
    }
  };

  // Function to check if all sections are complete
  const areAllSectionsComplete = (data: any) => {
    if (!data?.sections) return false;
    
    const requiredSections = [
      'executiveSummary',
      'marketSizeGrowth',
      'targetUsers',
      'competition',
      'unitEconomics',
      'marketingChannels',
      'goToMarketPlan',
      'vcSentiment',
      'criticalThoughtQuestions',
      'validationRoadmap',
      'keyPerformanceIndicators',
      'experimentDesign',
      'reportSummary'
    ];

    return requiredSections.every(section => 
      data.sections[section]?.status === 'completed' || 
      data.sections[section]?.status === 'failed'
    );
  };

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        if (!id) {
          console.error('No analysis ID provided');
          setIsLoading(false);
          stopPolling();
          return;
        }

        const response = await fetch(`/api/analyze?analysisId=${id}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || data.error || 'Failed to fetch analysis');
        }

        // Ensure we're accessing the correct data structure
        const analysisData = data.analysis || data;

        // Update progress tracking
        if (analysisData.sections) {
          const completed: string[] = [];
          let current: string | undefined;
          
          Object.entries(analysisData.sections).forEach(([key, section]: [string, any]) => {
            if (section?.status === 'completed') {
              completed.push(key);
            } else if (section?.status === 'pending' && !current) {
              current = key;
            }
          });

          console.log('Progress Update:', {
            completed,
            current,
            totalSections: Object.keys(analysisData.sections).length,
            allComplete: areAllSectionsComplete(analysisData)
          });
          
          setCompletedSections(completed);
          setCurrentSection(current);
        }

        // Only update analysis and stop loading when all sections are complete
        if (areAllSectionsComplete(analysisData)) {
          console.log('All sections complete, stopping polling');
          setAnalysis(analysisData);
          setIsLoading(false);
          stopPolling();
        } else {
          // Keep the previous analysis state but continue polling
          setAnalysis(prev => prev || analysisData);
          pollIntervalRef.current = setTimeout(fetchAnalysis, 2000);
        }
      } catch (error) {
        console.error('Error fetching analysis:', error);
        setIsLoading(false);
        stopPolling();
      }
    };

    fetchAnalysis();

    return () => {
      stopPolling();
    };
  }, [id]);

  if (isLoading || !analysis || !areAllSectionsComplete(analysis)) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-8 px-4 mt-16">
          <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
            <AnalysisLoadingState
              currentSection={currentSection}
              completedSections={completedSections}
            />
          </div>
        </main>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-8 px-4 mt-16">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Analysis not found</h2>
            <p className="text-sm text-muted-foreground">The requested analysis could not be found.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-8 px-4 mt-16">
        <AnalysisDisplay analysis={analysis} />
      </main>
    </div>
  );
} 