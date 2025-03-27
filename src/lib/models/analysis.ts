import { ObjectId } from 'mongodb';

export interface BaseSectionResponse {
  status: 'completed' | 'failed' | 'pending';
  error?: string;
}

export interface MarketSize {
  total: string;
  addressable: string;
  obtainable: string;
  growth: string;
}

export interface SegmentDetail {
  name: string;
  characteristics: string[];
  preferences: string[];
  painPoints: string[];
  acquisitionChannels: string[];
}

export interface VCInvestment {
  activeVCs: number;
  totalInvestment: string;
  averageDealSize: string;
  notableDeals: Array<{
    investor: string;
    company: string;
    amount: string;
    date: string;
  }>;
}

export interface Trend {
  name: string;
  description: string;
  impact: string;
  timeframe: string;
  source: string;
  opportunities: string[];
  threats: string[];
}

export interface Competitor {
  name: string;
  type: string;
  marketShare: string;
  strengths: string[];
  weaknesses: string[];
  strategy: string;
  pricing: string;
  differentiators: string[];
}

export interface Regulation {
  type: string;
  description: string;
  impact: string;
  compliance: string;
  timeline: string;
  cost: string;
  jurisdiction: string;
}

export interface MarketDynamics {
  entryBarriers: {
    barrier: string;
    impact: string;
    mitigation: string;
  }[];
  supplierPower: string;
  buyerPower: string;
  substitutes: string[];
  industryRivalry: string;
}

export interface ExecutiveSummary extends BaseSectionResponse {
  overview: string;
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  keyMetrics: {
    marketSize: string;
    growthRate: string;
    competitionLevel: string;
  };
  recommendations: Array<{
    title: string;
    description: string;
  }>;
}

export interface DetailedAnalysis {
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
    marketRisks: {
      risk: string;
      likelihood: string;
      impact: string;
      mitigation: string;
    }[];
    operationalRisks: {
      risk: string;
      likelihood: string;
      impact: string;
      mitigation: string;
    }[];
    financialRisks: {
      risk: string;
      likelihood: string;
      impact: string;
      mitigation: string;
    }[];
    riskScore: number;
  };
  implementationPlan: {
    phases: {
      name: string;
      duration: string;
      objectives: string[];
      resources: string[];
      milestones: string[];
    }[];
    criticalPath: string[];
    keyMetrics: string[];
    feasibilityScore: number;
  };
}

export interface RiskAssessment extends BaseSectionResponse {
  riskScore: number;
  marketRisks: Array<{
    name: string;
    description: string;
    likelihood: string;
    impact: string;
    mitigationStrategies: string[];
  }>;
  operationalRisks: Array<{
    name: string;
    description: string;
    likelihood: string;
    impact: string;
    mitigationStrategies: string[];
  }>;
  financialRisks: Array<{
    name: string;
    description: string;
    likelihood: string;
    impact: string;
    mitigationStrategies: string[];
  }>;
}

export interface VCActivity extends BaseSectionResponse {
  marketOverview: {
    activeVCs: number;
    totalInvestment: string;
    averageDealSize: string;
  };
  recentDeals: Array<{
    company: string;
    date: string;
    round: string;
    amount: string;
    leadInvestors: string[];
  }>;
  investmentTrends: Array<{
    name: string;
    description: string;
    keyPoints: string[];
  }>;
}

export interface FinancialProjections extends BaseSectionResponse {
  revenueStreams: Array<{
    name: string;
    description: string;
    year1: string;
    year3: string;
  }>;
  costStructure: Array<{
    name: string;
    description: string;
    year1: string;
    year3: string;
  }>;
  keyMetrics: {
    breakevenPoint: string;
    grossMargin: string;
    netMargin: string;
  };
  unitEconomics: Array<{
    name: string;
    description: string;
    current: string;
    target: string;
  }>;
}

export interface MarketResearch extends BaseSectionResponse {
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

export interface Analysis {
  _id?: string | ObjectId;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  marketResearch?: MarketResearch;
  riskAssessment?: RiskAssessment;
  vcActivity?: VCActivity;
  financialProjections?: FinancialProjections;
  analysis: {
    executiveSummary: ExecutiveSummary;
    detailedAnalysis: DetailedAnalysis;
  };
  formData: {
    description: string;
    industry: string;
    subIndustry: string;
    targetCustomers: string;
    pricingModel: string;
    currentStage: string;
    teamComposition: string;
    additionalInfo?: string;
  };
}

export interface AnalysisInput {
  userId: string;
  description: string;
  industry: string;
  subIndustry: string;
  targetCustomers: string;
  pricingModel: string;
  currentStage: string;
  teamComposition: string;
  additionalInfo?: string;
} 