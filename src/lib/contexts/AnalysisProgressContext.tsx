import React, { createContext, useContext, useState, useEffect } from 'react';
import { AnalysisDocument } from '@/lib/ai/models';

interface AnalysisProgressContextType {
  progress: Record<string, 'pending' | 'completed' | 'failed'>;
  updateProgress: (sectionId: string, status: 'pending' | 'completed' | 'failed') => void;
  isComplete: boolean;
  hasError: boolean;
}

const AnalysisProgressContext = createContext<AnalysisProgressContextType | undefined>(undefined);

export function AnalysisProgressProvider({ 
  children, 
  analysis 
}: { 
  children: React.ReactNode;
  analysis: AnalysisDocument;
}) {
  const [progress, setProgress] = useState<Record<string, 'pending' | 'completed' | 'failed'>>({});

  useEffect(() => {
    // Initialize progress from analysis sections
    const initialProgress: Record<string, 'pending' | 'completed' | 'failed'> = {};
    Object.entries(analysis.sections).forEach(([key, section]) => {
      if (section && 'status' in section && typeof section.status === 'string') {
        initialProgress[key] = section.status as 'pending' | 'completed' | 'failed';
      }
    });
    setProgress(initialProgress);
  }, [analysis]);

  const updateProgress = (sectionId: string, status: 'pending' | 'completed' | 'failed') => {
    setProgress(prev => ({
      ...prev,
      [sectionId]: status
    }));
  };

  const isComplete = Object.values(progress).every(status => status === 'completed');
  const hasError = Object.values(progress).some(status => status === 'failed');

  return (
    <AnalysisProgressContext.Provider value={{ progress, updateProgress, isComplete, hasError }}>
      {children}
    </AnalysisProgressContext.Provider>
  );
}

export function useAnalysisProgress() {
  const context = useContext(AnalysisProgressContext);
  if (context === undefined) {
    throw new Error('useAnalysisProgress must be used within an AnalysisProgressProvider');
  }
  return context;
} 