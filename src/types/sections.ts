import { z } from 'zod';

// Base response type that all sections must implement
export interface BaseSectionResponse {
  status: 'pending' | 'completed' | 'failed';
  error?: string;
  sectionId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Executive Summary Types
export interface ExecutiveSummaryData extends BaseSectionResponse {
  title?: string;
  verdict?: 'positive' | 'negative' | 'neutral';
  score?: number;
  summary?: string;
  keyFindings?: Array<{
    type: 'strength' | 'weakness' | 'opportunity' | 'threat';
    text: string;
  }>;
}

export interface ExecutiveSummaryResponse extends ExecutiveSummaryData {
  status: 'pending' | 'completed' | 'failed';
}

// Report Summary Types
export interface ReportSummaryData extends BaseSectionResponse {
  summary?: string;
  keyFindings?: string[];
  recommendations?: Array<{
    category: string;
    items: string[];
    priority: 'high' | 'medium' | 'low';
  }>;
  nextSteps?: Array<{
    action: string;
    timeline: string;
    resources: string[];
  }>;
}

export interface ReportSummaryResponse extends ReportSummaryData {
  status: 'pending' | 'completed' | 'failed';
}

// Market Size & Growth Types
export interface MarketSizeGrowthData extends BaseSectionResponse {
  marketSize?: {
    total: string;
    addressable: string;
    obtainable: string;
    growth: string;
    analysis?: string;
    projections?: Array<{
      year: string;
      value: string;
    }>;
  };
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface MarketSizeGrowthResponse extends MarketSizeGrowthData {
  status: 'pending' | 'completed' | 'failed';
}

// Target Users Types
export interface TargetUsersData extends BaseSectionResponse {
  primaryUserPersonas?: Array<{
    name: string;
    description: string;
    painPoints: string[];
    needs: string[];
    behaviors: string[];
  }>;
  userSegments?: Array<{
    segment: string;
    size: string;
    characteristics: string[];
  }>;
  userAcquisitionStrategy?: string;
  userRetentionStrategy?: string;
}

export interface TargetUsersResponse extends TargetUsersData {
  status: 'pending' | 'completed' | 'failed';
}

// Competition Types
export interface CompetitionData extends BaseSectionResponse {
  directCompetitors?: Array<{
    name: string;
    description: string;
    strengths: string[];
    weaknesses: string[];
    marketShare?: string;
    features?: Record<string, {
      supported: boolean;
      notes?: string;
    }>;
    pricing?: {
      model: string;
      startingPrice?: string;
      enterprise?: string;
    };
    marketPosition?: {
      pricingTier: 'premium' | 'mid-market' | 'economy';
      featureTier: 'basic' | 'advanced' | 'enterprise';
      targetSegment: string[];
    };
  }>;
  indirectCompetitors?: Array<{
    name: string;
    description: string;
    threatLevel: 'High' | 'Medium' | 'Low';
    overlapAreas?: string[];
  }>;
  competitiveAdvantages?: string[];
  marketGaps?: string[];
  featureComparison?: {
    features: string[];
    comparisonMatrix: Record<string, Record<string, boolean | string>>;
  };
  marketPositioning?: {
    axisX: {
      label: string;
      min: string;
      max: string;
    };
    axisY: {
      label: string;
      min: string;
      max: string;
    };
    positions: Array<{
      competitor: string;
      x: number;
      y: number;
    }>;
  };
}

export interface CompetitionResponse extends CompetitionData {
  status: 'pending' | 'completed' | 'failed';
}

// Unit Economics Types
export interface UnitEconomicsData extends BaseSectionResponse {
  pricing?: {
    model: string;
    strategy: string;
    tiers: Array<{
      name: string;
      price: string;
      features: string[];
    }>;
  };
  costs?: {
    fixed: Array<{
      name: string;
      amount: string;
      frequency: string;
    }>;
    variable: Array<{
      name: string;
      amount: string;
      unit: string;
    }>;
  };
  metrics?: {
    cac: string;
    ltv: string;
    margin: string;
    paybackPeriod: string;
    breakEvenPoint: string;
  };
  projections?: Array<{
    period: string;
    revenue: string;
    costs: string;
    profit: string;
  }>;
}

export interface UnitEconomicsResponse extends UnitEconomicsData {
  status: 'pending' | 'completed' | 'failed';
}

// Marketing Channels Types
export interface MarketingChannelsData extends BaseSectionResponse {
  channels?: Array<{
    name: string;
    description: string;
    type: 'primary' | 'secondary' | 'experimental';
    metrics: {
      reach: string;
      cost: string;
      roi: string;
      conversionRate: string;
    };
    strategy: string;
    timeline: string;
    budget: string;
    kpis: string[];
  }>;
  budget?: {
    total: string;
    breakdown: Array<{
      category: string;
      amount: string;
      percentage: string;
    }>;
    timeline: string;
  };
  recommendations?: string[];
  analysis?: string;
}

export interface MarketingChannelsResponse extends MarketingChannelsData {
  status: 'pending' | 'completed' | 'failed';
}

// Go-to-Market Plan Types
export interface GoToMarketPlanData extends BaseSectionResponse {
  launchStrategy?: {
    phases: Array<{
      phase: string;
      timeline: string;
      activities: string[];
      metrics: string[];
    }>;
  };
  keyPartnerships?: Array<{
    partner: string;
    type: string;
    value: string;
  }>;
  resourceRequirements?: {
    team: string[];
    budget: string;
    technology: string[];
  };
}

export interface GoToMarketPlanResponse extends GoToMarketPlanData {
  status: 'pending' | 'completed' | 'failed';
}

// Critical Thought Questions Types
export interface CriticalThoughtQuestionsData extends BaseSectionResponse {
  questions?: Array<{
    category: string;
    questions: Array<{
      question: string;
      importance: 'high' | 'medium' | 'low';
      context?: string;
    }>;
  }>;
}

export interface CriticalThoughtQuestionsResponse extends CriticalThoughtQuestionsData {
  status: 'pending' | 'completed' | 'failed';
}

// VC Sentiment Types
export interface VCSentimentData extends BaseSectionResponse {
  sentiment?: {
    overall: 'positive' | 'neutral' | 'negative';
    confidence: number;
    keyFactors: string[];
  };
  marketTrends?: Array<{
    trend: string;
    impact: string;
    confidence: number;
  }>;
  notableTransactions?: Array<{
    company: string;
    amount: string;
    date: string;
    investors: string[];
    purpose?: string;
    valuation?: string;
  }>;
  recommendations?: Array<{
    category: string;
    items: string[];
    priority: 'high' | 'medium' | 'low';
  }>;
}

export interface VCSentimentResponse extends VCSentimentData {
  status: 'pending' | 'completed' | 'failed';
} 