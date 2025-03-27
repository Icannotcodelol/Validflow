import { CriticalThoughtQuestionsData, VCSentimentData, GoToMarketPlanData, MarketingChannelsData } from "@/types/sections";

export interface DashboardMarketResearch {
  status: 'completed' | 'failed' | 'pending';
  marketSize: {
    total: string;
    addressable: string;
    obtainable: string;
    growth: string;
  };
  demographics: {
    primarySegments: string[];
    segmentDetails: Array<{
      name: string;
      characteristics: string[];
      preferences: string[];
      painPoints: string[];
      acquisitionChannels: string[];
    }>;
  };
  vcActivity: {
    activeVCs: number;
    totalInvestment: string;
    averageDealSize: string;
    notableDeals: Array<{
      investor: string;
      company: string;
      amount: string;
      date: string;
    }>;
  };
  trends: Array<{
    name: string;
    description: string;
    impact: string;
    timeframe: string;
    source: string;
    opportunities: string[];
    threats: string[];
  }>;
  competitors: Array<{
    name: string;
    type: string;
    marketShare: string;
    strengths: string[];
    weaknesses: string[];
    strategy: string;
    pricing: string;
    differentiators: string[];
  }>;
  regulations: Array<{
    type: string;
    description: string;
    impact: string;
    compliance: string;
    timeline: string;
    cost: string;
    jurisdiction: string;
  }>;
  marketDynamics: {
    entryBarriers: Array<{
      barrier: string;
      impact: string;
      mitigation: string;
    }>;
    supplierPower: string;
    buyerPower: string;
    substitutes: string[];
    industryRivalry: string;
  };
}

export interface DashboardAnalysis {
  executiveSummary: {
    status: 'completed' | 'failed' | 'pending';
    title: string;
    verdict: string;
    score: number;
    summary: string;
    keyFindings: Array<{
      type: string;
      text: string;
    }>;
  };
  detailedAnalysis: {
    status: 'completed' | 'failed' | 'pending';
    valueProposition: {
      uniqueness: string;
      sustainability: string;
      scalability: string;
    };
    marketFit: {
      needAlignment: string;
      timingAnalysis: string;
      competitiveAdvantage: string;
      score: number;
      marketSizeScore: number;
    };
    financialAnalysis: {
      revenueStreams: string[];
      costStructure: {
        fixed: string[];
        variable: string[];
        unitEconomics: {
          cac: string;
          ltv: string;
          margin: string;
          paybackPeriod: string;
          breakEvenPoint: string;
        };
      };
      projections: {
        year1: string;
        year3: string;
        breakeven: string;
      };
      score: number;
    };
    riskAssessment: {
      marketRisks: Array<{
        risk: string;
        likelihood: string;
        impact: string;
        mitigation: string;
      }>;
      operationalRisks: Array<{
        risk: string;
        likelihood: string;
        impact: string;
        mitigation: string;
      }>;
      financialRisks: Array<{
        risk: string;
        likelihood: string;
        impact: string;
        mitigation: string;
      }>;
      riskScore: number;
    };
    implementationPlan: {
      phases: Array<{
        name: string;
        duration: string;
        objectives: string[];
        resources: string[];
        milestones: string[];
      }>;
      criticalPath: string[];
      keyMetrics: string[];
      feasibilityScore: number;
    };
  };
}

export interface DashboardContent {
  title: string;
  verdict: string;
  score: number;
  summary: string;
  keyFindings: Array<{
    type: string;
    text: string;
  }>;
}

export interface AnalysisResult {
  marketResearch: DashboardMarketResearch;
  analysis: DashboardAnalysis;
  content: DashboardContent;
  sections: {
    criticalThoughtQuestions?: CriticalThoughtQuestionsData;
    vcSentiment?: VCSentimentData;
    goToMarketPlan?: GoToMarketPlanData;
    marketingChannels?: MarketingChannelsData;
  };
} 