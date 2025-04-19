export interface AnalysisFormData {
  description: string;
  industry: string;
  subIndustry: string;
  targetCustomers: string;
  pricingModel: string;
  currentStage: string;
  teamComposition: string;
  additionalInfo?: string;
  submissionDate: string; // ISO string format
}

export interface AnalysisSection {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  data: any;
  error?: string;
}

export interface Analysis {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  sections: Record<string, AnalysisSection>;
  created_at: string;
  updated_at: string;
}

export interface UserCredits {
  user_id: string;
  free_analysis_used: boolean;
  created_at: string;
} 