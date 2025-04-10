import { z } from 'zod';

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
  data?: any;
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
  channelStrategies: z.array(z.object({
      channel: z.string().min(1, "Channel name is required"),
      strategy: z.string().min(1, "Strategy description is required"),
      estimatedCAC: z.string().describe("Estimated Customer Acquisition Cost (e.g., '$50', 'Low')"),
  })).min(1, "At least one channel strategy is required"),
  industryConversionBenchmarks: z.string().describe("Relevant industry conversion rate benchmarks (e.g., '2-5% for SaaS landing pages')"),
  phasedRolloutPlan: z.array(z.object({
      phase: z.string().min(1, "Rollout phase name is required"),
      timeline: z.string().min(1, "Timeline is required"),
      userTarget: z.string().optional().describe("Target number of users for this phase"),
      revenueTarget: z.string().optional().describe("Target revenue for this phase"),
      keyActivities: z.array(z.string().min(1, "Activity cannot be empty")).min(1, "At least one activity required per phase"),
  })).min(1, "At least one rollout phase is required"),
}).strict();

export type GoToMarketPlan = BaseSectionResponse & z.infer<typeof GoToMarketPlanSchema>;

// Actionable Item Schema (for reuse in recommendations/next steps)
export const ActionableItemSchema = z.object({
  step: z.string().min(1, "Step description cannot be empty"),
  resourcesNeeded: z.array(z.string()).describe("List of resources (e.g., team members, budget, tools)"),
  decisionCriteria: z.string().describe("Criteria for deciding to proceed, pivot, or stop based on this step's outcome"),
  timeline: z.string().optional().describe("Estimated timeline for this step"),
  priority: z.enum(['high', 'medium', 'low']).optional(),
});

// Also export the inferred type
export type ActionableItem = z.infer<typeof ActionableItemSchema>;

// Validation Roadmap Section
export const ValidationRoadmapSchema = BaseSectionSchema.extend({
  coreHypotheses: z.array(z.object({
    hypothesis: z.string().min(1, "Hypothesis cannot be empty"),
    priority: z.enum(['high', 'medium', 'low']),
  })).min(1, "At least one core hypothesis is required"),
  hypothesisExperiments: z.array(z.object({
    hypothesis: z.string().min(1, "Associated hypothesis cannot be empty"),
    experiment: z.string().min(1, "Experiment description cannot be empty"),
    successMetric: z.string().min(1, "Success metric cannot be empty"),
  })).min(1, "At least one experiment is required"),
  validationTimeline: z.object({
    days30: z.array(z.string().min(1, "Timeline goal cannot be empty")).describe("Goals for the first 30 days"),
    days60: z.array(z.string().min(1, "Timeline goal cannot be empty")).describe("Goals for the next 30 days (31-60)"),
    days90: z.array(z.string().min(1, "Timeline goal cannot be empty")).describe("Goals for the following 30 days (61-90)"),
  }),
}).strict();

export type ValidationRoadmap = BaseSectionResponse & z.infer<typeof ValidationRoadmapSchema>;

// Key Performance Indicators Section
export const KeyPerformanceIndicatorsSchema = BaseSectionSchema.extend({
  criticalMetrics: z.array(z.object({
    metric: z.string().min(1, "Metric name cannot be empty"),
    description: z.string().min(1, "Metric description cannot be empty"),
    targetValue: z.string().describe("Target value or range"),
    timeframe: z.string().describe("Timeframe to achieve the target"),
  })).min(1, "At least one critical metric is required"),
  measurementMethods: z.array(z.object({
    metric: z.string().min(1, "Associated metric cannot be empty"),
    tools: z.array(z.string()).describe("Specific tools for measurement"),
    method: z.string().min(1, "Measurement method description cannot be empty"),
  })).min(1, "At least one measurement method is required"),
}).strict();

export type KeyPerformanceIndicators = BaseSectionResponse & z.infer<typeof KeyPerformanceIndicatorsSchema>;

// Experiment Design Section
export const ExperimentDesignSchema = BaseSectionSchema.extend({
  mvpPrototypes: z.array(z.object({
    type: z.string().min(1, "MVP/Prototype type cannot be empty"),
    description: z.string().min(1, "Description cannot be empty"),
    assumptionsTested: z.array(z.string().min(1, "Assumption cannot be empty")).min(1, "Must test at least one assumption"),
  })).min(1, "At least one MVP/Prototype is required"),
  customerInterviewFramework: z.object({
    purpose: z.string().min(1, "Purpose of interviews cannot be empty"),
    keyQuestions: z.array(z.string().min(1, "Question cannot be empty")).min(1, "At least one key question is required"),
  }),
  abTestingRecommendations: z.array(z.object({
    featureOrMessage: z.string().min(1, "Feature/Message cannot be empty"),
    variants: z.array(z.string().min(1, "Variant cannot be empty")).min(2, "At least two variants needed for A/B test"),
    successMetric: z.string().min(1, "Success metric cannot be empty"),
  })),
}).strict();

export type ExperimentDesign = BaseSectionResponse & z.infer<typeof ExperimentDesignSchema>;

// Critical Thought Questions Section
export const CriticalThoughtQuestionsSchema = BaseSectionSchema.extend({
  questions: z.array(z.object({
    category: z.string(),
    question: z.string(),
    analysis: z.string().describe("Detailed analysis of the question"),
    priority: z.enum(['high', 'medium', 'low']),
    implications: z.array(z.string()),
    recommendations: z.array(ActionableItemSchema),
  })).min(1, "At least one critical question area required"),
  riskAssessment: z.object({
      highPriority: z.array(z.string()),
      mediumPriority: z.array(z.string()),
      lowPriority: z.array(z.string()),
  }),
}).strict();

export type CriticalThoughtQuestions = BaseSectionResponse & z.infer<typeof CriticalThoughtQuestionsSchema>;

// VC Sentiment Section
export const VCSentimentSchema = z.object({
  overview: z.object({
    score: z.number().min(0).max(100),
    confidence: z.number().min(0).max(100),
    summary: z.string(),
    verdict: z.string()
  }),
  investmentAttractiveness: z.object({
    score: z.number().min(0).max(100),
    confidence: z.number().min(0).max(100),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    opportunities: z.array(z.string()),
    threats: z.array(z.string())
  }),
  marketActivity: z.object({
    investmentVolume: z.object({
      total: z.string(),
      timeframe: z.string(),
      trend: z.string(),
      growth: z.string(),
      analysis: z.string()
    }),
    notableTransactions: z.array(z.object({
      date: z.string(),
      company: z.string(),
      round: z.string(),
      amount: z.string(),
      valuation: z.string().optional(),
      investors: z.array(z.string())
    })),
    comparableExits: z.array(z.object({
      company: z.string(),
      type: z.string(),
      value: z.string(),
      date: z.string(),
      details: z.string()
    }))
  }),
  marketTrends: z.object({
    overview: z.string(),
    trends: z.array(z.object({
      name: z.string(),
      impact: z.string(),
      timeline: z.string()
    })),
    investorSentiment: z.object({
      overall: z.string(),
      keyFactors: z.array(z.string()),
      concerns: z.array(z.string()),
      outlook: z.string()
    })
  }),
  fundingStrategy: z.object({
    recommendedRound: z.object({
      type: z.string(),
      targetAmount: z.string(),
      timing: z.string(),
      valuation: z.object({
        range: z.string(),
        basis: z.array(z.string())
      })
    }),
    useOfFunds: z.array(z.object({
      category: z.string(),
      allocation: z.string(),
      details: z.string()
    })),
    targetInvestors: z.array(z.object({
      type: z.string(),
      focus: z.array(z.string()),
      examples: z.array(z.string())
    })),
    milestones: z.array(z.object({
      milestone: z.string(),
      timeline: z.string(),
      impact: z.string()
    }))
  })
});

export type VCSentiment = BaseSectionResponse & z.infer<typeof VCSentimentSchema>;

// Report Summary Section
export const ReportSummarySchema = BaseSectionSchema.extend({
  summary: z.string().min(1, "Summary is required"),
  keyFindings: z.array(z.string().min(1, "Finding cannot be empty")).min(1, "At least one key finding is required"),
  overallRecommendation: z.enum(['Proceed', 'Pivot', 'Halt']).describe("Overall recommendation based on the analysis"),
  recommendations: z.array(z.object({
      category: z.string(),
      items: z.array(ActionableItemSchema),
      priority: z.enum(['high', 'medium', 'low']),
  })).min(1, "At least one recommendation category is required"),
  nextSteps: z.array(ActionableItemSchema).min(1, "At least one next step is required"),
}).strict();

export type ReportSummary = BaseSectionResponse & z.infer<typeof ReportSummarySchema>;

// Base schema for common section properties
const SectionBaseSchema = z.object({
  sectionId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  status: z.enum(['pending', 'completed', 'failed']),
  error: z.string().optional(),
});

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
  userId: z.string(),
  analysisId: z.string().uuid(),
  status: z.enum(['pending', 'processing', 'completed', 'failed']),
  createdAt: z.date(),
  updatedAt: z.date(),
  formData: z.any().optional(),
  sections: z.object({
    executiveSummary: z.optional(z.union([ExecutiveSummarySchema, BaseSectionSchema])),
    marketSizeGrowth: z.optional(z.union([MarketSizeGrowthSchema, BaseSectionSchema])),
    targetUsers: z.optional(z.union([TargetUsersSchema, BaseSectionSchema])),
    competition: z.optional(z.union([CompetitionSchema, BaseSectionSchema])),
    unitEconomics: z.optional(z.union([UnitEconomicsSchema, BaseSectionSchema])),
    marketingChannels: z.optional(z.union([MarketingChannelsSchema, BaseSectionSchema])),
    goToMarketPlan: z.optional(z.union([GoToMarketPlanSchema, BaseSectionSchema])),
    vcSentiment: z.optional(z.union([VCSentimentSchema, BaseSectionSchema])),
    criticalThoughtQuestions: z.optional(z.union([CriticalThoughtQuestionsSchema, BaseSectionSchema])),
    reportSummary: z.optional(z.union([ReportSummarySchema, BaseSectionSchema])),
    validationRoadmap: z.optional(z.union([ValidationRoadmapSchema, BaseSectionSchema])),
    keyPerformanceIndicators: z.optional(z.union([KeyPerformanceIndicatorsSchema, BaseSectionSchema])),
    experimentDesign: z.optional(z.union([ExperimentDesignSchema, BaseSectionSchema])),
  }),
  error: z.string().optional(),
});

export type AnalysisDocument = z.infer<typeof AnalysisDocumentSchema>;

// Type for the status of a specific section
export type SectionStatus = z.infer<typeof SectionBaseSchema.shape.status>;

// Type for the status of the entire analysis document
export type AnalysisStatus = z.infer<typeof AnalysisDocumentSchema.shape.status>;

// Type mapping section keys to their schemas
// ... existing code ...

export interface AIModel {
  id: string;
  name: string;
  description: string;
  provider: string;
  capabilities: string[];
}

export const models: AIModel[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Most capable GPT model for complex tasks',
    provider: 'openai',
    capabilities: ['text', 'analysis', 'reasoning']
  },
  {
    id: 'claude-3',
    name: 'Claude 3',
    description: 'Advanced model for detailed analysis',
    provider: 'anthropic',
    capabilities: ['text', 'analysis', 'reasoning']
  },
  {
    id: 'pplx-online',
    name: 'Perplexity Online',
    description: 'Real-time information and market research',
    provider: 'perplexity',
    capabilities: ['search', 'market-research', 'current-events']
  }
] 