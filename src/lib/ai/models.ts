import { z } from 'zod';
import { ObjectId } from 'mongodb';

// Base schema that all sections must implement
export const BaseSectionSchema = z.object({
  status: z.enum(['completed', 'failed']),
  error: z.string().optional(),
  sectionId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Base interface for all section responses
export interface BaseSectionResponse {
  sectionId: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'pending' | 'completed' | 'failed';
  error?: string;
}

// Executive Summary Section
export const ExecutiveSummarySchema = z.object({
  summary: z.string(),
  keyHighlights: z.array(z.string()),
  recommendation: z.string(),
  score: z.number().min(0).max(100),
});

export type ExecutiveSummary = BaseSectionResponse & z.infer<typeof ExecutiveSummarySchema>;

// Market Size & Growth Section
export const MarketSizeGrowthSchema = BaseSectionSchema.extend({
  totalAddressableMarket: z.object({
    size: z.string().min(1, "Market size is required"),
    description: z.string().min(1, "Description is required"),
    methodology: z.string().min(1, "Methodology is required"),
  }),
  serviceableAddressableMarket: z.object({
    size: z.string().min(1, "Market size is required"),
    description: z.string().min(1, "Description is required"),
    limitations: z.array(z.string().min(1, "Limitation cannot be empty")).min(1, "At least one limitation is required"),
  }),
  serviceableObtainableMarket: z.object({
    size: z.string().min(1, "Market size is required"),
    description: z.string().min(1, "Description is required"),
    timeframe: z.string().min(1, "Timeframe is required"),
    assumptions: z.array(z.string().min(1, "Assumption cannot be empty")).min(1, "At least one assumption is required"),
  }),
  growthRate: z.object({
    current: z.string().min(1, "Current growth rate is required"),
    projected: z.string().min(1, "Projected growth rate is required"),
    factors: z.array(z.string().min(1, "Factor cannot be empty")).min(1, "At least one growth factor is required"),
  }),
  marketTrends: z.array(z.object({
    trend: z.string().min(1, "Trend name is required"),
    description: z.string().min(1, "Trend description is required"),
    impact: z.string().min(1, "Impact description is required"),
    timeframe: z.string().min(1, "Timeframe is required"),
  })).min(1, "At least one market trend is required"),
  marketDrivers: z.array(z.object({
    driver: z.string().min(1, "Driver name is required"),
    description: z.string().min(1, "Driver description is required"),
    impact: z.string().min(1, "Impact description is required"),
  })).min(1, "At least one market driver is required"),
  marketChallenges: z.array(z.object({
    challenge: z.string().min(1, "Challenge name is required"),
    description: z.string().min(1, "Challenge description is required"),
    impact: z.string().min(1, "Impact description is required"),
    mitigation: z.string().min(1, "Mitigation strategy is required"),
  })).min(1, "At least one market challenge is required"),
}).strict();

export type MarketSizeGrowth = BaseSectionResponse & z.infer<typeof MarketSizeGrowthSchema>;

// Target Users Section
export const TargetUsersSchema = z.object({
  primaryUserPersonas: z.array(z.object({
    name: z.string().min(1, "Persona name is required").max(100, "Persona name too long"),
    description: z.string().min(10, "Persona description must be detailed").max(500, "Description too long"),
    painPoints: z.array(z.string().min(1, "Pain point cannot be empty")).min(1, "At least one pain point is required"),
    needs: z.array(z.string().min(1, "Need cannot be empty")).min(1, "At least one need is required"),
    behaviors: z.array(z.string().min(1, "Behavior cannot be empty")).min(1, "At least one behavior is required"),
  })).min(1, "At least one user persona is required"),
  userSegments: z.array(z.object({
    segment: z.string().min(1, "Segment name is required").max(100, "Segment name too long"),
    size: z.string().min(1, "Segment size is required").max(100, "Size description too long"),
    characteristics: z.array(z.string().min(1, "Characteristic cannot be empty")).min(1, "At least one characteristic is required"),
  })).min(1, "At least one user segment is required"),
  userAcquisitionStrategy: z.string().min(10, "Acquisition strategy must be detailed").max(1000, "Strategy too long"),
  userRetentionStrategy: z.string().min(10, "Retention strategy must be detailed").max(1000, "Strategy too long"),
}).strict();

export type TargetUsers = BaseSectionResponse & z.infer<typeof TargetUsersSchema>;

// Competition Section
export const CompetitionSchema = BaseSectionSchema.extend({
  directCompetitors: z.array(z.object({
    name: z.string().min(1, "Competitor name is required"),
    description: z.string().min(1, "Competitor description is required"),
    strengths: z.array(z.string().min(1, "Strength cannot be empty")),
    weaknesses: z.array(z.string().min(1, "Weakness cannot be empty")),
    marketShare: z.string().min(1, "Market share is required"),
  })).min(1, "At least one direct competitor is required"),
  indirectCompetitors: z.array(z.object({
    name: z.string().min(1, "Competitor name is required"),
    description: z.string().min(1, "Competitor description is required"),
    threatLevel: z.enum(["High", "Medium", "Low"], {
      errorMap: () => ({ message: "Threat level must be High, Medium, or Low" })
    }),
  })).min(1, "At least one indirect competitor is required"),
  competitiveAdvantages: z.array(z.string().min(1, "Competitive advantage cannot be empty")).min(1, "At least one competitive advantage is required"),
  marketGaps: z.array(z.string().min(1, "Market gap cannot be empty")).min(1, "At least one market gap is required"),
}).strict();

export type Competition = BaseSectionResponse & z.infer<typeof CompetitionSchema>;

// Unit Economics Section
export const UnitEconomicsSchema = z.object({
  pricing: z.object({
    model: z.string(),
    strategy: z.string(),
    tiers: z.array(z.object({
      name: z.string(),
      price: z.string(),
      features: z.array(z.string())
    }))
  }),
  costs: z.object({
    fixed: z.array(z.object({
      name: z.string(),
      amount: z.string(),
      frequency: z.string()
    })),
    variable: z.array(z.object({
      name: z.string(),
      amount: z.string(),
      unit: z.string()
    }))
  }),
  metrics: z.object({
    cac: z.string(),
    ltv: z.string(),
    margin: z.string(),
    paybackPeriod: z.string(),
    breakEvenPoint: z.string()
  }),
  projections: z.array(z.object({
    period: z.string(),
    revenue: z.string(),
    costs: z.string(),
    profit: z.string()
  })),
  analysis: z.string()
});

export type UnitEconomics = BaseSectionResponse & z.infer<typeof UnitEconomicsSchema>;

// Marketing Channels Section
export const MarketingChannelsSchema = z.object({
  channels: z.array(z.object({
    name: z.string().min(1, "Channel name is required"),
    description: z.string().min(1, "Channel description is required"),
    type: z.enum(['primary', 'secondary', 'experimental']),
    metrics: z.object({
      reach: z.string().min(1, "Reach metric is required"),
      cost: z.string().min(1, "Cost metric is required"),
      roi: z.string().min(1, "ROI metric is required"),
      conversionRate: z.string().min(1, "Conversion rate is required")
    }),
    strategy: z.string().min(1, "Strategy is required"),
    timeline: z.string().min(1, "Timeline is required"),
    budget: z.string().min(1, "Budget is required"),
    kpis: z.array(z.string().min(1, "KPI cannot be empty")).min(1, "At least one KPI is required")
  })).min(1, "At least one channel is required"),
  budget: z.object({
    total: z.string().min(1, "Total budget is required"),
    breakdown: z.array(z.object({
      category: z.string().min(1, "Budget category is required"),
      amount: z.string().min(1, "Amount is required"),
      percentage: z.string().min(1, "Percentage is required").regex(/^\d+%$/, "Percentage must be in format '50%'")
    })).min(1, "At least one budget breakdown item is required"),
    timeline: z.string().min(1, "Budget timeline is required")
  }),
  recommendations: z.array(z.string().min(1, "Recommendation cannot be empty")).min(1, "At least one recommendation is required"),
  analysis: z.string().min(1, "Analysis is required")
}).strict();

export type MarketingChannels = BaseSectionResponse & z.infer<typeof MarketingChannelsSchema>;

// Go-to-Market Plan Section
export const GoToMarketPlanSchema = BaseSectionSchema.extend({
  launchStrategy: z.object({
    phases: z.array(z.object({
      phase: z.string().min(1, "Phase name is required"),
      timeline: z.string().min(1, "Timeline is required"),
      activities: z.array(z.string().min(1, "Activity cannot be empty")).min(1, "At least one activity is required"),
      metrics: z.array(z.string().min(1, "Metric cannot be empty")).min(1, "At least one metric is required"),
    })).min(1, "At least one phase is required"),
  }),
  keyPartnerships: z.array(z.object({
    partner: z.string().min(1, "Partner name is required"),
    type: z.string().min(1, "Partnership type is required"),
    value: z.string().min(1, "Value proposition is required"),
  })).min(1, "At least one partnership is required"),
  resourceRequirements: z.object({
    team: z.array(z.string().min(1, "Team role cannot be empty")).min(1, "At least one team role is required"),
    budget: z.string().min(1, "Budget is required"),
    technology: z.array(z.string().min(1, "Technology requirement cannot be empty")).min(1, "At least one technology requirement is required"),
  }),
}).strict();

export type GoToMarketPlan = BaseSectionResponse & z.infer<typeof GoToMarketPlanSchema>;

// Critical Thought Questions Section
export const CriticalThoughtQuestionsSchema = z.object({
  questions: z.array(z.object({
    category: z.string(),
    questions: z.array(z.object({
      question: z.string(),
      importance: z.enum(['high', 'medium', 'low']),
      context: z.string().optional(),
    })),
  })),
});

export type CriticalThoughtQuestions = BaseSectionResponse & z.infer<typeof CriticalThoughtQuestionsSchema>;

// VC Sentiment Section
export const VCSentimentSchema = z.object({
  marketSentiment: z.object({
    overall: z.string().min(1, "Overall sentiment is required"),
    confidence: z.enum(['High', 'Medium', 'Low']),
    keyFactors: z.array(z.string().min(1, "Factor cannot be empty")).min(1, "At least one key factor is required"),
    risks: z.array(z.string().min(1, "Risk cannot be empty")).min(1, "At least one risk is required")
  }),
  recentInvestments: z.array(z.object({
    company: z.string().min(1, "Company name is required"),
    amount: z.string().min(1, "Investment amount is required"),
    date: z.string().min(1, "Investment date is required"),
    investors: z.array(z.string().min(1, "Investor name cannot be empty")).min(1, "At least one investor is required"),
    purpose: z.string().min(1, "Investment purpose is required"),
    valuation: z.string().min(1, "Company valuation is required")
  })).min(1, "At least one recent investment is required"),
  investmentTrends: z.array(z.object({
    trend: z.string().min(1, "Trend name is required"),
    description: z.string().min(1, "Trend description is required"),
    impact: z.string().min(1, "Impact description is required"),
    examples: z.array(z.string().min(1, "Example cannot be empty")).min(1, "At least one example is required")
  })).min(1, "At least one investment trend is required"),
  valuationMetrics: z.array(z.object({
    metric: z.string().min(1, "Metric name is required"),
    value: z.string().min(1, "Current value is required"),
    benchmark: z.string().min(1, "Industry benchmark is required"),
    methodology: z.string().min(1, "Calculation methodology is required")
  })).min(1, "At least one valuation metric is required"),
  marketOpportunities: z.array(z.object({
    opportunity: z.string().min(1, "Opportunity name is required"),
    description: z.string().min(1, "Opportunity description is required"),
    potential: z.enum(['High', 'Medium', 'Low']),
    timeline: z.string().min(1, "Expected timeline is required")
  })).min(1, "At least one market opportunity is required"),
  notableTransactions: z.array(z.object({
    company: z.string().min(1, "Company name is required"),
    amount: z.string().min(1, "Investment amount is required"),
    date: z.string().min(1, "Investment date is required"),
    investors: z.array(z.string().min(1, "Investor name cannot be empty")).min(1, "At least one investor is required"),
    purpose: z.string().optional(),
    valuation: z.string().optional()
  })).min(1, "At least one notable transaction is required")
}).strict();

export type VCSentiment = BaseSectionResponse & z.infer<typeof VCSentimentSchema>;

// Report Summary Section
export const ReportSummarySchema = z.object({
  overallAssessment: z.string(),
  keyRecommendations: z.array(z.string()),
  nextSteps: z.array(z.string()),
  riskLevel: z.enum(['High', 'Medium', 'Low']),
  confidenceScore: z.number().min(0).max(100),
});

export type ReportSummary = BaseSectionResponse & z.infer<typeof ReportSummarySchema>;

// User Input Schema
export const UserInputSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  description: z.string().min(1, "Description is required"),
  industry: z.string().min(1, "Industry is required"),
  subIndustry: z.string().min(1, "Sub-industry is required"),
  targetCustomers: z.string().min(1, "Target customers is required"),
  pricingModel: z.string().min(1, "Pricing model is required"),
  currentStage: z.string().min(1, "Current stage is required"),
  teamComposition: z.string().min(1, "Team composition is required"),
  additionalInfo: z.string().optional(),
});

export type UserInput = z.infer<typeof UserInputSchema>;

// Analysis Document Schema
export const AnalysisDocumentSchema = z.object({
  _id: z.instanceof(ObjectId).optional(),
  userId: z.string(),
  userInput: UserInputSchema,
  sections: z.object({
    executiveSummary: z.object({
      ...ExecutiveSummarySchema.shape,
      sectionId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      status: z.enum(['pending', 'completed', 'failed']),
      error: z.string().optional(),
    }).optional(),
    marketSizeGrowth: z.object({
      ...MarketSizeGrowthSchema.shape,
      sectionId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      status: z.enum(['pending', 'completed', 'failed']),
      error: z.string().optional(),
    }).optional(),
    targetUsers: z.object({
      ...TargetUsersSchema.shape,
      sectionId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      status: z.enum(['pending', 'completed', 'failed']),
      error: z.string().optional(),
    }).optional(),
    competition: z.object({
      ...CompetitionSchema.shape,
      sectionId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      status: z.enum(['pending', 'completed', 'failed']),
      error: z.string().optional(),
    }).optional(),
    unitEconomics: z.object({
      ...UnitEconomicsSchema.shape,
      sectionId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      status: z.enum(['pending', 'completed', 'failed']),
      error: z.string().optional(),
    }).optional(),
    marketingChannels: z.object({
      ...MarketingChannelsSchema.shape,
      sectionId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      status: z.enum(['pending', 'completed', 'failed']),
      error: z.string().optional(),
    }).optional(),
    goToMarketPlan: z.object({
      ...GoToMarketPlanSchema.shape,
      sectionId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      status: z.enum(['pending', 'completed', 'failed']),
      error: z.string().optional(),
    }).optional(),
    criticalThoughtQuestions: z.object({
      ...CriticalThoughtQuestionsSchema.shape,
      sectionId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      status: z.enum(['pending', 'completed', 'failed']),
      error: z.string().optional(),
    }).optional(),
    vcSentiment: z.object({
      ...VCSentimentSchema.shape,
      sectionId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      status: z.enum(['pending', 'completed', 'failed']),
      error: z.string().optional(),
    }).optional(),
    reportSummary: z.object({
      ...ReportSummarySchema.shape,
      sectionId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
      status: z.enum(['pending', 'completed', 'failed']),
      error: z.string().optional(),
    }).optional(),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
  status: z.enum(['pending', 'in_progress', 'completed', 'failed']),
});

export type AnalysisDocument = z.infer<typeof AnalysisDocumentSchema>; 